import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    backgroundImageRow,
    titleRow,
    subtitleRow,
    swipeIconRow,
    cookieImageRow,
    morningImageRow,
    morningLabelRow,
  ] = [...block.children];

  const productSwiper = document.createElement('div');
  productSwiper.classList.add('cmp-product-swiper');
  // moveInstrumentation should be called on the block itself, not the new wrapper
  // The block element already has instrumentation. We move its children's instrumentation.
  // The block.replaceChildren(productSwiper) at the end handles the root instrumentation.

  // Background Image
  const backgroundImage = backgroundImageRow.querySelector('picture');
  if (backgroundImage) {
    const img = backgroundImage.querySelector('img');
    if (img) {
      productSwiper.style.backgroundImage = `url("${img.src}")`;
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      backgroundImage.replaceWith(optimizedPic);
    }
  }

  // Main Title
  const title = document.createElement('h2');
  title.classList.add('cmp-product-swiper__title');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  productSwiper.append(title);

  const sectionContainer = document.createElement('div');
  sectionContainer.classList.add('cmp-product-swiper__section-container');

  const section1 = document.createElement('div');
  section1.classList.add('cmp-product-swiper__section1');

  // Subtitle
  const subtitle = document.createElement('h5');
  subtitle.classList.add('cmp-product-swiper__sub-title', 'body-1');
  moveInstrumentation(subtitleRow, subtitle);
  subtitle.textContent = subtitleRow.textContent.trim();
  section1.append(subtitle);

  // Swipe Icon
  const swipeIconContainer = document.createElement('div');
  swipeIconContainer.classList.add('lazy-image-container');
  const swipeIconPicture = swipeIconRow.querySelector('picture');
  if (swipeIconPicture) {
    const swipeIconImg = swipeIconPicture.querySelector('img');
    if (swipeIconImg) {
      swipeIconImg.classList.add('cmp-product-swiper__swipe-icon', 'lazy-image', 'loaded');
      const optimizedSwipeIcon = createOptimizedPicture(swipeIconImg.src, swipeIconImg.alt, false, [{ width: '100' }]);
      moveInstrumentation(swipeIconImg, optimizedSwipeIcon.querySelector('img'));
      swipeIconContainer.append(optimizedSwipeIcon);
    }
  }
  moveInstrumentation(swipeIconRow, swipeIconContainer);
  section1.append(swipeIconContainer);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('cmp-product-swiper__swiper-container');

  const sunIcon = document.createElement('span');
  sunIcon.classList.add('cmp-product-swiper__sun-icon');
  swiperContainer.append(sunIcon);

  const sliderDiv = document.createElement('div');
  sliderDiv.classList.add('cmp-product-swiper__slider');

  const rangeSlider = document.createElement('input');
  rangeSlider.classList.add('cmp-product-swiper__range-slider', 'morning');
  rangeSlider.setAttribute('min', '0');
  rangeSlider.setAttribute('max', '2');
  rangeSlider.setAttribute('type', 'range');
  rangeSlider.setAttribute('value', '0');
  sliderDiv.append(rangeSlider);

  const sliderIcon = document.createElement('div');
  sliderIcon.classList.add('cmp-product-swiper__slider-icon');
  sliderDiv.append(sliderIcon);

  swiperContainer.append(sliderDiv);

  const selectedMorning = document.createElement('span');
  selectedMorning.classList.add('cmp-product-swiper__selected-morning');
  swiperContainer.append(selectedMorning);

  const moonIcon = document.createElement('span');
  moonIcon.classList.add('cmp-product-swiper__moon-icon');
  swiperContainer.append(moonIcon);

  section1.append(swiperContainer);

  // Cookie Image
  const cookieImageContainer = document.createElement('div');
  cookieImageContainer.classList.add('lazy-image-container');
  const cookieImagePicture = cookieImageRow.querySelector('picture');
  if (cookieImagePicture) {
    const cookieImageImg = cookieImagePicture.querySelector('img');
    if (cookieImageImg) {
      cookieImageImg.classList.add('cmp-product-swiper__cookie-img', 'lazy-image', 'loaded');
      const optimizedCookieImage = createOptimizedPicture(cookieImageImg.src, cookieImageImg.alt, false, [{ width: '500' }]);
      moveInstrumentation(cookieImageImg, optimizedCookieImage.querySelector('img'));
      cookieImageContainer.append(optimizedCookieImage);
    }
  }
  moveInstrumentation(cookieImageRow, cookieImageContainer);
  section1.append(cookieImageContainer);

  sectionContainer.append(section1);

  const section2 = document.createElement('div');
  section2.classList.add('cmp-product-swiper__section2');

  // Morning Image
  const morningImageContainer = document.createElement('div');
  morningImageContainer.classList.add('lazy-image-container');
  const morningImagePicture = morningImageRow.querySelector('picture');
  if (morningImagePicture) {
    const morningImageImg = morningImagePicture.querySelector('img');
    if (morningImageImg) {
      morningImageImg.classList.add('lazy-image', 'loaded');
      const optimizedMorningImage = createOptimizedPicture(morningImageImg.src, morningImageImg.alt, false, [{ width: '500' }]);
      moveInstrumentation(morningImageImg, optimizedMorningImage.querySelector('img'));
      morningImageContainer.append(optimizedMorningImage);
    }
  }
  moveInstrumentation(morningImageRow, morningImageContainer);
  section2.append(morningImageContainer);

  // Morning Label
  const morningLabel = document.createElement('p');
  morningLabel.classList.add('body-3');
  moveInstrumentation(morningLabelRow, morningLabel);
  morningLabel.textContent = morningLabelRow.textContent.trim();
  section2.append(morningLabel);

  sectionContainer.append(section2);
  productSwiper.append(sectionContainer);

  block.replaceChildren(productSwiper);

  // Load Swiper assets
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Add event listener for the range slider
  rangeSlider.addEventListener('input', () => {
    const value = parseInt(rangeSlider.value, 10);
    if (value === 0) {
      section1.style.display = 'block';
      section2.style.display = 'none';
      sliderIcon.style.transform = 'translateX(0)';
    } else if (value === 1) {
      section1.style.display = 'none';
      section2.style.display = 'block';
      sliderIcon.style.transform = 'translateX(100%)';
    } else if (value === 2) {
      section1.style.display = 'none';
      section2.style.display = 'block';
      sliderIcon.style.transform = 'translateX(200%)';
    }
  });

  // Initial state
  section2.style.display = 'none';

  // Initialize Swiper (if needed, based on the block's actual use of Swiper)
  // The original HTML shows a slider input, not a full Swiper carousel.
  // If this is meant to be a Swiper, the structure needs to be adjusted to include
  // swiper-wrapper and swiper-slide classes.
  // Based on the provided HTML, it's a custom range slider, not Swiper.js.
  // Removing Swiper initialization as it's not used.
}
