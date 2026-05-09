import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // Consume the container placeholder row (Rule 13a)
  const containerPlaceholder = allRows.shift();
  const cardsWrapper = document.createElement('div');
  // cardsWrapper.classList.add('performace-driven-cards'); // VIOLATION: Block's own class on inner wrapper. Outer div already has it.
  moveInstrumentation(containerPlaceholder, cardsWrapper);

  allRows
    .filter(row => row.children.length > 0 && [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children]; // Rule 17

      const cardLink = document.createElement('a');
      cardLink.classList.add('performace-driven-cards-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        cardLink.href = foundLink.href;
        // Check for target attribute in original HTML (Rule 23.3)
        if (foundLink.getAttribute('target')) {
          cardLink.setAttribute('target', foundLink.getAttribute('target'));
        }
      }

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      if (imageDesktopCell || imageMobileCell) {
        const picture = document.createElement('picture');

        // Mobile image source (Rule 17)
        const mobileImg = imageMobileCell?.querySelector('img');
        if (mobileImg) {
          const sourceMobile = document.createElement('source');
          sourceMobile.media = '(max-width: 576px)';
          sourceMobile.srcset = mobileImg.src;
          picture.appendChild(sourceMobile);
        }

        // Desktop image (Rule 17)
        const desktopImg = imageDesktopCell?.querySelector('img');
        if (desktopImg) {
          const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
          const img = optimizedPic.querySelector('img');
          if (img) {
            moveInstrumentation(desktopImg, img); // Move instrumentation from original img to optimized img
            picture.appendChild(img);
          }
        }
        cardImage.appendChild(picture);
      }

      const cardContentBox = document.createElement('div');
      cardContentBox.classList.add('performace-driven-home-box-card');

      const description = document.createElement('p');
      description.classList.add('desc');
      description.innerHTML = descriptionCell?.innerHTML || ''; // Rule 17a, 17c

      cardContentBox.appendChild(description);
      cardWrapper.appendChild(cardImage);
      cardWrapper.appendChild(cardContentBox);
      cardLink.appendChild(cardWrapper);

      moveInstrumentation(row, cardLink); // Rule 3
      cardsWrapper.appendChild(cardLink);
    });

  const container = document.createElement('div');
  container.classList.add('container');
  container.appendChild(cardsWrapper);

  const rootDiv = document.createElement('div');
  rootDiv.classList.add('performance-driven', 'performace-driven-home'); // Rule 12
  rootDiv.appendChild(container);

  block.replaceChildren(rootDiv); // Rule 21
}
