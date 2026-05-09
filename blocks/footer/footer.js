import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, originalCell) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Apply classes from original HTML to <a> and <li> if they exist
    if (anchor) {
      // Assuming a generic class for nav links if not explicitly provided in original HTML for nested links
      // Based on original HTML, top-level <a> inside <li> don't have specific classes,
      // but if they were part of a useful-links-list, they might inherit.
      // For now, no specific classes are added to <a> inside <li> based on the provided original HTML.
    }
    li.classList.add('list-item'); // Assuming a generic list item class if not explicitly provided

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
      // No specific class for sub-wrapper in original HTML, using a generic one for functionality
      // If original HTML had a class for this, it would be used.
      // For now, no class is added to subWrap based on the provided original HTML.
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
  // Move instrumentation for the entire transformed list, linking it to the original cell
  moveInstrumentation(originalCell, rootUl);
}

export default function decorate(block) {
  const children = [...block.children];

  // The BlockJson model shows 10 root fields, then item rows.
  // The 'linkSections' field is a container, so it doesn't correspond to a single row.
  // The 9th row (index 8) is 'copyrightRow'.
  const [
    logoRow,
    logoLinkRow,
    brandTitleRow,
    newsletterTitleRow,
    newsletterDescriptionRow,
    newsletterFormActionRow,
    newsletterEmailPlaceholderRow,
    newsletterButtonLabelRow,
    copyrightRow, // This is the 9th root field, index 8. The container field 'linkSections' has no corresponding row.
    ...itemRows // All subsequent rows are item rows for 'linkSections'
  ] = children;

  const footer = document.createElement('footer');
  const container = document.createElement('div');
  container.classList.add('container');
  footer.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gy-5');
  container.append(row);

  // Left Section (Logo, Brand Title, Newsletter)
  const leftCol = document.createElement('div');
  leftCol.classList.add('col-lg-6', 'col-12');
  row.append(leftCol);

  const footerLogoLink = document.createElement('a');
  footerLogoLink.classList.add('footer-logo', 'd-flex', 'align-items-center');
  const logoHref = logoLinkRow?.querySelector('a')?.href || '#';
  footerLogoLink.href = logoHref;
  moveInstrumentation(logoLinkRow, footerLogoLink);

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    footerLogoLink.append(optimizedPic);
  }

  const brandTitle = document.createElement('h2');
  brandTitle.textContent = brandTitleRow?.textContent.trim() || '';
  moveInstrumentation(brandTitleRow, brandTitle);
  footerLogoLink.append(brandTitle);
  leftCol.append(footerLogoLink);

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
  newsletterForm.method = 'post';
  moveInstrumentation(newsletterFormActionRow, newsletterForm);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  emailInput.placeholder = newsletterEmailPlaceholderRow?.textContent.trim() || '';
  moveInstrumentation(newsletterEmailPlaceholderRow, emailInput);
  newsletterForm.append(emailInput);

  const subscribeButton = document.createElement('button');
  subscribeButton.classList.add('btn', 'btn-primary', 'subscribe-btn');
  subscribeButton.textContent = newsletterButtonLabelRow?.textContent.trim() || '';
  moveInstrumentation(newsletterButtonLabelRow, subscribeButton);
  newsletterForm.append(subscribeButton);
  leftCol.append(newsletterForm);

  // Right Section (Link Sections)
  // The 'linkSections' container field itself doesn't have a corresponding row in block.children
  // but its item rows follow the root fields.
  // We need a wrapper for these sections, but no specific instrumentation for the container itself.
  // The instrumentation for individual section items will be moved.
  const linkSectionsWrapper = document.createElement('div');
  // No direct instrumentation for 'linkSectionsContainerRow' as it was a placeholder.
  // The itemRows themselves will be instrumented.

  itemRows
    .forEach((sectionRow) => {
      // Distinguish between 'footer-link-section-item' (3 cells: title, container, richtext)
      // and 'footer-link-item' (2 cells: label, link)
      const cells = [...sectionRow.children];

      if (cells.length === 2) { // Could be footer-link-section-item (title, richtext) OR footer-link-item (label, link)
        // Check for richtext (ul) to distinguish footer-link-section-item
        const hasRichtext = cells[1]?.querySelector('ul');
        if (hasRichtext) { // This is a footer-link-section-item (sectionTitle, hierarchy-tree)
          const [sectionTitleCell, hierarchyTreeCell] = cells;

          const col = document.createElement('div');
          col.classList.add('col-lg-3', 'col-6');
          row.append(col);

          const sectionTitle = document.createElement('h5');
          sectionTitle.textContent = sectionTitleCell?.textContent.trim() || '';
          moveInstrumentation(sectionTitleCell, sectionTitle);
          col.append(sectionTitle);

          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = hierarchyTreeCell?.innerHTML || '';
          const subList = tempDiv.querySelector('ul');

          if (subList) {
            const ul = document.createElement('ul');
            ul.classList.add('d-flex', 'flex-column', 'useful-links-list');
            // Apply classes to nested elements within the richtext
            subList.querySelectorAll('a').forEach(a => a.classList.add('list-item-link')); // Example class, adjust as needed
            subList.querySelectorAll('li').forEach(li => li.classList.add('list-item'));
            subList.querySelectorAll('ul').forEach(nestedUl => nestedUl.classList.add('nested-list'));

            transformNestedLists(subList, hierarchyTreeCell); // Pass the original cell for instrumentation
            while (subList.firstChild) {
              ul.append(subList.firstChild);
            }
            moveInstrumentation(sectionRow, ul); // Instrument the entire ul with the sectionRow
            col.append(ul);
          }
        } else { // This is a footer-link-item (label, link)
          // The current structure doesn't seem to explicitly handle footer-link-item as separate columns
          // but rather as nested items within footer-link-section-item.
          // If footer-link-item rows are meant to be separate top-level columns, this logic needs adjustment.
          // Based on the original HTML, all links are within the 'useful-links-list' under a section title.
          // This block might indicate a mismatch between model and original HTML structure for 'footer-link-item'.
          // For now, assuming footer-link-item is always nested within a hierarchy-tree.
          // If they are meant to be separate, they would need their own col.
          // The current code only processes `footer-link-section-item` as top-level columns.
        }
      }
    });

  // Copyright
  const copyrightText = document.createElement('h5');
  copyrightText.classList.add('text-center', 'mt-6');
  copyrightText.textContent = copyrightRow?.textContent.trim() || '';
  moveInstrumentation(copyrightRow, copyrightText);
  footer.append(copyrightText);

  block.replaceChildren(footer);
}
