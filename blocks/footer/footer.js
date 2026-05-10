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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Fixed schema rows at the top
  const contactInfoRow = children[0];
  const phoneNumbersRow = children[1];
  const developerCreditRow = children[2];

  const footerSectionRows = [];
  const footerLinkRows = [];
  const footerSocialLinkRows = [];

  // Separate item rows based on cell count and content
  // BlockJson model:
  // footer-section-item: 4 cells (title, link, sectionLinks, hierarchy-tree)
  // footer-link-item:    2 cells (label, link)
  // footer-social-item:  1 cell (socialLink)
  children.slice(3).forEach((row) => {
    if (row.children.length === 4) {
      footerSectionRows.push(row);
    } else if (row.children.length === 2) {
      footerLinkRows.push(row);
    } else if (row.children.length === 1 && row.querySelector('a')) { // Social links have 1 cell with an anchor
      footerSocialLinkRows.push(row);
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

  footerSectionRows.forEach((row) => {
    // Use index destructuring for fixed-schema item rows
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];

    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');
    moveInstrumentation(row, colMd3);

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
      // Use the titleCell's text content for the direct link's text, as per original HTML pattern
      a.textContent = titleCell.textContent.trim();
      moveInstrumentation(linkCell, a);
      li.append(a);
      ul.append(li);
    }

    // Handle hierarchy-tree richtext field
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
    const subList = tempDiv.querySelector('ul');

    if (subList) {
      // Apply classes from original HTML to nested elements
      subList.querySelectorAll('a').forEach((a) => a.classList.add()); // No specific classes in original HTML for <a>
      subList.querySelectorAll('li').forEach((li) => li.classList.add()); // No specific classes in original HTML for <li>
      subList.querySelectorAll('ul').forEach((nestedUl) => nestedUl.classList.add()); // No specific classes in original HTML for <ul>

      transformNestedLists(subList);
      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation from the original cell to the new ul
      ul.append(subList);
    }

    colMd3.append(ul);
    sectionRow.append(colMd3);
  });

  colMd7.append(sectionRow);
  mainRow.append(colMd7);

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');

  const contactSocialRow = document.createElement('div');
  contactSocialRow.classList.add('row');

  // Contact Info
  const contactCol = document.createElement('div');
  contactCol.classList.add('col-md-6');
  contactCol.id = 'contact-footer';
  moveInstrumentation(contactInfoRow, contactCol);

  const contactH4 = document.createElement('h4');
  contactH4.textContent = 'Contact Us'; // Hardcoded, but matches original HTML
  contactCol.append(contactH4);

  const contactP = document.createElement('p');
  // Use innerHTML for richtext field, as it can contain HTML like <br/>
  contactP.innerHTML = contactInfoRow.children[0]?.innerHTML || '';
  contactCol.append(contactP);

  // Phone Numbers
  const phoneUl = document.createElement('ul');
  phoneUl.classList.add('tel-no');
  // Use innerHTML for richtext field
  phoneUl.innerHTML = phoneNumbersRow.children[0]?.innerHTML || '';
  moveInstrumentation(phoneNumbersRow, phoneUl);
  contactCol.append(phoneUl);

  contactSocialRow.append(contactCol);

  // Social Info and Developer Credit
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6');

  const socialInfoDiv = document.createElement('div');
  socialInfoDiv.classList.add('social-info');

  const followUsH4 = document.createElement('h4');
  followUsH4.textContent = 'Follow Us'; // Hardcoded, but matches original HTML
  socialInfoDiv.append(followUsH4);

  const socialUl = document.createElement('ul');
  footerSocialLinkRows.forEach((row) => {
    // Use index destructuring for fixed-schema item rows
    const [socialLinkCell] = [...row.children];
    const socialLink = socialLinkCell.querySelector('a');
    if (socialLink) {
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      const a = document.createElement('a');
      a.href = socialLink.href;
      a.target = '_blank';
      a.setAttribute('aria-label', socialLink.textContent.trim().toLowerCase());

      const i = document.createElement('i');
      i.classList.add('fab');
      if (socialLink.href.includes('facebook')) {
        li.classList.add('fb');
        i.classList.add('fa-facebook-f');
      } else if (socialLink.href.includes('twitter')) {
        li.classList.add('twit');
        i.classList.add('fa-twitter');
      } else if (socialLink.href.includes('youtube')) {
        li.classList.add('you-t');
        i.classList.add('fa-youtube');
      } else if (socialLink.href.includes('instagram')) {
        li.classList.add('insta');
        i.classList.add('fa-instagram');
      } else if (socialLink.href.includes('linkedin')) {
        li.classList.add('linked');
        i.classList.add('fa-linkedin-in');
      }
      a.append(i);
      li.append(a);
      socialUl.append(li);
    }
  });
  socialInfoDiv.append(socialUl);
  socialCol.append(socialInfoDiv);

  const developerCreditP = document.createElement('p');
  // Use innerHTML for richtext field
  developerCreditP.innerHTML = developerCreditRow.children[0]?.innerHTML || '';
  moveInstrumentation(developerCreditRow, developerCreditP);
  socialCol.append(developerCreditP);

  contactSocialRow.append(socialCol);
  colMd5.append(contactSocialRow);
  mainRow.append(colMd5);
  container.append(mainRow);

  block.replaceChildren(container);

  // Ensure moveInstrumentation is called for the picture replacement
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be called on the original img element, and the new img element
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
