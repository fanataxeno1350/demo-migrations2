import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function createSvgIcon(pathD) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');

  const g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g1.setAttribute('id', 'SVGRepo_bgCarrier');
  g1.setAttribute('stroke-width', '0');
  svg.appendChild(g1);

  const g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g2.setAttribute('id', 'SVGRepo_tracerCarrier');
  g2.setAttribute('stroke-linecap', 'round');
  g2.setAttribute('stroke-linejoin', 'round');
  g2.setAttribute('stroke', '#CCCCCC');
  g2.setAttribute('stroke-width', '0.30321600000000004');
  svg.appendChild(g2);

  const g3 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g3.setAttribute('id', 'SVGRepo_iconCarrier');
  g3.setAttribute('transform', 'translate(-831.568 -384.448)');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('d', pathD);
  path.setAttribute('fill', '#030408');
  g3.appendChild(path);
  svg.appendChild(g3);

  return svg;
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
        const arrowSvg = createSvgIcon(
          'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z',
        );
        trigger.append(arrowSvg);
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
  const children = [...block.children].filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some(
        (c) => c.children.length > 0 || c.textContent.trim() !== '',
      ),
  );

  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    // These are container fields, their item rows are in `itemRows`
    navigationMenuContainerRow,
    iconNavItemsContainerRow,
    pressReleaseItemsContainerRow,
    ...itemRows
  ] = children;

  const mainHeader = document.createElement('header');
  mainHeader.classList.add('main-header', 'with-marquee', 'solid'); // nav-up is a state class, not initial

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  mainHeader.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Main Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '200' },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoDiv);
  logoDiv.append(logoLink);
  wrapDiv.append(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);
  wrapDiv.append(mainNav);

  // Navigation Menu Items
  const navigationItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('ul')); // Filter for navigation-item rows
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [
      ...row.children,
    ];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(linkCell, anchor);
    moveInstrumentation(labelCell, anchor);
    li.append(anchor);

    const arrowSvg = createSvgIcon(
      'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z',
    );
    const span = document.createElement('span');
    span.append(arrowSvg);
    li.append(span);

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
    centerDiv.append(leftDiv);

    const megaMenuContent = megaMenuContentCell?.innerHTML;
    if (megaMenuContent) {
      leftDiv.innerHTML = megaMenuContent;
    }
    moveInstrumentation(megaMenuContentCell, leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
    }
    moveInstrumentation(hierarchyTreeCell, subNavWrap);
    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });
  moveInstrumentation(navigationMenuContainerRow, navUl);

  // Icon Nav Items (Mobile)
  const mobileIconNavDiv = document.createElement('div');
  mobileIconNavDiv.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconNavUl = document.createElement('ul');
  mobileIconNavDiv.append(mobileIconNavUl);
  navUl.append(mobileIconNavDiv);

  const iconNavItems = itemRows.filter((row) => row.children.length === 2); // Filter for icon-nav-item rows
  iconNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(linkCell, anchor);
    moveInstrumentation(labelCell, anchor);
    li.append(anchor);
    if (labelCell?.textContent.trim().toLowerCase() === 'contact us') {
      li.classList.add('mail');
    } else if (labelCell?.textContent.trim().toLowerCase() === 'search') {
      li.classList.add('search');
      // Add search functionality
      const searchLensSvg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      );
      searchLensSvg.setAttribute('viewBox', '0 0 21 21');
      searchLensSvg.setAttribute('fill', 'none');
      searchLensSvg.classList.add('lens');
      searchLensSvg.innerHTML = `<path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>`;
      const searchCloseSvg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      );
      searchCloseSvg.setAttribute('viewBox', '0 0 50 50');
      searchCloseSvg.classList.add('close');
      searchCloseSvg.innerHTML = `<path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>`;
      anchor.innerHTML = '';
      anchor.append(searchLensSvg, searchCloseSvg);
      const searchSpan = document.createElement('span');
      searchSpan.textContent = ' Search';
      anchor.append(searchSpan);
      // Add search screen wrap
      const searchScreenWrap = document.createElement('div');
      searchScreenWrap.classList.add('search-screen-wrap');
      // The form action should be read from a cell if it's authored, not hardcoded.
      // For now, keeping the hardcoded value as it's not in the block model.
      searchScreenWrap.innerHTML = `
        <div class="wrap">
          <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
            <div class="search-wrap">
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
            </div>
            <div class="searchResultBox" style="display: none;">
              <div class="swiper scrollSwiper">
                <div class="swiper-wrapper">
                  <div class="swiper-slide"></div>
                </div>
              </div>
              <div class="swiper-scrollbar"></div>
            </div>
          </form>
          <div class="search-suggestions-wrap">
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
          </div>
          <div class="search-suggestions-wrap">
            <div class="label">Recommended for you:</div>
            <div class="tokens-wrap">
              <ul>
                <li>Annual Report 2021 - 2022</li>
                <li>Leadership Announcement</li>
                <li>Latest Press Release</li>
                <li>Brand Guidelines</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      li.append(searchScreenWrap);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        searchScreenWrap.classList.toggle('active');
      });
    }
    mobileIconNavUl.append(li);
    moveInstrumentation(row, li);
  });
  moveInstrumentation(iconNavItemsContainerRow, mobileIconNavUl);

  // Icon Nav Items (Desktop)
  const desktopIconNavDiv = document.createElement('div');
  desktopIconNavDiv.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconNavUl = document.createElement('ul');
  desktopIconNavDiv.append(desktopIconNavUl);
  wrapDiv.append(desktopIconNavDiv);

  iconNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(linkCell, anchor);
    moveInstrumentation(labelCell, anchor);
    li.append(anchor);
    if (labelCell?.textContent.trim().toLowerCase() === 'contact us') {
      li.classList.add('mail');
      anchor.innerHTML = `
        <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                    C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                    L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
        </svg>
      `;
    } else if (labelCell?.textContent.trim().toLowerCase() === 'search') {
      li.classList.add('search');
      // Add search functionality
      const searchLensSvg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      );
      searchLensSvg.setAttribute('viewBox', '0 0 21 21');
      searchLensSvg.setAttribute('fill', 'none');
      searchLensSvg.classList.add('lens');
      searchLensSvg.innerHTML = `<path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>`;
      const searchCloseSvg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      );
      searchCloseSvg.setAttribute('viewBox', '0 0 50 50');
      searchCloseSvg.classList.add('close');
      searchCloseSvg.innerHTML = `<path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>`;
      anchor.innerHTML = '';
      anchor.append(searchLensSvg, searchCloseSvg);
      // Add search screen wrap
      const searchScreenWrap = document.createElement('div');
      searchScreenWrap.classList.add('search-screen-wrap');
      // The form action should be read from a cell if it's authored, not hardcoded.
      // For now, keeping the hardcoded value as it's not in the block model.
      searchScreenWrap.innerHTML = `
        <div class="wrap">
          <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
            <div class="search-wrap">
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
            </div>
            <div class="searchResultBox" style="display: none;">
              <div class="swiper scrollSwiper">
                <div class="swiper-wrapper">
                  <div class="swiper-slide"></div>
                </div>
              </div>
              <div class="swiper-scrollbar"></div>
            </div>
          </form>
          <div class="search-suggestions-wrap">
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
          </div>
          <div class="search-suggestions-wrap">
            <div class="label">Recommended for you:</div>
            <div class="tokens-wrap">
              <ul>
                <li>Annual Report 2021 - 2022</li>
                <li>Leadership Announcement</li>
                <li>Latest Press Release</li>
                <li>Brand Guidelines</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      li.append(searchScreenWrap);

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        searchScreenWrap.classList.toggle('active');
      });
    }
    desktopIconNavUl.append(li);
    moveInstrumentation(row, li);
  });
  moveInstrumentation(iconNavItemsContainerRow, desktopIconNavUl);

  // Press Release Items
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4 && !row.querySelector('ul')); // Filter for press-release-item rows
  const newsroomLeftDiv = mainHeader.querySelector('.newsroom-left-div .latest-two-press-release');
  if (newsroomLeftDiv) {
    pressReleaseItems.forEach((row) => {
      const [pressLinkCell, pressTitleCell, pressDateCell, pressCategoryCell] = [...row.children];

      const slideDiv = document.createElement('div');
      slideDiv.classList.add('slides');
      const wrapInnerDiv = document.createElement('div');
      wrapInnerDiv.classList.add('wrap');
      slideDiv.append(wrapInnerDiv);
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content');
      wrapInnerDiv.append(contentDiv);
      const descDiv = document.createElement('div');
      descDiv.classList.add('desc');
      contentDiv.append(descDiv);

      const pLink = document.createElement('p');
      const aLink = document.createElement('a');
      aLink.href = pressLinkCell?.querySelector('a')?.href || '#';
      aLink.textContent = pressTitleCell?.textContent.trim() || '';
      pLink.append(aLink);
      descDiv.append(pLink);
      moveInstrumentation(pressLinkCell, aLink);
      moveInstrumentation(pressTitleCell, aLink);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const emDate = document.createElement('em');
      emDate.textContent = pressDateCell?.textContent.trim() || '';
      const emCategory = document.createElement('em');
      emCategory.textContent = pressCategoryCell?.textContent.trim() || '';
      dateDiv.append(emDate, emCategory);
      descDiv.append(dateDiv);
      moveInstrumentation(pressDateCell, emDate);
      moveInstrumentation(pressCategoryCell, emCategory);

      newsroomLeftDiv.append(slideDiv);
      moveInstrumentation(row, slideDiv);
    });
  }
  moveInstrumentation(pressReleaseItemsContainerRow, newsroomLeftDiv);


  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  anniversaryLogoLink.href = anniversaryLogoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);

  const anniversaryLogoPicture = anniversaryLogoRow?.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '74' },
    ]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    anniversaryLogoLink.append(optimizedPic);
  }
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoDiv);
  anniversaryLogoDiv.append(anniversaryLogoLink);
  wrapDiv.append(anniversaryLogoDiv);

  block.replaceChildren(mainHeader);

  // Swiper Initialization
  const swiperEl = mainHeader.querySelector('.swiper.scrollSwiper');
  if (swiperEl) {
    await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

    const swiperWrapper = swiperEl.querySelector('.swiper-wrapper');
    const slides = swiperWrapper.querySelectorAll('.swiper-slide');

    // eslint-disable-next-line no-undef
    new Swiper(swiperEl, {
      slidesPerView: 'auto',
      loop: false, // Assuming loop is false based on original HTML absence
      // Add navigation and pagination if present in original HTML
      // navigation: { prevEl: prevBtn, nextEl: nextBtn },
      // pagination: { el: paginationEl, clickable: true },
    });
  }
}
