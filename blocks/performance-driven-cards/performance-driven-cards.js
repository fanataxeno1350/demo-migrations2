import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  [...block.children].forEach((row) => {
    const [imageDesktopCell, imageMobileCell, cardLinkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(cardLinkCell, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      if (imgDesktop && imgMobile) {
        const optimizedPicture = document.createElement('picture');

        // Mobile source
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = imgMobile.src;
        optimizedPicture.append(sourceMobile);

        // Desktop image
        const img = document.createElement('img');
        img.src = imgDesktop.src;
        img.alt = imgDesktop.alt;
        img.loading = 'lazy'; // Assuming lazy loading from original HTML
        optimizedPicture.append(img);

        // moveInstrumentation should be on the picture element itself for both cells
        moveInstrumentation(imageDesktopCell, optimizedPicture);
        moveInstrumentation(imageMobileCell, optimizedPicture); // Also move for mobile cell
        cardImage.append(optimizedPicture);
      }
    } else if (pictureDesktop) {
      // Fallback to desktop image if mobile is not provided
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        const optimizedPicture = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        moveInstrumentation(imageDesktopCell, optimizedPicture); // Move instrumentation to the picture element
        cardImage.append(optimizedPicture);
      }
    }

    const cardContentBox = document.createElement('div');
    cardContentBox.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell?.innerHTML || '';
    moveInstrumentation(descriptionCell, description);

    cardContentBox.append(description);
    cardWrapper.append(cardImage, cardContentBox);
    cardLink.append(cardWrapper);
    cardsContainer.append(cardLink);
  });

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.append(cardsContainer);

  const rootDiv = document.createElement('div');
  // The block itself already has 'performance-driven' and 'performace-driven-home' from AEM.
  // Adding them again to an inner wrapper causes double padding/CSS.
  // Original HTML shows 'performance-driven performace-driven-home' on the outermost div.
  // The block element itself is this outermost div.
  // So, no classes needed on rootDiv, as it's an inner wrapper.
  rootDiv.append(containerDiv);

  block.replaceChildren(rootDiv);
}
