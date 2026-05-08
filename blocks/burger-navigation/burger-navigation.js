import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.classList.add('persistent-nav--level3-list', 'burger-nav'); // Add classes to the root UL
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('persistent-nav--level3-list-item'); // Add class to LI
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
        trigger.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    } else if (anchor) {
      anchor.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle'); // Add classes to direct link
      const span = document.createElement('span');
      span.classList.add('persistent-nav--level3-title', 'no-icon');
      span.textContent = anchor.textContent.trim();
      anchor.textContent = ''; // Clear original text
      anchor.append(span); // Wrap text in span
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];
  const [bannerImageRow, bannerInfoRow, ...itemRows] = children;

  const root = document.createElement('section');
  root.classList.add('burger-navigation', 'grid-container', 'js-burger-navigation');
  root.setAttribute('aria-label', 'Burger Navigation Section');

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

  const level2ListUl = document.createElement('ul');
  level2ListUl.classList.add('persistent-nav--level2-list', 'burger-nav');
  level2ListUl.setAttribute('aria-labelledby', 'persistent-nav--level2--title--');
  level2ItemsDiv.append(level2ListUl);

  const level2BannerDiv = document.createElement('div');
  level2BannerDiv.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level2-banner', 'show-for-large');

  if (bannerImageRow) {
    const picture = bannerImageRow.querySelector('picture');
    if (picture) {
      const bannerPicture = document.createElement('picture');
      bannerPicture.classList.add('persistent-nav--level2-banner-picture', 'burger-nav');
      moveInstrumentation(picture, bannerPicture);
      bannerPicture.append(picture);
      level2BannerDiv.append(bannerPicture);
    }
  }

  if (bannerInfoRow) {
    const bannerInfo = document.createElement('div');
    bannerInfo.classList.add('persistent-nav--level2-banner--info', 'burger-nav');
    moveInstrumentation(bannerInfoRow, bannerInfo); // Move instrumentation for the whole row
    bannerInfo.innerHTML = bannerInfoRow.innerHTML; // Read innerHTML directly from the row
    level2BannerDiv.append(bannerInfo);
  }

  const level2NavItems = itemRows.filter((row) => row.children.length === 3);
  const multipleLinksItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && row.querySelector('a'));
  const level3BannerItems = itemRows.filter((row) => row.children.length === 5);
  const level3LinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('a'));

  level2NavItems.forEach((row, index) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const listItem = document.createElement('li');
    listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');

    const subList = hierarchyTreeCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a');

    if (subList) {
      const button = document.createElement('button');
      button.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`);
      button.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(row, button);
      listItem.append(button);

      const level3Wrapper = document.createElement('div');
      level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
      level3Wrapper.id = `level-burger-nav-${index + 1}`;

      const level3Div = document.createElement('div');
      level3Div.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav');
      level3Div.setAttribute('role', 'list');

      const level3CloseDiv = document.createElement('div');
      level3CloseDiv.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
      level3CloseDiv.setAttribute('role', 'listitem');

      const backButton = document.createElement('button');
      backButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
      backButton.setAttribute('aria-label', 'Back to previous navigation');
      backButton.innerHTML = `
        <svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      `;
      level3CloseDiv.append(backButton);

      const titleSpan = document.createElement('span');
      titleSpan.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
      level3CloseDiv.append(titleSpan);

      const closeButtonL3 = document.createElement('button');
      closeButtonL3.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
      closeButtonL3.setAttribute('aria-label', 'Close navigation');
      closeButtonL3.innerHTML = `
        <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
        </svg>
      `;
      level3CloseDiv.append(closeButtonL3);
      level3Div.append(level3CloseDiv);

      const level3Title = document.createElement('p');
      level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
      level3Title.setAttribute('role', 'listitem');
      level3Title.textContent = labelCell?.textContent.trim() || '';
      level3Div.append(level3Title);

      const level3ListDiv = document.createElement('div');
      level3ListDiv.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
      level3ListDiv.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`;

      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation for the subList
      transformNestedLists(subList);
      level3ListDiv.append(subList);
      level3Div.append(level3ListDiv);
      level3Wrapper.append(level3Div);
      listItem.append(level3Wrapper);

      button.addEventListener('click', () => {
        level3Wrapper.classList.add('active');
        level2ListUl.classList.add('hide');
      });
      backButton.addEventListener('click', () => {
        level3Wrapper.classList.remove('active');
        level2ListUl.classList.remove('hide');
      });
      closeButtonL3.addEventListener('click', () => {
        // Trigger the main close button functionality
        closeButton.click();
      });
    } else if (directLink) {
      const anchor = document.createElement('a');
      anchor.href = directLink.href;
      anchor.textContent = labelCell?.textContent.trim() || '';
      anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
      moveInstrumentation(row, anchor);
      listItem.append(anchor);
    }
    level2ListUl.append(listItem);
  });

  // Handle Multiple Links (e.g., Login/Register)
  if (multipleLinksItems.length > 0) {
    const listItem = document.createElement('li');
    listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');
    const multipleLinksDiv = document.createElement('div');
    multipleLinksDiv.classList.add('multipleLinks');
    multipleLinksItems.forEach((row, idx) => {
      const [labelCell, linkCell] = [...row.children];
      const link = linkCell?.querySelector('a');
      if (link) {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = labelCell?.textContent.trim() || '';
        anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
        moveInstrumentation(row, anchor);
        multipleLinksDiv.append(anchor);
        if (idx < multipleLinksItems.length - 1) {
          const separator = document.createElement('span');
          separator.classList.add('multipleLinks--seperator');
          multipleLinksDiv.append(separator);
        }
      }
    });
    listItem.append(multipleLinksDiv);
    level2ListUl.append(listItem);
  }

  // Handle Level 3 Banners and Links (currently not directly nested in level2NavItems)
  // These would typically be associated with a specific level2Nav item.
  // For this structure, they are treated as separate top-level items for now.
  level3BannerItems.forEach((row, index) => {
    const [imageCell, headlineCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];
    const listItem = document.createElement('li');
    listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');

    const anchor = document.createElement('a');
    anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
    const ctaLink = ctaLinkCell?.querySelector('a');
    if (ctaLink) {
      anchor.href = ctaLink.href;
    }
    anchor.textContent = headlineCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor);
    listItem.append(anchor);

    const level3Wrapper = document.createElement('div');
    level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
    level3Wrapper.id = `level-burger-nav-banner-${index + 1}`;

    const level3Div = document.createElement('div');
    level3Div.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav', 'full-width');
    level3Div.setAttribute('role', 'list');
    level3Div.setAttribute('data-full-banner', '1');

    const level3CloseDiv = document.createElement('div');
    level3CloseDiv.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
    level3CloseDiv.setAttribute('role', 'listitem');
    // Add back and close buttons similar to hierarchy
    level3Div.append(level3CloseDiv);

    const level3Title = document.createElement('p');
    level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
    level3Title.setAttribute('role', 'listitem');
    level3Title.textContent = headlineCell?.textContent.trim() || '';
    level3Div.append(level3Title);

    const bannerContentDiv = document.createElement('div');
    bannerContentDiv.classList.add('cell', 'small-12', 'large-12', 'full-width', 'persistent-nav--level3', 'burger-nav');
    bannerContentDiv.setAttribute('role', 'listitem');

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const bannerPicture = document.createElement('picture');
      bannerPicture.classList.add('persistent-nav--level3-banner-picture');
      moveInstrumentation(picture, bannerPicture);
      bannerPicture.append(picture);
      bannerContentDiv.append(bannerPicture);
    }

    const bannerDescDiv = document.createElement('div');
    bannerDescDiv.classList.add('persistent-nav--level3-banner-desc', 'grid-x', 'align-middle', 'full-width');

    const bodyLargeBold = document.createElement('div');
    bodyLargeBold.classList.add('bodyLargeBold');
    bodyLargeBold.textContent = headlineCell?.textContent.trim() || '';
    bannerDescDiv.append(bodyLargeBold);

    const bodySmallRegular = document.createElement('div');
    bodySmallRegular.classList.add('bodySmallRegular');
    bodySmallRegular.innerHTML = descriptionCell?.innerHTML || '';
    bannerDescDiv.append(bodySmallRegular);

    const ctaAnchor = document.createElement('a');
    ctaAnchor.classList.add('labelMediumRegular', 'persistent-nav--level3-banner-desc-link');
    if (ctaLink) {
      ctaAnchor.href = ctaLink.href;
    }
    ctaAnchor.textContent = ctaLabelCell?.textContent.trim() || '';
    bannerDescDiv.append(ctaAnchor);

    bannerContentDiv.append(bannerDescDiv);
    level3Div.append(bannerContentDiv);
    level3Wrapper.append(level3Div);
    listItem.append(level3Wrapper);
    level2ListUl.append(listItem);
  });

  level3LinkItems.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children];
    const listItem = document.createElement('li');
    listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');

    const anchor = document.createElement('a');
    anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
    const link = linkCell?.querySelector('a');
    if (link) {
      anchor.href = link.href;
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor);
    listItem.append(anchor);

    // If these links should appear in a level3 wrapper, create it here
    // For now, they are added as direct level2 list items
    level2ListUl.append(listItem);
  });

  level2Div.append(level2ItemsDiv);
  level2Div.append(level2BannerDiv);
  menuWrapper.append(level2Div);
  persistentNavLi.append(menuWrapper);
  persistentNavUl.append(persistentNavLi);
  navWrapper.append(persistentNavUl);
  root.append(navWrapper);

  block.replaceChildren(root);

  // Optimize images
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
