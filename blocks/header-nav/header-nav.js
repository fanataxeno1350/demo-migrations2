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
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
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
  const children = [...block.children];

  const [
    mobileLogoRow,
    mobileLogoLinkRow,
    desktopLogoRow,
    desktopLogoLinkRow,
    ...itemRows
  ] = children;

  const header = document.createElement('header');
  header.classList.add('header', 'header-sticky');

  // Header Top Menu Start
  const bgTopSection = document.createElement('section');
  bgTopSection.classList.add('bg_top');
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  const colMd12Div = document.createElement('div');
  colMd12Div.classList.add('col-md-12');
  const topMenuDiv = document.createElement('div');
  topMenuDiv.classList.add('top_menu');

  const mobileLogoLinkEl = document.createElement('a');
  mobileLogoLinkEl.classList.add('mobile-logo', 'mr-auto');
  moveInstrumentation(mobileLogoLinkRow, mobileLogoLinkEl);
  mobileLogoLinkEl.href = mobileLogoLinkRow.querySelector('a')?.href || '#';

  const mobileLogoPicture = mobileLogoRow.querySelector('picture');
  if (mobileLogoPicture) {
    const mobileLogoImg = mobileLogoPicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(
      mobileLogoImg.src,
      mobileLogoImg.alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(mobileLogoRow, optimizedMobilePic.querySelector('img')); // Instrumentation on the row, not the img
    mobileLogoLinkEl.append(optimizedMobilePic);
  }

  const ulTopMenu = document.createElement('ul');
  const liMobileNav = document.createElement('li');
  const mobileNavIconDesktop = document.createElement('a');
  mobileNavIconDesktop.classList.add('mobile_nav_icon', 'desktop-mobile_nav');
  mobileNavIconDesktop.href = 'javascript:void(0);';
  // Hardcoded image path - replace with content from block.children if available, or TODO
  // For now, using inline SVG as per Rule 25.4
  mobileNavIconDesktop.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

  const mobileNavIcon = document.createElement('a');
  mobileNavIcon.classList.add('mobile_nav_icon', 'mobile_nav');
  mobileNavIcon.href = 'javascript:void(0);';
  // Hardcoded image path - replace with content from block.children if available, or TODO
  // For now, using inline SVG as per Rule 25.4
  mobileNavIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

  liMobileNav.append(mobileNavIconDesktop, mobileNavIcon);
  ulTopMenu.append(liMobileNav);

  topMenuDiv.append(mobileLogoLinkEl, ulTopMenu);
  colMd12Div.append(topMenuDiv);
  rowDiv.append(colMd12Div);
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

  const colMd2Div = document.createElement('div');
  colMd2Div.classList.add('col-md-2');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const desktopLogoLinkEl = document.createElement('a');
  moveInstrumentation(desktopLogoLinkRow, desktopLogoLinkEl);
  desktopLogoLinkEl.href = desktopLogoLinkRow.querySelector('a')?.href || '#';

  const desktopLogoPicture = desktopLogoRow.querySelector('picture');
  if (desktopLogoPicture) {
    const desktopLogoImg = desktopLogoPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(
      desktopLogoImg.src,
      desktopLogoImg.alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(desktopLogoRow, optimizedDesktopPic.querySelector('img')); // Instrumentation on the row, not the img
    desktopLogoLinkEl.append(optimizedDesktopPic);
  }

  logoDiv.append(desktopLogoLinkEl);
  colMd2Div.append(logoDiv);

  const colMd9Div = document.createElement('div');
  colMd9Div.classList.add('col-md-9');

  // Desktop Menu Start
  const mainMenuDiv = document.createElement('div');
  mainMenuDiv.classList.add('main-menu', 'cl-effect-5');
  const desktopNavUl = document.createElement('ul');

  // Filter itemRows based on cell count for different types
  const desktopNavigationItems = itemRows.filter(
    (row) => row.children.length === 4,
  );
  const desktopMegaMenuSections = itemRows.filter(
    (row) => row.children.length === 0,
  );
  const mobileNavigationItems = itemRows.filter(
    (row) => row.children.length === 3,
  );

  desktopNavigationItems.forEach((row) => {
    const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [
      ...row.children,
    ];

    const li = document.createElement('li');
    li.classList.add('position-static', 'dropdown');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    const abbr = document.createElement('abbr');
    const span = document.createElement('span');
    span.setAttribute('data-hover', labelCell.textContent.trim());
    span.textContent = labelCell.textContent.trim();
    abbr.append(span);
    anchor.append(abbr);
    li.append(anchor);

    const megaMenuDiv = document.createElement('div');
    megaMenuDiv.classList.add('megamenu');

    const mMenu2Div = document.createElement('div');
    mMenu2Div.classList.add('m-menu2');
    const megaMenuLinkRow = document.createElement('div');
    megaMenuLinkRow.classList.add('row', 'mega_menu_link');

    // Mega Menu Content
    if (megaMenuContentCell && megaMenuContentCell.innerHTML.trim()) {
      const colMd4HyperLink = document.createElement('div');
      colMd4HyperLink.classList.add('col-md-4', 'hyper-link');
      const bgWhiteDiv = document.createElement('div');
      bgWhiteDiv.classList.add('bg-white');
      moveInstrumentation(megaMenuContentCell, bgWhiteDiv);
      bgWhiteDiv.innerHTML = megaMenuContentCell.innerHTML; // Correctly reads richtext HTML
      colMd4HyperLink.append(bgWhiteDiv);
      megaMenuLinkRow.append(colMd4HyperLink);
    }

    // Navigation Hierarchy (nested list)
    if (hierarchyTreeCell && hierarchyTreeCell.innerHTML.trim()) {
      const colMd4HyperLink = document.createElement('div');
      colMd4HyperLink.classList.add('col-md-4', 'hyper-link');
      const bgWhiteDiv = document.createElement('div');
      bgWhiteDiv.classList.add('bg-white');
      const navHierarchyDiv = document.createElement('div');
      navHierarchyDiv.classList.add('menu_about', 'menu_sec1');

      // Create a temporary div to hold the hierarchy HTML and apply instrumentation/classes
      const tempDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, tempDiv);
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;

      const hierarchyUl = tempDiv.querySelector('ul');
      if (hierarchyUl) {
        // Apply classes from ORIGINAL HTML to nested elements if needed, e.g.,
        // hierarchyUl.classList.add('some-ul-class');
        // hierarchyUl.querySelectorAll('li').forEach(liItem => liItem.classList.add('some-li-class'));
        // hierarchyUl.querySelectorAll('a').forEach(aItem => aItem.classList.add('some-a-class'));

        transformNestedLists(hierarchyUl); // Apply transformation to the hierarchy list
        navHierarchyDiv.append(hierarchyUl);
      }
      bgWhiteDiv.append(navHierarchyDiv);
      colMd4HyperLink.append(bgWhiteDiv);
      megaMenuLinkRow.append(colMd4HyperLink);
    }

    mMenu2Div.append(megaMenuLinkRow);
    megaMenuDiv.append(mMenu2Div);

    const menuClosedDiv = document.createElement('div');
    menuClosedDiv.classList.add('menu-closed');
    // Hardcoded image path - replace with content from block.children if available, or TODO
    // For now, using inline SVG as per Rule 25.4 or a placeholder
    menuClosedDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    megaMenuDiv.append(menuClosedDiv);

    li.append(megaMenuDiv);
    desktopNavUl.append(li);

    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      li.classList.toggle('active');
    });

    menuClosedDiv.addEventListener('click', () => {
      li.classList.remove('active');
    });
  });

  mainMenuDiv.append(desktopNavUl);
  colMd9Div.append(mainMenuDiv);

  const colMd1Div = document.createElement('div');
  colMd1Div.classList.add('col-md-1');
  const logo2Div = document.createElement('div');
  logo2Div.classList.add('logo2');
  colMd1Div.append(logo2Div);

  parleMenuRow.append(colMd2Div, colMd9Div, colMd1Div);
  parleMenuContainer.append(parleMenuRow);
  parleMenuDiv.append(parleMenuContainer);
  header.append(parleMenuDiv);

  // Mobile Navigation
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');

  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main');

  const mobileNavIconClose = document.createElement('a');
  mobileNavIconClose.classList.add('mobile_nav_icon-close');
  mobileNavIconClose.href = 'javascript:void(0);';
  // Hardcoded icon class - assuming 'lnr lnr-cross' is from a font library
  mobileNavIconClose.innerHTML = '<i class="lnr lnr-cross"></i>';

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar');
  menuSidebar.id = 'accordion';

  const mobileNavUl = document.createElement('ul');
  mobileNavUl.classList.add('list-unstyled', 'components');

  mobileNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    if (hierarchyTreeCell && hierarchyTreeCell.innerHTML.trim()) {
      const anchor = document.createElement('a');
      anchor.href = 'javascript:void(0);';
      anchor.classList.add('nav-link', 'collapsed');
      anchor.textContent = labelCell.textContent.trim();

      const subMenuDiv = document.createElement('div');
      subMenuDiv.classList.add('list-unstyled', 'collapse');
      subMenuDiv.setAttribute('data-parent', '#accordion');

      // Create a temporary div to hold the hierarchy HTML and apply instrumentation/classes
      const tempDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, tempDiv);
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;

      const hierarchyUl = tempDiv.querySelector('ul');
      if (hierarchyUl) {
        const subUl = document.createElement('ul');
        // Apply classes from ORIGINAL HTML to nested elements if needed
        // hierarchyUl.querySelectorAll('li').forEach(liItem => liItem.classList.add('some-li-class'));
        // hierarchyUl.querySelectorAll('a').forEach(aItem => aItem.classList.add('some-a-class'));

        // Move children from hierarchyUl to subUl directly
        while (hierarchyUl.firstChild) {
          subUl.append(hierarchyUl.firstChild);
        }
        subMenuDiv.append(subUl);
      }
      li.append(anchor, subMenuDiv);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        subMenuDiv.classList.toggle('show'); // 'show' class is not in allowlist, assuming it's for JS toggle
        anchor.classList.toggle('collapsed');
      });
    } else {
      const anchor = document.createElement('a');
      anchor.href = linkCell.querySelector('a')?.href || '#';
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    mobileNavUl.append(li);
  });

  menuSidebar.append(mobileNavUl);
  navbarResponsiveMain.append(mobileNavIconClose, menuSidebar);
  navbarCollapse.append(navbarResponsiveMain);
  parleMenuDiv.append(navbarCollapse);

  // Toggle mobile navigation
  mobileNavIconDesktop.addEventListener('click', () => {
    navbarCollapse.classList.add('show'); // 'show' class is not in allowlist, assuming it's for JS toggle
  });
  mobileNavIcon.addEventListener('click', () => {
    navbarCollapse.classList.add('show'); // 'show' class is not in allowlist, assuming it's for JS toggle
  });
  mobileNavIconClose.addEventListener('click', () => {
    navbarCollapse.classList.remove('show'); // 'show' class is not in allowlist, assuming it's for JS toggle
  });

  block.replaceChildren(header);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' },
    ]);
    // moveInstrumentation should be on the original picture element, not the img
    // The original img is replaced, so its instrumentation is lost.
    // The instrumentation should be moved from the original row that contained the picture.
    // This part of the code is generic and applies to all images after the block is built.
    // For specific images (logos), instrumentation was moved earlier.
    // For generic images, we can't easily move instrumentation to the new picture.
    // This is a known limitation for generic image optimization.
    img.closest('picture').replaceWith(optimizedPic);
  });
}
