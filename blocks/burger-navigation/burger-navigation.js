import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
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
      subWrap.classList.add('has-sub-child'); // use ORIGINAL HTML class
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

  const [
    bannerImageDesktopRow,
    bannerImageTabletRow,
    bannerImageMobileRow,
    bannerHeadlineRow,
    ...itemRows
  ] = children;

  const root = document.createElement('section');
  root.classList.add('burger-navigation', 'grid-container', 'js-burger-navigation');
  root.setAttribute('aria-label', 'Burger Navigation Section');

  const navWrapper = document.createElement('nav');
  navWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav', 'burger-nav');

  const persistentNav = document.createElement('ul');
  persistentNav.classList.add('persistent-navigation', 'grid-x');

  const navListItem = document.createElement('li');
  navListItem.classList.add('persistent-navigation--list');

  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('persistent-navigation--menu-wrapper', 'burger-nav');
  menuWrapper.id = 'burger-nav-wrapper';
  menuWrapper.setAttribute('aria-labelledby', 'burger-nav');

  const level2Div = document.createElement('div');
  level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');

  const level2Items = document.createElement('div');
  level2Items.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');

  const level2Close = document.createElement('div');
  level2Close.classList.add('persistent-nav--level2--close', 'hide-for-large');

  const prevControl = document.createElement('div');
  prevControl.classList.add('persistent-nav--control-prev', 'persistent-nav--control');
  level2Close.append(prevControl);

  const closeButton = document.createElement('button');
  closeButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
  closeButton.setAttribute('aria-label', 'Close navigation');
  closeButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
    </svg>
  `;
  level2Close.append(closeButton);
  level2Items.append(level2Close);

  const level2List = document.createElement('ul');
  level2List.classList.add('persistent-nav--level2-list', 'burger-nav');

  // Filter itemRows into their respective types based on cell count and content
  // These filters should be defined before they are used in the loop below.
  const level2NavItems = itemRows.filter((row) => row.children.length === 5); // multipleLinks, singleLink, singleLinkLabel, buttonLabel, hierarchy-tree
  const level3MultipleLinkItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('div:nth-child(2) a') && row.querySelector('div:nth-child(4) a'));
  const level3BannerItems = itemRows.filter((row) => row.children.length === 7 && row.querySelector('div:nth-child(1) picture'));
  const level3SimpleLinkItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('div:nth-child(1) a'));

  level2NavItems.forEach((row, i) => {
    const [
      multipleLinksCell,
      singleLinkCell,
      singleLinkLabelCell,
      buttonLabelCell,
      hierarchyTreeCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');
    moveInstrumentation(row, listItem);

    const multipleLinksContent = multipleLinksCell?.innerHTML.trim();
    const singleLink = singleLinkCell?.querySelector('a');
    const singleLinkLabel = singleLinkLabelCell?.textContent.trim();
    const buttonLabel = buttonLabelCell?.textContent.trim();
    const hierarchyTree = hierarchyTreeCell?.querySelector('ul');

    if (multipleLinksContent && multipleLinksContent !== '<p>Multiple Links (Login/Register) text content</p>') {
      const multipleLinksDiv = document.createElement('div');
      multipleLinksDiv.classList.add('multipleLinks');
      multipleLinksDiv.innerHTML = multipleLinksContent;
      listItem.append(multipleLinksDiv);
    } else if (singleLink && singleLinkLabel) {
      const anchor = document.createElement('a');
      anchor.href = singleLink.href;
      anchor.textContent = singleLinkLabel;
      anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
      if (!hierarchyTree) {
        anchor.classList.add('no-submenu');
      }
      listItem.append(anchor);
    } else if (buttonLabel) {
      const button = document.createElement('button');
      button.textContent = buttonLabel;
      button.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', `persistentNavLevel3List-burger-nav-wrapper-burger-${i + 1}`);
      listItem.append(button);
    }

    const level3Wrapper = document.createElement('div');
    level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
    level3Wrapper.id = `level-burger-nav-${i + 1}`;

    const level3Div = document.createElement('div');
    level3Div.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav');
    level3Div.setAttribute('role', 'list');

    const level3Close = document.createElement('div');
    level3Close.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
    level3Close.setAttribute('role', 'listitem');

    const backButton = document.createElement('button');
    backButton.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
    backButton.setAttribute('aria-label', 'Back to previous navigation');
    backButton.innerHTML = `
      <svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
    level3Close.append(backButton);

    const controlTitle = document.createElement('span');
    controlTitle.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
    controlTitle.textContent = singleLinkLabel || buttonLabel || '';
    level3Close.append(controlTitle);

    const level3CloseButton = document.createElement('button');
    level3CloseButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
    level3CloseButton.setAttribute('aria-label', 'Close navigation');
    level3CloseButton.innerHTML = `
      <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
      </svg>
    `;
    level3Close.append(level3CloseButton);
    level3Div.append(level3Close);

    const level3Title = document.createElement('p');
    level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
    level3Title.setAttribute('role', 'listitem');
    level3Title.textContent = singleLinkLabel || buttonLabel || '';
    level3Div.append(level3Title);

    if (hierarchyTree) {
      const level3List = document.createElement('div');
      level3List.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
      level3List.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${i + 1}`;
      transformNestedLists(hierarchyTree);
      level3List.append(hierarchyTree);
      level3Div.append(level3List);
    } else if (level3MultipleLinkItems.length > 0) {
      const level3List = document.createElement('div');
      level3List.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
      level3List.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${i + 1}`;
      level3MultipleLinkItems.forEach((linkRow) => {
        const [link1Cell, link1LabelCell, link2Cell, link2LabelCell] = [...linkRow.children];

        const multipleLinksDiv = document.createElement('div');
        multipleLinksDiv.classList.add('multipleLinks');
        moveInstrumentation(linkRow, multipleLinksDiv);

        const link1 = link1Cell?.querySelector('a');
        const link1Label = link1LabelCell?.textContent.trim();
        if (link1 && link1Label) {
          const anchor1 = document.createElement('a');
          anchor1.href = link1.href;
          anchor1.textContent = link1Label;
          anchor1.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
          multipleLinksDiv.append(anchor1);
        }

        const link2 = link2Cell?.querySelector('a');
        const link2Label = link2LabelCell?.textContent.trim();
        if (link2 && link2Label) {
          const separator = document.createElement('span');
          separator.classList.add('multipleLinks--seperator');
          multipleLinksDiv.append(separator);
          const anchor2 = document.createElement('a');
          anchor2.href = link2.href;
          anchor2.textContent = link2Label;
          anchor2.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
          multipleLinksDiv.append(anchor2);
        }
        level3List.append(multipleLinksDiv);
      });
      level3Div.append(level3List);
    } else if (level3BannerItems.length > 0) {
      level3Div.classList.add('full-width');
      level3Div.dataset.fullBanner = '1';

      level3BannerItems.forEach((bannerRow) => {
        const [
          desktopImgCell,
          tabletImgCell,
          mobileImgCell,
          headlineCell,
          descriptionCell,
          ctaLinkCell,
          ctaLabelCell,
        ] = [...bannerRow.children];

        const bannerItemDiv = document.createElement('div');
        bannerItemDiv.classList.add('cell', 'small-12', 'large-12', 'full-width', 'persistent-nav--level3', 'burger-nav');
        bannerItemDiv.setAttribute('role', 'listitem');
        moveInstrumentation(bannerRow, bannerItemDiv);

        const picture = document.createElement('picture');
        picture.classList.add('persistent-nav--level3-banner-picture');

        const desktopPic = desktopImgCell?.querySelector('picture');
        const tabletPic = tabletImgCell?.querySelector('picture');
        const mobilePic = mobileImgCell?.querySelector('picture');

        if (desktopPic) {
          const source = document.createElement('source');
          source.media = '(min-width: 1440px)';
          source.srcset = desktopPic.querySelector('img').src;
          picture.append(source);
        }
        if (tabletPic) {
          const source = document.createElement('source');
          source.media = '(min-width: 1024px)';
          source.srcset = tabletPic.querySelector('img').src;
          picture.append(source);
        }
        if (mobilePic) {
          const source = document.createElement('source');
          source.media = '(min-width: 768px)';
          source.srcset = mobilePic.querySelector('img').src;
          picture.append(source);
        }

        const img = document.createElement('img');
        img.classList.add('persistent-nav--level3-banner-img', 'show-for-large', 'lazyload');
        img.src = desktopPic?.querySelector('img')?.src || tabletPic?.querySelector('img')?.src || mobilePic?.querySelector('img')?.src || '';
        img.alt = desktopPic?.querySelector('img')?.alt || '';
        picture.append(img);
        bannerItemDiv.append(picture);

        const bannerDesc = document.createElement('div');
        bannerDesc.classList.add('persistent-nav--level3-banner-desc', 'grid-x', 'align-middle', 'full-width');

        const headline = document.createElement('div');
        headline.classList.add('bodyLargeBold');
        headline.textContent = headlineCell?.textContent.trim() || '';
        bannerDesc.append(headline);

        const description = document.createElement('div');
        description.classList.add('bodySmallRegular');
        description.innerHTML = descriptionCell?.innerHTML || ''; // Corrected to use innerHTML for richtext
        bannerDesc.append(description);

        const ctaLink = ctaLinkCell?.querySelector('a');
        const ctaLabel = ctaLabelCell?.textContent.trim();
        if (ctaLink && ctaLabel) {
          const anchor = document.createElement('a');
          anchor.href = ctaLink.href;
          anchor.textContent = ctaLabel;
          anchor.classList.add('labelMediumRegular', 'persistent-nav--level3-banner-desc-link');
          bannerDesc.append(anchor);
        }
        bannerItemDiv.append(bannerDesc);
        level3Div.append(bannerItemDiv);
      });
    } else if (level3SimpleLinkItems.length > 0) {
      const level3List = document.createElement('div');
      level3List.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
      level3List.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${i + 1}`;
      level3SimpleLinkItems.forEach((linkRow) => {
        const [linkCell, linkLabelCell] = [...linkRow.children];
        const link = linkCell?.querySelector('a');
        const linkLabel = linkLabelCell?.textContent.trim();

        if (link && linkLabel) {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('persistent-nav--level3-list-item');
          itemDiv.setAttribute('role', 'listitem');
          moveInstrumentation(linkRow, itemDiv);

          const anchor = document.createElement('a');
          anchor.classList.add('persistent-nav--level3-link', 'grid-x', 'align-left', 'align-middle');
          anchor.href = link.href;
          anchor.setAttribute('aria-label', linkLabel);
          anchor.setAttribute('title', linkLabel);

          const span = document.createElement('span');
          span.classList.add('persistent-nav--level3-title', 'no-icon');
          span.textContent = linkLabel;
          anchor.append(span);
          itemDiv.append(anchor);
          level3List.append(itemDiv);
        }
      });
      level3Div.append(level3List);
    }

    level3Wrapper.append(level3Div);
    listItem.append(level3Wrapper);
    level2List.append(listItem);
  });

  level2Items.append(level2List);
  level2Div.append(level2Items);

  const level2Banner = document.createElement('div');
  level2Banner.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level2-banner', 'show-for-large');

  const bannerPicture = document.createElement('picture');
  bannerPicture.classList.add('persistent-nav--level2-banner-picture', 'burger-nav');

  const desktopPic = bannerImageDesktopRow?.querySelector('picture');
  const tabletPic = bannerImageTabletRow?.querySelector('picture');
  const mobilePic = bannerImageMobileRow?.querySelector('picture');

  if (desktopPic) {
    const source = document.createElement('source');
    source.media = '(min-width: 1440px)';
    source.srcset = desktopPic.querySelector('img').src;
    bannerPicture.append(source);
  }
  if (tabletPic) {
    const source = document.createElement('source');
    source.media = '(min-width: 1024px)';
    source.srcset = tabletPic.querySelector('img').src;
    bannerPicture.append(source);
  }
  if (mobilePic) {
    const source = document.createElement('source');
    source.media = '(min-width: 768px)';
    source.srcset = mobilePic.querySelector('img').src;
    bannerPicture.append(source);
  }

  const bannerImg = document.createElement('img');
  bannerImg.classList.add('persistent-nav--level2-banner-img', 'lazyload');
  bannerImg.src = desktopPic?.querySelector('img')?.src || tabletPic?.querySelector('img')?.src || mobilePic?.querySelector('img')?.src || '';
  bannerImg.alt = desktopPic?.querySelector('img')?.alt || '';
  bannerPicture.append(bannerImg);
  level2Banner.append(bannerPicture);

  const bannerInfo = document.createElement('div');
  bannerInfo.classList.add('persistent-nav--level2-banner--info', 'burger-nav');

  const bannerHeadline = document.createElement('p');
  bannerHeadline.classList.add('headline-h4');
  bannerHeadline.textContent = bannerHeadlineRow?.textContent.trim() || '';
  bannerInfo.append(bannerHeadline);
  level2Banner.append(bannerInfo);

  level2Div.append(level2Banner);
  menuWrapper.append(level2Div);
  navListItem.append(menuWrapper);
  persistentNav.append(navListItem);
  navWrapper.append(persistentNav);
  root.append(navWrapper);

  block.replaceChildren(root);

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
