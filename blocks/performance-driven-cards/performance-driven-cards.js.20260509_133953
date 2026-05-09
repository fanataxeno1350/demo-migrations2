import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [containerRow, ...cardRows] = [...block.children];

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards'); // This is correct, it's an inner wrapper with a specific class
  moveInstrumentation(containerRow, cardsWrapper); // Move instrumentation from the placeholder row

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell?.querySelector('picture');
    const pictureMobile = imageMobileCell?.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      if (imgDesktop && imgMobile) {
        // Create optimized picture for desktop, with a source for mobile
        const optimizedPic = createOptimizedPicture(
          imgDesktop.src,
          imgDesktop.alt,
          false,
          [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }],
        );

        // Replace the mobile source in the optimized picture with the actual mobile image
        const sourceMobile = optimizedPic.querySelector('source[media="(max-width: 576px)"]');
        if (sourceMobile) {
          sourceMobile.srcset = imgMobile.src;
        }

        cardImage.append(optimizedPic);
        // Move instrumentation from original cells to the new picture/img/source elements
        moveInstrumentation(imageDesktopCell, optimizedPic.querySelector('img'));
        if (sourceMobile) {
          moveInstrumentation(imageMobileCell, sourceMobile);
        }
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = descriptionCell?.innerHTML || '';
    moveInstrumentation(descriptionCell, desc);

    homeBoxCard.append(desc);
    cardWrapper.append(cardImage, homeBoxCard);
    linkEl.append(cardWrapper);
    cardsWrapper.append(linkEl);
  });

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.append(cardsWrapper);

  const performanceDriven = document.createElement('div');
  // Corrected typo: 'performace-driven-home' -> 'performance-driven-home' based on ORIGINAL HTML
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');
  performanceDriven.append(containerDiv);

  block.replaceChildren(performanceDriven);
}
