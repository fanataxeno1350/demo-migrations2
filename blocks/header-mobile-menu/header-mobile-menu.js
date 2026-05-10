import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.classList.add('sub-menu'); // Add sub-menu class to nested ul as per ORIGINAL HTML

  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('nav-item'); // Add nav-item class to li as per ORIGINAL HTML
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      // Handle label-only nodes that might be plain text
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
      subWrap.classList.add('dropdown-menu'); // Use class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('dropdown-toggle', 'nav-item'); // Use classes from ORIGINAL HTML
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }

      // Recursively transform sub-menus
      transformNestedLists(nested);
    } else if (anchor) {
      anchor.classList.add('dropdown-item'); // Use class from ORIGINAL HTML for final links
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];
  const [closeIconLabelRow, ...navigationRows] = children;

  const mobileMenu = document.createElement('div');
  mobileMenu.classList.add('mobile-menu');

  const closeIconLink = document.createElement('a');
  closeIconLink.href = 'javascript:void(0);';
  closeIconLink.classList.add('cros-icon');
  moveInstrumentation(closeIconLabelRow, closeIconLink);
  closeIconLink.innerHTML = `<span class="lnr lnr-cross"></span>`;
  mobileMenu.append(closeIconLink);

  // Add event listener for the close icon
  closeIconLink.addEventListener('click', () => {
    // Example: Toggle a class on the mobileMenu to hide it
    // This assumes there's CSS to handle the 'hidden' class
    mobileMenu.classList.toggle('hidden');
    // Or, if it's a direct parent of the block and needs to close the whole block:
    block.classList.toggle('hidden');
  });

  const navList = document.createElement('ul');
  navList.classList.add('navbar-nav');

  navigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('nav-item');
    moveInstrumentation(row, li);

    const subList = hierarchyTreeCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent.trim();

    if (subList) {
      const parentLink = document.createElement('a');
      parentLink.href = directLink?.href || '#'; // Use direct link if available, otherwise fallback
      parentLink.textContent = labelText || '';
      parentLink.classList.add('dropdown-toggle', 'nav-item'); // Use classes from ORIGINAL HTML

      const dropdownMenu = document.createElement('div');
      dropdownMenu.classList.add('dropdown-menu'); // Use class from ORIGINAL HTML

      const tempDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for the richtext cell
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML; // Copy the inner HTML of the authored ul

      const innerUl = tempDiv.querySelector('ul');
      if (innerUl) {
        transformNestedLists(innerUl); // Transform nested lists within this dropdown
        dropdownMenu.append(innerUl);
      }

      parentLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
      });

      li.append(parentLink, dropdownMenu);
    } else {
      const anchor = document.createElement('a');
      if (directLink) {
        anchor.href = directLink.href;
      }
      anchor.textContent = labelText || '';
      anchor.classList.add('nav-link'); // Use class from ORIGINAL HTML
      li.append(anchor);
    }
    navList.append(li);
  });

  mobileMenu.append(navList);
  block.replaceChildren(mobileMenu);
}
