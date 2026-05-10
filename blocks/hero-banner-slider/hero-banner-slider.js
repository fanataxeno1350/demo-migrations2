import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  const sliderContainer = document.createElement('div');
  sliderContainer.classList.add('regular', 'slider', 'hero_banner_height_70'); // Removed slick-initialized, slick-slider
  sliderContainer.setAttribute('role', 'region');
  sliderContainer.setAttribute('aria-roledescription', 'carousel');

  const swiperWrapper = document.createElement('div'); // Renamed from slickList
  swiperWrapper.classList.add('swiper-wrapper'); // Changed from slick-list, draggable
  sliderContainer.append(swiperWrapper);

  // Swiper does not use slick-track, slides are appended directly to swiper-wrapper
  // const slickTrack = document.createElement('div');
  // slickTrack.classList.add('slick-track');
  // slickList.append(slickTrack);

  allRows
    .filter(row => row.children.length === 5) // Filter for hero-banner-slide-item rows
    .forEach((row, index) => {
      const [videoCell, desktopImageCell, mobileImageCell, headlineCell, subheadlineCell] = [...row.children];

      const swiperSlide = document.createElement('div'); // Renamed from slickSlide
      swiperSlide.classList.add('swiper-slide'); // Changed from slick-slide
      if (index === 0) {
        swiperSlide.classList.add('slick-current', 'slick-active'); // Keep these for initial styling if needed, Swiper adds its own active classes
      }
      swiperSlide.setAttribute('data-slick-index', index); // Keep for potential data reference, Swiper uses its own index
      swiperSlide.setAttribute('role', 'group');
      swiperSlide.setAttribute('aria-roledescription', 'slide');

      const bannerSlider = document.createElement('div');
      bannerSlider.classList.add('banner-slider', 'hero_banner_height_70');
      swiperSlide.append(bannerSlider);

      // Video
      const videoPicture = videoCell.querySelector('picture');
      if (videoPicture) {
        const videoSource = videoPicture.querySelector('source[type="video/mp4"]');
        const videoLink = videoSource?.srcset || videoPicture.querySelector('img')?.src;
        if (videoLink && /\.(mp4|webm|ogg|mov)$/i.test(videoLink)) {
          const carouselVideo = document.createElement('div');
          carouselVideo.classList.add('carousel-video');
          const videoEl = document.createElement('video');
          videoEl.setAttribute('playsinline', '');
          videoEl.setAttribute('preload', '');
          videoEl.setAttribute('autoplay', '');
          videoEl.setAttribute('loop', '');
          videoEl.setAttribute('muted', '');
          videoEl.src = videoLink;
          carouselVideo.append(videoEl);
          bannerSlider.append(carouselVideo);
        }
      }

      // Desktop Image
      const desktopPicture = desktopImageCell.querySelector('picture');
      if (desktopPicture) {
        const carouselDesktopImage = document.createElement('div');
        carouselDesktopImage.classList.add('carousel-image', 'carousel-desktop-image');
        const desktopImg = desktopPicture.querySelector('img');
        if (desktopImg) {
          const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
          carouselDesktopImage.style.backgroundImage = `url(${optimizedDesktopPic.querySelector('img').src})`;
          moveInstrumentation(desktopImageCell, carouselDesktopImage);
        }
        bannerSlider.append(carouselDesktopImage);
      }

      // Mobile Image
      const mobilePicture = mobileImageCell.querySelector('picture');
      if (mobilePicture) {
        const carouselMobileImage = document.createElement('div');
        carouselMobileImage.classList.add('carousel-image', 'carousel-mobile-image');
        const mobileImg = mobilePicture.querySelector('img');
        if (mobileImg) {
          const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
          carouselMobileImage.style.backgroundImage = `url(${optimizedMobilePic.querySelector('img').src})`;
          moveInstrumentation(mobileImageCell, carouselMobileImage);
        }
        bannerSlider.append(carouselMobileImage);
      }

      const carouselCaption = document.createElement('div');
      carouselCaption.classList.add('carousel-caption');
      const captionContent = document.createElement('div');
      captionContent.classList.add('caption-content', 'text-align', 'text-align-center');
      carouselCaption.append(captionContent);

      // Headline
      if (headlineCell && headlineCell.textContent.trim()) {
        const headline = document.createElement('h1');
        headline.classList.add('banner-title-medium');
        headline.textContent = headlineCell.textContent.trim();
        moveInstrumentation(headlineCell, headline);
        captionContent.append(headline);
      }

      // Subheadline
      if (subheadlineCell && subheadlineCell.textContent.trim()) {
        const subheadline = document.createElement('p');
        subheadline.classList.add('yellow-large');
        subheadline.textContent = subheadlineCell.textContent.trim();
        moveInstrumentation(subheadlineCell, subheadline);
        captionContent.append(subheadline);
      }

      bannerSlider.append(carouselCaption);
      swiperWrapper.append(swiperSlide); // Append to swiperWrapper
      moveInstrumentation(row, swiperSlide); // Move instrumentation from original row to swiperSlide
    });

  block.replaceChildren(sliderContainer);

  // Add Swiper navigation and pagination elements
  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination');
  sliderContainer.append(paginationEl);

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev');
  sliderContainer.append(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next');
  sliderContainer.append(nextBtn);

  // Load Swiper Carousel and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(sliderContainer, {
    slidesPerView: 1,
    loop: sliderContainer.dataset.rotation === 'True', // Use data-rotation for loop
    speed: 500,
    autoplay: {
      delay: parseInt(sliderContainer.dataset.interval, 10) || 3000, // Use data-interval for autoplaySpeed
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
