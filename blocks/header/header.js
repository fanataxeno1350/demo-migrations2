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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for JS behavior.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior.
        });
      }
    }
  });
}

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    navigationItemsContainer, // This is a placeholder for the container, not an actual row.
    policyLinksContainer,     // This is a placeholder for the container, not an actual row.
    socialLinksContainer,     // This is a placeholder for the container, not an actual row.
    navIconsContainer,        // This is a placeholder for the container, not an actual row.
    ...itemRows
  ] = [...block.children];

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cmp-header');
  moveInstrumentation(block, headerWrapper);

  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  headerWrapper.append(hamburgerInput);

  // Logo and Logo Link
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');

  const logoPicture = logoRow.querySelector('picture');
  const logoAnchor = logoLinkRow.querySelector('a');

  if (logoPicture && logoAnchor) {
    const logoLink = document.createElement('a');
    logoLink.classList.add('cmp-image__link');
    logoLink.href = logoAnchor.href;

    const optimizedPic = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '600' }],
    );
    optimizedPic.classList.add('w-100', 'd-block');
    moveInstrumentation(logoPicture, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
    logoDiv.append(logoLink);
  } else if (logoPicture) {
    const optimizedPic = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '600' }],
    );
    optimizedPic.classList.add('w-100', 'd-block');
    moveInstrumentation(logoPicture, optimizedPic.querySelector('img'));
    logoDiv.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoDiv);
  moveInstrumentation(logoLinkRow, logoDiv);
  headerWrapper.append(logoDiv);

  // Navigation Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('navigation');

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation', 'cmp-header__nav-group');
  nav.setAttribute('role', 'navigation');

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  // moveInstrumentation(navigationItemsContainer, navGroup); // navigationItemsContainer is not a real row

  const navigationItemRows = itemRows.filter((row) => row.children.length === 3);
  const policyLinkItemRows = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('.icon-instagram'));
  const socialLinkItemRows = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a'));
  const navIconItemRows = itemRows.filter((row) => row.children.length === 3 && (row.children[0].textContent.trim().startsWith('icon-'))); // More robust icon detection

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-navigation__item-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();

    // Handle richtext hierarchy-tree
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      li.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for JS behavior.
      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation for the richtext cell to the ul
      transformNestedLists(subList);
      const subWrap = document.createElement('div');
      subWrap.classList.add('cmp-header__sub-nav');
      subWrap.append(subList);
      li.append(anchor, subWrap);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior.
        subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior.
      });
    } else {
      li.append(anchor);
    }
    moveInstrumentation(row, li);
    navGroup.append(li);
  });
  nav.append(navGroup);

  // Mobile list wrapper for policy and social links
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  // Policy Links
  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  // moveInstrumentation(policyLinksContainer, policyUl); // policyLinksContainer is not a real row

  policyLinkItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-header__policy-list');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    moveInstrumentation(row, li); // Move instrumentation for each policy link item row
    policyUl.append(li);
  });
  if (policyLinkItemRows.length > 0) {
    mobileListDiv.append(policyUl);
  }

  // Social Media Links
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  // moveInstrumentation(socialLinksContainer, socialMediaDiv); // socialLinksContainer is not a real row

  socialLinkItemRows.forEach((row) => {
    const [linkCell] = [...row.children]; // Destructure for fixed schema
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      const anchor = document.createElement('a');
      anchor.href = foundLink.href;
      // Determine icon class based on href or content (if available)
      if (foundLink.href.includes('instagram')) {
        anchor.classList.add('icon-instagram');
      } else if (foundLink.href.includes('facebook')) {
        anchor.classList.add('icon-facebook'); // Corrected from icon-facebok
      } else if (foundLink.href.includes('twitter')) {
        anchor.classList.add('icon-twitter');
      } else if (foundLink.href.includes('youtube')) {
        anchor.classList.add('icon-youtube');
      }
      anchor.setAttribute('target', '_blank');
      moveInstrumentation(row, anchor); // Move instrumentation for each social link item row
      socialMediaDiv.append(anchor);
    }
  });
  if (socialLinkItemRows.length > 0) {
    mobileListDiv.append(socialMediaDiv);
  }

  if (policyLinkItemRows.length > 0 || socialLinkItemRows.length > 0) {
    nav.append(mobileListDiv);
  }

  navigationWrapper.append(nav);
  navLinksDiv.append(navigationWrapper);
  headerWrapper.append(navLinksDiv);

  // Nav Icons
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');
  // moveInstrumentation(navIconsContainer, navIconsDiv); // navIconsContainer is not a real row

  navIconItemRows.forEach((row) => {
    const [iconClassCell, linkCell, labelCell] = [...row.children];
    const iconClass = iconClassCell.textContent.trim();
    const linkHref = linkCell.querySelector('a')?.href;
    const labelText = labelCell.textContent.trim();

    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add(`cmp-header__${iconClass.replace('icon-', '')}`);
    if (iconClass === 'icon-accessibility' || iconClass === 'icon-profile') {
      iconWrapper.classList.add('cmp-header__hide-icon');
    }

    const iconAnchor = document.createElement('a');
    iconAnchor.classList.add('cmp-header__icon-img');
    iconAnchor.href = linkHref || '#';

    const iconDiv = document.createElement('div');
    iconDiv.classList.add(iconClass);
    iconAnchor.append(iconDiv);

    if (labelText) {
      const iconTextDiv = document.createElement('div');
      iconTextDiv.classList.add('cmp-header__icon-text');
      iconTextDiv.textContent = labelText;
      iconAnchor.append(iconTextDiv);
    }
    iconWrapper.append(iconAnchor);
    moveInstrumentation(row, iconWrapper); // Move instrumentation for each nav icon item row
    navIconsDiv.append(iconWrapper);
  });
  headerWrapper.append(navIconsDiv);

  block.replaceChildren(headerWrapper);
}
