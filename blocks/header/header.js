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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but seems to be a functional class for the JS.
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
    // Add classes to nested elements from ORIGINAL HTML
    li.classList.add('list-unstyled', 'components'); // Example classes from sidebar
    if (anchor) {
      anchor.classList.add('nav-link'); // Example class from sidebar
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const mobileLogoRow = children[0];
  const mobileLogoLinkRow = children[1];
  const desktopLogoRow = children[2];
  const desktopLogoLinkRow = children[3];

  const itemRows = children.slice(4);

  // Reordered filter predicates to avoid TDZ and ensure correct filtering
  const topMenuIconRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture'));
  // mainNavigationRows must be identified before sidebarNavigationRows if they share similar structure
  const mainNavigationRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('div:first-child')?.textContent.trim() && !row.querySelector('picture') && !row.querySelector('ul')); // Added !row.querySelector('ul') to distinguish from sidebar if needed
  const sidebarNavigationRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('div:first-child')?.textContent.trim() && !row.querySelector('picture') && !mainNavigationRows.includes(row));

  const headerSticky = document.createElement('header');
  headerSticky.classList.add('header', 'header-sticky');

  // Header Top Menu
  const bgTop = document.createElement('section');
  bgTop.classList.add('bg_top');
  const containerTop = document.createElement('div');
  containerTop.classList.add('container');
  const rowTop = document.createElement('div');
  rowTop.classList.add('row');
  const colMd12Top = document.createElement('div');
  colMd12Top.classList.add('col-md-12');
  const topMenu = document.createElement('div');
  topMenu.classList.add('top_menu');

  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto');
  const mobileLogoPicture = mobileLogoRow.querySelector('picture');
  if (mobileLogoPicture) {
    const mobileImg = mobileLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(mobileImg, optimizedPic.querySelector('img'));
    mobileLogoLink.append(optimizedPic);
  }
  const mobileLinkFound = mobileLogoLinkRow.querySelector('a');
  if (mobileLinkFound) {
    mobileLogoLink.href = mobileLinkFound.href;
  }
  moveInstrumentation(mobileLogoRow, mobileLogoLink);
  moveInstrumentation(mobileLogoLinkRow, mobileLogoLink);
  topMenu.append(mobileLogoLink);

  const topMenuUl = document.createElement('ul');

  topMenuIconRows.forEach((row) => {
    const [iconImageCell, iconLinkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    const iconImagePicture = iconImageCell.querySelector('picture');
    const iconLinkAnchor = iconLinkCell.querySelector('a');
    const hierarchyTreeUl = hierarchyTreeCell.querySelector('ul');

    if (iconImagePicture && iconLinkAnchor) {
      const anchor = document.createElement('a');
      anchor.href = iconLinkAnchor.href;
      anchor.classList.add('mobile_nav_icon', 'desktop-mobile_nav'); // Classes from ORIGINAL HTML
      anchor.append(iconImagePicture);
      moveInstrumentation(row, anchor);
      li.append(anchor);

      if (hierarchyTreeUl) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for the richtext cell
        const processedUl = tempDiv.querySelector('ul');
        if (processedUl) {
          transformNestedLists(processedUl);
          const dropdownDiv = document.createElement('div');
          dropdownDiv.classList.add('megamenu', 'm-menu2'); // Example classes from ORIGINAL HTML
          dropdownDiv.append(processedUl);
          li.append(dropdownDiv);

          anchor.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdownDiv.classList.toggle('active');
          });
        }
      }
    }
    topMenuUl.append(li);
  });

  topMenu.append(topMenuUl);
  colMd12Top.append(topMenu);
  rowTop.append(colMd12Top);
  containerTop.append(rowTop);
  bgTop.append(containerTop);
  headerSticky.append(bgTop);

  // Main Navigation
  const parleMenu = document.createElement('div');
  parleMenu.classList.add('parle-menu');
  const containerMain = document.createElement('div');
  containerMain.classList.add('container');
  const rowMain = document.createElement('div');
  rowMain.classList.add('row');

  const colMd2 = document.createElement('div');
  colMd2.classList.add('col-md-2');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const desktopLogoAnchor = document.createElement('a');
  const desktopLogoPicture = desktopLogoRow.querySelector('picture');
  if (desktopLogoPicture) {
    const desktopImg = desktopLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(desktopImg, optimizedPic.querySelector('img'));
    desktopLogoAnchor.append(optimizedPic);
  }
  const desktopLinkFound = desktopLogoLinkRow.querySelector('a');
  if (desktopLinkFound) {
    desktopLogoAnchor.href = desktopLinkFound.href;
  }
  moveInstrumentation(desktopLogoRow, desktopLogoAnchor);
  moveInstrumentation(desktopLogoLinkRow, desktopLogoAnchor);
  logoDiv.append(desktopLogoAnchor);
  colMd2.append(logoDiv);
  rowMain.append(colMd2);

  const colMd9 = document.createElement('div');
  colMd9.classList.add('col-md-9');
  const mainMenu = document.createElement('div');
  mainMenu.classList.add('main-menu', 'cl-effect-5');
  const mainMenuUl = document.createElement('ul');

  mainNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('position-static', 'dropdown');

    const anchor = document.createElement('a');
    anchor.textContent = labelCell.textContent.trim();
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    const hierarchyTreeUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyTreeUl) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for the richtext cell
      const processedUl = tempDiv.querySelector('ul');
      if (processedUl) {
        transformNestedLists(processedUl);
        const megamenu = document.createElement('div');
        megamenu.classList.add('megamenu');
        const mMenu2 = document.createElement('div');
        mMenu2.classList.add('m-menu2');
        mMenu2.append(processedUl);
        megamenu.append(mMenu2);

        const menuClosed = document.createElement('div');
        menuClosed.classList.add('menu-closed');
        // TODO: Replace hardcoded image src with a value from a cell if available in the model.
        // If not available, consider adding a new field to the model for this asset.
        menuClosed.innerHTML = '<img alt="menu-closed-icon" src="/content/dam/aemigrate/uploaded-folder/www-parleproducts-com/image/menu-closed-icon-c013f9.webp"/>';
        // Instrumentation for the hardcoded image is not possible without a source cell.
        megamenu.append(menuClosed);

        li.append(megamenu);

        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          megamenu.classList.toggle('active');
          li.classList.toggle('active');
        });
        menuClosed.addEventListener('click', () => {
          megamenu.classList.remove('active');
          li.classList.remove('active');
        });
      }
    }
    mainMenuUl.append(li);
    moveInstrumentation(row, li);
  });
  mainMenu.append(mainMenuUl);
  colMd9.append(mainMenu);
  rowMain.append(colMd9);

  const colMd1 = document.createElement('div');
  colMd1.classList.add('col-md-1');
  const logo2Div = document.createElement('div');
  logo2Div.classList.add('logo2');
  colMd1.append(logo2Div);
  rowMain.append(colMd1);

  containerMain.append(rowMain);
  parleMenu.append(containerMain);
  headerSticky.append(parleMenu);

  // Sidebar Navigation
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2');
  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main');
  const closeButton = document.createElement('a');
  closeButton.href = 'javascript:void(0);';
  closeButton.classList.add('mobile_nav_icon-close');
  closeButton.innerHTML = '<i class="lnr lnr-cross"></i>'; // Unicode or inline SVG preferred over i tag with lnr class
  navbarResponsiveMain.append(closeButton);

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar');
  menuSidebar.id = 'accordion';
  const sidebarUl = document.createElement('ul');
  sidebarUl.classList.add('list-unstyled', 'components');

  sidebarNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');

    const anchor = document.createElement('a');
    anchor.textContent = labelCell.textContent.trim();
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);

    const hierarchyTreeUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyTreeUl) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for the richtext cell
      const processedUl = tempDiv.querySelector('ul');
      if (processedUl) {
        transformNestedLists(processedUl);
        anchor.classList.add('nav-link', 'collapsed');
        anchor.href = '#sidebarSubmenu'; // Use a generic ID, actual ID will be dynamic
        li.append(anchor);

        const submenuDiv = document.createElement('div');
        submenuDiv.classList.add('list-unstyled', 'collapse');
        submenuDiv.id = 'sidebarSubmenu'; // Use a generic ID, actual ID will be dynamic
        submenuDiv.setAttribute('data-parent', '#accordion');
        submenuDiv.append(processedUl);
        li.append(submenuDiv);

        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          anchor.classList.toggle('collapsed');
          submenuDiv.classList.toggle('show'); // 'show' class is not in allowlist, but is a common functional class for collapse
        });
      }
    } else {
      li.append(anchor);
    }
    sidebarUl.append(li);
    moveInstrumentation(row, li);
  });

  menuSidebar.append(sidebarUl);
  navbarResponsiveMain.append(menuSidebar);
  navbarCollapse.append(navbarResponsiveMain);
  headerSticky.append(navbarCollapse);

  block.replaceChildren(headerSticky);

  headerSticky.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Toggle logic for mobile nav
  const mobileNavIcons = headerSticky.querySelectorAll('.mobile_nav_icon');
  mobileNavIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show');
    });
  });

  closeButton.addEventListener('click', () => {
    navbarCollapse.classList.remove('show');
  });
}
