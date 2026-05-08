import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...ctaRows] = [...block.children];

  // Create the main container div
  const tooltipRegister = document.createElement('div');
  tooltipRegister.classList.add('tooltip-signin-register', 'bg--white-accent');
  tooltipRegister.id = 'tooltip-signin-register';
  tooltipRegister.setAttribute('role', 'dialog');

  // Create the arrow SVG
  const arrowSvg = document.createElement('svg');
  arrowSvg.classList.add('tooltip-signin-register--arrow');
  arrowSvg.setAttribute('role', 'presentation');
  arrowSvg.setAttribute('width', '16');
  arrowSvg.setAttribute('height', '12');
  arrowSvg.setAttribute('viewBox', '0 0 16 12');
  arrowSvg.setAttribute('fill', 'none');
  arrowSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  arrowSvg.innerHTML = '<path d="M6.26351 1.03885C7.0313 -0.304777 8.9687 -0.304778 9.73649 1.03885L16 12L0 12L6.26351 1.03885Z" fill="#FAFAFA"></path>';
  tooltipRegister.append(arrowSvg);

  // Create the inner container
  const container = document.createElement('div');
  container.classList.add('tooltip-signin-register--container');

  // Title
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('labelMediumBold', 'tooltip-signin-register--title');
  moveInstrumentation(titleRow, titleDiv);
  // The title field is richtext, so we need to read the innerHTML of the row directly
  // The row itself contains the cell div, so titleRow.innerHTML is correct here.
  titleDiv.innerHTML = titleRow.innerHTML;
  container.append(titleDiv);

  // Close button
  const closeDiv = document.createElement('div');
  closeDiv.classList.add('tooltip-signin-register--close');
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('type', 'button');
  closeBtn.classList.add('icon', 'cross-icon-black', 'tooltip-signin-register--close-btn');
  closeBtn.setAttribute('aria-label', 'Close tooltip');
  closeDiv.append(closeBtn);
  container.append(closeDiv);

  // CTAs
  const ctasDiv = document.createElement('div');
  ctasDiv.classList.add('tooltip-signin-register--ctas');

  ctaRows.forEach((row, index) => {
    const [linkCell, labelCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    // Original HTML shows a span with button-text inside the anchor,
    // but the model is 'text' for label, so we'll just put textContent directly.
    // If the original HTML had <a href><span class="button-text">Login</span></a>,
    // we would need to create the span. For now, textContent is fine.
    anchor.textContent = labelCell.textContent.trim();
    anchor.classList.add('button', 'button-text'); // Added 'button-text' class from original HTML
    anchor.setAttribute('aria-label', '');
    anchor.setAttribute('rel', 'follow');

    if (index === 0) {
      anchor.classList.add('red', 'tooltip-signin-register--signin');
    } else {
      anchor.classList.add('transparent-black', 'tooltip-signin-register--signup');
    }

    moveInstrumentation(row, anchor);
    ctasDiv.append(anchor);
  });
  container.append(ctasDiv);
  tooltipRegister.append(container);

  block.replaceChildren(tooltipRegister);

  // Add event listener for close button
  closeBtn.addEventListener('click', () => {
    tooltipRegister.classList.remove('show');
    // For a real tooltip, you might also hide the trigger or manage other state
  });

  // No images in this block per the model, so createOptimizedPicture is not needed.
  // Removing the image optimization logic.
}
