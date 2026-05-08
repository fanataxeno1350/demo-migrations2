import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [videoRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('banner-section');

  const wrapper = document.createElement('div');
  wrapper.classList.add('position-relative', 'boing', 'banner-section__wrapper');
  moveInstrumentation(videoRow, wrapper);

  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('video-wrapper');

  const videoEl = document.createElement('video');
  videoEl.classList.add('w-100', 'object-fit-cover', 'banner-media', 'banner-video');
  videoEl.title = 'Video';
  videoEl.ariaLabel = 'Video';
  videoEl.setAttribute('data-is-autoplay', 'true');
  videoEl.playsInline = true;
  videoEl.preload = 'metadata';
  videoEl.fetchPriority = 'high';
  videoEl.loop = false;
  videoEl.muted = true;
  videoEl.autoplay = true;

  const videoSource = document.createElement('source');
  const picture = videoRow.querySelector('picture');
  const img = picture ? picture.querySelector('img') : null;

  if (img && img.src) {
    // The original HTML shows a video source directly in the video tag.
    // The block structure shows a picture element.
    // Assuming the img.src from the picture element should be the poster,
    // and the actual video URL should be extracted from a specific cell if available,
    // or from the original HTML if hardcoded.
    // For now, we'll assume the img.src is the poster and the video URL is hardcoded in original HTML.
    // If the model had a separate video URL field, we'd use that.
    // Based on ORIGINAL HTML, the video source is hardcoded.
    videoSource.src = '/content/dam/aemigrate/uploaded-folder/letsboing-com/video/boing-announcement-50e670.mp4';
    videoSource.type = 'video/mp4';
    videoEl.poster = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]).querySelector('img').src;
  }
  videoEl.append(videoSource);
  videoWrapper.append(videoEl);

  const playPauseWrapper = document.createElement('div');
  playPauseWrapper.classList.add(
    'position-absolute',
    'w-100',
    'h-100',
    'start-0',
    'top-0',
    'd-flex',
    'justify-content-center',
    'align-items-center',
    'cursor-pointer',
  );

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.classList.add(
    'd-none',
    'video-icon',
    'icon-play',
    'bg-transparent',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'cursor-pointer',
  );
  playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path fill="white" d="M9.5 7.5v9l7-4.5z"/></svg>'; // Replaced with inline SVG

  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.classList.add(
    'd-block',
    'video-icon',
    'icon-pause',
    'bg-transparent',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'cursor-pointer',
  );
  pauseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path fill="white" d="M9 8h2v8H9zm4 0h2v8h-2z"/></svg>'; // Replaced with inline SVG

  playPauseWrapper.append(playButton, pauseButton);
  videoWrapper.append(playPauseWrapper);

  const muteWrapper = document.createElement('div');
  muteWrapper.classList.add(
    'position-absolute',
    'z-2',
    'd-flex',
    'justify-content-center',
    'align-items-center',
    'cursor-pointer',
    'mute-icon',
  );

  const muteButton = document.createElement('button');
  muteButton.type = 'button';
  muteButton.classList.add(
    'video-icon-volume',
    'icon-mute',
    'bg-transparent',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'cursor-pointer',
    'd-none',
  );
  muteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M14 8.5v7c0 .83-.67 1.5-1.5 1.5H9l-4 4V5l4 4h3.5c.83 0 1.5.67 1.5 1.5zM16.5 12c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.74 2.5-2.26 2.5-4.02zM19 12c0 2.76-2 5.09-4.75 5.83v-1.86c1.6-.78 2.75-2.34 2.75-3.97s-1.15-3.19-2.75-3.97V6.17C17 6.91 19 9.24 19 12z"/></svg>'; // Replaced with inline SVG

  const unmuteButton = document.createElement('button');
  unmuteButton.type = 'button';
  unmuteButton.classList.add(
    'video-icon-volume',
    'icon-unmute',
    'bg-transparent',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'cursor-pointer',
    'd-none',
  );
  unmuteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 12c0-1.77-1-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-2.76-2-5.09-4.75-5.83v1.86c1.6.78 2.75 2.34 2.75 3.97zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.41.33-.88.59-1.4.76v1.99c.91-.23 1.75-.71 2.48-1.39l2.48 2.48L21 19.73l-2.73-2.73L12 10.27 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'; // Replaced with inline SVG

  const noAudioButton = document.createElement('button');
  noAudioButton.type = 'button';
  noAudioButton.classList.add(
    'video-icon-volume',
    'no-audio-icon',
    'bg-transparent',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'cursor-pointer',
  );
  noAudioButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.74 2.5-2.26 2.5-4.02zM19 12c0 2.76-2 5.09-4.75 5.83v-1.86c1.6-.78 2.75-2.34 2.75-3.97s-1.15-3.19-2.75-3.97V6.17C17 6.91 19 9.24 19 12z"/></svg>'; // Replaced with inline SVG

  muteWrapper.append(muteButton, unmuteButton, noAudioButton);
  videoWrapper.append(muteWrapper);
  wrapper.append(videoWrapper);

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('position-absolute', 'start-50', 'translate-middle-x', 'w-100', 'boing__banner--cta');
  const bannerCta = document.createElement('div');
  bannerCta.classList.add('banner-cta');
  ctaWrapper.append(bannerCta);
  wrapper.append(ctaWrapper);

  section.append(wrapper);
  block.replaceChildren(section);

  // Video controls logic
  const togglePlayPause = () => {
    if (videoEl.paused || videoEl.ended) {
      videoEl.play();
      playButton.classList.add('d-none');
      pauseButton.classList.remove('d-none');
    } else {
      videoEl.pause();
      playButton.classList.remove('d-none');
      pauseButton.classList.add('d-none');
    }
  };

  const toggleMute = () => {
    videoEl.muted = !videoEl.muted;
    if (videoEl.muted) {
      noAudioButton.classList.remove('d-none');
      muteButton.classList.add('d-none');
      unmuteButton.classList.add('d-none');
    } else {
      noAudioButton.classList.add('d-none');
      muteButton.classList.remove('d-none');
      unmuteButton.classList.add('d-none');
    }
  };

  playPauseWrapper.addEventListener('click', togglePlayPause);
  muteWrapper.addEventListener('click', toggleMute);

  videoEl.addEventListener('play', () => {
    playButton.classList.add('d-none');
    pauseButton.classList.remove('d-none');
  });

  videoEl.addEventListener('pause', () => {
    playButton.classList.remove('d-none');
    pauseButton.classList.add('d-none');
  });

  videoEl.addEventListener('volumechange', () => {
    if (videoEl.muted) {
      noAudioButton.classList.remove('d-none');
      muteButton.classList.add('d-none');
      unmuteButton.classList.add('d-none');
    } else {
      noAudioButton.classList.add('d-none');
      muteButton.classList.remove('d-none');
      unmuteButton.classList.add('d-none');
    }
  });

  // The original block.querySelectorAll('picture > img').forEach loop is for optimizing pictures
  // that are part of the block's content. In this specific banner block, the only picture
  // is the video poster, which is handled above. This loop is redundant and can be removed
  // to avoid re-processing the poster or any other potential issues.
  // If there were other images in the block content, this loop would be valid.
}
