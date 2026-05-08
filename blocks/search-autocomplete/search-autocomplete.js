import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    closeButtonAriaLabelCell,
    formActionCell,
    inputNameCell,
    inputPlaceholderCell,
    clearButtonAriaLabelCell,
    submitButtonLabelCell,
    trendingTitleCell,
    ...suggestionRows
  ] = children;

  block.setAttribute('id', 'search-autocomplete');
  block.setAttribute('aria-label', 'Search Autocomplete Module');

  const overlay = document.createElement('div');
  overlay.classList.add('search-autocomplete--overlay');
  // The overlay is appended later with replaceChildren to ensure correct order
  // block.append(overlay);

  const closeButton = document.createElement('button');
  closeButton.classList.add('search-autocomplete--close');
  closeButton.setAttribute('aria-label', closeButtonAriaLabelCell.textContent.trim());
  closeButton.innerHTML = `
    <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L5.93934 7L0.469669 12.4697C0.176777 12.7626 0.176777 13.2374 0.469669 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L7 8.06066L12.4697 13.5303C12.7626 13.8232 13.2374 13.8232 13.5303 13.5303C13.8232 13.2374 13.8232 12.7626 13.5303 12.4697L8.06066 7L13.5303 1.53033C13.8232 1.23744 13.8232 0.762563 13.5303 0.46967C13.2374 0.176777 12.7626 0.176777 12.4697 0.46967L7 5.93934L1.53033 0.46967Z" fill="black"></path>
    </svg>
  `;
  moveInstrumentation(closeButtonAriaLabelCell, closeButton);
  // block.append(closeButton);

  const searchBlock = document.createElement('div');
  searchBlock.classList.add('search-autocomplete--block');
  // block.append(searchBlock);

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search-autocomplete--container');
  searchBlock.append(searchContainer);

  const formPlaceholder = document.createElement('div');
  formPlaceholder.classList.add('search-autocomplete--form-placeholder');
  searchContainer.append(formPlaceholder);

  const viewsElementContainer = document.createElement('div');
  viewsElementContainer.classList.add('views-element-container');
  formPlaceholder.append(viewsElementContainer);

  const viewDomIdDiv = document.createElement('div');
  viewDomIdDiv.classList.add('js-view-dom-id-02a6bd3c6a34ede34d4bbac835b77210791b9c15810dfbf04030e6fb8396ccce');
  viewsElementContainer.append(viewDomIdDiv);

  const form = document.createElement('form');
  form.classList.add('views-exposed-form');
  form.setAttribute('data-drupal-selector', 'views-exposed-form-solr-search-block-1');
  form.setAttribute('action', formActionCell.textContent.trim());
  form.setAttribute('method', 'get');
  form.setAttribute('id', 'views-exposed-form-solr-search-block-1');
  form.setAttribute('accept-charset', 'UTF-8');
  moveInstrumentation(formActionCell, form);
  viewDomIdDiv.append(form);

  const formItem = document.createElement('div');
  formItem.classList.add(
    'js-form-item',
    'form-item',
    'js-form-type-search-api-autocomplete',
    'form-item-search-term',
    'js-form-item-search-term',
    'form-no-label',
  );
  form.append(formItem);

  const input = document.createElement('input');
  input.classList.add('form-autocomplete', 'form-text', 'ui-autocomplete-input');
  input.setAttribute('data-drupal-selector', 'edit-search-term');
  input.setAttribute('data-search-api-autocomplete-search', 'solr_search');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'edit-search-term');
  input.setAttribute('name', inputNameCell.textContent.trim());
  input.setAttribute('value', '');
  input.setAttribute('size', '30');
  input.setAttribute('maxlength', '128');
  input.setAttribute('data-once', 'autocomplete search-api-autocomplete');
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('placeholder', inputPlaceholderCell.textContent.trim());
  moveInstrumentation(inputNameCell, input);
  moveInstrumentation(inputPlaceholderCell, input);
  formItem.append(input);

  const clearButton = document.createElement('button');
  clearButton.setAttribute('type', 'button');
  clearButton.classList.add('refresh-search-input-icon');
  clearButton.setAttribute('aria-label', clearButtonAriaLabelCell.textContent.trim());
  moveInstrumentation(clearButtonAriaLabelCell, clearButton);
  formItem.append(clearButton);

  const formActions = document.createElement('div');
  formActions.classList.add('form-actions', 'js-form-wrapper', 'form-wrapper');
  formActions.setAttribute('data-drupal-selector', 'edit-actions');
  formActions.setAttribute('id', 'edit-actions');
  form.append(formActions);

  const submitButton = document.createElement('input');
  submitButton.setAttribute('disabled', 'disabled');
  submitButton.setAttribute('data-drupal-selector', 'edit-submit-solr-search');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('id', 'edit-submit-solr-search');
  submitButton.setAttribute('value', submitButtonLabelCell.textContent.trim());
  submitButton.classList.add('button', 'js-form-submit', 'form-submit', 'is-disabled');
  moveInstrumentation(submitButtonLabelCell, submitButton);
  formActions.append(submitButton);

  const trendPlaceholder = document.createElement('div');
  trendPlaceholder.classList.add('search-autocomplete--trend-placeholder');
  searchContainer.append(trendPlaceholder);

  const searchSuggestionSection = document.createElement('section');
  searchSuggestionSection.classList.add('grid-container', 'search-suggestion');
  searchSuggestionSection.setAttribute('aria-label', 'Search Suggestion Module');
  trendPlaceholder.append(searchSuggestionSection);

  const searchSuggestionWrapper = document.createElement('div');
  searchSuggestionWrapper.classList.add('padding-x', 'search-suggestion--wrapper');
  searchSuggestionSection.append(searchSuggestionWrapper);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');
  searchSuggestionWrapper.append(gridX);

  const searchSuggestionCell = document.createElement('div');
  searchSuggestionCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-10', 'search-suggestion--cell');
  gridX.append(searchSuggestionCell);

  const trendingTitleSpan = document.createElement('span');
  trendingTitleSpan.classList.add('search-suggestion--title', 'utilityTagHighCaps', 'suggestion-item');
  trendingTitleSpan.textContent = trendingTitleCell.textContent.trim();
  moveInstrumentation(trendingTitleCell, trendingTitleSpan);
  searchSuggestionCell.append(trendingTitleSpan);

  const suggestionList = document.createElement('ul');
  suggestionList.classList.add('search-suggestion--list');
  searchSuggestionCell.append(suggestionList);

  suggestionRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('search-suggestion--list-item', 'suggestion-item');
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

  // Event Listeners for interactivity
  closeButton.addEventListener('click', () => {
    block.classList.remove('is-active');
    // Optionally reset search state or clear input
  });

  clearButton.addEventListener('click', () => {
    input.value = '';
    submitButton.setAttribute('disabled', 'disabled');
    submitButton.classList.add('is-disabled');
    // Optionally hide suggestions
  });

  input.addEventListener('input', () => {
    if (input.value.trim().length > 0) {
      submitButton.removeAttribute('disabled');
      submitButton.classList.remove('is-disabled');
      // Optionally show suggestions
    } else {
      submitButton.setAttribute('disabled', 'disabled');
      submitButton.classList.add('is-disabled');
      // Optionally hide suggestions
    }
  });

  // Remove original cells from the block as their content has been moved
  // The block.replaceChildren() below will then replace the entire block content
  // with the new structure.
  [
    closeButtonAriaLabelCell,
    formActionCell,
    inputNameCell,
    inputPlaceholderCell,
    clearButtonAriaLabelCell,
    submitButtonLabelCell,
    trendingTitleCell,
    ...suggestionRows,
  ].forEach((cell) => cell.remove());

  block.replaceChildren(overlay, closeButton, searchBlock);
}
