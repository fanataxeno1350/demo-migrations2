import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const productRows = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('products'); // REMOVED: The outer block div already has this class.

  const productsListWrapper = document.createElement('div');
  productsListWrapper.classList.add('products-list-wrapper');
  section.append(productsListWrapper);

  const container = document.createElement('div');
  container.classList.add('container');
  productsListWrapper.append(container);

  const productsList = document.createElement('div');
  productsList.classList.add('products-list');
  container.append(productsList);

  productRows.forEach((row, index) => {
    const [titleOffCell, imageCell, titleOnCell, moreInfoLabelCell] = [...row.children];

    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.dataset.position = index + 1;

    const anchor = document.createElement('a');
    anchor.href = '#'; // Original HTML uses href="#"
    anchor.classList.add('inner');
    anchor.addEventListener('click', (e) => e.preventDefault()); // Original HTML uses onclick="return false;"

    const titleMbOff = document.createElement('div');
    titleMbOff.classList.add('title', 'mb-off');
    titleMbOff.textContent = titleOffCell?.textContent.trim() || '';

    const picture = imageCell?.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    let optimizedPicture = null;
    if (img) {
      optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
      moveInstrumentation(img, optimizedPicture.querySelector('img'));
    }

    const productTitleSpan = document.createElement('span');
    productTitleSpan.classList.add('product-title');

    const titleMbOn = document.createElement('div');
    titleMbOn.classList.add('title', 'mb-on');
    titleMbOn.textContent = titleOnCell?.textContent.trim() || '';

    const moreInfoBtn = document.createElement('span');
    moreInfoBtn.classList.add('btn', 'more-info-btn');
    // The original HTML has data-product-id. Since the block model doesn't provide it,
    // we cannot set it dynamically. We will omit it as per Rule 16.
    moreInfoBtn.textContent = moreInfoLabelCell?.textContent.trim() || '';
    moreInfoBtn.addEventListener('click', (e) => e.preventDefault()); // Original HTML uses onclick="return false;"

    productTitleSpan.append(titleMbOn, moreInfoBtn);

    anchor.append(titleMbOff);
    if (optimizedPicture) {
      anchor.append(optimizedPicture);
    } else if (picture) {
      anchor.append(picture); // Fallback if optimization fails
    }
    anchor.append(productTitleSpan);

    moveInstrumentation(row, productDiv); // Move instrumentation from original row to new productDiv
    productDiv.append(anchor);
    productsList.append(productDiv);
  });

  block.replaceChildren(section);
}
