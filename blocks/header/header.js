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
      subWrap.classList.add('cmp-header__product-items'); // Use class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow'); // Use classes from ORIGINAL HTML
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    } else if (anchor) {
      // For items without nested lists, ensure they have the correct link class
      anchor.classList.add('cmp-navigation__item-link');
    }
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, navigationMenuContainer, ...navigationItemRows] = [...block.children];

  const headerNew = document.createElement('div');
  headerNew.classList.add('header-new');
  moveInstrumentation(block, headerNew);

  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header');
  headerNew.append(cmpHeader);

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('cmp-header__hamburger', 'menu-mobile');
  hamburger.setAttribute('type', 'button');
  // data-mobile-src is not used in EDS, so no need to copy
  cmpHeader.append(hamburger);

  // Logo
  const imageCmpHeaderLogo = document.createElement('div');
  imageCmpHeaderLogo.classList.add('image', 'cmp-header__logo');
  cmpHeader.append(imageCmpHeaderLogo);

  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  imageCmpHeaderLogo.append(cmpImage);

  const logoImage = document.createElement('div');
  logoImage.classList.add('logo', 'image');
  cmpImage.append(logoImage);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  // moveInstrumentation for logoLinkRow to logoLink
  moveInstrumentation(logoLinkRow, logoLink);
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  logoImage.append(logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation for img to optimizedPic's img
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }

  // Navigation Links
  const cmpHeaderNavLinks = document.createElement('div');
  cmpHeaderNavLinks.classList.add('cmp-header__nav-links');
  cmpHeader.append(cmpHeaderNavLinks);

  const navigation = document.createElement('div');
  navigation.classList.add('navigation');
  cmpHeaderNavLinks.append(navigation);

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  navigation.append(nav);

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  nav.append(navGroup);

  // Move instrumentation from the container row to the navGroup
  moveInstrumentation(navigationMenuContainer, navGroup);

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');
    moveInstrumentation(row, li);

    // Create a temporary div to parse the richtext HTML and move instrumentation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul'); // Get the ul from the parsed HTML

    const directLink = linkCell?.querySelector('a');

    if (subList) {
      li.classList.add('cmp-header__nav-products-click');
      const triggerLink = document.createElement('a');
      triggerLink.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
      triggerLink.textContent = labelCell.textContent.trim();
      triggerLink.href = directLink?.href || 'javascript:void(0)'; // If no direct link, use JS void

      const productItems = document.createElement('ul');
      productItems.classList.add('cmp-navigation__group', 'cmp-header__product-items');

      const categoryMenu = document.createElement('div');
      categoryMenu.classList.add('cmp-header__category-menu');
      productItems.append(categoryMenu);

      // Transform nested lists directly on the extracted subList
      transformNestedLists(subList);

      // Append transformed list items to categoryMenu, moving instrumentation
      // Iterate over the children of the original hierarchyTreeCell to move instrumentation
      // This ensures instrumentation on the <ul> and <li> elements is preserved
      while (subList.firstChild) {
        const subLi = subList.firstChild;
        if (subLi.nodeType === Node.ELEMENT_NODE && subLi.tagName === 'LI') {
          subLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1', 'cmp-header__no-item');
          // moveInstrumentation for each subLi from the original hierarchyTreeCell's content
          // Since we are moving the actual elements, their instrumentation will be moved.
          // No direct moveInstrumentation call needed here for subLi as it's part of the moved subList.
        }
        categoryMenu.append(subLi);
      }

      li.append(triggerLink, productItems);

      triggerLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        productItems.classList.toggle('active');
      });
    } else {
      li.classList.add('cmp-header__no-items');
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation__item-link');
      if (directLink) {
        anchor.href = directLink.href;
      }
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    navGroup.append(li);
  });

  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');
  nav.append(mobileList);

  // Nav Icons (Search)
  const navIcons = document.createElement('div');
  navIcons.classList.add('cmp-header__nav-icons');
  cmpHeader.append(navIcons);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');
  navIcons.append(searchDiv);

  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('cmp-header__icon-img');
  searchDiv.append(searchLink);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-Search_icons');
  searchLink.append(searchIcon);

  // Search section (placeholder for now, as it's a separate component)
  const searchSection = document.createElement('div');
  searchSection.classList.add('search');
  // The actual search component would be decorated separately or loaded here if it's a block
  // For now, we'll just add a placeholder div with the correct class.
  cmpHeader.append(searchSection);

  block.replaceChildren(headerNew);

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    cmpHeaderNavLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Search toggle
  searchLink.addEventListener('click', (e) => {
    e.preventDefault();
    searchSection.classList.toggle('active');
  });
}
