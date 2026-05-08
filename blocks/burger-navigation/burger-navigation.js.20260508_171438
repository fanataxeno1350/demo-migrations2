import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level3LinksList) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      const link = document.createElement('a');
      link.href = anchor.href;
      link.textContent = anchor.textContent.trim();
      link.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');

      const span = document.createElement('span');
      span.classList.add('persistent-nav--level3-title', 'no-icon');
      span.textContent = anchor.textContent.trim();
      link.append(span);

      const listItem = document.createElement('div');
      listItem.classList.add('persistent-nav--level3-list-item');
      listItem.append(link);
      level3LinksList.append(listItem);
    } else {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);

        const listItem = document.createElement('div');
        listItem.classList.add('persistent-nav--level3-list-item');
        listItem.append(span);
        level3LinksList.append(listItem);
      }
    }

    if (nested) {
      transformNestedLists(nested, level3LinksList);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Distinguish rows based on cell count and content
  const menuItems = children.filter((row) => row.children.length === 4);
  const multiLinkItems = children.filter((row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('ul'));
  const bannerItems = children.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  const level3BannerItems = children.filter((row) => row.children.length === 5);
  const level3LinkItems = children.filter((row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('a')); // Ensure it's not a multi-link item

  const root = document.createElement('section');
  root.classList.add('burger-navigation', 'grid-container', 'js-burger-navigation');
  root.setAttribute('aria-label', 'Burger Navigation Section');

  const navWrapper = document.createElement('nav');
  navWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav', 'burger-nav');
  root.append(navWrapper);

  const persistentNav = document.createElement('ul');
  persistentNav.classList.add('persistent-navigation', 'grid-x');
  navWrapper.append(persistentNav);

  const persistentNavListItem = document.createElement('li');
  persistentNavListItem.classList.add('persistent-navigation--list');
  persistentNav.append(persistentNavListItem);

  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('persistent-navigation--menu-wrapper', 'burger-nav');
  menuWrapper.id = 'burger-nav-wrapper';
  menuWrapper.setAttribute('aria-labelledby', 'burger-nav');
  persistentNavListItem.append(menuWrapper);

  const level2Div = document.createElement('div');
  level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');
  menuWrapper.append(level2Div);

  const level2ItemsDiv = document.createElement('div');
  level2ItemsDiv.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');
  level2Div.append(level2ItemsDiv);

  const level2CloseDiv = document.createElement('div');
  level2CloseDiv.classList.add('persistent-nav--level2--close', 'hide-for-large');
  level2ItemsDiv.append(level2CloseDiv);

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

  const level2List = document.createElement('ul');
  level2List.classList.add('persistent-nav--level2-list', 'burger-nav');
  level2List.setAttribute('aria-labelledby', 'persistent-nav--level2--title--');
  level2ItemsDiv.append(level2List);

  menuItems.forEach((row, index) => {
    const [labelCell, linkCell, isButtonCell, hierarchyTreeCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');
    moveInstrumentation(row, listItem);

    const labelText = labelCell.textContent.trim();
    const linkHref = linkCell.querySelector('a')?.href;
    const isButton = isButtonCell.textContent.trim() === 'true';
    const hierarchyTree = hierarchyTreeCell.querySelector('ul');

    if (hierarchyTree) {
      const level3Wrapper = document.createElement('div');
      level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
      level3Wrapper.id = `level-burger-nav-${index + 1}`;

      const level3Div = document.createElement('div');
      level3Div.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav');
      level3Div.setAttribute('role', 'list');
      level3Wrapper.append(level3Div);

      const level3CloseDiv = document.createElement('div');
      level3CloseDiv.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
      level3CloseDiv.setAttribute('role', 'listitem');
      level3Div.append(level3CloseDiv);

      const backButton = document.createElement('button');
      backButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
      backButton.setAttribute('aria-label', 'Back to previous navigation');
      backButton.innerHTML = `
        <svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      `;
      level3CloseDiv.append(backButton);

      const controlTitle = document.createElement('span');
      controlTitle.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
      level3CloseDiv.append(controlTitle);

      const closeButtonLevel3 = document.createElement('button');
      closeButtonLevel3.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
      closeButtonLevel3.setAttribute('aria-label', 'Close navigation');
      closeButtonLevel3.innerHTML = `
        <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
        </svg>
      `;
      level3CloseDiv.append(closeButtonLevel3);

      const level3Title = document.createElement('p');
      level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
      level3Title.setAttribute('role', 'listitem');
      level3Title.textContent = labelText;
      level3Div.append(level3Title);

      const level3ListDiv = document.createElement('div');
      level3ListDiv.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
      level3ListDiv.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`;
      level3Div.append(level3ListDiv);

      // Create a temporary div to hold the hierarchyTree content for instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from the original cell

      transformNestedLists(tempDiv.querySelector('ul'), level3ListDiv);

      const level2Link = document.createElement('button');
      level2Link.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
      level2Link.setAttribute('aria-expanded', 'false');
      level2Link.setAttribute('aria-controls', `persistentNavLevel3List-burger-nav-wrapper-burger-${index + 1}`);
      level2Link.setAttribute('aria-label', '');
      level2Link.textContent = labelText;

      level2Link.addEventListener('click', () => {
        level3Wrapper.classList.toggle('active');
      });

      backButton.addEventListener('click', () => {
        level3Wrapper.classList.remove('active');
      });

      listItem.append(level2Link);
      listItem.append(level3Wrapper);
    } else if (isButton) {
      const multipleLinksDiv = document.createElement('div');
      multipleLinksDiv.classList.add('multipleLinks');
      listItem.append(multipleLinksDiv);

      multiLinkItems.forEach((multiLinkRow) => {
        const [multiLabelCell, multiLinkCell] = [...multiLinkRow.children];
        const multiLabel = multiLabelCell.textContent.trim();
        const multiLink = multiLinkCell.querySelector('a')?.href;

        const link = document.createElement('a');
        link.href = multiLink;
        link.textContent = multiLabel;
        link.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
        link.setAttribute('aria-label', multiLabel);
        multipleLinksDiv.append(link);
        moveInstrumentation(multiLinkRow, link);

        const separator = document.createElement('span');
        separator.classList.add('multipleLinks--seperator');
        multipleLinksDiv.append(separator);
      });
    } else {
      const link = document.createElement('a');
      link.href = linkHref;
      link.textContent = labelText;
      link.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
      link.setAttribute('aria-label', '');
      listItem.append(link);
    }
    level2List.append(listItem);
  });

  const level2BannerDiv = document.createElement('div');
  level2BannerDiv.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level2-banner', 'show-for-large');
  level2Div.append(level2BannerDiv);

  bannerItems.forEach((row) => {
    const [bannerImageCell, headlineCell] = [...row.children];

    const picture = bannerImageCell.querySelector('picture');
    if (picture) {
      const optimizedPic = createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]);
      optimizedPic.classList.add('persistent-nav--level2-banner-picture', 'burger-nav');
      level2BannerDiv.append(optimizedPic);
      moveInstrumentation(row, optimizedPic.querySelector('img'));
    }

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('persistent-nav--level2-banner--info', 'burger-nav');
    level2BannerDiv.append(infoDiv);

    const headline = document.createElement('p');
    headline.classList.add('headline-h4');
    headline.textContent = headlineCell.textContent.trim();
    infoDiv.append(headline);
    moveInstrumentation(row, headline); // Move instrumentation for banner row
  });

  block.replaceChildren(root);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img.closest('picture'), optimizedPic.querySelector('img')); // Move instrumentation from original picture
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Level 3 banners and links
  menuItems.forEach((row, index) => {
    // Corrected index for hierarchyTreeCell in menuItems (it's the 4th cell, index 3)
    const [, , , hierarchyTreeCell] = [...row.children];
    const hierarchyTree = hierarchyTreeCell.querySelector('ul');

    if (!hierarchyTree) {
      const level3Wrapper = block.querySelector(`#level-burger-nav-${index + 1}`);
      if (level3Wrapper) {
        level3BannerItems.forEach((bannerRow) => {
          const [bannerImageCell, headlineCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...bannerRow.children];

          const level3BannerDiv = document.createElement('div');
          level3BannerDiv.classList.add('cell', 'small-12', 'large-12', 'full-width', 'persistent-nav--level3', 'burger-nav');
          level3BannerDiv.setAttribute('role', 'listitem');
          level3Wrapper.querySelector('.persistent-nav--level3').append(level3BannerDiv);
          moveInstrumentation(bannerRow, level3BannerDiv);

          const picture = bannerImageCell.querySelector('picture');
          if (picture) {
            const optimizedPic = createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]);
            optimizedPic.classList.add('persistent-nav--level3-banner-picture');
            level3BannerDiv.append(optimizedPic);
            moveInstrumentation(bannerImageCell, optimizedPic.querySelector('img')); // Move instrumentation for banner image cell
          }

          const bannerDescDiv = document.createElement('div');
          bannerDescDiv.classList.add('persistent-nav--level3-banner-desc', 'grid-x', 'align-middle', 'full-width');
          level3BannerDiv.append(bannerDescDiv);

          const headline = document.createElement('div');
          headline.classList.add('bodyLargeBold');
          headline.textContent = headlineCell.textContent.trim();
          bannerDescDiv.append(headline);
          moveInstrumentation(headlineCell, headline); // Move instrumentation for headline cell

          const description = document.createElement('div');
          description.classList.add('bodySmallRegular');
          description.innerHTML = descriptionCell.innerHTML;
          bannerDescDiv.append(description);
          moveInstrumentation(descriptionCell, description); // Move instrumentation for description cell

          const ctaLink = document.createElement('a');
          ctaLink.href = ctaLinkCell.querySelector('a')?.href || '#';
          ctaLink.textContent = ctaLabelCell.textContent.trim();
          ctaLink.classList.add('labelMediumRegular', 'persistent-nav--level3-banner-desc-link');
          bannerDescDiv.append(ctaLink);
          moveInstrumentation(ctaLinkCell, ctaLink); // Move instrumentation for ctaLink cell
          moveInstrumentation(ctaLabelCell, ctaLink); // Move instrumentation for ctaLabel cell
        });

        level3LinkItems.forEach((linkRow) => {
          const [labelCell, linkCell] = [...linkRow.children];

          const listItem = document.createElement('div');
          listItem.classList.add('persistent-nav--level3-list-item');
          listItem.setAttribute('role', 'listitem');
          level3Wrapper.querySelector('.persistent-nav--level3-list').append(listItem);
          moveInstrumentation(linkRow, listItem);

          const link = document.createElement('a');
          link.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
          link.href = linkCell.querySelector('a')?.href || '#';
          link.setAttribute('aria-label', labelCell.textContent.trim());
          link.setAttribute('title', labelCell.textContent.trim());
          listItem.append(link);
          moveInstrumentation(linkCell, link); // Move instrumentation for link cell

          const span = document.createElement('span');
          span.classList.add('persistent-nav--level3-title', 'no-icon');
          span.textContent = labelCell.textContent.trim();
          link.append(span);
          moveInstrumentation(labelCell, span); // Move instrumentation for label cell
        });
      }
    }
  });
}
