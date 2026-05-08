import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    videoPosterImageCell,
    videoPosterSrcCell,
    mainVideoSrcCell,
    watchLabelCell,
  ] = [...block.children];

  const cmpMedia = document.createElement('div');
  cmpMedia.classList.add('cmp-media');
  // moveInstrumentation(block, cmpMedia); // Block instrumentation is moved at the end with replaceChildren

  const viewportVideoHidden = document.createElement('div');
  viewportVideoHidden.classList.add('viewport-video');
  viewportVideoHidden.setAttribute('hidden', '');
  viewportVideoHidden.setAttribute('aria-hidden', 'true');
  cmpMedia.append(viewportVideoHidden);

  const cmpMediaBackground = document.createElement('div');
  cmpMediaBackground.classList.add('cmp-media__background');
  cmpMedia.append(cmpMediaBackground);

  const cmpMediaWrapper = document.createElement('div');
  cmpMediaWrapper.classList.add('cmp-media__wrapper', 'cmp-media__wrapper--no-title');
  cmpMedia.append(cmpMediaWrapper);

  const cmpMediaHeader = document.createElement('div');
  cmpMediaHeader.classList.add('cmp-media__header');
  cmpMediaWrapper.append(cmpMediaHeader);

  const cmpMediaHeading = document.createElement('div');
  cmpMediaHeading.classList.add('cmp-media__heading');
  cmpMediaHeader.append(cmpMediaHeading);

  const cmpMediaTitle = document.createElement('div');
  cmpMediaTitle.classList.add('cmp-media__title');
  cmpMediaHeading.append(cmpMediaTitle);

  const videoContainer = document.createElement('div');
  // Removed incorrect class 'apps.qiddiya__002d__commons.components.content.commons.video__002d__v1.v1.video__002d__v1.video__002d__v1__002e__html@1065b4ef'
  // This class name is likely a JCR path or internal identifier, not a CSS class.
  videoContainer.classList.add('video');
  cmpMediaWrapper.append(videoContainer);

  // Video Poster
  const videoPoster = document.createElement('div');
  videoPoster.classList.add('video-poster');
  videoContainer.append(videoPoster);

  const playButton = document.createElement('button');
  playButton.classList.add('video-poster__play-button');
  videoPoster.append(playButton);

  const playIcon = document.createElement('span');
  playIcon.classList.add('qd-icon', 'qd-icon--play', 'video-poster__play-button__icon');
  playButton.append(playIcon);

  const playButtonText = document.createElement('span');
  playButtonText.classList.add('video-poster__play-button__text');
  playButtonText.setAttribute('visually-hidden', '');
  moveInstrumentation(watchLabelCell.children[0], playButtonText); // Move instrumentation from the cell's content
  playButtonText.textContent = watchLabelCell?.textContent.trim() || 'Watch Video';
  playButton.append(playButtonText);

  const posterVideo = document.createElement('video');
  posterVideo.classList.add('video-poster__video');
  posterVideo.setAttribute('muted', '');
  posterVideo.setAttribute('loop', '');
  posterVideo.setAttribute('playsinline', '');
  posterVideo.setAttribute('webkit-playsinline', '');
  posterVideo.setAttribute('x-webkit-airplay', 'allow');
  posterVideo.setAttribute('autoplay', '');

  const posterPicture = videoPosterImageCell?.querySelector('picture');
  if (posterPicture) {
    const posterImg = posterPicture.querySelector('img');
    if (posterImg) {
      posterVideo.setAttribute('poster', posterImg.src);
      const optimizedPic = createOptimizedPicture(posterImg.src, posterImg.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be called on the original img element, not the new one inside optimizedPic
      moveInstrumentation(posterImg, optimizedPic.querySelector('img'));
      posterVideo.append(optimizedPic);
    }
  }

  moveInstrumentation(videoPosterSrcCell.children[0], posterVideo); // Move instrumentation from the cell's content
  posterVideo.src = videoPosterSrcCell?.textContent.trim() || '';
  videoPoster.append(posterVideo);

  // Main Video Container
  const mainVideoWrapper = document.createElement('div');
  mainVideoWrapper.classList.add('video-container', 'show-controls', 'video-hide');
  videoContainer.append(mainVideoWrapper);

  const mainViewportVideo = document.createElement('div');
  mainViewportVideo.classList.add('viewport-video');
  mainViewportVideo.setAttribute('hidden', '');
  mainViewportVideo.setAttribute('aria-hidden', 'true');
  mainVideoWrapper.append(mainViewportVideo);

  const videoControls = document.createElement('div');
  videoControls.classList.add('video-container__controls');
  mainVideoWrapper.append(videoControls);

  const timer = document.createElement('div');
  timer.classList.add('video-container__controls__timer');
  videoControls.append(timer);

  const progressArea = document.createElement('div');
  progressArea.classList.add('video-container__controls__timer__progress-area');
  timer.append(progressArea);

  const progressBar = document.createElement('span');
  progressBar.classList.add('video-container__controls__timer__progress-area__progress-bar');
  progressArea.append(progressBar);

  const pointer = document.createElement('span');
  pointer.classList.add('video-container__controls__timer__progress-area__pointer');
  progressArea.append(pointer);

  const progressPending = document.createElement('span');
  progressPending.classList.add('video-container__controls__timer__progress-area__progress-pending');
  progressArea.append(progressPending);

  const currentTime = document.createElement('p');
  currentTime.classList.add('video-container__controls__timer__current-time');
  currentTime.textContent = '00:00';
  timer.append(currentTime);

  const duration = document.createElement('p');
  duration.classList.add('video-container__controls__timer__duration');
  duration.textContent = '00:00';
  timer.append(duration);

  const controlButtons = document.createElement('div');
  controlButtons.classList.add('video-container__controls__buttons');
  videoControls.append(controlButtons);

  const playControlBtn = document.createElement('button');
  playControlBtn.classList.add('video-container__controls__buttons__play-button', 'video-container__controls__buttons--button');
  controlButtons.append(playControlBtn);

  const playControlIcon = document.createElement('span');
  playControlIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--play');
  playControlBtn.append(playControlIcon);

  const muteControlBtn = document.createElement('button');
  muteControlBtn.classList.add('video-container__controls__buttons__mute-button', 'video-container__controls__buttons--button');
  controlButtons.append(muteControlBtn);

  const muteControlIcon = document.createElement('span');
  muteControlIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--volume');
  muteControlBtn.append(muteControlIcon);

  const fullscreenControlBtn = document.createElement('button');
  fullscreenControlBtn.classList.add('video-container__controls__buttons__fullscreen-button', 'video-container__controls__buttons--button');
  controlButtons.append(fullscreenControlBtn);

  const fullscreenControlIcon = document.createElement('span');
  fullscreenControlIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--fullscreen');
  fullscreenControlBtn.append(fullscreenControlIcon);

  const mainVideo = document.createElement('video');
  mainVideo.classList.add('video-container__video');
  mainVideo.setAttribute('playsinline', '');
  mainVideo.setAttribute('webkit-playsinline', '');
  mainVideo.setAttribute('x-webkit-airplay', 'allow');
  moveInstrumentation(mainVideoSrcCell.children[0], mainVideo); // Move instrumentation from the cell's content
  mainVideo.src = mainVideoSrcCell?.textContent.trim() || '';
  mainVideo.dataset.videoSrc = mainVideo.src;
  mainVideoWrapper.append(mainVideo);

  // Event Listeners for video playback
  playButton.addEventListener('click', () => {
    videoPoster.classList.add('video-hide');
    mainVideoWrapper.classList.remove('video-hide');
    mainVideo.play();
  });

  playControlBtn.addEventListener('click', () => {
    if (mainVideo.paused) {
      mainVideo.play();
      playControlIcon.classList.remove('qd-icon--play');
      playControlIcon.classList.add('qd-icon--pause');
    } else {
      mainVideo.pause();
      playControlIcon.classList.remove('qd-icon--pause');
      playControlIcon.classList.add('qd-icon--play');
    }
  });

  muteControlBtn.addEventListener('click', () => {
    mainVideo.muted = !mainVideo.muted;
    if (mainVideo.muted) {
      muteControlIcon.classList.remove('qd-icon--volume');
      muteControlIcon.classList.add('qd-icon--mute');
    } else {
      muteControlIcon.classList.remove('qd-icon--mute');
      muteControlIcon.classList.add('qd-icon--volume');
    }
  });

  fullscreenControlBtn.addEventListener('click', () => {
    if (mainVideo.requestFullscreen) {
      mainVideo.requestFullscreen();
    } else if (mainVideo.webkitRequestFullscreen) { /* Safari */
      mainVideo.webkitRequestFullscreen();
    } else if (mainVideo.msRequestFullscreen) { /* IE11 */
      mainVideo.msRequestFullscreen();
    }
  });

  mainVideo.addEventListener('timeupdate', () => {
    const current = mainVideo.currentTime;
    const total = mainVideo.duration;
    const progress = (current / total) * 100;
    progressBar.style.width = `${progress}%`;

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    currentTime.textContent = formatTime(current);
    duration.textContent = formatTime(total);
  });

  mainVideo.addEventListener('ended', () => {
    playControlIcon.classList.remove('qd-icon--pause');
    playControlIcon.classList.add('qd-icon--play');
    mainVideo.currentTime = 0;
    mainVideo.pause();
    videoPoster.classList.remove('video-hide');
    mainVideoWrapper.classList.add('video-hide');
  });

  // Move instrumentation from the block's original div to the new root element
  moveInstrumentation(block, cmpMedia);
  block.replaceChildren(cmpMedia);
}
