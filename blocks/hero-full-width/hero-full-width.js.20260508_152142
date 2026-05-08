import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    backgroundPosterRow,
    backgroundWebpRow,
    backgroundImageRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('cmp-hero-full-width', 'parallax-child-2');
  moveInstrumentation(block, root);

  const cover = document.createElement('div');
  cover.classList.add('cmp-hero-full-width__cover');
  root.append(cover);

  const background = document.createElement('div');
  background.classList.add('cmp-hero-full-width__background');
  root.append(background);

  const backgroundWrapper = document.createElement('div');
  backgroundWrapper.classList.add('cmp-hero-full-width__background-wrapper', 'zoom-out');
  background.append(backgroundWrapper);

  // Background Poster Image
  const backgroundPosterPicture = backgroundPosterRow?.querySelector('picture');
  if (backgroundPosterPicture) {
    const img = backgroundPosterPicture.querySelector('img');
    const backgroundPoster = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    backgroundPoster.querySelector('img').classList.add('cmp-hero-full-width__background-poster');
    backgroundPoster.querySelector('img').setAttribute('loading', 'lazy');
    // backgroundPoster.querySelector('img').style.display = 'none'; // Hidden by default, controlled by CSS
    moveInstrumentation(backgroundPosterRow, backgroundPoster.querySelector('img'));
    backgroundWrapper.append(backgroundPoster);
  }

  // Background WebP Image (for video poster or direct image)
  const backgroundWebpPicture = backgroundWebpRow?.querySelector('picture');
  if (backgroundWebpPicture) {
    const source = backgroundWebpPicture.querySelector('source');
    if (source) {
      const video = document.createElement('video');
      video.classList.add('cmp-hero-full-width__background-video');
      video.setAttribute('loop', '');
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('autoplay', '');
      // video.style.display = 'none'; // Hidden by default, controlled by CSS
      video.poster = source.srcset; // Use webp source as poster if video is not available
      moveInstrumentation(backgroundWebpRow, video);
      backgroundWrapper.append(video);
    }
  }

  // Background Image (fallback JPG/PNG)
  const backgroundImagePicture = backgroundImageRow?.querySelector('picture');
  if (backgroundImagePicture) {
    const img = backgroundImagePicture.querySelector('img');
    const backgroundImage = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    backgroundImage.querySelector('img').classList.add('cmp-hero-full-width__background-image');
    backgroundImage.querySelector('img').setAttribute('loading', 'lazy');
    moveInstrumentation(backgroundImageRow, backgroundImage.querySelector('img'));
    backgroundWrapper.append(backgroundImage);
  }

  const content = document.createElement('div');
  content.classList.add('cmp-hero-full-width__content');
  root.append(content);

  const slideWrap1 = document.createElement('div');
  slideWrap1.classList.add('slide-wrap');
  content.append(slideWrap1);

  const slideUp1 = document.createElement('div');
  slideUp1.classList.add('slide-up');
  slideUp1.setAttribute('data-slide-type', 'slide-up');
  slideWrap1.append(slideUp1);

  // Title
  const titleDiv = document.createElement('div'); // Use div for richtext-safe content
  titleDiv.classList.add('cmp-hero-full-width__content__title');
  titleDiv.setAttribute('tabindex', '0');
  if (titleRow) {
    moveInstrumentation(titleRow, titleDiv);
    titleDiv.innerHTML = titleRow.children[0]?.innerHTML || ''; // Read innerHTML for richtext
  }
  slideUp1.append(titleDiv);

  // Description
  const descriptionDiv = document.createElement('div'); // Use div for richtext-safe content
  descriptionDiv.classList.add('cmp-hero-full-width__content__description');
  descriptionDiv.setAttribute('tabindex', '0');
  if (descriptionRow) {
    moveInstrumentation(descriptionRow, descriptionDiv);
    descriptionDiv.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Read innerHTML for richtext
  }
  slideUp1.append(descriptionDiv);

  const slideWrap2 = document.createElement('div');
  slideWrap2.classList.add('slide-wrap');
  content.append(slideWrap2);

  const slideUp2 = document.createElement('div');
  slideUp2.classList.add('slide-up');
  slideUp2.setAttribute('data-slide-type', 'slide-up');
  slideWrap2.append(slideUp2);

  const ctasDiv = document.createElement('div');
  ctasDiv.classList.add('cmp-hero-full-width__content--ctas');
  slideUp2.append(ctasDiv);

  // CTA Link and Label
  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add('cta', 'cta__secondary', 'primaryCta');
  ctaAnchor.setAttribute('target', '_blank');
  ctaAnchor.setAttribute('data-palette', 'palette-light');

  const ctaLink = ctaLinkRow?.querySelector('a');
  if (ctaLink) {
    ctaAnchor.href = ctaLink.href;
    moveInstrumentation(ctaLinkRow, ctaAnchor);
  }

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add('cta__label');
  if (ctaLabelRow) {
    ctaLabelSpan.textContent = ctaLabelRow.children[0]?.textContent.trim() || ''; // Read textContent for text cell
    moveInstrumentation(ctaLabelRow, ctaLabelSpan);
  }
  ctaAnchor.append(ctaLabelSpan);
  ctasDiv.append(ctaAnchor);

  block.replaceChildren(root);
}
