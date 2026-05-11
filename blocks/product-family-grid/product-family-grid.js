import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-det-2'); // This is the block's own class, but it's on the root <section> which is replacing the block.

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const brndProduct = document.createElement('div');
  brndProduct.classList.add('brnd-product');
  container.append(brndProduct);

  // The first child is the headline row
  const headlineRow = children[0];
  if (headlineRow) {
    const headlineCell = headlineRow.children[0]; // Access the cell within the headline row
    const headline = document.createElement('h4');
    moveInstrumentation(headlineRow, headline);
    headline.textContent = headlineCell.textContent.trim(); // Read from the cell
    brndProduct.append(headline);
  }

  const productList = document.createElement('ul');
  brndProduct.append(productList);

  const productRows = children.slice(1);

  productRows.forEach((row) => {
    const [imageCell, labelCell] = [...row.children]; // Correct: named destructuring for fixed schema

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const brandImgSec = document.createElement('div');
    brandImgSec.classList.add('brand_img_sec');
    li.append(brandImgSec);

    const anchor = document.createElement('a');
    // The original HTML has no href attribute on the <a> tag for these product items.
    // If a link is expected, it should come from a model field.
    // For now, we'll leave href empty as per original HTML, or add a placeholder if required by design.
    // If the labelCell contained an <a> tag, we'd extract its href.
    // Since it's type=text, there's no href in the cell itself.
    anchor.href = '#'; // Placeholder, as original HTML doesn't provide a dynamic href.
    brandImgSec.append(anchor);

    const brndProductImg = document.createElement('div');
    brndProductImg.classList.add('brnd-product-img');
    anchor.append(brndProductImg);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // The original HTML uses img-fluid and lozad classes on the img itself.
        // createOptimizedPicture creates a new picture element, so we need to apply classes to the img within it.
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        if (optimizedImg) {
          optimizedImg.classList.add('img-fluid', 'lozad'); // Add classes from original HTML
          moveInstrumentation(img, optimizedImg);
        }
        brndProductImg.append(optimizedPic);
      }
    }

    const labelP = document.createElement('p');
    if (labelCell) {
      labelP.textContent = labelCell.textContent.trim();
    }
    anchor.append(labelP);

    productList.append(li);
  });

  block.replaceChildren(section);
}
