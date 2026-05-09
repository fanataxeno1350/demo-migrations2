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
    secondaryHeadlineRow,
    secondaryCtaLinkRow,
    secondaryCtaLabelRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add(
    'grid-container',
    'homepage-banner-wrapper',
    'variation--banner',
    'bg--paper-white',
  );
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

  const largePosterImg = videoLargePosterRow.querySelector('picture img');
  if (largePosterImg) {
    const optimizedPoster = createOptimizedPicture(
      largePosterImg.src,
      largePosterImg.alt,
      false,
      [{ width: '2000' }],
    );
    videoLarge.poster = optimizedPoster.querySelector('img').src;
    videoLarge.setAttribute('data-poster', optimizedPoster.querySelector('img').src);
  }

  const largeSourceLink = videoLargeSourceRow.children[0]?.querySelector('a'); // Corrected access
  if (largeSourceLink) {
    const sourceLarge = document.createElement('source');
    sourceLarge.src = largeSourceLink.href;
    sourceLarge.type = 'video/mp4';
    sourceLarge.setAttribute('data-src', largeSourceLink.href);
    videoLarge.append(sourceLarge);
  }
  mediaContainer.append(videoLarge);

  // Small Video
  const videoSmall = document.createElement('video');
  videoSmall.muted = true;
  videoSmall.classList.add('video--small', 'hide-for-large');
  videoSmall.playsInline = true;
  videoSmall.preload = 'none';

  const smallPosterImg = videoSmallPosterRow.querySelector('picture img');
  if (smallPosterImg) {
    const optimizedPoster = createOptimizedPicture(
      smallPosterImg.src,
      smallPosterImg.alt,
      false,
      [{ width: '750' }],
    );
    videoSmall.poster = optimizedPoster.querySelector('img').src;
    videoSmall.setAttribute('data-poster', optimizedPoster.querySelector('img').src);
  }

  const smallSourceLink = videoSmallSourceRow.children[0]?.querySelector('a'); // Corrected access
  if (smallSourceLink) {
    const sourceSmall = document.createElement('source');
    sourceSmall.src = smallSourceLink.href;
    sourceSmall.type = 'video/mp4';
    sourceSmall.setAttribute('data-src', smallSourceLink.href);
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
  moveInstrumentation(primaryTitleRow, primaryTitle);
  primaryTitle.textContent = primaryTitleRow.textContent.trim();
  contentWrapper.append(primaryTitle);

  // Primary CTA
  const primaryCtaContainer = document.createElement('div');
  primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');
  const primaryCtaLink = document.createElement('a');
  primaryCtaLink.classList.add('button', 'red');
  const primaryLinkEl = primaryCtaLinkRow.querySelector('a');
  if (primaryLinkEl) {
    primaryCtaLink.href = primaryLinkEl.href;
    primaryCtaLink.rel = 'follow';
  }
  const primaryCtaLabel = document.createElement('span');
  primaryCtaLabel.classList.add('button-text');
  primaryCtaLabel.textContent = primaryCtaLabelRow.textContent.trim();
  primaryCtaLink.append(primaryCtaLabel);
  moveInstrumentation(primaryCtaLinkRow, primaryCtaLink);
  primaryCtaContainer.append(primaryCtaLink);
  contentWrapper.append(primaryCtaContainer);

  // Secondary Title and CTA
  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');

  const secondaryHeadline = document.createElement('div');
  secondaryHeadline.classList.add('headline-h1', 'font-weight-bold');
  moveInstrumentation(secondaryHeadlineRow, secondaryHeadline);
  secondaryHeadline.textContent = secondaryHeadlineRow.textContent.trim();
  secondaryTitleDiv.append(secondaryHeadline);

  const secondaryCtaContainer = document.createElement('div');
  secondaryCtaContainer.classList.add('cta-container');
  const secondaryCtaLink = document.createElement('a');
  secondaryCtaLink.classList.add('button', 'red');
  const secondaryLinkEl = secondaryCtaLinkRow.querySelector('a');
  if (secondaryLinkEl) {
    secondaryCtaLink.href = secondaryLinkEl.href;
    secondaryCtaLink.rel = 'follow';
  }
  const secondaryCtaLabel = document.createElement('span');
  secondaryCtaLabel.classList.add('button-text');
  secondaryCtaLabel.textContent = secondaryCtaLabelRow.textContent.trim();
  secondaryCtaLink.append(secondaryCtaLabel);
  moveInstrumentation(secondaryCtaLinkRow, secondaryCtaLink);
  secondaryCtaContainer.append(secondaryCtaLink);
  secondaryTitleDiv.append(secondaryCtaContainer);

  contentWrapper.append(secondaryTitleDiv);
  maxWidthContainer.append(contentWrapper);
  contentContainer.append(maxWidthContainer);
  homepageBanner.append(contentContainer);
  section.append(homepageBanner);

  // Greeting Container
  const greetingContainer = document.createElement('div');
  greetingContainer.classList.add('greeting-container', 'bodyLargeRegular');

  const greetingWrapper = document.createElement('div');
  greetingWrapper.classList.add('greeting-wrapper', 'animate');

  const greetings = [
    { row: greetingMorningRow, className: 'greeting--morning', defaultText: 'Good morning!' },
    { row: greetingAfternoonRow, className: 'greeting--afternoon', defaultText: 'Good afternoon!' },
    { row: greetingEveningRow, className: 'greeting--evening', defaultText: 'Good evening!' },
    { row: greetingNightRow, className: 'greeting--night', defaultText: 'Good night!' },
  ];

  greetings.forEach((greetingData) => {
    const span = document.createElement('span');
    span.classList.add('greeting', greetingData.className);
    moveInstrumentation(greetingData.row, span);
    span.textContent = greetingData.row.textContent.trim() || greetingData.defaultText;
    greetingWrapper.append(span);
  });

  greetingContainer.append(greetingWrapper);
  section.append(greetingContainer);

  block.replaceChildren(section);

  // Optimize images within pictures
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
