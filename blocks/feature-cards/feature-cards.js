import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const rootDiv = document.createElement('div');
  // rootDiv.classList.add('feature_card--Section', 'feature_card', 'mx-auto'); // Removed block-name classes, outer div already has them
  rootDiv.classList.add('feature_card--Section', 'mx-auto'); // Retained non-block-name classes from ORIGINAL HTML

  const headlineRow = children.shift();
  if (headlineRow) {
    const headlineCell = headlineRow.children[0]; // Access the first cell of the headline row
    if (headlineCell) {
      const headlineContent = document.createElement('div');
      headlineContent.classList.add('cmp-text');
      moveInstrumentation(headlineRow, headlineContent);
      headlineContent.innerHTML = headlineCell.innerHTML; // Read innerHTML for richtext
      rootDiv.append(headlineContent);
    }
  }

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('d-flex', 'flex-wrap', 'justify-content-center');

  children.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, linkCell, buttonLabelCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-flex', 'flex-column', 'analytics_cta_click', 'text-decoration-none');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      if (foundLink.target) {
        cardLink.target = foundLink.target;
      }
      if (foundLink.dataset.title) {
        cardLink.dataset.title = foundLink.dataset.title;
      }
      // The original HTML uses data-cta-label on the <a> tag, not data-ctaLabel
      if (foundLink.dataset.ctaLabel) { // Keep original data-ctaLabel for now, but note discrepancy
        cardLink.dataset.ctaLabel = foundLink.dataset.ctaLabel;
      }
    } else {
      cardLink.href = '#';
    }

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('feature_card--image', 'w-100', 'pb-4');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapper.append(optimizedPic);
      }
    }
    moveInstrumentation(imageCell, imageWrapper);
    cardLink.append(imageWrapper);

    const textCenter = document.createElement('div');
    textCenter.classList.add('text-center');

    const title = document.createElement('h2');
    title.classList.add('feature_card--title', 'boing--text__heading-1');
    moveInstrumentation(titleCell, title);
    title.textContent = titleCell?.textContent.trim() || '';
    textCenter.append(title);

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('pb-5');
    const description = document.createElement('p');
    description.classList.add('feature_card--desc', 'boing--text__body-2', 'text-boing-dark');
    moveInstrumentation(descriptionCell, description);
    description.textContent = descriptionCell?.textContent.trim() || '';
    descriptionWrapper.append(description);
    textCenter.append(descriptionWrapper);

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('redirected_btn', 'd-none'); // d-none as per original HTML
    const button = document.createElement('button');
    button.type = 'button';
    button.role = 'button';
    button.classList.add('arrow-icon-btn');
    moveInstrumentation(buttonLabelCell, button);
    // Replaced hardcoded SVG path with inline SVG as per Rule 25.4
    button.innerHTML = `
      <svg aria-hidden="true" role="icon" class="icon-svg text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;
    buttonWrapper.append(button);
    textCenter.append(buttonWrapper);

    cardLink.append(textCenter);
    moveInstrumentation(row, cardLink);
    cardsWrapper.append(cardLink);
  });

  rootDiv.append(cardsWrapper);
  block.replaceChildren(rootDiv);
}
