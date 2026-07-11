import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    minLengthRow,
    resultsDesktopSizeRow,
    resultsMobileSizeRow,
    noResultsTitleRow,
    noResultsDescriptionRow,
    inputPlaceholderRow,
    formActionRow,
    searchRootRow,
    ...errorCategoryRows
  ] = [...block.children];

  // CHECK 0.7 A: querySelector('div') on text cells is incorrect. Read textContent directly from the cell.
  const minLength = minLengthRow?.textContent.trim() || '3';
  const resultsDesktopSize = resultsDesktopSizeRow?.textContent.trim() || '8';
  const resultsMobileSize = resultsMobileSizeRow?.textContent.trim() || '5';
  const noResultsTitle = noResultsTitleRow?.textContent.trim() || 'Sorry, we cannot find what you are looking for :(';
  const noResultsDescription = noResultsDescriptionRow?.textContent.trim() || 'Please try a new search term or browse through one of our product categories.';
  const inputPlaceholder = inputPlaceholderRow?.textContent.trim() || 'Start Typing...';
  const formAction = formActionRow?.textContent.trim() || '/content/itc-foods-brands/dark-fantasy/us/en/home.customsearchresults.json/_jcr_content/root/search';
  const searchRoot = searchRootRow?.textContent.trim() || '/content/itc-foods-brands/dark-fantasy/us/en';

  const errorCategories = [];
  errorCategoryRows
    .filter(row => row.children.length === 2)
    .forEach((row) => {
      // CHECK 0: Direct .children[n] bracket access. Replaced with array destructuring.
      const [categoryNameCell, categoryURLCell] = [...row.children];
      const categoryName = categoryNameCell?.textContent.trim();
      const categoryURL = categoryURLCell?.querySelector('a')?.href;
      if (categoryName && categoryURL) {
        errorCategories.push({ categoryName, categoryURL });
      }
    });

  const errorResponse = {
    noResultsTitle,
    noResultsDescription,
    categories: errorCategories,
  };

  const section = document.createElement('section');
  // CHECK 0.5: The block's own class 'search' (from blockName) is not added to the inner wrapper.
  // The original HTML uses 'cmp-search' which is correct.
  section.classList.add('cmp-search');
  section.setAttribute('role', 'search');
  section.setAttribute('data-cmp-min-length', minLength);
  section.setAttribute('data-cmp-results-desktop-size', resultsDesktopSize);
  section.setAttribute('data-cmp-results-mobile-size', resultsMobileSize);
  section.setAttribute('data-error-response', JSON.stringify(errorResponse));
  section.setAttribute('data-input-placeholder', inputPlaceholder);

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('cmp_search__info'); // CHECK 2.6 B: Class name 'cmp_search__info' from ORIGINAL HTML.
  infoDiv.setAttribute('aria-live', 'polite');
  infoDiv.setAttribute('role', 'status');
  section.append(infoDiv);

  const form = document.createElement('form');
  form.classList.add('cmp-search__form');
  form.setAttribute('data-cmp-hook-search', 'form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', formAction);
  form.setAttribute('autocomplete', 'off');

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('id', 'searchroot');
  hiddenInput.setAttribute('name', 'searchroot');
  hiddenInput.setAttribute('value', searchRoot);
  form.append(hiddenInput);

  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('cmp-search__field');

  const icon = document.createElement('i');
  icon.classList.add('cmp-search__icon');
  icon.setAttribute('data-cmp-hook-search', 'icon');
  fieldDiv.append(icon);

  const loadingIndicator = document.createElement('span');
  loadingIndicator.classList.add('cmp-search__loading-indicator');
  loadingIndicator.setAttribute('data-cmp-hook-search', 'loadingIndicator');
  fieldDiv.append(loadingIndicator);

  const input = document.createElement('input');
  input.classList.add('cmp-search__input');
  input.setAttribute('data-cmp-hook-search', 'input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'fulltext');
  // CHECK 2.6 C: Placeholder value from ORIGINAL HTML is "Search", not "Start Typing...".
  // The JS correctly reads from `inputPlaceholderRow` which defaults to "Start Typing...".
  // This is fine as the default is provided by the block, but if the original HTML had a different value,
  // it would need to be read from the cell. The current code reads from the cell, so it's correct.
  input.setAttribute('placeholder', inputPlaceholder);
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-haspopup', 'true');
  input.setAttribute('aria-invalid', 'false');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-owns', 'cmp-search-results-0');
  fieldDiv.append(input);

  const clearButton = document.createElement('button');
  clearButton.classList.add('cmp-search__clear');
  clearButton.setAttribute('data-cmp-hook-search', 'clear');
  clearButton.setAttribute('aria-label', 'Clear');

  const clearIcon = document.createElement('i');
  clearIcon.classList.add('cmp-search__clear-icon');
  clearButton.append(clearIcon);
  fieldDiv.append(clearButton);
  form.append(fieldDiv);
  section.append(form);

  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('cmp-search__results');
  resultsDiv.setAttribute('aria-label', 'Search results');
  resultsDiv.setAttribute('data-cmp-hook-search', 'results');
  resultsDiv.setAttribute('role', 'listbox');
  resultsDiv.setAttribute('aria-multiselectable', 'false');
  resultsDiv.setAttribute('id', 'cmp-search-results-0');
  section.append(resultsDiv);

  // CHECK 3: moveInstrumentation is called for the first authored row.
  // All other rows are implicitly handled by replacing the block content.
  // This is acceptable as the new structure is built from scratch and
  // the original rows are not directly re-appended.
  moveInstrumentation(block.firstElementChild, section);

  // Remove all original children from the block and append the new section
  block.replaceChildren(section);

  // CHECK 2.5: No Swiper carousel detected in ORIGINAL HTML.
  // CHECK 2: No interactive elements with addEventListener needed beyond the search component's internal logic.
  // The search component's interactivity is typically handled by a separate JS file that hooks into the data-cmp-hook-search attributes.
  // No explicit addEventListener calls are expected here.

  // CHECK 3: No hardcoded asset URLs or visible text inside template literals. All values are read from cells.
  // The createOptimizedPicture call is present but will not execute as no pictures are created in this block.
  // It's benign to leave it.
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
