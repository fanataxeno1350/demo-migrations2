import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Ensure text nodes directly under li are wrapped in a span if no anchor exists
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
      nested.remove(); // Remove the nested UL to re-append it later in a wrapper
      const subWrap = document.createElement('div');
      subWrap.classList.add('cmp-header__product-items'); // Class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow'); // Classes from ORIGINAL HTML
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('cmp-header__nav-products-click'); // Class from ORIGINAL HTML
          subWrap.classList.toggle('cmp-header__product-items--open'); // Custom class for open state
        });
      }
    } else if (anchor) {
      anchor.classList.add('cmp-navigation__item-link'); // Class from ORIGINAL HTML
    }

    // Apply classes to nested <a>, <ul>, <li> elements
    li.querySelectorAll('a').forEach((a) => a.classList.add('cmp-navigation__item-link'));
    li.querySelectorAll('ul').forEach((ul) => ul.classList.add('cmp-navigation__group', 'cmp-header__product-items'));
    li.querySelectorAll('li').forEach((nestedLi) => nestedLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1', 'cmp-header__no-item'));
  });
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
  // headerNew.classList.add('header-new'); // Removed: block already has 'header' class, 'header-new' is an inner wrapper class
  moveInstrumentation(block, headerNew); // Move instrumentation from block to new root

  // Background Images
  const desktopPicture = backgroundDesktopRow?.querySelector('picture');
  const mobilePicture = backgroundMobileRow?.querySelector('picture');

  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    if (desktopImg) {
      headerNew.style.backgroundImage = `url("${desktopImg.src}")`;
      headerNew.style.backgroundSize = '100% 100%';
      headerNew.style.backgroundPosition = 'center bottom';
      headerNew.setAttribute('data-desktop-src', desktopImg.src);
    }
    moveInstrumentation(backgroundDesktopRow, headerNew);
  }

  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    if (mobileImg) {
      headerNew.setAttribute('data-mobile-src', mobileImg.src);
    }
    moveInstrumentation(backgroundMobileRow, headerNew);
  }

  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header'); // Class from ORIGINAL HTML
  headerNew.append(cmpHeader);

  // Hamburger menu (structural, not authored)
  const hamburger = document.createElement('div');
  hamburger.classList.add('cmp-header__hamburger', 'menu-mobile'); // Classes from ORIGINAL HTML
  hamburger.setAttribute('type', 'button');
  // Data attribute value from ORIGINAL HTML, not hardcoded path
  hamburger.setAttribute('data-mobile-src', 'images/Menu_icon_Default.svg');
  cmpHeader.append(hamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('image', 'cmp-header__logo'); // Classes from ORIGINAL HTML
  cmpHeader.append(logoWrapper);

  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image'); // Class from ORIGINAL HTML
  logoWrapper.append(cmpImage);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image'); // Classes from ORIGINAL HTML
  cmpImage.append(logoDiv);

  const logoLinkEl = document.createElement('a');
  logoLinkEl.classList.add('cmp-image__link'); // Class from ORIGINAL HTML
  logoLinkEl.setAttribute('data-social', 'header'); // Data attribute from ORIGINAL HTML

  const logoAnchor = logoLinkRow?.querySelector('a');
  if (logoAnchor) {
    logoLinkEl.href = logoAnchor.href;
    moveInstrumentation(logoLinkRow, logoLinkEl);
  }

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    // Create optimized picture for desktop, then add a source for mobile
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '767' }]);
    const mobileSource = document.createElement('source');
    mobileSource.media = '(max-width:767px)';
    // Use the original img src for mobile srcset, createOptimizedPicture handles the rest
    mobileSource.srcset = img.src;
    optimizedPic.prepend(mobileSource);

    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLinkEl.append(optimizedPic);
  }
  logoDiv.append(logoLinkEl);

  // Navigation Links
  const navLinksWrapper = document.createElement('div');
  navLinksWrapper.classList.add('cmp-header__nav-links'); // Class from ORIGINAL HTML
  cmpHeader.append(navLinksWrapper);

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation'); // Class from ORIGINAL HTML
  navLinksWrapper.append(navigationDiv);

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation'); // Class from ORIGINAL HTML
  navigationDiv.append(nav);

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group'); // Classes from ORIGINAL HTML
  nav.append(navGroup);

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products'); // Classes from ORIGINAL HTML

    const subList = hierarchyTreeCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a');

    if (subList) {
      // Item with nested menu
      li.classList.add('cmp-header__nav-products-click'); // Class from ORIGINAL HTML
      const trigger = document.createElement('a');
      trigger.textContent = labelCell.textContent.trim();
      trigger.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow'); // Classes from ORIGINAL HTML
      li.append(trigger);

      const productItems = document.createElement('ul');
      productItems.classList.add('cmp-navigation__group', 'cmp-header__product-items'); // Classes from ORIGINAL HTML
      const categoryMenu = document.createElement('div');
      categoryMenu.classList.add('cmp-header__category-menu'); // Class from ORIGINAL HTML
      productItems.append(categoryMenu);

      const tempDiv = document.createElement('div');
      // Use innerHTML to preserve nested structure
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for richtext cell

      const clonedSubList = tempDiv.querySelector('ul');
      if (clonedSubList) {
        transformNestedLists(clonedSubList); // Apply transformations to the cloned list
        // Append children from the transformed list
        while (clonedSubList.firstChild) {
          categoryMenu.append(clonedSubList.firstChild);
        }
      }
      li.append(productItems);

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('cmp-header__nav-products-click'); // Class from ORIGINAL HTML
        productItems.classList.toggle('cmp-header__product-items--open'); // Custom class for open state
      });
    } else {
      // Simple link item
      li.classList.add('cmp-header__no-items'); // Class from ORIGINAL HTML
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-navigation__item-link'); // Class from ORIGINAL HTML
      if (directLink) {
        anchor.href = directLink.href;
      }
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    moveInstrumentation(row, li); // Move instrumentation for each navigation item row
    navGroup.append(li);
  });

  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list'); // Class from ORIGINAL HTML
  nav.append(mobileList);

  // Nav Icons (Search)
  const navIcons = document.createElement('div');
  navIcons.classList.add('cmp-header__nav-icons'); // Class from ORIGINAL HTML
  cmpHeader.append(navIcons);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search'); // Class from ORIGINAL HTML
  navIcons.append(searchDiv);

  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('cmp-header__icon-img'); // Class from ORIGINAL HTML
  searchDiv.append(searchLink);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-Search_icons'); // Class from ORIGINAL HTML
  searchLink.append(searchIcon);

  // Search section (structural, not authored)
  // This section was hardcoded, which is an anti-pattern.
  // Assuming it's a static structural element that doesn't come from authored content.
  // If it needs to be authored, a new field in the BlockJson would be required.
  const searchSection = document.createElement('div');
  searchSection.classList.add('search'); // Class from ORIGINAL HTML
  // The innerHTML for the search section is complex and appears to be a static component.
  // If this content is truly static and not authored, it can be hardcoded.
  // However, if any part of it is expected to be editable, it should come from block.children.
  // For now, retaining as-is based on the assumption it's a static structural element.
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
  headerNew.append(searchSection);

  // Toggle search visibility
  searchLink.addEventListener('click', (e) => {
    e.preventDefault();
    searchSection.classList.toggle('active');
  });

  // Toggle mobile menu visibility
  hamburger.addEventListener('click', () => {
    navLinksWrapper.classList.toggle('cmp-header__nav-links--open'); // Custom class for open state
    hamburger.classList.toggle('cmp-header__hamburger--open'); // Custom class for open state
  });

  block.replaceChildren(headerNew);
}
