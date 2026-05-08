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

  // Root fields
  const [logoRow, logoLinkRow, ...restRows] = children;
  const logoCell = logoRow.children[0];
  const logoLinkCell = logoLinkRow.children[0];

  // Filter item rows based on cell count and content
  const navLevel1Items = restRows.filter((row) => row.children.length === 3);
  // const navLevel2Items = restRows.filter((row) => row.children.length === 4); // Not used directly in current logic
  // const navLevel3Items = restRows.filter((row) => row.children.length === 3 && row.querySelector('picture')); // Not used directly in current logic
  // const navLevel3Banners = restRows.filter((row) => row.children.length === 2 && row.querySelector('picture')); // Not used directly in current logic
  const navLevel2Banners = restRows.filter((row) => row.children.length === 5);

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header');

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add('grid-x', 'padding-x', 'main-header--container', 'align-justify', 'align-middle');
  mainHeader.append(mainHeaderContainer);

  const navigationOverlay = document.createElement('div');
  navigationOverlay.classList.add('navigation-overlay');
  mainHeaderContainer.append(navigationOverlay);

  const mobileSearch = document.createElement('div');
  mobileSearch.classList.add('main-header--search-mobile', 'hide-for-large');
  const mobileSearchButton = document.createElement('button');
  mobileSearchButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'sm-transparent', 'md-transparent');
  mobileSearchButton.setAttribute('aria-label', 'Search');
  mobileSearchButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5998" cy="6.63203" r="5.3" stroke="#ffffff" stroke-width="2"></circle><line x1="14.2855" y1="14.332" x2="10.7997" y2="10.8462" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line></svg>';
  mobileSearch.append(mobileSearchButton);
  mainHeaderContainer.append(mobileSearch);

  const mainHeaderLeft = document.createElement('div');
  mainHeaderLeft.classList.add('main-header--left', 'logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo-link');
  const foundLogoLink = logoLinkCell.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.title = foundLogoLink.title || 'Nescafe Logo';
  }
  const logoPicture = logoCell.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '90' }]);
      optimizedPic.querySelector('img').classList.add('logo-img');
      moveInstrumentation(logoPicture, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  mainHeaderLeft.append(logoLink);
  mainHeaderContainer.append(mainHeaderLeft);

  const navWrapper = document.createElement('nav');
  navWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav');
  navWrapper.style.marginLeft = '27px';
  navWrapper.style.opacity = '1';
  mainHeaderContainer.append(navWrapper);

  const persistentNav = document.createElement('ul');
  persistentNav.classList.add('persistent-navigation', 'grid-x');
  navWrapper.append(persistentNav);

  navLevel1Items.forEach((row, index) => {
    const [labelCell, ariaLabelCell, hierarchyTreeCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('persistent-navigation--list');
    moveInstrumentation(row, listItem);

    const navButton = document.createElement('button');
    navButton.id = `nav-title-${index + 1}`;
    navButton.classList.add('persistent-navigation--link', 'persistent-nav--level1', 'level1', 'utilityTagLowCaps', 'bold-600');
    navButton.setAttribute('aria-label', ariaLabelCell.textContent.trim());
    navButton.setAttribute('aria-expanded', 'false');
    navButton.setAttribute('aria-controls', `level-${index + 1}`);
    navButton.setAttribute('data-nav-wrapper', `level-${index + 1}`);
    navButton.textContent = labelCell.textContent.trim();
    listItem.append(navButton);

    const menuWrapper = document.createElement('div');
    menuWrapper.classList.add('persistent-navigation--menu-wrapper');
    menuWrapper.id = `level-${index + 1}`;
    menuWrapper.setAttribute('aria-labelledby', `nav-title-${index + 1}`);
    listItem.append(menuWrapper);

    const level2Div = document.createElement('div');
    level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');
    menuWrapper.append(level2Div);

    const level2ItemsContainer = document.createElement('div');
    level2ItemsContainer.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');
    level2Div.append(level2ItemsContainer);

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
    level2ItemsContainer.append(level2Close);

    const level2Title = document.createElement('p');
    level2Title.classList.add('persistent-nav--level2--title', 'headline-h2');
    level2Title.id = `persistent-nav--level2--title--${labelCell.textContent.trim().replace(/\s/g, '-')}`;
    level2Title.textContent = labelCell.textContent.trim();
    level2ItemsContainer.append(level2Title);

    const level2List = document.createElement('ul');
    level2List.classList.add('persistent-nav--level2-list');
    level2List.setAttribute('aria-labelledby', level2Title.id);
    level2ItemsContainer.append(level2List);

    const tempDiv = document.createElement('div');
    moveInstrumentation(hierarchyTreeCell, tempDiv);
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    const hierarchyUl = tempDiv.querySelector('ul');

    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);

      [...hierarchyUl.children].forEach((level2Li) => {
        const level2ListItem = document.createElement('li');
        level2ListItem.classList.add('persistent-nav--level2-list-item', 'grid-x');
        level2List.append(level2ListItem);

        const level2LinkOrButton = level2Li.querySelector(':scope > a, :scope > span');
        if (level2LinkOrButton) {
          if (level2LinkOrButton.tagName === 'A') {
            const link = document.createElement('a');
            link.href = level2LinkOrButton.href;
            link.textContent = level2LinkOrButton.textContent.trim();
            link.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
            level2ListItem.append(link);
          } else {
            const button = document.createElement('button');
            button.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `persistentNavLevel3List-level-${index + 1}-desktop-${level2List.children.length}`);
            button.setAttribute('aria-label', level2LinkOrButton.textContent.trim());
            button.textContent = level2LinkOrButton.textContent.trim();
            level2ListItem.append(button);

            const level3Wrapper = document.createElement('div');
            level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
            level3Wrapper.id = `level-${index + 1}-${level2List.children.length}`;
            level2ListItem.append(level3Wrapper);

            const level3Div = document.createElement('div');
            level3Div.classList.add('persistent-nav--level3', 'grid-x');
            level3Div.setAttribute('role', 'list');
            level3Wrapper.append(level3Div);

            const level3Close = document.createElement('div');
            level3Close.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
            level3Close.setAttribute('role', 'listitem');
            level3Close.innerHTML = `
              <button class="persistent-nav--control-prev persistent-nav--control js-persistent-nav-l2--close" aria-label="Back to previous navigation">
                <svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </button>
              <span class="persistent-nav--control-title utilityTagHighCaps js-persistent-nav-l2--close">${labelCell.textContent.trim()}</span>
              <button class="persistent-nav--control-close persistent-nav--control js-persistent-nav-l1--close" aria-label="Close navigation">
                <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path></svg>
              </button>
            `;
            level3Div.append(level3Close);

            const level3Title = document.createElement('p');
            level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
            level3Title.setAttribute('role', 'listitem');
            level3Title.textContent = level2LinkOrButton.textContent.trim();
            level3Div.append(level3Title);

            const level3ListContainer = document.createElement('div');
            level3ListContainer.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list');
            level3ListContainer.id = `persistentNavLevel3List-level-${index + 1}-desktop-${level2List.children.length}`;
            level3Div.append(level3ListContainer);

            const subList = level2Li.querySelector('ul');
            if (subList) {
              [...subList.children].forEach((level3Li) => {
                const level3ListItem = document.createElement('div');
                level3ListItem.classList.add('persistent-nav--level3-list-item');
                level3ListItem.setAttribute('role', 'listitem');
                level3ListContainer.append(level3ListItem);

                const level3Link = level3Li.querySelector('a');
                if (level3Link) {
                  const link = document.createElement('a');
                  link.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
                  link.href = level3Link.href;
                  link.title = level3Link.title;
                  link.setAttribute('aria-label', level3Link.textContent.trim());

                  const icon = level3Li.querySelector('picture');
                  if (icon) {
                    const iconSpan = document.createElement('span');
                    iconSpan.classList.add('persistent-nav--level3-icon');
                    const img = icon.querySelector('img');
                    if (img) {
                      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
                      optimizedPic.querySelector('img').classList.add('persistent-nav--level3-icon-img', 'lazyload');
                      moveInstrumentation(icon, optimizedPic.querySelector('img'));
                      iconSpan.append(optimizedPic);
                    }
                    link.append(iconSpan);
                  } else {
                    link.classList.add('no-icon');
                  }

                  const titleSpan = document.createElement('span');
                  titleSpan.classList.add('persistent-nav--level3-title');
                  titleSpan.textContent = level3Link.textContent.trim();
                  link.append(titleSpan);
                  level3ListItem.append(link);
                }
              });
            }
          }
        }
      });
    }

    // Find associated banner by checking if its AUE resource matches the current nav item's AUE resource
    // This assumes a convention where banners are associated with the nav item they follow in the block structure
    // and that the AUE resource ID can be used for this association.
    // A more robust solution might involve an explicit field in the nav-level1-item model for the banner.
    const level2Banner = navLevel2Banners.find((bannerRow) => bannerRow.dataset.aueResource); // This is a placeholder for actual association logic
    if (level2Banner) {
      const [desktopImgCell, tabletImgCell, mobileImgCell, descCell, headlineCell] = [...level2Banner.children];

      const bannerDiv = document.createElement('div');
      bannerDiv.classList.add('small-12', 'large-8', 'xlarge-offset-1', 'xlarge-8', 'persistent-nav--level2-banner', 'show-for-large');
      moveInstrumentation(level2Banner, bannerDiv);

      const bannerPicture = document.createElement('picture');
      bannerPicture.classList.add('persistent-nav--level2-banner-picture');

      const desktopPicture = desktopImgCell.querySelector('picture');
      if (desktopPicture) {
        const desktopSource = document.createElement('source');
        desktopSource.media = '(min-width: 1440px)';
        desktopSource.srcset = desktopPicture.querySelector('img').src;
        desktopSource.height = '640';
        bannerPicture.append(desktopSource);
      }

      const tabletPicture = tabletImgCell.querySelector('picture');
      if (tabletPicture) {
        const tabletSource = document.createElement('source');
        tabletSource.media = '(min-width: 1024px)';
        tabletSource.srcset = tabletPicture.querySelector('img').src;
        tabletSource.height = '300';
        bannerPicture.append(tabletSource);
      }

      const mobilePicture = mobileImgCell.querySelector('picture');
      if (mobilePicture) {
        const mobileSource = document.createElement('source');
        mobileSource.media = '(min-width: 768px)';
        mobileSource.srcset = mobilePicture.querySelector('img').src;
        mobileSource.height = '640';
        bannerPicture.append(mobileSource);
      }

      const defaultImg = document.createElement('img');
      defaultImg.classList.add('persistent-nav--level2-banner-img', 'lazyload');
      defaultImg.src = desktopImgCell.querySelector('picture')?.querySelector('img')?.src || '';
      defaultImg.alt = desktopImgCell.querySelector('picture')?.querySelector('img')?.alt || '';
      defaultImg.height = '640';
      bannerPicture.append(defaultImg);
      bannerDiv.append(bannerPicture);

      const bannerInfo = document.createElement('div');
      bannerInfo.classList.add('persistent-nav--level2-banner--info');
      bannerDiv.append(bannerInfo);

      const bannerHeadline = document.createElement('p');
      bannerHeadline.classList.add('headline-h4');
      bannerHeadline.textContent = headlineCell.textContent.trim();
      bannerInfo.append(bannerHeadline);

      const bannerDesc = document.createElement('div');
      bannerDesc.classList.add('bodyMediumRegular', 'persistent-nav--level2-banner-desc');
      bannerDesc.innerHTML = descCell.innerHTML;
      bannerInfo.append(bannerDesc);

      level2Div.append(bannerDiv);
    }

    persistentNav.append(listItem);

    // Add event listeners for level 1 navigation buttons
    navButton.addEventListener('click', () => {
      const isExpanded = navButton.getAttribute('aria-expanded') === 'true';
      navButton.setAttribute('aria-expanded', !isExpanded);
      listItem.classList.toggle('active', !isExpanded);
      menuWrapper.classList.toggle('active', !isExpanded);
      navigationOverlay.classList.toggle('active', !isExpanded);
    });

    // Add event listeners for level 2 close buttons
    level2Close.querySelectorAll('.js-persistent-nav-l1--close').forEach((btn) => {
      btn.addEventListener('click', () => {
        navButton.setAttribute('aria-expanded', 'false');
        listItem.classList.remove('active');
        menuWrapper.classList.remove('active');
        navigationOverlay.classList.remove('active');
      });
    });

    // Add event listeners for level 2 links/buttons that open level 3
    level2List.querySelectorAll('.js-persistent-nav--level2-link').forEach((linkOrBtn) => {
      if (linkOrBtn.tagName === 'BUTTON') {
        linkOrBtn.addEventListener('click', () => {
          const isExpanded = linkOrBtn.getAttribute('aria-expanded') === 'true';
          linkOrBtn.setAttribute('aria-expanded', !isExpanded);
          linkOrBtn.closest('.persistent-nav--level2-list-item').classList.toggle('active', !isExpanded);
          const targetId = linkOrBtn.getAttribute('aria-controls');
          const targetWrapper = document.getElementById(targetId);
          if (targetWrapper) {
            targetWrapper.classList.toggle('active', !isExpanded);
          }
        });
      }
    });

    // Add event listeners for level 3 close buttons
    menuWrapper.querySelectorAll('.js-persistent-nav-l2--close').forEach((btn) => {
      btn.addEventListener('click', () => {
        const level3Wrapper = btn.closest('.persistent-nav--level3-wrapper');
        if (level3Wrapper) {
          level3Wrapper.classList.remove('active');
          const parentListItem = level3Wrapper.closest('.persistent-nav--level2-list-item');
          if (parentListItem) {
            parentListItem.classList.remove('active');
            const parentButton = parentListItem.querySelector('.js-persistent-nav--level2-link[aria-expanded="true"]');
            if (parentButton) {
              parentButton.setAttribute('aria-expanded', 'false');
            }
          }
        }
      });
    });
  });

  const mainHeaderRight = document.createElement('div');
  mainHeaderRight.classList.add('main-header--right', 'grid-x', 'align-middle');

  const desktopSearchButton = document.createElement('button');
  desktopSearchButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'search-btn', 'show-for-large');
  desktopSearchButton.setAttribute('aria-label', 'Search');
  desktopSearchButton.innerHTML = '<svg aria-hidden="true" role="presentation" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5998" cy="6.63203" r="5.3" stroke="#ffffff" stroke-width="2"></circle><line x1="14.2855" y1="14.332" x2="10.7997" y2="10.8462" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></line></svg>';
  mainHeaderRight.append(desktopSearchButton);

  const burgerButton = document.createElement('button');
  burgerButton.classList.add('button', 'brown', 'square-icon', 'corner-round', 'burger-btn', 'sm-transparent', 'md-transparent', 'js-burger-menu');
  burgerButton.id = 'burger-nav';
  burgerButton.setAttribute('aria-label', 'Open Navigation');
  burgerButton.setAttribute('aria-expanded', 'false');
  burgerButton.setAttribute('aria-controls', 'burger-nav-wrapper');
  burgerButton.setAttribute('data-nav-wrapper', 'burger-nav-wrapper');
  burgerButton.innerHTML = '<svg aria-hidden="true" role="presentation" width="20" height="15" viewBox="0 0 20 15" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><rect y="0.332031" width="20" height="2" rx="1"></rect><rect y="6.33203" width="20" height="2" rx="1"></rect><rect y="12.332" width="20" height="2" rx="1"></rect></svg>';
  mainHeaderRight.append(burgerButton);
  mainHeaderContainer.append(mainHeaderRight);

  const newRoot = document.createElement('section');
  newRoot.classList.add('main-navigation', 'grid-container', 'js-navigation');
  newRoot.setAttribute('aria-label', 'Main Navigation Section');
  newRoot.append(mainHeader);

  block.replaceChildren(newRoot);

  newRoot.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
