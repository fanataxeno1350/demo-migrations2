import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, headlineSubtextRow, ...buttonRows] = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('section-our-work'); // Removed: block's own class already on outer div
  section.classList.add(
    'theme-dark',
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

  const headlineWrapper = document.createElement('div');
  headlineWrapper.classList.add('sm:col-span-10', 'xl:col-span-9');
  gridCentered.append(headlineWrapper);

  const h2 = document.createElement('h2');
  h2.classList.add(
    'text-h2',
    'theme-dark:text-foreground-td',
    'theme-medium:text-foreground-tm',
    'text-foreground',
    'text-pretty',
  );
  moveInstrumentation(headlineRow, h2);
  h2.textContent = headlineRow.textContent.trim();

  const span = document.createElement('span');
  span.classList.add(
    'theme-dark:text-foreground-colored-muted',
    'text-foreground-muted',
  );
  moveInstrumentation(headlineSubtextRow, span);
  span.textContent = headlineSubtextRow.textContent.trim();
  h2.append(span);
  headlineWrapper.append(h2);

  if (buttonRows.length > 0) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add(
      'sm:col-span-4',
      'xl:col-span-3',
      'sm:flex',
      'sm:justify-end',
      'sm:items-end',
    );
    gridCentered.append(buttonContainer);

    buttonRows.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];

      const anchor = document.createElement('a');
      anchor.classList.add(
        'button',
        'button--dark-outline',
        'theme-dark:button--light-outline',
      );
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      anchor.textContent = labelCell.textContent.trim();

      const svg = document.createElement('svg');
      svg.classList.add(
        'icon',
        'icon--arrow-right',
        'size-4',
        'shrink-0',
        'ml-2',
        'fill-foreground',
        'transition-transform',
        'motion-safe:group-hocus:translate-x-1',
        'forced-colors:text-[LinkText]',
      );
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElement('use');
      use.setAttribute('xlink:href', '#arrow-right');
      use.setAttribute('href', '#arrow-right');
      svg.append(use);
      anchor.append(svg);

      moveInstrumentation(row, anchor);
      buttonContainer.append(anchor);
    });
  }

  block.replaceChildren(section);
}
