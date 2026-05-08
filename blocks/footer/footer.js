import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('list-item'); // Add class from ORIGINAL HTML
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      anchor.classList.add('nav-menu-item'); // Add class from ORIGINAL HTML
    } else {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        span.classList.add('nav-menu-item'); // Add class from ORIGINAL HTML
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.classList.add('sub-menu'); // Add class from ORIGINAL HTML
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
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    siteTitleRow,
    newsletterTitleRow,
    newsletterDescriptionRow,
    newsletterFormActionRow,
    newsletterInputPlaceholderRow,
    newsletterButtonLabelRow,
    ...itemAndCopyrightRows
  ] = children;

  const copyrightRow = itemAndCopyrightRows.pop();
  const itemRows = itemAndCopyrightRows;

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  footer.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gy-5');
  container.append(row);

  // Col 1: Logo, Site Title, Newsletter
  const col1 = document.createElement('div');
  col1.classList.add('col-lg-6', 'col-12');
  row.append(col1);

  const logoLink = document.createElement('a');
  logoLink.classList.add('footer-logo', 'd-flex', 'align-items-center');
  const logoHref = logoLinkRow.querySelector('a')?.href || '/';
  logoLink.href = logoHref;
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid');
      optimizedPic.querySelector('img').width = 40;
    }
  }
  moveInstrumentation(logoRow, logoLink);

  const siteTitle = document.createElement('h2');
  siteTitle.textContent = siteTitleRow.textContent.trim();
  moveInstrumentation(siteTitleRow, siteTitle);
  logoLink.append(siteTitle);
  col1.append(logoLink);

  const newsletterTitle = document.createElement('h3');
  newsletterTitle.textContent = newsletterTitleRow.textContent.trim();
  moveInstrumentation(newsletterTitleRow, newsletterTitle);
  col1.append(newsletterTitle);

  const newsletterDescription = document.createElement('p');
  newsletterDescription.textContent = newsletterDescriptionRow.textContent.trim();
  moveInstrumentation(newsletterDescriptionRow, newsletterDescription);
  col1.append(newsletterDescription);

  const newsletterForm = document.createElement('form');
  newsletterForm.classList.add('d-flex', 'flex-wrap');
  newsletterForm.action = newsletterFormActionRow.querySelector('a')?.href || '#';
  newsletterForm.method = 'post';
  moveInstrumentation(newsletterFormActionRow, newsletterForm);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = newsletterInputPlaceholderRow.textContent.trim();
  moveInstrumentation(newsletterInputPlaceholderRow, emailInput);
  newsletterForm.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  subscribeButton.textContent = newsletterButtonLabelRow.textContent.trim();
  moveInstrumentation(newsletterButtonLabelRow, subscribeButton);
  newsletterForm.append(subscribeButton);
  col1.append(newsletterForm);

  // Cols 2 & 3: Footer Link Sections
  itemRows.forEach((itemRow) => {
    // Determine if it's a footer-link-section or footer-link-item
    const cells = [...itemRow.children];
    if (cells.length === 2 && cells[1].querySelector('ul')) { // footer-link-section
      const [sectionTitleCell, hierarchyTreeCell] = cells;

      const col = document.createElement('div');
      col.classList.add('col-lg-3', 'col-6');
      row.append(col);

      const sectionTitle = document.createElement('h5');
      sectionTitle.textContent = sectionTitleCell.textContent.trim();
      moveInstrumentation(sectionTitleCell, sectionTitle);
      col.append(sectionTitle);

      const ul = hierarchyTreeCell.querySelector('ul');
      if (ul) {
        const usefulLinksList = document.createElement('ul');
        usefulLinksList.classList.add('d-flex', 'flex-column', 'useful-links-list');
        // Use a temporary div to preserve instrumentation and apply classes
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
        moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell
        transformNestedLists(tempDiv); // Transform nested lists within the tempDiv

        // Append children from tempDiv to usefulLinksList
        while (tempDiv.firstChild) {
          usefulLinksList.append(tempDiv.firstChild);
        }
        col.append(usefulLinksList);
      }
      moveInstrumentation(itemRow, col);
    } else if (cells.length === 2 && cells[1].querySelector('a')) { // footer-link-item
      const [labelCell, linkCell] = cells;

      // This block handles individual footer-link-items, which are nested under footer-link-section
      // The current structure doesn't explicitly create a new column for each individual link item,
      // but rather expects them to be part of the hierarchy-tree.
      // If these items were meant to be top-level columns, the logic would need adjustment.
      // For now, we'll assume they are part of the hierarchy-tree and this else-if might not be hit
      // if the hierarchy-tree handles all links.
      // If they are standalone, they would need a parent container to append to.
      // Given the ORIGINAL HTML, these individual link items are not rendered as separate columns.
      // They are expected to be part of the 'useful-links-list' structure.
      // This part of the code might indicate a mismatch between the model and intended rendering.
      // For now, we'll skip explicit rendering of standalone footer-link-item rows as columns.
      // If the intent was to have them as separate columns, the block structure or rendering logic
      // would need to be re-evaluated.
      // As per the provided ORIGINAL HTML, all links are within <ul><li> structures.
    }
  });

  // Copyright
  const copyright = document.createElement('h5');
  copyright.classList.add('text-center', 'mt-6');
  copyright.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyright);
  footer.append(copyright);

  block.replaceChildren(footer);
}
