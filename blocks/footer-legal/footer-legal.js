import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const legalTextRow = children[0];
  const footerLinkItemRows = children.slice(1); // All subsequent rows are footer-link-items

  const legalParagraph = document.createElement('p');
  legalParagraph.classList.add('site-footer-legal');
  moveInstrumentation(legalTextRow, legalParagraph);

  if (legalTextRow) {
    legalParagraph.textContent = legalTextRow.textContent.trim();
  }

  footerLinkItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const anchor = document.createElement('a');
    // Corrected: Read href from the <a> tag inside the aem-content cell
    const foundLink = linkCell?.querySelector('a');

    if (foundLink) {
      anchor.href = foundLink.href;
    }
    if (labelCell) {
      anchor.textContent = labelCell.textContent.trim();
    }
    moveInstrumentation(row, anchor);
    legalParagraph.append(anchor);
  });

  block.replaceChildren(legalParagraph);
}

