import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageDesktopCell,
    backgroundImageMobileCell,
    titleCell,
    descriptionCell,
    ctaLinkCell,
    ctaLabelCell,
  ] = [...block.children];

  const section = document.createElement('section');
  // The block name 'sustainability-hub-recycle-section' is already on the outer block div.
  // 'homepage-recommended-article' is also a block-level class from the original HTML.
  // Adding it again to an inner wrapper causes double padding/CSS. Removed it.
  section.classList.add(
    'grid-container',
    'bg--paper-white',
    'padding',
    'animate-enter',
    'in-view',
  );
  moveInstrumentation(block, section); // Move instrumentation from block to section

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'pos-rel');
  section.append(gridX);

  // Background Image Container
  const bgContainerCell = document.createElement('div');
  bgContainerCell.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');

  const picture = document.createElement('picture');
  const desktopPictureElement = backgroundImageDesktopCell.querySelector('picture');
  const mobilePictureElement = backgroundImageMobileCell.querySelector('picture');

  if (desktopPictureElement) {
    const desktopImg = desktopPictureElement.querySelector('img');
    if (desktopImg) {
      const sourceDesktop = document.createElement('source');
      sourceDesktop.media = '(min-width: 1024px)';
      sourceDesktop.srcset = desktopImg.src;
      picture.append(sourceDesktop);
    }
  }

  if (mobilePictureElement) {
    const mobileImg = mobilePictureElement.querySelector('img');
    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 1023px)';
      sourceMobile.srcset = mobileImg.src;
      picture.append(sourceMobile);
    }
  }

  // Fallback img from desktop picture if available
  const fallbackImg = desktopPictureElement ? desktopPictureElement.querySelector('img') : null;
  if (fallbackImg) {
    // createOptimizedPicture returns a <picture> element. We should append the whole thing.
    // The original code was appending img.querySelector('img') which is redundant.
    const optimizedPicture = createOptimizedPicture(fallbackImg.src, fallbackImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(backgroundImageDesktopCell, optimizedPicture.querySelector('img'));
    picture.append(optimizedPicture.querySelector('img')); // Append the img from the optimized picture
  }

  bgContainerCell.append(picture);
  gridX.append(bgContainerCell);

  // Content Container
  const contentCell = document.createElement('div');
  contentCell.classList.add('cell');
  gridX.append(contentCell);

  const whiteBgPatch = document.createElement('div');
  whiteBgPatch.classList.add('grid-x', 'white-bg-patch');
  contentCell.append(whiteBgPatch);

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');
  whiteBgPatch.append(textContainer);

  // Title
  const title = document.createElement('h2');
  title.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
  moveInstrumentation(titleCell, title);
  title.textContent = titleCell.textContent.trim();
  textContainer.append(title);

  // Description
  const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
  description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  moveInstrumentation(descriptionCell, description);
  description.innerHTML = descriptionCell.innerHTML;
  textContainer.append(description);

  // CTA Link
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', 'animate-delay-7');
  moveInstrumentation(ctaLinkCell, ctaLink);
  const foundCtaLink = ctaLinkCell.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  }
  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('button-text');
  moveInstrumentation(ctaLabelCell, ctaLabel);
  ctaLabel.textContent = ctaLabelCell.textContent.trim();
  ctaLink.append(ctaLabel);
  textContainer.append(ctaLink);

  block.replaceChildren(section);
}
