import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isMobile = false) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    let trigger;

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        trigger = span;
      }
    } else {
      trigger = anchor;
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('dropdown-menu'); // Use dropdown-menu for nested lists
      subWrap.append(nested);
      li.append(subWrap);

      if (trigger) {
        trigger.classList.add('dropdown-toggle', 'nav-item');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('show'); // Use 'show' class for Bootstrap-like dropdowns
        });
      }
    } else if (isMobile && anchor) {
      anchor.classList.add('dropdown-item');
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoMobileRow,
    logoMobileLinkRow,
    logoDesktopRow,
    logoDesktopLinkRow,
    ...itemRows
  ] = children;

  const topMenuIconItems = [];
  const desktopNavigationItems = [];
  const mobileNavigationItems = [];
  const sidebarNavigationItems = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) {
      const hasImage = cells[0].querySelector('picture');
      const hasLink = cells[1].querySelector('a');
      const hasHierarchy = cells[2].querySelector('ul');

      if (hasImage && hasLink && hasHierarchy) {
        // top-menu-icon-item: has image, link, and hierarchy
        topMenuIconItems.push(row);
      } else if (!hasImage && hasLink && hasHierarchy) {
        // desktop-navigation-item, mobile-navigation-item, sidebar-navigation-item: no image, has link, has hierarchy
        // Distinguish desktop, mobile, sidebar by position as per BlockJson order
        // This assumes the order in itemRows matches the order in BlockJson: desktop, then mobile, then sidebar
        if (desktopNavigationItems.length === 0) {
          desktopNavigationItems.push(row);
        } else if (mobileNavigationItems.length === 0) {
          mobileNavigationItems.push(row);
        } else {
          sidebarNavigationItems.push(row);
        }
      } else if (!hasImage && hasLink && !hasHierarchy) {
        // Fallback for items with only label and link, no hierarchy (e.g., simple menu items)
        // If the model implies a hierarchy, this case might not be fully accurate.
        // For now, adding to desktop as a default.
        desktopNavigationItems.push(row);
      }
    }
  });

  const header = document.createElement('header');
  header.classList.add('header', 'header-sticky');
  moveInstrumentation(block, header);

  // Header Top Menu
  const bgTopSection = document.createElement('section');
  bgTopSection.classList.add('bg_top');
  const topContainer = document.createElement('div');
  topContainer.classList.add('container');
  const topRow = document.createElement('div');
  topRow.classList.add('row');
  const topCol = document.createElement('div');
  topCol.classList.add('col-md-12');
  const topMenuDiv = document.createElement('div');
  topMenuDiv.classList.add('top_menu');

  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.id = 'ctl00_moblog';
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto');
  mobileLogoLink.href = logoMobileLinkRow?.querySelector('a')?.href || '#';
  if (logoMobileRow) {
    const mobilePicture = logoMobileRow.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      mobileLogoLink.append(optimizedPic);
    }
    moveInstrumentation(logoMobileRow, mobileLogoLink);
    moveInstrumentation(logoMobileLinkRow, mobileLogoLink);
  }

  const topMenuUl = document.createElement('ul');

  topMenuIconItems.forEach((row) => {
    const [iconImageCell, iconLinkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    const iconLink = document.createElement('a');
    iconLink.href = iconLinkCell?.querySelector('a')?.href || 'javascript:void(0);';

    if (iconImageCell) {
      const picture = iconImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        iconLink.append(optimizedPic);
      }
    }

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      iconLink.classList.add('mobile_nav_icon', 'desktop-mobile_nav');
      // No direct link, this is a menu trigger
      iconLink.href = 'javascript:void(0);';
      const menuWrapper = document.createElement('div');
      menuWrapper.classList.add('mobile-menu'); // Using mobile-menu for the dropdown content
      const closeIcon = document.createElement('a');
      closeIcon.href = 'javascript:void(0);';
      closeIcon.classList.add('cros-icon');
      closeIcon.innerHTML = '<span class="lnr lnr-cross"></span>';
      closeIcon.addEventListener('click', () => {
        menuWrapper.classList.remove('show');
        li.classList.remove('active');
      });
      menuWrapper.append(closeIcon);

      const navUl = document.createElement('ul');
      navUl.classList.add('navbar-nav');
      // Create a temporary div to hold the hierarchy content for instrumentation and transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from the original cell
      const tempUl = tempDiv.querySelector('ul');
      if (tempUl) {
        transformNestedLists(tempUl, true); // Transform for mobile
        navUl.append(...tempUl.children); // Append transformed li elements
      }
      menuWrapper.append(navUl);

      iconLink.addEventListener('click', (e) => {
        e.preventDefault();
        menuWrapper.classList.toggle('show');
        li.classList.toggle('active');
      });
      li.append(iconLink, menuWrapper);
    } else {
      iconLink.classList.add('mobile_nav_icon', 'mobile_nav');
      li.append(iconLink);
    }
    moveInstrumentation(row, li);
    topMenuUl.append(li);
  });

  topMenuDiv.append(mobileLogoLink, topMenuUl);
  topCol.append(topMenuDiv);
  topRow.append(topCol);
  topContainer.append(topRow);
  bgTopSection.append(topContainer);
  header.append(bgTopSection);

  // Desktop Menu
  const parleMenuDiv = document.createElement('div');
  parleMenuDiv.classList.add('parle-menu');
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row');

  const desktopLogoCol = document.createElement('div');
  desktopLogoCol.classList.add('col-md-2');
  const desktopLogoDiv = document.createElement('div');
  desktopLogoDiv.id = 'ctl00_divdesktop';
  desktopLogoDiv.classList.add('logo');
  const desktopLogoLink = document.createElement('a');
  desktopLogoLink.href = logoDesktopLinkRow?.querySelector('a')?.href || '#';
  if (logoDesktopRow) {
    const desktopPicture = logoDesktopRow.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      desktopLogoLink.append(optimizedPic);
    }
    moveInstrumentation(logoDesktopRow, desktopLogoLink);
    moveInstrumentation(logoDesktopLinkRow, desktopLogoLink);
  }
  desktopLogoDiv.append(desktopLogoLink);
  desktopLogoCol.append(desktopLogoDiv);

  const desktopNavCol = document.createElement('div');
  desktopNavCol.classList.add('col-md-9');
  const mainMenuDiv = document.createElement('div');
  mainMenuDiv.classList.add('main-menu', 'cl-effect-5');
  const desktopNavUl = document.createElement('ul');

  desktopNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('position-static', 'dropdown');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || 'javascript:void(0);';
    anchor.innerHTML = `<abbr><span data-hover="${labelCell.textContent.trim()}">${labelCell.textContent.trim()}</span></abbr>`;

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      const megamenu = document.createElement('div');
      megamenu.classList.add('megamenu');
      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2');
      const megaMenuLinkRow = document.createElement('div');
      megaMenuLinkRow.classList.add('row', 'mega_menu_link');

      const col = document.createElement('div');
      col.classList.add('col-md-4', 'hyper-link');
      const bgWhite = document.createElement('div');
      bgWhite.classList.add('bg-white');
      const menuAbout = document.createElement('div');
      menuAbout.classList.add('menu_about', 'menu_sec1');
      const subNavUl = document.createElement('ul');
      // Create a temporary div to hold the hierarchy content for instrumentation and transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from the original cell
      const tempUl = tempDiv.querySelector('ul');
      if (tempUl) {
        transformNestedLists(tempUl);
        subNavUl.append(...tempUl.children);
      }
      menuAbout.append(subNavUl);
      bgWhite.append(menuAbout);
      col.append(bgWhite);
      megaMenuLinkRow.append(col);

      mMenu2.append(megaMenuLinkRow);
      megamenu.append(mMenu2);

      const menuClosed = document.createElement('div');
      menuClosed.classList.add('menu-closed');
      // Placeholder for icon, as per original HTML, but without hardcoded path
      menuClosed.innerHTML = '<img alt="menu-closed-icon" src=""/>';
      menuClosed.addEventListener('click', () => {
        megamenu.classList.remove('active');
        li.classList.remove('active');
      });

      megamenu.append(menuClosed);
      li.append(anchor, megamenu);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
        megamenu.classList.toggle('active');
      });
    } else {
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    desktopNavUl.append(li);
  });

  mainMenuDiv.append(desktopNavUl);
  desktopNavCol.append(mainMenuDiv);

  const rightNavCol = document.createElement('div');
  rightNavCol.classList.add('col-md-1');
  const logo2Div = document.createElement('div');
  logo2Div.classList.add('logo2');
  rightNavCol.append(logo2Div);

  desktopRow.append(desktopLogoCol, desktopNavCol, rightNavCol);
  desktopContainer.append(desktopRow);
  parleMenuDiv.append(desktopContainer);
  header.append(parleMenuDiv);

  // Sidebar Navigation (using navbar-collapse structure from original HTML)
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');
  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main');

  const mobileNavIconClose = document.createElement('a');
  mobileNavIconClose.href = 'javascript:void(0);';
  mobileNavIconClose.classList.add('mobile_nav_icon-close');
  mobileNavIconClose.innerHTML = '<i class="lnr lnr-cross"></i>';
  mobileNavIconClose.addEventListener('click', () => {
    navbarCollapse.classList.remove('show');
  });

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar');
  menuSidebar.id = 'accordion';
  const sidebarUl = document.createElement('ul');
  sidebarUl.classList.add('list-unstyled', 'components');

  sidebarNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || 'javascript:void(0);';
    anchor.textContent = labelCell.textContent.trim();

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      anchor.classList.add('nav-link', 'collapsed');
      anchor.setAttribute('aria-expanded', 'false');
      const subMenuDiv = document.createElement('div');
      subMenuDiv.classList.add('list-unstyled', 'collapse');
      subMenuDiv.setAttribute('data-parent', '#accordion');
      const subUl = document.createElement('ul');
      // Create a temporary div to hold the hierarchy content for instrumentation and transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from the original cell
      const tempUl = tempDiv.querySelector('ul');
      if (tempUl) {
        transformNestedLists(tempUl); // Transform for sidebar
        subUl.append(...tempUl.children);
      }
      subMenuDiv.append(subUl);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        subMenuDiv.classList.toggle('show');
        anchor.classList.toggle('collapsed');
      });
      li.append(anchor, subMenuDiv);
    } else {
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    sidebarUl.append(li);
  });

  menuSidebar.append(sidebarUl);
  navbarResponsiveMain.append(mobileNavIconClose, menuSidebar);
  navbarCollapse.append(navbarResponsiveMain);
  header.append(navbarCollapse);

  block.replaceChildren(header);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
