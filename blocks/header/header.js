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
      subWrap.classList.add('sub-menu');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('dropdown-toggle', 'nav-item');
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

export default async function decorate(block) {
  const children = [...block.children];

  const [
    mobileLogoRow,
    mobileLogoLinkRow,
    desktopLogoRow,
    desktopLogoLinkRow,
    ...itemRows
  ] = children;

  const topMenuIconRows = [];
  const desktopNavigationRows = [];
  const mobileNavigationRows = [];
  const sidebarLinkRows = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) {
      const hasImage = cells[0].querySelector('picture');
      const hasLink = cells[1].querySelector('a');
      const hasHierarchy = cells[2].querySelector('ul'); // Check for hierarchy-tree

      if (hasImage && hasLink) {
        topMenuIconRows.push(row);
      } else if (!hasImage && hasLink && hasHierarchy) {
        // Distinguish desktop and mobile nav based on position and original HTML
        // Desktop nav items come before mobile nav items in the block structure
        // This logic is fragile, but matches the original intent of the generated code.
        // A more robust solution would involve explicit markers in the content or a more complex filter.
        if (desktopNavigationRows.length === 0 || desktopNavigationRows.some(r => r.compareDocumentPosition(row) === Node.DOCUMENT_POSITION_FOLLOWING)) {
          desktopNavigationRows.push(row);
        } else if (mobileNavigationRows.length === 0 || mobileNavigationRows.some(r => r.compareDocumentPosition(row) === Node.DOCUMENT_POSITION_FOLLOWING)) {
          mobileNavigationRows.push(row);
        } else {
          sidebarLinkRows.push(row);
        }
      } else {
        // Fallback for any other 3-cell rows, assuming they are sidebar links if not caught above
        sidebarLinkRows.push(row);
      }
    }
  });

  // Create the main header structure
  const header = document.createElement('header');
  header.classList.add('header', 'header-sticky');
  moveInstrumentation(block, header); // Move instrumentation from block to new root

  // Header Top Menu Start
  const bgTop = document.createElement('section');
  bgTop.classList.add('bg_top');
  const containerTop = document.createElement('div');
  containerTop.classList.add('container');
  const rowTop = document.createElement('div');
  rowTop.classList.add('row');
  const colMd12 = document.createElement('div');
  colMd12.classList.add('col-md-12');
  const topMenu = document.createElement('div');
  topMenu.classList.add('top_menu');

  // Mobile Logo
  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto');
  moveInstrumentation(mobileLogoLinkRow, mobileLogoLink);
  const mobileLogoHref = mobileLogoLinkRow.querySelector('a')?.href;
  if (mobileLogoHref) mobileLogoLink.href = mobileLogoHref;
  const mobileLogoPicture = mobileLogoRow.querySelector('picture');
  if (mobileLogoPicture) {
    const mobileImg = mobileLogoPicture.querySelector('img');
    if (mobileImg) {
      const optimizedPic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(mobileImg, optimizedPic.querySelector('img'));
      mobileLogoLink.append(optimizedPic);
    }
  }
  topMenu.append(mobileLogoLink);

  // Top menu icons (mobile_nav_icon)
  const topMenuUl = document.createElement('ul');
  topMenuIconRows.forEach((row) => {
    const [iconCell, iconLinkCell, hierarchyCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    const iconAnchor = document.createElement('a');
    iconAnchor.classList.add('mobile_nav_icon');
    moveInstrumentation(row, iconAnchor);

    const iconHref = iconLinkCell.querySelector('a')?.href;
    if (iconHref) iconAnchor.href = iconHref;
    else iconAnchor.href = 'javascript:void(0);'; // Fallback if no link

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      if (iconImg) {
        const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
        iconAnchor.append(optimizedPic);
      }
    }

    const hierarchyUl = hierarchyCell.querySelector('ul');
    if (hierarchyUl) {
      // This is a menu icon with a dropdown
      iconAnchor.classList.add('desktop-mobile_nav'); // Example class from original
      const mobileNavIcon = iconAnchor.cloneNode(true);
      mobileNavIcon.classList.remove('desktop-mobile_nav');
      mobileNavIcon.classList.add('mobile_nav');

      li.append(iconAnchor, mobileNavIcon);
    } else {
      // Simple icon link
      li.append(iconAnchor);
    }
    topMenuUl.append(li);
  });
  topMenu.append(topMenuUl);

  colMd12.append(topMenu);
  rowTop.append(colMd12);
  containerTop.append(rowTop);
  bgTop.append(containerTop);
  header.append(bgTop);
  // Header Top Menu End

  // Main navigation
  const parleMenu = document.createElement('div');
  parleMenu.classList.add('parle-menu');
  const containerMain = document.createElement('div');
  containerMain.classList.add('container');
  const rowMain = document.createElement('div');
  rowMain.classList.add('row');

  const colLogo = document.createElement('div');
  colLogo.classList.add('col-md-2');
  const desktopLogoDiv = document.createElement('div');
  desktopLogoDiv.classList.add('logo');
  const desktopLogoLink = document.createElement('a');
  moveInstrumentation(desktopLogoLinkRow, desktopLogoLink);
  const desktopLogoHref = desktopLogoLinkRow.querySelector('a')?.href;
  if (desktopLogoHref) desktopLogoLink.href = desktopLogoHref;
  const desktopLogoPicture = desktopLogoRow.querySelector('picture');
  if (desktopLogoPicture) {
    const desktopImg = desktopLogoPicture.querySelector('img');
    if (desktopImg) {
      const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(desktopImg, optimizedPic.querySelector('img'));
      desktopLogoLink.append(optimizedPic);
    }
  }
  desktopLogoDiv.append(desktopLogoLink);
  colLogo.append(desktopLogoDiv);
  rowMain.append(colLogo);

  const colNav = document.createElement('div');
  colNav.classList.add('col-md-9');

  // Desktop Menu Start
  const mainMenu = document.createElement('div');
  mainMenu.classList.add('main-menu', 'cl-effect-5');
  const desktopNavUl = document.createElement('ul');

  desktopNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    li.classList.add('position-static');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const linkHref = linkCell.querySelector('a')?.href;
    if (linkHref) anchor.href = linkHref;
    else anchor.href = 'javascript:void(0);'; // Fallback if no link

    const abbr = document.createElement('abbr');
    const span = document.createElement('span');
    span.setAttribute('data-hover', labelCell.textContent.trim());
    span.textContent = labelCell.textContent.trim();
    abbr.append(span);
    anchor.append(abbr);

    const hierarchyUl = hierarchyCell.querySelector('ul');
    if (hierarchyUl) {
      li.classList.add('dropdown');
      const megamenu = document.createElement('div');
      megamenu.classList.add('megamenu');
      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2');
      const megaMenuLinkRow = document.createElement('div');
      megaMenuLinkRow.classList.add('row', 'mega_menu_link');

      // Transform the hierarchy UL into the megamenu structure
      const colMd4 = document.createElement('div');
      colMd4.classList.add('col-md-4', 'hyper-link');
      const bgWhite = document.createElement('div');
      bgWhite.classList.add('bg-white');
      const menuAbout = document.createElement('div');
      menuAbout.classList.add('menu_about', 'menu_sec1');
      const aboutMenuHead = document.createElement('div');
      aboutMenuHead.classList.add('about_menu_head');
      aboutMenuHead.textContent = labelCell.textContent.trim(); // Use label as section head
      menuAbout.append(aboutMenuHead);

      const menuText = document.createElement('p');
      menuText.classList.add('menu_text');

      // Create a temporary div to hold the hierarchy content and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      const subNavUl = tempDiv.querySelector('ul'); // Get the actual UL from the richtext
      if (subNavUl) {
        // Apply classes to nested elements if needed, based on ORIGINAL HTML
        subNavUl.querySelectorAll('a').forEach(a => a.classList.add('dropdown-item')); // Example class
        // No explicit classes for ul/li in original, but if there were, apply them here
        menuText.append(subNavUl);
      } else {
        // Fallback if no UL found in richtext, just append text content
        menuText.textContent = hierarchyCell.textContent.trim();
      }

      menuAbout.append(menuText);
      bgWhite.append(menuAbout);
      colMd4.append(bgWhite);
      megaMenuLinkRow.append(colMd4);

      mMenu2.append(megaMenuLinkRow);
      megamenu.append(mMenu2);

      const menuClosed = document.createElement('div');
      menuClosed.classList.add('menu-closed');
      // Hardcoded SVG path replaced with a placeholder or inline SVG if available
      // For now, using a generic cross icon as per original HTML's mobile close button
      menuClosed.innerHTML = '<i class="lnr lnr-cross"></i>';
      megamenu.append(menuClosed);

      li.append(megamenu);

      anchor.addEventListener('mouseenter', () => {
        megamenu.classList.add('active');
      });
      li.addEventListener('mouseleave', () => {
        megamenu.classList.remove('active');
      });
      menuClosed.addEventListener('click', () => {
        megamenu.classList.remove('active');
      });
    }

    li.prepend(anchor);
    desktopNavUl.append(li);
  });

  mainMenu.append(desktopNavUl);
  colNav.append(mainMenu);
  // Desktop Menu End

  // Right Navigation Menu Start (Sidebar)
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');
  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main');

  const closeBtn = document.createElement('a');
  closeBtn.href = 'javascript:void(0);';
  closeBtn.classList.add('mobile_nav_icon-close');
  closeBtn.innerHTML = '<i class="lnr lnr-cross"></i>';
  closeBtn.addEventListener('click', () => {
    navbarCollapse.classList.remove('show');
  });
  navbarResponsiveMain.append(closeBtn);

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar');
  menuSidebar.id = 'accordion';
  const sidebarUl = document.createElement('ul');
  sidebarUl.classList.add('list-unstyled', 'components');

  sidebarLinkRows.forEach((row, index) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const hierarchyUl = hierarchyCell.querySelector('ul');
    if (hierarchyUl) {
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.classList.add('nav-link', 'collapsed');
      anchor.textContent = labelCell.textContent.trim();
      const targetId = `sidebarSubmenu-${index}`; // Use index for unique ID
      anchor.setAttribute('data-toggle', 'collapse'); // Original HTML used data-toggle
      anchor.setAttribute('aria-expanded', 'false'); // Original HTML used aria-expanded

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetDiv = document.getElementById(targetId);
        if (targetDiv) {
          targetDiv.classList.toggle('collapse');
          targetDiv.classList.toggle('show');
          anchor.classList.toggle('collapsed');
        }
      });

      const subDiv = document.createElement('div');
      subDiv.classList.add('list-unstyled', 'collapse');
      subDiv.id = targetId;
      subDiv.setAttribute('data-parent', '#accordion');

      const innerUl = document.createElement('ul');
      // Create a temporary div to hold the hierarchy content and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      const sourceUl = tempDiv.querySelector('ul');
      if (sourceUl) {
        // Append children from the source UL directly
        while (sourceUl.firstChild) {
          innerUl.append(sourceUl.firstChild);
        }
      } else {
        // Fallback if no UL found, just append text content
        const subLi = document.createElement('li');
        subLi.textContent = hierarchyCell.textContent.trim();
        innerUl.append(subLi);
      }

      subDiv.append(innerUl);
      li.append(anchor, subDiv);
    } else {
      const anchor = document.createElement('a');
      const linkHref = linkCell.querySelector('a')?.href;
      if (linkHref) anchor.href = linkHref;
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    sidebarUl.append(li);
  });

  menuSidebar.append(sidebarUl);
  navbarResponsiveMain.append(menuSidebar);
  navbarCollapse.append(navbarResponsiveMain);
  colNav.append(navbarCollapse);

  const colMd1 = document.createElement('div');
  colMd1.classList.add('col-md-1');
  const logo2 = document.createElement('div');
  logo2.classList.add('logo2');
  colMd1.append(logo2);
  rowMain.append(colMd1);

  containerMain.append(rowMain);
  parleMenu.append(containerMain);
  header.append(parleMenu);

  // Mobile Menu
  const mobileMenu = document.createElement('div');
  mobileMenu.classList.add('mobile-menu');
  const mobileCloseIcon = document.createElement('a');
  mobileCloseIcon.href = 'javascript:void(0);';
  mobileCloseIcon.classList.add('cros-icon');
  mobileCloseIcon.innerHTML = '<span class="lnr lnr-cross"></span>';
  mobileCloseIcon.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });
  mobileMenu.append(mobileCloseIcon);

  const mobileNavUl = document.createElement('ul');
  mobileNavUl.classList.add('navbar-nav');

  mobileNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    li.classList.add('nav-item');
    moveInstrumentation(row, li);

    const hierarchyUl = hierarchyCell.querySelector('ul');
    if (hierarchyUl) {
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.classList.add('dropdown-toggle', 'nav-item');
      anchor.textContent = labelCell.textContent.trim();

      const dropdownMenu = document.createElement('div');
      dropdownMenu.classList.add('dropdown-menu');
      const innerUl = document.createElement('ul');

      // Create a temporary div to hold the hierarchy content and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      const sourceUl = tempDiv.querySelector('ul');
      if (sourceUl) {
        transformNestedLists(sourceUl); // Transform nested lists within the temporary UL
        while (sourceUl.firstChild) {
          innerUl.append(sourceUl.firstChild);
        }
      } else {
        // Fallback if no UL found, just append text content
        const subLi = document.createElement('li');
        subLi.textContent = hierarchyCell.textContent.trim();
        innerUl.append(subLi);
      }

      dropdownMenu.append(innerUl);
      li.append(anchor, dropdownMenu);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
        dropdownMenu.classList.toggle('show');
      });
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('nav-link');
      const linkHref = linkCell.querySelector('a')?.href;
      if (linkHref) anchor.href = linkHref;
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    mobileNavUl.append(li);
  });

  mobileMenu.append(mobileNavUl);
  header.append(mobileMenu);

  // Add event listener for the mobile nav icon to open the mobile menu
  const mobileNavTriggers = block.querySelectorAll('.mobile_nav_icon');
  mobileNavTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
  });

  // Add event listener for the desktop-mobile_nav icon to open the sidebar
  const desktopMobileNavTrigger = block.querySelector('.desktop-mobile_nav');
  if (desktopMobileNavTrigger) {
    desktopMobileNavTrigger.addEventListener('click', () => {
      navbarCollapse.classList.add('show');
    });
  }

  // Optimize images
  // This loop is redundant as images are already optimized during creation.
  // Keeping it for now but it could be removed if all images are handled at creation.
  header.querySelectorAll('picture > img').forEach((img) => {
    // Check if the image is already part of an optimized picture
    if (!img.closest('picture').dataset.optimized) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
      optimizedPic.dataset.optimized = 'true'; // Mark as optimized to prevent re-processing
    }
  });

  block.replaceChildren(header);
}
