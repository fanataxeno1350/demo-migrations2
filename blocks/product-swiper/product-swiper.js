import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageRow,
    titleRow,
    subTitleRow,
    swipeIconRow,
    cookieImageRow,
    morningImageRow,
    morningLabelRow,
  ] = [...block.children];

  const cmpProductSwiper = document.createElement('div');
  cmpProductSwiper.classList.add('cmp-product-swiper');
  // The block itself already has the 'product-swiper' class from AEM.
  // The inner wrapper should not duplicate the block's own class.
  // The original HTML shows 'cmp-product-swiper' on the inner div, so we keep it.
  moveInstrumentation(block, cmpProductSwiper);

  // Background Image
  const backgroundImagePicture = backgroundImageRow.querySelector('picture');
  if (backgroundImagePicture) {
    const img = backgroundImagePicture.querySelector('img');
    if (img) {
      cmpProductSwiper.style.backgroundImage = `url("${img.src}")`;
      // Optimize the background image, but don't replace the picture element itself
      // The optimized image is not directly appended, so its instrumentation doesn't need to be moved.
      // The instrumentation for the background image is implicitly handled by the parent row/cell.
      createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    }
  }

  // Title
  const title = document.createElement('h2');
  title.classList.add('cmp-product-swiper__title');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  cmpProductSwiper.append(title);

  const sectionContainer = document.createElement('div');
  sectionContainer.classList.add('cmp-product-swiper__section-container');

  const section1 = document.createElement('div');
  section1.classList.add('cmp-product-swiper__section1');

  // Sub Title
  const subTitle = document.createElement('h5');
  subTitle.classList.add('cmp-product-swiper__sub-title', 'body-1');
  moveInstrumentation(subTitleRow, subTitle);
  subTitle.textContent = subTitleRow.textContent.trim();
  section1.append(subTitle);

  // Swipe Icon
  const swipeIconContainer = document.createElement('div');
  swipeIconContainer.classList.add('lazy-image-container');
  const swipeIconPicture = swipeIconRow.querySelector('picture');
  if (swipeIconPicture) {
    const swipeIconImg = swipeIconPicture.querySelector('img');
    if (swipeIconImg) {
      const optimizedSwipeIcon = createOptimizedPicture(swipeIconImg.src, swipeIconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(swipeIconImg.closest('picture'), optimizedSwipeIcon);
      optimizedSwipeIcon.classList.add('cmp-product-swiper__swipe-icon', 'lazy-image', 'loaded');
      swipeIconContainer.append(optimizedSwipeIcon);
    }
  }
  section1.append(swipeIconContainer);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('cmp-product-swiper__swiper-container');

  const sunIcon = document.createElement('span');
  sunIcon.classList.add('cmp-product-swiper__sun-icon');
  swiperContainer.append(sunIcon);

  const slider = document.createElement('div');
  slider.classList.add('cmp-product-swiper__slider');

  const rangeSlider = document.createElement('input');
  rangeSlider.classList.add('cmp-product-swiper__range-slider', 'morning');
  rangeSlider.setAttribute('min', '0');
  rangeSlider.setAttribute('max', '2');
  rangeSlider.setAttribute('type', 'range');
  rangeSlider.setAttribute('value', '0');
  slider.append(rangeSlider);

  const sliderIcon = document.createElement('div');
  sliderIcon.classList.add('cmp-product-swiper__slider-icon');
  slider.append(sliderIcon);
  swiperContainer.append(slider);

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
      const optimizedCookieImage = createOptimizedPicture(cookieImageImg.src, cookieImageImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(cookieImageImg.closest('picture'), optimizedCookieImage);
      optimizedCookieImage.classList.add('cmp-product-swiper__cookie-img', 'lazy-image', 'loaded');
      cookieImageContainer.append(optimizedCookieImage);
    }
  }
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
      const optimizedMorningImage = createOptimizedPicture(morningImageImg.src, morningImageImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(morningImageImg.closest('picture'), optimizedMorningImage);
      // The original HTML for the morning image does not have a specific class on the img itself,
      // only 'lazy-image' and 'loaded' which are generic.
      optimizedMorningImage.classList.add('lazy-image', 'loaded');
      morningImageContainer.append(optimizedMorningImage);
    }
  }
  section2.append(morningImageContainer);

  // Morning Label
  const morningLabel = document.createElement('p');
  morningLabel.classList.add('body-3');
  moveInstrumentation(morningLabelRow, morningLabel);
  morningLabel.textContent = morningLabelRow.textContent.trim();
  section2.append(morningLabel);
  sectionContainer.append(section2);

  cmpProductSwiper.append(sectionContainer);

  // Add event listener for the range slider
  rangeSlider.addEventListener('input', () => {
    // Implement slider logic here based on the original site's behavior
    // For example, update the selectedMorning text or change image visibility
    const sliderValue = parseInt(rangeSlider.value, 10);
    if (sliderValue === 0) {
      selectedMorning.textContent = 'Morning Kickstarter'; // Example text
      // Potentially show morning image, hide cookie image
    } else if (sliderValue === 1) {
      selectedMorning.textContent = 'Mid-day Treat'; // Example text
      // Potentially show a different image or blend
    } else if (sliderValue === 2) {
      selectedMorning.textContent = 'Evening Indulgence'; // Example text
      // Potentially show cookie image, hide morning image
    }
    // Update slider icon position
    const min = parseInt(rangeSlider.min, 10);
    const max = parseInt(rangeSlider.max, 10);
    const val = parseInt(rangeSlider.value, 10);
    const percent = ((val - min) / (max - min)) * 100;
    sliderIcon.style.left = `calc(${percent}% - 12px)`; // Adjust 12px for icon width
  });

  // Initialize slider icon position
  const min = parseInt(rangeSlider.min, 10);
  const max = parseInt(rangeSlider.max, 10);
  const val = parseInt(rangeSlider.value, 10);
  const percent = ((val - min) / (max - min)) * 100;
  sliderIcon.style.left = `calc(${percent}% - 12px)`;

  block.replaceChildren(cmpProductSwiper);
}
