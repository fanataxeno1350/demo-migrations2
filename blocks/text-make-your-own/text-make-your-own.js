import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [contentRow] = [...block.children];

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-text'); // Class from ORIGINAL HTML

  if (contentRow) {
    // Richtext cells render content directly inside the cell <div>,
    // so we read innerHTML from the row's first child (the cell itself).
    // The model indicates 'content' is a richtext field.
    const contentCell = contentRow.children[0];
    if (contentCell) {
      moveInstrumentation(contentRow, contentDiv);
      contentDiv.innerHTML = contentCell.innerHTML;
    }
  }

  // Optimize images within the rich text content
  contentDiv.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation needs to be called on the original img element,
    // and the new element that replaces it.
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // The outer block div already has 'text' and 'desc-1' classes from AEM.
  // Adding them again to an inner wrapper or the block itself causes double CSS.
  // block.classList.add('text', 'desc-1'); // REMOVED - outer div already has these
  block.replaceChildren(contentDiv);
}

