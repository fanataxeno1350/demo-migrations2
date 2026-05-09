import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // The first row is the container placeholder, consume it and move its instrumentation
  // The block itself is the 'performance-driven-cards' container, so we don't need an extra wrapper with that class.
  // The first row is just a placeholder, its content is not used, only its instrumentation.
  const containerPlaceholder = allRows.shift();
  // We don't need a cardsWrapper here, as 'block' itself will be the 'performace-driven-cards' element.
  // We will move instrumentation from the placeholder to the block itself if needed,
  // but for a block-level placeholder, it's often just consumed.
  // For now, we'll just consume it and not create an extra wrapper with the block's own class.

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards'); // This will be the inner wrapper for the cards
  // Move instrumentation from the placeholder row to this new container, as the placeholder represents the block's content area.
  moveInstrumentation(containerPlaceholder, cardsContainer);


  allRows.forEach((row) => {
    // Each item row has a fixed schema: imageMobile, imageDesktop, description, link
    const [imageMobileCell, imageDesktopCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, linkEl); // Move instrumentation from the row to the new link element

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = document.createElement('picture');
    // Mobile image source
    const sourceMobile = document.createElement('source');
    sourceMobile.media = '(max-width: 576px)';
    const imgMobile = imageMobileCell?.querySelector('img');
    if (imgMobile) {
      sourceMobile.srcset = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '576' }]).querySelector('img').src;
    }
    picture.append(sourceMobile);

    // Desktop image
    const imgDesktop = imageDesktopCell?.querySelector('img');
    if (imgDesktop) {
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const desktopImg = optimizedPic.querySelector('img');
      // Move instrumentation from the original img to the optimized one
      moveInstrumentation(imgDesktop, desktopImg);
      picture.append(desktopImg);
    }

    cardImage.append(picture);

    const descriptionBox = document.createElement('div');
    descriptionBox.classList.add('performace-driven-home-box-card');

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('desc');
    if (descriptionCell) {
      // Fix: Richtext content from a cell should be assigned to a div or the innerHTML of a p
      // if the cell itself contains a p. Assigning cell.innerHTML (which is "<p>...</p>")
      // to descriptionP.innerHTML creates <p><p>...</p></p>, which is invalid.
      // We extract the innerHTML of the first <p> or use textContent if no <p> is found.
      descriptionP.innerHTML = descriptionCell.querySelector('p')?.innerHTML ?? descriptionCell.textContent.trim();
    }

    descriptionBox.append(descriptionP);
    cardWrapper.append(cardImage, descriptionBox);
    linkEl.append(cardWrapper);
    cardsContainer.append(linkEl);
  });

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.append(cardsContainer);

  const performanceDrivenSection = document.createElement('div');
  performanceDrivenSection.classList.add('performance-driven', 'performace-driven-home');
  performanceDrivenSection.append(containerDiv);

  block.replaceChildren(performanceDrivenSection);
}
