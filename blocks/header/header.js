import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes to li and a elements from original HTML
    li.classList.add('top-level-li'); // Example class, adjust based on actual HTML
    if (anchor) {
      anchor.classList.add('nav-link'); // Example class, adjust based on actual HTML
    }

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

      // Apply classes to nested ul and li elements
      nested.querySelectorAll('li').forEach((nestedLi) => {
        nestedLi.classList.add('first-level-li'); // Example class, adjust based on actual HTML
        const nestedAnchor = nestedLi.querySelector(':scope > a');
        if (nestedAnchor) {
          nestedAnchor.classList.add('nav-link'); // Example class, adjust based on actual HTML
        }
        const innerNested = nestedLi.querySelector(':scope > ul');
        if (innerNested) {
          const innerSubWrap = document.createElement('div');
          innerSubWrap.classList.add('has-inner-sub-child'); // Class from ORIGINAL HTML
          innerSubWrap.append(innerNested);
          nestedLi.append(innerSubWrap);
        }
      });

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
  // Destructure root rows based on BlockJson model
  const [
    logoRow,
    logoLinkRow,
    year80LogoRow,
    year80LogoLinkRow,
    ...itemRows // All item rows are after the fixed root fields
  ] = [...block.children];

  const header = document.createElement('header');
  // Classes from ORIGINAL HTML: main-header, with-marquee, solid
  header.classList.add('main-header', 'with-marquee', 'solid');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

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
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  moveInstrumentation(logoRow, logoDiv);
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

  // Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);
  wrapDiv.append(mainNav);

  // Separate item rows using content detection (cell count and content)
  const navigationItems = itemRows.filter((row) => row.children.length === 4);
  // Press release items have 4 cells and contain an anchor and a time element
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('a') && row.querySelector('time'));
  const iconLinkItems = itemRows.filter((row) => row.children.length === 2);

  // Navigation Menu
  navigationItems.forEach((row) => {
    // Destructure cells for fixed schema navigation-item
    const [labelCell, linkCell, megaContentCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);

    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
    arrowSvg.setAttribute('fill', '#000000');
    arrowSvg.setAttribute('stroke', '#000000');
    arrowSvg.setAttribute('stroke-width', '4.851456000000001');
    arrowSvg.innerHTML = `
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
        <g id="SVGRepo_iconCarrier">
          <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
            <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
          </g>
        </g>
      `;
    const span = document.createElement('span');
    span.append(arrowSvg);

    li.append(anchor, span);

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
    leftDiv.innerHTML = megaContentCell?.innerHTML || '';
    moveInstrumentation(megaContentCell, leftDiv);
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav'); // Example class from ORIGINAL HTML
    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Move instrumentation for the UL
      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
    }
    centerDiv.append(subNavWrap);

    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Icon Links (Contact Us, Search)
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');

  const createIconLink = (label, href, isSearch = false, originalRow) => {
    const li = document.createElement('li');
    li.classList.add(label.toLowerCase().replace(/\s/g, '-'));

    const link = document.createElement('a');
    link.href = href;
    // link.textContent = label; // Text content is replaced by SVG for icons

    if (isSearch) {
      li.classList.add('search');
      link.href = '#'; // Search link is a trigger
      const lensSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      lensSvg.setAttribute('viewBox', '0 0 21 21');
      lensSvg.setAttribute('fill', 'none');
      lensSvg.classList.add('lens');
      lensSvg.innerHTML = `
        <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
      `;
      const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      closeSvg.setAttribute('viewBox', '0 0 50 50');
      closeSvg.classList.add('close');
      closeSvg.innerHTML = `
        <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
      `;
      link.innerHTML = ''; // Clear text content for search icon
      const searchSpan = document.createElement('span');
      searchSpan.textContent = ' Search';
      link.append(lensSvg, closeSvg, searchSpan);

      const searchScreenWrap = document.createElement('div');
      searchScreenWrap.classList.add('search-screen-wrap');
      searchScreenWrap.style.display = 'none'; // Initially hidden
      const searchWrapInner = document.createElement('div');
      searchWrapInner.classList.add('wrap');
      searchScreenWrap.append(searchWrapInner);

      const searchForm = document.createElement('form');
      searchForm.action = 'https://www.mahindra.com/search'; // Example action from ORIGINAL HTML
      searchForm.method = 'get';
      searchForm.id = 'search-block-form';
      searchWrapInner.append(searchForm);

      const searchInputWrap = document.createElement('div');
      searchInputWrap.classList.add('search-wrap');
      const searchIconDiv = document.createElement('div');
      searchIconDiv.classList.add('search-icon');
      const searchIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      searchIconSvg.setAttribute('viewBox', '0 0 21 21');
      searchIconSvg.setAttribute('fill', 'none');
      searchIconSvg.innerHTML = `
        <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
      `;
      searchIconDiv.append(searchIconSvg);
      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.classList.add('input-text', 'searchtext');
      searchInput.required = true;
      searchInput.name = 'key';
      searchInput.id = 'searchInput';
      searchInput.autocomplete = 'off';
      const submitButton = document.createElement('button');
      submitButton.classList.add('submit-button');
      submitButton.innerHTML = `
        <div class="label"> Submit </div>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
        </svg>
      `;
      searchInputWrap.append(searchIconDiv, searchInput, submitButton);
      searchForm.append(searchInputWrap);

      // Search toggle logic
      link.addEventListener('click', (e) => {
        e.preventDefault();
        searchScreenWrap.style.display = searchScreenWrap.style.display === 'none' ? 'block' : 'none';
        li.classList.toggle('active');
        document.body.classList.toggle('search-active', searchScreenWrap.style.display === 'block');
      });

      li.append(searchScreenWrap);
    } else {
      const mailSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      mailSvg.setAttribute('version', '1.1');
      mailSvg.setAttribute('id', 'Layer_1');
      mailSvg.setAttribute('x', '0px');
      mailSvg.setAttribute('y', '0px');
      mailSvg.setAttribute('viewBox', '0 0 48 38.4');
      mailSvg.setAttribute('style', 'enable-background:new 0 0 48 38.4;');
      mailSvg.setAttribute('xml:space', 'preserve');
      mailSvg.setAttribute('width', '21');
      mailSvg.setAttribute('height', '21');
      mailSvg.innerHTML = `
        <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                  C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                  L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" />
      `;
      link.textContent = ''; // Clear text content for mail icon
      link.append(mailSvg);
    }
    li.prepend(link);
    if (originalRow) {
      moveInstrumentation(originalRow, li); // Move instrumentation for the icon link row
    }
    return li;
  };

  const mobileIconUl = document.createElement('ul');
  const desktopIconUl = document.createElement('ul');

  iconLinkItems.forEach((row) => {
    // Destructure cells for fixed schema icon-link-item
    const [labelCell, linkCell] = [...row.children];
    const label = labelCell.textContent.trim();
    const href = linkCell?.querySelector('a')?.href || '#';
    const isSearch = label.toLowerCase() === 'search';

    const iconLi = createIconLink(label, href, isSearch, row);
    mobileIconUl.append(iconLi.cloneNode(true)); // Clone for mobile
    desktopIconUl.append(iconLi); // Use original for desktop
  });

  iconNavMobile.append(mobileIconUl);
  iconNavDesktop.append(desktopIconUl);
  navUl.append(iconNavMobile); // For mobile menu
  wrapDiv.append(iconNavDesktop); // For desktop menu

  // Year 80 Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = year80LogoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  const year80LogoPicture = year80LogoRow?.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    year80LogoLink.append(optimizedPic);
  }
  year80LogoDiv.append(year80LogoLink);
  moveInstrumentation(year80LogoRow, year80LogoDiv);
  wrapDiv.append(year80LogoDiv);

  // Hamburger menu toggle
  hamburgerDiv.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    document.body.classList.toggle('nav-active');
  });

  // Replace block content
  block.replaceChildren(header);

  // Initialize Swiper for search results if present
  const searchResultBox = block.querySelector('.searchResultBox');
  if (searchResultBox) {
    const swiperEl = searchResultBox.querySelector('.scrollSwiper');
    const swiperWrapper = swiperEl.querySelector('.swiper-wrapper');
    const swiperScrollbar = searchResultBox.querySelector('.swiper-scrollbar');

    if (swiperEl && swiperWrapper && swiperScrollbar) {
      await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
      await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

      // eslint-disable-next-line no-undef
      new Swiper(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        loop: false,
        scrollbar: {
          el: swiperScrollbar,
          hide: true,
        },
      });
    }
  }
}
