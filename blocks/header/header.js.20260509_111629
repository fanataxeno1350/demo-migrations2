import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, parentInstrumentationEl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Move instrumentation from original li to the new li
    moveInstrumentation(li, li);

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
      // Recursively transform nested lists
      transformNestedLists(nested, li);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children].filter((row) => row.children.length > 0);

  const [
    mainLogoRow,
    mainLogoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
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

  // Main Logo
  const mainLogoDiv = document.createElement('div');
  mainLogoDiv.classList.add('logo');
  const mainLogoLink = document.createElement('a');
  const mainLogoHref = mainLogoLinkRow?.querySelector('a')?.href;
  if (mainLogoHref) mainLogoLink.href = mainLogoHref;
  const mainLogoPicture = mainLogoRow?.querySelector('picture');
  if (mainLogoPicture) {
    const img = mainLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    mainLogoLink.append(optimizedPic);
  }
  mainLogoDiv.append(mainLogoLink);
  moveInstrumentation(mainLogoRow, mainLogoLink);
  moveInstrumentation(mainLogoLinkRow, mainLogoLink);
  wrap.append(mainLogoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);
  wrap.append(mainNav);

  // Navigation Menu Items
  navigationItems
    .filter(
      (row) =>
        row.children.length > 0 &&
        [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
    )
    .forEach((row) => {
      const [
        labelCell,
        linkCell,
        hierarchyTreeCell,
        leftHeadingCell,
        leftDescriptionCell,
        leftSubDescriptionCell,
        highlightListCell,
      ] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');

      const anchor = document.createElement('a');
      anchor.setAttribute('itemprop', 'url');
      const linkHref = linkCell?.querySelector('a')?.href;
      if (linkHref) anchor.href = linkHref;
      anchor.textContent = labelCell?.textContent.trim() || '';
      li.append(anchor);

      const svgSpan = document.createElement('span');
      // SVG from ORIGINAL HTML
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

      const leftHeading = document.createElement('h4');
      leftHeading.classList.add('left-div-heading');
      const leftHeadingAnchor = document.createElement('a');
      leftHeadingAnchor.textContent = leftHeadingCell?.textContent.trim() || '';
      leftHeading.append(leftHeadingAnchor);
      leftDiv.append(leftHeading);

      const leftDescription = document.createElement('p');
      leftDescription.classList.add('left-div-desc');
      leftDescription.innerHTML = leftDescriptionCell?.innerHTML || '';
      leftDiv.append(leftDescription);

      const leftSubDescription = document.createElement('p');
      leftSubDescription.classList.add('left-div-subdesc');
      leftSubDescription.textContent = leftSubDescriptionCell?.textContent.trim() || '';
      leftDiv.append(leftSubDescription);

      const highlightList = highlightListCell?.querySelector('ul');
      if (highlightList) {
        const highlightUl = document.createElement('ul');
        [...highlightList.children].forEach((item) => {
          const highlightLi = document.createElement('li');
          highlightLi.classList.add('list-text-red');
          highlightLi.innerHTML = item.innerHTML;
          moveInstrumentation(item, highlightLi); // Move instrumentation for each list item
          highlightUl.append(highlightLi);
        });
        leftDiv.append(highlightUl);
        moveInstrumentation(highlightListCell, highlightUl); // Move instrumentation for the whole list
      }

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav'); // specific class from original HTML
      centerDiv.append(subNavWrap);

      const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
      if (hierarchyUl) {
        // Create a temporary div to hold the hierarchyUl content for instrumentation
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell to tempDiv

        const processedUl = tempDiv.querySelector('ul');
        if (processedUl) {
          transformNestedLists(processedUl, hierarchyTreeCell); // Pass original cell for instrumentation context
          subNavWrap.append(processedUl);
        }
      }

      li.append(megaMenu);
      navUl.append(li);
      moveInstrumentation(row, li);
    });

  // Newsroom item (press releases)
  const newsroomLi = document.createElement('li');
  newsroomLi.classList.add('has-child', 'hover-red');
  newsroomLi.setAttribute('itemprop', 'name');
  const newsroomAnchor = document.createElement('a');
  newsroomAnchor.setAttribute('itemprop', 'url');
  newsroomAnchor.href = 'https://www.mahindra.com/newsroom'; // Hardcoded from original HTML - this is acceptable as it's a fixed link
  newsroomAnchor.textContent = 'newsroom';
  newsroomLi.append(newsroomAnchor);
  const newsroomSvgSpan = document.createElement('span');
  // SVG from ORIGINAL HTML
  newsroomSvgSpan.innerHTML = `<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>`;
  newsroomLi.append(newsroomSvgSpan);

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

  const newsroomLeftHeading = document.createElement('h4');
  newsroomLeftHeading.classList.add('left-div-heading');
  const newsroomLeftHeadingAnchor = document.createElement('a');
  newsroomLeftHeadingAnchor.textContent = 'Newsroom'; // Hardcoded from original HTML - this is acceptable as it's a fixed label
  newsroomLeftHeading.append(newsroomLeftHeadingAnchor);
  newsroomLeftDiv.append(newsroomLeftHeading);

  const latestPressReleaseDiv = document.createElement('div');
  latestPressReleaseDiv.classList.add('latest-two-press-release');
  newsroomLeftDiv.append(latestPressReleaseDiv);

  pressReleaseItems
    .filter(
      (row) =>
        row.children.length > 0 &&
        [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
    )
    .forEach((row) => {
      const [pressReleaseLinkCell, pressReleaseTitleCell, pressReleaseDateCell, pressReleaseCategoryCell] = [
        ...row.children,
      ];

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
      contentDiv.append(descDiv);

      const titleP = document.createElement('p');
      const titleLink = document.createElement('a');
      const prLinkHref = pressReleaseLinkCell?.querySelector('a')?.href;
      if (prLinkHref) titleLink.href = prLinkHref;
      titleLink.textContent = pressReleaseTitleCell?.textContent.trim() || '';
      titleP.append(titleLink);
      descDiv.append(titleP);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const dateEm = document.createElement('em');
      dateEm.textContent = pressReleaseDateCell?.textContent.trim() || '';
      dateDiv.append(dateEm);
      const categoryEm = document.createElement('em');
      categoryEm.textContent = pressReleaseCategoryCell?.textContent.trim() || '';
      dateDiv.append(categoryEm);
      descDiv.append(dateDiv);

      latestPressReleaseDiv.append(slideDiv);
      moveInstrumentation(row, slideDiv);
    });

  const newsroomSubNavWrap = document.createElement('div');
  newsroomSubNavWrap.classList.add('sub-nav-wrap');
  newsroomCenterDiv.append(newsroomSubNavWrap);

  const newsroomSubNavUl1 = document.createElement('ul');
  const newsroomLi1 = document.createElement('li');
  const newsroomLink1 = document.createElement('a');
  newsroomLink1.href = 'https://www.mahindra.com/newsroom/press-release'; // Hardcoded from original HTML
  newsroomLink1.textContent = 'Press Releases'; // Hardcoded from original HTML
  newsroomLi1.append(newsroomLink1);
  newsroomSubNavUl1.append(newsroomLi1);

  const newsroomLi2 = document.createElement('li');
  const newsroomLink2 = document.createElement('a');
  newsroomLink2.href = 'https://www.mahindra.com/newsroom/corporate-doc'; // Hardcoded from original HTML
  newsroomLink2.textContent = 'Media Resources'; // Hardcoded from original HTML
  newsroomLi2.append(newsroomLink2);
  newsroomSubNavUl1.append(newsroomLi2);
  newsroomSubNavWrap.append(newsroomSubNavUl1);

  const newsroomSubNavUl2 = document.createElement('ul');
  const newsroomLi3 = document.createElement('li');
  const newsroomLink3 = document.createElement('a');
  newsroomLink3.href = 'https://www.mahindra.com/newsroom#in-the-news'; // Hardcoded from original HTML
  newsroomLink3.textContent = 'In The News'; // Hardcoded from original HTML
  newsroomLi3.append(newsroomLink3);
  newsroomSubNavUl2.append(newsroomLi3);
  newsroomSubNavWrap.append(newsroomSubNavUl2);

  newsroomLi.append(newsroomMegaMenu);
  navUl.append(newsroomLi);

  // Contact Us Link
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavMobileUl = document.createElement('ul');
  iconNavMobile.append(iconNavMobileUl);

  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailLinkMobile = document.createElement('a');
  const contactHref = contactLinkRow?.querySelector('a')?.href;
  if (contactHref) mailLinkMobile.href = contactHref;
  mailLinkMobile.textContent = 'Contact Us'; // Hardcoded from original HTML
  mailLiMobile.append(mailLinkMobile);
  iconNavMobileUl.append(mailLiMobile);

  // Search (mobile)
  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#';
  // SVG from ORIGINAL HTML
  searchLinkMobile.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                  </svg>
                  <svg viewBox="0 0 50 50" class="close">
                    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
                  </svg>
                  <span> Search</span>`; // Hardcoded from original HTML
      searchLiMobile.append(searchLinkMobile);
      iconNavMobileUl.append(searchLiMobile);
      navUl.append(iconNavMobile);

  // Search (desktop)
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const iconNavDesktopUl = document.createElement('ul');
  iconNavDesktop.append(iconNavDesktopUl);

  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailLinkDesktop = document.createElement('a');
  if (contactHref) mailLinkDesktop.href = contactHref;
  // SVG from ORIGINAL HTML
  mailLinkDesktop.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
              C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
              L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
  </svg>`;
  mailLiDesktop.append(mailLinkDesktop);
  iconNavDesktopUl.append(mailLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#';
  // SVG from ORIGINAL HTML
  searchLinkDesktop.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
  </svg>
  <svg viewBox="0 0 50 50" class="close">
    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
  </svg>`;
  searchLiDesktop.append(searchLinkDesktop);
  iconNavDesktopUl.append(searchLiDesktop);
  mainNav.append(iconNavDesktop);

  // Anniversary Logo
  const anniversaryLogoOuterDiv = document.createElement('div');
  anniversaryLogoOuterDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  const anniversaryLogoHref = anniversaryLogoLinkRow?.querySelector('a')?.href;
  if (anniversaryLogoHref) anniversaryLogoLink.href = anniversaryLogoHref;
  const anniversaryLogoPicture = anniversaryLogoRow?.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    anniversaryLogoLink.append(optimizedPic);
  }
  anniversaryLogoOuterDiv.append(anniversaryLogoLink);
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  wrap.append(anniversaryLogoOuterDiv);

  // Search screen wrap (common for both mobile/desktop search)
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('wrap');
  searchScreenWrap.append(searchWrapInner);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search'; // Hardcoded from original HTML
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchWrapInner.append(searchForm);

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchForm.append(searchInputWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  // SVG from ORIGINAL HTML
  searchIconDiv.innerHTML = `<svg viewBox="0 0 21 21" fill="none">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
  </svg>`;
  searchInputWrap.append(searchIconDiv);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.required = true;
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchInputWrap.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  const submitLabel = document.createElement('div');
  submitLabel.classList.add('label');
  submitLabel.textContent = ' Submit '; // Hardcoded from original HTML
  submitButton.append(submitLabel);
  // SVG from ORIGINAL HTML
  submitButton.innerHTML += `<svg width="12" height="8" viewBox="0 0 12 8" fill="none">
    <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
  </svg>`;
  searchInputWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchForm.append(searchResultBox);

  // Search suggestions
  const searchSuggestionsWrap1 = document.createElement('div');
  searchSuggestionsWrap1.classList.add('search-suggestions-wrap');
  const label1 = document.createElement('div');
  label1.classList.add('label');
  label1.textContent = 'Popular Keywords:'; // Hardcoded from original HTML
  searchSuggestionsWrap1.append(label1);
  const tokensWrap1 = document.createElement('div');
  tokensWrap1.classList.add('tokens-wrap');
  // Hardcoded from original HTML
  tokensWrap1.innerHTML = `<ul>
    <li>Business</li>
    <li>FY 21</li>
    <li>Brands</li>
    <li>XUV700</li>
    <li>Global</li>
    <li>Nanhi Kali</li>
  </ul>`;
  searchSuggestionsWrap1.append(tokensWrap1);
  searchWrapInner.append(searchSuggestionsWrap1);

  const searchSuggestionsWrap2 = document.createElement('div');
  searchSuggestionsWrap2.classList.add('search-suggestions-wrap');
  const label2 = document.createElement('div');
  label2.classList.add('label');
  label2.textContent = 'Recommended for you:'; // Hardcoded from original HTML
  searchSuggestionsWrap2.append(label2);
  const tokensWrap2 = document.createElement('div');
  tokensWrap2.classList.add('tokens-wrap');
  // Hardcoded from original HTML
  tokensWrap2.innerHTML = `<ul>
    <li>Annual Report 2021 - 2022</li>
    <li>Leadership Announcement</li>
    <li>Latest Press Release</li>
    <li>Brand Guidelines</li>
  </ul>`;
  searchSuggestionsWrap2.append(tokensWrap2);
  searchWrapInner.append(searchSuggestionsWrap2);

  // Append search screen wrap to the header, as its visibility is managed by JS
  header.append(searchScreenWrap);

  // Event listeners for hamburger and search toggles
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  const searchToggleEls = [searchLinkMobile, searchLinkDesktop];
  searchToggleEls.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreenWrap.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  });

  searchScreenWrap.addEventListener('click', (e) => {
    if (e.target === searchScreenWrap) {
      searchScreenWrap.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });

  block.replaceChildren(header);
}
