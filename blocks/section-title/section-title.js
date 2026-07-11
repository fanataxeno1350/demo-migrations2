import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('cmp-title');

  const titleElement = document.createElement('h3');
  titleElement.classList.add('cmp-title__text');
  moveInstrumentation(titleRow, titleElement);
  titleElement.textContent = titleRow.textContent.trim();

  root.append(titleElement);
  block.replaceChildren(root);
}
