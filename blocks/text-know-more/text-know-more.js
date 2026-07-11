import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [contentRow] = [...block.children];

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('text', 'desc-1'); // Classes from ORIGINAL HTML

  const cmpTextDiv = document.createElement('div');
  cmpTextDiv.classList.add('cmp-text'); // Class from ORIGINAL HTML

  if (contentRow) {
    const [contentCell] = [...contentRow.children]; // FIXED: named destructuring
    if (contentCell) {
      moveInstrumentation(contentRow, cmpTextDiv);
      cmpTextDiv.innerHTML = contentCell.innerHTML;
    }
  }

  contentWrapper.append(cmpTextDiv);

  block.replaceChildren(contentWrapper);

  contentWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
