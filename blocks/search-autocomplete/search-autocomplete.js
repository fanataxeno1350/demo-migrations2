import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    closeButtonAriaLabelRow,
    searchFormActionRow,
    searchInputAriaLabelRow,
    searchInputPlaceholderRow,
    clearSearchAriaLabelRow,
    submitButtonLabelRow,
    trendingTitleRow,
    ...suggestionRows
  ] = children;

  // Fix: Read text content directly from the cell, not from querySelector('div')
  const closeButtonAriaLabel = closeButtonAriaLabelRow?.textContent.trim();
  const searchFormAction = searchFormActionRow?.textContent.trim();
  const searchInputAriaLabel = searchInputAriaLabelRow?.textContent.trim();
  const searchInputPlaceholder = searchInputPlaceholderRow?.textContent.trim();
  const clearSearchAriaLabel = clearSearchAriaLabelRow?.textContent.trim();
  const submitButtonLabel = submitButtonLabelRow?.textContent.trim();
  const trendingTitle = trendingTitleRow?.textContent.trim();

  const overlay = document.createElement('div');
  overlay.classList.add('search-autocomplete--overlay');
  moveInstrumentation(closeButtonAriaLabelRow, overlay); // Moved instrumentation for this row

  const closeButton = document.createElement('button');
  closeButton.classList.add('search-autocomplete--close');
  closeButton.setAttribute('aria-label', closeButtonAriaLabel || 'Close Search Overlay');
  closeButton.innerHTML = `
    <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L5.93934 7L0.469669 12.4697C0.176777 12.7626 0.176777 13.2374 0.469669 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L7 8.06066L12.4697 13.5303C12.7626 13.8232 13.2374 13.8232 13.5303 13.5303C13.8232 13.2374 13.8232 12.7626 13.5303 12.4697L8.06066 7L13.5303 1.53033C13.8232 1.23744 13.8232 0.762563 13.5303 0.46967C13.2374 0.176777 12.7626 0.176777 12.4697 0.46967L7 5.93934L1.53033 0.46967Z" fill="black"></path>
    </svg>
  `;
  moveInstrumentation(searchFormActionRow, closeButton); // Moved instrumentation for this row

  const searchBlock = document.createElement('div');
  searchBlock.classList.add('search-autocomplete--block');
  moveInstrumentation(searchInputAriaLabelRow, searchBlock); // Moved instrumentation for this row

  const container = document.createElement('div');
  container.classList.add('search-autocomplete--container');
  moveInstrumentation(searchInputPlaceholderRow, container); // Moved instrumentation for this row

  const formPlaceholder = document.createElement('div');
  formPlaceholder.classList.add('search-autocomplete--form-placeholder');
  moveInstrumentation(clearSearchAriaLabelRow, formPlaceholder); // Moved instrumentation for this row

  const viewsElementContainer = document.createElement('div');
  viewsElementContainer.classList.add('views-element-container');
  moveInstrumentation(submitButtonLabelRow, viewsElementContainer); // Moved instrumentation for this row

  const viewDomIdDiv = document.createElement('div');
  viewDomIdDiv.classList.add('js-view-dom-id-02a6bd3c6a34ede34d4bbac835b77210791b9c15810dfbf04030e6fb8396ccce');
  moveInstrumentation(trendingTitleRow, viewDomIdDiv); // Moved instrumentation for this row

  const form = document.createElement('form');
  form.classList.add('views-exposed-form');
  form.setAttribute('data-drupal-selector', 'views-exposed-form-solr-search-block-1');
  form.setAttribute('action', searchFormAction || '#');
  form.setAttribute('method', 'get');
  form.setAttribute('id', 'views-exposed-form-solr-search-block-1');
  form.setAttribute('accept-charset', 'UTF-8');

  const formItem = document.createElement('div');
  formItem.classList.add('js-form-item', 'form-item', 'js-form-type-search-api-autocomplete', 'form-item-search-term', 'js-form-item-search-term', 'form-no-label');

  const searchInput = document.createElement('input');
  searchInput.classList.add('form-autocomplete', 'form-text', 'ui-autocomplete-input');
  searchInput.setAttribute('data-drupal-selector', 'edit-search-term');
  searchInput.setAttribute('data-search-api-autocomplete-search', 'solr_search');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('id', 'edit-search-term');
  searchInput.setAttribute('name', 'search_term');
  searchInput.setAttribute('value', '');
  searchInput.setAttribute('size', '30');
  searchInput.setAttribute('maxlength', '128');
  searchInput.setAttribute('data-once', 'autocomplete search-api-autocomplete');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.setAttribute('aria-label', searchInputAriaLabel || 'Search');
  searchInput.setAttribute('placeholder', searchInputPlaceholder || 'Search');

  const clearSearchButton = document.createElement('button');
  clearSearchButton.classList.add('refresh-search-input-icon');
  clearSearchButton.setAttribute('type', 'button');
  clearSearchButton.setAttribute('aria-label', clearSearchAriaLabel || 'Clear Search');

  formItem.append(searchInput, clearSearchButton);

  const formActions = document.createElement('div');
  formActions.classList.add('form-actions', 'js-form-wrapper', 'form-wrapper');
  formActions.setAttribute('data-drupal-selector', 'edit-actions');
  formActions.setAttribute('id', 'edit-actions');

  const submitButton = document.createElement('input');
  submitButton.classList.add('button', 'js-form-submit', 'form-submit', 'is-disabled');
  submitButton.setAttribute('data-drupal-selector', 'edit-submit-solr-search');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('id', 'edit-submit-solr-search');
  submitButton.setAttribute('value', submitButtonLabel || 'Apply');
  submitButton.setAttribute('disabled', 'disabled');

  formActions.append(submitButton);
  form.append(formItem, formActions);
  viewDomIdDiv.append(form);
  viewsElementContainer.append(viewDomIdDiv);
  formPlaceholder.append(viewsElementContainer);
  container.append(formPlaceholder);

  const trendPlaceholder = document.createElement('div');
  trendPlaceholder.classList.add('search-autocomplete--trend-placeholder');

  const searchSuggestionSection = document.createElement('section');
  searchSuggestionSection.classList.add('grid-container', 'search-suggestion');
  searchSuggestionSection.setAttribute('aria-label', 'Search Suggestion Module');

  const paddingXWrapper = document.createElement('div');
  paddingXWrapper.classList.add('padding-x', 'search-suggestion--wrapper');

  const gridXContainer = document.createElement('div');
  gridXContainer.classList.add('grid-x', 'max-width-container');

  const suggestionCell = document.createElement('div');
  suggestionCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-10', 'search-suggestion--cell');

  const trendingTitleSpan = document.createElement('span');
  trendingTitleSpan.classList.add('search-suggestion--title', 'utilityTagHighCaps', 'suggestion-item');
  trendingTitleSpan.textContent = trendingTitle || 'Trending';

  const suggestionList = document.createElement('ul');
  suggestionList.classList.add('search-suggestion--list');

  suggestionRows.forEach((row) => {
    // Fix: Use array destructuring for fixed-schema item rows
    const [labelCell, linkCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('search-suggestion--list-item', 'suggestion-item');

    const suggestionBlock = document.createElement('div');
    suggestionBlock.classList.add('search-suggestion--block');

    const link = document.createElement('a');
    link.classList.add('search-suggestion--link');
    // Fix: Read href directly from the aem-content cell's anchor
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    } else {
      link.href = '#';
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('search-suggestion--label', 'bodyMediumRegular');
    // Fix: Read text content directly from the cell, not from querySelector('div')
    labelSpan.textContent = labelCell?.textContent.trim() || '';

    link.append(labelSpan);
    suggestionBlock.append(link);
    listItem.append(suggestionBlock);
    suggestionList.append(listItem);
    moveInstrumentation(row, listItem); // Moved instrumentation for each suggestion item row
  });

  suggestionCell.append(trendingTitleSpan, suggestionList);
  gridXContainer.append(suggestionCell);
  paddingXWrapper.append(gridXContainer);
  searchSuggestionSection.append(paddingXWrapper);
  trendPlaceholder.append(searchSuggestionSection);
  container.append(trendPlaceholder);
  searchBlock.append(container);

  block.replaceChildren(overlay, closeButton, searchBlock);

  block.setAttribute('aria-label', 'Search Autocomplete Module');
  block.setAttribute('id', 'search-autocomplete');

  // Add event listeners for interaction
  const openSearch = () => {
    block.classList.add('is-active');
    document.body.classList.add('no-scroll');
  };

  const closeSearch = () => {
    block.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  };

  // Assuming there's a trigger button somewhere else on the page to open this
  // For demonstration, let's add a dummy trigger. In a real scenario, this would
  // be handled by another component (e.g., a header search icon).
  // const dummyTrigger = document.createElement('button');
  // dummyTrigger.textContent = 'Open Search';
  // document.body.prepend(dummyTrigger);
  // dummyTrigger.addEventListener('click', openSearch);

  closeButton.addEventListener('click', closeSearch);
  overlay.addEventListener('click', closeSearch);

  // Example: Clear search input on button click
  clearSearchButton.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
  });

  // Example: Enable submit button if input has value
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim().length > 0) {
      submitButton.removeAttribute('disabled');
      submitButton.classList.remove('is-disabled');
    } else {
      submitButton.setAttribute('disabled', 'disabled');
      submitButton.classList.add('is-disabled');
    }
  });

  // Optimize images if any are present (though none in this specific block structure)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
