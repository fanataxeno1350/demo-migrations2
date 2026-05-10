import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, descriptionRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-det-1');
  // moveInstrumentation(block, section); // Instrumentation should be moved from block to the root element that replaces it.

  const container = document.createElement('div');
  container.classList.add('container');

  const brandsDetCont = document.createElement('div');
  brandsDetCont.classList.add('brands-det-cont');

  if (headlineRow) {
    // headlineRow is a row element, its first child is the cell div.
    // The cell itself contains the richtext HTML.
    const headlineCell = headlineRow.children[0]; // Access the cell directly
    if (headlineCell) {
      const h3 = document.createElement('h3');
      moveInstrumentation(headlineRow, h3); // Move instrumentation from the row to the new h3
      h3.innerHTML = headlineCell.innerHTML; // Read innerHTML from the cell
      brandsDetCont.append(h3);
    }
  }

  if (descriptionRow) {
    // descriptionRow is a row element, its first child is the cell div.
    // The cell itself contains the richtext HTML.
    const descriptionCell = descriptionRow.children[0]; // Access the cell directly
    if (descriptionCell) {
      const p = document.createElement('p');
      moveInstrumentation(descriptionRow, p); // Move instrumentation from the row to the new p
      p.innerHTML = descriptionCell.innerHTML; // Read innerHTML from the cell
      brandsDetCont.append(p);
    }
  }

  container.append(brandsDetCont);
  section.append(container);
  moveInstrumentation(block, section); // Move instrumentation from the original block to the new root section
  block.replaceChildren(section);

  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
