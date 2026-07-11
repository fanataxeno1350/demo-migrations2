import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [contentRow] = [...block.children];

  const section = document.createElement('div'); // Changed to div to match original HTML structure
  section.classList.add('text'); // Class from ORIGINAL HTML

  const textContainer = document.createElement('div');
  textContainer.classList.add('cmp-text'); // Class from ORIGINAL HTML
  moveInstrumentation(contentRow, textContainer);

  // The content cell is the first child of the contentRow, which is a richtext field.
  // We need to get its innerHTML to preserve any HTML structure like <p>, <h1>, etc.
  const contentCell = contentRow.children[0]; // Access the first cell of the row
  if (contentCell) {
    textContainer.innerHTML = contentCell.innerHTML;
  }

  section.append(textContainer);
  block.replaceChildren(section);

  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
