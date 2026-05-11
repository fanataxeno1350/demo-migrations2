import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slideRows = [...block.children];

  const section = document.createElement('section');
  section.classList.add('component-custom-slick-slider');

  const slider = document.createElement('div');
  slider.classList.add('regular', 'slider', 'hero_banner_height_70');
  slider.setAttribute('role', 'region');
  slider.setAttribute('aria-roledescription', 'carousel');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('slick-list', 'draggable', 'swiper-wrapper'); // Added swiper-wrapper

  slideRows.forEach((row) => {
    const [videoCell, desktopImageCell, mobileImageCell, headlineCell, descriptionCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('slick-slide', 'swiper-slide'); // Added swiper-slide
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-roledescription', 'slide');

    const bannerSlider = document.createElement('div');
    bannerSlider.classList.add('banner-slider', 'hero_banner_height_70');

    const videoElement = videoCell.querySelector('picture');
    if (videoElement) {
      const videoLink = videoElement.querySelector('img');
      if (videoLink && /\.(mp4|webm|ogg|mov)$/i.test(videoLink.src)) {
        const videoDiv = document.createElement('div');
        videoDiv.classList.add('carousel-video');
        const video = document.createElement('video');
        video.src = videoLink.src;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        videoDiv.append(video);
        bannerSlider.append(videoDiv);
        moveInstrumentation(videoCell, videoDiv);
      }
    }

    const desktopImage = desktopImageCell.querySelector('picture');
    if (desktopImage) {
      const desktopImageDiv = document.createElement('div');
      desktopImageDiv.classList.add('carousel-image', 'carousel-desktop-image');
      const optimizedPic = createOptimizedPicture(desktopImage.querySelector('img').src, desktopImage.querySelector('img').alt, false, [{ width: '2000' }]);
      moveInstrumentation(desktopImageCell, optimizedPic.querySelector('img'));
      desktopImageDiv.append(optimizedPic);
      bannerSlider.append(desktopImageDiv);
    }

    const mobileImage = mobileImageCell.querySelector('picture');
    if (mobileImage) {
      const mobileImageDiv = document.createElement('div');
      mobileImageDiv.classList.add('carousel-image', 'carousel-mobile-image');
      const optimizedPic = createOptimizedPicture(mobileImage.querySelector('img').src, mobileImage.querySelector('img').alt, false, [{ width: '750' }]);
      moveInstrumentation(mobileImageCell, optimizedPic.querySelector('img'));
      mobileImageDiv.append(optimizedPic);
      bannerSlider.append(mobileImageDiv);
    }

    const carouselCaption = document.createElement('div');
    carouselCaption.classList.add('carousel-caption');

    const captionContent = document.createElement('div');
    captionContent.classList.add('caption-content', 'text-align', 'text-align-center');

    if (headlineCell && headlineCell.textContent.trim()) {
      const headline = document.createElement('h1');
      headline.classList.add('banner-title-medium');
      headline.textContent = headlineCell.textContent.trim();
      captionContent.append(headline);
      moveInstrumentation(headlineCell, headline);
    }

    if (descriptionCell && descriptionCell.textContent.trim()) {
      const description = document.createElement('p');
      description.classList.add('yellow-large');
      description.textContent = descriptionCell.textContent.trim();
      captionContent.append(description);
      moveInstrumentation(descriptionCell, description);
    }

    carouselCaption.append(captionContent);
    bannerSlider.append(carouselCaption);

    swiperSlide.append(bannerSlider);
    swiperWrapper.append(swiperSlide);
    moveInstrumentation(row, swiperSlide);
  });

  slider.append(swiperWrapper);
  section.append(slider);
  block.replaceChildren(section);

  // Swiper.js initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Add navigation and pagination elements
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev');
  slider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next');
  slider.append(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination');
  slider.append(pagination);

  // eslint-disable-next-line no-undef
  new Swiper(slider, {
    slidesPerView: 'auto',
    loop: slider.dataset.rotation === 'True', // Use data-rotation for loop
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
    autoplay: {
      delay: parseInt(slider.dataset.interval, 10) || 3000, // Use data-interval for autoplay delay
      disableOnInteraction: false,
    },
  });
}
