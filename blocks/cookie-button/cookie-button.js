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

  block.replaceChildren(cookieBtnContainer);
}
