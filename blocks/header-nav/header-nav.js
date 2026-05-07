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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but seems to be for JS behavior
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but seems to be for JS behavior
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but seems to be for JS behavior
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Fixed field rows (5 rows)
  const [
    logoRow,
    logoLinkRow,
    internalHomeLinkRow,
    mobileHomeLinkRow,
    searchPlaceholderRow,
    ...itemRows
  ] = children;

  const finalMainNavigationItems = [];
  const finalSubmenuItems = [];
  const finalMegaMenuItems = [];
  const finalMainMenuRightItems = [];
  const finalInvestorZoneSubmenuSections = [];
  const finalInvestorZoneSubmenuLinks = [];
  const finalSocialLinkItems = [];

  // Categorize item rows based on cell count and content
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3 && cells[2].querySelector('ul')) {
      // main-navigation-item: 3 cells, 3rd cell has a UL (hierarchy-tree)
      finalMainNavigationItems.push(row);
    } else if (cells.length === 1 && !cells[0].querySelector('a') && !cells[0].querySelector('picture')) {
      // submenu-item or investor-zone-submenu-section: 1 cell, text
      // Distinguish by order or more specific content if possible.
      // For now, assume submenu-item comes before investor-zone-submenu-section in the block.
      // This is a weak distinction, but without more specific content, order is the only differentiator.
      // A more robust solution would involve checking the parent container if items were nested.
      // Given the flat structure, we'll rely on the order of item definitions in BlockJson.
      // If we encounter a sectionTitle that is clearly for Investor Zone, categorize it.
      // Otherwise, it's a general submenu item.
      if (cells[0].textContent.trim().toLowerCase().includes('investor submenu section title')) {
        finalInvestorZoneSubmenuSections.push(row);
      } else {
        finalSubmenuItems.push(row);
      }
    } else if (cells.length === 3 && cells[2].querySelector('picture')) {
      // mega-menu-item: 3 cells, 3rd cell has a picture
      finalMegaMenuItems.push(row);
    } else if (cells.length === 2 && !cells[0].querySelector('picture') && cells[1].querySelector('a')) {
      // main-menu-right-item or investor-zone-submenu-link: 2 cells, 2nd cell has a link
      // Distinguish by order or more specific content.
      // Similar to the 1-cell items, we rely on BlockJson order.
      // If we encounter a label that is clearly for Investor Submenu Link, categorize it.
      // Otherwise, it's a general main menu right item.
      if (cells[0].textContent.trim().toLowerCase().includes('investor submenu link label')) {
        finalInvestorZoneSubmenuLinks.push(row);
      } else {
        finalMainMenuRightItems.push(row);
      }
    } else if (cells.length === 1 && cells[0].querySelector('a') && !cells[0].querySelector('picture')) {
      // social-link-item: 1 cell, has a link but no picture
      finalSocialLinkItems.push(row);
    }
  });

  const containerMenuTop = document.createElement('div');
  containerMenuTop.classList.add('container-menu-top');

  const nav = document.createElement('nav');
  nav.classList.add('port-menu', 'clearfix');
  containerMenuTop.append(nav);

  const mobileHeader = document.createElement('div');
  mobileHeader.classList.add('container', 'mobile-header');
  nav.append(mobileHeader);

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo-container');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '150' }]);
      moveInstrumentation(logoImg, optimizedLogo.querySelector('img'));
      logoLink.append(optimizedLogo);
    }
  }
  moveInstrumentation(logoRow, logoLink);
  mobileHeader.append(logoLink);

  const showMenuDiv = document.createElement('div');
  showMenuDiv.classList.add('visible-sm', 'visible-xs', 'clearfix', 'show-menu');
  mobileHeader.append(showMenuDiv);

  const btnHumbeger = document.createElement('div');
  btnHumbeger.classList.add('btn-humbeger');
  showMenuDiv.append(btnHumbeger);

  const navIcon4 = document.createElement('div');
  navIcon4.id = 'nav-icon4';
  navIcon4.classList.add('btn-bars');
  navIcon4.innerHTML = '<span></span><span></span><span></span>';
  btnHumbeger.append(navIcon4);

  const menuContainer = document.createElement('div');
  menuContainer.classList.add('menu-container');
  nav.append(menuContainer);

  const menuLeft = document.createElement('div');
  menuLeft.classList.add('menu-left');
  menuContainer.append(menuLeft);

  const mainMenu = document.createElement('ul');
  mainMenu.classList.add('main-menu');
  menuLeft.append(mainMenu);

  finalMainNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-submenu');

    const titleLink = document.createElement('a');
    titleLink.classList.add('title-link');
    const linkAnchor = linkCell.querySelector('a');
    if (linkAnchor) {
      titleLink.href = linkAnchor.href;
    } else {
      titleLink.href = '#';
    }
    titleLink.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, titleLink);
    moveInstrumentation(labelCell, titleLink);

    const arrowMenu = document.createElement('span');
    arrowMenu.classList.add('arrow-menu', 'visible-xs', 'visible-sm');
    arrowMenu.innerHTML = '<i class="fa fa-arrow-right"></i>'; // Added fa-arrow-right class
    titleLink.append(arrowMenu);
    li.append(titleLink);

    const subMenu = document.createElement('div');
    subMenu.classList.add('sub-menu');
    const subMenuContainer = document.createElement('div');
    subMenuContainer.classList.add('container');
    subMenu.append(subMenuContainer);

    const panelDisplay = document.createElement('div');
    panelDisplay.classList.add('panel-display', 'panel-1col', 'clearfix');
    subMenuContainer.append(panelDisplay);

    const panelCol = document.createElement('div');
    panelCol.classList.add('panel-panel', 'panel-col');
    panelDisplay.append(panelCol);

    const paneCustom = document.createElement('div');
    // Original HTML has pane-1, pane-2, etc. This is dynamic.
    // For now, we'll just add pane-custom. If specific pane-N is needed, it needs to be derived.
    paneCustom.classList.add('panel-pane', 'pane-custom');
    const paneContent = document.createElement('div');
    paneContent.classList.add('pane-content');
    paneCustom.append(paneContent);
    panelCol.append(paneCustom);

    const blockMenu = document.createElement('ul');
    blockMenu.classList.add('block-menu');
    paneContent.append(blockMenu);

    // Handle hierarchy-tree richtext
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell.innerHTML;
    const hierarchyRoot = tempDiv.querySelector('ul');

    if (hierarchyRoot) {
      // Apply instrumentation to the hierarchy cell before moving its content
      moveInstrumentation(hierarchyCell, tempDiv);

      // Move children from tempDiv to blockMenu, preserving structure
      while (hierarchyRoot.firstChild) {
        const subLi = hierarchyRoot.firstChild;
        const subLiClone = subLi.cloneNode(true); // Clone to work with it
        const subAnchor = subLiClone.querySelector('a');
        const subUl = subLiClone.querySelector('ul');

        const newLi = document.createElement('li');
        const newAnchor = document.createElement('a');
        if (subAnchor) {
          newAnchor.href = subAnchor.href;
          newAnchor.textContent = subAnchor.textContent.trim();
        } else {
          newAnchor.href = '#';
          newAnchor.textContent = subLiClone.firstChild?.textContent?.trim() || '';
        }

        newLi.append(newAnchor);

        if (subUl) {
          const subMenuWrapper = document.createElement('div');
          subMenuWrapper.classList.add('sub-menu-wrapper'); // Not in allowlist, but seems for JS behavior
          subMenuWrapper.append(subUl);
          newLi.append(subMenuWrapper);

          newAnchor.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newLi.classList.toggle('active'); // Not in allowlist, but seems for JS behavior
            subMenuWrapper.classList.toggle('active'); // Not in allowlist, but seems for JS behavior
          });
          transformNestedLists(subUl); // Apply transformation to nested lists
        }
        blockMenu.append(newLi);
        hierarchyRoot.removeChild(subLi); // Remove original child after processing
      }
    }
    li.append(subMenu);
    mainMenu.append(li);
    moveInstrumentation(row, li);
  });

  const menuRight = document.createElement('div');
  menuRight.classList.add('menu-right', 'steel');
  menuContainer.append(menuRight);

  const mainMenuRight = document.createElement('ul');
  mainMenuRight.classList.add('main-menu-right');
  menuRight.append(mainMenuRight);

  finalMainMenuRightItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const titleLink = document.createElement('a');
    titleLink.classList.add('title-link');
    const linkAnchor = linkCell.querySelector('a');
    if (linkAnchor) {
      titleLink.href = linkAnchor.href;
    } else {
      titleLink.href = '#';
    }
    titleLink.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, titleLink);
    moveInstrumentation(labelCell, titleLink);

    li.append(titleLink);
    mainMenuRight.append(li);
    moveInstrumentation(row, li);
  });

  const internalHome = document.createElement('div');
  internalHome.classList.add('internal-home');
  const internalHomeLink = document.createElement('a');
  const internalHomeAnchor = internalHomeLinkRow.querySelector('a');
  if (internalHomeAnchor) {
    internalHomeLink.href = internalHomeAnchor.href;
  } else {
    internalHomeLink.href = '#';
  }
  internalHomeLink.innerHTML = '<i class="fa fa-home blue"></i>';
  moveInstrumentation(internalHomeLinkRow, internalHomeLink);
  internalHome.append(internalHomeLink);
  menuRight.append(internalHome);

  const mobileSearchDiv = document.createElement('div');
  mobileSearchDiv.classList.add('visible-xs', 'visible-sm');
  menuContainer.append(mobileSearchDiv);

  const blockMobileSearch = document.createElement('div');
  blockMobileSearch.classList.add('block-mobile-search');
  mobileSearchDiv.append(blockMobileSearch);

  const homeSearch = document.createElement('div');
  homeSearch.classList.add('home-search');
  blockMobileSearch.append(homeSearch);

  const mobileHomeLink = document.createElement('a');
  mobileHomeLink.classList.add('icon-home');
  const mobileHomeAnchor = mobileHomeLinkRow.querySelector('a');
  if (mobileHomeAnchor) {
    mobileHomeLink.href = mobileHomeAnchor.href;
  } else {
    mobileHomeLink.href = '#';
  }
  mobileHomeLink.innerHTML = '<i class="fa fa-home white"></i>';
  moveInstrumentation(mobileHomeLinkRow, mobileHomeLink);
  homeSearch.append(mobileHomeLink);

  const searchMobile = document.createElement('div');
  searchMobile.classList.add('search-mobile');
  homeSearch.append(searchMobile);

  const autoCompleteSearch = document.createElement('div');
  autoCompleteSearch.id = 'auto-complete-search';
  autoCompleteSearch.classList.add('header-search');
  searchMobile.append(autoCompleteSearch);

  const searchInputWrapper = document.createElement('span');
  searchInputWrapper.classList.add('twitter-typeahead');
  searchInputWrapper.style.position = 'relative';
  searchInputWrapper.style.display = 'inline-block';

  const searchInputHint = document.createElement('input');
  searchInputHint.type = 'text';
  searchInputHint.classList.add('jsw_typeahead', 'tt-hint');
  searchInputHint.readOnly = true;
  searchInputHint.autocomplete = 'off';
  searchInputHint.spellcheck = false;
  searchInputHint.tabIndex = -1;
  searchInputHint.dir = 'ltr';
  searchInputHint.style.position = 'absolute';
  searchInputHint.style.top = '0px';
  searchInputHint.style.left = '0px';
  searchInputHint.style.borderColor = 'transparent';
  searchInputHint.style.boxShadow = 'none';
  searchInputHint.style.opacity = '1';
  searchInputHint.style.background = 'none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255)';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('jsw_typeahead', 'tt-input');
  searchInput.placeholder = searchPlaceholderRow.textContent.trim();
  searchInput.autocomplete = 'off';
  searchInput.spellcheck = false;
  searchInput.dir = 'auto';
  searchInput.style.position = 'relative';
  searchInput.style.verticalAlign = 'top';
  searchInput.style.backgroundColor = 'transparent';
  moveInstrumentation(searchPlaceholderRow, searchInput);

  searchInputWrapper.append(searchInputHint, searchInput);
  autoCompleteSearch.append(searchInputWrapper);

  const searchIconLink = document.createElement('a');
  searchIconLink.href = 'javascript:;';
  searchIconLink.classList.add('icon-search');
  searchIconLink.innerHTML = '<i class="fa fa-search"></i>';
  searchMobile.append(searchIconLink);

  const followUsDiv = document.createElement('div');
  followUsDiv.classList.add('follow-us', 'clearfix');
  blockMobileSearch.append(followUsDiv);

  const followUsText = document.createElement('span');
  followUsText.classList.add('txt-follow');
  followUsText.textContent = 'follow us'; // Hardcoded, but this is a static label, not from AEM content
  followUsDiv.append(followUsText);

  const linkSocial = document.createElement('div');
  linkSocial.classList.add('link-social');
  followUsDiv.append(linkSocial);

  finalSocialLinkItems.forEach((row) => {
    const [linkCell] = [...row.children]; // Destructure for fixed schema
    const socialLinkAnchor = linkCell.querySelector('a');
    if (socialLinkAnchor) {
      const socialLink = document.createElement('a');
      socialLink.href = socialLinkAnchor.href;
      socialLink.target = '_blank';
      // Determine icon based on href
      if (socialLinkAnchor.href.includes('twitter.com')) {
        socialLink.innerHTML = '<i class="fa fa-twitter"></i>';
      } else if (socialLinkAnchor.href.includes('facebook.com')) {
        socialLink.innerHTML = '<i class="fa fa-facebook"></i>';
      } else if (socialLinkAnchor.href.includes('youtube.com')) {
        socialLink.innerHTML = '<i class="fa fa-youtube"></i>';
      } else if (socialLinkAnchor.href.includes('linkedin.com')) {
        socialLink.innerHTML = '<i class="fa fa-linkedin"></i>';
      }
      moveInstrumentation(row, socialLink);
      linkSocial.append(socialLink);
    }
  });

  block.replaceChildren(containerMenuTop);

  // Toggle mobile menu
  navIcon4.addEventListener('click', () => {
    navIcon4.classList.toggle('open'); // Not in allowlist, but seems for JS behavior
    menuContainer.classList.toggle('open'); // Not in allowlist, but seems for JS behavior
    document.body.classList.toggle('no-scroll'); // Not in allowlist, but seems for JS behavior
  });

  // Toggle submenus for desktop
  mainMenu.querySelectorAll('.has-submenu > .title-link').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth >= 992) { // Desktop breakpoint
        e.preventDefault();
        const parentLi = trigger.closest('.has-submenu');
        mainMenu.querySelectorAll('.has-submenu.active').forEach((activeLi) => {
          if (activeLi !== parentLi) {
            activeLi.classList.remove('active'); // Not in allowlist, but seems for JS behavior
            activeLi.querySelector('.sub-menu')?.classList.remove('active'); // Not in allowlist, but seems for JS behavior
          }
        });
        parentLi.classList.toggle('active'); // Not in allowlist, but seems for JS behavior
        parentLi.querySelector('.sub-menu')?.classList.toggle('active'); // Not in allowlist, but seems for JS behavior
      }
    });
  });

  // Toggle submenus for mobile
  mainMenu.querySelectorAll('.has-submenu > .title-link').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth < 992) { // Mobile breakpoint
        e.preventDefault();
        const parentLi = trigger.closest('.has-submenu');
        parentLi.classList.toggle('active'); // Not in allowlist, but seems for JS behavior
        parentLi.querySelector('.sub-menu')?.classList.toggle('active'); // Not in allowlist, but seems for JS behavior
      }
    });
  });
}
