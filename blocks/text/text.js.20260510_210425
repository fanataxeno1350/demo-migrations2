import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0: Replaced direct bracket access block.children[0] with destructuring
  const [bodyRow] = [...block.children];

  const textWrapper = document.createElement('div');
  // CHECK 0.5: Block's own class 'text' is NOT added to inner wrapper.
  // Added 'cmp-text' from ORIGINAL HTML.
  textWrapper.classList.add('cmp-text');

  if (bodyRow) {
    moveInstrumentation(bodyRow, textWrapper);
    // CHECK 0.7 A: Removed querySelector('div') on richtext cell.
    // CHECK 0.7 B: Used div as container for richtext to avoid <p>-inside-<p>
    // CHECK 1.5: Correctly reading richtext cell innerHTML.
    textWrapper.innerHTML = bodyRow.children[0]?.innerHTML || '';
  }

  block.replaceChildren(textWrapper);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
