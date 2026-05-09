import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [videoPosterRow, videoSrcRow] = [...block.children];

  const posterPicture = videoPosterRow.querySelector('picture');
  // Video source is an img in a picture element, but we need the img itself, not the picture.
  // The original code was looking for 'picture img' which is correct, but then assigning to videoSourceLink.src
  // which expects the img element.
  const videoSourceImg = videoSrcRow.querySelector('img');

  const root = document.createElement('div');
  root.classList.add('cmp-media__wrapper', 'cmp-media__wrapper--no-title');

  const videoPosterDiv = document.createElement('div');
  videoPosterDiv.classList.add('video-poster');

  const playButton = document.createElement('button');
  playButton.classList.add('video-poster__play-button');

  const playIcon = document.createElement('span');
  playIcon.classList.add('qd-icon', 'qd-icon--play', 'video-poster__play-button__icon');
  playButton.append(playIcon);

  const playText = document.createElement('span');
  playText.classList.add('video-poster__play-button__text');
  playText.setAttribute('visually-hidden', '');
  playText.textContent = 'Watch Video';
  playButton.append(playText);

  const posterVideo = document.createElement('video');
  posterVideo.classList.add('video-poster__video');
  if (posterPicture) {
    const img = posterPicture.querySelector('img');
    if (img) {
      posterVideo.poster = img.src;
      // moveInstrumentation(img, posterVideo); // This was redundant, instrumentation is moved at the end for the row
    }
  }
  posterVideo.muted = true;
  posterVideo.loop = true;
  posterVideo.playsInline = true;
  posterVideo.setAttribute('webkit-playsinline', '');
  posterVideo.setAttribute('x-webkit-airplay', 'allow');
  posterVideo.autoplay = true;
  if (videoSourceImg) {
    posterVideo.src = videoSourceImg.src;
  }

  videoPosterDiv.append(playButton, posterVideo);

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container', 'show-controls', 'video-hide');

  const viewportVideoHidden = document.createElement('div');
  viewportVideoHidden.classList.add('viewport-video');
  viewportVideoHidden.hidden = true;
  viewportVideoHidden.setAttribute('aria-hidden', 'true');
  videoContainer.append(viewportVideoHidden);

  const controlsDiv = document.createElement('div');
  controlsDiv.classList.add('video-container__controls');

  const timerDiv = document.createElement('div');
  timerDiv.classList.add('video-container__controls__timer');
  timerDiv.innerHTML = `
    <span class="video-container__controls__timer__progress-area"></span>
    <span class="video-container__controls__timer__progress-area__pointer"></span>
    <span class="video-container__controls__timer__progress-area__progress-pending"></span>
  `;
  controlsDiv.append(timerDiv);

  const currentTime = document.createElement('p');
  currentTime.classList.add('video-container__controls__timer__current-time');
  currentTime.textContent = '00:00';
  controlsDiv.append(currentTime);

  const duration = document.createElement('p');
  duration.classList.add('video-container__controls__timer__duration');
  duration.textContent = '00:00';
  controlsDiv.append(duration);

  videoContainer.append(controlsDiv);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('video-container__controls__buttons');

  const playControlBtn = document.createElement('button');
  playControlBtn.classList.add('video-container__controls__buttons__play-button', 'video-container__controls__buttons--button');
  playControlBtn.innerHTML = '<span class="video-container__controls__buttons__icon qd-icon qd-icon--play"></span>';
  buttonsDiv.append(playControlBtn);

  const muteControlBtn = document.createElement('button');
  muteControlBtn.classList.add('video-container__controls__buttons__mute-button', 'video-container__controls__buttons--button');
  muteControlBtn.innerHTML = '<span class="video-container__controls__buttons__icon qd-icon qd-icon--volume"></span>';
  buttonsDiv.append(muteControlBtn);

  const fullscreenControlBtn = document.createElement('button');
  fullscreenControlBtn.classList.add('video-container__controls__buttons__fullscreen-button', 'video-container__controls__buttons--button');
  fullscreenControlBtn.innerHTML = '<span class="video-container__controls__buttons__icon qd-icon qd-icon--fullscreen"></span>';
  buttonsDiv.append(fullscreenControlBtn);

  controlsDiv.append(buttonsDiv);

  const mainVideo = document.createElement('video');
  mainVideo.classList.add('video-container__video');
  mainVideo.playsInline = true;
  mainVideo.setAttribute('webkit-playsinline', '');
  mainVideo.setAttribute('x-webkit-airplay', 'allow');
  if (videoSourceImg) {
    mainVideo.src = videoSourceImg.src;
    mainVideo.setAttribute('data-video-src', videoSourceImg.src);
  }

  videoContainer.append(mainVideo);

  root.append(videoPosterDiv, videoContainer);

  // Move instrumentation from original rows to the new main video and poster video elements
  moveInstrumentation(videoPosterRow, posterVideo);
  moveInstrumentation(videoSrcRow, mainVideo);

  block.replaceChildren(root);

  // Video playback logic
  let isPlaying = false;
  let isMuted = true;
  let isFullscreen = false;

  const togglePlay = () => {
    if (isPlaying) {
      posterVideo.pause();
      mainVideo.pause();
      playButton.querySelector('.qd-icon').classList.replace('qd-icon--pause', 'qd-icon--play');
      playControlBtn.querySelector('.qd-icon').classList.replace('qd-icon--pause', 'qd-icon--play');
    } else {
      posterVideo.play();
      mainVideo.play();
      playButton.querySelector('.qd-icon').classList.replace('qd-icon--play', 'qd-icon--pause');
      playControlBtn.querySelector('.qd-icon').classList.replace('qd-icon--play', 'qd-icon--pause');
    }
    isPlaying = !isPlaying;
  };

  const toggleMute = () => {
    isMuted = !isMuted;
    posterVideo.muted = isMuted;
    mainVideo.muted = isMuted;
    if (isMuted) {
      muteControlBtn.querySelector('.qd-icon').classList.replace('qd-icon--volume', 'qd-icon--volume-mute');
    } else {
      muteControlBtn.querySelector('.qd-icon').classList.replace('qd-icon--volume-mute', 'qd-icon--volume');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mainVideo.requestFullscreen) {
        mainVideo.requestFullscreen();
      } else if (mainVideo.webkitRequestFullscreen) { /* Safari */
        mainVideo.webkitRequestFullscreen();
      } else if (mainVideo.msRequestFullscreen) { /* IE11 */
        mainVideo.msRequestFullscreen();
      }
      fullscreenControlBtn.querySelector('.qd-icon').classList.replace('qd-icon--fullscreen', 'qd-icon--fullscreen-exit');
      isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
      fullscreenControlBtn.querySelector('.qd-icon').classList.replace('qd-icon--fullscreen-exit', 'qd-icon--fullscreen');
      isFullscreen = false;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const updateProgressBar = () => {
    const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
    timerDiv.querySelector('.video-container__controls__timer__progress-area').style.width = `${progress}%`;
    timerDiv.querySelector('.video-container__controls__timer__progress-area__pointer').style.left = `${progress}%`;
    currentTime.textContent = formatTime(mainVideo.currentTime);
  };

  const setProgressBar = (e) => {
    const rect = timerDiv.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width);
    mainVideo.currentTime = mainVideo.duration * percentage;
  };

  playButton.addEventListener('click', () => {
    videoPosterDiv.style.display = 'none';
    videoContainer.classList.remove('video-hide');
    togglePlay();
  });

  playControlBtn.addEventListener('click', togglePlay);
  muteControlBtn.addEventListener('click', toggleMute);
  fullscreenControlBtn.addEventListener('click', toggleFullscreen);

  mainVideo.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(mainVideo.duration);
    updateProgressBar();
  });

  mainVideo.addEventListener('timeupdate', updateProgressBar);

  timerDiv.addEventListener('click', setProgressBar);

  mainVideo.addEventListener('ended', () => {
    isPlaying = false;
    playControlBtn.querySelector('.qd-icon').classList.replace('qd-icon--pause', 'qd-icon--play');
  });

  document.addEventListener('fullscreenchange', () => {
    isFullscreen = !!document.fullscreenElement;
    if (isFullscreen) {
      fullscreenControlBtn.querySelector('.qd-icon').classList.replace('qd-icon--fullscreen', 'qd-icon--fullscreen-exit');
    } else {
      fullscreenControlBtn.querySelector('.qd-icon').classList.replace('qd-icon--fullscreen-exit', 'qd-icon--fullscreen');
    }
  });

  // Optimize images
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // For video poster, we move instrumentation to the video element itself, not the picture.
    // So we don't need to moveInstrumentation here again for the optimized picture.
    img.closest('picture').replaceWith(optimizedPic);
  });
}
