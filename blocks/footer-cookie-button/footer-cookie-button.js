import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [buttonLabelCell] = [...block.children];

  const cookieBtnContainer = document.createElement('div');
  cookieBtnContainer.classList.add('cookie-btn-container', 'bg--light-beige-accent', 'optanon-toggle-display');

  const button = document.createElement('button');
  button.classList.add('cookie-btn', 'bodySmallRegular');

  const span = document.createElement('span');
  span.classList.add('cookie-btn-text');
  
  if (buttonLabelCell) {
    moveInstrumentation(buttonLabelCell, span);
    span.textContent = buttonLabelCell.textContent.trim();
  }

  button.append(span);
  cookieBtnContainer.append(button);

  // Add event listener for the cookie button
  button.addEventListener('click', () => {
    // This is a placeholder for the actual cookie consent logic.
    // In a real scenario, this would likely open a consent management platform (CMP) modal.
    // For now, we'll just log a message.
    console.log('Cookie button clicked! Implement actual consent logic here.');
    // Example: if using a specific CMP, you might call its API here:
    // OnetrustActiveGroups.toggleInfoDisplay();
  });

  block.replaceChildren(cookieBtnContainer);
}

