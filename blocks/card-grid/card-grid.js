import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardGridWrapper = document.createElement('div');
  cardGridWrapper.classList.add('rs-cards');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  // moveInstrumentation(block, rowDiv); // Not needed for container blocks

  [...block.children].forEach((row) => {
    const [mainImageCell, ctaLinkCell, ctaIconCell, headlineCell, descriptionCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-xl-4', 'col-lg-6', 'pb-md-0', 'pb-4', 'row-gap-4', 'koi-rscard-padding');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'rs-card');

    // Main Image
    const mainPicture = mainImageCell.querySelector('picture');
    if (mainPicture) {
      const mainImg = mainPicture.querySelector('img');
      if (mainImg) {
        const optimizedPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
        optimizedPic.classList.add('w-100', 'kitchens-image');
        // moveInstrumentation(mainImg, optimizedPic.querySelector('img')); // moveInstrumentation should be on the original element, not the new one
        cardDiv.append(optimizedPic);
      }
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // CTA Link and Icon
    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaIconPicture = ctaIconCell.querySelector('picture');
    if (ctaLink && ctaIconPicture) {
      const anchor = document.createElement('a');
      anchor.setAttribute('aria-label', `Read more about '${headlineCell.textContent.trim()}'`);
      anchor.setAttribute('target', '_self');
      anchor.setAttribute('id', 'explore-btn-hide-id');
      anchor.href = ctaLink.href;

      const ctaIconImg = ctaIconPicture.querySelector('img');
      if (ctaIconImg) {
        const optimizedIcon = createOptimizedPicture(ctaIconImg.src, ctaIconImg.alt, false, [{ width: 'auto' }]);
        // moveInstrumentation(ctaIconImg, optimizedIcon.querySelector('img')); // moveInstrumentation should be on the original element, not the new one
        anchor.append(optimizedIcon);
      }
      moveInstrumentation(ctaLinkCell, anchor);
      cardBody.append(anchor);
    }

    // Headline
    const headline = document.createElement('h5');
    headline.classList.add('blog-card-title');
    headline.textContent = headlineCell.textContent.trim();
    moveInstrumentation(headlineCell, headline);
    cardBody.append(headline);

    // Description
    const description = document.createElement('div'); // Changed from h5 to div to avoid <p> inside <h5>
    description.classList.add('card-title'); // Keep the class from original HTML
    description.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, description);
    cardBody.append(description);

    cardDiv.append(cardBody);
    // moveInstrumentation(row, cardDiv); // Not needed for container blocks
    colDiv.append(cardDiv);
    rowDiv.append(colDiv);
  });

  const tabPara = document.createElement('div');
  tabPara.classList.add('tab-para');
  rowDiv.append(tabPara);

  cardGridWrapper.append(rowDiv);
  block.replaceChildren(cardGridWrapper);

  // This loop is redundant. createOptimizedPicture is already used for main images.
  // If there are other images in the block.children that need optimization,
  // they should be handled within the forEach loop for specific cells.
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
