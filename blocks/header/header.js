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
    yearLogoRow,
    yearLogoLinkRow,
    ...itemRows
  ] = [...block.children].filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 2);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid');
  header.setAttribute('data-once', 'header-hover');

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
  const mainLogoAnchor = mainLogoLinkRow?.querySelector('a');
  if (mainLogoAnchor) {
    mainLogoLink.href = mainLogoAnchor.href;
  } else {
    mainLogoLink.href = '#';
  }
  const mainLogoPicture = mainLogoRow?.querySelector('picture');
  if (mainLogoPicture) {
    const img = mainLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      mainLogoLink.append(optimizedPic);
      mainLogoLink.querySelector('img').classList.add('hiddenlogo1');
      mainLogoLink.querySelector('img').setAttribute('title', img.alt);
    }
  }
  moveInstrumentation(mainLogoRow, mainLogoLink);
  moveInstrumentation(mainLogoLinkRow, mainLogoLink);
  logoDiv.append(mainLogoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  const ulHamburger = document.createElement('ul');
  [...Array(3)].forEach(() => ulHamburger.append(document.createElement('li')));
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Main Nav
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);
  wrap.append(mainNav);

  // Navigation Menu Items
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell, leftBlockHeadingCell, leftBlockDescCell, leftBlockSubdescCell, leftBlockListCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const linkAnchor = document.createElement('a');
    linkAnchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkAnchor.href = foundLink.href;
    } else {
      linkAnchor.href = '#';
    }
    linkAnchor.textContent = labelCell?.textContent.trim() || '';
    li.append(linkAnchor);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = `<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>`;
    li.append(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    heading.innerHTML = leftBlockHeadingCell?.innerHTML || ''; // Corrected to innerHTML for richtext
    leftDiv.append(heading);

    const desc = document.createElement('p');
    desc.classList.add('left-div-desc');
    desc.textContent = leftBlockDescCell?.textContent.trim() || '';
    leftDiv.append(desc);

    const subDesc = document.createElement('p');
    subDesc.classList.add('left-div-subdesc');
    subDesc.textContent = leftBlockSubdescCell?.textContent.trim() || '';
    leftDiv.append(subDesc);

    const leftBlockList = document.createElement('div');
    leftBlockList.innerHTML = leftBlockListCell?.innerHTML || '';
    if (leftBlockList.innerHTML) {
      leftDiv.append(leftBlockList);
    }
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
    const hierarchyTreeUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyTreeUl) {
      transformNestedLists(hierarchyTreeUl);
      subNavWrap.append(hierarchyTreeUl);
    }
    centerDiv.append(subNavWrap);
    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);
    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Icon Nav (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  // Add Contact Us link (mail icon)
  const mobileMailLi = document.createElement('li');
  mobileMailLi.classList.add('mail');
  const mobileMailLink = document.createElement('a');
  mobileMailLink.href = 'https://www.mahindra.com/contact-us';
  mobileMailLink.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>
                  Contact Us`;
  mobileMailLi.append(mobileMailLink);
  mobileIconUl.append(mobileMailLi);

  // Add Search link
  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  mobileSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const mobileSearchLink = document.createElement('a');
  mobileSearchLink.href = '#';
  mobileSearchLink.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg><svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg><span data-once="search-stop-propagation"> Search</span>`;
  mobileSearchLi.append(mobileSearchLink);
  mobileIconUl.append(mobileSearchLi);
  navUl.append(mobileIconNav); // Append mobile icon nav to main nav ul

  // Icon Nav (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  // Add Contact Us link (mail icon)
  const desktopMailLi = document.createElement('li');
  desktopMailLi.classList.add('mail');
  const desktopMailLink = document.createElement('a');
  desktopMailLink.href = 'https://www.mahindra.com/contact-us';
  desktopMailLink.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>`;
  desktopMailLi.append(desktopMailLink);
  desktopIconUl.append(desktopMailLi);

  // Add Search link
  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  desktopSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const desktopSearchLink = document.createElement('a');
  desktopSearchLink.href = '#';
  desktopSearchLink.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg><svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path></svg>`;
  desktopSearchLi.append(desktopSearchLink);
  desktopIconUl.append(desktopSearchLi);
  mainNav.append(desktopIconNav); // Append desktop icon nav to main nav

  // 80th Year Logo
  const yearLogoDiv = document.createElement('div');
  yearLogoDiv.classList.add('logo', 'year-80-logo');
  const yearLogoLink = document.createElement('a');
  const yearLogoAnchor = yearLogoLinkRow?.querySelector('a');
  if (yearLogoAnchor) {
    yearLogoLink.href = yearLogoAnchor.href;
  } else {
    yearLogoLink.href = '#';
  }
  const yearLogoPicture = yearLogoRow?.querySelector('picture');
  if (yearLogoPicture) {
    const img = yearLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      yearLogoLink.append(optimizedPic);
      yearLogoLink.querySelector('img').classList.add('hiddenlogo1', 'years-80');
      yearLogoLink.querySelector('img').setAttribute('title', img.alt);
    }
  }
  moveInstrumentation(yearLogoRow, yearLogoLink);
  moveInstrumentation(yearLogoLinkRow, yearLogoLink);
  yearLogoDiv.append(yearLogoLink);
  wrap.append(yearLogoDiv);

  // Search Screen Wrap (moved here to be part of the header structure)
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
  const searchWrap = document.createElement('div');
  searchWrap.classList.add('wrap');
  searchWrap.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.append(searchWrap);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search';
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  searchForm.setAttribute('data-once', 'search-stop-propagation');
  searchWrap.append(searchForm);

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
  searchForm.append(searchInputWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
  searchIconDiv.innerHTML = `<svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path></svg>`;
  searchInputWrap.append(searchIconDiv);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.required = true;
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchInput.setAttribute('data-once', 'search-stop-propagation');
  searchInputWrap.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  submitButton.innerHTML = `<div class="label" data-once="search-stop-propagation"> Submit </div><svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path></svg>`;
  searchInputWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.setAttribute('data-once', 'search-stop-propagation');
  searchForm.append(searchResultBox);

  // Swiper elements for search results (simplified, no actual Swiper init here)
  const swiperDiv = document.createElement('div');
  swiperDiv.classList.add('swiper', 'scrollSwiper');
  swiperDiv.setAttribute('data-once', 'search-stop-propagation');
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('data-once', 'search-stop-propagation');
  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');
  swiperSlide.setAttribute('data-once', 'search-stop-propagation');
  swiperWrapper.append(swiperSlide);
  swiperDiv.append(swiperWrapper);
  searchResultBox.append(swiperDiv);

  const swiperScrollbar = document.createElement('div');
  swiperScrollbar.classList.add('swiper-scrollbar');
  swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
  searchResultBox.append(swiperScrollbar);

  // Search suggestions
  const popularKeywordsWrap = document.createElement('div');
  popularKeywordsWrap.classList.add('search-suggestions-wrap');
  popularKeywordsWrap.setAttribute('data-once', 'search-stop-propagation');
  popularKeywordsWrap.innerHTML = `<div class="label" data-once="search-stop-propagation">Popular Keywords:</div><div class="tokens-wrap" data-once="search-stop-propagation"><ul data-once="search-stop-propagation"><li data-once="search-stop-propagation">Business</li><li data-once="search-stop-propagation">FY 21</li><li data-once="search-stop-propagation">Brands</li><li data-once="search-stop-propagation">XUV700</li><li data-once="search-stop-propagation">Global</li><li data-once="search-stop-propagation">Nanhi Kali</li></ul></div>`;
  searchWrap.append(popularKeywordsWrap);

  const recommendedKeywordsWrap = document.createElement('div');
  recommendedKeywordsWrap.classList.add('search-suggestions-wrap');
  recommendedKeywordsWrap.setAttribute('data-once', 'search-stop-propagation');
  recommendedKeywordsWrap.innerHTML = `<div class="label" data-once="search-stop-propagation">Recommended for you:</div><div class="tokens-wrap" data-once="search-stop-propagation"><ul data-once="search-stop-propagation"><li data-once="search-stop-propagation">Annual Report 2021 - 2022</li><li data-once="search-stop-propagation">Leadership Announcement</li><li data-once="search-stop-propagation">Latest Press Release</li><li data-once="search-stop-propagation">Brand Guidelines</li></ul></div>`;
  searchWrap.append(recommendedKeywordsWrap);

  header.append(searchScreenWrap); // Append search screen wrap to header

  block.replaceChildren(header);

  // Search functionality (simplified for EDS)
  const searchToggle = block.querySelector('.search');
  const actualSearchScreenWrap = block.querySelector('.search-screen-wrap'); // Use the newly created one
  const actualSearchInput = block.querySelector('#searchInput');
  const actualSearchForm = block.querySelector('#search-block-form');

  if (searchToggle && actualSearchScreenWrap && actualSearchInput && actualSearchForm) {
    const toggleSearch = (e) => {
      e.preventDefault();
      e.stopPropagation();
      actualSearchScreenWrap.classList.toggle('show');
      block.classList.toggle('search-show');
      if (actualSearchScreenWrap.classList.contains('show')) {
        actualSearchInput.focus();
      }
    };

    searchToggle.addEventListener('click', toggleSearch);
    block.querySelector('.search .close').addEventListener('click', toggleSearch);

    actualSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = actualSearchInput.value;
      if (query) {
        window.location.href = `https://www.mahindra.com/search?key=${encodeURIComponent(query)}`;
      }
    });

    actualSearchScreenWrap.addEventListener('click', (e) => {
      if (e.target === actualSearchScreenWrap) {
        actualSearchScreenWrap.classList.remove('show');
        block.classList.remove('search-show');
      }
    });
  }

  // Hamburger menu toggle
  const hamburgerBtn = block.querySelector('.hamburger');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      block.classList.toggle('show-menu');
    });
  }

  // Mega menu toggle
  block.querySelectorAll('.main-nav > ul > li.has-child').forEach((menuItem) => {
    const link = menuItem.querySelector(':scope > a');
    const megaMenu = menuItem.querySelector(':scope > .mega-menu');
    const svgArrow = menuItem.querySelector(':scope > span');

    if (link && megaMenu && svgArrow) {
      const toggleMegaMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        menuItem.classList.toggle('active');
        megaMenu.classList.toggle('active');
        svgArrow.classList.toggle('active');
      };

      link.addEventListener('click', toggleMegaMenu);
      svgArrow.addEventListener('click', toggleMegaMenu);
    }
  });

  // Nested menu toggles (for has-sub-child and has-inner-sub-child)
  block.querySelectorAll('.has-sub-child, .has-inner-sub-child').forEach((subChildContainer) => {
    const trigger = subChildContainer.previousElementSibling; // The <a> or <span> that triggers it
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        subChildContainer.classList.toggle('active');
        trigger.classList.toggle('active');
      });
    }
  });
}
