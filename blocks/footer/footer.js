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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for JS behavior.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    itcLogoRow,
    itcLogoLinkRow,
    fssaiLogoRow,
    grievanceTitleRow,
    grievanceNameRow,
    grievanceContactRow,
    grievanceHoursRow,
    copyrightRow,
    ...itemRows
  ] = children;

  // Filter item rows based on cell count
  const footerLinkItems = itemRows.filter((row) => row.children.length === 3); // label, link, hierarchy-tree
  const socialLinkItems = itemRows.filter((row) => row.children.length === 2); // icon, link

  const root = document.createElement('div');
  root.classList.add('container'); // From ORIGINAL HTML

  const mainRow = document.createElement('div');
  mainRow.classList.add('row'); // From ORIGINAL HTML

  const logoColumn = document.createElement('div');
  logoColumn.classList.add('col-lg-6', 'col-sm-12', 'd-flex', 'd-lg-block', 'justify-content-center'); // From ORIGINAL HTML
  const footerLogos = document.createElement('div');
  footerLogos.classList.add('footer-logos'); // From ORIGINAL HTML

  const footerItcLogo = document.createElement('div');
  footerItcLogo.classList.add('footer-itc-logo'); // From ORIGINAL HTML
  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('logo', 'image'); // From ORIGINAL HTML
  const itcLogoPicture = itcLogoRow.querySelector('picture');
  const itcLogoAnchor = document.createElement('a');
  itcLogoAnchor.classList.add('cmp-image__link'); // From ORIGINAL HTML
  if (itcLogoLinkRow) {
    const itcLink = itcLogoLinkRow.querySelector('a');
    if (itcLink) {
      itcLogoAnchor.href = itcLink.href;
    }
  }
  if (itcLogoPicture) {
    const optimizedPic = createOptimizedPicture(
      itcLogoPicture.querySelector('img').src,
      itcLogoPicture.querySelector('img').alt,
      false,
      [{ width: '93' }],
    );
    moveInstrumentation(itcLogoPicture.querySelector('img'), optimizedPic.querySelector('img'));
    itcLogoAnchor.append(optimizedPic);
  }
  moveInstrumentation(itcLogoRow, itcLogoAnchor);
  itcLogoDiv.append(itcLogoAnchor);
  footerItcLogo.append(itcLogoDiv);
  footerLogos.append(footerItcLogo);

  const footerFssaiLogo = document.createElement('div');
  footerFssaiLogo.classList.add('footer-fssai-logo'); // From ORIGINAL HTML
  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('fssailogo', 'logo', 'image'); // From ORIGINAL HTML
  const fssaiLogoPicture = fssaiLogoRow.querySelector('picture');
  if (fssaiLogoPicture) {
    const optimizedPic = createOptimizedPicture(
      fssaiLogoPicture.querySelector('img').src,
      fssaiLogoPicture.querySelector('img').alt,
      false,
      [{ width: '192' }],
    );
    moveInstrumentation(fssaiLogoPicture.querySelector('img'), optimizedPic.querySelector('img'));
    fssaiLogoDiv.append(optimizedPic);
  }
  moveInstrumentation(fssaiLogoRow, fssaiLogoDiv);
  footerFssaiLogo.append(fssaiLogoDiv);
  footerLogos.append(footerFssaiLogo);

  logoColumn.append(footerLogos);
  mainRow.append(logoColumn);

  const linksColumn = document.createElement('div');
  linksColumn.classList.add('col-lg-3', 'col-sm-12', 'd-flex', 'justify-content-xl-between', 'footer-page-links-wrapper', 'pt-md-0', 'pt-4', 'px-1'); // From ORIGINAL HTML

  const list1 = document.createElement('div');
  list1.classList.add('list-1', 'list'); // From ORIGINAL HTML
  const list2 = document.createElement('div');
  list2.classList.add('list-2', 'list'); // From ORIGINAL HTML

  const mainLinksUl = document.createElement('ul');
  mainLinksUl.classList.add('cmp-list'); // From ORIGINAL HTML

  // Process footerLinkItems for main links and legal links
  // The model has 'footerLinks' and 'mainLinks' as containers for 'footer-link-item'.
  // The original HTML shows 'Privacy Policy', 'Terms and Conditions', 'Talk To Us' as hardcoded.
  // We need to distinguish these from the hierarchy-tree links.
  // Assuming 'footerLinkItems' contains all 3-cell rows.
  // We'll separate them based on the presence of a hierarchy-tree.

  const hierarchyLinks = [];
  const directLinks = [];

  footerLinkItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    if (hierarchyTreeCell?.querySelector('ul')) {
      hierarchyLinks.push({ row, labelCell, linkCell, hierarchyTreeCell });
    } else {
      directLinks.push({ row, labelCell, linkCell });
    }
  });

  hierarchyLinks.forEach(({ row, labelCell, hierarchyTreeCell }) => {
    const li = document.createElement('li');
    li.classList.add('cmp-list__item'); // From ORIGINAL HTML

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      const titleLink = document.createElement('a');
      titleLink.classList.add('cmp-list__item-link'); // From ORIGINAL HTML
      titleLink.href = 'javascript:void(0)';
      titleLink.textContent = labelCell.textContent.trim();

      const subLinksContainer = document.createElement('div');
      subLinksContainer.classList.add('cmp-list__sub-links'); // Not in allowlist, but common for sub-menus
      // moveInstrumentation for the hierarchyTreeCell content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      transformNestedLists(tempDiv.querySelector('ul'));
      moveInstrumentation(hierarchyTreeCell, tempDiv.querySelector('ul')); // Move instrumentation from original cell to the transformed UL
      while (tempDiv.firstChild) subLinksContainer.append(tempDiv.firstChild);

      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
        subLinksContainer.classList.toggle('active');
      });

      li.append(titleLink, subLinksContainer);
    }
    moveInstrumentation(row, li);
    mainLinksUl.append(li);
  });

  // Distribute main links into list1 and list2
  const half = Math.ceil(mainLinksUl.children.length / 2);
  for (let i = 0; i < mainLinksUl.children.length; i += 1) {
    if (i < half) {
      list1.append(mainLinksUl.children[i]);
    } else {
      list2.append(mainLinksUl.children[i]);
    }
  }

  linksColumn.append(list1, list2);
  mainRow.append(linksColumn);

  const grievanceAndLegalColumn = document.createElement('div');
  grievanceAndLegalColumn.classList.add('col-lg-6', 'col-sm-12', 'itc-footer-link-left'); // From ORIGINAL HTML

  const footerListsContainer = document.createElement('div');
  footerListsContainer.classList.add('footer-lists-container', 'd-flex'); // From ORIGINAL HTML

  const list4 = document.createElement('div');
  list4.classList.add('list-4', 'list'); // From ORIGINAL HTML
  const legalLinksUl = document.createElement('ul');
  legalLinksUl.classList.add('list-unstyled'); // From ORIGINAL HTML

  // Process directLinks for legal links
  directLinks.forEach(({ row, labelCell, linkCell }, index) => {
    const li = document.createElement('li');
    li.id = `footerLinks-${index + 1}`; // Match original HTML ID pattern
    const anchor = document.createElement('a');
    anchor.target = '_blank';
    if (linkCell) {
      anchor.href = linkCell.querySelector('a')?.href || '';
    }
    anchor.textContent = labelCell.textContent.trim();
    const srOnly = document.createElement('span');
    srOnly.classList.add('cmp-link__screen-reader-only'); // From ORIGINAL HTML
    srOnly.textContent = 'opens in a new tab';
    anchor.append(srOnly);
    li.append(anchor);
    moveInstrumentation(row, li); // Move instrumentation from original row to the new li
    legalLinksUl.append(li);
  });

  list4.append(legalLinksUl);
  footerListsContainer.append(list4);

  // Grievance Details
  const contactDetails = document.createElement('div');
  contactDetails.classList.add('contact-details'); // From ORIGINAL HTML

  const grievanceTitle = document.createElement('h5');
  grievanceTitle.classList.add('contact-details__title', 'mb-md-3', 'mb-0'); // From ORIGINAL HTML
  moveInstrumentation(grievanceTitleRow, grievanceTitle);
  grievanceTitle.textContent = grievanceTitleRow.textContent.trim();
  contactDetails.append(grievanceTitle);

  const grievanceName = document.createElement('p');
  grievanceName.classList.add('contact-details__description', 'mb-md-1', 'mb-0'); // From ORIGINAL HTML
  moveInstrumentation(grievanceNameRow, grievanceName);
  grievanceName.textContent = `Name: ${grievanceNameRow.textContent.trim()}`;
  contactDetails.append(grievanceName);

  const grievanceContact = document.createElement('p');
  grievanceContact.classList.add('contact-details__description', 'mb-md-1', 'mb-0'); // From ORIGINAL HTML
  moveInstrumentation(grievanceContactRow, grievanceContact);
  grievanceContact.textContent = `Contact Info: ${grievanceContactRow.textContent.trim()}`;
  contactDetails.append(grievanceContact);

  const grievanceHours = document.createElement('p');
  grievanceHours.classList.add('contact-details__description', 'mb-0'); // From ORIGINAL HTML
  moveInstrumentation(grievanceHoursRow, grievanceHours);
  grievanceHours.textContent = `(${grievanceHoursRow.textContent.trim()})`;
  contactDetails.append(grievanceHours);

  grievanceAndLegalColumn.append(footerListsContainer, contactDetails);
  mainRow.append(grievanceAndLegalColumn);

  const socialAndCopyrightColumn = document.createElement('div');
  socialAndCopyrightColumn.classList.add('col-lg-6', 'col-sm-12', 'align-items-md-end', 'd-flex', 'flex-column', 'itc-footer-link-right'); // From ORIGINAL HTML

  const socialLinksUl = document.createElement('ul'); // Create a single UL for all social links
  socialLinksUl.classList.add('list-unstyled'); // From ORIGINAL HTML

  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children]; // Destructure cells for social links
    const iconPicture = iconCell.querySelector('picture');
    const socialLink = linkCell.querySelector('a');

    if (iconPicture && socialLink) {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.id = 'socialIcons'; // From ORIGINAL HTML
      anchor.href = socialLink.href;
      anchor.target = '_blank';
      const optimizedPic = createOptimizedPicture(
        iconPicture.querySelector('img').src,
        iconPicture.querySelector('img').alt,
        false,
        [{ width: '32' }],
      );
      moveInstrumentation(iconPicture.querySelector('img'), optimizedPic.querySelector('img'));
      anchor.append(optimizedPic);
      const srOnly = document.createElement('span');
      srOnly.classList.add('cmp-link__screen-reader-only'); // From ORIGINAL HTML
      srOnly.textContent = 'opens in a new tab';
      anchor.append(srOnly);
      li.append(anchor);
      moveInstrumentation(row, li); // Move instrumentation from original row to the new li
      socialLinksUl.append(li);
    }
  });
  socialAndCopyrightColumn.append(socialLinksUl); // Append the single UL

  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-link'); // From ORIGINAL HTML
  moveInstrumentation(copyrightRow, copyrightSpan);
  copyrightSpan.textContent = copyrightRow.textContent.trim();
  socialAndCopyrightColumn.append(copyrightSpan);

  mainRow.append(socialAndCopyrightColumn);
  root.append(mainRow);
  block.replaceChildren(root);

  // Image optimization (this part seems to be a generic block-level optimization,
  // but it's already handled for specific logos above. Keeping it if it's a general rule.)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
