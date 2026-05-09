import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Apply classes from ORIGINAL HTML to li elements
    li.classList.add('list-item'); // Assuming 'list-item' is a common class for list items

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
    // Apply classes to anchors within the hierarchy tree
    if (anchor) {
      anchor.classList.add('nav-menu-link'); // Assuming 'nav-menu-link' is a common class for nav links
    }
  });
}

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [
    logoRow,
    logoLinkRow,
    year80LogoRow,
    year80LogoLinkRow,
    navigationMenuContainer, // This is a container row, not a single field
    pressReleasesContainer,  // This is a container row
    iconLinksContainer,      // This is a container row
    ...itemRows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'solid'); // 'with-marquee' and 'nav-up' are scroll-state classes

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const logoLinkEl = logoLinkRow.querySelector('a');
  if (logoLinkEl) logoLink.href = logoLinkEl.href;
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogoPic = createOptimizedPicture(
      logoImg.src,
      logoImg.alt,
      false,
      [{ width: '200' }],
    );
    moveInstrumentation(logoImg, optimizedLogoPic.querySelector('img'));
    logoLink.append(optimizedLogoPic);
  }
  logoDiv.append(logoLink);
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  wrapDiv.append(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  // Create three empty li elements for the hamburger icon
  [...Array(3)].forEach(() => {
    hamburgerUl.append(document.createElement('li'));
  });
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Add event listener for hamburger menu
  hamburgerDiv.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // Assuming a class to prevent body scroll
  });

  // Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);

  // Filter item rows based on their structure as defined in BlockJson
  // navigation-item: 4 cells (label, link, megaMenuContent, hierarchy-tree)
  // press-release-item: 4 cells (headline, link, date, category)
  // icon-link-item: 2 cells (link, label)

  // Separate item rows by type based on cell count and content
  const navigationItems = itemRows.filter((row) => row.children.length === 4);
  // Press release items also have 4 cells, but typically contain an anchor in the second cell
  // and no picture, distinguishing them from other 4-cell types if any.
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4 && row.children[1].querySelector('a') && !row.children[0].querySelector('picture'));
  const iconLinkItems = itemRows.filter((row) => row.children.length === 2);

  // Move instrumentation for the navigation menu container
  moveInstrumentation(navigationMenuContainer, navUl);

  navigationItems
    .forEach((row) => {
      // Use destructuring for fixed-schema navigation-item rows
      const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [
        ...row.children,
      ];
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');

      const anchor = document.createElement('a');
      anchor.setAttribute('itemprop', 'url');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);

      const svgSpan = document.createElement('span');
      // Hardcoded SVG is acceptable if it's a UI icon not content
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

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.append(subNavWrap);

      // Populate leftDiv and subNavWrap based on megaMenuContent and hierarchyTree
      if (megaMenuContentCell && megaMenuContentCell.innerHTML.trim()) {
        // Richtext field, use innerHTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = megaMenuContentCell.innerHTML;
        moveInstrumentation(megaMenuContentCell, tempDiv);
        while (tempDiv.firstChild) {
          leftDiv.append(tempDiv.firstChild);
        }
      }

      const hierarchyUl = hierarchyTreeCell.querySelector('ul');
      if (hierarchyUl) {
        // Move instrumentation for the hierarchy tree cell
        moveInstrumentation(hierarchyTreeCell, hierarchyUl);
        transformNestedLists(hierarchyUl);
        subNavWrap.append(hierarchyUl);
      }

      li.append(megaMenu);
      navUl.append(li);
      moveInstrumentation(row, li);
    });

  wrapDiv.append(mainNav);

  // Icon Navigation (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  // Mail icon (using hardcoded SVG and text from ORIGINAL HTML)
  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailLinkMobile = document.createElement('a');
  mailLinkMobile.href = 'https://www.mahindra.com/contact-us'; // Hardcoded URL from ORIGINAL HTML
  mailLinkMobile.textContent = 'Contact Us'; // Hardcoded text from ORIGINAL HTML
  mobileIconUl.append(mailLiMobile);
  mailLiMobile.append(mailLinkMobile);

  // Search icon (using hardcoded SVG and text from ORIGINAL HTML)
  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#'; // Hardcoded URL from ORIGINAL HTML
  searchLinkMobile.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg><svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg><span> Search</span>`;
  searchLiMobile.append(searchLinkMobile);
  mobileIconUl.append(searchLiMobile);
  mainNav.append(mobileIconNav);

  // Add event listener for mobile search icon
  searchLinkMobile.addEventListener('click', (e) => {
    e.preventDefault();
    const searchScreenWrap = mainNav.querySelector('.search-screen-wrap');
    if (searchScreenWrap) {
      searchScreenWrap.classList.toggle('active'); // Assuming 'active' class toggles visibility
      document.body.classList.toggle('no-scroll');
    }
  });

  // Icon Navigation (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  // Mail icon (using hardcoded SVG from ORIGINAL HTML)
  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailLinkDesktop = document.createElement('a');
  mailLinkDesktop.href = 'https://www.mahindra.com/contact-us'; // Hardcoded URL from ORIGINAL HTML
  mailLinkDesktop.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>`;
  mailLiDesktop.append(mailLinkDesktop);
  desktopIconUl.append(mailLiDesktop);

  // Search icon (using hardcoded SVG from ORIGINAL HTML)
  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#'; // Hardcoded URL from ORIGINAL HTML
  searchLinkDesktop.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg><svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>`;
  searchLiDesktop.append(searchLinkDesktop);
  desktopIconUl.append(searchLiDesktop);
  mainNav.append(desktopIconNav);

  // Add event listener for desktop search icon
  searchLinkDesktop.addEventListener('click', (e) => {
    e.preventDefault();
    const searchScreenWrap = mainNav.querySelector('.search-screen-wrap');
    if (searchScreenWrap) {
      searchScreenWrap.classList.toggle('active'); // Assuming 'active' class toggles visibility
      document.body.classList.toggle('no-scroll');
    }
  });

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const year80LogoLinkEl = year80LogoLinkRow.querySelector('a');
  if (year80LogoLinkEl) year80LogoLink.href = year80LogoLinkEl.href;
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const year80LogoImg = year80LogoPicture.querySelector('img');
    const optimizedYear80Pic = createOptimizedPicture(
      year80LogoImg.src,
      year80LogoImg.alt,
      false,
      [{ width: '74' }],
    );
    moveInstrumentation(year80LogoImg, optimizedYear80Pic.querySelector('img'));
    year80LogoLink.append(optimizedYear80Pic);
  }
  year80LogoDiv.append(year80LogoLink);
  moveInstrumentation(year80LogoRow, year80LogoLink);
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  wrapDiv.append(year80LogoDiv);

  block.replaceChildren(header);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
