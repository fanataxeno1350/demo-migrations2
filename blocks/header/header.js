import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isMobile = false) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove(); // Remove the original ul from li
      const subWrap = document.createElement('ul');
      if (isMobile) {
        subWrap.classList.add('cmp-navigation-wrapper__mobilenavbar-submenu');
      } else {
        subWrap.classList.add('cmp-navigation-wrapper__navbar-submenu');
      }
      // Append the original nested content to the new wrapper
      while (nested.firstChild) {
        subWrap.append(nested.firstChild);
      }
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        if (isMobile) {
          trigger.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
          const icon = document.createElement('span');
          icon.classList.add('qd-icon', 'qd-icon--cheveron-right', 'cmp-navigation-wrapper__mobilenavbar-menulink-icon');
          trigger.append(icon);
          li.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');

          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.closest('.cmp-navigation-wrapper__mobilenavbar-list').classList.add('sub-menu-active');
            subWrap.classList.add('active');
            // Check if menu header already exists to prevent duplicates
            if (!subWrap.querySelector('.cmp-navigation-wrapper__mobilenavbar-menuheader')) {
              const menuHeader = document.createElement('li');
              menuHeader.classList.add('cmp-navigation-wrapper__mobilenavbar-menuheader');
              const headerLink = document.createElement('a');
              headerLink.textContent = trigger.textContent.trim();
              menuHeader.append(headerLink);
              subWrap.prepend(menuHeader);
            }
          });
        } else {
          li.classList.add('cmp-navigation-wrapper__navbar-menu');
          trigger.classList.add('cmp-navigation-wrapper__navbar-menulink');
          trigger.setAttribute('aria-haspopup', 'true');
          trigger.setAttribute('aria-expanded', 'false');
          const iconWrapper = document.createElement('span');
          iconWrapper.classList.add('qd-icon-wrapper');
          const icon = document.createElement('span');
          icon.classList.add('menu-icon', 'qd-icon', 'qd-icon--cheveron-down');
          iconWrapper.append(icon);
          trigger.append(iconWrapper);

          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            li.classList.toggle('active');
            trigger.setAttribute('aria-expanded', li.classList.contains('active'));
          });

          li.addEventListener('mouseenter', () => {
            li.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
          });
          li.addEventListener('mouseleave', () => {
            li.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
          });
        }
      }
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
  const [logoRow, logoLinkRow, ctaLabelRow, ctaLinkRow, ...itemRows] = [...block.children];

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cmp-header-wrapper', 'layout-container', 'transparent-header');
  moveInstrumentation(block, headerWrapper);

  const navigation = document.createElement('div');
  navigation.classList.add('navigation', 'header-nav-css-from-wrapper');
  headerWrapper.append(navigation);

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('cmp-navigation-wrapper');
  navigationWrapper.setAttribute('role', 'banner');
  navigationWrapper.setAttribute('aria-label', 'navigation.header.aria.label');
  navigation.append(navigationWrapper);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('cmp-navigation-wrapper__logo');
  navigationWrapper.append(logoDiv);

  const logoAnchor = document.createElement('a');
  const logoHref = logoLinkRow?.querySelector('a')?.href || '/';
  logoAnchor.href = logoHref;
  logoAnchor.setAttribute('target', '_self');
  logoAnchor.setAttribute('aria-label', 'Qiddiya - Go to homepage');
  moveInstrumentation(logoLinkRow, logoAnchor);

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const optimizedPic = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '200' }],
    );
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoAnchor.append(optimizedPic);
  } else {
    // Fallback for logo if picture is missing, use original SVG structure
    const qdIcon = document.createElement('span');
    qdIcon.classList.add('qd-icon', 'qd-icon--logo', 'qd-logo');
    qdIcon.innerHTML = `
      <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span><span class="path25"></span>
    `;
    logoAnchor.append(qdIcon);
  }
  logoDiv.append(logoAnchor);

  const contactUsCtaDiv = document.createElement('div');
  contactUsCtaDiv.classList.add('cmp-navigation-wrapper__contactUs-cta');
  logoDiv.append(contactUsCtaDiv);

  const ctaAnchor = document.createElement('a');
  const ctaLink = ctaLinkRow?.querySelector('a')?.href || '#';
  const ctaLabel = ctaLabelRow?.textContent.trim() || 'Contact Us';
  ctaAnchor.href = ctaLink;
  ctaAnchor.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
  ctaAnchor.setAttribute('target', '_self');
  ctaAnchor.setAttribute('aria-label', ctaLabel);
  moveInstrumentation(ctaLinkRow, ctaAnchor);

  const ctaIcon = document.createElement('span');
  ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  ctaIcon.setAttribute('aria-hidden', 'true');
  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add('cta__label');
  ctaLabelSpan.textContent = ctaLabel;
  ctaAnchor.append(ctaIcon, ctaLabelSpan);
  contactUsCtaDiv.append(ctaAnchor);

  const navToggleDiv = document.createElement('div');
  navToggleDiv.classList.add('cmp-navigation-wrapper__icon');
  navToggleDiv.id = 'navigation-toggle';
  const hamburgerEllipse = document.createElement('div');
  hamburgerEllipse.classList.add('hamburger-ellipse');
  hamburgerEllipse.setAttribute('tabindex', '0');
  hamburgerEllipse.innerHTML = `
    <span class="hamburger-icon qd-icon qd-icon--hamburger"></span>
    <span class="close-icon qd-icon qd-icon--cancel"></span>
  `;
  navToggleDiv.append(hamburgerEllipse);
  contactUsCtaDiv.append(navToggleDiv);

  const navItemRows = itemRows.filter((row) => row.children.length === 3);
  const langSelectorRows = itemRows.filter((row) => row.children.length === 2);

  // Desktop Navigation
  const desktopNavbar = document.createElement('nav');
  desktopNavbar.classList.add('cmp-navigation-wrapper__navbar');
  desktopNavbar.id = 'navbar-desktop';
  desktopNavbar.setAttribute('role', 'navigation');
  desktopNavbar.setAttribute('aria-label', 'navigation.main.aria.label');
  navigationWrapper.append(desktopNavbar);

  const desktopNavList = document.createElement('ul');
  desktopNavList.classList.add('cmp-navigation-wrapper__navbar-list');
  desktopNavbar.append(desktopNavList);

  navItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const subListContent = hierarchyTreeCell?.querySelector('ul'); // Get the actual UL content
    const linkHref = linkCell?.querySelector('a')?.href;
    const labelText = labelCell?.textContent.trim();

    const linkEl = document.createElement('a');
    linkEl.href = linkHref || '#';
    linkEl.textContent = labelText;
    linkEl.setAttribute('target', '_self');

    if (subListContent) {
      linkEl.setAttribute('aria-haspopup', 'true');
      linkEl.setAttribute('aria-expanded', 'false');
      linkEl.classList.add('cmp-navigation-wrapper__navbar-menulink');

      const iconWrapper = document.createElement('span');
      iconWrapper.classList.add('qd-icon-wrapper');
      const icon = document.createElement('span');
      icon.classList.add('menu-icon', 'qd-icon', 'qd-icon--cheveron-down');
      iconWrapper.append(icon);
      linkEl.append(iconWrapper);

      const subMenu = document.createElement('ul');
      subMenu.classList.add('cmp-navigation-wrapper__navbar-submenu');
      // Move instrumentation from hierarchyTreeCell to the new subMenu
      moveInstrumentation(hierarchyTreeCell, subMenu);
      // Append children from the original subListContent to the new subMenu
      while (subListContent.firstChild) {
        subMenu.append(subListContent.firstChild);
      }
      transformNestedLists(subMenu);

      li.classList.add('cmp-navigation-wrapper__navbar-menu');
      li.append(linkEl, subMenu);

      li.addEventListener('mouseenter', () => {
        li.classList.add('active');
        linkEl.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', () => {
        li.classList.remove('active');
        linkEl.setAttribute('aria-expanded', 'false');
      });
    } else {
      li.classList.add('cmp-navigation-wrapper__navbar-menu');
      linkEl.classList.add('cmp-navigation-wrapper__navbar-menulink');
      li.append(linkEl);
    }
    desktopNavList.append(li);
  });

  const desktopCtaAnchor = document.createElement('a');
  desktopCtaAnchor.href = ctaLinkRow?.querySelector('a')?.href || '#';
  desktopCtaAnchor.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
  desktopCtaAnchor.setAttribute('target', '_self');
  desktopCtaAnchor.setAttribute('aria-label', ctaLabelRow?.textContent.trim() || 'Contact Us');
  const desktopCtaIcon = document.createElement('span');
  desktopCtaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  desktopCtaIcon.setAttribute('aria-hidden', 'true');
  const desktopCtaLabelSpan = document.createElement('span');
  desktopCtaLabelSpan.classList.add('cta__label');
  desktopCtaLabelSpan.textContent = ctaLabelRow?.textContent.trim() || 'Contact Us';
  desktopCtaAnchor.append(desktopCtaIcon, desktopCtaLabelSpan);
  desktopNavbar.append(desktopCtaAnchor);

  const desktopLangSelector = document.createElement('div');
  desktopLangSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  desktopLangSelector.style.visibility = 'visible';
  const desktopLangList = document.createElement('ul');
  desktopLangList.classList.add('cmp-language-selector');
  langSelectorRows.forEach((row, i) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    if (i === 0) li.classList.add('active');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.setAttribute('aria-label', labelCell?.textContent.trim());
    anchor.classList.add('cmp-language-selector__link');
    anchor.textContent = labelCell?.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);
    desktopLangList.append(li);
  });
  desktopLangSelector.append(desktopLangList);
  desktopNavbar.append(desktopLangSelector);

  // Mobile Navigation
  const mobileNavbar = document.createElement('nav');
  mobileNavbar.classList.add('cmp-navigation-wrapper__mobilenavbar');
  mobileNavbar.id = 'navbar-mobile';
  mobileNavbar.setAttribute('role', 'navigation');
  mobileNavbar.setAttribute('aria-label', 'navigation.main.aria.label');
  navigationWrapper.append(mobileNavbar);

  const mobileNavList = document.createElement('ul');
  mobileNavList.classList.add('cmp-navigation-wrapper__mobilenavbar-list');
  mobileNavbar.append(mobileNavList);

  navItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const subListContent = hierarchyTreeCell?.querySelector('ul');
    const linkHref = linkCell?.querySelector('a')?.href;
    const labelText = labelCell?.textContent.trim();

    const linkEl = document.createElement('a');
    linkEl.href = linkHref || '#';
    linkEl.textContent = labelText;
    linkEl.setAttribute('target', '_self');

    if (subListContent) {
      linkEl.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
      const icon = document.createElement('span');
      icon.classList.add('qd-icon', 'qd-icon--cheveron-right', 'cmp-navigation-wrapper__mobilenavbar-menulink-icon');
      linkEl.append(icon);

      const subMenu = document.createElement('ul');
      subMenu.classList.add('cmp-navigation-wrapper__mobilenavbar-submenu');
      // Move instrumentation from hierarchyTreeCell to the new subMenu
      moveInstrumentation(hierarchyTreeCell, subMenu);
      // Append children from the original subListContent to the new subMenu
      while (subListContent.firstChild) {
        subMenu.append(subListContent.firstChild);
      }
      transformNestedLists(subMenu, true);

      li.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');
      li.append(linkEl, subMenu);

      linkEl.addEventListener('click', (e) => {
        e.preventDefault();
        mobileNavList.classList.add('sub-menu-active');
        subMenu.classList.add('active');
        // Check if menu header already exists to prevent duplicates
        if (!subMenu.querySelector('.cmp-navigation-wrapper__mobilenavbar-menuheader')) {
          const menuHeader = document.createElement('li');
          menuHeader.classList.add('cmp-navigation-wrapper__mobilenavbar-menuheader');
          const headerLink = document.createElement('a');
          headerLink.textContent = labelText;
          menuHeader.append(headerLink);
          subMenu.prepend(menuHeader);
        }
      });
    } else {
      li.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');
      linkEl.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
      li.append(linkEl);
    }
    mobileNavList.append(li);
  });

  const mobileBackDiv = document.createElement('div');
  mobileBackDiv.classList.add('cmp-navigation-wrapper__mobilenavbar-back', 'nav-back');
  const backIconAnchor = document.createElement('a');
  backIconAnchor.classList.add('cmp-navigation-wrapper__icon');
  backIconAnchor.innerHTML = '<span class="back-icon qd-icon qd-icon--cheveron-left"></span>';
  const backLabelSpan = document.createElement('span');
  backLabelSpan.classList.add('cmp-navigation-wrapper__iconlabel');
  backLabelSpan.textContent = 'Back';
  mobileBackDiv.append(backIconAnchor, backLabelSpan);
  mobileNavbar.append(mobileBackDiv);

  const mobileLangSelector = document.createElement('div');
  mobileLangSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  mobileLangSelector.style.visibility = 'visible';
  const mobileLangList = document.createElement('ul');
  mobileLangList.classList.add('cmp-language-selector');
  langSelectorRows.forEach((row, i) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    if (i === 0) li.classList.add('active');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.setAttribute('aria-label', labelCell?.textContent.trim());
    anchor.classList.add('cmp-language-selector__link');
    anchor.textContent = labelCell?.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);
    mobileLangList.append(li);
  });
  mobileLangSelector.append(mobileLangList);
  mobileNavbar.append(mobileLangSelector);

  hamburgerEllipse.addEventListener('click', () => {
    navigationWrapper.classList.toggle('active');
    document.body.classList.toggle('disable-scroll');
  });

  backIconAnchor.addEventListener('click', () => {
    const activeSubMenu = mobileNavList.querySelector('.cmp-navigation-wrapper__mobilenavbar-submenu.active');
    if (activeSubMenu) {
      activeSubMenu.classList.remove('active');
      // Only remove the header if it's the first child and matches the class
      const menuHeader = activeSubMenu.querySelector('.cmp-navigation-wrapper__mobilenavbar-menuheader');
      if (menuHeader && menuHeader === activeSubMenu.firstChild) {
        menuHeader.remove();
      }
    } else {
      mobileNavList.classList.remove('sub-menu-active');
    }
  });

  block.replaceChildren(headerWrapper);
}
