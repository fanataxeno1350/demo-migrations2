import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const root = document.createElement('div');
  // The block element already has 'text' class from AEM.
  // The original HTML shows 'cmp-text' on an inner div, not the block itself.
  // Adding 'cmp-text' here to the root div to match original HTML structure.
  root.classList.add('cmp-text');

  // block.children[0]: field="content" label="Content" type=richtext
  const contentCell = [...block.children][0];

  if (contentCell) {
    // Richtext content is directly inside the cell div.
    // We append all children of the cell to the new root div.
    moveInstrumentation(contentCell, root); // Move instrumentation to the root div
    while (contentCell.firstChild) {
      root.append(contentCell.firstChild);
    }
  }

  // The block element already has all the AEM Grid and theme classes from the original HTML.
  // No need to add them again via classList.add() on the block itself.
  // The root div now contains the content and has the 'cmp-text' class.
  block.replaceChildren(root);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
