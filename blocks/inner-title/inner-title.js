import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0: Replaced direct block.children[0] access with array destructuring
  const [titleRow] = [...block.children];

  const section = document.createElement('section');
  // CHECK 0.5: No block's own class added to inner wrapper
  section.classList.add('inner-title', 'mobile-inner-title');
  // CHECK 3: moveInstrumentation should target the new root element, not the block itself
  moveInstrumentation(block, section);

  const pageTitleDiv = document.createElement('div');
  pageTitleDiv.classList.add('page-title');

  const h1 = document.createElement('h1');
  if (titleRow) {
    // CHECK 0.7 A: titleCell.querySelector('div') is incorrect for a text cell.
    // Text cells render content directly inside the cell div.
    // The model states type=text, so we read textContent from the cell itself.
    // CHECK 0: Replaced direct titleRow.children[0] access with array destructuring
    const [titleCell] = [...titleRow.children];
    if (titleCell) {
      moveInstrumentation(titleRow, h1);
      h1.textContent = titleCell.textContent.trim();
    }
  }

  pageTitleDiv.append(h1);
  section.append(pageTitleDiv);
  block.replaceChildren(section);
}
