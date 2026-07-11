import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root-level rows based on the BlockJson model
  const [
    minLengthRow,
    resultsDesktopSizeRow,
    resultsMobileSizeRow,
    inputPlaceholderRow,
    noResultsTitleRow,
    noResultsDescriptionRow,
    categoryContainerPlaceholderRow, // This is the placeholder row for the container field "categories"
    ...categoryRows
  ] = [...block.children];

  // Read content from the first child element of each row (the actual cell div)
  const minLength = minLengthRow?.firstElementChild?.textContent.trim();
  const resultsDesktopSize = resultsDesktopSizeRow?.firstElementChild?.textContent.trim();
  const resultsMobileSize = resultsMobileSizeRow?.firstElementChild?.textContent.trim();
  const inputPlaceholder = inputPlaceholderRow?.firstElementChild?.textContent.trim();
  const noResultsTitle = noResultsTitleRow?.firstElementChild?.textContent.trim();
  const noResultsDescription = noResultsDescriptionRow?.firstElementChild?.textContent.trim();

  const categories = categoryRows.map((row) => {
    // For category item rows, use destructuring as per fixed schema
    const [categoryNameCell, categoryURLCell] = [...row.children];
    const categoryURL = categoryURLCell?.querySelector('a')?.href || '';
    const categoryName = categoryNameCell?.textContent.trim() || '';
    return { categoryName, categoryURL };
  });

  const errorResponse = {
    noResultsTitle,
    noResultsDescription,
    categories,
  };

  const section = document.createElement('section');
  // Do NOT add 'search' class here, the outer block div already has it.
  // Add other classes from ORIGINAL HTML if any, but 'cmp-search' is the block name.
  section.classList.add('cmp-search'); // This is the block name, but it's also the root element in original HTML.
                                       // In this specific case, the block's outer div is replaced by 'section',
                                       // so adding 'cmp-search' here is correct to match the original HTML structure.
  section.setAttribute('role', 'search');

  if (minLength) section.setAttribute('data-cmp-min-length', minLength);
  if (resultsDesktopSize) section.setAttribute('data-cmp-results-desktop-size', resultsDesktopSize);
  if (resultsMobileSize) section.setAttribute('data-cmp-results-mobile-size', resultsMobileSize);
  if (inputPlaceholder) section.setAttribute('data-input-placeholder', inputPlaceholder);
  section.setAttribute('data-error-response', JSON.stringify(errorResponse));

  // Move instrumentation from the block to the new section
  moveInstrumentation(block, section);

  // Move instrumentation for all root-level rows to the section, as their content is consumed into attributes
  moveInstrumentation(minLengthRow, section);
  moveInstrumentation(resultsDesktopSizeRow, section);
  moveInstrumentation(resultsMobileSizeRow, section);
  moveInstrumentation(inputPlaceholderRow, section);
  moveInstrumentation(noResultsTitleRow, section);
  moveInstrumentation(noResultsDescriptionRow, section);
  moveInstrumentation(categoryContainerPlaceholderRow, section); // Placeholder row instrumentation moved

  // Category rows are processed into JSON, their DOM elements are not directly appended.
  // Instrumentation for categoryRows is implicitly handled by their data being part of the `errorResponse`
  // which is moved with the `section`. If these rows had visual elements, their instrumentation would be moved
  // to those new elements.

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('cmp_search__info');
  infoDiv.setAttribute('aria-live', 'polite');
  infoDiv.setAttribute('role', 'status');
  section.append(infoDiv);

  const form = document.createElement('form');
  form.classList.add('cmp-search__form');
  form.setAttribute('data-cmp-hook-search', 'form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', '/content/itc-foods-brands/yippee/us/en.customsearchresults.json/_jcr_content/root/search');
  form.setAttribute('autocomplete', 'off');
  section.append(form);

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('id', 'searchroot');
  hiddenInput.setAttribute('name', 'searchroot');
  hiddenInput.setAttribute('value', '/content/itc-foods-brands/yippee/us/en');
  form.append(hiddenInput);

  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('cmp-search__field');
  form.append(fieldDiv);

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
  input.setAttribute('placeholder', inputPlaceholder || 'Search');
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
  fieldDiv.append(clearButton);

  const clearIcon = document.createElement('i');
  clearIcon.classList.add('cmp-search__clear-icon');
  clearButton.append(clearIcon);

  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('cmp-search__results');
  resultsDiv.setAttribute('aria-label', 'Search results');
  resultsDiv.setAttribute('data-cmp-hook-search', 'results');
  resultsDiv.setAttribute('role', 'listbox');
  resultsDiv.setAttribute('aria-multiselectable', 'false');
  resultsDiv.setAttribute('id', 'cmp-search-results-0');
  section.append(resultsDiv);

  // All initial rows are consumed, so we can replace the block's children with the new structure.
  block.replaceChildren(section);

  // Optimize images if any were present (though none in this specific block structure)
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
