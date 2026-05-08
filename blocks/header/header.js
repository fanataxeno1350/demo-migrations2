import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
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

      // Handle inner sub-children
      nested.querySelectorAll('li').forEach((innerLi) => {
        const innerNested = innerLi.querySelector(':scope > ul');
        const innerAnchor = innerLi.querySelector(':scope > a');

        if (!innerAnchor) {
          const innerTextNode = [...innerLi.childNodes].find(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
          );
          if (innerTextNode) {
            const span = document.createElement('span');
            span.textContent = innerTextNode.textContent.trim();
            innerTextNode.remove();
            innerLi.prepend(span);
          }
        }

        if (innerNested) {
          innerNested.remove();
          const innerSubWrap = document.createElement('div');
          innerSubWrap.classList.add('has-inner-sub-child');
          innerSubWrap.append(innerNested);
          innerLi.append(innerSubWrap);

          const innerTrigger = innerLi.querySelector(':scope > a, :scope > span');
          if (innerTrigger) {
            innerTrigger.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              innerLi.classList.toggle('active-child');
              innerSubWrap.classList.toggle('active-child');
            });
          }
        }
      });
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  // Root row detection - reordered for TDZ
  const logoRow = children.find((row) => row.querySelector('picture') && row.children.length === 1);
  const logoLinkRow = children.find(
    (row) => row.querySelector('a') && row.children.length === 1 && children.indexOf(row) === children.indexOf(logoRow) + 1,
  );
  const yearLogoRow = children.find(
    (row) => row.querySelector('picture') && row.children.length === 1 && children.indexOf(row) === children.indexOf(logoLinkRow) + 1,
  );
  const yearLogoLinkRow = children.find(
    (row) => row.querySelector('a') && row.children.length === 1 && children.indexOf(row) === children.indexOf(yearLogoRow) + 1,
  );

  // Filter out the identified single-cell rows from the main children array
  const remainingRows = children.filter(
    (row) => row !== logoRow && row !== logoLinkRow && row !== yearLogoRow && row !== yearLogoLinkRow,
  );

  // Now filter the remaining rows for item types
  const navigationRows = remainingRows.filter((row) => row.children.length === 4);
  const pressReleaseRows = remainingRows.filter((row) => row.children.length === 4 && !row.querySelector('picture') && !row.querySelector('ul'));
  const iconNavRows = remainingRows.filter((row) => row.children.length === 2);

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // 'nav-up' is a scroll-state class, do not add initially
  header.dataset.once = 'header-hover';

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  if (logoRow && logoLinkRow) {
    const logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    const logoLink = document.createElement('a');
    logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
    moveInstrumentation(logoRow, logoLink);
    moveInstrumentation(logoLinkRow, logoLink);
    logoDiv.append(logoLink);
    wrap.append(logoDiv);
  }

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.dataset.once = 'hamburger-click nav-close-search';
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.dataset.once = 'initSubChildToggle';
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  navigationRows.forEach((row) => {
    const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.dataset.once = 'nav-close-search';

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);

    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
    arrowSvg.setAttribute('fill', '#000000');
    arrowSvg.setAttribute('stroke', '#000000');
    arrowSvg.setAttribute('stroke-width', '4.851456000000001');
    arrowSvg.innerHTML = '<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g>';
    const spanArrow = document.createElement('span');
    spanArrow.append(arrowSvg);
    li.append(spanArrow);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    leftDiv.innerHTML = megaMenuContentCell?.innerHTML || '';
    moveInstrumentation(megaMenuContentCell, leftDiv); // Move instrumentation for richtext content
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
      moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Move instrumentation for richtext hierarchy
    }
    centerDiv.append(subNavWrap);

    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);
    li.append(megaMenu);

    moveInstrumentation(row, li);
    navUl.append(li);
  });

  // Newsroom (Press Releases)
  const newsroomLi = navUl.querySelector('li.has-child:has(a[href*="newsroom"])');
  if (newsroomLi) {
    const newsroomMegaMenu = newsroomLi.querySelector('.mega-menu');
    const newsroomLeftDiv = newsroomMegaMenu.querySelector('.left-div');
    newsroomLeftDiv.classList.add('newsroom-left-div');

    const latestPressReleaseDiv = document.createElement('div');
    latestPressReleaseDiv.classList.add('latest-two-press-release');

    pressReleaseRows.forEach((row) => {
      const [pressLinkCell, pressTitleCell, pressDateCell, pressTagCell] = [...row.children];

      const slideDiv = document.createElement('div');
      slideDiv.classList.add('slides');
      const slideWrap = document.createElement('div');
      slideWrap.classList.add('wrap');
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content');
      const descDiv = document.createElement('div');
      descDiv.classList.add('desc');

      const pressLink = document.createElement('a');
      pressLink.href = pressLinkCell?.querySelector('a')?.href || '#';
      pressLink.textContent = pressTitleCell?.textContent.trim() || '';
      const p = document.createElement('p');
      p.append(pressLink);
      descDiv.append(p);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const emDate = document.createElement('em');
      emDate.textContent = pressDateCell?.textContent.trim() || '';
      const emTag = document.createElement('em');
      emTag.textContent = pressTagCell?.textContent.trim() || '';
      dateDiv.append(emDate, emTag);
      descDiv.append(dateDiv);

      contentDiv.append(descDiv);
      slideWrap.append(contentDiv);
      slideDiv.append(slideWrap);

      moveInstrumentation(row, slideDiv);
      latestPressReleaseDiv.append(slideDiv);
    });
    newsroomLeftDiv.append(latestPressReleaseDiv);
  }

  // Icon Nav (Mobile)
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavUlMobile = document.createElement('ul');
  iconNavMobile.append(iconNavUlMobile);
  navUl.append(iconNavMobile);

  // Contact Us (Mobile)
  const contactUsLiMobile = document.createElement('li');
  contactUsLiMobile.classList.add('mail');
  const contactUsLinkMobile = document.createElement('a');
  contactUsLinkMobile.href = 'https://www.mahindra.com/contact-us';
  contactUsLinkMobile.textContent = 'Contact Us';
  contactUsLiMobile.append(contactUsLinkMobile);
  iconNavUlMobile.append(contactUsLiMobile);

  // Search (Mobile)
  const searchLiMobile = createSearchElement();
  searchLiMobile.classList.add('search');
  iconNavUlMobile.append(searchLiMobile);

  // Icon Nav (Desktop)
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const iconNavUlDesktop = document.createElement('ul');
  iconNavDesktop.append(iconNavUlDesktop);
  nav.append(iconNavDesktop);

  // Contact Us (Desktop)
  const contactUsLiDesktop = document.createElement('li');
  contactUsLiDesktop.classList.add('mail');
  const contactUsLinkDesktop = document.createElement('a');
  contactUsLinkDesktop.href = 'https://www.mahindra.com/contact-us';
  contactUsLinkDesktop.innerHTML = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
  contactUsLiDesktop.append(contactUsLinkDesktop);
  iconNavUlDesktop.append(contactUsLiDesktop);

  // Search (Desktop)
  const searchLiDesktop = createSearchElement();
  searchLiDesktop.classList.add('search');
  iconNavUlDesktop.append(searchLiDesktop);

  // 80th Year Logo
  if (yearLogoRow && yearLogoLinkRow) {
    const yearLogoDiv = document.createElement('div');
    yearLogoDiv.classList.add('logo', 'year-80-logo');
    const yearLogoLink = document.createElement('a');
    yearLogoLink.href = yearLogoLinkRow.querySelector('a')?.href || '#';
    const yearLogoPicture = yearLogoRow.querySelector('picture');
    if (yearLogoPicture) {
      const img = yearLogoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      yearLogoLink.append(optimizedPic);
    }
    moveInstrumentation(yearLogoRow, yearLogoLink);
    moveInstrumentation(yearLogoLinkRow, yearLogoLink);
    yearLogoDiv.append(yearLogoLink);
    wrap.append(yearLogoDiv);
  }

  block.replaceChildren(header);

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  });

  // Search toggle logic
  const searchToggles = block.querySelectorAll('.search');
  searchToggles.forEach((searchToggle) => {
    const searchLink = searchToggle.querySelector('a');
    const searchScreenWrap = searchToggle.querySelector('.search-screen-wrap');
    if (searchLink && searchScreenWrap) {
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        searchScreenWrap.classList.toggle('active');
        searchToggle.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden');
      });

      searchScreenWrap.addEventListener('click', (e) => {
        if (e.target === searchScreenWrap) {
          searchScreenWrap.classList.remove('active');
          searchToggle.classList.remove('active');
          document.body.classList.remove('overflow-hidden');
        }
      });
    }
  });

  // Scroll behavior for header (nav-up/nav-down)
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > header.offsetHeight) {
      // Scrolling down
      header.classList.add('nav-up');
      header.classList.remove('nav-down');
    } else if (window.scrollY < lastScrollY) {
      // Scrolling up
      header.classList.remove('nav-up');
      header.classList.add('nav-down');
    }
    lastScrollY = window.scrollY;
  });

  // Initialize Swiper for search results
  const swiperElements = block.querySelectorAll('.scrollSwiper');
  if (swiperElements.length > 0) {
    await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

    swiperElements.forEach((swiperEl) => {
      // eslint-disable-next-line no-undef
      new Swiper(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        loop: false,
        scrollbar: {
          el: swiperEl.nextElementSibling, // Assuming swiper-scrollbar is the next sibling
          hide: true,
        },
      });
    });
  }
}

function createSearchElement() {
  const searchLi = document.createElement('li');
  searchLi.dataset.once = 'search-toggle search-stop-propagation';

  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.dataset.once = 'search-stop-propagation';

  const lensSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lensSvg.setAttribute('viewBox', '0 0 21 21');
  lensSvg.setAttribute('fill', 'none');
  lensSvg.classList.add('lens');
  lensSvg.dataset.once = 'search-stop-propagation';
  lensSvg.innerHTML = '<path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>';
  searchLink.append(lensSvg);

  const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeSvg.setAttribute('viewBox', '0 0 50 50');
  closeSvg.classList.add('close');
  closeSvg.dataset.once = 'search-stop-propagation';
  closeSvg.innerHTML = '<path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>';
  searchLink.append(closeSvg);

  const searchSpan = document.createElement('span');
  searchSpan.textContent = ' Search';
  searchSpan.dataset.once = 'search-stop-propagation';
  searchLink.append(searchSpan);
  searchLi.append(searchLink);

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.dataset.once = 'search-stop-propagation';
  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('wrap');
  searchWrapInner.dataset.once = 'search-stop-propagation';
  searchScreenWrap.append(searchWrapInner);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search';
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.dataset.drupalFormFields = 'edit-keys';
  searchForm.dataset.once = 'search-stop-propagation';
  searchWrapInner.append(searchForm);

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchInputWrap.dataset.once = 'search-stop-propagation';
  searchForm.append(searchInputWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.dataset.once = 'search-stop-propagation';
  const searchIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchIconSvg.setAttribute('viewBox', '0 0 21 21');
  searchIconSvg.setAttribute('fill', 'none');
  searchIconSvg.dataset.once = 'search-stop-propagation';
  searchIconSvg.innerHTML = '<path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>';
  searchIconDiv.append(searchIconSvg);
  searchInputWrap.append(searchIconDiv);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.setAttribute('required', '');
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchInput.dataset.once = 'search-stop-propagation';
  searchInputWrap.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.dataset.once = 'search-stop-propagation';
  searchInputWrap.append(submitButton);

  const submitLabel = document.createElement('div');
  submitLabel.classList.add('label');
  submitLabel.textContent = ' Submit ';
  submitLabel.dataset.once = 'search-stop-propagation';
  submitButton.append(submitLabel);

  const submitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  submitSvg.setAttribute('width', '12');
  submitSvg.setAttribute('height', '8');
  submitSvg.setAttribute('viewBox', '0 0 12 8');
  submitSvg.setAttribute('fill', 'none');
  submitSvg.dataset.once = 'search-stop-propagation';
  submitSvg.innerHTML = '<path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>';
  submitButton.append(submitSvg);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.dataset.once = 'search-stop-propagation';
  searchForm.append(searchResultBox);

  const swiperDiv = document.createElement('div');
  swiperDiv.classList.add('swiper', 'scrollSwiper');
  swiperDiv.dataset.once = 'search-stop-propagation';
  searchResultBox.append(swiperDiv);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.dataset.once = 'search-stop-propagation';
  swiperDiv.append(swiperWrapper);

  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');
  swiperSlide.dataset.once = 'search-stop-propagation';
  swiperWrapper.append(swiperSlide);

  const swiperScrollbar = document.createElement('div');
  swiperScrollbar.classList.add('swiper-scrollbar');
  swiperScrollbar.dataset.once = 'search-stop-propagation';
  searchResultBox.append(swiperScrollbar);

  // Search suggestions - these should come from block content if possible, not hardcoded
  // For now, removing data-once from dynamically created elements as it's not needed
  const popularKeywords = ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'];
  const recommendedKeywords = ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'];

  const createSuggestionWrap = (label, keywords) => {
    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('search-suggestions-wrap');

    const labelDiv = document.createElement('div');
    labelDiv.classList.add('label');
    labelDiv.textContent = label;
    wrapDiv.append(labelDiv);

    const tokensWrap = document.createElement('div');
    tokensWrap.classList.add('tokens-wrap');
    wrapDiv.append(tokensWrap);

    const ul = document.createElement('ul');
    keywords.forEach((keyword) => {
      const li = document.createElement('li');
      li.textContent = keyword;
      ul.append(li);
    });
    tokensWrap.append(ul);
    return wrapDiv;
  };

  searchWrapInner.append(createSuggestionWrap('Popular Keywords:', popularKeywords));
  searchWrapInner.append(createSuggestionWrap('Recommended for you:', recommendedKeywords));

  searchLi.append(searchScreenWrap);
  return searchLi;
}
