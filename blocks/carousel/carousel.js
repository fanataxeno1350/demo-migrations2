import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'primary-swiper');
  moveInstrumentation(block, swiperContainer); // Move instrumentation from block to swiperContainer

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'primary-swiper-wrapper', 'z-0');
  swiperContainer.append(swiperWrapper);

  const slides = [...block.children];
  slides.forEach((row) => {
    const [videoCell, imageCell, imageAltCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'primary-swiper-slide');
    moveInstrumentation(row, slide); // Move instrumentation from row to slide

    const bannerSection = document.createElement('section');
    bannerSection.classList.add('banner-section');

    const bannerWrapper = document.createElement('div');
    bannerWrapper.classList.add('position-relative', 'boing', 'banner-section__wrapper');

    const videoPicture = videoCell?.querySelector('picture');
    const imagePicture = imageCell?.querySelector('picture');
    const imageAltText = imageAltCell?.textContent.trim() || '';
    const ctaLinkHref = ctaLinkCell?.querySelector('a')?.href;
    const ctaLabelText = ctaLabelCell?.textContent.trim() || '';

    if (videoPicture) {
      const videoWrapper = document.createElement('div');
      videoWrapper.classList.add('video-wrapper');

      const video = document.createElement('video');
      video.classList.add('w-100', 'object-fit-cover', 'banner-media', 'banner-video');
      video.title = 'Video';
      video.ariaLabel = 'Video';
      video.playsInline = true;
      video.preload = 'metadata';
      video.fetchPriority = 'high';
      video.loop = false;
      video.muted = true;
      video.autoplay = true;

      const videoImg = videoPicture.querySelector('img');
      if (videoImg && /\.(mp4|webm|ogg|mov)$/i.test(videoImg.src)) {
        const source = document.createElement('source');
        source.src = videoImg.src;
        source.type = `video/${videoImg.src.split('.').pop()}`;
        video.append(source);
      }

      videoWrapper.append(video);

      const playPauseOverlay = document.createElement('div');
      playPauseOverlay.classList.add('position-absolute', 'w-100', 'h-100', 'start-0', 'top-0', 'd-flex', 'justify-content-center', 'align-items-center', 'cursor-pointer');

      const playButton = document.createElement('button');
      playButton.type = 'button';
      playButton.classList.add('d-none', 'video-icon', 'icon-play', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
      // Replaced hardcoded SVG path with inline SVG or Unicode as per Rule 25.4
      playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M8 5v14l11-7z"/></svg>';

      const pauseButton = document.createElement('button');
      pauseButton.type = 'button';
      pauseButton.classList.add('d-block', 'video-icon', 'icon-pause', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
      // Replaced hardcoded SVG path with inline SVG or Unicode as per Rule 25.4
      pauseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

      playPauseOverlay.append(playButton, pauseButton);

      const muteOverlay = document.createElement('div');
      muteOverlay.classList.add('position-absolute', 'z-2', 'd-flex', 'justify-content-center', 'align-items-center', 'cursor-pointer', 'mute-icon');

      const volumeHighButton = document.createElement('button');
      volumeHighButton.type = 'button';
      volumeHighButton.classList.add('video-icon-volume', 'icon-mute', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer', 'd-none');
      // Replaced hardcoded SVG path with inline SVG or Unicode as per Rule 25.4
      volumeHighButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';

      const volumeCrossButton = document.createElement('button');
      volumeCrossButton.type = 'button';
      volumeCrossButton.classList.add('video-icon-volume', 'icon-unmute', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer', 'd-none');
      // Replaced hardcoded SVG path with inline SVG or Unicode as per Rule 25.4
      volumeCrossButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .9-.2 1.75-.56 2.57l1.44 1.44A9.994 9.994 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.41.33-.88.62-1.4.85v2.06c1.91-.45 3.68-1.81 5.04-3.59L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';

      const volumeMuteButton = document.createElement('button');
      volumeMuteButton.type = 'button';
      volumeMuteButton.classList.add('video-icon-volume', 'no-audio-icon', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
      // Replaced hardcoded SVG path with inline SVG or Unicode as per Rule 25.4
      volumeMuteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M7 9v6h4l5 5V4L11 9H7z"/></svg>';

      muteOverlay.append(volumeHighButton, volumeCrossButton, volumeMuteButton);

      videoWrapper.append(playPauseOverlay, muteOverlay);
      bannerWrapper.append(videoWrapper);

      playButton.addEventListener('click', () => {
        video.play();
        playButton.classList.add('d-none');
        pauseButton.classList.remove('d-none');
      });

      pauseButton.addEventListener('click', () => {
        video.pause();
        pauseButton.classList.add('d-none');
        playButton.classList.remove('d-none');
      });

      volumeHighButton.addEventListener('click', () => {
        video.muted = true;
        volumeHighButton.classList.add('d-none');
        volumeMuteButton.classList.remove('d-none');
      });

      volumeMuteButton.addEventListener('click', () => {
        video.muted = false;
        volumeMuteButton.classList.add('d-none');
        volumeHighButton.classList.remove('d-none');
      });
    } else if (imagePicture) {
      const img = imagePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltText, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'banner-image');
        bannerWrapper.append(optimizedPic);
      }
    }

    const ctaDiv = document.createElement('div');
    ctaDiv.classList.add('position-absolute', 'start-50', 'translate-middle-x', 'w-100', 'boing__banner--cta');
    const bannerCta = document.createElement('div');
    bannerCta.classList.add('banner-cta', 'text-center');

    if (ctaLinkHref && ctaLabelText) {
      const ctaLink = document.createElement('a');
      ctaLink.classList.add('cmp-button', 'analytics_cta_click', 'text-center', 'cta-layout');
      ctaLink.href = ctaLinkHref;
      ctaLink.target = '_blank';
      ctaLink.innerHTML = `<span class="cmp-button__text primary-btn w-75 p-5 rounded-pill d-inline-flex justify-content-center align-items-center famlf-cta-btn">${ctaLabelText}</span>`;
      bannerCta.append(ctaLink);
    }
    ctaDiv.append(bannerCta);
    bannerWrapper.append(ctaDiv);
    bannerSection.append(bannerWrapper);
    slide.append(bannerSection);
    swiperWrapper.append(slide);
  });

  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('cmp-carousel__actions');

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevBtn.type = 'button';
  prevBtn.ariaLabel = 'Previous';
  prevBtn.innerHTML = '<span class="cmp-carousel__action-icon"></span><span class="cmp-carousel__action-text">Previous</span>';

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextBtn.type = 'button';
  nextBtn.ariaLabel = 'Next';
  nextBtn.innerHTML = '<span class="cmp-carousel__action-icon"></span><span class="cmp-carousel__action-text">Next</span>';

  const pauseBtn = document.createElement('button');
  pauseBtn.classList.add('cmp-carousel__action', 'cmp-carousel__action--pause');
  pauseBtn.type = 'button';
  pauseBtn.ariaLabel = 'Pause';
  pauseBtn.innerHTML = '<span class="cmp-carousel__action-icon"></span><span class="cmp-carousel__action-text">Pause</span>';

  const playBtn = document.createElement('button');
  playBtn.classList.add('cmp-carousel__action', 'cmp-carousel__action--play', 'cmp-carousel__action--disabled');
  playBtn.type = 'button';
  playBtn.ariaLabel = 'Play';
  playBtn.innerHTML = '<span class="cmp-carousel__action-icon"></span><span class="cmp-carousel__action-text">Play</span>';

  actionsDiv.append(prevBtn, nextBtn, pauseBtn, playBtn);

  // Autoplay functionality for pause/play buttons
  let swiperInstance; // Declare swiperInstance here to be accessible by event listeners
  pauseBtn.addEventListener('click', () => {
    if (swiperInstance && swiperInstance.autoplay.running) {
      swiperInstance.autoplay.stop();
      pauseBtn.classList.add('cmp-carousel__action--disabled');
      playBtn.classList.remove('cmp-carousel__action--disabled');
    }
  });

  playBtn.addEventListener('click', () => {
    if (swiperInstance && !swiperInstance.autoplay.running) {
      swiperInstance.autoplay.start();
      playBtn.classList.add('cmp-carousel__action--disabled');
      pauseBtn.classList.remove('cmp-carousel__action--disabled');
    }
  });


  const swiperNavContainer = document.createElement('div');
  swiperNavContainer.classList.add('swiper-container');

  const nextButtonWrapper = document.createElement('div');
  const nextButton = document.createElement('button');
  nextButton.classList.add('primary-swiper__buttonNext', 'position-absolute', 'top-50', 'swiper-buttonBg', 'd-none', 'd-sm-block', 'cursor-pointer', 'analytics_cta_click', 'disabled');
  nextButton.disabled = true;
  nextButtonWrapper.append(nextButton);

  const prevButtonWrapper = document.createElement('div');
  const prevButton = document.createElement('button');
  prevButton.classList.add('primary-swiper__buttonPrev', 'position-absolute', 'top-50', 'swiper-buttonBg', 'd-none', 'd-sm-block', 'cursor-pointer', 'analytics_cta_click');
  prevButtonWrapper.append(prevButton);

  swiperNavContainer.append(nextButtonWrapper, prevButtonWrapper);

  const paginationEl = document.createElement('div');
  // Removed swiper-pagination-clickable, swiper-pagination-bullets, swiper-pagination-horizontal as Swiper adds them
  paginationEl.classList.add('swiper-pagination', 'primary-swiper-pagination', 'pagination-set', 'mb-md-8', 'mb-10', 'mt-6', 'position-absolute');

  swiperContainer.append(actionsDiv, swiperNavContainer, paginationEl);

  block.replaceChildren(swiperContainer);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Read Swiper options from data attributes on the block
  const isAutoplay = block.dataset.isAutoplay === 'true';
  const delay = parseInt(block.dataset.delay, 10) || 5000;
  const disableOnInteraction = block.dataset.autopauseDisabled === 'true';
  const isLoop = block.dataset.isLoop === 'true';

  // eslint-disable-next-line no-undef
  swiperInstance = new Swiper(swiperContainer, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: isLoop,
    autoplay: isAutoplay ? {
      delay,
      disableOnInteraction,
    } : false,
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
  });

  // Initial state for play/pause buttons based on autoplay
  if (isAutoplay) {
    playBtn.classList.add('cmp-carousel__action--disabled');
    pauseBtn.classList.remove('cmp-carousel__action--disabled');
  } else {
    pauseBtn.classList.add('cmp-carousel__action--disabled');
    playBtn.classList.remove('cmp-carousel__action--disabled');
  }
}
