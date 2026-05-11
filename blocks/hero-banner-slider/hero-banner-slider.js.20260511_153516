import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  // The first row is the container placeholder for 'slides'
  // We need to consume it and move its instrumentation
  const containerRow = allRows.shift();
  const sliderWrapper = document.createElement('div');
  moveInstrumentation(containerRow, sliderWrapper);

  sliderWrapper.classList.add('regular', 'slider', 'hero_banner_height_70');
  sliderWrapper.setAttribute('data-rotation', 'False'); // From original HTML
  sliderWrapper.setAttribute('data-interval', '3000'); // From original HTML
  sliderWrapper.setAttribute('role', 'region');
  sliderWrapper.setAttribute('aria-roledescription', 'carousel');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  sliderWrapper.append(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.append(slickTrack);

  allRows.forEach((row, index) => {
    const [videoCell, desktopImageCell, mobileImageCell, headlineCell, subheadlineCell] = [...row.children];

    const slickSlide = document.createElement('div');
    slickSlide.classList.add('slick-slide');
    // Swiper adds slick-current and slick-active automatically
    slickSlide.setAttribute('data-slick-index', index);
    slickSlide.setAttribute('role', 'group');
    slickSlide.setAttribute('aria-roledescription', 'slide');
    moveInstrumentation(row, slickSlide);

    const bannerSlider = document.createElement('div');
    bannerSlider.classList.add('banner-slider', 'hero_banner_height_70');
    slickSlide.append(bannerSlider);

    // Background Video
    const videoLink = videoCell?.querySelector('a');
    const videoPicture = videoCell?.querySelector('picture');

    if (videoLink && /\.(mp4|webm|ogg|mov)$/i.test(videoLink.href)) {
      const videoWrapper = document.createElement('div');
      videoWrapper.classList.add('carousel-video');
      const video = document.createElement('video');
      video.playsInline = true;
      video.preload = 'auto';
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.src = videoLink.href;
      videoWrapper.append(video);
      bannerSlider.append(videoWrapper);
    } else if (videoPicture) {
      // If it's not a video link, but a picture element is present
      const videoWrapper = document.createElement('div');
      videoWrapper.classList.add('carousel-video'); // Still use video class for consistency
      const img = videoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        videoWrapper.append(optimizedPic);
      }
      bannerSlider.append(videoWrapper);
    }


    // Desktop Background Image
    const desktopImageWrapper = document.createElement('div');
    desktopImageWrapper.classList.add('carousel-image', 'carousel-desktop-image');
    const desktopPicture = desktopImageCell?.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        desktopImageWrapper.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
      }
    }
    bannerSlider.append(desktopImageWrapper);

    // Mobile Background Image
    const mobileImageWrapper = document.createElement('div');
    mobileImageWrapper.classList.add('carousel-image', 'carousel-mobile-image');
    const mobilePicture = mobileImageCell?.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        mobileImageWrapper.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
      }
    }
    bannerSlider.append(mobileImageWrapper);

    // Caption
    const carouselCaption = document.createElement('div');
    carouselCaption.classList.add('carousel-caption');
    const captionContent = document.createElement('div');
    captionContent.classList.add('caption-content', 'text-align', 'text-align-center');

    if (headlineCell?.textContent.trim()) {
      const headline = document.createElement('h1');
      headline.classList.add('banner-title-medium');
      headline.textContent = headlineCell.textContent.trim();
      captionContent.append(headline);
    }

    if (subheadlineCell?.textContent.trim()) {
      const subheadline = document.createElement('p');
      subheadline.classList.add('yellow-large');
      subheadline.textContent = subheadlineCell.textContent.trim();
      captionContent.append(subheadline);
    }

    carouselCaption.append(captionContent);
    bannerSlider.append(carouselCaption);
    slickTrack.append(slickSlide);
  });

  const section = document.createElement('section');
  section.classList.add('component-custom-slick-slider');
  section.append(sliderWrapper);

  block.replaceChildren(section);

  // Swiper.js initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Create navigation and pagination elements for Swiper
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-button-prev');
  sliderWrapper.append(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-button-next');
  sliderWrapper.append(nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination');
  sliderWrapper.append(paginationEl);

  // eslint-disable-next-line no-undef
  new Swiper(sliderWrapper, {
    slidesPerView: 'auto',
    loop: sliderWrapper.dataset.rotation === 'True', // Use data-rotation for loop
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    autoplay: {
      delay: parseInt(sliderWrapper.dataset.interval, 10) || 3000,
      disableOnInteraction: false,
    },
  });
}
