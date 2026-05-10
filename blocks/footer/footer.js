import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('cmp-list__item'); // Add class from ORIGINAL HTML
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      anchor.classList.add('cmp-list__item-link'); // Add class from ORIGINAL HTML
      const span = document.createElement('span');
      span.classList.add('cmp-list__item-title'); // Add class from ORIGINAL HTML
      span.textContent = anchor.textContent.trim();
      anchor.textContent = ''; // Clear anchor text
      anchor.prepend(span); // Wrap text in span
    } else {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.classList.add('cmp-list__item-title'); // Add class from ORIGINAL HTML
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.classList.add('cmp-list'); // Add class from ORIGINAL HTML
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // This class is not in original HTML, but seems to be for JS behavior
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

  const itcLogoRow = children[0];
  const itcLogoLinkRow = children[1];
  const fssaiLogoRow = children[2];
  const grievanceTitleRow = children[3];
  const grievanceNameRow = children[4];
  const grievanceContactRow = children[5];
  const grievanceTimeRow = children[6];
  const copyrightRow = children[7];

  const itemRows = children.slice(8);

  const footerLinkItems = [];
  const footerSocialItems = [];

  itemRows.forEach((row) => {
    // Footer Link Item: label (text), link (aem-content), hierarchy-tree (richtext)
    if (row.children.length === 3) {
      footerLinkItems.push(row);
    }
    // Footer Social Item: socialLink (aem-content), socialIcon (reference)
    else if (row.children.length === 2) {
      footerSocialItems.push(row);
    }
  });

  const footerSection = document.createElement('footer');
  footerSection.classList.add('itc-footer-section');

  const container = document.createElement('div');
  container.classList.add('container');
  footerSection.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  // Left column for logos
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-lg-6', 'col-sm-12', 'd-flex', 'd-lg-block', 'justify-content-center');
  row.append(logoCol);

  const footerLogos = document.createElement('div');
  footerLogos.classList.add('footer-logos');
  logoCol.append(footerLogos);

  // ITC Logo
  const footerItcLogo = document.createElement('div');
  footerItcLogo.classList.add('footer-itc-logo');
  footerLogos.append(footerItcLogo);

  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logo', 'image');
  footerItcLogo.append(itcLogoDiv);

  const itcPicture = itcLogoRow?.querySelector('picture');
  const itcLink = itcLogoLinkRow?.querySelector('a');

  if (itcPicture) {
    const itcImg = itcPicture.querySelector('img');
    const optimizedItcPic = createOptimizedPicture(itcImg.src, itcImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(itcImg, optimizedItcPic.querySelector('img'));

    if (itcLink) {
      const linkEl = document.createElement('a');
      linkEl.classList.add('cmp-image__link');
      linkEl.href = itcLink.href;
      linkEl.append(optimizedItcPic);
      itcLogoDiv.append(linkEl);
    } else {
      itcLogoDiv.append(optimizedItcPic);
    }
    moveInstrumentation(itcLogoRow, itcLogoDiv);
  }

  // FSSAI Logo
  const footerFssaiLogo = document.createElement('div');
  footerFssaiLogo.classList.add('footer-fssai-logo');
  footerLogos.append(footerFssaiLogo);

  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('fssailogo', 'logo', 'image');
  footerFssaiLogo.append(fssaiLogoDiv);

  const fssaiPicture = fssaiLogoRow?.querySelector('picture');
  if (fssaiPicture) {
    const fssaiImg = fssaiPicture.querySelector('img');
    const optimizedFssaiPic = createOptimizedPicture(fssaiImg.src, fssaiImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(fssaiImg, optimizedFssaiPic.querySelector('img'));
    fssaiLogoDiv.append(optimizedFssaiPic);
    moveInstrumentation(fssaiLogoRow, fssaiLogoDiv);
  }

  // Middle column for footer links
  const footerPageLinksWrapper = document.createElement('div');
  footerPageLinksWrapper.classList.add('col-lg-3', 'col-sm-12', 'd-flex', 'justify-content-xl-between', 'footer-page-links-wrapper', 'pt-md-0', 'pt-4', 'px-1');
  row.append(footerPageLinksWrapper);

  const footerListsContainer = document.createElement('div');
  footerListsContainer.classList.add('footer-lists-container', 'd-flex'); // This class is in the rightCol in original HTML, but seems to be intended for this section
  footerPageLinksWrapper.append(footerListsContainer);

  const list1 = document.createElement('div');
  list1.classList.add('list-1', 'list');
  footerListsContainer.append(list1);

  const list2 = document.createElement('div');
  list2.classList.add('list-2', 'list');
  footerListsContainer.append(list2);

  // The original HTML has list-3 and list-4 inside the rightCol, not here.
  // We'll create them in the rightCol as per original HTML.

  let currentListIndex = 0;
  footerLinkItems.forEach((rowItem) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...rowItem.children];
    const directLink = linkCell?.querySelector('a')?.href;
    const labelText = labelCell?.textContent.trim();

    const li = document.createElement('li');
    moveInstrumentation(rowItem, li);

    const tempDiv = document.createElement('div');
    moveInstrumentation(hierarchyTreeCell, tempDiv);
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      const titleLink = document.createElement('a');
      titleLink.href = directLink || 'javascript:void(0)';
      titleLink.textContent = labelText;
      li.append(titleLink);

      transformNestedLists(subList);
      li.append(subList);
    } else {
      const anchor = document.createElement('a');
      if (directLink) anchor.href = directLink;
      anchor.textContent = labelText;
      li.append(anchor);
    }

    const targetListDiv = (currentListIndex % 2 === 0) ? list1 : list2;
    const ul = targetListDiv.querySelector('ul') || document.createElement('ul');
    ul.classList.add('cmp-list'); // Add class from ORIGINAL HTML
    ul.append(li);
    targetListDiv.append(ul);
    currentListIndex += 1;
  });

  // Right column for contact details and social links
  const rightCol = document.createElement('div');
  rightCol.classList.add('col-lg-6', 'col-sm-12', 'itc-footer-link-left'); // itc-footer-link-left is on this col in original HTML
  row.append(rightCol);

  // The original HTML has list-3 and list-4 inside this rightCol, wrapped by footer-lists-container
  const rightColListsContainer = document.createElement('div');
  rightColListsContainer.classList.add('footer-lists-container', 'd-flex');
  rightCol.append(rightColListsContainer);

  const list4 = document.createElement('div');
  list4.classList.add('list-4', 'list');
  rightColListsContainer.append(list4);

  const list3 = document.createElement('div');
  list3.classList.add('list-3', 'list');
  rightColListsContainer.append(list3);

  // Contact Details
  const contactDetails = document.createElement('div');
  contactDetails.classList.add('contact-details');
  rightCol.append(contactDetails);

  const grievanceTitle = document.createElement('h5');
  grievanceTitle.classList.add('contact-details__title', 'mb-md-3', 'mb-0');
  grievanceTitle.textContent = grievanceTitleRow?.children[0]?.textContent.trim() || ''; // Fixed: read from cell, not querySelector('div')
  moveInstrumentation(grievanceTitleRow, grievanceTitle);
  contactDetails.append(grievanceTitle);

  const grievanceName = document.createElement('p');
  grievanceName.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  grievanceName.textContent = grievanceNameRow?.children[0]?.textContent.trim() || ''; // Fixed: read from cell, not querySelector('div')
  moveInstrumentation(grievanceNameRow, grievanceName);
  contactDetails.append(grievanceName);

  const grievanceContact = document.createElement('p');
  grievanceContact.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  grievanceContact.textContent = grievanceContactRow?.children[0]?.textContent.trim() || ''; // Fixed: read from cell, not querySelector('div')
  moveInstrumentation(grievanceContactRow, grievanceContact);
  contactDetails.append(grievanceContact);

  const grievanceTime = document.createElement('p');
  grievanceTime.classList.add('contact-details__description', 'mb-0');
  grievanceTime.textContent = grievanceTimeRow?.children[0]?.textContent.trim() || ''; // Fixed: read from cell, not querySelector('div')
  moveInstrumentation(grievanceTimeRow, grievanceTime);
  contactDetails.append(grievanceTime);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-lg-6', 'col-sm-12', 'align-items-md-end', 'd-flex', 'flex-column', 'itc-footer-link-right');
  row.append(socialCol);

  const socialLinksDiv = document.createElement('div');
  socialCol.append(socialLinksDiv);

  footerSocialItems.forEach((rowItem) => {
    const [socialLinkCell, socialIconCell] = [...rowItem.children];
    const socialLink = socialLinkCell?.querySelector('a');
    const socialPicture = socialIconCell?.querySelector('picture');

    if (socialLink && socialPicture) {
      const ul = socialLinksDiv.querySelector('ul') || document.createElement('ul');
      ul.classList.add('list-unstyled');
      socialLinksDiv.append(ul);

      const li = document.createElement('li');
      moveInstrumentation(rowItem, li);
      ul.append(li);

      const anchor = document.createElement('a');
      anchor.id = 'socialIcons'; // This ID is repeated in original HTML, which is invalid. Keeping for fidelity.
      anchor.href = socialLink.href;
      anchor.target = '_blank';
      anchor.setAttribute('data-cmp-clickable', '');
      li.append(anchor);

      const socialImg = socialPicture.querySelector('img');
      const optimizedSocialPic = createOptimizedPicture(socialImg.src, socialImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(socialImg, optimizedSocialPic.querySelector('img'));
      anchor.append(optimizedSocialPic);

      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      anchor.append(screenReaderSpan);
    }
  });

  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-link');
  copyrightSpan.textContent = copyrightRow?.children[0]?.textContent.trim() || ''; // Fixed: read from cell, not querySelector('div')
  moveInstrumentation(copyrightRow, copyrightSpan);
  socialCol.append(copyrightSpan);

  block.replaceChildren(footerSection);

  // This loop seems to be a generic image optimization, not specific to footer images already handled above.
  // It's applied to the entire block AFTER the block's content has been replaced.
  // This might be a leftover or intended for images not explicitly moved.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
