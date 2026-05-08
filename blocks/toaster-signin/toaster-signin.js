import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [isLoggedInRow, timerRow, signinMsgRow, signoutMsgRow] = [...block.children];

  const isLoggedIn = isLoggedInRow?.textContent.trim() === 'true';
  const timer = parseInt(timerRow?.textContent.trim(), 10) || 2000;
  const signinMsg = signinMsgRow?.textContent.trim() || 'You are signed in';
  const signoutMsg = signoutMsgRow?.textContent.trim() || 'You are signed out';

  const section = document.createElement('section');
  section.classList.add('toaster', 'toaster-signin');
  section.setAttribute('data-is-loggedin', isLoggedIn ? 'true' : 'false');
  section.setAttribute('data-timer', timer);
  section.setAttribute('data-signin-msg', signinMsg);
  section.setAttribute('data-signout-msg', signoutMsg);
  section.setAttribute('aria-label', 'Toaster Signin Module');

  const overlay = document.createElement('div');
  overlay.classList.add('toaster--overlay', 'js-close-toaster');
  section.append(overlay);

  const container = document.createElement('div');
  container.classList.add('toaster--container');

  const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrowSvg.setAttribute('role', 'presentation');
  arrowSvg.classList.add('toaster--arrow');
  arrowSvg.setAttribute('width', '16');
  arrowSvg.setAttribute('height', '12');
  arrowSvg.setAttribute('viewBox', '0 0 16 12');
  arrowSvg.setAttribute('fill', 'none');
  arrowSvg.innerHTML = '<path d="M6.26351 1.03885C7.0313 -0.304777 8.9687 -0.304778 9.73649 1.03885L16 12L0 12L6.26351 1.03885Z" fill="white"></path>';
  container.append(arrowSvg);

  const containerInner = document.createElement('div');
  containerInner.classList.add('toaster--container-inner');

  const messageWrapper = document.createElement('div');
  messageWrapper.classList.add('toaster--message-wrapper');

  const userDiv = document.createElement('div');
  userDiv.classList.add('toaster--user');
  const userIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  userIconSvg.classList.add('toaster--user--icon');
  userIconSvg.setAttribute('width', '18');
  userIconSvg.setAttribute('height', '18');
  userIconSvg.setAttribute('viewBox', '0 0 18 18');
  userIconSvg.setAttribute('fill', 'none');
  userIconSvg.innerHTML = `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1917 11.1114C11.1532 11.1405 11.1605 11.2014 11.205 11.2201C11.8441 11.4879 12.4247 11.8804 12.9139 12.3753C13.403 12.8701 13.791 13.4576 14.0557 14.1041C14.1939 14.4417 14.2971 14.7919 14.3642 15.1492C14.4661 15.692 14.009 16.1434 13.4567 16.1434H13.0714C13.0307 16.3379 12.9391 16.5287 12.7986 16.7102C12.6025 16.9637 12.3151 17.1941 11.9527 17.3881C11.5903 17.5821 11.1601 17.736 10.6866 17.841C10.2131 17.946 9.70563 18 9.19314 18C8.68065 18 8.17318 17.946 7.69970 17.841C7.22622 17.736 6.79600 17.5821 6.43361 17.3881C6.07123 17.1941 5.78377 16.9637 5.58765 16.7102C5.44722 16.5287 5.35559 16.3379 5.31487 16.1434H4.92181C4.36952 16.1434 3.91241 15.692 4.01430 15.1492C4.08136 14.7919 4.18455 14.4417 4.32277 14.1041C4.58748 13.4576 4.97547 12.8701 5.46460 12.3753C5.95373 11.8804 6.53440 11.4879 7.17348 11.2201C7.21833 11.2013 7.22570 11.1399 7.18689 11.1106C6.36802 10.4923 5.83782 9.50440 5.83782 8.39118C5.83782 6.51828 7.33856 5 9.18982 5C11.0411 5 12.5418 6.51828 12.5418 8.39118C12.5418 9.50488 12.0112 10.4932 11.1917 11.1114Z" fill="#222222"></path>
    <path d="M17.25 9C17.25 4.44365 13.5563 0.75 9 0.75L8.96717 0.750065C8.967 0.750065 8.96683 0.750067 8.96666 0.750067C4.42569 0.767996 0.75 4.45476 0.75 9C0.75 13.5563 4.44365 17.25 9 17.25C13.5563 17.25 17.25 13.5563 17.25 9Z" stroke="#222222" stroke-width="1.5"></path>
  `;
  userDiv.append(userIconSvg);
  messageWrapper.append(userDiv);

  const userMessageDiv = document.createElement('div');
  userMessageDiv.classList.add('toaster--user-message', 'bodySmallRegular');
  userMessageDiv.textContent = isLoggedIn ? signinMsg : signoutMsg;
  messageWrapper.append(userMessageDiv);
  containerInner.append(messageWrapper);

  const closeDiv = document.createElement('div');
  closeDiv.classList.add('toaster--close');
  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('icon', 'cross-icon-black', 'toaster--close-btn', 'js-close-toaster');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  closeDiv.append(closeButton);
  containerInner.append(closeDiv);

  container.append(containerInner);
  section.append(container);

  // Move instrumentation from original rows to the new section element
  moveInstrumentation(isLoggedInRow, section);
  moveInstrumentation(timerRow, section);
  moveInstrumentation(signinMsgRow, section);
  moveInstrumentation(signoutMsgRow, section);

  block.replaceChildren(section);

  // Add event listener for closing the toaster
  const closeToasterElements = section.querySelectorAll('.js-close-toaster');
  closeToasterElements.forEach((el) => {
    el.addEventListener('click', () => {
      section.classList.remove('show');
    });
  });

  // Simulate showing the toaster based on isLoggedIn status after a timer
  setTimeout(() => {
    section.classList.add('show');
  }, timer);
}
