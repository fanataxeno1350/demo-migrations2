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
      subWrap.classList.add('cmp-header__submenu');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        li.classList.add('cmp-header__nav-products-click');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('cmp-header__nav-products-click');
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    navigationMenuContainer, // This is a placeholder for the container, not an actual row
    policyLinksContainer,    // This is a placeholder for the container, not an actual row
    socialLinksContainer,    // This is a placeholder for the container, not an actual row
    navIconsContainer,       // This is a placeholder for the container, not an actual row
    searchBlockContainer,    // This is a placeholder for the container, not an actual row
    ...itemRows
  ] = children;

  const header = document.createElement('div');
  header.classList.add('cmp-header');

  // Hamburger menu (mobile)
  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  header.append(hamburgerInput);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo', 'image', 'cmp-header__logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  }
  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoWrapper.append(logoLink);
  header.append(logoWrapper);

  // Navigation Links
  const navLinksWrapper = document.createElement('div');
  navLinksWrapper.classList.add('cmp-header__nav-links');
  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');
  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  // Filter item rows based on their structure and content
  const navItemRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('ul'));
  const policyLinkRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('a[data-social]') && !row.querySelector('picture'));
  const socialLinkRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a[data-social]'));
  const navIconRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('a') && !row.querySelector('picture') && !row.querySelector('ul'));
  const searchBlockRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('a') && !row.querySelector('picture') && !row.querySelector('ul'));


  // Navigation Menu Items
  navItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

    const link = document.createElement('a');
    link.classList.add('cmp-navigation__item-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, link);
    moveInstrumentation(linkCell, link);
    li.append(link);

    const subList = hierarchyTreeCell.querySelector('ul');
    if (subList) {
      const productItems = document.createElement('ul');
      productItems.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      const categoryMenu = document.createElement('div');
      categoryMenu.classList.add('cmp-header__category-menu');
      productItems.append(categoryMenu);

      // Create a temporary div to hold the hierarchyTreeCell content for instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Instrument the cell itself

      const transformedUl = tempDiv.querySelector('ul');
      if (transformedUl) {
        transformNestedLists(transformedUl);
        [...transformedUl.children].forEach((subLi) => {
          subLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1');
          const subAnchor = subLi.querySelector(':scope > a');
          if (subAnchor) {
            subAnchor.classList.add('cmp-navigation__item-link');
          }
          // Move instrumentation for each nested list item
          moveInstrumentation(subLi, subLi); // Instrument the sub-list item itself
          categoryMenu.append(subLi);
        });
      }
      li.append(productItems);
      li.classList.add('cmp-header__nav-products-click');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('cmp-header__nav-products-click');
      });
    } else {
      li.classList.add('cmp-header__no-items');
    }
    moveInstrumentation(row, li);
    navGroup.append(li);
  });

  nav.append(navGroup);
  navigationDiv.append(nav);
  navLinksWrapper.append(navigationDiv);

  // Mobile list wrapper
  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');

  // Policy Links
  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  policyLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-header__policy-list');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, link); // Instrument labelCell
    moveInstrumentation(linkCell, link); // Instrument linkCell
    moveInstrumentation(row, li);
    li.append(link);
    policyUl.append(li);
  });
  mobileList.append(policyUl);

  // Social Links
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  socialLinkRows.forEach((row) => {
    const [linkCell, socialKindCell] = [...row.children];
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    const socialKind = socialKindCell.textContent.trim().toLowerCase();
    // Corrected class name from icon-facebok to icon-facebook based on ORIGINAL HTML
    link.classList.add(`icon-${socialKind === 'facebook' ? 'facebook' : socialKind}`);
    link.setAttribute('data-social', socialKind);
    link.setAttribute('target', '_blank');
    moveInstrumentation(linkCell, link); // Instrument linkCell
    moveInstrumentation(socialKindCell, link); // Instrument socialKindCell
    moveInstrumentation(row, link);
    socialMediaDiv.append(link);
  });
  mobileList.append(socialMediaDiv);
  nav.append(mobileList);
  header.append(navLinksWrapper);

  // Nav Icons
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');
  navIconRows.forEach((row) => {
    const [iconKindCell, linkCell, labelCell] = [...row.children];
    const iconKind = iconKindCell.textContent.trim().toLowerCase();
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add(`cmp-header__${iconKind}`);
    if (iconKind === 'accessibility' || iconKind === 'login') {
      wrapperDiv.classList.add('cmp-header__hide-icon');
    }

    const link = document.createElement('a');
    link.classList.add('cmp-header__icon-img');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }

    const iconDiv = document.createElement('div');
    iconDiv.classList.add(`icon-${iconKind}`);
    link.append(iconDiv);

    const labelText = labelCell.textContent.trim();
    if (labelText) {
      const textDiv = document.createElement('div');
      textDiv.classList.add('cmp-header__icon-text');
      textDiv.textContent = labelText;
      link.append(textDiv);
    }
    moveInstrumentation(iconKindCell, link); // Instrument iconKindCell
    moveInstrumentation(linkCell, link); // Instrument linkCell
    moveInstrumentation(labelCell, link); // Instrument labelCell
    wrapperDiv.append(link);
    moveInstrumentation(row, wrapperDiv);
    navIconsDiv.append(wrapperDiv);
  });
  header.append(navIconsDiv);

  // Search Block (always appears last in the header's children)
  const searchSection = document.createElement('section');
  searchSection.classList.add('search', 'aem-GridColumn', 'aem-GridColumn--default--12');
  const searchBlockDiv = document.createElement('div');
  searchBlockDiv.classList.add('cmp-search');
  searchBlockDiv.setAttribute('role', 'search');
  searchBlockDiv.setAttribute('data-cmp-min-length', '3');
  searchBlockDiv.setAttribute('data-cmp-results-desktop-size', '8');
  searchBlockDiv.setAttribute('data-cmp-results-mobile-size', '5');
  searchBlockDiv.setAttribute('data-error-response', '{"noResultsTitle":"Sorry, we cannot find what you are looking for :(","noResultsDescription":"Please try a new search term or browse through one of our product categories.","categories":[{"categoryName":"Gluten Free Flour","categoryURL":"https://aashirvaad.com/header-pages/our-products/atta/gluten-free-flour.html"},{"categoryName":"Aashirvaad Atta","categoryURL":"https://aashirvaad.com/header-pages/our-products/atta/select-atta.html"},{"categoryName":"Aashirvaad Salt","categoryURL":"https://aashirvaad.com/header-pages/our-products/salt/iodized-salt.html"}]}');

  const searchInfo = document.createElement('div');
  searchInfo.classList.add('cmp_search__info');
  searchInfo.setAttribute('aria-live', 'polite');
  searchInfo.setAttribute('role', 'status');
  searchBlockDiv.append(searchInfo);

  const searchForm = document.createElement('form');
  searchForm.classList.add('cmp-search__form');
  searchForm.setAttribute('data-cmp-hook-search', 'form');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('action', '/content/itc-foods-brands/aashirvaad/us/en.customsearchresults.json/_jcr_content/root/search');
  searchForm.setAttribute('autocomplete', 'off');

  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.id = 'searchroot';
  hiddenInput.name = 'searchroot';
  hiddenInput.value = '/content/itc-foods-brands/aashirvaad/us/en';
  searchForm.append(hiddenInput);

  const searchField = document.createElement('div');
  searchField.classList.add('cmp-search__field');

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
  searchInput.type = 'text';
  searchInput.name = 'fulltext';
  searchInput.setAttribute('role', 'combobox');
  searchInput.setAttribute('aria-autocomplete', 'list');
  searchInput.setAttribute('aria-haspopup', 'true');
  searchInput.setAttribute('aria-invalid', 'false');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.id = 'cmp-search-results-0'; // This ID needs to be unique if multiple search blocks
  searchField.append(searchInput);

  const clearButton = document.createElement('button');
  clearButton.classList.add('cmp-search__clear');
  clearButton.setAttribute('data-cmp-hook-search', 'clear');
  clearButton.setAttribute('aria-label', 'Clear');
  const clearIcon = document.createElement('i');
  clearIcon.classList.add('cmp-search__clear-icon');
  clearButton.append(clearIcon);
  searchField.append(clearButton);

  searchForm.append(searchField);
  searchBlockDiv.append(searchForm);

  const searchResults = document.createElement('div');
  searchResults.classList.add('cmp-search__results');
  searchResults.setAttribute('aria-label', 'Search results');
  searchResults.setAttribute('data-cmp-hook-search', 'results');
  searchResults.setAttribute('role', 'listbox');
  searchResults.setAttribute('aria-multiselectable', 'false');
  searchResults.id = 'cmp-search-results-0'; // This ID needs to be unique if multiple search blocks
  searchBlockDiv.append(searchResults);

  if (searchBlockRows.length > 0) {
    const [placeholderCell, actionCell] = [...searchBlockRows[0].children];
    searchInput.placeholder = placeholderCell.textContent.trim();
    searchForm.action = actionCell.textContent.trim();
    searchBlockDiv.setAttribute('data-input-placeholder', placeholderCell.textContent.trim());
    moveInstrumentation(placeholderCell, searchInput); // Instrument placeholderCell
    moveInstrumentation(actionCell, searchForm); // Instrument actionCell
    moveInstrumentation(searchBlockRows[0], searchBlockDiv);
  }
  searchSection.append(searchBlockDiv);

  // moveInstrumentation for the container rows (which are not actual content rows)
  // These are not actual rows with content, but placeholders in the block.children array
  // We need to ensure their instrumentation is moved to the corresponding wrapper elements.
  moveInstrumentation(navigationMenuContainer, navLinksWrapper);
  moveInstrumentation(policyLinksContainer, mobileList);
  moveInstrumentation(socialLinksContainer, socialMediaDiv);
  moveInstrumentation(navIconsContainer, navIconsDiv);
  moveInstrumentation(searchBlockContainer, searchSection);

  block.replaceChildren(header, searchSection);
}
