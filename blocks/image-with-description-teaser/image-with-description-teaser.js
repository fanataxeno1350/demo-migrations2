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
    mainImageDesktopRow,
    mainImageMobileRow,
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('cmp-teaser');

  // Background Images
  const backgroundDesktopPicture = backgroundDesktopRow?.querySelector('picture');
  const backgroundMobilePicture = backgroundMobileRow?.querySelector('picture');

  if (backgroundDesktopPicture) {
    const desktopImg = backgroundDesktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
    optimizedDesktopPic.classList.add('background-desktop-image'); // Custom class for styling
    root.append(optimizedDesktopPic);
    moveInstrumentation(backgroundDesktopRow, optimizedDesktopPic.querySelector('img'));
  }

  if (backgroundMobilePicture) {
    const mobileImg = backgroundMobilePicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '768' }]);
    optimizedMobilePic.classList.add('background-mobile-image'); // Custom class for styling
    root.append(optimizedMobilePic);
    moveInstrumentation(backgroundMobileRow, optimizedMobilePic.querySelector('img'));
  }

  // Content Wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('cmp-teaser__content');

  // Title
  if (titleRow) {
    const title = document.createElement('h3');
    title.classList.add('cmp-teaser__title');
    title.textContent = titleRow.textContent.trim();
    moveInstrumentation(titleRow, title);
    contentWrapper.append(title);
  }

  // Description
  if (descriptionRow) {
    const description = document.createElement('div');
    description.classList.add('cmp-teaser__description');
    // FIX: Read innerHTML directly from the row's content div, not its first child.
    // The description field is richtext, so we need to preserve its HTML structure.
    description.innerHTML = descriptionRow.innerHTML;
    moveInstrumentation(descriptionRow, description);
    contentWrapper.append(description);
  }

  // CTA
  if (ctaLinkRow && ctaLabelRow) {
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('cmp-teaser__action-container');

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('cmp-teaser__action-link', 'cmp-button');
    const foundLink = ctaLinkRow.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }
    ctaLink.textContent = ctaLabelRow.textContent.trim();
    // Move instrumentation from both original rows to the new CTA link
    moveInstrumentation(ctaLinkRow, ctaLink);
    moveInstrumentation(ctaLabelRow, ctaLink);

    actionContainer.append(ctaLink);
    contentWrapper.append(actionContainer);
  }

  root.append(contentWrapper);

  // Main Image Wrapper
  const mainImageWrapper = document.createElement('div');
  mainImageWrapper.classList.add('cmp-teaser__image');

  // Main Image (Desktop)
  const mainImageDesktopPicture = mainImageDesktopRow?.querySelector('picture');
  if (mainImageDesktopPicture) {
    const desktopImg = mainImageDesktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1200' }]);
    optimizedDesktopPic.classList.add('cmp-image');
    optimizedDesktopPic.querySelector('img').classList.add('cmp-image__image');
    mainImageWrapper.append(optimizedDesktopPic);
    moveInstrumentation(mainImageDesktopRow, optimizedDesktopPic.querySelector('img'));
  }

  // Main Image (Mobile)
  const mainImageMobilePicture = mainImageMobileRow?.querySelector('picture');
  if (mainImageMobilePicture) {
    const mobileImg = mainImageMobilePicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '768' }]);
    optimizedMobilePic.classList.add('cmp-image');
    optimizedMobilePic.querySelector('img').classList.add('cmp-image__image');
    mainImageWrapper.append(optimizedMobilePic);
    moveInstrumentation(mainImageMobileRow, optimizedMobilePic.querySelector('img'));
  }

  root.append(mainImageWrapper);

  block.replaceChildren(root);

  // FIX: Removed the redundant image optimization loop.
  // Images are already optimized when they are created above.
  // This loop would re-optimize images that are already optimized,
  // and potentially cause issues with instrumentation.
}
