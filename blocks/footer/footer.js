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

  // Root fields - fixed order based on BlockJson
  // block.children[0]: field="contactAddress" label="Contact Address" type=richtext
  // block.children[1]: field="contactPhone" label="Contact Phone Link" type=aem-content
  // block.children[2]: field="contactFax" label="Contact Fax" type=text
  // block.children[3]: field="designedByText" label="Designed By Text" type=text
  // block.children[4]: field="designedByLink" label="Designed By Link" type=aem-content

  // Item rows - detected by cell count and content
  // footer-section-item: 4 cells, contains <ul>
  // footer-link-item: 2 cells, no <ul>
  // footer-social-item: 1 cell, contains <a>, no <ul>

  const contactAddressRow = children.find(
    (row) => row.children.length === 1 && row.querySelector('p') && !row.querySelector('a[href*="tel:"]'),
  );
  const contactPhoneRow = children.find(
    (row) => row.children.length === 1 && row.querySelector('a[href*="tel:"]'),
  );
  const contactFaxRow = children.find(
    (row) => row.children.length === 1 && !row.querySelector('a') && !row.querySelector('p'),
  );

  const designedByTextRow = children.find(
    (row) => row.children.length === 1 && !row.querySelector('a[href*="stercodigitex.com"]') && !row.querySelector('p') && row.textContent.trim().length > 0,
  );
  const designedByLinkRow = children.find(
    (row) => row.children.length === 1 && row.querySelector('a[href*="stercodigitex.com"]'),
  );

  const footerSectionRows = children.filter(
    (row) => row.children.length === 4 && row.querySelector('ul'),
  );
  const footerLinkRows = children.filter(
    (row) => row.children.length === 2 && !row.querySelector('ul'),
  );
  const footerSocialRows = children.filter(
    (row) => row.children.length === 1 && row.querySelector('a') && !row.querySelector('ul') && !row.querySelector('a[href*="tel:"]') && !row.querySelector('a[href*="stercodigitex.com"]'),
  );

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  const row = document.createElement('div');
  row.classList.add('row');

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');
  const rowInner = document.createElement('div');
  rowInner.classList.add('row');

  footerSectionRows.forEach((sectionRow, index) => {
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...sectionRow.children];

    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, h4);
    colMd3.append(h4);

    const hierarchyList = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyList) {
      transformNestedLists(hierarchyList);
      moveInstrumentation(hierarchyTreeCell, hierarchyList); // Move instrumentation for the hierarchy list
      colMd3.append(hierarchyList);
    } else {
      // Fallback for sectionLinks if hierarchy-tree is empty
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      const a = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        a.href = foundLink.href;
        a.textContent = titleCell.textContent.trim(); // Use title as link text if no hierarchy
      } else {
        a.textContent = titleCell.textContent.trim();
      }
      moveInstrumentation(sectionLinksCell, a); // Instrumentation for the sectionLinks cell
      li.append(a);
      ul.append(li);
      colMd3.append(ul);
    }

    // Add m-top class for subsequent sections as seen in original HTML
    if (index > 0 && index % 2 === 0) { // Assuming 2 sections per row in original HTML layout
      const mTopDiv = document.createElement('div');
      mTopDiv.classList.add('m-top');
      // Move content from colMd3 to mTopDiv
      while (colMd3.firstChild) {
        mTopDiv.append(colMd3.firstChild);
      }
      colMd3.append(mTopDiv);
    }
    rowInner.append(colMd3);
  });

  colMd7.append(rowInner);
  row.append(colMd7);

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');
  const rowContactSocial = document.createElement('div');
  rowContactSocial.classList.add('row');

  const colMd6Contact = document.createElement('div');
  colMd6Contact.classList.add('col-md-6');
  colMd6Contact.id = 'contact-footer';

  const h4Contact = document.createElement('h4');
  h4Contact.textContent = 'Contact Us';
  colMd6Contact.append(h4Contact);

  if (contactAddressRow) {
    const pAddress = document.createElement('p');
    pAddress.innerHTML = contactAddressRow.children[0]?.innerHTML || ''; // Read from cell, not row
    moveInstrumentation(contactAddressRow, pAddress);
    colMd6Contact.append(pAddress);
  }

  const ulTelNo = document.createElement('ul');
  ulTelNo.classList.add('tel-no');

  if (contactPhoneRow) {
    const liTel = document.createElement('li');
    const phoneLink = contactPhoneRow.children[0]?.querySelector('a'); // Read from cell
    if (phoneLink) {
      const telSpan = document.createElement('span');
      telSpan.textContent = 'Tel: ';
      const aPhone = document.createElement('a');
      aPhone.href = phoneLink.href;
      aPhone.textContent = phoneLink.href.replace('tel:', '');
      liTel.append(telSpan, aPhone);
    }
    moveInstrumentation(contactPhoneRow, liTel);
    ulTelNo.append(liTel);
  }

  if (contactFaxRow) {
    const liFax = document.createElement('li');
    liFax.textContent = `Fax: ${contactFaxRow.children[0]?.textContent.trim() || ''}`; // Read from cell
    moveInstrumentation(contactFaxRow, liFax);
    ulTelNo.append(liFax);
  }
  colMd6Contact.append(ulTelNo);
  rowContactSocial.append(colMd6Contact);

  const colMd6Social = document.createElement('div');
  colMd6Social.classList.add('col-md-6');

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info');
  const h4Follow = document.createElement('h4');
  h4Follow.textContent = 'Follow Us';
  socialInfo.append(h4Follow);

  const ulSocial = document.createElement('ul');
  footerSocialRows.forEach((socialRow) => {
    const socialLinkCell = socialRow.children[0]?.querySelector('a'); // Read from cell
    if (socialLinkCell) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = socialLinkCell.href;
      a.target = '_blank';
      a.ariaLabel = socialLinkCell.href.split('.com')[0].split('.').pop() || 'social link';

      let iconClass = '';
      if (socialLinkCell.href.includes('facebook')) {
        iconClass = 'fa-facebook-f';
        li.classList.add('fb');
      } else if (socialLinkCell.href.includes('twitter')) {
        iconClass = 'fa-twitter';
        li.classList.add('twit');
      } else if (socialLinkCell.href.includes('youtube')) {
        iconClass = 'fa-youtube';
        li.classList.add('you-t');
      } else if (socialLinkCell.href.includes('instagram')) {
        iconClass = 'fa-instagram';
        li.classList.add('insta');
      } else if (socialLinkCell.href.includes('linkedin')) {
        iconClass = 'fa-linkedin-in';
        li.classList.add('linked');
      }
      const i = document.createElement('i');
      i.classList.add('fab', iconClass);
      i.setAttribute('aria-hidden', 'true');
      a.append(i);
      moveInstrumentation(socialRow, a); // Instrumentation for the social link row
      li.append(a);
      ulSocial.append(li);
    }
  });
  socialInfo.append(ulSocial);
  colMd6Social.append(socialInfo);

  const pDesignedBy = document.createElement('p');
  if (designedByTextRow && designedByLinkRow) {
    const designedByLink = designedByLinkRow.children[0]?.querySelector('a'); // Read from cell
    if (designedByLink) {
      pDesignedBy.textContent = `${designedByTextRow.children[0]?.textContent.trim() || ''} `; // Read from cell
      const aDesignedBy = document.createElement('a');
      aDesignedBy.href = designedByLink.href;
      aDesignedBy.target = '_blank';
      // Use textContent from the link cell for the label, or fallback
      aDesignedBy.textContent = designedByLink.textContent.trim() || 'Sterco Digitex';
      pDesignedBy.append(aDesignedBy);
    }
    moveInstrumentation(designedByTextRow, pDesignedBy);
    moveInstrumentation(designedByLinkRow, pDesignedBy.querySelector('a'));
  }
  colMd6Social.append(pDesignedBy);

  rowContactSocial.append(colMd6Social);
  colMd5.append(rowContactSocial);
  row.append(colMd5);

  container.append(row);
  footer.append(container);

  block.replaceChildren(footer);
}
