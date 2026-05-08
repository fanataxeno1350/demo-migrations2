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
  section.dataset.isBanner = 'true';

  const homepageBanner = document.createElement('div');
  homepageBanner.classList.add('homepage-banner', 'reveal-effect-container');
  homepageBanner.style.opacity = '1';
  homepageBanner.style.clipPath = 'unset';
  homepageBanner.style.transform = 'scale(1)';

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');

  // Large Video
  const videoLarge = document.createElement('video');
  videoLarge.muted = true;
  videoLarge.classList.add('video--large', 'show-for-large');
  videoLarge.playsInline = true;
  videoLarge.preload = 'none';

  const largePosterPic = videoLargePosterRow.querySelector('picture');
  const largePosterImg = largePosterPic ? largePosterPic.querySelector('img') : null;
  if (largePosterImg) {
    videoLarge.poster = largePosterImg.src;
    videoLarge.dataset.poster = largePosterImg.src;
  }

  // The videoLargeSourceRow contains a <picture> with an <img>, not a direct <a>.
  // The href for the video source is expected to be in the img's src or a data attribute.
  // Assuming the actual video source link is in the img's src or a data-src attribute.
  // Based on the EDS Block Structure, it's a 'reference' type, which usually means <picture><img>.
  // The original HTML shows <source data-src="..." type="video/mp4" src="..."/> inside the video tag.
  // The current JS tries to get an <a> from the row, which is incorrect for a 'reference' type.
  // We need to get the actual video URL from the img or a specific data attribute if available.
  // For now, let's assume the actual MP4 link is within the `videoLargeSourceRow`'s `picture` `img` `src`
  // or `data-src` if it was an image reference to a video.
  // However, the original HTML shows the source directly in the video tag.
  // The EDS Block Structure for `videoLargeSource` is `type=reference`, which implies `picture` `img`.
  // This is a discrepancy. Given the original HTML, the video source is directly in the video tag.
  // Let's assume the `videoLargeSourceRow` actually contains the URL in a text cell for simplicity,
  // or that the `aem-content` type was intended for the source.
  // Re-evaluating the EDS Block Structure: `type=reference` for `videoLargeSource`.
  // This means it should be `<div><div><picture><img src="video.mp4"></picture></div></div>`.
  // The current JS `videoLargeSourceRow.querySelector('a')` is incorrect.
  // It should be `videoLargeSourceRow.querySelector('img')` to get the source.
  // Let's correct this to extract the src from the img within the picture.
  const largeSourceImg = videoLargeSourceRow.querySelector('picture img');
  if (largeSourceImg && largeSourceImg.src.endsWith('.mp4')) {
    const sourceLarge = document.createElement('source');
    sourceLarge.dataset.src = largeSourceImg.src;
    sourceLarge.src = largeSourceImg.src;
    sourceLarge.type = 'video/mp4';
    videoLarge.append(sourceLarge);
  }
  moveInstrumentation(videoLargeSourceRow, videoLarge);
  moveInstrumentation(videoLargePosterRow, videoLarge);
  mediaContainer.append(videoLarge);

  // Small Video
  const videoSmall = document.createElement('video');
  videoSmall.muted = true;
  videoSmall.classList.add('video--small', 'hide-for-large');
  videoSmall.playsInline = true;
  videoSmall.preload = 'none';

  const smallPosterPic = videoSmallPosterRow.querySelector('picture');
  const smallPosterImg = smallPosterPic ? smallPosterPic.querySelector('img') : null;
  if (smallPosterImg) {
    videoSmall.poster = smallPosterImg.src;
    videoSmall.dataset.poster = smallPosterImg.src;
  }

  const smallSourceImg = videoSmallSourceRow.querySelector('picture img');
  if (smallSourceImg && smallSourceImg.src.endsWith('.mp4')) {
    const sourceSmall = document.createElement('source');
    sourceSmall.dataset.src = smallSourceImg.src;
    sourceSmall.src = smallSourceImg.src;
    sourceSmall.type = 'video/mp4';
    videoSmall.append(sourceSmall);
  }
  moveInstrumentation(videoSmallSourceRow, videoSmall);
  moveInstrumentation(videoSmallPosterRow, videoSmall);
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
  primaryTitle.textContent = primaryTitleRow.textContent.trim();
  moveInstrumentation(primaryTitleRow, primaryTitle);
  contentWrapper.append(primaryTitle);

  // Primary CTA
  const primaryCtaContainer = document.createElement('div');
  primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');

  const primaryCtaLink = document.createElement('a');
  // primaryCtaLinkRow is type=aem-content, so it contains an <a> tag directly.
  const foundPrimaryLink = primaryCtaLinkRow.querySelector('a');
  if (foundPrimaryLink) {
    primaryCtaLink.href = foundPrimaryLink.href;
  }
  primaryCtaLink.classList.add('button', 'red');
  primaryCtaLink.rel = 'follow';

  const primaryCtaSpan = document.createElement('span');
  primaryCtaSpan.classList.add('button-text');
  primaryCtaSpan.textContent = primaryCtaLabelRow.textContent.trim();
  primaryCtaLink.append(primaryCtaSpan);
  moveInstrumentation(primaryCtaLinkRow, primaryCtaLink);
  moveInstrumentation(primaryCtaLabelRow, primaryCtaSpan);
  primaryCtaContainer.append(primaryCtaLink);
  contentWrapper.append(primaryCtaContainer);

  // Secondary Title
  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');
  secondaryTitleDiv.style.display = 'none'; // Initially hidden

  const secondaryHeadline = document.createElement('div');
  secondaryHeadline.classList.add('headline-h1', 'font-weight-bold');
  secondaryHeadline.textContent = secondaryTitleRow.textContent.trim();
  moveInstrumentation(secondaryTitleRow, secondaryHeadline);
  secondaryTitleDiv.append(secondaryHeadline);

  // Secondary CTA
  const secondaryCtaContainer = document.createElement('div');
  secondaryCtaContainer.classList.add('cta-container');

  const secondaryCtaLink = document.createElement('a');
  // secondaryCtaLinkRow is type=aem-content, so it contains an <a> tag directly.
  const foundSecondaryLink = secondaryCtaLinkRow.querySelector('a');
  if (foundSecondaryLink) {
    secondaryCtaLink.href = foundSecondaryLink.href;
  }
  secondaryCtaLink.classList.add('button', 'red');
  secondaryCtaLink.rel = 'follow';

  const secondaryCtaSpan = document.createElement('span');
  secondaryCtaSpan.classList.add('button-text');
  secondaryCtaSpan.textContent = secondaryCtaLabelRow.textContent.trim();
  secondaryCtaLink.append(secondaryCtaSpan);
  moveInstrumentation(secondaryCtaLinkRow, secondaryCtaLink);
  moveInstrumentation(secondaryCtaLabelRow, secondaryCtaSpan);
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
  greetingContainer.style.opacity = '0';
  greetingContainer.style.transform = 'translate(0px, 250px)';

  const greetingWrapper = document.createElement('div');
  greetingWrapper.classList.add('greeting-wrapper', 'animate');

  const greetingMorning = document.createElement('span');
  greetingMorning.classList.add('greeting', 'greeting--morning');
  greetingMorning.textContent = greetingMorningRow.textContent.trim();
  moveInstrumentation(greetingMorningRow, greetingMorning);
  greetingWrapper.append(greetingMorning);

  const greetingAfternoon = document.createElement('span');
  greetingAfternoon.classList.add('greeting', 'greeting--afternoon');
  greetingAfternoon.textContent = greetingAfternoonRow.textContent.trim();
  moveInstrumentation(greetingAfternoonRow, greetingAfternoon);
  greetingWrapper.append(greetingAfternoon);

  const greetingEvening = document.createElement('span');
  greetingEvening.classList.add('greeting', 'greeting--evening');
  greetingEvening.textContent = greetingEveningRow.textContent.trim();
  moveInstrumentation(greetingEveningRow, greetingEvening);
  greetingWrapper.append(greetingEvening);

  const greetingNight = document.createElement('span');
  greetingNight.classList.add('greeting', 'greeting--night');
  greetingNight.textContent = greetingNightRow.textContent.trim();
  moveInstrumentation(greetingNightRow, greetingNight);
  greetingWrapper.append(greetingNight);

  greetingContainer.append(greetingWrapper);
  section.append(greetingContainer);

  block.replaceChildren(section);

  // Video autoplay logic
  const playVideos = () => {
    videoLarge.play().catch((error) => console.warn('Large video autoplay failed:', error));
    videoSmall.play().catch((error) => console.warn('Small video autoplay failed:', error));
  };

  if (document.readyState === 'complete') {
    playVideos();
  } else {
    window.addEventListener('load', playVideos);
  }

  // Greeting logic
  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    const greetings = [
      { element: greetingMorning, start: 5, end: 12 },
      { element: greetingAfternoon, start: 12, end: 17 },
      { element: greetingEvening, start: 17, end: 22 },
      { element: greetingNight, start: 22, end: 5 },
    ];

    greetings.forEach((g) => {
      g.element.style.display = 'none';
      if ((hour >= g.start && hour < g.end) || (g.start > g.end && (hour >= g.start || hour < g.end))) {
        g.element.style.display = 'block';
      }
    });
  };

  updateGreeting();
  setInterval(updateGreeting, 60 * 1000); // Update every minute

  // Optimization for pictures
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
