import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('theme-light', 'theme-bg', 'theme-section-spacing', 'first:not-is-themed:mt-component');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const gridFull = document.createElement('div');
  gridFull.classList.add('grid-full');
  container.append(gridFull);

  const gridCentered = document.createElement('div');
  gridCentered.classList.add('grid-centered-12', 'grid', 'grid-cols-subgrid', 'gap-grid-gutter');
  gridFull.append(gridCentered);

  const colSpan = document.createElement('div');
  colSpan.classList.add('sm:col-span-14', 'md:col-span-12', 'xl:col-span-10');
  gridCentered.append(colSpan);

  const headline = document.createElement('h2');
  headline.classList.add('text-h2', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm', 'text-foreground', 'text-pretty');
  if (headlineRow) {
    const [headlineCell] = [...headlineRow.children]; // Fixed: Use array destructuring
    moveInstrumentation(headlineRow, headline);
    headline.innerHTML = headlineCell?.innerHTML || '';
  }
  colSpan.append(headline);

  block.replaceChildren(section);
}
