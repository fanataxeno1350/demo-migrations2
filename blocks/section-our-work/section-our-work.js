import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, ctaLinkRow, ctaLabelRow] = [...block.children];

  const section = document.createElement('section');
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

  // Headline
  if (headlineRow) {
    const [headlineCell] = [...headlineRow.children]; // Destructure for fixed schema
    const headlineWrapper = document.createElement('div');
    headlineWrapper.classList.add('sm:col-span-10', 'xl:col-span-9');
    const headline = document.createElement('h2');
    headline.classList.add(
      'text-h2',
      'theme-dark:text-foreground-td',
      'theme-medium:text-foreground-tm',
      'text-foreground',
      'text-pretty',
    );
    moveInstrumentation(headlineRow, headline);
    headline.innerHTML = headlineCell?.innerHTML || ''; // Use innerHTML for richtext
    headlineWrapper.append(headline);
    gridCentered.append(headlineWrapper);
  }

  // CTA Link and Label
  if (ctaLinkRow && ctaLabelRow) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add(
      'sm:col-span-4',
      'xl:col-span-3',
      'sm:flex',
      'sm:justify-end',
      'sm:items-end',
    );

    const ctaLink = document.createElement('a');
    ctaLink.classList.add(
      'button',
      'button--dark-outline',
      'theme-dark:button--light-outline',
    );

    const foundLink = ctaLinkRow.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }

    const ctaLabel = ctaLabelRow.textContent.trim();
    ctaLink.textContent = ctaLabel;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
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
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('xlink:href', '#arrow-right');
    use.setAttribute('href', '#arrow-right');
    svg.append(use);
    ctaLink.append(svg);

    // moveInstrumentation for both original rows to the single CTA link element
    moveInstrumentation(ctaLinkRow, ctaLink);
    moveInstrumentation(ctaLabelRow, ctaLink);

    ctaWrapper.append(ctaLink);
    gridCentered.append(ctaWrapper);
  }

  block.replaceChildren(section);
}
