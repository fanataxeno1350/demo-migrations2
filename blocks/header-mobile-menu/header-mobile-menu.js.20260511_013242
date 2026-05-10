import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    moveInstrumentation(li, li); // Instrument the li itself
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
      moveInstrumentation(nested, nested); // Instrument the nested ul
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('sub-menu');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        // Only add dropdown-toggle if it's not already there from the parent logic
        if (!trigger.classList.contains('dropdown-toggle')) {
          trigger.classList.add('dropdown-toggle', 'nav-item');
        }
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    } else if (anchor) {
      anchor.classList.add('dropdown-item');
    }
  });
}

export default function decorate(block) {
  const menu = document.createElement('div');
  menu.classList.add('mobile-menu');

  const closeButton = document.createElement('a');
  closeButton.href = 'javascript:void(0);';
  closeButton.classList.add('cros-icon');
  closeButton.innerHTML = '<span class="lnr lnr-cross"></span>';
  closeButton.addEventListener('click', () => {
    block.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
  menu.append(closeButton);

  const navList = document.createElement('ul');
  navList.classList.add('navbar-nav');

  [...block.children].forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('nav-item');

    const subList = hierarchyTreeCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a');

    if (subList) {
      const dropdownToggle = document.createElement('a');
      dropdownToggle.classList.add('dropdown-toggle', 'nav-item');
      dropdownToggle.href = directLink?.href || '#';
      dropdownToggle.textContent = labelCell.textContent.trim();
      moveInstrumentation(row, dropdownToggle); // Instrument the row to the dropdownToggle
      li.append(dropdownToggle);

      const dropdownMenu = document.createElement('div');
      dropdownMenu.classList.add('dropdown-menu');
      // Move instrumentation for the hierarchyTreeCell to the dropdownMenu
      moveInstrumentation(hierarchyTreeCell, dropdownMenu);
      dropdownMenu.append(subList);
      transformNestedLists(subList); // This function now instruments nested elements
      li.append(dropdownMenu);

      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
      });
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('nav-link');
      if (directLink) {
        anchor.href = directLink.href;
      }
      anchor.textContent = labelCell.textContent.trim();
      moveInstrumentation(row, anchor); // Instrument the row to the anchor
      li.append(anchor);
    }
    navList.append(li);
  });

  menu.append(navList);
  block.replaceChildren(menu);
}
