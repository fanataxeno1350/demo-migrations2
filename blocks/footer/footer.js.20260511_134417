import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's for JS behavior
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's for JS behavior
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields
  const contactTextRow = children[0];
  const telephoneLabelRow = children[1];
  const telephoneLinkRow = children[2];
  const faxLabelRow = children[3];
  const faxNumberRow = children[4];
  const footerCreditsRow = children[5];

  // Extract cells from root rows
  const contactTextCell = contactTextRow.children[0];
  const telephoneLabelCell = telephoneLabelRow.children[0];
  const telephoneLinkCell = telephoneLinkRow.children[0];
  const faxLabelCell = faxLabelRow.children[0];
  const faxNumberCell = faxNumberRow.children[0];
  const footerCreditsCell = footerCreditsRow.children[0];

  const navSectionRows = [];
  const legalLinkRows = [];
  const socialLinkRows = [];

  // Separate fixed fields from item rows
  const itemRows = children.slice(6);

  itemRows.forEach((row) => {
    if (row.children.length === 4) { // footer-section-item
      navSectionRows.push(row);
    } else if (row.children.length === 2) { // footer-link-item
      legalLinkRows.push(row);
    } else if (row.children.length === 1 && row.querySelector('a')) { // footer-social-item
      socialLinkRows.push(row);
    }
  });

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  footer.append(container);

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');
  container.append(mainRow);

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');
  mainRow.append(colMd7);

  const innerRow = document.createElement('div');
  innerRow.classList.add('row');
  colMd7.append(innerRow);

  navSectionRows.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];

    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');
    innerRow.append(colMd3);

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    colMd3.append(h4);

    const ul = document.createElement('ul');
    colMd3.append(ul);

    const hierarchyList = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyList) {
      moveInstrumentation(hierarchyTreeCell, ul); // Move instrumentation from hierarchy cell to the new ul
      transformNestedLists(hierarchyList);
      while (hierarchyList.firstChild) {
        ul.append(hierarchyList.firstChild);
      }
    } else {
      const link = linkCell?.querySelector('a');
      if (link) {
        const li = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = titleCell.textContent.trim();
        li.append(anchor);
        ul.append(li);
      }
    }
    moveInstrumentation(row, colMd3);
  });

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');
  mainRow.append(colMd5);

  const contactRow = document.createElement('div');
  contactRow.classList.add('row');
  colMd5.append(contactRow);

  const contactCol = document.createElement('div');
  contactCol.classList.add('col-md-6');
  contactCol.id = 'contact-footer';
  contactRow.append(contactCol);

  const contactH4 = document.createElement('h4');
  contactH4.textContent = 'Contact Us'; // Hardcoded label from original HTML
  contactCol.append(contactH4);

  if (contactTextCell) {
    const p = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    p.innerHTML = contactTextCell.innerHTML;
    contactCol.append(p);
    moveInstrumentation(contactTextRow, p);
  }

  const telNoUl = document.createElement('ul');
  telNoUl.classList.add('tel-no');
  contactCol.append(telNoUl);

  if (telephoneLabelCell && telephoneLinkCell) {
    const telLi = document.createElement('li');
    const telLink = telephoneLinkCell.querySelector('a');
    if (telLink) {
      telLi.innerHTML = `Tel: <a href="${telLink.href}">${telephoneLabelCell.textContent.trim()}</a>`;
    } else {
      telLi.textContent = `Tel: ${telephoneLabelCell.textContent.trim()}`;
    }
    telNoUl.append(telLi);
    moveInstrumentation(telephoneLabelRow, telLi);
    moveInstrumentation(telephoneLinkRow, telLi);
  }

  if (faxLabelCell && faxNumberCell) {
    const faxLi = document.createElement('li');
    faxLi.textContent = `${faxLabelCell.textContent.trim()}: ${faxNumberCell.textContent.trim()}`;
    telNoUl.append(faxLi);
    moveInstrumentation(faxLabelRow, faxLi);
    moveInstrumentation(faxNumberRow, faxLi);
  }

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6');
  contactRow.append(socialCol);

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info');
  socialCol.append(socialInfo);

  const followH4 = document.createElement('h4');
  followH4.textContent = 'Follow Us'; // Hardcoded label from original HTML
  socialInfo.append(followH4);

  const socialUl = document.createElement('ul');
  socialInfo.append(socialUl);

  socialLinkRows.forEach((row) => {
    const [socialLinkCell] = [...row.children]; // Destructuring for fixed schema
    const socialLink = socialLinkCell?.querySelector('a');
    if (socialLink) {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = socialLink.href;
      anchor.target = '_blank';
      anchor.setAttribute('aria-label', socialLink.textContent.trim().toLowerCase());

      let iconClass = '';
      if (socialLink.href.includes('facebook')) {
        iconClass = 'fb';
        anchor.innerHTML = '<i class="fab fa-facebook-f" aria-hidden="true"></i>';
      } else if (socialLink.href.includes('twitter')) {
        iconClass = 'twit';
        anchor.innerHTML = '<i class="fab fa-twitter" aria-hidden="true"></i>';
      } else if (socialLink.href.includes('youtube')) {
        iconClass = 'you-t';
        anchor.innerHTML = '<i class="fab fa-youtube" aria-hidden="true"></i>';
      } else if (socialLink.href.includes('instagram')) {
        iconClass = 'insta';
        anchor.innerHTML = '<i class="fab fa-instagram" aria-hidden="true"></i>';
      } else if (socialLink.href.includes('linkedin')) {
        iconClass = 'linked';
        anchor.innerHTML = '<i class="fab fa-linkedin-in" aria-hidden="true"></i>';
      }
      li.classList.add(iconClass);
      li.append(anchor);
      socialUl.append(li);
    }
    moveInstrumentation(row, socialUl);
  });

  if (footerCreditsCell) {
    const creditsP = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    creditsP.innerHTML = footerCreditsCell.innerHTML;
    socialCol.append(creditsP);
    moveInstrumentation(footerCreditsRow, creditsP);
  }

  // Legal Links section
  const legalLinksDiv = document.createElement('div');
  legalLinksDiv.classList.add('m-top');
  // Original HTML places this section under col-md-3, not contactCol.
  // Re-parenting to container to align with original structure's placement if it's a separate section.
  // If it's meant to be within col-md-7, it should be appended to innerRow or colMd7.
  // Based on the original HTML, "Other Link" is in a col-md-3 inside the col-md-7.
  // Let's create a new col-md-3 for it.
  const legalLinksCol = document.createElement('div');
  legalLinksCol.classList.add('col-md-3');
  innerRow.append(legalLinksCol); // Append to innerRow to match original HTML structure

  const legalLinksH4 = document.createElement('h4');
  // The original HTML has "Other Link" as a hardcoded H4.
  // If this should come from a model field, a new field would be needed.
  // For now, keeping it hardcoded as it's not in the current model.
  legalLinksH4.textContent = 'Other Link';
  legalLinksCol.append(legalLinksH4);

  const legalLinksUl = document.createElement('ul');
  legalLinksCol.append(legalLinksUl);

  legalLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);
    legalLinksUl.append(li);
    moveInstrumentation(row, li);
  });

  block.replaceChildren(footer);
}
