import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundScarpImageRow,
    mainImageRow,
    mainImageWebpRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-text-and-media-wrapper');
  // moveInstrumentation(block, wrapper); // Removed: instrumentation should be moved from individual rows, not the block itself to a wrapper

  // Background Scarp Image
  const backgroundScarpImage = backgroundScarpImageRow.querySelector('picture > img');
  if (backgroundScarpImage) {
    const scarpImg = document.createElement('img');
    scarpImg.classList.add('cmp-text-and-media__scarp', 'fade-in');
    scarpImg.src = backgroundScarpImage.src;
    scarpImg.alt = backgroundScarpImage.alt;
    scarpImg.setAttribute('data-fade-in', '');
    scarpImg.setAttribute('is-animated', 'true');
    scarpImg.setAttribute('data-is-reverse', 'true');
    moveInstrumentation(backgroundScarpImageRow, scarpImg);
    wrapper.append(scarpImg);
  }

  const cmpTextAndMedia = document.createElement('div');
  cmpTextAndMedia.classList.add('cmp-text-and-media');
  cmpTextAndMedia.setAttribute('data-cmp-is', 'text-and-media');
  cmpTextAndMedia.setAttribute('aria-labelledby', 'text-and-media-title');
  cmpTextAndMedia.style.overflow = 'hidden';
  cmpTextAndMedia.setAttribute('is-animated', 'true');
  cmpTextAndMedia.setAttribute('data-is-reverse', 'true');
  // moveInstrumentation(block, cmpTextAndMedia); // Removed: instrumentation should be moved from individual rows, not the block itself

  // Main Image Container
  const imageContainer = document.createElement('div');
  imageContainer.classList.add(
    'cmp-text-and-media--image-container',
    'animate-image-container-up-fade',
    'in-viewport',
    'slide-up',
  );
  imageContainer.setAttribute('data-slide-type', 'slide-up');
  imageContainer.setAttribute('data-slide-no-wrap', '');

  const picture = document.createElement('picture');
  picture.classList.add('cmp-text-and-media--image-container__picture');

  const mainImage = mainImageRow.querySelector('picture > img');
  const mainImageWebp = mainImageWebpRow.querySelector('picture > img');

  if (mainImageWebp) {
    const source = document.createElement('source');
    source.srcset = mainImageWebp.src;
    source.type = 'image/webp';
    picture.append(source);
    moveInstrumentation(mainImageWebpRow, source);
  }

  if (mainImage) {
    const img = document.createElement('img');
    img.src = mainImage.src;
    img.alt = mainImage.alt;
    img.loading = 'lazy';
    img.classList.add(
      'cmp-text-and-media--image-container__image',
      'layout-portrait',
      'animate-image-zoom-out',
      'in-viewport',
    );
    img.setAttribute('role', 'img');
    picture.append(img);
    moveInstrumentation(mainImageRow, img);
  }
  imageContainer.append(picture);
  cmpTextAndMedia.append(imageContainer);

  // Content
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-text-and-media--content', 'in-viewport');

  const slideWrap = document.createElement('div');
  slideWrap.classList.add('slide-wrap');

  const innerSlideUp = document.createElement('div');
  innerSlideUp.setAttribute('data-slide-type', 'slide-up');
  innerSlideUp.classList.add('slide-up');

  // Title
  const titleDiv = document.createElement('div');
  titleDiv.id = 'text-and-media-title';
  titleDiv.classList.add('cmp-text-and-media--content__title');
  titleDiv.setAttribute('tabindex', '0');
  if (titleRow) {
    titleDiv.innerHTML = titleRow.children[0]?.innerHTML || '';
    moveInstrumentation(titleRow, titleDiv);
  }
  innerSlideUp.append(titleDiv);

  // Description
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cmp-text-and-media--content__description');
  descriptionDiv.setAttribute('tabindex', '0');
  if (descriptionRow) {
    descriptionDiv.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    moveInstrumentation(descriptionRow, descriptionDiv);
  }
  innerSlideUp.append(descriptionDiv);

  // CTA Link
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('cta', 'cta__primary', 'cmp-text-and-media--content__cta');
  if (ctaLinkRow) {
    const foundLink = ctaLinkRow.querySelector('a');
    if (foundLink) ctaLink.href = foundLink.href;
    moveInstrumentation(ctaLinkRow, ctaLink);
  }
  if (ctaLabelRow) {
    // The CTA label is plain text, but the original HTML shows a <span> with the label.
    // To match the original HTML structure, we create a span for the label.
    const ctaLabelSpan = document.createElement('span');
    ctaLabelSpan.classList.add('cta__label'); // Add the class from original HTML
    ctaLabelSpan.textContent = ctaLabelRow.textContent.trim();
    ctaLink.append(ctaLabelSpan); // Append the span to the ctaLink
    moveInstrumentation(ctaLabelRow, ctaLabelSpan); // Move instrumentation to the span
  }

  const ctaIcon = document.createElement('span');
  ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  ctaIcon.setAttribute('aria-hidden', 'true');
  ctaLink.prepend(ctaIcon);

  innerSlideUp.append(ctaLink);

  slideWrap.append(innerSlideUp);
  contentDiv.append(slideWrap);
  cmpTextAndMedia.append(contentDiv);

  const overflowFix = document.createElement('div');
  overflowFix.classList.add('cmp-text-and-media-overflow-fix');
  cmpTextAndMedia.append(overflowFix);

  wrapper.append(cmpTextAndMedia);

  block.replaceChildren(wrapper);

  wrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
