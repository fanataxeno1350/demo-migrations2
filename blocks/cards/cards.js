import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [descriptionRow, ctaLabelRow, ctaLinkRow, containerRow, ...cardItemRows] = children;

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('cmp-card--image-hover', 'cmp-card--default');
  cardsContainer.setAttribute('data-component', 'cards');

  const cardItemsWrapper = document.createElement('div');
  cardItemsWrapper.classList.add('cmp-card__container');
  moveInstrumentation(containerRow, cardItemsWrapper);

  cardItemRows.forEach((row) => {
    const [
      imageDesktopDefaultCell,
      imageMobileDefaultCell,
      imageDesktopHoverCell,
      imageMobileHoverCell,
      cardLinkCell,
    ] = [...row.children];

    const cardLink = cardLinkCell?.querySelector('a');
    const anchor = document.createElement('a');
    if (cardLink) {
      anchor.href = cardLink.href;
      anchor.target = '_self'; // Assuming target self from original HTML
    }
    moveInstrumentation(row, anchor);

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');
    cardContent.setAttribute('tabindex', '0');

    // Default Image Picture
    const defaultPicture = imageDesktopDefaultCell?.querySelector('picture');
    if (defaultPicture) {
      const defaultImg = defaultPicture.querySelector('img');
      const optimizedDefaultPicture = createOptimizedPicture(
        defaultImg.src,
        defaultImg.alt,
        false,
        [{ media: '(max-width:767px)', width: '360' }, { width: '750' }],
      );
      optimizedDefaultPicture.querySelector('img').classList.add('cmp-image__image', 'cmp-image__default');
      moveInstrumentation(imageDesktopDefaultCell, optimizedDefaultPicture);
      cardContent.append(optimizedDefaultPicture);
    }

    // Hover Image Picture
    const hoverPicture = imageDesktopHoverCell?.querySelector('picture');
    if (hoverPicture) {
      const hoverImg = hoverPicture.querySelector('img');
      const optimizedHoverPicture = createOptimizedPicture(
        hoverImg.src,
        hoverImg.alt,
        false,
        [{ media: '(max-width:767px)', width: '360' }, { width: '750' }],
      );
      optimizedHoverPicture.querySelector('img').classList.add('cmp-image__image', 'cmp-image__hover');
      moveInstrumentation(imageDesktopHoverCell, optimizedHoverPicture);
      cardContent.append(optimizedHoverPicture);
    }

    anchor.append(cardContent);
    cardItemsWrapper.append(anchor);
  });

  cardsContainer.append(cardItemsWrapper);

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cards__description', 'text');
  // FIX: descriptionRow is a richtext field, its innerHTML should be used directly
  // to preserve potential nested HTML (like <p> tags) and avoid <p> inside <p> issues.
  descriptionDiv.innerHTML = descriptionRow.innerHTML;
  moveInstrumentation(descriptionRow, descriptionDiv);

  const exploreMoreDiv = document.createElement('div');
  exploreMoreDiv.classList.add('exploremore', 'button', 'cmp-button--secondary');

  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add('cmp-button');
  const ctaLink = ctaLinkRow.querySelector('a');
  if (ctaLink) {
    ctaAnchor.href = ctaLink.href;
  }
  moveInstrumentation(ctaLinkRow, ctaAnchor);

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('cmp-button__text');
  ctaSpan.textContent = ctaLabelRow.textContent.trim();
  moveInstrumentation(ctaLabelRow, ctaSpan); // Move instrumentation from ctaLabelRow to ctaSpan

  ctaAnchor.append(ctaSpan);
  exploreMoreDiv.append(ctaAnchor);

  block.replaceChildren(cardsContainer, descriptionDiv, exploreMoreDiv);

  // Removed redundant image optimization loop at the end.
  // createOptimizedPicture is already called for each image during card creation.
}
