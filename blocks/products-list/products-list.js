import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const productItems = [...block.children];

  const productsSection = document.createElement('section');
  productsSection.classList.add('products');

  const productsListWrapper = document.createElement('div');
  productsListWrapper.classList.add('products-list-wrapper');
  productsSection.append(productsListWrapper);

  const container = document.createElement('div');
  container.classList.add('container');
  productsListWrapper.append(container);

  const productsList = document.createElement('div');
  productsList.classList.add('products-list');
  container.append(productsList);

  productItems.forEach((row, index) => {
    const [desktopTitleCell, imageCell, mobileTitleCell, ctaLabelCell] = [...row.children];

    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.dataset.position = index + 1;

    const anchor = document.createElement('a');
    anchor.href = '#'; // Original HTML has href="#"
    anchor.classList.add('inner');
    anchor.addEventListener('click', (e) => e.preventDefault()); // Prevent default navigation

    const desktopTitle = document.createElement('div');
    desktopTitle.classList.add('title', 'mb-off');
    desktopTitle.textContent = desktopTitleCell?.textContent.trim() || '';

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }

    const productTitleSpan = document.createElement('span');
    productTitleSpan.classList.add('product-title');

    const mobileTitle = document.createElement('div');
    mobileTitle.classList.add('title', 'mb-on');
    mobileTitle.textContent = mobileTitleCell?.textContent.trim() || '';

    const moreInfoBtn = document.createElement('span');
    moreInfoBtn.classList.add('btn', 'more-info-btn');
    moreInfoBtn.textContent = ctaLabelCell?.textContent.trim() || '';
    moreInfoBtn.addEventListener('click', (e) => e.preventDefault()); // Prevent default navigation

    productTitleSpan.append(mobileTitle, moreInfoBtn);
    anchor.append(desktopTitle, productTitleSpan);
    productDiv.append(anchor);
    productsList.append(productDiv);

    moveInstrumentation(row, productDiv);
  });

  block.replaceChildren(productsSection);

  // Optimize images within the block
  productsList.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
