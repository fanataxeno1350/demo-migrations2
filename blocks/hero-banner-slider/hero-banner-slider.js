import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const root = document.createElement('div');
  root.classList.add('regular', 'slider', 'hero_banner_height_70'); // Removed 'slick-initialized', 'slick-slider'
  root.setAttribute('data-rotation', 'False');
  root.setAttribute('data-interval', '3000');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-roledescription', 'carousel');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  const slides = [...block.children];
  slides.forEach((slideRow, index) => {
    const [videoCell, desktopImageCell, mobileImageCell, titleCell, subtitleCell] = [...slideRow.children];

    const slickSlide = document.createElement('div');
    slickSlide.classList.add('slick-slide');
    if (index === 0) {
      slickSlide.classList.add('slick-current', 'slick-active');
    }
    slickSlide.setAttribute('data-slick-index', index);
    slickSlide.setAttribute('role', 'group');
    slickSlide.setAttribute('aria-roledescription', 'slide');

    const bannerSlider = document.createElement('div');
    bannerSlider.classList.add('banner-slider', 'hero_banner_height_70');

    // Video
    const videoLink = videoCell.querySelector('a');
    if (videoLink && /\.(mp4|webm|ogg|mov)$/i.test(videoLink.href)) {
      const carouselVideo = document.createElement('div');
      carouselVideo.classList.add('carousel-video');
      const video = document.createElement('video');
      video.src = videoLink.href;
      video.playsInline = true;
      video.preload = 'auto';
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      carouselVideo.append(video);
      bannerSlider.append(carouselVideo);
      moveInstrumentation(videoCell, carouselVideo);
    } else {
      // If no video link, check for picture/img
      const videoPicture = videoCell.querySelector('picture');
      if (videoPicture) {
        const carouselVideo = document.createElement('div');
        carouselVideo.classList.add('carousel-video');
        carouselVideo.append(videoPicture);
        bannerSlider.append(carouselVideo);
        moveInstrumentation(videoCell, carouselVideo);
      }
    }

    // Desktop Image
    const desktopImagePicture = desktopImageCell.querySelector('picture');
    const carouselDesktopImage = document.createElement('div');
    carouselDesktopImage.classList.add('carousel-image', 'carousel-desktop-image');
    if (desktopImagePicture) {
      const img = desktopImagePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
        // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation should be on the cell, not the img
        carouselDesktopImage.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
        // desktopImagePicture.replaceWith(optimizedPic); // No need to replace, just get the src
      }
    }
    bannerSlider.append(carouselDesktopImage);
    moveInstrumentation(desktopImageCell, carouselDesktopImage);

    // Mobile Image
    const mobileImagePicture = mobileImageCell.querySelector('picture');
    const carouselMobileImage = document.createElement('div');
    carouselMobileImage.classList.add('carousel-image', 'carousel-mobile-image');
    if (mobileImagePicture) {
      const img = mobileImagePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '768' }]);
        // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation should be on the cell, not the img
        carouselMobileImage.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
        // mobileImagePicture.replaceWith(optimizedPic); // No need to replace, just get the src
      }
    }
    bannerSlider.append(carouselMobileImage);
    moveInstrumentation(mobileImageCell, carouselMobileImage);

    // Caption
    const carouselCaption = document.createElement('div');
    carouselCaption.classList.add('carousel-caption');

    const captionContent = document.createElement('div');
    captionContent.classList.add('caption-content', 'text-align', 'text-align-center');

    const title = document.createElement('h1');
    title.classList.add('banner-title-medium');
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, title);

    const subtitle = document.createElement('p');
    subtitle.classList.add('yellow-large');
    subtitle.textContent = subtitleCell.textContent.trim();
    moveInstrumentation(subtitleCell, subtitle);

    captionContent.append(title, subtitle);
    carouselCaption.append(captionContent);
    bannerSlider.append(carouselCaption);

    slickSlide.append(bannerSlider);
    slickTrack.append(slickSlide);
    moveInstrumentation(slideRow, slickSlide);
  });

  slickList.append(slickTrack);
  root.append(slickList);

  const section = document.createElement('section');
  section.classList.add('component-custom-slick-slider');
  section.append(root); // Append the root element (which is the actual swiper container)

  block.replaceChildren(section);

  // Swiper.js initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  const swiperEl = root; // The element with 'regular', 'slider' classes
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 1, // Assuming one slide visible at a time
    loop: swiperEl.dataset.rotation === 'True', // Use data-rotation for loop
    autoplay: {
      delay: parseInt(swiperEl.dataset.interval, 10) || 3000,
      disableOnInteraction: false,
    },
    // Add navigation and pagination if they are part of the original HTML and need to be created
    // For this block, the original HTML doesn't show explicit nav/pagination buttons,
    // so we'll omit them unless they are implicitly handled by the slick-track structure
    // If navigation/pagination elements were present in original HTML, they would be created here
    // navigation: {
    //   nextEl: '.swiper-button-next', // Example selector, replace with actual element
    //   prevEl: '.swiper-button-prev', // Example selector, replace with actual element
    // },
    // pagination: {
    //   el: '.swiper-pagination', // Example selector, replace with actual element
    //   clickable: true,
    // },
  });
}
