import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    videoLargePosterRow,
    videoLargeSourceRow,
    videoSmallPosterRow,
    videoSmallSourceRow,
    primaryTitleRow,
    primaryCtaLinkRow,
    primaryCtaLabelRow,
    secondaryTitleRow,
    secondaryCtaLinkRow,
    secondaryCtaLabelRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('grid-container', 'homepage-banner-wrapper', 'variation--banner', 'bg--paper-white');
  section.setAttribute('data-is-banner', 'true');

  const homepageBannerDiv = document.createElement('div');
  homepageBannerDiv.classList.add('homepage-banner', 'reveal-effect-container');
  section.append(homepageBannerDiv);

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');
  homepageBannerDiv.append(mediaContainer);

  // Large Video
  const videoLarge = document.createElement('video');
  videoLarge.muted = true;
  videoLarge.classList.add('video--large', 'show-for-large');
  videoLarge.playsInline = true;
  videoLarge.preload = 'none';
  const largePosterImg = videoLargePosterRow.querySelector('picture img');
  if (largePosterImg) {
    videoLarge.poster = largePosterImg.src;
    videoLarge.setAttribute('data-poster', largePosterImg.src);
  }
  const largeSource = document.createElement('source');
  const largeSourceImg = videoLargeSourceRow.querySelector('picture img');
  if (largeSourceImg) {
    largeSource.src = largeSourceImg.src;
    largeSource.setAttribute('data-src', largeSourceImg.src);
    largeSource.type = 'video/mp4';
  }
  videoLarge.append(largeSource);
  mediaContainer.append(videoLarge);
  moveInstrumentation(videoLargePosterRow, videoLarge);
  moveInstrumentation(videoLargeSourceRow, videoLarge.querySelector('source'));

  // Small Video
  const videoSmall = document.createElement('video');
  videoSmall.muted = true;
  videoSmall.classList.add('video--small', 'hide-for-large');
  videoSmall.playsInline = true;
  videoSmall.preload = 'none';
  const smallPosterImg = videoSmallPosterRow.querySelector('picture img');
  if (smallPosterImg) {
    videoSmall.poster = smallPosterImg.src;
    videoSmall.setAttribute('data-poster', smallPosterImg.src);
  }
  const smallSource = document.createElement('source');
  const smallSourceImg = videoSmallSourceRow.querySelector('picture img');
  if (smallSourceImg) {
    smallSource.src = smallSourceImg.src;
    smallSource.setAttribute('data-src', smallSourceImg.src);
    smallSource.type = 'video/mp4';
  }
  videoSmall.append(smallSource);
  mediaContainer.append(videoSmall);
  moveInstrumentation(videoSmallPosterRow, videoSmall);
  moveInstrumentation(videoSmallSourceRow, videoSmall.querySelector('source'));

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content-container', 'animate-enter', 'in-view');
  homepageBannerDiv.append(contentContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');
  contentContainer.append(maxWidthContainer);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('content-wrapper');
  maxWidthContainer.append(contentWrapper);

  // Primary Title
  const primaryTitle = document.createElement('h1');
  primaryTitle.classList.add('primary-title');
  primaryTitle.textContent = primaryTitleRow.textContent.trim();
  contentWrapper.append(primaryTitle);
  moveInstrumentation(primaryTitleRow, primaryTitle);

  // Primary CTA
  const primaryCtaContainer = document.createElement('div');
  primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');
  const primaryCtaLink = document.createElement('a');
  const foundPrimaryLink = primaryCtaLinkRow.querySelector('a');
  if (foundPrimaryLink) {
    primaryCtaLink.href = foundPrimaryLink.href;
  }
  primaryCtaLink.classList.add('button', 'red');
  primaryCtaLink.rel = 'follow';
  const primaryCtaLabelSpan = document.createElement('span');
  primaryCtaLabelSpan.classList.add('button-text');
  primaryCtaLabelSpan.textContent = primaryCtaLabelRow.textContent.trim();
  primaryCtaLink.append(primaryCtaLabelSpan);
  primaryCtaContainer.append(primaryCtaLink);
  contentWrapper.append(primaryCtaContainer);
  moveInstrumentation(primaryCtaLinkRow, primaryCtaLink);
  moveInstrumentation(primaryCtaLabelRow, primaryCtaLabelSpan);

  // Secondary Title
  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');
  const secondaryHeadline = document.createElement('div');
  secondaryHeadline.classList.add('headline-h1', 'font-weight-bold');
  secondaryHeadline.textContent = secondaryTitleRow.textContent.trim();
  secondaryTitleDiv.append(secondaryHeadline);
  contentWrapper.append(secondaryTitleDiv);
  moveInstrumentation(secondaryTitleRow, secondaryHeadline);

  // Secondary CTA
  const secondaryCtaContainer = document.createElement('div');
  secondaryCtaContainer.classList.add('cta-container');
  const secondaryCtaLink = document.createElement('a');
  const foundSecondaryLink = secondaryCtaLinkRow.querySelector('a');
  if (foundSecondaryLink) {
    secondaryCtaLink.href = foundSecondaryLink.href;
  }
  secondaryCtaLink.classList.add('button', 'red');
  secondaryCtaLink.rel = 'follow';
  const secondaryCtaLabelSpan = document.createElement('span');
  secondaryCtaLabelSpan.classList.add('button-text');
  secondaryCtaLabelSpan.textContent = secondaryCtaLabelRow.textContent.trim();
  secondaryCtaLink.append(secondaryCtaLabelSpan);
  secondaryCtaContainer.append(secondaryCtaLink);
  secondaryTitleDiv.append(secondaryCtaContainer);
  moveInstrumentation(secondaryCtaLinkRow, secondaryCtaLink);
  moveInstrumentation(secondaryCtaLabelRow, secondaryCtaLabelSpan);

  // Greeting Container
  const greetingContainer = document.createElement('div');
  greetingContainer.classList.add('greeting-container', 'bodyLargeRegular');
  const greetingWrapper = document.createElement('div');
  greetingWrapper.classList.add('greeting-wrapper', 'animate');
  greetingContainer.append(greetingWrapper);

  const greetingMorningSpan = document.createElement('span');
  greetingMorningSpan.classList.add('greeting', 'greeting--morning');
  greetingMorningSpan.textContent = greetingMorningRow.textContent.trim();
  greetingWrapper.append(greetingMorningSpan);
  moveInstrumentation(greetingMorningRow, greetingMorningSpan);

  const greetingAfternoonSpan = document.createElement('span');
  greetingAfternoonSpan.classList.add('greeting', 'greeting--afternoon');
  greetingAfternoonSpan.textContent = greetingAfternoonRow.textContent.trim();
  greetingWrapper.append(greetingAfternoonSpan);
  moveInstrumentation(greetingAfternoonRow, greetingAfternoonSpan);

  const greetingEveningSpan = document.createElement('span');
  greetingEveningSpan.classList.add('greeting', 'greeting--evening');
  greetingEveningSpan.textContent = greetingEveningRow.textContent.trim();
  greetingWrapper.append(greetingEveningSpan);
  moveInstrumentation(greetingEveningRow, greetingEveningSpan);

  const greetingNightSpan = document.createElement('span');
  greetingNightSpan.classList.add('greeting', 'greeting--night');
  greetingNightSpan.textContent = greetingNightRow.textContent.trim();
  greetingWrapper.append(greetingNightSpan);
  moveInstrumentation(greetingNightRow, greetingNightSpan);

  section.append(greetingContainer);

  block.replaceChildren(section);

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
