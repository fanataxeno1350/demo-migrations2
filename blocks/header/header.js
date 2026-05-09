import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, sourceCell) {
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
      subWrap.classList.add('has-sub-child'); // use ORIGINAL HTML class
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
  // Move instrumentation for the entire transformed list if it originated from a richtext cell
  if (sourceCell) {
    moveInstrumentation(sourceCell, rootUl);
  }
}

export default async function decorate(block) {
  const allRows = [...block.children];

  // Distinguish root rows by content or position
  const logoRow = allRows[0];
  const logoLinkRow = allRows[1];
  const year80LogoRow = allRows[2];
  const year80LogoLinkRow = allRows[3];

  // The remaining rows are item rows for containers.
  // We need to filter them by cell count to match the BlockJson models.
  const itemRows = allRows.slice(4);

  const navigationMenuContainer = itemRows.filter((row) => row.children.length === 8);
  const pressReleasesContainer = itemRows.filter((row) => row.children.length === 4);
  const iconNavItemsContainer = itemRows.filter((row) => row.children.length === 2);

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // Exclude 'nav-up' as per Rule 19

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
      logoLink.querySelector('img').classList.add('hiddenlogo1');
    }
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.dataset.once = 'hamburger-click nav-close-search';
  const hamburgerUl = document.createElement('ul');
  [...Array(3)].forEach(() => hamburgerUl.append(document.createElement('li'))); // Create 3 list items
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.dataset.once = 'initSubChildToggle';
  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(mainUl);
  wrap.append(mainNav);

  // Navigation Menu Items
  navigationMenuContainer.forEach((row) => {
    const [
      labelCell,
      linkCell,
      hierarchyTreeCell,
      leftHeadingCell,
      leftDescCell,
      leftSubDescCell,
      leftStatsCell,
      subLinksCell,
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.dataset.once = 'nav-close-search';

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const spanSvg = document.createElement('span');
    spanSvg.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.append(spanSvg);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.append(leftDiv);

    const leftHeading = document.createElement('h4');
    leftHeading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    headingAnchor.textContent = leftHeadingCell.textContent.trim();
    leftHeading.append(headingAnchor);
    leftDiv.append(leftHeading);

    const leftDesc = document.createElement('p');
    leftDesc.classList.add('left-div-desc');
    leftDesc.textContent = leftDescCell.textContent.trim();
    leftDiv.append(leftDesc);

    const leftSubDesc = document.createElement('p');
    leftSubDesc.classList.add('left-div-subdesc');
    leftSubDesc.textContent = leftSubDescCell.textContent.trim();
    leftDiv.append(leftSubDesc);

    const leftStatsUl = leftStatsCell.querySelector('ul');
    if (leftStatsUl) {
      leftDiv.append(leftStatsUl);
    } else if (leftStatsCell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = leftStatsCell.innerHTML; // Use innerHTML for richtext
      leftDiv.append(p);
    }

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyTreeUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyTreeUl) {
      transformNestedLists(hierarchyTreeUl, hierarchyTreeCell);
      subNavWrap.append(hierarchyTreeUl);
    } else if (hierarchyTreeCell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = hierarchyTreeCell.innerHTML; // Use innerHTML for richtext
      subNavWrap.append(p);
    }

    const subLinksUl = subLinksCell.querySelector('ul');
    if (subLinksUl) {
      subNavWrap.append(subLinksUl);
    } else if (subLinksCell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = subLinksCell.innerHTML; // Use innerHTML for richtext
      subNavWrap.append(p);
    }

    li.append(megaMenu);
    mainUl.append(li);
    moveInstrumentation(row, li);
  });
  // moveInstrumentation(navigationMenuContainer, mainUl); // This is a container, not a single row

  // Press Releases (Newsroom)
  if (pressReleasesContainer.length > 0) {
    const newsroomLi = document.createElement('li');
    newsroomLi.classList.add('has-child', 'hover-red');
    newsroomLi.setAttribute('itemprop', 'name');
    newsroomLi.dataset.once = 'nav-close-search';

    const newsroomAnchor = document.createElement('a');
    newsroomAnchor.setAttribute('itemprop', 'url');
    // Assuming the first pressReleaseItems row's link cell might contain the newsroom link,
    // or we need a dedicated field for the newsroom link. For now, hardcoding as per original.
    // TODO: Add a dedicated "Newsroom Link" field to the BlockJson model if this is not a hardcoded value.
    newsroomAnchor.href = '/newsroom';
    // TODO: Read "newsroom" text from a cell if it's not a hardcoded value.
    newsroomAnchor.textContent = 'newsroom';
    newsroomLi.append(newsroomAnchor);

    const newsroomSpanSvg = document.createElement('span');
    newsroomSpanSvg.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    newsroomLi.append(newsroomSpanSvg);

    const newsroomMegaMenu = document.createElement('div');
    newsroomMegaMenu.classList.add('mega-menu');
    const newsroomWrap = document.createElement('div');
    newsroomWrap.classList.add('wrap', 'container');
    const newsroomCenterDiv = document.createElement('div');
    newsroomCenterDiv.classList.add('center-div');
    newsroomWrap.append(newsroomCenterDiv);
    newsroomMegaMenu.append(newsroomWrap);

    const newsroomLeftDiv = document.createElement('div');
    newsroomLeftDiv.classList.add('left-div', 'newsroom-left-div');
    newsroomCenterDiv.append(newsroomLeftDiv);

    const newsroomLeftHeading = document.createElement('h4');
    newsroomLeftHeading.classList.add('left-div-heading');
    const newsroomHeadingAnchor = document.createElement('a');
    // TODO: Read "Newsroom" text from a cell if it's not a hardcoded value.
    newsroomHeadingAnchor.textContent = 'Newsroom';
    newsroomLeftHeading.append(newsroomHeadingAnchor);
    newsroomLeftDiv.append(newsroomLeftHeading);

    const latestPressReleaseDiv = document.createElement('div');
    latestPressReleaseDiv.classList.add('latest-two-press-release');
    pressReleasesContainer.forEach((row) => {
      const [titleCell, linkCell, dateCell, categoryCell] = [...row.children];
      const slideDiv = document.createElement('div');
      slideDiv.classList.add('slides');
      const slideWrap = document.createElement('div');
      slideWrap.classList.add('wrap');
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content');
      const descDiv = document.createElement('div');
      descDiv.classList.add('desc');
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = linkCell.querySelector('a')?.href || '#';
      link.textContent = titleCell.textContent.trim();
      p.append(link);
      descDiv.append(p);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const dateEm = document.createElement('em');
      dateEm.textContent = dateCell.textContent.trim();
      const categoryEm = document.createElement('em');
      categoryEm.textContent = categoryCell.textContent.trim();
      dateDiv.append(dateEm, categoryEm);
      descDiv.append(dateDiv);

      contentDiv.append(descDiv);
      slideWrap.append(contentDiv);
      slideDiv.append(slideWrap);
      latestPressReleaseDiv.append(slideDiv);
      moveInstrumentation(row, slideDiv);
    });
    newsroomLeftDiv.append(latestPressReleaseDiv);

    const newsroomSubNavWrap = document.createElement('div');
    newsroomSubNavWrap.classList.add('sub-nav-wrap');
    const newsroomUl1 = document.createElement('ul');
    const newsroomLi1 = document.createElement('li');
    const newsroomLink1 = document.createElement('a');
    // TODO: Read these links and labels from cells if they are not hardcoded.
    newsroomLink1.href = '/newsroom/press-release';
    newsroomLink1.textContent = 'Press Releases';
    newsroomLi1.append(newsroomLink1);
    newsroomUl1.append(newsroomLi1);

    const newsroomLi2 = document.createElement('li');
    const newsroomLink2 = document.createElement('a');
    newsroomLink2.href = '/newsroom/corporate-doc';
    newsroomLink2.textContent = 'Media Resources';
    newsroomLi2.append(newsroomLink2);
    newsroomUl1.append(newsroomLi2);
    newsroomSubNavWrap.append(newsroomUl1);

    const newsroomUl2 = document.createElement('ul');
    const newsroomLi3 = document.createElement('li');
    const newsroomLink3 = document.createElement('a');
    newsroomLink3.href = '/newsroom#in-the-news';
    newsroomLink3.textContent = 'In The News';
    newsroomLi3.append(newsroomLink3);
    newsroomUl2.append(newsroomLi3);
    newsroomSubNavWrap.append(newsroomUl2);

    newsroomCenterDiv.append(newsroomSubNavWrap);
    newsroomLi.append(newsroomMegaMenu);
    mainUl.append(newsroomLi);
    // moveInstrumentation(pressReleasesContainer, newsroomLi); // This is a container, not a single row
  }

  // Icon Navigation (Mobile)
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavMobileUl = document.createElement('ul');
  iconNavMobile.append(iconNavMobileUl);

  iconNavItemsContainer.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add(labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-')); // e.g., 'contact-us' -> 'contact-us'
    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    iconNavMobileUl.append(li);
    moveInstrumentation(row, li);
  });
  // moveInstrumentation(iconNavItemsContainer, iconNavMobileUl); // This is a container, not a single row

  // Search functionality (mobile and desktop)
  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  searchLiMobile.dataset.once = 'search-toggle search-stop-propagation';
  const searchAnchorMobile = document.createElement('a');
  searchAnchorMobile.href = '#';
  searchAnchorMobile.dataset.once = 'search-stop-propagation';
  searchAnchorMobile.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
    </svg>
    <span data-once="search-stop-propagation"> Search</span>
  `;
  searchLiMobile.append(searchAnchorMobile);
  iconNavMobileUl.append(searchLiMobile);
  mainUl.append(iconNavMobile); // Append mobile icon nav to mainUl for responsive display

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.dataset.once = 'search-stop-propagation';
  searchScreenWrap.innerHTML = `
    <div class="wrap" data-once="search-stop-propagation">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
        <div class="search-wrap" data-once="search-stop-propagation">
          <div class="search-icon" data-once="search-stop-propagation">
            <svg viewBox="0 0 21 21" fill="none" data-once="search-stop-propagation">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
            </svg>
          </div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off" data-once="search-stop-propagation"/>
          <button class="submit-button" data-once="search-stop-propagation">
            <div class="label" data-once="search-stop-propagation"> Submit </div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" data-once="search-stop-propagation">
              <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black" data-once="search-stop-propagation"></path>
            </svg>
          </button>
        </div>
        <div class="searchResultBox" style="display: none;" data-once="search-stop-propagation">
          <div class="swiper scrollSwiper" data-once="search-stop-propagation">
            <div class="swiper-wrapper" data-once="search-stop-propagation">
              <div class="swiper-slide" data-once="search-stop-propagation">
              </div>
            </div>
          </div>
          <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
        </div>
      </form>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <!-- TODO: Read these keywords from a cell in block.children if they are not hardcoded. -->
            <li data-once="search-stop-propagation">Business</li>
            <li data-once="search-stop-propagation">FY 21</li>
            <li data-once="search-stop-propagation">Brands</li>
            <li data-once="search-stop-propagation">XUV700</li>
            <li data-once="search-stop-propagation">Global</li>
            <li data-once="search-stop-propagation">Nanhi Kali</li>
          </ul>
        </div>
      </div>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <!-- TODO: Read these keywords from a cell in block.children if they are not hardcoded. -->
            <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
            <li data-once="search-stop-propagation">Leadership Announcement</li>
            <li data-once="search-stop-propagation">Latest Press Release</li>
            <li data-once="search-stop-propagation">Brand Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  searchLiMobile.append(searchScreenWrap.cloneNode(true)); // Append search screen to mobile search

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const iconNavDesktopUl = document.createElement('ul');
  iconNavDesktop.append(iconNavDesktopUl);

  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailAnchorDesktop = document.createElement('a');
  // TODO: Read this link from a cell if it's not hardcoded.
  mailAnchorDesktop.href = '/contact-us';
  mailAnchorDesktop.innerHTML = `
    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
    </svg>
  `;
  mailLiDesktop.append(mailAnchorDesktop);
  iconNavDesktopUl.append(mailLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  searchLiDesktop.dataset.once = 'search-toggle search-stop-propagation';
  const searchAnchorDesktop = document.createElement('a');
  searchAnchorDesktop.href = '#';
  searchAnchorDesktop.dataset.once = 'search-stop-propagation';
  searchAnchorDesktop.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
    </svg>
  `;
  searchLiDesktop.append(searchAnchorDesktop);
  searchLiDesktop.append(searchScreenWrap.cloneNode(true)); // Append search screen to desktop search
  iconNavDesktopUl.append(searchLiDesktop);
  mainNav.append(iconNavDesktop);

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = year80LogoLinkRow.querySelector('a')?.href || '#';
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      year80LogoLink.append(optimizedPic);
      year80LogoLink.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    }
  }
  moveInstrumentation(year80LogoRow, year80LogoLink);
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.replaceChildren(header);

  // Event listeners for hamburger and search
  const hamburgerBtn = header.querySelector('.hamburger');
  const mainNavigation = header.querySelector('.main-nav');
  const searchToggleButtons = header.querySelectorAll('.search > a');
  const searchScreens = header.querySelectorAll('.search-screen-wrap'); // Select all search screens

  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    mainNavigation.classList.toggle('active');
    document.body.classList.toggle('disable-scroll');
  });

  searchToggleButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = button.closest('li.search');
      parentLi.classList.toggle('active');
      const currentSearchScreen = parentLi.querySelector('.search-screen-wrap');
      if (currentSearchScreen) {
        currentSearchScreen.style.display = currentSearchScreen.style.display === 'block' ? 'none' : 'block';
      }
    });
  });

  // Close search screen when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search')) {
      header.querySelectorAll('.search').forEach((searchEl) => {
        searchEl.classList.remove('active');
        const currentSearchScreen = searchEl.querySelector('.search-screen-wrap');
        if (currentSearchScreen) {
          currentSearchScreen.style.display = 'none';
        }
      });
    }
  });

  // Prevent search screen clicks from propagating and closing it
  searchScreens.forEach((screen) => {
    screen.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Swiper initialization for search results
  const swiperContainers = header.querySelectorAll('.swiper.scrollSwiper');
  if (swiperContainers.length > 0) {
    await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

    swiperContainers.forEach((swiperEl) => {
      // eslint-disable-next-line no-undef
      new Swiper(swiperEl, {
        slidesPerView: 'auto',
        loop: false, // Assuming loop is false based on original HTML absence
        // navigation: { prevEl: prevBtn, nextEl: nextBtn }, // Add if navigation buttons are present
        pagination: { el: swiperEl.nextElementSibling, clickable: true }, // Assuming swiper-scrollbar is next sibling
      });
    });
  }
}
