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
      subWrap.classList.add('cmp-header__product-items');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('cmp-navigation__item-arrow');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('cmp-header__nav-products-click');
          subWrap.classList.toggle('cmp-header__nav-products-click');
        });
      }
    }
  });
}

export default function decorate(block) {
  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    logoRow,
    logoLinkRow,
    hamburgerIconRow,
    searchIconRow,
    ...navigationItemRows
  ] = [...block.children];

  const headerNew = document.createElement('div');
  headerNew.classList.add('header-new');

  // Background Images
  const backgroundDesktopPicture = backgroundDesktopRow.querySelector('picture');
  const backgroundMobilePicture = backgroundMobileRow.querySelector('picture');

  if (backgroundDesktopPicture) {
    const desktopImg = backgroundDesktopPicture.querySelector('img');
    if (desktopImg) {
      headerNew.style.backgroundImage = `url("${desktopImg.src}")`;
      headerNew.style.backgroundSize = '100% 100%';
      headerNew.style.backgroundPosition = 'center bottom';
      moveInstrumentation(backgroundDesktopRow, headerNew);
    }
  }

  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header');
  headerNew.append(cmpHeader);

  // Hamburger Icon
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('cmp-header__hamburger', 'menu-mobile');
  hamburgerDiv.setAttribute('type', 'button');
  const hamburgerPicture = hamburgerIconRow.querySelector('picture');
  if (hamburgerPicture) {
    const hamburgerImg = hamburgerPicture.querySelector('img');
    if (hamburgerImg) {
      hamburgerDiv.setAttribute('data-mobile-src', hamburgerImg.src);
    }
    moveInstrumentation(hamburgerIconRow, hamburgerDiv);
  }
  cmpHeader.append(hamburgerDiv);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('image', 'cmp-header__logo');
  const cmpImageDiv = document.createElement('div');
  cmpImageDiv.classList.add('cmp-image');
  logoDiv.append(cmpImageDiv);
  const logoImageDiv = document.createElement('div');
  logoImageDiv.classList.add('logo', 'image');
  cmpImageDiv.append(logoImageDiv);

  const logoLink = logoLinkRow.querySelector('a');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoAnchor = document.createElement('a');
    logoAnchor.classList.add('cmp-image__link');
    if (logoLink) {
      logoAnchor.href = logoLink.href;
    }
    logoAnchor.setAttribute('data-social', 'header');
    const optimizedLogoPicture = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ media: '(max-width:767px)', width: '767' }, { width: '200' }],
    );
    logoAnchor.append(optimizedLogoPicture);
    logoImageDiv.append(logoAnchor);
    moveInstrumentation(logoRow, logoImageDiv);
    moveInstrumentation(logoLinkRow, logoAnchor);
  }
  cmpHeader.append(logoDiv);

  // Navigation Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');
  navLinksDiv.append(navigationDiv);
  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  navigationDiv.append(nav);
  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  nav.append(navGroup);

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');
    moveInstrumentation(row, li);

    const subList = hierarchyTreeCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a')?.href;
    const labelText = labelCell?.textContent.trim();

    if (subList) {
      // Original HTML shows 'cmp-header__nav-products-click' on the LI, not the triggerLink
      // li.classList.add('cmp-header__nav-products-click'); // This class is for the LI when active, not initial state
      const triggerLink = document.createElement('a');
      triggerLink.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
      triggerLink.textContent = labelText;
      li.append(triggerLink);

      const productItemsUl = document.createElement('ul');
      productItemsUl.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      const categoryMenuDiv = document.createElement('div');
      categoryMenuDiv.classList.add('cmp-header__category-menu');
      productItemsUl.append(categoryMenuDiv);

      // Move instrumentation for the hierarchyTreeCell content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv);

      // Transform nested lists within the temporary div
      transformNestedLists(tempDiv.querySelector('ul')); // Pass the actual UL from innerHTML

      // Append children from tempDiv to categoryMenuDiv
      while (tempDiv.firstChild) {
        categoryMenuDiv.append(tempDiv.firstChild);
      }

      li.append(productItemsUl);
    } else {
      li.classList.add('cmp-header__no-items');
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation__item-link');
      if (directLink) {
        anchor.href = directLink;
      }
      anchor.textContent = labelText;
      li.append(anchor);
    }
    navGroup.append(li);
  });

  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');
  nav.append(mobileListDiv);
  cmpHeader.append(navLinksDiv);

  // Nav Icons
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');
  const searchAnchor = document.createElement('a');
  searchAnchor.href = '#';
  searchAnchor.classList.add('cmp-header__icon-img');
  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('icon-Search_icons');
  searchAnchor.append(searchIconDiv);
  searchDiv.append(searchAnchor);
  navIconsDiv.append(searchDiv);

  const searchPicture = searchIconRow.querySelector('picture');
  if (searchPicture) {
    // No direct image for search icon, it's a CSS icon.
    // Just move instrumentation for the row.
    moveInstrumentation(searchIconRow, searchIconDiv);
  }
  cmpHeader.append(navIconsDiv);

  // Search Section (placeholder for now, actual search functionality needs separate implementation)
  const searchSection = document.createElement('div');
  searchSection.classList.add('search'); // This div contains the search component
  const searchComponentSection = document.createElement('section');
  searchComponentSection.classList.add('cmp-search');
  searchComponentSection.setAttribute('role', 'search');
  searchComponentSection.setAttribute('data-cmp-min-length', '3');
  searchComponentSection.setAttribute('data-cmp-results-desktop-size', '4');
  searchComponentSection.setAttribute('data-cmp-results-mobile-size', '5');
  searchComponentSection.setAttribute('data-error-response', '{"noResultsTitle":"No result found for","noResultsDescription":"","categories":""}');
  searchComponentSection.setAttribute('data-input-placeholder', 'Juice up your search');
  searchSection.append(searchComponentSection);

  const searchInfo = document.createElement('div');
  searchInfo.classList.add('cmp_search__info');
  searchInfo.setAttribute('aria-live', 'polite');
  searchInfo.setAttribute('role', 'status');
  searchComponentSection.append(searchInfo);

  const searchForm = document.createElement('form');
  searchForm.classList.add('cmp-search__form');
  searchForm.setAttribute('data-cmp-hook-search', 'form');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('action', '/content/itc-foods-brands/bnatural/us/en.customsearchresults.json/_jcr_content/root/header/search');
  searchForm.setAttribute('autocomplete', 'off');
  searchComponentSection.append(searchForm);

  const searchInputHidden = document.createElement('input');
  searchInputHidden.setAttribute('type', 'hidden');
  searchInputHidden.id = 'searchroot';
  searchInputHidden.name = 'searchroot';
  searchInputHidden.value = '/content/itc-foods-brands/bnatural/us/en';
  searchForm.append(searchInputHidden);

  const searchFieldDiv = document.createElement('div');
  searchFieldDiv.classList.add('cmp-search__field');
  searchForm.append(searchFieldDiv);

  const searchIcon = document.createElement('i');
  searchIcon.classList.add('cmp-search__icon');
  searchIcon.setAttribute('data-cmp-hook-search', 'icon');
  searchFieldDiv.append(searchIcon);

  const searchLoadingIndicator = document.createElement('span');
  searchLoadingIndicator.classList.add('cmp-search__loading-indicator');
  searchLoadingIndicator.setAttribute('data-cmp-hook-search', 'loadingIndicator');
  searchFieldDiv.append(searchLoadingIndicator);

  const searchInput = document.createElement('input');
  searchInput.classList.add('cmp-search__input');
  searchInput.setAttribute('data-cmp-hook-search', 'input');
  searchInput.setAttribute('type', 'text');
  searchInput.name = 'fulltext';
  searchInput.placeholder = 'Search';
  searchInput.setAttribute('role', 'combobox');
  searchInput.setAttribute('aria-autocomplete', 'list');
  searchInput.setAttribute('aria-haspopup', 'true');
  searchInput.setAttribute('aria-invalid', 'false');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.setAttribute('aria-owns', 'cmp-search-results-0');
  searchFieldDiv.append(searchInput);

  const searchClearButton = document.createElement('button');
  searchClearButton.classList.add('cmp-search__clear');
  searchClearButton.setAttribute('data-cmp-hook-search', 'clear');
  searchClearButton.setAttribute('aria-label', 'Clear');
  const searchClearIcon = document.createElement('i');
  searchClearIcon.classList.add('cmp-search__clear-icon');
  searchClearButton.append(searchClearIcon);
  searchFieldDiv.append(searchClearButton);

  const searchResultsBlock = document.createElement('div');
  searchResultsBlock.classList.add('cmp-search__resultsBlock');
  searchComponentSection.append(searchResultsBlock);

  const searchResults = document.createElement('div');
  searchResults.classList.add('cmp-search__results');
  searchResults.setAttribute('aria-label', 'Search results');
  searchResults.setAttribute('data-cmp-hook-search', 'results');
  searchResults.setAttribute('role', 'listbox');
  searchResults.setAttribute('aria-multiselectable', 'false');
  searchResults.id = 'cmp-search-results-0';
  searchResultsBlock.append(searchResults);

  headerNew.append(searchSection);

  // Toggle mobile menu
  hamburgerDiv.addEventListener('click', () => {
    cmpHeader.classList.toggle('active');
    document.body.classList.toggle('disable-scroll');
  });

  // Toggle search bar
  searchAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    searchSection.classList.toggle('active');
  });

  block.replaceChildren(headerNew);
}
