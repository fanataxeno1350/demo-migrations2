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
      subWrap.classList.add('cmp-header__category-menu');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('cmp-header__nav-products-click');
          li.classList.toggle('cmp-header__nav-products'); // Ensure this class is toggled
          subWrap.classList.toggle('cmp-header__product-items'); // This class is on the UL, not the div
        });
      }
    } else if (anchor) {
      anchor.classList.add('cmp-navigation__item-link');
      li.classList.add('cmp-header__no-item');
    } else {
      const span = li.querySelector(':scope > span');
      if (span) {
        span.classList.add('cmp-navigation__item-link');
        li.classList.add('cmp-header__no-items');
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
    menuIconMobileRow,
    searchIconRow,
    containerRow, // Placeholder for navigationItems container
    ...navigationItemRows
  ] = [...block.children];

  const headerNew = document.createElement('div');
  headerNew.classList.add('header-new'); // Block's own class, but this is the root wrapper, so it's fine.

  // Background Images
  const backgroundDesktopPicture = backgroundDesktopRow?.querySelector('picture');
  const backgroundMobilePicture = backgroundMobileRow?.querySelector('picture');

  if (backgroundDesktopPicture) {
    const img = backgroundDesktopPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '5120' }]);
    const desktopImg = optimizedPic.querySelector('img');
    desktopImg.setAttribute('media', '(min-width: 768px)');
    headerNew.style.backgroundImage = `url(${desktopImg.src})`;
    headerNew.style.backgroundSize = '100% 100%';
    headerNew.style.backgroundPosition = 'center bottom';
  }

  if (backgroundMobilePicture) {
    const img = backgroundMobilePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1440' }]);
    const mobileImg = optimizedPic.querySelector('img');
    mobileImg.setAttribute('media', '(max-width: 767px)');
    // Note: The original HTML uses inline style for background-image.
    // For mobile, we'd ideally use CSS media queries. For now, we'll
    // prioritize desktop and let CSS handle mobile if available.
    // If a mobile-specific background is needed, it would require
    // JS to toggle or CSS to override.
  }

  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header');
  headerNew.append(cmpHeader);

  // Hamburger Icon (Mobile)
  const hamburger = document.createElement('div');
  hamburger.classList.add('cmp-header__hamburger', 'menu-mobile');
  hamburger.setAttribute('type', 'button');
  const menuIconMobilePicture = menuIconMobileRow?.querySelector('picture');
  if (menuIconMobilePicture) {
    const img = menuIconMobilePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '48' }]);
    moveInstrumentation(menuIconMobileRow, optimizedPic.querySelector('img')); // Instrumentation from row, not img
    hamburger.append(optimizedPic);
  }
  cmpHeader.append(hamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('image', 'cmp-header__logo');
  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  logoWrapper.append(cmpImage);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  cmpImage.append(logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const foundLogoLink = logoLinkRow?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  } else {
    logoLink.href = '/'; // Default to home if no link authored
  }

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img')); // Instrumentation from row, not img
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoLinkRow, logoLink); // Move instrumentation from logoLinkRow to the anchor
  logoDiv.append(logoLink);
  cmpHeader.append(logoWrapper);

  // Navigation Links
  const navLinks = document.createElement('div');
  navLinks.classList.add('cmp-header__nav-links');
  const navigation = document.createElement('div');
  navigation.classList.add('navigation');
  navLinks.append(navigation);
  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  navigation.append(nav);
  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  nav.append(navGroup);

  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');
  nav.append(mobileList);

  // moveInstrumentation(containerRow, navGroup); // containerRow is a placeholder, no actual content to move

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      li.classList.add('cmp-header__nav-products'); // Add this class for items with sub-lists
      const triggerLink = document.createElement('a');
      triggerLink.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
      triggerLink.textContent = labelCell?.textContent.trim() || '';
      triggerLink.href = linkCell?.querySelector('a')?.href || 'javascript:void(0)'; // Use link if present, otherwise void

      li.append(triggerLink);
      const productItemsUl = document.createElement('ul');
      productItemsUl.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      li.append(productItemsUl);

      const categoryMenuDiv = document.createElement('div');
      categoryMenuDiv.classList.add('cmp-header__category-menu');
      productItemsUl.append(categoryMenuDiv);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from hierarchyTreeCell

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('li').forEach((subLi) => {
        subLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1');
        const subAnchor = subLi.querySelector(':scope > a');
        if (subAnchor) {
          subAnchor.classList.add('cmp-navigation__item-link');
          if (!subLi.querySelector(':scope > ul')) { // If no further nested UL, it's a no-item
            subLi.classList.add('cmp-header__no-item');
          }
        }
      });
      tempDiv.querySelectorAll('ul').forEach((ul) => {
        ul.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      });

      // Transform nested lists within the temporary div
      transformNestedLists(tempDiv.querySelector('ul'));

      while (tempDiv.firstChild) {
        categoryMenuDiv.append(tempDiv.firstChild);
      }

      triggerLink.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('cmp-header__nav-products-click');
        productItemsUl.classList.toggle('cmp-header__product-items');
      });
    } else {
      // For items without sub-lists, apply cmp-header__no-items and cmp-header__nav-products
      li.classList.add('cmp-header__no-items', 'cmp-header__nav-products');
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation__item-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell?.textContent.trim() || '';
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    navGroup.append(li);
  });
  cmpHeader.append(navLinks);

  // Nav Icons (Search)
  const navIcons = document.createElement('div');
  navIcons.classList.add('cmp-header__nav-icons');
  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');
  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('cmp-header__icon-img');
  const searchIconSpan = document.createElement('div');
  searchIconSpan.classList.add('icon-Search_icons');

  const searchIconPicture = searchIconRow?.querySelector('picture');
  if (searchIconPicture) {
    const img = searchIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
    moveInstrumentation(searchIconRow, optimizedPic.querySelector('img')); // Instrumentation from row, not img
    searchIconSpan.append(optimizedPic);
  } else {
    // Fallback for search icon if not authored
    searchIconSpan.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
  }

  searchLink.append(searchIconSpan);
  searchDiv.append(searchLink);
  navIcons.append(searchDiv);
  cmpHeader.append(navIcons);

  // Search Section (from original HTML for structure and classes)
  const searchSection = document.createElement('div');
  searchSection.classList.add('search');
  const cmpSearch = document.createElement('section');
  cmpSearch.classList.add('cmp-search');
  cmpSearch.setAttribute('role', 'search');
  cmpSearch.setAttribute('data-cmp-min-length', '3');
  cmpSearch.setAttribute('data-cmp-results-desktop-size', '4');
  cmpSearch.setAttribute('data-cmp-results-mobile-size', '5');
  cmpSearch.setAttribute('data-error-response', '{"noResultsTitle":"No result found for","noResultsDescription":"","categories":""}');
  cmpSearch.setAttribute('data-input-placeholder', 'Juice up your search');

  const searchInfo = document.createElement('div');
  searchInfo.classList.add('cmp_search__info');
  searchInfo.setAttribute('aria-live', 'polite');
  searchInfo.setAttribute('role', 'status');
  cmpSearch.append(searchInfo);

  const searchForm = document.createElement('form');
  searchForm.classList.add('cmp-search__form');
  searchForm.setAttribute('data-cmp-hook-search', 'form');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('action', '/content/itc-foods-brands/bnatural/us/en.customsearchresults.json/_jcr_content/root/header/search');
  searchForm.setAttribute('autocomplete', 'off');
  cmpSearch.append(searchForm);

  const searchRootInput = document.createElement('input');
  searchRootInput.setAttribute('type', 'hidden');
  searchRootInput.setAttribute('id', 'searchroot');
  searchRootInput.setAttribute('name', 'searchroot');
  searchRootInput.setAttribute('value', '/content/itc-foods-brands/bnatural/us/en');
  searchForm.append(searchRootInput);

  const searchField = document.createElement('div');
  searchField.classList.add('cmp-search__field');
  searchForm.append(searchField);

  const searchIcon = document.createElement('i');
  searchIcon.classList.add('cmp-search__icon');
  searchIcon.setAttribute('data-cmp-hook-search', 'icon');
  searchField.append(searchIcon);

  const loadingIndicator = document.createElement('span');
  loadingIndicator.classList.add('cmp-search__loading-indicator');
  loadingIndicator.setAttribute('data-cmp-hook-search', 'loadingIndicator');
  searchField.append(loadingIndicator);

  const searchInput = document.createElement('input');
  searchInput.classList.add('cmp-search__input');
  searchInput.setAttribute('data-cmp-hook-search', 'input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('name', 'fulltext');
  searchInput.setAttribute('placeholder', 'Search');
  searchInput.setAttribute('role', 'combobox');
  searchInput.setAttribute('aria-autocomplete', 'list');
  searchInput.setAttribute('aria-haspopup', 'true');
  searchInput.setAttribute('aria-invalid', 'false');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.setAttribute('aria-owns', 'cmp-search-results-0');
  searchField.append(searchInput);

  const clearButton = document.createElement('button');
  clearButton.classList.add('cmp-search__clear');
  clearButton.setAttribute('data-cmp-hook-search', 'clear');
  clearButton.setAttribute('aria-label', 'Clear');
  const clearIcon = document.createElement('i');
  clearIcon.classList.add('cmp-search__clear-icon');
  clearButton.append(clearIcon);
  searchField.append(clearButton);

  const resultsBlock = document.createElement('div');
  resultsBlock.classList.add('cmp-search__resultsBlock');
  cmpSearch.append(resultsBlock);

  const searchResults = document.createElement('div');
  searchResults.classList.add('cmp-search__results');
  searchResults.setAttribute('aria-label', 'Search results');
  searchResults.setAttribute('data-cmp-hook-search', 'results');
  searchResults.setAttribute('role', 'listbox');
  searchResults.setAttribute('aria-multiselectable', 'false');
  searchResults.setAttribute('id', 'cmp-search-results-0');
  resultsBlock.append(searchResults);

  searchSection.append(cmpSearch);
  headerNew.append(searchSection);

  // Event Listeners for mobile menu and search toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('cmp-header__nav-links--open');
    hamburger.classList.toggle('cmp-header__hamburger--open');
    document.body.classList.toggle('no-scroll'); // Example: prevent body scroll
  });

  searchLink.addEventListener('click', (e) => {
    e.preventDefault();
    searchSection.classList.toggle('search--open');
    document.body.classList.toggle('no-scroll');
  });

  clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    searchInput.value = '';
    // Optionally trigger a search update or clear results
  });

  block.replaceChildren(headerNew);
}
