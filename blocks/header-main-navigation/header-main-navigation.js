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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's a functional class for JS behavior.
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
  // Root rows based on BlockJson model
  const [logoRow, logoLinkRow, navItemsContainerRow, bannersContainerRow, ...itemRows] = [...block.children];

  // Item type detection based on cell count and content
  const primaryNavItems = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture'));
  const secondaryNavItems = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture') && !primaryNavItems.includes(row));
  const tertiaryNavItems = itemRows.filter((row) => row.children.length === 5 && row.querySelector('picture'));
  const level2Banners = itemRows.filter((row) => row.children.length === 5 && row.querySelector('picture') && !tertiaryNavItems.includes(row));

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header');

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add('grid-x', 'padding-x', 'main-header--container', 'align-justify', 'align-middle');
  mainHeader.append(mainHeaderContainer);

  const navigationOverlay = document.createElement('div');
  navigationOverlay.classList.add('navigation-overlay');
  mainHeaderContainer.append(navigationOverlay);

  const searchMobile = document.createElement('div');
  searchMobile.classList.add('main-header--search-mobile', 'hide-for-large');
  searchMobile.innerHTML = `<button class="button brown square-icon corner-round search-btn sm-transparent md-transparent" aria-label="Search">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5998" cy="6.63203" r="5.3" stroke="#ffffff" stroke-width="2"></circle>
      <line x1="14.2855" y1="14.332" x2="10.7997" y2="10.8462" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line>
    </svg>
  </button>`;
  mainHeaderContainer.append(searchMobile);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('main-header--left', 'logo');
  mainHeaderContainer.append(logoWrapper);

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo-link');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.title = 'Nescafe Logo'; // Hardcoded title, but matches original HTML
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoWrapper.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '100' }]);
    optimizedPic.querySelector('img').classList.add('logo-img');
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }

  const navWrapper = document.createElement('nav');
  navWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav');
  navWrapper.style.marginLeft = '27px'; // Inline style from original HTML
  navWrapper.style.opacity = '1'; // Inline style from original HTML
  mainHeaderContainer.append(navWrapper);

  const persistentNav = document.createElement('ul');
  persistentNav.classList.add('persistent-navigation', 'grid-x');
  navWrapper.append(persistentNav);

  const navItemsWrapper = document.createElement('div');
  moveInstrumentation(navItemsContainerRow, navItemsWrapper); // navItemsContainerRow is an empty row, but instrumentation is moved.

  primaryNavItems.forEach((row, i) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema
    const listItem = document.createElement('li');
    listItem.classList.add('persistent-navigation--list');

    const button = document.createElement('button');
    button.id = `nav-title-${i + 1}`;
    button.classList.add('persistent-navigation--link', 'persistent-nav--level1', 'level1', 'utilityTagLowCaps', 'bold-600');
    button.setAttribute('aria-label', labelCell.textContent.trim());
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `level-${i + 1}`);
    button.setAttribute('data-nav-wrapper', `level-${i + 1}`);
    button.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, button);
    listItem.append(button);

    const menuWrapper = document.createElement('div');
    menuWrapper.classList.add('persistent-navigation--menu-wrapper');
    menuWrapper.id = `level-${i + 1}`;
    menuWrapper.setAttribute('aria-labelledby', `nav-title-${i + 1}`);
    listItem.append(menuWrapper);

    const level2 = document.createElement('div');
    level2.classList.add('persistent-nav--level2', 'level2', 'grid-x');
    menuWrapper.append(level2);

    const level2Items = document.createElement('div');
    level2Items.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');
    level2.append(level2Items);

    const level2Close = document.createElement('div');
    level2Close.classList.add('persistent-nav--level2--close', 'hide-for-large');
    level2Close.innerHTML = `<button class="persistent-nav--control-prev persistent-nav--control js-persistent-nav-l1--close" aria-label="Back to previous navigation">
      <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
    <button class="persistent-nav--control-close persistent-nav--control js-persistent-nav-l1--close" aria-label="Close navigation">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
      </svg>
    </button>`;
    level2Items.append(level2Close);

    const level2Title = document.createElement('p');
    level2Title.classList.add('persistent-nav--level2--title', 'headline-h2');
    level2Title.id = `persistent-nav--level2--title--${labelCell.textContent.trim().replace(/\s/g, '-')}`;
    level2Title.textContent = labelCell.textContent.trim();
    level2Items.append(level2Title);

    const level2List = document.createElement('ul');
    level2List.classList.add('persistent-nav--level2-list');
    level2List.setAttribute('aria-labelledby', level2Title.id);
    level2Items.append(level2List);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML; // Read richtext content
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for richtext cell
    const subList = tempDiv.querySelector('ul');
    const directLink = linkCell.querySelector('a');

    if (subList) {
      transformNestedLists(subList);
      const subItems = [...subList.children];
      subItems.forEach((subLi) => {
        const subListItem = document.createElement('li');
        subListItem.classList.add('persistent-nav--level2-list-item', 'grid-x');

        const subLink = subLi.querySelector(':scope > a');
        const subSpan = subLi.querySelector(':scope > span');
        const subButton = document.createElement('button');
        subButton.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
        subButton.setAttribute('aria-expanded', 'false');
        subButton.setAttribute('aria-controls', `persistentNavLevel3List-level-${i + 1}-desktop-${subItems.indexOf(subLi) + 1}`);
        subButton.setAttribute('aria-label', subLink?.textContent.trim() || subSpan?.textContent.trim() || '');
        subButton.textContent = subLink?.textContent.trim() || subSpan?.textContent.trim() || '';
        subListItem.append(subButton);

        const level3Wrapper = document.createElement('div');
        level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
        level3Wrapper.id = `level-${i + 1}-${subItems.indexOf(subLi) + 1}`;
        subListItem.append(level3Wrapper);

        const level3 = document.createElement('div');
        level3.classList.add('persistent-nav--level3', 'grid-x');
        level3.setAttribute('role', 'list');
        level3.setAttribute('data-full-banner', '');
        level3Wrapper.append(level3);

        const level3Close = document.createElement('div');
        level3Close.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
        level3Close.setAttribute('role', 'listitem');
        level3Close.innerHTML = `<button class="persistent-nav--control-prev persistent-nav--control js-persistent-nav-l2--close" aria-label="Back to previous navigation">
          <svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
        <span class="persistent-nav--control-title utilityTagHighCaps js-persistent-nav-l2--close">${labelCell.textContent.trim()}</span>
        <button class="persistent-nav--control-close persistent-nav--control js-persistent-nav-l1--close" aria-label="Close navigation">
          <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
          </svg>
        </button>`;
        level3.append(level3Close);

        const level3Title = document.createElement('p');
        level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
        level3Title.setAttribute('role', 'listitem');
        level3Title.textContent = subLink?.textContent.trim() || subSpan?.textContent.trim() || '';
        level3.append(level3Title);

        const level3List = document.createElement('div');
        level3List.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list');
        level3List.id = `persistentNavLevel3List-level-${i + 1}-desktop-${subItems.indexOf(subLi) + 1}`;
        level3.append(level3List);

        const nestedUl = subLi.querySelector(':scope > div > ul');
        if (nestedUl) {
          [...nestedUl.children].forEach((nestedLi) => {
            const nestedLink = nestedLi.querySelector('a');
            if (nestedLink) {
              const tertiaryItem = document.createElement('div');
              tertiaryItem.classList.add('persistent-nav--level3-list-item');
              tertiaryItem.setAttribute('role', 'listitem');

              const tertiaryLink = document.createElement('a');
              tertiaryLink.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
              tertiaryLink.href = nestedLink.href;
              tertiaryLink.setAttribute('aria-label', nestedLink.textContent.trim());
              tertiaryLink.title = nestedLink.textContent.trim();

              const tertiaryTitle = document.createElement('span');
              tertiaryTitle.classList.add('persistent-nav--level3-title', 'no-icon');
              tertiaryTitle.textContent = nestedLink.textContent.trim();
              tertiaryLink.append(tertiaryTitle);
              tertiaryItem.append(tertiaryLink);
              level3List.append(tertiaryItem);
            }
          });
        }
        level2List.append(subListItem);
      });
    } else if (directLink) {
      const flatListItem = document.createElement('li');
      flatListItem.classList.add('persistent-nav--level2-list-item', 'grid-x');

      const flatLink = document.createElement('a');
      flatLink.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
      flatLink.href = directLink.href;
      flatLink.setAttribute('aria-label', labelCell.textContent.trim());
      flatLink.textContent = labelCell.textContent.trim();
      flatListItem.append(flatLink);
      level2List.append(flatListItem);
    }
    persistentNav.append(listItem);
    moveInstrumentation(row, listItem);
  });

  const bannerWrapper = document.createElement('div');
  bannerWrapper.classList.add('small-12', 'large-8', 'xlarge-offset-1', 'xlarge-8', 'persistent-nav--level2-banner', 'show-for-large');
  moveInstrumentation(bannersContainerRow, bannerWrapper); // bannersContainerRow is an empty row, but instrumentation is moved.

  level2Banners.forEach((row) => {
    const [desktopImgCell, tabletImgCell, mobileImgCell, descriptionCell, headlineCell] = [...row.children]; // Destructuring for fixed schema

    const pictureEl = document.createElement('picture');
    pictureEl.classList.add('persistent-nav--level2-banner-picture');

    const desktopPicture = desktopImgCell.querySelector('picture');
    const tabletPicture = tabletImgCell.querySelector('picture');
    const mobilePicture = mobileImgCell.querySelector('picture');

    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const sourceDesktop = document.createElement('source');
      sourceDesktop.media = '(min-width: 1440px)';
      sourceDesktop.srcset = desktopImg.src;
      sourceDesktop.height = '640';
      pictureEl.append(sourceDesktop);
    }
    if (tabletPicture) {
      const tabletImg = tabletPicture.querySelector('img');
      const sourceTablet = document.createElement('source');
      sourceTablet.media = '(min-width: 1024px)';
      sourceTablet.srcset = tabletImg.src;
      sourceTablet.height = '300';
      pictureEl.append(sourceTablet);
    }
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(min-width: 768px)';
      sourceMobile.srcset = mobileImg.src;
      sourceMobile.height = '640';
      pictureEl.append(sourceMobile);
    }

    const defaultImg = desktopImgCell.querySelector('img');
    if (defaultImg) {
      const img = document.createElement('img');
      img.classList.add('persistent-nav--level2-banner-img', 'lazyload');
      img.src = defaultImg.src;
      img.alt = defaultImg.alt;
      img.height = '640';
      pictureEl.append(img);
    }

    bannerWrapper.append(pictureEl);

    const bannerInfo = document.createElement('div');
    bannerInfo.classList.add('persistent-nav--level2-banner--info');

    if (descriptionCell.innerHTML.trim()) {
      const desc = document.createElement('div'); // Use div for richtext
      desc.classList.add('bodyMediumRegular', 'persistent-nav--level2-banner-desc');
      desc.innerHTML = descriptionCell.innerHTML;
      bannerInfo.append(desc);
    }

    if (headlineCell.innerHTML.trim()) {
      const headline = document.createElement('p'); // Use p for richtext if original HTML dictates
      headline.classList.add('headline-h4');
      headline.innerHTML = headlineCell.innerHTML;
      bannerInfo.append(headline);
    }
    bannerWrapper.append(bannerInfo);
  });
  persistentNav.append(bannerWrapper);

  const mainHeaderRight = document.createElement('div');
  mainHeaderRight.classList.add('main-header--right', 'grid-x', 'align-middle');
  mainHeaderRight.innerHTML = `<button class="button brown square-icon corner-round search-btn show-for-large" aria-label="Search">
    <svg aria-hidden="true" role="presentation" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5998" cy="6.63203" r="5.3" stroke="#ffffff" stroke-width="2"></circle>
      <line x1="14.2855" y1="14.332" x2="10.7997" y2="10.8462" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line>
    </svg>
  </button>
  <button class="button brown square-icon corner-round burger-btn sm-transparent md-transparent js-burger-menu" id="burger-nav" aria-label="Open Navigation" aria-expanded="false" aria-controls="burger-nav-wrapper" data-nav-wrapper="burger-nav-wrapper">
    <svg aria-hidden="true" role="presentation" width="20" height="15" viewBox="0 0 20 15" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
      <rect y="0.332031" width="20" height="2" rx="1"></rect>
      <rect y="6.33203" width="20" height="2" rx="1"></rect>
      <rect y="12.332" width="20" height="2" rx="1"></rect>
    </svg>
  </button>`;
  mainHeaderContainer.append(mainHeaderRight);

  // Add event listeners for interactive elements
  const burgerButton = mainHeaderRight.querySelector('.js-burger-menu');
  const navigationOverlayElement = mainHeaderContainer.querySelector('.navigation-overlay');
  if (burgerButton && navigationOverlayElement) {
    burgerButton.addEventListener('click', () => {
      burgerButton.classList.toggle('active');
      navigationOverlayElement.classList.toggle('active');
      navWrapper.classList.toggle('active'); // Toggle active on the nav wrapper as well
      document.body.classList.toggle('no-scroll'); // Prevent body scroll when nav is open
    });

    // Close navigation when clicking overlay
    navigationOverlayElement.addEventListener('click', () => {
      burgerButton.classList.remove('active');
      navigationOverlayElement.classList.remove('active');
      navWrapper.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }

  // Add event listeners for level 1 navigation buttons
  persistentNav.querySelectorAll('.persistent-nav--level1').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const menuWrapperId = button.dataset.navWrapper;
      const menuWrapper = document.getElementById(menuWrapperId);
      if (menuWrapper) {
        button.classList.toggle('active');
        button.setAttribute('aria-expanded', button.classList.contains('active'));
        menuWrapper.classList.toggle('active');
      }
    });
  });

  // Add event listeners for level 2 navigation buttons (sub-menus)
  persistentNav.querySelectorAll('.js-persistent-nav--level2-link').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const level3WrapperId = button.getAttribute('aria-controls');
      const level3Wrapper = document.getElementById(level3WrapperId);
      if (level3Wrapper) {
        button.classList.toggle('active');
        button.setAttribute('aria-expanded', button.classList.contains('active'));
        level3Wrapper.classList.toggle('active');
      }
    });
  });

  // Add event listeners for close buttons in level 2 and level 3
  persistentNav.querySelectorAll('.js-persistent-nav-l1--close, .js-persistent-nav-l2--close').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const parentMenuWrapper = button.closest('.persistent-navigation--menu-wrapper');
      const parentLevel3Wrapper = button.closest('.persistent-nav--level3-wrapper');

      if (parentLevel3Wrapper) {
        // Closing level 3
        parentLevel3Wrapper.classList.remove('active');
        const level2Link = parentLevel3Wrapper.previousElementSibling;
        if (level2Link && level2Link.classList.contains('js-persistent-nav--level2-link')) {
          level2Link.classList.remove('active');
          level2Link.setAttribute('aria-expanded', 'false');
        }
      } else if (parentMenuWrapper) {
        // Closing level 2
        parentMenuWrapper.classList.remove('active');
        const level1Button = parentMenuWrapper.previousElementSibling;
        if (level1Button && level1Button.classList.contains('persistent-nav--level1')) {
          level1Button.classList.remove('active');
          level1Button.setAttribute('aria-expanded', 'false');
        }
      }
      // If it's the main close button (js-persistent-nav-l1--close) and no parent menu, close the whole nav
      if (button.classList.contains('js-persistent-nav-l1--close') && !parentMenuWrapper && !parentLevel3Wrapper) {
        if (burgerButton && navigationOverlayElement) {
          burgerButton.classList.remove('active');
          navigationOverlayElement.classList.remove('active');
          navWrapper.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      }
    });
  });

  block.replaceChildren(mainHeader);
}
