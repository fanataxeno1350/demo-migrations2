import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...ctaItemRows] = [...block.children];

  const rootDiv = document.createElement('div');
  rootDiv.classList.add('tooltip-signin-register', 'bg--white-accent');
  rootDiv.id = 'tooltip-signin-register';
  rootDiv.setAttribute('role', 'dialog');

  // Arrow SVG
  const arrowSvg = document.createElement('svg');
  arrowSvg.setAttribute('role', 'presentation');
  arrowSvg.classList.add('tooltip-signin-register--arrow');
  arrowSvg.setAttribute('width', '16');
  arrowSvg.setAttribute('height', '12');
  arrowSvg.setAttribute('viewBox', '0 0 16 12');
  arrowSvg.setAttribute('fill', 'none');
  arrowSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  arrowSvg.innerHTML = '<path d="M6.26351 1.03885C7.0313 -0.304777 8.9687 -0.304778 9.73649 1.03885L16 12L0 12L6.26351 1.03885Z" fill="#FAFAFA"></path>';
  rootDiv.append(arrowSvg);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('tooltip-signin-register--container');

  // Title
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('labelMediumBold', 'tooltip-signin-register--title');
  moveInstrumentation(titleRow, titleDiv);
  const [titleCell] = [...titleRow.children]; // Fixed: Use destructuring for title cell
  titleDiv.innerHTML = titleCell?.innerHTML || '';
  containerDiv.append(titleDiv);

  // Close button
  const closeDiv = document.createElement('div');
  closeDiv.classList.add('tooltip-signin-register--close');
  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('icon', 'cross-icon-black', 'tooltip-signin-register--close-btn');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  closeDiv.append(closeButton);
  containerDiv.append(closeDiv);

  // CTA buttons
  const ctasDiv = document.createElement('div');
  ctasDiv.classList.add('tooltip-signin-register--ctas');

  ctaItemRows.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    // The original HTML has a span with class "button-text" inside the anchor.
    // The current JS sets textContent directly on the anchor.
    // To match original HTML structure, we should create a span.
    const spanText = document.createElement('span');
    spanText.classList.add('button-text');
    spanText.textContent = labelCell.textContent.trim();
    anchor.append(spanText);

    anchor.setAttribute('aria-label', ''); // Original HTML has empty aria-label, so keep it.
    anchor.setAttribute('rel', 'follow');
    anchor.classList.add('button'); // 'button-text' is for the span, not the anchor itself

    if (index === 0) {
      anchor.classList.add('red', 'tooltip-signin-register--signin');
    } else {
      anchor.classList.add('transparent-black', 'tooltip-signin-register--signup');
    }
    moveInstrumentation(row, anchor); // Added moveInstrumentation for each CTA anchor
    ctasDiv.append(anchor);
  });
  containerDiv.append(ctasDiv);
  rootDiv.append(containerDiv);

  block.replaceChildren(rootDiv);

  // Add event listener for close button
  closeButton.addEventListener('click', () => {
    rootDiv.classList.remove('active');
  });

  // This part seems to be a generic picture optimization, not specific to this block's content.
  // The block structure does not indicate any pictures in the cells.
  // If there are no pictures in the block's content, this loop will do nothing.
  // Keeping it as it's a standard utility, but noting its potential irrelevance here.
  rootDiv.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
