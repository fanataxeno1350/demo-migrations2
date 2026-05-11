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
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, but is a functional class for the nested list behavior. Keep.
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in ORIGINAL HTML, but is a functional class for the nested list behavior. Keep.
          subWrap.classList.toggle('active'); // This class is not in ORIGINAL HTML, but is a functional class for the nested list behavior. Keep.
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root-level rows with fixed schema, read by index destructuring
  const [
    contactInfoRow,
    telephoneLabelRow,
    telephoneLinkRow,
    faxLabelRow,
    faxNumberRow,
    designerAttributionRow,
    ...itemRows
  ] = children;

  const footerSectionItemRows = [];
  const footerLinkItemRows = []; // Not used in current HTML, but kept for future expansion if model changes
  const footerSocialItemRows = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // footer-section-item: 4 cells, first is text, second is link, fourth is ul
    if (cells.length === 4 && cells[0].textContent.trim() && cells[1].querySelector('a') && cells[3].querySelector('ul')) {
      footerSectionItemRows.push(row);
    }
    // footer-link-item: 2 cells, first is text, second is link
    else if (cells.length === 2 && cells[0].textContent.trim() && cells[1].querySelector('a')) {
      footerLinkItemRows.push(row);
    }
    // footer-social-item: 1 cell, contains a link
    else if (cells.length === 1 && cells[0].querySelector('a')) {
      footerSocialItemRows.push(row);
    }
  });

  const root = document.createElement('div');
  root.classList.add('container');

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');

  const innerRow = document.createElement('div');
  innerRow.classList.add('row');

  footerSectionItemRows.forEach((row) => {
    // Fixed schema for footer-section-item, use destructuring
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];
    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    colMd3.append(h4);

    // moveInstrumentation for the row before processing its children
    moveInstrumentation(row, colMd3);

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      // Apply classes from ORIGINAL HTML to nested list elements
      subList.classList.add('nav-menu'); // Example class, if present in original HTML for top-level UL
      subList.querySelectorAll('li').forEach(li => li.classList.add('nav-menu-item')); // Example class
      subList.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link')); // Example class
      transformNestedLists(subList);
      colMd3.append(subList);
    } else {
      // Fallback if no hierarchy-tree UL is found, create a simple link list
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = titleCell.textContent.trim();
      li.append(anchor);
      ul.append(li);
      colMd3.append(ul);
    }
    innerRow.append(colMd3);
  });
  colMd7.append(innerRow);

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');

  const contactSocialRow = document.createElement('div');
  contactSocialRow.classList.add('row');

  const contactCol = document.createElement('div');
  contactCol.classList.add('col-md-6');
  contactCol.id = 'contact-footer';

  const contactH4 = document.createElement('h4');
  contactH4.textContent = 'Contact Us'; // Hardcoded as per ORIGINAL HTML
  contactCol.append(contactH4);

  const contactInfoDiv = document.createElement('div');
  moveInstrumentation(contactInfoRow, contactInfoDiv);
  // contactInfo is richtext, use innerHTML
  contactInfoDiv.innerHTML = contactInfoRow.children[0]?.innerHTML || '';
  contactCol.append(contactInfoDiv);

  const telNoUl = document.createElement('ul');
  telNoUl.classList.add('tel-no');

  const telLi = document.createElement('li');
  // telephoneLabel is text, use textContent
  telLi.textContent = `${telephoneLabelRow.children[0]?.textContent.trim()}: `;
  const telLink = document.createElement('a');
  const foundTelLink = telephoneLinkRow.children[0]?.querySelector('a'); // telephoneLink is aem-content
  if (foundTelLink) telLink.href = foundTelLink.href;
  // telephoneLink is aem-content, but the textContent is also needed for the label
  telLink.textContent = telephoneLinkRow.children[0]?.textContent.trim();
  telLi.append(telLink);
  telNoUl.append(telLi);
  moveInstrumentation(telephoneLinkRow, telLink); // moveInstrumentation for the row, applied to the link

  const faxLi = document.createElement('li');
  // faxLabel and faxNumber are text, use textContent
  faxLi.textContent = `${faxLabelRow.children[0]?.textContent.trim()}: ${faxNumberRow.children[0]?.textContent.trim()}`;
  telNoUl.append(faxLi);
  moveInstrumentation(faxNumberRow, faxLi); // moveInstrumentation for the row, applied to the li

  contactCol.append(telNoUl);
  contactSocialRow.append(contactCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6');

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info');

  const socialH4 = document.createElement('h4');
  socialH4.textContent = 'Follow Us'; // Hardcoded as per ORIGINAL HTML
  socialInfo.append(socialH4);

  const socialUl = document.createElement('ul');
  footerSocialItemRows.forEach((row) => {
    // Fixed schema for footer-social-item, use destructuring
    const [socialLinkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundSocialLink = socialLinkCell.querySelector('a'); // socialLink is aem-content
    if (foundSocialLink) anchor.href = foundSocialLink.href;
    anchor.target = '_blank';
    anchor.ariaLabel = 'social link';

    const i = document.createElement('i');
    if (anchor.href.includes('facebook')) {
      li.classList.add('fb');
      i.classList.add('fab', 'fa-facebook-f');
    } else if (anchor.href.includes('twitter')) {
      li.classList.add('twit');
      i.classList.add('fab', 'fa-twitter');
    } else if (anchor.href.includes('youtube')) {
      li.classList.add('you-t');
      i.classList.add('fab', 'fa-youtube');
    } else if (anchor.href.includes('instagram')) {
      li.classList.add('insta');
      i.classList.add('fab', 'fa-instagram');
    } else if (anchor.href.includes('linkedin')) {
      li.classList.add('linked');
      i.classList.add('fab', 'fa-linkedin-in');
    }
    anchor.append(i);
    li.append(anchor);
    moveInstrumentation(row, li);
    socialUl.append(li);
  });
  socialInfo.append(socialUl);
  socialCol.append(socialInfo);

  const designerP = document.createElement('p');
  moveInstrumentation(designerAttributionRow, designerP);
  // designerAttribution is richtext, use innerHTML
  designerP.innerHTML = designerAttributionRow.children[0]?.innerHTML || '';
  socialCol.append(designerP);

  contactSocialRow.append(socialCol);
  colMd5.append(contactSocialRow);

  mainRow.append(colMd7, colMd5);
  root.append(mainRow);

  // Move instrumentation for the root-level rows that were not processed in loops
  moveInstrumentation(contactInfoRow, contactCol);
  moveInstrumentation(telephoneLabelRow, telNoUl);
  moveInstrumentation(faxLabelRow, telNoUl);
  moveInstrumentation(designerAttributionRow, socialCol);


  block.replaceChildren(root);
}
