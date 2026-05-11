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

  // Root fields - fixed schema
  const contactAddressRow = children[0];
  const contactFaxRow = children[1];
  const designedByTextRow = children[2];
  const designedByLinkRow = children[3];

  const itemRows = children.slice(4);

  const footerSectionItems = [];
  const footerLinkItems = [];
  const footerSocialItems = [];
  const contactPhoneLinkItems = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // footer-section-item: 4 cells, last cell has a UL (hierarchy-tree)
    if (cells.length === 4 && cells[3].querySelector('ul')) {
      footerSectionItems.push(row);
    }
    // footer-link-item (contactPhoneLinks): 2 cells, first cell has an A (link)
    else if (cells.length === 2 && cells[0].querySelector('a')) {
      contactPhoneLinkItems.push(row);
    }
    // footer-link-item (footerLinks): 2 cells, first cell has NO A (label)
    else if (cells.length === 2 && !cells[0].querySelector('a')) {
      footerLinkItems.push(row);
    }
    // footer-social-item: 1 cell, first cell has an A (socialLink)
    else if (cells.length === 1 && cells[0].querySelector('a')) {
      footerSocialItems.push(row);
    }
  });

  const container = document.createElement('div');
  container.classList.add('container');

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');

  const rowInner = document.createElement('div');
  rowInner.classList.add('row');

  footerSectionItems.forEach((row) => {
    // footer-section-item: [title, link, sectionLinks, hierarchy-tree]
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];
    const col = document.createElement('div');
    col.classList.add('col-md-3');

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, h4);
    col.append(h4);

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      transformNestedLists(subList);
      moveInstrumentation(hierarchyTreeCell, subList);
      col.append(subList);
    } else {
      // Fallback for sectionLinks if hierarchy-tree is empty or not a ul
      const sectionLinksContent = document.createElement('div'); // Use div for richtext
      sectionLinksContent.innerHTML = sectionLinksCell?.innerHTML || '';
      moveInstrumentation(sectionLinksCell, sectionLinksContent);
      col.append(sectionLinksContent);
    }
    moveInstrumentation(row, col);
    rowInner.append(col);
  });

  colMd7.append(rowInner);
  mainRow.append(colMd7);

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');

  const contactRow = document.createElement('div');
  contactRow.classList.add('row');

  const contactCol = document.createElement('div');
  contactCol.classList.add('col-md-6');
  contactCol.id = 'contact-footer';

  const contactH4 = document.createElement('h4');
  contactH4.textContent = 'Contact Us'; // Hardcoded, but from original HTML
  contactCol.append(contactH4);

  const contactAddressP = document.createElement('p'); // Use p as per original HTML
  contactAddressP.innerHTML = contactAddressRow.children[0]?.innerHTML || ''; // richtext
  moveInstrumentation(contactAddressRow, contactAddressP);
  contactCol.append(contactAddressP);

  const telNoUl = document.createElement('ul');
  telNoUl.classList.add('tel-no');

  contactPhoneLinkItems.forEach((row) => {
    // footer-link-item: [label, link]
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const label = labelCell.textContent.trim();
    const link = linkCell.querySelector('a');
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = label;
      li.append(a);
      moveInstrumentation(linkCell, a);
    } else {
      li.textContent = label;
    }
    moveInstrumentation(row, li);
    telNoUl.append(li);
  });

  const faxLi = document.createElement('li');
  // contactFax is type=text, so textContent is correct
  faxLi.textContent = `Fax: ${contactFaxRow.children[0]?.textContent.trim() || ''}`;
  moveInstrumentation(contactFaxRow, faxLi);
  telNoUl.append(faxLi);
  contactCol.append(telNoUl);
  contactRow.append(contactCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6');

  const socialInfoDiv = document.createElement('div');
  socialInfoDiv.classList.add('social-info');

  const followUsH4 = document.createElement('h4');
  followUsH4.textContent = 'Follow Us'; // Hardcoded, but from original HTML
  socialInfoDiv.append(followUsH4);

  const socialUl = document.createElement('ul');

  footerSocialItems.forEach((row) => {
    // footer-social-item: [socialLink]
    const [socialLinkCell] = [...row.children];
    const link = socialLinkCell.querySelector('a');
    if (link) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href;
      a.target = '_blank';

      // Determine social media type for icon and aria-label
      let socialClass = '';
      let iconClass = '';
      let ariaLabel = '';
      if (link.href.includes('facebook.com')) {
        socialClass = 'fb';
        iconClass = 'fab fa-facebook-f';
        ariaLabel = 'facebook';
      } else if (link.href.includes('twitter.com')) {
        socialClass = 'twit';
        iconClass = 'fab fa-twitter';
        ariaLabel = 'twitter';
      } else if (link.href.includes('youtube.com')) {
        socialClass = 'you-t';
        iconClass = 'fab fa-youtube';
        ariaLabel = 'youtube';
      } else if (link.href.includes('instagram.com')) {
        socialClass = 'insta';
        iconClass = 'fab fa-instagram';
        ariaLabel = 'instagram';
      } else if (link.href.includes('linkedin.com')) {
        socialClass = 'linked';
        iconClass = 'fab fa-linkedin-in';
        ariaLabel = 'linkedin-in';
      }

      if (socialClass) {
        li.classList.add(socialClass);
        a.setAttribute('aria-label', ariaLabel);
        const i = document.createElement('i');
        i.classList.add(...iconClass.split(' '));
        i.setAttribute('aria-hidden', 'true');
        a.append(i);
        li.append(a);
        moveInstrumentation(socialLinkCell, li);
        socialUl.append(li);
      }
    }
  });
  socialInfoDiv.append(socialUl);
  socialCol.append(socialInfoDiv);

  const designedByP = document.createElement('p');
  // designedByText is type=text, so textContent is correct
  const designedByText = designedByTextRow.children[0]?.textContent.trim() || '';
  // designedByLink is type=aem-content, so querySelector('a') is correct
  const designedByLink = designedByLinkRow.children[0]?.querySelector('a');

  if (designedByLink) {
    const a = document.createElement('a');
    a.href = designedByLink.href;
    a.target = '_blank';
    a.textContent = designedByLink.textContent.trim(); // textContent for the link label is correct here
    designedByP.innerHTML = `${designedByText} &amp; Developed by `;
    designedByP.append(a);
    moveInstrumentation(designedByLinkRow, a); // Instrument the link itself
  } else {
    designedByP.textContent = designedByText;
  }
  moveInstrumentation(designedByTextRow, designedByP); // Instrument the text row
  socialCol.append(designedByP);

  contactRow.append(socialCol);
  colMd5.append(contactRow);
  mainRow.append(colMd5);
  container.append(mainRow);

  block.replaceChildren(container);
}
