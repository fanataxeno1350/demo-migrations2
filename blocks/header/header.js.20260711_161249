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
  const [
    logoRow,
    logoLinkRow,
    navigationMenuContainer, // This is a placeholder for the container, actual items are in itemRows
    policyLinksContainer,    // This is a placeholder for the container, actual items are in itemRows
    socialLinksContainer,    // This is a placeholder for the container, actual items are in itemRows
    navIconsContainer,       // This is a placeholder for the container, actual items are in itemRows
    ...itemRows
  ] = [...block.children];

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cmp-header');
  moveInstrumentation(block, headerWrapper);

  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  headerWrapper.append(hamburgerInput);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
  moveInstrumentation(logoRow, logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.classList.add('w-100', 'd-block');
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('cmp-image__image', 'js-lazy-image');
    moveInstrumentation(picture, optimizedPic);
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  headerWrapper.append(logoDiv);

  // Navigation Menu
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  // moveInstrumentation(navigationMenuContainer, navLinksDiv); // navigationMenuContainer is a placeholder, not a content row

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('navigation');
  navLinksDiv.append(navigationWrapper);

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.role = 'navigation';
  navigationWrapper.append(nav);

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  nav.append(navGroup);

  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');
  nav.append(mobileList);

  const policyListUl = document.createElement('ul');
  policyListUl.classList.add('cmp-header__policy');
  // moveInstrumentation(policyLinksContainer, policyListUl); // policyLinksContainer is a placeholder, not a content row
  mobileList.append(policyListUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  // moveInstrumentation(socialLinksContainer, socialMediaDiv); // socialLinksContainer is a placeholder, not a content row
  mobileList.append(socialMediaDiv);

  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');
  // moveInstrumentation(navIconsContainer, navIconsDiv); // navIconsContainer is a placeholder, not a content row
  headerWrapper.append(navIconsDiv);

  const navigationItemRows = [];
  const policyLinkItemRows = [];
  const socialLinkItemRows = [];
  const navIconItemRows = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // navigation-item: 3 cells, cell[2] has a ul (richtext hierarchy-tree)
    if (cells.length === 3 && cells[2].querySelector('ul')) {
      navigationItemRows.push(row);
    }
    // policy-link-item: 2 cells, cell[0] is text (label), cell[1] is aem-content (link)
    // The original condition `!cells[0].querySelector('a')` is correct for distinguishing from social-link-item
    else if (cells.length === 2 && !cells[0].querySelector('a')) {
      policyLinkItemRows.push(row);
    }
    // social-link-item: 2 cells, cell[0] is aem-content (link), cell[1] is text (socialKind)
    else if (cells.length === 2 && cells[0].querySelector('a')) {
      socialLinkItemRows.push(row);
    }
    // nav-icon-item: 3 cells, cell[2] is text (label), cell[0] is text (iconKind), cell[1] is aem-content (link)
    // The original condition `!cells[2].querySelector('ul')` is correct for distinguishing from navigation-item
    else if (cells.length === 3 && !cells[2].querySelector('ul')) {
      navIconItemRows.push(row);
    }
  });

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-navigation__item-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      li.classList.remove('cmp-header__no-items');
      li.classList.add('has-sub-child');
      const triggerSpan = document.createElement('span');
      triggerSpan.textContent = labelCell.textContent.trim();
      triggerSpan.classList.add('cmp-navigation__item-link');
      li.append(triggerSpan);

      const subNavWrapper = document.createElement('div');
      subNavWrapper.classList.add('sub-navigation');
      // Move instrumentation for the hierarchyUl content
      moveInstrumentation(hierarchyTreeCell, hierarchyUl);
      subNavWrapper.append(hierarchyUl);
      li.append(subNavWrapper);

      transformNestedLists(hierarchyUl);

      triggerSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        subNavWrapper.classList.toggle('active');
      });
    } else {
      li.classList.add('cmp-header__no-items');
      li.append(anchor);
    }
    navGroup.append(li);
  });

  policyLinkItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-header__policy-list');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      // Policy links in original HTML have target="_blank"
      anchor.target = '_blank';
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    policyListUl.append(li);
  });

  socialLinkItemRows.forEach((row) => {
    const [linkCell, socialKindCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank';
    }
    const socialKind = socialKindCell.textContent.trim().toLowerCase();
    // Original HTML uses 'icon-facebok' for facebook, not 'icon-facebook'
    anchor.classList.add(`icon-${socialKind === 'facebook' ? 'facebok' : socialKind}`);
    anchor.setAttribute('data-social', socialKind);
    moveInstrumentation(row, anchor);
    socialMediaDiv.append(anchor);
  });

  navIconItemRows.forEach((row) => {
    const [iconKindCell, linkCell, labelCell] = [...row.children];
    const iconKind = iconKindCell.textContent.trim().toLowerCase();
    const wrapperDiv = document.createElement('div');
    // The class name should be cmp-header__accessbility or cmp-header__login, not cmp-header__accessbility
    wrapperDiv.classList.add(`cmp-header__${iconKind === 'accessbility' ? 'accessbility' : iconKind}`);
    if (iconKind === 'accessbility' || iconKind === 'login') {
      wrapperDiv.classList.add('cmp-header__hide-icon');
    }
    moveInstrumentation(row, wrapperDiv);

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-header__icon-img');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }

    const iconDiv = document.createElement('div');
    // Original HTML uses 'icon-accessibility' and 'icon-profile'
    if (iconKind === 'accessbility') {
      iconDiv.classList.add('icon-accessibility');
    } else if (iconKind === 'login') {
      iconDiv.classList.add('icon-profile');
    } else {
      iconDiv.classList.add(`icon-${iconKind}`);
    }
    anchor.append(iconDiv);

    if (labelCell.textContent.trim()) {
      const iconTextDiv = document.createElement('div');
      iconTextDiv.classList.add('cmp-header__icon-text');
      iconTextDiv.textContent = labelCell.textContent.trim();
      anchor.append(iconTextDiv);
    }
    wrapperDiv.append(anchor);
    navIconsDiv.append(wrapperDiv);
  });

  block.replaceChildren(headerWrapper);
}
