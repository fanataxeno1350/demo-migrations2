import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [...block.children];

  // Remove the block's own class from the inner wrapper to avoid double padding/CSS
  // The outer block div already has 'yippee-banner' from AEM.
  // The original HTML shows 'cmp-yippee-banner--content-second-half-left-aligned' as the first inner wrapper.
  const contentSecondHalf = document.createElement('div');
  contentSecondHalf.classList.add('cmp-yippee-banner--content-second-half-left-aligned');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('cmp-carousel', 'cmp-carousel__container', 'swiper'); // Add 'swiper' class for Swiper.js

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('slick-track', 'swiper-wrapper'); // Use 'slick-track' from original HTML for wrapper, add 'swiper-wrapper'

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'swiper-button-prev'); // Add Swiper navigation class
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow', 'swiper-button-next'); // Add Swiper navigation class
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.textContent = 'Next';

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('slick-dots', 'swiper-pagination'); // Use 'slick-dots' from original HTML, add 'swiper-pagination'
  swiperPagination.setAttribute('role', 'tablist');

  slides.forEach((slideRow, index) => {
    const [backgroundImageCell, mainImageCell, playIconCell, titleCell, descriptionCell] = [...slideRow.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide', 'swiper-slide'); // Add 'swiper-slide'
    carouselItem.setAttribute('data-slick-index', index);
    carouselItem.setAttribute('aria-hidden', index !== 0);
    carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.id = `slick-slide2${index}`;
    carouselItem.setAttribute('aria-describedby', `slick-slide-control2${index}`);

    const yippeeBannerItem = document.createElement('div');
    yippeeBannerItem.classList.add('cmp-yippee-banner__item');
    const bgPicture = backgroundImageCell?.querySelector('picture');
    if (bgPicture) {
      const bgImg = bgPicture.querySelector('img');
      if (bgImg) {
        yippeeBannerItem.style.backgroundImage = `url("${bgImg.src}")`;
        const optimizedPic = createOptimizedPicture(bgImg.src, bgImg.alt, false, [{ width: '2000' }]);
        moveInstrumentation(bgImg, optimizedPic.querySelector('img'));
        bgPicture.replaceWith(optimizedPic);
      }
    }

    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('cmp-yippee-banner__item-wrapper');

    const itemImage = document.createElement('div');
    itemImage.classList.add('cmp-yippee-banner__item-image');

    const mainImageContainer = document.createElement('div');
    mainImageContainer.classList.add('lazy-image-container');
    const mainPicture = mainImageCell?.querySelector('picture');
    if (mainPicture) {
      const mainImg = mainPicture.querySelector('img');
      if (mainImg) {
        mainImg.classList.add('cmp-yippee-banner__item-image-img', 'lazy-image', 'loaded');
        const optimizedPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(mainImg, optimizedPic.querySelector('img'));
        mainPicture.replaceWith(optimizedPic);
        mainImageContainer.append(optimizedPic);
      }
    }

    const playIconContainer = document.createElement('div');
    playIconContainer.classList.add('lazy-image-container');
    const playPicture = playIconCell?.querySelector('picture');
    if (playPicture) {
      const playImg = playPicture.querySelector('img');
      if (playImg) {
        playImg.classList.add('play-icon', 'lazy-image', 'loaded');
        const optimizedPic = createOptimizedPicture(playImg.src, playImg.alt, false, [{ width: '50' }]);
        moveInstrumentation(playImg, optimizedPic.querySelector('img'));
        playPicture.replaceWith(optimizedPic);
        playIconContainer.append(optimizedPic);
      }
    }

    itemImage.append(mainImageContainer, playIconContainer);

    const itemInfo = document.createElement('div');
    itemInfo.classList.add('cmp-yippee-banner__item-info');

    const titleElement = document.createElement('h1');
    titleElement.classList.add('cmp-yippee-banner__item-title');
    titleElement.textContent = titleCell?.textContent.trim() || '';

    const descriptionElement = document.createElement('p');
    descriptionElement.classList.add('cmp-yippee-banner__item-desc', 'body-2');
    descriptionElement.textContent = descriptionCell?.textContent.trim() || '';

    itemInfo.append(titleElement, descriptionElement);
    itemWrapper.append(itemImage, itemInfo);
    yippeeBannerItem.append(itemWrapper);
    carouselItem.append(yippeeBannerItem);
    swiperWrapper.append(carouselItem);

    moveInstrumentation(slideRow, carouselItem);
  });

  swiperContainer.append(swiperWrapper, prevButton, nextButton, swiperPagination);
  contentSecondHalf.append(swiperContainer);
  block.replaceChildren(contentSecondHalf);

  // Load Swiper Carousel and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 1,
    loop: false, // Original HTML data-infinite-scroll="false"
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: swiperPagination,
      clickable: true,
      renderBullet: function (index, className) {
        return `<button type="button" role="tab" class="${className}" id="slick-slide-control2${index}" aria-controls="slick-slide2${index}" aria-label="${index + 1} of ${slides.length}" tabindex="${index === 0 ? '0' : '-1'}" aria-selected="${index === 0}">${index + 1}</button>`;
      },
    },
    // Swiper adds these classes automatically, no need to add them manually:
    // swiper-initialized, swiper-horizontal, swiper-backface-hidden
  });
}
