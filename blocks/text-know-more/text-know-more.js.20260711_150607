import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow] = [...block.children];

  const textWrapper = document.createElement('div');
  textWrapper.classList.add('text', 'desc-1'); // Apply classes from ORIGINAL HTML

  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text'); // Apply classes from ORIGINAL HTML

  if (headingRow) {
    // The heading field is richtext, so its content is directly inside the cell div.
    // Move instrumentation from the authored row to the new cmpText div.
    const [headingCell] = [...headingRow.children]; // Use named destructuring
    moveInstrumentation(headingCell, cmpText); // Move instrumentation from the cell
    cmpText.innerHTML = headingCell?.innerHTML || '';
  }

  textWrapper.append(cmpText);
  block.replaceChildren(textWrapper);

  // Image optimization (if any images were present in the richtext)
  textWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
