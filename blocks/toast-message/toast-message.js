import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [messageRow] = [...block.children];

  const toastDiv = document.createElement('div');
  toastDiv.classList.add('toast', 'align-items-center');
  toastDiv.setAttribute('role', 'alert');
  toastDiv.setAttribute('aria-live', 'assertive');
  toastDiv.setAttribute('aria-atomic', 'true');

  const flexDiv = document.createElement('div');
  flexDiv.classList.add('d-flex');

  const toastBodyDiv = document.createElement('div');
  toastBodyDiv.classList.add('toast-body');
  if (messageRow) {
    const [messageCell] = [...messageRow.children]; // Destructure to get the message cell
    if (messageCell) {
      moveInstrumentation(messageCell, toastBodyDiv); // Move instrumentation from the cell
      toastBodyDiv.textContent = messageCell.textContent.trim();
    }
  }

  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('btn-close', 'me-2', 'm-auto');
  closeButton.setAttribute('aria-label', 'Close');

  // Implement close behavior as data-bs-dismiss is inert
  closeButton.addEventListener('click', () => {
    toastDiv.classList.remove('show'); // Assuming 'show' class controls visibility
    // No need for toastDiv.style.display = 'none'; as 'show' class removal should handle visibility
  });

  flexDiv.append(toastBodyDiv, closeButton);
  toastDiv.append(flexDiv);

  block.replaceChildren(toastDiv);
}
