import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const headlineRow = children[0];
  const subheadlineRow = children[1];
  const descriptionRow = children[2];

  const root = document.createElement('div');
  root.classList.add('text', 'desc-1'); // Use classes from ORIGINAL HTML

  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text');
  root.append(cmpText);

  // Main Headline
  if (headlineRow) {
    const headline = document.createElement('h2');
    moveInstrumentation(headlineRow, headline);
    // Fix: text cells contain content directly, not wrapped in an inner div
    headline.textContent = headlineRow.textContent.trim();
    headline.style.textAlign = 'center';
    cmpText.append(headline);
  }

  // Subheadline
  if (subheadlineRow) {
    const subheadline = document.createElement('h3');
    moveInstrumentation(subheadlineRow, subheadline);
    // Fix: text cells contain content directly, not wrapped in an inner div
    subheadline.textContent = subheadlineRow.textContent.trim();
    subheadline.style.textAlign = 'center';
    cmpText.append(subheadline);
  }

  // Description
  if (descriptionRow) {
    const description = document.createElement('p');
    moveInstrumentation(descriptionRow, description);
    // Fix: text cells contain content directly, not wrapped in an inner div
    description.textContent = descriptionRow.textContent.trim();
    description.style.textAlign = 'center';
    cmpText.append(description);
  }

  block.replaceChildren(root);
}

