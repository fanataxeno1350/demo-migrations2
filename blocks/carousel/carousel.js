import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [arrowLeftIconRow, arrowRightIconRow, ...slideRows] = [...block.children];

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('cmp-carousel', 'panelcontainer'); // Added 'panelcontainer' from ORIGINAL HTML
  carouselWrapper.setAttribute('role', 'group');
  carouselWrapper.setAttribute('aria-live', 'polite');
  carouselWrapper.setAttribute('aria-roledescription', 'carousel');
  // Add data attributes from ORIGINAL HTML
  carouselWrapper.setAttribute('data-cmp-is', 'carousel');
  carouselWrapper.setAttribute('data-component', 'carousel');
  carouselWrapper.setAttribute('data-auto-play-is-enabled', 'false');
  carouselWrapper.setAttribute('data-show-arrows', 'true');
  carouselWrapper.setAttribute('data-show-dots', 'true');
  carouselWrapper.setAttribute('data-auto-play-speed-in-ms', '15000');
  carouselWrapper.setAttribute('data-cmp-autopause-disabled', '');
  carouselWrapper.setAttribute('data-placeholder-text', 'false');


  moveInstrumentation(block, carouselWrapper);

  const carouselContent = document.createElement('div');
  carouselContent.classList.add('cmp-carousel__content');
  carouselContent.setAttribute('aria-atomic', 'false');
  carouselContent.setAttribute('aria-live', 'polite');

  const indicators = document.createElement('ol');
  indicators.classList.add('cmp-carousel__indicators');
  indicators.setAttribute('role', 'tablist');
  indicators.setAttribute('aria-label', 'Choose a slide to display');
  indicators.style.visibility = 'visible'; // This style is present in original HTML
  indicators.setAttribute('data-cmp-hook-carousel', 'indicators'); // Added from ORIGINAL HTML

  const swiperSlidesWrapper = document.createElement('div');
  swiperSlidesWrapper.classList.add('swiper-wrapper'); // Swiper specific wrapper

  slideRows.forEach((row, index) => {
    const [imageDesktopCell, imageMobileCell, slideLinkCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'swiper-slide'); // Added 'swiper-slide'
    if (index === 0) {
      carouselItem.classList.add('cmp-carousel__item--active');
    }
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.setAttribute('aria-roledescription', 'slide');
    carouselItem.setAttribute('aria-label', `Slide ${index + 1} of ${slideRows.length}`);
    carouselItem.setAttribute('data-cmp-hook-carousel', 'item'); // Added from ORIGINAL HTML

    const teaser = document.createElement('div');
    teaser.classList.add('teaser', 'cmp-teaser--first-component');

    const cmpTeaser = document.createElement('div');
    cmpTeaser.classList.add('cmp-teaser');

    const slideLink = slideLinkCell.querySelector('a');
    let linkElement = cmpTeaser;
    if (slideLink) {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-teaser__link');
      anchor.href = slideLink.href;
      moveInstrumentation(slideLinkCell, anchor);
      linkElement = anchor;
    }

    const teaserContent = document.createElement('div');
    teaserContent.classList.add('cmp-teaser__content');
    linkElement.append(teaserContent);

    const teaserImage = document.createElement('div');
    teaserImage.classList.add('cmp-teaser__image');

    const cmpImage = document.createElement('div');
    cmpImage.classList.add('cmp-image');

    const picture = document.createElement('picture');
    const desktopImg = imageDesktopCell.querySelector('img');
    const mobileImg = imageMobileCell.querySelector('img');

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width:767px)');
      sourceMobile.setAttribute('srcset', mobileImg.src);
      picture.append(sourceMobile);
    }

    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      // createOptimizedPicture returns a <picture> element, we need its <img> child
      moveInstrumentation(desktopImg, img.querySelector('img'));
      img.querySelector('img').classList.add('cmp-image__image'); // Add class from ORIGINAL HTML
      picture.append(img.querySelector('img'));
    }

    cmpImage.append(picture);
    teaserImage.append(cmpImage);
    linkElement.append(teaserImage);
    teaser.append(linkElement);
    carouselItem.append(teaser);
    swiperSlidesWrapper.append(carouselItem); // Append to swiper-wrapper
    moveInstrumentation(row, carouselItem);

    const indicator = document.createElement('li');
    indicator.classList.add('cmp-carousel__indicator');
    if (index === 0) {
      indicator.classList.add('cmp-carousel__indicator--active');
    }
    indicators.append(indicator);
  });

  const actions = document.createElement('div');
  actions.classList.add('cmp-carousel__actions');
  actions.style.visibility = 'visible'; // This style is present in original HTML

  const prevButton = document.createElement('button');
  prevButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('data-cmp-hook-carousel', 'previous'); // Added from ORIGINAL HTML

  const prevIconSpan = document.createElement('span');
  prevIconSpan.classList.add('cmp-carousel__action-icon');
  const prevIconImg = arrowLeftIconRow.querySelector('img');
  if (prevIconImg) {
    const optimizedPrevPic = createOptimizedPicture(prevIconImg.src, prevIconImg.alt);
    moveInstrumentation(prevIconImg, optimizedPrevPic.querySelector('img'));
    prevIconSpan.append(optimizedPrevPic);
  } else {
    prevIconSpan.innerHTML = '&#x2039;'; // Left arrow
  }
  prevButton.append(prevIconSpan);
  moveInstrumentation(arrowLeftIconRow, prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('data-cmp-hook-carousel', 'next'); // Added from ORIGINAL HTML

  const nextIconSpan = document.createElement('span');
  nextIconSpan.classList.add('cmp-carousel__action-icon');
  const nextIconImg = arrowRightIconRow.querySelector('img');
  if (nextIconImg) {
    const optimizedNextPic = createOptimizedPicture(nextIconImg.src, nextIconImg.alt);
    moveInstrumentation(nextIconImg, optimizedNextPic.querySelector('img'));
    nextIconSpan.append(optimizedNextPic);
  } else {
    nextIconSpan.innerHTML = '&#x203A;'; // Right arrow
  }
  nextButton.append(nextIconSpan);
  moveInstrumentation(arrowRightIconRow, nextButton);

  actions.append(prevButton, nextButton);

  carouselContent.append(swiperSlidesWrapper); // Append swiper-wrapper to carouselContent
  carouselWrapper.append(carouselContent, actions, indicators);

  block.replaceChildren(carouselWrapper);

  // Swiper.js integration
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  const swiper = new Swiper(carouselWrapper, { // Initialize Swiper on the main carouselWrapper
    slidesPerView: 1, // Display one slide at a time
    spaceBetween: 0,
    loop: false, // Based on data-auto-play-is-enabled="false"
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: indicators,
      clickable: true,
      renderBullet: (index, className) => {
        return `<li class="${className} cmp-carousel__indicator"></li>`; // Match original indicator structure
      },
    },
    // Swiper adds these classes automatically, no need to manually add them
    // swiper-initialized, swiper-horizontal, swiper-backface-hidden
  });

  // Remove custom slide logic as Swiper handles it
  // let currentSlide = 0;
  // function showSlide(index) { ... }
  // prevButton.addEventListener('click', () => { ... });
  // nextButton.addEventListener('click', () => { ... });
  // indicators.querySelectorAll('.cmp-carousel__indicator').forEach((dot, index) => { ... });
  // showSlide(currentSlide);
}
