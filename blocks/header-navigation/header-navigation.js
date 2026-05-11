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
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, ...itemRows] = children;

  const mainNavigation = document.createElement('section');
  mainNavigation.classList.add('main-navigation', 'grid-container', 'js-navigation');
  mainNavigation.setAttribute('aria-label', 'Main Navigation Section');

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header');
  mainNavigation.append(mainHeader);

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add('grid-x', 'padding-x', 'main-header--container', 'align-justify', 'align-middle');
  mainHeader.append(mainHeaderContainer);

  const navigationOverlay = document.createElement('div');
  navigationOverlay.classList.add('navigation-overlay');
  mainHeaderContainer.append(navigationOverlay);

  const searchMobile = document.createElement('div');
  searchMobile.classList.add('main-header--search-mobile', 'hide-for-large');
  const searchButtonMobile = document.createElement('button');
  searchButtonMobile.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'sm-transparent', 'md-transparent');
  searchButtonMobile.setAttribute('aria-label', 'Search');
  searchButtonMobile.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5998" cy="6.63203" r="5.3" stroke="#ffffff" stroke-width="2"></circle><line x1="14.2855" y1="14.332" x2="10.7997" y2="10.8462" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line></svg>';
  searchMobile.append(searchButtonMobile);
  mainHeaderContainer.append(searchMobile);

  const mainHeaderLeft = document.createElement('div');
  mainHeaderLeft.classList.add('main-header--left', 'logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo-link');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
    logoLink.title = logoAnchor.title || 'Nescafe Logo';
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('logo-img');
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  mainHeaderLeft.append(logoLink);
  mainHeaderContainer.append(mainHeaderLeft);

  const persistentNavWrapper = document.createElement('nav');
  persistentNavWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav');
  persistentNavWrapper.style.marginLeft = '27px';
  persistentNavWrapper.style.opacity = '1';
  mainHeaderContainer.append(persistentNavWrapper);

  const persistentNav = document.createElement('ul');
  persistentNav.classList.add('persistent-navigation', 'grid-x');
  persistentNavWrapper.append(persistentNav);

  // Item type detection based on BlockJson model and cell content
  const primaryNavItems = itemRows.filter((row) => row.children.length === 3 && row.children[2].querySelector('ul'));
  // The model has 4 fields for nav-primary-item, but the last two are container and richtext.
  // The EDS structure shows 3 cells for nav-primary-item: label, link, hierarchy-tree.
  // The secondaryNavContainer is not a cell, but a container field.
  // So, primaryNavItems should have 3 children.
  // The original code had 4 children, which is incorrect based on the EDS structure.
  // The secondaryNavContainer is not a cell, but a container field, so it won't appear as a child.
  // The hierarchy-tree is the 3rd cell.

  // The original code's filters were incorrect based on the BlockJson and EDS structure.
  // Let's re-evaluate the filters based on the BlockJson and EDS structure.
  // nav-primary-item: 3 cells (label, link, hierarchy-tree)
  // nav-secondary-item: 2 cells (label, link)
  // nav-tertiary-item: 3 cells (icon, label, link)
  // nav-tertiary-banner: 2 cells (bannerImage, bannerDescription)
  // nav-secondary-banner: 3 cells (bannerImageDesktop, bannerImageTablet, bannerDescription)

  // Re-filtering itemRows based on the correct cell counts and content
  const primaryNavItemsCorrected = itemRows.filter((row) => row.children.length === 3 && row.children[2].querySelector('ul'));
  const secondaryNavItemsCorrected = itemRows.filter((row) => row.children.length === 2);
  const tertiaryNavItemsCorrected = itemRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('picture'));
  const tertiaryBannerItemsCorrected = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('picture') && row.children[1].querySelector('p'));
  const secondaryBannerItemsCorrected = itemRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('picture') && row.children[1].querySelector('picture'));

  primaryNavItemsCorrected.forEach((row, i) => {
    // Destructure based on the nav-primary-item model: label, link, hierarchy-tree
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('persistent-navigation--list');
    moveInstrumentation(row, li);

    const navButton = document.createElement('button');
    navButton.id = `nav-title-${i + 1}`;
    navButton.classList.add('persistent-navigation--link', 'persistent-nav--level1', 'level1', 'utilityTagLowCaps', 'bold-600');
    navButton.setAttribute('aria-label', labelCell.textContent.trim());
    navButton.setAttribute('aria-expanded', 'false');
    navButton.setAttribute('aria-controls', `level-${i + 1}`);
    navButton.setAttribute('data-nav-wrapper', `level-${i + 1}`);
    navButton.textContent = labelCell.textContent.trim();
    persistentNav.append(li);
    li.append(navButton);

    const menuWrapper = document.createElement('div');
    menuWrapper.classList.add('persistent-navigation--menu-wrapper');
    menuWrapper.id = `level-${i + 1}`;
    menuWrapper.setAttribute('aria-labelledby', `nav-title-${i + 1}`);
    li.append(menuWrapper);

    const level2 = document.createElement('div');
    level2.classList.add('persistent-nav--level2', 'level2', 'grid-x');
    menuWrapper.append(level2);

    const level2Items = document.createElement('div');
    level2Items.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');
    level2.append(level2Items);

    const level2Close = document.createElement('div');
    level2Close.classList.add('persistent-nav--level2--close', 'hide-for-large');
    level2Close.innerHTML = `
      <button class="persistent-nav--control-prev persistent-nav--control js-persistent-nav-l1--close" aria-label="Back to previous navigation">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </button>
      <button class="persistent-nav--control-close persistent-nav--control js-persistent-nav-l1--close" aria-label="Close navigation">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path></svg>
      </button>
    `;
    level2Items.append(level2Close);

    const level2Title = document.createElement('p');
    level2Title.classList.add('persistent-nav--level2--title', 'headline-h2');
    level2Title.id = `persistent-nav--level2--title--${labelCell.textContent.trim().replace(/\s+/g, '-')}`;
    level2Title.textContent = labelCell.textContent.trim();
    level2Items.append(level2Title);

    const level2List = document.createElement('ul');
    level2List.classList.add('persistent-nav--level2-list');
    level2List.setAttribute('aria-labelledby', level2Title.id);
    level2Items.append(level2List);

    const subList = hierarchyTreeCell.querySelector('ul');
    if (subList) {
      // Move instrumentation for the hierarchy-tree cell content
      moveInstrumentation(hierarchyTreeCell, subList);
      transformNestedLists(subList);
      level2List.append(subList);
    } else {
      const link = document.createElement('a');
      link.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = labelCell.textContent.trim();
      }
      const listItem = document.createElement('li');
      listItem.classList.add('persistent-nav--level2-list-item', 'grid-x');
      listItem.append(link);
      level2List.append(listItem);
    }

    // Add event listener for primary navigation toggle
    navButton.addEventListener('click', () => {
      const isExpanded = navButton.getAttribute('aria-expanded') === 'true';
      navButton.setAttribute('aria-expanded', !isExpanded);
      menuWrapper.classList.toggle('active', !isExpanded);
      li.classList.toggle('active', !isExpanded);
    });

    level2Close.querySelectorAll('.js-persistent-nav-l1--close').forEach((btn) => {
      btn.addEventListener('click', () => {
        navButton.setAttribute('aria-expanded', 'false');
        menuWrapper.classList.remove('active');
        li.classList.remove('active');
      });
    });
  });

  const mainHeaderRight = document.createElement('div');
  mainHeaderRight.classList.add('main-header--right', 'grid-x', 'align-middle');
  mainHeaderContainer.append(mainHeaderRight);

  const searchButtonDesktop = document.createElement('button');
  searchButtonDesktop.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'show-for-large');
  searchButtonDesktop.setAttribute('aria-label', 'Search');
  searchButtonDesktop.innerHTML = '<svg aria-hidden="true" role="presentation" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5998" cy="6.63203" r="5.3" stroke="#ffffff" stroke-width="2"></circle><line x1="14.2855" y1="14.332" x2="10.7997" y2="10.8462" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line></svg>';
  mainHeaderRight.append(searchButtonDesktop);

  const burgerButton = document.createElement('button');
  burgerButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'burger-btn', 'sm-transparent', 'md-transparent', 'js-burger-menu');
  burgerButton.id = 'burger-nav';
  burgerButton.setAttribute('aria-label', 'Open Navigation');
  burgerButton.setAttribute('aria-expanded', 'false');
  burgerButton.setAttribute('aria-controls', 'burger-nav-wrapper');
  burgerButton.setAttribute('data-nav-wrapper', 'burger-nav-wrapper');
  burgerButton.innerHTML = '<svg aria-hidden="true" role="presentation" width="20" height="15" viewBox="0 0 20 15" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><rect y="0.332031" width="20" height="2" rx="1"></rect><rect y="6.33203" width="20" height="2" rx="1"></rect><rect y="12.332" width="20" height="2" rx="1"></rect></svg>';
  mainHeaderRight.append(burgerButton);

  block.replaceChildren(mainNavigation);

  mainNavigation.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // The moveInstrumentation for logoRow already handles the logo image.
    // This forEach loop is likely for other images that might be added later,
    // but based on the current model, only the logo has a picture.
    // If there are other images, their instrumentation should be handled when they are created.
    // For now, assuming this is for the logo or future images, ensure instrumentation is moved.
    // The original code passed `img` which is the old img element, not the row.
    // It should be moved from the original row that contained the picture.
    // However, the logoRow instrumentation is already handled above.
    // This loop might be redundant or intended for a different purpose.
    // For safety, let's ensure instrumentation is moved from the original image element.
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
