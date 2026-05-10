import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes from ORIGINAL HTML to li elements
    li.classList.add('nav-menu-item', 'list-item'); // Assuming these are common list item classes

    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    if (anchor) {
      // Add classes from ORIGINAL HTML to anchor elements
      anchor.classList.add('nav-menu-link'); // Assuming this is a common link class
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
      // Add classes from ORIGINAL HTML to nested ul elements
      nested.classList.add('sub-menu'); // Assuming this is a common sub-menu class
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Class from original HTML
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

  const footerSections = [];
  const footerContacts = [];
  const footerSocialLinks = [];
  const footerWebsiteCredits = [];

  children.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 4) { // footer-section-item
      footerSections.push(row);
    } else if (cells.length === 5) { // footer-contact
      footerContacts.push(row);
    } else if (cells.length === 1 && cells[0].querySelector('a')) { // footer-social-item
      footerSocialLinks.push(row);
    } else if (cells.length === 2) { // footer-website-credit
      footerWebsiteCredits.push(row);
    }
  });

  const container = document.createElement('div');
  container.classList.add('container');

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');

  const sectionRow = document.createElement('div');
  sectionRow.classList.add('row');

  footerSections.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children]; // Destructuring for fixed schema
    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, h4);
    colMd3.append(h4);

    const ul = document.createElement('ul');
    const directLink = linkCell.querySelector('a');
    if (directLink) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = directLink.href;
      a.textContent = titleCell.textContent.trim(); // Use title as text for direct link
      moveInstrumentation(linkCell, a);
      li.append(a);
      ul.append(li);
    }

    const tempHierarchyDiv = document.createElement('div');
    tempHierarchyDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    moveInstrumentation(hierarchyTreeCell, tempHierarchyDiv); // Move instrumentation for hierarchy cell

    const subList = tempHierarchyDiv.querySelector('ul');
    if (subList) {
      transformNestedLists(subList);
      // Move children from tempHierarchyDiv to ul
      while (subList.firstChild) {
        ul.append(subList.firstChild);
      }
    } else {
      const tempSectionLinksDiv = document.createElement('div');
      tempSectionLinksDiv.innerHTML = sectionLinksCell?.innerHTML || '';
      moveInstrumentation(sectionLinksCell, tempSectionLinksDiv); // Move instrumentation for sectionLinks cell

      const sectionUl = tempSectionLinksDiv.querySelector('ul');
      if (sectionUl) {
        transformNestedLists(sectionUl);
        // Move children from tempSectionLinksDiv to ul
        while (sectionUl.firstChild) {
          ul.append(sectionUl.firstChild);
        }
      } else {
        // If it's just plain text or <p> tags, append as list items
        [...tempSectionLinksDiv.children].forEach((child) => {
          const li = document.createElement('li');
          if (child.tagName === 'A') {
            const a = document.createElement('a');
            a.href = child.href;
            a.textContent = child.textContent.trim();
            li.append(a);
          } else if (child.tagName === 'P') {
            li.innerHTML = child.innerHTML; // Preserve potential HTML inside <p>
          } else {
            li.textContent = child.textContent.trim();
          }
          ul.append(li);
        });
      }
    }
    colMd3.append(ul);
    moveInstrumentation(row, colMd3);
    sectionRow.append(colMd3);
  });
  colMd7.append(sectionRow);
  mainRow.append(colMd7);

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');

  const contactSocialRow = document.createElement('div');
  contactSocialRow.classList.add('row');

  if (footerContacts.length > 0) {
    const contactRow = footerContacts[0];
    const [titleCell, addressCell, telLinkCell, telephoneCell, faxCell] = [...contactRow.children]; // Destructuring for fixed schema

    const colMd6Contact = document.createElement('div');
    colMd6Contact.classList.add('col-md-6');
    colMd6Contact.id = 'contact-footer';

    const h4Contact = document.createElement('h4');
    h4Contact.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, h4Contact);
    colMd6Contact.append(h4Contact);

    const pAddress = document.createElement('p');
    pAddress.innerHTML = addressCell.innerHTML; // Use innerHTML for richtext address
    moveInstrumentation(addressCell, pAddress);
    colMd6Contact.append(pAddress);

    const ulTelNo = document.createElement('ul');
    ulTelNo.classList.add('tel-no');

    const liTel = document.createElement('li');
    const telLink = telLinkCell.querySelector('a');
    if (telLink) {
      const telAnchor = document.createElement('a');
      telAnchor.href = telLink.href;
      telAnchor.textContent = telephoneCell.textContent.trim();
      liTel.append(document.createTextNode('Tel: '));
      liTel.append(telAnchor);
      moveInstrumentation(telLinkCell, telAnchor);
    } else {
      liTel.textContent = `Tel: ${telephoneCell.textContent.trim()}`;
    }
    moveInstrumentation(telephoneCell, liTel);
    ulTelNo.append(liTel);

    const liFax = document.createElement('li');
    liFax.textContent = `Fax: ${faxCell.textContent.trim()}`;
    moveInstrumentation(faxCell, liFax);
    ulTelNo.append(liFax);

    colMd6Contact.append(ulTelNo);
    moveInstrumentation(contactRow, colMd6Contact);
    contactSocialRow.append(colMd6Contact);
  }

  const colMd6Social = document.createElement('div');
  colMd6Social.classList.add('col-md-6');

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info');

  const h4Follow = document.createElement('h4');
  h4Follow.textContent = 'Follow Us'; // Hardcoded in original HTML
  socialInfo.append(h4Follow);

  const ulSocial = document.createElement('ul');
  footerSocialLinks.forEach((row) => {
    const [socialLinkCell] = [...row.children]; // Destructuring for fixed schema
    const socialLink = socialLinkCell.querySelector('a');
    if (socialLink) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = socialLink.href;
      a.setAttribute('target', '_blank');
      a.setAttribute('aria-label', socialLink.textContent.trim() || 'social icon'); // Use link text for aria-label if available
      const icon = document.createElement('i');
      // Infer social icon class based on href
      if (socialLink.href.includes('facebook')) {
        li.classList.add('fb');
        icon.classList.add('fab', 'fa-facebook-f');
      } else if (socialLink.href.includes('twitter')) {
        li.classList.add('twit');
        icon.classList.add('fab', 'fa-twitter');
      } else if (socialLink.href.includes('youtube')) {
        li.classList.add('you-t');
        icon.classList.add('fab', 'fa-youtube');
      } else if (socialLink.href.includes('instagram')) {
        li.classList.add('insta');
        icon.classList.add('fab', 'fa-instagram');
      } else if (socialLink.href.includes('linkedin')) {
        li.classList.add('linked');
        icon.classList.add('fab', 'fa-linkedin-in');
      }
      icon.setAttribute('aria-hidden', 'true');
      a.append(icon);
      li.append(a);
      moveInstrumentation(row, li);
      ulSocial.append(li);
    }
  });
  socialInfo.append(ulSocial);
  colMd6Social.append(socialInfo);

  if (footerWebsiteCredits.length > 0) {
    const creditRow = footerWebsiteCredits[0];
    const [creditTextCell, creditLinkCell] = [...creditRow.children]; // Destructuring for fixed schema

    const pCredit = document.createElement('p');
    pCredit.textContent = creditTextCell.textContent.trim();
    moveInstrumentation(creditTextCell, pCredit);

    const creditLink = creditLinkCell.querySelector('a');
    if (creditLink) {
      const aCredit = document.createElement('a');
      aCredit.href = creditLink.href;
      aCredit.setAttribute('target', '_blank');
      aCredit.textContent = creditLink.textContent.trim(); // Read from cell, not hardcoded
      moveInstrumentation(creditLinkCell, aCredit);
      pCredit.append(document.createTextNode(' ')); // Add space between text and link
      pCredit.append(aCredit);
    }
    colMd6Social.append(pCredit);
    moveInstrumentation(creditRow, pCredit);
  }
  contactSocialRow.append(colMd6Social);
  colMd5.append(contactSocialRow);
  mainRow.append(colMd5);

  container.append(mainRow);
  block.replaceChildren(container);

  // This part should ideally be handled by a separate image block or a utility function
  // if images are not part of the core footer structure.
  // For now, keeping it as is, assuming it's a generic image optimization.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
