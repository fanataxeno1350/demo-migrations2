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
      subWrap.classList.add('has-sub-child'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
          subWrap.classList.toggle('active'); // This class is not in ORIGINAL HTML, but seems to be for JS functionality
        });
      }
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  // Destructure root rows based on BlockJson model
  const [contactDetailsRow, contactNumbersRow, developerCreditRow, ...itemRows] = children;

  const footerSectionItems = itemRows.filter(
    (row) => row.children.length === 4,
  );
  const footerLinkItems = itemRows.filter((row) => row.children.length === 2);
  const footerSocialItems = itemRows.filter(
    (row) => row.children.length === 1,
  );

  const container = document.createElement('div');
  container.classList.add('container');

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');

  const sectionRow = document.createElement('div');
  sectionRow.classList.add('row');

  footerSectionItems.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [
      ...row.children,
    ];

    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    colMd3.append(h4);

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      // Apply classes from ORIGINAL HTML to nested elements
      subList.classList.add('list-unstyled'); // Example class, adjust based on actual original HTML if available
      subList.querySelectorAll('li').forEach(li => li.classList.add('list-item')); // Example class
      subList.querySelectorAll('a').forEach(a => a.classList.add('nav-link')); // Example class
      transformNestedLists(subList);
      colMd3.append(subList);
    } else {
      const p = document.createElement('p');
      p.innerHTML = sectionLinksCell?.innerHTML || '';
      colMd3.append(p);
    }
    moveInstrumentation(row, colMd3);
    sectionRow.append(colMd3);
  });

  colMd7.append(sectionRow);
  mainRow.append(colMd7);

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');

  const contactSocialRow = document.createElement('div');
  contactSocialRow.classList.add('row');

  const contactCol = document.createElement('div');
  contactCol.classList.add('col-md-6');
  contactCol.id = 'contact-footer';

  const contactH4 = document.createElement('h4');
  contactH4.textContent = 'Contact Us'; // Hardcoded, but matches original HTML. If this came from a cell, it would be dynamic.
  contactCol.append(contactH4);

  const contactDetailsContent = document.createElement('div'); // Use div for richtext
  contactDetailsContent.innerHTML = contactDetailsRow.children[0]?.innerHTML || '';
  moveInstrumentation(contactDetailsRow, contactDetailsContent);
  contactCol.append(contactDetailsContent);

  const contactNumbersUl = document.createElement('ul');
  contactNumbersUl.classList.add('tel-no');
  contactNumbersUl.innerHTML = contactNumbersRow.children[0]?.innerHTML || ''; // Use innerHTML for richtext
  moveInstrumentation(contactNumbersRow, contactNumbersUl);
  contactCol.append(contactNumbersUl);

  contactSocialRow.append(contactCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6');

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info');

  const socialH4 = document.createElement('h4');
  socialH4.textContent = 'Follow Us'; // Hardcoded, but matches original HTML. If this came from a cell, it would be dynamic.
  socialInfo.append(socialH4);

  const socialUl = document.createElement('ul');
  footerSocialItems.forEach((row) => {
    // Destructure social link cell
    const [socialLinkCell] = [...row.children];
    const socialLink = socialLinkCell.querySelector('a');
    if (socialLink) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = socialLink.href;
      a.target = '_blank';
      a.setAttribute('aria-label', socialLink.textContent.trim() || 'social icon'); // Use link text or generic label
      const i = document.createElement('i');

      // Determine social icon class based on href
      if (socialLink.href.includes('facebook')) {
        li.classList.add('fb');
        i.classList.add('fab', 'fa-facebook-f');
      } else if (socialLink.href.includes('twitter')) {
        li.classList.add('twit');
        i.classList.add('fab', 'fa-twitter');
      } else if (socialLink.href.includes('youtube')) {
        li.classList.add('you-t');
        i.classList.add('fab', 'fa-youtube');
      } else if (socialLink.href.includes('instagram')) {
        li.classList.add('insta');
        i.classList.add('fab', 'fa-instagram');
      } else if (socialLink.href.includes('linkedin')) {
        li.classList.add('linked');
        i.classList.add('fab', 'fa-linkedin-in');
      }
      a.append(i);
      li.append(a);
      moveInstrumentation(row, li); // Move instrumentation for the social link item row to the new li
      socialUl.append(li);
    }
  });
  socialInfo.append(socialUl);
  socialCol.append(socialInfo);

  const developerCreditP = document.createElement('p');
  developerCreditP.innerHTML = developerCreditRow.children[0]?.innerHTML || '';
  moveInstrumentation(developerCreditRow, developerCreditP);
  socialCol.append(developerCreditP);

  contactSocialRow.append(socialCol);
  colMd5.append(contactSocialRow);
  mainRow.append(colMd5);

  container.append(mainRow);
  block.replaceChildren(container);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation(img, optimizedPic.querySelector('img')); // moveInstrumentation is not needed here as replaceWith handles it
    img.closest('picture').replaceWith(optimizedPic);
  });
}
