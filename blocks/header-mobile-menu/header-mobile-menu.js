import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Normalize label-only nodes if no anchor is present
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove(); // Remove the original nested ul
      nested.classList.add('sub-menu'); // Add sub-menu class from ORIGINAL HTML
      const subWrap = document.createElement('div');
      subWrap.classList.add('dropdown-menu'); // Use class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('dropdown-toggle', 'nav-item'); // Add classes for dropdown trigger
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Toggle active class on li
          subWrap.classList.toggle('active'); // Toggle active class on dropdown-menu
        });
      }
    } else if (anchor) {
      // If it's a leaf item in a nested list, it should be a dropdown-item
      anchor.classList.add('dropdown-item');
    }
  });
}

export default function decorate(block) {
  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('mobile-menu');

  const closeButton = document.createElement('a');
  closeButton.href = 'javascript:void(0);';
  closeButton.classList.add('cros-icon');
  closeButton.innerHTML = '<span class="lnr lnr-cross"></span>';
  // Add event listener for close button to hide the menu
  closeButton.addEventListener('click', () => menuWrapper.classList.remove('active')); // Assuming 'active' class shows the menu

  const navList = document.createElement('ul');
  navList.classList.add('navbar-nav');

  // Process each navigation-item row
  [...block.children].forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('nav-item');
    moveInstrumentation(row, li);

    const subList = hierarchyTreeCell?.querySelector('ul');
    const linkElement = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent.trim();

    if (subList) {
      // Item with a hierarchy (dropdown)
      const anchor = document.createElement('a');
      anchor.href = linkElement?.href || '#';
      anchor.textContent = labelText || '';
      anchor.classList.add('dropdown-toggle', 'nav-item'); // Use classes from ORIGINAL HTML

      const dropdownMenu = document.createElement('div');
      dropdownMenu.classList.add('dropdown-menu'); // Use class from ORIGINAL HTML
      subList.classList.add('sub-menu'); // Add sub-menu class to the authored ul
      dropdownMenu.append(subList); // Move the authored <ul> into the dropdown

      // Transform nested lists within this dropdown
      transformNestedLists(subList);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // Toggle active class on li
        dropdownMenu.classList.toggle('active'); // Toggle active class on dropdown-menu
      });

      li.append(anchor, dropdownMenu);
    } else {
      // Simple flat link
      const anchor = document.createElement('a');
      anchor.href = linkElement?.href || '#';
      anchor.textContent = labelText || '';
      anchor.classList.add('nav-link'); // Use class from ORIGINAL HTML
      li.append(anchor);
    }
    navList.append(li);
  });

  menuWrapper.append(closeButton, navList);
  block.replaceChildren(menuWrapper);
}
