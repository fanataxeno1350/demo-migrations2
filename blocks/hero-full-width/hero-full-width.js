import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundVideoPosterRow,
    backgroundImageWebpRow,
    backgroundImageRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  // Main wrapper
  const root = document.createElement('div');
  root.classList.add('cmp-hero-full-width', 'parallax-child-2');
  moveInstrumentation(block, root);

  // Add viewport divs and cover div as per original HTML
  const viewportImage = document.createElement('div');
  viewportImage.classList.add('viewport-image');
  viewportImage.hidden = true;
  viewportImage.setAttribute('aria-hidden', 'true');
  root.append(viewportImage);

  const viewportVideo = document.createElement('div');
  viewportVideo.classList.add('viewport-video');
  viewportVideo.hidden = true;
  viewportVideo.setAttribute('aria-hidden', 'true');
  root.append(viewportVideo);

  const coverDiv = document.createElement('div');
  coverDiv.classList.add('cmp-hero-full-width__cover');
  root.append(coverDiv);

  // Background section
  const background = document.createElement('div');
  background.classList.add('cmp-hero-full-width__background');
  const backgroundWrapper = document.createElement('div');
  backgroundWrapper.classList.add('cmp-hero-full-width__background-wrapper', 'zoom-out');
  background.append(backgroundWrapper);

  // Background video (if available) - check if video poster is present
  const videoPosterPicture = backgroundVideoPosterRow?.querySelector('picture');
  if (videoPosterPicture) {
    const video = document.createElement('video');
    video.classList.add('cmp-hero-full-width__background-video');
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.style.display = 'none'; // Initially hidden, controlled by JS in original site
    video.poster = videoPosterPicture.querySelector('img')?.src;
    video.setAttribute('aria-label', titleRow?.textContent.trim() || ''); // From original HTML
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('data-responsive-video', '');

    // Assuming video source is derived from poster or another field not in this model.
    // For now, only poster is available, so video element is created but src is empty.
    // If a video file link was available, it would be set here: video.src = videoLink.href;
    // For now, we'll use a placeholder or assume it's handled by another script.
    // If the original HTML had a <source> inside <video>, we'd replicate that.
    // Since it doesn't, we'll leave src empty unless a model field for video source is added.
    backgroundWrapper.append(video);

    const posterImg = document.createElement('img');
    posterImg.classList.add('cmp-hero-full-width__background-poster');
    posterImg.src = videoPosterPicture.querySelector('img')?.src;
    posterImg.alt = videoPosterPicture.querySelector('img')?.alt || '';
    posterImg.loading = 'lazy';
    posterImg.style.display = 'none'; // Initially hidden
    posterImg.setAttribute('aria-hidden', 'true');
    backgroundWrapper.append(posterImg);
  }

  // Background image
  const picture = document.createElement('picture');
  const sourceWebp = backgroundImageWebpRow?.querySelector('picture source');
  const imgFallback = backgroundImageRow?.querySelector('picture img');

  if (sourceWebp) {
    const newSource = document.createElement('source');
    newSource.srcset = sourceWebp.srcset;
    picture.append(newSource);
  }

  if (imgFallback) {
    const newImg = createOptimizedPicture(
      imgFallback.src,
      imgFallback.alt,
      false,
      [{ width: '750' }],
    ).querySelector('img');
    newImg.classList.add('cmp-hero-full-width__background-image');
    moveInstrumentation(imgFallback, newImg);
    picture.append(newImg);
  }
  backgroundWrapper.append(picture);

  // Content section
  const content = document.createElement('div');
  content.classList.add('cmp-hero-full-width__content');

  const slideWrap1 = document.createElement('div');
  slideWrap1.classList.add('slide-wrap');
  const slideUp1 = document.createElement('div');
  slideUp1.classList.add('slide-up');
  slideUp1.setAttribute('data-slide-type', 'slide-up');
  slideWrap1.append(slideUp1);

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('cmp-hero-full-width__content__title');
  titleDiv.setAttribute('tabindex', '0'); // From original HTML
  moveInstrumentation(titleRow, titleDiv);
  // Use innerHTML for richtext fields to preserve HTML structure
  titleDiv.innerHTML = titleRow?.children[0]?.innerHTML || '';
  slideUp1.append(titleDiv);

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cmp-hero-full-width__content__description');
  descriptionDiv.setAttribute('tabindex', '0'); // From original HTML
  moveInstrumentation(descriptionRow, descriptionDiv);
  // Use innerHTML for richtext fields to preserve HTML structure
  descriptionDiv.innerHTML = descriptionRow?.children[0]?.innerHTML || '';
  slideUp1.append(descriptionDiv);

  content.append(slideWrap1);

  const slideWrap2 = document.createElement('div');
  slideWrap2.classList.add('slide-wrap');
  const slideUp2 = document.createElement('div');
  slideUp2.classList.add('slide-up');
  slideUp2.setAttribute('data-slide-type', 'slide-up');
  slideWrap2.append(slideUp2);

  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('cmp-hero-full-width__content--ctas');

  const ctaLinkCell = ctaLinkRow?.children[0];
  const ctaLinkAnchor = ctaLinkCell?.querySelector('a');
  const ctaLabelCell = ctaLabelRow?.children[0];
  const ctaLabelText = ctaLabelCell?.textContent.trim();

  if (ctaLinkAnchor && ctaLabelText) {
    const anchor = document.createElement('a');
    anchor.href = ctaLinkAnchor.href;
    anchor.classList.add('cta', 'cta__secondary', 'primaryCta');
    anchor.setAttribute('target', '_blank'); // From original HTML
    anchor.setAttribute('aria-label', ctaLabelText);
    anchor.setAttribute('data-palette', 'palette-light'); // From original HTML

    const span = document.createElement('span');
    span.classList.add('cta__label');
    span.textContent = ctaLabelText;
    anchor.append(span);
    moveInstrumentation(ctaLinkRow, anchor); // Instrument the entire row for the CTA
    ctaContainer.append(anchor);
  }
  slideUp2.append(ctaContainer);
  content.append(slideWrap2);

  root.append(background);
  root.append(content);

  block.replaceChildren(root);
}
