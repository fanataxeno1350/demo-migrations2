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
      subWrap.classList.add('has-sub-child'); // This class is not in original HTML, but seems to be for JS functionality
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in original HTML, but seems to be for JS functionality
          subWrap.classList.toggle('active'); // This class is not in original HTML, but seems to be for JS functionality
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Destructure root rows based on BlockJson model
  const [
    logoRow,
    logoLinkRow,
    fssaiLogoRow,
    footerLinksRow,
    footerMenuRow,
    grievanceTitleRow,
    grievanceNameRow,
    grievanceContactRow,
    grievanceHoursRow,
    copyrightRow,
    ...itemRows
  ] = children;

  const footerLinkItems = itemRows.filter((row) => row.children.length === 2);
  const footerSocialItems = itemRows.filter((row) => row.children.length === 3);

  const footerSection = document.createElement('footer');
  // The outer block div already has 'itc-footer-section' from AEM.
  // footerSection.classList.add('itc-footer-section'); // Removed to prevent double padding/CSS

  const container = document.createElement('div');
  container.classList.add('container');
  footerSection.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  // Column 1: Logos
  const col1 = document.createElement('div');
  col1.classList.add('col-lg-6', 'col-sm-12', 'd-flex', 'd-lg-block', 'justify-content-center');
  row.append(col1);

  const footerLogos = document.createElement('div');
  footerLogos.classList.add('footer-logos');
  col1.append(footerLogos);

  const footerItcLogo = document.createElement('div');
  footerItcLogo.classList.add('footer-itc-logo');
  footerLogos.append(footerItcLogo);

  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logo', 'image');
  footerItcLogo.append(itcLogoDiv);

  const itcLogoPicture = logoRow.querySelector('picture');
  if (itcLogoPicture) {
    const itcLogoLink = document.createElement('a');
    itcLogoLink.classList.add('cmp-image__link');
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) itcLogoLink.href = foundLink.href;
    const itcLogoImg = itcLogoPicture.querySelector('img');
    if (itcLogoImg) {
      const optimizedPic = createOptimizedPicture(itcLogoImg.src, itcLogoImg.alt, false, [{ width: '93' }]);
      moveInstrumentation(itcLogoImg, optimizedPic.querySelector('img'));
      itcLogoLink.append(optimizedPic);
    }
    moveInstrumentation(logoRow, itcLogoLink); // Instrumentation for the original row
    itcLogoDiv.append(itcLogoLink);
  }

  const footerFssaiLogo = document.createElement('div');
  footerFssaiLogo.classList.add('footer-fssai-logo');
  footerLogos.append(footerFssaiLogo);

  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('fssailogo', 'logo', 'image');
  footerFssaiLogo.append(fssaiLogoDiv);

  const fssaiLogoPicture = fssaiLogoRow.querySelector('picture');
  if (fssaiLogoPicture) {
    const fssaiLogoImg = fssaiLogoPicture.querySelector('img');
    if (fssaiLogoImg) {
      const optimizedPic = createOptimizedPicture(fssaiLogoImg.src, fssaiLogoImg.alt, false, [{ width: '192' }]);
      moveInstrumentation(fssaiLogoImg, optimizedPic.querySelector('img'));
      fssaiLogoDiv.append(optimizedPic);
    }
    moveInstrumentation(fssaiLogoRow, fssaiLogoDiv); // Instrumentation for the original row
  }

  // Column 2: Footer Links and Grievance
  const col2 = document.createElement('div');
  col2.classList.add('col-lg-6', 'col-sm-12', 'itc-footer-link-left');
  row.append(col2);

  const footerListsContainer = document.createElement('div');
  footerListsContainer.classList.add('footer-lists-container', 'd-flex');
  col2.append(footerListsContainer);

  const list4 = document.createElement('div');
  list4.classList.add('list-4', 'list');
  footerListsContainer.append(list4);

  // Handle footerLinks (richtext)
  const footerLinksContent = footerLinksRow.children[0]?.innerHTML || '';
  if (footerLinksContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = footerLinksContent;
    const footerLinksUl = tempDiv.querySelector('ul');
    if (footerLinksUl) {
      list4.append(footerLinksUl);
      moveInstrumentation(footerLinksRow, footerLinksUl);
    } else {
      // Fallback if it's not a UL directly, e.g., just a P
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.innerHTML = footerLinksContent; // Use innerHTML to preserve any formatting
      ul.append(li);
      list4.append(ul);
      moveInstrumentation(footerLinksRow, ul);
    }
  }

  const list3 = document.createElement('div');
  list3.classList.add('list-3', 'list');
  footerListsContainer.append(list3);

  // Handle footerMenu (richtext)
  const footerMenuContent = footerMenuRow.children[0]?.innerHTML || '';
  if (footerMenuContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = footerMenuContent;
    const footerMenuUl = tempDiv.querySelector('ul');
    if (footerMenuUl) {
      list3.append(footerMenuUl);
      moveInstrumentation(footerMenuRow, footerMenuUl);
    } else {
      // Fallback if it's not a UL directly, e.g., just a P
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      li.innerHTML = footerMenuContent; // Use innerHTML to preserve any formatting
      ul.append(li);
      list3.append(ul);
      moveInstrumentation(footerMenuRow, ul);
    }
  }

  footerLinkItems.forEach((rowEl) => {
    // FIXED: Replaced direct bracket access with array destructuring for fixed-schema item rows
    const [labelCell, linkCell] = [...rowEl.children];

    const li = document.createElement('li');
    li.classList.add('cmp-list__item'); // Added class from original HTML
    const anchor = document.createElement('a');
    anchor.classList.add('cmp-list__item-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    const span = document.createElement('span');
    span.classList.add('cmp-list__item-title');
    span.textContent = labelCell.textContent.trim();
    anchor.append(span);
    li.append(anchor);

    moveInstrumentation(rowEl, li);
    // Ensure list3 has a UL to append to, create if not present
    let targetUl = list3.querySelector('ul');
    if (!targetUl) {
      targetUl = document.createElement('ul');
      targetUl.classList.add('cmp-list'); // Added class from original HTML
      list3.append(targetUl);
    }
    targetUl.append(li);
  });

  const contactDetails = document.createElement('div');
  contactDetails.classList.add('contact-details');
  col2.append(contactDetails);

  const grievanceTitle = document.createElement('h5');
  grievanceTitle.classList.add('contact-details__title', 'mb-md-3', 'mb-0');
  grievanceTitle.textContent = grievanceTitleRow.children[0]?.textContent.trim() || ''; // Access content from first cell
  moveInstrumentation(grievanceTitleRow, grievanceTitle);
  contactDetails.append(grievanceTitle);

  const grievanceName = document.createElement('p');
  grievanceName.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  grievanceName.textContent = grievanceNameRow.children[0]?.textContent.trim() || ''; // Access content from first cell
  moveInstrumentation(grievanceNameRow, grievanceName);
  contactDetails.append(grievanceName);

  const grievanceContact = document.createElement('p');
  grievanceContact.classList.add('contact-details__description', 'mb-md-1', 'mb-0');
  grievanceContact.textContent = grievanceContactRow.children[0]?.textContent.trim() || ''; // Access content from first cell
  moveInstrumentation(grievanceContactRow, grievanceContact);
  contactDetails.append(grievanceContact);

  const grievanceHours = document.createElement('p');
  grievanceHours.classList.add('contact-details__description', 'mb-0');
  grievanceHours.textContent = grievanceHoursRow.children[0]?.textContent.trim() || ''; // Access content from first cell
  moveInstrumentation(grievanceHoursRow, grievanceHours);
  contactDetails.append(grievanceHours);

  // Column 3: Social Links and Copyright
  const col3 = document.createElement('div');
  col3.classList.add('col-lg-6', 'col-sm-12', 'align-items-md-end', 'd-flex', 'flex-column', 'itc-footer-link-right');
  row.append(col3);

  const socialLinksDiv = document.createElement('div');
  col3.append(socialLinksDiv);

  footerSocialItems.forEach((rowEl) => {
    // FIXED: Replaced direct bracket access with array destructuring for fixed-schema item rows
    const [iconCell, socialLinkCell, hierarchyTreeCell] = [...rowEl.children];

    const ul = document.createElement('ul');
    ul.classList.add('list-unstyled');
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.id = 'socialIcons';
    const foundLink = socialLinkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.target = '_blank';

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      if (iconImg) {
        const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: 'auto' }]);
        moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    anchor.append(screenReaderSpan);

    li.append(anchor);
    ul.append(li);
    socialLinksDiv.append(ul);
    moveInstrumentation(rowEl, ul); // Instrumentation for the original row

    // Handle hierarchy-tree (richtext)
    const hierarchyContent = hierarchyTreeCell?.innerHTML || '';
    if (hierarchyContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyContent;
      const subList = tempDiv.querySelector('ul');
      if (subList) {
        transformNestedLists(subList);
        // Move instrumentation from the original cell to the new subList
        moveInstrumentation(hierarchyTreeCell, subList);
        li.append(subList);
      }
    }
  });

  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-link');
  copyrightSpan.textContent = copyrightRow.children[0]?.textContent.trim() || ''; // Access content from first cell
  moveInstrumentation(copyrightRow, copyrightSpan);
  col3.append(copyrightSpan);

  block.replaceChildren(footerSection);

  // Optimize all images within the footer
  footerSection.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
