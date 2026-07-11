import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [descriptionRow, ctaLabelRow, ctaLinkRow, ...cardItemRows] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('cmp-card--image-hover', 'cmp-card--default'); // Classes from ORIGINAL HTML
  root.setAttribute('data-component', 'cards');

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('cmp-card__container');
  moveInstrumentation(block.children[3], cardContainer); // Move instrumentation for the container row itself

  cardItemRows.forEach((row) => {
    const [
      cardLinkCell,
      imageDesktopDefaultCell,
      imageMobileDefaultCell,
      imageDesktopHoverCell,
      imageMobileHoverCell,
    ] = [...row.children]; // CORRECT: named destructuring for fixed schema

    const cardLink = document.createElement('a');
    const foundCardLink = cardLinkCell.querySelector('a');
    if (foundCardLink) {
      cardLink.href = foundCardLink.href;
      cardLink.target = '_self'; // Target from ORIGINAL HTML
    }
    moveInstrumentation(cardLinkCell, cardLink);

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');
    cardContent.setAttribute('tabindex', '0');
    moveInstrumentation(row, cardContent);

    const desktopDefaultPicture = imageDesktopDefaultCell.querySelector('picture');
    const mobileDefaultPicture = imageMobileDefaultCell.querySelector('picture');
    const desktopHoverPicture = imageDesktopHoverCell.querySelector('picture');
    const mobileHoverPicture = imageMobileHoverCell.querySelector('picture');

    if (desktopDefaultPicture) {
      const img = desktopDefaultPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(max-width:767px)', width: '360' }, { width: '750' }]);
        optimizedPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__default');
        cardContent.append(optimizedPic);
        moveInstrumentation(desktopDefaultPicture, optimizedPic.querySelector('img'));
      }
    }

    if (mobileDefaultPicture) {
      const img = mobileDefaultPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(max-width:767px)', width: '360' }, { width: '750' }]);
        optimizedPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__default');
        // If there's already a picture element, add source to it, otherwise append new picture
        const existingPicture = cardContent.querySelector('picture');
        if (existingPicture) {
          const source = optimizedPic.querySelector('source');
          if (source) existingPicture.prepend(source);
        } else {
          cardContent.append(optimizedPic);
        }
        moveInstrumentation(mobileDefaultPicture, optimizedPic.querySelector('img'));
      }
    }

    if (desktopHoverPicture) {
      const img = desktopHoverPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(max-width:767px)', width: '360' }, { width: '750' }]);
        optimizedPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__hover');
        cardContent.append(optimizedPic);
        moveInstrumentation(desktopHoverPicture, optimizedPic.querySelector('img'));
      }
    }

    if (mobileHoverPicture) {
      const img = mobileHoverPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(max-width:767px)', width: '360' }, { width: '750' }]);
        optimizedPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__hover');
        // If there's already a picture element, add source to it, otherwise append new picture
        const existingPicture = cardContent.querySelectorAll('picture')[1]; // Second picture for hover
        if (existingPicture) {
          const source = optimizedPic.querySelector('source');
          if (source) existingPicture.prepend(source);
        } else {
          cardContent.append(optimizedPic);
        }
        moveInstrumentation(mobileHoverPicture, optimizedPic.querySelector('img'));
      }
    }

    cardLink.append(cardContent);
    cardContainer.append(cardLink);
  });

  root.append(cardContainer);

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cards__description', 'text');
  moveInstrumentation(descriptionRow, descriptionDiv);
  const cmpText = document.createElement('div'); // Changed from <p> to <div> to avoid <p> inside <p>
  cmpText.classList.add('cmp-text');
  cmpText.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Correctly read innerHTML from cell
  descriptionDiv.append(cmpText);
  root.append(descriptionDiv);

  const ctaLink = document.createElement('a');
  const foundCtaLink = ctaLinkRow.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  }
  ctaLink.classList.add('cmp-button');
  // Removed hardcoded ID, it's not needed for functionality and can cause issues
  // ctaLink.id = 'button-6beda1bf9f'; 

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('cmp-button__text');
  ctaSpan.textContent = ctaLabelRow.textContent.trim();
  moveInstrumentation(ctaLabelRow, ctaSpan);

  ctaLink.append(ctaSpan);

  const exploreMoreDiv = document.createElement('div');
  exploreMoreDiv.classList.add('exploremore', 'button', 'cmp-button--secondary');
  moveInstrumentation(ctaLinkRow, exploreMoreDiv);
  exploreMoreDiv.append(ctaLink);
  root.append(exploreMoreDiv);

  block.replaceChildren(root);
}
