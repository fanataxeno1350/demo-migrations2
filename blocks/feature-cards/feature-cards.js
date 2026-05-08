import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const headlineRow = children[0];
  const cardRows = children.slice(1);

  const root = document.createElement('div');
  // Removed 'feature_card' from here as the outer block div already has it.
  // 'feature_card--Section' is from ORIGINAL HTML, so it's kept.
  root.classList.add('feature_card--Section', 'mx-auto');

  // Headline
  if (headlineRow) {
    const headlineDiv = document.createElement('div');
    moveInstrumentation(headlineRow, headlineDiv);
    // headline is richtext, so read innerHTML directly from the row
    headlineDiv.innerHTML = headlineRow.innerHTML;
    headlineDiv.classList.add('cmp-text'); // Use class from ORIGINAL HTML
    root.append(headlineDiv);
  }

  // Cards
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('d-flex', 'flex-wrap', 'justify-content-center'); // Added classes for flex layout

  cardRows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, linkCell, ctaLabelCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-flex', 'flex-column', 'analytics_cta_click', 'text-decoration-none'); // Use classes from ORIGINAL HTML

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      if (foundLink.target) cardLink.target = foundLink.target;
    }
    // The original HTML has data-cta-label matching the CTA Label cell's text content
    cardLink.title = ctaLabelCell?.textContent.trim() || '';
    cardLink.setAttribute('data-cta-label', ctaLabelCell?.textContent.trim() || '');

    // Card Image
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('feature_card--image', 'w-100', 'pb-4'); // Use classes from ORIGINAL HTML
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageWrapper.append(optimizedPic);
        }
      }
    }
    cardLink.append(imageWrapper);

    // Card Content
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('text-center'); // Use class from ORIGINAL HTML

    // Title
    const title = document.createElement('h2');
    title.classList.add('feature_card--title', 'boing--text__heading-1'); // Use classes from ORIGINAL HTML
    title.textContent = titleCell?.textContent.trim() || '';
    contentWrapper.append(title);

    // Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('pb-5'); // Use class from ORIGINAL HTML
    const description = document.createElement('p');
    description.classList.add('feature_card--desc', 'boing--text__body-2', 'text-boing-dark'); // Use classes from ORIGINAL HTML
    description.textContent = descriptionCell?.textContent.trim() || '';
    descriptionDiv.append(description);
    contentWrapper.append(descriptionDiv);

    // CTA Button (redirected_btn)
    const redirectedBtnDiv = document.createElement('div');
    redirectedBtnDiv.classList.add('redirected_btn', 'd-none'); // Use classes from ORIGINAL HTML
    const button = document.createElement('button');
    button.type = 'button';
    button.role = 'button';
    button.classList.add('arrow-icon-btn'); // Use class from ORIGINAL HTML
    // Replaced hardcoded SVG path with inline SVG as per Rule 25.4
    button.innerHTML = `
        <svg aria-hidden="true" role="icon" class="icon-svg text-white" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
      `;
    redirectedBtnDiv.append(button);
    contentWrapper.append(redirectedBtnDiv);

    cardLink.append(contentWrapper);
    moveInstrumentation(row, cardLink); // Move instrumentation from the authored row to the new card link
    cardsContainer.append(cardLink);
  });

  root.append(cardsContainer);
  block.replaceChildren(root);
}
