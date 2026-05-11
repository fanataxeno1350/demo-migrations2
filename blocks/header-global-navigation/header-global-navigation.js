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
        trigger.classList.add('tbm-toggle', 'tb-megamenu-no-link');
        trigger.setAttribute('tabindex', '0');
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
}

export default function decorate(block) {
  const [
    searchPlaceholderRow,
    searchButtonLabelRow,
    logoRow,
    logoLinkRow,
    utilityLinksContainer,
    languagesContainer,
    ctaButtonsContainer,
    navigationContainer,
    ...itemRows
  ] = [...block.children];

  const header = document.createElement('section');
  header.classList.add('component-global-navigation', 'notranslate');
  moveInstrumentation(block, header);

  // Search Module
  const searchModule = document.createElement('div');
  searchModule.classList.add('search-module');
  moveInstrumentation(searchPlaceholderRow, searchModule);
  moveInstrumentation(searchButtonLabelRow, searchModule);

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('container');
  const searchRow = document.createElement('div');
  searchRow.classList.add('row');

  const navTrigger = document.createElement('div');
  navTrigger.classList.add('nav-trigger');
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
  searchForm.setAttribute('accept-charset', 'UTF-8');

  const searchInputContainer = document.createElement('div');
  searchInputContainer.classList.add('search-box-container');
  const searchItem = document.createElement('div');
  searchItem.classList.add('js-form-item', 'form-item', 'form-type-search-api-autocomplete', 'js-form-type-search-api-autocomplete', 'form-item-keys', 'js-form-item-keys', 'form-no-label');

  const searchInput = document.createElement('input');
  searchInput.setAttribute('placeholder', searchPlaceholderRow.children[0].textContent.trim());
  searchInput.classList.add('form-autocomplete', 'top-search-text-box', 'form-text', 'ui-autocomplete-input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('id', 'edit-keys');
  searchInput.setAttribute('name', 'keys');
  searchInput.setAttribute('value', '');
  searchInput.setAttribute('maxlength', '128');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.setAttribute('aria-label', 'Type to Search...');

  const searchButton = document.createElement('input');
  searchButton.classList.add('top-search', 'button', 'js-form-submit', 'form-submit', 'disabled');
  searchButton.setAttribute('type', 'submit');
  searchButton.setAttribute('id', 'edit-submit-lions-solr-search');
  searchButton.setAttribute('value', searchButtonLabelRow.children[0].textContent.trim());
  searchButton.setAttribute('disabled', '');
  searchButton.setAttribute('aria-label', 'Submit button');

  searchItem.append(searchInput);
  searchInputContainer.append(searchItem, searchButton);
  searchForm.append(searchInputContainer);
  searchBoxContainer.append(searchForm);
  searchCol.append(searchBoxContainer);
  searchRow.append(navTrigger, searchCol);
  searchContainer.append(searchRow);
  searchModule.append(searchContainer);
  header.append(searchModule);

  // Desktop Navigation
  const desktopNav = document.createElement('div');
  desktopNav.classList.add('desktop');
  const relativeWrapper = document.createElement('div');
  relativeWrapper.classList.add('relative-wrapper');
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container');

  // Utility Bar
  const utilityRow = document.createElement('div');
  utilityRow.classList.add('row', 'row-utility');
  const utilityBar = document.createElement('div');
  utilityBar.classList.add('utility-bar');
  moveInstrumentation(utilityLinksContainer, utilityBar);

  const utilityLinks = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('div:nth-child(3) ul')); // Filter for utility-link-item
  utilityLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructure for utility-link-item
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      if (foundLink.getAttribute('target')) {
        link.target = foundLink.getAttribute('target');
      }
      if (foundLink.getAttribute('aria-label')) {
        link.setAttribute('aria-label', foundLink.getAttribute('aria-label'));
      }
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, link);
    utilityBar.append(link);
  });

  // Language Dropdown
  const langDropdown = document.createElement('div');
  langDropdown.classList.add('dropdown-lang');
  moveInstrumentation(languagesContainer, langDropdown);

  const langButton = document.createElement('button');
  langButton.setAttribute('type', 'button');
  langButton.textContent = 'EN'; // Default language

  const langMenu = document.createElement('ul');
  langMenu.classList.add('dropdown-lang-menu');

  const languageOptions = itemRows.filter((row) => row.children.length === 2); // Filter for language-option-item
  languageOptions.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructure for language-option-item

    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, link);
    li.append(link);
    langMenu.append(li);
  });

  langButton.addEventListener('click', () => {
    langMenu.classList.toggle('active');
  });
  langDropdown.append(langButton, langMenu);
  utilityBar.append(langDropdown);
  utilityRow.append(utilityBar);
  desktopContainer.append(utilityRow);

  // Top Row (Logo, Mobile CTA, Search, Mobile Nav)
  const topRow = document.createElement('div');
  topRow.classList.add('row', 'row-top');
  const col = document.createElement('div');
  col.classList.add('col');
  const innerRow = document.createElement('div');
  innerRow.classList.add('row');
  const logoTagCol = document.createElement('div');
  logoTagCol.classList.add('col', 'logo-tag-col');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'logo-full');
  const foundLogoLink = logoLinkRow.children[0].querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  logoLink.setAttribute('aria-label', 'Open this option');
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.children[0].querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  logoTagCol.append(logoLink);

  const visibleMobile = document.createElement('div');
  visibleMobile.classList.add('visible-mobile');
  const btnsScrolled = document.createElement('div');
  btnsScrolled.classList.add('btns-scrolled');

  const ctaButtons = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('div:nth-child(2) ul')); // Filter for cta-button-item
  ctaButtons.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children]; // Destructure for cta-button-item

    const ctaLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }
    ctaLink.textContent = labelCell.textContent.trim();
    ctaLink.setAttribute('tabindex', '-1');
    if (index === 0) {
      ctaLink.classList.add('joinBtn', 'btn', 'bg-primary-e2-blue');
    } else {
      ctaLink.classList.add('donateBtn', 'btn');
    }
    moveInstrumentation(row, ctaLink);
    btnsScrolled.append(ctaLink);
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
  for (let i = 0; i < 4; i += 1) {
    mobileNavTrigger.append(document.createElement('span'));
  }
  visibleMobile.append(mobileNavTrigger);
  logoTagCol.append(visibleMobile);
  innerRow.append(logoTagCol);
  col.append(innerRow);
  topRow.append(col);

  const utilityCol = document.createElement('div');
  utilityCol.classList.add('col', 'utility-col', 'visible-desktop');
  const menuParent = document.createElement('div');
  menuParent.classList.add('menu-parent');
  moveInstrumentation(ctaButtonsContainer, menuParent);

  const ctaCol = document.createElement('div');
  ctaCol.classList.add('cta-col');

  ctaButtons.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children]; // Destructure for cta-button-item

    const ctaLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }
    ctaLink.textContent = labelCell.textContent.trim();
    if (index === 0) {
      ctaLink.classList.add('joinBtn', 'btn', 'bg-primary-e2-blue');
    } else {
      ctaLink.classList.add('donateBtn', 'btn');
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
  topRow.append(utilityCol);
  desktopContainer.append(topRow);

  // Bottom Row (Main Navigation)
  const bottomRow = document.createElement('div');
  bottomRow.classList.add('row', 'row-bottom');

  const mobileButtonCol = document.createElement('div');
  mobileButtonCol.classList.add('col-12', 'visible-mobile');
  const mobileButtons = document.createElement('div');
  mobileButtons.classList.add('mobile-button-col');
  // Re-add CTA buttons for mobile bottom section if needed
  ctaButtons.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children]; // Destructure for cta-button-item

    const ctaLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }
    ctaLink.textContent = labelCell.textContent.trim();
    if (index === 0) {
      ctaLink.classList.add('joinBtn', 'btn', 'bg-primary-e2-blue');
    } else {
      ctaLink.classList.add('donateBtn', 'btn');
    }
    // No moveInstrumentation here as it's a re-use of already instrumented rows
    mobileButtons.append(ctaLink);
  });
  mobileButtonCol.append(mobileButtons);
  bottomRow.append(mobileButtonCol);

  const menuCol = document.createElement('div');
  menuCol.classList.add('col-12', 'menu-col');
  const menuColInner = document.createElement('div');
  menuColInner.classList.add('menu-col-inner');
  moveInstrumentation(navigationContainer, menuColInner);

  const tbm = document.createElement('div');
  tbm.classList.add('tbm', 'tbm-tb-mega-main', 'tbm-no-arrows', 'tb-megamenu', 'tb-megamenu-tb-mega-main');
  tbm.setAttribute('data-breakpoint', '1200');
  tbm.setAttribute('aria-label', 'tb-mega-main navigation');

  const navCollapse = document.createElement('div');
  navCollapse.classList.add('nav-collapse');

  const navList = document.createElement('ul');
  navList.classList.add('tbm-nav', 'level-0', 'items-4', 'tb-megamenu-nav', 'nav');

  const globalNavItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('div:nth-child(3) ul')); // Filter for global-navigation-item
  globalNavItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Destructure for global-navigation-item

    const li = document.createElement('li');
    li.classList.add('tbm-item', 'level-1', 'tbm-item--has-dropdown', 'tb-megamenu-item', 'mega');
    li.setAttribute('aria-level', '1');
    li.setAttribute('data-title', labelCell.textContent.trim());
    moveInstrumentation(row, li);

    const spanLink = document.createElement('span');
    spanLink.classList.add('tbm-link', 'level-1', 'no-link', 'tbm-toggle', 'tb-megamenu-no-link');
    spanLink.setAttribute('tabindex', '0');
    spanLink.setAttribute('aria-expanded', 'false');
    spanLink.textContent = labelCell.textContent.trim();

    const subMenu = document.createElement('div');
    subMenu.classList.add('tbm-submenu', 'tbm-item-child', 'tbm-has-width');
    subMenu.style.width = '800px';

    const subMenuRow = document.createElement('div');
    subMenuRow.classList.add('tbm-row');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      transformNestedLists(subList);
      moveInstrumentation(hierarchyCell, subList); // Instrument the richtext content

      const columns = [...subList.children];
      columns.forEach((columnLi) => {
        const tbmColumn = document.createElement('div');
        tbmColumn.classList.add('tbm-column', 'span3');
        const tbmColumnInner = document.createElement('div');
        tbmColumnInner.classList.add('tbm-column-inner');

        const tbmSubnav = document.createElement('ul');
        tbmSubnav.classList.add('tbm-subnav', 'level-1', 'items-1');
        tbmSubnav.append(columnLi);

        tbmColumnInner.append(tbmSubnav);
        tbmColumn.append(tbmColumnInner);
        subMenuRow.append(tbmColumn);
      });
    } else {
      const link = document.createElement('a');
      link.classList.add('tbm-link', 'level-1');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.textContent = labelCell.textContent.trim();
      spanLink.replaceWith(link);
    }

    subMenu.append(subMenuRow);
    li.append(spanLink, subMenu);
    navList.append(li);

    spanLink.addEventListener('click', () => {
      li.classList.toggle('active');
      spanLink.setAttribute('aria-expanded', li.classList.contains('active'));
    });
  });

  navCollapse.append(navList);
  tbm.append(navCollapse);
  menuColInner.append(tbm);

  // Mobile Utility Bar (duplicate for mobile view)
  const mobileUtilityBar = document.createElement('div');
  mobileUtilityBar.classList.add('visible-mobile');
  const mobileUtilityBarInner = document.createElement('div');
  mobileUtilityBarInner.classList.add('utility-bar');

  utilityLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructure for utility-link-item

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      if (foundLink.getAttribute('target')) {
        link.target = foundLink.getAttribute('target');
      }
      if (foundLink.getAttribute('aria-label')) {
        link.setAttribute('aria-label', foundLink.getAttribute('aria-label'));
      }
    }
    link.textContent = labelCell.textContent.trim();
    // No moveInstrumentation here as it's a re-use
    mobileUtilityBarInner.append(link);
  });

  const mobileLangDropdown = document.createElement('div');
  mobileLangDropdown.classList.add('dropdown-lang');
  const mobileLangButton = document.createElement('button');
  mobileLangButton.setAttribute('type', 'button');
  mobileLangButton.textContent = 'EN';

  const mobileLangMenu = document.createElement('ul');
  mobileLangMenu.classList.add('dropdown-lang-menu');
  languageOptions.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructure for language-option-item

    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    li.append(link);
    mobileLangMenu.append(li);
  });

  mobileLangButton.addEventListener('click', () => {
    mobileLangMenu.classList.toggle('active');
  });
  mobileLangDropdown.append(mobileLangButton, mobileLangMenu);
  mobileUtilityBarInner.append(mobileLangDropdown);
  mobileUtilityBar.append(mobileUtilityBarInner);
  menuColInner.append(mobileUtilityBar);

  menuCol.append(menuColInner);
  bottomRow.append(menuCol);
  desktopContainer.append(bottomRow);
  relativeWrapper.append(desktopContainer);
  desktopNav.append(relativeWrapper);
  header.append(desktopNav);

  block.replaceChildren(header);

  // Optimize images
  header.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
