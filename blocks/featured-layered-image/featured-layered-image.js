import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageRow,
    foregroundImageRow,
    imageAttributionRow,
    cardsContainerRow, // This row is a placeholder for instrumentation for the cards grid
    ...cardRows
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add(
    'theme-light',
    'theme-bg',
    'theme-section-spacing',
    'featured-layered-image',
  );
  section.setAttribute('aria-labelledby', 'featured-layered-image-headline');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const gridFull = document.createElement('div');
  gridFull.classList.add('grid-full');
  container.append(gridFull);

  const gridCentered12 = document.createElement('div');
  gridCentered12.classList.add('grid-centered-12');
  gridFull.append(gridCentered12);

  const relativeWrapper = document.createElement('div');
  relativeWrapper.classList.add(
    'relative',
    'mb-lg',
    'mt-6',
    'lg:mt-8',
    'w-full',
    'h-auto',
  );
  gridCentered12.append(relativeWrapper);

  // Background Image
  const backgroundImagePicture = backgroundImageRow
    ?.querySelector('picture');
  if (backgroundImagePicture) {
    const img = backgroundImagePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '1280' }],
    );
    optimizedPic.querySelector('img').classList.add(
      'rounded-sm',
      'relative',
      'z-1',
      'w-full',
      'aspect-[4/3]',
      'md:aspect-2/1',
      'object-cover',
    );
    moveInstrumentation(backgroundImageRow, optimizedPic.querySelector('img'));
    relativeWrapper.append(optimizedPic);
  }

  // Foreground Image
  const foregroundImageWrapper = document.createElement('div');
  foregroundImageWrapper.classList.add(
    'absolute',
    'right-8',
    'md:right-12',
    'lg:right-16',
    '-top-10',
    'md:-top-16',
    'z-2',
    'w-2/3',
    'md:w-1/2',
    'max-w-[630px]',
    'aspect-square',
    'rounded-full',
    'overflow-hidden',
    'shadow-md',
  );

  const foregroundImagePicture = foregroundImageRow?.querySelector('picture');
  if (foregroundImagePicture) {
    const img = foregroundImagePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '630' }],
    );
    optimizedPic.querySelector('img').classList.add('w-full', 'h-full', 'object-cover');
    moveInstrumentation(foregroundImageRow, optimizedPic.querySelector('img'));
    foregroundImageWrapper.append(optimizedPic);
  }
  relativeWrapper.append(foregroundImageWrapper);

  // Image Attribution
  const imageAttributionDiv = document.createElement('div');
  imageAttributionDiv.classList.add('mt-2xs');
  const imageAttributionP = document.createElement('p');
  imageAttributionP.classList.add(
    'z-1',
    'relative',
    'text-caption-size',
    'theme-dark:text-foreground-colored-muted',
    'text-foreground-muted',
  );
  // FIX: Read from the cell (children[0]) instead of querySelector('div')
  imageAttributionP.textContent = imageAttributionRow?.children[0]?.textContent.trim();
  moveInstrumentation(imageAttributionRow, imageAttributionP);
  imageAttributionDiv.append(imageAttributionP);
  relativeWrapper.append(imageAttributionDiv);

  // Cards
  const cardsGrid = document.createElement('div');
  cardsGrid.classList.add(
    'grid',
    'grid-cols-1',
    'gap-grid-gutter',
    'mt-lg',
    'md:grid-cols-3',
  );
  // Move instrumentation from the container placeholder row for cards
  moveInstrumentation(cardsContainerRow, cardsGrid);

  cardRows.forEach((row) => {
    const [headlineCell, bodyCell, ctaLinkCell, ctaLabelCell] = [
      ...row.children,
    ];

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add(
      'flex',
      'flex-col',
      'items-start',
      'justify-start',
      'p-0',
    );

    const headline = document.createElement('h3');
    headline.classList.add(
      'text-h4',
      'font-bold',
      'mb-xs',
      'theme-dark:text-foreground-td',
      'theme-medium:text-foreground-tm',
      'text-foreground',
    );
    headline.textContent = headlineCell?.textContent.trim();
    moveInstrumentation(headlineCell, headline);
    cardWrapper.append(headline);

    const body = document.createElement('div');
    body.classList.add(
      'text-p1',
      'mb-md',
      'prose',
      'theme-dark:prose-td',
      'theme-medium:prose-tm',
    );
    body.innerHTML = bodyCell?.innerHTML;
    moveInstrumentation(bodyCell, body);
    cardWrapper.append(body);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('button', 'button--dark', 'theme-dark:button--light');
    const foundLink = ctaLinkCell?.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }
    ctaLink.textContent = ctaLabelCell?.textContent.trim();
    moveInstrumentation(ctaLinkCell, ctaLink);
    moveInstrumentation(ctaLabelCell, ctaLink);
    cardWrapper.append(ctaLink);

    cardsGrid.append(cardWrapper);
  });
  gridCentered12.append(cardsGrid);

  block.replaceChildren(section);

  // Removed the redundant final picture optimization loop.
  // createOptimizedPicture is already called for background and foreground images.
  // Any other images in richtext will be handled by the default aem.js behavior.
}
