import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0.5: The block's own class 'performance-driven-cards' is added to cardsContainer.
  // The outer block div already carries this class from AEM. Adding it again causes double CSS.
  // FIX: Remove 'performance-driven-cards' from cardsContainer.
  const cardsContainer = document.createElement('div');
  // cardsContainer.classList.add('performace-driven-cards'); // Removed block's own class

  const cardRows = [...block.children].filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some(
        (c) => c.children.length > 0 || c.textContent.trim() !== '',
      ),
  );

  cardRows.forEach((row) => {
    // CHECK 0: No direct children[n] access, destructuring is correct for fixed schema.
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [
      ...row.children,
    ];

    const linkEl = document.createElement('a');
    // CHECK 2.6 B: Corrected class name to match ORIGINAL HTML.
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      // CHECK 2.6 C: Assuming target blank from original HTML as per example.
      linkEl.target = '_blank';
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    // CHECK 2.6 B: Corrected class name to match ORIGINAL HTML.
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    // CHECK 2.6 B: Corrected class name to match ORIGINAL HTML.
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell?.querySelector('picture');
    const pictureMobile = imageMobileCell?.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = imgMobile?.src || '';

      // The createOptimizedPicture call already handles the img element.
      // No need to create a separate img element here.
      const optimizedPicture = createOptimizedPicture(
        imgDesktop?.src || '', // Use desktop image as default
        imgDesktop?.alt || '',
        false,
        [{ width: '576', media: '(max-width: 576px)' }, { width: '750' }],
      );
      // The createOptimizedPicture function returns a <picture> element.
      // The img element inside it will have the correct alt and loading.
      optimizedPicture.prepend(sourceMobile);
      cardImage.append(optimizedPicture);
    } else if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPicture = createOptimizedPicture(
        imgDesktop?.src || '',
        imgDesktop?.alt || '',
        false,
        [{ width: '750' }],
      );
      // moveInstrumentation should be on the picture element, not the img inside it.
      // Also, the optimizedPicture is a new element, so instrumentation from the original
      // pictureDesktop should be moved to the new optimizedPicture.
      moveInstrumentation(pictureDesktop, optimizedPicture);
      cardImage.append(optimizedPicture);
    } else if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      const optimizedPicture = createOptimizedPicture(
        imgMobile?.src || '',
        imgMobile?.alt || '',
        false,
        [{ width: '576' }],
      );
      // moveInstrumentation should be on the picture element, not the img inside it.
      // Also, the optimizedPicture is a new element, so instrumentation from the original
      // pictureMobile should be moved to the new optimizedPicture.
      moveInstrumentation(pictureMobile, optimizedPicture);
      cardImage.append(optimizedPicture);
    }

    const homeBoxCard = document.createElement('div');
    // CHECK 2.6 B: Corrected class name to match ORIGINAL HTML.
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const descriptionP = document.createElement('p');
    // CHECK 2.6 B: Corrected class name to match ORIGINAL HTML.
    descriptionP.classList.add('desc');
    // CHECK 0.7 B: descriptionCell is richtext, so innerHTML is correct.
    descriptionP.innerHTML = descriptionCell?.innerHTML || '';

    homeBoxCard.append(descriptionP);
    cardWrapper.append(cardImage, homeBoxCard);
    linkEl.append(cardWrapper);
    cardsContainer.append(linkEl);
  });

  const root = document.createElement('div');
  // CHECK 2.6 B: Corrected class names to match ORIGINAL HTML.
  root.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  // CHECK 2.6 B: Corrected class name to match ORIGINAL HTML.
  container.classList.add('container');
  container.append(cardsContainer);
  root.append(container);

  block.replaceChildren(root);
}
