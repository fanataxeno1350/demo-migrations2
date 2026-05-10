import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
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
      subWrap.classList.add('has-sub-child'); // Use original HTML class if available
      li.append(subWrap); // Append subWrap to li before adding nested
      subWrap.append(nested);
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
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    itcLogoRow,
    itcLogoLinkRow,
    koiLogoRow,
    koiLogoLinkRow,
    countryCodeRow,
    countryFlagRow,
    dropdownIconRow,
    searchIconRow,
    countryModalTitleRow,
    countryModalExperienceTextRow,
    ...itemRows
  ] = children;

  const navigationItemRows = itemRows.filter((row) => row.children.length === 3 && !row.children[0].querySelector('picture'));
  const countryOptionItemRows = itemRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('picture'));

  const headerSection = document.createElement('header');
  headerSection.classList.add('itc-header-section');

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

  // Navbar Toggler
  const navbarToggler = document.createElement('button');
  navbarToggler.classList.add('navbar-toggler', 'collapsed');
  navbarToggler.setAttribute('type', 'button');
  navbarToggler.setAttribute('aria-expanded', 'false');
  navbarToggler.setAttribute('aria-label', 'Toggle navigation');
  navbarToggler.innerHTML = '<span class="navbar-toggler-icon"></span>';
  navbar.append(navbarToggler);

  const dXlNone = document.createElement('div');
  dXlNone.classList.add('d-xl-none');
  dXlNone.innerHTML = '&nbsp;';
  navbar.append(dXlNone);

  // Logo div
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  navbar.append(logoDiv);

  const itcLogoPicture = itcLogoRow?.querySelector('picture');
  const itcLogoLink = itcLogoLinkRow?.querySelector('a')?.href;
  const koiLogoPicture = koiLogoRow?.querySelector('picture');
  const koiLogoLink = koiLogoLinkRow?.querySelector('a')?.href;

  if (itcLogoPicture && itcLogoLink) {
    const itcLink = document.createElement('a');
    itcLink.classList.add('checkLogoLink');
    itcLink.href = itcLogoLink;
    itcLink.target = '_blank';
    const itcImg = itcLogoPicture.querySelector('img');
    if (itcImg) {
      const optimizedItcPic = createOptimizedPicture(itcImg.src, itcImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(itcImg, optimizedItcPic.querySelector('img'));
      itcLink.append(optimizedItcPic);
    }
    const srOnly = document.createElement('span');
    srOnly.classList.add('cmp-link__screen-reader-only');
    srOnly.textContent = 'opens in a new tab';
    itcLink.append(srOnly);
    logoDiv.append(itcLink);
    moveInstrumentation(itcLogoRow, itcLink);
    moveInstrumentation(itcLogoLinkRow, itcLink);
  }

  if (koiLogoPicture && koiLogoLink) {
    const koiLink = document.createElement('a');
    koiLink.classList.add('cmp-image__link');
    koiLink.href = koiLogoLink;
    koiLink.target = '_blank';
    const koiImg = koiLogoPicture.querySelector('img');
    if (koiImg) {
      const optimizedKoiPic = createOptimizedPicture(koiImg.src, koiImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(koiImg, optimizedKoiPic.querySelector('img'));
      koiLink.append(optimizedKoiPic);
    }
    const srOnly = document.createElement('span');
    srOnly.classList.add('cmp-link__screen-reader-only');
    srOnly.textContent = 'opens in a new tab';
    koiLink.append(srOnly);
    logoDiv.append(koiLink);
    moveInstrumentation(koiLogoRow, koiLink);
    moveInstrumentation(koiLogoLinkRow, koiLink);
  }

  // Navbar Collapse
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center');
  navbarCollapse.id = 'navbarSupportedContent';
  navbar.append(navbarCollapse);

  navbarToggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    navbarToggler.classList.toggle('collapsed');
  });

  // Navigation Menu
  const navItem = document.createElement('div');
  navItem.classList.add('nav-item', 'navigation');
  navbarCollapse.append(navItem);

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');
  navItem.append(nav);

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group');
  nav.append(navGroup);

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const subList = hierarchyTreeCell?.querySelector('ul');
    const linkHref = linkCell?.querySelector('a')?.href || '#';
    const labelText = labelCell?.textContent.trim() || '';

    if (subList) {
      const triggerLink = document.createElement('a');
      triggerLink.classList.add('cmp-navigation__item-link', 'has-sub-menu');
      triggerLink.href = linkHref;
      triggerLink.textContent = labelText;
      li.append(triggerLink);

      const subMenuWrapper = document.createElement('div');
      subMenuWrapper.classList.add('sub-menu-wrapper');
      subMenuWrapper.append(subList);
      transformNestedLists(subList);
      li.append(subMenuWrapper);

      triggerLink.addEventListener('click', (e) => {
        if (e.target === triggerLink) {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subMenuWrapper.classList.toggle('active');
        }
      });
    } else {
      const link = document.createElement('a');
      link.classList.add('cmp-navigation__item-link');
      link.href = linkHref;
      link.textContent = labelText;
      li.append(link);
    }
    navGroup.append(li);
    moveInstrumentation(row, li);
  });

  // Header Section with Country Selector and Search
  const headerSectionRight = document.createElement('div');
  headerSectionRight.classList.add('header-section', 'd-flex', 'align-items-center', 'justify-content-end');
  navbarCollapse.append(headerSectionRight);

  // Country Selector Trigger
  const countrySelectorTrigger = document.createElement('div');
  countrySelectorTrigger.classList.add('search-icon', 'country-selector-trigger', 'd-flex', 'align-items-center');
  headerSectionRight.append(countrySelectorTrigger);

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.classList.add('country-code');
  countryCodeSpan.textContent = countryCodeRow?.textContent.trim() || '';
  countrySelectorTrigger.append(countryCodeSpan);
  moveInstrumentation(countryCodeRow, countryCodeSpan);

  const countryFlagPicture = countryFlagRow?.querySelector('picture');
  if (countryFlagPicture) {
    const countryFlagImg = countryFlagPicture.querySelector('img');
    if (countryFlagImg) {
      const optimizedFlagPic = createOptimizedPicture(countryFlagImg.src, countryFlagImg.alt, false, [{ width: '750' }]);
      optimizedFlagPic.classList.add('header-country-flag');
      moveInstrumentation(countryFlagImg, optimizedFlagPic.querySelector('img'));
      countrySelectorTrigger.append(optimizedFlagPic);
    }
    moveInstrumentation(countryFlagRow, countryFlagPicture);
  }

  const dropdownIconPicture = dropdownIconRow?.querySelector('picture');
  if (dropdownIconPicture) {
    const dropdownIconImg = dropdownIconPicture.querySelector('img');
    if (dropdownIconImg) {
      const optimizedDropdownPic = createOptimizedPicture(dropdownIconImg.src, dropdownIconImg.alt, false, [{ width: '750' }]);
      optimizedDropdownPic.classList.add('dropdown-icon');
      moveInstrumentation(dropdownIconImg, optimizedDropdownPic.querySelector('img'));
      countrySelectorTrigger.append(optimizedDropdownPic);
    }
    moveInstrumentation(dropdownIconRow, dropdownIconPicture);
  }

  // Search Icon List
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
  searchInput.setAttribute('type', 'text');
  searchInput.id = 'searchInput';
  searchInput.setAttribute('placeholder', 'Search');
  searchContainer.append(searchInput);

  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  searchContainer.append(searchButton);

  const searchIconPicture = searchIconRow?.querySelector('picture');
  if (searchIconPicture) {
    const searchIconImg = searchIconPicture.querySelector('img');
    if (searchIconImg) {
      const optimizedSearchPic = createOptimizedPicture(searchIconImg.src, searchIconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(searchIconImg, optimizedSearchPic.querySelector('img'));
      searchButton.append(optimizedSearchPic);
    }
    moveInstrumentation(searchIconRow, searchButton);
  }

  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  closeButton.setAttribute('loading', 'lazy');
  closeButton.src = '/icons/close-icon.svg'; // Hardcoded path, as per ORIGINAL HTML
  closeButton.alt = 'Close icon';
  searchBox.append(closeButton);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.classList.add('search-results', 'hidden');
  searchBlock.append(searchResults);

  const popularSuggestions = document.createElement('h4');
  popularSuggestions.classList.add('resultList');
  popularSuggestions.textContent = 'Popular Suggestions';
  searchResults.append(popularSuggestions);

  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';
  searchResults.append(suggestionsList);

  const pagesList = document.createElement('h4');
  pagesList.classList.add('resultList');
  pagesList.textContent = 'Pages';
  searchResults.append(pagesList);

  const productsList = document.createElement('ul');
  productsList.id = 'productsList';
  productsList.classList.add('products');
  searchResults.append(productsList);

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = 'VIEW ALL ITEMS';
  searchResults.append(viewAllButton);

  const searchTriggerLink = document.createElement('a');
  searchTriggerLink.classList.add('nav-link');
  itcHeaderIconList.append(searchTriggerLink);

  const searchIconImgForTrigger = document.createElement('img');
  searchIconImgForTrigger.setAttribute('loading', 'lazy');
  searchIconImgForTrigger.id = 'searchIcon';
  searchIconImgForTrigger.src = searchIconPicture?.querySelector('img')?.src || '/icons/search-icon.svg'; // Hardcoded path, as per ORIGINAL HTML
  searchIconImgForTrigger.alt = 'Search icon';
  searchTriggerLink.append(searchIconImgForTrigger);

  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-block');
  searchSpan.textContent = 'Search';
  searchTriggerLink.append(searchSpan);

  // Search functionality (simplified)
  searchTriggerLink.addEventListener('click', () => {
    searchBlock.classList.toggle('hidden');
    searchContainer.classList.toggle('hidden');
    searchResults.classList.add('hidden'); // Ensure results are hidden on first open
    searchInput.value = ''; // Clear search input
  });

  closeButton.addEventListener('click', () => {
    searchBlock.classList.add('hidden');
    searchContainer.classList.add('hidden');
    searchResults.classList.add('hidden');
  });

  // Country Modal
  const countryModal = document.createElement('div');
  countryModal.classList.add('modal', 'fade', 'itc-country-selector');
  countryModal.id = 'countryModal';
  countryModal.setAttribute('tabindex', '-1');
  countryModal.setAttribute('role', 'dialog');
  countryModal.setAttribute('aria-labelledby', 'countryModalLabel');
  countryModal.setAttribute('aria-modal', 'true');
  countryModal.style.display = 'none'; // Initially hidden
  headerSection.append(countryModal);

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
  modalDialog.setAttribute('role', 'document');
  countryModal.append(modalDialog);

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalDialog.append(modalContent);

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header', 'border-0', 'text-center');
  modalContent.append(modalHeader);

  const w100 = document.createElement('div');
  w100.classList.add('w-100');
  modalHeader.append(w100);

  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  modalTitle.innerHTML = (countryModalTitleRow?.textContent.trim() || 'SELECT YOUR <br/>KITCHENS OF INDIA');
  w100.append(modalTitle);
  moveInstrumentation(countryModalTitleRow, modalTitle);

  const experienceText = document.createElement('p');
  experienceText.classList.add('experience-text');
  experienceText.textContent = (countryModalExperienceTextRow?.textContent.trim() || 'Experience');
  w100.append(experienceText);
  moveInstrumentation(countryModalExperienceTextRow, experienceText);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  modalContent.append(modalBody);

  const countryOptions = document.createElement('div');
  countryOptions.classList.add('country-options', 'd-flex', 'justify-content-center', 'align-items-center');
  modalBody.append(countryOptions);

  countryOptionItemRows.forEach((row) => {
    const [flagCell, countryNameCell, countryLinkCell] = [...row.children];

    const countryOption = document.createElement('div');
    countryOption.classList.add('country-option', 'mx-3', 'd-flex', 'flex-column', 'align-items-center');
    countryOption.setAttribute('data-country', countryNameCell?.textContent.trim().toLowerCase() || '');
    countryOption.setAttribute('data-url', countryLinkCell?.querySelector('a')?.href || '#');

    const flagPicture = flagCell?.querySelector('picture');
    if (flagPicture) {
      const flagImg = flagPicture.querySelector('img');
      if (flagImg) {
        const optimizedFlagPic = createOptimizedPicture(flagImg.src, flagImg.alt, false, [{ width: '750' }]);
        optimizedFlagPic.classList.add('country-flag');
        optimizedFlagPic.classList.add(`${countryNameCell?.textContent.trim().toLowerCase()}-flag`);
        moveInstrumentation(flagImg, optimizedFlagPic.querySelector('img'));
        countryOption.append(optimizedFlagPic);
      }
    }

    const countryNameP = document.createElement('p');
    countryNameP.classList.add('country-name');
    countryNameP.textContent = countryNameCell?.textContent.trim() || '';
    countryOption.append(countryNameP);

    countryOptions.append(countryOption);
    moveInstrumentation(row, countryOption);

    countryOption.addEventListener('click', () => {
      window.location.href = countryOption.dataset.url;
    });
  });

  // Modal open/close logic
  countrySelectorTrigger.addEventListener('click', () => {
    countryModal.style.display = 'block';
    countryModal.classList.add('show');
  });

  countryModal.addEventListener('click', (e) => {
    // Check if the click is on the modal backdrop or a close button within the modal header
    if (e.target === countryModal || e.target.closest('.modal-header button')) {
      countryModal.style.display = 'none';
      countryModal.classList.remove('show');
    }
  });

  // Optimize all pictures in the block
  headerSection.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(headerSection);
}
