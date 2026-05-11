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
      subWrap.classList.add('list-unstyled', 'collapse'); // Classes from original HTML for collapsed state
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('nav-link', 'collapsed'); // Classes for trigger
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          trigger.classList.toggle('collapsed');
          subWrap.classList.toggle('show'); // Toggle 'show' class for collapse effect
        });
      }
    }
  });
}

export default function decorate(block) {
  const navigationItems = [...block.children];

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');
  moveInstrumentation(block, navbarCollapse);

  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main');
  navbarCollapse.append(navbarResponsiveMain);

  const closeButton = document.createElement('a');
  closeButton.href = 'javascript:void(0);';
  closeButton.classList.add('mobile_nav_icon-close');
  const closeIcon = document.createElement('i');
  closeIcon.classList.add('lnr', 'lnr-cross');
  closeButton.append(closeIcon);
  navbarResponsiveMain.append(closeButton);

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar');
  menuSidebar.id = 'accordion';
  navbarResponsiveMain.append(menuSidebar);

  const ul = document.createElement('ul');
  ul.classList.add('list-unstyled', 'components');
  menuSidebar.append(ul);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    const linkAnchor = linkCell?.querySelector('a');

    if (hierarchyUl) {
      // Item with nested hierarchy
      const triggerLink = document.createElement('a');
      triggerLink.href = '#'; // Placeholder href for trigger
      triggerLink.textContent = labelCell.textContent.trim();
      triggerLink.classList.add('nav-link', 'collapsed'); // Initial collapsed state
      triggerLink.setAttribute('aria-expanded', 'false');

      const subMenuId = `submenu-${Math.random().toString(36).substring(2, 9)}`;
      triggerLink.setAttribute('data-target', `#${subMenuId}`);

      const subMenuDiv = document.createElement('div');
      subMenuDiv.id = subMenuId;
      subMenuDiv.classList.add('list-unstyled', 'collapse');
      subMenuDiv.setAttribute('data-parent', '#accordion');

      // Move instrumentation from the original hierarchy cell to the new subMenuDiv
      // and then append the hierarchyUl's children to subMenuDiv
      moveInstrumentation(hierarchyTreeCell, subMenuDiv);
      while (hierarchyUl.firstChild) {
        subMenuDiv.append(hierarchyUl.firstChild);
      }

      // Implement toggle behavior with addEventListener
      triggerLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerLink.classList.toggle('collapsed');
        subMenuDiv.classList.toggle('show'); // Toggle 'show' class for collapse effect
      });

      li.append(triggerLink);
      li.append(subMenuDiv);

      // Apply classes to the nested UL and LI elements from the original HTML
      subMenuDiv.querySelectorAll('ul').forEach(nestedUl => nestedUl.classList.add('list-unstyled'));
      subMenuDiv.querySelectorAll('li').forEach(nestedLi => {
        const nestedAnchor = nestedLi.querySelector(':scope > a');
        if (nestedAnchor) {
          nestedAnchor.classList.add('nav-link');
        }
      });

      transformNestedLists(subMenuDiv); // Pass subMenuDiv to transform its children
    } else {
      // Simple link item
      const anchor = document.createElement('a');
      if (linkAnchor) {
        anchor.href = linkAnchor.href;
      }
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    ul.append(li);
  });

  block.replaceChildren(navbarCollapse);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
