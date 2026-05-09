import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isMobile = false) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    const textNode = [...li.childNodes].find(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
    );

    let triggerElement;
    if (anchor) {
      triggerElement = anchor;
    } else if (textNode) {
      const span = document.createElement('span');
      span.textContent = textNode.textContent.trim();
      textNode.remove();
      li.prepend(span);
      triggerElement = span;
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('ul');
      subWrap.classList.add(
        isMobile
          ? 'cmp-navigation-wrapper__mobilenavbar-submenu'
          : 'cmp-navigation-wrapper__navbar-submenu',
      );
      subWrap.append(nested);

      if (triggerElement) {
        if (isMobile) {
          const headerLi = document.createElement('li');
          headerLi.classList.add('cmp-navigation-wrapper__mobilenavbar-menuheader');
          const headerLink = document.createElement('a');
          headerLink.textContent = triggerElement.textContent.trim();
          headerLi.append(headerLink);
          subWrap.prepend(headerLi);

          const mobileLinkWrapper = document.createElement('a');
          mobileLinkWrapper.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
          mobileLinkWrapper.innerHTML = `
            <span>${triggerElement.textContent.trim()}</span>
            <span class="qd-icon qd-icon--cheveron-right cmp-navigation-wrapper__mobilenavbar-menulink-icon"></span>
          `;
          li.replaceChild(mobileLinkWrapper, triggerElement);
          triggerElement = mobileLinkWrapper;
        } else {
          triggerElement.classList.add('cmp-navigation-wrapper__navbar-menulink');
          triggerElement.setAttribute('aria-haspopup', 'true');
          triggerElement.setAttribute('aria-expanded', 'false');
          const iconWrapper = document.createElement('span');
          iconWrapper.classList.add('qd-icon-wrapper');
          iconWrapper.innerHTML = `<span class="menu-icon qd-icon qd-icon--cheveron-down"></span>`;
          triggerElement.append(iconWrapper);
        }

        triggerElement.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isMobile) {
            li.closest('.cmp-navigation-wrapper__mobilenavbar-list').classList.add('sub-menu-open');
            subWrap.classList.add('active');
            subWrap.closest('.cmp-navigation-wrapper__mobilenavbar').classList.add('sub-menu-open');
            const backButton = subWrap
              .closest('.cmp-navigation-wrapper__mobilenavbar')
              .querySelector('.cmp-navigation-wrapper__mobilenavbar-back');
            if (backButton) {
              backButton.classList.add('active');
              const backLabel = backButton.querySelector('.cmp-navigation-wrapper__iconlabel');
              if (backLabel) backLabel.textContent = triggerElement.textContent.trim();
            }
          } else {
            li.classList.toggle('active');
            triggerElement.setAttribute(
              'aria-expanded',
              triggerElement.classList.contains('active').toString(),
            );
          }
        });
      }
      li.append(subWrap);
    } else if (isMobile && triggerElement) {
      triggerElement.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
    } else if (triggerElement) {
      triggerElement.classList.add('cmp-navigation-wrapper__navbar-menulink');
    }
  });
}

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    contactLinkRow,
    contactLabelRow,
    // These are container fields, their item rows appear below.
    // We need to account for their positions in the block.children array.
    // The generated JS correctly skips these "container" rows and starts
    // processing item rows from index 4.
    // However, the original JS had children[4], children[5], children[6]
    // which are the container rows themselves. They should not be read as data.
    // Instead, we should extract the actual item rows that follow these containers.
    // The BlockJson model shows 4 root fields, then 3 container fields.
    // So the actual item rows start from index 7.
    ...itemRows
  ] = [...block.children];

  const navigationItemRows = [];
  const mobileNavigationItemRows = [];
  const languageItemRows = [];

  // Categorize item rows based on their structure and order as per model
  // The BlockJson model defines the order: navigation-item, mobile-navigation-item, language-item
  // All navigation-item and mobile-navigation-item have 3 cells and a hierarchy-tree.
  // Language-item has 2 cells.
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3 && cells[2].querySelector('ul')) {
      // These are either navigation-item or mobile-navigation-item
      // Distinguish by position as per the model: navigationMenu first, then mobileNavigationMenu
      // The number of navigation-item rows is not explicitly given, but they come first.
      // We assume the first set of 3-cell rows with a UL are navigation-item, then mobile-navigation-item.
      // This is a heuristic based on the model's ordering.
      if (navigationItemRows.length === 0 || navigationItemRows[0].children[0].textContent.trim() === 'example text value') { // Heuristic: first example text value is for navigation-item
        navigationItemRows.push(row);
      } else {
        mobileNavigationItemRows.push(row);
      }
    } else if (cells.length === 2) {
      languageItemRows.push(row);
    }
  });

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cmp-header-wrapper', 'layout-container', 'transparent-header');

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation', 'header-nav-css-from-wrapper');

  const cmpNavigationWrapper = document.createElement('div');
  cmpNavigationWrapper.classList.add('cmp-navigation-wrapper');
  cmpNavigationWrapper.setAttribute('role', 'banner');
  cmpNavigationWrapper.setAttribute('aria-label', 'navigation.header.aria.label');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('cmp-navigation-wrapper__logo');

  const logoLink = document.createElement('a');
  const logoHref = logoLinkRow.querySelector('a')?.href || '/';
  logoLink.href = logoHref;
  logoLink.target = '_self';
  logoLink.setAttribute('aria-label', 'Qiddiya - Go to homepage');
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const optimizedPic = createOptimizedPicture(logoPicture.querySelector('img').src, logoPicture.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  } else {
    // Fallback if no picture, use SVG markup directly from logo cell if available
    const svgContent = logoRow.children[0]?.innerHTML; // Access the cell, not the row
    if (svgContent) {
      logoLink.innerHTML = svgContent;
    }
  }

  logoWrapper.append(logoLink);

  const contactUsCtaWrapper = document.createElement('div');
  contactUsCtaWrapper.classList.add('cmp-navigation-wrapper__contactUs-cta');

  const contactUsLink = document.createElement('a');
  const contactHref = contactLinkRow.querySelector('a')?.href || '#';
  contactUsLink.href = contactHref;
  contactUsLink.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
  contactUsLink.target = '_self';
  contactUsLink.setAttribute('aria-label', 'Contact Us'); // Hardcoded value from ORIGINAL HTML
  moveInstrumentation(contactLinkRow, contactUsLink);

  contactUsLink.innerHTML = `
    <span class="cta__icon qd-icon qd-icon--cheveron-right" aria-hidden="true"></span>
    <span class="cta__label">${contactLabelRow.children[0].textContent.trim()}</span>
  `;
  moveInstrumentation(contactLabelRow, contactUsLink.querySelector('.cta__label'));

  contactUsCtaWrapper.append(contactUsLink);

  const navigationToggle = document.createElement('div');
  navigationToggle.classList.add('cmp-navigation-wrapper__icon');
  navigationToggle.id = 'navigation-toggle';
  navigationToggle.innerHTML = `
    <div class="hamburger-ellipse" tabindex="0">
      <span class="hamburger-icon qd-icon qd-icon--hamburger"></span>
      <span class="close-icon qd-icon qd-icon--cancel"></span>
    </div>
  `;
  contactUsCtaWrapper.append(navigationToggle);
  logoWrapper.append(contactUsCtaWrapper);
  cmpNavigationWrapper.append(logoWrapper);

  // Desktop Navigation
  const desktopNavbar = document.createElement('nav');
  desktopNavbar.classList.add('cmp-navigation-wrapper__navbar');
  desktopNavbar.id = 'navbar-desktop';
  desktopNavbar.setAttribute('role', 'navigation');
  desktopNavbar.setAttribute('aria-label', 'navigation.main.aria.label');

  const desktopNavList = document.createElement('ul');
  desktopNavList.classList.add('cmp-navigation-wrapper__navbar-list');

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation-wrapper__navbar-menu');
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    const href = linkCell.querySelector('a')?.href || '#';
    link.href = href;
    link.target = '_self';
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, link);
    moveInstrumentation(linkCell, link);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell to tempDiv

    const subList = tempDiv.querySelector('ul');
    if (subList) {
      li.append(link);
      transformNestedLists(subList);
      li.append(subList);
    } else {
      li.append(link);
    }
    desktopNavList.append(li);
  });

  desktopNavbar.append(desktopNavList);

  const desktopContactUsLink = document.createElement('a');
  desktopContactUsLink.href = contactHref;
  desktopContactUsLink.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
  desktopContactUsLink.target = '_self';
  desktopContactUsLink.setAttribute('aria-label', 'Contact Us'); // Corrected hardcoded value
  desktopContactUsLink.innerHTML = `
    <span class="cta__icon qd-icon qd-icon--cheveron-right" aria-hidden="true"></span>
    <span class="cta__label">${contactLabelRow.children[0].textContent.trim()}</span>
  `;
  desktopNavbar.append(desktopContactUsLink);

  const desktopLanguageSelector = document.createElement('div');
  desktopLanguageSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  desktopLanguageSelector.style.visibility = 'visible';

  const desktopLangList = document.createElement('ul');
  desktopLangList.classList.add('cmp-language-selector');

  languageItemRows.forEach((row, i) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    if (i === 0) li.classList.add('active');
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    const href = linkCell.querySelector('a')?.href || '#';
    link.href = href;
    link.setAttribute('aria-label', labelCell.textContent.trim());
    link.classList.add('cmp-language-selector__link');
    link.setAttribute('data-lang', labelCell.textContent.trim().toLowerCase().substring(0, 2));
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, link);
    moveInstrumentation(linkCell, link);
    li.append(link);
    desktopLangList.append(li);
  });
  desktopLanguageSelector.append(desktopLangList);
  desktopNavbar.append(desktopLanguageSelector);
  cmpNavigationWrapper.append(desktopNavbar);

  // Mobile Navigation
  const mobileNavbar = document.createElement('nav');
  mobileNavbar.classList.add('cmp-navigation-wrapper__mobilenavbar');
  mobileNavbar.id = 'navbar-mobile';
  mobileNavbar.setAttribute('role', 'navigation');
  mobileNavbar.setAttribute('aria-label', 'navigation.main.aria.label');

  const mobileNavList = document.createElement('ul');
  mobileNavList.classList.add('cmp-navigation-wrapper__mobilenavbar-list');

  mobileNavigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    const href = linkCell.querySelector('a')?.href || '#';
    link.href = href;
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, link);
    moveInstrumentation(linkCell, link);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell to tempDiv

    const subList = tempDiv.querySelector('ul');
    if (subList) {
      li.append(link);
      transformNestedLists(subList, true);
      li.append(subList);
    } else {
      li.append(link);
    }
    mobileNavList.append(li);
  });
  mobileNavbar.append(mobileNavList);

  const mobileNavbarBack = document.createElement('div');
  mobileNavbarBack.classList.add('cmp-navigation-wrapper__mobilenavbar-back', 'nav-back');
  mobileNavbarBack.innerHTML = `
    <a class="cmp-navigation-wrapper__icon">
      <span class="back-icon qd-icon qd-icon--cheveron-left"></span>
    </a>
    <span class="cmp-navigation-wrapper__iconlabel">Back</span>
  `;
  mobileNavbar.append(mobileNavbarBack);

  const mobileLanguageSelector = document.createElement('div');
  mobileLanguageSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  mobileLanguageSelector.style.visibility = 'visible';

  const mobileLangList = document.createElement('ul');
  mobileLangList.classList.add('cmp-language-selector');

  languageItemRows.forEach((row, i) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    if (i === 0) li.classList.add('active');
    moveInstrumentation(row, li);

    const link = document.createElement('a');
    const href = linkCell.querySelector('a')?.href || '#';
    link.href = href;
    link.setAttribute('aria-label', labelCell.textContent.trim());
    link.classList.add('cmp-language-selector__link');
    link.setAttribute('data-lang', labelCell.textContent.trim().toLowerCase().substring(0, 2));
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, link);
    moveInstrumentation(linkCell, link);
    li.append(link);
    mobileLangList.append(li);
  });
  mobileLanguageSelector.append(mobileLangList);
  mobileNavbar.append(mobileLanguageSelector);
  cmpNavigationWrapper.append(mobileNavbar);

  navigationDiv.append(cmpNavigationWrapper);
  headerWrapper.append(navigationDiv);

  block.replaceChildren(headerWrapper);

  // Event Listeners for mobile navigation
  const hamburger = block.querySelector('.hamburger-ellipse');
  const mobileNav = block.querySelector('.cmp-navigation-wrapper__mobilenavbar');
  const desktopNav = block.querySelector('.cmp-navigation-wrapper__navbar');
  const navBack = block.querySelector('.cmp-navigation-wrapper__mobilenavbar-back');

  if (hamburger && mobileNav && desktopNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      desktopNav.classList.toggle('active');
      block.querySelector('.cmp-navigation-wrapper').classList.toggle('active');
    });
  }

  if (navBack && mobileNav) {
    navBack.addEventListener('click', () => {
      const activeSubmenu = mobileNav.querySelector('.cmp-navigation-wrapper__mobilenavbar-submenu.active');
      if (activeSubmenu) {
        activeSubmenu.classList.remove('active');
        activeSubmenu.closest('.cmp-navigation-wrapper__mobilenavbar').classList.remove('sub-menu-open');
        activeSubmenu.closest('.cmp-navigation-wrapper__mobilenavbar-list').classList.remove('sub-menu-open');
        navBack.classList.remove('active');
      }
    });
  }

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
