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
  moveInstrumentation(block, mainHeader); // Move instrumentation from block to mainHeader

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add('grid-x', 'padding-x', 'main-header--container', 'align-justify', 'align-middle');
  mainHeader.append(mainHeaderContainer);

  const navigationOverlay = document.createElement('div');
  navigationOverlay.classList.add('navigation-overlay');
  mainHeaderContainer.append(navigationOverlay);

  const mobileSearch = document.createElement('div');
  mobileSearch.classList.add('main-header--search-mobile', 'hide-for-large');
  const searchButtonMobile = document.createElement('button');
  searchButtonMobile.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'sm-transparent', 'md-transparent');
  searchButtonMobile.setAttribute('aria-label', 'Search');
  searchButtonMobile.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5998" cy="6.63203" r="5.3" stroke="#ffffff" stroke-width="2"></circle>
      <line x1="14.2855" y1="14.332" x2="10.7997" y2="10.8462" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line>
    </svg>
  `;
  mobileSearch.append(searchButtonMobile);
  mainHeaderContainer.append(mobileSearch);

  const mainHeaderLeft = document.createElement('div');
  mainHeaderLeft.classList.add('main-header--left', 'logo');
  mainHeaderContainer.append(mainHeaderLeft);

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo-link');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.setAttribute('title', 'Nescafe Logo');
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      newImg.classList.add('logo-img');
      newImg.alt = 'Nescafe Logo';
      moveInstrumentation(logoImg, newImg);
      logoLink.append(optimizedPic);
    }
  }
  mainHeaderLeft.append(logoLink);

  const persistentNavWrapper = document.createElement('nav');
  persistentNavWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav');
  persistentNavWrapper.setAttribute('style', 'margin-left: 27px; opacity: 1;');
  mainHeaderContainer.append(persistentNavWrapper);

  const persistentNavigation = document.createElement('ul');
  persistentNavigation.classList.add('persistent-navigation', 'grid-x');
  persistentNavWrapper.append(persistentNavigation);

  // Filter item rows based on their structure as per BlockJson model
  const navigationMenuItems = itemRows.filter((row) => row.children.length === 2 && row.children[1].querySelector('ul'));
  // const submenuLevel2Items = itemRows.filter((row) => row.children.length === 3); // Not used in current logic
  // const submenuLevel3Items = itemRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('picture')); // Not used in current logic
  // const submenuLevel3Banners = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('picture')); // Not used in current logic
  const submenuLevel2Banners = itemRows.filter((row) => row.children.length === 4 && row.children[0].querySelector('picture'));

  navigationMenuItems.forEach((row, i) => {
    const [menuLabelCell, hierarchyTreeCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('persistent-navigation--list');
    moveInstrumentation(row, li);
    persistentNavigation.append(li);

    const menuButton = document.createElement('button');
    menuButton.id = `nav-title-${i + 1}`;
    menuButton.classList.add('persistent-navigation--link', 'persistent-nav--level1', 'level1', 'utilityTagLowCaps', 'bold-600');
    menuButton.setAttribute('aria-label', menuLabelCell.textContent.trim());
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-controls', `level-${i + 1}`);
    menuButton.setAttribute('data-nav-wrapper', `level-${i + 1}`);
    menuButton.textContent = menuLabelCell.textContent.trim();
    li.append(menuButton);

    const menuWrapper = document.createElement('div');
    menuWrapper.classList.add('persistent-navigation--menu-wrapper');
    menuWrapper.id = `level-${i + 1}`;
    menuWrapper.setAttribute('aria-labelledby', `nav-title-${i + 1}`);
    li.append(menuWrapper);

    const level2Div = document.createElement('div');
    level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');
    menuWrapper.append(level2Div);

    const level2ItemsContainer = document.createElement('div');
    level2ItemsContainer.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');
    level2Div.append(level2ItemsContainer);

    const level2Close = document.createElement('div');
    level2Close.classList.add('persistent-nav--level2--close', 'hide-for-large');
    level2ItemsContainer.append(level2Close);

    const prevButton = document.createElement('button');
    prevButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l1--close');
    prevButton.setAttribute('aria-label', 'Back to previous navigation');
    prevButton.innerHTML = `
      <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
    level2Close.append(prevButton);

    const closeButton = document.createElement('button');
    closeButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
    closeButton.setAttribute('aria-label', 'Close navigation');
    closeButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
      </svg>
    `;
    level2Close.append(closeButton);

    const level2Title = document.createElement('p');
    level2Title.classList.add('persistent-nav--level2--title', 'headline-h2');
    level2Title.id = `persistent-nav--level2--title--${menuLabelCell.textContent.trim().replace(/\s/g, '-')}`;
    level2Title.textContent = menuLabelCell.textContent.trim();
    level2ItemsContainer.append(level2Title);

    const level2List = document.createElement('ul');
    level2List.classList.add('persistent-nav--level2-list');
    level2List.setAttribute('aria-labelledby', level2Title.id);
    level2ItemsContainer.append(level2List);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      [...hierarchyUl.children].forEach((hierarchyLi) => {
        const level2ListItem = document.createElement('li');
        level2ListItem.classList.add('persistent-nav--level2-list-item', 'grid-x');

        const firstChild = hierarchyLi.firstElementChild;
        if (firstChild && firstChild.tagName === 'A') {
          const link = document.createElement('a');
          link.href = firstChild.href;
          link.textContent = firstChild.textContent.trim();
          link.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
          level2ListItem.append(link);
        } else if (firstChild && firstChild.tagName === 'SPAN') {
          const button = document.createElement('button');
          button.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
          button.setAttribute('aria-expanded', 'false');
          button.setAttribute('aria-controls', `persistentNavLevel3List-level-${i + 1}-desktop-${level2List.children.length + 1}`);
          button.setAttribute('aria-label', firstChild.textContent.trim());
          button.textContent = firstChild.textContent.trim();
          level2ListItem.append(button);

          button.addEventListener('click', () => {
            const targetId = button.getAttribute('aria-controls');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
              button.setAttribute('aria-expanded', 'true');
              level2ListItem.classList.add('active');
              targetElement.classList.add('active');
            }
          });
        }

        const subChildDiv = hierarchyLi.querySelector('.has-sub-child');
        if (subChildDiv) {
          const level3Wrapper = document.createElement('div');
          level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
          level3Wrapper.id = `level-${i + 1}-${level2List.children.length + 1}`;
          level2ListItem.append(level3Wrapper);

          const level3Div = document.createElement('div');
          level3Div.classList.add('persistent-nav--level3', 'grid-x');
          level3Div.setAttribute('role', 'list');
          level3Wrapper.append(level3Div);

          const level3Close = document.createElement('div');
          level3Close.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
          level3Close.setAttribute('role', 'listitem');
          level3Div.append(level3Close);

          const level3PrevButton = document.createElement('button');
          level3PrevButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
          level3PrevButton.setAttribute('aria-label', 'Back to previous navigation');
          level3PrevButton.innerHTML = `
            <svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          `;
          level3Close.append(level3PrevButton);

          const level3TitleSpan = document.createElement('span');
          level3TitleSpan.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
          level3TitleSpan.textContent = menuLabelCell.textContent.trim(); // Should be parent menu label
          level3Close.append(level3TitleSpan);

          const level3CloseButton = document.createElement('button');
          level3CloseButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
          level3CloseButton.setAttribute('aria-label', 'Close navigation');
          level3CloseButton.innerHTML = `
            <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
            </svg>
          `;
          level3Close.append(level3CloseButton);

          const level3TitleP = document.createElement('p');
          level3TitleP.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
          level3TitleP.setAttribute('role', 'listitem');
          level3TitleP.textContent = firstChild ? firstChild.textContent.trim() : '';
          level3Div.append(level3TitleP);

          const level3ListDiv = document.createElement('div');
          level3ListDiv.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list');
          level3ListDiv.id = `persistentNavLevel3List-level-${i + 1}-desktop-${level2List.children.length + 1}`;
          level3Div.append(level3ListDiv);

          const innerUl = subChildDiv.querySelector('ul');
          if (innerUl) {
            [...innerUl.children].forEach((innerLi) => {
              const level3ListItem = document.createElement('div');
              level3ListItem.classList.add('persistent-nav--level3-list-item');
              level3ListItem.setAttribute('role', 'listitem');

              const innerLink = innerLi.querySelector('a');
              if (innerLink) {
                const link = document.createElement('a');
                link.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
                link.href = innerLink.href;
                link.setAttribute('aria-label', innerLink.textContent.trim());
                link.setAttribute('title', innerLink.textContent.trim());

                const titleSpan = document.createElement('span');
                titleSpan.classList.add('persistent-nav--level3-title');
                titleSpan.textContent = innerLink.textContent.trim();
                link.append(titleSpan);
                level3ListItem.append(link);

                // Handle nested images within level3 links
                const innerImg = innerLi.querySelector('img');
                if (innerImg) {
                  const iconSpan = document.createElement('span');
                  iconSpan.classList.add('persistent-nav--level3-icon');
                  const optimizedIconPic = createOptimizedPicture(innerImg.src, innerImg.alt, false, [{ width: '80' }]);
                  const newIconImg = optimizedIconPic.querySelector('img');
                  newIconImg.classList.add('persistent-nav--level3-icon-img', 'lazyload');
                  moveInstrumentation(innerImg, newIconImg);
                  iconSpan.append(optimizedIconPic);
                  link.prepend(iconSpan);
                }
              }
              level3ListDiv.append(level3ListItem);
            });
          }
        }
        level2List.append(level2ListItem);
      });
    }

    // Add event listeners for level 1 menu buttons
    menuButton.addEventListener('click', () => {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !isExpanded);
      li.classList.toggle('active', !isExpanded);
      menuWrapper.classList.toggle('active', !isExpanded);
    });

    // Add event listeners for close buttons
    [prevButton, closeButton].forEach((btn) => {
      btn.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        li.classList.remove('active');
        menuWrapper.classList.remove('active');
      });
    });

    const level2Banner = submenuLevel2Banners[i]; // Assuming banners are in the same order as menu items
    if (level2Banner) {
      const [desktopCell, tabletCell, mobileCell, descriptionCell] = [...level2Banner.children];
      const bannerDiv = document.createElement('div');
      bannerDiv.classList.add('small-12', 'large-8', 'xlarge-offset-1', 'xlarge-8', 'persistent-nav--level2-banner', 'show-for-large');

      const picture = document.createElement('picture');
      picture.classList.add('persistent-nav--level2-banner-picture');

      const desktopImg = desktopCell.querySelector('img');
      if (desktopImg) {
        const sourceDesktop = document.createElement('source');
        sourceDesktop.media = '(min-width: 1440px)';
        sourceDesktop.srcset = desktopImg.src;
        sourceDesktop.height = '640';
        picture.append(sourceDesktop);
      }

      const tabletImg = tabletCell.querySelector('img');
      if (tabletImg) {
        const sourceTablet = document.createElement('source');
        sourceTablet.media = '(min-width: 1024px)';
        sourceTablet.srcset = tabletImg.src;
        sourceTablet.height = '300';
        picture.append(sourceTablet);
      }

      const mobileImg = mobileCell.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(min-width: 768px)';
        sourceMobile.srcset = mobileImg.src;
        sourceMobile.height = '640';
        picture.append(sourceMobile);
      }

      const img = document.createElement('img');
      img.classList.add('persistent-nav--level2-banner-img', 'lazyload');
      if (desktopImg) img.src = desktopImg.src;
      img.alt = 'nescafé coffee types';
      img.height = '640';
      picture.append(img);
      bannerDiv.append(picture);

      const bannerInfo = document.createElement('div');
      bannerInfo.classList.add('persistent-nav--level2-banner--info');
      const bannerDesc = document.createElement('div');
      bannerDesc.classList.add('bodyMediumRegular', 'persistent-nav--level2-banner-desc');
      bannerDesc.innerHTML = descriptionCell.innerHTML;
      bannerInfo.append(bannerDesc);
      bannerDiv.append(bannerInfo);
      level2Div.append(bannerDiv);
      moveInstrumentation(level2Banner, bannerDiv);
    }
  });

  const mainHeaderRight = document.createElement('div');
  mainHeaderRight.classList.add('main-header--right', 'grid-x', 'align-middle');
  mainHeaderContainer.append(mainHeaderRight);

  const searchButtonDesktop = document.createElement('button');
  searchButtonDesktop.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'show-for-large');
  searchButtonDesktop.setAttribute('aria-label', 'Search');
  searchButtonDesktop.innerHTML = `
    <svg aria-hidden="true" role="presentation" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5998" cy="6.63203" r="5.3" stroke="#ffffff" stroke-width="2"></circle>
      <line x1="14.2855" y1="14.332" x2="10.7997" y2="10.8462" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line>
    </svg>
  `;
  mainHeaderRight.append(searchButtonDesktop);

  const burgerButton = document.createElement('button');
  burgerButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'burger-btn', 'sm-transparent', 'md-transparent', 'js-burger-menu');
  burgerButton.id = 'burger-nav';
  burgerButton.setAttribute('aria-label', 'Open Navigation');
  burgerButton.setAttribute('aria-expanded', 'false');
  burgerButton.setAttribute('aria-controls', 'burger-nav-wrapper');
  burgerButton.setAttribute('data-nav-wrapper', 'burger-nav-wrapper');
  burgerButton.innerHTML = `
    <svg aria-hidden="true" role="presentation" width="20" height="15" viewBox="0 0 20 15" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
      <rect y="0.332031" width="20" height="2" rx="1"></rect>
      <rect y="6.33203" width="20" height="2" rx="1"></rect>
      <rect y="12.332" width="20" height="2" rx="1"></rect>
    </svg>
  `;
  mainHeaderRight.append(burgerButton);

  mainNavigation.append(mainHeader);
  block.replaceChildren(mainNavigation);

  // Event listeners for burger menu
  burgerButton.addEventListener('click', () => {
    const isExpanded = burgerButton.getAttribute('aria-expanded') === 'true';
    burgerButton.setAttribute('aria-expanded', !isExpanded);
    mainNavigation.classList.toggle('active', !isExpanded);
    document.body.classList.toggle('no-scroll', !isExpanded);
  });

  // Event listeners for closing the navigation overlay
  navigationOverlay.addEventListener('click', () => {
    burgerButton.setAttribute('aria-expanded', 'false');
    mainNavigation.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });

  // Event listeners for persistent nav level 1 close buttons
  mainNavigation.querySelectorAll('.js-persistent-nav-l1--close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menuWrapper = btn.closest('.persistent-navigation--menu-wrapper');
      const listItem = btn.closest('.persistent-navigation--list');
      if (menuWrapper) menuWrapper.classList.remove('active');
      if (listItem) listItem.classList.remove('active');
      const menuButton = listItem?.querySelector('.persistent-nav--level1');
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  // Event listeners for persistent nav level 2 close buttons (back button)
  mainNavigation.querySelectorAll('.js-persistent-nav-l2--close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const level3Wrapper = btn.closest('.persistent-nav--level3-wrapper');
      const level2ListItem = btn.closest('.persistent-nav--level2-list-item');
      if (level3Wrapper) level3Wrapper.classList.remove('active');
      if (level2ListItem) level2ListItem.classList.remove('active');
      const level2Button = level2ListItem?.querySelector('.persistent-nav--level2-link');
      if (level2Button) level2Button.setAttribute('aria-expanded', 'false');
    });
  });

  // Optimize pictures for all images within the main navigation, excluding those already handled
  mainNavigation.querySelectorAll('picture > img').forEach((img) => {
    // Check if the image is already part of an optimized picture (e.g., logo or banner)
    // or if it's an icon that has been handled by the nested list logic
    if (!img.closest('.logo-link') && !img.closest('.persistent-nav--level2-banner') && !img.closest('.persistent-nav--level3-icon')) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
}
