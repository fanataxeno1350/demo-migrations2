import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block.children directly as per fixed schema
  const [
    videoLargePosterCell,
    videoLargeSourceCell,
    videoSmallPosterCell,
    videoSmallSourceCell,
    primaryTitleCell,
    primaryCtaLabelCell,
    primaryCtaLinkCell,
    secondaryTitleCell,
    secondaryCtaLabelCell,
    secondaryCtaLinkCell,
    greetingMorningCell,
    greetingAfternoonCell,
    greetingEveningCell,
    greetingNightCell,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('grid-container', 'homepage-banner-wrapper', 'variation--banner', 'bg--paper-white');
  section.setAttribute('data-is-banner', 'true');

  const homepageBannerDiv = document.createElement('div');
  homepageBannerDiv.classList.add('homepage-banner', 'reveal-effect-container');
  homepageBannerDiv.style.opacity = '1';
  homepageBannerDiv.style.clipPath = 'unset';
  homepageBannerDiv.style.transform = 'scale(1)';

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');

  // Large Video
  const videoLarge = document.createElement('video');
  videoLarge.muted = true;
  videoLarge.classList.add('video--large', 'show-for-large');
  videoLarge.playsInline = true;
  videoLarge.preload = 'none';

  const largePosterPicture = videoLargePosterCell.querySelector('picture');
  const largePosterImg = largePosterPicture ? largePosterPicture.querySelector('img') : null;
  if (largePosterImg) {
    videoLarge.poster = largePosterImg.src;
    videoLarge.setAttribute('data-poster', largePosterImg.src);
  }

  const sourceLarge = document.createElement('source');
  const largeSourceImg = videoLargeSourceCell.querySelector('img'); // This is correct, as the cell contains a picture with an img
  if (largeSourceImg) {
    sourceLarge.src = largeSourceImg.src;
    sourceLarge.setAttribute('data-src', largeSourceImg.src);
  }
  sourceLarge.type = 'video/mp4';
  videoLarge.append(sourceLarge);
  moveInstrumentation(videoLargePosterCell, videoLarge);
  moveInstrumentation(videoLargeSourceCell, videoLarge);
  mediaContainer.append(videoLarge);

  // Small Video
  const videoSmall = document.createElement('video');
  videoSmall.muted = true;
  videoSmall.classList.add('video--small', 'hide-for-large');
  videoSmall.playsInline = true;
  videoSmall.preload = 'none';

  const smallPosterPicture = videoSmallPosterCell.querySelector('picture');
  const smallPosterImg = smallPosterPicture ? smallPosterPicture.querySelector('img') : null;
  if (smallPosterImg) {
    videoSmall.poster = smallPosterImg.src;
    videoSmall.setAttribute('data-poster', smallPosterImg.src);
  }

  const sourceSmall = document.createElement('source');
  const smallSourceImg = videoSmallSourceCell.querySelector('img'); // This is correct, as the cell contains a picture with an img
  if (smallSourceImg) {
    sourceSmall.src = smallSourceImg.src;
    sourceSmall.setAttribute('data-src', smallSourceImg.src);
  }
  sourceSmall.type = 'video/mp4';
  videoSmall.append(sourceSmall);
  moveInstrumentation(videoSmallPosterCell, videoSmall);
  moveInstrumentation(videoSmallSourceCell, videoSmall);
  mediaContainer.append(videoSmall);

  homepageBannerDiv.append(mediaContainer);

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content-container', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('content-wrapper');

  const primaryTitle = document.createElement('h1');
  primaryTitle.classList.add('primary-title');
  primaryTitle.textContent = primaryTitleCell.textContent.trim();
  moveInstrumentation(primaryTitleCell, primaryTitle);
  contentWrapper.append(primaryTitle);

  const primaryCtaContainer = document.createElement('div');
  primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');

  const primaryCtaLink = document.createElement('a');
  primaryCtaLink.classList.add('button', 'red');
  primaryCtaLink.rel = 'follow';
  const primaryLink = primaryCtaLinkCell.querySelector('a');
  if (primaryLink) {
    primaryCtaLink.href = primaryLink.href;
  }
  const primaryCtaSpan = document.createElement('span');
  primaryCtaSpan.classList.add('button-text');
  primaryCtaSpan.textContent = primaryCtaLabelCell.textContent.trim();
  primaryCtaLink.append(primaryCtaSpan);
  moveInstrumentation(primaryCtaLabelCell, primaryCtaLink);
  moveInstrumentation(primaryCtaLinkCell, primaryCtaLink);
  primaryCtaContainer.append(primaryCtaLink);
  contentWrapper.append(primaryCtaContainer);

  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');

  const secondaryHeadline = document.createElement('div');
  secondaryHeadline.classList.add('headline-h1', 'font-weight-bold');
  secondaryHeadline.textContent = secondaryTitleCell.textContent.trim();
  moveInstrumentation(secondaryTitleCell, secondaryHeadline);
  secondaryTitleDiv.append(secondaryHeadline);

  const secondaryCtaContainer = document.createElement('div');
  secondaryCtaContainer.classList.add('cta-container');

  const secondaryCtaLink = document.createElement('a');
  secondaryCtaLink.classList.add('button', 'red');
  secondaryCtaLink.rel = 'follow';
  const secondaryLink = secondaryCtaLinkCell.querySelector('a');
  if (secondaryLink) {
    secondaryCtaLink.href = secondaryLink.href;
  }
  const secondaryCtaSpan = document.createElement('span');
  secondaryCtaSpan.classList.add('button-text');
  secondaryCtaSpan.textContent = secondaryCtaLabelCell.textContent.trim();
  secondaryCtaLink.append(secondaryCtaSpan);
  moveInstrumentation(secondaryCtaLabelCell, secondaryCtaLink);
  moveInstrumentation(secondaryCtaLinkCell, secondaryCtaLink);
  secondaryCtaContainer.append(secondaryCtaLink);
  secondaryTitleDiv.append(secondaryCtaContainer);
  contentWrapper.append(secondaryTitleDiv);

  maxWidthContainer.append(contentWrapper);
  contentContainer.append(maxWidthContainer);
  homepageBannerDiv.append(contentContainer);
  section.append(homepageBannerDiv);

  const greetingContainer = document.createElement('div');
  greetingContainer.classList.add('greeting-container', 'bodyLargeRegular');

  const greetingWrapper = document.createElement('div');
  greetingWrapper.classList.add('greeting-wrapper', 'animate');

  const greetingMorningSpan = document.createElement('span');
  greetingMorningSpan.classList.add('greeting', 'greeting--morning');
  greetingMorningSpan.textContent = greetingMorningCell.textContent.trim();
  moveInstrumentation(greetingMorningCell, greetingMorningSpan);
  greetingWrapper.append(greetingMorningSpan);

  const greetingAfternoonSpan = document.createElement('span');
  greetingAfternoonSpan.classList.add('greeting', 'greeting--afternoon');
  greetingAfternoonSpan.textContent = greetingAfternoonCell.textContent.trim();
  moveInstrumentation(greetingAfternoonCell, greetingAfternoonSpan);
  greetingWrapper.append(greetingAfternoonSpan);

  const greetingEveningSpan = document.createElement('span');
  greetingEveningSpan.classList.add('greeting', 'greeting--evening');
  greetingEveningSpan.textContent = greetingEveningCell.textContent.trim();
  moveInstrumentation(greetingEveningCell, greetingEveningSpan);
  greetingWrapper.append(greetingEveningSpan);

  const greetingNightSpan = document.createElement('span');
  greetingNightSpan.classList.add('greeting', 'greeting--night');
  greetingNightSpan.textContent = greetingNightCell.textContent.trim();
  moveInstrumentation(greetingNightCell, greetingNightSpan);
  greetingWrapper.append(greetingNightSpan);

  greetingContainer.append(greetingWrapper);
  section.append(greetingContainer);

  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
