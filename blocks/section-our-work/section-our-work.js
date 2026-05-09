import { createOptimizedPicture } from '../../scripts/aem.js';
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
    // FIX: headlineRow is a ROW element, its innerHTML contains the cell wrapper <div>
    // The model states 'headline' is richtext, so we want the full HTML content of the cell.
    // The cell itself is headlineRow.children[0].
    // However, the original HTML shows the H2 directly contains the text and span,
    // so we need to extract the content from the cell's innerHTML.
    // The block structure shows: <div><div><p>Headline text content</p></div></div>
    // So, headlineRow.children[0] is the inner div containing the <p>.
    // We want the content of that inner div.
    headline.innerHTML = headlineRow.children[0]?.innerHTML || '';
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
    ctaLink.textContent = ctaLabelRow.textContent.trim();

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
    svg.innerHTML = '<use xlink:href="#arrow-right" href="#arrow-right"></use>';
    ctaLink.append(svg);

    moveInstrumentation(ctaLinkRow, ctaLink);
    moveInstrumentation(ctaLabelRow, ctaLink); // Move label instrumentation to the link
    ctaWrapper.append(ctaLink);
    gridCentered.append(ctaWrapper);
  }

  block.replaceChildren(section);
}
