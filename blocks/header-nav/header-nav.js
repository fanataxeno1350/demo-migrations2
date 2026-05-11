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
      subWrap.classList.add('has-sub-child');
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

export default async function decorate(block) {
  const children = [...block.children];

  const mobileLogoRow = children[0];
  const mobileLogoLinkRow = children[1];
  const desktopLogoRow = children[2];
  const desktopLogoLinkRow = children[3];

  const itemRows = children.slice(4);

  // Filter for top-menu-icon-item (3 cells, first cell has picture)
  const topMenuIconRows = itemRows.filter(
    (row) => row.children.length === 3 && row.children[0]?.querySelector('picture'),
  );
  // Filter for main-navigation-item (3 cells, first cell is text, no picture)
  const mainNavigationRows = itemRows.filter(
    (row) => row.children.length === 3 && !row.children[0]?.querySelector('picture') && !row.children[0]?.querySelector('a'),
  );
  // Filter for sidebar-navigation-item (3 cells, first cell is text, no picture)
  // Note: This filter is identical to mainNavigationRows based on the current logic.
  // If there's a specific distinction, it needs to be added. For now, it's a separate filter.
  const sidebarNavigationRows = itemRows.filter(
    (row) => row.children.length === 3 && !row.children[0]?.querySelector('picture') && !row.children[0]?.querySelector('a'),
  );

  const header = document.createElement('header');
  header.classList.add('header', 'header-sticky');

  // Header Top Menu
  const bgTopSection = document.createElement('section');
  bgTopSection.classList.add('bg_top');
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  const colDiv = document.createElement('div');
  colDiv.classList.add('col-md-12');
  const topMenuDiv = document.createElement('div');
  topMenuDiv.classList.add('top_menu');

  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto');
  if (mobileLogoLinkRow) {
    const foundLink = mobileLogoLinkRow.querySelector('a');
    if (foundLink) mobileLogoLink.href = foundLink.href;
    moveInstrumentation(mobileLogoLinkRow, mobileLogoLink);
  } else {
    mobileLogoLink.href = '#';
  }

  if (mobileLogoRow) {
    const picture = mobileLogoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(mobileLogoRow, optimizedPic.querySelector('img'));
      mobileLogoLink.append(optimizedPic);
    }
  }

  topMenuDiv.append(mobileLogoLink);

  const topMenuUl = document.createElement('ul');

  topMenuIconRows.forEach((row) => {
    const [iconCell, iconLinkCell, hierarchyTreeCell] = [...row.children]; // Fixed: named destructuring
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('mobile_nav_icon', 'desktop-mobile_nav');
    const foundLink = iconLinkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    else anchor.href = 'javascript:void(0);';

    const picture = iconCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconCell, optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
    }
    moveInstrumentation(row, li);
    li.append(anchor);

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      const megamenu = document.createElement('div');
      megamenu.classList.add('megamenu');
      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2');
      const megaMenuLinkRow = document.createElement('div');
      megaMenuLinkRow.classList.add('row', 'mega_menu_link');

      // Create a temporary div to hold the hierarchy content for instrumentation and transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell

      const transformedUl = tempDiv.querySelector('ul');
      if (transformedUl) {
        transformNestedLists(transformedUl);
        megaMenuLinkRow.append(transformedUl);
      }
      mMenu2.append(megaMenuLinkRow);
      megamenu.append(mMenu2);
      li.classList.add('position-static', 'dropdown');
      li.append(megamenu);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
        megamenu.classList.toggle('active');
      });
    }

    topMenuUl.append(li);
  });

  topMenuDiv.append(topMenuUl);
  colDiv.append(topMenuDiv);
  rowDiv.append(colDiv);
  containerDiv.append(rowDiv);
  bgTopSection.append(containerDiv);
  header.append(bgTopSection);

  // Parle Menu
  const parleMenuDiv = document.createElement('div');
  parleMenuDiv.classList.add('parle-menu');
  const parleMenuContainer = document.createElement('div');
  parleMenuContainer.classList.add('container');
  const parleMenuRow = document.createElement('div');
  parleMenuRow.classList.add('row');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-2');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const desktopLogoAnchor = document.createElement('a');
  if (desktopLogoLinkRow) {
    const foundLink = desktopLogoLinkRow.querySelector('a');
    if (foundLink) desktopLogoAnchor.href = foundLink.href;
    moveInstrumentation(desktopLogoLinkRow, desktopLogoAnchor);
  } else {
    desktopLogoAnchor.href = '#';
  }

  if (desktopLogoRow) {
    const picture = desktopLogoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(desktopLogoRow, optimizedPic.querySelector('img'));
      desktopLogoAnchor.append(optimizedPic);
    }
  }

  logoDiv.append(desktopLogoAnchor);
  logoCol.append(logoDiv);
  parleMenuRow.append(logoCol);

  const mainMenuCol = document.createElement('div');
  mainMenuCol.classList.add('col-md-9');
  const mainMenuDiv = document.createElement('div');
  mainMenuDiv.classList.add('main-menu', 'cl-effect-5');
  const mainMenuUl = document.createElement('ul');

  mainNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Fixed: named destructuring
    const li = document.createElement('li');
    li.classList.add('position-static', 'dropdown');

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    else anchor.href = '#';

    const abbr = document.createElement('abbr');
    const span = document.createElement('span');
    span.setAttribute('data-hover', labelCell?.textContent.trim() || '');
    span.textContent = labelCell?.textContent.trim() || '';
    abbr.append(span);
    anchor.append(abbr);
    moveInstrumentation(row, li);
    li.append(anchor);

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      const megamenu = document.createElement('div');
      megamenu.classList.add('megamenu');
      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2');
      const megaMenuLinkRow = document.createElement('div');
      megaMenuLinkRow.classList.add('row', 'mega_menu_link');

      // Create a temporary div to hold the hierarchy content for instrumentation and transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell

      const transformedUl = tempDiv.querySelector('ul');
      if (transformedUl) {
        transformNestedLists(transformedUl);
        megaMenuLinkRow.append(transformedUl);
      }
      mMenu2.append(megaMenuLinkRow);
      megamenu.append(mMenu2);
      li.append(megamenu);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
        megamenu.classList.toggle('active');
      });
    }
    mainMenuUl.append(li);
  });

  mainMenuDiv.append(mainMenuUl);
  mainMenuCol.append(mainMenuDiv);
  parleMenuRow.append(mainMenuCol);

  const rightNavCol = document.createElement('div');
  rightNavCol.classList.add('col-md-1');
  const logo2Div = document.createElement('div');
  logo2Div.classList.add('logo2');
  rightNavCol.append(logo2Div);
  parleMenuRow.append(rightNavCol);

  parleMenuContainer.append(parleMenuRow);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');
  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main');

  const closeButton = document.createElement('a');
  closeButton.href = 'javascript:void(0);';
  closeButton.classList.add('mobile_nav_icon-close');
  closeButton.innerHTML = '<i class="lnr lnr-cross"></i>';
  navbarResponsiveMain.append(closeButton);

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar');
  menuSidebar.id = 'accordion';
  const sidebarUl = document.createElement('ul');
  sidebarUl.classList.add('list-unstyled', 'components');

  sidebarNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Fixed: named destructuring
    const li = document.createElement('li');
    moveInstrumentation(row, li); // Added instrumentation for sidebar list item

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.setAttribute('data-toggle', 'collapse');
      anchor.setAttribute('aria-expanded', 'false');
      anchor.classList.add('nav-link', 'collapsed');
      anchor.textContent = labelCell?.textContent.trim() || '';

      const collapseDiv = document.createElement('div');
      collapseDiv.classList.add('list-unstyled', 'collapse');
      collapseDiv.setAttribute('data-parent', '#accordion');

      // Create a temporary div to hold the hierarchy content for instrumentation and transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell

      const transformedUl = tempDiv.querySelector('ul');
      if (transformedUl) {
        transformNestedLists(transformedUl);
        collapseDiv.append(transformedUl);
      }

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        collapseDiv.classList.toggle('show');
        anchor.classList.toggle('collapsed');
      });

      li.append(anchor, collapseDiv);
    } else {
      const anchor = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      else anchor.href = '#';
      anchor.textContent = labelCell?.textContent.trim() || '';
      li.append(anchor);
    }
    sidebarUl.append(li);
  });

  menuSidebar.append(sidebarUl);
  navbarResponsiveMain.append(menuSidebar);
  navbarCollapse.append(navbarResponsiveMain);
  parleMenuContainer.append(navbarCollapse);
  parleMenuDiv.append(parleMenuContainer);
  header.append(parleMenuDiv);

  block.replaceChildren(header);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  const mobileNavIcons = block.querySelectorAll('.mobile_nav_icon');
  mobileNavIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      navbarCollapse.classList.add('show');
    });
  });

  closeButton.addEventListener('click', () => {
    navbarCollapse.classList.remove('show');
  });
}
