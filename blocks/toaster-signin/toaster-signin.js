import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [signinMsgRow, signoutMsgRow, timerRow] = [...block.children];

  // Ensure moveInstrumentation is called for each row before reading content
  // This ensures Universal Editor can track the original content.
  moveInstrumentation(signinMsgRow, signinMsgRow);
  moveInstrumentation(signoutMsgRow, signoutMsgRow);
  moveInstrumentation(timerRow, timerRow);

  const signInMessage = signinMsgRow.querySelector('div')?.textContent.trim();
  const signOutMessage = signoutMsgRow.querySelector('div')?.textContent.trim();
  const timer = parseInt(timerRow.querySelector('div')?.textContent.trim(), 10) || 2000;

  const toaster = document.createElement('section');
  // The block already has 'toaster-signin' from AEM. Do not add it again.
  toaster.classList.add('toaster');
  toaster.setAttribute('aria-label', 'Toaster Signin Module');
  toaster.setAttribute('data-timer', timer);
  // Original HTML has data-signin-msg and data-signout-msg, add them here
  toaster.setAttribute('data-signin-msg', signInMessage);
  toaster.setAttribute('data-signout-msg', signOutMessage);


  const toasterOverlay = document.createElement('div');
  toasterOverlay.classList.add('toaster--overlay', 'js-close-toaster');
  toaster.append(toasterOverlay);

  const toasterContainer = document.createElement('div');
  toasterContainer.classList.add('toaster--container');
  toaster.append(toasterContainer);

  const toasterArrow = document.createElement('svg');
  toasterArrow.classList.add('toaster--arrow');
  toasterArrow.setAttribute('role', 'presentation');
  toasterArrow.setAttribute('width', '16');
  toasterArrow.setAttribute('height', '12');
  toasterArrow.setAttribute('viewBox', '0 0 16 12');
  toasterArrow.setAttribute('fill', 'none');
  toasterArrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  toasterArrow.innerHTML = '<path d="M6.26351 1.03885C7.0313 -0.304777 8.9687 -0.304778 9.73649 1.03885L16 12L0 12L6.26351 1.03885Z" fill="white"></path>';
  toasterContainer.append(toasterArrow);

  const toasterContainerInner = document.createElement('div');
  toasterContainerInner.classList.add('toaster--container-inner');
  toasterContainer.append(toasterContainerInner);

  const toasterMessageWrapper = document.createElement('div');
  toasterMessageWrapper.classList.add('toaster--message-wrapper');
  toasterContainerInner.append(toasterMessageWrapper);

  const toasterUser = document.createElement('div');
  toasterUser.classList.add('toaster--user');
  toasterMessageWrapper.append(toasterUser);

  const toasterUserIcon = document.createElement('svg');
  toasterUserIcon.classList.add('toaster--user--icon');
  toasterUserIcon.setAttribute('width', '18');
  toasterUserIcon.setAttribute('height', '18');
  toasterUserIcon.setAttribute('viewBox', '0 0 18 18');
  toasterUserIcon.setAttribute('fill', 'none');
  toasterUserIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  toasterUserIcon.innerHTML = `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1917 11.1114C11.1532 11.1405 11.1605 11.2014 11.205 11.2201C11.8441 11.4879 12.4247 11.8804 12.9139 12.3753C13.403 12.8701 13.791 13.4576 14.0557 14.1041C14.1939 14.4417 14.2971 14.7919 14.3642 15.1492C14.4661 15.692 14.009 16.1434 13.4567 16.1434H13.0714C13.0307 16.3379 12.9391 16.5287 12.7986 16.7102C12.6025 16.9637 12.3151 17.1941 11.9527 17.3881C11.5903 17.5821 11.1601 17.736 10.6866 17.841C10.2131 17.946 9.70563 18 9.19314 18C8.68065 18 8.17318 17.946 7.6997 17.841C7.22622 17.736 6.796 17.5821 6.43361 17.3881C6.07123 17.1941 5.78377 16.9637 5.58765 16.7102C5.44722 16.5287 5.35559 16.3379 5.31487 16.1434H4.92181C4.36952 16.1434 3.91241 15.692 4.0143 15.1492C4.08136 14.7919 4.18455 14.4417 4.32277 14.1041C4.58748 13.4576 4.97547 12.8701 5.4646 12.3753C5.95373 11.8804 6.5344 11.4879 7.17348 11.2201C7.21833 11.2013 7.2257 11.1399 7.18689 11.1106C6.36802 10.4923 5.83782 9.5044 5.83782 8.39118C5.83782 6.51828 7.33856 5 9.18982 5C11.0411 5 12.5418 6.51828 12.5418 8.39118C12.5418 9.50488 12.0112 10.4932 11.1917 11.1114Z" fill="#222222"></path>
    <path d="M17.25 9C17.25 4.44365 13.5563 0.75 9 0.75L8.96717 0.750065C8.967 0.750065 8.96683 0.750067 8.96666 0.750067C4.42569 0.767996 0.75 4.45476 0.75 9C0.75 13.5563 4.44365 17.25 9 17.25C13.5563 17.25 17.25 13.5563 17.25 9Z" stroke="#222222" stroke-width="1.5"></path>
  `;
  toasterUser.append(toasterUserIcon);

  const toasterUserMessage = document.createElement('div');
  toasterUserMessage.classList.add('toaster--user-message', 'bodySmallRegular');
  toasterUserMessage.textContent = signOutMessage; // Default message is signed out
  toasterMessageWrapper.append(toasterUserMessage);

  const toasterClose = document.createElement('div');
  toasterClose.classList.add('toaster--close');
  toasterContainerInner.append(toasterClose);

  const toasterCloseBtn = document.createElement('button');
  toasterCloseBtn.classList.add('icon', 'cross-icon-black', 'toaster--close-btn', 'js-close-toaster');
  toasterCloseBtn.setAttribute('type', 'button');
  toasterCloseBtn.setAttribute('aria-label', 'Close tooltip');
  toasterClose.append(toasterCloseBtn);

  // Event listeners for closing the toaster
  const closeToaster = () => {
    toaster.classList.remove('is-active');
    toaster.removeAttribute('data-is-loggedin');
  };

  toasterOverlay.addEventListener('click', closeToaster);
  toasterCloseBtn.addEventListener('click', closeToaster);

  // Simulate login state change
  // In a real application, this would be triggered by an actual login/logout event
  const showToaster = (message, loggedInState) => {
    toasterUserMessage.textContent = message;
    toaster.classList.add('is-active');
    if (loggedInState) {
      toaster.setAttribute('data-is-loggedin', 'true');
    } else {
      toaster.removeAttribute('data-is-loggedin');
    }

    setTimeout(() => {
      closeToaster();
    }, timer);
  };

  // Example usage (for demonstration, remove in production if not needed)
  window.addEventListener('showToaster', (e) => {
    const { message, loggedIn } = e.detail;
    showToaster(message, loggedIn);
  });

  // Initial state based on current login status (if available)
  // For demonstration, assume initial state is logged out
  // showToaster(signOutMessage, false);

  // Move instrumentation from the original block div to the new toaster element
  // This ensures Universal Editor can track the block as a whole.
  moveInstrumentation(block, toaster);

  block.replaceChildren(toaster);
}
