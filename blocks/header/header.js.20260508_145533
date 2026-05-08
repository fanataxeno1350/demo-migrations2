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
  const [logoRow, logoLinkRow, logo80Row, logo80LinkRow, ...itemRows] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // No nav-up initially
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
  if (logoRow) {
    const logoPicture = logoRow.querySelector('picture');
    const logoAnchor = document.createElement('a');
    if (logoLinkRow) {
      const foundLink = logoLinkRow.querySelector('a');
      if (foundLink) logoAnchor.href = foundLink.href;
      moveInstrumentation(logoLinkRow, logoAnchor);
    }
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoAnchor.append(optimizedPic);
      }
    }
    logoDiv.append(logoAnchor);
    moveInstrumentation(logoRow, logoDiv);
  }
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
  wrap.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  const navigationItems = itemRows.filter((row) => row.children.length === 4);
  // const contactLinkItems = itemRows.filter((row) => row.children.length === 2); // Not used in current rendering logic
  // const pressReleaseItems = itemRows.filter((row) => row.children.length === 4); // Not used in current rendering logic

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell, leftSectionContentCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
    svg.setAttribute('fill', '#000000');
    svg.setAttribute('stroke', '#000000');
    svg.setAttribute('stroke-width', '4.851456000000001');
    svg.innerHTML = `
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g>
      <g id="SVGRepo_iconCarrier">
        <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)">
          <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path>
        </g>
      </g>
    `;
    li.append(document.createElement('span').append(svg));

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
    leftDiv.innerHTML = leftSectionContentCell.innerHTML; // richtext content
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      // Create a temporary div to hold and instrument the hierarchy content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv);

      // Apply classes and transform nested lists
      tempDiv.querySelectorAll('li').forEach((item) => {
        // Add classes from original HTML if applicable, e.g., 'top-level-li', 'first-level-li'
        // For this block, the original HTML shows these classes on <li> elements within the hierarchy.
        // The transformNestedLists function handles the active state toggling.
        if (item.querySelector(':scope > ul')) {
          item.classList.add('top-level-li'); // Example, adjust based on actual original HTML
        }
        if (item.parentElement.classList.contains('has-sub-child')) {
          item.classList.add('first-level-li'); // Example, adjust based on actual original HTML
        }
      });

      transformNestedLists(tempDiv.querySelector('ul')); // Pass the actual UL element

      // Append the processed content
      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
    }

    li.append(megaMenu);
    navUl.append(li);
  });

  // Icon Nav (Mobile)
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const ulMobile = document.createElement('ul');
  iconNavMobile.append(ulMobile);

  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailLinkMobile = document.createElement('a');
  mailLinkMobile.href = 'https://www.mahindra.com/contact-us'; // Hardcoded from ORIGINAL HTML
  mailLinkMobile.textContent = 'Contact Us'; // Hardcoded from ORIGINAL HTML
  mailLiMobile.append(mailLinkMobile);
  ulMobile.append(mailLiMobile);

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
  ulMobile.append(searchLiMobile);
  navUl.append(iconNavMobile);

  // Icon Nav (Desktop)
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const ulDesktop = document.createElement('ul');
  iconNavDesktop.append(ulDesktop);

  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailLinkDesktop = document.createElement('a');
  mailLinkDesktop.href = 'https://www.mahindra.com/contact-us'; // Hardcoded from ORIGINAL HTML
  mailLinkDesktop.innerHTML = `
    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
    </svg>
  `;
  mailLiDesktop.append(mailLinkDesktop);
  ulDesktop.append(mailLiDesktop);

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
  ulDesktop.append(searchLiDesktop);
  nav.append(iconNavDesktop);

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  if (logo80Row) {
    const logo80Picture = logo80Row.querySelector('picture');
    const logo80Anchor = document.createElement('a');
    if (logo80LinkRow) {
      const foundLink = logo80LinkRow.querySelector('a');
      if (foundLink) logo80Anchor.href = foundLink.href;
      moveInstrumentation(logo80LinkRow, logo80Anchor);
    }
    if (logo80Picture) {
      const img = logo80Picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logo80Anchor.append(optimizedPic);
      }
    }
    year80LogoDiv.append(logo80Anchor);
    moveInstrumentation(logo80Row, year80LogoDiv);
  }
  wrap.append(year80LogoDiv);

  block.replaceChildren(header);

  // Search functionality (simplified for EDS)
  const searchToggle = header.querySelector('.search > a');
  const searchScreenWrap = header.querySelector('.search-screen-wrap'); // Corrected selector
  if (searchToggle && searchScreenWrap) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreenWrap.classList.toggle('active');
      header.classList.toggle('search-active');
    });
  }

  // Hamburger menu toggle
  const hamburgerBtn = header.querySelector('.hamburger');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      hamburgerBtn.classList.toggle('close-icon');
    });
  }

  // Scroll behavior for header (simplified)
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
