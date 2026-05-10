import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-det-2'); // From ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // From ORIGINAL HTML

  const brndProduct = document.createElement('div');
  brndProduct.classList.add('brnd-product'); // From ORIGINAL HTML

  // First row is the headline
  const [headlineRow, ...productRows] = children; // Destructure for headline and product rows
  if (headlineRow) {
    const headlineText = headlineRow.children[0]?.textContent.trim();
    if (headlineText) {
      const h4 = document.createElement('h4');
      moveInstrumentation(headlineRow, h4);
      h4.textContent = headlineText;
      brndProduct.append(h4);
    }
  }

  const ul = document.createElement('ul');

  // Remaining rows are product items
  productRows.forEach((row) => {
    const [imageCell, labelCell] = [...row.children];

    if (imageCell && labelCell) {
      const li = document.createElement('li');
      const brandImgSec = document.createElement('div');
      brandImgSec.classList.add('brand_img_sec'); // From ORIGINAL HTML

      const anchor = document.createElement('a');
      // The original HTML has empty <a> tags, so we create one without href for now.
      // If the model changes to include a link field, update this.

      const brndProductImg = document.createElement('div');
      brndProductImg.classList.add('brnd-product-img'); // From ORIGINAL HTML

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('img-fluid', 'lozad'); // From ORIGINAL HTML
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          brndProductImg.append(optimizedPic);
        }
      }

      const p = document.createElement('p');
      p.textContent = labelCell.textContent.trim();
      moveInstrumentation(row, p); // Move instrumentation from row to the paragraph as it's the main content

      anchor.append(brndProductImg, p);
      brandImgSec.append(anchor);
      li.append(brandImgSec);
      ul.append(li);
    }
  });

  brndProduct.append(ul);
  container.append(brndProduct);
  section.append(container);

  block.replaceChildren(section);

  // The original code had a redundant createOptimizedPicture call here.
  // The pictures are already optimized and instrumented when processing productRows.
  // This block is removed to prevent double processing and potential issues.
}
