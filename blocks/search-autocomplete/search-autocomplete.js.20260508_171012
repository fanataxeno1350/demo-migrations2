import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const root = document.createElement('div'); // Changed to div as per common practice for block root
  // root.classList.add('search-autocomplete'); // REMOVED: Block's own class already on outer div
  root.id = 'search-autocomplete';
  root.setAttribute('aria-label', 'Search Autocomplete Module');

  const overlay = document.createElement('div');
  overlay.classList.add('search-autocomplete--overlay');
  root.append(overlay);

  const closeButton = document.createElement('button');
  closeButton.classList.add('search-autocomplete--close');
  closeButton.setAttribute('aria-label', 'Close Search Overlay');
  closeButton.innerHTML = `
    <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L5.93934 7L0.469669 12.4697C0.176777 12.7626 0.176777 13.2374 0.469669 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L7 8.06066L12.4697 13.5303C12.7626 13.8232 13.2374 13.8232 13.5303 13.5303C13.8232 13.2374 13.8232 12.7626 13.5303 12.4697L8.06066 7L13.5303 1.53033C13.8232 1.23744 13.8232 0.762563 13.5303 0.46967C13.2374 0.176777 12.7626 0.176777 12.4697 0.46967L7 5.93934L1.53033 0.46967Z" fill="black"></path>
    </svg>
  `;
  root.append(closeButton);

  // Add event listener for the close button
  closeButton.addEventListener('click', () => {
    block.classList.remove('is-active'); // Assuming 'is-active' class controls visibility
    document.body.classList.remove('search-autocomplete-active'); // Assuming body class for overlay
  });
  overlay.addEventListener('click', () => {
    block.classList.remove('is-active');
    document.body.classList.remove('search-autocomplete-active');
  });

  const autocompleteBlock = document.createElement('div');
  autocompleteBlock.classList.add('search-autocomplete--block');
  root.append(autocompleteBlock);

  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.classList.add('search-autocomplete--container');
  autocompleteBlock.append(autocompleteContainer);

  const formPlaceholder = document.createElement('div');
  formPlaceholder.classList.add('search-autocomplete--form-placeholder');
  // The original HTML for the form is hardcoded.
  // The block structure does not provide fields for the form.
  // This means the form content is expected to be static or managed outside AEM.
  // If this form content were dynamic and came from AEM, it would need to be
  // extracted from a block.children row. Since it's not, we keep it as is,
  // but note that this is a hardcoded asset.
  formPlaceholder.innerHTML = `
    <div class="views-element-container">
      <div class="js-view-dom-id-02a6bd3c6a34ede34d4bbac835b77210791b9c15810dfbf04030e6fb8396ccce">
        <form class="views-exposed-form" data-drupal-selector="views-exposed-form-solr-search-block-1" action="https://www.nescafe.com/in/search-results" method="get" id="views-exposed-form-solr-search-block-1" accept-charset="UTF-8">
          <div class="js-form-item form-item js-form-type-search-api-autocomplete form-item-search-term js-form-item-search-term form-no-label">
            <input data-drupal-selector="edit-search-term" data-search-api-autocomplete-search="solr_search" class="form-autocomplete form-text ui-autocomplete-input" data-autocomplete-path="/in/search_api_autocomplete/solr_search?display=block_1&amp;&amp;filter=search_term" type="text" id="edit-search-term" name="search_term" value="" size="30" maxlength="128" data-once="autocomplete search-api-autocomplete" autocomplete="off"/>
            <button type="button" class="refresh-search-input-icon" aria-label="Clear Search"></button>
          </div>
          <div data-drupal-selector="edit-actions" class="form-actions js-form-wrapper form-wrapper" id="edit-actions">
            <input disabled="disabled" data-drupal-selector="edit-submit-solr-search" type="submit" id="edit-submit-solr-search" value="Apply" class="button js-form-submit form-submit is-disabled"/>
          </div>
        </form>
      </div>
    </div>
  `;
  autocompleteContainer.append(formPlaceholder);

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

  // Read the trending title from the first row
  const trendingTitleRow = children[0];
  const trendingTitleSpan = document.createElement('span');
  trendingTitleSpan.classList.add('search-suggestion--title', 'utilityTagHighCaps', 'suggestion-item');
  moveInstrumentation(trendingTitleRow, trendingTitleSpan);
  trendingTitleSpan.textContent = trendingTitleRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  searchSuggestionCell.append(trendingTitleSpan);

  const suggestionList = document.createElement('ul');
  suggestionList.classList.add('search-suggestion--list');
  searchSuggestionCell.append(suggestionList);

  // Process suggestion item rows (from the second row onwards)
  const suggestionRows = children.slice(1);
  suggestionRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Correct: named destructuring

    const listItem = document.createElement('li');
    listItem.classList.add('search-suggestion--list-item', 'suggestion-item');
    moveInstrumentation(row, listItem);
    suggestionList.append(listItem);

    const suggestionBlock = document.createElement('div');
    suggestionBlock.classList.add('search-suggestion--block');
    listItem.append(suggestionBlock);

    const linkEl = document.createElement('a');
    linkEl.classList.add('search-suggestion--link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
    } else {
      // Fallback if no <a> is found, though model expects aem-content
      linkEl.href = '#';
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('search-suggestion--label', 'bodyMediumRegular');
    labelSpan.textContent = labelCell.textContent.trim();
    linkEl.append(labelSpan);
    suggestionBlock.append(linkEl);
  });

  block.replaceChildren(root);
}
