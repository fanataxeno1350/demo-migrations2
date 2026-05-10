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
  // Destructure root rows based on BlockJson model
  const [
    contactInfoRow,
    telephoneLabelRow,
    telephoneLinkRow,
    faxLabelRow,
    faxNumberRow,
    footerCreditsRow,
    ...itemRows
  ] = [...block.children];

  const footerSectionItemRows = [];
  const footerLinkItemRows = [];
  const footerSocialItemRows = [];

  itemRows.forEach((row) => {
    if (row.children.length === 4) { // footer-section-item has 4 cells
      footerSectionItemRows.push(row);
    } else if (row.children.length === 2) { // footer-link-item has 2 cells
      footerLinkItemRows.push(row);
    } else if (row.children.length === 1 && row.querySelector('a')) { // footer-social-item has 1 cell with an anchor
      footerSocialItemRows.push(row);
    }
  });

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  const mainRow = document.createElement('div');
  mainRow.classList.add('row');

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');
  const colMd7Row = document.createElement('div');
  colMd7Row.classList.add('row');

  footerSectionItemRows.forEach((row) => {
    // Destructure cells for footer-section-item based on its fixed schema
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];

    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, h4);
    colMd3.append(h4);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      const ul = document.createElement('ul');
      // Apply classes from original HTML if any, otherwise default to no classes
      // Original HTML shows <ul> directly inside <div> with no specific classes
      // moveInstrumentation should be on the ul itself
      moveInstrumentation(hierarchyTreeCell, ul);
      // Move children from tempDiv to ul
      while (subList.firstChild) {
        ul.append(subList.firstChild);
      }
      transformNestedLists(ul);
      colMd3.append(ul);
    } else {
      const directLink = linkCell.querySelector('a');
      if (directLink) {
        const ul = document.createElement('ul');
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = directLink.href;
        a.textContent = titleCell.textContent.trim();
        moveInstrumentation(linkCell, a);
        li.append(a);
        ul.append(li);
        colMd3.append(ul);
      }
    }
    moveInstrumentation(row, colMd3);
    colMd7Row.append(colMd3);
  });

  colMd7.append(colMd7Row);
  mainRow.append(colMd7);

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');
  const colMd5Row = document.createElement('div');
  colMd5Row.classList.add('row');

  const contactCol = document.createElement('div');
  contactCol.classList.add('col-md-6');
  contactCol.id = 'contact-footer';

  const contactH4 = document.createElement('h4');
  contactH4.textContent = 'Contact Us'; // Hardcoded, but matches original HTML static text
  contactCol.append(contactH4);

  const contactP = document.createElement('p');
  // contactInfo is richtext, so use innerHTML
  contactP.innerHTML = contactInfoRow.children[0]?.innerHTML || '';
  moveInstrumentation(contactInfoRow, contactP);
  contactCol.append(contactP);

  const telNoUl = document.createElement('ul');
  telNoUl.classList.add('tel-no');

  const telLi = document.createElement('li');
  const telLabel = telephoneLabelRow.children[0]?.textContent.trim();
  const telLink = telephoneLinkRow.children[0]?.querySelector('a'); // Access cell first, then query for 'a'
  if (telLabel && telLink) {
    telLi.textContent = `${telLabel}: `;
    const telAnchor = document.createElement('a');
    telAnchor.href = telLink.href;
    telAnchor.textContent = telLink.textContent.trim(); // Use textContent from the link itself
    moveInstrumentation(telephoneLinkRow, telAnchor);
    telLi.append(telAnchor);
    telNoUl.append(telLi);
  } else if (telLabel) {
    telLi.textContent = telLabel;
    telNoUl.append(telLi);
  }
  moveInstrumentation(telephoneLabelRow, telLi);

  const faxLi = document.createElement('li');
  const faxLabel = faxLabelRow.children[0]?.textContent.trim();
  const faxNumber = faxNumberRow.children[0]?.textContent.trim();
  if (faxLabel && faxNumber) {
    faxLi.textContent = `${faxLabel}: ${faxNumber}`;
  } else if (faxLabel) {
    faxLi.textContent = faxLabel;
  }
  moveInstrumentation(faxLabelRow, faxLi);
  moveInstrumentation(faxNumberRow, faxLi);
  telNoUl.append(faxLi);
  contactCol.append(telNoUl);

  colMd5Row.append(contactCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6');

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info');
  const socialH4 = document.createElement('h4');
  socialH4.textContent = 'Follow Us'; // Hardcoded, but matches original HTML static text
  socialInfo.append(socialH4);

  const socialUl = document.createElement('ul');
  footerSocialItemRows.forEach((row) => {
    // footer-social-item has 1 cell, which contains the socialLink aem-content
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const socialLinkCell = cells.find(cell => cell.querySelector('a'));
    const socialLinkAnchor = socialLinkCell?.querySelector('a');
    if (socialLinkAnchor) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = socialLinkAnchor.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      const icon = document.createElement('i');
      icon.classList.add('fab');
      if (a.href.includes('facebook.com')) {
        li.classList.add('fb');
        icon.classList.add('fa-facebook-f');
        a.setAttribute('aria-label', 'facebook');
      } else if (a.href.includes('twitter.com')) {
        li.classList.add('twit');
        icon.classList.add('fa-twitter');
        a.setAttribute('aria-label', 'twitter');
      } else if (a.href.includes('youtube.com')) {
        li.classList.add('you-t');
        icon.classList.add('fa-youtube');
        a.setAttribute('aria-label', 'youtube');
      } else if (a.href.includes('instagram.com')) {
        li.classList.add('insta');
        icon.classList.add('fa-instagram');
        a.setAttribute('aria-label', 'instagram');
      } else if (a.href.includes('linkedin.com')) {
        li.classList.add('linked');
        icon.classList.add('fa-linkedin-in');
        a.setAttribute('aria-label', 'linkedin-in');
      }
      a.append(icon);
      li.append(a);
      moveInstrumentation(row, li);
      socialUl.append(li);
    }
  });
  socialInfo.append(socialUl);
  socialCol.append(socialInfo);

  const creditsP = document.createElement('p');
  // footerCredits is richtext, so use innerHTML
  creditsP.innerHTML = footerCreditsRow.children[0]?.innerHTML || '';
  moveInstrumentation(footerCreditsRow, creditsP);
  socialCol.append(creditsP);

  colMd5Row.append(socialCol);
  colMd5.append(colMd5Row);
  mainRow.append(colMd5);

  container.append(mainRow);
  footer.append(container);

  block.replaceChildren(footer);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
