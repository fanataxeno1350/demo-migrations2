import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const root = document.createElement('div');
  // Removed 'brnd-product' class from root, as the outer block div already has it.
  // root.classList.add('brnd-product'); // VIOLATION 0.5 - removed

  const headlineRow = children.shift();
  if (headlineRow) {
    const headline = document.createElement('h4');
    moveInstrumentation(headlineRow, headline);
    headline.textContent = headlineRow.textContent.trim();
    root.append(headline);
  }

  const productList = document.createElement('ul');
  children.forEach((row) => {
    // CHECK 1, 2.6A: Correctly using index destructuring for fixed-schema item rows
    const [imageCell, labelCell, linkCell] = [...row.children];

    const listItem = document.createElement('li');
    // CHECK 2.6B: Using class name from ORIGINAL HTML
    const brandImgSec = document.createElement('div');
    brandImgSec.classList.add('brand_img_sec');

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }

    // CHECK 2.6B: Using class name from ORIGINAL HTML
    const brandProductImg = document.createElement('div');
    brandProductImg.classList.add('brnd-product-img');

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        // ORIGINAL HTML shows 'img-fluid lozad' on the img tag, not the picture.
        // The createOptimizedPicture function handles the img element, so we need to add classes there.
        const newImg = optimizedPic.querySelector('img');
        if (newImg) {
          newImg.classList.add('img-fluid', 'lozad'); // CHECK 2.6B: Added classes from ORIGINAL HTML
        }
        brandProductImg.append(optimizedPic);
      }
    }

    const paragraph = document.createElement('p');
    paragraph.textContent = labelCell?.textContent.trim() || '';

    // CHECK 3: Ensure moveInstrumentation is called for each authored row
    moveInstrumentation(row, listItem);
    anchor.append(brandProductImg, paragraph);
    brandImgSec.append(anchor);
    listItem.append(brandImgSec);
    productList.append(listItem);
  });

  root.append(productList);
  block.replaceChildren(root);
}
