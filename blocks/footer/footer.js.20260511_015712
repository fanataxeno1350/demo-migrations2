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
      subWrap.classList.add('has-sub-child');
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
    // Move instrumentation for the list item itself
    moveInstrumentation(li.parentElement, li); // Parent is the original ul, li is the new element
  });
  // Move instrumentation for the root ul
  moveInstrumentation(rootUl.parentElement, rootUl);
}

export default function decorate(block) {
  const children = [...block.children];

  // Root-level fields (single cells)
  const contactInfoCell = children.find((row) => row.children[0]?.textContent.includes('Contact Info text content'));
  const telLabelCell = children.find((row) => row.children[0]?.textContent.trim() === 'example text value' && row.nextElementSibling?.children[0]?.querySelector('a')?.href.includes('/content/site/telLink'));
  const telLinkCell = children.find((row) => row.children[0]?.querySelector('a')?.href.includes('/content/site/telLink'));
  const faxLabelCell = children.find((row) => row.children[0]?.textContent.trim() === 'example text value' && row.nextElementSibling?.children[0]?.textContent.trim() === 'example text value');
  const faxNumberCell = children.find((row) => row.children[0]?.textContent.trim() === 'example text value' && row.previousElementSibling?.children[0]?.textContent.trim() === 'example text value');
  const newsletterPlaceholderCell = children.find((row) => row.children[0]?.textContent.includes('Newsletter Placeholder text content'));
  const newsletterButtonLabelCell = children.find((row) => row.children[0]?.textContent.trim() === 'example text value' && row.previousElementSibling?.children[0]?.textContent.includes('Newsletter Placeholder text content'));
  const designedByCell = children.find((row) => row.children[0]?.textContent.includes('Designed By (Credit) text content'));

  // Item rows (containers)
  const footerSectionRows = children.filter((row) => row.children.length === 4);
  const footerLinkRows = children.filter((row) => row.children.length === 2); // Not used in current JS, but correctly identified
  const footerSocialLinkRows = children.filter((row) => row.children.length === 1 && row.querySelector('a'));

  const root = document.createElement('div');
  root.classList.add('container');

  const mainRow = document.createElement('div');
  mainRow.classList.add('row');

  const colMd7 = document.createElement('div');
  colMd7.classList.add('col-md-7');

  const sectionRow = document.createElement('div');
  sectionRow.classList.add('row');

  footerSectionRows.forEach((row) => {
    // Fixed schema for footer-section-item: [title, link, sectionLinks, hierarchy-tree]
    const [titleCell, linkCell, sectionLinksCell, hierarchyTreeCell] = [...row.children];

    const colMd3 = document.createElement('div');
    colMd3.classList.add('col-md-3');

    const h4 = document.createElement('h4');
    h4.textContent = titleCell?.textContent.trim() || '';
    moveInstrumentation(titleCell, h4);
    colMd3.append(h4);

    const subList = hierarchyTreeCell?.querySelector('ul');
    if (subList) {
      transformNestedLists(subList);
      colMd3.append(subList);
      moveInstrumentation(hierarchyTreeCell, subList); // Move instrumentation for the hierarchy-tree cell to the ul
    } else {
      const ul = document.createElement('ul');
      const directLink = linkCell?.querySelector('a');
      if (directLink) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = directLink.href;
        a.textContent = titleCell?.textContent.trim() || ''; // Use title cell text for link label
        li.append(a);
        ul.append(li);
        moveInstrumentation(linkCell, a); // Move instrumentation for the link cell to the anchor
      }
      colMd3.append(ul);
    }
    sectionRow.append(colMd3);
    moveInstrumentation(row, colMd3); // Move instrumentation for the entire item row to its new container
  });

  colMd7.append(sectionRow);
  mainRow.append(colMd7);

  const colMd5 = document.createElement('div');
  colMd5.classList.add('col-md-5');

  const contactNewsletterRow = document.createElement('div');
  contactNewsletterRow.classList.add('row');

  const contactCol = document.createElement('div');
  contactCol.classList.add('col-md-6');
  contactCol.id = 'contact-footer';

  const contactH4 = document.createElement('h4');
  contactH4.textContent = 'Contact Us'; // Hardcoded as per original HTML
  contactCol.append(contactH4);

  if (contactInfoCell) {
    const p = document.createElement('p');
    p.innerHTML = contactInfoCell.innerHTML; // richtext field
    contactCol.append(p);
    moveInstrumentation(contactInfoCell, p);
  }

  const telNoUl = document.createElement('ul');
  telNoUl.classList.add('tel-no');

  if (telLinkCell && telLabelCell) {
    const telLi = document.createElement('li');
    const telLink = telLinkCell.querySelector('a');
    if (telLink) {
      const telAnchor = document.createElement('a');
      telAnchor.href = telLink.href;
      telAnchor.textContent = telLink.href.replace('tel:', ''); // Use href for text content as per original
      telLi.textContent = `${telLabelCell.textContent.trim()}: `;
      telLi.append(telAnchor);
      telNoUl.append(telLi);
      moveInstrumentation(telLinkCell, telAnchor);
      moveInstrumentation(telLabelCell, telLi);
    }
  }

  if (faxNumberCell && faxLabelCell) {
    const faxLi = document.createElement('li');
    faxLi.textContent = `${faxLabelCell.textContent.trim()}: ${faxNumberCell.textContent.trim()}`;
    telNoUl.append(faxLi);
    moveInstrumentation(faxNumberCell, faxLi);
    moveInstrumentation(faxLabelCell, faxLi);
  }

  contactCol.append(telNoUl);
  contactNewsletterRow.append(contactCol);

  const newsletterSocialCol = document.createElement('div');
  newsletterSocialCol.classList.add('col-md-6');

  if (newsletterPlaceholderCell || newsletterButtonLabelCell) {
    const inputFtr = document.createElement('div');
    inputFtr.classList.add('input-ftr', 'd-none'); // Added d-none as per original HTML

    if (newsletterPlaceholderCell) {
      const input = document.createElement('input');
      input.name = 'ctl00$footer$txtemail';
      input.type = 'text';
      input.id = 'ctl00_footer_txtemail';
      input.placeholder = newsletterPlaceholderCell.textContent.trim(); // Use textContent for placeholder
      inputFtr.append(input);
      moveInstrumentation(newsletterPlaceholderCell, input);
    }

    if (newsletterButtonLabelCell) {
      const linksubscribe = document.createElement('a');
      linksubscribe.id = 'ctl00_footer_linksubscribe';
      linksubscribe.classList.add('read-more');
      linksubscribe.href = 'javascript:void(0)'; // Hardcoded as per original HTML
      const span = document.createElement('span');
      span.classList.add('lnr', 'lnr-chevron-right');
      linksubscribe.append(span);
      inputFtr.append(linksubscribe);
      moveInstrumentation(newsletterButtonLabelCell, linksubscribe);
    }
    newsletterSocialCol.append(inputFtr);
  }

  const socialInfo = document.createElement('div');
  socialInfo.classList.add('social-info');

  const followUsH4 = document.createElement('h4');
  followUsH4.textContent = 'Follow Us'; // Hardcoded as per original HTML
  socialInfo.append(followUsH4);

  if (footerSocialLinkRows.length > 0) {
    const socialUl = document.createElement('ul');
    footerSocialLinkRows.forEach((row) => {
      const socialLinkCell = row.querySelector('a'); // footer-social-item has only one cell: socialLink
      if (socialLinkCell) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = socialLinkCell.href;
        a.target = '_blank';
        a.setAttribute('aria-label', socialLinkCell.href.split('/').slice(-2, -1)[0] || 'social link');

        const i = document.createElement('i');
        i.classList.add('fab');

        if (socialLinkCell.href.includes('facebook')) {
          li.classList.add('fb');
          i.classList.add('fa-facebook-f');
        } else if (socialLinkCell.href.includes('twitter')) {
          li.classList.add('twit');
          i.classList.add('fa-twitter');
        } else if (socialLinkCell.href.includes('youtube')) {
          li.classList.add('you-t');
          i.classList.add('fa-youtube');
        } else if (socialLinkCell.href.includes('instagram')) {
          li.classList.add('insta');
          i.classList.add('fa-instagram');
        } else if (socialLinkCell.href.includes('linkedin')) {
          li.classList.add('linked');
          i.classList.add('fa-linkedin-in');
        }
        a.append(i);
        li.append(a);
        socialUl.append(li);
        moveInstrumentation(row, li); // Move instrumentation for the social link row to the list item
      }
    });
    socialInfo.append(socialUl);
  }
  newsletterSocialCol.append(socialInfo);

  if (designedByCell) {
    const designedByP = document.createElement('p');
    designedByP.innerHTML = designedByCell.innerHTML; // richtext field
    newsletterSocialCol.append(designedByP);
    moveInstrumentation(designedByCell, designedByP);
  }

  contactNewsletterRow.append(newsletterSocialCol);
  colMd5.append(contactNewsletterRow);
  mainRow.append(colMd5);

  root.append(mainRow);
  block.replaceChildren(root);

  // Optimize images (if any, though none expected in footer)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
