import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRowElement, ...ctaRowElements] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('tooltip-signin-register', 'bg--white-accent');
  root.id = 'tooltip-signin-register';
  root.setAttribute('role', 'dialog');

  const arrowSvg = document.createElement('svg');
  arrowSvg.classList.add('tooltip-signin-register--arrow');
  arrowSvg.setAttribute('role', 'presentation');
  arrowSvg.setAttribute('width', '16');
  arrowSvg.setAttribute('height', '12');
  arrowSvg.setAttribute('viewBox', '0 0 16 12');
  arrowSvg.setAttribute('fill', 'none');
  arrowSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  arrowSvg.innerHTML = '<path d="M6.26351 1.03885C7.0313 -0.304777 8.9687 -0.304778 9.73649 1.03885L16 12L0 12L6.26351 1.03885Z" fill="#FAFAFA"></path>';
  root.append(arrowSvg);

  const container = document.createElement('div');
  container.classList.add('tooltip-signin-register--container');
  root.append(container);

  if (titleRowElement) {
    const [titleCell] = [...titleRowElement.children]; // Destructuring for fixed schema
    const title = document.createElement('div');
    title.classList.add('labelMediumBold', 'tooltip-signin-register--title');
    moveInstrumentation(titleRowElement, title);
    title.innerHTML = titleCell?.innerHTML || ''; // Use innerHTML for richtext
    container.append(title);
  }

  const closeButtonWrapper = document.createElement('div');
  closeButtonWrapper.classList.add('tooltip-signin-register--close');
  container.append(closeButtonWrapper);

  const closeButton = document.createElement('button');
  closeButton.classList.add('icon', 'cross-icon-black', 'tooltip-signin-register--close-btn');
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  closeButtonWrapper.append(closeButton);

  // Add event listener for the close button
  closeButton.addEventListener('click', () => {
    // Example: Hide the tooltip or remove it from DOM
    root.style.display = 'none'; // Or root.remove();
  });

  const ctasWrapper = document.createElement('div');
  ctasWrapper.classList.add('tooltip-signin-register--ctas');
  // containerPlaceholder is not a real row, so no moveInstrumentation here.
  container.append(ctasWrapper);

  ctaRowElements.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children]; // Correct: named destructuring for fixed schema

    const linkEl = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.setAttribute('aria-label', ''); // From original HTML
      linkEl.setAttribute('rel', 'follow'); // From original HTML
    }
    linkEl.classList.add('button');

    // Apply specific classes based on index or content if needed, matching original HTML
    if (index === 0) {
      linkEl.classList.add('red', 'tooltip-signin-register--signin');
    } else if (index === 1) {
      linkEl.classList.add('transparent-black', 'tooltip-signin-register--signup');
    }

    const span = document.createElement('span');
    span.classList.add('button-text');
    span.textContent = labelCell?.textContent.trim() || '';
    linkEl.append(span);

    moveInstrumentation(row, linkEl);
    ctasWrapper.append(linkEl);
  });

  block.replaceChildren(root);
}
