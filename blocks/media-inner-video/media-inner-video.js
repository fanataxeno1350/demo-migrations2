import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    videoPosterImageRow,
    videoPosterSrcRow,
    videoSrcRow,
    playButtonLabelRow,
  ] = [...block.children];

  // For reference fields, we need the picture element itself, not just the img src
  const videoPosterImagePicture = videoPosterImageRow?.querySelector('picture');
  const videoPosterSrcPicture = videoPosterSrcRow?.querySelector('picture');
  const videoSourcePicture = videoSrcRow?.querySelector('picture');
  const playButtonLabel = playButtonLabelRow?.textContent.trim();

  const cmpMedia = document.createElement('div');
  cmpMedia.classList.add('cmp-media');
  moveInstrumentation(block, cmpMedia);

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

  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('video');
  // Removed JCR path class 'apps.qiddiya__002d__commons.components.content.commons.video__002d__v1.v1.video__002d__v1.video__002d__v1__002e__html@2bbb5dee'
  // as it's an artifact of the original HTML and not a valid CSS class.
  cmpMediaWrapper.append(videoWrapper);

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
  playButtonText.textContent = playButtonLabel || 'Watch Video';
  playButton.append(playButtonText);

  const posterVideo = document.createElement('video');
  posterVideo.classList.add('video-poster__video');
  posterVideo.setAttribute('muted', '');
  posterVideo.setAttribute('loop', '');
  posterVideo.setAttribute('playsinline', '');
  posterVideo.setAttribute('webkit-playsinline', '');
  posterVideo.setAttribute('x-webkit-airplay', 'allow');
  posterVideo.setAttribute('autoplay', '');

  if (videoPosterImagePicture) {
    posterVideo.poster = videoPosterImagePicture.querySelector('img')?.src || '';
  }
  if (videoPosterSrcPicture) {
    posterVideo.src = videoPosterSrcPicture.querySelector('img')?.src || '';
  }
  videoPosterDiv.append(posterVideo);

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container', 'show-controls', 'video-hide');
  videoWrapper.append(videoContainer);

  const viewportVideoContainer = document.createElement('div');
  viewportVideoContainer.classList.add('viewport-video');
  viewportVideoContainer.setAttribute('hidden', '');
  viewportVideoContainer.setAttribute('aria-hidden', 'true');
  videoContainer.append(viewportVideoContainer);

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

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('video-container__controls__buttons');
  videoControls.append(buttonsDiv);

  const playButtonControls = document.createElement('button');
  playButtonControls.classList.add('video-container__controls__buttons__play-button', 'video-container__controls__buttons--button');
  buttonsDiv.append(playButtonControls);

  const playIconControls = document.createElement('span');
  playIconControls.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--play');
  playButtonControls.append(playIconControls);

  const muteButton = document.createElement('button');
  muteButton.classList.add('video-container__controls__buttons__mute-button', 'video-container__controls__buttons--button');
  buttonsDiv.append(muteButton);

  const volumeIcon = document.createElement('span');
  volumeIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--volume');
  muteButton.append(volumeIcon);

  const fullscreenButton = document.createElement('button');
  fullscreenButton.classList.add('video-container__controls__buttons__fullscreen-button', 'video-container__controls__buttons--button');
  buttonsDiv.append(fullscreenButton);

  const fullscreenIcon = document.createElement('span');
  fullscreenIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--fullscreen');
  fullscreenButton.append(fullscreenIcon);

  const mainVideo = document.createElement('video');
  mainVideo.classList.add('video-container__video');
  mainVideo.setAttribute('playsinline', '');
  mainVideo.setAttribute('webkit-playsinline', '');
  mainVideo.setAttribute('x-webkit-airplay', 'allow');
  if (videoSourcePicture) {
    const mainVideoSrc = videoSourcePicture.querySelector('img')?.src || '';
    mainVideo.setAttribute('data-video-src', mainVideoSrc);
    mainVideo.src = mainVideoSrc;
  }
  videoWrapper.append(mainVideo);

  // Event Listeners for video functionality
  let isPlaying = false;
  let isMuted = true;
  let isFullscreen = false;

  const togglePlay = () => {
    if (isPlaying) {
      posterVideo.pause();
      mainVideo.pause();
      playIcon.classList.remove('qd-icon--pause');
      playIcon.classList.add('qd-icon--play');
      playIconControls.classList.remove('qd-icon--pause');
      playIconControls.classList.add('qd-icon--play');
    } else {
      posterVideo.play();
      mainVideo.play();
      playIcon.classList.remove('qd-icon--play');
      playIcon.classList.add('qd-icon--pause');
      playIconControls.classList.remove('qd-icon--play');
      playIconControls.classList.add('qd-icon--pause');
      videoPosterDiv.style.display = 'none';
      videoContainer.classList.remove('video-hide');
    }
    isPlaying = !isPlaying;
  };

  const toggleMute = () => {
    posterVideo.muted = !isMuted;
    mainVideo.muted = !isMuted;
    if (isMuted) {
      volumeIcon.classList.remove('qd-icon--volume-mute');
      volumeIcon.classList.add('qd-icon--volume');
    } else {
      volumeIcon.classList.remove('qd-icon--volume');
      volumeIcon.classList.add('qd-icon--volume-mute');
    }
    isMuted = !isMuted;
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (mainVideo.requestFullscreen) {
        mainVideo.requestFullscreen();
      } else if (mainVideo.webkitRequestFullscreen) { /* Safari */
        mainVideo.webkitRequestFullscreen();
      } else if (mainVideo.msRequestFullscreen) { /* IE11 */
        mainVideo.msRequestFullscreen();
      }
      fullscreenIcon.classList.remove('qd-icon--fullscreen');
      fullscreenIcon.classList.add('qd-icon--fullscreen-exit');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
      fullscreenIcon.classList.remove('qd-icon--fullscreen-exit');
      fullscreenIcon.classList.add('qd-icon--fullscreen');
    }
    isFullscreen = !isFullscreen;
  };

  playButton.addEventListener('click', togglePlay);
  playButtonControls.addEventListener('click', togglePlay);
  muteButton.addEventListener('click', toggleMute);
  fullscreenButton.addEventListener('click', toggleFullscreen);

  // Update progress bar and time
  const updateProgress = (videoElement) => {
    const progress = (videoElement.currentTime / videoElement.duration) * 100;
    progressArea.style.width = `${progress}%`;

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    currentTime.textContent = formatTime(videoElement.currentTime);
    duration.textContent = formatTime(videoElement.duration);
  };

  mainVideo.addEventListener('timeupdate', () => updateProgress(mainVideo));
  mainVideo.addEventListener('loadedmetadata', () => updateProgress(mainVideo));

  // Seek functionality
  timerDiv.addEventListener('click', (e) => {
    const rect = timerDiv.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    mainVideo.currentTime = mainVideo.duration * percentage;
  });

  // Handle video ending
  mainVideo.addEventListener('ended', () => {
    isPlaying = false;
    playIcon.classList.remove('qd-icon--pause');
    playIcon.classList.add('qd-icon--play');
    playIconControls.classList.remove('qd-icon--pause');
    playIconControls.classList.add('qd-icon--play');
    videoPosterDiv.style.display = 'block';
    videoContainer.classList.add('video-hide');
    mainVideo.currentTime = 0; // Reset video to start
  });

  // Optimize images
  // The original code was trying to optimize images that were already part of the picture elements.
  // We need to find the picture elements from the block's children, move their instrumentation
  // and then replace them with optimized versions.
  [videoPosterImageRow, videoPosterSrcRow, videoSrcRow].forEach((row) => {
    const pictureElement = row?.querySelector('picture');
    if (pictureElement) {
      const img = pictureElement.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation should be called on the original row, not the img within the picture
        moveInstrumentation(row, optimizedPic);
        pictureElement.replaceWith(optimizedPic);
      }
    }
  });

  block.replaceChildren(cmpMedia);
}
