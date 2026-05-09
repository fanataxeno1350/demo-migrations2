import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function createSvgIcon(svgContent) {
  const span = document.createElement('span');
  span.innerHTML = svgContent;
  return span;
}

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

      // Handle inner nested lists
      nested.querySelectorAll('li').forEach((nestedLi) => {
        const innerNested = nestedLi.querySelector(':scope > ul');
        const innerAnchor = nestedLi.querySelector(':scope > a');

        if (!innerAnchor) {
          const innerTextNode = [...nestedLi.childNodes].find(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
          );
          if (innerTextNode) {
            const span = document.createElement('span');
            span.textContent = innerTextNode.textContent.trim();
            innerTextNode.remove();
            nestedLi.prepend(span);
          }
        }

        if (innerNested) {
          innerNested.remove();
          const innerSubWrap = document.createElement('div');
          innerSubWrap.classList.add('has-inner-sub-child');
          innerSubWrap.append(innerNested);
          nestedLi.append(innerSubWrap);

          const innerTrigger = nestedLi.querySelector(':scope > a, :scope > span');
          if (innerTrigger) {
            innerTrigger.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              nestedLi.classList.toggle('active-child');
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

  const [
    mainLogoRow,
    mainLogoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // nav-up is a scroll state class, do not add initially

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrap.append(logoDiv);

  const mainLogoLink = document.createElement('a');
  const mainLogoAnchor = mainLogoLinkRow.querySelector('a');
  if (mainLogoAnchor) {
    mainLogoLink.href = mainLogoAnchor.href;
  }
  moveInstrumentation(mainLogoLinkRow, mainLogoLink);
  logoDiv.append(mainLogoLink);

  const mainLogoPicture = mainLogoRow.querySelector('picture');
  if (mainLogoPicture) {
    const mainLogoImg = mainLogoPicture.querySelector('img');
    const optimizedMainLogo = createOptimizedPicture(mainLogoImg.src, mainLogoImg.alt, false, [{ width: '200' }]);
    moveInstrumentation(mainLogoRow, optimizedMainLogo.querySelector('img'));
    mainLogoLink.append(optimizedMainLogo);
    optimizedMainLogo.querySelector('img').classList.add('hiddenlogo1');
  }

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  wrap.append(hamburger);

  const hamburgerUl = document.createElement('ul');
  hamburger.append(hamburgerUl);
  [...Array(3)].forEach(() => hamburgerUl.append(document.createElement('li')));

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  wrap.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 2);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell, leftHeadingCell, leftDescCell, leftSubDescCell, leftFactsCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    anchor.setAttribute('itemprop', 'url');
    li.append(anchor);

    const arrowSvg = createSvgIcon(
      '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>',
    );
    li.append(arrowSvg);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    li.append(megaMenu);

    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);

    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.append(leftDiv);

    if (leftHeadingCell.textContent.trim()) {
      const leftHeading = document.createElement('h4');
      leftHeading.classList.add('left-div-heading');
      const headingAnchor = document.createElement('a');
      headingAnchor.textContent = leftHeadingCell.textContent.trim();
      leftHeading.append(headingAnchor);
      leftDiv.append(leftHeading);
    }

    if (leftDescCell.textContent.trim()) {
      const leftDesc = document.createElement('p');
      leftDesc.classList.add('left-div-desc');
      leftDesc.textContent = leftDescCell.textContent.trim();
      leftDiv.append(leftDesc);
    }

    if (leftSubDescCell.textContent.trim()) {
      const leftSubDesc = document.createElement('p');
      leftSubDesc.classList.add('left-div-subdesc');
      leftSubDesc.textContent = leftSubDescCell.textContent.trim();
      leftDiv.append(leftSubDesc);
    }

    if (leftFactsCell.innerHTML.trim()) {
      const factsDiv = document.createElement('div');
      factsDiv.innerHTML = leftFactsCell.innerHTML;
      leftDiv.append(factsDiv);
      factsDiv.querySelectorAll('li').forEach((factLi) => {
        factLi.classList.add('list-text-red');
      });
    }

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
    }

    navUl.append(li);
  });

  // Icon Nav (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);
  navUl.append(mobileIconNav);

  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailLinkMobile = document.createElement('a');
  mailLinkMobile.href = 'https://www.mahindra.com/contact-us';
  mailLinkMobile.textContent = 'Contact Us';
  mobileIconUl.append(mailLiMobile);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#';
  searchLinkMobile.append(
    createSvgIcon(
      '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>',
    ),
  );
  searchLinkMobile.append(
    createSvgIcon(
      '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>',
    ),
  );
  searchLinkMobile.append(document.createElement('span').textContent = ' Search');
  searchLiMobile.append(searchLinkMobile);
  mobileIconUl.append(searchLiMobile);

  const searchScreenWrapMobile = document.createElement('div');
  searchScreenWrapMobile.classList.add('search-screen-wrap');
  searchLiMobile.append(searchScreenWrapMobile);

  const searchWrapMobile = document.createElement('div');
  searchWrapMobile.classList.add('wrap');
  searchScreenWrapMobile.append(searchWrapMobile);

  const searchFormMobile = document.createElement('form');
  searchFormMobile.action = 'https://www.mahindra.com/search';
  searchFormMobile.method = 'get';
  searchFormMobile.id = 'search-block-form';
  searchFormMobile.setAttribute('accept-charset', 'UTF-8');
  searchWrapMobile.append(searchFormMobile);

  const searchInnerWrapMobile = document.createElement('div');
  searchInnerWrapMobile.classList.add('search-wrap');
  searchFormMobile.append(searchInnerWrapMobile);

  const searchIconDivMobile = document.createElement('div');
  searchIconDivMobile.classList.add('search-icon');
  searchIconDivMobile.append(
    createSvgIcon(
      '<svg viewBox="0 0 21 21" fill="none"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>',
    ),
  );
  searchInnerWrapMobile.append(searchIconDivMobile);

  const searchInputMobile = document.createElement('input');
  searchInputMobile.type = 'text';
  searchInputMobile.classList.add('input-text', 'searchtext');
  searchInputMobile.required = true;
  searchInputMobile.name = 'key';
  searchInputMobile.id = 'searchInput';
  searchInputMobile.autocomplete = 'off';
  searchInnerWrapMobile.append(searchInputMobile);

  const submitButtonMobile = document.createElement('button');
  submitButtonMobile.classList.add('submit-button');
  const submitLabelMobile = document.createElement('div');
  submitLabelMobile.classList.add('label');
  submitLabelMobile.textContent = ' Submit ';
  submitButtonMobile.append(submitLabelMobile);
  submitButtonMobile.append(
    createSvgIcon(
      '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>',
    ),
  );
  searchInnerWrapMobile.append(submitButtonMobile);

  const searchResultBoxMobile = document.createElement('div');
  searchResultBoxMobile.classList.add('searchResultBox');
  searchResultBoxMobile.style.display = 'none';
  searchFormMobile.append(searchResultBoxMobile);

  const swiperScrollSwiperMobile = document.createElement('div');
  swiperScrollSwiperMobile.classList.add('swiper', 'scrollSwiper');
  searchResultBoxMobile.append(swiperScrollSwiperMobile);

  const swiperWrapperMobile = document.createElement('div');
  swiperWrapperMobile.classList.add('swiper-wrapper');
  swiperScrollSwiperMobile.append(swiperWrapperMobile);

  const swiperSlideMobile = document.createElement('div');
  swiperSlideMobile.classList.add('swiper-slide');
  swiperWrapperMobile.append(swiperSlideMobile);

  const swiperScrollbarMobile = document.createElement('div');
  swiperScrollbarMobile.classList.add('swiper-scrollbar');
  searchResultBoxMobile.append(swiperScrollbarMobile);

  const searchSuggestionsWrapMobile = document.createElement('div');
  searchSuggestionsWrapMobile.classList.add('search-suggestions-wrap');
  searchWrapMobile.append(searchSuggestionsWrapMobile);

  const popularKeywordsLabelMobile = document.createElement('div');
  popularKeywordsLabelMobile.classList.add('label');
  popularKeywordsLabelMobile.textContent = 'Popular Keywords:';
  searchSuggestionsWrapMobile.append(popularKeywordsLabelMobile);

  const tokensWrapMobile = document.createElement('div');
  tokensWrapMobile.classList.add('tokens-wrap');
  searchSuggestionsWrapMobile.append(tokensWrapMobile);

  const popularKeywordsUlMobile = document.createElement('ul');
  tokensWrapMobile.append(popularKeywordsUlMobile);
  // TODO: Add a model field for "Popular Keywords" to populate this list dynamically.
  // For now, it will be empty as hardcoded values are removed.
  // ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((keyword) => {
  //   const li = document.createElement('li');
  //   li.textContent = keyword;
  //   popularKeywordsUlMobile.append(li);
  // });

  const recommendedForYouWrapMobile = document.createElement('div');
  recommendedForYouWrapMobile.classList.add('search-suggestions-wrap');
  searchWrapMobile.append(recommendedForYouWrapMobile);

  const recommendedLabelMobile = document.createElement('div');
  recommendedLabelMobile.classList.add('label');
  recommendedLabelMobile.textContent = 'Recommended for you:';
  recommendedForYouWrapMobile.append(recommendedLabelMobile);

  const recommendedTokensWrapMobile = document.createElement('div');
  recommendedTokensWrapMobile.classList.add('tokens-wrap');
  recommendedForYouWrapMobile.append(recommendedTokensWrapMobile);

  const recommendedUlMobile = document.createElement('ul');
  recommendedTokensWrapMobile.append(recommendedUlMobile);
  // TODO: Add a model field for "Recommended for you" to populate this list dynamically.
  // For now, it will be empty as hardcoded values are removed.
  // ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((item) => {
  //   const li = document.createElement('li');
  //   li.textContent = item;
  //   recommendedUlMobile.append(li);
  // });

  // Icon Nav (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);
  nav.append(desktopIconNav);

  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailLinkDesktop = document.createElement('a');
  mailLinkDesktop.href = 'https://www.mahindra.com/contact-us';
  mailLinkDesktop.append(
    createSvgIcon(
      '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>',
    ),
  );
  mailLiDesktop.append(mailLinkDesktop);
  desktopIconUl.append(mailLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#';
  searchLinkDesktop.append(
    createSvgIcon(
      '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>',
    ),
  );
  searchLinkDesktop.append(
    createSvgIcon(
      '<svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>',
    ),
  );
  searchLiDesktop.append(searchLinkDesktop);
  desktopIconUl.append(searchLiDesktop);

  const searchScreenWrapDesktop = document.createElement('div');
  searchScreenWrapDesktop.classList.add('search-screen-wrap');
  searchLiDesktop.append(searchScreenWrapDesktop);

  const searchWrapDesktop = document.createElement('div');
  searchWrapDesktop.classList.add('wrap');
  searchScreenWrapDesktop.append(searchWrapDesktop);

  const searchFormDesktop = document.createElement('form');
  searchFormDesktop.action = 'https://www.mahindra.com/search';
  searchFormDesktop.method = 'get';
  searchFormDesktop.id = 'search-block-form';
  searchFormDesktop.setAttribute('accept-charset', 'UTF-8');
  searchWrapDesktop.append(searchFormDesktop);

  const searchInnerWrapDesktop = document.createElement('div');
  searchInnerWrapDesktop.classList.add('search-wrap');
  searchFormDesktop.append(searchInnerWrapDesktop);

  const searchIconDivDesktop = document.createElement('div');
  searchIconDivDesktop.classList.add('search-icon');
  searchIconDivDesktop.append(
    createSvgIcon(
      '<svg viewBox="0 0 21 21" fill="none"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>',
    ),
  );
  searchInnerWrapDesktop.append(searchIconDivDesktop);

  const searchInputDesktop = document.createElement('input');
  searchInputDesktop.type = 'text';
  searchInputDesktop.classList.add('input-text', 'searchtext');
  searchInputDesktop.required = true;
  searchInputDesktop.name = 'key';
  searchInputDesktop.id = 'searchInput';
  searchInputDesktop.autocomplete = 'off';
  searchInnerWrapDesktop.append(searchInputDesktop);

  const submitButtonDesktop = document.createElement('button');
  submitButtonDesktop.classList.add('submit-button');
  const submitLabelDesktop = document.createElement('div');
  submitLabelDesktop.classList.add('label');
  submitLabelDesktop.textContent = ' Submit ';
  submitButtonDesktop.append(submitLabelDesktop);
  submitButtonDesktop.append(
    createSvgIcon(
      '<svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>',
    ),
  );
  searchInnerWrapDesktop.append(submitButtonDesktop);

  const searchResultBoxDesktop = document.createElement('div');
  searchResultBoxDesktop.classList.add('searchResultBox');
  searchResultBoxDesktop.style.display = 'none';
  searchFormDesktop.append(searchResultBoxDesktop);

  const swiperScrollSwiperDesktop = document.createElement('div');
  swiperScrollSwiperDesktop.classList.add('swiper', 'scrollSwiper');
  searchResultBoxDesktop.append(swiperScrollSwiperDesktop);

  const swiperWrapperDesktop = document.createElement('div');
  swiperWrapperDesktop.classList.add('swiper-wrapper');
  swiperScrollSwiperDesktop.append(swiperWrapperDesktop);

  const swiperSlideDesktop = document.createElement('div');
  swiperSlideDesktop.classList.add('swiper-slide');
  swiperWrapperDesktop.append(swiperSlideDesktop);

  const swiperScrollbarDesktop = document.createElement('div');
  swiperScrollbarDesktop.classList.add('swiper-scrollbar');
  searchResultBoxDesktop.append(swiperScrollbarDesktop);

  const searchSuggestionsWrapDesktop = document.createElement('div');
  searchSuggestionsWrapDesktop.classList.add('search-suggestions-wrap');
  searchWrapDesktop.append(searchSuggestionsWrapDesktop);

  const popularKeywordsLabelDesktop = document.createElement('div');
  popularKeywordsLabelDesktop.classList.add('label');
  popularKeywordsLabelDesktop.textContent = 'Popular Keywords:';
  searchSuggestionsWrapDesktop.append(popularKeywordsLabelDesktop);

  const tokensWrapDesktop = document.createElement('div');
  tokensWrapDesktop.classList.add('tokens-wrap');
  searchSuggestionsWrapDesktop.append(tokensWrapDesktop);

  const popularKeywordsUlDesktop = document.createElement('ul');
  tokensWrapDesktop.append(popularKeywordsUlDesktop);
  // TODO: Add a model field for "Popular Keywords" to populate this list dynamically.
  // For now, it will be empty as hardcoded values are removed.
  // ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((keyword) => {
  //   const li = document.createElement('li');
  //   li.textContent = keyword;
  //   popularKeywordsUlDesktop.append(li);
  // });

  const recommendedForYouWrapDesktop = document.createElement('div');
  recommendedForYouWrapDesktop.classList.add('search-suggestions-wrap');
  searchWrapDesktop.append(recommendedForYouWrapDesktop);

  const recommendedLabelDesktop = document.createElement('div');
  recommendedLabelDesktop.classList.add('label');
  recommendedLabelDesktop.textContent = 'Recommended for you:';
  recommendedForYouWrapDesktop.append(recommendedLabelDesktop);

  const recommendedTokensWrapDesktop = document.createElement('div');
  recommendedTokensWrapDesktop.classList.add('tokens-wrap');
  recommendedForYouWrapDesktop.append(recommendedTokensWrapDesktop);

  const recommendedUlDesktop = document.createElement('ul');
  recommendedTokensWrapDesktop.append(recommendedUlDesktop);
  // TODO: Add a model field for "Recommended for you" to populate this list dynamically.
  // For now, it will be empty as hardcoded values are removed.
  // ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((item) => {
  //   const li = document.createElement('li');
  //   li.textContent = item;
  //   recommendedUlDesktop.append(li);
  // });

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrap.append(year80LogoDiv);

  const anniversaryLogoLink = document.createElement('a');
  const anniversaryLogoAnchor = anniversaryLogoLinkRow.querySelector('a');
  if (anniversaryLogoAnchor) {
    anniversaryLogoLink.href = anniversaryLogoAnchor.href;
  }
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  year80LogoDiv.append(anniversaryLogoLink);

  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const anniversaryLogoImg = anniversaryLogoPicture.querySelector('img');
    const optimizedAnniversaryLogo = createOptimizedPicture(anniversaryLogoImg.src, anniversaryLogoImg.alt, false, [{ width: '74' }]);
    moveInstrumentation(anniversaryLogoRow, optimizedAnniversaryLogo.querySelector('img'));
    anniversaryLogoLink.append(optimizedAnniversaryLogo);
    optimizedAnniversaryLogo.querySelector('img').classList.add('hiddenlogo1', 'years-80');
  }

  // Press Releases (Newsroom mega menu section)
  const newsroomLi = navUl.querySelector('li.has-child a[href*="newsroom"]')?.closest('li');
  if (newsroomLi) {
    const newsroomMegaMenu = newsroomLi.querySelector('.mega-menu');
    const newsroomCenterDiv = newsroomMegaMenu.querySelector('.center-div');
    const newsroomLeftDiv = newsroomCenterDiv.querySelector('.left-div');
    newsroomLeftDiv.classList.add('newsroom-left-div');

    const latestPressReleaseDiv = document.createElement('div');
    latestPressReleaseDiv.classList.add('latest-two-press-release');
    newsroomLeftDiv.append(latestPressReleaseDiv);

    pressReleaseItems.forEach((row) => {
      const [pressReleaseLinkCell, pressReleaseTitleCell, pressReleaseDateCell, pressReleaseTagCell] = [...row.children];

      const slidesDiv = document.createElement('div');
      slidesDiv.classList.add('slides');
      latestPressReleaseDiv.append(slidesDiv);

      const slidesWrapDiv = document.createElement('div');
      slidesWrapDiv.classList.add('wrap');
      slidesDiv.append(slidesWrapDiv);

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content');
      slidesWrapDiv.append(contentDiv);

      const descDiv = document.createElement('div');
      descDiv.classList.add('desc');
      contentDiv.append(descDiv);

      const p = document.createElement('p');
      const link = document.createElement('a');
      const foundLink = pressReleaseLinkCell.querySelector('a');
      if (foundLink) link.href = foundLink.href;
      link.textContent = pressReleaseTitleCell.textContent.trim();
      p.append(link);
      descDiv.append(p);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const dateEm = document.createElement('em');
      dateEm.textContent = pressReleaseDateCell.textContent.trim();
      dateDiv.append(dateEm);
      const tagEm = document.createElement('em');
      tagEm.textContent = pressReleaseTagCell.textContent.trim();
      dateDiv.append(tagEm);
      descDiv.append(dateDiv);
      moveInstrumentation(row, slidesDiv);
    });
  }

  // Icon Links (Desktop)
  const iconLinksUl = document.createElement('ul');
  iconLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    iconLinksUl.append(li);
    moveInstrumentation(row, li);
  });

  block.replaceChildren(header);

  // Add event listeners for hamburger menu
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('disable-scroll');
  });

  // Add event listeners for search toggle
  const searchToggles = document.querySelectorAll('.search');
  searchToggles.forEach((searchToggle) => {
    const searchScreen = searchToggle.querySelector('.search-screen-wrap');
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      searchToggle.classList.toggle('active');
      searchScreen.classList.toggle('active');
      document.body.classList.toggle('disable-scroll');
    });
    searchScreen.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
}
