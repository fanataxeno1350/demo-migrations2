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

  const homepageBanner = document.createElement('div');
  homepageBanner.classList.add('homepage-banner', 'reveal-effect-container');
  moveInstrumentation(block, homepageBanner);

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');

  // Large Video
  const videoLarge = document.createElement('video');
  videoLarge.muted = true;
  videoLarge.classList.add('video--large', 'show-for-large');
  videoLarge.playsInline = true;
  videoLarge.preload = 'none';

  const largePosterImg = videoLargePosterRow?.querySelector('picture img');
  if (largePosterImg) {
    videoLarge.poster = largePosterImg.src;
    videoLarge.setAttribute('data-poster', largePosterImg.src);
  }

  const largeSourceLink = videoLargeSourceRow?.querySelector('picture img');
  if (largeSourceLink) {
    const sourceLarge = document.createElement('source');
    sourceLarge.src = largeSourceLink.src;
    sourceLarge.setAttribute('data-src', largeSourceLink.src);
    sourceLarge.type = 'video/mp4';
    videoLarge.append(sourceLarge);
  }
  mediaContainer.append(videoLarge);

  // Small Video
  const videoSmall = document.createElement('video');
  videoSmall.muted = true;
  videoSmall.classList.add('video--small', 'hide-for-large');
  videoSmall.playsInline = true;
  videoSmall.preload = 'none';

  const smallPosterImg = videoSmallPosterRow?.querySelector('picture img');
  if (smallPosterImg) {
    videoSmall.poster = smallPosterImg.src;
    videoSmall.setAttribute('data-poster', smallPosterImg.src);
  }

  const smallSourceLink = videoSmallSourceRow?.querySelector('picture img');
  if (smallSourceLink) {
    const sourceSmall = document.createElement('source');
    sourceSmall.src = smallSourceLink.src;
    sourceSmall.setAttribute('data-src', smallSourceLink.src);
    sourceSmall.type = 'video/mp4';
    videoSmall.append(sourceSmall);
  }
  mediaContainer.append(videoSmall);
  homepageBanner.append(mediaContainer);

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content-container', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('content-wrapper');

  // Primary Title
  const primaryTitle = document.createElement('h1');
  primaryTitle.classList.add('primary-title');
  if (primaryTitleRow) {
    moveInstrumentation(primaryTitleRow, primaryTitle);
    primaryTitle.textContent = primaryTitleRow.textContent.trim();
  }
  contentWrapper.append(primaryTitle);

  // Primary CTA
  const primaryCtaContainer = document.createElement('div');
  primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');
  const primaryCtaLink = document.createElement('a');
  primaryCtaLink.classList.add('button', 'red');
  const primaryLinkEl = primaryCtaLinkRow?.querySelector('a');
  if (primaryLinkEl) {
    primaryCtaLink.href = primaryLinkEl.href;
    primaryCtaLink.setAttribute('aria-label', primaryLinkEl.getAttribute('aria-label') || '');
    primaryCtaLink.setAttribute('rel', primaryLinkEl.getAttribute('rel') || '');
  }
  if (primaryCtaLabelRow) {
    primaryCtaLink.textContent = primaryCtaLabelRow.textContent.trim();
    moveInstrumentation(primaryCtaLabelRow, primaryCtaLink);
  }
  moveInstrumentation(primaryCtaLinkRow, primaryCtaLink); // Ensure instrumentation is moved for the link row
  primaryCtaContainer.append(primaryCtaLink);
  contentWrapper.append(primaryCtaContainer);

  // Secondary Title and CTA
  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');
  const secondaryTitleHeadline = document.createElement('div');
  secondaryTitleHeadline.classList.add('headline-h1', 'font-weight-bold');
  if (secondaryTitleRow) {
    moveInstrumentation(secondaryTitleRow, secondaryTitleHeadline);
    secondaryTitleHeadline.textContent = secondaryTitleRow.textContent.trim();
  }
  secondaryTitleDiv.append(secondaryTitleHeadline);

  const secondaryCtaContainer = document.createElement('div');
  secondaryCtaContainer.classList.add('cta-container');
  const secondaryCtaLink = document.createElement('a');
  secondaryCtaLink.classList.add('button', 'red');
  const secondaryLinkEl = secondaryCtaLinkRow?.querySelector('a');
  if (secondaryLinkEl) {
    secondaryCtaLink.href = secondaryLinkEl.href;
    secondaryCtaLink.setAttribute('aria-label', secondaryLinkEl.getAttribute('aria-label') || '');
    secondaryCtaLink.setAttribute('rel', secondaryLinkEl.getAttribute('rel') || '');
  }
  if (secondaryCtaLabelRow) {
    secondaryCtaLink.textContent = secondaryCtaLabelRow.textContent.trim();
    moveInstrumentation(secondaryCtaLabelRow, secondaryCtaLink);
  }
  moveInstrumentation(secondaryCtaLinkRow, secondaryCtaLink); // Ensure instrumentation is moved for the link row
  secondaryCtaContainer.append(secondaryCtaLink);
  secondaryTitleDiv.append(secondaryCtaContainer);
  contentWrapper.append(secondaryTitleDiv);

  maxWidthContainer.append(contentWrapper);
  contentContainer.append(maxWidthContainer);
  homepageBanner.append(contentContainer);

  // Greeting Container
  const greetingContainer = document.createElement('div');
  greetingContainer.classList.add('greeting-container', 'bodyLargeRegular');

  const greetingWrapper = document.createElement('div');
  greetingWrapper.classList.add('greeting-wrapper', 'animate');

  const greetingMorning = document.createElement('span');
  greetingMorning.classList.add('greeting', 'greeting--morning');
  if (greetingMorningRow) {
    moveInstrumentation(greetingMorningRow, greetingMorning);
    greetingMorning.textContent = greetingMorningRow.textContent.trim();
  }
  greetingWrapper.append(greetingMorning);

  const greetingAfternoon = document.createElement('span');
  greetingAfternoon.classList.add('greeting', 'greeting--afternoon');
  if (greetingAfternoonRow) {
    moveInstrumentation(greetingAfternoonRow, greetingAfternoon);
    greetingAfternoon.textContent = greetingAfternoonRow.textContent.trim();
  }
  greetingWrapper.append(greetingAfternoon);

  const greetingEvening = document.createElement('span');
  greetingEvening.classList.add('greeting', 'greeting--evening');
  if (greetingEveningRow) {
    moveInstrumentation(greetingEveningRow, greetingEvening);
    greetingEvening.textContent = greetingEveningRow.textContent.trim();
  }
  greetingWrapper.append(greetingEvening);

  const greetingNight = document.createElement('span');
  greetingNight.classList.add('greeting', 'greeting--night');
  if (greetingNightRow) {
    moveInstrumentation(greetingNightRow, greetingNight);
    greetingNight.textContent = greetingNightRow.textContent.trim();
  }
  greetingWrapper.append(greetingNight);

  greetingContainer.append(greetingWrapper);
  section.append(homepageBanner, greetingContainer);

  block.replaceChildren(section);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
