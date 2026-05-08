import { createOptimizedPicture } from '../../scripts/aem.js';
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
}

export default async function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    logoSecondaryRow,
    logoSecondaryLinkRow,
    contactLinkRow,
    ...itemRows
  ] = children;

  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);

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

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  const ulHamburger = document.createElement('ul');
  [...Array(3)].forEach(() => ulHamburger.append(document.createElement('li')));
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Add event listener for hamburger menu
  hamburger.addEventListener('click', () => {
    header.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  });

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  navigationItems.forEach((row) => {
    const [
      labelCell,
      linkCell,
      hierarchyTreeCell,
      leftPanelHeadingCell,
      leftPanelDescriptionCell,
      leftPanelSubDescriptionCell,
      leftPanelFactsCell,
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = `<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>`;
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
    centerDiv.append(leftDiv);

    const leftDivHeading = document.createElement('h4');
    leftDivHeading.classList.add('left-div-heading');
    const headingLink = document.createElement('a');
    headingLink.textContent = leftPanelHeadingCell.textContent.trim();
    leftDivHeading.append(headingLink);
    leftDiv.append(leftDivHeading);

    const leftDivDesc = document.createElement('p');
    leftDivDesc.classList.add('left-div-desc');
    leftDivDesc.innerHTML = leftPanelDescriptionCell.innerHTML;
    leftDiv.append(leftDivDesc);

    const leftDivSubDesc = document.createElement('p');
    leftDivSubDesc.classList.add('left-div-subdesc');
    leftDivSubDesc.textContent = leftPanelSubDescriptionCell.textContent.trim();
    leftDiv.append(leftDivSubDesc);

    const leftPanelFactsUl = document.createElement('ul');
    leftPanelFactsUl.innerHTML = leftPanelFactsCell.innerHTML;
    leftDiv.append(leftPanelFactsUl);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
    }

    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Contact Us and Search icons (mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  const mobileMailLi = document.createElement('li');
  mobileMailLi.classList.add('mail');
  const mobileMailLink = document.createElement('a');
  mobileMailLink.href = contactLinkRow.querySelector('a')?.href || '#';
  mobileMailLink.textContent = 'Contact Us';
  mobileMailLi.append(mobileMailLink);
  mobileIconUl.append(mobileMailLi);
  moveInstrumentation(contactLinkRow, mobileMailLink);

  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  mobileSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const mobileSearchLink = document.createElement('a');
  mobileSearchLink.href = '#';
  mobileSearchLink.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
  </svg>
  <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
  </svg>
  <span data-once="search-stop-propagation"> Search</span>`;
  mobileSearchLi.append(mobileSearchLink);
  mobileIconUl.append(mobileSearchLi);
  navUl.append(mobileIconNav);

  // Add event listener for mobile search toggle
  mobileSearchLi.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mobileSearchLi.classList.toggle('active');
    // Assuming there's a search-screen-wrap or similar to toggle
    const searchScreenWrap = document.querySelector('.search-screen-wrap');
    if (searchScreenWrap) {
      searchScreenWrap.classList.toggle('active');
    }
  });

  // Newsroom (Press Releases)
  const newsroomLi = document.createElement('li');
  newsroomLi.classList.add('has-child', 'hover-red');
  newsroomLi.setAttribute('itemprop', 'name');
  newsroomLi.setAttribute('data-once', 'nav-close-search');
  const newsroomAnchor = document.createElement('a');
  newsroomAnchor.setAttribute('itemprop', 'url');
  newsroomAnchor.href = '/newsroom'; // Hardcoded in original HTML
  newsroomAnchor.textContent = 'newsroom'; // Hardcoded in original HTML
  newsroomLi.append(newsroomAnchor);
  newsroomLi.append(mobileSearchLink.querySelector('svg').cloneNode(true)); // Re-use the SVG

  const newsroomMegaMenu = document.createElement('div');
  newsroomMegaMenu.classList.add('mega-menu');
  const newsroomMegaMenuWrap = document.createElement('div');
  newsroomMegaMenuWrap.classList.add('wrap', 'container');
  newsroomMegaMenu.append(newsroomMegaMenuWrap);
  const newsroomCenterDiv = document.createElement('div');
  newsroomCenterDiv.classList.add('center-div');
  newsroomMegaMenuWrap.append(newsroomCenterDiv);

  const newsroomLeftDiv = document.createElement('div');
  newsroomLeftDiv.classList.add('left-div', 'newsroom-left-div');
  newsroomCenterDiv.append(newsroomLeftDiv);

  const newsroomLeftDivHeading = document.createElement('h4');
  newsroomLeftDivHeading.classList.add('left-div-heading');
  const newsroomHeadingLink = document.createElement('a');
  newsroomHeadingLink.textContent = 'Newsroom'; // Hardcoded in original HTML
  newsroomLeftDivHeading.append(newsroomHeadingLink);
  newsroomLeftDiv.append(newsroomLeftDivHeading);

  const latestPressReleaseDiv = document.createElement('div');
  latestPressReleaseDiv.classList.add('latest-two-press-release');
  newsroomLeftDiv.append(latestPressReleaseDiv);

  pressReleaseItems.forEach((row) => {
    const [pressLinkCell, headlineCell, dateCell, categoryCell] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    const slidesWrap = document.createElement('div');
    slidesWrap.classList.add('wrap');
    slidesDiv.append(slidesWrap);
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    slidesWrap.append(contentDiv);
    const descDiv = document.createElement('div');
    descDiv.classList.add('desc');
    contentDiv.append(descDiv);

    const pLink = document.createElement('p');
    const pressAnchor = document.createElement('a');
    pressAnchor.href = pressLinkCell.querySelector('a')?.href || '#';
    pressAnchor.textContent = headlineCell.textContent.trim();
    pLink.append(pressAnchor);
    descDiv.append(pLink);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const emTime = document.createElement('em');
    emTime.textContent = dateCell.textContent.trim();
    dateDiv.append(emTime);
    const emCategory = document.createElement('em');
    emCategory.textContent = categoryCell.textContent.trim();
    dateDiv.append(emCategory);
    descDiv.append(dateDiv);
    latestPressReleaseDiv.append(slidesDiv);
    moveInstrumentation(row, slidesDiv);
  });

  const newsroomSubNavWrap = document.createElement('div');
  newsroomSubNavWrap.classList.add('sub-nav-wrap');
  newsroomCenterDiv.append(newsroomSubNavWrap);

  const newsroomUl1 = document.createElement('ul');
  const newsroomLi1 = document.createElement('li');
  const newsroomLink1 = document.createElement('a');
  newsroomLink1.href = 'https://www.mahindra.com/newsroom/press-release'; // Hardcoded in original HTML
  newsroomLink1.textContent = 'Press Releases'; // Hardcoded in original HTML
  newsroomLi1.append(newsroomLink1);
  newsroomUl1.append(newsroomLi1);

  const newsroomLi2 = document.createElement('li');
  const newsroomLink2 = document.createElement('a');
  newsroomLink2.href = 'https://www.mahindra.com/newsroom/corporate-doc'; // Hardcoded in original HTML
  newsroomLink2.textContent = 'Media Resources'; // Hardcoded in original HTML
  newsroomLi2.append(newsroomLink2);
  newsroomUl1.append(newsroomLi2);
  newsroomSubNavWrap.append(newsroomUl1);

  const newsroomUl2 = document.createElement('ul');
  const newsroomLi3 = document.createElement('li');
  const newsroomLink3 = document.createElement('a');
  newsroomLink3.href = 'https://www.mahindra.com/newsroom#in-the-news'; // Hardcoded in original HTML
  newsroomLink3.textContent = 'In The News'; // Hardcoded in original HTML
  newsroomLi3.append(newsroomLink3);
  newsroomUl2.append(newsroomLi3);
  newsroomSubNavWrap.append(newsroomUl2);

  newsroomLi.append(newsroomMegaMenu);
  navUl.append(newsroomLi);

  nav.append(navUl);
  wrap.append(nav);

  // Contact Us and Search icons (desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  const desktopMailLi = document.createElement('li');
  desktopMailLi.classList.add('mail');
  const desktopMailLink = document.createElement('a');
  desktopMailLink.href = contactLinkRow.querySelector('a')?.href || '#';
  desktopMailLink.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
              C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
              L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
  </svg>`;
  desktopMailLi.append(desktopMailLink);
  desktopIconUl.append(desktopMailLi);

  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  desktopSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const desktopSearchLink = document.createElement('a');
  desktopSearchLink.href = '#';
  desktopSearchLink.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
  </svg>
  <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
  </svg>`;
  desktopSearchLi.append(desktopSearchLink);
  desktopIconUl.append(desktopSearchLi);
  nav.append(desktopIconNav);

  // Add event listener for desktop search toggle
  desktopSearchLi.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    desktopSearchLi.classList.toggle('active');
    // Assuming there's a search-screen-wrap or similar to toggle
    const searchScreenWrap = document.querySelector('.search-screen-wrap');
    if (searchScreenWrap) {
      searchScreenWrap.classList.toggle('active');
    }
  });

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = logoSecondaryLinkRow.querySelector('a')?.href || '#';
  const year80LogoPicture = logoSecondaryRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(logoSecondaryRow, year80LogoLink);
  moveInstrumentation(logoSecondaryLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.replaceChildren(header);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
