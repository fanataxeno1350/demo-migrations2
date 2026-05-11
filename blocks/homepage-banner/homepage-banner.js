import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    videoLargePosterCell,
    videoLargeSrcCell,
    videoSmallPosterCell,
    videoSmallSrcCell,
    primaryTitleCell,
    primaryCtaLinkCell,
    primaryCtaLabelCell,
    secondaryTitleCell,
    secondaryCtaLinkCell,
    secondaryCtaLabelCell,
    greetingMorningCell,
    greetingAfternoonCell,
    greetingEveningCell,
    greetingNightCell,
  ] = [...block.children];

  const sectionWrapper = document.createElement('section');
  sectionWrapper.classList.add('grid-container', 'homepage-banner-wrapper', 'variation--banner', 'bg--paper-white');
  sectionWrapper.setAttribute('data-is-banner', 'true');

  const homepageBanner = document.createElement('div');
  homepageBanner.classList.add('homepage-banner', 'reveal-effect-container');
  moveInstrumentation(block, homepageBanner);

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-container');

  // Large video
  const videoLarge = document.createElement('video');
  videoLarge.muted = true;
  videoLarge.classList.add('video--large', 'show-for-large');
  videoLarge.playsInline = true;
  videoLarge.preload = 'none';

  const largePosterPic = videoLargePosterCell.querySelector('picture');
  const largePosterImg = largePosterPic ? largePosterPic.querySelector('img') : null;
  if (largePosterImg) {
    videoLarge.poster = largePosterImg.src;
    videoLarge.setAttribute('data-poster', largePosterImg.src);
    // Optimize the poster image
    const optimizedPosterPic = createOptimizedPicture(largePosterImg.src, largePosterImg.alt, false, [{ width: '1200' }]);
    moveInstrumentation(videoLargePosterCell, optimizedPosterPic.querySelector('img'));
    // We don't append the optimized picture directly, just use its src for the video poster
  }

  const largeVideoSource = document.createElement('source');
  const largeVideoLink = videoLargeSrcCell.querySelector('a');
  if (largeVideoLink) {
    largeVideoSource.src = largeVideoLink.href;
    largeVideoSource.setAttribute('data-src', largeVideoLink.href);
    largeVideoSource.type = 'video/mp4';
    moveInstrumentation(videoLargeSrcCell, largeVideoSource);
  }
  videoLarge.append(largeVideoSource);
  mediaContainer.append(videoLarge);

  // Small video
  const videoSmall = document.createElement('video');
  videoSmall.muted = true;
  videoSmall.classList.add('video--small', 'hide-for-large');
  videoSmall.playsInline = true;
  videoSmall.preload = 'none';

  const smallPosterPic = videoSmallPosterCell.querySelector('picture');
  const smallPosterImg = smallPosterPic ? smallPosterPic.querySelector('img') : null;
  if (smallPosterImg) {
    videoSmall.poster = smallPosterImg.src;
    videoSmall.setAttribute('data-poster', smallPosterImg.src);
    // Optimize the poster image
    const optimizedSmallPosterPic = createOptimizedPicture(smallPosterImg.src, smallPosterImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(videoSmallPosterCell, optimizedSmallPosterPic.querySelector('img'));
  }

  const smallVideoSource = document.createElement('source');
  const smallVideoLink = smallVideoSrcCell.querySelector('a');
  if (smallVideoLink) {
    smallVideoSource.src = smallVideoLink.href;
    smallVideoSource.setAttribute('data-src', smallVideoLink.href);
    smallVideoSource.type = 'video/mp4';
    moveInstrumentation(smallVideoSrcCell, smallVideoSource);
  }
  videoSmall.append(smallVideoSource);
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
  primaryTitle.textContent = primaryTitleCell.textContent.trim();
  moveInstrumentation(primaryTitleCell, primaryTitle);
  contentWrapper.append(primaryTitle);

  // Primary CTA
  const primaryCtaContainer = document.createElement('div');
  primaryCtaContainer.classList.add('cta-container', 'primary-title-cta-container');

  const primaryCtaLink = document.createElement('a');
  primaryCtaLink.classList.add('button', 'red');
  primaryCtaLink.rel = 'follow';
  const foundPrimaryLink = primaryCtaLinkCell.querySelector('a');
  if (foundPrimaryLink) {
    primaryCtaLink.href = foundPrimaryLink.href;
  }
  const primaryCtaSpan = document.createElement('span');
  primaryCtaSpan.classList.add('button-text');
  primaryCtaSpan.textContent = primaryCtaLabelCell.textContent.trim();
  primaryCtaLink.append(primaryCtaSpan);
  moveInstrumentation(primaryCtaLinkCell, primaryCtaLink);
  moveInstrumentation(primaryCtaLabelCell, primaryCtaLink);
  primaryCtaContainer.append(primaryCtaLink);
  contentWrapper.append(primaryCtaContainer);

  // Secondary Title
  const secondaryTitleDiv = document.createElement('div');
  secondaryTitleDiv.classList.add('secondary-title');
  moveInstrumentation(secondaryTitleCell, secondaryTitleDiv);

  const secondaryHeadline = document.createElement('div');
  secondaryHeadline.classList.add('headline-h1', 'font-weight-bold');
  secondaryHeadline.textContent = secondaryTitleCell.textContent.trim();
  secondaryTitleDiv.append(secondaryHeadline);

  // Secondary CTA
  const secondaryCtaContainer = document.createElement('div');
  secondaryCtaContainer.classList.add('cta-container');

  const secondaryCtaLink = document.createElement('a');
  secondaryCtaLink.classList.add('button', 'red');
  secondaryCtaLink.rel = 'follow';
  const foundSecondaryLink = secondaryCtaLinkCell.querySelector('a');
  if (foundSecondaryLink) {
    secondaryCtaLink.href = foundSecondaryLink.href;
  }
  const secondaryCtaSpan = document.createElement('span');
  secondaryCtaSpan.classList.add('button-text');
  secondaryCtaSpan.textContent = secondaryCtaLabelCell.textContent.trim();
  secondaryCtaLink.append(secondaryCtaSpan);
  moveInstrumentation(secondaryCtaLinkCell, secondaryCtaLink);
  moveInstrumentation(secondaryCtaLabelCell, secondaryCtaLink);
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
  greetingMorning.textContent = greetingMorningCell.textContent.trim();
  moveInstrumentation(greetingMorningCell, greetingMorning);
  greetingWrapper.append(greetingMorning);

  const greetingAfternoon = document.createElement('span');
  greetingAfternoon.classList.add('greeting', 'greeting--afternoon');
  greetingAfternoon.textContent = greetingAfternoonCell.textContent.trim();
  moveInstrumentation(greetingAfternoonCell, greetingAfternoon);
  greetingWrapper.append(greetingAfternoon);

  const greetingEvening = document.createElement('span');
  greetingEvening.classList.add('greeting', 'greeting--evening');
  greetingEvening.textContent = greetingEveningCell.textContent.trim();
  moveInstrumentation(greetingEveningCell, greetingEvening);
  greetingWrapper.append(greetingEvening);

  const greetingNight = document.createElement('span');
  greetingNight.classList.add('greeting', 'greeting--night');
  greetingNight.textContent = greetingNightCell.textContent.trim();
  moveInstrumentation(greetingNightCell, greetingNight);
  greetingWrapper.append(greetingNight);

  greetingContainer.append(greetingWrapper);
  sectionWrapper.append(homepageBanner, greetingContainer);

  block.replaceChildren(sectionWrapper);

  // Video autoplay logic
  const playVideos = () => {
    const largeVideo = block.querySelector('.video--large');
    const smallVideo = block.querySelector('.video--small');

    if (largeVideo) {
      largeVideo.play().catch((e) => console.error('Large video autoplay failed:', e));
    }
    if (smallVideo) {
      smallVideo.play().catch((e) => console.error('Small video autoplay failed:', e));
    }
  };

  // Check if videos are in view to start playing
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        playVideos();
        observer.disconnect(); // Stop observing once videos start
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% of the video is in view

  observer.observe(block);

  // Greeting logic
  const updateGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    const greetings = block.querySelectorAll('.greeting');
    greetings.forEach((greeting) => {
      greeting.style.display = 'none';
    });

    if (hour >= 5 && hour < 12) {
      block.querySelector('.greeting--morning').style.display = 'block';
    } else if (hour >= 12 && hour < 17) {
      block.querySelector('.greeting--afternoon').style.display = 'block';
    } else if (hour >= 17 && hour < 21) {
      block.querySelector('.greeting--evening').style.display = 'block';
    } else {
      block.querySelector('.greeting--night').style.display = 'block';
    }
  };

  updateGreeting();
  setInterval(updateGreeting, 60 * 60 * 1000); // Update every hour
}
