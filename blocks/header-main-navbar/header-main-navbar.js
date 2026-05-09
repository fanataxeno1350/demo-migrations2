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
      const subWrap = document.createElement('ul'); // Changed to ul to match original HTML structure
      subWrap.classList.add('dropdown-menu');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('nav-link', 'dropdown-toggle'); // Removed redundant 'nav-link-'
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('show');
          subWrap.classList.toggle('show');
          trigger.setAttribute('aria-expanded', subWrap.classList.contains('show'));
        });
      }
      // Apply dropdown-item to direct children anchors within a nested list
      li.querySelectorAll(':scope > ul > li > a').forEach((nestedAnchor) => {
        nestedAnchor.classList.add('dropdown-item');
      });
    } else if (anchor) {
      // For non-nested list items, the anchor itself is the dropdown-item
      anchor.classList.add('dropdown-item');
    }
  });
}

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    siteNameLine1Row,
    siteNameLine2Row,
    containerRow, // This row is a placeholder for the mainNavigation container
    ...mainNavigationRows
  ] = [...block.children];

  const nav = document.createElement('nav');
  nav.classList.add('navbar', 'navbar-expand-lg');
  nav.id = 'navbar-main';

  const logoLink = document.createElement('a');
  logoLink.classList.add('navbar-brand');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  logoLink.title = 'Home';
  logoLink.rel = 'home';
  moveInstrumentation(logoLinkRow, logoLink);

  const siteLogoDiv = document.createElement('div');
  siteLogoDiv.id = 'site-logo';
  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    siteLogoDiv.append(optimizedPic);
  }
  moveInstrumentation(logoRow, siteLogoDiv);
  logoLink.append(siteLogoDiv);

  const siteNameDiv = document.createElement('div');
  siteNameDiv.id = 'site-name';
  const siteNameLink = document.createElement('a');
  siteNameLink.classList.add('navbar-brand');
  siteNameLink.href = logoLinkRow.querySelector('a')?.href || '#';
  siteNameLink.title = 'Home';
  siteNameLink.rel = 'home';

  const coastalBendDiv = document.createElement('div');
  coastalBendDiv.id = 'coastal-bend';
  coastalBendDiv.textContent = siteNameLine1Row.textContent.trim();
  moveInstrumentation(siteNameLine1Row, coastalBendDiv);

  const councilOfGovDiv = document.createElement('div');
  councilOfGovDiv.id = 'council-of-gov';
  councilOfGovDiv.textContent = siteNameLine2Row.textContent.trim();
  moveInstrumentation(siteNameLine2Row, councilOfGovDiv);

  siteNameLink.append(coastalBendDiv, councilOfGovDiv);
  siteNameDiv.append(siteNameLink);

  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler', 'navbar-toggler-right');
  toggler.type = 'button';
  toggler.setAttribute('aria-controls', 'CollapsingNavbar');
  toggler.setAttribute('aria-expanded', 'false');
  toggler.setAttribute('aria-label', 'Toggle navigation');
  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('navbar-toggler-icon');
  toggler.append(togglerIcon);

  const collapsingNavbar = document.createElement('div');
  collapsingNavbar.classList.add('collapse', 'navbar-collapse', 'justify-content-end');
  collapsingNavbar.id = 'CollapsingNavbar';

  toggler.addEventListener('click', () => {
    collapsingNavbar.classList.toggle('show');
    const expanded = collapsingNavbar.classList.contains('show');
    toggler.setAttribute('aria-expanded', expanded);
  });

  const navBlock = document.createElement('nav');
  navBlock.role = 'navigation';
  navBlock.setAttribute('aria-labelledby', 'block-cbcog-main-menu-menu');
  navBlock.id = 'block-cbcog-main-menu';
  navBlock.classList.add('block', 'block-menu', 'navigation', 'menu--main');
  moveInstrumentation(containerRow, navBlock); // Move instrumentation from the container placeholder

  const h2 = document.createElement('h2');
  h2.classList.add('visually-hidden');
  h2.id = 'block-cbcog-main-menu-menu';
  h2.textContent = 'Main navigation'; // Hardcoded, but matches original HTML
  navBlock.append(h2);

  const ul = document.createElement('ul');
  ul.id = 'block-cbcog-main-menu';
  ul.classList.add('clearfix', 'nav', 'navbar-nav');

  mainNavigationRows
    .filter((row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
      const li = document.createElement('li');
      li.classList.add('nav-item');
      moveInstrumentation(row, li);

      const subList = hierarchyTreeCell?.querySelector('ul');
      if (subList) {
        li.classList.add('menu-item--expanded', 'dropdown');
        const span = document.createElement('span');
        span.classList.add('nav-link', 'dropdown-toggle'); // Removed redundant 'nav-link-'
        span.textContent = labelCell.textContent.trim();
        span.setAttribute('aria-expanded', 'false');
        span.setAttribute('aria-haspopup', 'true');
        li.append(span);

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('dropdown-menu');
        // Move instrumentation from the hierarchyTreeCell to the dropdownMenu
        moveInstrumentation(hierarchyTreeCell, dropdownMenu);
        // Append the subList's children directly to dropdownMenu
        while (subList.firstChild) {
          dropdownMenu.append(subList.firstChild);
        }
        li.append(dropdownMenu);

        transformNestedLists(dropdownMenu);

        span.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('show');
          dropdownMenu.classList.toggle('show');
          span.setAttribute('aria-expanded', dropdownMenu.classList.contains('show'));
        });
      } else {
        const anchor = document.createElement('a');
        anchor.classList.add('nav-link', 'nav-link--');
        anchor.href = linkCell.querySelector('a')?.href || '#';
        anchor.textContent = labelCell.textContent.trim();
        li.append(anchor);
      }
      ul.append(li);
    });

  navBlock.append(ul);
  collapsingNavbar.append(navBlock);
  nav.append(logoLink, siteNameDiv, toggler, collapsingNavbar);

  block.replaceChildren(nav);
}
