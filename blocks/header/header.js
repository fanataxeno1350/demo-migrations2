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
      subWrap.classList.add('has-sub-child');
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
  });
}

export default function decorate(block) {
  const allRows = [...block.children];

  // Destructure root-level fields based on BlockJson model
  const primaryLogoRow = allRows[0];
  const primaryLogoLinkRow = allRows[1];
  const secondaryLogoRow = allRows[2];
  const secondaryLogoLinkRow = allRows[3];

  // Navigation Menu rows start after the 4 logo rows and before the next single fields
  const navigationMenuRows = allRows.filter(
    (row, index) => index >= 4 && row.children.length === 3 && row.querySelector('div:nth-child(3)')?.querySelector('ul'),
  );

  // Remaining single fields after navigationMenuRows
  const countryFlagRow = allRows[4 + navigationMenuRows.length];
  const countryCodeRow = allRows[5 + navigationMenuRows.length];
  const dropdownIconRow = allRows[6 + navigationMenuRows.length];
  const searchIconRow = allRows[7 + navigationMenuRows.length];
  const searchIconNavRow = allRows[8 + navigationMenuRows.length];
  const searchLabelRow = allRows[9 + navigationMenuRows.length];
  const searchInputPlaceholderRow = allRows[10 + navigationMenuRows.length];
  const closeIconRow = allRows[11 + navigationMenuRows.length];
  const popularSuggestionsTitleRow = allRows[12 + navigationMenuRows.length];
  const pagesTitleRow = allRows[13 + navigationMenuRows.length];
  const viewAllButtonLabelRow = allRows[14 + navigationMenuRows.length];
  const modalTitleRow = allRows[15 + navigationMenuRows.length];
  const modalSubtitleRow = allRows[16 + navigationMenuRows.length];

  // Country Option rows start after all single fields
  const countryOptionRows = allRows.filter(
    (row, index) => index >= (17 + navigationMenuRows.length) && row.children.length === 4 && row.querySelector('div:nth-child(4)')?.querySelector('a'),
  );

  const primaryLogoCell = primaryLogoRow.querySelector('picture');
  const primaryLogoLinkCell = primaryLogoLinkRow.querySelector('a');
  const secondaryLogoCell = secondaryLogoRow.querySelector('picture');
  const secondaryLogoLinkCell = secondaryLogoLinkRow.querySelector('a');

  const countryFlagCell = countryFlagRow.querySelector('picture');
  const countryCodeCell = countryCodeRow.children[0]; // text cell
  const dropdownIconCell = dropdownIconRow.querySelector('picture');
  const searchIconCell = searchIconRow.querySelector('picture');
  const searchIconNavCell = searchIconNavRow.querySelector('picture');
  const searchLabelCell = searchLabelRow.children[0]; // text cell
  const searchInputPlaceholderCell = searchInputPlaceholderRow.children[0]; // text cell
  const closeIconCell = closeIconRow.querySelector('picture');
  const popularSuggestionsTitleCell = popularSuggestionsTitleRow.children[0]; // text cell
  const pagesTitleCell = pagesTitleRow.children[0]; // text cell
  const viewAllButtonLabelCell = viewAllButtonLabelRow.children[0]; // text cell
  const modalTitleCell = modalTitleRow.children[0]; // text cell (but original HTML suggests richtext)
  const modalSubtitleCell = modalSubtitleRow.children[0]; // text cell

  const header = document.createElement('header');
  header.classList.add('itc-header-section');

  const container = document.createElement('div');
  container.classList.add('container');

  const nav = document.createElement('nav');
  nav.classList.add(
    'navbar',
    'navbar-expand-xl',
    'navbar-light',
    'bg-light',
    'px-xl-5',
    'd-flex',
    'justify-content-between',
    'align-items-center',
  );

  const navbarToggler = document.createElement('button');
  navbarToggler.classList.add('navbar-toggler', 'collapsed');
  navbarToggler.type = 'button';
  navbarToggler.setAttribute('aria-controls', 'navbarSupportedContent');
  navbarToggler.setAttribute('aria-expanded', 'false');
  navbarToggler.setAttribute('aria-label', 'Toggle navigation');
  navbarToggler.innerHTML = '<span class="navbar-toggler-icon"></span>';

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('d-xl-none');
  dXlNoneDiv.innerHTML = '&nbsp;';

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');

  const primaryLogoLink = document.createElement('a');
  if (primaryLogoLinkCell) {
    primaryLogoLink.href = primaryLogoLinkCell.href;
  }
  primaryLogoLink.classList.add('checkLogoLink');
  if (primaryLogoCell) {
    const primaryLogoImg = primaryLogoCell.querySelector('img');
    if (primaryLogoImg) {
      const optimizedPic = createOptimizedPicture(
        primaryLogoImg.src,
        primaryLogoImg.alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(primaryLogoImg, optimizedPic.querySelector('img'));
      primaryLogoLink.append(optimizedPic);
    }
  }

  const secondaryLogoLink = document.createElement('a');
  if (secondaryLogoLinkCell) {
    secondaryLogoLink.href = secondaryLogoLinkCell.href;
    secondaryLogoLink.target = '_blank';
  }
  secondaryLogoLink.classList.add('cmp-image__link');
  if (secondaryLogoCell) {
    const secondaryLogoImg = secondaryLogoCell.querySelector('img');
    if (secondaryLogoImg) {
      const optimizedPic = createOptimizedPicture(
        secondaryLogoImg.src,
        secondaryLogoImg.alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(secondaryLogoImg, optimizedPic.querySelector('img'));
      secondaryLogoLink.append(optimizedPic);
    }
  }

  logoDiv.append(primaryLogoLink, secondaryLogoLink);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center');
  navbarCollapse.id = 'navbarSupportedContent';

  const navItemNavigation = document.createElement('div');
  navItemNavigation.classList.add('nav-item', 'navigation');

  const cmpNavigation = document.createElement('nav');
  cmpNavigation.classList.add('cmp-navigation');
  cmpNavigation.setAttribute('role', 'navigation');

  const cmpNavigationGroup = document.createElement('ul');
  cmpNavigationGroup.classList.add('cmp-navigation__group');

  navigationMenuRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const navItem = document.createElement('li');
    navItem.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-navigation__item-link');
    if (linkCell?.querySelector('a')) {
      anchor.href = linkCell.querySelector('a').href;
    }
    if (labelCell) {
      anchor.textContent = labelCell.textContent.trim();
    }
    moveInstrumentation(row, navItem);

    navItem.append(anchor);

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      transformNestedLists(subList);
      navItem.append(subList);
      navItem.classList.add('has-sub-child');
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navItem.classList.toggle('active');
      });
    }

    cmpNavigationGroup.append(navItem);
  });

  cmpNavigation.append(cmpNavigationGroup);
  navItemNavigation.append(cmpNavigation);

  const headerSection = document.createElement('div');
  headerSection.classList.add('header-section', 'd-flex', 'align-items-center', 'justify-content-end');

  const countrySelectorTrigger = document.createElement('div');
  countrySelectorTrigger.classList.add('search-icon', 'country-selector-trigger', 'd-flex', 'align-items-center');

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.classList.add('country-code');
  if (countryCodeCell) {
    countryCodeSpan.textContent = countryCodeCell.textContent.trim();
  }

  if (countryFlagCell) {
    const countryFlagImg = countryFlagCell.querySelector('img');
    if (countryFlagImg) {
      const optimizedPic = createOptimizedPicture(
        countryFlagImg.src,
        countryFlagImg.alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(countryFlagImg, optimizedPic.querySelector('img'));
      countrySelectorTrigger.append(optimizedPic);
    }
  }

  if (dropdownIconCell) {
    const dropdownIconImg = dropdownIconCell.querySelector('img');
    if (dropdownIconImg) {
      const optimizedPic = createOptimizedPicture(
        dropdownIconImg.src,
        dropdownIconImg.alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(dropdownIconImg, optimizedPic.querySelector('img'));
      countrySelectorTrigger.append(optimizedPic);
    }
  }

  countrySelectorTrigger.append(countryCodeSpan);

  headerSection.append(countrySelectorTrigger);

  navbarCollapse.append(navItemNavigation, headerSection);

  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.classList.add('itc-header-icon-list');

  const searchBlock = document.createElement('div');
  searchBlock.id = 'searchBlock';
  searchBlock.classList.add('search-block', 'hidden');

  const searchBox = document.createElement('div');
  searchBox.id = 'searchBox';
  searchBox.classList.add('search-box');

  const searchContainer = document.createElement('div');
  searchContainer.id = 'searchContainer';
  searchContainer.classList.add('search-container', 'hidden');

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  if (searchInputPlaceholderCell) {
    searchInput.placeholder = searchInputPlaceholderCell.textContent.trim();
  }

  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  if (searchIconCell) {
    const searchIconImg = searchIconCell.querySelector('img');
    if (searchIconImg) {
      const optimizedPic = createOptimizedPicture(
        searchIconImg.src,
        searchIconImg.alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(searchIconImg, optimizedPic.querySelector('img'));
      searchButton.append(optimizedPic);
    }
  }

  searchContainer.append(searchInput, searchButton);

  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  if (closeIconCell) {
    const closeIconImg = closeIconCell.querySelector('img');
    if (closeIconImg) {
      closeButton.src = closeIconImg.src;
      closeButton.alt = closeIconImg.alt;
      moveInstrumentation(closeIconImg, closeButton);
    }
  }

  searchBox.append(searchContainer, closeButton);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.classList.add('search-results', 'hidden');

  const popularSuggestionsTitle = document.createElement('h4');
  popularSuggestionsTitle.classList.add('resultList');
  if (popularSuggestionsTitleCell) {
    popularSuggestionsTitle.textContent = popularSuggestionsTitleCell.textContent.trim();
  }

  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';

  const pagesTitle = document.createElement('h4');
  pagesTitle.classList.add('resultList');
  if (pagesTitleCell) {
    pagesTitle.textContent = pagesTitleCell.textContent.trim();
  }

  const productsList = document.createElement('ul');
  productsList.id = 'productsList';
  productsList.classList.add('products');

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  if (viewAllButtonLabelCell) {
    viewAllButton.textContent = viewAllButtonLabelCell.textContent.trim();
  }

  searchResults.append(
    popularSuggestionsTitle,
    suggestionsList,
    pagesTitle,
    productsList,
    viewAllButton,
  );
  searchBlock.append(searchBox, searchResults);

  const searchNavLink = document.createElement('a');
  searchNavLink.classList.add('nav-link');
  searchNavLink.id = 'searchIcon'; // Add ID for event listener
  if (searchIconNavCell) {
    const searchIconNavImg = searchIconNavCell.querySelector('img');
    if (searchIconNavImg) {
      const optimizedPic = createOptimizedPicture(
        searchIconNavImg.src,
        searchIconNavImg.alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(searchIconNavImg, optimizedPic.querySelector('img'));
      searchNavLink.append(optimizedPic);
    }
  }
  const searchLabelSpan = document.createElement('span');
  searchLabelSpan.classList.add('d-block');
  if (searchLabelCell) {
    searchLabelSpan.textContent = searchLabelCell.textContent.trim();
  }
  searchNavLink.append(searchLabelSpan);

  itcHeaderIconList.append(searchBlock, searchNavLink);

  const navItemLi = document.createElement('li');
  navItemLi.classList.add('nav-item');
  const emptyNavLink = document.createElement('a');
  emptyNavLink.classList.add('nav-link');
  navItemLi.append(emptyNavLink);
  itcHeaderIconList.append(navItemLi);

  nav.append(navbarToggler, dXlNoneDiv, logoDiv, navbarCollapse, itcHeaderIconList);

  container.append(nav);
  header.append(container);

  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade', 'itc-country-selector');
  modal.id = 'countryModal';
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'countryModalLabel');
  modal.setAttribute('aria-modal', 'true');

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
  modalDialog.setAttribute('role', 'document');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header', 'border-0', 'text-center');

  const modalHeaderW100 = document.createElement('div');
  modalHeaderW100.classList.add('w-100');

  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  if (modalTitleCell) {
    // Original HTML suggests this is richtext, so use innerHTML
    modalTitle.innerHTML = modalTitleCell.innerHTML;
  }

  const experienceText = document.createElement('p');
  experienceText.classList.add('experience-text');
  if (modalSubtitleCell) {
    experienceText.textContent = modalSubtitleCell.textContent.trim();
  }

  modalHeaderW100.append(modalTitle, experienceText);
  modalHeader.append(modalHeaderW100);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('country-options', 'd-flex', 'justify-content-center', 'align-items-center');

  countryOptionRows.forEach((row) => {
    const [flagCell, countryNameCell, countryCodeAttrCell, countryUrlCellContainer] = [...row.children];
    const countryUrlCell = countryUrlCellContainer?.querySelector('a');

    const countryOption = document.createElement('div');
    countryOption.classList.add('country-option', 'mx-3', 'd-flex', 'flex-column', 'align-items-center');
    if (countryCodeAttrCell) {
      countryOption.dataset.country = countryCodeAttrCell.textContent.trim().toLowerCase();
    }
    if (countryUrlCell) {
      countryOption.dataset.url = countryUrlCell.href;
    }
    moveInstrumentation(row, countryOption);

    if (flagCell) {
      const flagImg = flagCell.querySelector('img');
      if (flagImg) {
        const optimizedPic = createOptimizedPicture(
          flagImg.src,
          flagImg.alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(flagImg, optimizedPic.querySelector('img'));
        countryOption.append(optimizedPic);
      }
    }

    const countryName = document.createElement('p');
    countryName.classList.add('country-name');
    if (countryNameCell) {
      countryName.textContent = countryNameCell.textContent.trim();
    }
    countryOption.append(countryName);
    countryOptionsDiv.append(countryOption);
  });

  modalBody.append(countryOptionsDiv);
  modalContent.append(modalHeader, modalBody);
  modalDialog.append(modalContent);
  modal.append(modalDialog);

  header.append(modal);

  block.replaceChildren(header);

  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 0) {
      header.classList.add('nav-up');
    } else {
      header.classList.remove('nav-up');
    }
    lastScrollY = window.scrollY;
  });

  navbarToggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    navbarToggler.classList.toggle('collapsed');
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

  const searchIconEl = block.querySelector('#searchIcon'); // Corrected variable name to avoid conflict
  const searchBlockEl = block.querySelector('#searchBlock');
  const closeButtonEl = block.querySelector('#closeButton');
  const searchContainerEl = block.querySelector('#searchContainer');

  searchIconEl.addEventListener('click', () => {
    searchBlockEl.classList.remove('hidden');
    searchContainerEl.classList.remove('hidden');
  });

  closeButtonEl.addEventListener('click', () => {
    searchBlockEl.classList.add('hidden');
    searchContainerEl.classList.add('hidden');
  });
}
