import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [dropdownTitleRow, buttonLabelRow, buttonLinkRow, ...dropdownOptionRows] = [...block.children];

  const root = document.createElement('div');
  // root.classList.add('cmp-dropdown'); // Removed: outer block div already has this class
  root.setAttribute('data-component', 'dropdown');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content', 'right-dropdown-title-aligned');

  // Dropdown Title
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('cmp-dropdown__title');
  const h4 = document.createElement('h4');
  moveInstrumentation(dropdownTitleRow, h4);
  h4.textContent = dropdownTitleRow.textContent.trim();
  titleDiv.append(h4);
  contentDiv.append(titleDiv);

  // Custom Select
  const customSelectDiv = document.createElement('div');
  customSelectDiv.classList.add('cmp-dropdown__custom-select');

  const selectEl = document.createElement('select');
  const selectSelectedDiv = document.createElement('div');
  selectSelectedDiv.classList.add('cmp-dropdown__select-selected');
  const selectItemsDiv = document.createElement('div');
  selectItemsDiv.classList.add('cmp-dropdown__select-items', 'cmp-dropdown__select-hide');

  let defaultOptionText = '';
  let defaultOptionLink = '';

  dropdownOptionRows.forEach((row, index) => {
    const [optionLabelCell, optionLinkCell] = [...row.children];
    const optionLabel = optionLabelCell.textContent.trim();
    const optionLink = optionLinkCell.querySelector('a')?.href || '#';

    // Set the first option as default
    if (index === 0) {
      defaultOptionText = optionLabel;
      defaultOptionLink = optionLink;
    }

    const optionEl = document.createElement('option');
    optionEl.value = optionLabel;
    optionEl.textContent = optionLabel;
    optionEl.setAttribute('data-link', optionLink);
    moveInstrumentation(row, optionEl); // Move instrumentation from row to option
    selectEl.append(optionEl);

    const itemDiv = document.createElement('div');
    itemDiv.textContent = optionLabel;
    itemDiv.setAttribute('data-link', optionLink);
    selectItemsDiv.append(itemDiv);
  });

  selectSelectedDiv.textContent = defaultOptionText;
  selectSelectedDiv.setAttribute('data-selected', defaultOptionText);

  customSelectDiv.append(selectEl, selectSelectedDiv, selectItemsDiv);
  contentDiv.append(customSelectDiv);

  // Button
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor');
  const buttonAnchor = document.createElement('a');
  buttonAnchor.classList.add('cmp-button');
  moveInstrumentation(buttonLinkRow, buttonAnchor); // Move instrumentation from buttonLinkRow to buttonAnchor
  buttonAnchor.href = buttonLinkRow.querySelector('a')?.href || defaultOptionLink;
  const buttonSpan = document.createElement('span');
  buttonSpan.classList.add('cmp-button__text');
  moveInstrumentation(buttonLabelRow, buttonSpan); // Move instrumentation from buttonLabelRow to buttonSpan
  buttonSpan.textContent = buttonLabelRow.textContent.trim();
  buttonAnchor.append(buttonSpan);
  buttonDiv.append(buttonAnchor);
  contentDiv.append(buttonDiv);

  root.append(contentDiv);

  // Event Listeners for custom select behavior
  selectSelectedDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    selectItemsDiv.classList.toggle('cmp-dropdown__select-hide');
    selectSelectedDiv.classList.toggle('select-arrow-active');
  });

  selectItemsDiv.querySelectorAll('div').forEach((item) => {
    item.addEventListener('click', () => {
      const newSelectedText = item.textContent;
      const newSelectedLink = item.getAttribute('data-link');

      selectSelectedDiv.textContent = newSelectedText;
      selectSelectedDiv.setAttribute('data-selected', newSelectedText);
      buttonAnchor.href = newSelectedLink;

      // Update the actual select element's value
      selectEl.value = newSelectedText;

      selectItemsDiv.classList.add('cmp-dropdown__select-hide');
      selectSelectedDiv.classList.remove('select-arrow-active');
    });
  });

  document.addEventListener('click', () => {
    selectItemsDiv.classList.add('cmp-dropdown__select-hide');
    selectSelectedDiv.classList.remove('select-arrow-active');
  });

  block.replaceChildren(root);

  // Image optimization (no images in this block's model, so this section is unnecessary)
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
