import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [videoPosterRow, videoSourceRow] = [...block.children];

  const root = document.createElement('div');
  // root.classList.add('cmp-media'); // Removed: block already has 'media inner-video' from AEM

  const viewportVideoHidden = document.createElement('div');
  viewportVideoHidden.classList.add('viewport-video');
  viewportVideoHidden.setAttribute('hidden', '');
  viewportVideoHidden.setAttribute('aria-hidden', 'true');
  root.append(viewportVideoHidden);

  const backgroundDiv = document.createElement('div');
  backgroundDiv.classList.add('cmp-media__background');
  root.append(backgroundDiv);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('cmp-media__wrapper', 'cmp-media__wrapper--no-title');
  root.append(wrapperDiv);

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('cmp-media__header');
  wrapperDiv.append(headerDiv);

  const headingDiv = document.createElement('div');
  headingDiv.classList.add('cmp-media__heading');
  headerDiv.append(headingDiv);

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('cmp-media__title');
  headingDiv.append(titleDiv);

  const videoDiv = document.createElement('div');
  videoDiv.classList.add('video', 'apps.qiddiya__002d__commons.components.content.commons.video__002d__v1.v1.video__002d__v1.video__002d__v1__002e__html@1e5b80ff');
  wrapperDiv.append(videoDiv);

  const videoPosterDiv = document.createElement('div');
  videoPosterDiv.classList.add('video-poster');
  videoDiv.append(videoPosterDiv);

  const playButton = document.createElement('button');
  playButton.classList.add('video-poster__play-button');
  videoPosterDiv.append(playButton);

  const playIcon = document.createElement('span');
  playIcon.classList.add('qd-icon', 'qd-icon--play', 'video-poster__play-button__icon');
  playButton.append(playIcon);

  const playText = document.createElement('span');
  playText.classList.add('video-poster__play-button__text');
  playText.setAttribute('visually-hidden', '');
  playText.textContent = 'Watch Video';
  playButton.append(playText);

  const videoPosterEl = document.createElement('video');
  videoPosterEl.classList.add('video-poster__video');
  videoPosterEl.setAttribute('muted', '');
  videoPosterEl.setAttribute('loop', '');
  videoPosterEl.setAttribute('playsinline', '');
  videoPosterEl.setAttribute('webkit-playsinline', '');
  videoPosterEl.setAttribute('x-webkit-airplay', 'allow');
  videoPosterEl.setAttribute('autoplay', '');

  const posterImg = videoPosterRow.querySelector('img');
  if (posterImg) {
    videoPosterEl.poster = posterImg.src;
    moveInstrumentation(videoPosterRow, videoPosterEl);
  }

  const videoSrcEl = videoSourceRow.querySelector('img');
  if (videoSrcEl) {
    videoPosterEl.src = videoSrcEl.src;
  }
  videoPosterDiv.append(videoPosterEl);

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container', 'show-controls', 'video-hide');
  videoDiv.append(videoContainer);

  const viewportVideoContainer = document.createElement('div');
  viewportVideoContainer.classList.add('viewport-video');
  viewportVideoContainer.setAttribute('hidden', '');
  viewportVideoContainer.setAttribute('aria-hidden', 'true');
  videoContainer.append(viewportVideoContainer);

  const controlsDiv = document.createElement('div');
  controlsDiv.classList.add('video-container__controls');
  videoContainer.append(controlsDiv);

  const timerDiv = document.createElement('div');
  timerDiv.classList.add('video-container__controls__timer');
  controlsDiv.append(timerDiv);

  const progressArea = document.createElement('span');
  progressArea.classList.add('video-container__controls__timer__progress-area');
  timerDiv.append(progressArea);

  const progressPointer = document.createElement('span');
  progressPointer.classList.add('video-container__controls__timer__progress-area__pointer');
  timerDiv.append(progressPointer);

  const progressPending = document.createElement('span');
  progressPending.classList.add('video-container__controls__timer__progress-area__progress-pending');
  timerDiv.append(progressPending);

  const currentTime = document.createElement('p');
  currentTime.classList.add('video-container__controls__timer__current-time');
  currentTime.textContent = '00:00';
  controlsDiv.append(currentTime);

  const duration = document.createElement('p');
  duration.classList.add('video-container__controls__timer__duration');
  duration.textContent = '00:00';
  controlsDiv.append(duration);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('video-container__controls__buttons');
  controlsDiv.append(buttonsDiv);

  const playControlsButton = document.createElement('button');
  playControlsButton.classList.add('video-container__controls__buttons__play-button', 'video-container__controls__buttons--button');
  buttonsDiv.append(playControlsButton);

  const playControlsIcon = document.createElement('span');
  playControlsIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--play');
  playControlsButton.append(playControlsIcon);

  const muteButton = document.createElement('button');
  muteButton.classList.add('video-container__controls__buttons__mute-button', 'video-container__controls__buttons--button');
  buttonsDiv.append(muteButton);

  const muteIcon = document.createElement('span');
  muteIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--volume');
  muteButton.append(muteIcon);

  const fullscreenButton = document.createElement('button');
  fullscreenButton.classList.add('video-container__controls__buttons__fullscreen-button', 'video-container__controls__buttons--button');
  buttonsDiv.append(fullscreenButton);

  const fullscreenIcon = document.createElement('span');
  fullscreenIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--fullscreen');
  fullscreenButton.append(fullscreenIcon);

  const mainVideoEl = document.createElement('video');
  mainVideoEl.classList.add('video-container__video');
  mainVideoEl.setAttribute('playsinline', '');
  mainVideoEl.setAttribute('webkit-playsinline', '');
  mainVideoEl.setAttribute('x-webkit-airplay', 'allow');
  if (videoSrcEl) {
    mainVideoEl.setAttribute('data-video-src', videoSrcEl.src);
    mainVideoEl.src = videoSrcEl.src;
    moveInstrumentation(videoSourceRow, mainVideoEl); // Move instrumentation from videoSourceRow
  }
  videoDiv.append(mainVideoEl);

  // Event Listeners for video controls
  const togglePlay = () => {
    if (mainVideoEl.paused || mainVideoEl.ended) {
      mainVideoEl.play();
      videoPosterEl.pause();
      videoPosterEl.classList.add('video-hide');
      videoContainer.classList.remove('video-hide');
      playIcon.classList.remove('qd-icon--play');
      playIcon.classList.add('qd-icon--pause');
      playControlsIcon.classList.remove('qd-icon--play');
      playControlsIcon.classList.add('qd-icon--pause');
    } else {
      mainVideoEl.pause();
      playIcon.classList.remove('qd-icon--pause');
      playIcon.classList.add('qd-icon--play');
      playControlsIcon.classList.remove('qd-icon--pause');
      playControlsIcon.classList.add('qd-icon--play');
    }
  };

  const toggleMute = () => {
    mainVideoEl.muted = !mainVideoEl.muted;
    if (mainVideoEl.muted) {
      muteIcon.classList.remove('qd-icon--volume');
      muteIcon.classList.add('qd-icon--volume-mute');
    } else {
      muteIcon.classList.remove('qd-icon--volume-mute');
      muteIcon.classList.add('qd-icon--volume');
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (mainVideoEl.requestFullscreen) {
      mainVideoEl.requestFullscreen();
    }
  };

  const updateProgress = () => {
    const progress = (mainVideoEl.currentTime / mainVideoEl.duration) * 100;
    progressArea.style.width = `${progress}%`;
    const currentMinutes = Math.floor(mainVideoEl.currentTime / 60);
    const currentSeconds = Math.floor(mainVideoEl.currentTime % 60);
    currentTime.textContent = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;
  };

  const setProgress = (e) => {
    const rect = timerDiv.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * mainVideoEl.duration;
    mainVideoEl.currentTime = newTime;
  };

  mainVideoEl.addEventListener('timeupdate', updateProgress);
  mainVideoEl.addEventListener('loadedmetadata', () => {
    const totalMinutes = Math.floor(mainVideoEl.duration / 60);
    const totalSeconds = Math.floor(mainVideoEl.duration % 60);
    duration.textContent = `${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
  });

  playButton.addEventListener('click', togglePlay);
  playControlsButton.addEventListener('click', togglePlay);
  muteButton.addEventListener('click', toggleMute);
  fullscreenButton.addEventListener('click', toggleFullscreen);
  timerDiv.addEventListener('click', setProgress);

  // Optimize images
  // The original code was replacing the picture element with a new picture element,
  // but moveInstrumentation was called on the img inside the original picture.
  // This is corrected to ensure instrumentation is moved correctly and the picture
  // element is replaced.
  root.querySelectorAll('picture').forEach((picture) => {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be called on the original picture element,
      // and the new picture element should be appended.
      // For images, instrumentation is typically on the <img> itself, or its parent <picture>.
      // Given the model is 'reference', the instrumentation is on the cell containing the picture.
      // We've already handled instrumentation for videoPosterRow and videoSourceRow.
      // This generic image optimization should not interfere with those specific video assets.
      // If this picture is not one of the video assets, it's likely a background image or similar.
      // For generic pictures, we can replace the picture element directly.
      picture.replaceWith(optimizedPic);
    }
  });

  block.replaceChildren(root);
}
