import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    backgroundPosterRow,
    backgroundImageWebpRow,
    backgroundImageRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('cmp-hero-full-width', 'parallax-child-2');

  // Background section
  const background = document.createElement('div');
  background.classList.add('cmp-hero-full-width__background');
  root.append(background);

  const backgroundWrapper = document.createElement('div');
  backgroundWrapper.classList.add('cmp-hero-full-width__background-wrapper', 'zoom-out');
  background.append(backgroundWrapper);

  // Background Poster Image
  const backgroundPosterPicture = backgroundPosterRow.querySelector('picture');
  if (backgroundPosterPicture) {
    const img = backgroundPosterPicture.querySelector('img');
    const posterImg = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    posterImg.classList.add('cmp-hero-full-width__background-poster');
    // moveInstrumentation should be on the picture element, not the img inside it,
    // as the picture element is the one being replaced/moved.
    moveInstrumentation(backgroundPosterRow, posterImg);
    backgroundWrapper.append(posterImg);
  }

  // Background Image (WebP and Fallback)
  const pictureEl = document.createElement('picture');
  const webpSource = backgroundImageWebpRow.querySelector('source');
  const fallbackImg = backgroundImageRow.querySelector('img');

  if (webpSource) {
    const newWebpSource = document.createElement('source');
    newWebpSource.srcset = webpSource.srcset;
    pictureEl.append(newWebpSource);
  }
  if (fallbackImg) {
    const newImg = createOptimizedPicture(fallbackImg.src, fallbackImg.alt, false, [{ width: '750' }]);
    newImg.classList.add('cmp-hero-full-width__background-image');
    // moveInstrumentation should be on the picture element, not the img inside it,
    // as the picture element is the one being replaced/moved.
    moveInstrumentation(backgroundImageRow, newImg);
    pictureEl.append(newImg);
  }
  if (pictureEl.children.length > 0) {
    backgroundWrapper.append(pictureEl);
  }

  // Content section
  const content = document.createElement('div');
  content.classList.add('cmp-hero-full-width__content');
  root.append(content);

  const slideWrap1 = document.createElement('div');
  slideWrap1.classList.add('slide-wrap');
  content.append(slideWrap1);

  const slideUp1 = document.createElement('div');
  slideUp1.classList.add('slide-up');
  slideUp1.dataset.slideType = 'slide-up'; // This is from original HTML
  slideWrap1.append(slideUp1);

  // Title
  const title = document.createElement('div');
  title.classList.add('cmp-hero-full-width__content__title');
  moveInstrumentation(titleRow, title);
  // FIX: Read innerHTML from the cell itself, not its child, for richtext.
  title.innerHTML = titleRow.children[0]?.innerHTML || '';
  slideUp1.append(title);

  // Description
  const description = document.createElement('div');
  description.classList.add('cmp-hero-full-width__content__description');
  moveInstrumentation(descriptionRow, description);
  // FIX: Read innerHTML from the cell itself, not its child, for richtext.
  description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  slideUp1.append(description);

  // CTA
  const slideWrap2 = document.createElement('div');
  slideWrap2.classList.add('slide-wrap');
  content.append(slideWrap2);

  const slideUp2 = document.createElement('div');
  slideUp2.classList.add('slide-up');
  slideUp2.dataset.slideType = 'slide-up'; // This is from original HTML
  slideWrap2.append(slideUp2);

  const ctas = document.createElement('div');
  ctas.classList.add('cmp-hero-full-width__content--ctas');
  slideUp2.append(ctas);

  const ctaLink = ctaLinkRow.querySelector('a');
  const ctaLabel = ctaLabelRow.textContent.trim();

  if (ctaLink && ctaLabel) {
    const anchor = document.createElement('a');
    anchor.classList.add('cta', 'cta__secondary', 'primaryCta');
    anchor.href = ctaLink.href;
    anchor.setAttribute('target', '_blank'); // Assuming target="_blank" from original HTML
    // moveInstrumentation should be on the anchor element, not the row,
    // as the anchor is the element being created and moved.
    moveInstrumentation(ctaLinkRow, anchor);

    const span = document.createElement('span');
    span.classList.add('cta__label');
    span.textContent = ctaLabel;
    anchor.append(span);
    ctas.append(anchor);
  }

  // Add the cover div
  const cover = document.createElement('div');
  cover.classList.add('cmp-hero-full-width__cover');
  root.prepend(cover); // Prepend to be behind content but above background

  block.replaceChildren(root);
}
