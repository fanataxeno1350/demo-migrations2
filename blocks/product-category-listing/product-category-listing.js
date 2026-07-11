import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, subtitleRow, ...categoryRows] = [...block.children];

  const productCategoryListing = document.createElement('div');
  productCategoryListing.classList.add('cmp-product-category-listing');

  // Header section
  const header = document.createElement('div');
  header.classList.add('cmp-product-category-listing__header');
  moveInstrumentation(titleRow, header); // Move instrumentation from titleRow

  const title = document.createElement('h1');
  title.classList.add('cmp-product-category-listing__title');
  const [titleCell] = [...titleRow.children]; // Destructure for title cell
  title.textContent = titleCell?.textContent.trim() || '';
  header.append(title);

  const subtitle = document.createElement('div');
  subtitle.classList.add('cmp-product-category-listing__subTitle', 'desc-2');
  moveInstrumentation(subtitleRow, subtitle); // Move instrumentation from subtitleRow
  const [subtitleCell] = [...subtitleRow.children]; // Destructure for subtitle cell
  subtitle.textContent = subtitleCell?.textContent.trim() || '';
  header.append(subtitle);

  productCategoryListing.append(header);

  // Content section for categories
  const content = document.createElement('div');
  content.classList.add('cmp-product-category-listing__content');

  const categoryList = document.createElement('div');
  categoryList.classList.add('cmp-categorylist', 'cmp-categorylist--anchor');

  categoryRows
    .filter((row) => row.children.length === 3) // Ensure it's a category item row
    .forEach((row) => {
      const [imageCell, labelCell, linkCell] = [...row.children];

      const anchor = document.createElement('a');
      anchor.classList.add('cmp-categorylist__item');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        anchor.title = labelCell?.textContent.trim() || '';
      }
      moveInstrumentation(row, anchor); // Move instrumentation from the item row

      const imageWrapper = document.createElement('span');
      imageWrapper.classList.add('cmp-categorylist__imagewrapper');

      const lazyImageContainer = document.createElement('div');
      lazyImageContainer.classList.add('lazy-image-container');

      const picture = imageCell?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          const optimizedImg = optimizedPic.querySelector('img');
          optimizedImg.classList.add('cmp-categorylist__image', 'lazy-image', 'loaded');
          // Copy any inline styles from the original img if necessary, though generally avoided
          if (img.style.cssText) optimizedImg.style.cssText = img.style.cssText;
          lazyImageContainer.append(optimizedPic);
        }
      }
      imageWrapper.append(lazyImageContainer);
      anchor.append(imageWrapper);

      const nameSpan = document.createElement('span');
      nameSpan.classList.add('cmp-categorylist__name');
      nameSpan.textContent = labelCell?.textContent.trim() || '';
      nameSpan.setAttribute('data-title', nameSpan.textContent);
      anchor.append(nameSpan);

      categoryList.append(anchor);
    });

  content.append(categoryList);
  productCategoryListing.append(content);

  block.replaceChildren(productCategoryListing);
}
