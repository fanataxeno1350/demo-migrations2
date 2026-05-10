import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isMobile = false) {
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
      subWrap.classList.add(isMobile ? 'dropdown-menu' : 'has-sub-child'); // 'has-sub-child' is an invented class, but needed for desktop styling
      subWrap.append(nested);
      li.append(subWrap);

      // Apply classes to nested UL, LI, A elements from original HTML
      nested.classList.add('list-unstyled', 'components'); // Example classes from sidebar nav
      nested.querySelectorAll('li').forEach((nestedLi) => {
        nestedLi.classList.add('nav-item'); // Example class from mobile nav
        moveInstrumentation(nestedLi, nestedLi);
      });
      nested.querySelectorAll('a').forEach((nestedAnchor) => {
        nestedAnchor.classList.add('nav-link'); // Example class from mobile nav
        moveInstrumentation(nestedAnchor, nestedAnchor);
      });

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        if (isMobile) {
          trigger.classList.add('dropdown-toggle', 'nav-item');
          trigger.href = '#'; // For mobile dropdowns, link to # or void(0)
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            subWrap.classList.toggle('show'); // Use 'show' for Bootstrap-like dropdown
          });
        } else {
          // Desktop behavior
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            subWrap.classList.toggle('active');
          });
        }
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

  const topMenuIconRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture'));
  const mainNavigationRows = itemRows.filter((row) => row.children.length === 5);
  const sidebarNavigationRows = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture'));
  // Mobile navigation rows have the same structure as sidebar, distinguish by position in the model
  const mobileNavigationRows = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture'));

  const header = document.createElement('header');
  header.classList.add('header', 'header-sticky');

  // Header Top Menu Start
  const bgTopSection = document.createElement('section');
  bgTopSection.classList.add('bg_top');
  const bgTopContainer = document.createElement('div');
  bgTopContainer.classList.add('container');
  const bgTopRow = document.createElement('div');
  bgTopRow.classList.add('row');
  const bgTopCol = document.createElement('div');
  bgTopCol.classList.add('col-md-12');
  const topMenu = document.createElement('div');
  topMenu.classList.add('top_menu');

  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto');
  moveInstrumentation(mobileLogoLinkRow, mobileLogoLink);
  mobileLogoLink.href = mobileLogoLinkRow?.querySelector('a')?.href || '#';
  const mobileLogoPicture = mobileLogoRow?.querySelector('picture');
  if (mobileLogoPicture) {
    const mobileLogoImg = mobileLogoPicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(mobileLogoImg.src, mobileLogoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(mobileLogoImg, optimizedMobilePic.querySelector('img'));
    mobileLogoLink.append(optimizedMobilePic);
  }
  topMenu.append(mobileLogoLink);

  const topMenuUl = document.createElement('ul');
  topMenuIconRows.forEach((row) => {
    const [iconCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.classList.add('mobile_nav_icon'); // Add base class from original HTML

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconImg, optimizedIconPic.querySelector('img'));
      anchor.append(optimizedIconPic);
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      anchor.classList.add('desktop-mobile_nav'); // Add specific class for desktop
      const dropdownDiv = document.createElement('div');
      dropdownDiv.classList.add('menu-sidebar'); // Use a class from original HTML
      moveInstrumentation(hierarchyCell, dropdownDiv); // Move instrumentation for the hierarchy cell
      dropdownDiv.append(subList);
      transformNestedLists(subList); // Transform nested lists
      li.append(anchor, dropdownDiv);
    } else {
      anchor.classList.add('mobile_nav'); // Add specific class for mobile
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    topMenuUl.append(li);
  });
  topMenu.append(topMenuUl);

  bgTopCol.append(topMenu);
  bgTopRow.append(bgTopCol);
  bgTopContainer.append(bgTopRow);
  bgTopSection.append(bgTopContainer);
  header.append(bgTopSection);
  // Header Top Menu End

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
  const desktopLogoLink = document.createElement('a');
  moveInstrumentation(desktopLogoLinkRow, desktopLogoLink);
  desktopLogoLink.href = desktopLogoLinkRow?.querySelector('a')?.href || '#';
  const desktopLogoPicture = desktopLogoRow?.querySelector('picture');
  if (desktopLogoPicture) {
    const desktopLogoImg = desktopLogoPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(desktopLogoImg.src, desktopLogoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(desktopLogoImg, optimizedDesktopPic.querySelector('img'));
    desktopLogoLink.append(optimizedDesktopPic);
  }
  logoDiv.append(desktopLogoLink);
  logoCol.append(logoDiv);
  parleMenuRow.append(logoCol);

  const mainMenuCol = document.createElement('div');
  mainMenuCol.classList.add('col-md-9');
  const mainMenuDiv = document.createElement('div');
  mainMenuDiv.classList.add('main-menu', 'cl-effect-5');
  const mainMenuUl = document.createElement('ul');

  mainNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell, megamenuImageCell, megamenuContentCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('position-static', 'dropdown');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.innerHTML = `<abbr><span data-hover="${labelCell.textContent.trim()}">${labelCell.textContent.trim()}</span></abbr>`;

    const tempHierarchyDiv = document.createElement('div');
    tempHierarchyDiv.innerHTML = hierarchyCell?.innerHTML || '';
    const subList = tempHierarchyDiv.querySelector('ul');

    const megamenuImage = megamenuImageCell?.querySelector('picture');
    const megamenuContent = megamenuContentCell?.innerHTML;

    if (subList || megamenuImage || megamenuContent) {
      const megamenuDiv = document.createElement('div');
      megamenuDiv.classList.add('megamenu');
      if (megamenuImage || megamenuContent) {
        megamenuDiv.classList.add('megamenu2');
      }

      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2');
      const megaMenuLinkRow = document.createElement('div');
      megaMenuLinkRow.classList.add('row', 'mega_menu_link');

      if (subList) {
        const subListCol = document.createElement('div');
        subListCol.classList.add('col-md-4', 'hyper-link');
        const bgWhiteDiv = document.createElement('div');
        bgWhiteDiv.classList.add('bg-white');
        const menuAboutDiv = document.createElement('div');
        menuAboutDiv.classList.add('menu_about', 'menu_sec1');
        moveInstrumentation(hierarchyCell, menuAboutDiv); // Move instrumentation for the hierarchy cell
        menuAboutDiv.append(subList);
        transformNestedLists(subList); // Transform nested lists
        bgWhiteDiv.append(menuAboutDiv);
        subListCol.append(bgWhiteDiv);
        megaMenuLinkRow.append(subListCol);
      }

      if (megamenuImage) {
        const imageCol = document.createElement('div');
        imageCol.classList.add('col-md-4', 'hyper-link');
        const bgWhiteRedBgDiv = document.createElement('div');
        bgWhiteRedBgDiv.classList.add('bg-white', 'red_bg');
        const imgAnchor = document.createElement('a');
        imgAnchor.href = anchor.href; // Use the main link for the image anchor
        const img = megamenuImage.querySelector('img');
        const optimizedMegaImg = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedMegaImg.querySelector('img'));
        imgAnchor.append(optimizedMegaImg);
        bgWhiteRedBgDiv.append(imgAnchor);
        imageCol.append(bgWhiteRedBgDiv);
        megaMenuLinkRow.append(imageCol);
      }

      if (megamenuContent) {
        const contentCol = document.createElement('div');
        contentCol.classList.add('col-md-4', 'hyper-link', 'pr-0');
        const bgWhiteDiv = document.createElement('div');
        bgWhiteDiv.classList.add('bg-white');
        const menuAboutDiv = document.createElement('div');
        menuAboutDiv.classList.add('menu_about', 'menu_sec1');
        moveInstrumentation(megamenuContentCell, menuAboutDiv); // Move instrumentation for the megamenu content cell
        menuAboutDiv.innerHTML = megamenuContent;
        bgWhiteDiv.append(menuAboutDiv);
        contentCol.append(bgWhiteDiv);
        megaMenuLinkRow.append(contentCol);
      }

      mMenu2.append(megaMenuLinkRow);
      megamenuDiv.append(mMenu2);

      const menuClosedDiv = document.createElement('div');
      menuClosedDiv.classList.add('menu-closed');
      // Replaced hardcoded image with lnr-cross icon from original HTML
      menuClosedDiv.innerHTML = '<i class="lnr lnr-cross"></i>';
      megamenuDiv.append(menuClosedDiv);

      li.append(anchor, megamenuDiv);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        megamenuDiv.classList.toggle('active');
      });

      menuClosedDiv.addEventListener('click', () => {
        li.classList.remove('active');
        megamenuDiv.classList.remove('active');
      });
    } else {
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    mainMenuUl.append(li);
  });

  mainMenuDiv.append(mainMenuUl);
  mainMenuCol.append(mainMenuDiv);
  parleMenuRow.append(mainMenuCol);

  const logo2Col = document.createElement('div');
  logo2Col.classList.add('col-md-1');
  const logo2Div = document.createElement('div');
  logo2Div.classList.add('logo2');
  logo2Col.append(logo2Div);
  parleMenuRow.append(logo2Col);

  parleMenuContainer.append(parleMenuRow);
  parleMenuDiv.append(parleMenuContainer);
  header.append(parleMenuDiv);

  // Sidebar Navigation
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');
  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main');
  const closeBtn = document.createElement('a');
  closeBtn.classList.add('mobile_nav_icon-close');
  closeBtn.href = 'javascript:void(0);';
  closeBtn.innerHTML = '<i class="lnr lnr-cross"></i>';
  navbarResponsiveMain.append(closeBtn);

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar');
  menuSidebar.id = 'accordion';
  const sidebarUl = document.createElement('ul');
  sidebarUl.classList.add('list-unstyled', 'components');

  sidebarNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();

    const tempHierarchyDiv = document.createElement('div');
    tempHierarchyDiv.innerHTML = hierarchyCell?.innerHTML || '';
    const subList = tempHierarchyDiv.querySelector('ul');

    if (subList) {
      anchor.classList.add('nav-link', 'collapsed');
      anchor.setAttribute('aria-expanded', 'false');
      const subMenuDiv = document.createElement('div');
      subMenuDiv.classList.add('list-unstyled', 'collapse');
      subMenuDiv.setAttribute('data-parent', '#accordion');
      moveInstrumentation(hierarchyCell, subMenuDiv); // Move instrumentation for the hierarchy cell
      subMenuDiv.append(subList);
      transformNestedLists(subList); // Transform nested lists
      li.append(anchor, subMenuDiv);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        anchor.classList.toggle('collapsed');
        subMenuDiv.classList.toggle('show');
      });
    } else {
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    sidebarUl.append(li);
  });

  menuSidebar.append(sidebarUl);
  navbarResponsiveMain.append(menuSidebar);
  navbarCollapse.append(navbarResponsiveMain);
  parleMenuDiv.append(navbarCollapse); // Append to parleMenuDiv as per original HTML structure

  // Mobile Menu
  const mobileMenuDiv = document.createElement('div');
  mobileMenuDiv.classList.add('mobile-menu');
  const mobileCloseIcon = document.createElement('a');
  mobileCloseIcon.href = 'javascript:void(0);';
  mobileCloseIcon.classList.add('cros-icon');
  mobileCloseIcon.innerHTML = '<span class="lnr lnr-cross"></span>';
  mobileMenuDiv.append(mobileCloseIcon);

  const mobileNavUl = document.createElement('ul');
  mobileNavUl.classList.add('navbar-nav');

  // Add a static HOME link if needed, based on original HTML
  const homeLi = document.createElement('li');
  homeLi.classList.add('nav-item');
  const homeLink = document.createElement('a');
  homeLink.classList.add('nav-link');
  homeLink.href = '/';
  homeLink.textContent = 'HOME';
  homeLi.append(homeLink);
  mobileNavUl.append(homeLi);

  // Filter mobileNavigationRows to ensure they are distinct from sidebarNavigationRows
  // Assuming mobileNavigationRows are the ones that appear *after* sidebarNavigationRows in the block structure
  // This is a heuristic based on the model structure, if they are truly identical,
  // the filter needs to be more robust (e.g., by position in the overall itemRows array).
  // For now, we'll process them as distinct sets as per the model.
  const distinctMobileNavigationRows = itemRows.slice(
    topMenuIconRows.length + mainNavigationRows.length + sidebarNavigationRows.length,
  );

  distinctMobileNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('nav-item');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();

    const tempHierarchyDiv = document.createElement('div');
    tempHierarchyDiv.innerHTML = hierarchyCell?.innerHTML || '';
    const subList = tempHierarchyDiv.querySelector('ul');

    if (subList) {
      anchor.classList.add('dropdown-toggle', 'nav-item');
      const dropdownMenuDiv = document.createElement('div');
      dropdownMenuDiv.classList.add('dropdown-menu');
      moveInstrumentation(hierarchyCell, dropdownMenuDiv); // Move instrumentation for the hierarchy cell
      dropdownMenuDiv.append(subList);
      transformNestedLists(subList, true); // Transform nested lists for mobile
      li.append(anchor, dropdownMenuDiv);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdownMenuDiv.classList.toggle('show');
      });
    } else {
      anchor.classList.add('nav-link');
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    mobileNavUl.append(li);
  });

  mobileMenuDiv.append(mobileNavUl);
  header.append(mobileMenuDiv);

  // Toggle for mobile menu
  const mobileNavIcons = document.querySelectorAll('.mobile_nav_icon');
  mobileNavIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      mobileMenuDiv.classList.add('show');
      navbarCollapse.classList.add('show'); // Also toggle navbarCollapse for sidebar
    });
  });

  mobileCloseIcon.addEventListener('click', () => {
    mobileMenuDiv.classList.remove('show');
    navbarCollapse.classList.remove('show'); // Also hide navbarCollapse for sidebar
  });

  closeBtn.addEventListener('click', () => {
    mobileMenuDiv.classList.remove('show');
    navbarCollapse.classList.remove('show'); // Also hide mobileMenuDiv for mobile
  });

  // Optimize all images in the block
  header.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(header);
}
