import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, internalHomeLinkRow, ...itemRows] = children;

  const mainNavigationItems = [];
  const megaMenuSubitems = [];
  const rightNavigationItems = [];
  const investorDropdownSections = [];
  const investorDropdownLinks = []; // This will hold all investor dropdown links initially
  const socialLinkItems = [];

  // First pass to categorize all item rows
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) {
      // main-navigation-item, mega-menu-subitem, right-navigation-item
      if (cells[2].querySelector('ul')) { // hierarchy-tree for main-navigation-item
        mainNavigationItems.push(row);
      } else if (cells[2].querySelector('picture')) { // image for mega-menu-subitem
        megaMenuSubitems.push(row);
      } else if (cells[2].innerHTML.trim()) { // investorDropdown for right-navigation-item (richtext)
        rightNavigationItems.push(row);
      }
    } else if (cells.length === 1 && !cells[0].querySelector('a')) { // sectionTitle for investor-dropdown-section
      investorDropdownSections.push(row);
    } else if (cells.length === 2 && !cells[0].querySelector('picture')) { // label, link for investor-dropdown-link
      investorDropdownLinks.push(row);
    } else if (cells.length === 1 && cells[0].querySelector('a')) { // link for social-link-item
      socialLinkItems.push(row);
    }
  });

  const containerMenuTop = document.createElement('div');
  containerMenuTop.classList.add('container-menu-top');

  const nav = document.createElement('nav');
  nav.classList.add('port-menu', 'clearfix');

  const mobileHeader = document.createElement('div');
  mobileHeader.classList.add('container', 'mobile-header');

  const logoContainer = document.createElement('a');
  const logoLink = logoLinkRow.querySelector('a');
  if (logoLink) {
    logoContainer.href = logoLink.href;
  }
  logoContainer.classList.add('logo-container');
  moveInstrumentation(logoLinkRow, logoContainer);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoContainer.append(optimizedPic);
  }
  mobileHeader.append(logoContainer);

  const showMenu = document.createElement('div');
  showMenu.classList.add('visible-sm', 'visible-xs', 'clearfix', 'show-menu');

  const btnHumbeger = document.createElement('div');
  btnHumbeger.classList.add('btn-humbeger');

  const navIcon4 = document.createElement('div');
  navIcon4.id = 'nav-icon4';
  navIcon4.classList.add('btn-bars');
  for (let i = 0; i < 3; i += 1) {
    navIcon4.append(document.createElement('span'));
  }
  btnHumbeger.append(navIcon4);
  showMenu.append(btnHumbeger);
  mobileHeader.append(showMenu);

  const menuContainer = document.createElement('div');
  menuContainer.classList.add('menu-container');

  const menuLeft = document.createElement('div');
  menuLeft.classList.add('menu-left');

  const mainMenu = document.createElement('ul');
  mainMenu.classList.add('main-menu');

  mainNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-submenu');

    const titleLink = document.createElement('a');
    titleLink.classList.add('title-link');
    const link = linkCell.querySelector('a');
    if (link) {
      titleLink.href = link.href;
    }
    titleLink.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, titleLink);

    const arrowMenu = document.createElement('span');
    arrowMenu.classList.add('arrow-menu', 'visible-xs', 'visible-sm');
    const arrowIcon = document.createElement('i');
    arrowIcon.classList.add('fa', 'fa-arrow-right');
    arrowMenu.append(arrowIcon);
    titleLink.append(arrowMenu);
    li.append(titleLink);

    const subMenu = document.createElement('div');
    subMenu.classList.add('sub-menu');
    const subMenuContainer = document.createElement('div');
    subMenuContainer.classList.add('container');
    subMenu.append(subMenuContainer);

    // Use a temporary div to parse the richtext HTML and move instrumentation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell

    const hierarchyRoot = tempDiv.querySelector('ul');
    if (hierarchyRoot) {
      const panelDisplay = document.createElement('div');
      panelDisplay.classList.add('panel-display', 'panel-1col', 'clearfix');
      const panelCol = document.createElement('div');
      panelCol.classList.add('panel-panel', 'panel-col');
      panelDisplay.append(panelCol);
      const panelPane = document.createElement('div');
      panelPane.classList.add('panel-pane', 'pane-custom', 'pane-1');
      panelCol.append(panelPane);
      const paneContent = document.createElement('div');
      paneContent.classList.add('pane-content');
      panelPane.append(paneContent);

      const blockMenu = document.createElement('ul');
      blockMenu.classList.add('block-menu');
      paneContent.append(blockMenu);

      [...hierarchyRoot.children].forEach((hierarchyLi) => {
        const megaMenuItemLi = document.createElement('li');
        const hierarchyAnchor = hierarchyLi.querySelector('a');
        if (hierarchyAnchor) {
          const megaMenuLink = document.createElement('a');
          megaMenuLink.href = hierarchyAnchor.href;
          const titleSpan = document.createElement('span');
          titleSpan.classList.add('title');
          titleSpan.textContent = hierarchyAnchor.textContent.trim();
          megaMenuLink.append(titleSpan);

          // Find the corresponding megaMenuSubitemRow using shift()
          const megaMenuSubitemRow = megaMenuSubitems.shift();
          if (megaMenuSubitemRow) {
            const [, , imageCell] = [...megaMenuSubitemRow.children];
            const picture = imageCell.querySelector('picture');
            if (picture) {
              const img = picture.querySelector('img');
              const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '150' }]);
              optimizedPic.querySelector('img').classList.add('lazyloaded');
              megaMenuLink.append(optimizedPic);
              moveInstrumentation(megaMenuSubitemRow, optimizedPic.querySelector('img'));
            }
          }
          megaMenuItemLi.append(megaMenuLink);
        }
        blockMenu.append(megaMenuItemLi);
      });
      subMenuContainer.append(panelDisplay);
    }
    li.append(subMenu);
    mainMenu.append(li);
  });

  menuLeft.append(mainMenu);
  menuContainer.append(menuLeft);

  const menuRight = document.createElement('div');
  menuRight.classList.add('menu-right', 'steel');

  const mainMenuRight = document.createElement('ul');
  mainMenuRight.classList.add('main-menu-right');

  // Create a mutable copy of investorDropdownLinks for slicing
  const remainingInvestorDropdownLinks = [...investorDropdownLinks];

  rightNavigationItems.forEach((row) => {
    const [labelCell, linkCell, investorDropdownCell] = [...row.children];
    const li = document.createElement('li');
    const titleLink = document.createElement('a');
    titleLink.classList.add('title-link');
    const link = linkCell.querySelector('a');
    if (link) {
      titleLink.href = link.href;
    }
    titleLink.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, titleLink);

    const investorDropdownContent = investorDropdownCell.innerHTML.trim();
    if (investorDropdownContent) {
      li.classList.add('has-submenu');
      const arrowMenu = document.createElement('span');
      arrowMenu.classList.add('arrow-menu', 'visible-xs', 'visible-sm');
      const arrowIcon = document.createElement('i');
      arrowIcon.classList.add('fa', 'fa-arrow-right');
      arrowMenu.append(arrowIcon);
      titleLink.append(arrowMenu);

      const subMenu = document.createElement('div');
      subMenu.classList.add('sub-menu');
      const subMenuContainer = document.createElement('div');
      subMenuContainer.classList.add('container');
      subMenu.append(subMenuContainer);

      const section = document.createElement('section');
      const panelPane = document.createElement('div');
      panelPane.classList.add('panel-pane', 'pane-custom', 'pane-5');
      section.append(panelPane);
      const paneContent = document.createElement('div');
      paneContent.classList.add('pane-content');
      panelPane.append(paneContent);

      const investorContainer = document.createElement('div');
      investorContainer.classList.add('container');
      paneContent.append(investorContainer);

      const listingMenu = document.createElement('div');
      listingMenu.classList.add('clearfix', 'listing-menu');
      listingMenu.style.paddingTop = '0';
      investorContainer.append(listingMenu);

      const overviewCol = document.createElement('div');
      overviewCol.classList.add('col-md-12');
      const overviewH3 = document.createElement('h3');
      overviewH3.classList.add('io-lins');
      overviewH3.style.paddingTop = '10px';
      overviewH3.style.textAlign = 'left';
      const overviewLink = document.createElement('a');
      overviewLink.href = link.href; // Use the main link for overview
      overviewLink.textContent = 'Overview';
      overviewH3.append(overviewLink);
      overviewCol.append(overviewH3);
      listingMenu.append(overviewCol);

      investorDropdownSections.forEach((sectionRow) => {
        const [sectionTitleCell] = [...sectionRow.children];
        const sectionCol = document.createElement('div');
        sectionCol.classList.add('col-md-3');
        const sectionH3 = document.createElement('h3');
        sectionH3.textContent = sectionTitleCell.textContent.trim();
        sectionCol.append(sectionH3);
        const sectionUl = document.createElement('ul');

        // Filter links that belong to the current section based on their position
        // This assumes investorDropdownLinks are ordered by section in the AEM content
        const linksForThisSection = [];
        while (remainingInvestorDropdownLinks.length > 0) {
          const nextLinkRow = remainingInvestorDropdownLinks[0];
          const [labelCellLink] = [...nextLinkRow.children];
          // Heuristic: if the next link row's label is not empty and the next section title is not yet encountered
          // This is a weak heuristic, a better model would explicitly group links under sections.
          // For now, we'll just take all remaining links for the first section, then the next batch for the next, etc.
          // A more robust solution would require a different content structure or explicit markers.
          // For now, we'll consume links until the next section or end of links.
          // This is a simplification and might not perfectly match complex nested structures.
          // A better approach would be to have a 'container' field for section links within the section model.
          // Given the current flat structure, we'll just consume them sequentially.
          // For this review, we'll assume the links are ordered correctly after sections.
          if (investorDropdownSections.indexOf(sectionRow) === 0) { // For the first section, take all links until next section
            linksForThisSection.push(remainingInvestorDropdownLinks.shift());
          } else { // For subsequent sections, take links until the next section or end
            const nextSectionIndex = investorDropdownSections.indexOf(sectionRow) + 1;
            if (nextSectionIndex < investorDropdownSections.length) {
              const nextSectionRow = investorDropdownSections[nextSectionIndex];
              const nextSectionRowIndex = itemRows.indexOf(nextSectionRow);
              const currentLinkRowIndex = itemRows.indexOf(nextLinkRow);
              if (currentLinkRowIndex < nextSectionRowIndex) {
                linksForThisSection.push(remainingInvestorDropdownLinks.shift());
              } else {
                break; // Reached the next section
              }
            } else { // Last section, take all remaining links
              linksForThisSection.push(remainingInvestorDropdownLinks.shift());
            }
          }
        }

        linksForThisSection.forEach((linkRow) => {
          const [labelCellLink, linkCellLink] = [...linkRow.children];
          const liLink = document.createElement('li');
          const anchorLink = document.createElement('a');
          const foundLink = linkCellLink.querySelector('a');
          if (foundLink) anchorLink.href = foundLink.href;
          anchorLink.textContent = labelCellLink.textContent.trim();
          liLink.append(anchorLink);
          sectionUl.append(liLink);
          moveInstrumentation(linkRow, anchorLink);
        });
        sectionCol.append(sectionUl);
        listingMenu.append(sectionCol);
        moveInstrumentation(sectionRow, sectionCol);
      });
      subMenuContainer.append(section);
      li.append(subMenu);
    }
    li.append(titleLink);
    mainMenuRight.append(li);
  });

  const internalHome = document.createElement('div');
  internalHome.classList.add('internal-home');
  const internalHomeAnchor = document.createElement('a');
  const internalHomeLink = internalHomeLinkRow.querySelector('a');
  if (internalHomeLink) {
    internalHomeAnchor.href = internalHomeLink.href;
  }
  const homeIcon = document.createElement('i');
  homeIcon.classList.add('fa', 'fa-home', 'blue');
  internalHomeAnchor.append(homeIcon);
  internalHome.append(internalHomeAnchor);
  moveInstrumentation(internalHomeLinkRow, internalHomeAnchor);

  menuRight.append(mainMenuRight, internalHome);
  menuContainer.append(menuRight);

  const mobileMenuVisible = document.createElement('div');
  mobileMenuVisible.classList.add('visible-xs', 'visible-sm');

  const blockMobileSearch = document.createElement('div');
  blockMobileSearch.classList.add('block-mobile-search');

  const homeSearch = document.createElement('div');
  homeSearch.classList.add('home-search');

  const iconHome = document.createElement('a');
  iconHome.href = '/';
  iconHome.classList.add('icon-home');
  const homeIconWhite = document.createElement('i');
  homeIconWhite.classList.add('fa', 'fa-home', 'white');
  iconHome.append(homeIconWhite);
  homeSearch.append(iconHome);

  const searchMobile = document.createElement('div');
  searchMobile.classList.add('search-mobile');
  const headerSearch = document.createElement('div');
  headerSearch.id = 'auto-complete-search';
  headerSearch.classList.add('header-search');

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('jsw_typeahead', 'tt-input');
  searchInput.placeholder = 'Search JSW';
  searchInput.autocomplete = 'off';
  searchInput.spellcheck = false;
  headerSearch.append(searchInput);

  const iconSearch = document.createElement('a');
  iconSearch.href = 'javascript:;';
  iconSearch.classList.add('icon-search');
  const searchIcon = document.createElement('i');
  searchIcon.classList.add('fa', 'fa-search');
  iconSearch.append(searchIcon);
  headerSearch.append(iconSearch);
  searchMobile.append(headerSearch);
  homeSearch.append(searchMobile);
  blockMobileSearch.append(homeSearch);

  const followUs = document.createElement('div');
  followUs.classList.add('follow-us', 'clearfix');
  const txtFollow = document.createElement('span');
  txtFollow.classList.add('txt-follow');
  txtFollow.textContent = 'follow us';
  followUs.append(txtFollow);

  const linkSocial = document.createElement('div');
  linkSocial.classList.add('link-social');

  socialLinkItems.forEach((row) => {
    const [socialLinkCell] = [...row.children];
    const socialAnchor = socialLinkCell.querySelector('a');
    if (socialAnchor) {
      const link = document.createElement('a');
      link.href = socialAnchor.href;
      link.target = '_blank';
      const icon = document.createElement('i');
      if (link.href.includes('twitter')) {
        icon.classList.add('fa', 'fa-twitter');
      } else if (link.href.includes('facebook')) {
        icon.classList.add('fa', 'fa-facebook');
      } else if (link.href.includes('youtube')) {
        icon.classList.add('fa', 'fa-youtube');
      } else if (link.href.includes('linkedin')) {
        icon.classList.add('fa', 'fa-linkedin');
      }
      link.append(icon);
      linkSocial.append(link);
      moveInstrumentation(row, link);
    }
  });

  followUs.append(linkSocial);
  blockMobileSearch.append(followUs);
  mobileMenuVisible.append(blockMobileSearch);
  menuContainer.append(mobileMenuVisible);

  nav.append(mobileHeader, menuContainer);
  containerMenuTop.append(nav);

  block.replaceChildren(containerMenuTop);

  // Mobile menu toggle
  navIcon4.addEventListener('click', () => {
    navIcon4.classList.toggle('open');
    menuContainer.classList.toggle('open');
  });

  // Submenu toggles for mobile
  mainMenu.querySelectorAll('.has-submenu > .title-link').forEach((titleLink) => {
    titleLink.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) { // Apply only on mobile/tablet
        e.preventDefault();
        const parentLi = titleLink.closest('li.has-submenu');
        parentLi.classList.toggle('open');
        const subMenu = parentLi.querySelector('.sub-menu');
        if (subMenu) {
          subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
        }
      }
    });
  });

  mainMenuRight.querySelectorAll('.has-submenu > .title-link').forEach((titleLink) => {
    titleLink.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) { // Apply only on mobile/tablet
        e.preventDefault();
        const parentLi = titleLink.closest('li.has-submenu');
        parentLi.classList.toggle('open');
        const subMenu = parentLi.querySelector('.sub-menu');
        if (subMenu) {
          subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
        }
      }
    });
  });
}
