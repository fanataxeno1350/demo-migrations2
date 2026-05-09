import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('theme-light', 'theme-bg', 'theme-section-spacing', 'first:not-is-themed:mt-component');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridFull = document.createElement('div');
  gridFull.classList.add('grid-full');

  const gridCentered = document.createElement('div');
  gridCentered.classList.add('grid-centered-12', 'grid', 'grid-cols-subgrid', 'gap-grid-gutter');

  const colSpan = document.createElement('div');
  colSpan.classList.add('sm:col-span-14', 'md:col-span-12', 'xl:col-span-10');

  const headline = document.createElement('h2');
  headline.classList.add('text-h2', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm', 'text-foreground', 'text-pretty');

  if (headlineRow) {
    // FIXED: Replaced direct row.children[0] with array destructuring for fixed-schema row
    const [headlineCell] = [...headlineRow.children];
    if (headlineCell) {
      moveInstrumentation(headlineRow, headline);
      headline.innerHTML = headlineCell.innerHTML;
    }
  }

  colSpan.append(headline);
  gridCentered.append(colSpan);
  gridFull.append(gridCentered);
  container.append(gridFull);
  section.append(container);

  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
