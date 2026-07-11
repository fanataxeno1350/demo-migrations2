import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, originalCell) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Apply classes from original HTML to nested elements
    li.classList.add('cmp-new-footer__nav-item'); // Assuming this is the class for list items

    if (anchor) {
      anchor.classList.add('cmp-new-footer__nav-link'); // Assuming this is the class for links
    }

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        span.classList.add('cmp-new-footer__nav-link'); // Apply class to span if no anchor
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-footer-sub-child'); // Class from original HTML if applicable
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

  // Apply moveInstrumentation to all nested anchors and list items
  rootUl.querySelectorAll('a').forEach((a) => {
    moveInstrumentation(originalCell, a);
  });
  rootUl.querySelectorAll('li').forEach((li) => {
    moveInstrumentation(originalCell, li);
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // The container rows for 'footerLinks' and 'socialLinks' are not actual content rows
  // and should not be destructured as separate rows. They are represented by the itemRows.
  const [
    logoItcRow,
    logoItcLinkRow,
    logoFssaiRow,
    topBackgroundImageRow,
    // footerLinksContainerRow, // This is a container, not a content row
    itcPortalLabelRow,
    itcPortalLinkRow,
    copyrightTextRow,
    // socialLinksContainerRow, // This is a container, not a content row
    ...itemRows
  ] = children;

  const root = document.createElement('div');
  root.classList.add('cmp-new-footer');

  // Top Content Section
  const topContent = document.createElement('div');
  topContent.classList.add('cmp-new-footer__top-content');
  if (topBackgroundImageRow) {
    const bgImageUrl = topBackgroundImageRow.textContent.trim();
    if (bgImageUrl) {
      topContent.style.backgroundImage = `url("${bgImageUrl}")`;
      moveInstrumentation(topBackgroundImageRow, topContent);
    }
  }

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('cmp-image', 'cmp-new-footer__logo');

  if (logoItcRow && logoItcLinkRow) {
    const itcLink = logoItcLinkRow.querySelector('a');
    const itcPicture = logoItcRow.querySelector('picture');
    if (itcPicture) {
      const itcAnchor = document.createElement('a');
      itcAnchor.classList.add('cmp-image__link');
      if (itcLink) {
        itcAnchor.href = itcLink.href;
      }
      const itcImg = itcPicture.querySelector('img');
      if (itcImg) {
        const optimizedPic = createOptimizedPicture(itcImg.src, itcImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(itcImg, optimizedPic.querySelector('img'));
        itcAnchor.append(optimizedPic);
        itcAnchor.querySelector('img').classList.add('cmp-image__image_df_itc');
      }
      moveInstrumentation(logoItcRow, itcAnchor);
      moveInstrumentation(logoItcLinkRow, itcAnchor);
      logoWrapper.append(itcAnchor);
    }
  }

  if (logoFssaiRow) {
    const fssaiPicture = logoFssaiRow.querySelector('picture');
    if (fssaiPicture) {
      const fssaiImg = fssaiPicture.querySelector('img');
      if (fssaiImg) {
        const optimizedPic = createOptimizedPicture(fssaiImg.src, fssaiImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(fssaiImg, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('cmp-image__image_df_fssai');
        moveInstrumentation(logoFssaiRow, optimizedPic);
        logoWrapper.append(optimizedPic);
      }
    }
  }

  topContent.append(logoWrapper);

  const nav = document.createElement('div');
  nav.classList.add('cmp-new-footer__nav');
  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-new-footer__nav-group');

  // Filter itemRows based on cell count as per BlockJson model
  const footerLinkItems = itemRows.filter((row) => row.children.length === 3);
  const socialLinkItems = itemRows.filter((row) => row.children.length === 2);

  footerLinkItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-new-footer__nav-item');

    const subList = hierarchyTreeCell?.querySelector('ul');
    const directLink = linkCell?.querySelector('a');

    if (subList) {
      const trigger = document.createElement('a');
      trigger.classList.add('cmp-new-footer__nav-link');
      trigger.href = 'javascript:void(0)'; // Use javascript:void(0) for triggers
      trigger.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(labelCell, trigger);

      const subLinksCvr = document.createElement('div');
      subLinksCvr.classList.add('cmp-new-footer__nav-sub-group'); // Add class if from original HTML
      // Move instrumentation for the hierarchy tree cell
      moveInstrumentation(hierarchyTreeCell, subLinksCvr);
      subLinksCvr.append(subList);
      transformNestedLists(subList, hierarchyTreeCell); // Pass originalCell for instrumentation

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        subLinksCvr.classList.toggle('active');
      });

      li.append(trigger, subLinksCvr);
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-new-footer__nav-link');
      if (directLink) {
        anchor.href = directLink.href;
      }
      anchor.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(labelCell, anchor); // Instrument label cell to anchor
      moveInstrumentation(linkCell, anchor); // Instrument link cell to anchor
      li.append(anchor);
    }
    moveInstrumentation(row, li); // Instrument the whole row to the list item
    navGroup.append(li);
  });

  nav.append(navGroup);
  topContent.append(nav);
  root.append(topContent);

  // Bottom Content Section
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-new-footer__bottom-content');

  const container = document.createElement('div');
  container.classList.add('cmp-new-footer__container');

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-new-footer__ITC-Titles');

  if (itcPortalLabelRow && itcPortalLinkRow) {
    const itcPortalAnchor = document.createElement('a');
    itcPortalAnchor.classList.add('desc-1');
    const itcPortalLink = itcPortalLinkRow.querySelector('a');
    if (itcPortalLink) {
      itcPortalAnchor.href = itcPortalLink.href;
    }
    itcPortalAnchor.textContent = itcPortalLabelRow.textContent.trim();
    moveInstrumentation(itcPortalLabelRow, itcPortalAnchor);
    moveInstrumentation(itcPortalLinkRow, itcPortalAnchor);
    itcTitles.append(itcPortalAnchor);
  }

  if (copyrightTextRow) {
    const copyright = document.createElement('a'); // Changed to <a> as per original HTML
    copyright.classList.add('desc-1');
    copyright.textContent = copyrightTextRow.textContent.trim();
    moveInstrumentation(copyrightTextRow, copyright);
    itcTitles.append(copyright);
  }

  container.append(itcTitles);

  const socialMedia = document.createElement('div');
  socialMedia.classList.add('cmp-new-footer__social-media');

  socialLinkItems.forEach((row) => {
    const [socialKindCell, socialLinkCell] = [...row.children];
    const socialAnchor = document.createElement('a');
    const socialLink = socialLinkCell?.querySelector('a');
    if (socialLink) {
      socialAnchor.href = socialLink.href;
    }
    const socialKind = socialKindCell?.textContent.trim().toLowerCase();
    if (socialKind) {
      socialAnchor.classList.add(`icon-${socialKind}`);
      socialAnchor.dataset.social = socialKind;
    }
    moveInstrumentation(row, socialAnchor); // Instrument the whole row to the anchor
    socialMedia.append(socialAnchor);
  });

  container.append(socialMedia);
  bottomContent.append(container);
  root.append(bottomContent);

  // The original footerLinksContainerRow and socialLinksContainerRow were not content rows
  // but rather placeholders for the item rows. Instrumentation should be on the actual content.
  // If there were specific instrumentation points on these container rows, they would need to be moved
  // to the corresponding generated elements that represent their content.
  // For now, removing these lines as they refer to non-content rows.
  // moveInstrumentation(footerLinksContainerRow, navGroup);
  // moveInstrumentation(socialLinksContainerRow, socialMedia);

  block.replaceChildren(root);
}
