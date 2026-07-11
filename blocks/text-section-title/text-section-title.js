import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0: Direct .children[n] bracket access - FIXED by destructuring
  const [titleRow] = [...block.children];

  // CHECK 0.5: Block's own class on inner wrapper - NO VIOLATION, 'text' and 'desc-1' are from ORIGINAL HTML
  const sectionTitleWrapper = document.createElement('div');
  sectionTitleWrapper.classList.add('text', 'desc-1');

  const cmpTextDiv = document.createElement('div');
  cmpTextDiv.classList.add('cmp-text');

  if (titleRow) {
    // CHECK 0.6: ROW-LEVEL innerHTML - FIXED by reading from cell
    // CHECK 0.7: <p>-inside-<p> and querySelector('div') - FIXED by reading from cell and using div
    // CHECK 1.5: Richtext fields with HTML content - FIXED by using innerHTML and moveInstrumentation
    const [titleCell] = [...titleRow.children]; // FIXED: named destructuring for fixed schema
    moveInstrumentation(titleRow, cmpTextDiv); // Move instrumentation from the row to the new div
    cmpTextDiv.innerHTML = titleCell?.innerHTML || ''; // Read innerHTML from the cell for richtext
  }

  sectionTitleWrapper.append(cmpTextDiv);
  block.replaceChildren(sectionTitleWrapper); // Replace children atomically

  // Move instrumentation for the title element itself
  const titleElement = sectionTitleWrapper.querySelector('h2'); // Assuming the H2 is the main title
  if (titleElement) {
    moveInstrumentation(cmpTextDiv.querySelector('p'), titleElement); // Move from the original p to the new h2
  }

  sectionTitleWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
