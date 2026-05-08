import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...ctaRows] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('tooltip-signin-register', 'bg--white-accent');
  root.id = 'tooltip-signin-register';
  root.setAttribute('role', 'dialog');

  const arrowSvg = document.createElement('svg');
  arrowSvg.setAttribute('role', 'presentation');
  arrowSvg.classList.add('tooltip-signin-register--arrow');
  arrowSvg.setAttribute('width', '16');
  arrowSvg.setAttribute('height', '12');
  arrowSvg.setAttribute('viewBox', '0 0 16 12');
  arrowSvg.setAttribute('fill', 'none');
  arrowSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  arrowSvg.innerHTML = '<path d="M6.26351 1.03885C7.0313 -0.304777 8.9687 -0.304778 9.73649 1.03885L16 12L0 12L6.26351 1.03885Z" fill="#FAFAFA"></path>';
  root.append(arrowSvg);

  const container = document.createElement('div');
  container.classList.add('tooltip-signin-register--container');

  if (titleRow) {
    const title = document.createElement('div'); // Use div for richtext content
    title.classList.add('labelMediumBold', 'tooltip-signin-register--title');
    moveInstrumentation(titleRow, title);
    // Fix: Read from the paragraph inside the cell, or fallback to textContent
    title.innerHTML = titleRow.querySelector('p')?.innerHTML ?? titleRow.textContent.trim() ?? '';
    container.append(title);
  }

  const closeDiv = document.createElement('div');
  closeDiv.classList.add('tooltip-signin-register--close');
  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('icon', 'cross-icon-black', 'tooltip-signin-register--close-btn');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  closeDiv.append(closeButton);
  container.append(closeDiv);

  const ctasDiv = document.createElement('div');
  ctasDiv.classList.add('tooltip-signin-register--ctas');

  ctaRows.forEach((row, index) => {
    const [ctaLinkCell, ctaLabelCell] = [...row.children]; // Correct: named destructuring
    const anchor = document.createElement('a');
    const foundLink = ctaLinkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = ctaLabelCell?.textContent.trim() || '';
    anchor.setAttribute('aria-label', '');
    anchor.setAttribute('rel', 'follow');
    anchor.classList.add('button');

    // Apply specific classes based on index or content if needed
    if (index === 0) {
      anchor.classList.add('red', 'tooltip-signin-register--signin');
    } else if (index === 1) {
      anchor.classList.add('transparent-black', 'tooltip-signin-register--signup');
    }

    const span = document.createElement('span');
    span.classList.add('button-text');
    span.textContent = anchor.textContent; // Use the label as button text
    anchor.textContent = ''; // Clear anchor text to append span
    anchor.append(span);

    moveInstrumentation(row, anchor);
    ctasDiv.append(anchor);
  });

  container.append(ctasDiv);
  root.append(container);

  block.replaceChildren(root);

  // Add event listener for close button
  closeButton.addEventListener('click', () => {
    root.classList.remove('show'); // Assuming 'show' class controls visibility
    // Add any other logic to hide the tooltip, e.g., focus management
  });

  // Removed image optimization as there are no images in this block's model or original HTML.
}
