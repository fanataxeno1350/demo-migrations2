import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes from ORIGINAL HTML to li elements
    li.classList.add('top-level-li'); // Example: if li is a top-level item
    if (li.querySelector(':scope > ul')) {
      li.classList.add('has-sub-child'); // Example: if li has a nested ul
    }

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

      // Add classes to nested <ul> and <li> elements
      nested.querySelectorAll('li').forEach((nestedLi) => {
        nestedLi.classList.add('first-level-li'); // Example class
        if (nestedLi.querySelector(':scope > ul')) {
          const innerSubChildDiv = document.createElement('div');
          innerSubChildDiv.classList.add('has-inner-sub-child'); // Class from ORIGINAL HTML
          const innerUl = nestedLi.querySelector(':scope > ul');
          if (innerUl) {
            innerUl.remove();
            innerSubChildDiv.append(innerUl);
            nestedLi.append(innerSubChildDiv);

            const innerTrigger = nestedLi.querySelector(':scope > a, :scope > span');
            if (innerTrigger) {
              innerTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                nestedLi.classList.toggle('active-child'); // Class from ORIGINAL HTML
                innerSubChildDiv.classList.toggle('active-child'); // Class from ORIGINAL HTML
              });
            }
          }
        }
      });

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Class from ORIGINAL HTML
          subWrap.classList.toggle('active'); // Class from ORIGINAL HTML
        });
      }
    }
  });
}

export default async function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid');
  moveInstrumentation(block, header);

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
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) logoLink.href = logoAnchor.href;
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
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  const navigationItems = itemRows.filter((row) => row.children.length === 4);
  // Filter pressReleaseItems more robustly based on content, not just length
  const pressReleaseItems = itemRows.filter((row) => {
    if (row.children.length === 4) {
      const [prLinkCell, prTitleCell, prDateCell, prCategoryCell] = [...row.children];
      // Check if it looks like a press release item (e.g., first cell has a link and no nested ul in hierarchy cell)
      return prLinkCell.querySelector('a') && !prTitleCell.querySelector('ul') && !prDateCell.querySelector('ul') && !prCategoryCell.querySelector('ul');
    }
    return false;
  });


  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell, leftSectionCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.append(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    leftDiv.innerHTML = leftSectionCell.innerHTML;
    moveInstrumentation(leftSectionCell, leftDiv);
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      // Create a temporary div to hold the hierarchy content for instrumentation and transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell to tempDiv

      const rootUlToTransform = tempDiv.querySelector('ul');
      if (rootUlToTransform) {
        transformNestedLists(rootUlToTransform);
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      }
    }
    centerDiv.append(subNavWrap);

    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);
    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);

    // Add event listener for mega-menu hover
    li.addEventListener('mouseenter', () => {
      li.classList.add('active');
    });
    li.addEventListener('mouseleave', () => {
      li.classList.remove('active');
    });
  });

  // Latest Press Releases
  const newsroomLi = navUl.querySelector('li.has-child a[href*="/newsroom"]')?.closest('li');
  if (newsroomLi) {
    const leftDiv = newsroomLi.querySelector('.mega-menu .left-div');
    if (leftDiv) {
      const latestPressReleaseDiv = document.createElement('div');
      latestPressReleaseDiv.classList.add('latest-two-press-release');

      pressReleaseItems.slice(0, 2).forEach((row) => {
        const [prLinkCell, prTitleCell, prDateCell, prCategoryCell] = [...row.children];

        const slidesDiv = document.createElement('div');
        slidesDiv.classList.add('slides');
        const slidesWrap = document.createElement('div');
        slidesWrap.classList.add('wrap');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');

        const prLink = document.createElement('a');
        const foundPrLink = prLinkCell.querySelector('a');
        if (foundPrLink) prLink.href = foundPrLink.href;
        prLink.textContent = prTitleCell.textContent.trim();
        const p = document.createElement('p');
        p.append(prLink);
        descDiv.append(p);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const dateEm = document.createElement('em');
        dateEm.textContent = prDateCell.textContent.trim();
        const categoryEm = document.createElement('em');
        categoryEm.textContent = prCategoryCell.textContent.trim();
        dateDiv.append(dateEm, categoryEm);
        descDiv.append(dateDiv);

        contentDiv.append(descDiv);
        slidesWrap.append(contentDiv);
        slidesDiv.append(slidesWrap);
        latestPressReleaseDiv.append(slidesDiv);
        moveInstrumentation(row, slidesDiv);
      });
      leftDiv.append(latestPressReleaseDiv);
    }
  }

  // Icon Nav (Mobile)
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavMobileUl = document.createElement('ul');

  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailLinkMobile = document.createElement('a');
  mailLinkMobile.href = 'https://www.mahindra.com/contact-us';
  mailLinkMobile.textContent = 'Contact Us';
  mailLiMobile.append(mailLinkMobile);
  iconNavMobileUl.append(mailLiMobile);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  searchLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#';
  searchLinkMobile.setAttribute('data-once', 'search-stop-propagation');
  searchLinkMobile.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
    </svg>
    <span data-once="search-stop-propagation"> Search</span>
  `;
  searchLiMobile.append(searchLinkMobile);
  iconNavMobileUl.append(searchLiMobile);
  iconNavMobile.append(iconNavMobileUl);
  navUl.append(iconNavMobile);

  // Icon Nav (Desktop)
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const iconNavDesktopUl = document.createElement('ul');

  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailLinkDesktop = document.createElement('a');
  mailLinkDesktop.href = 'https://www.mahindra.com/contact-us';
  mailLinkDesktop.innerHTML = `
    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
    </svg>
  `;
  mailLiDesktop.append(mailLinkDesktop);
  iconNavDesktopUl.append(mailLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  searchLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#';
  searchLinkDesktop.setAttribute('data-once', 'search-stop-propagation');
  searchLinkDesktop.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
    </svg>
  `;
  searchLiDesktop.append(searchLinkDesktop);
  iconNavDesktopUl.append(searchLiDesktop);
  iconNavDesktop.append(iconNavDesktopUl);
  nav.append(iconNavDesktop);

  // Search Screen Wrap
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  // Clone and append to both mobile and desktop search list items
  searchLiMobile.append(searchScreenWrap.cloneNode(true));
  searchLiDesktop.append(searchScreenWrap.cloneNode(true));

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  const anniversaryLogoAnchor = anniversaryLogoLinkRow.querySelector('a');
  if (anniversaryLogoAnchor) anniversaryLogoLink.href = anniversaryLogoAnchor.href;
  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    anniversaryLogoLink.append(optimizedPic);
  }
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  anniversaryLogoDiv.append(anniversaryLogoLink);
  wrap.append(anniversaryLogoDiv);

  block.replaceChildren(header);

  // Event Listeners for search functionality
  const searchToggleElements = header.querySelectorAll('[data-once*="search-toggle"]');
  searchToggleElements.forEach((searchToggle) => {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const searchScreen = searchToggle.querySelector('.search-screen-wrap');
      if (searchScreen) {
        searchScreen.classList.toggle('active');
        searchToggle.classList.toggle('active');
        document.body.classList.toggle('search-open');
      }
    });
  });

  const hamburgerToggle = header.querySelector('.hamburger');
  const mainNav = header.querySelector('.main-nav');
  if (hamburgerToggle && mainNav) {
    hamburgerToggle.addEventListener('click', () => {
      hamburgerToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
  }

  // Scroll behavior for header
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 0) {
      header.classList.add('nav-up');
    } else {
      header.classList.remove('nav-up');
    }
    lastScrollY = window.scrollY;
  });
}
