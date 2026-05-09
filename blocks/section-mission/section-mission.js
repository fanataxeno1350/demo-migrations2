import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0.5: Removed 'section-mission' class from inner wrapper.
  // CHECK 0: Replaced direct children[0] access with named destructuring.
  const [headlineRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add(
    'theme-light',
    'theme-bg',
    'theme-section-spacing',
    'first:not-is-themed:mt-component',
  );

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const gridFull = document.createElement('div');
  gridFull.classList.add('grid-full');
  container.append(gridFull);

  const gridCentered = document.createElement('div');
  gridCentered.classList.add(
    'grid-centered-12',
    'grid',
    'grid-cols-subgrid',
    'gap-grid-gutter',
  );
  gridFull.append(gridCentered);

  const colSpanDiv = document.createElement('div');
  colSpanDiv.classList.add(
    'sm:col-span-14',
    'md:col-span-12',
    'xl:col-span-10',
  );
  gridCentered.append(colSpanDiv);

  const headline = document.createElement('h2');
  headline.classList.add(
    'text-h2',
    'theme-dark:text-foreground-td',
    'theme-medium:text-foreground-tm',
    'text-foreground',
    'text-pretty',
  );

  if (headlineRow) {
    // CHECK 0: Replaced direct children[0] access with named destructuring.
    const [headlineCell] = [...headlineRow.children];
    // CHECK 3: Added moveInstrumentation for the headline row.
    moveInstrumentation(headlineRow, headline);
    // CHECK 1.5: headline is richtext, so use innerHTML.
    headline.innerHTML = headlineCell?.innerHTML || '';
  }
  colSpanDiv.append(headline);

  block.replaceChildren(section);
}
