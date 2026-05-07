import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [placeholderRow, formActionUrlRow] = [...block.children];

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('elementor-widget-container');
  // moveInstrumentation(block, searchContainer); // Removed: moveInstrumentation should be called on the root element after it's fully built.

  const searchElement = document.createElement('search');
  searchElement.classList.add('e-search');
  searchElement.setAttribute('role', 'search');

  const form = document.createElement('form');
  form.classList.add('e-search-form');
  form.setAttribute('method', 'get');
  // Corrected: formActionUrlRow is a row, need to get the cell, then the anchor's href.
  form.setAttribute('action', formActionUrlRow.children[0]?.querySelector('a')?.href || '#');

  const label = document.createElement('label');
  label.classList.add('e-search-label', 'elementor-screen-only');
  label.setAttribute('for', 'search-53a8628'); // Using a static ID from original HTML
  label.innerHTML = `
    <span class="elementor-screen-only">
      Search
    </span>
    <svg aria-hidden="true" class="e-font-icon-svg e-fas-search" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
  `;

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('e-search-input-wrapper');

  const input = document.createElement('input');
  input.classList.add('e-search-input');
  input.setAttribute('id', 'search-53a8628'); // Using a static ID from original HTML
  // Corrected: placeholderRow is a row, need to get the cell, then its textContent.
  input.setAttribute('placeholder', placeholderRow.children[0]?.textContent.trim() || 'Type to start searching products...');
  input.setAttribute('type', 'search');
  input.setAttribute('name', 's');
  input.setAttribute('value', '');
  input.setAttribute('autocomplete', 'on');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'results-53a8628');
  input.setAttribute('aria-haspopup', 'listbox');

  const clearIcon = document.createElement('svg');
  clearIcon.classList.add('e-font-icon-svg', 'e-fas-times', 'hidden');
  clearIcon.setAttribute('aria-hidden', 'true');
  clearIcon.setAttribute('viewBox', '0 0 352 512');
  clearIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clearIcon.innerHTML = '<path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>';

  const output = document.createElement('output');
  output.classList.add('e-search-results-container', 'hide-loader');
  output.setAttribute('id', 'results-53a8628'); // Using a static ID from original HTML
  output.setAttribute('aria-live', 'polite');
  output.setAttribute('aria-atomic', 'true');
  output.setAttribute('aria-label', 'Results for search');
  output.setAttribute('tabindex', '0');

  const searchResults = document.createElement('div');
  searchResults.classList.add('e-search-results');
  output.append(searchResults);

  inputWrapper.append(input, clearIcon, output);

  const submitButton = document.createElement('button');
  submitButton.classList.add('e-search-submit', 'elementor-screen-only');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('aria-label', 'Search');

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'e_search_props');
  hiddenInput.setAttribute('value', '53a8628-132'); // Using a static value from original HTML

  form.append(label, inputWrapper, submitButton, hiddenInput);
  searchElement.append(form);
  searchContainer.append(searchElement);

  // Move instrumentation from the original block to the new root element
  moveInstrumentation(block, searchContainer);
  block.replaceChildren(searchContainer);

  // Add event listeners for interactive behavior
  input.addEventListener('input', () => {
    if (input.value.length > 0) {
      clearIcon.classList.remove('hidden');
    } else {
      clearIcon.classList.add('hidden');
    }
    // In a real scenario, this would trigger a search and populate output.
    // For EDS, we only implement the basic UI interactions.
  });

  clearIcon.addEventListener('click', () => {
    input.value = '';
    clearIcon.classList.add('hidden');
    // Clear search results as well if any were displayed
    searchResults.innerHTML = '';
  });
}
