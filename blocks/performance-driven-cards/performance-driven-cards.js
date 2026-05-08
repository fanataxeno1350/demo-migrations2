import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  [...block.children].forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target="_blank" from original HTML
    }

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const desktopPicture = imageDesktopCell.querySelector('picture');
    const mobilePicture = imageMobileCell.querySelector('picture');

    if (desktopPicture && mobilePicture) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = mobilePicture.querySelector('img')?.src;
      cardImage.append(sourceMobile);

      const img = document.createElement('img');
      img.src = desktopPicture.querySelector('img')?.src;
      img.alt = desktopPicture.querySelector('img')?.alt || '';
      img.loading = 'lazy'; // Assuming lazy loading from original HTML
      cardImage.append(img);

      // Create optimized picture for desktop, move instrumentation from original desktop picture
      const optimizedDesktopPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(desktopPicture, optimizedDesktopPic); // Move instrumentation from the original picture element
      cardImage.replaceChildren(optimizedDesktopPic);
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('div'); // Changed from <p> to <div> to prevent <p> inside <p>
    description.classList.add('desc');
    description.innerHTML = descriptionCell.innerHTML;

    homeBoxCard.append(description);
    cardWrapper.append(cardImage, homeBoxCard);
    moveInstrumentation(row, cardLink); // Move instrumentation from the row to the main link
    cardLink.append(cardWrapper);
    cardsContainer.append(cardLink);
  });

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.append(cardsContainer);

  const performanceDrivenSection = document.createElement('div');
  performanceDrivenSection.classList.add('performance-driven', 'performace-driven-home');
  performanceDrivenSection.append(containerDiv);

  block.replaceChildren(performanceDrivenSection);
}
