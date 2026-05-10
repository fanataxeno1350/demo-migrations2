import { createOptimizedPicture } from '../../scripts/aem.js';
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
      subWrap.classList.add('tbm-group-container', 'tbm-item-child');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('tbm-toggle');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
          trigger.setAttribute('aria-expanded', li.classList.contains('active'));
        });
      }
    }
  });

  // Apply classes to nested elements from ORIGINAL HTML
  rootUl.querySelectorAll('ul').forEach((ul, index) => {
    if (index === 0) { // Root ul of the hierarchy tree
      ul.classList.add('tbm-subnav', 'level-2');
    } else {
      ul.classList.add('tbm-subnav', 'level-3'); // Assuming further nesting
    }
  });
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('tbm-item', 'level-3', 'tb-megamenu-item', 'mega');
  });
  rootUl.querySelectorAll('a').forEach((a) => {
    a.classList.add('tbm-link', 'level-3');
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    searchPlaceholderRow,
    searchButtonLabelRow,
    logoRow,
    logoLinkRow,
    searchFormActionRow, // New row for search form action
    utilityLinksContainer,
    languageMenuContainer,
    ctaButtonsContainer,
    mainNavigationContainer,
    ...itemRows
  ] = children;

  const root = document.createElement('section');
  root.classList.add('component-global-navigation', 'notranslate');
  // 'scrolled' class is a dynamic state class, not added initially

  // Search Module
  const searchModule = document.createElement('div');
  searchModule.classList.add('search-module');
  moveInstrumentation(searchPlaceholderRow, searchModule);
  moveInstrumentation(searchButtonLabelRow, searchModule);
  moveInstrumentation(searchFormActionRow, searchModule); // Move instrumentation for new row

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('container');
  const searchRow = document.createElement('div');
  searchRow.classList.add('row');

  const navTrigger = document.createElement('div');
  navTrigger.classList.add('nav-trigger');
  navTrigger.innerHTML = '<i></i><i></i><i></i>';

  const searchCol = document.createElement('div');
  searchCol.classList.add('col-10', 'offset-1', 'search-col');
  const searchBoxContainer = document.createElement('div');
  searchBoxContainer.classList.add('search-box-container');

  const searchForm = document.createElement('form');
  searchForm.classList.add('views-exposed-form', 'bef-exposed-form');
  const searchFormAction = searchFormActionRow.querySelector('a')?.href || '/en/search-results';
  searchForm.setAttribute('action', searchFormAction);
  searchForm.setAttribute('method', 'get');

  const searchInputDiv = document.createElement('div');
  searchInputDiv.classList.add('js-form-item', 'form-item', 'form-type-search-api-autocomplete', 'js-form-type-search-api-autocomplete', 'form-item-keys', 'js-form-item-keys', 'form-no-label');
  const searchInput = document.createElement('input');
  searchInput.classList.add('form-autocomplete', 'top-search-text-box', 'form-text', 'ui-autocomplete-input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('id', 'edit-keys');
  searchInput.setAttribute('name', 'keys');
  searchInput.setAttribute('maxlength', '128');
  searchInput.setAttribute('aria-label', searchPlaceholderRow.textContent.trim());
  searchInput.setAttribute('placeholder', searchPlaceholderRow.textContent.trim());
  searchInputDiv.append(searchInput);

  const searchButton = document.createElement('input');
  searchButton.classList.add('top-search', 'button', 'js-form-submit', 'form-submit', 'disabled');
  searchButton.setAttribute('type', 'submit');
  searchButton.setAttribute('id', 'edit-submit-lions-solr-search');
  searchButton.setAttribute('value', searchButtonLabelRow.textContent.trim());
  searchButton.setAttribute('aria-label', searchButtonLabelRow.textContent.trim());
  searchButton.setAttribute('disabled', '');

  searchForm.append(searchInputDiv, searchButton);
  searchBoxContainer.append(searchForm);
  searchCol.append(searchBoxContainer);
  searchRow.append(navTrigger, searchCol);
  searchContainer.append(searchRow);
  searchModule.append(searchContainer);
  root.append(searchModule);

  // Desktop header
  const desktopHeader = document.createElement('div');
  desktopHeader.classList.add('desktop');
  const relativeWrapper = document.createElement('div');
  relativeWrapper.classList.add('relative-wrapper');
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container');
  relativeWrapper.append(desktopContainer);
  desktopHeader.append(relativeWrapper);
  root.append(desktopHeader);

  // Filter item rows based on their structure (cell count and content)
  const utilityLinks = itemRows.filter((row) => row.children.length === 3 && row.children[2].querySelector('ul')); // Utility links have 3 cells, 3rd is richtext hierarchy
  const languageMenuLinks = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture')); // Language links have 2 cells, no picture
  const ctaButtons = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && !row.children[1].querySelector('ul')); // CTA buttons have 2 cells, no picture, no hierarchy
  const mainNavigationLinks = itemRows.filter((row) => row.children.length === 3 && row.children[2].querySelector('ul')); // Main nav links have 3 cells, 3rd is richtext hierarchy

  // Utility Bar
  const utilityRow = document.createElement('div');
  utilityRow.classList.add('row', 'row-utility');
  const utilityBar = document.createElement('div');
  utilityBar.classList.add('utility-bar');
  moveInstrumentation(utilityLinksContainer, utilityBar);

  utilityLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      if (foundLink.getAttribute('target') === '_blank') {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('aria-label', `${labelCell.textContent.trim()} - open in a new tab`);
      }
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    utilityBar.append(anchor);
  });

  // Language Dropdown
  const langDropdown = document.createElement('div');
  langDropdown.classList.add('dropdown-lang');
  moveInstrumentation(languageMenuContainer, langDropdown);

  const langButton = document.createElement('button');
  langButton.setAttribute('type', 'button');
  langButton.textContent = 'EN'; // Default language, should be dynamic if possible
  langDropdown.append(langButton);

  const langMenu = document.createElement('ul');
  langMenu.classList.add('dropdown-lang-menu');
  languageMenuLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li); // Move instrumentation to the li element
    li.append(anchor);
    langMenu.append(li);
  });
  langDropdown.append(langMenu);
  utilityBar.append(langDropdown);
  utilityRow.append(utilityBar);
  desktopContainer.append(utilityRow);

  // Top Row (Logo, Mobile CTA, Mobile Search, Mobile Nav Trigger, Desktop CTA)
  const topRow = document.createElement('div');
  topRow.classList.add('row', 'row-top');
  const col = document.createElement('div');
  col.classList.add('col');
  const innerRow = document.createElement('div');
  innerRow.classList.add('row');
  col.append(innerRow);
  topRow.append(col);

  const logoTagCol = document.createElement('div');
  logoTagCol.classList.add('col', 'logo-tag-col');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'logo-full');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) logoLink.href = foundLogoLink.href;
  logoLink.setAttribute('aria-label', 'Open this option');
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const optimizedPic = createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoTagCol.append(logoLink);
  innerRow.append(logoTagCol);

  // Mobile elements (btns-scrolled, search-mobile, mobile-nav-trigger)
  const visibleMobile = document.createElement('div');
  visibleMobile.classList.add('visible-mobile');
  const btnsScrolled = document.createElement('div');
  btnsScrolled.classList.add('btns-scrolled');
  ctaButtons.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    anchor.setAttribute('tabindex', '-1');
    moveInstrumentation(row, anchor); // Move instrumentation for each CTA button
    btnsScrolled.append(anchor);
  });
  visibleMobile.append(btnsScrolled);

  const searchMobile = document.createElement('a');
  searchMobile.classList.add('search', 'search-mobile', 'visible-mobile');
  searchMobile.href = '#';
  searchMobile.setAttribute('aria-label', 'Search');
  searchMobile.setAttribute('tabindex', '-1');
  visibleMobile.append(searchMobile);

  const mobileNavTrigger = document.createElement('a');
  mobileNavTrigger.classList.add('mobile-nav-trigger', 'visible-mobile');
  mobileNavTrigger.href = '#';
  mobileNavTrigger.setAttribute('aria-label', 'Mobile menu');
  mobileNavTrigger.setAttribute('tabindex', '-1');
  mobileNavTrigger.innerHTML = '<span></span><span></span><span></span><span></span>';
  visibleMobile.append(mobileNavTrigger);
  logoTagCol.append(visibleMobile);

  // Desktop Utility Column (CTA buttons and Search)
  const utilityColDesktop = document.createElement('div');
  utilityColDesktop.classList.add('col', 'utility-col', 'visible-desktop');
  const menuParent = document.createElement('div');
  menuParent.classList.add('menu-parent');
  const ctaCol = document.createElement('div');
  ctaCol.classList.add('cta-col');
  moveInstrumentation(ctaButtonsContainer, ctaCol);

  ctaButtons.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    if (index === 0) {
      anchor.classList.add('joinBtn', 'btn', 'bg-primary-e2-blue');
    } else {
      anchor.classList.add('donateBtn', 'btn');
    }
    // Instrumentation already moved for mobile CTA, no need to move again if it's the same row
    ctaCol.append(anchor);
  });

  const searchDesktop = document.createElement('a');
  searchDesktop.classList.add('search');
  searchDesktop.href = '#';
  searchDesktop.setAttribute('aria-label', 'Search');
  ctaCol.append(searchDesktop);
  menuParent.append(ctaCol);
  utilityColDesktop.append(menuParent);
  topRow.append(utilityColDesktop);
  desktopContainer.append(topRow);

  // Bottom Row (Mobile CTA, Main Navigation)
  const bottomRow = document.createElement('div');
  bottomRow.classList.add('row', 'row-bottom');

  const mobileButtonCol = document.createElement('div');
  mobileButtonCol.classList.add('col-12', 'visible-mobile');
  const mobileButtonInner = document.createElement('div');
  mobileButtonInner.classList.add('mobile-button-col');
  // Re-add CTA buttons for mobile bottom section
  ctaButtons.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    if (index === 0) {
      anchor.classList.add('joinBtn', 'btn', 'bg-primary-e2-blue');
    } else {
      anchor.classList.add('donateBtn', 'btn');
    }
    // Instrumentation already moved for desktop CTA, no need to move again if it's the same row
    mobileButtonInner.append(anchor);
  });
  mobileButtonCol.append(mobileButtonInner);
  bottomRow.append(mobileButtonCol);

  const menuCol = document.createElement('div');
  menuCol.classList.add('col-12', 'menu-col');
  const menuColInner = document.createElement('div');
  menuColInner.classList.add('menu-col-inner');
  moveInstrumentation(mainNavigationContainer, menuColInner);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('tbm', 'tbm-tb-mega-main', 'tbm-no-arrows', 'tb-megamenu', 'tb-megamenu-tb-mega-main');
  navWrapper.setAttribute('data-breakpoint', '1200');
  navWrapper.setAttribute('aria-label', 'tb-mega-main navigation');

  const navButton = document.createElement('button');
  navButton.classList.add('btn', 'btn-navbar', 'tb-megamenu-button');
  navButton.setAttribute('type', 'button');
  navButton.setAttribute('aria-label', 'reorder');
  navButton.innerHTML = '<i class="fa fa-reorder"></i>';
  navWrapper.append(navButton);

  const navCollapse = document.createElement('div');
  navCollapse.classList.add('nav-collapse');
  const navList = document.createElement('ul');
  navList.classList.add('tbm-nav', 'level-0', 'tb-megamenu-nav', 'nav');

  mainNavigationLinks.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('tbm-item', 'level-1', 'tb-megamenu-item', 'mega');
    moveInstrumentation(row, li);

    const subList = hierarchyTreeCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a')?.href;

    if (subList) {
      li.classList.add('tbm-item--has-dropdown');
      const trigger = document.createElement('span');
      trigger.classList.add('tbm-link', 'level-1', 'no-link', 'tbm-toggle', 'tb-megamenu-no-link');
      trigger.textContent = labelCell.textContent.trim();
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('aria-expanded', 'false');
      li.append(trigger);

      const submenu = document.createElement('div');
      submenu.classList.add('tbm-submenu', 'tbm-item-child', 'tbm-has-width');
      submenu.style.width = '800px';

      const subRow = document.createElement('div');
      subRow.classList.add('tbm-row');
      submenu.append(subRow);

      const column = document.createElement('div');
      column.classList.add('tbm-column', 'span3');
      const columnInner = document.createElement('div');
      columnInner.classList.add('tbm-column-inner');
      const subNavUl = document.createElement('ul');
      subNavUl.classList.add('tbm-subnav', 'level-1', 'items-1');

      const subLi = document.createElement('li');
      subLi.classList.add('tbm-item', 'level-2', 'tbm-group', 'tb-megamenu-item', 'mega');
      const subTrigger = document.createElement('span');
      subTrigger.classList.add('tbm-link', 'level-2', 'no-link', 'tbm-group-title', 'tb-megamenu-no-link');
      subTrigger.textContent = labelCell.textContent.trim();
      subTrigger.setAttribute('tabindex', '0');
      subTrigger.setAttribute('aria-expanded', 'false');
      subLi.append(subTrigger);

      const subGroupContainer = document.createElement('div');
      subGroupContainer.classList.add('tbm-group-container', 'tbm-item-child');
      const subGroupRow = document.createElement('div');
      subGroupRow.classList.add('tbm-row');
      const subGroupColumn = document.createElement('div');
      subGroupColumn.classList.add('tbm-column', 'span12');
      const subGroupColumnInner = document.createElement('div');
      subGroupColumnInner.classList.add('tbm-column-inner');
      const nestedUl = document.createElement('ul');
      nestedUl.classList.add('tbm-subnav', 'level-2'); // Initial class for the nested UL
      nestedUl.innerHTML = hierarchyTreeCell.innerHTML;
      transformNestedLists(nestedUl); // Apply recursive transformation

      subGroupColumnInner.append(nestedUl);
      subGroupColumn.append(subGroupColumnInner);
      subGroupRow.append(subGroupColumn);
      subGroupContainer.append(subGroupRow);
      subLi.append(subGroupContainer);
      subNavUl.append(subLi);
      columnInner.append(subNavUl);
      column.append(columnInner);
      subRow.append(column);
      li.append(submenu);

      trigger.addEventListener('click', () => {
        li.classList.toggle('active');
        submenu.classList.toggle('active');
        trigger.setAttribute('aria-expanded', li.classList.contains('active'));
      });
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('tbm-link', 'level-1');
      if (directLink) anchor.href = directLink;
      anchor.textContent = labelCell.textContent.trim();
      li.append(anchor);
    }
    navList.append(li);
  });

  navCollapse.append(navList);
  navWrapper.append(navCollapse);
  menuColInner.append(navWrapper);

  // Mobile utility bar (duplicate from desktop for mobile view)
  const mobileUtilityBar = document.createElement('div');
  mobileUtilityBar.classList.add('visible-mobile', 'utility-bar');
  // Re-add utility links for mobile
  utilityLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      if (foundLink.getAttribute('target') === '_blank') {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('aria-label', `${labelCell.textContent.trim()} - open in a new tab`);
      }
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor); // Move instrumentation for each utility link
    mobileUtilityBar.append(anchor);
  });
  // Re-add language dropdown for mobile
  const mobileLangDropdown = document.createElement('div');
  mobileLangDropdown.classList.add('dropdown-lang');
  const mobileLangButton = document.createElement('button');
  mobileLangButton.setAttribute('type', 'button');
  mobileLangButton.textContent = 'EN';
  mobileLangDropdown.append(mobileLangButton);
  const mobileLangMenu = document.createElement('ul');
  mobileLangMenu.classList.add('dropdown-lang-menu');
  languageMenuLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li); // Move instrumentation to the li element
    li.append(anchor);
    mobileLangMenu.append(li);
  });
  mobileLangDropdown.append(mobileLangMenu);
  mobileUtilityBar.append(mobileLangDropdown);
  menuColInner.append(mobileUtilityBar);

  menuCol.append(menuColInner);
  bottomRow.append(menuCol);
  desktopContainer.append(bottomRow);

  block.replaceChildren(root);

  // Optimize images
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Toggle search module
  const searchTrigger = root.querySelector('.nav-trigger');
  const searchModuleEl = root.querySelector('.search-module');
  searchTrigger.addEventListener('click', () => {
    searchModuleEl.classList.toggle('active');
    searchTrigger.classList.toggle('active');
  });

  // Toggle language dropdown
  root.querySelectorAll('.dropdown-lang').forEach((dropdown) => {
    const button = dropdown.querySelector('button');
    const menu = dropdown.querySelector('.dropdown-lang-menu');
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        menu.classList.remove('active');
      }
    });
  });

  // Mobile nav toggle
  const mobileNavTriggerEl = root.querySelector('.mobile-nav-trigger');
  const mobileMenuCol = root.querySelector('.menu-col');
  mobileNavTriggerEl.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenuCol.classList.toggle('active');
    mobileNavTriggerEl.classList.toggle('active');
    root.classList.toggle('mobile-menu-open');
  });

  // Scroll behavior for header
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 0) {
      root.classList.add('nav-up');
      root.classList.remove('nav-down');
    } else if (window.scrollY < lastScrollY && window.scrollY > 0) {
      root.classList.add('nav-down');
      root.classList.remove('nav-up');
    } else {
      root.classList.remove('nav-up', 'nav-down');
    }

    if (window.scrollY > 50) { // Example threshold for 'scrolled' class
      root.classList.add('scrolled');
    } else {
      root.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
  });
}
