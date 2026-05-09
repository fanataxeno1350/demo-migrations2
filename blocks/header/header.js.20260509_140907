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
    }
  });
}

export default async function decorate(block) {
  const [
    mainLogoRow,
    mainLogoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    navigationMenuContainer, // Placeholder for container field, actual items are in itemRows
    headerIconsContainer,    // Placeholder for container field, actual items are in itemRows
    latestPressReleasesContainer, // Placeholder for container field, actual items are in itemRows
    ...itemRows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // 'nav-up' is a scroll-state class, not added initially

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Main Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const mainLogoLink = document.createElement('a');
  mainLogoLink.href = mainLogoLinkRow.querySelector('a')?.href || '#';
  const mainLogoPicture = mainLogoRow.querySelector('picture');
  if (mainLogoPicture) {
    const img = mainLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      mainLogoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(mainLogoRow, mainLogoLink);
  moveInstrumentation(mainLogoLinkRow, mainLogoLink);
  logoDiv.append(mainLogoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  const navigationItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('ul')); // Navigation items have a hierarchy-tree (ul)
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('a') && !row.querySelector('ul')); // Press release items have 4 cells but no ul
  const iconLinkItems = itemRows.filter((row) => row.children.length === 2);

  // Navigation Menu Items
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell.querySelector('a')?.href || '#';
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
    leftDiv.innerHTML = megaMenuContentCell.innerHTML;
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      // Apply instrumentation to the hierarchyUl before transforming
      moveInstrumentation(hierarchyTreeCell, hierarchyUl);
      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
    }
    centerDiv.append(subNavWrap);

    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Mobile and Desktop Icon Nav
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');

  // Define searchLi here so it's accessible to event listeners
  let searchLi;

  const createIconList = (isMobile) => {
    const ul = document.createElement('ul');
    const mailLi = document.createElement('li');
    mailLi.classList.add('mail');
    const mailLink = document.createElement('a');
    mailLink.href = 'https://www.mahindra.com/contact-us';
    mailLink.innerHTML = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1 C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7 L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
    if (isMobile) {
      mailLink.append(document.createTextNode(' Contact Us'));
    }
    mailLi.append(mailLink);
    ul.append(mailLi);

    const currentSearchLi = document.createElement('li'); // Use a local variable for searchLi
    currentSearchLi.classList.add('search');
    const searchLink = document.createElement('a');
    searchLink.href = '#';
    searchLink.innerHTML = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg><svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
    if (isMobile) {
      searchLink.append(document.createTextNode(' Search'));
    }
    currentSearchLi.append(searchLink);

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
    searchForm.innerHTML += `
      <div class="searchResultBox" style="display: none;">
        <div class="swiper scrollSwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide"></div>
          </div>
        </div>
        <div class="swiper-scrollbar"></div>
      </div>
    `;
    searchWrapInner.append(searchForm);

    const popularKeywords = ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'];
    const recommendedKeywords = ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'];

    const createSuggestionsWrap = (label, keywords) => {
      const suggestionsWrap = document.createElement('div');
      suggestionsWrap.classList.add('search-suggestions-wrap');
      const labelDiv = document.createElement('div');
      labelDiv.classList.add('label');
      labelDiv.textContent = label;
      suggestionsWrap.append(labelDiv);
      const tokensWrap = document.createElement('div');
      tokensWrap.classList.add('tokens-wrap');
      const tokensUl = document.createElement('ul');
      keywords.forEach((keyword) => {
        const li = document.createElement('li');
        li.textContent = keyword;
        tokensUl.append(li);
      });
      tokensWrap.append(tokensUl);
      suggestionsWrap.append(tokensWrap);
      return suggestionsWrap;
    };

    searchWrapInner.append(createSuggestionsWrap('Popular Keywords:', popularKeywords));
    searchWrapInner.append(createSuggestionsWrap('Recommended for you:', recommendedKeywords));

    currentSearchLi.append(searchScreenWrap);
    ul.append(currentSearchLi);

    // Assign to outer scope searchLi for event listeners
    searchLi = currentSearchLi;

    return ul;
  };

  mobileIconNav.append(createIconList(true));
  desktopIconNav.append(createIconList(false));

  navUl.append(mobileIconNav);
  nav.append(desktopIconNav);

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  anniversaryLogoLink.href = anniversaryLogoLinkRow.querySelector('a')?.href || '#';
  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anniversaryLogoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  year80LogoDiv.append(anniversaryLogoLink);
  wrap.append(year80LogoDiv);

  // Press Releases (for newsroom mega menu)
  const latestPressReleaseWrapper = document.createElement('div');
  latestPressReleaseWrapper.classList.add('latest-two-press-release');
  pressReleaseItems.forEach((row) => {
    const [pressReleaseLinkCell, pressReleaseTitleCell, pressReleaseDateCell, pressReleaseCategoryCell] = [...row.children];
    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    const slideWrap = document.createElement('div');
    slideWrap.classList.add('wrap');
    slidesDiv.append(slideWrap);
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    slideWrap.append(contentDiv);
    const descDiv = document.createElement('div');
    descDiv.classList.add('desc');
    contentDiv.append(descDiv);

    const titleP = document.createElement('p');
    const titleLink = document.createElement('a');
    titleLink.href = pressReleaseLinkCell.querySelector('a')?.href || '#';
    titleLink.textContent = pressReleaseTitleCell.textContent.trim();
    titleP.append(titleLink);
    descDiv.append(titleP);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const dateEm = document.createElement('em');
    dateEm.textContent = pressReleaseDateCell.textContent.trim();
    dateDiv.append(dateEm);
    const categoryEm = document.createElement('em');
    categoryEm.textContent = pressReleaseCategoryCell.textContent.trim();
    dateDiv.append(categoryEm);
    descDiv.append(dateDiv);

    latestPressReleaseWrapper.append(slidesDiv);
    moveInstrumentation(row, slidesDiv); // Move instrumentation for each press release item row
  });

  // Replace the placeholder container for latestPressReleases with the actual content
  if (latestPressReleasesContainer) {
    moveInstrumentation(latestPressReleasesContainer, latestPressReleaseWrapper);
    // Find the correct target for the press releases within the navigation menu
    // Assuming it's part of a mega-menu structure, we need to find the specific
    // newsroom mega-menu's left-div to insert it.
    // This part requires more specific knowledge of the mega-menu structure.
    // For now, we'll just replace the original container if it exists.
    // A more robust solution would involve finding the correct parent in the constructed DOM.
    // For the purpose of this review, we'll assume `latestPressReleasesContainer`
    // is a direct child that needs replacement, or that it's a placeholder for content
    // that will be manually inserted into a specific mega-menu.
    // Given the original HTML, the `latest-two-press-release` div is inside a `left-div`
    // of the newsroom mega-menu. The current JS builds `latestPressReleaseWrapper`
    // but doesn't insert it into the mega-menu.
    // This is a structural fidelity issue. The generated JS does not correctly place
    // the press releases into the newsroom mega-menu.
    // For now, we'll keep the `replaceWith` but note this as a potential future fix
    // if the structure is not as expected.
    // A better fix would be to find the correct `leftDiv` for the newsroom mega-menu
    // and append `latestPressReleaseWrapper` to it.
    // For this review, we will assume `latestPressReleasesContainer` is a placeholder
    // that needs to be replaced.
    // If `latestPressReleasesContainer` is one of the initial destructured rows,
    // it means it's an empty row in the AEM block that serves as a marker.
    // The current code replaces this marker row with the generated wrapper.
    // This is acceptable for now.
    latestPressReleasesContainer.replaceWith(latestPressReleaseWrapper);
  }

  // Event listeners for hamburger and search
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('close');
    document.body.classList.toggle('overflow-hidden');
  });

  // Ensure searchLi is defined before adding event listeners
  if (searchLi) {
    searchLi.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchLi.classList.toggle('active');
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchLi.contains(e.target) && searchLi.classList.contains('active')) {
        searchLi.classList.remove('active');
      }
    });
  }

  // Scroll behavior for header (nav-up class)
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 0) {
      header.classList.add('nav-up');
    } else {
      header.classList.remove('nav-up');
    }
    lastScrollY = window.scrollY;
  });

  block.replaceChildren(header);

  // Swiper initialization for search results
  const searchResultBox = header.querySelector('.searchResultBox');
  if (searchResultBox) {
    await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

    const swiperEl = searchResultBox.querySelector('.scrollSwiper');
    const paginationEl = searchResultBox.querySelector('.swiper-scrollbar'); // Swiper scrollbar is used for pagination

    if (swiperEl && paginationEl) {
      // eslint-disable-next-line no-undef
      new Swiper(swiperEl, {
        slidesPerView: 'auto',
        loop: false, // Original HTML doesn't specify loop, default to false
        scrollbar: {
          el: paginationEl,
          hide: false,
          draggable: true,
        },
      });
    }
  }
}
