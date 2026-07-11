import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    headlineRow,
    desktopPlaceholderImageRow,
    mobilePlaceholderImageRow,
    desktopVideoUrlRow,
    mobileVideoUrlRow,
    autoPlayRow,
    progressBarRow,
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add(
    'container',
    'responsivegrid',
    'color-background-default',
    'color-background-gradient-1',
    // 'cmp-teaser-community', // Removed: block already has this class
    'top-lg-margin',
  );

  const cmpContainer = document.createElement('div');
  cmpContainer.classList.add('cmp-container');
  root.append(cmpContainer);

  const aemGrid = document.createElement('div');
  aemGrid.classList.add(
    'aem-Grid',
    'aem-Grid--12',
    'aem-Grid--tablet--12',
    'aem-Grid--default--12',
    'aem-Grid--phone--12',
  );
  cmpContainer.append(aemGrid);

  // Headline
  const headlineWrapper = document.createElement('div');
  headlineWrapper.classList.add(
    'title',
    'color-text-primary-1',
    'aem-GridColumn--default--none',
    'aem-GridColumn--phone--none',
    'aem-GridColumn--phone--7',
    'aem-GridColumn--tablet--none',
    'aem-GridColumn--offset--phone--3',
    'aem-GridColumn',
    'aem-GridColumn--tablet--6',
    'aem-GridColumn--default--6',
    'aem-GridColumn--offset--default--3',
    'aem-GridColumn--offset--tablet--3',
  );
  aemGrid.append(headlineWrapper);

  const cmpTitle = document.createElement('div');
  cmpTitle.classList.add('cmp-title');
  headlineWrapper.append(cmpTitle);

  const headlineText = document.createElement('h3');
  headlineText.classList.add('cmp-title__text');
  moveInstrumentation(headlineRow, headlineText);
  headlineText.textContent = headlineRow.textContent.trim();
  cmpTitle.append(headlineText);

  // Video Section
  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add(
    'video',
    'aem-GridColumn--default--none',
    'aem-GridColumn--phone--none',
    'aem-GridColumn--phone--10',
    'aem-GridColumn',
    'aem-GridColumn--offset--phone--1',
    'aem-GridColumn--default--6',
    'aem-GridColumn--offset--default--3',
  );
  aemGrid.append(videoWrapper);

  const cmpVideo = document.createElement('div');
  cmpVideo.classList.add('cmp-video');
  videoWrapper.append(cmpVideo);

  const desktopVideoUrl = desktopVideoUrlRow.querySelector('a')?.href;
  const mobileVideoUrl = mobileVideoUrlRow.querySelector('a')?.href;
  const autoPlay = autoPlayRow.textContent.trim() === 'true';
  const progressBar = progressBarRow.textContent.trim() === 'true';

  const videoElement = document.createElement('video');
  videoElement.classList.add('cmp-video__player');
  videoElement.disablePictureInPicture = true;
  videoElement.controlsList = 'nodownload noremoteplayback noplaybackrate';

  if (autoPlay) {
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
  }

  if (progressBar) {
    videoElement.controls = true;
  }

  // Set poster image
  const desktopPicture = desktopPlaceholderImageRow.querySelector('picture');
  const mobilePicture = mobilePlaceholderImageRow.querySelector('picture');

  let posterSrc = '';
  if (desktopPicture) {
    posterSrc = desktopPicture.querySelector('img')?.src;
    const optimizedPic = createOptimizedPicture(posterSrc, desktopPicture.querySelector('img')?.alt, false, [{ width: '750' }]);
    moveInstrumentation(desktopPlaceholderImageRow.children[0], optimizedPic.querySelector('img')); // Corrected instrumentation source
    videoElement.poster = optimizedPic.querySelector('img').src;
  } else if (mobilePicture) {
    posterSrc = mobilePicture.querySelector('img')?.src;
    const optimizedPic = createOptimizedPicture(posterSrc, mobilePicture.querySelector('img')?.alt, false, [{ width: '750' }]);
    moveInstrumentation(mobilePlaceholderImageRow.children[0], optimizedPic.querySelector('img')); // Corrected instrumentation source
    videoElement.poster = optimizedPic.querySelector('img').src;
  }

  // Set video source
  const source = document.createElement('source');
  source.src = desktopVideoUrl || mobileVideoUrl;
  videoElement.append(source);

  moveInstrumentation(desktopVideoUrlRow, videoElement);
  moveInstrumentation(mobileVideoUrlRow, videoElement);
  moveInstrumentation(autoPlayRow, videoElement);
  moveInstrumentation(progressBarRow, videoElement);

  cmpVideo.append(videoElement);

  const playButton = document.createElement('div');
  playButton.classList.add('cmp-video__play-button');
  playButton.setAttribute('aria-label', 'Play');
  playButton.setAttribute('role', 'button');
  cmpVideo.append(playButton);

  playButton.addEventListener('click', () => {
    if (videoElement.paused) {
      videoElement.play();
      playButton.style.display = 'none';
      if (videoElement.controls === false) {
        videoElement.controls = true;
      }
    } else {
      videoElement.pause();
      playButton.style.display = 'block';
    }
  });

  videoElement.addEventListener('pause', () => {
    playButton.style.display = 'block';
  });

  videoElement.addEventListener('play', () => {
    playButton.style.display = 'none';
  });

  // Append empty container at the end as per original HTML
  const bottomContainerWrapper = document.createElement('div');
  bottomContainerWrapper.classList.add('container', 'responsivegrid', 'aem-GridColumn', 'aem-GridColumn--default--12');
  aemGrid.append(bottomContainerWrapper);

  const bottomCmpContainer = document.createElement('div');
  bottomCmpContainer.classList.add('cmp-container');
  bottomContainerWrapper.append(bottomCmpContainer);

  const bottomAemGrid = document.createElement('div');
  bottomAemGrid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');
  bottomCmpContainer.append(bottomAemGrid);

  block.replaceChildren(root);
}
