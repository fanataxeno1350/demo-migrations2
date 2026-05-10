import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const rootDiv = document.createElement('div');
  rootDiv.classList.add('brnd-product'); // Class from ORIGINAL HTML

  // First row is the familyTitle
  const [familyTitleRow, ...productItemRows] = children; // Destructure first row and remaining product rows
  if (familyTitleRow) {
    const familyTitle = document.createElement('h4');
    moveInstrumentation(familyTitleRow, familyTitle);
    const [familyTitleCell] = [...familyTitleRow.children]; // Destructure cell from familyTitleRow
    familyTitle.textContent = familyTitleCell?.textContent.trim();
    rootDiv.append(familyTitle);
  }

  // Remaining rows are product items
  const productList = document.createElement('ul');

  productItemRows.forEach((row) => {
    const [imageCell, labelCell] = [...row.children]; // Correct: named destructuring

    const listItem = document.createElement('li');
    moveInstrumentation(row, listItem); // Move instrumentation from row to listItem

    const brandImgSec = document.createElement('div');
    brandImgSec.classList.add('brand_img_sec'); // Class from ORIGINAL HTML

    const anchor = document.createElement('a');
    // The original HTML has an <a> tag wrapping the image and text,
    // but the block model for brand-product-item does not have a link field.
    // So, we create a dummy anchor for structural fidelity, but without a href.
    // If a link field were added to the model, its href would be used here.

    const brndProductImg = document.createElement('div');
    brndProductImg.classList.add('brnd-product-img'); // Class from ORIGINAL HTML

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          brndProductImg.append(optimizedPic);
        }
      }
    }

    const productLabel = document.createElement('p');
    if (labelCell) {
      productLabel.textContent = labelCell.textContent.trim();
    }

    anchor.append(brndProductImg, productLabel);
    brandImgSec.append(anchor);
    listItem.append(brandImgSec);
    productList.append(listItem);
  });

  rootDiv.append(productList);
  block.replaceChildren(rootDiv);
}
