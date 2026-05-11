import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('nav-menu-item', 'list-item'); // Add classes from ORIGINAL HTML
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      anchor.classList.add('nav-menu-link'); // Add class from ORIGINAL HTML
    } else {
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
      nested.classList.add('sub-menu'); // Add class from ORIGINAL HTML
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
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

  // Fixed fields - reordered to match BlockJson model
  const contactHeadlineRow = children[0]; // contactHeadline
  const contactAddressRow = children[1]; // contactAddress
  const telephoneLabelRow = children[2]; // telephoneLabel
  const telephoneLinkRow = children[3]; // telephoneLink
  const faxLabelRow = children[4]; // faxLabel
  const faxValueRow = children[5]; // faxValue
  const developerCreditRow = children[6]; // developerCredit

  // Item rows start from index 7
  const itemRows = children.slice(7);

  const footerSections = [];
  const socialLinks = [];
  const legalLinks = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 4 && cells[3].querySelector('ul')) {
      // footer-section-item with hierarchy-tree
      footerSections.push(row);
    } else if (cells.length === 2 && cells[0].textContent.trim() && cells[1].querySelector('a')) {
      // footer-link-item
      legalLinks.push(row);
    } else if (cells.length === 1 && cells[0].querySelector('a')) {
      // footer-social-item
      socialLinks.push(row);
    }
  });

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('container');
  moveInstrumentation(block, footerContainer);

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');
  const innerRow = document.createElement('div');
  innerRow.classList.add('row');
  colMd7.append(innerRow);

  footerSections.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];

    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');
    moveInstrumentation(row, colMd3); // Move instrumentation for the whole row to its container

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, h4);
    colMd3.append(h4);

    const ul = document.createElement('ul');
    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      // Append children from hierarchyUl directly to ul
      while (hierarchyUl.firstChild) {
        ul.append(hierarchyUl.firstChild);
      }
      moveInstrumentation(hierarchyTreeCell, ul); // Move instrumentation from hierarchyTreeCell to ul
    } else {
      // Fallback for sectionLinks or direct link if hierarchy-tree is empty
      const sectionLinksContent = sectionLinksCell?.innerHTML.trim();
      if (sectionLinksContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksContent;
        tempDiv.querySelectorAll('li').forEach(li => li.classList.add('nav-menu-item', 'list-item'));
        tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link'));
        while (tempDiv.firstChild) {
          ul.append(tempDiv.firstChild);
        }
        moveInstrumentation(sectionLinksCell, ul);
      } else {
        const linkEl = linkCell.querySelector('a');
        if (linkEl) {
          const li = document.createElement('li');
          li.classList.add('nav-menu-item', 'list-item');
          const a = document.createElement('a');
          a.classList.add('nav-menu-link');
          a.href = linkEl.href;
          a.textContent = titleCell.textContent.trim(); // Use titleCell text for link label
          li.append(a);
          ul.append(li);
          moveInstrumentation(linkCell, a);
        }
      }
    }
    colMd3.append(ul);
    innerRow.append(colMd3);
  });

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');
  const contactSocialRow = document.createElement('div');
  contactSocialRow.classList.add('row');
  colMd5.append(contactSocialRow);

  const contactCol = document.createElement('div');
  contactCol.classList.add('col-md-6');
  contactCol.id = 'contact-footer';

  const contactH4 = document.createElement('h4');
  contactH4.textContent = contactHeadlineRow.textContent.trim();
  moveInstrumentation(contactHeadlineRow, contactH4);
  contactCol.append(contactH4);

  const contactAddressDiv = document.createElement('div');
  contactAddressDiv.innerHTML = contactAddressRow.innerHTML;
  moveInstrumentation(contactAddressRow, contactAddressDiv);
  contactCol.append(contactAddressDiv);

  const telNoUl = document.createElement('ul');
  telNoUl.classList.add('tel-no');

  const telLi = document.createElement('li');
  const telLabel = telephoneLabelRow.textContent.trim();
  const telLink = telephoneLinkRow.querySelector('a');
  if (telLink) {
    const telAnchor = document.createElement('a');
    telAnchor.href = telLink.href;
    telAnchor.textContent = telLink.href.replace('tel:', '');
    telLi.textContent = `${telLabel}: `;
    telLi.append(telAnchor);
    moveInstrumentation(telephoneLinkRow, telAnchor);
  } else {
    telLi.textContent = `${telLabel}: `;
  }
  moveInstrumentation(telephoneLabelRow, telLi);
  telNoUl.append(telLi);

  const faxLi = document.createElement('li');
  faxLi.textContent = `${faxLabelRow.textContent.trim()}: ${faxValueRow.textContent.trim()}`;
  moveInstrumentation(faxLabelRow, faxLi);
  moveInstrumentation(faxValueRow, faxLi); // This instrumentation is redundant as faxValueRow content is merged into faxLi
  telNoUl.append(faxLi);

  contactCol.append(telNoUl);
  contactSocialRow.append(contactCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6');

  const socialInfoDiv = document.createElement('div');
  socialInfoDiv.classList.add('social-info');

  const followUsH4 = document.createElement('h4');
  followUsH4.textContent = 'Follow Us'; // Hardcoded, but matches ORIGINAL HTML
  socialInfoDiv.append(followUsH4);

  const socialUl = document.createElement('ul');
  socialLinks.forEach((row) => {
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const socialLinkCell = cells.find(cell => cell.querySelector('a'));
    const socialAnchor = socialLinkCell.querySelector('a');
    if (socialAnchor) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = socialAnchor.href;
      a.target = '_blank';
      a.setAttribute('aria-label', socialAnchor.href.split('.com')[0].split('/').pop());

      let iconClass = '';
      if (a.href.includes('facebook')) {
        iconClass = 'fab fa-facebook-f';
        li.classList.add('fb');
      } else if (a.href.includes('twitter')) {
        iconClass = 'fab fa-twitter';
        li.classList.add('twit');
      } else if (a.href.includes('youtube')) {
        iconClass = 'fab fa-youtube';
        li.classList.add('you-t');
      } else if (a.href.includes('instagram')) {
        iconClass = 'fab fa-instagram';
        li.classList.add('insta');
      } else if (a.href.includes('linkedin')) {
        iconClass = 'fab fa-linkedin-in';
        li.classList.add('linked');
      }

      if (iconClass) {
        const i = document.createElement('i');
        i.classList.add(...iconClass.split(' '));
        i.setAttribute('aria-hidden', 'true');
        a.append(i);
      }
      li.append(a);
      moveInstrumentation(row, li);
      socialUl.append(li);
    }
  });
  socialInfoDiv.append(socialUl);
  socialCol.append(socialInfoDiv);

  const developerCreditP = document.createElement('p');
  developerCreditP.innerHTML = developerCreditRow.innerHTML;
  moveInstrumentation(developerCreditRow, developerCreditP);
  socialCol.append(developerCreditP);

  contactSocialRow.append(socialCol);

  mainRow.append(colMd7, colMd5);
  footerContainer.append(mainRow);

  block.replaceChildren(footerContainer);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
