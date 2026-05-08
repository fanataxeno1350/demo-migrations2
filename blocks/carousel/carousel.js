import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slideRows = [...block.children];

  const root = document.createElement('div');
  root.classList.add('position-relative');

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'primary-swiper');
  // Original HTML has a dynamic ID like primary-swiper-carousel-419d8524f7,
  // but for EDS, a generic ID or omitting if not strictly required by CSS is fine.
  // Using a generic ID for now.
  swiperEl.setAttribute('id', `carousel-${Math.random().toString(36).substring(2, 11)}`);
  swiperEl.setAttribute('role', 'group');
  swiperEl.setAttribute('aria-live', 'polite');
  swiperEl.setAttribute('aria-roledescription', 'carousel');
  swiperEl.setAttribute('data-is-autoplay', 'true');
  swiperEl.setAttribute('data-delay', '5000');
  swiperEl.setAttribute('data-autopause-disabled', 'true');
  swiperEl.setAttribute('data-is-loop', 'false'); // Default to false, check original HTML if it changes
  swiperEl.setAttribute('data-placeholder-text', 'false');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'primary-swiper-wrapper', 'z-0');

  slideRows.forEach((row) => {
    const [videoCell, imageCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'primary-swiper-slide');
    swiperSlide.setAttribute('role', 'tabpanel');
    swiperSlide.setAttribute('aria-roledescription', 'slide');
    // Data attributes for slide instrumentation are handled by moveInstrumentation
    moveInstrumentation(row, swiperSlide);

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner');

    const bannerSection = document.createElement('section');
    bannerSection.classList.add('banner-section');

    const bannerWrapper = document.createElement('div');
    bannerWrapper.classList.add('position-relative', 'boing', 'banner-section__wrapper');

    const videoPicture = videoCell?.querySelector('picture');
    const imagePicture = imageCell?.querySelector('picture');

    if (videoPicture && videoPicture.querySelector('img')) {
      const videoWrapper = document.createElement('div');
      videoWrapper.classList.add('video-wrapper');

      const videoLink = videoPicture.querySelector('source') || videoPicture.querySelector('img');
      if (videoLink && /\.(mp4|webm|ogg|mov)$/i.test(videoLink.src)) {
        const video = document.createElement('video');
        video.classList.add('w-100', 'object-fit-cover', 'banner-media', 'banner-video');
        video.setAttribute('title', 'Video');
        video.setAttribute('aria-label', 'Video');
        video.setAttribute('data-is-autoplay', 'true');
        video.setAttribute('playsinline', '');
        video.setAttribute('preload', 'metadata');
        video.setAttribute('fetchpriority', 'high');
        video.setAttribute('loop', 'false');
        video.setAttribute('muted', 'true');
        video.setAttribute('autoplay', 'true');

        const source = document.createElement('source');
        source.src = videoLink.src;
        source.type = `video/${videoLink.src.split('.').pop()}`;
        video.append(source);
        videoWrapper.append(video);

        // Play/Pause buttons
        const playPauseWrap = document.createElement('div');
        playPauseWrap.classList.add('position-absolute', 'w-100', 'h-100', 'start-0', 'top-0', 'd-flex', 'justify-content-center', 'align-items-center', 'cursor-pointer');
        const playBtn = document.createElement('button');
        playBtn.classList.add('d-none', 'video-icon', 'icon-play', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
        playBtn.setAttribute('type', 'button');
        playBtn.innerHTML = '▶'; // Replaced SVG with Unicode
        const pauseBtn = document.createElement('button');
        pauseBtn.classList.add('d-block', 'video-icon', 'icon-pause', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
        pauseBtn.setAttribute('type', 'button');
        pauseBtn.innerHTML = '⏸'; // Replaced SVG with Unicode
        playPauseWrap.append(playBtn, pauseBtn);

        // Mute/Unmute buttons
        const muteWrap = document.createElement('div');
        muteWrap.classList.add('position-absolute', 'z-2', 'd-flex', 'justify-content-center', 'align-items-center', 'cursor-pointer', 'mute-icon');
        const muteBtn = document.createElement('button');
        muteBtn.classList.add('video-icon-volume', 'icon-mute', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer', 'd-none');
        muteBtn.setAttribute('type', 'button');
        muteBtn.innerHTML = '🔊'; // Replaced SVG with Unicode
        const unmuteBtn = document.createElement('button');
        unmuteBtn.classList.add('video-icon-volume', 'icon-unmute', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer', 'd-none');
        unmuteBtn.setAttribute('type', 'button');
        unmuteBtn.innerHTML = '🔇'; // Replaced SVG with Unicode
        const noAudioBtn = document.createElement('button');
        noAudioBtn.classList.add('video-icon-volume', 'no-audio-icon', 'bg-transparent', 'd-flex', 'align-items-center', 'justify-content-center', 'cursor-pointer');
        noAudioBtn.setAttribute('type', 'button');
        noAudioBtn.innerHTML = '🔈'; // Replaced SVG with Unicode
        muteWrap.append(muteBtn, unmuteBtn, noAudioBtn);

        videoWrapper.append(playPauseWrap, muteWrap);

        // Video controls logic
        video.addEventListener('play', () => {
          playBtn.classList.add('d-none');
          pauseBtn.classList.remove('d-none');
        });
        video.addEventListener('pause', () => {
          playBtn.classList.remove('d-none');
          pauseBtn.classList.add('d-none');
        });
        video.addEventListener('volumechange', () => {
          if (video.muted) {
            muteBtn.classList.add('d-none');
            unmuteBtn.classList.add('d-none');
            noAudioBtn.classList.remove('d-none');
          } else if (video.volume === 0) {
            muteBtn.classList.add('d-none');
            unmuteBtn.classList.add('d-none');
            noAudioBtn.classList.remove('d-none');
          } else {
            muteBtn.classList.remove('d-none');
            unmuteBtn.classList.add('d-none');
            noAudioBtn.classList.add('d-none');
          }
        });

        playBtn.addEventListener('click', () => video.play());
        pauseBtn.addEventListener('click', () => video.pause());
        muteBtn.addEventListener('click', () => { video.muted = true; });
        unmuteBtn.addEventListener('click', () => { video.muted = false; });
        noAudioBtn.addEventListener('click', () => { video.muted = false; });

        bannerWrapper.append(videoWrapper);
      }
    } else if (imagePicture) {
      const img = imagePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'banner-image');
        optimizedImg.setAttribute('fetchpriority', 'high');
        optimizedImg.setAttribute('decoding', 'async');
        bannerWrapper.append(optimizedPic);
      }
    }

    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('position-absolute', 'start-50', 'translate-middle-x', 'w-100', 'boing__banner--cta');
    const bannerCta = document.createElement('div');
    bannerCta.classList.add('banner-cta');

    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaLabel = ctaLabelCell?.textContent.trim();

    if (ctaLink && ctaLabel) {
      const ctaDiv = document.createElement('div');
      ctaDiv.classList.add('text-center');
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-button', 'analytics_cta_click', 'text-center', 'cta-layout');
      anchor.setAttribute('data-link-region', 'CTA');
      anchor.setAttribute('data-is-internal', 'true');
      anchor.setAttribute('data-enable-gating', 'false');
      anchor.href = ctaLink.href;
      anchor.setAttribute('target', '_blank'); // Assuming from original HTML

      const span = document.createElement('span');
      span.classList.add('cmp-button__text', 'primary-btn', 'w-75', 'p-5', 'rounded-pill', 'd-inline-flex', 'justify-content-center', 'align-items-center', 'famlf-cta-btn');
      span.textContent = ctaLabel;
      anchor.append(span);
      ctaDiv.append(anchor);
      bannerCta.append(ctaDiv);
    }
    ctaWrapper.append(bannerCta);
    bannerWrapper.append(ctaWrapper);
    bannerSection.append(bannerWrapper);
    bannerDiv.append(bannerSection);
    swiperSlide.append(bannerDiv);
    swiperWrapper.append(swiperSlide);
  });

  swiperEl.append(swiperWrapper);

  // Navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('primary-swiper__buttonPrev', 'position-absolute', 'top-50', 'swiper-buttonBg', 'd-none', 'd-sm-block', 'cursor-pointer', 'analytics_cta_click');
  prevBtn.innerHTML = '‹'; // Unicode arrow as placeholder
  prevBtn.setAttribute('aria-label', 'Previous');

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('primary-swiper__buttonNext', 'position-absolute', 'top-50', 'swiper-buttonBg', 'd-none', 'd-sm-block', 'cursor-pointer', 'analytics_cta_click');
  nextBtn.innerHTML = '›'; // Unicode arrow as placeholder
  nextBtn.setAttribute('aria-label', 'Next');

  // Append navigation buttons directly to swiperEl, as per original HTML structure
  // The original HTML has them inside a 'swiper-container' div, but that div
  // also contains the pagination, and Swiper expects prevEl/nextEl to be direct DOM elements.
  // Replicating the button structure from original HTML (without the extra wrapper div)
  swiperEl.append(prevBtn, nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'primary-swiper-pagination', 'pagination-set', 'mb-md-8', 'mb-10', 'mt-6', 'position-absolute', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  swiperEl.append(paginationEl);

  root.append(swiperEl);
  block.replaceChildren(root);

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 1, // Adjust as per original behavior
    spaceBetween: 0,
    loop: swiperEl.dataset.isLoop === 'true', // Correctly parse data-is-loop
    autoplay: {
      delay: parseInt(swiperEl.dataset.delay, 10) || 5000,
      disableOnInteraction: swiperEl.dataset.autopauseDisabled !== 'true',
    },
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      // Example breakpoints, adjust based on original HTML/CSS
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 1,
      },
    },
  });
}
