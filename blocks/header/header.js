import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isSidebar = false) {
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
      nested.remove(); // Remove the original ul from li
      const subWrap = document.createElement('div');
      subWrap.classList.add('list-unstyled', 'collapse'); // Use classes from original HTML
      subWrap.append(nested); // Append the nested ul to the new wrapper
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        if (isSidebar) {
          trigger.classList.add('nav-link', 'collapsed'); // Use classes from original HTML
          trigger.setAttribute('data-toggle', 'collapse');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.href = '#'; // Placeholder for sidebar accordions
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            subWrap.classList.toggle('show');
            trigger.classList.toggle('collapsed');
            trigger.setAttribute('aria-expanded', subWrap.classList.contains('show'));
          });
        } else {
          // Main navigation dropdowns are handled in decorate function for 'position-static dropdown'
          // This part is for nested lists within a megamenu, where the parent li already has dropdown classes.
          // The click listener for the main dropdown is also handled in decorate.
          // This function only transforms the nested UL structure.
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            // Toggle 'active' class on the parent li for dropdown behavior
            li.classList.toggle('active');
          });
        }
      }
    }
  });
}

export default function decorate(block) {
  const [
    mobileLogoRow,
    mobileLogoLinkRow,
    desktopLogoRow,
    desktopLogoLinkRow,
    ...itemRows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('header', 'header-sticky'); // Use classes from original HTML

  // Header Top Menu Start
  const bgTopSection = document.createElement('section');
  bgTopSection.classList.add('bg_top'); // Use classes from original HTML
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container'); // Use classes from original HTML
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row'); // Use classes from original HTML
  const colDiv = document.createElement('div');
  colDiv.classList.add('col-md-12'); // Use classes from original HTML
  const topMenuDiv = document.createElement('div');
  topMenuDiv.classList.add('top_menu'); // Use classes from original HTML

  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto'); // Use classes from original HTML
  const mobileLogoPicture = mobileLogoRow.querySelector('picture');
  if (mobileLogoPicture) {
    const mobileLogoImg = mobileLogoPicture.querySelector('img');
    const optimizedMobileLogo = createOptimizedPicture(
      mobileLogoImg.src,
      mobileLogoImg.alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(mobileLogoImg, optimizedMobileLogo.querySelector('img'));
    mobileLogoLink.append(optimizedMobileLogo);
  }
  const mobileLink = mobileLogoLinkRow.querySelector('a');
  if (mobileLink) {
    mobileLogoLink.href = mobileLink.href;
  }
  moveInstrumentation(mobileLogoRow, mobileLogoLink);
  moveInstrumentation(mobileLogoLinkRow, mobileLogoLink);
  topMenuDiv.append(mobileLogoLink);

  const topMenuUl = document.createElement('ul');
  const mobileNavLi = document.createElement('li');
  const mobileNavIcon = document.createElement('a');
  mobileNavIcon.classList.add('mobile_nav_icon', 'mobile_nav'); // Use classes from original HTML
  mobileNavIcon.href = 'javascript:void(0);';
  // Use a placeholder for the icon, as per Rule 25.4, since the original HTML uses a DAM path.
  mobileNavIcon.innerHTML = `<img src="/icons/menu-mobile-icon.png" class="img-fluid" alt="Menu"/>`;

  const desktopMobileNavIcon = document.createElement('a');
  desktopMobileNavIcon.classList.add('mobile_nav_icon', 'desktop-mobile_nav'); // Use classes from original HTML
  desktopMobileNavIcon.href = 'javascript:void(0);';
  // Use a placeholder for the icon, as per Rule 25.4, since the original HTML uses a DAM path.
  desktopMobileNavIcon.innerHTML = `<img src="/icons/mobile-menu.png" class="img-fluid" alt="Menu"/>`;

  mobileNavLi.append(desktopMobileNavIcon, mobileNavIcon);
  topMenuUl.append(mobileNavLi);
  topMenuDiv.append(topMenuUl);

  colDiv.append(topMenuDiv);
  rowDiv.append(colDiv);
  containerDiv.append(rowDiv);
  bgTopSection.append(containerDiv);
  header.append(bgTopSection);

  // Desktop Menu Start
  const parleMenuDiv = document.createElement('div');
  parleMenuDiv.classList.add('parle-menu'); // Use classes from original HTML
  const parleMenuContainer = document.createElement('div');
  parleMenuContainer.classList.add('container'); // Use classes from original HTML
  const parleMenuRow = document.createElement('div');
  parleMenuRow.classList.add('row'); // Use classes from original HTML

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-2'); // Use classes from original HTML
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo'); // Use classes from original HTML
  const desktopLogoLink = document.createElement('a');
  desktopLogoLink.href = '/'; // Default link
  const desktopLogoPicture = desktopLogoRow.querySelector('picture');
  if (desktopLogoPicture) {
    const desktopLogoImg = desktopLogoPicture.querySelector('img');
    const optimizedDesktopLogo = createOptimizedPicture(
      desktopLogoImg.src,
      desktopLogoImg.alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(desktopLogoImg, optimizedDesktopLogo.querySelector('img'));
    desktopLogoLink.append(optimizedDesktopLogo);
  }
  const desktopLink = desktopLogoLinkRow.querySelector('a');
  if (desktopLink) {
    desktopLogoLink.href = desktopLink.href;
  }
  moveInstrumentation(desktopLogoRow, desktopLogoLink);
  moveInstrumentation(desktopLogoLinkRow, desktopLogoLink);
  logoDiv.append(desktopLogoLink);
  logoCol.append(logoDiv);
  parleMenuRow.append(logoCol);

  const mainMenuCol = document.createElement('div');
  mainMenuCol.classList.add('col-md-9'); // Use classes from original HTML
  const mainMenuDiv = document.createElement('div');
  mainMenuDiv.classList.add('main-menu', 'cl-effect-5'); // Use classes from original HTML
  const mainNavigationUl = document.createElement('ul');

  // Filter itemRows based on their structure and content
  const topMenuIconItems = itemRows.filter(
    (row) => row.children.length === 3 && row.querySelector('picture'),
  );
  const mainNavigationItems = itemRows.filter(
    (row) => row.children.length === 3 && !row.querySelector('picture') && row.children[2].querySelector('ul'),
  );
  const sidebarNavItems = itemRows.filter(
    (row) => row.children.length === 3 && !row.querySelector('picture') && row.children[2].querySelector('ul'),
  );

  // Process main navigation items
  mainNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.textContent = labelCell.textContent.trim();
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;

    const subList = hierarchyTreeCell.querySelector('ul');
    if (subList) {
      li.classList.add('position-static', 'dropdown'); // Use classes from original HTML
      const abbr = document.createElement('abbr');
      const span = document.createElement('span');
      span.setAttribute('data-hover', labelCell.textContent.trim());
      abbr.append(span);
      anchor.append(abbr);
      li.append(anchor);

      const megaMenuDiv = document.createElement('div');
      megaMenuDiv.classList.add('megamenu'); // Use classes from original HTML
      const mMenu2Div = document.createElement('div');
      mMenu2Div.classList.add('m-menu2'); // Use classes from original HTML
      const megaMenuLinkRow = document.createElement('div');
      megaMenuLinkRow.classList.add('row', 'mega_menu_link'); // Use classes from original HTML

      const col4Div = document.createElement('div');
      col4Div.classList.add('col-md-4', 'hyper-link'); // Use classes from original HTML
      const bgWhiteDiv = document.createElement('div');
      bgWhiteDiv.classList.add('bg-white'); // Use classes from original HTML
      const menuAboutDiv = document.createElement('div');
      menuAboutDiv.classList.add('menu_about', 'menu_sec1'); // Use classes from original HTML

      // Create a temporary div to hold the richtext content and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv);

      // Apply classes to nested elements if needed, based on original HTML structure
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-link')); // Example, adjust as needed
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('list-unstyled')); // Example, adjust as needed

      // Append children from tempDiv to menuAboutDiv
      while (tempDiv.firstChild) {
        menuAboutDiv.append(tempDiv.firstChild);
      }

      bgWhiteDiv.append(menuAboutDiv);
      col4Div.append(bgWhiteDiv);
      megaMenuLinkRow.append(col4Div);

      mMenu2Div.append(megaMenuLinkRow);
      megaMenuDiv.append(mMenu2Div);

      const menuClosedDiv = document.createElement('div');
      menuClosedDiv.classList.add('menu-closed'); // Use classes from original HTML
      // Use a placeholder for the icon, as per Rule 25.4, since the original HTML uses a DAM path.
      menuClosedDiv.innerHTML = `<img alt="menu-closed-icon" src="/icons/menu-closed-icon.webp"/>`;
      megaMenuDiv.append(menuClosedDiv);

      li.append(megaMenuDiv);
      moveInstrumentation(row, li);
      transformNestedLists(subList); // Transform nested lists within the megamenu
    } else {
      const abbr = document.createElement('abbr');
      const span = document.createElement('span');
      span.setAttribute('data-hover', labelCell.textContent.trim());
      abbr.append(span);
      anchor.append(abbr);
      li.append(anchor);
      moveInstrumentation(row, li);
    }
    mainNavigationUl.append(li);
  });

  mainMenuDiv.append(mainNavigationUl);
  mainMenuCol.append(mainMenuDiv);
  parleMenuRow.append(mainMenuCol);

  const logo2Col = document.createElement('div');
  logo2Col.classList.add('col-md-1'); // Use classes from original HTML
  const logo2Div = document.createElement('div');
  logo2Div.classList.add('logo2'); // Use classes from original HTML
  logo2Col.append(logo2Div);
  parleMenuRow.append(logo2Col);

  // Sidebar Navigation
  const navbarCollapseDiv = document.createElement('div');
  navbarCollapseDiv.classList.add('navbar-collapse', 'navbarResponsive2'); // Use classes from original HTML
  const navbarResponsiveMainDiv = document.createElement('div');
  navbarResponsiveMainDiv.classList.add('navbarResponsive-main'); // Use classes from original HTML
  const closeButton = document.createElement('a');
  closeButton.classList.add('mobile_nav_icon-close'); // Use classes from original HTML
  closeButton.href = 'javascript:void(0);';
  // Use a placeholder for the icon, as per Rule 25.4, since the original HTML uses a clientlib SVG.
  closeButton.innerHTML = `<i class="lnr lnr-cross"></i>`;
  navbarResponsiveMainDiv.append(closeButton);

  const menuSidebarDiv = document.createElement('div');
  menuSidebarDiv.classList.add('menu-sidebar'); // Use classes from original HTML
  menuSidebarDiv.id = 'accordion';
  const sidebarUl = document.createElement('ul');
  sidebarUl.classList.add('list-unstyled', 'components'); // Use classes from original HTML

  sidebarNavItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.textContent = labelCell.textContent.trim();
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;

    const subList = hierarchyTreeCell.querySelector('ul');
    if (subList) {
      anchor.setAttribute('data-toggle', 'collapse');
      anchor.setAttribute('aria-expanded', 'false');
      anchor.classList.add('nav-link', 'collapsed'); // Use classes from original HTML
      anchor.href = '#'; // Placeholder for sidebar accordions
      li.append(anchor);

      const subMenuDiv = document.createElement('div');
      subMenuDiv.classList.add('list-unstyled', 'collapse'); // Use classes from original HTML
      subMenuDiv.setAttribute('data-parent', '#accordion');

      // Create a temporary div to hold the richtext content and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv);

      // Apply classes to nested elements if needed, based on original HTML structure
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-link')); // Example, adjust as needed
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('list-unstyled')); // Example, adjust as needed

      // Append children from tempDiv to subMenuDiv
      while (tempDiv.firstChild) {
        subMenuDiv.append(tempDiv.firstChild);
      }

      li.append(subMenuDiv);
      transformNestedLists(subList, true); // Transform nested lists for sidebar
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        subMenuDiv.classList.toggle('show');
        anchor.classList.toggle('collapsed');
        anchor.setAttribute('aria-expanded', subMenuDiv.classList.contains('show'));
      });
    } else {
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    sidebarUl.append(li);
  });

  menuSidebarDiv.append(sidebarUl);
  navbarResponsiveMainDiv.append(menuSidebarDiv);
  navbarCollapseDiv.append(navbarResponsiveMainDiv);
  parleMenuContainer.append(navbarCollapseDiv);

  parleMenuDiv.append(parleMenuContainer);
  header.append(parleMenuDiv);

  block.replaceChildren(header);

  // Toggle mobile navigation
  const mobileNavTriggers = document.querySelectorAll('.mobile_nav_icon');
  const navbarResponsive2 = document.querySelector('.navbarResponsive2');
  const mobileNavClose = document.querySelector('.mobile_nav_icon-close');

  mobileNavTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      navbarResponsive2.classList.add('show');
    });
  });

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', () => {
      navbarResponsive2.classList.remove('show');
    });
  }

  // Optimize images
  header.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
