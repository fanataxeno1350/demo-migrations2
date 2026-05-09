import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [videoPosterImageRow, videoPosterSrcRow, videoSrcRow] = [...block.children];

  const rootDiv = document.createElement('div');
  // rootDiv.classList.add('cmp-media'); // Removed: block already has 'media-inner-video' and 'cmp-media' from AEM

  const viewportVideoHidden = document.createElement('div');
  viewportVideoHidden.classList.add('viewport-video');
  viewportVideoHidden.hidden = true;
  viewportVideoHidden.setAttribute('aria-hidden', 'true');
  rootDiv.append(viewportVideoHidden);

  const backgroundDiv = document.createElement('div');
  backgroundDiv.classList.add('cmp-media__background');
  rootDiv.append(backgroundDiv);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('cmp-media__wrapper', 'cmp-media__wrapper--no-title');
  rootDiv.append(wrapperDiv);

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('cmp-media__header');
  wrapperDiv.append(headerDiv);

  const headingDiv = document.createElement('div');
  headingDiv.classList.add('cmp-media__heading');
  headerDiv.append(headingDiv);

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('cmp-media__title');
  headingDiv.append(titleDiv);

  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('video', 'apps.qiddiya__002d__commons.components.content.commons.video__002d__v1.v1.video__002d__v1.video__002d__v1__002e__html@1e5b80ff');
  wrapperDiv.append(videoWrapper);

  // Video Poster Section
  const videoPosterDiv = document.createElement('div');
  videoPosterDiv.classList.add('video-poster');
  videoWrapper.append(videoPosterDiv);

  const playButton = document.createElement('button');
  playButton.classList.add('video-poster__play-button');
  videoPosterDiv.append(playButton);

  const playIcon = document.createElement('span');
  playIcon.classList.add('qd-icon', 'qd-icon--play', 'video-poster__play-button__icon');
  playButton.append(playIcon);

  const playButtonText = document.createElement('span');
  playButtonText.classList.add('video-poster__play-button__text');
  playButtonText.setAttribute('visually-hidden', '');
  playButtonText.textContent = 'Watch Video';
  playButton.append(playButtonText);

  const posterVideo = document.createElement('video');
  posterVideo.classList.add('video-poster__video');
  posterVideo.muted = true;
  posterVideo.loop = true;
  posterVideo.playsInline = true;
  posterVideo.setAttribute('webkit-playsinline', '');
  posterVideo.setAttribute('x-webkit-airplay', 'allow');
  posterVideo.autoplay = true;

  // For video poster image, we need the src of the img inside the picture
  const posterImage = videoPosterImageRow?.querySelector('img');
  if (posterImage) {
    posterVideo.poster = posterImage.src;
    moveInstrumentation(videoPosterImageRow, posterVideo);
  }

  // For video poster source, we need the src of the img inside the picture
  const posterSrc = videoPosterSrcRow?.querySelector('img');
  if (posterSrc) {
    posterVideo.src = posterSrc.src;
    moveInstrumentation(videoPosterSrcRow, posterVideo);
  }
  videoPosterDiv.append(posterVideo);

  // Main Video Section
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container', 'show-controls', 'video-hide');
  videoWrapper.append(videoContainer);

  const viewportVideoMain = document.createElement('div');
  viewportVideoMain.classList.add('viewport-video');
  viewportVideoMain.hidden = true;
  viewportVideoMain.setAttribute('aria-hidden', 'true');
  videoContainer.append(viewportVideoMain);

  const videoControls = document.createElement('div');
  videoControls.classList.add('video-container__controls');
  videoContainer.append(videoControls);

  const timerDiv = document.createElement('div');
  timerDiv.classList.add('video-container__controls__timer');
  videoControls.append(timerDiv);

  const progressArea = document.createElement('span');
  progressArea.classList.add('video-container__controls__timer__progress-area');
  timerDiv.append(progressArea);

  const pointer = document.createElement('span');
  pointer.classList.add('video-container__controls__timer__progress-area__pointer');
  timerDiv.append(pointer);

  const progressPending = document.createElement('span');
  progressPending.classList.add('video-container__controls__timer__progress-area__progress-pending');
  timerDiv.append(progressPending);

  const currentTime = document.createElement('p');
  currentTime.classList.add('video-container__controls__timer__current-time');
  currentTime.textContent = '00:00';
  videoControls.append(currentTime);

  const duration = document.createElement('p');
  duration.classList.add('video-container__controls__timer__duration');
  duration.textContent = '00:00';
  videoControls.append(duration);

  const controlsButtons = document.createElement('div');
  controlsButtons.classList.add('video-container__controls__buttons');
  videoContainer.append(controlsButtons);

  const playButtonMain = document.createElement('button');
  playButtonMain.classList.add('video-container__controls__buttons__play-button', 'video-container__controls__buttons--button');
  controlsButtons.append(playButtonMain);

  const playIconMain = document.createElement('span');
  playIconMain.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--play');
  playButtonMain.append(playIconMain);

  const muteButton = document.createElement('button');
  muteButton.classList.add('video-container__controls__buttons__mute-button', 'video-container__controls__buttons--button');
  controlsButtons.append(muteButton);

  const volumeIcon = document.createElement('span');
  volumeIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--volume');
  muteButton.append(volumeIcon);

  const fullscreenButton = document.createElement('button');
  fullscreenButton.classList.add('video-container__controls__buttons__fullscreen-button', 'video-container__controls__buttons--button');
  controlsButtons.append(fullscreenButton);

  const fullscreenIcon = document.createElement('span');
  fullscreenIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--fullscreen');
  fullscreenButton.append(fullscreenIcon);

  const mainVideo = document.createElement('video');
  mainVideo.classList.add('video-container__video');
  mainVideo.playsInline = true;
  mainVideo.setAttribute('webkit-playsinline', '');
  mainVideo.setAttribute('x-webkit-airplay', 'allow');

  // For main video source, we need the src of the img inside the picture
  const mainVideoSrc = videoSrcRow?.querySelector('img');
  if (mainVideoSrc) {
    mainVideo.src = mainVideoSrc.src;
    mainVideo.setAttribute('data-video-src', mainVideoSrc.src);
    moveInstrumentation(videoSrcRow, mainVideo); // Added moveInstrumentation for mainVideo
  }
  videoWrapper.append(mainVideo);

  // Event Listeners for video interaction
  playButton.addEventListener('click', () => {
    videoPosterDiv.hidden = true;
    videoContainer.classList.remove('video-hide');
    mainVideo.play();
    posterVideo.pause();
  });

  playButtonMain.addEventListener('click', () => {
    if (mainVideo.paused) {
      mainVideo.play();
      playIconMain.classList.remove('qd-icon--play');
      playIconMain.classList.add('qd-icon--pause');
    } else {
      mainVideo.pause();
      playIconMain.classList.remove('qd-icon--pause');
      playIconMain.classList.add('qd-icon--play');
    }
  });

  muteButton.addEventListener('click', () => {
    mainVideo.muted = !mainVideo.muted;
    if (mainVideo.muted) {
      volumeIcon.classList.remove('qd-icon--volume');
      volumeIcon.classList.add('qd-icon--volume-mute');
    } else {
      volumeIcon.classList.remove('qd-icon--volume-mute');
      volumeIcon.classList.add('qd-icon--volume');
    }
  });

  fullscreenButton.addEventListener('click', () => {
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
    const durationTime = mainVideo.duration;
    const progress = (current / durationTime) * 100;
    progressArea.style.width = `${progress}%`;

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    currentTime.textContent = formatTime(current);
    duration.textContent = formatTime(durationTime);
  });

  mainVideo.addEventListener('ended', () => {
    playIconMain.classList.remove('qd-icon--pause');
    playIconMain.classList.add('qd-icon--play');
  });

  // Optimize images - Removed as createOptimizedPicture is not needed for video poster/src
  // and the original HTML does not have images that need optimization here.
  // The video poster is set via the 'poster' attribute, not an <img> tag directly.
  // rootDiv.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });

  block.replaceChildren(rootDiv);
}
