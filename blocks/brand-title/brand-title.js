import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('inner-title', 'mobile-inner-title');

  const pageTitleDiv = document.createElement('div');
  pageTitleDiv.classList.add('page-title');

  const h1 = document.createElement('h1');
  if (titleRow) {
    // Access the cell div directly from row.children[0]
    const titleCell = titleRow.children[0];
    if (titleCell) {
      moveInstrumentation(titleRow, h1);
      h1.textContent = titleCell.textContent.trim();
    }
  }

  pageTitleDiv.append(h1);
  section.append(pageTitleDiv);

  block.replaceChildren(section);

  // Removed image optimization loop as there are no images in the block structure
  // and the original HTML does not contain any pictures.
}
