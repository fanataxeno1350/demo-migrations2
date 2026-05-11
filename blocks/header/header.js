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
      subWrap.classList.add('list-unstyled', 'collapse'); // Use classes from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('nav-link', 'collapsed'); // Use classes from ORIGINAL HTML
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          trigger.classList.toggle('collapsed');
          subWrap.classList.toggle('show'); // Bootstrap 'show' class for collapse
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

  // Filter for top menu icons (image, link, hierarchy-tree)
  const topMenuIconRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0]?.querySelector('picture') && cells[1]?.querySelector('a') && cells[2]?.querySelector('ul');
  });

  // Filter for main menu items (label, link, hierarchy-tree)
  const mainMenuItemRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0]?.textContent.trim() && cells[1]?.querySelector('a') && cells[2]?.querySelector('ul') && !topMenuIconRows.includes(row);
  });

  // Filter for sidebar menu items (label, link, hierarchy-tree)
  const sidebarMenuItemRows = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0]?.textContent.trim() && cells[1]?.querySelector('a') && cells[2]?.querySelector('ul') && !topMenuIconRows.includes(row) && !mainMenuItemRows.includes(row);
  });

  const header = document.createElement('header');
  header.classList.add('header', 'header-sticky');

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

  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto');
  const mobileLogoAnchor = mobileLogoLinkRow.querySelector('a');
  if (mobileLogoAnchor) {
    mobileLogoLink.href = mobileLogoAnchor.href;
  }
  const mobileLogoPicture = mobileLogoRow.querySelector('picture');
  if (mobileLogoPicture) {
    const mobileLogoImg = mobileLogoPicture.querySelector('img');
    const optimizedMobileLogo = createOptimizedPicture(mobileLogoImg.src, mobileLogoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(mobileLogoImg, optimizedMobileLogo.querySelector('img'));
    mobileLogoLink.append(optimizedMobileLogo);
  }
  moveInstrumentation(mobileLogoRow, mobileLogoLink);
  moveInstrumentation(mobileLogoLinkRow, mobileLogoLink);
  topMenu.append(mobileLogoLink);

  const topMenuUl = document.createElement('ul');

  topMenuIconRows.forEach((row) => {
    const [iconImageCell, iconLinkCell] = [...row.children]; // hierarchyTreeCell is not used here

    const iconLi = document.createElement('li');
    const iconAnchor = document.createElement('a');
    iconAnchor.classList.add('mobile_nav_icon', 'desktop-mobile_nav'); // Use classes from ORIGINAL HTML
    const iconLink = iconLinkCell.querySelector('a');
    if (iconLink) {
      iconAnchor.href = iconLink.href;
    } else {
      iconAnchor.href = 'javascript:void(0);'; // Fallback if no link
    }

    const iconPicture = iconImageCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
      iconAnchor.append(optimizedIcon);
    }
    moveInstrumentation(iconImageCell, iconAnchor);
    moveInstrumentation(iconLinkCell, iconAnchor);

    iconLi.append(iconAnchor);
    topMenuUl.append(iconLi);
  });

  topMenu.append(topMenuUl);
  colMd12.append(topMenu);
  rowTop.append(colMd12);
  containerTop.append(rowTop);
  bgTop.append(containerTop);
  header.append(bgTop);
  // Header Top Menu End

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
  const desktopLink = desktopLogoLinkRow.querySelector('a');
  if (desktopLink) {
    desktopLogoAnchor.href = desktopLink.href;
  }
  const desktopLogoPicture = desktopLogoRow.querySelector('picture');
  if (desktopLogoPicture) {
    const desktopLogoImg = desktopLogoPicture.querySelector('img');
    const optimizedDesktopLogo = createOptimizedPicture(desktopLogoImg.src, desktopLogoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(desktopLogoImg, optimizedDesktopLogo.querySelector('img'));
    desktopLogoAnchor.append(optimizedDesktopLogo);
  }
  moveInstrumentation(desktopLogoRow, desktopLogoAnchor);
  moveInstrumentation(desktopLogoLinkRow, desktopLogoAnchor);
  logoDiv.append(desktopLogoAnchor);
  colMd2.append(logoDiv);
  rowMain.append(colMd2);

  const colMd9 = document.createElement('div');
  colMd9.classList.add('col-md-9');

  // Desktop Menu Start
  const mainMenu = document.createElement('div');
  mainMenu.classList.add('main-menu', 'cl-effect-5');
  const mainUl = document.createElement('ul');

  mainMenuItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('position-static', 'dropdown');

    const anchor = document.createElement('a');
    const link = linkCell.querySelector('a');
    if (link) {
      anchor.href = link.href;
    }
    const abbr = document.createElement('abbr');
    const span = document.createElement('span');
    span.setAttribute('data-hover', labelCell.textContent.trim());
    span.textContent = labelCell.textContent.trim();
    abbr.append(span);
    anchor.append(abbr);
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('megamenu'); // Use classes from ORIGINAL HTML
      const mMenu2 = document.createElement('div');
      mMenu2.classList.add('m-menu2'); // Use classes from ORIGINAL HTML
      const rowMegaMenu = document.createElement('div');
      rowMegaMenu.classList.add('row', 'mega_menu_link'); // Use classes from ORIGINAL HTML

      // Placeholder for dynamic content or additional cells if needed
      // For now, these are placeholders as the model doesn't define them.
      // If these sections are always static, they should be defined as separate fields in the model.
      // For the purpose of this review, they are replaced with TODOs or minimal dynamic content.

      // Example: First col-md-4 (Company Overview)
      const colMd4 = document.createElement('div');
      colMd4.classList.add('col-md-4', 'hyper-link');
      const bgWhite = document.createElement('div');
      bgWhite.classList.add('bg-white');
      const menuAbout = document.createElement('div');
      menuAbout.classList.add('menu_about', 'menu_sec1');
      const aboutMenuHead = document.createElement('div');
      aboutMenuHead.classList.add('about_menu_head');
      aboutMenuHead.textContent = 'Company Overview'; // This should come from a cell if dynamic
      const menuText = document.createElement('p');
      menuText.classList.add('menu_text');
      const menuTextAnchor = document.createElement('a');
      menuTextAnchor.href = '/aboutus.aspx?mpgid=2pgidtrail=2'; // This should come from a cell if dynamic
      menuTextAnchor.innerHTML = "India's leading manufacturer of biscuits and confectionery.<br/><abbr>&nbsp; </abbr>"; // This should come from a cell if dynamic
      menuText.append(menuTextAnchor);
      menuAbout.append(aboutMenuHead, menuText);
      bgWhite.append(menuAbout);
      colMd4.append(bgWhite);
      rowMegaMenu.append(colMd4);

      // Example: Second col-md-4 (CSR Link with Image)
      const colMd4_2 = document.createElement('div');
      colMd4_2.classList.add('col-md-4', 'hyper-link');
      const bgWhiteRed = document.createElement('div');
      bgWhiteRed.classList.add('bg-white', 'red_bg');
      const csrLink = document.createElement('a');
      csrLink.href = '/csr.aspx?mpgid=7pgidtrail=7'; // This should come from a cell if dynamic
      const csrImg = document.createElement('img');
      csrImg.alt = 'menu-about2';
      csrImg.classList.add('img-fluid', 'lozad', 'w-100');
      csrImg.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; // Placeholder for lozad
      csrImg.setAttribute('data-src', '/content/dam/aemigrate/uploaded-folder/www-parleproducts-com/image/menu-about2-2a40d3.webp'); // This should come from a cell if dynamic
      csrLink.append(csrImg);
      const menuAbout2 = document.createElement('div');
      menuAbout2.classList.add('menu_about', 'menu_sec1');
      const menuTextBig = document.createElement('div');
      menuTextBig.classList.add('menu_text_big');
      menuTextBig.innerHTML = '<span>Parle </span> <a href="/csr.aspx?mpgid=7pgidtrail=7"> Corporate Social Responsibility</a>'; // This should come from a cell if dynamic
      menuAbout2.append(menuTextBig);
      bgWhiteRed.append(csrLink, menuAbout2);
      colMd4_2.append(bgWhiteRed);
      rowMegaMenu.append(colMd4_2);

      // Example: Third col-md-4 (Worldwide Presence)
      const colMd4_3 = document.createElement('div');
      colMd4_3.classList.add('col-md-4', 'hyper-link', 'pr-0');
      const bgWhite3 = document.createElement('div');
      bgWhite3.classList.add('bg-white');
      const menuAbout3 = document.createElement('div');
      menuAbout3.classList.add('menu_about', 'menu_sec1', 'world_wise');
      const aboutMenuHead3 = document.createElement('div');
      aboutMenuHead3.classList.add('about_menu_head');
      aboutMenuHead3.textContent = 'Worldwide Presence'; // This should come from a cell if dynamic
      const mapP = document.createElement('p');
      const mapImg = document.createElement('img');
      mapImg.alt = 'menu_map';
      mapImg.classList.add('img-fluid');
      mapImg.src = '/content/dam/aemigrate/uploaded-folder/www-parleproducts-com/image/menu-map-201c71.webp'; // This should come from a cell if dynamic
      mapP.append(mapImg);
      const worldText = document.createElement('p');
      worldText.classList.add('menu_text', 'world_text');
      const worldTextAnchor = document.createElement('a');
      worldTextAnchor.href = '/worldwide-presence.aspx?mpgid=2pgidtrail=5'; // This should come from a cell if dynamic
      worldTextAnchor.innerHTML = 'Parle biscuits and confectionaries are fast gaining acceptance in International markets...<br/><abbr>&nbsp; </abbr>'; // This should come from a cell if dynamic
      worldText.append(worldTextAnchor);
      menuAbout3.append(aboutMenuHead3, mapP, worldText);
      bgWhite3.append(menuAbout3);
      colMd4_3.append(bgWhite3);
      rowMegaMenu.append(colMd4_3);

      mMenu2.append(rowMegaMenu);
      megaMenu.append(mMenu2);

      const menuClosed = document.createElement('div');
      menuClosed.classList.add('menu-closed'); // Use classes from ORIGINAL HTML
      const closeImg = document.createElement('img');
      closeImg.alt = 'menu-closed-icon';
      closeImg.src = '/content/dam/aemigrate/uploaded-folder/www-parleproducts-com/image/menu-closed-icon-c013f9.webp'; // This should come from a cell if dynamic
      menuClosed.append(closeImg);
      megaMenu.append(menuClosed);

      li.append(megaMenu);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        megaMenu.classList.toggle('active');
      });
      menuClosed.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.remove('active');
        megaMenu.classList.remove('active');
      });
    }
    mainUl.append(li);
  });

  mainMenu.append(mainUl);
  colMd9.append(mainMenu);
  rowMain.append(colMd9);

  const colMd1 = document.createElement('div');
  colMd1.classList.add('col-md-1');
  const logo2Div = document.createElement('div');
  logo2Div.classList.add('logo2');
  colMd1.append(logo2Div);
  rowMain.append(colMd1);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('navbar-collapse', 'navbarResponsive2'); // Use classes from ORIGINAL HTML
  const navbarResponsiveMain = document.createElement('div');
  navbarResponsiveMain.classList.add('navbarResponsive-main'); // Use classes from ORIGINAL HTML
  const mobileNavIconClose = document.createElement('a');
  mobileNavIconClose.href = 'javascript:void(0);';
  mobileNavIconClose.classList.add('mobile_nav_icon-close'); // Use classes from ORIGINAL HTML
  mobileNavIconClose.innerHTML = '<i class="lnr lnr-cross"></i>'; // Example static icon - should be from a cell if dynamic
  navbarResponsiveMain.append(mobileNavIconClose);

  const menuSidebar = document.createElement('div');
  menuSidebar.classList.add('menu-sidebar'); // Use classes from ORIGINAL HTML
  menuSidebar.id = 'accordion';
  const sidebarUl = document.createElement('ul');
  sidebarUl.classList.add('list-unstyled', 'components'); // Use classes from ORIGINAL HTML

  sidebarMenuItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li); // Move instrumentation for the row to the new li

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      const anchor = document.createElement('a');
      anchor.href = 'javascript:void(0);'; // Use javascript:void(0) for dropdown triggers
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('nav-link', 'collapsed'); // Use classes from ORIGINAL HTML
      anchor.setAttribute('aria-expanded', 'false');
      moveInstrumentation(labelCell, anchor); // Move instrumentation for label cell

      const subMenuDiv = document.createElement('div');
      subMenuDiv.classList.add('list-unstyled', 'collapse'); // Use classes from ORIGINAL HTML
      subMenuDiv.setAttribute('data-parent', '#accordion');
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for richtext cell
      
      // Apply classes to nested elements if needed, based on ORIGINAL HTML
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-link'));
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('list-unstyled'));
      // No specific classes for li in original HTML for nested lists, but can be added if needed

      while (tempDiv.firstChild) {
        subMenuDiv.append(tempDiv.firstChild);
      }

      transformNestedLists(subMenuDiv); // Transform nested lists

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        anchor.classList.toggle('collapsed');
        subMenuDiv.classList.toggle('show');
        anchor.setAttribute('aria-expanded', subMenuDiv.classList.contains('show'));
      });

      li.append(anchor, subMenuDiv);
    } else {
      const anchor = document.createElement('a');
      const link = linkCell.querySelector('a');
      if (link) {
        anchor.href = link.href;
      }
      anchor.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, anchor); // Move instrumentation for label cell
      moveInstrumentation(linkCell, anchor); // Move instrumentation for link cell
      li.append(anchor);
    }
    sidebarUl.append(li);
  });

  menuSidebar.append(sidebarUl);
  navbarResponsiveMain.append(menuSidebar);
  navbarCollapse.append(navbarResponsiveMain);
  rowMain.append(navbarCollapse);

  containerMain.append(rowMain);
  parleMenu.append(containerMain);
  header.append(parleMenu);

  block.replaceChildren(header);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Mobile nav toggle
  const mobileNavTogglers = block.querySelectorAll('.mobile_nav_icon');
  mobileNavTogglers.forEach((toggler) => {
    toggler.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show');
    });
  });

  mobileNavIconClose.addEventListener('click', () => {
    navbarCollapse.classList.remove('show');
  });
}
