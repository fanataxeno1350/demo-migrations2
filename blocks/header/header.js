import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
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
    }
  });
}

export default async function decorate(block) {
  const allRows = [...block.children];

  // Root fields (fixed positions)
  const mainLogoRow = allRows[0];
  const mainLogoLinkRow = allRows[1];
  const year80LogoRow = allRows[2];
  const year80LogoLinkRow = allRows[3];

  // Item rows (variable positions, identified by cell count)
  // navigation-item: 4 cells (label, link, megaMenuContent, hierarchy-tree)
  const navigationItems = allRows.filter((row) => row.children.length === 4 && row.querySelector('ul'));
  // press-release-item: 4 cells (pressReleaseText, pressReleaseLink, pressReleaseDate, pressReleaseTag)
  // Differentiate from navigation-item by checking for specific content or absence of <ul>
  const pressReleaseItems = allRows.filter((row) => row.children.length === 4 && !row.querySelector('ul') && row.querySelector('p'));
  // contact-link-item: 2 cells (label, link)
  const contactLinkItems = allRows.filter((row) => row.children.length === 2);

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // nav-up is a scroll-state class, do not add initially

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Main Logo
  const mainLogoDiv = document.createElement('div');
  mainLogoDiv.classList.add('logo');
  const mainLogoLink = document.createElement('a');
  const mainLogoAnchor = mainLogoLinkRow.querySelector('a');
  if (mainLogoAnchor) {
    mainLogoLink.href = mainLogoAnchor.href;
  }
  const mainLogoPicture = mainLogoRow.querySelector('picture');
  if (mainLogoPicture) {
    const img = mainLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    mainLogoLink.append(optimizedPic);
  }
  moveInstrumentation(mainLogoRow, mainLogoLink);
  moveInstrumentation(mainLogoLinkRow, mainLogoLink);
  mainLogoDiv.append(mainLogoLink);
  wrapDiv.append(mainLogoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrapDiv.append(nav);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.append(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    leftDiv.innerHTML = megaMenuContentCell.innerHTML; // richtext
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    const hierarchyUl = hierarchyTreeCell.querySelector('ul'); // richtext hierarchy-tree
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
    }
    centerDiv.append(subNavWrap);
    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Press Release Items (within Newsroom mega menu)
  if (pressReleaseItems.length > 0) {
    const newsroomLi = navUl.querySelector('a[href*="newsroom"]')?.closest('li');
    if (newsroomLi) {
      const newsroomLeftDiv = newsroomLi.querySelector('.left-div'); // Use existing left-div
      if (newsroomLeftDiv) {
        const latestPressReleaseDiv = document.createElement('div');
        latestPressReleaseDiv.classList.add('latest-two-press-release');

        pressReleaseItems.forEach((row) => {
          const [pressReleaseTextCell, pressReleaseLinkCell, pressReleaseDateCell, pressReleaseTagCell] = [...row.children];

          const slideDiv = document.createElement('div');
          slideDiv.classList.add('slides');
          const slideWrap = document.createElement('div');
          slideWrap.classList.add('wrap');
          slideDiv.append(slideWrap);
          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          slideWrap.append(contentDiv);
          const descDiv = document.createElement('div');
          descDiv.classList.add('desc');
          descDiv.innerHTML = pressReleaseTextCell.innerHTML; // richtext
          contentDiv.append(descDiv);

          const dateDiv = document.createElement('div');
          dateDiv.classList.add('date');
          const dateEm = document.createElement('em');
          dateEm.textContent = pressReleaseDateCell.textContent.trim();
          dateDiv.append(dateEm);
          const tagEm = document.createElement('em');
          tagEm.textContent = pressReleaseTagCell.textContent.trim();
          dateDiv.append(tagEm);
          descDiv.append(dateDiv);
          latestPressReleaseDiv.append(slideDiv);
          moveInstrumentation(row, slideDiv);
        });
        newsroomLeftDiv.append(latestPressReleaseDiv);
      }
    }
  }

  // Contact Links
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavMobileUl = document.createElement('ul');
  iconNavMobile.append(iconNavMobileUl);

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const iconNavDesktopUl = document.createElement('ul');
  iconNavDesktop.append(iconNavDesktopUl);

  contactLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const linkHref = linkCell.querySelector('a')?.href;
    const linkText = labelCell.textContent.trim();

    // Mobile contact link
    const mobileLi = document.createElement('li');
    mobileLi.classList.add('mail');
    const mobileLink = document.createElement('a');
    mobileLink.href = linkHref || '#';
    mobileLink.textContent = linkText;
    mobileLi.append(mobileLink);
    iconNavMobileUl.append(mobileLi);

    // Desktop contact link
    const desktopLi = document.createElement('li');
    desktopLi.classList.add('mail');
    const desktopLink = document.createElement('a');
    desktopLink.href = linkHref || '#';
    desktopLink.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
    </svg>`;
    desktopLi.append(desktopLink);
    iconNavDesktopUl.append(desktopLi);
    moveInstrumentation(row, desktopLi); // Move instrumentation for one of the generated elements
  });

  navUl.append(iconNavMobile);
  navUl.append(iconNavDesktop);

  // Search functionality (replicated from original HTML)
  const searchLi = document.createElement('li');
  searchLi.classList.add('search');
  const searchAnchor = document.createElement('a');
  searchAnchor.href = '#';
  searchAnchor.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
    </svg>
    <span> Search</span>
  `;
  searchLi.append(searchAnchor);

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('wrap');
  searchScreenWrap.append(searchWrapInner);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search';
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchInputWrap.innerHTML = `
    <div class="search-icon">
      <svg viewBox="0 0 21 21" fill="none">
        <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
      </svg>
    </div>
    <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off"/>
    <button class="submit-button">
      <div class="label"> Submit </div>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
      </svg>
    </button>
  `;
  searchForm.append(searchInputWrap);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none'; // Initial state from original HTML
  searchResultBox.innerHTML = `
    <div class="swiper scrollSwiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"></div>
      </div>
    </div>
    <div class="swiper-scrollbar"></div>
  `;
  searchForm.append(searchResultBox);
  searchWrapInner.append(searchForm);

  const searchSuggestionsWrap1 = document.createElement('div');
  searchSuggestionsWrap1.classList.add('search-suggestions-wrap');
  searchSuggestionsWrap1.innerHTML = `
    <div class="label">Popular Keywords:</div>
    <div class="tokens-wrap">
      <ul>
        <li>Business</li>
        <li>FY 21</li>
        <li>Brands</li>
        <li>XUV700</li>
        <li>Global</li>
        <li>Nanhi Kali</li>
      </ul>
    </div>
  `;
  searchWrapInner.append(searchSuggestionsWrap1);

  const searchSuggestionsWrap2 = document.createElement('div');
  searchSuggestionsWrap2.classList.add('search-suggestions-wrap');
  searchSuggestionsWrap2.innerHTML = `
    <div class="label">Recommended for you:</div>
    <div class="tokens-wrap">
      <ul>
        <li>Annual Report 2021 - 2022</li>
        <li>Leadership Announcement</li>
        <li>Latest Press Release</li>
        <li>Brand Guidelines</li>
      </ul>
    </div>
  `;
  searchWrapInner.append(searchSuggestionsWrap2);
  searchLi.append(searchScreenWrap);

  iconNavMobileUl.append(searchLi); // Append original for mobile
  iconNavDesktopUl.append(searchLi.cloneNode(true)); // Clone for desktop

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const year80LogoAnchor = year80LogoLinkRow.querySelector('a');
  if (year80LogoAnchor) {
    year80LogoLink.href = year80LogoAnchor.href;
  }
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(year80LogoRow, year80LogoLink);
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrapDiv.append(year80LogoDiv);

  // Event Listeners for interactive elements
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburgerDiv.classList.toggle('close');
    document.body.classList.toggle('disable-scroll');
  });

  // Toggle search screen
  const searchToggleElements = header.querySelectorAll('.search > a');
  const searchScreen = header.querySelector('.search-screen-wrap');
  searchToggleElements.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreen.classList.toggle('active');
      document.body.classList.toggle('disable-scroll');
    });
  });

  // Close search screen by clicking outside
  searchScreen.addEventListener('click', (e) => {
    if (e.target === searchScreen) {
      searchScreen.classList.remove('active');
      document.body.classList.remove('disable-scroll');
    }
  });

  // Mega menu hover/click behavior
  navUl.querySelectorAll('.has-child').forEach((li) => {
    const megaMenu = li.querySelector('.mega-menu');
    if (megaMenu) {
      // Desktop hover
      li.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 992) { // Desktop breakpoint
          megaMenu.classList.add('active');
          li.classList.add('active');
          document.body.classList.add('disable-scroll');
        }
      });
      li.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 992) {
          megaMenu.classList.remove('active');
          li.classList.remove('active');
          document.body.classList.remove('disable-scroll');
        }
      });

      // Mobile click
      const trigger = li.querySelector(':scope > a');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          if (window.innerWidth < 992) { // Mobile breakpoint
            e.preventDefault();
            li.classList.toggle('active');
            megaMenu.classList.toggle('active');
          }
        });
      }
    }
  });

  // Load Swiper for search results
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  const swiperEl = searchResultBox.querySelector('.scrollSwiper');
  if (swiperEl) {
    // eslint-disable-next-line no-undef
    new Swiper(swiperEl, {
      slidesPerView: 'auto',
      direction: 'vertical',
      freeMode: true,
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      mousewheel: true,
    });
  }

  // Replace block content
  block.replaceChildren(header);
}
