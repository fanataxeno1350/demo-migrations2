import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson model has one root field "content" of type richtext.
  // This means the block has one row, and that row has one cell.
  const [contentRow] = [...block.children];

  const textContainer = document.createElement('div');
  textContainer.classList.add('cmp-text');

  if (contentRow) {
    // The row has a fixed schema of 1 cell, so we can use destructuring.
    const [contentCell] = [...contentRow.children];
    if (contentCell) {
      moveInstrumentation(contentRow, textContainer);
      // Content is richtext, so use innerHTML to preserve formatting.
      textContainer.innerHTML = contentCell.innerHTML;
    }
  }

  // Apply classes from original HTML to the block itself
  block.classList.add(
    'text-align-center',
    'koi-theme',
    'pm-left-right',
    'aem-GridColumn--default--none',
    'aem-GridColumn--phone--none',
    'aem-GridColumn--phone--7',
    'aem-GridColumn',
    'aem-GridColumn--default--8',
    'aem-GridColumn--offset--phone--2',
    'aem-GridColumn--offset--default--2',
  );

  block.replaceChildren(textContainer);

  // Image optimization (if any images were present in the richtext)
  textContainer.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
