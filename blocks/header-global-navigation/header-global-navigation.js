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
  const children = [...block.children];

  // Root fields based on BlockJson model
  // block.children[0]: logoLinkRow
  // block.children[1]: languageSelectedRow
  // All subsequent rows are item rows for containers: utilityLinks, languageOptions, ctaButtons, navigationMenu
  const [
    logoLinkRow,
    languageSelectedRow,
    ...itemRows
  ] = children;

  // Filter item rows based on cell count and content to match BlockJson sub-components
  // utility-link-item: 3 cells, cell[1] is aem-content link, cell[2] is richtext hierarchy-tree
  const utilityLinkItems = itemRows.filter(
    (row) => row.children.length === 3 && row.children[1]?.querySelector('a') && row.children[2]?.querySelector('ul'),
  );
  // language-option-item: 2 cells, cell[1] is aem-content link
  const languageOptionItems = itemRows.filter(
    (row) => row.children.length === 2 && row.children[1]?.querySelector('a'),
  );
  // cta-button-item: 2 cells, cell[1] is aem-content link
  // Note: ctaButtonItems are distinct from utilityLinkItems by cell count, and from languageOptionItems by position.
  const ctaButtonItems = itemRows.filter(
    (row) => row.children.length === 2 && row.children[1]?.querySelector('a') && !languageOptionItems.includes(row),
  );
  // navigation-item: 3 cells, cell[1] is aem-content link, cell[2] is richtext hierarchy-tree
  // Note: navigationMenuItems are distinct from utilityLinkItems by position (they appear later in the itemRows list)
  const navigationMenuItems = itemRows.filter(
    (row) => row.children.length === 3 && row.children[1]?.querySelector('a') && row.children[2]?.querySelector('ul'),
  );

  const header = document.createElement('section');
  header.classList.add('component-global-navigation', 'notranslate');
  moveInstrumentation(block, header);

  const searchModule = document.createElement('div');
  searchModule.classList.add('search-module');
  searchModule.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="nav-trigger">
          <i></i>
          <i></i>
          <i></i>
        </div>
        <div class="col-10 offset-1 search-col">
          <div class="search-box-container">
            <form class="views-exposed-form bef-exposed-form" data-drupal-selector="views-exposed-form-lions-solr-search-default" action="/en/search-results" method="get" id="views-exposed-form-lions-solr-search-default" accept-charset="UTF-8" data-once="befSingleCheckboxFix">
              <div class="search-box-container">
                <div class="js-form-item form-item form-type-search-api-autocomplete js-form-type-search-api-autocomplete form-item-keys js-form-item-keys form-no-label">
                  <input placeholder="Type to Search..." data-drupal-selector="edit-keys" data-search-api-autocomplete-search="lions_solr_search" class="form-autocomplete top-search-text-box form-text ui-autocomplete-input" data-autocomplete-path="/en/search_api_autocomplete/lions_solr_search?display=default&amp;&amp;filter=keys" type="text" id="edit-keys" name="keys" value="" size="30" maxlength="128" data-once="autocomplete search-api-autocomplete" autocomplete="off" data-uw-rm-form="fx" aria-label="Type to Search..." data-uw-hidden-control="hidden-control-element"/>
                </div>
                <input data-drupal-selector="edit-submit-lions-solr-search" class="top-search button js-form-submit form-submit disabled" type="submit" id="edit-submit-lions-solr-search" value="Search" disabled="" data-uw-rm-form="fx" aria-label="Submit button" data-uw-hidden-control="hidden-control-element"/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  header.append(searchModule);

  const desktopDiv = document.createElement('div');
  desktopDiv.classList.add('desktop');

  const relativeWrapper = document.createElement('div');
  relativeWrapper.classList.add('relative-wrapper');

  const container = document.createElement('div');
  container.classList.add('container');

  const rowUtility = document.createElement('div');
  rowUtility.classList.add('row', 'row-utility');

  const utilityBar = document.createElement('div');
  utilityBar.classList.add('utility-bar');

  utilityLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const link = document.createElement('a');
    moveInstrumentation(row, link);
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell ? labelCell.textContent.trim() : '';
      }
    }
    utilityBar.append(link);
  });

  const dropdownLang = document.createElement('div');
  dropdownLang.classList.add('dropdown-lang');
  const langButton = document.createElement('button');
  langButton.type = 'button';
  langButton.textContent = languageSelectedRow ? languageSelectedRow.children[0]?.textContent.trim() : 'EN'; // Access cell content
  dropdownLang.append(langButton);

  const dropdownLangMenu = document.createElement('ul');
  dropdownLangMenu.classList.add('dropdown-lang-menu');
  // moveInstrumentation(languageOptionsContainer, dropdownLangMenu); // languageOptionsContainer is not a row, it's a conceptual container

  languageOptionItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    const link = document.createElement('a');
    moveInstrumentation(row, link);
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell ? labelCell.textContent.trim() : '';
      }
    }
    li.append(link);
    dropdownLangMenu.append(li);
  });
  dropdownLang.append(dropdownLangMenu);
  utilityBar.append(dropdownLang);
  rowUtility.append(utilityBar);
  container.append(rowUtility);

  // Language dropdown toggle
  langButton.addEventListener('click', () => {
    dropdownLangMenu.classList.toggle('active');
  });

  const rowTop = document.createElement('div');
  rowTop.classList.add('row', 'row-top');

  const col = document.createElement('div');
  col.classList.add('col');

  const rowInner = document.createElement('div');
  rowInner.classList.add('row');

  const logoTagCol = document.createElement('div');
  logoTagCol.classList.add('col', 'logo-tag-col');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'logo-full');
  moveInstrumentation(logoLinkRow, logoLink);
  const foundLogoLink = logoLinkRow.children[0]?.querySelector('a'); // Access cell content
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.setAttribute('aria-label', 'Open this option');
  }
  logoTagCol.append(logoLink);

  const visibleMobile = document.createElement('div');
  visibleMobile.classList.add('visible-mobile');

  const btnsScrolled = document.createElement('div');
  btnsScrolled.classList.add('btns-scrolled');

  ctaButtonItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const link = document.createElement('a');
    moveInstrumentation(row, link);
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell ? labelCell.textContent.trim() : '';
      }
    }
    btnsScrolled.append(link);
  });

  visibleMobile.append(btnsScrolled);

  const searchMobile = document.createElement('a');
  searchMobile.href = '#';
  searchMobile.classList.add('search', 'search-mobile', 'visible-mobile');
  searchMobile.setAttribute('aria-label', 'Search');
  visibleMobile.append(searchMobile);

  const mobileNavTrigger = document.createElement('a');
  mobileNavTrigger.href = '#';
  mobileNavTrigger.classList.add('mobile-nav-trigger', 'visible-mobile');
  mobileNavTrigger.setAttribute('aria-label', 'Mobile menu');
  mobileNavTrigger.innerHTML = '<span></span><span></span><span></span><span></span>';
  visibleMobile.append(mobileNavTrigger);

  logoTagCol.append(visibleMobile);
  rowInner.append(logoTagCol);
  col.append(rowInner);
  rowTop.append(col);

  const utilityCol = document.createElement('div');
  utilityCol.classList.add('col', 'utility-col', 'visible-desktop');

  const menuParent = document.createElement('div');
  menuParent.classList.add('menu-parent');

  const ctaCol = document.createElement('div');
  ctaCol.classList.add('cta-col');
  // moveInstrumentation(ctaButtonsContainer, ctaCol); // ctaButtonsContainer is not a row

  ctaButtonItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const link = document.createElement('a');
    moveInstrumentation(row, link);
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell ? labelCell.textContent.trim() : '';
        if (link.textContent.toLowerCase() === 'join') {
          link.classList.add('joinBtn', 'btn', 'bg-primary-e2-blue');
        } else if (link.textContent.toLowerCase() === 'donate') {
          link.classList.add('donateBtn', 'btn');
        }
      }
    }
    ctaCol.append(link);
  });

  const searchDesktop = document.createElement('a');
  searchDesktop.href = '#';
  searchDesktop.classList.add('search');
  searchDesktop.setAttribute('aria-label', 'Search');
  ctaCol.append(searchDesktop);

  menuParent.append(ctaCol);
  utilityCol.append(menuParent);
  rowTop.append(utilityCol);
  container.append(rowTop);

  const rowBottom = document.createElement('div');
  rowBottom.classList.add('row', 'row-bottom');

  const mobileButtonCol = document.createElement('div');
  mobileButtonCol.classList.add('col-12', 'visible-mobile');

  const mobileBtns = document.createElement('div');
  mobileBtns.classList.add('mobile-button-col');

  ctaButtonItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const link = document.createElement('a');
    moveInstrumentation(row, link);
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell ? labelCell.textContent.trim() : '';
        if (link.textContent.toLowerCase() === 'join') {
          link.classList.add('joinBtn', 'btn', 'bg-primary-e2-blue');
        } else if (link.textContent.toLowerCase() === 'donate') {
          link.classList.add('donateBtn', 'btn');
        }
      }
    }
    mobileBtns.append(link);
  });

  mobileButtonCol.append(mobileBtns);
  rowBottom.append(mobileButtonCol);

  const menuCol = document.createElement('div');
  menuCol.classList.add('col-12', 'menu-col');

  const menuColInner = document.createElement('div');
  menuColInner.classList.add('menu-col-inner');

  const tbm = document.createElement('div');
  tbm.classList.add('tbm', 'tbm-tb-mega-main', 'tbm-no-arrows', 'tb-megamenu', 'tb-megamenu-tb-mega-main');
  tbm.id = 'a29d7821-4d99-46e5-b825-b7ed66c0d181';
  tbm.setAttribute('data-breakpoint', '1200');
  tbm.setAttribute('aria-label', 'tb-mega-main navigation');
  tbm.setAttribute('data-initialized', 'true');

  const btnNavbar = document.createElement('button');
  btnNavbar.classList.add('btn', 'btn-navbar', 'tb-megamenu-button');
  btnNavbar.type = 'button';
  btnNavbar.setAttribute('aria-label', 'reorder');
  btnNavbar.innerHTML = '<i class="fa fa-reorder"></i>';
  tbm.append(btnNavbar);

  const navCollapse = document.createElement('div');
  navCollapse.classList.add('nav-collapse');

  const tbmNav = document.createElement('ul');
  tbmNav.classList.add('tbm-nav', 'level-0', 'items-4', 'tb-megamenu-nav', 'nav');
  // moveInstrumentation(navigationMenuContainer, tbmNav); // navigationMenuContainer is not a row

  navigationMenuItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema

    const li = document.createElement('li');
    li.classList.add('tbm-item', 'level-1', 'tb-megamenu-item', 'mega');
    li.setAttribute('aria-level', '1');
    li.setAttribute('data-title', labelCell ? labelCell.textContent.trim() : '');
    moveInstrumentation(row, li);

    const subListContent = hierarchyTreeCell?.innerHTML || '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = subListContent;
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      li.classList.add('tbm-item--has-dropdown');
      const span = document.createElement('span');
      span.classList.add('tbm-link', 'level-1', 'no-link', 'tbm-toggle', 'tb-megamenu-no-link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('aria-expanded', 'false');
      span.textContent = labelCell ? labelCell.textContent.trim() : '';
      li.append(span);

      const subMenu = document.createElement('div');
      subMenu.classList.add('tbm-submenu', 'tbm-item-child', 'tbm-has-width');
      subMenu.style.width = '800px'; // Example width, adjust as needed

      const tbmRow = document.createElement('div');
      tbmRow.classList.add('tbm-row');

      const tbmColumn = document.createElement('div');
      tbmColumn.classList.add('tbm-column', 'span12'); // Adjusted to span12 for full width
      const tbmColumnInner = document.createElement('div');
      tbmColumnInner.classList.add('tbm-column-inner');

      const tbmSubnav = document.createElement('ul');
      tbmSubnav.classList.add('tbm-subnav', 'level-1', 'items-1');

      // Apply classes to nested elements from ORIGINAL HTML
      subList.querySelectorAll('li').forEach(item => item.classList.add('tbm-item', 'level-2', 'tbm-group', 'tb-megamenu-item', 'mega'));
      subList.querySelectorAll('a').forEach(item => item.classList.add('tbm-link', 'level-3'));
      subList.querySelectorAll('span').forEach(item => item.classList.add('tbm-link', 'level-2', 'no-link', 'tbm-group-title', 'tb-megamenu-no-link'));
      subList.querySelectorAll('ul').forEach(item => item.classList.add('tbm-subnav', 'level-2', 'items-5')); // Assuming depth 2 has 5 items based on original HTML

      transformNestedLists(subList);
      // Move instrumentation from the original hierarchyTreeCell to the new subList
      moveInstrumentation(hierarchyTreeCell, subList);
      tbmSubnav.append(subList);

      tbmColumnInner.append(tbmSubnav);
      tbmColumn.append(tbmColumnInner);
      tbmRow.append(tbmColumn);
      subMenu.append(tbmRow);
      li.append(subMenu);

      span.addEventListener('click', () => {
        span.setAttribute('aria-expanded', span.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
        subMenu.classList.toggle('active');
      });
    } else {
      const link = document.createElement('a');
      link.classList.add('tbm-link', 'level-1');
      const foundLink = linkCell ? linkCell.querySelector('a') : null;
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell ? labelCell.textContent.trim() : '';
      }
      li.append(link);
    }
    tbmNav.append(li);
  });

  navCollapse.append(tbmNav);
  tbm.append(navCollapse);
  menuColInner.append(tbm);

  const mobileUtilityBar = document.createElement('div');
  mobileUtilityBar.classList.add('visible-mobile');
  // Re-create utility bar content for mobile to ensure instrumentation is moved correctly
  const mobileUtilityBarInner = document.createElement('div');
  mobileUtilityBarInner.classList.add('utility-bar');
  utilityLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = document.createElement('a');
    moveInstrumentation(row, link); // Move instrumentation again for mobile version
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell ? labelCell.textContent.trim() : '';
      }
    }
    mobileUtilityBarInner.append(link);
  });
  const mobileDropdownLang = document.createElement('div');
  mobileDropdownLang.classList.add('dropdown-lang');
  const mobileLangButton = document.createElement('button');
  mobileLangButton.type = 'button';
  mobileLangButton.textContent = languageSelectedRow ? languageSelectedRow.children[0]?.textContent.trim() : 'EN';
  mobileDropdownLang.append(mobileLangButton);
  const mobileDropdownLangMenu = dropdownLangMenu.cloneNode(true); // Clone the desktop menu for mobile
  mobileDropdownLang.append(mobileDropdownLangMenu);
  mobileUtilityBarInner.append(mobileDropdownLang);
  mobileUtilityBar.append(mobileUtilityBarInner);
  menuColInner.append(mobileUtilityBar);

  // Language dropdown toggle for mobile
  mobileLangButton.addEventListener('click', () => {
    mobileDropdownLangMenu.classList.toggle('active');
  });

  menuCol.append(menuColInner);
  rowBottom.append(menuCol);
  container.append(rowBottom);

  relativeWrapper.append(container);
  desktopDiv.append(relativeWrapper);
  header.append(desktopDiv);

  block.replaceChildren(header);

  // Search trigger toggle
  const searchTrigger = header.querySelector('.nav-trigger');
  const searchContainer = header.querySelector('.search-module .container');
  if (searchTrigger && searchContainer) {
    searchTrigger.addEventListener('click', () => {
      searchTrigger.classList.toggle('active');
      searchContainer.classList.toggle('active');
    });
  }

  // Mobile nav trigger toggle
  const mobileNavTriggerBtn = header.querySelector('.mobile-nav-trigger');
  const mobileMenu = header.querySelector('.menu-col-inner');
  if (mobileNavTriggerBtn && mobileMenu) {
    mobileNavTriggerBtn.addEventListener('click', () => {
      mobileNavTriggerBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // Scroll behavior
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 0) {
      header.classList.add('nav-up');
    } else {
      header.classList.remove('nav-up');
    }
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
  });

  header.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
