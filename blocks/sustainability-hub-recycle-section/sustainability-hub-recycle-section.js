import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    headlineRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const section = document.createElement('section');
  // Removed 'sustainability-hub-recycle-section' as the outer block div already has it.
  section.classList.add(
    'grid-container',
    'bg--paper-white',
    'homepage-recommended-article',
    'padding',
    'animate-enter',
    'in-view',
  );

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'pos-rel');

  const bgContainerCell = backgroundDesktopRow.querySelector('div');
  const bgContainer = document.createElement('div');
  bgContainer.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');
  if (bgContainerCell) {
    moveInstrumentation(bgContainerCell, bgContainer);
    const desktopPicture = bgContainerCell.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1440' }]);
      optimizedPic.querySelector('img').classList.add('animate-enter-fade', 'animate-delay-3', 'lazyloaded');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      bgContainer.append(optimizedPic);

      // Handle mobile background image by prepending sources to the optimized picture
      const mobileBgCell = backgroundMobileRow.querySelector('div');
      if (mobileBgCell) {
        moveInstrumentation(mobileBgCell, bgContainer); // Move instrumentation for the mobile cell
        const mobilePicture = mobileBgCell.querySelector('picture');
        if (mobilePicture) {
          const mobileImg = mobilePicture.querySelector('img');
          // Create sources for different mobile breakpoints based on original HTML
          const sourceMobile0 = document.createElement('source');
          sourceMobile0.media = '(min-width: 0px)';
          sourceMobile0.srcset = mobileImg.src; // Use mobileImg.src for mobile
          optimizedPic.prepend(sourceMobile0);

          // Add other sources from original HTML for desktop image if they exist
          const desktopSources = desktopPicture.querySelectorAll('source');
          desktopSources.forEach((source) => {
            if (source.media !== '(min-width: 0px)') { // Avoid duplicating the mobile source
              optimizedPic.prepend(source.cloneNode(true));
            }
          });
        }
      }
    }
  }

  const contentCell = document.createElement('div');
  contentCell.classList.add('cell');

  const whiteBgPatch = document.createElement('div');
  whiteBgPatch.classList.add('grid-x', 'white-bg-patch');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');

  const headlineCell = headlineRow.querySelector('div');
  const headline = document.createElement('h2');
  headline.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
  if (headlineCell) {
    moveInstrumentation(headlineCell, headline);
    headline.textContent = headlineCell.textContent.trim();
  }

  const descriptionCell = descriptionRow.querySelector('div');
  const description = document.createElement('div'); // Use div for richtext
  description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  if (descriptionCell) {
    moveInstrumentation(descriptionCell, description);
    description.innerHTML = descriptionCell.innerHTML;
  }

  const ctaLinkCell = ctaLinkRow.querySelector('div');
  const ctaLabelCell = ctaLabelRow.querySelector('div');
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', 'animate-delay-7');
  if (ctaLinkCell) {
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
      moveInstrumentation(ctaLinkCell, ctaLink);
    }
  }
  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('button-text');
  if (ctaLabelCell) {
    ctaSpan.textContent = ctaLabelCell.textContent.trim();
    moveInstrumentation(ctaLabelCell, ctaSpan);
  }
  ctaLink.append(ctaSpan);

  textContainer.append(headline, description, ctaLink);
  whiteBgPatch.append(textContainer);
  contentCell.append(whiteBgPatch);
  gridX.append(bgContainer, contentCell);
  section.append(gridX);

  block.replaceChildren(section);
}
