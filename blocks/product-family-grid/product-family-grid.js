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

  // First row is the section title
  const [titleRow, ...productRows] = children; // Destructure first row as titleRow, rest as productRows
  if (titleRow) {
    const h4 = document.createElement('h4');
    moveInstrumentation(titleRow, h4);
    // The title row has only one cell according to the model, so access its content directly
    h4.textContent = titleRow.children[0]?.textContent.trim() || '';
    brndProduct.append(h4);
  }

  const ul = document.createElement('ul');
  brndProduct.append(ul);

  // Remaining rows are product items
  productRows.forEach((row) => {
    const [imageCell, labelCell] = [...row.children]; // Destructure cells for fixed schema

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const brandImgSec = document.createElement('div');
    brandImgSec.classList.add('brand_img_sec');
    li.append(brandImgSec);

    const anchor = document.createElement('a');
    // Original HTML has empty href for these anchors, but they are links.
    // For EDS, we should provide a meaningful href if available, or a placeholder.
    // Since the model doesn't specify a link, we'll use a placeholder.
    anchor.href = '#'; // Placeholder, ideally this would come from a model field if it were a real link
    brandImgSec.append(anchor);

    const brndProductImg = document.createElement('div');
    brndProductImg.classList.add('brnd-product-img');
    anchor.append(brndProductImg);

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          brndProductImg.append(optimizedPic);
          // Add classes from original img to the new img within optimizedPic
          const newImg = optimizedPic.querySelector('img');
          if (newImg) {
            newImg.classList.add('img-fluid', 'lozad');
            // Data-src and data-loaded are for lazy loading, handled by AEM by default or specific lazy load script
            // newImg.dataset.src = img.src;
            // newImg.dataset.loaded = 'true';
          }
        }
      }
    }

    const p = document.createElement('p');
    p.textContent = labelCell?.textContent.trim() || '';
    anchor.append(p);

    ul.append(li);
  });

  block.replaceChildren(section);
}
