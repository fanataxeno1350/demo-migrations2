import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      // No 'has-sub-child' class in ORIGINAL HTML, removing.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const allRows = [...block.children];

  // According to BlockJson, the root fields are:
  // 0: container "links" (item rows follow)
  // 1: text "dropdownLabel"
  // 2: container "dropdownItems" (item rows follow)
  // The JS needs to parse these correctly.
  // The first three rows are placeholders for the containers and the dropdownLabel.
  // The actual item rows start from index 0 for 'links' and then 'dropdownItems'.

  // Let's re-evaluate the row parsing based on the BlockJson and EDS structure.
  // The block.children will contain:
  // [0] - Placeholder for 'links' container (empty div)
  // [1] - Row for 'dropdownLabel'
  // [2] - Placeholder for 'dropdownItems' container (empty div)
  // [3...] - Actual item rows for 'footer-language-link-item' and 'footer-language-dropdown-item'

  // The generated JS's initial parsing of children[0], children[1], children[2] is correct
  // for the placeholder rows and the dropdownLabel row.
  const linksContainerPlaceholder = allRows[0]; // Placeholder for 'links' container
  const dropdownLabelRow = allRows[1]; // field="dropdownLabel"
  const dropdownItemsContainerPlaceholder = allRows[2]; // Placeholder for 'dropdownItems' container

  // The actual item rows start from index 3.
  const itemRows = allRows.slice(3);

  // Distinguish item types based on cell count as per BlockJson:
  // footer-language-link-item: 3 cells (label, link, hierarchy-tree)
  // footer-language-dropdown-item: 2 cells (label, link)
  const footerLanguageLinkItems = itemRows.filter(
    (row) => row.children.length === 3,
  );
  const footerLanguageDropdownItems = itemRows.filter(
    (row) => row.children.length === 2,
  );

  const root = document.createElement('ul');
  root.classList.add('site-footer-nav', '-language-switcher');

  // Process footerLanguageLinkItems (these are the "Contact Us" type links in the original HTML)
  footerLanguageLinkItems.forEach((row) => {
    // Use destructuring for fixed schema cells
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('site-footer-nav-item');

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    // The original HTML shows <strong> for the contact link, so we'll add it here.
    const strong = document.createElement('strong');
    strong.textContent = labelCell.textContent.trim();
    link.append(strong);

    moveInstrumentation(row, li);
    li.append(link);
    root.append(li);

    // Process hierarchy-tree if it exists
    // The original HTML does NOT show a hierarchy-tree for the language switcher.
    // However, the BlockJson model *does* include it for 'footer-language-link-item'.
    // This means the block is designed to handle this structure, even if the example HTML doesn't show it.
    // We must process it as per the BlockJson.
    const hierarchyTempDiv = document.createElement('div');
    hierarchyTempDiv.innerHTML = hierarchyTreeCell.innerHTML; // Use innerHTML for richtext

    const hierarchyUl = hierarchyTempDiv.querySelector('ul');
    if (hierarchyUl) {
      // Apply classes from original HTML if applicable, or reasonable defaults for nested lists.
      // The ORIGINAL HTML does not provide classes for this nested structure, so we'll use generic ones
      // or assume the transformNestedLists function handles it.
      // The 'footer-nav-section' class was invented, removing.
      transformNestedLists(hierarchyUl);
      // Move instrumentation from the original cell to the new hierarchyUl
      moveInstrumentation(hierarchyTreeCell, hierarchyUl);
      li.append(hierarchyUl); // Append the transformed hierarchy directly
    }
  });

  // Process dropdownLabel and footerLanguageDropdownItems
  const dropdownLi = document.createElement('li');
  dropdownLi.classList.add('site-footer-nav-item', '-margin-reduced');

  const linkDropdown = document.createElement('div');
  linkDropdown.classList.add('link-dropdown');
  linkDropdown.dataset.module = 'link-dropdown';
  linkDropdown.dataset.features = 'position-up';
  // Read language data from dropdownLabelRow if available, otherwise hardcode as per original HTML.
  // The original HTML has `data-language='{"label":"Change Language"}'`
  linkDropdown.dataset.language = '{"label":"Change Language"}';
  linkDropdown.dataset.is = 'closed';

  const toggleButton = document.createElement('button');
  toggleButton.classList.add('link-dropdown-toggle');
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.setAttribute('aria-controls', 'change-language-dropdown');
  toggleButton.textContent = dropdownLabelRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  moveInstrumentation(dropdownLabelRow, toggleButton);

  const dropdownList = document.createElement('ul');
  dropdownList.classList.add('link-dropdown-list');
  dropdownList.dataset.dropdownList = '';
  dropdownList.id = 'change-language-dropdown';

  footerLanguageDropdownItems.forEach((row) => {
    // Use destructuring for fixed schema cells
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('link-dropdown-item');

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.setAttribute('tabindex', '-1');
    link.textContent = labelCell.textContent.trim();

    moveInstrumentation(row, li);
    li.append(link);
    dropdownList.append(li);
  });

  linkDropdown.append(toggleButton, dropdownList);
  dropdownLi.append(linkDropdown);
  root.append(dropdownLi);

  // Add event listener for dropdown toggle
  toggleButton.addEventListener('click', () => {
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    toggleButton.setAttribute('aria-expanded', !isExpanded);
    linkDropdown.dataset.is = isExpanded ? 'closed' : 'open';
    // The original HTML doesn't show a 'show' class, but toggles data-is.
    // If CSS relies on 'show', it should be added to the allowlist.
    // For now, relying on data-is="open" / data-is="closed" for styling.
    // dropdownList.classList.toggle('show');
  });

  // Move instrumentation from the placeholder rows to their respective generated elements.
  moveInstrumentation(linksContainerPlaceholder, root);
  moveInstrumentation(dropdownItemsContainerPlaceholder, dropdownLi);

  block.replaceChildren(root);
}
