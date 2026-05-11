import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    closeButtonAriaLabelRow,
    searchFormActionRow,
    searchInputNameRow,
    searchInputPlaceholderRow,
    searchInputAutocompletePathRow,
    clearButtonAriaLabelRow,
    submitButtonLabelRow,
    suggestionTitleRow,
    suggestionsContainerRow, // This is the placeholder row for the container field
    ...suggestionItemRows
  ] = [...block.children];

  // Main autocomplete section
  const searchAutocompleteSection = document.createElement('section');
  // searchAutocompleteSection.classList.add('search-autocomplete'); // REMOVED: Outer block already has this class
  searchAutocompleteSection.id = 'search-autocomplete';
  searchAutocompleteSection.setAttribute('aria-label', 'Search Autocomplete Module');

  // Overlay
  const overlay = document.createElement('div');
  overlay.classList.add('search-autocomplete--overlay');
  searchAutocompleteSection.append(overlay);

  // Close button
  const closeButton = document.createElement('button');
  closeButton.classList.add('search-autocomplete--close');
  closeButton.setAttribute('aria-label', closeButtonAriaLabelRow.textContent.trim());
  moveInstrumentation(closeButtonAriaLabelRow, closeButton);
  closeButton.innerHTML = `
    <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L5.93934 7L0.469669 12.4697C0.176777 12.7626 0.176777 13.2374 0.469669 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L7 8.06066L12.4697 13.5303C12.7626 13.8232 13.2374 13.8232 13.5303 13.5303C13.8232 13.2374 13.8232 12.7626 13.5303 12.4697L8.06066 7L13.5303 1.53033C13.8232 1.23744 13.8232 0.762563 13.5303 0.46967C13.2374 0.176777 12.7626 0.176777 12.4697 0.46967L7 5.93934L1.53033 0.46967Z" fill="black"></path>
    </svg>`;
  searchAutocompleteSection.append(closeButton);

  // Search autocomplete block
  const searchAutocompleteBlock = document.createElement('div');
  searchAutocompleteBlock.classList.add('search-autocomplete--block');
  searchAutocompleteSection.append(searchAutocompleteBlock);

  // Search autocomplete container
  const searchAutocompleteContainer = document.createElement('div');
  searchAutocompleteContainer.classList.add('search-autocomplete--container');
  searchAutocompleteBlock.append(searchAutocompleteContainer);

  // Form placeholder
  const formPlaceholder = document.createElement('div');
  formPlaceholder.classList.add('search-autocomplete--form-placeholder');
  searchAutocompleteContainer.append(formPlaceholder);

  const viewsElementContainer = document.createElement('div');
  viewsElementContainer.classList.add('views-element-container');
  formPlaceholder.append(viewsElementContainer);

  const viewDomIdDiv = document.createElement('div');
  viewDomIdDiv.classList.add('js-view-dom-id-0a205fde9a6e5b2b6eb066369dacd4b6008eeef0f925e80eda9e9627efb325f9');
  viewsElementContainer.append(viewDomIdDiv);

  // Search form
  const searchForm = document.createElement('form');
  searchForm.classList.add('views-exposed-form');
  searchForm.setAttribute('data-drupal-selector', 'views-exposed-form-solr-search-block-1');
  searchForm.action = searchFormActionRow.textContent.trim();
  searchForm.method = 'get';
  searchForm.id = 'views-exposed-form-solr-search-block-1';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  moveInstrumentation(searchFormActionRow, searchForm);
  viewDomIdDiv.append(searchForm);

  // Search input item
  const formItem = document.createElement('div');
  formItem.classList.add('js-form-item', 'form-item', 'js-form-type-search-api-autocomplete', 'form-item-search-term', 'js-form-item-search-term', 'form-no-label');
  searchForm.append(formItem);

  const searchInput = document.createElement('input');
  searchInput.setAttribute('data-drupal-selector', 'edit-search-term');
  searchInput.setAttribute('data-search-api-autocomplete-search', 'solr_search');
  searchInput.classList.add('form-autocomplete', 'form-text', 'ui-autocomplete-input');
  searchInput.setAttribute('data-autocomplete-path', searchInputAutocompletePathRow.textContent.trim());
  searchInput.type = 'text';
  searchInput.id = 'edit-search-term';
  searchInput.name = searchInputNameRow.textContent.trim();
  searchInput.value = '';
  searchInput.size = '30';
  searchInput.maxLength = '128';
  searchInput.setAttribute('data-once', 'autocomplete search-api-autocomplete');
  searchInput.autocomplete = 'off';
  searchInput.placeholder = searchInputPlaceholderRow.textContent.trim();
  moveInstrumentation(searchInputNameRow, searchInput);
  moveInstrumentation(searchInputPlaceholderRow, searchInput);
  moveInstrumentation(searchInputAutocompletePathRow, searchInput);
  formItem.append(searchInput);

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.classList.add('refresh-search-input-icon');
  clearButton.setAttribute('aria-label', clearButtonAriaLabelRow.textContent.trim());
  moveInstrumentation(clearButtonAriaLabelRow, clearButton);
  formItem.append(clearButton);

  // Form actions
  const formActions = document.createElement('div');
  formActions.setAttribute('data-drupal-selector', 'edit-actions');
  formActions.classList.add('form-actions', 'js-form-wrapper', 'form-wrapper');
  formActions.id = 'edit-actions';
  searchForm.append(formActions);

  const submitButton = document.createElement('input');
  submitButton.disabled = true;
  submitButton.setAttribute('data-drupal-selector', 'edit-submit-solr-search');
  submitButton.type = 'submit';
  submitButton.id = 'edit-submit-solr-search';
  submitButton.value = submitButtonLabelRow.textContent.trim();
  submitButton.classList.add('button', 'js-form-submit', 'form-submit', 'is-disabled');
  moveInstrumentation(submitButtonLabelRow, submitButton);
  formActions.append(submitButton);

  // Trend placeholder
  const trendPlaceholder = document.createElement('div');
  trendPlaceholder.classList.add('search-autocomplete--trend-placeholder');
  searchAutocompleteContainer.append(trendPlaceholder);

  // Search suggestion section
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

  const suggestionTitleSpan = document.createElement('span');
  suggestionTitleSpan.classList.add('search-suggestion--title', 'utilityTagHighCaps', 'suggestion-item');
  suggestionTitleSpan.textContent = suggestionTitleRow.textContent.trim();
  moveInstrumentation(suggestionTitleRow, suggestionTitleSpan);
  searchSuggestionCell.append(suggestionTitleSpan);

  // Suggestions list
  const suggestionList = document.createElement('ul');
  suggestionList.classList.add('search-suggestion--list');
  searchSuggestionCell.append(suggestionList);

  // Move instrumentation from the container placeholder row
  moveInstrumentation(suggestionsContainerRow, suggestionList);

  suggestionItemRows
    .filter((row) => row.children.length === 2) // Ensure it's a valid suggestion item row
    .forEach((row) => {
      const [linkCell, labelCell] = [...row.children];

      const listItem = document.createElement('li');
      listItem.classList.add('search-suggestion--list-item', 'suggestion-item');
      moveInstrumentation(row, listItem);
      suggestionList.append(listItem);

      const suggestionBlock = document.createElement('div');
      suggestionBlock.classList.add('search-suggestion--block');
      listItem.append(suggestionBlock);

      const link = document.createElement('a');
      link.classList.add('search-suggestion--link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      moveInstrumentation(linkCell, link);
      suggestionBlock.append(link);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('search-suggestion--label', 'bodyMediumRegular');
      labelSpan.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, labelSpan);
      link.append(labelSpan);
    });

  block.replaceChildren(searchAutocompleteSection);

  // Add event listener for close button
  closeButton.addEventListener('click', () => {
    // Implement logic to close the overlay, e.g., toggle a class
    searchAutocompleteSection.classList.remove('active'); // Assuming 'active' class controls visibility
    overlay.classList.remove('active');
    searchAutocompleteBlock.classList.remove('active');
  });

  // Add event listener for clear search input button
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    submitButton.disabled = true;
  });

  // Add event listener for search input to enable/disable submit button
  searchInput.addEventListener('input', () => {
    submitButton.disabled = searchInput.value.trim() === '';
  });
}
