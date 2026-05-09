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
      // Append children from the original nested UL to the new subWrap
      while (nested.firstChild) {
        subWrap.append(nested.firstChild);
      }
      li.append(subWrap); // Append subWrap to li

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        const iconWrapper = document.createElement('span');
        iconWrapper.classList.add('qd-icon-wrapper');
        const icon = document.createElement('span');
        if (isMobile) {
          icon.classList.add('qd-icon', 'qd-icon--cheveron-right', 'cmp-navigation-wrapper__mobilenavbar-menulink-icon');
        } else {
          icon.classList.add('menu-icon', 'qd-icon', 'qd-icon--cheveron-down');
        }
        iconWrapper.append(icon);
        trigger.append(iconWrapper); // Append iconWrapper to trigger

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          if (isMobile) {
            subWrap.classList.toggle('active');
          }
          trigger.setAttribute('aria-expanded', trigger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
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
    contactUsLinkRow,
    contactUsLabelRow,
    // These are container fields, their instrumentation is on the rows that follow
    // The original JS incorrectly destructured them as if they were single rows.
    // We will consume their instrumentation on the generated wrappers.
    desktopNavigationContainerRow, // This row holds instrumentation for desktopNavigation
    mobileNavigationContainerRow,  // This row holds instrumentation for mobileNavigation
    languagesContainerRow,         // This row holds instrumentation for languages
    ...itemRows
  ] = children;

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cmp-header-wrapper', 'layout-container', 'transparent-header');

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation', 'header-nav-css-from-wrapper');

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('cmp-navigation-wrapper');
  navWrapper.setAttribute('role', 'banner');
  navWrapper.setAttribute('aria-label', 'navigation.header.aria.label');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('cmp-navigation-wrapper__logo');

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
    // Fallback for SVG icon from original HTML
    const qdIcon = document.createElement('span');
    qdIcon.classList.add('qd-icon', 'qd-icon--logo', 'qd-logo');
    for (let i = 1; i <= 25; i += 1) {
      const path = document.createElement('span');
      path.classList.add(`path${i}`);
      qdIcon.append(path);
    }
    logoLink.append(qdIcon);
  }
  logoDiv.append(logoLink);

  const contactUsCtaDiv = document.createElement('div');
  contactUsCtaDiv.classList.add('cmp-navigation-wrapper__contactUs-cta');

  const contactUsLink = document.createElement('a');
  contactUsLink.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
  const foundContactUsLink = contactUsLinkRow.querySelector('a');
  if (foundContactUsLink) {
    contactUsLink.href = foundContactUsLink.href;
    contactUsLink.setAttribute('aria-label', contactUsLabelRow.textContent.trim());
  }
  moveInstrumentation(contactUsLinkRow, contactUsLink);

  const ctaIcon = document.createElement('span');
  ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  ctaIcon.setAttribute('aria-hidden', 'true');
  contactUsLink.append(ctaIcon);

  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('cta__label');
  ctaLabel.textContent = contactUsLabelRow.textContent.trim();
  moveInstrumentation(contactUsLabelRow, ctaLabel);
  contactUsLink.append(ctaLabel);
  contactUsCtaDiv.append(contactUsLink);

  const navToggleDiv = document.createElement('div');
  navToggleDiv.classList.add('cmp-navigation-wrapper__icon');
  navToggleDiv.id = 'navigation-toggle';

  const hamburgerEllipse = document.createElement('div');
  hamburgerEllipse.classList.add('hamburger-ellipse');
  hamburgerEllipse.setAttribute('tabindex', '0');

  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('hamburger-icon', 'qd-icon', 'qd-icon--hamburger');
  hamburgerEllipse.append(hamburgerIcon);

  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon', 'qd-icon', 'qd-icon--cancel');
  hamburgerEllipse.append(closeIcon);
  navToggleDiv.append(hamburgerEllipse);
  contactUsCtaDiv.append(navToggleDiv);
  logoDiv.append(contactUsCtaDiv);
  navWrapper.append(logoDiv);

  // Desktop Navigation
  const desktopNav = document.createElement('nav');
  desktopNav.classList.add('cmp-navigation-wrapper__navbar');
  desktopNav.id = 'navbar-desktop';
  desktopNav.setAttribute('role', 'navigation');
  desktopNav.setAttribute('aria-label', 'navigation.main.aria.label');

  const desktopNavList = document.createElement('ul');
  desktopNavList.classList.add('cmp-navigation-wrapper__navbar-list');

  // Filter itemRows based on their structure as defined in BlockJson
  const navItems = itemRows.filter((row) => row.children.length === 3); // nav-item and mobile-nav-item
  const languageItems = itemRows.filter((row) => row.children.length === 2); // language-item

  // Consume desktopNavigationContainer instrumentation
  const desktopNavWrapper = document.createElement('div');
  moveInstrumentation(desktopNavigationContainerRow, desktopNavWrapper); // Use the correct row for instrumentation

  navItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation-wrapper__navbar-menu');

    const subList = hierarchyTreeCell?.querySelector('ul');
    const anchor = document.createElement('a');
    anchor.classList.add('cmp-navigation-wrapper__navbar-menulink');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.setAttribute('target', '_self');
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);

    if (subList) {
      anchor.setAttribute('aria-haspopup', 'true');
      anchor.setAttribute('aria-expanded', 'false');
      const clonedSubList = subList.cloneNode(true);
      transformNestedLists(clonedSubList);
      li.append(anchor);
      li.append(clonedSubList);
    } else {
      li.append(anchor);
    }
    desktopNavList.append(li);
  });

  desktopNav.append(desktopNavList);

  const desktopContactUsLink = document.createElement('a');
  desktopContactUsLink.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
  const foundDesktopContactUsLink = contactUsLinkRow.querySelector('a');
  if (foundDesktopContactUsLink) {
    desktopContactUsLink.href = foundDesktopContactUsLink.href;
    desktopContactUsLink.setAttribute('aria-label', contactUsLabelRow.textContent.trim());
  }
  const desktopCtaIcon = document.createElement('span');
  desktopCtaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  desktopCtaIcon.setAttribute('aria-hidden', 'true');
  desktopContactUsLink.append(desktopCtaIcon);
  const desktopCtaLabel = document.createElement('span');
  desktopCtaLabel.classList.add('cta__label');
  desktopCtaLabel.textContent = contactUsLabelRow.textContent.trim();
  desktopContactUsLink.append(desktopCtaLabel);
  desktopNav.append(desktopContactUsLink);

  const desktopLanguageSelector = document.createElement('div');
  desktopLanguageSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  desktopLanguageSelector.style.visibility = 'visible';

  const desktopLangList = document.createElement('ul');
  desktopLangList.classList.add('cmp-language-selector');

  // Consume languagesContainer instrumentation
  const languageWrapper = document.createElement('div');
  moveInstrumentation(languagesContainerRow, languageWrapper); // Use the correct row for instrumentation

  languageItems.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    if (index === 0) {
      li.classList.add('active');
    }
    const anchor = document.createElement('a');
    anchor.classList.add('cmp-language-selector__link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.setAttribute('aria-label', labelCell.textContent.trim());
      anchor.setAttribute('data-lang', labelCell.textContent.trim().toLowerCase().substring(0, 2));
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);
    desktopLangList.append(li);
  });

  desktopLanguageSelector.append(desktopLangList);
  desktopNav.append(desktopLanguageSelector);
  navWrapper.append(desktopNav);

  // Mobile Navigation
  const mobileNav = document.createElement('nav');
  mobileNav.classList.add('cmp-navigation-wrapper__mobilenavbar');
  mobileNav.id = 'navbar-mobile';
  mobileNav.setAttribute('role', 'navigation');
  mobileNav.setAttribute('aria-label', 'navigation.main.aria.label');

  const mobileNavList = document.createElement('ul');
  mobileNavList.classList.add('cmp-navigation-wrapper__mobilenavbar-list');

  // Consume mobileNavigationContainer instrumentation
  const mobileNavWrapper = document.createElement('div');
  moveInstrumentation(mobileNavigationContainerRow, mobileNavWrapper); // Use the correct row for instrumentation

  navItems.forEach((row) => { // Using same items for mobile as per original HTML structure
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');

    const subList = hierarchyTreeCell?.querySelector('ul');
    const anchor = document.createElement('a');
    anchor.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.setAttribute('target', '_self');
    }
    const spanLabel = document.createElement('span');
    spanLabel.textContent = labelCell.textContent.trim();
    anchor.append(spanLabel);
    moveInstrumentation(row, anchor);

    if (subList) {
      const clonedSubList = subList.cloneNode(true);
      transformNestedLists(clonedSubList, true);
      li.append(anchor);
      li.append(clonedSubList);
    } else {
      li.append(anchor);
    }
    mobileNavList.append(li);
  });

  mobileNav.append(mobileNavList);

  const mobileNavBack = document.createElement('div');
  mobileNavBack.classList.add('cmp-navigation-wrapper__mobilenavbar-back', 'nav-back');

  const backIconLink = document.createElement('a');
  backIconLink.classList.add('cmp-navigation-wrapper__icon');
  const backIcon = document.createElement('span');
  backIcon.classList.add('back-icon', 'qd-icon', 'qd-icon--cheveron-left');
  backIconLink.append(backIcon);
  mobileNavBack.append(backIconLink);

  const backLabel = document.createElement('span');
  backLabel.classList.add('cmp-navigation-wrapper__iconlabel');
  backLabel.textContent = 'Back';
  mobileNavBack.append(backLabel);
  mobileNav.append(mobileNavBack);

  const mobileLanguageSelector = desktopLanguageSelector.cloneNode(true); // Re-use desktop language selector
  mobileNav.append(mobileLanguageSelector);
  navWrapper.append(mobileNav);

  navigationDiv.append(navWrapper);
  headerWrapper.append(navigationDiv);

  block.replaceChildren(headerWrapper);

  // Event Listeners for mobile navigation toggle
  hamburgerEllipse.addEventListener('click', () => {
    navWrapper.classList.toggle('active');
    document.body.classList.toggle('disable-scroll');
  });

  backIconLink.addEventListener('click', () => {
    const activeSubmenu = mobileNav.querySelector('.cmp-navigation-wrapper__mobilenavbar-submenu.active');
    if (activeSubmenu) {
      activeSubmenu.classList.remove('active');
      activeSubmenu.closest('.cmp-navigation-wrapper__mobilenavbar-menu').classList.remove('active');
    } else {
      navWrapper.classList.remove('active');
      document.body.classList.remove('disable-scroll');
    }
  });
}
