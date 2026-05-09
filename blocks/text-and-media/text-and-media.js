import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    scarpImageRow,
    mainImageWebpRow,
    mainImagePngRow,
    headlineRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-text-and-media-wrapper');

  // Scarp Image
  // scarpImageRow is the div containing the cell, so scarpImageRow.children[0] is the cell itself
  const scarpImageCell = scarpImageRow?.children[0];
  if (scarpImageCell) {
    const scarpImg = scarpImageCell.querySelector('picture > img');
    if (scarpImg) {
      const scarpElement = document.createElement('img');
      scarpElement.classList.add('cmp-text-and-media__scarp', 'fade-in');
      scarpElement.setAttribute('data-fade-in', '');
      scarpElement.setAttribute('is-animated', 'true');
      scarpElement.setAttribute('data-is-reverse', 'true');
      scarpElement.src = scarpImg.src;
      scarpElement.alt = scarpImg.alt;
      scarpElement.loading = 'lazy';
      scarpElement.setAttribute('aria-label', scarpImg.alt);
      moveInstrumentation(scarpImageRow, scarpElement);
      wrapper.append(scarpElement);
    }
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

  const pictureElement = document.createElement('picture');
  pictureElement.classList.add('cmp-text-and-media--image-container__picture');

  // mainImageWebpRow is the div containing the cell, so mainImageWebpRow.children[0] is the cell itself
  const mainImageWebpCell = mainImageWebpRow?.children[0];
  if (mainImageWebpCell) {
    const mainImageWebp = mainImageWebpCell.querySelector('picture > img');
    if (mainImageWebp) {
      const sourceWebp = document.createElement('source');
      sourceWebp.srcset = mainImageWebp.src;
      sourceWebp.type = 'image/webp';
      pictureElement.append(sourceWebp);
    }
  }

  // mainImagePngRow is the div containing the cell, so mainImagePngRow.children[0] is the cell itself
  const mainImagePngCell = mainImagePngRow?.children[0];
  if (mainImagePngCell) {
    const mainImagePng = mainImagePngCell.querySelector('picture > img');
    if (mainImagePng) {
      const img = createOptimizedPicture(mainImagePng.src, mainImagePng.alt, false, [{ width: '750' }]);
      const newImg = img.querySelector('img');
      newImg.classList.add('cmp-text-and-media--image-container__image', 'layout-portrait', 'animate-image-zoom-out', 'in-viewport');
      newImg.setAttribute('role', 'img');
      moveInstrumentation(mainImagePngRow, newImg);
      pictureElement.append(img);
    }
  }
  imageContainer.append(pictureElement);
  cmpTextAndMedia.append(imageContainer);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-text-and-media--content', 'in-viewport');

  const slideWrap = document.createElement('div');
  slideWrap.classList.add('slide-wrap');

  const slideUpDiv = document.createElement('div');
  slideUpDiv.setAttribute('data-slide-type', 'slide-up');
  slideUpDiv.classList.add('slide-up');

  // Headline
  const headlineCell = headlineRow?.children[0];
  if (headlineCell) {
    const titleDiv = document.createElement('div');
    titleDiv.id = 'text-and-media-title';
    titleDiv.classList.add('cmp-text-and-media--content__title');
    titleDiv.setAttribute('tabindex', '0');
    titleDiv.innerHTML = headlineCell.innerHTML;
    moveInstrumentation(headlineRow, titleDiv);
    slideUpDiv.append(titleDiv);
  }

  // Description
  const descriptionCell = descriptionRow?.children[0];
  if (descriptionCell) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-text-and-media--content__description');
    descriptionDiv.setAttribute('tabindex', '0');
    descriptionDiv.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionRow, descriptionDiv);
    slideUpDiv.append(descriptionDiv);
  }

  // CTA Link and Label
  const ctaLinkCell = ctaLinkRow?.children[0];
  const ctaLabelCell = ctaLabelRow?.children[0];

  if (ctaLinkCell && ctaLabelCell) {
    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();

    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.classList.add('cta', 'cta__primary', 'cmp-text-and-media--content__cta');
      anchor.setAttribute('target', '_self');
      anchor.setAttribute('aria-label', ctaLabel);

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
      iconSpan.setAttribute('aria-hidden', 'true');
      anchor.append(iconSpan);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('cta__label');
      labelSpan.textContent = ctaLabel;
      anchor.append(labelSpan);
      moveInstrumentation(ctaLinkRow, anchor);
      moveInstrumentation(ctaLabelRow, anchor); // move instrumentation for label row to the anchor as well
      slideUpDiv.append(anchor);
    }
  }

  slideWrap.append(slideUpDiv);
  contentDiv.append(slideWrap);
  cmpTextAndMedia.append(contentDiv);

  const overflowFix = document.createElement('div');
  overflowFix.classList.add('cmp-text-and-media-overflow-fix');
  cmpTextAndMedia.append(overflowFix);

  wrapper.append(cmpTextAndMedia);

  block.replaceChildren(wrapper);
}
