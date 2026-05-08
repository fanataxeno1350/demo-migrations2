import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add(
    'grid-container',
    'bg--paper-white',
    'homepage-recommended-article',
    'padding',
    'animate-enter',
    'in-view',
  );
  moveInstrumentation(block, section);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'pos-rel');

  const bgContainerCell = document.createElement('div');
  bgContainerCell.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');

  const desktopPicture = backgroundDesktopRow.querySelector('picture');
  const mobilePicture = backgroundMobileRow.querySelector('picture');

  if (desktopPicture && mobilePicture) {
    const img = desktopPicture.querySelector('img');
    const mobileImg = mobilePicture.querySelector('img');

    const sources = [...desktopPicture.querySelectorAll('source')];
    if (mobileImg) {
      const mobileSource = document.createElement('source');
      mobileSource.media = '(min-width: 0px)';
      mobileSource.srcset = mobileImg.src; // Assuming mobileImg.src is the correct srcset for mobile
      sources.push(mobileSource);
    }

    const newPicture = document.createElement('picture');
    sources.forEach((source) => newPicture.appendChild(source.cloneNode(true))); // Clone source nodes
    if (img) {
      const optimizedImg = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedImg.querySelector('img').classList.add('animate-enter-fade', 'animate-delay-3', 'lazyloaded');
      newPicture.appendChild(optimizedImg.querySelector('img'));
    }
    bgContainerCell.appendChild(newPicture);
  } else if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    const newPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    newPicture.querySelector('img').classList.add('animate-enter-fade', 'animate-delay-3', 'lazyloaded');
    bgContainerCell.appendChild(newPicture);
  }

  gridX.appendChild(bgContainerCell);

  const contentCell = document.createElement('div');
  contentCell.classList.add('cell');

  const whiteBgPatch = document.createElement('div');
  whiteBgPatch.classList.add('grid-x', 'white-bg-patch');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');

  const title = document.createElement('h2');
  title.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  textContainer.appendChild(title);

  const description = document.createElement('div');
  description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  moveInstrumentation(descriptionRow, description);
  // FIX: description is richtext, so read innerHTML directly from the row's cell
  description.innerHTML = descriptionRow.innerHTML;
  textContainer.appendChild(description);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', 'animate-delay-7');
  moveInstrumentation(ctaLinkRow, ctaLink);
  const linkElement = ctaLinkRow.querySelector('a');
  if (linkElement) {
    ctaLink.href = linkElement.href;
  }

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add('button-text');
  moveInstrumentation(ctaLabelRow, ctaLabelSpan);
  ctaLabelSpan.textContent = ctaLabelRow.textContent.trim();
  ctaLink.appendChild(ctaLabelSpan);
  textContainer.appendChild(ctaLink);

  whiteBgPatch.appendChild(textContainer);
  contentCell.appendChild(whiteBgPatch);
  gridX.appendChild(contentCell);
  section.appendChild(gridX);

  block.replaceChildren(section);
}
