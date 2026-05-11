import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level) {
  rootUl.querySelectorAll(':scope > li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    let trigger;

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        trigger = span;
      }
    } else {
      trigger = anchor;
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child');
      if (level === 2) {
        subWrap.classList.add('has-footer-sub-child');
      } else if (level === 3) {
        subWrap.classList.add('has-footer-inner-sub-child');
      }
      subWrap.append(nested);
      li.append(subWrap);

      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested, level + 1);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const level2BannerImageRow = children[0];
  const level2BannerHeadlineRow = children[1];
  const menuItemsContainerRow = children[2]; // This is the empty container row for menuItems

  const menuItems = children.slice(3); // All subsequent rows are menu items or level 3 links

  const burgerNavigation = document.createElement('section');
  burgerNavigation.classList.add('burger-navigation', 'grid-container', 'js-burger-navigation');
  burgerNavigation.setAttribute('aria-label', 'Burger Navigation Section');

  const navWrapper = document.createElement('nav');
  navWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav', 'burger-nav');

  const persistentNavUl = document.createElement('ul');
  persistentNavUl.classList.add('persistent-navigation', 'grid-x');

  const persistentNavLi = document.createElement('li');
  persistentNavLi.classList.add('persistent-navigation--list');

  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('persistent-navigation--menu-wrapper', 'burger-nav');
  menuWrapper.id = 'burger-nav-wrapper';
  menuWrapper.setAttribute('aria-labelledby', 'burger-nav');

  const level2Div = document.createElement('div');
  level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');

  const level2ItemsDiv = document.createElement('div');
  level2ItemsDiv.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');

  const level2CloseDiv = document.createElement('div');
  level2CloseDiv.classList.add('persistent-nav--level2--close', 'hide-for-large');

  const prevControl = document.createElement('div');
  prevControl.classList.add('persistent-nav--control-prev', 'persistent-nav--control');
  level2CloseDiv.append(prevControl);

  const closeButton = document.createElement('button');
  closeButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
  closeButton.setAttribute('aria-label', 'Close navigation');
  closeButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
    </svg>
  `;
  level2CloseDiv.append(closeButton);
  level2ItemsDiv.append(level2CloseDiv);

  const level2List = document.createElement('ul');
  level2List.classList.add('persistent-nav--level2-list', 'burger-nav');
  level2List.setAttribute('aria-labelledby', 'persistent-nav--level2--title--');

  menuItems.forEach((row, index) => {
    // Distinguish between burger-navigation-menu-item (9 cells) and burger-navigation-level3-link (2 cells)
    const cells = [...row.children];
    const isMenuItem = cells.length === 9; // burger-navigation-menu-item has 9 cells
    const isLevel3Link = cells.length === 2; // burger-navigation-level3-link has 2 cells

    if (isMenuItem) {
      const [
        labelCell,
        linkCell,
        isButtonCell,
        // level3Links (container, no cell here)
        level3BannerImageCell,
        level3BannerHeadlineCell,
        level3BannerDescriptionCell,
        level3BannerCtaLinkCell,
        level3BannerCtaLabelCell,
        hierarchyTreeCell,
      ] = cells;

      const level2ListItem = document.createElement('li');
      level2ListItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');
      moveInstrumentation(row, level2ListItem);

      const linkEl = linkCell?.querySelector('a');
      const isButton = isButtonCell?.textContent.trim().toLowerCase() === 'true';
      const hierarchyTreeUl = hierarchyTreeCell?.querySelector('ul');

      if (hierarchyTreeUl) {
        const button = document.createElement('button');
        button.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`);
        button.textContent = labelCell?.textContent.trim() || '';
        level2ListItem.append(button);

        const level3Wrapper = document.createElement('div');
        level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
        level3Wrapper.id = `level-burger-nav-${index + 1}`;

        const level3Div = document.createElement('div');
        level3Div.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav');
        level3Div.setAttribute('role', 'list');

        const level3CloseDiv = document.createElement('div');
        level3CloseDiv.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
        level3CloseDiv.setAttribute('role', 'listitem');

        const level3PrevButton = document.createElement('button');
        level3PrevButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
        level3PrevButton.setAttribute('aria-label', 'Back to previous navigation');
        level3PrevButton.innerHTML = `<svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>`;
        level3CloseDiv.append(level3PrevButton);

        const level3ControlTitle = document.createElement('span');
        level3ControlTitle.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
        level3CloseDiv.append(level3ControlTitle);

        const level3CloseButton = document.createElement('button');
        level3CloseButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
        level3CloseButton.setAttribute('aria-label', 'Close navigation');
        level3CloseButton.innerHTML = `<svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
        </svg>`;
        level3CloseDiv.append(level3CloseButton);
        level3Div.append(level3CloseDiv);

        const level3Title = document.createElement('p');
        level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
        level3Title.setAttribute('role', 'listitem');
        level3Title.textContent = labelCell?.textContent.trim() || '';
        level3Div.append(level3Title);

        const level3ListDiv = document.createElement('div');
        level3ListDiv.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
        level3ListDiv.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`;

        // Move instrumentation for the hierarchyTreeCell content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, tempDiv);
        const transformedUl = tempDiv.querySelector('ul');
        if (transformedUl) {
          transformNestedLists(transformedUl, 2);
          level3ListDiv.append(transformedUl);
        }
        level3Div.append(level3ListDiv);
        level3Wrapper.append(level3Div);
        level2ListItem.append(level3Wrapper);

        button.addEventListener('click', () => {
          level2ListItem.classList.toggle('active');
          level3Wrapper.classList.toggle('active');
          button.setAttribute('aria-expanded', level3Wrapper.classList.contains('active'));
        });

        level3PrevButton.addEventListener('click', () => {
          level2ListItem.classList.remove('active');
          level3Wrapper.classList.remove('active');
          button.setAttribute('aria-expanded', false);
        });
      } else if (isButton) {
        const multipleLinksDiv = document.createElement('div');
        multipleLinksDiv.classList.add('multipleLinks');

        const buttonLink = document.createElement('a');
        buttonLink.href = linkEl?.href || '#';
        buttonLink.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
        buttonLink.setAttribute('aria-label', labelCell?.textContent.trim() || '');
        buttonLink.textContent = labelCell?.textContent.trim() || '';
        multipleLinksDiv.append(buttonLink);

        // Check if there's a second link/button in the original HTML, if not, remove placeholder
        // Based on the provided HTML, the second link "Register" is hardcoded.
        // To make it dynamic, we'd need another cell in the model.
        // For now, if no corresponding cell, we'll remove the hardcoded part.
        // Assuming the original HTML's "Register" link is a static element,
        // if it needs to be dynamic, a new field in the model is required.
        // For now, removing the hardcoded 'Register' link as it has no model field.
        // If there was a second link cell in the model, it would be handled here.
        // Example if there was a second button cell:
        // const registerLinkCell = cells[X]; // Assuming X is the index for register link
        // if (registerLinkCell) {
        //   const separator = document.createElement('span');
        //   separator.classList.add('multipleLinks--seperator');
        //   multipleLinksDiv.append(separator);
        //   const registerLink = document.createElement('a');
        //   registerLink.href = registerLinkCell.querySelector('a')?.href || '#';
        //   registerLink.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
        //   registerLink.setAttribute('aria-label', registerLinkCell.textContent.trim() || '');
        //   registerLink.textContent = registerLinkCell.textContent.trim() || '';
        //   multipleLinksDiv.append(registerLink);
        // }

        level2ListItem.append(multipleLinksDiv);
      } else {
        const anchor = document.createElement('a');
        anchor.href = linkEl?.href || '#';
        anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
        anchor.textContent = labelCell?.textContent.trim() || '';
        level2ListItem.append(anchor);

        const hasBanner = level3BannerImageCell?.querySelector('picture');
        if (hasBanner) {
          const level3Wrapper = document.createElement('div');
          level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
          level3Wrapper.id = `level-burger-nav-${index + 1}`;

          const level3Div = document.createElement('div');
          level3Div.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav', 'full-width');
          level3Div.setAttribute('role', 'list');
          level3Div.setAttribute('data-full-banner', '1');

          const level3CloseDiv = document.createElement('div');
          level3CloseDiv.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
          level3CloseDiv.setAttribute('role', 'listitem');

          const level3PrevButton = document.createElement('button');
          level3PrevButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
          level3PrevButton.setAttribute('aria-label', 'Back to previous navigation');
          level3PrevButton.innerHTML = `<svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>`;
          level3CloseDiv.append(level3PrevButton);

          const level3ControlTitle = document.createElement('span');
          level3ControlTitle.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
          level3CloseDiv.append(level3ControlTitle);

          const level3CloseButton = document.createElement('button');
          level3CloseButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
          level3CloseButton.setAttribute('aria-label', 'Close navigation');
          level3CloseButton.innerHTML = `<svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
          </svg>`;
          level3CloseDiv.append(level3CloseButton);
          level3Div.append(level3CloseDiv);

          const level3Title = document.createElement('p');
          level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
          level3Title.setAttribute('role', 'listitem');
          level3Title.textContent = labelCell?.textContent.trim() || '';
          level3Div.append(level3Title);

          const level3BannerDiv = document.createElement('div');
          level3BannerDiv.classList.add('cell', 'small-12', 'large-12', 'full-width', 'persistent-nav--level3', 'burger-nav');
          level3BannerDiv.setAttribute('role', 'listitem');

          const picture = level3BannerImageCell?.querySelector('picture');
          if (picture) {
            const bannerPicture = document.createElement('picture');
            bannerPicture.classList.add('persistent-nav--level3-banner-picture');
            bannerPicture.append(...picture.children);
            level3BannerDiv.append(bannerPicture);
            moveInstrumentation(level3BannerImageCell, bannerPicture);
          }

          const bannerDesc = document.createElement('div');
          bannerDesc.classList.add('persistent-nav--level3-banner-desc', 'grid-x', 'align-middle', 'full-width');

          const headline = document.createElement('div');
          headline.classList.add('bodyLargeBold');
          headline.innerHTML = level3BannerHeadlineCell?.innerHTML || '';
          moveInstrumentation(level3BannerHeadlineCell, headline);
          bannerDesc.append(headline);

          const description = document.createElement('div');
          description.classList.add('bodySmallRegular');
          description.innerHTML = level3BannerDescriptionCell?.innerHTML || '';
          moveInstrumentation(level3BannerDescriptionCell, description);
          bannerDesc.append(description);

          const ctaLinkEl = level3BannerCtaLinkCell?.querySelector('a');
          const ctaLink = document.createElement('a');
          ctaLink.href = ctaLinkEl?.href || '#';
          ctaLink.classList.add('labelMediumRegular', 'persistent-nav--level3-banner-desc-link');
          ctaLink.textContent = level3BannerCtaLabelCell?.textContent.trim() || '';
          bannerDesc.append(ctaLink);
          moveInstrumentation(level3BannerCtaLinkCell, ctaLink);

          level3BannerDiv.append(bannerDesc);
          level3Div.append(level3BannerDiv);
          level3Wrapper.append(level3Div);
          level2ListItem.append(level3Wrapper);

          anchor.addEventListener('click', (e) => {
            e.preventDefault();
            level2ListItem.classList.toggle('active');
            level3Wrapper.classList.toggle('active');
          });

          level3PrevButton.addEventListener('click', () => {
            level2ListItem.classList.remove('active');
            level3Wrapper.classList.remove('active');
          });
        }
      }
      level2List.append(level2ListItem);
    } else if (isLevel3Link) {
      const [labelCell, linkCell] = cells;
      const level2ListItem = document.createElement('li');
      level2ListItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');
      moveInstrumentation(row, level2ListItem);

      const anchor = document.createElement('a');
      anchor.href = linkCell?.querySelector('a')?.href || '#';
      anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
      anchor.textContent = labelCell?.textContent.trim() || '';
      level2ListItem.append(anchor);
      level2List.append(level2ListItem);
    }
  });

  level2ItemsDiv.append(level2List);
  level2Div.append(level2ItemsDiv);

  const level2BannerDiv = document.createElement('div');
  level2BannerDiv.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level2-banner', 'show-for-large');

  const level2BannerPicture = level2BannerImageRow?.querySelector('picture');
  if (level2BannerPicture) {
    const bannerPicture = document.createElement('picture');
    bannerPicture.classList.add('persistent-nav--level2-banner-picture', 'burger-nav');
    bannerPicture.append(...level2BannerPicture.children);
    level2BannerDiv.append(bannerPicture);
    moveInstrumentation(level2BannerImageRow, bannerPicture);
  }

  const level2BannerInfo = document.createElement('div');
  level2BannerInfo.classList.add('persistent-nav--level2-banner--info', 'burger-nav');
  const level2BannerHeadline = document.createElement('p');
  level2BannerHeadline.classList.add('headline-h4');
  level2BannerHeadline.innerHTML = level2BannerHeadlineRow?.innerHTML || '';
  level2BannerInfo.append(level2BannerHeadline);
  moveInstrumentation(level2BannerHeadlineRow, level2BannerHeadline);

  level2BannerDiv.append(level2BannerInfo);
  level2Div.append(level2BannerDiv);
  menuWrapper.append(level2Div);
  persistentNavLi.append(menuWrapper);
  persistentNavUl.append(persistentNavLi);
  navWrapper.append(persistentNavUl);
  burgerNavigation.append(navWrapper);

  block.replaceChildren(burgerNavigation);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Move instrumentation for the container row
  moveInstrumentation(menuItemsContainerRow, level2List);

  // Event listeners for opening/closing the burger navigation
  const burgerNavWrapper = block.querySelector('.js-burger-navigation');
  const persistentNavL1Close = block.querySelector('.js-persistent-nav-l1--close');

  if (persistentNavL1Close) {
    persistentNavL1Close.addEventListener('click', () => {
      burgerNavWrapper.classList.remove('active');
      block.closest('.header-wrapper')?.classList.remove('burger-nav-open');
    });
  }
}
