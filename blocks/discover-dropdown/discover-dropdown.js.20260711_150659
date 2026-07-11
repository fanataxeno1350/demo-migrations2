import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [dropdownTitleRow, buttonLabelRow, ...dropdownOptionRows] = [...block.children];

  const dropdownTitle = dropdownTitleRow?.textContent.trim();
  const buttonLabel = buttonLabelRow?.textContent.trim();

  const root = document.createElement('div');
  // root.classList.add('cmp-dropdown'); // Removed: outer block div already has 'discover-dropdown'
  root.setAttribute('data-component', 'dropdown');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content', 'right-dropdown-title-aligned');
  root.append(contentDiv);

  if (dropdownTitle) {
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('cmp-dropdown__title');
    const titleH4 = document.createElement('h4');
    titleH4.textContent = dropdownTitle;
    titleDiv.append(titleH4);
    moveInstrumentation(dropdownTitleRow, titleDiv);
    contentDiv.append(titleDiv);
  }

  const customSelectDiv = document.createElement('div');
  customSelectDiv.classList.add('cmp-dropdown__custom-select');
  contentDiv.append(customSelectDiv);

  const selectEl = document.createElement('select');
  customSelectDiv.append(selectEl);

  let selectedOptionText = '';
  let selectedOptionLink = '';

  const optionsDiv = document.createElement('div');
  optionsDiv.classList.add('cmp-dropdown__select-items', 'cmp-dropdown__select-hide');
  customSelectDiv.append(optionsDiv);

  dropdownOptionRows.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children];
    const optionLabel = labelCell?.textContent.trim();
    const optionLink = linkCell?.querySelector('a')?.href;

    if (optionLabel && optionLink) {
      const optionEl = document.createElement('option');
      optionEl.value = optionLabel;
      optionEl.textContent = optionLabel;
      optionEl.setAttribute('data-link', optionLink);
      selectEl.append(optionEl);
      // moveInstrumentation(row, optionEl); // Instrumentation should be on the visible itemDiv

      const itemDiv = document.createElement('div');
      itemDiv.textContent = optionLabel;
      optionsDiv.append(itemDiv);
      moveInstrumentation(row, itemDiv); // Instrumentation on the visible item

      if (index === 0) {
        selectedOptionText = optionLabel;
        selectedOptionLink = optionLink;
        optionEl.setAttribute('defaultvalue', optionLabel);
      }
    }
  });

  const selectedDiv = document.createElement('div');
  selectedDiv.classList.add('cmp-dropdown__select-selected'); // Added missing class
  selectedDiv.setAttribute('data-selected', selectedOptionText);
  selectedDiv.textContent = selectedOptionText;
  customSelectDiv.prepend(selectedDiv); // Prepend to be before select element

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor');
  contentDiv.append(buttonDiv);

  const buttonLink = document.createElement('a');
  buttonLink.classList.add('cmp-button');
  buttonLink.href = selectedOptionLink;
  buttonDiv.append(buttonLink);
  // moveInstrumentation(buttonLabelRow, buttonLink); // Instrumentation should be on the span for text

  const buttonSpan = document.createElement('span');
  buttonSpan.classList.add('cmp-button__text');
  buttonSpan.textContent = buttonLabel;
  buttonLink.append(buttonSpan);
  moveInstrumentation(buttonLabelRow, buttonSpan); // Instrumentation on the text span

  // Dropdown interaction logic
  selectedDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    optionsDiv.classList.toggle('cmp-dropdown__select-hide');
    selectedDiv.classList.toggle('select-arrow-active');
  });

  optionsDiv.querySelectorAll('div').forEach((optionItem) => {
    optionItem.addEventListener('click', () => {
      const newSelectedText = optionItem.textContent;
      const newSelectedOption = selectEl.querySelector(`option[value="${newSelectedText}"]`);
      const newSelectedLink = newSelectedOption ? newSelectedOption.getAttribute('data-link') : '';

      selectedDiv.textContent = newSelectedText;
      selectedDiv.setAttribute('data-selected', newSelectedText);
      buttonLink.href = newSelectedLink;

      // Update the actual select element's value
      selectEl.value = newSelectedText;

      optionsDiv.classList.add('cmp-dropdown__select-hide');
      selectedDiv.classList.remove('select-arrow-active');
    });
  });

  document.addEventListener('click', () => {
    optionsDiv.classList.add('cmp-dropdown__select-hide');
    selectedDiv.classList.remove('select-arrow-active');
  });

  block.replaceChildren(root);
}
