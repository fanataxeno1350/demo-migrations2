import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // If there's no anchor but there's text content, wrap it in a span
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
      nested.remove(); // Remove the original ul from li
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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Reordered to match BlockJson model exactly
  const [
    logoRow,
    logoLinkRow,
    siteNameRow,
    newsletterTitleRow,
    newsletterDescriptionRow,
    newsletterFormActionRow,
    newsletterInputPlaceholderRow,
    newsletterButtonLabelRow,
    // footerSections is a container field, its item rows follow
    copyrightRow, // This is block.children[8] per the model
    ...footerSectionRows // Remaining rows are footer sections
  ] = children;

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  const row = document.createElement('div');
  row.classList.add('row', 'gy-5');

  // Left column: Logo, Site Name, Newsletter
  const leftCol = document.createElement('div');
  leftCol.classList.add('col-lg-6', 'col-12');

  const logoLink = document.createElement('a');
  logoLink.classList.add('footer-logo', 'd-flex', 'align-items-center');
  const logoHref = logoLinkRow?.querySelector('a')?.href || '#';
  logoLink.href = logoHref;
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('img-fluid');
      moveInstrumentation(img, optimizedImg);
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoLink);

  const siteName = document.createElement('h2');
  siteName.textContent = siteNameRow?.textContent.trim() || '';
  moveInstrumentation(siteNameRow, siteName);
  logoLink.append(siteName);
  leftCol.append(logoLink);

  const newsletterTitle = document.createElement('h3');
  newsletterTitle.textContent = newsletterTitleRow?.textContent.trim() || '';
  moveInstrumentation(newsletterTitleRow, newsletterTitle);
  leftCol.append(newsletterTitle);

  const newsletterDescription = document.createElement('p');
  newsletterDescription.textContent = newsletterDescriptionRow?.textContent.trim() || '';
  moveInstrumentation(newsletterDescriptionRow, newsletterDescription);
  leftCol.append(newsletterDescription);

  const newsletterForm = document.createElement('form');
  newsletterForm.classList.add('d-flex', 'flex-wrap');
  newsletterForm.action = newsletterFormActionRow?.querySelector('a')?.href || '#';
  newsletterForm.method = 'post'; // Assuming post method from original HTML
  moveInstrumentation(newsletterFormActionRow, newsletterForm);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = newsletterInputPlaceholderRow?.textContent.trim() || 'Enter Your Email';
  moveInstrumentation(newsletterInputPlaceholderRow, emailInput);
  newsletterForm.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  subscribeButton.textContent = newsletterButtonLabelRow?.textContent.trim() || 'Subscribe';
  moveInstrumentation(newsletterButtonLabelRow, subscribeButton);
  newsletterForm.append(subscribeButton);
  leftCol.append(newsletterForm);

  row.append(leftCol);

  // Right columns: Footer Sections
  footerSectionRows.forEach((sectionRow) => {
    const [titleCell, sectionLinksCell, hierarchyTreeCell] = [...sectionRow.children];

    const rightCol = document.createElement('div');
    rightCol.classList.add('col-lg-3', 'col-6');

    const sectionTitle = document.createElement('h5');
    sectionTitle.textContent = titleCell?.textContent.trim() || '';
    moveInstrumentation(titleCell, sectionTitle);
    rightCol.append(sectionTitle);

    const ul = document.createElement('ul');
    ul.classList.add('d-flex', 'flex-column', 'useful-links-list');

    const authoredUl = hierarchyTreeCell?.querySelector('ul');
    if (authoredUl) {
      // Move instrumentation from the original cell to the new ul
      moveInstrumentation(hierarchyTreeCell, ul);
      // Append children from authoredUl to the new ul
      while (authoredUl.firstChild) {
        ul.append(authoredUl.firstChild);
      }
      transformNestedLists(ul);
    } else {
      // Fallback to sectionLinks if hierarchy-tree is empty or not a UL
      const sectionLinksHtml = sectionLinksCell?.innerHTML;
      if (sectionLinksHtml) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sectionLinksHtml;
        // Move instrumentation from the original cell to the tempDiv
        moveInstrumentation(sectionLinksCell, tempDiv);
        const links = tempDiv.querySelectorAll('a');
        links.forEach((link) => {
          const li = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.href = link.href;
          anchor.textContent = link.textContent.trim();
          li.append(anchor);
          ul.append(li);
        });
      }
    }
    // moveInstrumentation(sectionRow, ul); // This was moving the whole row instrumentation to UL, which is wrong.
    // Instrumentation for the row is handled by its cells.
    rightCol.append(ul);
    row.append(rightCol);
  });

  container.append(row);
  footer.append(container);

  // Copyright
  const copyright = document.createElement('h5');
  copyright.classList.add('text-center', 'mt-6');
  copyright.textContent = copyrightRow?.textContent.trim() || '';
  moveInstrumentation(copyrightRow, copyright);
  footer.append(copyright);

  block.replaceChildren(footer);

  // Optimize images after all DOM manipulation
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
