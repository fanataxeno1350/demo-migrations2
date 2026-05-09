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
  section.style.paddingBottom = '141px'; // Inline style from original HTML

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'pos-rel');

  const bgContainerCell = document.createElement('div');
  bgContainerCell.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');

  // Background Image Desktop
  const desktopPicture = backgroundImageDesktopRow.querySelector('picture');
  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(
      desktopImg.src,
      desktopImg.alt,
      false,
      [{ media: '(min-width: 1440px)', width: '2880' }],
      [{ media: '(min-width: 1024px)', width: '2880' }],
      [{ media: '(min-width: 768px)', width: '2880' }],
    );
    moveInstrumentation(backgroundImageDesktopRow, optimizedDesktopPic.querySelector('img'));
    bgContainerCell.append(optimizedDesktopPic);
  }

  // Background Image Mobile
  const mobilePicture = backgroundImageMobileRow.querySelector('picture');
  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(
      mobileImg.src,
      mobileImg.alt,
      false,
      [{ media: '(min-width: 0px)', width: '750' }],
    );
    moveInstrumentation(backgroundImageMobileRow, optimizedMobilePic.querySelector('img'));
    // Append mobile picture as a source to the desktop picture for responsive images
    if (desktopPicture) {
      optimizedMobilePic.querySelectorAll('source').forEach((source) => {
        bgContainerCell.querySelector('picture').prepend(source);
      });
    } else {
      bgContainerCell.append(optimizedMobilePic);
    }
  }

  const imgEl = bgContainerCell.querySelector('img');
  if (imgEl) {
    imgEl.classList.add('animate-enter-fade', 'animate-delay-3', 'lazyloaded');
  }

  gridX.append(bgContainerCell);

  const contentCell = document.createElement('div');
  contentCell.classList.add('cell');

  const whiteBgPatch = document.createElement('div');
  whiteBgPatch.classList.add('grid-x', 'white-bg-patch');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');

  // Headline
  const headline = document.createElement('h2');
  headline.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  textContainer.append(headline);

  // Description
  const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
  description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  moveInstrumentation(descriptionRow, description);
  // Fix: Read innerHTML directly from the row's content div, not its child cell's child
  description.innerHTML = descriptionRow.innerHTML;
  textContainer.append(description);

  // CTA Link and Label
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', 'animate-delay-7');
  const foundLink = ctaLinkRow.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
  }
  ctaLink.setAttribute('title', ctaLabelRow.textContent.trim());
  ctaLink.setAttribute('aria-label', '');
  ctaLink.setAttribute('rel', 'follow');

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('button-text');
  ctaSpan.textContent = ctaLabelRow.textContent.trim();
  ctaLink.append(ctaSpan);
  moveInstrumentation(ctaLinkRow, ctaLink);
  moveInstrumentation(ctaLabelRow, ctaLink);
  textContainer.append(ctaLink);

  whiteBgPatch.append(textContainer);
  contentCell.append(whiteBgPatch);
  gridX.append(contentCell);
  section.append(gridX);

  block.replaceChildren(section);
}
