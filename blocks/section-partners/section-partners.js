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

  const headlineWrapper = document.createElement('div');
  headlineWrapper.classList.add('sm:col-span-14', 'md:col-span-12', 'xl:col-span-10');
  gridCentered.append(headlineWrapper);

  const headline = document.createElement('h2');
  headline.classList.add('text-h2', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm', 'text-foreground', 'text-pretty');

  if (headlineRow) {
    // The headline is a richtext field, which means its content is directly inside the cell div.
    // Access the cell using index destructuring as per the BlockJson model.
    const [headlineCell] = [...headlineRow.children];
    if (headlineCell) {
      moveInstrumentation(headlineRow, headline);
      headline.innerHTML = headlineCell.innerHTML;
    }
  }
  headlineWrapper.append(headline);

  block.replaceChildren(section);
}
