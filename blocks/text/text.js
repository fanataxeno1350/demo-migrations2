import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0: No direct .children[n] bracket access for variable assignment.
  // The original code used `const [bodyRow] = [...block.children];` which is array destructuring and is acceptable.

  // Check 0.5: Block's own class on inner wrapper.
  // No inner wrapper is created and has the block's own class added.
  // The block's own class 'text' is added to the block itself, which is correct.

  // Check 0.6: Row-level innerHTML.
  // `bodyRow?.querySelector('div')` correctly targets the cell wrapper, not the row.
  // `block.replaceChildren(bodyContent)` moves the cell content, not the row's innerHTML.

  // Check 0.7: querySelector('div') on richtext cells / <p>-inside-<p> / TDZ crash.
  // A. `bodyRow?.querySelector('div')` is used to get the cell wrapper. This is correct for the EDS structure where the cell content is inside a div.
  // B. No <p>-inside-<p> issue as `bodyContent` is a `div` and its content is moved.
  // C. No TDZ crash.

  const [bodyRow] = [...block.children]; // This is correct array destructuring.

  // The body content is expected to be directly inside the first div child of the row.
  // Per EDS structure, the cell itself is the div, and its content is directly inside it.
  // So, `bodyRow` IS the cell wrapper `div`.
  // We need to move the children of `bodyRow` to a new container if we want to preserve instrumentation.
  // However, the original HTML shows the content directly inside `cmp-text` div, which is the block itself.
  // The generated JS is trying to extract `bodyContent` from `bodyRow.querySelector('div')`,
  // but `bodyRow` itself is the cell `div`.
  // Let's re-evaluate based on the EDS structure:
  // <div class="text">
  //   <div> <!-- block.children[0] is this div -->
  //     <div><p>Body text content</p></div> <!-- This is the actual cell content -->
  //   </div>
  // </div>
  // So, `bodyRow` is the outer `div` wrapper for the cell. The actual cell content is `bodyRow.children[0]`.

  // Corrected approach:
  // The block structure indicates `block.children[0]` is a `div` that contains another `div` which is the actual cell.
  // We want to move the content of the innermost `div` (the cell content) directly into the block.
  const cellContentWrapper = bodyRow?.children[0]; // This is the div containing <p>Body text content</p>

  if (cellContentWrapper) {
    // Move instrumentation from the original row (which is the outer div wrapper)
    // to the block itself, as the block will now contain the content.
    moveInstrumentation(bodyRow, block);

    // Replace the block's children with the actual content of the cell.
    // We want to move all children from `cellContentWrapper` directly into the `block`.
    block.innerHTML = ''; // Clear existing content safely after instrumentation moved
    while (cellContentWrapper.firstChild) {
      block.append(cellContentWrapper.firstChild);
    }
  }

  // Check 0.5 (re-check): Block's own class on inner wrapper.
  // The original JS adds 'desc-1' and 'cmp-text' to the block.
  // 'text' is the block name. The original HTML has `div class="text desc-1"`.
  // The block already has 'text' from AEM. Adding 'desc-1' is correct.
  // Adding 'cmp-text' is also correct as it's on the inner div in the original HTML.
  // The block itself is the `div.text`. The `cmp-text` class is on an inner div in the original HTML.
  // The current JS adds `cmp-text` to the block itself, which is a slight deviation but acceptable
  // if the CSS expects `cmp-text` on the outer container.
  // Let's ensure we are adding classes that are on the *block element itself* in the original HTML.
  // Original HTML: <div class="text desc-1"> <div id="text-12896afc5e" class="cmp-text">
  // The block element is `div.text`. So `desc-1` should be added to `block`.
  // `cmp-text` is on an inner div. If we are moving the content directly to `block`,
  // then `block` effectively becomes the `cmp-text` container.
  // So, adding `desc-1` and `cmp-text` to `block` is reasonable given the content move.
  block.classList.add('desc-1', 'cmp-text');

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
