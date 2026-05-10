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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist. Assuming it's a new class for JS behavior.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a new class for JS behavior.
          subWrap.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a new class for JS behavior.
        });
      }
    }
  });
}

export default function decorate(block) {
  const allRows = [...block.children];

  // Fixed-schema root rows (8 of them)
  const [
    itcLogoRow,
    itcLogoLinkRow,
    fssaiLogoRow,
    grievanceTitleRow,
    grievanceNameRow,
    grievanceContactInfoRow,
    grievanceTimingsRow,
    copyrightRow,
    ...itemRows
  ] = allRows;

  // Extract cells from fixed-schema root rows
  const itcLogoCell = itcLogoRow.children[0];
  const itcLogoLinkCell = itcLogoLinkRow.children[0];
  const fssaiLogoCell = fssaiLogoRow.children[0];
  const grievanceTitleCell = grievanceTitleRow.children[0];
  const grievanceNameCell = grievanceNameRow.children[0];
  const grievanceContactInfoCell = grievanceContactInfoRow.children[0];
  const grievanceTimingsCell = grievanceTimingsRow.children[0];
  const copyrightCell = copyrightRow.children[0];

  // Filter item rows based on cell count
  const footerLinkItems = itemRows.filter((row) => row.children.length === 3);
  const footerSocialItems = itemRows.filter((row) => row.children.length === 2);

  const footerSection = document.createElement('footer');
  footerSection.classList.add('itc-footer-section');

  const container = document.createElement('div');
  container.classList.add('container');
  footerSection.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  // Logos Section
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-lg-6', 'col-sm-12', 'd-flex', 'd-lg-block', 'justify-content-center');
  row.append(logoCol);

  const footerLogos = document.createElement('div');
  footerLogos.classList.add('footer-logos');
  logoCol.append(footerLogos);

  const footerItcLogo = document.createElement('div');
  footerItcLogo.classList.add('footer-itc-logo');
  footerLogos.append(footerItcLogo);

  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logo', 'image');
  footerItcLogo.append(itcLogoDiv);

  const itcPictureElement = itcLogoCell?.querySelector('picture');
  if (itcPictureElement) {
    const itcLink = document.createElement('a');
    itcLink.classList.add('cmp-image__link');
    const itcLinkHref = itcLogoLinkCell?.querySelector('a')?.href;
    if (itcLinkHref) {
      itcLink.href = itcLinkHref;
    }
    const itcPicture = itcPictureElement.cloneNode(true);
    itcLink.append(itcPicture);
    moveInstrumentation(itcLogoRow, itcLink);
    moveInstrumentation(itcLogoLinkRow, itcLink);
    itcLogoDiv.append(itcLink);
  }

  const footerFssaiLogo = document.createElement('div');
  footerFssaiLogo.classList.add('footer-fssai-logo');
  footerLogos.append(footerFssaiLogo);

  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('fssailogo', 'logo', 'image');
  footerFssaiLogo.append(fssaiLogoDiv);

  const fssaiPictureElement = fssaiLogoCell?.querySelector('picture');
  if (fssaiPictureElement) {
    const fssaiImg = fssaiPictureElement.cloneNode(true);
    moveInstrumentation(fssaiLogoRow, fssaiImg);
    fssaiLogoDiv.append(fssaiImg);
  }

  // Footer Links Section
  const footerLinksCol = document.createElement('div');
  footerLinksCol.classList.add('col-lg-3', 'col-sm-12', 'd-flex', 'justify-content-xl-between', 'footer-page-links-wrapper', 'pt-md-0', 'pt-4', 'px-1');
  row.append(footerLinksCol);

  const list1 = document.createElement('div');
  list1.classList.add('list-1', 'list');
  footerLinksCol.append(list1);

  const list2 = document.createElement('div');
  list2.classList.add('list-2', 'list');
  footerLinksCol.append(list2);

  const footerListsContainer = document.createElement('div');
  footerListsContainer.classList.add('col-lg-6', 'col-sm-12', 'itc-footer-link-left');
  row.append(footerListsContainer);

  const footerListsWrapper = document.createElement('div');
  footerListsWrapper.classList.add('footer-lists-container', 'd-flex');
  footerListsContainer.append(footerListsWrapper);

  const list4 = document.createElement('div');
  list4.classList.add('list-4', 'list');
  footerListsWrapper.append(list4);

  const list3 = document.createElement('div');
  list3.classList.add('list-3', 'list');
  footerListsWrapper.append(list3);

  let currentList = list4;
  footerLinkItems.forEach((rowItem, index) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...rowItem.children];
    const subListHtml = hierarchyTreeCell?.innerHTML || '';
    const directHref = linkCell?.querySelector('a')?.href;
    const labelText = labelCell?.textContent.trim();

    if (index === Math.ceil(footerLinkItems.length / 2)) {
      currentList = list3;
    }

    const ul = currentList.querySelector('ul') || document.createElement('ul');
    ul.classList.add('cmp-list'); // Add class from original HTML
    if (!currentList.querySelector('ul')) {
      currentList.append(ul);
    }

    const li = document.createElement('li');
    li.classList.add('cmp-list__item'); // Add class from original HTML
    moveInstrumentation(rowItem, li);
    ul.append(li);

    // Create a temporary div to parse the richtext HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = subListHtml;
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      const triggerLink = document.createElement('a');
      triggerLink.classList.add('cmp-list__item-link');
      triggerLink.href = 'javascript:void(0)'; // Placeholder for interactive trigger
      const span = document.createElement('span');
      span.classList.add('cmp-list__item-title');
      span.textContent = labelText;
      triggerLink.append(span);
      li.append(triggerLink);

      // Apply classes and instrumentation to nested elements
      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation from the original cell to the new ul
      subList.querySelectorAll('a').forEach((a) => a.classList.add('cmp-list__item-link'));
      subList.querySelectorAll('li').forEach((nestedLi) => nestedLi.classList.add('cmp-list__item'));
      subList.querySelectorAll('span').forEach((nestedSpan) => nestedSpan.classList.add('cmp-list__item-title'));

      transformNestedLists(subList); // Apply transformations to the nested list
      li.append(subList);

      triggerLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a new class for JS behavior.
        subList.classList.toggle('active'); // This class is not in the allowlist. Assuming it's a new class for JS behavior.
      });
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-list__item-link');
      if (directHref) anchor.href = directHref;
      const span = document.createElement('span');
      span.classList.add('cmp-list__item-title');
      span.textContent = labelText;
      anchor.append(span);
      li.append(anchor);
    }
  });

  // Grievance Details
  const contactDetails = document.createElement('div');
  contactDetails.classList.add('contact-details');
  footerListsContainer.append(contactDetails);

  const grievanceTitle = document.createElement('h5');
  grievanceTitle.classList.add('contact-details__title', 'mb-md-3', 'mb-0');
  moveInstrumentation(grievanceTitleRow, grievanceTitle);
  grievanceTitle.textContent = grievanceTitleCell?.textContent.trim() || '';
  contactDetails.append(grievanceTitle);

  const grievanceName = document.createElement('p');
  grievanceName.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  moveInstrumentation(grievanceNameRow, grievanceName);
  grievanceName.textContent = grievanceNameCell?.textContent.trim() || '';
  contactDetails.append(grievanceName);

  const grievanceContactInfo = document.createElement('p');
  grievanceContactInfo.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  moveInstrumentation(grievanceContactInfoRow, grievanceContactInfo);
  grievanceContactInfo.textContent = grievanceContactInfoCell?.textContent.trim() || '';
  contactDetails.append(grievanceContactInfo);

  const grievanceTimings = document.createElement('p');
  grievanceTimings.classList.add('contact-details__description', 'mb-0');
  moveInstrumentation(grievanceTimingsRow, grievanceTimings);
  grievanceTimings.textContent = grievanceTimingsCell?.textContent.trim() || '';
  contactDetails.append(grievanceTimings);

  // Social Links & Copyright
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-lg-6', 'col-sm-12', 'align-items-md-end', 'd-flex', 'flex-column', 'itc-footer-link-right');
  row.append(socialCol);

  const socialLinksDiv = document.createElement('div');
  socialCol.append(socialLinksDiv);

  footerSocialItems.forEach((rowItem) => {
    const [socialIconCell, socialLinkCell] = [...rowItem.children]; // Destructuring for fixed schema
    const socialIconPicture = socialIconCell?.querySelector('picture');
    const socialLinkAnchor = socialLinkCell?.querySelector('a');

    const ul = document.createElement('ul');
    ul.classList.add('list-unstyled');
    socialLinksDiv.append(ul);

    const li = document.createElement('li');
    moveInstrumentation(rowItem, li);
    ul.append(li);

    const socialAnchor = document.createElement('a');
    socialAnchor.id = 'socialIcons'; // Keep ID if it's from original HTML, but generally avoid IDs in loops
    socialAnchor.target = '_blank';
    if (socialLinkAnchor) {
      socialAnchor.href = socialLinkAnchor.href;
    }
    if (socialIconPicture) {
      const socialIcon = socialIconPicture.cloneNode(true);
      socialAnchor.append(socialIcon);
    }
    li.append(socialAnchor);
  });

  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-link');
  moveInstrumentation(copyrightRow, copyrightSpan);
  copyrightSpan.textContent = copyrightCell?.textContent.trim() || '';
  socialCol.append(copyrightSpan);

  block.replaceChildren(footerSection);

  footerSection.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
