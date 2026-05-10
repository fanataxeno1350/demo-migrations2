import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-det-2');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const brndProduct = document.createElement('div');
  brndProduct.classList.add('brnd-product');
  container.append(brndProduct);

  const familyTitleRow = children.shift(); // First row is familyTitle
  if (familyTitleRow) {
    const h4 = document.createElement('h4');
    moveInstrumentation(familyTitleRow, h4);
    h4.textContent = familyTitleRow.textContent.trim();
    brndProduct.append(h4);
  }

  const ul = document.createElement('ul');
  brndProduct.append(ul);

  children.forEach((row) => {
    // Each remaining row is a brand-product-item
    // Fixed schema: [image, title]
    const [imageCell, titleCell] = [...row.children];

    if (imageCell && titleCell) {
      const li = document.createElement('li');
      moveInstrumentation(row, li);

      const brandImgSec = document.createElement('div');
      brandImgSec.classList.add('brand_img_sec');
      li.append(brandImgSec);

      const anchor = document.createElement('a');
      // No href provided in the block structure, so leave it empty as per original HTML
      anchor.href = '';
      brandImgSec.append(anchor);

      const brndProductImg = document.createElement('div');
      brndProductImg.classList.add('brnd-product-img');
      anchor.append(brndProductImg);

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        moveInstrumentation(img, optimizedImg);
        optimizedImg.classList.add('img-fluid', 'lozad'); // Add classes from original HTML
        brndProductImg.append(optimizedPic);
      }

      const p = document.createElement('p');
      p.textContent = titleCell.textContent.trim();
      anchor.append(p);

      ul.append(li);
    }
  });

  block.replaceChildren(section);
}
