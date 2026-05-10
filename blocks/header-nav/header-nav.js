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
      subWrap.classList.add('list-unstyled', 'collapse'); // Use classes from original HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('nav-link', 'collapsed'); // Use classes from original HTML
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          subWrap.classList.toggle('show'); // Use 'show' class for Bootstrap collapse behavior
          trigger.classList.toggle('collapsed');
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

  const mainNavigationItems = [];
  const mobileNavigationItems = [];
  const headerIconLinkItems = [];

  // Determine item types based on content and position
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) {
      const [cell0, cell1, cell2] = cells;
      const hasPictureInCell0 = cell0.querySelector('picture');
      const hasAnchorInCell1 = cell1.querySelector('a');
      const hasUlInCell2 = cell2.querySelector('ul');

      if (hasPictureInCell0 && hasAnchorInCell1) {
        // This is a header-icon-link-item
        headerIconLinkItems.push(row);
      } else if (!hasPictureInCell0 && hasAnchorInCell1 && hasUlInCell2) {
        // This is either a main-navigation-item or mobile-navigation-item
        // Distinguish by position: main nav items appear first, then mobile nav items
        // Assuming main nav items are the first 5 of this type based on original HTML example
        if (mainNavigationItems.length < 5) { // Adjust this number based on actual content
          mainNavigationItems.push(row);
        } else {
          mobileNavigationItems.push(row);
        }
      } else if (!hasPictureInCell0 && hasAnchorInCell1 && !hasUlInCell2) {
        // This could be a simple link in mobile nav or main nav without hierarchy
        // For now, assume it's part of mobile nav if it falls after main nav items
        if (mainNavigationItems.length < 5) { // Still filling main nav
          mainNavigationItems.push(row);
        } else {
          mobileNavigationItems.push(row);
        }
      }
    }
  });

  // Header Top Menu
  const headerTopSection = document.createElement('section');
  headerTopSection.classList.add('bg_top');
  moveInstrumentation(mobileLogoRow, headerTopSection); // Move instrumentation from first row

  const containerTop = document.createElement('div');
  containerTop.classList.add('container');
  headerTopSection.append(containerTop);

  const rowTop = document.createElement('div');
  rowTop.classList.add('row');
  containerTop.append(rowTop);

  const colMd12 = document.createElement('div');
  colMd12.classList.add('col-md-12');
  rowTop.append(colMd12);

  const topMenu = document.createElement('div');
  topMenu.classList.add('top_menu');
  colMd12.append(topMenu);

  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto');
  mobileLogoLink.href = mobileLogoLinkRow.querySelector('div > a')?.href || '#'; // Correctly read href from aem-content cell
  const mobileLogoPicture = mobileLogoRow.querySelector('picture');
  if (mobileLogoPicture) {
    const mobileLogoImg = mobileLogoPicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(mobileLogoImg.src, mobileLogoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(mobileLogoRow, optimizedMobilePic.querySelector('img'));
    mobileLogoLink.append(optimizedMobilePic);
  }
  topMenu.append(mobileLogoLink);

  const ulTopMenu = document.createElement('ul');
  topMenu.append(ulTopMenu);

  const liMobileNav = document.createElement('li');
  ulTopMenu.append(liMobileNav);

  const mobileNavIconDesktop = document.createElement('a');
  mobileNavIconDesktop.classList.add('mobile_nav_icon', 'desktop-mobile_nav');
  mobileNavIconDesktop.href = 'javascript:void(0);';
  // Use aem.js for image optimization if the icon is from DAM, otherwise inline SVG or CSS
  // Assuming these are hardcoded placeholders for now, as per original HTML
  mobileNavIconDesktop.innerHTML = '<img src="/icons/mobile-menu.png" class="img-fluid" alt="Menu"/>';

  const mobileNavIconMobile = document.createElement('a');
  mobileNavIconMobile.classList.add('mobile_nav_icon', 'mobile_nav');
  mobileNavIconMobile.href = 'javascript:void(0);';
  // Assuming these are hardcoded placeholders for now, as per original HTML
  mobileNavIconMobile.innerHTML = '<img src="/icons/menu-mobile-icon.png" class="img-fluid" alt="Menu"/>';

  liMobileNav.append(mobileNavIconDesktop, mobileNavIconMobile);

  // Main Navigation
  const parleMenu = document.createElement('div');
  parleMenu.classList.add('parle-menu');
  moveInstrumentation(desktopLogoRow, parleMenu); // Move instrumentation from desktop logo row

  const containerMain = document.createElement('div');
  containerMain.classList.add('container');
  parleMenu.append(containerMain);

  const rowMain = document.createElement('div');
  rowMain.classList.add('row');
  containerMain.append(rowMain);

  const colMd2 = document.createElement('div');
  colMd2.classList.add('col-md-2');
  rowMain.append(colMd2);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  colMd2.append(logoDiv);

  const desktopLogoAnchor = document.createElement('a');
  desktopLogoAnchor.href = desktopLogoLinkRow.querySelector('div > a')?.href || '#'; // Correctly read href from aem-content cell
  const desktopLogoPicture = desktopLogoRow.querySelector('picture');
  if (desktopLogoPicture) {
    const desktopLogoImg = desktopLogoPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(desktopLogoImg.src, desktopLogoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(desktopLogoRow, optimizedDesktopPic.querySelector('img'));
    desktopLogoAnchor.append(optimizedDesktopPic);
  }
  logoDiv.append(desktopLogoAnchor);

  const colMd9 = document.createElement('div');
  colMd9.classList.add('col-md-9');
  rowMain.append(colMd9);

  const mainMenu = document.createElement('div');
  mainMenu.classList.add('main-menu', 'cl-effect-5');
  colMd9.append(mainMenu);

  const ulMainMenu = document.createElement('ul');
  mainMenu.append(ulMainMenu);

  mainNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('position-static', 'dropdown');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.innerHTML = `<abbr><span data-hover="${labelCell.textContent.trim()}">${labelCell.textContent.trim()}</span></abbr>`;
    li.append(anchor);

    const subList = hierarchyTreeCell.querySelector('ul');
    if (subList) {
      const megamenu = document.createElement('div');
      megamenu.classList.add('megamenu');
      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2');
      const megaMenuLinkRow = document.createElement('div');
      megaMenuLinkRow.classList.add('row', 'mega_menu_link');

      const colMd4 = document.createElement('div');
      colMd4.classList.add('col-md-4', 'hyper-link');
      const bgWhite = document.createElement('div');
      bgWhite.classList.add('bg-white');
      colMd4.append(bgWhite);

      // The original HTML has complex structure here, not just the hierarchy-tree.
      // This part needs to be built based on the original HTML's content for each mega menu.
      // For now, we'll append the transformed hierarchy-tree.
      // TODO: Revisit this section to accurately replicate the complex mega menu structure from original HTML.
      const menuAbout = document.createElement('div');
      menuAbout.classList.add('menu_about', 'menu_sec1');
      const aboutMenuHead = document.createElement('div');
      aboutMenuHead.classList.add('about_menu_head');
      aboutMenuHead.textContent = labelCell.textContent.trim(); // Use the label as the head
      menuAbout.append(aboutMenuHead);

      const menuText = document.createElement('p');
      menuText.classList.add('menu_text');
      const menuTextAnchor = document.createElement('a');
      menuTextAnchor.href = anchor.href;
      menuTextAnchor.textContent = 'Explore more...'; // Generic text
      menuText.append(menuTextAnchor);
      menuAbout.append(menuText);
      bgWhite.append(menuAbout);

      const tempDiv = document.createElement('div');
      moveInstrumentation(hierarchyTreeCell, tempDiv);
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML; // Use innerHTML for richtext
      const nestedUl = tempDiv.querySelector('ul'); // Get the actual UL from the richtext
      if (nestedUl) {
        transformNestedLists(nestedUl);
        bgWhite.append(nestedUl); // Append the transformed sub-list
      }

      megaMenuLinkRow.append(colMd4);
      mMenu2.append(megaMenuLinkRow);
      megamenu.append(mMenu2);

      const menuClosed = document.createElement('div');
      menuClosed.classList.add('menu-closed');
      // Use aem.js for image optimization if the icon is from DAM, otherwise inline SVG or CSS
      menuClosed.innerHTML = '<img alt="menu-closed-icon" src="/icons/menu-closed-icon.webp"/>'; // Placeholder for icon
      megamenu.append(menuClosed);

      li.append(megamenu);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
      });
      menuClosed.addEventListener('click', () => {
        li.classList.remove('active');
      });
    }
    ulMainMenu.append(li);
  });

  const liNoSticky = document.createElement('li');
  liNoSticky.classList.add('no_sticky');
  const noStickyLink = document.createElement('a');
  noStickyLink.href = 'javascript:void(0);';
  noStickyLink.classList.add('mobile_nav_icon', 'desktop-mobile_nav');
  // Use aem.js for image optimization if the icon is from DAM, otherwise inline SVG or CSS
  noStickyLink.innerHTML = '<img src="/icons/mobile-menu.webp" class="img-fluid" alt="Menu"/>'; // Placeholder for icon
  liNoSticky.append(noStickyLink);
  ulMainMenu.append(liNoSticky);

  const liSticky = document.createElement('li');
  liSticky.classList.add('sticky');
  const stickyLink = document.createElement('a');
  stickyLink.href = 'javascript:void(0);';
  stickyLink.classList.add('mobile_nav_icon', 'desktop-mobile_nav');
  // Use aem.js for image optimization if the icon is from DAM, otherwise inline SVG or CSS
  stickyLink.innerHTML = '<img src="/icons/menu-black.webp" class="img-fluid" alt="Menu"/>'; // Placeholder for icon
  liSticky.append(stickyLink);
  ulMainMenu.append(liSticky);

  const colMd1 = document.createElement('div');
  colMd1.classList.add('col-md-1');
  rowMain.append(colMd1);

  const logo2 = document.createElement('div');
  logo2.classList.add('logo2');
  colMd1.append(logo2);

  // Mobile Navigation
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');
  containerMain.append(navbarCollapse);

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

  const ulMobileNav = document.createElement('ul');
  ulMobileNav.classList.add('list-unstyled', 'components');
  menuSidebar.append(ulMobileNav);

  mobileNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const tempDiv = document.createElement('div');
    moveInstrumentation(hierarchyTreeCell, tempDiv);
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML; // Use innerHTML for richtext
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      const anchor = document.createElement('a');
      anchor.href = 'javascript:void(0);';
      anchor.classList.add('nav-link', 'collapsed');
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);

      const divCollapse = document.createElement('div');
      divCollapse.classList.add('list-unstyled', 'collapse');
      divCollapse.id = `mobileSubmenu-${labelCell.textContent.trim().replace(/\s+/g, '-')}`;
      divCollapse.setAttribute('data-parent', '#accordion');
      transformNestedLists(subList); // Transform the actual subList
      divCollapse.append(subList); // Append the transformed subList
      li.append(divCollapse);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        divCollapse.classList.toggle('show');
        anchor.classList.toggle('collapsed');
      });
    } else {
      const anchor = document.createElement('a');
      anchor.href = linkCell.querySelector('a')?.href || '#';
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    ulMobileNav.append(li);
  });

  // Header icon links (e.g., search, menu icons)
  headerIconLinkItems.forEach((row) => {
    const [iconCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconCell, optimizedIconPic.querySelector('img'));
      anchor.append(optimizedIconPic);
    }
    li.append(anchor);

    const tempDiv = document.createElement('div');
    moveInstrumentation(hierarchyTreeCell, tempDiv);
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML; // Use innerHTML for richtext
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      const megamenu = document.createElement('div');
      megamenu.classList.add('megamenu'); // Use appropriate class from original HTML
      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2');
      const megaMenuLinkRow = document.createElement('div');
      megaMenuLinkRow.classList.add('row', 'mega_menu_link');

      const colMd4 = document.createElement('div');
      colMd4.classList.add('col-md-4', 'hyper-link');
      const bgWhite = document.createElement('div');
      bgWhite.classList.add('bg-white');
      colMd4.append(bgWhite);

      transformNestedLists(subList); // Transform the actual subList
      bgWhite.append(subList);

      megaMenuLinkRow.append(colMd4);
      mMenu2.append(megaMenuLinkRow);
      megamenu.append(mMenu2);

      const menuClosed = document.createElement('div');
      menuClosed.classList.add('menu-closed');
      // Use aem.js for image optimization if the icon is from DAM, otherwise inline SVG or CSS
      menuClosed.innerHTML = '<img alt="menu-closed-icon" src="/icons/menu-closed-icon.webp"/>'; // Placeholder for icon
      megamenu.append(menuClosed);

      li.append(megamenu);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
      });
      menuClosed.addEventListener('click', () => {
        li.classList.remove('active');
      });
    }
    ulTopMenu.append(li); // Append to the top menu for now, adjust as per original HTML structure
  });

  // Replace block content
  block.replaceChildren(headerTopSection, parleMenu);

  // Event listeners for mobile nav toggle
  [mobileNavIconDesktop, mobileNavIconMobile].forEach((toggler) => {
    toggler.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show');
    });
  });
  closeButton.addEventListener('click', () => {
    navbarCollapse.classList.remove('show');
  });

  // This block.querySelectorAll('picture > img') loop is redundant if createOptimizedPicture is used correctly above.
  // It should be removed. The optimized pictures are already created and appended.
  // Keeping it commented out for now, but it should be removed in a final version.
  /*
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  */
}
