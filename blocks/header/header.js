import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes from ORIGINAL HTML to li elements
    li.classList.add('top-level-li'); // Assuming top-level-li for all initial list items

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
      subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Class from ORIGINAL HTML
          subWrap.classList.toggle('active'); // Class from ORIGINAL HTML
        });
      }

      // Handle inner sub-children
      nested.querySelectorAll('li').forEach((innerLi) => {
        innerLi.classList.add('first-level-li'); // Class from ORIGINAL HTML
        const innerNested = innerLi.querySelector(':scope > ul');
        if (innerNested) {
          innerNested.remove();
          const innerSubWrap = document.createElement('div');
          innerSubWrap.classList.add('has-inner-sub-child'); // Class from ORIGINAL HTML
          innerSubWrap.append(innerNested);
          innerLi.append(innerSubWrap);

          const innerTrigger = innerLi.querySelector(':scope > a, :scope > span');
          if (innerTrigger) {
            innerTrigger.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              innerLi.classList.toggle('active-child'); // Class from ORIGINAL HTML
              innerSubWrap.classList.toggle('active-child'); // Class from ORIGINAL HTML
            });
          }
        }
      });
    }
  });
}

export default async function decorate(block) {
  const allRows = [...block.children];

  // Root fields - fixed schema
  const mainLogoRow = allRows[0];
  const mainLogoLinkRow = allRows[1];
  const anniversaryLogoRow = allRows[2];
  const anniversaryLogoLinkRow = allRows[3];

  const mainLogoPicture = mainLogoRow?.querySelector('picture');
  const mainLogoLink = mainLogoLinkRow?.querySelector('a')?.href;
  const anniversaryLogoPicture = anniversaryLogoRow?.querySelector('picture');
  const anniversaryLogoLink = anniversaryLogoLinkRow?.querySelector('a')?.href;

  // Item rows - content detection based on cell count
  const itemRows = allRows.slice(4); // All rows after the 4 root fields

  const navigationItems = itemRows.filter((row) => row.children.length === 6);
  // const pressReleaseItems = itemRows.filter((row) => row.children.length === 4); // Not used in current JS, but good to keep for future
  // const iconLinkItems = itemRows.filter((row) => row.children.length === 2); // Not used in current JS, but good to keep for future

  const headerEl = document.createElement('header');
  headerEl.classList.add('main-header', 'with-marquee', 'solid'); // nav-up is a scroll state class, do not add

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  headerEl.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const mainLogoAnchor = document.createElement('a');
  mainLogoAnchor.href = mainLogoLink || '#';
  if (mainLogoPicture) {
    const optimizedPic = createOptimizedPicture(mainLogoPicture.querySelector('img').src, mainLogoPicture.querySelector('img').alt, false, [{ width: '200' }]);
    moveInstrumentation(mainLogoPicture.querySelector('img'), optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    mainLogoAnchor.append(optimizedPic);
  }
  logoDiv.append(mainLogoAnchor);
  wrapDiv.append(logoDiv);
  moveInstrumentation(mainLogoRow, logoDiv);
  moveInstrumentation(mainLogoLinkRow, mainLogoAnchor);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.dataset.once = 'hamburger-click nav-close-search';
  const hamburgerUl = document.createElement('ul');
  [...Array(3)].forEach(() => hamburgerUl.append(document.createElement('li')));
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Navigation
  const navEl = document.createElement('nav');
  navEl.classList.add('main-nav');
  navEl.dataset.once = 'initSubChildToggle';
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  navEl.append(navUl);
  wrapDiv.append(navEl);

  navigationItems.forEach((row) => {
    // Fixed schema for navigation-item
    const [labelCell, linkCell, hierarchyTreeCell, megaMenuHeadingCell, megaMenuDescriptionCell, megaMenuSubDescriptionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.dataset.once = 'nav-close-search';

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);

    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
    svgIcon.setAttribute('fill', '#000000');
    svgIcon.setAttribute('stroke', '#000000');
    svgIcon.setAttribute('stroke-width', '4.851456000000001');
    svgIcon.innerHTML = `<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g>`;
    const spanIcon = document.createElement('span');
    spanIcon.append(svgIcon);
    li.append(spanIcon);

    const megaMenuDiv = document.createElement('div');
    megaMenuDiv.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);
    megaMenuDiv.append(megaMenuWrap);
    li.append(megaMenuDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    const headingLink = document.createElement('a');
    headingLink.textContent = megaMenuHeadingCell?.textContent.trim() || '';
    leftDiv.append(headingLink); // Append link to leftDiv, not heading
    heading.append(headingLink); // Then append headingLink to heading
    leftDiv.append(heading);

    const desc = document.createElement('p');
    desc.classList.add('left-div-desc');
    desc.innerHTML = megaMenuDescriptionCell?.innerHTML || '';
    leftDiv.append(desc);

    const subDesc = document.createElement('p');
    subDesc.classList.add('left-div-subdesc');
    subDesc.innerHTML = megaMenuSubDescriptionCell?.innerHTML || '';
    leftDiv.append(subDesc);
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    // For richtext hierarchy-tree, read innerHTML and then transform
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const hierarchyUl = tempDiv.querySelector('ul');
    if (hierarchyUl) {
      // Apply classes to nested elements as per ORIGINAL HTML
      hierarchyUl.querySelectorAll('li').forEach(item => item.classList.add('top-level-li'));
      hierarchyUl.querySelectorAll('li > ul').forEach(subUl => subUl.classList.add('sub-menu')); // Example class, adjust if needed
      hierarchyUl.querySelectorAll('a').forEach(a => a.classList.add('nav-link')); // Example class, adjust if needed

      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
      moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Move instrumentation for the hierarchy tree
    }
    centerDiv.append(subNavWrap);

    navUl.append(li);
    moveInstrumentation(row, li);

    // Toggle mega menu
    li.addEventListener('mouseenter', () => {
      megaMenuDiv.classList.add('active');
      li.classList.add('active');
    });
    li.addEventListener('mouseleave', () => {
      megaMenuDiv.classList.remove('active');
      li.classList.remove('active');
    });
  });

  // Hamburger menu toggle
  hamburgerDiv.addEventListener('click', () => {
    navEl.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // Add/remove no-scroll to body
  });

  // Icon Navigation (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);
  navUl.append(mobileIconNav); // Appending to navUl as per original HTML structure

  // Mail icon for mobile
  const mobileMailLi = document.createElement('li');
  mobileMailLi.classList.add('mail');
  const mobileMailLink = document.createElement('a');
  mobileMailLink.href = 'https://www.mahindra.com/contact-us';
  mobileMailLink.textContent = 'Contact Us';
  mobileMailLi.append(mobileMailLink);
  mobileIconUl.append(mobileMailLi);

  // Search icon for mobile
  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  mobileSearchLi.dataset.once = 'search-toggle search-stop-propagation';
  const mobileSearchLink = document.createElement('a');
  mobileSearchLink.href = '#';
  mobileSearchLink.dataset.once = 'search-stop-propagation';
  mobileSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
    </svg>
    <span data-once="search-stop-propagation"> Search</span>`;
  mobileSearchLi.append(mobileSearchLink);

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.dataset.once = 'search-stop-propagation';
  searchScreenWrap.style.display = 'none'; // Initially hidden
  mobileSearchLi.append(searchScreenWrap);

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
  searchIconDiv.innerHTML = `<svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>`;
  searchInputWrap.append(searchIconDiv);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.required = true;
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchInput.dataset.once = 'search-stop-propagation';
  searchInputWrap.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.dataset.once = 'search-stop-propagation';
  submitButton.innerHTML = `<div class="label" data-once="search-stop-propagation"> Submit </div>
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>
    </svg>`;
  searchInputWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.dataset.once = 'search-stop-propagation';
  searchForm.append(searchResultBox);

  const swiperScrollSwiper = document.createElement('div');
  swiperScrollSwiper.classList.add('swiper', 'scrollSwiper');
  swiperScrollSwiper.dataset.once = 'search-stop-propagation';
  searchResultBox.append(swiperScrollSwiper);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.dataset.once = 'search-stop-propagation';
  swiperScrollSwiper.append(swiperWrapper);

  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');
  swiperSlide.dataset.once = 'search-stop-propagation';
  swiperWrapper.append(swiperSlide);

  const swiperScrollbar = document.createElement('div');
  swiperScrollbar.classList.add('swiper-scrollbar');
  swiperScrollbar.dataset.once = 'search-stop-propagation';
  searchResultBox.append(swiperScrollbar);

  // Hardcoded search suggestions from ORIGINAL HTML
  const popularKeywords = ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'];
  const recommendedKeywords = ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'];

  const createSearchSuggestions = (label, keywords) => {
    const searchSuggestionsWrap = document.createElement('div');
    searchSuggestionsWrap.classList.add('search-suggestions-wrap');
    searchSuggestionsWrap.dataset.once = 'search-stop-propagation';

    const labelDiv = document.createElement('div');
    labelDiv.classList.add('label');
    labelDiv.dataset.once = 'search-stop-propagation';
    labelDiv.textContent = label;
    searchSuggestionsWrap.append(labelDiv);

    const tokensWrap = document.createElement('div');
    tokensWrap.classList.add('tokens-wrap');
    tokensWrap.dataset.once = 'search-stop-propagation';
    searchSuggestionsWrap.append(tokensWrap);

    const ul = document.createElement('ul');
    ul.dataset.once = 'search-stop-propagation';
    keywords.forEach((text) => {
      const liKeyword = document.createElement('li');
      liKeyword.dataset.once = 'search-stop-propagation';
      liKeyword.textContent = text;
      ul.append(liKeyword);
    });
    tokensWrap.append(ul);
    return searchSuggestionsWrap;
  };

  searchWrapInner.append(createSearchSuggestions('Popular Keywords:', popularKeywords));
  searchWrapInner.append(createSearchSuggestions('Recommended for you:', recommendedKeywords));

  mobileIconUl.append(mobileSearchLi);

  // Icon Navigation (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);
  navEl.append(desktopIconNav); // Appending to navEl as per original HTML structure

  // Mail icon for desktop
  const desktopMailLi = document.createElement('li');
  desktopMailLi.classList.add('mail');
  const desktopMailLink = document.createElement('a');
  desktopMailLink.href = 'https://www.mahindra.com/contact-us';
  desktopMailLink.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
    </svg>`;
  desktopMailLi.append(desktopMailLink);
  desktopIconUl.append(desktopMailLi);

  // Search icon for desktop (similar structure to mobile search)
  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  desktopSearchLi.dataset.once = 'search-toggle search-stop-propagation';
  const desktopSearchLink = document.createElement('a');
  desktopSearchLink.href = '#';
  desktopSearchLink.dataset.once = 'search-stop-propagation';
  desktopSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
    </svg>`;
  desktopSearchLi.append(desktopSearchLink);
  desktopSearchLi.append(searchScreenWrap.cloneNode(true)); // Re-using the search screen structure
  desktopIconUl.append(desktopSearchLi);

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoAnchor = document.createElement('a');
  anniversaryLogoAnchor.href = anniversaryLogoLink || '#';
  if (anniversaryLogoPicture) {
    const optimizedPic = createOptimizedPicture(anniversaryLogoPicture.querySelector('img').src, anniversaryLogoPicture.querySelector('img').alt, false, [{ width: '74' }]);
    moveInstrumentation(anniversaryLogoPicture.querySelector('img'), optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    anniversaryLogoAnchor.append(optimizedPic);
  }
  anniversaryLogoDiv.append(anniversaryLogoAnchor);
  wrapDiv.append(anniversaryLogoDiv);
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoDiv);
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoAnchor);

  // Search toggle functionality
  const allSearchLinks = headerEl.querySelectorAll('.search > a');
  allSearchLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const searchParentLi = e.currentTarget.closest('li.search');
      const targetSearchScreen = searchParentLi.querySelector('.search-screen-wrap');
      if (targetSearchScreen) {
        targetSearchScreen.style.display = targetSearchScreen.style.display === 'none' ? 'block' : 'none';
        searchParentLi.classList.toggle('active');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-screen-wrap') && !e.target.closest('.search')) {
      headerEl.querySelectorAll('.search-screen-wrap').forEach((wrap) => {
        wrap.style.display = 'none';
      });
      headerEl.querySelectorAll('li.search').forEach((li) => {
        li.classList.remove('active');
      });
    }
  });

  block.replaceChildren(headerEl);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
