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
      subWrap.classList.add('cmp-header__submenu'); // use ORIGINAL HTML class
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
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    navItemsContainer,
    policyLinksContainer,
    socialLinksContainer,
    navIconsContainer,
    ...itemRows
  ] = children;

  const header = document.createElement('div');
  header.classList.add('cmp-header');

  const hamburger = document.createElement('input');
  hamburger.classList.add('cmp-header__hamburger');
  hamburger.type = 'checkbox';
  header.append(hamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo', 'image', 'cmp-header__logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  const logoHref = logoLinkRow.querySelector('a');
  if (logoHref) {
    logoLink.href = logoHref.href;
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoWrapper.append(logoLink);
  header.append(logoWrapper);

  const navLinks = document.createElement('div');
  navLinks.classList.add('cmp-header__nav-links');
  const navigation = document.createElement('div');
  navigation.classList.add('navigation');
  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.role = 'navigation';

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  // Filter item rows based on BlockJson structure
  const navItems = itemRows.filter(
    (row) => row.children.length === 3 && row.children[2].querySelector('ul'),
  );
  const policyItems = itemRows.filter(
    (row) => row.children.length === 2 && !row.children[0].querySelector('picture') && !row.children[1].querySelector('a[href*="instagram.com"], a[href*="facebook.com"], a[href*="twitter.com"], a[href*="youtube.com"]'),
  );
  const socialItems = itemRows.filter(
    (row) => row.children.length === 1 && row.children[0].querySelector('a[href*="instagram.com"], a[href*="facebook.com"], a[href*="twitter.com"], a[href*="youtube.com"]'),
  );
  const iconItems = itemRows.filter(
    (row) => row.children.length === 2 && !row.children[0].querySelector('picture') && row.children[1].querySelector('a') && !row.children[1].querySelector('a[href*="instagram.com"], a[href*="facebook.com"], a[href*="twitter.com"], a[href*="youtube.com"]'),
  );

  navItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products', 'cmp-header__nav-products-click');

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-navigation__item-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);

    const hierarchyUl = document.createElement('div'); // Use a div to hold the raw HTML
    hierarchyUl.innerHTML = hierarchyTreeCell.innerHTML; // Read innerHTML for richtext
    moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Move instrumentation for the richtext cell

    const actualUl = hierarchyUl.querySelector('ul'); // Get the actual UL from the parsed HTML
    if (actualUl) {
      const productItems = document.createElement('ul');
      productItems.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      const categoryMenu = document.createElement('div');
      categoryMenu.classList.add('cmp-header__category-menu');
      categoryMenu.append(actualUl); // Append the actual UL
      productItems.append(categoryMenu);
      transformNestedLists(actualUl); // Transform the actual UL
      li.append(productItems);
    }
    navGroup.append(li);
  });

  nav.append(navGroup);

  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  policyItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-header__policy-list');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);
    policyUl.append(li);
  });
  mobileList.append(policyUl);

  const socialMedia = document.createElement('div');
  socialMedia.classList.add('cmp-header__social-media');
  socialItems.forEach((row) => {
    const [linkCell] = [...row.children]; // Destructure for social link item
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      if (foundLink.href.includes('instagram.com')) {
        anchor.classList.add('icon-instagram');
      } else if (foundLink.href.includes('facebook.com')) {
        anchor.classList.add('icon-facebook'); // Corrected class name
      } else if (foundLink.href.includes('twitter.com')) {
        anchor.classList.add('icon-twitter');
      } else if (foundLink.href.includes('youtube.com')) {
        anchor.classList.add('icon-youtube');
      }
    }
    anchor.target = '_blank';
    moveInstrumentation(row, anchor);
    socialMedia.append(anchor);
  });
  mobileList.append(socialMedia);

  nav.append(mobileList);
  navigation.append(nav);
  navLinks.append(navigation);
  header.append(navLinks);

  const navIcons = document.createElement('div');
  navIcons.classList.add('cmp-header__nav-icons');

  iconItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const div = document.createElement('div');
    div.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
    const anchor = document.createElement('a');
    anchor.classList.add('cmp-header__icon-img');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    const iconDiv = document.createElement('div');
    const labelText = labelCell.textContent.trim().toLowerCase();
    if (labelText === 'accessibility') {
      iconDiv.classList.add('icon-accessibility');
      div.classList.remove('cmp-header__hide-icon');
    } else if (labelText === 'search') {
      iconDiv.classList.add('icon-search');
      div.classList.remove('cmp-header__hide-icon');
      div.classList.add('cmp-header__search');
    } else if (labelText === 'login') {
      iconDiv.classList.add('icon-profile');
      div.classList.remove('cmp-header__hide-icon');
    }
    anchor.append(iconDiv);
    const textDiv = document.createElement('div');
    textDiv.classList.add('cmp-header__icon-text');
    textDiv.textContent = labelCell.textContent.trim();
    anchor.append(textDiv);
    moveInstrumentation(row, anchor);
    div.append(anchor);
    navIcons.append(div);
  });
  header.append(navIcons);

  moveInstrumentation(navItemsContainer, navGroup);
  moveInstrumentation(policyLinksContainer, policyUl);
  moveInstrumentation(socialLinksContainer, socialMedia);
  moveInstrumentation(navIconsContainer, navIcons);

  block.replaceChildren(header);
}
