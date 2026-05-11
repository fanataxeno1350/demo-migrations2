import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    bgImageRow,
    headingRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
    guideTextRow,
    errorMessageRow,
    ...restRows
  ] = [...block.children];

  const slideRows = [];

  // Separate slide and option rows based on their structure
  let currentSlideOptions = [];
  restRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) { // This is a slide row (questionLabel)
      slideRows.push({ row, options: [] });
      currentSlideOptions = slideRows[slideRows.length - 1].options;
    } else if (cells.length === 2) { // This is an option row (optionIcon, optionLabel)
      currentSlideOptions.push(row);
    }
  });

  const root = document.createElement('section');
  root.classList.add('grid-container', 'coffee-profiler', 'animate-enter', 'in-view');
  if (block.dataset.apiUrl) {
    root.setAttribute('data-api-url', block.dataset.apiUrl);
  }

  // Background Image
  const parallaxBgImgContainer = document.createElement('div');
  parallaxBgImgContainer.classList.add('parallax-bg-img-container');
  const parallaxImg = document.createElement('div');
  parallaxImg.classList.add('parallax-img', 'lazyLoadedImage');
  const bgPicture = bgImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) {
      parallaxImg.style.backgroundImage = `url('${img.src}')`;
      moveInstrumentation(bgImageRow, parallaxImg);
    }
  }
  parallaxBgImgContainer.append(parallaxImg);
  root.append(parallaxBgImgContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container', 'grid-x');

  const contentCell = document.createElement('div');
  contentCell.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'padding-x');

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'animate-enter-fade-up-short', 'animate-delay-3');
  heading.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, heading);
  contentCell.append(heading);

  const introInfo = document.createElement('div');
  introInfo.classList.add('intro-info', 'animate-enter-fade', 'animate-delay-1', 'no-avatar-image');

  // Greetings Container
  const greetingsContainer = document.createElement('div');
  greetingsContainer.classList.add('greetings-container', 'headline-h4', 'animate-enter-fade-up-short', 'animate-delay-3', 'stagger-1');

  const greetingMorning = document.createElement('span');
  greetingMorning.classList.add('greeting--morning');
  greetingMorning.textContent = greetingMorningRow.textContent.trim();
  moveInstrumentation(greetingMorningRow, greetingMorning);
  greetingsContainer.append(greetingMorning);

  const greetingAfternoon = document.createElement('span');
  greetingAfternoon.classList.add('hide', 'greeting--afternoon');
  greetingAfternoon.textContent = greetingAfternoonRow.textContent.trim();
  moveInstrumentation(greetingAfternoonRow, greetingAfternoon);
  greetingsContainer.append(greetingAfternoon);

  const greetingEvening = document.createElement('span');
  greetingEvening.classList.add('hide', 'greeting--evening');
  greetingEvening.textContent = greetingEveningRow.textContent.trim();
  moveInstrumentation(greetingEveningRow, greetingEvening);
  greetingsContainer.append(greetingEvening);

  const greetingNight = document.createElement('span');
  greetingNight.classList.add('hide', 'greeting--night');
  greetingNight.textContent = greetingNightRow.textContent.trim();
  moveInstrumentation(greetingNightRow, greetingNight);
  greetingsContainer.append(greetingNight);

  introInfo.append(greetingsContainer);

  // Guide Text
  const guideText = document.createElement('div');
  guideText.classList.add('guide-text', 'labelMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-6');
  guideText.textContent = guideTextRow.textContent.trim();
  moveInstrumentation(guideTextRow, guideText);
  introInfo.append(guideText);

  contentCell.append(introInfo);
  maxWidthContainer.append(contentCell);

  // Swiper Pagination Container
  const swiperPaginationContainer = document.createElement('div');
  swiperPaginationContainer.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'swiper-pagination-container', 'padding-x', 'animate-enter-fade-up-short', 'animate-delay-15');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-progressbar', 'swiper-pagination-horizontal');
  const swiperPaginationFill = document.createElement('span');
  swiperPaginationFill.classList.add('swiper-pagination-progressbar-fill');
  swiperPagination.append(swiperPaginationFill);
  swiperPaginationContainer.append(swiperPagination);
  maxWidthContainer.append(swiperPaginationContainer);

  // Swiper Container
  const swiperCell = document.createElement('div');
  swiperCell.classList.add('cell', 'small-12');
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'coffee-profiler-swiper');
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  // Move instrumentation for the slides container (the first slideRow's original row)
  // The original JS had `slidesContainer` which was undefined.
  // We apply instrumentation to the swiperEl itself, as it's the main container for the slides.
  // If there was a specific "slides container" row in the block, it would be handled here.
  // Given the structure, `restRows` are the actual slide/option rows, not a single container.
  // So, instrumentation is moved from individual slide rows.

  slideRows.forEach((slideItem, index) => {
    const slideRow = slideItem.row;
    const options = slideItem.options;
    const [questionLabelCell] = [...slideRow.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    if (index === 0) {
      swiperSlide.classList.add('initial-slide', 'swiper-slide-active');
    }
    if (index === slideRows.length - 1) {
      swiperSlide.classList.add('last-slide');
    }
    swiperSlide.setAttribute('data-slide-index', index);
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slideRows.length}`);

    const coffeeProfilerSlide = document.createElement('div');
    coffeeProfilerSlide.classList.add('coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');
    moveInstrumentation(slideRow, coffeeProfilerSlide);

    const questionLabel = document.createElement('h3');
    questionLabel.classList.add('question-label');
    questionLabel.textContent = questionLabelCell.textContent.trim();
    coffeeProfilerSlide.append(questionLabel);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container', `options-count--${options.length}`);

    options.forEach((optionRow) => {
      const [optionIconCell, optionLabelCell] = [...optionRow.children];

      const optionButton = document.createElement('button');
      optionButton.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
      optionButton.setAttribute('role', 'radio');
      optionButton.setAttribute('aria-checked', 'false');
      moveInstrumentation(optionRow, optionButton);

      const optionIconPicture = optionIconCell.querySelector('picture');
      if (optionIconPicture) {
        const optionIconImg = optionIconPicture.querySelector('img');
        if (optionIconImg) {
          const optimizedPic = createOptimizedPicture(optionIconImg.src, optionIconImg.alt, false, [{ width: '750' }]);
          const newImg = optimizedPic.querySelector('img');
          newImg.classList.add('option-icon', 'lazyloaded');
          optionButton.append(optimizedPic);
        }
      }

      const optionLabel = document.createElement('span');
      optionLabel.classList.add('option-label', 'labelMediumRegular');
      optionLabel.textContent = optionLabelCell.textContent.trim();
      optionButton.append(optionLabel);
      optionsContainer.append(optionButton);
    });

    coffeeProfilerSlide.append(optionsContainer);
    swiperSlide.append(coffeeProfilerSlide);
    swiperWrapper.append(swiperSlide);
  });

  swiperEl.append(swiperWrapper);

  // Swiper Controls
  const swiperControls = document.createElement('div');
  swiperControls.classList.add('swiper-controls', 'animate-enter-fade', 'animate-delay-15');

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper-control--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-15', 'swiper-button-disabled');
  prevBtn.setAttribute('disabled', '');
  prevBtn.setAttribute('tabindex', '-1');
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.setAttribute('aria-disabled', 'true');
  prevBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  swiperControls.append(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-control', 'swiper-button', 'swiper-control--next', 'elevation-1', 'animate-enter-fade-left-short', 'animate-delay-15');
  nextBtn.setAttribute('tabindex', '0');
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.setAttribute('disabled', '');
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  swiperControls.append(nextBtn);

  swiperEl.append(swiperControls);
  swiperCell.append(swiperEl);
  maxWidthContainer.append(swiperCell);
  root.append(maxWidthContainer);

  // Error Message
  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.setAttribute('data-default-message', 'Error! Please try again.');
  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  errorMessageText.textContent = errorMessageRow.textContent.trim();
  moveInstrumentation(errorMessageRow, errorMessageText);
  errorMessageDiv.append(errorMessageText);
  root.append(errorMessageDiv);

  // Form (hidden)
  const form = document.createElement('form');
  form.classList.add('hide', 'coffee-profiler-form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', 'https://www.nescafe.com/in/coffee-profiler/result');
  ['type', 'intensity', 'format', 'features', 'exc-type', 'exc-intensity', 'exc-format', 'exc-features'].forEach((name) => {
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('value', '');
    input.setAttribute('type', 'hidden');
    form.append(input);
  });
  root.append(form);

  block.replaceChildren(root);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: swiperPagination,
      type: 'progressbar',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 1,
      },
    },
  });
}
