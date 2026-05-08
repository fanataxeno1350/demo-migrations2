import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0: Replaced direct bracket access with array destructuring for fixed schema
  const [messageRow] = [...block.children];
  const [messageCell] = [...messageRow.children];

  const toast = document.createElement('div');
  toast.classList.add('toast', 'align-items-center');
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  const dFlex = document.createElement('div');
  dFlex.classList.add('d-flex');

  const toastBody = document.createElement('div');
  toastBody.classList.add('toast-body');
  if (messageCell) {
    // messageCell is a text type, so its content is directly the text.
    // No querySelector('p') needed as it's not richtext, and no querySelector('a') as it's not a link.
    toastBody.textContent = messageCell.textContent.trim();
    moveInstrumentation(messageCell, toastBody); // Move instrumentation from the cell to the new element
  }

  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('btn-close', 'me-2', 'm-auto');
  // CHECK 2.6 C: Removed data-bs-dismiss="toast" as it's a Bootstrap-specific attribute not used in EDS
  closeButton.setAttribute('aria-label', 'Close');

  // Add event listener for closing the toast
  closeButton.addEventListener('click', () => {
    toast.classList.remove('show'); // Assuming 'show' class controls visibility
    toast.style.display = 'none'; // Hide completely after animation (if any)
  });

  dFlex.append(toastBody, closeButton);
  toast.append(dFlex);

  // Replace the block's children with the new toast structure
  block.replaceChildren(toast);
}
