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
      // Move children directly, preserving instrumentation
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
          const headerLi = document.createElement('li');
          headerLi.classList.add('cmp-navigation-wrapper__mobilenavbar-menuheader');
          const headerLink = document.createElement('a');
          headerLink.textContent = trigger.textContent.trim();
          headerLi.append(headerLink);
          subWrap.prepend(headerLi);
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
            li.closest('.cmp-navigation-wrapper__mobilenavbar-list').classList.add('sub-menu-open');
            subWrap.classList.add('active');
          } else {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', !isExpanded);
            subWrap.classList.toggle('active');
          }
        });
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
  const children = [...block.children];

  // Fixed schema rows for header fields
  const [logoRow, logoLinkRow, contactUsLinkRow, contactUsLabelRow, ...remainingRows] = children;

  const logoCell = logoRow.children[0];
  const logoLinkCell = logoLinkRow.children[0];
  const contactUsLinkCell = contactUsLinkRow.children[0];
  const contactUsLabelCell = contactUsLabelRow.children[0];

  const navigationMenuRows = remainingRows.filter(
    (row) => row.children.length === 3 && row.querySelector('div:nth-child(3) ul'),
  );
  const languageItemRows = remainingRows.filter(
    (row) => row.children.length === 2 && row.querySelector('div:nth-child(1)') && row.querySelector('div:nth-child(2) a'),
  );

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cmp-header-wrapper', 'layout-container', 'transparent-header');

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation', 'header-nav-css-from-wrapper');

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('cmp-navigation-wrapper');
  navigationWrapper.setAttribute('role', 'banner');
  navigationWrapper.setAttribute('aria-label', 'navigation.header.aria.label');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('cmp-navigation-wrapper__logo');

  const logoLink = document.createElement('a');
  const logoHref = logoLinkCell?.querySelector('a')?.href;
  if (logoHref) {
    logoLink.href = logoHref;
  } else {
    logoLink.href = '/'; // Default to homepage if no link
  }
  logoLink.setAttribute('target', '_self');
  logoLink.setAttribute('aria-label', 'Qiddiya - Go to homepage');

  const logoIcon = document.createElement('span');
  logoIcon.classList.add('qd-icon', 'qd-icon--logo', 'qd-logo');
  logoIcon.innerHTML = `<span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span><span class="path25"></span>`;

  logoLink.append(logoIcon);

  const logoPicture = logoCell?.querySelector('picture');
  if (logoPicture) {
    const optimizedPic = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(logoPicture.querySelector('img'), optimizedPic.querySelector('img'));
    logoLink.prepend(optimizedPic);
  }
  moveInstrumentation(logoRow, logoWrapper); // Move instrumentation for the logo row
  logoWrapper.append(logoLink);

  const contactUsCtaWrapper = document.createElement('div');
  contactUsCtaWrapper.classList.add('cmp-navigation-wrapper__contactUs-cta');

  const contactUsLink = document.createElement('a');
  contactUsLink.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
  const contactHref = contactUsLinkCell?.querySelector('a')?.href;
  if (contactHref) {
    contactUsLink.href = contactHref;
  } else {
    contactUsLink.href = '/contact/'; // Default if no link
  }
  contactUsLink.setAttribute('target', '_self');
  contactUsLink.setAttribute('aria-label', 'Contact Us'); // Corrected hardcoded value

  const ctaIcon = document.createElement('span');
  ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  ctaIcon.setAttribute('aria-hidden', 'true');
  contactUsLink.append(ctaIcon);

  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('cta__label');
  ctaLabel.textContent = contactUsLabelCell?.textContent.trim() || 'Contact Us';
  contactUsLink.append(ctaLabel);
  moveInstrumentation(contactUsLinkRow, contactUsLink); // Move instrumentation for the link row
  moveInstrumentation(contactUsLabelRow, ctaLabel); // Move instrumentation for the label row

  contactUsCtaWrapper.append(contactUsLink);

  const navigationToggle = document.createElement('div');
  navigationToggle.classList.add('cmp-navigation-wrapper__icon');
  navigationToggle.id = 'navigation-toggle';

  const hamburgerEllipse = document.createElement('div');
  hamburgerEllipse.classList.add('hamburger-ellipse');
  hamburgerEllipse.setAttribute('tabindex', '0');

  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('hamburger-icon', 'qd-icon', 'qd-icon--hamburger');
  hamburgerEllipse.append(hamburgerIcon);

  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon', 'qd-icon', 'qd-icon--cancel');
  hamburgerEllipse.append(closeIcon);
  navigationToggle.append(hamburgerEllipse);
  contactUsCtaWrapper.append(navigationToggle);

  logoWrapper.append(contactUsCtaWrapper);
  navigationWrapper.append(logoWrapper);

  // Desktop Navigation
  const desktopNavbar = document.createElement('nav');
  desktopNavbar.classList.add('cmp-navigation-wrapper__navbar');
  desktopNavbar.id = 'navbar-desktop';
  desktopNavbar.setAttribute('role', 'navigation');
  desktopNavbar.setAttribute('aria-label', 'navigation.main.aria.label');

  const desktopNavList = document.createElement('ul');
  desktopNavList.classList.add('cmp-navigation-wrapper__navbar-list');

  navigationMenuRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema

    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    } else {
      link.href = 'javascript:void(0)';
    }
    link.textContent = labelCell?.textContent.trim() || '';
    link.setAttribute('target', '_self');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation for the hierarchy tree
      transformNestedLists(subList, false);
      li.append(link);
      li.append(subList);
    } else {
      li.append(link);
      li.classList.add('cmp-navigation-wrapper__navbar-menu');
      link.classList.add('cmp-navigation-wrapper__navbar-menulink');
    }
    moveInstrumentation(row, li);
    desktopNavList.append(li);
  });

  desktopNavbar.append(desktopNavList);

  const desktopContactUsCta = document.createElement('a');
  desktopContactUsCta.classList.add('cta', 'cta__', 'cmp-navigation--content__cta');
  const desktopContactHref = contactUsLinkCell?.querySelector('a')?.href;
  if (desktopContactHref) {
    desktopContactUsCta.href = desktopContactHref;
  } else {
    desktopContactUsCta.href = '/contact/'; // Default if no link
  }
  desktopContactUsCta.setAttribute('target', '_self');
  desktopContactUsCta.setAttribute('aria-label', 'Contact Us'); // Corrected hardcoded value

  const desktopCtaIcon = document.createElement('span');
  desktopCtaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  desktopCtaIcon.setAttribute('aria-hidden', 'true');
  desktopContactUsCta.append(desktopCtaIcon);

  const desktopCtaLabel = document.createElement('span');
  desktopCtaLabel.classList.add('cta__label');
  desktopCtaLabel.textContent = contactUsLabelCell?.textContent.trim() || 'Contact Us';
  desktopContactUsCta.append(desktopCtaLabel);
  desktopNavbar.append(desktopContactUsCta);

  const desktopLanguageSelector = document.createElement('div');
  desktopLanguageSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  desktopLanguageSelector.style.visibility = 'visible';

  const desktopLangList = document.createElement('ul');
  desktopLangList.classList.add('cmp-language-selector');

  languageItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema

    const li = document.createElement('li');
    const link = document.createElement('a');
    link.classList.add('cmp-language-selector__link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    } else {
      link.href = '#';
    }
    link.textContent = labelCell?.textContent.trim() || '';
    link.setAttribute('aria-label', link.textContent);
    link.setAttribute('data-lang', link.textContent.toLowerCase().substring(0, 2)); // Simple lang code
    li.append(link);
    moveInstrumentation(row, li);
    desktopLangList.append(li);
  });
  desktopLanguageSelector.append(desktopLangList);
  desktopNavbar.append(desktopLanguageSelector);
  navigationWrapper.append(desktopNavbar);

  // Mobile Navigation
  const mobileNavbar = document.createElement('nav');
  mobileNavbar.classList.add('cmp-navigation-wrapper__mobilenavbar');
  mobileNavbar.id = 'navbar-mobile';
  mobileNavbar.setAttribute('role', 'navigation');
  mobileNavbar.setAttribute('aria-label', 'navigation.main.aria.label');

  const mobileNavList = document.createElement('ul');
  mobileNavList.classList.add('cmp-navigation-wrapper__mobilenavbar-list');

  navigationMenuRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema

    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    } else {
      link.href = 'javascript:void(0)';
    }
    link.textContent = labelCell?.textContent.trim() || '';
    link.setAttribute('target', '_self');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation for the hierarchy tree
      transformNestedLists(subList, true);
      li.append(link);
      li.append(subList);
    } else {
      li.append(link);
      li.classList.add('cmp-navigation-wrapper__mobilenavbar-menu', 'border');
      link.classList.add('cmp-navigation-wrapper__mobilenavbar-menulink');
    }
    moveInstrumentation(row, li);
    mobileNavList.append(li);
  });

  mobileNavbar.append(mobileNavList);

  const mobileNavBack = document.createElement('div');
  mobileNavBack.classList.add('cmp-navigation-wrapper__mobilenavbar-back', 'nav-back');

  const backIconWrapper = document.createElement('a');
  backIconWrapper.classList.add('cmp-navigation-wrapper__icon');
  const backIcon = document.createElement('span');
  backIcon.classList.add('back-icon', 'qd-icon', 'qd-icon--cheveron-left');
  backIconWrapper.append(backIcon);
  mobileNavBack.append(backIconWrapper);

  const backLabel = document.createElement('span');
  backLabel.classList.add('cmp-navigation-wrapper__iconlabel');
  backLabel.textContent = 'Back';
  mobileNavBack.append(backLabel);
  mobileNavbar.append(mobileNavBack);

  const mobileLanguageSelector = document.createElement('div');
  mobileLanguageSelector.classList.add('language-selector', 'header-lang-css-from-wrapper');
  mobileLanguageSelector.style.visibility = 'visible';

  const mobileLangList = document.createElement('ul');
  mobileLangList.classList.add('cmp-language-selector');

  languageItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema

    const li = document.createElement('li');
    const link = document.createElement('a');
    link.classList.add('cmp-language-selector__link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    } else {
      link.href = '#';
    }
    link.textContent = labelCell?.textContent.trim() || '';
    link.setAttribute('aria-label', link.textContent);
    link.setAttribute('data-lang', link.textContent.toLowerCase().substring(0, 2)); // Simple lang code
    li.append(link);
    moveInstrumentation(row, li);
    mobileLangList.append(li);
  });
  mobileLanguageSelector.append(mobileLangList);
  mobileNavbar.append(mobileLanguageSelector);
  navigationWrapper.append(mobileNavbar);

  navigationDiv.append(navigationWrapper);
  headerWrapper.append(navigationDiv);

  block.replaceChildren(headerWrapper);

  // Event listeners for mobile navigation
  const hamburger = block.querySelector('.hamburger-ellipse');
  const mobileNav = block.querySelector('#navbar-mobile');
  const desktopNav = block.querySelector('#navbar-desktop');
  const navigationToggleBtn = block.querySelector('#navigation-toggle');
  const backButton = block.querySelector('.cmp-navigation-wrapper__mobilenavbar-back');

  if (hamburger && mobileNav && desktopNav && navigationToggleBtn && backButton) {
    hamburger.addEventListener('click', () => {
      navigationToggleBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
      desktopNav.classList.toggle('active');
      document.body.classList.toggle('disable-scroll');
    });

    backButton.addEventListener('click', () => {
      const activeSubmenu = mobileNav.querySelector('.cmp-navigation-wrapper__mobilenavbar-submenu.active');
      if (activeSubmenu) {
        activeSubmenu.classList.remove('active');
        activeSubmenu.closest('.cmp-navigation-wrapper__mobilenavbar-list').classList.remove('sub-menu-open');
      } else {
        navigationToggleBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        desktopNav.classList.remove('active');
        document.body.classList.remove('disable-scroll');
      }
    });

    // Close mobile nav on resize if open
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && mobileNav.classList.contains('active')) {
        navigationToggleBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        desktopNav.classList.remove('active');
        document.body.classList.remove('disable-scroll');
        mobileNav.querySelectorAll('.cmp-navigation-wrapper__mobilenavbar-submenu.active').forEach((submenu) => {
          submenu.classList.remove('active');
        });
        mobileNav.querySelector('.cmp-navigation-wrapper__mobilenavbar-list').classList.remove('sub-menu-open');
      }
    });
  }

  // Handle header scroll behavior
  const header = block.closest('.cmp-experiencefragment--header');
  if (header) {
    let lastScrollY = window.scrollY;
    const scrollThreshold = 50; // Pixels to scroll before hiding/showing header

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
        // Scrolling down
        header.classList.add('nav-up');
        header.classList.remove('nav-down');
      } else if (currentScrollY < lastScrollY && currentScrollY < (lastScrollY - scrollThreshold)) {
        // Scrolling up
        header.classList.add('nav-down');
        header.classList.remove('nav-up');
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}
