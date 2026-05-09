import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isMobile = false) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Handle label-only nodes or create a trigger for dropdowns
    let trigger = anchor;
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        trigger = span;
      }
    }

    if (nested) {
      nested.remove(); // Remove the original ul from li
      const subWrap = document.createElement('ul'); // Changed to ul for sub-menu
      subWrap.classList.add(
        isMobile
          ? 'cmp-navigation-wrapper__mobilenavbar-submenu'
          : 'cmp-navigation-wrapper__navbar-submenu',
      );
      // Append the original ul's content by moving children
      while (nested.firstChild) {
        subWrap.append(nested.firstChild);
      }

      if (trigger) {
        // Create a wrapper for the trigger to add icons
        const triggerWrapper = document.createElement('a');
        if (anchor) {
          triggerWrapper.href = anchor.href;
          triggerWrapper.target = anchor.target;
        } else {
          triggerWrapper.href = 'javascript:void(0)';
        }
        triggerWrapper.classList.add(
          isMobile
            ? 'cmp-navigation-wrapper__mobilenavbar-menulink'
            : 'cmp-navigation-wrapper__navbar-menulink',
        );
        triggerWrapper.setAttribute('aria-haspopup', 'true');
        triggerWrapper.setAttribute('aria-expanded', 'false');

        const spanLabel = document.createElement('span');
        spanLabel.textContent = trigger.textContent;
        triggerWrapper.append(spanLabel);

        const iconWrapper = document.createElement('span');
        iconWrapper.classList.add('qd-icon-wrapper');
        const icon = document.createElement('span');
        icon.classList.add(
          isMobile
            ? 'qd-icon', 'qd-icon--cheveron-right', 'cmp-navigation-wrapper__mobilenavbar-menulink-icon'
            : 'menu-icon', 'qd-icon', 'qd-icon--cheveron-down',
        );
        iconWrapper.append(icon);
        triggerWrapper.append(iconWrapper);

        // Replace the original trigger with the new triggerWrapper
        trigger.replaceWith(triggerWrapper);
        trigger = triggerWrapper; // Update trigger reference

        // Add event listener for dropdown toggle
        trigger.addEventListener('click', (e) => {
          if (trigger.getAttribute('aria-expanded') === 'false') {
            e.preventDefault();
            e.stopPropagation();
            trigger.setAttribute('aria-expanded', 'true');
            li.classList.add('active');
            subWrap.classList.add('active');
          } else if (anchor) {
            // If it's a link, allow navigation on second click
            window.location.href = anchor.href;
          } else {
            e.preventDefault();
            e.stopPropagation();
            trigger.setAttribute('aria-expanded', 'false');
            li.classList.remove('active');
            subWrap.classList.remove('active');
          }
        });
      }
      li.append(subWrap);
    } else if (anchor) {
      // For simple links without nested lists, ensure correct classes
      anchor.classList.add(
        isMobile
          ? 'cmp-navigation-wrapper__mobilenavbar-menulink'
          : 'cmp-navigation-wrapper__navbar-menulink',
      );
      li.classList.add(
        isMobile
          ? 'cmp-navigation-wrapper__mobilenavbar-menu'
          : 'cmp-navigation-wrapper__navbar-menu',
      );
    }
    // Move instrumentation for the list item itself
    // Assuming the li element itself might have instrumentation from the original hierarchy-tree cell
    // This is a heuristic, as the original li elements are created dynamically from innerHTML.
    // However, if the original hierarchy-tree cell had instrumentation, it would be on the <ul> or <li>.
    // Since we are cloning and transforming, we need to ensure the new li elements also carry instrumentation.
    // For now, we'll assume the instrumentation is on the parent row and moved there.
    // If the original HTML had instrumentation on the <li> elements themselves, this would need a more complex
    // mapping during the clone and transform.
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoAriaLabelRow,
    logoLinkRow,
    contactLinkRow,
    contactLabelRow,
    desktopNavigationContainer,
    mobileNavigationContainer,
    languagesContainer,
    ...itemRows
  ] = children;

  const root = document.createElement('div');
  root.classList.add('cmp-header-wrapper', 'layout-container', 'transparent-header');
  moveInstrumentation(block, root);

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('navigation', 'header-nav-css-from-wrapper');
  navigationWrapper.setAttribute('role', 'banner');
  navigationWrapper.setAttribute('aria-label', 'navigation.header.aria.label');
  root.append(navigationWrapper);

  // Logo Section
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('cmp-navigation-wrapper__logo');
  navigationWrapper.append(logoWrapper);

  const logoAnchor = document.createElement('a');
  const logoHref = logoLinkRow.querySelector('a')?.href || '/';
  logoAnchor.href = logoHref;
  logoAnchor.target = '_self';
  logoAnchor.setAttribute('aria-label', logoAriaLabelRow.textContent.trim() || 'Go to homepage');
  logoWrapper.append(logoAnchor);
  moveInstrumentation(logoLinkRow, logoAnchor);

  const logoIcon = document.createElement('span');
  logoIcon.classList.add('qd-icon', 'qd-icon--logo', 'qd-logo');
  // Add all path spans for the logo icon
  for (let i = 1; i <= 25; i += 1) {
    const pathSpan = document.createElement('span');
    pathSpan.classList.add(`path${i}`);
    logoIcon.append(pathSpan);
  }
  logoAnchor.append(logoIcon);

  // Contact Us CTA and Hamburger Icon
  const contactCtaWrapper = document.createElement('div');
  contactCtaWrapper.classList.add('cmp-navigation-wrapper__contactUs-cta');
  logoWrapper.append(contactCtaWrapper);

  const contactLink = document.createElement('a');
  contactLink.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
  contactLink.href = contactLinkRow.querySelector('a')?.href || '#';
  contactLink.target = '_self';
  contactLink.setAttribute('aria-label', contactLabelRow.textContent.trim() || 'Contact Us');
  contactCtaWrapper.append(contactLink);
  moveInstrumentation(contactLinkRow, contactLink);

  const ctaIcon = document.createElement('span');
  ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  ctaIcon.setAttribute('aria-hidden', 'true');
  contactLink.append(ctaIcon);

  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('cta__label');
  ctaLabel.textContent = contactLabelRow.textContent.trim();
  contactLink.append(ctaLabel);
  moveInstrumentation(contactLabelRow, ctaLabel);

  const navigationToggle = document.createElement('div');
  navigationToggle.classList.add('cmp-navigation-wrapper__icon');
  navigationToggle.id = 'navigation-toggle';
  contactCtaWrapper.append(navigationToggle);

  const hamburgerEllipse = document.createElement('div');
  hamburgerEllipse.classList.add('hamburger-ellipse');
  hamburgerEllipse.setAttribute('tabindex', '0');
  navigationToggle.append(hamburgerEllipse);

  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('hamburger-icon', 'qd-icon', 'qd-icon--hamburger');
  hamburgerEllipse.append(hamburgerIcon);

  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon', 'qd-icon', 'qd-icon--cancel');
  hamburgerEllipse.append(closeIcon);

  // Desktop Navigation
  const desktopNav = document.createElement('nav');
  desktopNav.classList.add('cmp-navigation-wrapper__navbar');
  desktopNav.id = 'navbar-desktop';
  desktopNav.setAttribute('role', 'navigation');
  desktopNav.setAttribute('aria-label', 'navigation.main.aria.label');
  navigationWrapper.append(desktopNav);
  moveInstrumentation(desktopNavigationContainer, desktopNav);

  const desktopNavList = document.createElement('ul');
  desktopNavList.classList.add('cmp-navigation-wrapper__navbar-list');
  desktopNav.append(desktopNavList);

  // Mobile Navigation
  const mobileNav = document.createElement('nav');
  mobileNav.classList.add('cmp-navigation-wrapper__mobilenavbar');
  mobileNav.id = 'navbar-mobile';
  mobileNav.setAttribute('role', 'navigation');
  mobileNav.setAttribute('aria-label', 'navigation.main.aria.label');
  navigationWrapper.append(mobileNav);
  moveInstrumentation(mobileNavigationContainer, mobileNav);

  const mobileNavList = document.createElement('ul');
  mobileNavList.classList.add('cmp-navigation-wrapper__mobilenavbar-list');
  mobileNav.append(mobileNavList);

  const desktopNavItems = [];
  const mobileNavItems = [];
  const languageItems = [];

  const desktopNavStartIdx = children.indexOf(desktopNavigationContainer) + 1;
  const mobileNavStartIdx = children.indexOf(mobileNavigationContainer) + 1;
  const languagesStartIdx = children.indexOf(languagesContainer) + 1;

  itemRows.forEach((row) => {
    const rowIndex = children.indexOf(row);
    // Determine item type based on position and cell count
    if (rowIndex >= desktopNavStartIdx && rowIndex < mobileNavStartIdx) {
      // Desktop Navigation Item (3 cells: label, link, hierarchy-tree)
      if (row.children.length === 3) {
        desktopNavItems.push(row);
      }
    } else if (rowIndex >= mobileNavStartIdx && rowIndex < languagesStartIdx) {
      // Mobile Navigation Item (2 cells: label, hierarchy-tree)
      if (row.children.length === 2) {
        mobileNavItems.push(row);
      }
    } else if (rowIndex >= languagesStartIdx) {
      // Language Item (2 cells: label, link)
      if (row.children.length === 2) {
        languageItems.push(row);
      }
    }
  });

  desktopNavItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation-wrapper__navbar-menu');
    moveInstrumentation(row, li);

    const hierarchyTree = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyTree) {
      const tempDiv = document.createElement('div');
      // Use innerHTML to preserve full structure, then find the ul
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const clonedUl = tempDiv.querySelector('ul');
      if (clonedUl) {
        transformNestedLists(clonedUl);
        // Append all children from the transformed tempDiv
        while (tempDiv.firstChild) {
          li.append(tempDiv.firstChild);
        }
      }
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation-wrapper__navbar-menulink');
      anchor.target = '_self';
      anchor.href = linkCell.querySelector('a')?.href || '#';
      const span = document.createElement('span');
      span.textContent = labelCell.textContent.trim();
      anchor.append(span);
      li.append(anchor);
    }
    desktopNavList.append(li);
  });

  mobileNavItems.forEach((row) => {
    const [labelCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');
    moveInstrumentation(row, li);

    const hierarchyTree = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyTree) {
      const tempDiv = document.createElement('div');
      // Use innerHTML to preserve full structure, then find the ul
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const clonedUl = tempDiv.querySelector('ul');
      if (clonedUl) {
        transformNestedLists(clonedUl, true);

        const headerLi = document.createElement('li');
        headerLi.classList.add('cmp-navigation-wrapper__mobilenavbar-menuheader');
        const headerAnchor = document.createElement('a');
        const headerSpan = document.createElement('span');
        headerSpan.textContent = labelCell.textContent.trim();
        headerAnchor.append(headerSpan);
        headerLi.append(headerAnchor);

        const subMenuUl = document.createElement('ul');
        subMenuUl.classList.add('cmp-navigation-wrapper__mobilenavbar-submenu');
        subMenuUl.append(headerLi);
        // Append all children from the transformed tempDiv
        while (tempDiv.firstChild) {
          subMenuUl.append(tempDiv.firstChild);
        }
        li.append(subMenuUl);

        const trigger = document.createElement('a');
        trigger.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
        const triggerSpan = document.createElement('span');
        triggerSpan.textContent = labelCell.textContent.trim();
        trigger.append(triggerSpan);
        const icon = document.createElement('span');
        icon.classList.add('qd-icon', 'qd-icon--cheveron-right', 'cmp-navigation-wrapper__mobilenavbar-menulink-icon');
        trigger.append(icon);
        li.prepend(trigger);

        trigger.addEventListener('click', () => {
          subMenuUl.classList.add('active');
          mobileNav.classList.add('sub-menu-active');
        });

        headerAnchor.addEventListener('click', () => {
          subMenuUl.classList.remove('active');
          mobileNav.classList.remove('sub-menu-active');
        });
      }
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
      anchor.target = '_self';
      anchor.href = '#'; // Mobile nav items don't have direct links in schema
      const span = document.createElement('span');
      span.textContent = labelCell.textContent.trim();
      anchor.append(span);
      li.append(anchor);
    }
    mobileNavList.append(li);
  });

  // Language Selector (Desktop)
  const desktopLanguageSelector = document.createElement('div');
  desktopLanguageSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  desktopLanguageSelector.style.visibility = 'visible';
  desktopNav.append(desktopLanguageSelector);
  moveInstrumentation(languagesContainer, desktopLanguageSelector); // Move instrumentation from container

  const desktopLangList = document.createElement('ul');
  desktopLangList.classList.add('cmp-language-selector');
  desktopLanguageSelector.append(desktopLangList);

  // Language Selector (Mobile)
  const mobileLanguageSelector = document.createElement('div');
  mobileLanguageSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  mobileLanguageSelector.style.visibility = 'visible';
  mobileNav.append(mobileLanguageSelector);

  const mobileLangList = document.createElement('ul');
  mobileLangList.classList.add('cmp-language-selector');
  mobileLanguageSelector.append(mobileLangList);

  languageItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const linkHref = linkCell.querySelector('a')?.href;
    const langLabel = labelCell.textContent.trim();
    const langCode = langLabel.toLowerCase().substring(0, 2); // Assuming 'English' -> 'en'

    // Desktop
    const desktopLi = document.createElement('li');
    if (langCode === 'en') desktopLi.classList.add('active');
    const desktopAnchor = document.createElement('a');
    desktopAnchor.href = linkHref || '#';
    desktopAnchor.setAttribute('aria-label', langLabel);
    desktopAnchor.classList.add('cmp-language-selector__link');
    desktopAnchor.setAttribute('data-lang', langCode);
    desktopAnchor.textContent = langLabel;
    desktopLi.append(desktopAnchor);
    desktopLangList.append(desktopLi);
    moveInstrumentation(row, desktopLi); // Move instrumentation for desktop

    // Mobile
    const mobileLi = document.createElement('li');
    if (langCode === 'en') mobileLi.classList.add('active');
    const mobileAnchor = document.createElement('a');
    mobileAnchor.href = linkHref || '#';
    mobileAnchor.setAttribute('aria-label', langLabel);
    mobileAnchor.classList.add('cmp-language-selector__link');
    mobileAnchor.setAttribute('data-lang', langCode);
    mobileAnchor.textContent = langLabel;
    mobileLi.append(mobileAnchor);
    mobileLangList.append(mobileLi);
    moveInstrumentation(row, mobileLi); // Move instrumentation for mobile
  });

  // Mobile back button
  const mobileNavBack = document.createElement('div');
  mobileNavBack.classList.add('cmp-navigation-wrapper__mobilenavbar-back', 'nav-back');
  mobileNav.prepend(mobileNavBack);
  // No direct row for mobileNavBack, but it's part of mobileNav, which has instrumentation

  const backIconWrapper = document.createElement('a');
  backIconWrapper.classList.add('cmp-navigation-wrapper__icon');
  mobileNavBack.append(backIconWrapper);

  const backIcon = document.createElement('span');
  backIcon.classList.add('back-icon', 'qd-icon', 'qd-icon--cheveron-left');
  backIconWrapper.append(backIcon);

  const backLabel = document.createElement('span');
  backLabel.classList.add('cmp-navigation-wrapper__iconlabel');
  backLabel.textContent = 'Back';
  mobileNavBack.append(backLabel);
  moveInstrumentation(mobileNavigationContainer, mobileNavBack); // Move instrumentation to the back button container

  // Toggle mobile navigation
  hamburgerEllipse.addEventListener('click', () => {
    navigationWrapper.classList.toggle('active');
    mobileNav.classList.toggle('active');
  });

  backIconWrapper.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    navigationWrapper.classList.remove('active');
  });

  block.replaceChildren(root);
}
