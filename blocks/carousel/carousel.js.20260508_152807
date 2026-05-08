import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [...block.children];

  // The outer block div already has the 'carousel' class.
  // Adding 'primary-swiper' to an inner wrapper would cause double padding/CSS.
  // The original HTML shows 'primary-swiper' on the main swiper container, not a root wrapper.
  // The block's own class 'carousel' should not be added to any inner element.

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'primary-swiper-wrapper', 'z-0');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'primary-swiper'); // This is where primary-swiper belongs based on original HTML
  swiperContainer.setAttribute('role', 'group');
  swiperContainer.setAttribute('aria-live', 'polite');
  swiperContainer.setAttribute('aria-roledescription', 'carousel');

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('primary-swiper__buttonPrev', 'position-absolute', 'top-50', 'swiper-buttonBg', 'd-none', 'd-sm-block', 'cursor-pointer', 'analytics_cta_click');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '‹'; // Unicode arrow for prev, as per Rule 25.4

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('primary-swiper__buttonNext', 'position-absolute', 'top-50', 'swiper-buttonBg', 'd-none', 'd-sm-block', 'cursor-pointer', 'analytics_cta_click');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '›'; // Unicode arrow for next, as per Rule 25.4

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'primary-swiper-pagination', 'pagination-set', 'mb-md-8', 'mb-10', 'mt-6', 'position-absolute');

  slides.forEach((slideRow) => {
    const [videoSrcCell, imageSrcCell, imageAltCell, ctaLinkCell, ctaLabelCell] = [...slideRow.children];

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'primary-swiper-slide');
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-roledescription', 'slide');

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner');

    const bannerSection = document.createElement('section');
    bannerSection.classList.add('banner-section');

    const bannerWrapper = document.createElement('div');
    bannerWrapper.classList.add('position-relative', 'boing', 'banner-section__wrapper');

    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('position-absolute', 'start-50', 'translate-middle-x', 'w-100', 'boing__banner--cta');

    const bannerCta = document.createElement('div');
    bannerCta.classList.add('banner-cta');

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const ctaButtonContainer = document.createElement('div');
      ctaButtonContainer.classList.add('text-center');

      const ctaAnchor = document.createElement('a');
      ctaAnchor.classList.add('cmp-button', 'analytics_cta_click', 'text-center', 'cta-layout');
      ctaAnchor.href = ctaLink.href;
      ctaAnchor.setAttribute('data-link-region', 'CTA');
      ctaAnchor.setAttribute('data-is-internal', 'true');
      ctaAnchor.setAttribute('data-enable-gating', 'false');
      ctaAnchor.setAttribute('target', '_blank');

      const ctaSpan = document.createElement('span');
      ctaSpan.classList.add('cmp-button__text', 'primary-btn', 'w-75', 'p-5', 'rounded-pill', 'd-inline-flex', 'justify-content-center', 'align-items-center', 'famlf-cta-btn');
      ctaSpan.textContent = ctaLabelCell.textContent.trim();

      ctaAnchor.append(ctaSpan);
      moveInstrumentation(ctaLinkCell, ctaAnchor);
      moveInstrumentation(ctaLabelCell, ctaSpan);
      ctaButtonContainer.append(ctaAnchor);
      bannerCta.append(ctaButtonContainer);
    }

    const videoPicture = videoSrcCell.querySelector('picture');
    const imagePicture = imageSrcCell.querySelector('picture');
    const imageAlt = imageAltCell.textContent.trim();

    if (videoPicture && videoPicture.querySelector('img')) {
      const videoWrapper = document.createElement('div');
      videoWrapper.classList.add('video-wrapper');

      const video = document.createElement('video');
      video.classList.add('w-100', 'object-fit-cover', 'banner-media', 'banner-video');
      video.setAttribute('title', 'Video');
      video.setAttribute('aria-label', 'Video');
      video.setAttribute('playsinline', '');
      video.setAttribute('preload', 'metadata');
      video.setAttribute('fetchpriority', 'high');
      video.setAttribute('muted', 'true');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('loop', 'false'); // Original HTML has loop="false"

      const source = document.createElement('source');
      source.src = videoPicture.querySelector('img').src;
      source.type = 'video/mp4'; // Assuming mp4 based on original HTML

      video.append(source);
      videoWrapper.append(video);

      // Play/Pause button
      const playPauseWrapper = document.createElement('div');
      playPauseWrapper.classList.add('position-absolute', 'w-100', 'h-100', 'start-0', 'top-0', 'd-flex', 'justify-content-center', 'align-items-center', 'cursor-pointer');
      const playButton = document.createElement('button');
      playButton.classList.add('d-none', 'video-icon', 'icon-play', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
      playButton.innerHTML = '▶'; // Replaced hardcoded SVG path with Unicode
      const pauseButton = document.createElement('button');
      pauseButton.classList.add('d-block', 'video-icon', 'icon-pause', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
      pauseButton.innerHTML = '⏸'; // Replaced hardcoded SVG path with Unicode
      playPauseWrapper.append(playButton, pauseButton);

      // Mute/Unmute button
      const muteWrapper = document.createElement('div');
      muteWrapper.classList.add('position-absolute', 'z-2', 'd-flex', 'justify-content-center', 'align-items-center', 'cursor-pointer', 'mute-icon');
      const muteButton = document.createElement('button');
      muteButton.classList.add('video-icon-volume', 'icon-mute', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer', 'd-none');
      muteButton.innerHTML = '🔊'; // Replaced hardcoded SVG path with Unicode
      const unmuteButton = document.createElement('button');
      unmuteButton.classList.add('video-icon-volume', 'icon-unmute', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer', 'd-none');
      unmuteButton.innerHTML = '🔇'; // Replaced hardcoded SVG path with Unicode
      const noAudioButton = document.createElement('button');
      noAudioButton.classList.add('video-icon-volume', 'no-audio-icon', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
      noAudioButton.innerHTML = '🔈'; // Replaced hardcoded SVG path with Unicode
      muteWrapper.append(muteButton, unmuteButton, noAudioButton);

      videoWrapper.append(playPauseWrapper, muteWrapper);

      video.addEventListener('play', () => {
        playButton.classList.add('d-none');
        pauseButton.classList.remove('d-none');
      });
      video.addEventListener('pause', () => {
        playButton.classList.remove('d-none');
        pauseButton.classList.add('d-none');
      });
      playButton.addEventListener('click', () => video.play());
      pauseButton.addEventListener('click', () => video.pause());

      video.addEventListener('volumechange', () => {
        if (video.muted) {
          muteButton.classList.add('d-none');
          unmuteButton.classList.add('d-none');
          noAudioButton.classList.remove('d-none');
        } else if (video.volume === 0) {
          muteButton.classList.add('d-none');
          unmuteButton.classList.add('d-none');
          noAudioButton.classList.remove('d-none');
        } else {
          muteButton.classList.remove('d-none');
          unmuteButton.classList.add('d-none');
          noAudioButton.classList.add('d-none');
        }
      });
      muteButton.addEventListener('click', () => {
        video.muted = true;
        muteButton.classList.add('d-none');
        noAudioButton.classList.remove('d-none');
      });
      unmuteButton.addEventListener('click', () => {
        video.muted = true;
        unmuteButton.classList.add('d-none');
        noAudioButton.classList.remove('d-none');
      });
      noAudioButton.addEventListener('click', () => {
        video.muted = false;
        video.volume = 1;
        noAudioButton.classList.add('d-none');
        muteButton.classList.remove('d-none');
      });

      bannerWrapper.append(videoWrapper);
      moveInstrumentation(videoSrcCell, videoWrapper);
    } else if (imagePicture) {
      const img = imagePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, imageAlt, false, [{ width: '2000' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'banner-image');
      optimizedImg.setAttribute('fetchpriority', 'high');
      optimizedImg.setAttribute('decoding', 'async');
      moveInstrumentation(imageSrcCell, optimizedPic.querySelector('img'));
      bannerWrapper.append(optimizedPic);
    }

    bannerWrapper.append(ctaWrapper);
    ctaWrapper.append(bannerCta);
    bannerSection.append(bannerWrapper);
    bannerDiv.append(bannerSection);
    slide.append(bannerDiv);
    swiperWrapper.append(slide);
    moveInstrumentation(slideRow, slide);
  });

  swiperContainer.append(swiperWrapper);

  // Original HTML has a wrapper div around the nav buttons, which is then appended to swiperContainer
  const swiperNavWrapper = document.createElement('div');
  swiperNavWrapper.classList.add('swiper-container'); // This class is present in original HTML for the nav wrapper
  const navDiv1 = document.createElement('div');
  navDiv1.append(nextBtn);
  const navDiv2 = document.createElement('div');
  navDiv2.append(prevBtn);
  swiperNavWrapper.append(navDiv1, navDiv2);

  swiperContainer.append(swiperNavWrapper, paginationEl);

  block.replaceChildren(swiperContainer);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Determine loop setting from data-is-loop attribute on the block, if present
  const isLoop = block.dataset.isLoop === 'true'; // Correctly reads 'false' from original HTML

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: isLoop, // Use the dynamically determined loop value
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
  });
}
