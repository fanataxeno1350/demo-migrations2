import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root-level rows based on BlockJson model
  const [
    formActionUrlRow,
    formInputNameRow,
    formInputAutocompletePathRow,
    submitButtonLabelRow,
    closeButtonAriaLabelRow,
    clearButtonAriaLabelRow,
    trendingTitleRow,
    suggestionsContainerRow, // Placeholder row for the container field
    ...suggestionRows // Actual item rows for 'suggestions'
  ] = [...block.children];

  const formActionUrl = formActionUrlRow?.textContent.trim();
  const formInputName = formInputNameRow?.textContent.trim();
  const formInputAutocompletePath = formInputAutocompletePathRow?.textContent.trim();
  const submitButtonLabel = submitButtonLabelRow?.textContent.trim();
  const closeButtonAriaLabel = closeButtonAriaLabelRow?.textContent.trim();
  const clearButtonAriaLabel = clearButtonAriaLabelRow?.textContent.trim();
  const trendingTitle = trendingTitleRow?.textContent.trim();

  const section = document.createElement('section');
  // section.classList.add('search-autocomplete'); // REMOVED: Outer block div already has this class
  section.id = 'search-autocomplete';
  section.setAttribute('aria-label', 'Search Autocomplete Module');

  const overlay = document.createElement('div');
  overlay.classList.add('search-autocomplete--overlay');
  section.append(overlay);

  const closeButton = document.createElement('button');
  closeButton.classList.add('search-autocomplete--close');
  closeButton.setAttribute('aria-label', closeButtonAriaLabel || 'Close Search Overlay');
  closeButton.innerHTML = `
    <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L5.93934 7L0.469669 12.4697C0.176777 12.7626 0.176777 13.2374 0.469669 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L7 8.06066L12.4697 13.5303C12.7626 13.8232 13.2374 13.8232 13.5303 13.5303C13.8232 13.2374 13.8232 12.7626 13.5303 12.4697L8.06066 7L13.5303 1.53033C13.8232 1.23744 13.8232 0.762563 13.5303 0.46967C13.2374 0.176777 12.7626 0.176777 12.4697 0.46967L7 5.93934L1.53033 0.46967Z" fill="black"></path>
    </svg>
  `;
  section.append(closeButton);

  const autocompleteBlock = document.createElement('div');
  autocompleteBlock.classList.add('search-autocomplete--block');
  section.append(autocompleteBlock);

  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.classList.add('search-autocomplete--container');
  autocompleteBlock.append(autocompleteContainer);

  const formPlaceholder = document.createElement('div');
  formPlaceholder.classList.add('search-autocomplete--form-placeholder');
  autocompleteContainer.append(formPlaceholder);

  const viewsElementContainer = document.createElement('div');
  viewsElementContainer.classList.add('views-element-container');
  formPlaceholder.append(viewsElementContainer);

  const viewDomIdDiv = document.createElement('div');
  viewDomIdDiv.classList.add('js-view-dom-id-d2e79c79bc4a8046caec9f1a9685532972d98b2544362bf3ee600f46aa687887');
  viewsElementContainer.append(viewDomIdDiv);

  const form = document.createElement('form');
  form.classList.add('views-exposed-form');
  form.setAttribute('data-drupal-selector', 'views-exposed-form-solr-search-block-1');
  form.action = formActionUrl || '#';
  form.method = 'get';
  form.id = 'views-exposed-form-solr-search-block-1';
  form.setAttribute('accept-charset', 'UTF-8');
  viewDomIdDiv.append(form);

  const formItem = document.createElement('div');
  formItem.classList.add('js-form-item', 'form-item', 'js-form-type-search-api-autocomplete', 'form-item-search-term', 'js-form-item-search-term', 'form-no-label');
  form.append(formItem);

  const input = document.createElement('input');
  input.setAttribute('data-drupal-selector', 'edit-search-term');
  input.setAttribute('data-search-api-autocomplete-search', 'solr_search');
  input.classList.add('form-autocomplete', 'form-text', 'ui-autocomplete-input');
  input.setAttribute('data-autocomplete-path', formInputAutocompletePath || '');
  input.type = 'text';
  input.id = 'edit-search-term';
  input.name = formInputName || 'search_term';
  input.value = '';
  input.size = '30';
  input.maxLength = '128';
  input.setAttribute('data-once', 'autocomplete search-api-autocomplete');
  input.autocomplete = 'off';
  formItem.append(input);

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.classList.add('refresh-search-input-icon');
  clearButton.setAttribute('aria-label', clearButtonAriaLabel || 'Clear Search');
  formItem.append(clearButton);

  const formActions = document.createElement('div');
  formActions.classList.add('form-actions', 'js-form-wrapper', 'form-wrapper');
  formActions.id = 'edit-actions';
  form.append(formActions);

  const submitButton = document.createElement('input');
  submitButton.disabled = true;
  submitButton.setAttribute('data-drupal-selector', 'edit-submit-solr-search');
  submitButton.type = 'submit';
  submitButton.id = 'edit-submit-solr-search';
  submitButton.value = submitButtonLabel || 'Apply';
  submitButton.classList.add('button', 'js-form-submit', 'form-submit', 'is-disabled');
  formActions.append(submitButton);

  const trendPlaceholder = document.createElement('div');
  trendPlaceholder.classList.add('search-autocomplete--trend-placeholder');
  autocompleteContainer.append(trendPlaceholder);

  const searchSuggestionSection = document.createElement('section');
  searchSuggestionSection.classList.add('grid-container', 'search-suggestion');
  searchSuggestionSection.setAttribute('aria-label', 'Search Suggestion Module');
  trendPlaceholder.append(searchSuggestionSection);

  const searchSuggestionWrapper = document.createElement('div');
  searchSuggestionWrapper.classList.add('padding-x', 'search-suggestion--wrapper');
  searchSuggestionSection.append(searchSuggestionWrapper);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('grid-x', 'max-width-container');
  searchSuggestionWrapper.append(maxWidthContainer);

  const searchSuggestionCell = document.createElement('div');
  searchSuggestionCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-10', 'search-suggestion--cell');
  maxWidthContainer.append(searchSuggestionCell);

  const trendingTitleSpan = document.createElement('span');
  trendingTitleSpan.classList.add('search-suggestion--title', 'utilityTagHighCaps', 'suggestion-item');
  trendingTitleSpan.textContent = trendingTitle || 'Trending';
  searchSuggestionCell.append(trendingTitleSpan);

  const suggestionList = document.createElement('ul');
  suggestionList.classList.add('search-suggestion--list');
  searchSuggestionCell.append(suggestionList);

  suggestionRows
    .filter((row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      // Destructure item row cells based on 'search-suggestion-item' model
      const [labelCell, linkCell] = [...row.children];

      const listItem = document.createElement('li');
      listItem.classList.add('search-suggestion--list-item', 'suggestion-item');
      suggestionList.append(listItem);

      const suggestionBlock = document.createElement('div');
      suggestionBlock.classList.add('search-suggestion--block');
      listItem.append(suggestionBlock);

      const link = document.createElement('a');
      link.classList.add('search-suggestion--link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      } else {
        link.href = '#';
      }
      moveInstrumentation(linkCell, link); // Move instrumentation from link cell to the new anchor
      suggestionBlock.append(link);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('search-suggestion--label', 'bodyMediumRegular');
      labelSpan.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(labelCell, labelSpan); // Move instrumentation from label cell to the new span
      link.append(labelSpan);
    });

  // Move instrumentation from the original block children to the new elements
  moveInstrumentation(formActionUrlRow, form);
  moveInstrumentation(formInputNameRow, input); // This is for the name attribute, but instrumentation moves to the input element
  moveInstrumentation(formInputAutocompletePathRow, input); // This is for the autocomplete path, but instrumentation moves to the input element
  moveInstrumentation(submitButtonLabelRow, submitButton);
  moveInstrumentation(closeButtonAriaLabelRow, closeButton);
  moveInstrumentation(clearButtonAriaLabelRow, clearButton);
  moveInstrumentation(trendingTitleRow, trendingTitleSpan);
  if (suggestionsContainerRow) {
    moveInstrumentation(suggestionsContainerRow, suggestionList);
  }

  block.replaceChildren(section);

  // Event listeners for interactivity
  closeButton.addEventListener('click', () => {
    section.classList.remove('active');
    document.body.classList.remove('search-autocomplete-active');
  });

  overlay.addEventListener('click', () => {
    section.classList.remove('active');
    document.body.classList.remove('search-autocomplete-active');
  });

  clearButton.addEventListener('click', () => {
    input.value = '';
    submitButton.disabled = true;
  });

  input.addEventListener('input', () => {
    submitButton.disabled = input.value.trim() === '';
  });

  // Expose a method to open the search autocomplete if needed from other components
  block.openSearchAutocomplete = () => {
    section.classList.add('active');
    document.body.classList.add('search-autocomplete-active');
    input.focus();
  };
}
