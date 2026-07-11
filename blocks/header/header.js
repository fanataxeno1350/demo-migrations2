import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nestedUl = li.querySelector(':scope > ul'); // Select direct child ul
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      // If no direct anchor, wrap text content in a span
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

    if (nestedUl) {
      nestedUl.remove(); // Remove the original nested ul
      const subWrap = document.createElement('ul');
      subWrap.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      // Append children of the original nestedUl to subWrap
      while (nestedUl.firstChild) {
        const nestedLi = nestedUl.firstChild;
        if (nestedLi.nodeType === Node.ELEMENT_NODE && nestedLi.tagName === 'LI') {
          // Apply classes from ORIGINAL HTML to nested <li>
          nestedLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1', 'cmp-header__no-item');
          const nestedAnchor = nestedLi.querySelector('a');
          if (nestedAnchor) {
            nestedAnchor.classList.add('cmp-navigation__item-link');
          }
        }
        subWrap.append(nestedLi);
      }
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('cmp-navigation__item-arrow');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('cmp-header__nav-products-click');
          subWrap.classList.toggle('cmp-header__product-items--open');
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
    menuIconMobileRow,
    searchIconRow,
    searchInputPlaceholderRow,
    // navigationItemsContainerRow is implicitly handled by the remaining rows
    ...navigationItemRows
  ] = [...block.children];

  const headerNew = document.createElement('div');
  headerNew.classList.add('header-new');
  moveInstrumentation(block, headerNew);

  // Background Images
  const backgroundDesktopPicture = backgroundDesktopRow.querySelector('picture');
  const backgroundMobilePicture = backgroundMobileRow.querySelector('picture'); // Added for mobile background

  if (backgroundDesktopPicture) {
    const desktopImg = backgroundDesktopPicture.querySelector('img');
    if (desktopImg) {
      headerNew.style.backgroundImage = `url("${desktopImg.src}")`;
      headerNew.style.backgroundSize = '100% 100%';
      headerNew.style.backgroundPosition = 'center bottom';
    }
  }
  // Mobile background image can be set here if needed, or handled by CSS media queries.
  // For now, we'll ensure the mobile picture is available for potential future use or CSS.
  if (backgroundMobilePicture) {
    // If there's a specific need to set mobile background via JS, uncomment and adjust.
    // For now, assume CSS handles it or it's not directly applied via JS.
    // const mobileImg = backgroundMobilePicture.querySelector('img');
    // if (mobileImg) {
    //   headerNew.style.setProperty('--mobile-background-image', `url("${mobileImg.src}")`);
    // }
  }


  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header');
  headerNew.append(cmpHeader);

  // Hamburger Menu (Mobile)
  const cmpHeaderHamburger = document.createElement('div');
  cmpHeaderHamburger.classList.add('cmp-header__hamburger', 'menu-mobile');
  cmpHeaderHamburger.setAttribute('type', 'button'); // type="button" is for <button>, not <div>. Remove or change to data-type.
  const menuIconMobilePicture = menuIconMobileRow.querySelector('picture');
  if (menuIconMobilePicture) {
    const menuIconImg = menuIconMobilePicture.querySelector('img');
    if (menuIconImg) {
      cmpHeaderHamburger.style.backgroundImage = `url("${menuIconImg.src}")`;
      cmpHeaderHamburger.style.backgroundSize = 'contain';
      cmpHeaderHamburger.style.backgroundRepeat = 'no-repeat';
      cmpHeaderHamburger.style.backgroundPosition = 'center';
    }
  }
  moveInstrumentation(menuIconMobileRow, cmpHeaderHamburger);
  cmpHeader.append(cmpHeaderHamburger);

  // Logo
  const cmpHeaderLogo = document.createElement('div');
  cmpHeaderLogo.classList.add('image', 'cmp-header__logo');
  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  const logoAnchor = document.createElement('a');
  logoAnchor.classList.add('cmp-image__link');
  logoAnchor.setAttribute('data-social', 'header');
  const logoLink = logoLinkRow.querySelector('a');
  if (logoLink) {
    logoAnchor.href = logoLink.href;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const optimizedPic = createOptimizedPicture(logoPicture.querySelector('img').src, logoPicture.querySelector('img').alt, false, [{ width: '767' }]);
    // moveInstrumentation for optimizedPic's img is tricky, better to move for the whole picture element if possible
    // or ensure the original img's instrumentation is moved to the new img if it's a direct replacement.
    // For now, moving instrumentation from the original picture to the new optimized one.
    moveInstrumentation(logoPicture, optimizedPic);
    logoAnchor.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoAnchor);
  moveInstrumentation(logoLinkRow, logoAnchor);
  logoDiv.append(logoAnchor);
  cmpImage.append(logoDiv);
  cmpHeaderLogo.append(cmpImage);
  cmpHeader.append(cmpHeaderLogo);

  // Navigation Links
  const cmpHeaderNavLinks = document.createElement('div');
  cmpHeaderNavLinks.classList.add('cmp-header__nav-links');
  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');
  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  // No specific navigationItemsContainerRow in the model, so move instrumentation from the first navigation item row
  // if it's meant to represent the container. Otherwise, it's fine as is.
  // For now, assuming navigationItemsContainerRow was a placeholder and actual instrumentation starts with itemRows.
  // If there was a distinct row for the container, its instrumentation should be moved to navGroup.

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

    const linkText = labelCell?.textContent.trim();
    const linkHref = linkCell?.querySelector('a')?.href || '#';

    // Check if hierarchyTreeCell contains a UL
    const hasSubList = hierarchyTreeCell?.querySelector('ul');

    if (hasSubList) {
      // Original HTML has cmp-header__nav-products-click on the li if it has sub-items
      li.classList.add('cmp-header__nav-products-click');
      const triggerLink = document.createElement('a');
      triggerLink.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
      triggerLink.textContent = linkText;
      triggerLink.href = linkHref; // Add href to trigger link
      moveInstrumentation(labelCell, triggerLink);
      moveInstrumentation(linkCell, triggerLink);
      li.append(triggerLink);

      const categoryMenu = document.createElement('div');
      categoryMenu.classList.add('cmp-header__category-menu');

      // Create a temporary div to parse the richtext HTML and apply transformations
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell to tempDiv

      const rootUlInTempDiv = tempDiv.querySelector('ul');
      if (rootUlInTempDiv) {
        transformNestedLists(rootUlInTempDiv); // Transform the nested list structure
        // Append the transformed UL's children directly to categoryMenu
        while (rootUlInTempDiv.firstChild) {
          categoryMenu.append(rootUlInTempDiv.firstChild);
        }
      }

      const productItemsUl = document.createElement('ul');
      productItemsUl.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      productItemsUl.append(categoryMenu); // Append the categoryMenu (which now contains the transformed list items)

      li.append(productItemsUl);
    } else {
      li.classList.add('cmp-header__no-items');
      const flatLink = document.createElement('a');
      flatLink.classList.add('cmp-navigation__item-link');
      flatLink.textContent = linkText;
      flatLink.href = linkHref;
      moveInstrumentation(labelCell, flatLink);
      moveInstrumentation(linkCell, flatLink);
      li.append(flatLink);
    }
    navGroup.append(li);
    moveInstrumentation(row, li);
  });

  nav.append(navGroup);
  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');
  nav.append(mobileList);
  navigationDiv.append(nav);
  cmpHeaderNavLinks.append(navigationDiv);
  cmpHeader.append(cmpHeaderNavLinks);

  // Nav Icons (Search)
  const cmpHeaderNavIcons = document.createElement('div');
  cmpHeaderNavIcons.classList.add('cmp-header__nav-icons');
  const cmpHeaderSearch = document.createElement('div');
  cmpHeaderSearch.classList.add('cmp-header__search');
  const searchIconLink = document.createElement('a');
  searchIconLink.href = '#';
  searchIconLink.classList.add('cmp-header__icon-img');
  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('icon-Search_icons');
  const searchIconPicture = searchIconRow.querySelector('picture');
  if (searchIconPicture) {
    const searchIconImg = searchIconPicture.querySelector('img');
    if (searchIconImg) {
      searchIconDiv.style.backgroundImage = `url("${searchIconImg.src}")`;
      searchIconDiv.style.backgroundSize = 'contain';
      searchIconDiv.style.backgroundRepeat = 'no-repeat';
      searchIconDiv.style.backgroundPosition = 'center';
    }
  }
  moveInstrumentation(searchIconRow, searchIconDiv);
  searchIconLink.append(searchIconDiv);
  cmpHeaderSearch.append(searchIconLink);
  cmpHeaderNavIcons.append(cmpHeaderSearch);
  cmpHeader.append(cmpHeaderNavIcons);

  // Search Section
  const searchSection = document.createElement('div');
  searchSection.classList.add('search');
  const cmpSearch = document.createElement('section');
  cmpSearch.classList.add('cmp-search');
  cmpSearch.setAttribute('role', 'search');
  cmpSearch.setAttribute('data-cmp-min-length', '3');
  cmpSearch.setAttribute('data-cmp-results-desktop-size', '4');
  cmpSearch.setAttribute('data-cmp-results-mobile-size', '5');
  cmpSearch.setAttribute('data-error-response', '{"noResultsTitle":"No result found for","noResultsDescription":"","categories":""}');
  cmpSearch.setAttribute('data-input-placeholder', searchInputPlaceholderRow.textContent.trim());

  const cmpSearchInfo = document.createElement('div');
  cmpSearchInfo.classList.add('cmp_search__info');
  cmpSearchInfo.setAttribute('aria-live', 'polite');
  cmpSearchInfo.setAttribute('role', 'status');
  cmpSearch.append(cmpSearchInfo);

  const cmpSearchForm = document.createElement('form');
  cmpSearchForm.classList.add('cmp-search__form');
  cmpSearchForm.setAttribute('data-cmp-hook-search', 'form');
  cmpSearchForm.setAttribute('method', 'get');
  cmpSearchForm.setAttribute('action', '/content/itc-foods-brands/bnatural/us/en.customsearchresults.json/_jcr_content/root/header/search');
  cmpSearchForm.setAttribute('autocomplete', 'off');
  cmpSearch.append(cmpSearchForm);

  const searchRootInput = document.createElement('input');
  searchRootInput.setAttribute('type', 'hidden');
  searchRootInput.setAttribute('id', 'searchroot');
  searchRootInput.setAttribute('name', 'searchroot');
  searchRootInput.setAttribute('value', '/content/itc-foods-brands/bnatural/us/en');
  cmpSearchForm.append(searchRootInput);

  const cmpSearchField = document.createElement('div');
  cmpSearchField.classList.add('cmp-search__field');
  cmpSearchForm.append(cmpSearchField);

  const searchIcon = document.createElement('i');
  searchIcon.classList.add('cmp-search__icon');
  searchIcon.setAttribute('data-cmp-hook-search', 'icon');
  cmpSearchField.append(searchIcon);

  const loadingIndicator = document.createElement('span');
  loadingIndicator.classList.add('cmp-search__loading-indicator');
  loadingIndicator.setAttribute('data-cmp-hook-search', 'loadingIndicator');
  cmpSearchField.append(loadingIndicator);

  const searchInput = document.createElement('input');
  searchInput.classList.add('cmp-search__input');
  searchInput.setAttribute('data-cmp-hook-search', 'input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('name', 'fulltext');
  searchInput.setAttribute('placeholder', searchInputPlaceholderRow.textContent.trim());
  searchInput.setAttribute('role', 'combobox');
  searchInput.setAttribute('aria-autocomplete', 'list');
  searchInput.setAttribute('aria-haspopup', 'true');
  searchInput.setAttribute('aria-invalid', 'false');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.setAttribute('aria-owns', 'cmp-search-results-0');
  moveInstrumentation(searchInputPlaceholderRow, searchInput);
  cmpSearchField.append(searchInput);

  const searchClearButton = document.createElement('button');
  searchClearButton.classList.add('cmp-search__clear');
  searchClearButton.setAttribute('data-cmp-hook-search', 'clear');
  searchClearButton.setAttribute('aria-label', 'Clear');
  const clearIcon = document.createElement('i');
  clearIcon.classList.add('cmp-search__clear-icon');
  searchClearButton.append(clearIcon);
  cmpSearchField.append(searchClearButton);

  const searchResultsBlock = document.createElement('div');
  searchResultsBlock.classList.add('cmp-search__resultsBlock');
  cmpSearch.append(searchResultsBlock);

  const searchResults = document.createElement('div');
  searchResults.classList.add('cmp-search__results');
  searchResults.setAttribute('aria-label', 'Search results');
  searchResults.setAttribute('data-cmp-hook-search', 'results');
  searchResults.setAttribute('role', 'listbox');
  searchResults.setAttribute('aria-multiselectable', 'false');
  searchResults.setAttribute('id', 'cmp-search-results-0');
  searchResultsBlock.append(searchResults);

  searchSection.append(cmpSearch);
  headerNew.append(searchSection);

  // Event Listeners for mobile menu and search
  cmpHeaderHamburger.addEventListener('click', () => {
    cmpHeaderNavLinks.classList.toggle('cmp-header__nav-links--open');
    cmpHeaderHamburger.classList.toggle('cmp-header__hamburger--open');
    document.body.classList.toggle('no-scroll');
  });

  searchIconLink.addEventListener('click', (e) => {
    e.preventDefault();
    searchSection.classList.toggle('cmp-search--open');
    if (searchSection.classList.contains('cmp-search--open')) {
      searchInput.focus();
    }
  });

  searchClearButton.addEventListener('click', (e) => {
    e.preventDefault();
    searchInput.value = '';
    searchInput.focus();
  });

  block.replaceChildren(headerNew);
}
