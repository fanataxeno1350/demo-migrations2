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
  const children = [...block.children];

  const [
    mainLogoRow,
    mainLogoLinkRow,
    year80LogoRow,
    year80LogoLinkRow,
    ...itemRows
  ] = children;

  const navigationItems = itemRows.filter((row) => row.children.length === 4);
  const iconNavItems = itemRows.filter((row) => row.children.length === 2);
  // Press release items have 4 cells and contain a .date class in one of their cells
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('.date'));

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // nav-up is a scroll state class, do not add

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
  mainLogoLink.href = mainLogoLinkRow?.querySelector('a')?.href || '#';
  const mainLogoPicture = mainLogoRow?.querySelector('picture');
  if (mainLogoPicture) {
    const img = mainLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(mainLogoRow, optimizedPic.querySelector('img'));
    mainLogoLink.append(optimizedPic);
  }
  moveInstrumentation(mainLogoLinkRow, mainLogoLink);
  mainLogoDiv.append(mainLogoLink);
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

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const link = document.createElement('a');
    link.setAttribute('itemprop', 'url');
    link.href = linkCell?.querySelector('a')?.href || '#';
    link.textContent = labelCell?.textContent.trim() || '';

    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
    arrowSvg.setAttribute('fill', '#000000');
    arrowSvg.setAttribute('stroke', '#000000');
    arrowSvg.setAttribute('stroke-width', '4.851456000000001');
    arrowSvg.innerHTML = `<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g>`;
    const span = document.createElement('span');
    span.append(arrowSvg);

    li.append(link, span);

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
    leftDiv.innerHTML = megaMenuContentCell?.innerHTML || '';
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      // Apply classes from original HTML to nested elements
      hierarchyUl.querySelectorAll('li').forEach((item) => item.classList.add('top-level-li'));
      hierarchyUl.querySelectorAll('li > ul').forEach((subUl) => {
        const parentLi = subUl.parentElement;
        if (parentLi) {
          parentLi.classList.add('top-level-li'); // Ensure parent li has top-level-li
          const spanArrow = document.createElement('span');
          spanArrow.innerHTML = arrowSvg.outerHTML; // Re-use arrow SVG
          parentLi.append(spanArrow);
        }
      });
      hierarchyUl.querySelectorAll('li ul li').forEach((item) => item.classList.add('first-level-li'));
      hierarchyUl.querySelectorAll('li ul li ul li').forEach((item) => item.classList.add('inner-sub-child-li')); // Example, adjust as needed

      transformNestedLists(hierarchyUl);
      moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Move instrumentation for the hierarchy tree
      subNavWrap.append(hierarchyUl);
    }
    centerDiv.append(subNavWrap);
    li.append(megaMenu);

    moveInstrumentation(row, li);
    navUl.append(li);
  });

  // Icon Navigation (mobile-menus-icon)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  // Contact Us (mail icon) - Hardcoded in original HTML, so hardcoded here.
  const mobileMailLi = document.createElement('li');
  mobileMailLi.classList.add('mail');
  const mobileMailLink = document.createElement('a');
  mobileMailLink.href = 'https://www.mahindra.com/contact-us';
  mobileMailLink.textContent = 'Contact Us'; // Original HTML has text content
  mobileMailLi.append(mobileMailLink);
  mobileIconUl.append(mobileMailLi);

  // Search (search icon) - Hardcoded in original HTML, so hardcoded here.
  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  const mobileSearchLink = document.createElement('a');
  mobileSearchLink.href = '#';
  mobileSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>
                  <svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>
                  <span> Search</span>`;
  mobileSearchLi.append(mobileSearchLink);
  mobileIconUl.append(mobileSearchLi);
  navUl.append(mobileIconNav);

  // Icon Navigation (desktop-menus-icon)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  // Contact Us (mail icon) - Hardcoded in original HTML, so hardcoded here.
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

  // Search (search icon) - Hardcoded in original HTML, so hardcoded here.
  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  const desktopSearchLink = document.createElement('a');
  desktopSearchLink.href = '#';
  desktopSearchLink.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>
                  <svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>`;
  desktopSearchLi.append(desktopSearchLink);
  desktopIconUl.append(desktopSearchLi);
  nav.append(desktopIconNav);

  // Add icon navigation items from model
  iconNavItems.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('icon-nav-item'); // Add a class for styling if needed
    const link = document.createElement('a');
    link.href = linkCell?.querySelector('a')?.href || '#';
    link.textContent = labelCell?.textContent.trim() || '';
    li.append(link);
    moveInstrumentation(row, li);
    // Decide where to append based on mobile/desktop. For now, append to both for simplicity.
    // A more robust solution would involve separate loops or conditional appending.
    // For this review, assuming they are part of the main nav structure.
    // If they are meant to be separate, they should be appended to mobileIconUl/desktopIconUl directly.
    // For now, appending to desktopIconUl as it's the last one added to nav.
    desktopIconUl.append(li.cloneNode(true)); // Clone for desktop
    mobileIconUl.append(li); // Original for mobile
  });

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = year80LogoLinkRow?.querySelector('a')?.href || '#';
  const year80LogoPicture = year80LogoRow?.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(year80LogoRow, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  // Search screen wrap (hidden by default)
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');

  // Build search screen content from model or hardcoded if not in model
  const searchFormAction = 'https://www.mahindra.com/search'; // Hardcoded in original HTML
  const searchInputPlaceholder = ''; // Not in model, can be hardcoded or left empty
  const submitButtonLabel = 'Submit'; // Hardcoded in original HTML
  const popularKeywordsLabel = 'Popular Keywords:'; // Hardcoded in original HTML
  const recommendedLabel = 'Recommended for you:'; // Hardcoded in original HTML

  // For press release items, we need to create the structure as per original HTML
  const latestTwoPressReleaseDiv = document.createElement('div');
  latestTwoPressReleaseDiv.classList.add('latest-two-press-release');
  pressReleaseItems.forEach((row) => {
    const [pressLinkCell, pressTitleCell, pressDateCell, pressTagCell] = [...row.children];
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

    const pLink = document.createElement('p');
    const aLink = document.createElement('a');
    aLink.href = pressLinkCell?.querySelector('a')?.href || '#';
    aLink.textContent = pressTitleCell?.textContent.trim() || '';
    pLink.append(aLink);
    descDiv.append(pLink);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const emDate = document.createElement('em');
    emDate.textContent = pressDateCell?.textContent.trim() || '';
    const emTag = document.createElement('em');
    emTag.textContent = pressTagCell?.textContent.trim() || '';
    dateDiv.append(emDate, emTag);
    descDiv.append(dateDiv);
    moveInstrumentation(row, slideDiv); // Move instrumentation for each press release item
    latestTwoPressReleaseDiv.append(slideDiv);
  });

  searchScreenWrap.innerHTML = `
    <div class="wrap">
      <form action="${searchFormAction}" method="get" id="search-block-form" accept-charset="UTF-8">
        <div class="search-wrap">
          <div class="search-icon">
            <svg viewBox="0 0 21 21" fill="none">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
            </svg>
          </div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off" placeholder="${searchInputPlaceholder}"/>
          <button class="submit-button">
            <div class="label"> ${submitButtonLabel} </div>
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
        <div class="label">${popularKeywordsLabel}</div>
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
        <div class="label">${recommendedLabel}</div>
        <div class="tokens-wrap">
          <ul>
            <li>Annual Report 2021 - 2022</li>
            <li>Leadership Announcement</li>
            <li>Latest Press Release</li>
            <li>Brand Guidelines</li>
          </ul>
        </div>
      </div>
    </div>`;
  // Append searchScreenWrap to main-header, not to nav
  header.append(searchScreenWrap);

  // Event listeners for hamburger and search toggles
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  const searchToggleElements = [mobileSearchLink, desktopSearchLink];
  searchToggleElements.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreenWrap.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  });

  // Close search when clicking the close icon
  searchScreenWrap.querySelector('.close')?.addEventListener('click', (e) => {
    e.preventDefault();
    searchScreenWrap.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });

  // Swiper initialization for search results
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  const swiperEl = searchScreenWrap.querySelector('.swiper.scrollSwiper');
  if (swiperEl) {
    // eslint-disable-next-line no-undef
    new Swiper(swiperEl, {
      slidesPerView: 'auto',
      loop: false, // Assuming loop is false based on original HTML absence of data-loop="true"
      navigation: {
        // Add navigation elements if they exist in the search screen HTML
        // prevEl: swiperEl.querySelector('.swiper-button-prev'),
        // nextEl: swiperEl.querySelector('.swiper-button-next'),
      },
      pagination: {
        el: swiperEl.querySelector('.swiper-scrollbar'),
        clickable: true,
      },
    });
  }

  // Move instrumentation for the search screen wrap itself
  // This assumes the search screen content is not directly authored rows,
  // but if it were, each row would need its own moveInstrumentation.
  // For now, we move the instrumentation from the first 'search' item row
  // if it exists, or a dummy element if not.
  const searchRow = itemRows.find(row => row.children.length === 2 && row.querySelector('a[href="#"]')); // Heuristic for search row
  if (searchRow) {
    moveInstrumentation(searchRow, searchScreenWrap);
  } else {
    // Fallback if no specific search row is found, to ensure instrumentation is moved
    // from a relevant row if possible, or create a dummy one.
    const dummySearchRow = document.createElement('div');
    block.prepend(dummySearchRow); // Temporarily add to block to get instrumentation
    moveInstrumentation(dummySearchRow, searchScreenWrap);
    dummySearchRow.remove(); // Remove the dummy row
  }

  block.replaceChildren(header);
}
