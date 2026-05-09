import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...ctaRows] = [...block.children];

  // Main container
  const tooltipContainer = document.createElement('div');
  tooltipContainer.classList.add('tooltip-signin-register--container');

  // Title
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('labelMediumBold', 'tooltip-signin-register--title');
  moveInstrumentation(titleRow, titleDiv);
  // FIX: titleRow is a row, not a cell. The content is in its first child (the cell).
  // The cell itself contains the richtext HTML.
  titleDiv.innerHTML = titleRow.querySelector('div')?.innerHTML || '';
  tooltipContainer.append(titleDiv);

  // Close button
  const closeDiv = document.createElement('div');
  closeDiv.classList.add('tooltip-signin-register--close');
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('icon', 'cross-icon-black', 'tooltip-signin-register--close-btn');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  closeDiv.append(closeButton);
  tooltipContainer.append(closeDiv);

  // CTAs
  const ctasDiv = document.createElement('div');
  ctasDiv.classList.add('tooltip-signin-register--ctas');

  ctaRows.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children];
    const linkEl = linkCell?.querySelector('a');

    const cta = document.createElement('a');
    if (linkEl) {
      cta.href = linkEl.href;
    }
    cta.textContent = labelCell?.textContent.trim() || '';
    cta.classList.add('button');
    cta.setAttribute('aria-label', '');
    cta.setAttribute('rel', 'follow');

    if (index === 0) {
      cta.classList.add('red', 'tooltip-signin-register--signin');
    } else {
      cta.classList.add('transparent-black', 'tooltip-signin-register--signup');
    }

    const span = document.createElement('span');
    span.classList.add('button-text');
    span.textContent = cta.textContent;
    cta.textContent = ''; // Clear textContent to append span
    cta.append(span);

    moveInstrumentation(row, cta);
    ctasDiv.append(cta);
  });
  tooltipContainer.append(ctasDiv);

  // Arrow SVG
  const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrowSvg.setAttribute('role', 'presentation');
  arrowSvg.classList.add('tooltip-signin-register--arrow');
  arrowSvg.setAttribute('width', '16');
  arrowSvg.setAttribute('height', '12');
  arrowSvg.setAttribute('viewBox', '0 0 16 12');
  arrowSvg.setAttribute('fill', 'none');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M6.26351 1.03885C7.0313 -0.304777 8.9687 -0.304778 9.73649 1.03885L16 12L0 12L6.26351 1.03885Z');
  path.setAttribute('fill', '#FAFAFA');
  arrowSvg.append(path);

  // Final block structure
  block.classList.add('bg--white-accent');
  block.setAttribute('id', 'tooltip-signin-register');
  block.setAttribute('role', 'dialog');
  block.replaceChildren(arrowSvg, tooltipContainer);

  // Add event listener for close button
  closeButton.addEventListener('click', () => {
    block.classList.remove('show'); // Assuming 'show' class controls visibility
  });

  // Optimize images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
