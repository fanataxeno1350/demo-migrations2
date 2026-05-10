import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
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
      subWrap.classList.add('list-unstyled', 'collapse'); // Use classes from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('nav-link', 'collapsed'); // Use classes from ORIGINAL HTML
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          trigger.classList.toggle('collapsed');
          subWrap.classList.toggle('show'); // Use 'show' class for Bootstrap collapse behavior
        });
      }
    }
  });
}

export default async function decorate(block) {
  const navigationItems = [...block.children];

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');
  moveInstrumentation(block, navbarCollapse); // Move instrumentation from block to the new root

  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main');

  const closeButton = document.createElement('a');
  closeButton.href = 'javascript:void(0);';
  closeButton.classList.add('mobile_nav_icon-close');
  closeButton.innerHTML = '<i class="lnr lnr-cross"></i>';
  // Add event listener for close button if needed (not in original HTML but common for sidebar)
  closeButton.addEventListener('click', () => {
    navbarCollapse.classList.remove('show'); // Assuming 'show' class controls visibility
  });

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar');
  menuSidebar.id = 'accordion'; // Keep the ID for data-parent functionality

  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled', 'components');

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li); // Move instrumentation from row to li

    const hierarchyTree = hierarchyTreeCell?.querySelector('ul');
    const link = linkCell?.querySelector('a');

    if (hierarchyTree) {
      // Item with nested hierarchy
      const triggerLink = document.createElement('a');
      triggerLink.href = '#'; // Placeholder href for trigger
      triggerLink.textContent = labelCell.textContent.trim();
      triggerLink.classList.add('nav-link', 'collapsed'); // Classes from original HTML
      triggerLink.setAttribute('aria-expanded', 'false');

      // Use a unique ID for each collapsible submenu
      const submenuId = `submenu-${Math.random().toString(36).substring(2, 9)}`;
      triggerLink.setAttribute('data-target', `#${submenuId}`); // For accessibility
      triggerLink.setAttribute('aria-controls', submenuId);

      const subDiv = document.createElement('div');
      subDiv.classList.add('list-unstyled', 'collapse'); // Classes from original HTML
      subDiv.id = submenuId;
      subDiv.setAttribute('data-parent', '#accordion'); // Link to main accordion

      const subUl = document.createElement('ul');
      // Use a temporary div to parse innerHTML and preserve instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from cell to tempDiv

      // Append children from tempDiv to subUl
      while (tempDiv.firstChild) {
        subUl.append(tempDiv.firstChild);
      }

      transformNestedLists(subUl); // Recursively transform nested lists
      subDiv.append(subUl);

      li.append(triggerLink, subDiv);

      // Implement toggle behavior for the trigger link
      triggerLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerLink.classList.toggle('collapsed');
        subDiv.classList.toggle('show'); // Use 'show' class for Bootstrap collapse behavior
      });
    } else if (link) {
      // Simple link item
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    } else {
      // Label only (should not happen if link is always present for top-level items)
      const span = document.createElement('span');
      span.textContent = labelCell.textContent.trim();
      li.append(span);
    }
    ul.append(li);
  });

  menuSidebar.append(ul);
  navbarResponsiveMain.append(closeButton, menuSidebar);
  navbarCollapse.append(navbarResponsiveMain);

  block.replaceChildren(navbarCollapse);

  navbarCollapse.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
