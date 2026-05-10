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
      // subWrap.classList.add('has-sub-child'); // Placeholder class, adjust based on actual CSS - Removed as not in original HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Assuming 'active' class from original site for toggle behavior
          subWrap.classList.toggle('active'); // Assuming 'active' class from original site for toggle behavior
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const contactInfoRow = children[0];
  const telephoneNumbersRow = children[1];
  const footerAttributionRow = children[2];

  const itemRows = children.slice(3);

  const footerSectionItems = [];
  const footerLinkItems = [];
  const footerSocialItems = [];

  itemRows.forEach((row) => {
    if (row.children.length === 4) {
      footerSectionItems.push(row);
    } else if (row.children.length === 2) {
      footerLinkItems.push(row);
    } else if (row.children.length === 1 && row.querySelector('a')) {
      footerSocialItems.push(row);
    }
  });

  const container = document.createElement('div');
  container.classList.add('container');

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');

  const innerRow = document.createElement('div');
  innerRow.classList.add('row');

  footerSectionItems.forEach((row) => {
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];

    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');

    const h4 = document.createElement('h4');
    h4.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, h4);
    colMd3.append(h4);

    const hierarchyUl = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      moveInstrumentation(hierarchyTreeCell, hierarchyUl);
      colMd3.append(hierarchyUl);
    } else {
      const sectionLinksUl = sectionLinksCell?.querySelector('ul');
      if (sectionLinksUl) {
        moveInstrumentation(sectionLinksCell, sectionLinksUl);
        colMd3.append(sectionLinksUl);
      } else {
        const directLink = linkCell?.querySelector('a');
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
    }
    moveInstrumentation(row, colMd3);
    innerRow.append(colMd3);
  });

  colMd7.append(innerRow);
  mainRow.append(colMd7);

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');

  const contactSocialRow = document.createElement('div');
  contactSocialRow.classList.add('row');

  const contactCol = document.createElement('div');
  contactCol.classList.add('col-md-6');
  contactCol.id = 'contact-footer';

  const contactH4 = document.createElement('h4');
  contactH4.textContent = 'Contact Us'; // Hardcoded, but matches original HTML
  contactCol.append(contactH4);

  if (contactInfoRow) {
    const contactDiv = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    contactDiv.innerHTML = contactInfoRow.children[0]?.innerHTML || '';
    moveInstrumentation(contactInfoRow, contactDiv);
    contactCol.append(contactDiv);
  }

  if (telephoneNumbersRow) {
    const telUl = document.createElement('ul');
    telUl.classList.add('tel-no');
    telUl.innerHTML = telephoneNumbersRow.children[0]?.innerHTML || ''; // Use innerHTML for richtext
    moveInstrumentation(telephoneNumbersRow, telUl);
    contactCol.append(telUl);
  }
  contactSocialRow.append(contactCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6');

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info');

  const followH4 = document.createElement('h4');
  followH4.textContent = 'Follow Us'; // Hardcoded, but matches original HTML
  socialInfo.append(followH4);

  const socialUl = document.createElement('ul');
  footerSocialItems.forEach((row) => {
    const [socialLinkCell] = [...row.children]; // Destructuring for fixed schema
    const socialLink = socialLinkCell.querySelector('a');
    if (socialLink) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = socialLink.href;
      a.target = '_blank';

      // Example for social icons, adjust based on actual content/classes
      if (socialLink.href.includes('facebook')) {
        li.classList.add('fb');
        a.setAttribute('aria-label', 'facebook');
        a.innerHTML = '<i class="fab fa-facebook-f" aria-hidden="true"></i>';
      } else if (socialLink.href.includes('twitter')) {
        li.classList.add('twit');
        a.setAttribute('aria-label', 'twitter');
        a.innerHTML = '<i class="fab fa-twitter" aria-hidden="true"></i>';
      } else if (socialLink.href.includes('youtube')) {
        li.classList.add('you-t');
        a.setAttribute('aria-label', 'youtube');
        a.innerHTML = '<i class="fab fa-youtube" aria-hidden="true"></i>';
      } else if (socialLink.href.includes('instagram')) {
        li.classList.add('insta');
        a.setAttribute('aria-label', 'instagram');
        a.innerHTML = '<i class="fab fa-instagram" aria-hidden="true"></i>';
      } else if (socialLink.href.includes('linkedin')) {
        li.classList.add('linked');
        a.setAttribute('aria-label', 'linkedin-in');
        a.innerHTML = '<i class="fab fa-linkedin-in" aria-hidden="true"></i>';
      } else {
        a.textContent = socialLink.href; // Fallback for unknown social links
      }
      moveInstrumentation(socialLinkCell, a); // Move instrumentation from cell to the new 'a' element
      li.append(a);
      socialUl.append(li);
    }
    moveInstrumentation(row, socialUl); // Move instrumentation from row to the socialUl (or li if preferred)
  });
  socialInfo.append(socialUl);
  socialCol.append(socialInfo);

  if (footerAttributionRow) {
    const attributionDiv = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    attributionDiv.innerHTML = footerAttributionRow.children[0]?.innerHTML || '';
    moveInstrumentation(footerAttributionRow, attributionDiv);
    socialCol.append(attributionDiv);
  }
  contactSocialRow.append(socialCol);
  colMd5.append(contactSocialRow);
  mainRow.append(colMd5);

  container.append(mainRow);

  const bottomLinksDiv = document.createElement('div');
  bottomLinksDiv.classList.add('container'); // Assuming bottom links also in a container

  const bottomLinksRow = document.createElement('div');
  bottomLinksRow.classList.add('row');

  footerLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const link = linkCell?.querySelector('a');
    if (link) {
      const col = document.createElement('div');
      col.classList.add('col-md-3'); // Adjust column size as per original HTML if needed
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = labelCell.textContent.trim();
      moveInstrumentation(row, a);
      col.append(a);
      bottomLinksRow.append(col);
    }
  });

  bottomLinksDiv.append(bottomLinksRow);

  block.replaceChildren(container, bottomLinksDiv);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
