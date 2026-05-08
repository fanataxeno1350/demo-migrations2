import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from ORIGINAL HTML to nested list elements
    li.classList.add('cmp-list__item');
    if (anchor) {
      anchor.classList.add('cmp-list__item-link');
      // If the anchor is directly inside li, and it's not a dropdown trigger,
      // it might need a span for text content if it's a simple link.
      // However, for hierarchy-tree, the anchor is the trigger or a direct link.
    }

    if (!anchor) {
      // If there's no anchor, create a span for the text content to act as a trigger
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        span.classList.add('cmp-list__item-title'); // Add class for non-link titles
      }
    }

    if (nested) {
      nested.remove(); // Remove to re-append in a wrapper
      nested.classList.add('cmp-list'); // Add class to the nested ul
      nested.querySelectorAll('li').forEach(nestedLi => nestedLi.classList.add('cmp-list__item'));
      nested.querySelectorAll('a').forEach(nestedA => nestedA.classList.add('cmp-list__item-link'));

      const subWrap = document.createElement('div');
      subWrap.classList.add('has-footer-sub-child'); // Class from original HTML
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
    mainLogoRow,
    mainLogoLinkRow,
    fssaiLogoRow,
    grievanceTitleRow,
    grievanceNameRow,
    grievanceContactRow,
    grievanceHoursRow,
    copyrightRow,
    ...itemRows
  ] = children;

  const footerLinkItems = [];
  const footerSocialItems = [];

  itemRows.forEach((row) => {
    if (row.children.length === 3) {
      footerLinkItems.push(row);
    } else if (row.children.length === 2) {
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

  // Main Logo
  const footerItcLogo = document.createElement('div');
  footerItcLogo.classList.add('footer-itc-logo');
  footerLogos.append(footerItcLogo);

  const mainLogoDiv = document.createElement('div');
  mainLogoDiv.classList.add('logo', 'image');
  footerItcLogo.append(mainLogoDiv);

  const mainLogoPicture = mainLogoRow?.querySelector('picture');
  const mainLogoLink = mainLogoLinkRow?.querySelector('a')?.href;

  if (mainLogoPicture) {
    const mainLogoAnchor = document.createElement('a');
    mainLogoAnchor.classList.add('cmp-image__link');
    if (mainLogoLink) mainLogoAnchor.href = mainLogoLink;
    moveInstrumentation(mainLogoLinkRow, mainLogoAnchor);
    mainLogoAnchor.append(mainLogoPicture);
    mainLogoDiv.append(mainLogoAnchor);
    moveInstrumentation(mainLogoRow, mainLogoPicture);
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
    fssaiLogoDiv.append(fssaiPicture);
    moveInstrumentation(fssaiLogoRow, fssaiPicture);
  }

  // Footer Links and Grievance Details
  const footerLinkLeftCol = document.createElement('div');
  footerLinkLeftCol.classList.add('col-lg-6', 'col-sm-12', 'itc-footer-link-left');
  row.append(footerLinkLeftCol);

  const footerListsContainer = document.createElement('div');
  footerListsContainer.classList.add('footer-lists-container', 'd-flex');
  footerLinkLeftCol.append(footerListsContainer);

  const list1 = document.createElement('div');
  list1.classList.add('list-1', 'list');
  footerListsContainer.append(list1);

  const list2 = document.createElement('div');
  list2.classList.add('list-2', 'list');
  footerListsContainer.append(list2);

  const list3 = document.createElement('div');
  list3.classList.add('list-3', 'list');
  footerListsContainer.append(list3);

  const list4 = document.createElement('div');
  list4.classList.add('list-4', 'list');
  footerListsContainer.append(list4);

  const lists = [list1, list2, list3, list4];
  let listIndex = 0;

  footerLinkItems.forEach((itemRow) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...itemRow.children];
    
    const li = document.createElement('li');
    li.classList.add('cmp-list__item'); // Add class from original HTML
    moveInstrumentation(itemRow, li);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      const anchor = document.createElement('a');
      anchor.href = '#'; // Placeholder for dropdown trigger
      anchor.textContent = labelCell?.textContent.trim() || '';
      anchor.classList.add('cmp-list__item-link');
      li.append(anchor);

      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation for the nested UL
      transformNestedLists(subList); // Apply transformations and event listeners
      li.append(subList);
    } else {
      const anchor = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell?.textContent.trim() || '';
      anchor.classList.add('cmp-list__item-link');
      li.append(anchor);
    }

    let targetList = lists[listIndex % lists.length];
    let ul = targetList.querySelector('ul');
    if (!ul) {
      ul = document.createElement('ul');
      ul.classList.add('cmp-list'); // Add class from original HTML
      targetList.append(ul);
    }
    ul.append(li);
    listIndex += 1;
  });

  // Grievance Details
  const contactDetails = document.createElement('div');
  contactDetails.classList.add('contact-details');
  footerLinkLeftCol.append(contactDetails);

  const grievanceTitle = document.createElement('h5');
  grievanceTitle.classList.add('contact-details__title', 'mb-md-3', 'mb-0');
  grievanceTitle.textContent = grievanceTitleRow?.textContent.trim() || '';
  moveInstrumentation(grievanceTitleRow, grievanceTitle);
  contactDetails.append(grievanceTitle);

  const grievanceName = document.createElement('p');
  grievanceName.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  grievanceName.textContent = grievanceNameRow?.textContent.trim() || '';
  moveInstrumentation(grievanceNameRow, grievanceName);
  contactDetails.append(grievanceName);

  const grievanceContact = document.createElement('p');
  grievanceContact.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  grievanceContact.textContent = grievanceContactRow?.textContent.trim() || '';
  moveInstrumentation(grievanceContactRow, grievanceContact);
  contactDetails.append(grievanceContact);

  const grievanceHours = document.createElement('p');
  grievanceHours.classList.add('contact-details__description', 'mb-0');
  grievanceHours.textContent = grievanceHoursRow?.textContent.trim() || '';
  moveInstrumentation(grievanceHoursRow, grievanceHours);
  contactDetails.append(grievanceHours);

  // Right column for social links and copyright
  const footerLinkRightCol = document.createElement('div');
  footerLinkRightCol.classList.add('col-lg-6', 'col-sm-12', 'align-items-md-end', 'd-flex', 'flex-column', 'itc-footer-link-right');
  row.append(footerLinkRightCol);

  const socialLinksWrapper = document.createElement('div');
  footerLinkRightCol.append(socialLinksWrapper);

  const socialUl = document.createElement('ul'); // Create UL once for all social items
  socialUl.classList.add('list-unstyled');
  socialLinksWrapper.append(socialUl);

  footerSocialItems.forEach((itemRow) => {
    const [iconCell, linkCell] = [...itemRow.children];
    const iconPicture = iconCell?.querySelector('picture');
    const socialLink = linkCell?.querySelector('a')?.href;

    if (iconPicture && socialLink) {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.id = 'socialIcons'; // This ID might need to be unique if there are multiple social links
      anchor.href = socialLink;
      anchor.target = '_blank';
      anchor.append(iconPicture);
      li.append(anchor);
      socialUl.append(li); // Append to the single UL
      moveInstrumentation(itemRow, li);
    }
  });

  // Copyright
  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-link');
  copyrightSpan.textContent = copyrightRow?.textContent.trim() || '';
  moveInstrumentation(copyrightRow, copyrightSpan);
  footerLinkRightCol.append(copyrightSpan);

  block.replaceChildren(footerSection);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
