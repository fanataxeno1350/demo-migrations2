import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageDesktopRow,
    backgroundImageMobileRow,
    headlineRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add(
    'sustainability-hub-recycle-section',
    'grid-container',
    'bg--paper-white',
    'homepage-recommended-article',
    'padding',
    'animate-enter',
    'in-view',
  );
  section.style.paddingBottom = '141px'; // Preserve inline style from original HTML

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'pos-rel');

  // Background Image Container
  const bgContainer = document.createElement('div');
  bgContainer.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');
  moveInstrumentation(backgroundImageDesktopRow, bgContainer); // Instrument the whole row

  const desktopPicture = backgroundImageDesktopRow.querySelector('picture');
  const mobilePicture = backgroundImageMobileRow.querySelector('picture');

  if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 1440px)', width: '2880' },
      { media: '(min-width: 1024px)', width: '2880' },
      { media: '(min-width: 768px)', width: '2880' },
      { width: '750' },
    ]);
    optimizedPic.querySelector('img').classList.add('animate-enter-fade', 'animate-delay-3', 'lazyloaded');

    // If mobile picture exists, add it as a source within the same picture element
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const mobileSource = document.createElement('source');
      mobileSource.media = '(min-width: 0px)';
      mobileSource.srcset = mobileImg.src;
      optimizedPic.prepend(mobileSource);
    }
    bgContainer.append(optimizedPic);
  }

  gridX.append(bgContainer);

  // Text Content Container
  const textCell = document.createElement('div');
  textCell.classList.add('cell');

  const whiteBgPatch = document.createElement('div');
  whiteBgPatch.classList.add('grid-x', 'white-bg-patch');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');

  // Headline
  const headline = document.createElement('h2');
  headline.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.children[0]?.textContent.trim() || '';
  textContainer.append(headline);

  // Description
  const description = document.createElement('div');
  description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  textContainer.append(description);

  // CTA Link
  const ctaLinkAnchor = ctaLinkRow.children[0]?.querySelector('a');
  const ctaLabelText = ctaLabelRow.children[0]?.textContent.trim();

  if (ctaLinkAnchor && ctaLabelText) {
    const cta = document.createElement('a');
    cta.href = ctaLinkAnchor.href;
    cta.title = ctaLabelText;
    cta.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', 'animate-delay-7');
    cta.setAttribute('aria-label', '');
    cta.rel = 'follow';

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('button-text');
    ctaSpan.textContent = ctaLabelText;
    cta.append(ctaSpan);
    moveInstrumentation(ctaLinkRow, cta);
    textContainer.append(cta);
  }

  whiteBgPatch.append(textContainer);
  textCell.append(whiteBgPatch);
  gridX.append(textCell);
  section.append(gridX);

  block.replaceChildren(section);

  // The original JS had a redundant createOptimizedPicture call here that was replacing
  // already optimized pictures. This is removed.
  // The instrumentation for the background images is now handled when the bgContainer is created.
}
