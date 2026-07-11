import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    dropdownTitleRow,
    selectedLabelRow,
    ctaLinkRow,
    ctaLabelRow,
    ...dropdownOptionRows // dropdownOptionsContainerRow is not a distinct row in the model, it's the container for item rows
  ] = [...block.children];

  // Fix 0.7 A: querySelector('div') on text cells always returns null. Use textContent.trim() directly.
  const dropdownTitle = dropdownTitleRow?.textContent.trim();
  const selectedLabel = selectedLabelRow?.textContent.trim();
  const ctaLinkHref = ctaLinkRow?.querySelector('a')?.href;
  const ctaLabel = ctaLabelRow?.textContent.trim();

  const root = document.createElement('div');
  // Fix 0.5: Removed 'discover-dropdown' block class from inner wrapper. Outer block div already has it.
  root.classList.add('cmp-dropdown'); // Keep other classes from ORIGINAL HTML
  root.setAttribute('data-component', 'dropdown');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content', 'right-dropdown-title-aligned');
  root.append(contentDiv);

  if (dropdownTitle) {
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('cmp-dropdown__title');
    const titleHeading = document.createElement('h4');
    titleHeading.textContent = dropdownTitle;
    moveInstrumentation(dropdownTitleRow, titleHeading);
    titleDiv.append(titleHeading);
    contentDiv.append(titleDiv);
  }

  const customSelectDiv = document.createElement('div');
  customSelectDiv.classList.add('cmp-dropdown__custom-select');
  contentDiv.append(customSelectDiv);

  const selectEl = document.createElement('select');
  customSelectDiv.append(selectEl);

  const selectedDiv = document.createElement('div');
  selectedDiv.classList.add('cmp-dropdown__select-selected');
  if (selectedLabel) {
    selectedDiv.setAttribute('data-selected', selectedLabel);
    selectedDiv.textContent = selectedLabel;
    moveInstrumentation(selectedLabelRow, selectedDiv);
  }
  customSelectDiv.append(selectedDiv);

  const selectItemsDiv = document.createElement('div');
  selectItemsDiv.classList.add('cmp-dropdown__select-items', 'cmp-dropdown__select-hide');
  customSelectDiv.append(selectItemsDiv);

  const options = [];
  dropdownOptionRows.forEach((row) => {
    // Fix 0: Replaced querySelector('div:first-child') and querySelector('div:last-child')
    // with array destructuring for fixed-schema item rows.
    const [labelCell, linkCell] = [...row.children];

    const label = labelCell?.textContent.trim();
    const link = linkCell?.querySelector('a')?.href;

    if (label && link) {
      options.push({ label, link, row });

      const optionEl = document.createElement('option');
      optionEl.setAttribute('data-link', link);
      optionEl.value = label;
      optionEl.textContent = label;
      selectEl.append(optionEl);

      const itemDiv = document.createElement('div');
      itemDiv.textContent = label;
      moveInstrumentation(row, itemDiv);
      selectItemsDiv.append(itemDiv);
    }
  });

  // Set default selected option
  const defaultOption = options.find((opt) => opt.label === selectedLabel);
  if (defaultOption) {
    selectEl.value = defaultOption.label;
  } else if (options.length > 0) {
    selectEl.value = options[0].label;
    selectedDiv.setAttribute('data-selected', options[0].label);
    selectedDiv.textContent = options[0].label;
  }

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor');
  contentDiv.append(buttonDiv);

  // Fix 0.7 C: TDZ crash - ctaButtonLink was used before declaration in selectItemsDiv.querySelectorAll
  const ctaButtonLink = document.createElement('a');
  ctaButtonLink.classList.add('cmp-button');
  if (ctaLinkHref) {
    ctaButtonLink.href = ctaLinkHref;
    moveInstrumentation(ctaLinkRow, ctaButtonLink);
  } else if (defaultOption) {
    ctaButtonLink.href = defaultOption.link;
  } else if (options.length > 0) {
    ctaButtonLink.href = options[0].link;
  }

  const ctaButtonText = document.createElement('span');
  ctaButtonText.classList.add('cmp-button__text');
  if (ctaLabel) {
    ctaButtonText.textContent = ctaLabel;
    moveInstrumentation(ctaLabelRow, ctaButtonText);
  } else {
    ctaButtonText.textContent = 'Discover'; // Default text if not provided
  }
  ctaButtonLink.append(ctaButtonText);
  buttonDiv.append(ctaButtonLink);

  // Dropdown interaction
  selectedDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    selectItemsDiv.classList.toggle('cmp-dropdown__select-hide');
    selectedDiv.classList.toggle('select-arrow-active');
  });

  selectItemsDiv.querySelectorAll('div').forEach((itemDiv, index) => {
    itemDiv.addEventListener('click', () => {
      const selectedOption = options[index];
      selectedDiv.textContent = selectedOption.label;
      selectedDiv.setAttribute('data-selected', selectedOption.label);
      selectEl.value = selectedOption.label;
      selectItemsDiv.classList.add('cmp-dropdown__select-hide');
      selectedDiv.classList.remove('select-arrow-active');

      // Update CTA link
      if (ctaButtonLink) { // ctaButtonLink is now declared before this usage
        ctaButtonLink.href = selectedOption.link;
      }
    });
  });

  document.addEventListener('click', () => {
    selectItemsDiv.classList.add('cmp-dropdown__select-hide');
    selectedDiv.classList.remove('select-arrow-active');
  });

  // The dropdownOptionsContainerRow is not a distinct row in the model, it's the container for item rows.
  // Instrumentation for individual option rows is already moved.
  // If there was an explicit container row for options, it would be handled here.
  // For now, remove this line as it refers to a non-existent row variable.
  // moveInstrumentation(dropdownOptionsContainerRow, customSelectDiv);

  block.replaceChildren(root);

  // Image optimization (if any images were present)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
