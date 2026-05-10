import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('inner-title', 'mobile-inner-title');

  const pageTitleDiv = document.createElement('div');
  pageTitleDiv.classList.add('page-title');

  const h1 = document.createElement('h1');
  if (titleRow) {
    const [titleCell] = [...titleRow.children]; // FIXED: Use named destructuring
    moveInstrumentation(titleRow, h1);
    h1.textContent = titleCell?.textContent.trim() || ''; // Use the named cell
  }

  pageTitleDiv.append(h1);
  section.append(pageTitleDiv);

  block.replaceChildren(section);
}

