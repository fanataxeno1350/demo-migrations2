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
    // Apply classes to nested elements from ORIGINAL HTML
    li.classList.add('tbm-item', 'level-3', 'tb-megamenu-item', 'mega');
    if (anchor) {
      anchor.classList.add('tbm-link', 'level-3');
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];
  const [
    logoRow,
    logoLinkRow,
    searchPlaceholderRow,
    searchButtonLabelRow,
    utilityLinksContainer, // This is a placeholder row for the container, not an item row itself
    languageOptionsContainer, // Placeholder row
    menuNavigationContainer, // Placeholder row
    ctaButtonsContainer, // Placeholder row
    ...itemRows
  ] = children;

  const root = document.createElement('section');
  root.classList.add('component-global-navigation', 'notranslate', 'scrolled');
  moveInstrumentation(block, root);

  // Search Module
  const searchModule = document.createElement('div');
  searchModule.classList.add('search-module');
  const searchContainer = document.createElement('div');
  searchContainer.classList.add('container');
  const searchRow = document.createElement('div');
  searchRow.classList.add('row');

  const navTrigger = document.createElement('div');
  navTrigger.classList.add('nav-trigger', 'active');
  for (let i = 0; i < 3; i += 1) {
    navTrigger.append(document.createElement('i'));
  }

  const searchCol = document.createElement('div');
  searchCol.classList.add('col-10', 'offset-1', 'search-col');
  const searchBoxContainer = document.createElement('div');
  searchBoxContainer.classList.add('search-box-container');

  const searchForm = document.createElement('form');
  searchForm.classList.add('views-exposed-form', 'bef-exposed-form');
  searchForm.setAttribute('action', '/en/search-results');
  searchForm.setAttribute('method', 'get');

  const searchInputContainer = document.createElement('div');
  searchInputContainer.classList.add(
    'js-form-item',
    'form-item',
    'form-type-search-api-autocomplete',
    'js-form-type-search-api-autocomplete',
    'form-item-keys',
    'js-form-item-keys',
    'form-no-label',
  );

  const searchInput = document.createElement('input');
  searchInput.classList.add('form-autocomplete', 'top-search-text-box', 'form-text');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('placeholder', searchPlaceholderRow.textContent.trim());
  searchInput.setAttribute('name', 'keys');
  searchInput.setAttribute('aria-label', searchPlaceholderRow.textContent.trim());

  const searchButton = document.createElement('input');
  searchButton.classList.add('top-search', 'button', 'js-form-submit', 'form-submit', 'disabled');
  searchButton.setAttribute('type', 'submit');
  searchButton.setAttribute('value', searchButtonLabelRow.textContent.trim());
  searchButton.setAttribute('aria-label', searchButtonLabelRow.textContent.trim());
  searchButton.setAttribute('disabled', '');

  searchInputContainer.append(searchInput);
  searchBoxContainer.append(searchInputContainer, searchButton);
  searchForm.append(searchBoxContainer);
  searchCol.append(searchBoxContainer);
  searchRow.append(navTrigger, searchCol);
  searchContainer.append(searchRow);
  searchModule.append(searchContainer);
  root.append(searchModule);

  // Desktop Navigation
  const desktopNav = document.createElement('div');
  desktopNav.classList.add('desktop');
  const relativeWrapper = document.createElement('div');
  relativeWrapper.classList.add('relative-wrapper');
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container');
  relativeWrapper.append(desktopContainer);
  desktopNav.append(relativeWrapper);
  root.append(desktopNav);

  // Utility Bar
  const utilityRow = document.createElement('div');
  utilityRow.classList.add('row', 'row-utility');
  const utilityBar = document.createElement('div');
  utilityBar.classList.add('utility-bar');
  // moveInstrumentation(utilityLinksContainer, utilityBar); // utilityLinksContainer is a placeholder, not a rendered element
  utilityRow.append(utilityBar);
  desktopContainer.append(utilityRow);

  // Filter item rows based on cell count and content
  const utilityLinkRows = itemRows.filter((row) => row.children.length === 3 && !row.children[2].querySelector('ul')); // 3 cells, no hierarchy tree
  const languageOptionRows = itemRows.filter((row) => row.children.length === 2); // 2 cells
  const menuNavigationRows = itemRows.filter((row) => row.children.length === 3 && row.children[2].querySelector('ul')); // 3 cells, has hierarchy tree
  const ctaButtonRows = itemRows.filter((row) => row.children.length === 2); // 2 cells

  utilityLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, link);
    utilityBar.append(link);
  });

  // Language Dropdown
  const dropdownLang = document.createElement('div');
  dropdownLang.classList.add('dropdown-lang');
  // moveInstrumentation(languageOptionsContainer, dropdownLang); // languageOptionsContainer is a placeholder
  const langButton = document.createElement('button');
  langButton.setAttribute('type', 'button');
  // Set default language from the first language option if available, otherwise 'EN'
  langButton.textContent = languageOptionRows[0]?.children[0]?.textContent.trim() || 'EN';

  const langMenu = document.createElement('ul');
  langMenu.classList.add('dropdown-lang-menu');

  languageOptionRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(link);
    langMenu.append(li);
  });

  langButton.addEventListener('click', () => {
    langMenu.classList.toggle('show');
  });

  dropdownLang.append(langButton, langMenu);
  utilityBar.append(dropdownLang);

  // Top Row (Logo, Mobile Buttons, Search)
  const topRow = document.createElement('div');
  topRow.classList.add('row', 'row-top');
  const col = document.createElement('div');
  col.classList.add('col');
  const rowInner = document.createElement('div');
  rowInner.classList.add('row');
  col.append(rowInner);
  topRow.append(col);
  desktopContainer.append(topRow);

  const logoTagCol = document.createElement('div');
  logoTagCol.classList.add('col', 'logo-tag-col');
  rowInner.append(logoTagCol);

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'logo-full');
  const logoImg = logoRow.querySelector('picture');
  if (logoImg) {
    const optimizedPic = createOptimizedPicture(logoImg.querySelector('img').src, logoImg.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) logoLink.href = foundLogoLink.href;
  logoLink.setAttribute('aria-label', 'Open this option');
  moveInstrumentation(logoLinkRow, logoLink);
  logoTagCol.append(logoLink);

  const visibleMobile = document.createElement('div');
  visibleMobile.classList.add('visible-mobile');
  const btnsScrolled = document.createElement('div');
  btnsScrolled.classList.add('btns-scrolled');
  visibleMobile.append(btnsScrolled);
  logoTagCol.append(visibleMobile);

  ctaButtonRows.forEach((row) => {
    const [ctaLabelCell, ctaLinkCell] = [...row.children]; // Destructuring for fixed schema
    const link = document.createElement('a');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = ctaLabelCell.textContent.trim();
    link.setAttribute('tabindex', '-1');
    link.classList.add('btn');
    if (ctaLabelCell.textContent.trim().toLowerCase() === 'join') {
      link.classList.add('joinBtn', 'bg-primary-e2-blue');
    } else if (ctaLabelCell.textContent.trim().toLowerCase() === 'donate') {
      link.classList.add('donateBtn');
    }
    moveInstrumentation(row, link);
    btnsScrolled.append(link);
  });

  const searchMobile = document.createElement('a');
  searchMobile.classList.add('search', 'search-mobile', 'visible-mobile');
  searchMobile.setAttribute('href', '#');
  searchMobile.setAttribute('aria-label', 'Search');
  searchMobile.setAttribute('tabindex', '-1');
  logoTagCol.append(searchMobile);

  // Event listener for mobile search toggle
  searchMobile.addEventListener('click', (e) => {
    e.preventDefault();
    searchModule.classList.toggle('active');
    root.classList.toggle('search-active');
  });

  const mobileNavTrigger = document.createElement('a');
  mobileNavTrigger.classList.add('mobile-nav-trigger', 'visible-mobile');
  mobileNavTrigger.setAttribute('href', '#');
  mobileNavTrigger.setAttribute('aria-label', 'Mobile menu');
  mobileNavTrigger.setAttribute('tabindex', '-1');
  for (let i = 0; i < 4; i += 1) {
    mobileNavTrigger.append(document.createElement('span'));
  }
  logoTagCol.append(mobileNavTrigger);

  // Event listener for mobile navigation toggle
  mobileNavTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    root.classList.toggle('active');
  });

  const utilityCol = document.createElement('div');
  utilityCol.classList.add('col', 'utility-col', 'visible-desktop');
  topRow.append(utilityCol);

  const menuParent = document.createElement('div');
  menuParent.classList.add('menu-parent');
  utilityCol.append(menuParent);

  const ctaCol = document.createElement('div');
  ctaCol.classList.add('cta-col');
  menuParent.append(ctaCol);

  ctaButtonRows.forEach((row) => {
    const [ctaLabelCell, ctaLinkCell] = [...row.children]; // Destructuring for fixed schema
    const link = document.createElement('a');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = ctaLabelCell.textContent.trim();
    link.classList.add('btn');
    if (ctaLabelCell.textContent.trim().toLowerCase() === 'join') {
      link.classList.add('joinBtn', 'bg-primary-e2-blue');
    } else if (ctaLabelCell.textContent.trim().toLowerCase() === 'donate') {
      link.classList.add('donateBtn');
    }
    moveInstrumentation(row, link);
    ctaCol.append(link);
  });

  const desktopSearch = document.createElement('a');
  desktopSearch.classList.add('search');
  desktopSearch.setAttribute('href', '#');
  desktopSearch.setAttribute('aria-label', 'Search');
  ctaCol.append(desktopSearch);

  // Event listener for desktop search toggle
  desktopSearch.addEventListener('click', (e) => {
    e.preventDefault();
    searchModule.classList.toggle('active');
    root.classList.toggle('search-active');
  });

  // Bottom Row (Main Navigation)
  const bottomRow = document.createElement('div');
  bottomRow.classList.add('row', 'row-bottom');
  desktopContainer.append(bottomRow);

  const mobileButtonCol = document.createElement('div');
  mobileButtonCol.classList.add('col-12', 'visible-mobile');
  const mobileButtonInner = document.createElement('div');
  mobileButtonInner.classList.add('mobile-button-col');
  mobileButtonCol.append(mobileButtonInner);
  bottomRow.append(mobileButtonCol);

  ctaButtonRows.forEach((row) => {
    const [ctaLabelCell, ctaLinkCell] = [...row.children]; // Destructuring for fixed schema
    const link = document.createElement('a');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = ctaLabelCell.textContent.trim();
    link.classList.add('btn');
    if (ctaLabelCell.textContent.trim().toLowerCase() === 'join') {
      link.classList.add('joinBtn', 'bg-primary-e2-blue');
    } else if (ctaLabelCell.textContent.trim().toLowerCase() === 'donate') {
      link.classList.add('donateBtn');
    }
    moveInstrumentation(row, link);
    mobileButtonInner.append(link);
  });

  const menuCol = document.createElement('div');
  menuCol.classList.add('col-12', 'menu-col');
  const menuColInner = document.createElement('div');
  menuColInner.classList.add('menu-col-inner');
  menuCol.append(menuColInner);
  bottomRow.append(menuCol);

  const tbMegamenu = document.createElement('div');
  tbMegamenu.classList.add(
    'tbm',
    'tbm-tb-mega-main',
    'tbm-no-arrows',
    'tb-megamenu',
    'tb-megamenu-tb-mega-main',
  );
  tbMegamenu.setAttribute('data-breakpoint', '1200');
  tbMegamenu.setAttribute('aria-label', 'tb-mega-main navigation');
  menuColInner.append(tbMegamenu);
  // moveInstrumentation(menuNavigationContainer, tbMegamenu); // menuNavigationContainer is a placeholder

  const navCollapse = document.createElement('div');
  navCollapse.classList.add('nav-collapse');
  tbMegamenu.append(navCollapse);

  const navList = document.createElement('ul');
  navList.classList.add('tbm-nav', 'level-0', 'items-4', 'tb-megamenu-nav', 'nav');
  navCollapse.append(navList);

  menuNavigationRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    li.classList.add('tbm-item', 'level-1', 'tb-megamenu-item', 'mega');
    moveInstrumentation(row, li);

    const subListContent = hierarchyTreeCell?.innerHTML || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = subListContent;
    const subList = tempDiv.querySelector('ul'); // Get the actual UL from the richtext
    const directHref = linkCell?.querySelector('a')?.href;

    if (subList) {
      li.classList.add('tbm-item--has-dropdown');
      const span = document.createElement('span');
      span.classList.add('tbm-link', 'level-1', 'no-link', 'tbm-toggle', 'tb-megamenu-no-link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('aria-expanded', 'false');
      span.textContent = labelCell.textContent.trim();
      li.append(span);

      const submenu = document.createElement('div');
      submenu.classList.add('tbm-submenu', 'tbm-item-child', 'tbm-has-width');
      submenu.style.width = '800px'; // Example width, adjust as needed

      const submenuRow = document.createElement('div');
      submenuRow.classList.add('tbm-row');
      submenu.append(submenuRow);

      const column = document.createElement('div');
      column.classList.add('tbm-column', 'span3');
      const columnInner = document.createElement('div');
      columnInner.classList.add('tbm-column-inner');
      column.append(columnInner);
      submenuRow.append(column);

      const subnavList = document.createElement('ul');
      subnavList.classList.add('tbm-subnav', 'level-1', 'items-1');
      columnInner.append(subnavList);

      const subLi = document.createElement('li');
      subLi.classList.add('tbm-item', 'level-2', 'tbm-group', 'tb-megamenu-item', 'mega');
      const subSpan = document.createElement('span');
      subSpan.classList.add('tbm-link', 'level-2', 'no-link', 'tbm-group-title', 'tb-megamenu-no-link');
      subSpan.setAttribute('tabindex', '0');
      subSpan.setAttribute('aria-expanded', 'false');
      subSpan.textContent = labelCell.textContent.trim(); // Use the main label for the group title
      subLi.append(subSpan);

      const groupContainer = document.createElement('div');
      groupContainer.classList.add('tbm-group-container', 'tbm-item-child');
      const groupRow = document.createElement('div');
      groupRow.classList.add('tbm-row');
      const groupColumn = document.createElement('div');
      groupColumn.classList.add('tbm-column', 'span12');
      const groupColumnInner = document.createElement('div');
      groupColumnInner.classList.add('tbm-column-inner');
      groupColumn.append(groupColumnInner);
      groupRow.append(groupColumn);
      groupContainer.append(groupRow);

      const innerSubnavList = document.createElement('ul');
      innerSubnavList.classList.add('tbm-subnav', 'level-2');
      groupColumnInner.append(innerSubnavList);

      // Apply instrumentation to the richtext content before transforming
      moveInstrumentation(hierarchyTreeCell, tempDiv);
      transformNestedLists(subList);
      innerSubnavList.append(...subList.children);

      subLi.append(groupContainer);
      subnavList.append(subLi);
      submenu.append(subnavList); // Append subnavList to submenu
      li.append(submenu);

      span.addEventListener('click', () => {
        li.classList.toggle('active');
        submenu.classList.toggle('active');
        span.setAttribute('aria-expanded', li.classList.contains('active'));
      });
    } else {
      const anchor = document.createElement('a');
      if (directHref) anchor.href = directHref;
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('tbm-link', 'level-1');
      li.append(anchor);
    }
    navList.append(li);
  });

  const mobileUtilityBar = document.createElement('div');
  mobileUtilityBar.classList.add('visible-mobile');
  const mobileUtilityInner = document.createElement('div');
  mobileUtilityInner.classList.add('utility-bar');
  mobileUtilityBar.append(mobileUtilityInner);
  menuColInner.append(mobileUtilityBar);

  utilityLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, link);
    mobileUtilityInner.append(link);
  });

  const mobileDropdownLang = document.createElement('div');
  mobileDropdownLang.classList.add('dropdown-lang');
  // moveInstrumentation(languageOptionsContainer, mobileDropdownLang); // languageOptionsContainer is a placeholder
  const mobileLangButton = document.createElement('button');
  mobileLangButton.setAttribute('type', 'button');
  // Set default language from the first language option if available, otherwise 'EN'
  mobileLangButton.textContent = languageOptionRows[0]?.children[0]?.textContent.trim() || 'EN';

  const mobileLangMenu = document.createElement('ul');
  mobileLangMenu.classList.add('dropdown-lang-menu');

  languageOptionRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(link);
    mobileLangMenu.append(li);
  });

  mobileLangButton.addEventListener('click', () => {
    mobileLangMenu.classList.toggle('show');
  });

  mobileDropdownLang.append(mobileLangButton, mobileLangMenu);
  mobileUtilityInner.append(mobileDropdownLang);

  block.replaceChildren(root);

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
