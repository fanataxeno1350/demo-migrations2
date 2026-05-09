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

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    logo80Row,
    logo80LinkRow,
    ...itemRows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // nav-up is a scroll state class, do not add initially
  moveInstrumentation(block, header);

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Main Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const logoHref = logoLinkRow?.querySelector('a')?.href || '#';
  logoLink.href = logoHref;
  const logoPicture = logoRow?.querySelector('picture');
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

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  [...Array(3)].forEach(() => {
    hamburgerUl.append(document.createElement('li'));
  });
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  // Search and Contact Icons (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);
  navUl.append(mobileIconNav); // Append to navUl for mobile display

  const contactLiMobile = document.createElement('li');
  contactLiMobile.classList.add('mail');
  const contactLinkMobile = document.createElement('a');
  // Hardcoded from original HTML, no corresponding block field
  contactLinkMobile.href = 'https://www.mahindra.com/contact-us';
  contactLinkMobile.textContent = 'Contact Us';
  contactLiMobile.append(contactLinkMobile);
  mobileIconUl.append(contactLiMobile);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#';
  searchLinkMobile.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                  </svg>
                  <svg viewBox="0 0 50 50" class="close">
                    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
                  </svg>
                  <span> Search</span>
  `;
  searchLiMobile.append(searchLinkMobile);
  mobileIconUl.append(searchLiMobile);

  // Search and Contact Icons (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);
  nav.append(desktopIconNav);

  const contactLiDesktop = document.createElement('li');
  contactLiDesktop.classList.add('mail');
  const contactLinkDesktop = document.createElement('a');
  // Hardcoded from original HTML, no corresponding block field
  contactLinkDesktop.href = 'https://www.mahindra.com/contact-us';
  contactLinkDesktop.innerHTML = `
    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
    </svg>
  `;
  contactLiDesktop.append(contactLinkDesktop);
  desktopIconUl.append(contactLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#';
  searchLinkDesktop.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
                  </svg>
                  <svg viewBox="0 0 50 50" class="close">
                    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
  `;
  desktopIconUl.append(searchLiDesktop);

  // Add search screen wrap to header
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
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
              <div class="swiper-slide">
              </div>
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
  header.append(searchScreenWrap);

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const year80LogoHref = logo80LinkRow?.querySelector('a')?.href || '#';
  year80LogoLink.href = year80LogoHref;
  const year80LogoPicture = logo80Row?.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(logo80Row, year80LogoLink);
  moveInstrumentation(logo80LinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  // Filter out empty rows to prevent errors
  const validItemRows = itemRows.filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  // Categorize item rows based on cell count and content
  const navigationItems = [];
  const megaMenuAboutUsItems = [];
  const megaMenuWhatWeDoItems = [];
  const megaMenuInvestorRelationsItems = [];
  const megaMenuNewsroomItems = [];
  const pressReleaseItems = [];
  const megaMenuCareersItems = [];
  const contactLinkItems = [];

  validItemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3 && cells[2].querySelector('ul')) {
      // Navigation Item (label, link, hierarchy-tree)
      navigationItems.push(row);
    } else if (cells.length === 4 && !cells[0].querySelector('a') && !cells[1].querySelector('a') && !cells[2].querySelector('a') && cells[3].querySelector('p')) {
      // Mega Menu About Us (heading, desc, subdesc, sectionLinks) or Careers
      // Differentiate by the order of containers in block.children.
      // The first few 4-cell rows are About Us, then Careers.
      if (megaMenuAboutUsItems.length < 2) { // Assuming 2 examples in block.children for About Us
        megaMenuAboutUsItems.push(row);
      } else {
        megaMenuCareersItems.push(row);
      }
    } else if (cells.length === 3 && cells[1].querySelector('p') && cells[2].querySelector('p')) {
      // Mega Menu What We Do (heading, facts, sectionLinks)
      megaMenuWhatWeDoItems.push(row);
    } else if (cells.length === 4 && !cells[0].querySelector('a') && !cells[1].querySelector('a') && cells[2].querySelector('p') && cells[3].querySelector('p')) {
      // Mega Menu Investor Relations (heading, desc, facts, sectionLinks)
      megaMenuInvestorRelationsItems.push(row);
    } else if (cells.length === 2 && !cells[0].querySelector('a') && cells[1].querySelector('p')) {
      // Mega Menu Newsroom (heading, sectionLinks)
      megaMenuNewsroomItems.push(row);
    } else if (cells.length === 4 && cells[0].querySelector('a') && !cells[1].querySelector('a') && !cells[2].querySelector('a') && !cells[3].querySelector('a')) {
      // Press Release Item (link, label, date, tag)
      pressReleaseItems.push(row);
    } else if (cells.length === 2 && !cells[0].querySelector('a') && cells[1].querySelector('a')) {
      // Contact Link Item (label, link)
      contactLinkItems.push(row);
    } else {
      console.warn('Unhandled row type:', row);
    }
  });

  // Process Navigation Items
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
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
    const span = document.createElement('span');
    span.append(svg);
    li.append(span);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      moveInstrumentation(hierarchyTreeCell, hierarchyUl);
      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
    }

    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);

    // Event listener for mega menu toggle
    li.addEventListener('click', (e) => {
      e.preventDefault();
      li.classList.toggle('active');
    });
  });

  // Process Mega Menu About Us Items
  if (megaMenuAboutUsItems.length > 0) {
    const aboutUsLi = document.createElement('li');
    aboutUsLi.classList.add('has-child', 'hover-red');
    aboutUsLi.setAttribute('itemprop', 'name');
    const aboutUsAnchor = document.createElement('a');
    aboutUsAnchor.setAttribute('itemprop', 'url');
    // Read from block content if available, otherwise hardcode
    const aboutUsLinkRow = itemRows.find(row => [...row.children].some(c => c.textContent.trim() === 'Who We Are')) || itemRows[0]; // Fallback to first item row if not found
    const aboutUsLink = aboutUsLinkRow?.querySelector('a[href*="about-us"]')?.href || 'https://www.mahindra.com/about-us';
    aboutUsAnchor.href = aboutUsLink;
    aboutUsAnchor.textContent = 'Who We Are'; // Hardcoded from original HTML, no corresponding block field
    aboutUsLi.append(aboutUsAnchor);

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
    const span = document.createElement('span');
    span.append(svg);
    aboutUsLi.append(span);

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

    megaMenuAboutUsItems.forEach((row) => {
      const [headingCell, descCell, subdescCell, sectionLinksCell] = [...row.children];
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      const headingAnchor = document.createElement('a');
      headingAnchor.textContent = headingCell?.textContent.trim() || '';
      heading.append(headingAnchor);
      leftDiv.append(heading);
      moveInstrumentation(headingCell, heading);

      const desc = document.createElement('p');
      desc.classList.add('left-div-desc');
      desc.textContent = descCell?.textContent.trim() || '';
      leftDiv.append(desc);
      moveInstrumentation(descCell, desc);

      const subdesc = document.createElement('p');
      subdesc.classList.add('left-div-subdesc');
      subdesc.textContent = subdescCell?.textContent.trim() || '';
      leftDiv.append(subdesc);
      moveInstrumentation(subdescCell, subdesc);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
      const sectionLinksUl = sectionLinksCell?.querySelector('ul');
      if (sectionLinksUl) {
        moveInstrumentation(sectionLinksCell, sectionLinksUl);
        subNavWrap.append(sectionLinksUl);
      } else {
        // If it's not a UL, append the raw HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksCell?.innerHTML || '';
        moveInstrumentation(sectionLinksCell, tempDiv);
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      }
      centerDiv.append(subNavWrap);
      moveInstrumentation(row, leftDiv);
    });

    aboutUsLi.append(megaMenu);
    navUl.append(aboutUsLi);
    // moveInstrumentation(megaMenuAboutUsContainer, aboutUsLi); // This container is not a direct row

    aboutUsLi.addEventListener('click', (e) => {
      e.preventDefault();
      aboutUsLi.classList.toggle('active');
    });
  }

  // Process Mega Menu What We Do Items
  if (megaMenuWhatWeDoItems.length > 0) {
    const whatWeDoLi = document.createElement('li');
    whatWeDoLi.classList.add('has-child', 'hover-red');
    whatWeDoLi.setAttribute('itemprop', 'name');
    const whatWeDoAnchor = document.createElement('a');
    whatWeDoAnchor.setAttribute('itemprop', 'url');
    // Read from block content if available, otherwise hardcode
    const whatWeDoLinkRow = itemRows.find(row => [...row.children].some(c => c.textContent.trim() === 'What we do')) || itemRows[0]; // Fallback
    const whatWeDoLink = whatWeDoLinkRow?.querySelector('a[href*="our-business"]')?.href || 'https://www.mahindra.com/our-business';
    whatWeDoAnchor.href = whatWeDoLink;
    whatWeDoAnchor.textContent = 'What we do'; // Hardcoded from original HTML, no corresponding block field
    whatWeDoLi.append(whatWeDoAnchor);

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
    const span = document.createElement('span');
    span.append(svg);
    whatWeDoLi.append(span);

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

    megaMenuWhatWeDoItems.forEach((row) => {
      const [headingCell, factsCell, sectionLinksCell] = [...row.children];
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      const headingAnchor = document.createElement('a');
      headingAnchor.textContent = headingCell?.textContent.trim() || '';
      heading.append(headingAnchor);
      leftDiv.append(heading);
      moveInstrumentation(headingCell, heading);

      const factsUl = factsCell?.querySelector('ul');
      if (factsUl) {
        moveInstrumentation(factsCell, factsUl);
        leftDiv.append(factsUl);
      } else {
        const factsP = factsCell?.querySelector('p');
        if (factsP) {
          moveInstrumentation(factsCell, factsP);
          leftDiv.append(factsP);
        } else {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = factsCell?.innerHTML || '';
          moveInstrumentation(factsCell, tempDiv);
          while (tempDiv.firstChild) {
            leftDiv.append(tempDiv.firstChild);
          }
        }
      }

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'what-we-do');
      const sectionLinksUl = sectionLinksCell?.querySelector('ul');
      if (sectionLinksUl) {
        moveInstrumentation(sectionLinksCell, sectionLinksUl);
        transformNestedLists(sectionLinksUl);
        subNavWrap.append(sectionLinksUl);
      } else {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksCell?.innerHTML || '';
        moveInstrumentation(sectionLinksCell, tempDiv);
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      }
      centerDiv.append(subNavWrap);
      moveInstrumentation(row, leftDiv);
    });

    whatWeDoLi.append(megaMenu);
    navUl.append(whatWeDoLi);
    // moveInstrumentation(megaMenuWhatWeDoContainer, whatWeDoLi); // This container is not a direct row

    whatWeDoLi.addEventListener('click', (e) => {
      e.preventDefault();
      whatWeDoLi.classList.toggle('active');
    });
  }

  // Process Mega Menu Investor Relations Items
  if (megaMenuInvestorRelationsItems.length > 0) {
    const investorLi = document.createElement('li');
    investorLi.classList.add('has-child', 'hover-red');
    investorLi.setAttribute('itemprop', 'name');
    const investorAnchor = document.createElement('a');
    investorAnchor.setAttribute('itemprop', 'url');
    // Read from block content if available, otherwise hardcode
    const investorLinkRow = itemRows.find(row => [...row.children].some(c => c.textContent.trim() === 'Investor Relations')) || itemRows[0]; // Fallback
    const investorLink = investorLinkRow?.querySelector('a[href*="investor-relations"]')?.href || 'https://www.mahindra.com/investor-relations';
    investorAnchor.href = investorLink;
    investorAnchor.textContent = 'Investor Relations'; // Hardcoded from original HTML, no corresponding block field
    investorLi.append(investorAnchor);

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
    const span = document.createElement('span');
    span.append(svg);
    investorLi.append(span);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div', 'ir-left-div');
    centerDiv.append(leftDiv);

    megaMenuInvestorRelationsItems.forEach((row) => {
      const [headingCell, descCell, factsCell, sectionLinksCell] = [...row.children];
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      const headingAnchor = document.createElement('a');
      headingAnchor.textContent = headingCell?.textContent.trim() || '';
      heading.append(headingAnchor);
      leftDiv.append(heading);
      moveInstrumentation(headingCell, heading);

      const desc = document.createElement('p');
      desc.textContent = descCell?.textContent.trim() || '';
      leftDiv.append(desc);
      moveInstrumentation(descCell, desc);

      const factsUl = factsCell?.querySelector('ul');
      if (factsUl) {
        moveInstrumentation(factsCell, factsUl);
        leftDiv.append(factsUl);
      } else {
        const factsP = factsCell?.querySelector('p');
        if (factsP) {
          moveInstrumentation(factsCell, factsP);
          leftDiv.append(factsP);
        } else {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = factsCell?.innerHTML || '';
          moveInstrumentation(factsCell, tempDiv);
          while (tempDiv.firstChild) {
            leftDiv.append(tempDiv.firstChild);
          }
        }
      }

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'element-block');
      const sectionLinksUl = sectionLinksCell?.querySelector('ul');
      if (sectionLinksUl) {
        moveInstrumentation(sectionLinksCell, sectionLinksUl);
        subNavWrap.append(sectionLinksUl);
      } else {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksCell?.innerHTML || '';
        moveInstrumentation(sectionLinksCell, tempDiv);
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      }
      centerDiv.append(subNavWrap);
      moveInstrumentation(row, leftDiv);
    });

    investorLi.append(megaMenu);
    navUl.append(investorLi);
    // moveInstrumentation(megaMenuInvestorRelationsContainer, investorLi); // This container is not a direct row

    investorLi.addEventListener('click', (e) => {
      e.preventDefault();
      investorLi.classList.toggle('active');
    });
  }

  // Process Mega Menu Newsroom Items
  if (megaMenuNewsroomItems.length > 0) {
    const newsroomLi = document.createElement('li');
    newsroomLi.classList.add('has-child', 'hover-red');
    newsroomLi.setAttribute('itemprop', 'name');
    const newsroomAnchor = document.createElement('a');
    newsroomAnchor.setAttribute('itemprop', 'url');
    // Read from block content if available, otherwise hardcode
    const newsroomLinkRow = itemRows.find(row => [...row.children].some(c => c.textContent.trim() === 'newsroom')) || itemRows[0]; // Fallback
    const newsroomLink = newsroomLinkRow?.querySelector('a[href*="newsroom"]')?.href || 'https://www.mahindra.com/newsroom';
    newsroomAnchor.href = newsroomLink;
    newsroomAnchor.textContent = 'newsroom'; // Hardcoded from original HTML, no corresponding block field
    newsroomLi.append(newsroomAnchor);

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
    const span = document.createElement('span');
    span.append(svg);
    newsroomLi.append(span);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div', 'newsroom-left-div');
    centerDiv.append(leftDiv);

    megaMenuNewsroomItems.forEach((row) => {
      const [headingCell, sectionLinksCell] = [...row.children]; // Press Releases container is a placeholder
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      const headingAnchor = document.createElement('a');
      headingAnchor.textContent = headingCell?.textContent.trim() || '';
      heading.append(headingAnchor);
      leftDiv.append(heading);
      moveInstrumentation(headingCell, heading);

      const latestPressReleaseDiv = document.createElement('div');
      latestPressReleaseDiv.classList.add('latest-two-press-release');
      leftDiv.append(latestPressReleaseDiv);

      pressReleaseItems.forEach((prRow) => {
        const [prLinkCell, prLabelCell, prDateCell, prTagCell] = [...prRow.children];
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

        const prP = document.createElement('p');
        const prAnchor = document.createElement('a');
        prAnchor.href = prLinkCell?.querySelector('a')?.href || '#';
        prAnchor.textContent = prLabelCell?.textContent.trim() || '';
        prP.append(prAnchor);
        descDiv.append(prP);
        moveInstrumentation(prLinkCell, prAnchor);
        moveInstrumentation(prLabelCell, prP);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const dateEm = document.createElement('em');
        dateEm.textContent = prDateCell?.textContent.trim() || '';
        dateDiv.append(dateEm);
        moveInstrumentation(prDateCell, dateEm);

        const tagEm = document.createElement('em');
        tagEm.textContent = prTagCell?.textContent.trim() || '';
        dateDiv.append(tagEm);
        moveInstrumentation(prTagCell, tagEm);

        descDiv.append(dateDiv);
        latestPressReleaseDiv.append(slidesDiv);
        moveInstrumentation(prRow, slidesDiv);
      });

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      const sectionLinksUl = sectionLinksCell?.querySelector('ul');
      if (sectionLinksUl) {
        moveInstrumentation(sectionLinksCell, sectionLinksUl);
        subNavWrap.append(sectionLinksUl);
      } else {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksCell?.innerHTML || '';
        moveInstrumentation(sectionLinksCell, tempDiv);
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      }
      centerDiv.append(subNavWrap);
      moveInstrumentation(row, leftDiv);
    });

    newsroomLi.append(megaMenu);
    navUl.append(newsroomLi);
    // moveInstrumentation(megaMenuNewsroomContainer, newsroomLi); // This container is not a direct row
    // moveInstrumentation(pressReleaseItemsContainer, newsroomLi); // This container is not a direct row

    newsroomLi.addEventListener('click', (e) => {
      e.preventDefault();
      newsroomLi.classList.toggle('active');
    });
  }

  // Process Mega Menu Careers Items
  if (megaMenuCareersItems.length > 0) {
    const careersLi = document.createElement('li');
    careersLi.classList.add('has-child', 'hover-red');
    careersLi.setAttribute('itemprop', 'name');
    const careersAnchor = document.createElement('a');
    careersAnchor.setAttribute('itemprop', 'url');
    // Read from block content if available, otherwise hardcode
    const careersLinkRow = itemRows.find(row => [...row.children].some(c => c.textContent.trim() === 'careers')) || itemRows[0]; // Fallback
    const careersLink = careersLinkRow?.querySelector('a[href*="career"]')?.href || 'https://www.mahindra.com/career';
    careersAnchor.href = careersLink;
    careersAnchor.textContent = 'careers'; // Hardcoded from original HTML, no corresponding block field
    careersLi.append(careersAnchor);

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
    const span = document.createElement('span');
    span.append(svg);
    careersLi.append(span);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div', 'career-left-div');
    centerDiv.append(leftDiv);

    megaMenuCareersItems.forEach((row) => {
      const [headingCell, descCell, subdescCell, sectionLinksCell] = [...row.children];
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      const headingAnchor = document.createElement('a');
      headingAnchor.textContent = headingCell?.textContent.trim() || '';
      heading.append(headingAnchor);
      leftDiv.append(heading);
      moveInstrumentation(headingCell, heading);

      const desc = document.createElement('p');
      desc.classList.add('left-div-desc');
      desc.textContent = descCell?.textContent.trim() || '';
      leftDiv.append(desc);
      moveInstrumentation(descCell, desc);

      const subdesc = document.createElement('p');
      subdesc.classList.add('left-div-subdesc');
      subdesc.textContent = subdescCell?.textContent.trim() || '';
      leftDiv.append(subdesc);
      moveInstrumentation(subdescCell, subdesc);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'careers-div');
      const sectionLinksUl = sectionLinksCell?.querySelector('ul');
      if (sectionLinksUl) {
        moveInstrumentation(sectionLinksCell, sectionLinksUl);
        transformNestedLists(sectionLinksUl);
        subNavWrap.append(sectionLinksUl);
      } else {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksCell?.innerHTML || '';
        moveInstrumentation(sectionLinksCell, tempDiv);
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      }
      centerDiv.append(subNavWrap);
      moveInstrumentation(row, leftDiv);
    });

    careersLi.append(megaMenu);
    navUl.append(careersLi);
    // moveInstrumentation(megaMenuCareersContainer, careersLi); // This container is not a direct row

    careersLi.addEventListener('click', (e) => {
      e.preventDefault();
      careersLi.classList.toggle('active');
    });
  }

  // Process Contact Links
  if (contactLinkItems.length > 0) {
    const contactLinksUl = document.createElement('ul');
    contactLinkItems.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = linkCell?.querySelector('a')?.href || '#';
      anchor.textContent = labelCell?.textContent.trim() || '';
      li.append(anchor);
      contactLinksUl.append(li);
      moveInstrumentation(row, li);
      moveInstrumentation(labelCell, anchor);
      moveInstrumentation(linkCell, anchor);
    });
    // Append contactLinksUl to appropriate mega menu or a separate section
    // For now, it's not explicitly placed in the original HTML, so we'll just move instrumentation.
    // moveInstrumentation(contactLinksContainer, contactLinksUl); // This container is not a direct row
  }

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('close');
  });

  // Search toggle
  const searchToggle = header.querySelector('.search');
  // The searchScreenWrap is now created and appended to the header
  if (searchToggle && searchScreenWrap) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
      searchToggle.classList.toggle('active');
    });

    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('active');
        searchToggle.classList.remove('active');
      }
    });
  }

  block.replaceChildren(header);
}
