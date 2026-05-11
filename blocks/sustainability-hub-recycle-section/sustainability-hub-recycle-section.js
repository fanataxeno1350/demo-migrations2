import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageDesktopRow,
    backgroundImageMobileRow,
    titleRow,
    descriptionRow,
    buttonLinkRow,
    buttonLabelRow,
  ] = [...block.children];

  const section = document.createElement('section');
  // Removed 'sustainability-hub-recycle-section' as the block already has it from AEM
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

  const bgContainerCell = document.createElement('div');
  bgContainerCell.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');

  const desktopPicture = backgroundImageDesktopRow.querySelector('picture');
  const mobilePicture = backgroundImageMobileRow.querySelector('picture');

  // The original HTML has specific media queries for sources, which createOptimizedPicture handles.
  // The generated JS was re-optimizing with generic widths, which is redundant and less specific.
  // We should just move the existing picture element or create a new one with the original img src.
  if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 1440px)', width: '1440' },
      { media: '(min-width: 1024px)', width: '1024' },
      { media: '(min-width: 768px)', width: '768' },
      { width: '750' }, // Fallback for smaller screens if no specific mobile picture
    ]);
    moveInstrumentation(backgroundImageDesktopRow, optimizedPic.querySelector('img'));
    bgContainerCell.append(optimizedPic);
  } else if (mobilePicture) {
    // Fallback to mobile if desktop is not present
    const img = mobilePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' }, // Mobile specific width
    ]);
    moveInstrumentation(backgroundImageMobileRow, optimizedPic.querySelector('img'));
    bgContainerCell.append(optimizedPic);
  }

  gridX.append(bgContainerCell);

  const contentCell = document.createElement('div');
  contentCell.classList.add('cell');

  const contentGridX = document.createElement('div');
  contentGridX.classList.add('grid-x', 'white-bg-patch');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');

  const title = document.createElement('h2');
  title.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  textContainer.append(title);

  const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
  description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  moveInstrumentation(descriptionRow, description);
  // Correctly read richtext content from the cell's innerHTML
  description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  textContainer.append(description);

  const buttonLink = buttonLinkRow.querySelector('a');
  const buttonLabel = buttonLabelRow.textContent.trim();

  if (buttonLink && buttonLabel) {
    const anchor = document.createElement('a');
    anchor.href = buttonLink.href;
    anchor.title = buttonLabel;
    anchor.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', 'animate-delay-7');
    anchor.setAttribute('aria-label', ''); // Original HTML has empty aria-label
    anchor.setAttribute('rel', 'follow');
    moveInstrumentation(buttonLinkRow, anchor);

    const span = document.createElement('span');
    span.classList.add('button-text');
    span.textContent = buttonLabel;
    anchor.append(span);
    textContainer.append(anchor);
  }

  contentGridX.append(textContainer);
  contentCell.append(contentGridX);
  gridX.append(contentCell);
  section.append(gridX);

  block.replaceChildren(section);

  // This section is redundant as createOptimizedPicture is already called above for the main images.
  // If there are other images within the block content that need optimization,
  // they should be handled in their respective content parsing logic.
  // Removing this to avoid double processing and potential issues.
  // section.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
