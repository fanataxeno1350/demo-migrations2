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
    const [titleCell] = [...titleRow.children]; // FIXED: Replaced direct children[0] access
    moveInstrumentation(titleRow, h1);
    h1.textContent = titleCell?.textContent.trim() || '';
  }

  pageTitleDiv.append(h1);
  section.append(pageTitleDiv);
  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation for the picture element itself, not just the img inside it
    moveInstrumentation(img.closest('picture'), optimizedPic);
    img.closest('picture').replaceWith(optimizedPic);
  });
}
