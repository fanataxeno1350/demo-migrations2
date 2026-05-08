import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    scarpImageRow,
    mainImageRow,
    mainImageWebpRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-text-and-media-wrapper');
  moveInstrumentation(block, wrapper);

  // Scarp Image
  // scarpImageRow.children[0] is the cell itself, no inner div wrapper
  const scarpImageCell = scarpImageRow.children[0];
  const scarpPicture = scarpImageCell ? scarpImageCell.querySelector('picture') : null;
  if (scarpPicture) {
    const scarpImg = scarpPicture.querySelector('img');
    const optimizedScarpPic = createOptimizedPicture(
      scarpImg.src,
      scarpImg.alt,
      false,
      [{ width: '750' }],
    );
    const newScarpImg = optimizedScarpPic.querySelector('img');
    newScarpImg.classList.add('cmp-text-and-media__scarp', 'fade-in');
    newScarpImg.setAttribute('data-fade-in', '');
    newScarpImg.setAttribute('is-animated', 'true');
    newScarpImg.setAttribute('data-is-reverse', 'true');
    // moveInstrumentation should be called on the row, not the picture element
    moveInstrumentation(scarpImageRow, optimizedScarpPic.querySelector('img'));
    wrapper.append(optimizedScarpPic);
  }

  const cmpTextAndMedia = document.createElement('div');
  cmpTextAndMedia.classList.add('cmp-text-and-media');
  cmpTextAndMedia.setAttribute('data-cmp-is', 'text-and-media');
  cmpTextAndMedia.setAttribute('aria-labelledby', 'text-and-media-title');
  cmpTextAndMedia.style.overflow = 'hidden';
  cmpTextAndMedia.setAttribute('is-animated', 'true');
  cmpTextAndMedia.setAttribute('data-is-reverse', 'true');

  const imageContainer = document.createElement('div');
  imageContainer.classList.add(
    'cmp-text-and-media--image-container',
    'animate-image-container-up-fade',
    'in-viewport',
    'slide-up',
  );
  imageContainer.setAttribute('data-slide-type', 'slide-up');
  imageContainer.setAttribute('data-slide-no-wrap', '');

  const imagePicture = document.createElement('picture');
  imagePicture.classList.add('cmp-text-and-media--image-container__picture');

  // Main Image (WebP)
  // mainImageWebpRow.children[0] is the cell itself, no inner div wrapper
  const mainImageWebpCell = mainImageWebpRow.children[0];
  const mainImageWebpPicture = mainImageWebpCell ? mainImageWebpCell.querySelector('picture') : null;
  if (mainImageWebpPicture) {
    const source = mainImageWebpPicture.querySelector('source');
    if (source) {
      imagePicture.append(source);
    }
  }

  // Main Image
  // mainImageRow.children[0] is the cell itself, no inner div wrapper
  const mainImageCell = mainImageRow.children[0];
  const mainImagePicture = mainImageCell ? mainImageCell.querySelector('picture') : null;
  if (mainImagePicture) {
    const img = mainImagePicture.querySelector('img');
    const optimizedMainPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const newMainImg = optimizedMainPic.querySelector('img');
    newMainImg.classList.add(
      'cmp-text-and-media--image-container__image',
      'layout-portrait',
      'animate-image-zoom-out',
      'in-viewport',
    );
    newMainImg.setAttribute('role', 'img');
    // moveInstrumentation should be called on the row, not the picture element
    moveInstrumentation(mainImageRow, optimizedMainPic.querySelector('img'));
    imagePicture.append(newMainImg);
  }
  imageContainer.append(imagePicture);
  cmpTextAndMedia.append(imageContainer);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-text-and-media--content', 'in-viewport');

  const slideWrap = document.createElement('div');
  slideWrap.classList.add('slide-wrap');

  const slideUpDiv = document.createElement('div');
  slideUpDiv.setAttribute('data-slide-type', 'slide-up');
  slideUpDiv.classList.add('slide-up');

  // Title
  const titleDiv = document.createElement('div');
  titleDiv.id = 'text-and-media-title';
  titleDiv.classList.add('cmp-text-and-media--content__title');
  titleDiv.setAttribute('tabindex', '0');
  // titleRow.children[0] is the cell itself, no inner div wrapper
  const titleCell = titleRow.children[0];
  if (titleCell) {
    moveInstrumentation(titleRow, titleDiv);
    titleDiv.innerHTML = titleCell.innerHTML;
  }
  slideUpDiv.append(titleDiv);

  // Description
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cmp-text-and-media--content__description');
  descriptionDiv.setAttribute('tabindex', '0');
  // descriptionRow.children[0] is the cell itself, no inner div wrapper
  const descriptionCell = descriptionRow.children[0];
  if (descriptionCell) {
    moveInstrumentation(descriptionRow, descriptionDiv);
    descriptionDiv.innerHTML = descriptionCell.innerHTML;
  }
  slideUpDiv.append(descriptionDiv);

  // CTA Link and Label
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('cta', 'cta__primary', 'cmp-text-and-media--content__cta');
  // ctaLinkRow.children[0] is the cell itself
  const ctaLinkElement = ctaLinkRow.children[0]?.querySelector('a');
  if (ctaLinkElement) {
    ctaLink.href = ctaLinkElement.href;
  }
  // ctaLabelRow.children[0] is the cell itself
  const ctaLabelCell = ctaLabelRow.children[0];
  if (ctaLabelCell) {
    ctaLink.setAttribute('aria-label', ctaLabelCell.textContent.trim());
    const ctaLabelSpan = document.createElement('span');
    ctaLabelSpan.classList.add('cta__label');
    ctaLabelSpan.textContent = ctaLabelCell.textContent.trim();
    ctaLink.append(ctaLabelSpan);
  }

  const ctaIcon = document.createElement('span');
  ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  ctaIcon.setAttribute('aria-hidden', 'true');
  ctaLink.prepend(ctaIcon);

  moveInstrumentation(ctaLinkRow, ctaLink);
  slideUpDiv.append(ctaLink);

  slideWrap.append(slideUpDiv);
  contentDiv.append(slideWrap);
  cmpTextAndMedia.append(contentDiv);

  const overflowFix = document.createElement('div');
  overflowFix.classList.add('cmp-text-and-media-overflow-fix');
  cmpTextAndMedia.append(overflowFix);

  wrapper.append(cmpTextAndMedia);

  block.replaceChildren(wrapper);
}
