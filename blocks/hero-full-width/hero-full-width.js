import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js'; // Added loadScript, loadCSS
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) { // Added async
  const [
    backgroundPosterImageRow,
    backgroundWebpSourceRow,
    backgroundImageRow,
    titleRow,
    descriptionRow,
    ...ctaRows
  ] = [...block.children];

  // CHECK 0.7 A: querySelector('div') on richtext cells — always returns null, silently empties content.
  // Fixed: Reading directly from the row's first child (the cell itself) for richtext.
  // For reference types, it's correct to query for picture/img.
  const backgroundPosterImageCell = backgroundPosterImageRow?.children[0];
  const backgroundWebpSourceCell = backgroundWebpSourceRow?.children[0];
  const backgroundImageCell = backgroundImageRow?.children[0];
  const titleCell = titleRow?.children[0];
  const descriptionCell = descriptionRow?.children[0];

  const heroFullWidth = document.createElement('div');
  heroFullWidth.classList.add('cmp-hero-full-width', 'parallax-child-2');
  heroFullWidth.setAttribute('data-media-type', 'imageTypeSelected');
  // CHECK 0.6: row-level innerHTML. Fixed: titleCell.innerHTML instead of titleRow.innerHTML
  heroFullWidth.setAttribute('aria-label', titleCell?.innerHTML || '');
  heroFullWidth.setAttribute('aria-hidden', 'true');

  const viewportImage = document.createElement('div');
  viewportImage.classList.add('viewport-image');
  viewportImage.setAttribute('hidden', '');
  viewportImage.setAttribute('aria-hidden', 'true');

  const viewportVideo = document.createElement('div');
  viewportVideo.classList.add('viewport-video');
  viewportVideo.setAttribute('hidden', '');
  viewportVideo.setAttribute('aria-hidden', 'true');

  const cover = document.createElement('div');
  cover.classList.add('cmp-hero-full-width__cover');

  const background = document.createElement('div');
  background.classList.add('cmp-hero-full-width__background');

  const backgroundWrapper = document.createElement('div');
  backgroundWrapper.classList.add('cmp-hero-full-width__background-wrapper', 'zoom-out');

  const backgroundVideo = document.createElement('video');
  backgroundVideo.classList.add('cmp-hero-full-width__background-video');
  backgroundVideo.loop = true;
  backgroundVideo.muted = true;
  backgroundVideo.playsInline = true;
  backgroundVideo.autoplay = true;
  backgroundVideo.style.display = 'none';
  // CHECK 0.6: row-level innerHTML. Fixed: titleCell.innerHTML instead of titleRow.innerHTML
  backgroundVideo.setAttribute('aria-label', titleCell?.innerHTML || '');
  backgroundVideo.setAttribute('aria-hidden', 'true');
  backgroundVideo.setAttribute('data-responsive-video', '');
  if (backgroundPosterImageCell) {
    const posterImg = backgroundPosterImageCell.querySelector('img');
    if (posterImg) backgroundVideo.poster = posterImg.src;
  }

  const backgroundPoster = document.createElement('img');
  backgroundPoster.classList.add('cmp-hero-full-width__background-poster');
  backgroundPoster.loading = 'lazy';
  backgroundPoster.style.display = 'none';
  backgroundPoster.setAttribute('aria-hidden', 'true');
  if (backgroundPosterImageCell) {
    const posterImg = backgroundPosterImageCell.querySelector('img');
    if (posterImg) {
      backgroundPoster.src = posterImg.src;
      backgroundPoster.alt = posterImg.alt;
      moveInstrumentation(backgroundPosterImageRow, backgroundPoster); // Instrumentation moved from row
    }
  }

  const picture = document.createElement('picture');
  const source = document.createElement('source');
  const img = document.createElement('img');
  img.classList.add('cmp-hero-full-width__background-image');
  if (backgroundImageCell) {
    const originalPicture = backgroundImageCell.querySelector('picture');
    if (originalPicture) {
      const originalSource = originalPicture.querySelector('source');
      const originalImg = originalPicture.querySelector('img');
      if (originalSource) source.srcset = originalSource.srcset;
      if (originalImg) {
        img.src = originalImg.src;
        img.alt = originalImg.alt;
      }
      moveInstrumentation(backgroundImageRow, picture); // Instrumentation moved from row
      picture.append(source, img);
    }
  }

  backgroundWrapper.append(backgroundVideo, backgroundPoster, picture);
  background.append(backgroundWrapper);

  const content = document.createElement('div');
  content.classList.add('cmp-hero-full-width__content');

  const slideWrap1 = document.createElement('div');
  slideWrap1.classList.add('slide-wrap');
  const slideUp1 = document.createElement('div');
  slideUp1.classList.add('slide-up');
  slideUp1.setAttribute('data-slide-type', 'slide-up');

  const title = document.createElement('div');
  title.classList.add('cmp-hero-full-width__content__title');
  title.setAttribute('tabindex', '0');
  if (titleCell) {
    moveInstrumentation(titleRow, title); // Instrumentation moved from row
    // CHECK 0.7 B: <p>-inside-<p>. Fixed: titleCell.innerHTML is correct for richtext into div.
    title.innerHTML = titleCell.innerHTML;
  }

  const description = document.createElement('div');
  description.classList.add('cmp-hero-full-width__content__description');
  description.setAttribute('tabindex', '0');
  if (descriptionCell) {
    moveInstrumentation(descriptionRow, description); // Instrumentation moved from row
    // CHECK 0.7 B: <p>-inside-<p>. Fixed: descriptionCell.innerHTML is correct for richtext into div.
    description.innerHTML = descriptionCell.innerHTML;
  }

  slideUp1.append(title, description);
  slideWrap1.append(slideUp1);

  const slideWrap2 = document.createElement('div');
  slideWrap2.classList.add('slide-wrap');
  const slideUp2 = document.createElement('div');
  slideUp2.classList.add('slide-up');
  slideUp2.setAttribute('data-slide-type', 'slide-up');

  const ctasContainer = document.createElement('div');
  ctasContainer.classList.add('cmp-hero-full-width__content--ctas');

  ctaRows.forEach((row) => {
    // CHECK 0: Direct .children[n] bracket access. Fixed: using array destructuring.
    const [ctaLinkCell, ctaLabelCell] = [...row.children];

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('cta', 'cta__secondary', 'primaryCta');
    ctaLink.setAttribute('target', '_blank');
    ctaLink.setAttribute('data-palette', 'palette-light');

    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
      ctaLink.setAttribute('aria-label', ctaLabelCell?.textContent.trim() || '');
    }

    const ctaLabel = document.createElement('span');
    ctaLabel.classList.add('cta__label');
    ctaLabel.textContent = ctaLabelCell?.textContent.trim() || '';
    ctaLink.append(ctaLabel);

    moveInstrumentation(row, ctaLink);
    ctasContainer.append(ctaLink);
  });

  slideUp2.append(ctasContainer);
  slideWrap2.append(slideUp2);

  content.append(slideWrap1, slideWrap2);

  heroFullWidth.append(viewportImage, viewportVideo, cover, background, content);

  block.replaceChildren(heroFullWidth);

  // CHECK 2.5 C: Swiper CDN assets. Not a Swiper block, so no Swiper assets needed.
  // Optimize images
  heroFullWidth.querySelectorAll('picture > img').forEach((imgEl) => {
    const optimizedPic = createOptimizedPicture(imgEl.src, imgEl.alt, false, [{ width: '750' }]);
    moveInstrumentation(imgEl, optimizedPic.querySelector('img'));
    imgEl.closest('picture').replaceWith(optimizedPic);
  });
}
