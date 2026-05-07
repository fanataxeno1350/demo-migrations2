import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [placeholderRow, formActionRow] = [...block.children];

  // Extract the data-id from the block's parent element for dynamic ID generation
  const blockId = block.dataset.id || 'search-block'; // Fallback ID if data-id is missing

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('elementor-widget-container');

  const search = document.createElement('search');
  search.classList.add('e-search');
  search.setAttribute('role', 'search');

  const form = document.createElement('form');
  form.classList.add('e-search-form');
  form.setAttribute('method', 'get');

  const formActionLink = formActionRow.querySelector('a');
  if (formActionLink) {
    form.setAttribute('action', formActionLink.href);
  }

  const label = document.createElement('label');
  label.classList.add('e-search-label');
  label.setAttribute('for', `search-${blockId}`); // Dynamic ID

  const screenOnlySpan = document.createElement('span');
  screenOnlySpan.classList.add('elementor-screen-only');
  screenOnlySpan.textContent = 'Search';
  label.append(screenOnlySpan);

  const searchIcon = document.createElement('svg');
  searchIcon.classList.add('e-font-icon-svg', 'e-fas-search');
  searchIcon.setAttribute('aria-hidden', 'true');
  searchIcon.setAttribute('viewBox', '0 0 512 512');
  searchIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  searchIcon.innerHTML = '<path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>';
  label.append(searchIcon);
  form.append(label);

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('e-search-input-wrapper');

  const input = document.createElement('input');
  input.setAttribute('id', `search-${blockId}`); // Dynamic ID
  input.setAttribute('class', 'e-search-input');
  input.setAttribute('type', 'search');
  input.setAttribute('name', 's');
  input.setAttribute('value', '');
  input.setAttribute('autocomplete', 'on');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', `results-${blockId}`); // Dynamic ID
  input.setAttribute('aria-haspopup', 'listbox');

  const placeholderText = placeholderRow.textContent.trim();
  if (placeholderText) {
    input.setAttribute('placeholder', placeholderText);
  }
  inputWrapper.append(input);

  const clearIcon = document.createElement('svg');
  clearIcon.classList.add('e-font-icon-svg', 'e-fas-times', 'hidden');
  clearIcon.setAttribute('aria-hidden', 'true');
  clearIcon.setAttribute('viewBox', '0 0 352 512');
  clearIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clearIcon.innerHTML = '<path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>';
  inputWrapper.append(clearIcon);

  const output = document.createElement('output');
  output.setAttribute('id', `results-${blockId}`); // Dynamic ID
  output.classList.add('e-search-results-container', 'hide-loader');
  output.setAttribute('aria-live', 'polite');
  output.setAttribute('aria-atomic', 'true');
  output.setAttribute('aria-label', 'Results for search');
  output.setAttribute('tabindex', '0');

  const searchResultsDiv = document.createElement('div');
  searchResultsDiv.classList.add('e-search-results');
  output.append(searchResultsDiv);
  inputWrapper.append(output);
  form.append(inputWrapper);

  const submitButton = document.createElement('button');
  submitButton.classList.add('e-search-submit', 'elementor-screen-only');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('aria-label', 'Search');
  form.append(submitButton);

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'e_search_props');
  // The value '53a8628-132' seems to be a specific instance ID.
  // If this needs to be dynamic, it should come from block.dataset or a similar source.
  // For now, keeping it as a hardcoded value as it's not directly tied to a block.children cell.
  hiddenInput.setAttribute('value', `${blockId}-132`); // Dynamic ID part
  form.append(hiddenInput);

  search.append(form);
  searchContainer.append(search);

  // Add interactivity
  input.addEventListener('input', () => {
    if (input.value.length > 0) {
      clearIcon.classList.remove('hidden');
    } else {
      clearIcon.classList.add('hidden');
    }
    // TODO: Implement actual search logic and results display
  });

  clearIcon.addEventListener('click', () => {
    input.value = '';
    clearIcon.classList.add('hidden');
    // TODO: Clear search results
  });

  moveInstrumentation(placeholderRow, searchContainer);
  moveInstrumentation(formActionRow, searchContainer);

  block.replaceChildren(searchContainer);
}
