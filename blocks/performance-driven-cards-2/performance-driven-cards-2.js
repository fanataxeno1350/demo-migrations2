import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // The first row is the container placeholder for "cards" field.
  // We need to consume it and move its instrumentation.
  const containerPlaceholder = allRows.shift();

  const rootDiv = document.createElement('div');
  // Corrected typo 'performace' to 'performance' and removed redundant 'performace-driven-home'
  // as the outer block div already has 'performance-driven-cards-2' and 'performance-driven'
  // from the original HTML. The 'performace-driven-home' class is already on the outer block.
  rootDiv.classList.add('performance-driven'); // Only 'performance-driven' from original HTML

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  rootDiv.append(containerDiv);

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');
  containerDiv.append(cardsWrapper);

  // Move instrumentation from the placeholder row to the actual cards wrapper
  if (containerPlaceholder) {
    moveInstrumentation(containerPlaceholder, cardsWrapper);
  }

  allRows
    .filter((row) => row.children.length === 4) // Ensure it's a card item row
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

      const anchor = document.createElement('a');
      anchor.classList.add('performace-driven-cards-link');

      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        // The original HTML has target="_blank", so we add it here.
        anchor.target = '_blank';
      }

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');
      anchor.append(cardWrapper);

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');
      cardWrapper.append(cardImage);

      // Create and append picture element for desktop and mobile images
      const picture = document.createElement('picture');

      const mobileImg = imageMobileCell.querySelector('img');
      if (mobileImg) {
        const source = document.createElement('source');
        source.media = '(max-width: 576px)';
        source.srcset = mobileImg.src;
        picture.append(source);
      }

      const desktopImg = imageDesktopCell.querySelector('img');
      if (desktopImg) {
        const img = document.createElement('img');
        img.src = desktopImg.src;
        img.alt = desktopImg.alt || '';
        picture.append(img);
      }

      cardImage.append(picture);

      // Optimize images
      cardImage.querySelectorAll('picture > img').forEach((img) => {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation should be called on the original img element,
        // and the new optimized picture should replace the original picture element.
        // The img inside optimizedPic is a new element, so no need to move instrumentation to it.
        // The instrumentation is on the original <div> row, which is moved to the anchor.
        img.closest('picture').replaceWith(optimizedPic);
      });

      const boxCard = document.createElement('div');
      boxCard.classList.add('performace-driven-home-box-card');
      cardWrapper.append(boxCard);

      const descriptionP = document.createElement('p');
      descriptionP.classList.add('desc');
      // Richtext content is directly inside the cell div.
      // We need to extract the innerHTML, not the cell's outerHTML or query for a div.
      // The original HTML shows <p> inside the description cell, so assigning innerHTML
      // to a <p> element would create <p><p>...</p></p>, which is invalid.
      // Use a div to safely contain rich text.
      const descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('desc'); // Apply class to the div
      descriptionDiv.innerHTML = descriptionCell.innerHTML;
      boxCard.append(descriptionDiv);

      moveInstrumentation(row, anchor); // Move instrumentation from the authored row to the new anchor
      cardsWrapper.append(anchor);
    });

  block.replaceChildren(rootDiv);
}
