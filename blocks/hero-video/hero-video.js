import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    videoMp4Cell,
    pauseButtonLabelCell,
    resumeButtonLabelCell,
    headlineCell,
    supportingTextCell,
    ctaLabelCell,
    ctaLinkCell,
  ] = [...block.children];

  const heroType = document.createElement('div');
  heroType.classList.add('hero-type', '-tall');
  heroType.setAttribute('data-module', 'hero-type');
  heroType.setAttribute('data-is', 'loaded');

  const videoElement = document.createElement('video');
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.classList.add('hero-type-video');

  const videoSourceImg = videoMp4Cell.querySelector('img');
  if (videoSourceImg) {
    videoElement.src = videoSourceImg.src;
    videoElement.type = 'video/mp4';
    // The original HTML uses an img for the video source, not a picture.
    // createOptimizedPicture is for images, not video sources.
    // The video element itself handles the source.
    moveInstrumentation(videoMp4Cell, videoElement);
  }

  const heroImage = document.createElement('div');
  heroImage.classList.add('hero-type-image');
  const heroBackground = document.createElement('span');
  heroBackground.classList.add('hero-type-background');
  const heroBackgroundPlaceholder = document.createElement('span');
  heroBackgroundPlaceholder.classList.add('hero-type-background-placeholder');
  heroImage.append(heroBackground, heroBackgroundPlaceholder);

  const pauseButton = document.createElement('button');
  pauseButton.classList.add('hero-type-pause');
  pauseButton.textContent = pauseButtonLabelCell.textContent.trim();
  pauseButton.setAttribute('data-toggle-text', resumeButtonLabelCell.textContent.trim());
  moveInstrumentation(pauseButtonLabelCell, pauseButton);
  moveInstrumentation(resumeButtonLabelCell, pauseButton);

  const heroText = document.createElement('div');
  heroText.classList.add('hero-type-text');

  const headline = document.createElement('h1');
  headline.classList.add('heading-h1', 'home-hero-title', '-white');
  headline.textContent = headlineCell.textContent.trim();
  moveInstrumentation(headlineCell, headline);

  const supportingTextDiv = document.createElement('div');
  supportingTextDiv.classList.add('supporting-text');
  supportingTextDiv.innerHTML = supportingTextCell.innerHTML;
  moveInstrumentation(supportingTextCell, supportingTextDiv);

  const ctaLink = ctaLinkCell.querySelector('a');
  if (ctaLink) {
    const ctaButton = document.createElement('a');
    ctaButton.classList.add('u-button', 'u-button-reversed-white');
    ctaButton.href = ctaLink.href;
    ctaButton.textContent = ctaLabelCell.textContent.trim();
    const p = document.createElement('p');
    p.classList.add('u-text-centered');
    p.append(ctaButton);
    supportingTextDiv.append(p);
    moveInstrumentation(ctaLabelCell, ctaButton);
    moveInstrumentation(ctaLinkCell, ctaButton);
  }

  heroText.append(headline, supportingTextDiv);
  heroType.append(videoElement, heroImage, pauseButton, heroText);

  pauseButton.addEventListener('click', () => {
    const isPaused = videoElement.paused;
    if (isPaused) {
      videoElement.play();
      pauseButton.textContent = pauseButtonLabelCell.textContent.trim();
    } else {
      videoElement.pause();
      pauseButton.textContent = resumeButtonLabelCell.textContent.trim();
    }
  });

  block.replaceChildren(heroType);

  // The original HTML for this block does not use <picture> for the video source,
  // it uses an <img> directly within the video cell.
  // createOptimizedPicture is for optimizing images, not video sources.
  // Removing this loop as it was incorrectly replacing the video source <img> with a <picture>,
  // which would break the video playback.
  // If there were actual images in the block that needed optimization, they would be handled here.
  // For this specific block, based on the provided HTML, there are no such images.
}
