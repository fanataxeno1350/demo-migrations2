import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from ORIGINAL HTML to li elements
    li.classList.add('cmp-navigation__item');
    if (li.parentElement.classList.contains('cmp-header__product-items')) {
      li.classList.add('cmp-navigation__item--level-1');
    } else if (li.parentElement.classList.contains('cmp-header__submenu')) {
      li.classList.add('cmp-navigation__item--level-2', 'cmp-header__no-item');
    }


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
      subWrap.classList.add('cmp-header__submenu'); // Class from ORIGINAL HTML
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

  // Reorder root row destructuring to match BlockJson model
  const [logoRow, logoLinkRow, navMenuPlaceholder, policyLinksPlaceholder, socialLinksPlaceholder, navIconsPlaceholder, ...itemRows] = children;

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cmp-header'); // Class from ORIGINAL HTML

  const headerHamburger = document.createElement('input');
  headerHamburger.classList.add('cmp-header__hamburger'); // Class from ORIGINAL HTML
  headerHamburger.type = 'checkbox';
  headerWrapper.append(headerHamburger);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo'); // Classes from ORIGINAL HTML
  moveInstrumentation(logoRow, logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link'); // Class from ORIGINAL HTML
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const optimizedPic = createOptimizedPicture(
      picture.querySelector('img').src,
      picture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    optimizedPic.classList.add('w-100', 'd-block'); // Classes from ORIGINAL HTML
    moveInstrumentation(picture.querySelector('img'), optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  headerWrapper.append(logoDiv);

  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links'); // Class from ORIGINAL HTML

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation'); // Class from ORIGINAL HTML

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation'); // Class from ORIGINAL HTML
  nav.role = 'navigation';

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group'); // Classes from ORIGINAL HTML

  moveInstrumentation(navMenuPlaceholder, navGroup);

  const navigationItemRows = itemRows.filter((row) => row.children.length === 3);
  const policyLinkRows = itemRows.filter((row) => row.children.length === 2);
  const socialLinkRows = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a'));
  const navIconRows = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture'));

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Correct: named destructuring
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products', 'cmp-header__nav-products-click'); // Classes from ORIGINAL HTML

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-navigation__item-link'); // Class from ORIGINAL HTML
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);

    const subList = hierarchyTreeCell.querySelector('ul');
    if (subList) {
      const productItemsUl = document.createElement('ul');
      productItemsUl.classList.add('cmp-navigation__group', 'cmp-header__product-items'); // Classes from ORIGINAL HTML

      const categoryMenuDiv = document.createElement('div');
      categoryMenuDiv.classList.add('cmp-header__category-menu'); // Class from ORIGINAL HTML
      moveInstrumentation(hierarchyTreeCell, categoryMenuDiv); // Move instrumentation for the richtext cell
      categoryMenuDiv.append(subList);
      transformNestedLists(subList);
      productItemsUl.append(categoryMenuDiv);
      li.append(productItemsUl);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        productItemsUl.classList.toggle('active');
      });
    }
    navGroup.append(li);
  });

  nav.append(navGroup);
  navigationDiv.append(nav);
  navLinksDiv.append(navigationDiv);

  // Mobile Policy Links and Social Media
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list'); // Class from ORIGINAL HTML

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy'); // Class from ORIGINAL HTML
  moveInstrumentation(policyLinksPlaceholder, policyUl);

  policyLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Correct: named destructuring
    const li = document.createElement('li');
    li.classList.add('cmp-header__policy-list'); // Class from ORIGINAL HTML
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);
    policyUl.append(li);
  });
  mobileListDiv.append(policyUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media'); // Class from ORIGINAL HTML
  moveInstrumentation(socialLinksPlaceholder, socialMediaDiv);

  socialLinkRows.forEach((row) => {
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;

    if (anchor.href.includes('instagram.com')) {
      anchor.classList.add('icon-instagram'); // Class from ORIGINAL HTML
      anchor.dataset.social = 'instagram';
    } else if (anchor.href.includes('facebook.com')) {
      anchor.classList.add('icon-facebok'); // Class from ORIGINAL HTML
      anchor.dataset.social = 'facebook';
    } else if (anchor.href.includes('twitter.com')) {
      anchor.classList.add('icon-twitter'); // Class from ORIGINAL HTML
      anchor.dataset.social = 'twitter';
    } else if (anchor.href.includes('youtube.com')) {
      anchor.classList.add('icon-youtube'); // Class from ORIGINAL HTML
      anchor.dataset.social = 'youtube';
    }
    moveInstrumentation(row, anchor);
    socialMediaDiv.append(anchor);
  });
  mobileListDiv.append(socialMediaDiv);
  navLinksDiv.append(mobileListDiv);
  headerWrapper.append(navLinksDiv);

  // Nav Icons
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons'); // Class from ORIGINAL HTML
  moveInstrumentation(navIconsPlaceholder, navIconsDiv);

  navIconRows.forEach((row) => {
    const [iconTypeCell, labelCell, linkCell] = [...row.children]; // Correct: named destructuring
    const iconType = iconTypeCell.textContent.trim().toLowerCase();
    const label = labelCell.textContent.trim();
    const linkHref = linkCell.querySelector('a')?.href || '#';

    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add(`cmp-header__${iconType}`);
    if (iconType === 'accessbility' || iconType === 'login') {
      iconWrapper.classList.add('cmp-header__hide-icon'); // Class from ORIGINAL HTML
    }

    const iconLink = document.createElement('a');
    iconLink.href = linkHref;
    iconLink.classList.add('cmp-header__icon-img'); // Class from ORIGINAL HTML

    const iconDiv = document.createElement('div');
    iconDiv.classList.add(`icon-${iconType}`); // Class from ORIGINAL HTML
    iconLink.append(iconDiv);

    if (label) {
      const iconText = document.createElement('div');
      iconText.classList.add('cmp-header__icon-text'); // Class from ORIGINAL HTML
      iconText.textContent = label;
      iconLink.append(iconText);
    }
    moveInstrumentation(row, iconWrapper);
    iconWrapper.append(iconLink);
    navIconsDiv.append(iconWrapper);
  });
  headerWrapper.append(navIconsDiv);

  block.replaceChildren(headerWrapper);
}
