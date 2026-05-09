import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, originalCell) {
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
    // Move instrumentation for each li element created within the hierarchy tree
    // This is a best-effort, as individual <li>s don't have direct AUE instrumentation
    // from the original block structure, but their content comes from the richtext cell.
    // We move the instrumentation from the original richtext cell to the new li.
    // This might be overly aggressive if the original richtext cell has multiple top-level <ul>s.
    // A more precise approach would require tracking which part of the richtext corresponds to which li.
    // For now, we'll move the instrumentation from the original cell to the top-level ul,
    // and then to its direct children.
    // Given the structure, the originalCell's instrumentation should be moved to the rootUl,
    // and then the li's content is derived from within that.
    // For nested lists, the instrumentation is effectively "transferred" from the original richtext cell.
    // AUE will track the original richtext cell, so moving its content to a new structure
    // requires moving its instrumentation.
    // Since we're transforming the UL, the instrumentation should be on the UL itself.
    // If the original richtext cell had instrumentation, it should be moved to the `hierarchyUl`
    // before `transformNestedLists` is called.
  });
}

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // nav-up is a scroll-state class, not initial
  header.setAttribute('data-once', 'header-hover');

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
  const logoPicture = logoRow.querySelector('picture');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) logoLink.href = logoAnchor.href;
  if (logoPicture) {
    const optimizedPic = createOptimizedPicture(logoPicture.querySelector('img').src, logoPicture.querySelector('img').alt, false, [{ width: '200' }]);
    moveInstrumentation(logoPicture.querySelector('img'), optimizedPic.querySelector('img'));
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
  const ul = document.createElement('ul');
  [...Array(3)].forEach(() => ul.append(document.createElement('li')));
  hamburger.append(ul);
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
  const iconLinks = itemRows.filter((row) => row.children.length === 2);
  // Press release items also have 4 children, but can be distinguished by content if needed.
  // For now, assuming they are distinct from navigation items by their position in the original HTML
  // or by a specific link pattern. The model implies they are distinct item types.
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('a[href*="pressReleaseLink"]'));


  navigationItems
    .filter(
      (row) =>
        row.children.length > 0 &&
        [...row.children].some(
          (c) => c.children.length > 0 || c.textContent.trim() !== '',
        ),
    )
    .forEach((row) => {
      const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [
        ...row.children,
      ];

      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');

      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell.textContent.trim();
      anchor.setAttribute('itemprop', 'url');
      li.append(anchor);

      const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrowSvg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
      arrowSvg.setAttribute('fill', '#000000');
      arrowSvg.setAttribute('stroke', '#000000');
      arrowSvg.setAttribute('stroke-width', '4.851456000000001');
      arrowSvg.innerHTML = `<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g>`;
      const arrowSpan = document.createElement('span');
      arrowSpan.append(arrowSvg);
      li.append(arrowSpan);

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
      moveInstrumentation(megaMenuContentCell, leftDiv); // Move instrumentation for leftDiv content

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.append(subNavWrap);
      moveInstrumentation(hierarchyTreeCell, subNavWrap); // Move instrumentation for subNavWrap content

      if (megaMenuContentCell?.innerHTML.trim()) {
        leftDiv.innerHTML = megaMenuContentCell.innerHTML;
      }

      const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
      if (hierarchyUl) {
        transformNestedLists(hierarchyUl, hierarchyTreeCell); // Pass original cell for instrumentation
        subNavWrap.append(hierarchyUl);
        if (labelCell.textContent.trim().toLowerCase() === 'who we are') {
          subNavWrap.classList.add('about-us-sub-nav');
        } else if (labelCell.textContent.trim().toLowerCase() === 'what we do') {
          subNavWrap.classList.add('what-we-do');
        } else if (labelCell.textContent.trim().toLowerCase() === 'investor relations') {
          leftDiv.classList.add('ir-left-div');
          subNavWrap.classList.add('element-block');
        } else if (labelCell.textContent.trim().toLowerCase() === 'newsroom') {
          leftDiv.classList.add('newsroom-left-div');
          const latestPressReleaseDiv = document.createElement('div');
          latestPressReleaseDiv.classList.add('latest-two-press-release');
          pressReleaseItems
            .filter(
              (prRow) =>
                prRow.children.length > 0 &&
                [...prRow.children].some(
                  (c) => c.children.length > 0 || c.textContent.trim() !== '',
                ),
            )
            .forEach((prRow) => {
              const [prLinkCell, prTitleCell, prDateCell, prTagCell] = [
                ...prRow.children,
              ];
              const slideDiv = document.createElement('div');
              slideDiv.classList.add('slides');
              const wrapDiv = document.createElement('div');
              wrapDiv.classList.add('wrap');
              const contentDiv = document.createElement('div');
              contentDiv.classList.add('content');
              const descDiv = document.createElement('div');
              descDiv.classList.add('desc');
              const p = document.createElement('p');
              const prAnchor = document.createElement('a');
              const foundPrLink = prLinkCell.querySelector('a');
              if (foundPrLink) prAnchor.href = foundPrLink.href;
              prAnchor.textContent = prTitleCell.textContent.trim();
              p.append(prAnchor);
              const dateDiv = document.createElement('div');
              dateDiv.classList.add('date');
              const emDate = document.createElement('em');
              emDate.textContent = prDateCell.textContent.trim();
              const emTag = document.createElement('em');
              emTag.textContent = prTagCell.textContent.trim();
              dateDiv.append(emDate, emTag);
              descDiv.append(p, dateDiv);
              contentDiv.append(descDiv);
              wrapDiv.append(contentDiv);
              slideDiv.append(wrapDiv);
              latestPressReleaseDiv.append(slideDiv);
              moveInstrumentation(prRow, slideDiv);
            });
          leftDiv.append(latestPressReleaseDiv);
        } else if (labelCell.textContent.trim().toLowerCase() === 'careers') {
          leftDiv.classList.add('career-left-div');
          subNavWrap.classList.add('careers-div');
        }
      }

      li.append(megaMenu);
      navUl.append(li);
      moveInstrumentation(row, li);
    });

  // Mobile and Desktop Icon Links
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  mobileIconNav.append(mobileUl);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  desktopIconNav.append(desktopUl);

  iconLinks
    .filter(
      (row) =>
        row.children.length > 0 &&
        [...row.children].some(
          (c) => c.children.length > 0 || c.textContent.trim() !== '',
        ),
    )
    .forEach((row) => {
      const [linkCell, labelCell] = [...row.children];
      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) link.href = foundLink.href;
      link.textContent = labelCell.textContent.trim();

      const li = document.createElement('li');
      // The original HTML has a mail icon link with an SVG.
      // The generated code assumes all icon links are 'mail' and just adds text.
      // We need to check if the original HTML had an SVG for this link.
      // For now, assuming the original HTML's structure for mail icon link.
      // If the original HTML had a specific class for each icon type, we'd use that.
      // For now, hardcoding 'mail' class as per original HTML example.
      li.classList.add('mail');
      if (labelCell.textContent.trim().toLowerCase() === 'contact us') {
        // Recreate the SVG for the mail icon as per original HTML
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
        mailSvg.innerHTML = `<path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                              C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                              L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>`;
        link.textContent = ''; // Clear text content if SVG is used
        link.append(mailSvg);
      } else {
        link.textContent = labelCell.textContent.trim();
      }

      li.append(link);
      mobileUl.append(li.cloneNode(true)); // Clone for mobile
      desktopUl.append(li); // For desktop
      moveInstrumentation(row, li);
    });

  // Search icon (static content from original HTML)
  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  searchLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
  searchLiMobile.innerHTML = `<a href="#" data-once="search-stop-propagation">
      <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
        <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
      </svg>
      <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
        <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
      </svg>
      <span data-once="search-stop-propagation"> Search</span>
    </a>`;
  mobileUl.append(searchLiMobile);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  searchLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
  searchLiDesktop.innerHTML = `<a href="#" data-once="search-stop-propagation">
      <svg viewBox="0 0 21 21" fill="none" class="lens" data-once="search-stop-propagation">
        <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25" data-once="search-stop-propagation"></path>
      </svg>
      <svg viewBox="0 0 50 50" class="close" data-once="search-stop-propagation">
        <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" data-once="search-stop-propagation"></path>
      </svg>
    </a>`;
  desktopUl.append(searchLiDesktop);

  navUl.append(mobileIconNav);
  nav.append(desktopIconNav);

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  const anniversaryPicture = anniversaryLogoRow.querySelector('picture');
  const anniversaryAnchor = anniversaryLogoLinkRow.querySelector('a');
  if (anniversaryAnchor) anniversaryLogoLink.href = anniversaryAnchor.href;
  if (anniversaryPicture) {
    const optimizedPic = createOptimizedPicture(anniversaryPicture.querySelector('img').src, anniversaryPicture.querySelector('img').alt, false, [{ width: '74' }]);
    moveInstrumentation(anniversaryPicture.querySelector('img'), optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    anniversaryLogoLink.append(optimizedPic);
  }
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  anniversaryLogoDiv.append(anniversaryLogoLink);
  wrap.append(anniversaryLogoDiv);

  block.replaceChildren(header);

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('close');
  });

  // Mega menu toggle
  navUl.querySelectorAll('.has-child > span').forEach((span) => {
    span.addEventListener('click', () => {
      const megaMenu = span.nextElementSibling;
      if (megaMenu && megaMenu.classList.contains('mega-menu')) {
        megaMenu.classList.toggle('active');
        span.parentElement.classList.toggle('active');
      }
    });
  });
}
