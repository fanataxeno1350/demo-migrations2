import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [contentRow] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('text', 'cta-text', 'font-weight-medium');

  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text');
  moveInstrumentation(contentRow, cmpText); // Move instrumentation from contentRow to cmpText
  // contentRow.children[0] is a cell, which is a div. Its innerHTML is "<p>...</p>".
  // Assigning it to cmpText (a div) is correct.
  cmpText.innerHTML = contentRow.children[0]?.innerHTML || '';

  wrapper.append(cmpText);
  block.replaceChildren(wrapper);
}
