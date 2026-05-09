import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isMobile = false) {
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
      const subWrap = document.createElement('ul');
      if (isMobile) {
        subWrap.classList.add('cmp-navigation-wrapper__mobilenavbar-submenu');
      } else {
        subWrap.classList.add('cmp-navigation-wrapper__navbar-submenu');
      }
      // Move children directly and apply instrumentation
      [...nested.children].forEach((child) => {
        moveInstrumentation(child, child); // Apply instrumentation to each child <li>
        subWrap.append(child);
      });

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        if (isMobile) {
          trigger.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
          const icon = document.createElement('span');
          icon.classList.add('qd-icon', 'qd-icon--cheveron-right', 'cmp-navigation-wrapper__mobilenavbar-menulink-icon');
          trigger.append(icon);

          const menuHeader = document.createElement('li');
          menuHeader.classList.add('cmp-navigation-wrapper__mobilenavbar-menuheader');
          const headerLink = document.createElement('a');
          const headerSpan = document.createElement('span');
          headerSpan.textContent = trigger.textContent.trim().replace(/[\n\r].*/, ''); // Clean up text content
          headerLink.append(headerSpan);
          menuHeader.append(headerLink);
          subWrap.prepend(menuHeader);

          li.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');
        } else {
          trigger.classList.add('cmp-navigation-wrapper__navbar-menulink');
          trigger.setAttribute('aria-haspopup', 'true');
          trigger.setAttribute('aria-expanded', 'false');
          const iconWrapper = document.createElement('span');
          iconWrapper.classList.add('qd-icon-wrapper');
          const icon = document.createElement('span');
          icon.classList.add('menu-icon', 'qd-icon', 'qd-icon--cheveron-down');
          iconWrapper.append(icon);
          trigger.append(iconWrapper);
          li.classList.add('cmp-navigation-wrapper__navbar-menu');
        }

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isMobile) {
            li.classList.toggle('active');
            subWrap.classList.toggle('active');
          } else {
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', !expanded);
            subWrap.classList.toggle('active');
          }
        });
      }
      li.append(subWrap);
    } else if (anchor) {
      if (isMobile) {
        li.classList.add('cmp-navigation-wrapper__mobilenavbar-menu');
        anchor.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
      } else {
        li.classList.add('cmp-navigation-wrapper__navbar-menu');
        anchor.classList.add('cmp-navigation-wrapper__navbar-menulink');
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Placeholder rows are not actual content, they represent where the container items go.
  // We need to filter them out or handle them as empty rows if they exist.
  // Based on the BlockJson, the first two are logo and logoLink.
  // The next four are container fields, which means their content is spread across itemRows.
  // We need to identify the actual content rows for logo, logoLink, and then the item rows.

  const logoRow = children[0];
  const logoLinkRow = children[1];

  // Filter out the actual item rows based on their structure
  const itemRows = children.slice(2); // All rows after the first two are item rows

  const root = document.createElement('div');
  root.classList.add('cmp-header-wrapper', 'layout-container', 'transparent-header');

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('navigation', 'header-nav-css-from-wrapper');
  root.append(navigationWrapper);

  const cmpNavigationWrapper = document.createElement('div');
  cmpNavigationWrapper.classList.add('cmp-navigation-wrapper');
  cmpNavigationWrapper.setAttribute('role', 'banner');
  cmpNavigationWrapper.setAttribute('aria-label', 'navigation.header.aria.label');
  navigationWrapper.append(cmpNavigationWrapper);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('cmp-navigation-wrapper__logo');
  cmpNavigationWrapper.append(logoWrapper);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.setAttribute('aria-label', 'Qiddiya - Go to homepage');
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const optimizedPic = createOptimizedPicture(logoPicture.querySelector('img').src, logoPicture.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  } else {
    // Fallback for logo if no picture (e.g., SVG icon from original HTML)
    const qdIcon = document.createElement('span');
    qdIcon.classList.add('qd-icon', 'qd-icon--logo', 'qd-logo');
    for (let i = 1; i <= 25; i += 1) {
      const path = document.createElement('span');
      path.classList.add(`path${i}`);
      qdIcon.append(path);
    }
    logoLink.append(qdIcon);
  }
  logoWrapper.append(logoLink);

  const contactUsCtaWrapper = document.createElement('div');
  contactUsCtaWrapper.classList.add('cmp-navigation-wrapper__contactUs-cta');
  logoWrapper.append(contactUsCtaWrapper);

  // Filter for contact-link-item (2 cells, no picture, no ul)
  const contactLinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('ul'));
  const contactLinkRow = contactLinkItems[0]; // Assuming first contact link is the main CTA

  if (contactLinkRow) {
    const [labelCell, linkCell] = [...contactLinkRow.children];
    const ctaLink = document.createElement('a');
    ctaLink.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
    const foundCtaLink = linkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
      ctaLink.setAttribute('aria-label', labelCell.textContent.trim());
    }
    moveInstrumentation(contactLinkRow, ctaLink);

    const ctaIcon = document.createElement('span');
    ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
    ctaIcon.setAttribute('aria-hidden', 'true');
    ctaLink.append(ctaIcon);

    const ctaLabel = document.createElement('span');
    ctaLabel.classList.add('cta__label');
    ctaLabel.textContent = labelCell.textContent.trim();
    ctaLink.append(ctaLabel);
    contactUsCtaWrapper.append(ctaLink);
  }

  const navToggle = document.createElement('div');
  navToggle.classList.add('cmp-navigation-wrapper__icon');
  navToggle.id = 'navigation-toggle';
  const hamburgerEllipse = document.createElement('div');
  hamburgerEllipse.classList.add('hamburger-ellipse');
  hamburgerEllipse.setAttribute('tabindex', '0');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('hamburger-icon', 'qd-icon', 'qd-icon--hamburger');
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon', 'qd-icon', 'qd-icon--cancel');
  hamburgerEllipse.append(hamburgerIcon, closeIcon);
  navToggle.append(hamburgerEllipse);
  contactUsCtaWrapper.append(navToggle);

  const desktopNavbar = document.createElement('nav');
  desktopNavbar.classList.add('cmp-navigation-wrapper__navbar');
  desktopNavbar.id = 'navbar-desktop';
  desktopNavbar.setAttribute('role', 'navigation');
  desktopNavbar.setAttribute('aria-label', 'navigation.main.aria.label');
  cmpNavigationWrapper.append(desktopNavbar);

  const desktopNavList = document.createElement('ul');
  desktopNavList.classList.add('cmp-navigation-wrapper__navbar-list');
  desktopNavbar.append(desktopNavList);
  // No direct instrumentation for desktopNavPlaceholder, as it's a container field.
  // Instrumentation will be applied to individual list items.

  const mobileNavbar = document.createElement('nav');
  mobileNavbar.classList.add('cmp-navigation-wrapper__mobilenavbar');
  mobileNavbar.id = 'navbar-mobile';
  mobileNavbar.setAttribute('role', 'navigation');
  mobileNavbar.setAttribute('aria-label', 'navigation.main.aria.label');
  cmpNavigationWrapper.append(mobileNavbar);

  const mobileNavList = document.createElement('ul');
  mobileNavList.classList.add('cmp-navigation-wrapper__mobilenavbar-list');
  mobileNavbar.append(mobileNavList);
  // No direct instrumentation for mobileNavPlaceholder, as it's a container field.
  // Instrumentation will be applied to individual list items.

  // Filter for navigation-item (3 cells)
  const navigationItems = itemRows.filter((row) => row.children.length === 3);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const subList = hierarchyTreeCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a')?.href;

    // Desktop Navigation
    const desktopLi = document.createElement('li');
    moveInstrumentation(row, desktopLi); // Instrument the <li> with the row
    if (subList) {
      desktopLi.classList.add('cmp-navigation-wrapper__navbar-menu');
      const desktopAnchor = document.createElement('a');
      desktopAnchor.setAttribute('aria-haspopup', 'true');
      desktopAnchor.setAttribute('aria-expanded', 'false');
      desktopAnchor.classList.add('cmp-navigation-wrapper__navbar-menulink');
      desktopAnchor.href = directLink || 'javascript:void(0)';
      const spanLabel = document.createElement('span');
      spanLabel.textContent = labelCell.textContent.trim();
      desktopAnchor.append(spanLabel);
      const iconWrapper = document.createElement('span');
      iconWrapper.classList.add('qd-icon-wrapper');
      const menuIcon = document.createElement('span');
      menuIcon.classList.add('menu-icon', 'qd-icon', 'qd-icon--cheveron-down');
      iconWrapper.append(menuIcon);
      desktopAnchor.append(iconWrapper);
      desktopLi.append(desktopAnchor);

      const desktopSubmenu = document.createElement('ul');
      desktopSubmenu.classList.add('cmp-navigation-wrapper__navbar-submenu');
      desktopSubmenu.innerHTML = hierarchyTreeCell.innerHTML;
      // Apply instrumentation to the children of the richtext cell
      moveInstrumentation(hierarchyTreeCell, desktopSubmenu);
      transformNestedLists(desktopSubmenu); // Transform nested lists for desktop
      desktopLi.append(desktopSubmenu);

      desktopAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = desktopAnchor.getAttribute('aria-expanded') === 'true';
        desktopAnchor.setAttribute('aria-expanded', !expanded);
        desktopSubmenu.classList.toggle('active');
      });
    } else {
      desktopLi.classList.add('cmp-navigation-wrapper__navbar-menu');
      const desktopAnchor = document.createElement('a');
      desktopAnchor.classList.add('cmp-navigation-wrapper__navbar-menulink');
      desktopAnchor.href = directLink || '#';
      desktopAnchor.textContent = labelCell.textContent.trim();
      desktopLi.append(desktopAnchor);
    }
    desktopNavList.append(desktopLi);

    // Mobile Navigation
    const mobileLi = document.createElement('li');
    moveInstrumentation(row, mobileLi); // Instrument the <li> with the row
    if (subList) {
      mobileLi.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');
      const mobileTrigger = document.createElement('a');
      mobileTrigger.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
      const spanLabel = document.createElement('span');
      spanLabel.textContent = labelCell.textContent.trim();
      mobileTrigger.append(spanLabel);
      const icon = document.createElement('span');
      icon.classList.add('qd-icon', 'qd-icon--cheveron-right', 'cmp-navigation-wrapper__mobilenavbar-menulink-icon');
      mobileTrigger.append(icon);
      mobileLi.append(mobileTrigger);

      const mobileSubmenu = document.createElement('ul');
      mobileSubmenu.classList.add('cmp-navigation-wrapper__mobilenavbar-submenu');
      mobileSubmenu.innerHTML = hierarchyTreeCell.innerHTML;
      // Apply instrumentation to the children of the richtext cell
      moveInstrumentation(hierarchyTreeCell, mobileSubmenu);

      const menuHeader = document.createElement('li');
      menuHeader.classList.add('cmp-navigation-wrapper__mobilenavbar-menuheader');
      const headerLink = document.createElement('a');
      const headerSpan = document.createElement('span');
      headerSpan.textContent = labelCell.textContent.trim();
      headerLink.append(headerSpan);
      menuHeader.append(headerLink);
      mobileSubmenu.prepend(menuHeader);

      transformNestedLists(mobileSubmenu, true); // Transform nested lists for mobile
      mobileLi.append(mobileSubmenu);

      mobileTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mobileLi.classList.toggle('active');
        mobileSubmenu.classList.toggle('active');
      });
    } else {
      mobileLi.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');
      const mobileAnchor = document.createElement('a');
      mobileAnchor.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
      mobileAnchor.href = directLink || '#';
      mobileAnchor.textContent = labelCell.textContent.trim();
      mobileLi.append(mobileAnchor);
    }
    mobileNavList.append(mobileLi);
  });

  const languageSelector = document.createElement('div');
  languageSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  languageSelector.style.visibility = 'visible';

  const langList = document.createElement('ul'); // Always create a new ul
  langList.classList.add('cmp-language-selector');
  // No direct instrumentation for langPlaceholder, as it's a container field.
  // Instrumentation will be applied to individual list items.

  // Filter for language-item (2 cells, no picture, no ul)
  const languageItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('ul'));
  languageItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('cmp-language-selector__link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.setAttribute('aria-label', labelCell.textContent.trim());
      anchor.setAttribute('data-lang', labelCell.textContent.trim().toLowerCase().substring(0, 2)); // Example: 'en', 'ar'
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);
    langList.append(li);
  });
  languageSelector.append(langList);

  desktopNavbar.append(languageSelector);
  mobileNavbar.append(languageSelector.cloneNode(true)); // Clone for mobile nav

  // Mobile back button
  const mobileBack = document.createElement('div');
  mobileBack.classList.add('cmp-navigation-wrapper__mobilenavbar-back', 'nav-back');
  const backLink = document.createElement('a');
  backLink.classList.add('cmp-navigation-wrapper__icon');
  const backIcon = document.createElement('span');
  backIcon.classList.add('back-icon', 'qd-icon', 'qd-icon--cheveron-left');
  backLink.append(backIcon);
  const backLabel = document.createElement('span');
  backLabel.classList.add('cmp-navigation-wrapper__iconlabel');
  backLabel.textContent = 'Back';
  mobileBack.append(backLink, backLabel);
  mobileNavbar.append(mobileBack);

  hamburgerEllipse.addEventListener('click', () => {
    cmpNavigationWrapper.classList.toggle('active');
    mobileNavbar.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  mobileBack.addEventListener('click', () => {
    const activeSubmenu = mobileNavList.querySelector('.cmp-navigation-wrapper__mobilenavbar-submenu.active');
    if (activeSubmenu) {
      activeSubmenu.classList.remove('active');
      activeSubmenu.closest('.cmp-navigation-wrapper__mobilenavbar-menu').classList.remove('active');
    } else {
      cmpNavigationWrapper.classList.remove('active');
      mobileNavbar.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  block.replaceChildren(root);
}
