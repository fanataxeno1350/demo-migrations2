import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, hierarchyTreeCell) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
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
      subWrap.classList.add('has-sub-child'); // use ORIGINAL HTML class
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
    // Apply instrumentation to each list item within the hierarchy
    moveInstrumentation(hierarchyTreeCell, li);
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  // Fixed fields - using destructuring for fixed schema
  const [
    countryCodeRow,
    selectedCountryFlagRow,
    dropdownIconRow,
    searchIconRow,
    searchCloseIconRow,
    searchPlaceholderRow,
    searchButtonLabelRow,
    popularSuggestionsLabelRow,
    pagesLabelRow,
    viewAllItemsLabelRow,
    modalTitleRow,
    modalExperienceTextRow,
    ...itemRows
  ] = children;

  const countryCodeCell = countryCodeRow?.children[0];
  const selectedCountryFlagCell = selectedCountryFlagRow?.children[0];
  const dropdownIconCell = dropdownIconRow?.children[0];
  const searchIconCell = searchIconRow?.children[0];
  const searchCloseIconCell = searchCloseIconRow?.children[0];
  const searchPlaceholderCell = searchPlaceholderRow?.children[0];
  const searchButtonLabelCell = searchButtonLabelRow?.children[0];
  const popularSuggestionsLabelCell = popularSuggestionsLabelRow?.children[0];
  const pagesLabelCell = pagesLabelRow?.children[0];
  const viewAllItemsLabelCell = viewAllItemsLabelRow?.children[0];
  const modalTitleCell = modalTitleRow?.children[0];
  const modalExperienceTextCell = modalExperienceTextRow?.children[0];

  const logoItems = itemRows.filter(
    (row) => row.children.length === 3 && row.querySelector('picture'),
  );
  const navigationItems = itemRows.filter(
    (row) => row.children.length === 2 && !row.querySelector('picture'),
  );
  const countryOptionItems = itemRows.filter(
    (row) => row.children.length === 3 && row.querySelector('picture') && row.querySelector('a'),
  );

  const headerSection = document.createElement('header');
  headerSection.classList.add('itc-header-section');
  moveInstrumentation(block, headerSection); // Move instrumentation from block to new root

  const container = document.createElement('div');
  container.classList.add('container');
  headerSection.append(container);

  const navbar = document.createElement('nav');
  navbar.classList.add(
    'navbar',
    'navbar-expand-xl',
    'navbar-light',
    'bg-light',
    'px-xl-5',
    'd-flex',
    'justify-content-between',
    'align-items-center',
  );
  container.append(navbar);

  const navbarToggler = document.createElement('button');
  navbarToggler.classList.add('navbar-toggler', 'collapsed');
  navbarToggler.type = 'button';
  navbarToggler.setAttribute('aria-controls', 'navbarSupportedContent');
  navbarToggler.setAttribute('aria-expanded', 'false');
  navbarToggler.setAttribute('aria-label', 'Toggle navigation');
  navbar.append(navbarToggler);

  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('navbar-toggler-icon');
  navbarToggler.append(togglerIcon);

  const dXlNone = document.createElement('div');
  dXlNone.classList.add('d-xl-none');
  dXlNone.innerHTML = '&nbsp;';
  navbar.append(dXlNone);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  navbar.append(logoDiv);

  if (logoItems.length > 0) {
    const [logoImageCell, logoLinkCell, hierarchyTreeCell] = [...logoItems[0].children];
    const logoLink = logoLinkCell?.querySelector('a');
    const logoPicture = logoImageCell?.querySelector('picture');

    if (logoPicture) {
      const optimizedPic = createOptimizedPicture(
        logoPicture.querySelector('img').src,
        logoPicture.querySelector('img').alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(logoImageCell, optimizedPic.querySelector('img'));

      const logoAnchor = document.createElement('a');
      logoAnchor.classList.add('cmp-image__link');
      if (logoLink) {
        logoAnchor.href = logoLink.href;
      }
      logoAnchor.target = '_blank';
      logoAnchor.append(optimizedPic);
      logoDiv.append(logoAnchor);
    }

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl, hierarchyTreeCell); // Pass hierarchyTreeCell for instrumentation
      const navItemNavigation = document.createElement('div');
      navItemNavigation.classList.add('nav-item', 'navigation');
      collapseDiv.append(navItemNavigation);

      const nav = document.createElement('nav');
      nav.id = 'navigation-6d5dcb0126'; // Hardcoded ID from original HTML
      nav.classList.add('cmp-navigation');
      nav.setAttribute('role', 'navigation');
      navItemNavigation.append(nav);

      const navGroup = document.createElement('ul');
      navGroup.classList.add('cmp-navigation__group');
      nav.append(navGroup);

      [...hierarchyUl.children].forEach((li) => {
        const navItem = document.createElement('li');
        navItem.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
        // moveInstrumentation already handled in transformNestedLists for each li
        navItem.append(li);
        navGroup.append(navItem);
      });
    }
  }

  const collapseDiv = document.createElement('div');
  collapseDiv.classList.add('collapse', 'navbar-collapse', 'justify-content-center');
  collapseDiv.id = 'navbarSupportedContent';
  navbar.append(collapseDiv);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = linkCell?.querySelector('a');

    const navItem = document.createElement('li');
    navItem.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    moveInstrumentation(row, navItem);

    const navLink = document.createElement('a');
    navLink.classList.add('cmp-navigation__item-link');
    if (link) {
      navLink.href = link.href;
    }
    navLink.textContent = labelCell?.textContent.trim() || '';
    navItem.append(navLink);
    // Ensure navGroup exists before appending
    let navGroup = collapseDiv.querySelector('.cmp-navigation__group');
    if (!navGroup) {
      const navItemNavigation = document.createElement('div');
      navItemNavigation.classList.add('nav-item', 'navigation');
      collapseDiv.append(navItemNavigation);

      const nav = document.createElement('nav');
      nav.id = 'navigation-6d5dcb0126'; // Hardcoded ID from original HTML
      nav.classList.add('cmp-navigation');
      nav.setAttribute('role', 'navigation');
      navItemNavigation.append(nav);

      navGroup = document.createElement('ul');
      navGroup.classList.add('cmp-navigation__group');
      nav.append(navGroup);
    }
    navGroup.append(navItem);
  });

  const headerSectionDiv = document.createElement('div');
  headerSectionDiv.classList.add('header-section', 'd-flex', 'align-items-center', 'justify-content-end');
  collapseDiv.append(headerSectionDiv);

  const countrySelectorTrigger = document.createElement('div');
  countrySelectorTrigger.classList.add('search-icon', 'country-selector-trigger', 'd-flex', 'align-items-center');
  headerSectionDiv.append(countrySelectorTrigger);

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.classList.add('country-code');
  countryCodeSpan.textContent = countryCodeCell?.textContent.trim() || '';
  moveInstrumentation(countryCodeRow, countryCodeSpan);
  countrySelectorTrigger.append(countryCodeSpan);

  if (selectedCountryFlagCell) {
    const flagPicture = selectedCountryFlagCell.querySelector('picture');
    if (flagPicture) {
      const optimizedPic = createOptimizedPicture(
        flagPicture.querySelector('img').src,
        flagPicture.querySelector('img').alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(selectedCountryFlagRow, optimizedPic.querySelector('img'));
      const flagImg = optimizedPic.querySelector('img');
      flagImg.classList.add('header-country-flag');
      countrySelectorTrigger.append(flagImg);
    }
  }

  if (dropdownIconCell) {
    const dropdownPicture = dropdownIconCell.querySelector('picture');
    if (dropdownPicture) {
      const optimizedPic = createOptimizedPicture(
        dropdownPicture.querySelector('img').src,
        dropdownPicture.querySelector('img').alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(dropdownIconRow, optimizedPic.querySelector('img'));
      const dropdownImg = optimizedPic.querySelector('img');
      dropdownImg.classList.add('dropdown-icon');
      dropdownImg.alt = 'dropdown-icon';
      countrySelectorTrigger.append(dropdownImg);
    }
  }

  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.classList.add('itc-header-icon-list');
  navbar.append(itcHeaderIconList);

  const searchBlock = document.createElement('div');
  searchBlock.id = 'searchBlock';
  searchBlock.classList.add('search-block', 'hidden');
  itcHeaderIconList.append(searchBlock);

  const searchBox = document.createElement('div');
  searchBox.id = 'searchBox';
  searchBox.classList.add('search-box');
  searchBlock.append(searchBox);

  const searchContainer = document.createElement('div');
  searchContainer.id = 'searchContainer';
  searchContainer.classList.add('search-container', 'hidden');
  searchBox.append(searchContainer);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = searchPlaceholderCell?.textContent.trim() || 'Search';
  moveInstrumentation(searchPlaceholderRow, searchInput);
  searchContainer.append(searchInput);

  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  searchButton.textContent = searchButtonLabelCell?.textContent.trim() || '';
  moveInstrumentation(searchButtonLabelRow, searchButton);
  searchContainer.append(searchButton);

  if (searchIconCell) {
    const searchIconPicture = searchIconCell.querySelector('picture');
    if (searchIconPicture) {
      const optimizedPic = createOptimizedPicture(
        searchIconPicture.querySelector('img').src,
        searchIconPicture.querySelector('img').alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(searchIconRow, optimizedPic.querySelector('img'));
      searchButton.append(optimizedPic);
    }
  }

  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  closeButton.loading = 'lazy';
  closeButton.alt = 'Close icon';
  if (searchCloseIconCell) {
    const closeIconPicture = searchCloseIconCell.querySelector('picture');
    if (closeIconPicture) {
      const optimizedPic = createOptimizedPicture(
        closeIconPicture.querySelector('img').src,
        closeIconPicture.querySelector('img').alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(searchCloseIconRow, optimizedPic.querySelector('img'));
      closeButton.src = optimizedPic.querySelector('img').src;
    }
  }
  searchBox.append(closeButton);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.classList.add('search-results', 'hidden');
  searchBlock.append(searchResults);

  const popularSuggestionsH4 = document.createElement('h4');
  popularSuggestionsH4.classList.add('resultList');
  popularSuggestionsH4.textContent = popularSuggestionsLabelCell?.textContent.trim() || 'Popular Suggestions';
  moveInstrumentation(popularSuggestionsLabelRow, popularSuggestionsH4);
  searchResults.append(popularSuggestionsH4);

  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';
  searchResults.append(suggestionsList);

  const pagesH4 = document.createElement('h4');
  pagesH4.classList.add('resultList');
  pagesH4.textContent = pagesLabelCell?.textContent.trim() || 'Pages';
  moveInstrumentation(pagesLabelRow, pagesH4);
  searchResults.append(pagesH4);

  const productsList = document.createElement('ul');
  productsList.id = 'productsList';
  productsList.classList.add('products');
  searchResults.append(productsList);

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = viewAllItemsLabelCell?.textContent.trim() || 'VIEW ALL ITEMS';
  moveInstrumentation(viewAllItemsLabelRow, viewAllButton);
  searchResults.append(viewAllButton);

  const searchIconLink = document.createElement('a');
  searchIconLink.classList.add('nav-link');
  itcHeaderIconList.append(searchIconLink);

  const searchIconImg = document.createElement('img');
  searchIconImg.loading = 'lazy';
  searchIconImg.id = 'searchIcon';
  searchIconImg.alt = 'Search icon';
  if (searchIconCell) {
    const searchIconPicture = searchIconCell.querySelector('picture');
    if (searchIconPicture) {
      const optimizedPic = createOptimizedPicture(
        searchIconPicture.querySelector('img').src,
        searchIconPicture.querySelector('img').alt,
        false,
        [{ width: '750' }],
      );
      // Instrumentation already moved for the first searchIconCell usage
      searchIconImg.src = optimizedPic.querySelector('img').src;
    }
  }
  searchIconLink.append(searchIconImg);

  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-block');
  searchSpan.textContent = 'Search'; // This "Search" text is hardcoded in ORIGINAL HTML, not from a cell
  searchIconLink.append(searchSpan);

  const navItemLi = document.createElement('li');
  navItemLi.classList.add('nav-item');
  const navItemA = document.createElement('a');
  navItemA.classList.add('nav-link');
  navItemLi.append(navItemA);
  itcHeaderIconList.append(navItemLi);

  // Modal Structure
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade', 'itc-country-selector', 'show');
  modal.id = 'countryModal';
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'countryModalLabel');
  modal.setAttribute('aria-modal', 'true');
  modal.style.display = 'none'; // Initially hidden
  headerSection.append(modal);

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
  modalDialog.setAttribute('role', 'document');
  modal.append(modalDialog);

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalDialog.append(modalContent);

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header', 'border-0', 'text-center');
  modalContent.append(modalHeader);

  const modalHeaderW100 = document.createElement('div');
  modalHeaderW100.classList.add('w-100');
  modalHeader.append(modalHeaderW100);

  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  // The ORIGINAL HTML has <br/> inside the title, so use innerHTML
  modalTitle.innerHTML = modalTitleCell?.innerHTML || 'SELECT YOUR <br/>KITCHENS OF INDIA';
  moveInstrumentation(modalTitleRow, modalTitle);
  modalHeaderW100.append(modalTitle);

  const experienceText = document.createElement('p');
  experienceText.classList.add('experience-text');
  experienceText.textContent = modalExperienceTextCell?.textContent.trim() || 'Experience';
  moveInstrumentation(modalExperienceTextRow, experienceText);
  modalHeaderW100.append(experienceText);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  modalContent.append(modalBody);

  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('country-options', 'd-flex', 'justify-content-center', 'align-items-center');
  modalBody.append(countryOptionsDiv);

  countryOptionItems.forEach((row, index) => {
    const [flagCell, countryNameCell, countryUrlCell] = [...row.children];
    const countryUrl = countryUrlCell?.querySelector('a');

    const countryOption = document.createElement('div');
    countryOption.classList.add('country-option', 'mx-3', 'd-flex', 'flex-column', 'align-items-center');
    if (index === 0) {
      countryOption.classList.add('selected');
    }
    countryOption.setAttribute('data-country', countryNameCell?.textContent.trim().toLowerCase() || '');
    if (countryUrl) {
      countryOption.setAttribute('data-url', countryUrl.href);
    }
    moveInstrumentation(row, countryOption);
    countryOptionsDiv.append(countryOption);

    if (flagCell) {
      const flagPicture = flagCell.querySelector('picture');
      if (flagPicture) {
        const optimizedPic = createOptimizedPicture(
          flagPicture.querySelector('img').src,
          flagPicture.querySelector('img').alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(flagCell, optimizedPic.querySelector('img'));
        const flagImg = optimizedPic.querySelector('img');
        flagImg.classList.add('country-flag');
        flagImg.classList.add(`${countryNameCell?.textContent.trim().toLowerCase()}-flag`);
        countryOption.append(flagImg);
      }
    }

    const countryNameP = document.createElement('p');
    countryNameP.classList.add('country-name');
    countryNameP.textContent = countryNameCell?.textContent.trim() || '';
    countryOption.append(countryNameP);
  });

  // Event Listeners for interactive elements
  navbarToggler.addEventListener('click', () => {
    collapseDiv.classList.toggle('show');
    navbarToggler.classList.toggle('collapsed');
  });

  searchIconLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    searchBlock.classList.toggle('hidden');
    searchContainer.classList.toggle('hidden');
    searchResults.classList.add('hidden'); // Hide results when opening search
  });

  closeButton.addEventListener('click', () => {
    searchBlock.classList.add('hidden');
    searchContainer.classList.add('hidden');
    searchResults.classList.add('hidden');
    searchInput.value = ''; // Clear search input
  });

  countrySelectorTrigger.addEventListener('click', () => {
    modal.classList.add('show');
    modal.style.display = 'block';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  });

  block.replaceChildren(headerSection);

  // Optimize images
  headerSection.querySelectorAll('picture > img').forEach((img) => {
    // Check if the img is already part of an optimized picture, if so, skip
    if (!img.closest('picture').dataset.optimized) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation already called on the original cell for these images
      img.closest('picture').replaceWith(optimizedPic);
      optimizedPic.dataset.optimized = 'true'; // Mark as optimized to prevent re-processing
    }
  });
}
