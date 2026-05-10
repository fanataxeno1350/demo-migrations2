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
      subWrap.classList.add('tbm-group-container', 'tbm-item-child');
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('tbm-toggle');
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
  // Destructure root rows based on BlockJson model
  const [
    searchPlaceholderRow,
    searchButtonLabelRow,
    logoRow,
    logoLinkRow,
    // The following are container fields, their item rows appear later in `children`
    // We still need to capture their instrumentation.
    utilityLinksContainerRow,
    languageMenuContainerRow,
    ctaButtonsContainerRow,
    navigationMenuContainerRow,
    ...itemRows // All item rows follow these root fields
  ] = [...block.children];

  const searchPlaceholderCell = searchPlaceholderRow.children[0];
  const searchButtonLabelCell = searchButtonLabelRow.children[0];
  const logoCell = logoRow.children[0];
  const logoLinkCell = logoLinkRow.children[0];

  // Filter item rows based on their structure (cell count and content)
  const utilityLinkRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('div:nth-child(3) ul'));
  const languageMenuRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('div:nth-child(2) a'));
  const ctaButtonRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('div:nth-child(2) a'));
  const navigationItemRows = itemRows.filter((row) => row.children.length === 3 && row.querySelector('div:nth-child(3) ul'));

  const section = document.createElement('section');
  section.classList.add('component-global-navigation', 'notranslate');
  moveInstrumentation(block, section);

  // Search Module
  const searchModule = document.createElement('div');
  searchModule.classList.add('search-module');
  const searchContainer = document.createElement('div');
  searchContainer.classList.add('container');
  const searchRow = document.createElement('div');
  searchRow.classList.add('row');

  const navTrigger = document.createElement('div');
  navTrigger.classList.add('nav-trigger');
  const i1 = document.createElement('i');
  const i2 = document.createElement('i');
  const i3 = document.createElement('i');
  navTrigger.append(i1, i2, i3);

  const searchCol = document.createElement('div');
  searchCol.classList.add('col-10', 'offset-1', 'search-col');
  const searchBoxContainer = document.createElement('div');
  searchBoxContainer.classList.add('search-box-container');
  const searchForm = document.createElement('form');
  searchForm.classList.add('views-exposed-form', 'bef-exposed-form');
  searchForm.action = '/en/search-results';
  searchForm.method = 'get';

  const searchInputContainer = document.createElement('div');
  searchInputContainer.classList.add('search-box-container');
  const formItem = document.createElement('div');
  formItem.classList.add('js-form-item', 'form-item', 'form-type-search-api-autocomplete', 'js-form-type-search-api-autocomplete', 'form-item-keys', 'js-form-item-keys', 'form-no-label');
  const searchInput = document.createElement('input');
  searchInput.classList.add('form-autocomplete', 'top-search-text-box', 'form-text', 'ui-autocomplete-input');
  searchInput.type = 'text';
  // Read from richtext cell, but only text content for placeholder
  searchInput.placeholder = searchPlaceholderCell?.textContent.trim() || 'Type to Search...';
  searchInput.name = 'keys';
  searchInput.id = 'edit-keys';
  formItem.append(searchInput);

  const searchButton = document.createElement('input');
  searchButton.classList.add('top-search', 'button', 'js-form-submit', 'form-submit', 'disabled');
  searchButton.type = 'submit';
  searchButton.value = searchButtonLabelCell?.textContent.trim() || 'Search';
  searchButton.disabled = true;

  searchInputContainer.append(formItem, searchButton);
  searchForm.append(searchInputContainer);
  searchBoxContainer.append(searchForm);
  searchCol.append(searchBoxContainer);
  searchRow.append(navTrigger, searchCol);
  searchContainer.append(searchRow);
  searchModule.append(searchContainer);
  section.append(searchModule);

  // Desktop Header
  const desktopDiv = document.createElement('div');
  desktopDiv.classList.add('desktop');
  const relativeWrapper = document.createElement('div');
  relativeWrapper.classList.add('relative-wrapper');
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container');
  desktopDiv.append(relativeWrapper);
  relativeWrapper.append(desktopContainer);

  // Utility Bar
  const rowUtility = document.createElement('div');
  rowUtility.classList.add('row', 'row-utility');
  const utilityBar = document.createElement('div');
  utilityBar.classList.add('utility-bar');
  moveInstrumentation(utilityLinksContainerRow, utilityBar);

  utilityLinkRows.forEach((row) => {
    // Destructure cells for utility-link-item
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const linkEl = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) linkEl.href = foundLink.href;
    linkEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, linkEl);

    const ul = hierarchyTreeCell?.querySelector('ul');
    if (ul) {
      // This is a dropdown utility link
      const dropdownWrapper = document.createElement('div');
      dropdownWrapper.classList.add('dropdown-utility-menu');
      const dropdownButton = document.createElement('button');
      dropdownButton.type = 'button';
      dropdownButton.textContent = linkEl.textContent;
      dropdownButton.addEventListener('click', () => {
        dropdownWrapper.classList.toggle('active');
      });

      const dropdownMenu = document.createElement('ul');
      dropdownMenu.classList.add('dropdown-utility-menu-list');
      // Create a temporary div to hold the hierarchyTreeCell content for transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell
      transformNestedLists(tempDiv.querySelector('ul')); // Transform the UL inside tempDiv

      // Append children from the transformed tempDiv to dropdownMenu
      while (tempDiv.firstChild) {
        dropdownMenu.append(tempDiv.firstChild);
      }
      dropdownWrapper.append(dropdownButton, dropdownMenu);
      utilityBar.append(dropdownWrapper);
    } else {
      // Simple utility link
      utilityBar.append(linkEl);
    }
  });

  // Language Dropdown
  const dropdownLang = document.createElement('div');
  dropdownLang.classList.add('dropdown-lang');
  const langButton = document.createElement('button');
  langButton.type = 'button';
  langButton.textContent = 'EN'; // Default language
  const dropdownLangMenu = document.createElement('ul');
  dropdownLangMenu.classList.add('dropdown-lang-menu');
  moveInstrumentation(languageMenuContainerRow, dropdownLang);

  languageMenuRows.forEach((row) => {
    // Destructure cells for language-menu-item
    const [languageLabelCell, languageLinkCell] = [...row.children];

    const li = document.createElement('li');
    const langLink = document.createElement('a');
    const foundLangLink = languageLinkCell?.querySelector('a');
    if (foundLangLink) langLink.href = foundLangLink.href;
    langLink.textContent = languageLabelCell?.textContent.trim() || '';
    moveInstrumentation(row, langLink);
    li.append(langLink);
    dropdownLangMenu.append(li);
  });

  langButton.addEventListener('click', () => {
    dropdownLangMenu.classList.toggle('active');
  });
  dropdownLang.append(langButton, dropdownLangMenu);
  utilityBar.append(dropdownLang);
  rowUtility.append(utilityBar);
  desktopContainer.append(rowUtility);

  // Top Row (Logo and CTA)
  const rowTop = document.createElement('div');
  rowTop.classList.add('row', 'row-top');
  const col = document.createElement('div');
  col.classList.add('col');
  const innerRow = document.createElement('div');
  innerRow.classList.add('row');
  const logoTagCol = document.createElement('div');
  logoTagCol.classList.add('col', 'logo-tag-col');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'logo-full');
  const foundLogoLink = logoLinkCell?.querySelector('a');
  if (foundLogoLink) logoLink.href = foundLogoLink.href;

  const logoPicture = logoCell?.querySelector('picture');
  if (logoPicture) {
    const optimizedPic = createOptimizedPicture(logoPicture.querySelector('img').src, logoPicture.querySelector('img').alt, false, [{ width: '100' }]);
    moveInstrumentation(logoPicture, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoCell, logoLink);
  moveInstrumentation(logoLinkCell, logoLink);
  logoTagCol.append(logoLink);

  // Mobile CTA and Search (hidden on desktop)
  const visibleMobile = document.createElement('div');
  visibleMobile.classList.add('visible-mobile');
  const btnsScrolled = document.createElement('div');
  btnsScrolled.classList.add('btns-scrolled');
  ctaButtonRows.forEach((row) => {
    // Destructure cells for cta-button-item
    const [labelCell, linkCell] = [...row.children];
    const ctaLink = document.createElement('a');
    const foundCtaLink = linkCell?.querySelector('a');
    if (foundCtaLink) ctaLink.href = foundCtaLink.href;
    ctaLink.textContent = labelCell?.textContent.trim() || '';
    ctaLink.classList.add('btn');
    if (ctaLink.textContent.toLowerCase() === 'join') {
      ctaLink.classList.add('joinBtn', 'bg-primary-e2-blue');
    } else if (ctaLink.textContent.toLowerCase() === 'donate') {
      ctaLink.classList.add('donateBtn');
    }
    moveInstrumentation(row, ctaLink);
    btnsScrolled.append(ctaLink);
  });
  visibleMobile.append(btnsScrolled);

  const searchMobile = document.createElement('a');
  searchMobile.classList.add('search', 'search-mobile', 'visible-mobile');
  searchMobile.href = '#';
  searchMobile.setAttribute('aria-label', 'Search');
  visibleMobile.append(searchMobile);

  const mobileNavTrigger = document.createElement('a');
  mobileNavTrigger.classList.add('mobile-nav-trigger', 'visible-mobile');
  mobileNavTrigger.href = '#';
  mobileNavTrigger.setAttribute('aria-label', 'Mobile menu');
  mobileNavTrigger.innerHTML = '<span></span><span></span><span></span><span></span>';
  visibleMobile.append(mobileNavTrigger);
  logoTagCol.append(visibleMobile);
  innerRow.append(logoTagCol);
  col.append(innerRow);
  rowTop.append(col);

  const utilityCol = document.createElement('div');
  utilityCol.classList.add('col', 'utility-col', 'visible-desktop');
  const menuParent = document.createElement('div');
  menuParent.classList.add('menu-parent');
  const ctaCol = document.createElement('div');
  ctaCol.classList.add('cta-col');
  moveInstrumentation(ctaButtonsContainerRow, ctaCol);

  ctaButtonRows.forEach((row) => {
    // Destructure cells for cta-button-item
    const [labelCell, linkCell] = [...row.children];
    const ctaLink = document.createElement('a');
    const foundCtaLink = linkCell?.querySelector('a');
    if (foundCtaLink) ctaLink.href = foundCtaLink.href;
    ctaLink.textContent = labelCell?.textContent.trim() || '';
    ctaLink.classList.add('btn');
    if (ctaLink.textContent.toLowerCase() === 'join') {
      ctaLink.classList.add('joinBtn', 'bg-primary-e2-blue');
    } else if (ctaLink.textContent.toLowerCase() === 'donate') {
      ctaLink.classList.add('donateBtn');
    }
    moveInstrumentation(row, ctaLink);
    ctaCol.append(ctaLink);
  });

  const searchDesktop = document.createElement('a');
  searchDesktop.classList.add('search');
  searchDesktop.href = '#';
  searchDesktop.setAttribute('aria-label', 'Search');
  ctaCol.append(searchDesktop);
  menuParent.append(ctaCol);
  utilityCol.append(menuParent);
  rowTop.append(utilityCol);
  desktopContainer.append(rowTop);

  // Bottom Row (Navigation Menu)
  const rowBottom = document.createElement('div');
  rowBottom.classList.add('row', 'row-bottom');
  const col12Mobile = document.createElement('div');
  col12Mobile.classList.add('col-12', 'visible-mobile');
  const mobileButtonCol = document.createElement('div');
  mobileButtonCol.classList.add('mobile-button-col');
  // Re-add CTA buttons for mobile
  ctaButtonRows.forEach((row) => {
    // Destructure cells for cta-button-item
    const [labelCell, linkCell] = [...row.children];
    const ctaLink = document.createElement('a');
    const foundCtaLink = linkCell?.querySelector('a');
    if (foundCtaLink) ctaLink.href = foundCtaLink.href;
    ctaLink.textContent = labelCell?.textContent.trim() || '';
    ctaLink.classList.add('btn');
    if (ctaLink.textContent.toLowerCase() === 'join') {
      ctaLink.classList.add('joinBtn', 'bg-primary-e2-blue');
    } else if (ctaLink.textContent.toLowerCase() === 'donate') {
      ctaLink.classList.add('donateBtn');
    }
    // No moveInstrumentation needed here as they are already moved above
    mobileButtonCol.append(ctaLink);
  });
  col12Mobile.append(mobileButtonCol);
  rowBottom.append(col12Mobile);

  const menuCol = document.createElement('div');
  menuCol.classList.add('col-12', 'menu-col');
  const menuColInner = document.createElement('div');
  menuColInner.classList.add('menu-col-inner');
  const tbm = document.createElement('div');
  tbm.classList.add('tbm', 'tbm-tb-mega-main', 'tbm-no-arrows', 'tb-megamenu', 'tb-megamenu-tb-mega-main');
  moveInstrumentation(navigationMenuContainerRow, tbm);

  const navCollapse = document.createElement('div');
  navCollapse.classList.add('nav-collapse');
  const tbmNav = document.createElement('ul');
  tbmNav.classList.add('tbm-nav', 'level-0', 'tb-megamenu-nav', 'nav');

  navigationItemRows.forEach((row) => {
    // Destructure cells for navigation-item
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('tbm-item', 'level-1', 'tb-megamenu-item', 'mega');
    moveInstrumentation(row, li);

    const ul = hierarchyTreeCell?.querySelector('ul');
    if (ul) {
      li.classList.add('tbm-item--has-dropdown');
      const span = document.createElement('span');
      span.classList.add('tbm-link', 'level-1', 'no-link', 'tbm-toggle', 'tb-megamenu-no-link');
      span.textContent = labelCell?.textContent.trim() || '';
      span.setAttribute('tabindex', '0');
      span.setAttribute('aria-expanded', 'false');

      const submenu = document.createElement('div');
      submenu.classList.add('tbm-submenu', 'tbm-item-child', 'tbm-has-width');
      submenu.style.width = '800px'; // Example width, adjust as needed

      const submenuRow = document.createElement('div');
      submenuRow.classList.add('tbm-row');

      // Create a temporary div to hold the hierarchyTreeCell content for transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell
      transformNestedLists(tempDiv.querySelector('ul')); // Transform the UL inside tempDiv

      [...tempDiv.querySelector('ul').children].forEach((topLevelLi) => {
        const submenuColumn = document.createElement('div');
        submenuColumn.classList.add('tbm-column', 'span3');
        const submenuColumnInner = document.createElement('div');
        submenuColumnInner.classList.add('tbm-column-inner');
        const subnav = document.createElement('ul');
        subnav.classList.add('tbm-subnav', 'level-1', 'items-1');

        const newTopLevelLi = document.createElement('li');
        newTopLevelLi.classList.add('tbm-item', 'level-2', 'tbm-group', 'tb-megamenu-item', 'mega');
        while (topLevelLi.firstChild) newTopLevelLi.append(topLevelLi.firstChild);
        subnav.append(newTopLevelLi);
        submenuColumnInner.append(subnav);
        submenuColumn.append(submenuColumnInner);
        submenuRow.append(submenuColumn);
      });
      submenu.append(submenuRow);
      li.append(span, submenu);

      span.addEventListener('click', () => {
        span.classList.toggle('active');
        submenu.classList.toggle('active');
        span.setAttribute('aria-expanded', span.classList.contains('active'));
      });
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('tbm-link', 'level-1');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell?.textContent.trim() || '';
      li.append(anchor);
    }
    tbmNav.append(li);
  });

  navCollapse.append(tbmNav);
  tbm.append(navCollapse);
  menuColInner.append(tbm);

  // Mobile Utility Bar (duplicate for mobile view)
  const mobileUtilityBar = document.createElement('div');
  mobileUtilityBar.classList.add('visible-mobile', 'utility-bar');
  // Re-add utility links for mobile
  utilityLinkRows.forEach((row) => {
    // Destructure cells for utility-link-item
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const linkEl = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) linkEl.href = foundLink.href;
    linkEl.textContent = labelCell?.textContent.trim() || '';

    const ul = hierarchyTreeCell?.querySelector('ul');
    if (ul) {
      const dropdownWrapper = document.createElement('div');
      dropdownWrapper.classList.add('dropdown-utility-menu');
      const dropdownButton = document.createElement('button');
      dropdownButton.type = 'button';
      dropdownButton.textContent = linkEl.textContent;
      dropdownButton.addEventListener('click', () => {
        dropdownWrapper.classList.toggle('active');
      });

      const dropdownMenu = document.createElement('ul');
      dropdownMenu.classList.add('dropdown-utility-menu-list');
      // Create a temporary div to hold the hierarchyTreeCell content for transformation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      // No moveInstrumentation here as this is a duplicate for mobile, original is already moved
      transformNestedLists(tempDiv.querySelector('ul')); // Transform the UL inside tempDiv

      // Append children from the transformed tempDiv to dropdownMenu
      while (tempDiv.firstChild) {
        dropdownMenu.append(tempDiv.firstChild);
      }
      dropdownWrapper.append(dropdownButton, dropdownMenu);
      mobileUtilityBar.append(dropdownWrapper);
    } else {
      mobileUtilityBar.append(linkEl);
    }
  });

  // Mobile Language Dropdown
  const mobileDropdownLang = document.createElement('div');
  mobileDropdownLang.classList.add('dropdown-lang');
  const mobileLangButton = document.createElement('button');
  mobileLangButton.type = 'button';
  mobileLangButton.textContent = 'EN';
  const mobileDropdownLangMenu = document.createElement('ul');
  mobileDropdownLangMenu.classList.add('dropdown-lang-menu');

  languageMenuRows.forEach((row) => {
    // Destructure cells for language-menu-item
    const [languageLabelCell, languageLinkCell] = [...row.children];

    const li = document.createElement('li');
    const langLink = document.createElement('a');
    const foundLangLink = languageLinkCell?.querySelector('a');
    if (foundLangLink) langLink.href = foundLangLink.href;
    langLink.textContent = languageLabelCell?.textContent.trim() || '';
    li.append(langLink);
    mobileDropdownLangMenu.append(li);
  });

  mobileLangButton.addEventListener('click', () => {
    mobileDropdownLangMenu.classList.toggle('active');
  });
  mobileDropdownLang.append(mobileLangButton, mobileDropdownLangMenu);
  mobileUtilityBar.append(mobileDropdownLang);
  menuColInner.append(mobileUtilityBar);

  menuCol.append(menuColInner);
  rowBottom.append(menuCol);
  desktopContainer.append(rowBottom);

  section.append(desktopDiv);

  block.replaceChildren(section);

  // Add scroll listener for header
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
      section.classList.add('nav-up');
      section.classList.remove('nav-down');
    } else {
      section.classList.remove('nav-up');
      section.classList.add('nav-down');
    }
    lastScrollY = window.scrollY;

    if (window.scrollY > 0) {
      section.classList.add('scrolled');
    } else {
      section.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  mobileNavTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('mobile-menu-open');
    mobileNavTrigger.classList.toggle('active');
  });

  // Search toggle
  const searchToggle = (e) => {
    e.preventDefault();
    searchModule.classList.toggle('active');
    navTrigger.classList.toggle('active');
    if (searchModule.classList.contains('active')) {
      searchInput.focus();
    }
  };
  navTrigger.addEventListener('click', searchToggle);
  searchMobile.addEventListener('click', searchToggle);
  searchDesktop.addEventListener('click', searchToggle);
}
