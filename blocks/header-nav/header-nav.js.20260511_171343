import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isMobile = false) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from ORIGINAL HTML to list items
    li.classList.add('nav-menu-item', 'list-item');

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
      subWrap.classList.add('dropdown-menu'); // Class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        if (isMobile) {
          trigger.classList.add('dropdown-toggle', 'nav-item'); // Classes from ORIGINAL HTML
          trigger.href = '#';
        }

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Class from ORIGINAL HTML
          subWrap.classList.toggle('show'); // Class from ORIGINAL HTML
          if (isMobile) {
            subWrap.classList.toggle('show'); // Class from ORIGINAL HTML
          }
        });
      }
    } else if (anchor && isMobile) {
      anchor.classList.add('dropdown-item'); // Class from ORIGINAL HTML
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    mobileLogoRow,
    mobileLogoLinkRow,
    desktopLogoRow,
    desktopLogoLinkRow,
    ...itemRows
  ] = children;

  // Filter item rows based on cell count and content to match BlockJson models
  // main-navigation-item, sidebar-navigation-item, mobile-navigation-item all have 3 cells
  // mobile-sub-link-item has 2 cells
  const mainNavigationItems = itemRows.filter(
    (row) => row.children.length === 3 && row.querySelector('div:nth-child(3) ul') && !row.dataset.mobileSubLink,
  );
  const sidebarNavigationItems = itemRows.filter(
    (row) => row.children.length === 3 && !row.querySelector('div:nth-child(3) ul') && !row.dataset.mobileSubLink,
  );
  const mobileNavigationItems = itemRows.filter(
    (row) => row.children.length === 3 && row.querySelector('div:nth-child(3) ul') && !row.dataset.mobileSubLink,
  );
  const mobileSubLinkItems = itemRows.filter(
    (row) => row.children.length === 2,
  );

  // --- Header Top Menu Start ---
  const headerTopSection = document.createElement('section');
  headerTopSection.classList.add('bg_top'); // Class from ORIGINAL HTML
  const headerTopContainer = document.createElement('div');
  headerTopContainer.classList.add('container'); // Class from ORIGINAL HTML
  const headerTopRow = document.createElement('div');
  headerTopRow.classList.add('row'); // Class from ORIGINAL HTML
  const headerTopCol = document.createElement('div');
  headerTopCol.classList.add('col-md-12'); // Class from ORIGINAL HTML
  const topMenu = document.createElement('div');
  topMenu.classList.add('top_menu'); // Class from ORIGINAL HTML

  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.id = 'ctl00_moblog';
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto'); // Classes from ORIGINAL HTML
  const mobileLogoImg = mobileLogoRow.querySelector('picture');
  if (mobileLogoImg) {
    const img = mobileLogoImg.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(mobileLogoRow, optimizedPic.querySelector('img'));
    mobileLogoLink.append(optimizedPic);
  }
  const mobileLogoHref = mobileLogoLinkRow.querySelector('a');
  if (mobileLogoHref) {
    mobileLogoLink.href = mobileLogoHref.href;
  }
  moveInstrumentation(mobileLogoLinkRow, mobileLogoLink);

  const topMenuUl = document.createElement('ul');
  const mobileNavLi = document.createElement('li');
  const mobileNavIconDesktop = document.createElement('a');
  mobileNavIconDesktop.href = 'javascript:void(0);';
  mobileNavIconDesktop.classList.add('mobile_nav_icon', 'desktop-mobile_nav'); // Classes from ORIGINAL HTML
  mobileNavIconDesktop.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>'; // Replaced hardcoded image with inline SVG
  const mobileNavIconMobile = document.createElement('a');
  mobileNavIconMobile.href = 'javascript:void(0);';
  mobileNavIconMobile.classList.add('mobile_nav_icon', 'mobile_nav'); // Classes from ORIGINAL HTML
  mobileNavIconMobile.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>'; // Replaced hardcoded image with inline SVG
  mobileNavLi.append(mobileNavIconDesktop, mobileNavIconMobile);
  topMenuUl.append(mobileNavLi);

  topMenu.append(mobileLogoLink, topMenuUl);
  headerTopCol.append(topMenu);
  headerTopRow.append(headerTopCol);
  headerTopContainer.append(headerTopRow);
  headerTopSection.append(headerTopContainer);

  // --- Main Navigation Menu Start ---
  const parleMenu = document.createElement('div');
  parleMenu.classList.add('parle-menu'); // Class from ORIGINAL HTML
  const parleMenuContainer = document.createElement('div');
  parleMenuContainer.classList.add('container'); // Class from ORIGINAL HTML
  const parleMenuRow = document.createElement('div');
  parleMenuRow.classList.add('row'); // Class from ORIGINAL HTML

  const desktopLogoCol = document.createElement('div');
  desktopLogoCol.classList.add('col-md-2'); // Class from ORIGINAL HTML
  const desktopLogoDiv = document.createElement('div');
  desktopLogoDiv.id = 'ctl00_divdesktop';
  desktopLogoDiv.classList.add('logo'); // Class from ORIGINAL HTML
  const desktopLogoAnchor = document.createElement('a');
  desktopLogoAnchor.setAttribute('visible', 'false');
  const desktopLogoImg = desktopLogoRow.querySelector('picture');
  if (desktopLogoImg) {
    const img = desktopLogoImg.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(desktopLogoRow, optimizedPic.querySelector('img'));
    desktopLogoAnchor.append(optimizedPic);
  }
  const desktopLogoHref = desktopLogoLinkRow.querySelector('a');
  if (desktopLogoHref) {
    desktopLogoAnchor.href = desktopLogoHref.href;
  }
  moveInstrumentation(desktopLogoLinkRow, desktopLogoAnchor);
  desktopLogoDiv.append(desktopLogoAnchor);
  desktopLogoCol.append(desktopLogoDiv);

  const mainMenuCol = document.createElement('div');
  mainMenuCol.classList.add('col-md-9'); // Class from ORIGINAL HTML
  const mainMenu = document.createElement('div');
  mainMenu.classList.add('main-menu', 'cl-effect-5'); // Classes from ORIGINAL HTML
  const mainMenuUl = document.createElement('ul');

  mainNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Fixed schema, use destructuring
    const li = document.createElement('li');
    li.classList.add('position-static', 'dropdown'); // Classes from ORIGINAL HTML

    const anchor = document.createElement('a');
    anchor.textContent = labelCell.textContent.trim();
    const linkHref = linkCell.querySelector('a');
    if (linkHref) {
      anchor.href = linkHref.href;
    }
    anchor.innerHTML = `<abbr><span data-hover="${anchor.textContent}">${anchor.textContent}</span></abbr>`;
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      const megamenu = document.createElement('div');
      megamenu.classList.add('megamenu'); // Class from ORIGINAL HTML
      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2'); // Class from ORIGINAL HTML
      const megaMenuLinkRow = document.createElement('div');
      megaMenuLinkRow.classList.add('row', 'mega_menu_link'); // Classes from ORIGINAL HTML

      // Transform nested lists for desktop megamenu
      transformNestedLists(hierarchyUl);

      const col = document.createElement('div');
      col.classList.add('col-md-12'); // Adjust column size as needed, class from ORIGINAL HTML
      col.append(hierarchyUl);
      megaMenuLinkRow.append(col);
      mMenu2.append(megaMenuLinkRow);

      const menuClosed = document.createElement('div');
      menuClosed.classList.add('menu-closed'); // Class from ORIGINAL HTML
      menuClosed.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'; // Replaced hardcoded image with inline SVG

      megamenu.append(mMenu2, menuClosed);
      li.append(megamenu);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // Class from ORIGINAL HTML
      });
      menuClosed.addEventListener('click', () => {
        li.classList.remove('active'); // Class from ORIGINAL HTML
      });
    }
    mainMenuUl.append(li);
    moveInstrumentation(row, li);
  });

  const desktopMobileNavLi = document.createElement('li');
  desktopMobileNavLi.classList.add('no_sticky'); // Class from ORIGINAL HTML
  const desktopMobileNavAnchor = document.createElement('a');
  desktopMobileNavAnchor.href = 'javascript:void(0);';
  desktopMobileNavAnchor.classList.add('mobile_nav_icon', 'desktop-mobile_nav'); // Classes from ORIGINAL HTML
  desktopMobileNavAnchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>'; // Replaced hardcoded image with inline SVG
  desktopMobileNavLi.append(desktopMobileNavAnchor);
  mainMenuUl.append(desktopMobileNavLi);

  const stickyDesktopMobileNavLi = document.createElement('li');
  stickyDesktopMobileNavLi.classList.add('sticky'); // Class from ORIGINAL HTML
  const stickyDesktopMobileNavAnchor = document.createElement('a');
  stickyDesktopMobileNavAnchor.href = 'javascript:void(0);';
  stickyDesktopMobileNavAnchor.classList.add('mobile_nav_icon', 'desktop-mobile_nav'); // Classes from ORIGINAL HTML
  stickyDesktopMobileNavAnchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>'; // Replaced hardcoded image with inline SVG
  stickyDesktopMobileNavLi.append(stickyDesktopMobileNavAnchor);
  mainMenuUl.append(stickyDesktopMobileNavLi);

  mainMenu.append(mainMenuUl);
  mainMenuCol.append(mainMenu);

  const rightNavCol = document.createElement('div');
  rightNavCol.classList.add('col-md-1'); // Class from ORIGINAL HTML
  const logo2Div = document.createElement('div');
  logo2Div.classList.add('logo2'); // Class from ORIGINAL HTML
  rightNavCol.append(logo2Div);

  parleMenuRow.append(desktopLogoCol, mainMenuCol, rightNavCol);
  parleMenuContainer.append(parleMenuRow);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2'); // Classes from ORIGINAL HTML
  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main'); // Class from ORIGINAL HTML
  const closeIcon = document.createElement('a');
  closeIcon.href = 'javascript:void(0);';
  closeIcon.classList.add('mobile_nav_icon-close'); // Class from ORIGINAL HTML
  closeIcon.innerHTML = '<i class="lnr lnr-cross"></i>'; // Unicode cross icon
  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar'); // Class from ORIGINAL HTML
  menuSidebar.id = 'accordion';
  const sidebarUl = document.createElement('ul');
  sidebarUl.classList.add('list-unstyled', 'components'); // Classes from ORIGINAL HTML

  sidebarNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Fixed schema, use destructuring
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.textContent = labelCell.textContent.trim();
    const linkHref = linkCell.querySelector('a');
    if (linkHref) {
      anchor.href = linkHref.href;
    }
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      anchor.href = '#';
      anchor.classList.add('nav-link', 'collapsed'); // Classes from ORIGINAL HTML
      anchor.setAttribute('data-toggle', 'collapse');
      anchor.setAttribute('aria-expanded', 'false');
      const subMenuDiv = document.createElement('div');
      subMenuDiv.classList.add('list-unstyled', 'collapse'); // Classes from ORIGINAL HTML
      subMenuDiv.setAttribute('data-parent', '#accordion');
      const subMenuUl = document.createElement('ul');

      // Transform nested lists for sidebar
      transformNestedLists(hierarchyUl, true);

      // Append children from the transformed hierarchyUl
      while (hierarchyUl.firstChild) {
        subMenuUl.append(hierarchyUl.firstChild);
      }
      subMenuDiv.append(subMenuUl);
      li.append(anchor, subMenuDiv);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        subMenuDiv.classList.toggle('show'); // Class from ORIGINAL HTML
        anchor.classList.toggle('collapsed'); // Class from ORIGINAL HTML
      });
    } else {
      li.append(anchor);
    }
    sidebarUl.append(li);
    moveInstrumentation(row, li);
  });

  // Handle mobileSubLinkItems and append them to the sidebarUl
  mobileSubLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Fixed schema, use destructuring
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.textContent = labelCell.textContent.trim();
    const linkHref = linkCell.querySelector('a');
    if (linkHref) {
      anchor.href = linkHref.href;
    }
    li.append(anchor);
    sidebarUl.append(li);
    moveInstrumentation(row, li);
  });

  menuSidebar.append(sidebarUl);
  navbarResponsiveMain.append(closeIcon, menuSidebar);
  navbarCollapse.append(navbarResponsiveMain);
  parleMenuContainer.append(navbarCollapse);
  parleMenu.append(parleMenuContainer);

  // --- Mobile Menu Start ---
  const mobileMenu = document.createElement('div');
  mobileMenu.classList.add('mobile-menu'); // Class from ORIGINAL HTML
  const mobileCloseIcon = document.createElement('a');
  mobileCloseIcon.href = 'javascript:void(0);';
  mobileCloseIcon.classList.add('cros-icon'); // Class from ORIGINAL HTML
  mobileCloseIcon.innerHTML = '<span class="lnr lnr-cross"></span>'; // Unicode cross icon
  const mobileNavUl = document.createElement('ul');
  mobileNavUl.classList.add('navbar-nav'); // Class from ORIGINAL HTML

  mobileNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Fixed schema, use destructuring
    const li = document.createElement('li');
    li.classList.add('nav-item'); // Class from ORIGINAL HTML
    const anchor = document.createElement('a');
    anchor.classList.add('nav-link'); // Class from ORIGINAL HTML
    anchor.textContent = labelCell.textContent.trim();
    const linkHref = linkCell.querySelector('a');
    if (linkHref) {
      anchor.href = linkHref.href;
    }
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      anchor.href = '#';
      anchor.classList.add('dropdown-toggle', 'nav-item'); // Classes from ORIGINAL HTML
      const dropdownMenu = document.createElement('div');
      dropdownMenu.classList.add('dropdown-menu'); // Class from ORIGINAL HTML
      const subUl = document.createElement('ul');

      // Transform nested lists for mobile menu
      transformNestedLists(hierarchyUl, true);

      // Append children from the transformed hierarchyUl
      while (hierarchyUl.firstChild) {
        subUl.append(hierarchyUl.firstChild);
      }
      dropdownMenu.append(subUl);
      li.append(anchor, dropdownMenu);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // Class from ORIGINAL HTML
        dropdownMenu.classList.toggle('show'); // Class from ORIGINAL HTML
      });
    } else {
      li.append(anchor);
    }
    mobileNavUl.append(li);
    moveInstrumentation(row, li);
  });

  mobileMenu.append(mobileCloseIcon, mobileNavUl);

  // Toggle mobile menu and sidebar
  mobileNavIconDesktop.addEventListener('click', () => {
    navbarCollapse.classList.add('show'); // Class from ORIGINAL HTML
  });
  mobileNavIconMobile.addEventListener('click', () => {
    mobileMenu.classList.add('show'); // Class from ORIGINAL HTML
  });
  closeIcon.addEventListener('click', () => {
    navbarCollapse.classList.remove('show'); // Class from ORIGINAL HTML
  });
  mobileCloseIcon.addEventListener('click', () => {
    mobileMenu.classList.remove('show'); // Class from ORIGINAL HTML
  });

  block.replaceChildren(headerTopSection, parleMenu, mobileMenu);
}
