import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // Destructure root-level rows based on BlockJson model
  const [
    backgroundImageRow,
    headingRow,
    greetingMorningRow,
    greetingAfternoonRow,
    greetingEveningRow,
    greetingNightRow,
    guideTextRow,
    errorMessageRow,
    ...restRows
  ] = [...block.children];

  // Filter remaining rows into slide and option types
  // Slide rows have 1 cell (question)
  const slideRows = restRows.filter(
    (row) => row.children.length === 1
  );
  // Option rows have 2 cells (icon, label)
  const optionRows = restRows.filter(
    (row) => row.children.length === 2
  );

  const root = document.createElement('section');
  root.classList.add('grid-container', 'coffee-profiler', 'animate-enter', 'in-view');
  root.setAttribute('data-api-url', 'https://www.nescafe.com/in/nc/cprofiler-status');

  const bgPaperBlue = document.createElement('div');
  bgPaperBlue.classList.add('bg--paper-blue', 'dummy-to-load-bg');
  root.append(bgPaperBlue);

  const bgPaperWhiteHeavy = document.createElement('div');
  bgPaperWhiteHeavy.classList.add('bg--paper-white-heavy', 'dummy-to-load-bg');
  root.append(bgPaperWhiteHeavy);

  const parallaxBgImgContainer = document.createElement('div');
  parallaxBgImgContainer.classList.add('parallax-bg-img-container');
  const parallaxImg = document.createElement('div');
  parallaxImg.classList.add('parallax-img', 'lazyLoadedImage');
  const picture = backgroundImageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      parallaxImg.style.backgroundImage = `url(${img.src})`;
      moveInstrumentation(backgroundImageRow, parallaxImg);
    }
  }
  parallaxBgImgContainer.append(parallaxImg);
  root.append(parallaxBgImgContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container', 'grid-x');

  const contentCell = document.createElement('div');
  contentCell.classList.add(
    'cell',
    'small-12',
    'medium-offset-1',
    'medium-10',
    'xlarge-offset-2',
    'xlarge-8',
    'padding-x'
  );

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'animate-enter-fade-up-short', 'animate-delay-3');
  heading.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, heading);
  contentCell.append(heading);

  const introInfo = document.createElement('div');
  introInfo.classList.add('intro-info', 'animate-enter-fade', 'animate-delay-1', 'no-avatar-image');

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

  const guideText = document.createElement('div');
  guideText.classList.add('guide-text', 'labelMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-6');
  guideText.textContent = guideTextRow.textContent.trim();
  moveInstrumentation(guideTextRow, guideText);
  introInfo.append(guideText);

  contentCell.append(introInfo);
  maxWidthContainer.append(contentCell);

  const swiperPaginationContainer = document.createElement('div');
  swiperPaginationContainer.classList.add(
    'cell',
    'small-12',
    'medium-offset-1',
    'medium-10',
    'xlarge-offset-2',
    'xlarge-8',
    'swiper-pagination-container',
    'padding-x',
    'animate-enter-fade-up-short',
    'animate-delay-15'
  );
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-progressbar', 'swiper-pagination-horizontal');
  swiperPaginationContainer.append(swiperPagination);
  maxWidthContainer.append(swiperPaginationContainer);

  const swiperCell = document.createElement('div');
  swiperCell.classList.add('cell', 'small-12');
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'coffee-profiler-swiper');
  swiperCell.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperEl.append(swiperWrapper);

  let optionIndex = 0;
  slideRows.forEach((slideRow, index) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    if (index === 0) {
      slide.classList.add('initial-slide', 'swiper-slide-active');
    }
    slide.setAttribute('data-slide-index', index);

    const slideContent = document.createElement('div');
    slideContent.classList.add('coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');

    const [questionCell] = [...slideRow.children]; // Destructure question cell
    const questionLabel = document.createElement('h3');
    questionLabel.classList.add('question-label');
    questionLabel.textContent = questionCell.textContent.trim();
    moveInstrumentation(slideRow, questionLabel); // Instrumentation on the row, not the cell
    slideContent.append(questionLabel);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    // Assuming options are directly after the question cell in the block.children
    // and there are two options per slide for simplicity based on original HTML
    const currentSlideOptions = optionRows.slice(optionIndex, optionIndex + 2);
    optionsContainer.classList.add(`options-count--${currentSlideOptions.length}`);

    currentSlideOptions.forEach((optionRow) => {
      const option = document.createElement('button');
      option.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');

      const [optionIconCell, optionLabelCell] = [...optionRow.children]; // Destructure option cells

      const optionIconPicture = optionIconCell.querySelector('picture');
      if (optionIconPicture) {
        const optionIconImg = optionIconPicture.querySelector('img');
        if (optionIconImg) {
          const icon = createOptimizedPicture(optionIconImg.src, optionIconImg.alt, false, [{ width: '750' }]);
          icon.classList.add('option-icon');
          option.append(icon);
        }
      }

      const optionLabel = document.createElement('span');
      optionLabel.classList.add('option-label', 'labelMediumRegular');
      optionLabel.textContent = optionLabelCell.textContent.trim();
      moveInstrumentation(optionRow, optionLabel); // Instrumentation on the row, not the cell
      option.append(optionLabel);
      optionsContainer.append(option);
    });
    optionIndex += currentSlideOptions.length;

    slideContent.append(optionsContainer);
    slide.append(slideContent);
    swiperWrapper.append(slide);
  });

  const swiperControls = document.createElement('div');
  swiperControls.classList.add('swiper-controls', 'animate-enter-fade', 'animate-delay-15');

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper-control--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-15', 'swiper-button-disabled');
  prevBtn.innerHTML = `<svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
  </svg>`;
  swiperControls.append(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-control', 'swiper-button', 'swiper-control--next', 'elevation-1', 'animate-enter-fade-left-short', 'animate-delay-15');
  nextBtn.innerHTML = `<svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
  </svg>`;
  swiperControls.append(nextBtn);

  swiperEl.append(swiperControls);
  maxWidthContainer.append(swiperCell);
  root.append(maxWidthContainer);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.setAttribute('data-default-message', 'Error! Please try again.');
  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  errorMessageText.textContent = errorMessageRow.textContent.trim();
  moveInstrumentation(errorMessageRow, errorMessageText);
  errorMessageDiv.append(errorMessageText);
  root.append(errorMessageDiv);

  const form = document.createElement('form');
  form.classList.add('hide', 'coffee-profiler-form');
  form.method = 'POST';
  form.action = 'https://www.nescafe.com/in/coffee-profiler/result';
  ['type', 'intensity', 'format', 'features', 'exc-type', 'exc-intensity', 'exc-format', 'exc-features'].forEach((name) => {
    const input = document.createElement('input');
    input.name = name;
    input.value = '';
    input.type = 'hidden';
    form.append(input);
  });
  root.append(form);

  block.replaceChildren(root);

  // Image optimization
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be on the original img's parent picture or the img itself if it's the root of instrumentation
    // For now, we'll assume the original img is not instrumented directly, but its parent row was.
    // If the img itself was instrumented, this would need adjustment.
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Swiper initialization
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
      clickable: true,
      type: 'progressbar',
    },
  });
}
