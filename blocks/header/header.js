import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, hierarchyTreeCell) {
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
      subWrap.classList.add('cmp-header__product-items'); // Use class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('cmp-header__nav-products-click');
          subWrap.classList.toggle('cmp-header__product-items--open'); // Custom class for open state
        });
      }
    }
  });
  // Move instrumentation for the entire hierarchyTreeCell once after processing its content
  if (hierarchyTreeCell && rootUl.parentNode) {
    moveInstrumentation(hierarchyTreeCell, rootUl.parentNode);
  }
}

function createSearchSection(searchSectionRow) {
  const searchSection = document.createElement('div');
  searchSection.classList.add('search');
  // The original HTML for the search section is complex and appears to be a static component.
  // If this content is truly static and not authored via AEM rows,
  // then hardcoding it is acceptable. However, if any part of it
  // is meant to be dynamic or authored, it should be extracted from AEM rows.
  // For now, assuming it's a static component structure.
  searchSection.innerHTML = `
    <section id="search-444ce93884" class="cmp-search" role="search" data-cmp-min-length="3" data-cmp-results-desktop-size="4" data-cmp-results-mobile-size="5" data-error-response="{&quot;noResultsTitle&quot;:&quot;No result found for&quot;,&quot;noResultsDescription&quot;:&quot;&quot;,&quot;categories&quot;:&quot;&quot;}" data-input-placeholder="Juice up your search">
      <div class="cmp_search__info" aria-live="polite" role="status"></div>
      <form class="cmp-search__form" data-cmp-hook-search="form" method="get" action="/content/itc-foods-brands/bnatural/us/en.customsearchresults.json/_jcr_content/root/header/search" autocomplete="off">
        <input type="hidden" id="searchroot" name="searchroot" value="/content/itc-foods-brands/bnatural/us/en"/>
        <div class="cmp-search__field">
          <i class="cmp-search__icon" data-cmp-hook-search="icon"></i>
          <span class="cmp-search__loading-indicator" data-cmp-hook-search="loadingIndicator"></span>
          <input class="cmp-search__input" data-cmp-hook-search="input" type="text" name="fulltext" placeholder="Search" role="combobox" aria-autocomplete="list" aria-haspopup="true" aria-invalid="false" aria-expanded="false" aria-owns="cmp-search-results-0"/>
          <button class="cmp-search__clear" data-cmp-hook-search="clear" aria-label="Clear">
            <i class="cmp-search__clear-icon"></i>
          </button>
        </div>
      </form>
      <div class="cmp-search__resultsBlock">
        <div class="cmp-search__results" aria-label="Search results" data-cmp-hook-search="results" role="listbox" aria-multiselectable="false" id="cmp-search-results-0"></div>
      </div>
    </section>
  `;
  // If there was an AEM row for the search section, move its instrumentation.
  // Assuming for now it's a static part of the block, not an authored row.
  // If it were an authored row, it would need to be passed in and instrumented.
  // For now, we'll assume the search section itself doesn't have a direct AEM row.
  return searchSection;
}

export default function decorate(block) {
  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    logoRow,
    logoLinkRow,
    ...navigationItemRows
  ] = [...block.children];

  const headerNew = document.createElement('div');
  // headerNew.classList.add('header-new'); // REMOVED: Block's own class is already on the outer div

  // Set background images
  const desktopPicture = backgroundDesktopRow?.querySelector('picture');
  const mobilePicture = backgroundMobileRow?.querySelector('picture'); // Not directly used for JS background, but instrumentation moved

  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    if (desktopImg) {
      headerNew.style.backgroundImage = `url("${desktopImg.src}")`;
      headerNew.style.backgroundSize = '100% 100%';
      headerNew.style.backgroundPosition = 'center bottom';
      moveInstrumentation(backgroundDesktopRow, headerNew);
    }
  }

  // Mobile background (handled by CSS background-image media queries if present)
  // For now, only desktop background is directly applied as per original HTML structure.
  // If mobile background needs to be set via JS, it would require a media query listener.
  moveInstrumentation(backgroundMobileRow, headerNew); // Ensure instrumentation is moved

  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header');
  headerNew.append(cmpHeader);

  // Hamburger menu (structural element from original HTML)
  const hamburger = document.createElement('div');
  hamburger.classList.add('cmp-header__hamburger', 'menu-mobile');
  hamburger.setAttribute('type', 'button');
  cmpHeader.append(hamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('image', 'cmp-header__logo');
  cmpHeader.append(logoWrapper);

  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  logoWrapper.append(cmpImage);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  cmpImage.append(logoDiv);

  const logoAnchor = document.createElement('a');
  logoAnchor.classList.add('cmp-image__link');
  const logoLink = logoLinkRow?.querySelector('a');
  if (logoLink) {
    logoAnchor.href = logoLink.href;
    moveInstrumentation(logoLinkRow, logoAnchor);
  } else {
    logoAnchor.href = '/'; // Default link if not authored
    moveInstrumentation(logoLinkRow, logoAnchor); // Move instrumentation even if default link
  }

  const logoPic = logoRow?.querySelector('picture');
  if (logoPic) {
    const optimizedPic = createOptimizedPicture(
      logoPic.querySelector('img').src,
      logoPic.querySelector('img').alt,
      false,
      [{ media: '(max-width: 767px)', width: '767' }, { width: '2000' }],
    );
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoAnchor.append(optimizedPic);
  } else {
    moveInstrumentation(logoRow, logoAnchor); // Move instrumentation even if no picture
  }
  logoDiv.append(logoAnchor);

  // Navigation Links
  const navLinks = document.createElement('div');
  navLinks.classList.add('cmp-header__nav-links');
  cmpHeader.append(navLinks);

  const navigation = document.createElement('div');
  navigation.classList.add('navigation');
  navLinks.append(navigation);

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  navigation.append(nav);

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  nav.append(navGroup);

  navigationItemRows
    .filter((row) => row.children.length === 3) // Filter for navigation-item rows
    .forEach((row) => {
      const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

      const subList = hierarchyTreeCell?.querySelector('ul');
      const directLink = linkCell?.querySelector('a');

      if (subList) {
        li.classList.add('cmp-header__nav-products-click');
        const trigger = document.createElement('a');
        trigger.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
        trigger.textContent = labelCell.textContent.trim();
        if (directLink) {
          trigger.href = directLink.href;
        } else {
          trigger.href = 'javascript:void(0)'; // Prevent navigation if only a dropdown trigger
        }
        moveInstrumentation(labelCell, trigger);
        moveInstrumentation(linkCell, trigger);
        li.append(trigger);

        const categoryMenu = document.createElement('div');
        categoryMenu.classList.add('cmp-header__category-menu');
        const productItems = document.createElement('ul');
        productItems.classList.add('cmp-navigation__group', 'cmp-header__product-items');
        // The original HTML has categoryMenu inside productItems, then subList inside categoryMenu.
        // Let's replicate that structure.
        categoryMenu.append(subList); // Append the actual subList here
        productItems.append(categoryMenu);

        // Transform nested lists
        transformNestedLists(subList, hierarchyTreeCell); // Pass hierarchyTreeCell for instrumentation
        
        li.append(productItems);
        // moveInstrumentation(hierarchyTreeCell, productItems); // Instrumentation moved inside transformNestedLists
      } else {
        li.classList.add('cmp-header__no-items');
        const anchor = document.createElement('a');
        anchor.classList.add('cmp-navigation__item-link');
        if (directLink) {
          anchor.href = directLink.href;
        }
        anchor.textContent = labelCell.textContent.trim();
        moveInstrumentation(labelCell, anchor);
        moveInstrumentation(linkCell, anchor);
        moveInstrumentation(hierarchyTreeCell, anchor); // Move instrumentation even if empty
        li.append(anchor);
      }
      navGroup.append(li);
    });

  // Mobile list placeholder (from original HTML)
  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');
  nav.append(mobileList);

  // Nav icons (search)
  const navIcons = document.createElement('div');
  navIcons.classList.add('cmp-header__nav-icons');
  cmpHeader.append(navIcons);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');
  navIcons.append(searchDiv);

  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('cmp-header__icon-img');
  searchDiv.append(searchLink);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-Search_icons');
  searchLink.append(searchIcon);

  // Search section (from original HTML)
  const searchSection = createSearchSection();
  headerNew.append(searchSection);
  // Assuming search section itself is not an authored row, so no direct moveInstrumentation for it.
  // If it were, we'd pass a searchSectionRow to createSearchSection and instrument it.

  // Hamburger menu toggle logic
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('cmp-header__nav-links--open'); // Custom class for mobile menu open
    // You might also want to toggle a class on the body to prevent scrolling
  });

  block.replaceChildren(headerNew);
}
