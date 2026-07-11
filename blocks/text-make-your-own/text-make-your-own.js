import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [contentRow] = [...block.children];

  const textContainer = document.createElement('div');
  textContainer.classList.add('text', 'desc-1'); // Classes from ORIGINAL HTML

  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text'); // Class from ORIGINAL HTML

  if (contentRow) {
    // The contentCell is the div directly inside the row, which contains the richtext HTML.
    // The model specifies 'content' as richtext, so we need to read innerHTML.
    const contentCell = contentRow.children[0]; // Access the first (and only) cell in the row
    if (contentCell) {
      // moveInstrumentation should be called on the original row, and its content moved to the new element.
      moveInstrumentation(contentRow, cmpText);
      // For richtext, assign innerHTML directly from the cell.
      cmpText.innerHTML = contentCell.innerHTML;
    }
  }

  textContainer.append(cmpText);
  block.replaceChildren(textContainer);

  textContainer.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be called on the original img element, and its instrumentation moved to the new img within the optimized picture.
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
