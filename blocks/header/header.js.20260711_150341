import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.classList.add('cmp-navigation__group', 'cmp-header__product-items'); // Add classes from ORIGINAL HTML
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
      subWrap.classList.add('cmp-header__category-menu');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
        li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products', 'cmp-header__nav-products-click');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    } else if (anchor) {
      li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1', 'cmp-header__no-item');
      anchor.classList.add('cmp-navigation__item-link');
    }
  });
}

export default function decorate(block) {
  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    logoRow,
    logoLinkRow,
    searchLinkRow, // Search link is block.children[4]
    ...itemRows // Navigation items start from block.children[5]
  ] = [...block.children];

  const headerNew = document.createElement('div');
  headerNew.classList.add('header-new');

  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header');
  moveInstrumentation(block, cmpHeader); // Move instrumentation from block to primary wrapper

  // Background Images
  const desktopPicture = backgroundDesktopRow?.querySelector('picture');
  const mobilePicture = backgroundMobileRow?.querySelector('picture');

  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    if (desktopImg) {
      headerNew.style.backgroundImage = `url("${desktopImg.src}")`;
      headerNew.style.backgroundSize = '100% 100%';
      headerNew.style.backgroundPosition = 'center bottom';
    }
  }

  // Hamburger menu (static element)
  const hamburger = document.createElement('div');
  hamburger.classList.add('cmp-header__hamburger', 'menu-mobile');
  hamburger.setAttribute('type', 'button');
  hamburger.setAttribute('data-mobile-src', 'images/Menu_icon_Default.svg'); // This is a hardcoded path, but it's for an icon, not content.
  cmpHeader.append(hamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('image', 'cmp-header__logo');
  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  const logoImageDiv = document.createElement('div');
  logoImageDiv.classList.add('logo', 'image');
  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  if (logoLinkRow) {
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) {
      logoLink.href = foundLink.href;
    }
    moveInstrumentation(logoLinkRow, logoLink);
  }

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(logoRow, optimizedLogoPic.querySelector('img'));
      logoLink.append(optimizedLogoPic);
    }
  }
  logoImageDiv.append(logoLink);
  cmpImage.append(logoImageDiv);
  logoWrapper.append(cmpImage);
  cmpHeader.append(logoWrapper);

  // Navigation Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');
  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  // No containerRow for navigationItems field, it's implicitly handled by itemRows
  // moveInstrumentation(containerRow, navGroup); // This line is incorrect as containerRow is not a real row.

  itemRows
    .filter(row => row.children.length > 0 && [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
      const li = document.createElement('li');
      moveInstrumentation(row, li);

      const subListHtml = hierarchyTreeCell?.innerHTML || '';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = subListHtml;
      const subList = tempDiv.querySelector('ul');
      
      const directLink = linkCell?.querySelector('a');

      if (subList) {
        // Move instrumentation for nested list items
        subList.querySelectorAll('li').forEach(nestedLi => {
          // Find the corresponding original row/cell for nestedLi if possible,
          // otherwise, instrumentation will be on the parent li.
          // For now, we'll assume instrumentation is handled by the parent li.
          // If the original HTML had data-aue-resource on nested li, we'd need to map it.
        });
        transformNestedLists(subList);
        li.append(subList);
        const trigger = document.createElement('a');
        trigger.textContent = labelCell.textContent.trim();
        trigger.classList.add('cmp-navigation__item-link', 'cmp-navigation__item-arrow');
        li.prepend(trigger);
        li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products', 'cmp-header__nav-products-click');

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          li.querySelector('.cmp-header__category-menu')?.classList.toggle('active');
        });
      } else {
        const anchor = document.createElement('a');
        if (directLink) {
          anchor.href = directLink.href;
        }
        anchor.textContent = labelCell.textContent.trim();
        anchor.classList.add('cmp-navigation__item-link');
        li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products', 'cmp-header__no-items');
        li.append(anchor);
      }
      navGroup.append(li);
    });

  nav.append(navGroup);
  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');
  nav.append(mobileList);
  navigationDiv.append(nav);
  navLinksDiv.append(navigationDiv);
  cmpHeader.append(navLinksDiv);

  // Nav Icons (Search)
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');
  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');
  const searchAnchor = document.createElement('a');
  searchAnchor.classList.add('cmp-header__icon-img');
  searchAnchor.href = searchLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(searchLinkRow, searchAnchor);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-Search_icons');
  searchAnchor.append(searchIcon);
  searchDiv.append(searchAnchor);
  navIconsDiv.append(searchDiv);
  cmpHeader.append(navIconsDiv);

  headerNew.append(cmpHeader);

  // Search section (static element)
  const searchSection = document.createElement('div');
  searchSection.classList.add('search');

  // Extract action and searchroot from the original searchLinkRow if possible,
  // or use a placeholder if not directly available in the model.
  const searchLinkHref = searchLinkRow?.querySelector('a')?.href || '/content/itc-foods-brands/bnatural/us/en.customsearchresults.json/_jcr_content/root/header/search';
  const searchRootValue = '/content/itc-foods-brands/bnatural/us/en'; // This value is hardcoded in ORIGINAL HTML, but not in block model.

  searchSection.innerHTML = `
    <section id="search-444ce93884" class="cmp-search" role="search" data-cmp-min-length="3" data-cmp-results-desktop-size="4" data-cmp-results-mobile-size="5" data-error-response="{&quot;noResultsTitle&quot;:&quot;No result found for&quot;,&quot;noResultsDescription&quot;:&quot;&quot;,&quot;categories&quot;:&quot;&quot;}" data-input-placeholder="Juice up your search">
      <div class="cmp_search__info" aria-live="polite" role="status"></div>
      <form class="cmp-search__form" data-cmp-hook-search="form" method="get" action="${searchLinkHref}" autocomplete="off">
        <input type="hidden" id="searchroot" name="searchroot" value="${searchRootValue}"/>
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

  block.replaceChildren(headerNew);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Toggle search visibility
  const searchInput = block.querySelector('.cmp-search__input');
  const searchForm = block.querySelector('.cmp-search__form');
  const searchClearButton = block.querySelector('.cmp-search__clear');
  const searchIconTrigger = block.querySelector('.cmp-header__search .cmp-header__icon-img');

  if (searchIconTrigger && searchSection) {
    searchIconTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      searchSection.classList.toggle('active');
      if (searchSection.classList.contains('active') && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (searchClearButton && searchInput) {
    searchClearButton.addEventListener('click', () => {
      searchInput.value = '';
      if (searchForm) searchForm.dispatchEvent(new Event('submit'));
    });
  }

  // Mobile menu toggle
  const mobileMenuTrigger = block.querySelector('.cmp-header__hamburger');
  const mobileNav = block.querySelector('.cmp-navigation');

  if (mobileMenuTrigger && mobileNav) {
    mobileMenuTrigger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      mobileMenuTrigger.classList.toggle('active');
    });
  }
}
