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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist. Assuming it's a new internal class.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a new internal class.
          subWrap.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a new internal class.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoItcCell,
    logoItcLinkCell,
    logoKoiCell,
    logoKoiLinkCell,
    countryFlagInCell,
    countryFlagUsaCell,
    countryCodeCell,
    dropdownIconCell,
    searchIconCell,
    searchCloseIconCell,
    searchPlaceholderCell,
    searchLabelCell,
    popularSuggestionsLabelCell,
    pagesLabelCell,
    viewAllItemsLabelCell,
    countryModalTitleCell,
    countryModalExperienceTextCell,
    ...itemRows
  ] = children;

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  const countryOptions = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture'));

  const headerSection = document.createElement('header');
  headerSection.classList.add('itc-header-section');

  const container = document.createElement('div');
  container.classList.add('container');
  headerSection.append(container);

  const nav = document.createElement('nav');
  nav.classList.add('navbar', 'navbar-expand-xl', 'navbar-light', 'bg-light', 'px-xl-5', 'd-flex', 'justify-content-between', 'align-items-center');
  container.append(nav);

  const navbarToggler = document.createElement('button');
  navbarToggler.classList.add('navbar-toggler', 'collapsed');
  navbarToggler.type = 'button';
  navbarToggler.setAttribute('aria-controls', 'navbarSupportedContent');
  navbarToggler.setAttribute('aria-expanded', 'false');
  navbarToggler.setAttribute('aria-label', 'Toggle navigation');
  navbarToggler.innerHTML = '<span class="navbar-toggler-icon"></span>';
  nav.append(navbarToggler);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('d-xl-none');
  nav.append(dXlNoneDiv);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  nav.append(logoDiv);

  const itcLogoLink = document.createElement('a');
  itcLogoLink.classList.add('checkLogoLink');
  itcLogoLink.target = '_blank';
  if (logoItcLinkCell) {
    itcLogoLink.href = logoItcLinkCell.querySelector('a')?.href || '#';
    moveInstrumentation(logoItcLinkCell, itcLogoLink);
  }
  const itcLogoPicture = logoItcCell?.querySelector('picture');
  if (itcLogoPicture) {
    const itcLogoImg = itcLogoPicture.querySelector('img');
    const optimizedItcPic = createOptimizedPicture(itcLogoImg.src, itcLogoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(itcLogoImg, optimizedItcPic.querySelector('img'));
    itcLogoLink.append(optimizedItcPic);
    moveInstrumentation(logoItcCell, itcLogoLink);
  }
  logoDiv.append(itcLogoLink);

  const koiLogoLink = document.createElement('a');
  koiLogoLink.classList.add('cmp-image__link');
  koiLogoLink.target = '_blank';
  if (logoKoiLinkCell) {
    koiLogoLink.href = logoKoiLinkCell.querySelector('a')?.href || '#';
    moveInstrumentation(logoKoiLinkCell, koiLogoLink);
  }
  const koiLogoPicture = logoKoiCell?.querySelector('picture');
  if (koiLogoPicture) {
    const koiLogoImg = koiLogoPicture.querySelector('img');
    const optimizedKoiPic = createOptimizedPicture(koiLogoImg.src, koiLogoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(koiLogoImg, optimizedKoiPic.querySelector('img'));
    koiLogoLink.append(optimizedKoiPic);
    moveInstrumentation(logoKoiCell, koiLogoLink);
  }
  logoDiv.append(koiLogoLink);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center');
  navbarCollapse.id = 'navbarSupportedContent';
  nav.append(navbarCollapse);

  const navItemNavigation = document.createElement('div');
  navItemNavigation.classList.add('nav-item', 'navigation');
  navbarCollapse.append(navItemNavigation);

  const cmpNavigation = document.createElement('nav');
  cmpNavigation.classList.add('cmp-navigation');
  cmpNavigation.setAttribute('role', 'navigation');
  navItemNavigation.append(cmpNavigation);

  const cmpNavigationGroup = document.createElement('ul');
  cmpNavigationGroup.classList.add('cmp-navigation__group');
  cmpNavigation.append(cmpNavigationGroup);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul');

    const directLink = linkCell?.querySelector('a');

    if (subList) {
      const trigger = document.createElement('a');
      trigger.classList.add('cmp-navigation__item-link');
      trigger.href = directLink?.href || '#';
      trigger.textContent = labelCell?.textContent.trim() || '';
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a new internal class.
      });
      moveInstrumentation(row, trigger);
      li.append(trigger);

      // Apply classes to nested elements from ORIGINAL HTML
      subList.querySelectorAll('li').forEach(item => item.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0'));
      subList.querySelectorAll('a').forEach(item => item.classList.add('cmp-navigation__item-link'));

      transformNestedLists(subList);
      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation for the rich text cell content
      li.append(subList);
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation__item-link');
      anchor.href = directLink?.href || '#';
      anchor.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(row, anchor);
      li.append(anchor);
    }
    cmpNavigationGroup.append(li);
  });

  const headerSectionDiv = document.createElement('div');
  headerSectionDiv.classList.add('header-section', 'd-flex', 'align-items-center', 'justify-content-end');
  navbarCollapse.append(headerSectionDiv);

  const countrySelectorTrigger = document.createElement('div');
  countrySelectorTrigger.classList.add('search-icon', 'country-selector-trigger', 'd-flex', 'align-items-center');
  headerSectionDiv.append(countrySelectorTrigger);

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.classList.add('country-code');
  countryCodeSpan.textContent = countryCodeCell?.textContent.trim() || '';
  moveInstrumentation(countryCodeCell, countryCodeSpan);
  countrySelectorTrigger.append(countryCodeSpan);

  const countryFlagImg = document.createElement('img');
  countryFlagImg.classList.add('header-country-flag');
  const countryFlagInPicture = countryFlagInCell?.querySelector('picture');
  if (countryFlagInPicture) {
    const img = countryFlagInPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    countryFlagImg.src = optimizedPic.querySelector('img').src;
    countryFlagImg.alt = optimizedPic.querySelector('img').alt;
    moveInstrumentation(countryFlagInCell, countryFlagImg);
  }
  countrySelectorTrigger.append(countryFlagImg);

  const dropdownIconImg = document.createElement('img');
  dropdownIconImg.classList.add('dropdown-icon');
  const dropdownIconPicture = dropdownIconCell?.querySelector('picture');
  if (dropdownIconPicture) {
    const img = dropdownIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    dropdownIconImg.src = optimizedPic.querySelector('img').src;
    dropdownIconImg.alt = optimizedPic.querySelector('img').alt;
    moveInstrumentation(dropdownIconCell, dropdownIconImg);
  }
  countrySelectorTrigger.append(dropdownIconImg);

  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.classList.add('itc-header-icon-list');
  nav.append(itcHeaderIconList);

  const searchBlock = document.createElement('div');
  searchBlock.classList.add('search-block', 'hidden');
  searchBlock.id = 'searchBlock';
  itcHeaderIconList.append(searchBlock);

  const searchBox = document.createElement('div');
  searchBox.classList.add('search-box');
  searchBox.id = 'searchBox';
  searchBlock.append(searchBox);

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search-container', 'hidden');
  searchContainer.id = 'searchContainer';
  searchBox.append(searchContainer);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = searchPlaceholderCell?.textContent.trim() || '';
  moveInstrumentation(searchPlaceholderCell, searchInput);
  searchContainer.append(searchInput);

  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  const searchIconImg = document.createElement('img');
  const searchIconPicture = searchIconCell?.querySelector('picture');
  if (searchIconPicture) {
    const img = searchIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    searchIconImg.src = optimizedPic.querySelector('img').src;
    searchIconImg.alt = optimizedPic.querySelector('img').alt;
    moveInstrumentation(searchIconCell, searchIconImg);
  }
  searchButton.append(searchIconImg);
  searchContainer.append(searchButton);

  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  const searchCloseIconPicture = searchCloseIconCell?.querySelector('picture');
  if (searchCloseIconPicture) {
    const img = searchCloseIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    closeButton.src = optimizedPic.querySelector('img').src;
    closeButton.alt = optimizedPic.querySelector('img').alt;
    moveInstrumentation(searchCloseIconCell, closeButton);
  }
  searchBox.append(closeButton);

  const searchResults = document.createElement('div');
  searchResults.classList.add('search-results', 'hidden');
  searchResults.id = 'searchResults';
  searchBlock.append(searchResults);

  const popularSuggestionsLabel = document.createElement('h4');
  popularSuggestionsLabel.classList.add('resultList');
  popularSuggestionsLabel.textContent = popularSuggestionsLabelCell?.textContent.trim() || '';
  moveInstrumentation(popularSuggestionsLabelCell, popularSuggestionsLabel);
  searchResults.append(popularSuggestionsLabel);

  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';
  searchResults.append(suggestionsList);

  const pagesLabel = document.createElement('h4');
  pagesLabel.classList.add('resultList');
  pagesLabel.textContent = pagesLabelCell?.textContent.trim() || '';
  moveInstrumentation(pagesLabelCell, pagesLabel);
  searchResults.append(pagesLabel);

  const productsList = document.createElement('ul');
  productsList.classList.add('products');
  productsList.id = 'productsList';
  searchResults.append(productsList);

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = viewAllItemsLabelCell?.textContent.trim() || '';
  moveInstrumentation(viewAllItemsLabelCell, viewAllButton);
  searchResults.append(viewAllButton);

  const searchLink = document.createElement('a');
  searchLink.classList.add('nav-link');
  searchLink.id = 'searchLink';
  const searchIconLinkImg = document.createElement('img');
  searchIconLinkImg.id = 'searchIcon';
  const searchIconLinkPicture = searchIconCell?.querySelector('picture');
  if (searchIconLinkPicture) {
    const img = searchIconLinkPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    searchIconLinkImg.src = optimizedPic.querySelector('img').src;
    searchIconLinkImg.alt = optimizedPic.querySelector('img').alt;
  }
  searchLink.append(searchIconLinkImg);
  const searchLabelSpan = document.createElement('span');
  searchLabelSpan.classList.add('d-block');
  searchLabelSpan.textContent = searchLabelCell?.textContent.trim() || '';
  moveInstrumentation(searchLabelCell, searchLabelSpan);
  searchLink.append(searchLabelSpan);
  itcHeaderIconList.append(searchLink);

  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade', 'itc-country-selector');
  modal.id = 'countryModal';
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'countryModalLabel');
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
  modalTitle.innerHTML = countryModalTitleCell?.innerHTML || ''; // Use innerHTML for richtext
  moveInstrumentation(countryModalTitleCell, modalTitle);
  modalHeaderW100.append(modalTitle);

  const experienceText = document.createElement('p');
  experienceText.classList.add('experience-text');
  experienceText.textContent = countryModalExperienceTextCell?.textContent.trim() || '';
  moveInstrumentation(countryModalExperienceTextCell, experienceText);
  modalHeaderW100.append(experienceText);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  modalContent.append(modalBody);

  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('country-options', 'd-flex', 'justify-content-center', 'align-items-center');
  modalBody.append(countryOptionsDiv);

  countryOptions.forEach((row) => {
    const [flagCell, countryNameCell, countryUrlCell] = [...row.children];
    const countryOption = document.createElement('div');
    countryOption.classList.add('country-option', 'mx-3', 'd-flex', 'flex-column', 'align-items-center');
    countryOption.setAttribute('data-country', countryNameCell?.textContent.trim().toLowerCase() || '');
    countryOption.setAttribute('data-url', countryUrlCell?.querySelector('a')?.href || '#');
    moveInstrumentation(row, countryOption);

    const countryFlag = document.createElement('img');
    countryFlag.classList.add('country-flag');
    if (countryNameCell?.textContent.trim().toLowerCase() === 'india') {
      countryFlag.classList.add('india-flag');
    } else if (countryNameCell?.textContent.trim().toLowerCase() === 'usa') {
      countryFlag.classList.add('usa-flag');
    }
    const flagPicture = flagCell?.querySelector('picture');
    if (flagPicture) {
      const img = flagPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      countryFlag.src = optimizedPic.querySelector('img').src;
      countryFlag.alt = optimizedPic.querySelector('img').alt;
      moveInstrumentation(flagCell, countryFlag);
    }
    countryOption.append(countryFlag);

    const countryName = document.createElement('p');
    countryName.classList.add('country-name');
    countryName.textContent = countryNameCell?.textContent.trim() || '';
    moveInstrumentation(countryNameCell, countryName);
    countryOption.append(countryName);

    countryOptionsDiv.append(countryOption);
  });

  // Event Listeners for interactive elements
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

  // Search functionality
  searchLink.addEventListener('click', () => {
    searchBlock.classList.remove('hidden');
    searchContainer.classList.remove('hidden');
  });

  closeButton.addEventListener('click', () => {
    searchBlock.classList.add('hidden');
    searchContainer.classList.add('hidden');
    searchResults.classList.add('hidden');
  });

  searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
      searchResults.classList.remove('hidden');
    } else {
      searchResults.classList.add('hidden');
    }
  });

  block.replaceChildren(headerSection);
}
