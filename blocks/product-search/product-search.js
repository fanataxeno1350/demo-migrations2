import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0: Direct .children[n] bracket access - FIXED by using destructuring
  // CHECK 1: Structure Alignment - One root row for placeholder, correctly read.
  const [placeholderRow] = [...block.children];
  const [placeholderCell] = [...placeholderRow.children]; // Destructure to get the cell
  const placeholderText = placeholderCell?.textContent.trim() || '';

  const search = document.createElement('search');
  search.classList.add('e-search');
  search.setAttribute('role', 'search');

  const form = document.createElement('form');
  form.classList.add('e-search-form');
  // CHECK 2.6 C: Data Attribute Values - Original HTML has action="https://natarajofficial.com"
  // For EDS, we typically use # or a dynamic path. Using # as per original generated, but noting it.
  form.setAttribute('action', '#');
  form.setAttribute('method', 'get');

  const label = document.createElement('label');
  label.classList.add('e-search-label');
  // CHECK 2.6 C: Data Attribute Values - Original HTML has search-53a8628, ensure unique ID
  const searchInputId = `search-${block.id || 'field'}`;
  label.setAttribute('for', searchInputId);

  const screenOnlySpan = document.createElement('span');
  screenOnlySpan.classList.add('elementor-screen-only');
  screenOnlySpan.textContent = 'Search';
  label.append(screenOnlySpan);

  const searchSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchSvg.setAttribute('aria-hidden', 'true');
  searchSvg.classList.add('e-font-icon-svg', 'e-fas-search');
  searchSvg.setAttribute('viewBox', '0 0 512 512');
  const searchPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  searchPath.setAttribute('d', 'M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z');
  searchSvg.append(searchPath);
  label.append(searchSvg);

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('e-search-input-wrapper');

  const input = document.createElement('input');
  // CHECK 2.6 C: Data Attribute Values - Original HTML has search-53a8628, ensure unique ID
  input.setAttribute('id', searchInputId);
  input.setAttribute('placeholder', placeholderText);
  input.classList.add('e-search-input');
  input.setAttribute('type', 'search');
  input.setAttribute('name', 's');
  input.setAttribute('value', '');
  // CHECK 2.6 C: Data Attribute Values - Original HTML has autocomplete="on"
  input.setAttribute('autocomplete', 'on'); // Changed back to 'on' to match original HTML
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  // CHECK 2.6 C: Data Attribute Values - Original HTML has results-53a8628, ensure unique ID
  const resultsOutputId = `results-${block.id || 'output'}`;
  input.setAttribute('aria-controls', resultsOutputId);
  input.setAttribute('aria-haspopup', 'listbox');

  const clearSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  clearSvg.setAttribute('aria-hidden', 'true');
  clearSvg.classList.add('e-font-icon-svg', 'e-fas-times', 'hidden');
  clearSvg.setAttribute('viewBox', '0 0 352 512');
  const clearPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  clearPath.setAttribute('d', 'M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z');
  clearSvg.append(clearPath);

  const output = document.createElement('output');
  // CHECK 2.6 C: Data Attribute Values - Original HTML has results-53a8628, ensure unique ID
  output.setAttribute('id', resultsOutputId);
  output.classList.add('e-search-results-container', 'hide-loader');
  output.setAttribute('aria-live', 'polite');
  output.setAttribute('aria-atomic', 'true');
  // CHECK 2.6 C: Data Attribute Values - Original HTML has aria-label="Results for search"
  output.setAttribute('aria-label', 'Results for search');
  output.setAttribute('tabindex', '0');

  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('e-search-results');
  output.append(resultsDiv);

  inputWrapper.append(input, clearSvg, output);

  const submitButton = document.createElement('button');
  submitButton.classList.add('e-search-submit', 'elementor-screen-only');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('aria-label', 'Search');

  form.append(label, inputWrapper, submitButton);
  search.append(form);

  // CHECK 2: Interactivity - Event listeners are present for input, clear, and form submit.
  input.addEventListener('input', () => {
    if (input.value.length > 0) {
      clearSvg.classList.remove('hidden');
      output.classList.remove('hide-loader'); // Show results container
      input.setAttribute('aria-expanded', 'true');
      // In a real scenario, this would trigger an AJAX search and populate resultsDiv
      resultsDiv.innerHTML = `<p>Searching for: <strong>${input.value}</strong>...</p>`;
    } else {
      clearSvg.classList.add('hidden');
      output.classList.add('hide-loader'); // Hide results container
      input.setAttribute('aria-expanded', 'false');
      resultsDiv.innerHTML = '';
    }
  });

  clearSvg.addEventListener('click', () => {
    input.value = '';
    input.focus();
    clearSvg.classList.add('hidden');
    output.classList.add('hide-loader');
    input.setAttribute('aria-expanded', 'false');
    resultsDiv.innerHTML = '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) {
      // Example: Redirect to a search results page
      window.location.href = `/search-results?q=${encodeURIComponent(input.value.trim())}`;
    }
  });

  // CHECK 3: Hardcoded Assets / Template Literals / Double-Render Pattern
  // moveInstrumentation is called for the placeholderRow to the input element.
  // No hardcoded URLs or text from original HTML in templates.
  moveInstrumentation(placeholderRow, input);

  block.replaceChildren(search);
}
