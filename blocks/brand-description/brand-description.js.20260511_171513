import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, descriptionRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-det-1'); // This is the root wrapper, not the block itself

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const brandsDetCont = document.createElement('div');
  brandsDetCont.classList.add('brands-det-cont');
  container.append(brandsDetCont);

  if (headlineRow) {
    const headlineCell = headlineRow.children[0]; // Access the first (and only) cell directly
    if (headlineCell) {
      const h3 = document.createElement('h3');
      moveInstrumentation(headlineRow, h3);
      h3.innerHTML = headlineCell.innerHTML; // Richtext content, use innerHTML
      brandsDetCont.append(h3);
    }
  }

  if (descriptionRow) {
    const descriptionCell = descriptionRow.children[0]; // Access the first (and only) cell directly
    if (descriptionCell) {
      const p = document.createElement('p');
      moveInstrumentation(descriptionRow, p);
      p.innerHTML = descriptionCell.innerHTML; // Richtext content, use innerHTML
      brandsDetCont.append(p);
    }
  }

  block.replaceChildren(section);

  // Image optimization (if any images were present in richtext fields)
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
