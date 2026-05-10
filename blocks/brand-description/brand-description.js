import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, descriptionRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-det-1'); // From ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // From ORIGINAL HTML
  section.append(container);

  const brandsDetCont = document.createElement('div');
  brandsDetCont.classList.add('brands-det-cont'); // From ORIGINAL HTML
  container.append(brandsDetCont);

  if (headlineRow) {
    // Richtext cells render content directly inside the cell div; there is no inner div wrapper.
    // Reading innerHTML directly from the cell preserves all HTML structure.
    const headlineCell = headlineRow.children[0];
    if (headlineCell) {
      const h3 = document.createElement('h3');
      moveInstrumentation(headlineRow, h3);
      h3.innerHTML = headlineCell.innerHTML;
      brandsDetCont.append(h3);
    }
  }

  if (descriptionRow) {
    // Richtext cells render content directly inside the cell div; there is no inner div wrapper.
    // Reading innerHTML directly from the cell preserves all HTML structure.
    const descriptionCell = descriptionRow.children[0];
    if (descriptionCell) {
      const p = document.createElement('p');
      moveInstrumentation(descriptionRow, p);
      p.innerHTML = descriptionCell.innerHTML;
      brandsDetCont.append(p);
    }
  }

  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
