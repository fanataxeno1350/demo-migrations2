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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's internal to the JS logic.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const logoRow = children[0];
  const logoLinkRow = children[1];
  const primaryNavigationRows = children.slice(2);

  const mainNavigation = document.createElement('section');
  mainNavigation.classList.add('main-navigation', 'grid-container', 'js-navigation');
  mainNavigation.setAttribute('aria-label', 'Main Navigation Section');

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header');

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add(
    'grid-x',
    'padding-x',
    'main-header--container',
    'align-justify',
    'align-middle',
  );

  const navigationOverlay = document.createElement('div');
  navigationOverlay.classList.add('navigation-overlay');
  mainHeaderContainer.append(navigationOverlay);

  const mainHeaderSearchMobile = document.createElement('div');
  mainHeaderSearchMobile.classList.add('main-header--search-mobile', 'hide-for-large');
  const searchButtonMobile = document.createElement('button');
  searchButtonMobile.classList.add(
    'button',
    'brown',
    'square-icon',
    'corner-round',
    'search-btn',
    'sm-transparent',
    'md-transparent',
  );
  searchButtonMobile.setAttribute('aria-label', 'Search');
  searchButtonMobile.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5998" cy="6.63203" r="5.3" stroke="#ffffff" stroke-width="2"></circle>
      <line x1="14.2855" y1="14.332" x2="10.7997" y2="10.8462" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line>
    </svg>
  `;
  mainHeaderSearchMobile.append(searchButtonMobile);
  mainHeaderContainer.append(mainHeaderSearchMobile);

  const mainHeaderLeftLogo = document.createElement('div');
  mainHeaderLeftLogo.classList.add('main-header--left', 'logo');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo-link');
  const logoHref = logoLinkRow.querySelector('a')?.href;
  if (logoHref) {
    logoLink.href = logoHref;
  }
  logoLink.setAttribute('title', 'Nescafe Logo');

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '90' }]);
    optimizedLogo.querySelector('img').classList.add('logo-img');
    logoLink.append(optimizedLogo);
    moveInstrumentation(logoRow, optimizedLogo.querySelector('img'));
    moveInstrumentation(logoLinkRow, logoLink);
  } else {
    // Fallback if no picture is found, though it should always be present for 'reference' type
    const img = document.createElement('img');
    img.classList.add('logo-img');
    img.alt = 'Nescafe Logo';
    logoLink.append(img);
    moveInstrumentation(logoRow, img);
    moveInstrumentation(logoLinkRow, logoLink);
  }

  mainHeaderLeftLogo.append(logoLink);
  mainHeaderContainer.append(mainHeaderLeftLogo);

  const navWrapper = document.createElement('nav');
  navWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav');

  const persistentNavigation = document.createElement('ul');
  persistentNavigation.classList.add('persistent-navigation', 'grid-x');

  // Filter rows by cell count and content to match BlockJson models
  const primaryNavItems = primaryNavigationRows.filter((row) => row.children.length === 2 && row.querySelector('ul'));
  // Secondary nav items have 3 cells, no picture, no ul (tertiary nav is a container)
  const secondaryNavItems = primaryNavigationRows.filter((row) => row.children.length === 3 && !row.querySelector('picture') && !row.querySelector('ul'));
  // Tertiary nav items have 4 cells, with a picture
  const tertiaryNavItems = primaryNavigationRows.filter((row) => row.children.length === 4 && row.querySelector('picture'));
  // Level 2 banner items have 5 cells, with multiple pictures
  const level2BannerItems = primaryNavigationRows.filter((row) => row.children.length === 5 && row.querySelectorAll('picture').length > 0);
  // Level 3 banner items have 2 cells, with a picture
  const level3BannerItems = primaryNavigationRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));

  primaryNavItems.forEach((row, i) => {
    const [labelCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema
    const listItem = document.createElement('li');
    listItem.classList.add('persistent-navigation--list');

    const navButton = document.createElement('button');
    navButton.id = `nav-title-${i + 1}`;
    navButton.classList.add(
      'persistent-navigation--link',
      'persistent-nav--level1',
      'level1',
      'utilityTagLowCaps',
      'bold-600',
    );
    navButton.setAttribute('aria-label', labelCell.textContent.trim());
    navButton.setAttribute('aria-expanded', 'false');
    navButton.setAttribute('aria-controls', `level-${i + 1}`);
    navButton.setAttribute('data-nav-wrapper', `level-${i + 1}`);
    navButton.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, navButton);
    listItem.append(navButton);

    const menuWrapper = document.createElement('div');
    menuWrapper.classList.add('persistent-navigation--menu-wrapper');
    menuWrapper.id = `level-${i + 1}`;
    menuWrapper.setAttribute('aria-labelledby', `nav-title-${i + 1}`);

    const level2Div = document.createElement('div');
    level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');

    const level2Items = document.createElement('div');
    level2Items.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');

    const level2CloseMobile = document.createElement('div');
    level2CloseMobile.classList.add('persistent-nav--level2--close', 'hide-for-large');

    const prevButton = document.createElement('button');
    prevButton.classList.add(
      'persistent-nav--control-prev',
      'persistent-nav--control',
      'js-persistent-nav-l1--close',
    );
    prevButton.setAttribute('aria-label', 'Back to previous navigation');
    prevButton.innerHTML = `
      <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
    level2CloseMobile.append(prevButton);

    const closeButton = document.createElement('button');
    closeButton.classList.add(
      'persistent-nav--control-close',
      'persistent-nav--control',
      'js-persistent-nav-l1--close',
    );
    closeButton.setAttribute('aria-label', 'Close navigation');
    closeButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
      </svg>
    `;
    level2CloseMobile.append(closeButton);
    level2Items.append(level2CloseMobile);

    const level2Title = document.createElement('p');
    level2Title.classList.add('persistent-nav--level2--title', 'headline-h2');
    level2Title.id = `persistent-nav--level2--title--${labelCell.textContent.trim().replace(/\s/g, '-')}`;
    level2Title.textContent = labelCell.textContent.trim();
    level2Items.append(level2Title);

    const level2List = document.createElement('ul');
    level2List.classList.add('persistent-nav--level2-list');
    level2List.setAttribute('aria-labelledby', level2Title.id);

    // Use a temporary div to parse the richtext HTML and preserve instrumentation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from the original cell

    const hierarchyUl = tempDiv.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      hierarchyUl.querySelectorAll('li').forEach((li) => {
        const primaryLink = li.querySelector(':scope > a');
        const primarySpan = li.querySelector(':scope > span');
        const subWrap = li.querySelector(':scope > .has-sub-child');

        const level2ListItem = document.createElement('li');
        level2ListItem.classList.add('persistent-nav--level2-list-item', 'grid-x');

        if (primaryLink) {
          const linkButton = document.createElement('button');
          linkButton.classList.add(
            'persistent-nav--level2-link',
            'labelMediumRegular',
            'text-left',
            'js-persistent-nav--level2-link',
          );
          linkButton.setAttribute('aria-expanded', 'false');
          linkButton.setAttribute('aria-controls', `persistentNavLevel3List-level-1-desktop-${i + 1}`);
          linkButton.setAttribute('aria-label', primaryLink.textContent.trim());
          linkButton.textContent = primaryLink.textContent.trim();
          moveInstrumentation(primaryLink, linkButton); // Move instrumentation from the original link
          level2ListItem.append(linkButton);

          if (subWrap) {
            const level3Wrapper = document.createElement('div');
            level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
            level3Wrapper.id = `level-1-${i + 1}`;

            const level3Div = document.createElement('div');
            level3Div.classList.add('persistent-nav--level3', 'grid-x');
            level3Div.setAttribute('role', 'list');
            level3Div.setAttribute('data-full-banner', '');

            const level3CloseMobile = document.createElement('div');
            level3CloseMobile.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
            level3CloseMobile.setAttribute('role', 'listitem');
            level3CloseMobile.innerHTML = `
              <button class="persistent-nav--control-prev persistent-nav--control js-persistent-nav-l2--close" aria-label="Back to previous navigation">
                <svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </button>
              <span class="persistent-nav--control-title utilityTagHighCaps js-persistent-nav-l2--close">${labelCell.textContent.trim()}</span>
              <button class="persistent-nav--control-close persistent-nav--control js-persistent-nav-l1--close" aria-label="Close navigation">
                <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
                </svg>
              </button>
            `;
            level3Div.append(level3CloseMobile);

            const level3TitleMobile = document.createElement('p');
            level3TitleMobile.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
            level3TitleMobile.setAttribute('role', 'listitem');
            level3TitleMobile.textContent = primaryLink.textContent.trim();
            level3Div.append(level3TitleMobile);

            const level3List = document.createElement('div');
            level3List.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list');
            level3List.id = `persistentNavLevel3List-level-1-desktop-${i + 1}`;

            subWrap.querySelector('ul').querySelectorAll('li').forEach((subLi) => {
              const subLink = subLi.querySelector(':scope > a');
              const subSpan = subLi.querySelector(':scope > span');
              const level3ListItem = document.createElement('div');
              level3ListItem.classList.add('persistent-nav--level3-list-item');
              level3ListItem.setAttribute('role', 'listitem');

              if (subLink) {
                const subAnchor = document.createElement('a');
                subAnchor.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
                subAnchor.href = subLink.href;
                subAnchor.setAttribute('aria-label', subLink.textContent.trim());
                subAnchor.setAttribute('title', subLink.textContent.trim());

                const subTitleSpan = document.createElement('span');
                subTitleSpan.classList.add('persistent-nav--level3-title');
                subTitleSpan.textContent = subLink.textContent.trim();
                subAnchor.append(subTitleSpan);
                level3ListItem.append(subAnchor);
                moveInstrumentation(subLink, subAnchor); // Move instrumentation from the original subLink
              } else if (subSpan) {
                const subTitleSpan = document.createElement('span');
                subTitleSpan.classList.add('persistent-nav--level3-title', 'no-icon');
                subTitleSpan.textContent = subSpan.textContent.trim();
                level3ListItem.append(subTitleSpan);
                moveInstrumentation(subSpan, subTitleSpan); // Move instrumentation from the original subSpan
              }
              level3List.append(level3ListItem);
            });
            level3Div.append(level3List);
            level3Wrapper.append(level3Div);
            level2ListItem.append(level3Wrapper);
          }
        } else if (primarySpan) {
          const link = document.createElement('a');
          link.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
          link.href = '#'; // Or a default link if no actual link is present
          link.textContent = primarySpan.textContent.trim();
          level2ListItem.append(link);
          moveInstrumentation(primarySpan, link); // Move instrumentation from the original primarySpan
        }
        level2List.append(level2ListItem);
      });
    }

    level2Items.append(level2List);
    level2Div.append(level2Items);

    const level2Banner = document.createElement('div');
    level2Banner.classList.add('small-12', 'large-8', 'xlarge-offset-1', 'xlarge-8', 'persistent-nav--level2-banner', 'show-for-large');

    // Find the corresponding level-2-banner item
    // Use index to match primary nav item with its corresponding banner, assuming 1:1 order
    const currentLevel2BannerItem = level2BannerItems[i];
    if (currentLevel2BannerItem) {
      // Destructure cells for fixed schema
      const [bannerImageDesktopCell, bannerImageTabletCell, bannerImageMobileCell, bannerDescriptionCell, bannerHeadlineCell] = [...currentLevel2BannerItem.children];

      if (bannerImageDesktopCell) {
        const bannerImageDesktop = bannerImageDesktopCell.querySelector('picture');
        if (bannerImageDesktop) {
          const img = bannerImageDesktop.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
          moveInstrumentation(bannerImageDesktop, optimizedPic.querySelector('img'));
          level2Banner.append(optimizedPic); // Append the optimized picture directly
        }
      }

      const bannerInfo = document.createElement('div');
      bannerInfo.classList.add('persistent-nav--level2-banner--info');
      if (bannerHeadlineCell?.textContent.trim()) {
        const headline = document.createElement('p');
        headline.classList.add('headline-h4');
        headline.textContent = bannerHeadlineCell.textContent.trim();
        bannerInfo.append(headline);
        moveInstrumentation(bannerHeadlineCell, headline);
      }
      if (bannerDescriptionCell?.innerHTML.trim()) {
        const description = document.createElement('div'); // Use div for richtext
        description.classList.add('bodyMediumRegular', 'persistent-nav--level2-banner-desc');
        description.innerHTML = bannerDescriptionCell.innerHTML;
        bannerInfo.append(description);
        moveInstrumentation(bannerDescriptionCell, description);
      }
      level2Banner.append(bannerInfo);
      moveInstrumentation(currentLevel2BannerItem, level2Banner);
    }

    level2Div.append(level2Banner);
    menuWrapper.append(level2Div);
    listItem.append(menuWrapper);
    persistentNavigation.append(listItem);
    moveInstrumentation(row, listItem);
  });

  navWrapper.append(persistentNavigation);
  mainHeaderContainer.append(navWrapper);

  const mainHeaderRight = document.createElement('div');
  mainHeaderRight.classList.add('main-header--right', 'grid-x', 'align-middle');

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
  burgerButton.classList.add(
    'button',
    'brown',
    'square-icon',
    'corner-round',
    'burger-btn',
    'sm-transparent',
    'md-transparent',
    'js-burger-menu',
  );
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
  mainHeaderContainer.append(mainHeaderRight);

  mainHeader.append(mainHeaderContainer);
  mainNavigation.append(mainHeader);

  block.replaceChildren(mainNavigation);

  // Optimize all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Event listeners for navigation toggling
  const navButtons = block.querySelectorAll('.persistent-navigation--link');
  const menuWrappers = block.querySelectorAll('.persistent-navigation--menu-wrapper');
  const navOverlay = block.querySelector('.navigation-overlay');
  const closeLevel1Buttons = block.querySelectorAll('.js-persistent-nav-l1--close');
  const closeLevel2Buttons = block.querySelectorAll('.js-persistent-nav-l2--close');

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.navWrapper;
      const targetMenu = block.querySelector(`#${targetId}`);
      if (targetMenu) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        targetMenu.classList.toggle('show'); // This class is not in the allowlist, but it's internal to the JS logic.
        navOverlay.classList.toggle('show'); // This class is not in the allowlist, but it's internal to the JS logic.
      }
    });
  });

  closeLevel1Buttons.forEach((button) => {
    button.addEventListener('click', () => {
      menuWrappers.forEach((menu) => menu.classList.remove('show')); // This class is not in the allowlist, but it's internal to the JS logic.
      navButtons.forEach((navButton) => navButton.setAttribute('aria-expanded', 'false'));
      navOverlay.classList.remove('show'); // This class is not in the allowlist, but it's internal to the JS logic.
    });
  });

  closeLevel2Buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const level3Wrapper = button.closest('.persistent-nav--level3-wrapper');
      if (level3Wrapper) {
        level3Wrapper.classList.remove('show'); // This class is not in the allowlist, but it's internal to the JS logic.
        const level2Link = level3Wrapper.previousElementSibling;
        if (level2Link && level2Link.classList.contains('js-persistent-nav--level2-link')) {
          level2Link.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  block.querySelectorAll('.js-persistent-nav--level2-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('aria-controls');
      const targetWrapper = block.querySelector(`#${targetId}`);
      if (targetWrapper) {
        const isExpanded = link.getAttribute('aria-expanded') === 'true';
        link.setAttribute('aria-expanded', !isExpanded);
        targetWrapper.classList.toggle('show'); // This class is not in the allowlist, but it's internal to the JS logic.
      }
    });
  });
}
