import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, descriptionRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-det-1');
  // moveInstrumentation(block, section); // Instrumentation should be moved to the root element that replaces the block.

  const container = document.createElement('div');
  container.classList.add('container');

  const brandsDetCont = document.createElement('div');
  brandsDetCont.classList.add('brands-det-cont');

  if (headlineRow) {
    // headlineRow is a row element, its first child is the cell containing the richtext.
    // querySelector('div') on a richtext cell will always return null as content is direct.
    const headlineCell = headlineRow.children[0];
    if (headlineCell) {
      const h3 = document.createElement('h3');
      moveInstrumentation(headlineRow, h3); // Move instrumentation from the row to the new element
      h3.innerHTML = headlineCell.innerHTML; // Read innerHTML directly from the cell
      brandsDetCont.append(h3);
    }
  }

  if (descriptionRow) {
    // descriptionRow is a row element, its first child is the cell containing the richtext.
    // querySelector('div') on a richtext cell will always return null as content is direct.
    const descriptionCell = descriptionRow.children[0];
    if (descriptionCell) {
      const p = document.createElement('p');
      moveInstrumentation(descriptionRow, p); // Move instrumentation from the row to the new element
      p.innerHTML = descriptionCell.innerHTML; // Read innerHTML directly from the cell
      brandsDetCont.append(p);
    }
  }

  container.append(brandsDetCont);
  section.append(container);
  moveInstrumentation(block, section); // Move instrumentation from the block to the new root section
  block.replaceChildren(section);

  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
