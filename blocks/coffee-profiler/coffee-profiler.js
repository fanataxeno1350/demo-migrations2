import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const [
    backgroundImageRow,
    headingRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
    guideTextRow,
    errorMessageRow,
    ...itemRows
  ] = children;

  const questionSlides = [];
  const optionItems = [];

  // Separate question slides from option items
  itemRows.forEach((row) => {
    // A question slide has 1 cell (questionLabel)
    if (row.children.length === 1 && row.children[0].textContent.trim()) {
      questionSlides.push(row);
    // An option item has 2 cells (optionIcon, optionLabel)
    } else if (row.children.length === 2 && row.children[0].querySelector('picture')) {
      optionItems.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('grid-container', 'coffee-profiler', 'animate-enter', 'in-view'); // Add classes from original HTML
  section.setAttribute('data-api-url', 'https://www.nescafe.com/in/nc/cprofiler-status');
  moveInstrumentation(block, section);

  const dummyBg1 = document.createElement('div');
  dummyBg1.classList.add('bg--paper-blue', 'dummy-to-load-bg');
  section.append(dummyBg1);

  const dummyBg2 = document.createElement('div');
  dummyBg2.classList.add('bg--paper-white-heavy', 'dummy-to-load-bg');
  section.append(dummyBg2);

  const parallaxBgContainer = document.createElement('div');
  parallaxBgContainer.classList.add('parallax-bg-img-container');
  section.append(parallaxBgContainer);

  const parallaxImg = document.createElement('div');
  parallaxImg.classList.add('parallax-img', 'lazyLoadedImage');
  const backgroundPicture = backgroundImageRow.querySelector('picture');
  if (backgroundPicture) {
    const img = backgroundPicture.querySelector('img');
    if (img) {
      parallaxImg.style.backgroundImage = `url('${img.src}')`;
      moveInstrumentation(backgroundImageRow, parallaxImg);
    }
  }
  parallaxBgContainer.append(parallaxImg);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container', 'grid-x');
  section.append(maxWidthContainer);

  const headerCell = document.createElement('div');
  headerCell.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'padding-x');
  maxWidthContainer.append(headerCell);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'animate-enter-fade-up-short', 'animate-delay-3');
  if (headingRow) {
    heading.textContent = headingRow.children[0]?.textContent.trim();
    moveInstrumentation(headingRow, heading);
  }
  headerCell.append(heading);

  const introInfo = document.createElement('div');
  introInfo.classList.add('intro-info', 'animate-enter-fade', 'animate-delay-1', 'no-avatar-image');
  headerCell.append(introInfo);

  const greetingsContainer = document.createElement('div');
  greetingsContainer.classList.add('greetings-container', 'headline-h4', 'animate-enter-fade-up-short', 'animate-delay-3', 'stagger-1');
  introInfo.append(greetingsContainer);

  const greetingMorning = document.createElement('span');
  greetingMorning.classList.add('hide', 'greeting--morning');
  if (greetingMorningRow) {
    greetingMorning.textContent = greetingMorningRow.children[0]?.textContent.trim();
    moveInstrumentation(greetingMorningRow, greetingMorning);
  }
  greetingsContainer.append(greetingMorning);

  const greetingAfternoon = document.createElement('span');
  greetingAfternoon.classList.add('greeting--afternoon');
  if (greetingAfternoonRow) {
    greetingAfternoon.textContent = greetingAfternoonRow.children[0]?.textContent.trim();
    moveInstrumentation(greetingAfternoonRow, greetingAfternoon);
  }
  greetingsContainer.append(greetingAfternoon);

  const greetingEvening = document.createElement('span');
  greetingEvening.classList.add('hide', 'greeting--evening');
  if (greetingEveningRow) {
    greetingEvening.textContent = greetingEveningRow.children[0]?.textContent.trim();
    moveInstrumentation(greetingEveningRow, greetingEvening);
  }
  greetingsContainer.append(greetingEvening);

  const greetingNight = document.createElement('span');
  greetingNight.classList.add('hide', 'greeting--night');
  if (greetingNightRow) {
    greetingNight.textContent = greetingNightRow.children[0]?.textContent.trim();
    moveInstrumentation(greetingNightRow, greetingNight);
  }
  greetingsContainer.append(greetingNight);

  const guideText = document.createElement('div');
  guideText.classList.add('guide-text', 'labelMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-6');
  if (guideTextRow) {
    guideText.textContent = guideTextRow.children[0]?.textContent.trim();
    moveInstrumentation(guideTextRow, guideText);
  }
  introInfo.append(guideText);

  const swiperPaginationContainer = document.createElement('div');
  swiperPaginationContainer.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'swiper-pagination-container', 'padding-x', 'animate-enter-fade-up-short', 'animate-delay-15');
  maxWidthContainer.append(swiperPaginationContainer);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-progressbar', 'swiper-pagination-horizontal');
  swiperPaginationContainer.append(swiperPagination);

  const swiperPaginationFill = document.createElement('span');
  swiperPaginationFill.classList.add('swiper-pagination-progressbar-fill');
  swiperPagination.append(swiperPaginationFill);

  const swiperCell = document.createElement('div');
  swiperCell.classList.add('cell', 'small-12');
  maxWidthContainer.append(swiperCell);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'coffee-profiler-swiper');
  swiperCell.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperEl.append(swiperWrapper);

  questionSlides.forEach((qRow, index) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');
    if (index === 0) {
      slide.classList.add('initial-slide', 'swiper-slide-active');
    }
    slide.setAttribute('data-slide-index', index);
    slide.setAttribute('aria-label', `${index + 1} / ${questionSlides.length}`);
    moveInstrumentation(qRow, slide);

    const questionLabel = document.createElement('h3');
    questionLabel.classList.add('question-label');
    questionLabel.textContent = qRow.children[0]?.textContent.trim();
    slide.append(questionLabel);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    // Assuming options are directly after the question slide in the flat structure
    // This logic needs to be robust if the number of options per question varies
    // For now, assuming 2 options per question based on original HTML structure
    const currentOptions = optionItems.splice(0, 2);
    optionsContainer.classList.add(`options-count--${currentOptions.length}`);
    slide.append(optionsContainer);

    currentOptions.forEach((oRow) => {
      const optionButton = document.createElement('button');
      optionButton.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
      moveInstrumentation(oRow, optionButton);

      const [optionIconCell, optionLabelCell] = [...oRow.children]; // Destructuring for fixed schema

      const optionIconPicture = optionIconCell.querySelector('picture');
      if (optionIconPicture) {
        const optionIconImg = optionIconPicture.querySelector('img');
        if (optionIconImg) {
          const optimizedPic = createOptimizedPicture(optionIconImg.src, optionIconImg.alt, false, [{ width: '750' }]);
          moveInstrumentation(optionIconImg, optimizedPic.querySelector('img'));
          optionButton.append(optimizedPic);
        }
      }

      const optionLabel = document.createElement('span');
      optionLabel.classList.add('option-label', 'labelMediumRegular');
      if (optionLabelCell) {
        optionLabel.textContent = optionLabelCell.textContent.trim();
      }
      optionButton.append(optionLabel);
      optionsContainer.append(optionButton);
    });

    swiperWrapper.append(slide);
  });

  const swiperControls = document.createElement('div');
  swiperControls.classList.add('swiper-controls', 'animate-enter-fade', 'animate-delay-15');
  swiperEl.append(swiperControls);

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
  nextBtn.setAttribute('disabled', 'disabled');
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  swiperControls.append(nextBtn);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperEl.append(swiperNotification);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.setAttribute('data-default-message', 'Error! Please try again.');
  section.append(errorMessageDiv);

  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  if (errorMessageRow) {
    errorMessageText.textContent = errorMessageRow.children[0]?.textContent.trim();
    moveInstrumentation(errorMessageRow, errorMessageText);
  }
  errorMessageDiv.append(errorMessageText);

  const profilerForm = document.createElement('form');
  profilerForm.classList.add('hide', 'coffee-profiler-form');
  profilerForm.setAttribute('method', 'POST');
  profilerForm.setAttribute('action', 'https://www.nescafe.com/in/coffee-profiler/result');
  profilerForm.innerHTML = `
    <input name="type" value="" type="hidden"/>
    <input name="intensity" value="" type="hidden"/>
    <input name="format" value="" type="hidden"/>
    <input name="features" value="" type="hidden"/>
    <input name="exc-type" value="" type="hidden"/>
    <input name="exc-intensity" value="" type="hidden"/>
    <input name="exc-format" value="" type="hidden"/>
    <input name="exc-features" value="" type="hidden"/>
  `;
  section.append(profilerForm);

  block.replaceChildren(section);

  // Load Swiper and initialize
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
      // Add breakpoints if needed based on original HTML behavior
    },
  });

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
