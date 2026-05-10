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
          subWrap.classList.toggle('show'); // Toggle 'show' class for Bootstrap collapse behavior
        });
      }
    }
  });
}

export default async function decorate(block) {
  // Load LNR icons CSS if not already loaded
  await loadCSS('/icons/lnr/style.css'); // Assuming lnr icons are in a clientlib or similar

  const sidebarNavItems = [...block.children];

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');

  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main');
  navbarCollapse.append(navbarResponsiveMain);

  const closeButton = document.createElement('a');
  closeButton.href = 'javascript:void(0);';
  closeButton.classList.add('mobile_nav_icon-close');
  closeButton.innerHTML = '<i class="lnr lnr-cross"></i>';
  navbarResponsiveMain.append(closeButton);

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar');
  menuSidebar.id = 'accordion';
  navbarResponsiveMain.append(menuSidebar);

  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled', 'components');
  menuSidebar.append(ul);

  sidebarNavItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const subList = hierarchyTreeCell?.querySelector('ul');
    const li = document.createElement('li');
    moveInstrumentation(row, li); // Move instrumentation for the list item

    if (subList) {
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell.textContent.trim();

      // Apply classes for accordion trigger
      anchor.classList.add('nav-link', 'collapsed');

      // Create a unique ID for the collapse target
      const collapseId = `homeSubmenu-${Math.random().toString(36).substring(2, 9)}`;
      anchor.setAttribute('aria-expanded', 'false');
      anchor.setAttribute('data-toggle', 'collapse'); // Add data-toggle for Bootstrap-like behavior
      anchor.setAttribute('href', `#${collapseId}`); // Link to the collapse target

      const subLinksContainer = document.createElement('div');
      subLinksContainer.classList.add('list-unstyled', 'collapse');
      subLinksContainer.id = collapseId;
      subLinksContainer.setAttribute('data-parent', '#accordion');

      const innerUl = document.createElement('ul');
      // Use a temporary div to hold innerHTML and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = subList.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from hierarchyTreeCell to tempDiv
      while (tempDiv.firstChild) {
        innerUl.append(tempDiv.firstChild);
      }
      subLinksContainer.append(innerUl);

      // Transform nested lists within the copied subList
      transformNestedLists(innerUl);

      // The event listener for the anchor is now handled by Bootstrap-like collapse behavior
      // No explicit JS listener needed here if using data-toggle attributes correctly.
      // However, if Bootstrap JS is not loaded, we need to manually toggle classes.
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        anchor.classList.toggle('collapsed');
        subLinksContainer.classList.toggle('show');
      });

      li.append(anchor);
      li.append(subLinksContainer);
    } else {
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    ul.append(li);
  });

  block.replaceChildren(navbarCollapse);

  // Close button functionality
  closeButton.addEventListener('click', () => {
    // Assuming the sidebar is controlled by a class on a parent element or the body
    // You might need to adjust this based on how the original site's JS hides the sidebar
    // For example, if it toggles a class on 'body' or another container:
    document.body.classList.remove('sidebar-open'); // Example class
    navbarCollapse.classList.remove('show'); // Example for direct collapse
  });

  // Optimize pictures if any are present (though none in this specific block's input)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
