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
    slidesContainerRow, // This row is a placeholder for the slides container, not a content row itself.
    ...itemRows
  ] = children;

  const root = document.createElement('section');
  root.classList.add('grid-container', 'coffee-profiler', 'animate-enter', 'in-view');
  root.setAttribute('data-api-url', 'https://www.nescafe.com/in/nc/cprofiler-status');

  // Background Image
  const parallaxBgImgContainer = document.createElement('div');
  parallaxBgImgContainer.classList.add('parallax-bg-img-container');
  const parallaxImg = document.createElement('div');
  parallaxImg.classList.add('parallax-img', 'lazyLoadedImage');

  const bgPicture = backgroundImageRow?.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) {
      parallaxImg.style.backgroundImage = `url(${img.src})`;
      moveInstrumentation(backgroundImageRow, parallaxImg);
    }
  }
  parallaxBgImgContainer.append(parallaxImg);
  root.append(parallaxBgImgContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container', 'grid-x');

  const headerCell = document.createElement('div');
  headerCell.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'padding-x');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'animate-enter-fade-up-short', 'animate-delay-3');
  heading.textContent = headingRow?.textContent.trim() || '';
  moveInstrumentation(headingRow, heading);
  headerCell.append(heading);

  const introInfo = document.createElement('div');
  introInfo.classList.add('intro-info', 'animate-enter-fade', 'animate-delay-1', 'no-avatar-image');

  const greetingsContainer = document.createElement('div');
  greetingsContainer.classList.add('greetings-container', 'headline-h4', 'animate-enter-fade-up-short', 'stagger-1');

  const greetingMorning = document.createElement('span');
  greetingMorning.classList.add('greeting--morning');
  greetingMorning.textContent = greetingMorningRow?.textContent.trim() || '';
  moveInstrumentation(greetingMorningRow, greetingMorning);
  greetingsContainer.append(greetingMorning);

  const greetingAfternoon = document.createElement('span');
  greetingAfternoon.classList.add('hide', 'greeting--afternoon');
  greetingAfternoon.textContent = greetingAfternoonRow?.textContent.trim() || '';
  moveInstrumentation(greetingAfternoonRow, greetingAfternoon);
  greetingsContainer.append(greetingAfternoon);

  const greetingEvening = document.createElement('span');
  greetingEvening.classList.add('hide', 'greeting--evening');
  greetingEvening.textContent = greetingEveningRow?.textContent.trim() || '';
  moveInstrumentation(greetingEveningRow, greetingEvening);
  greetingsContainer.append(greetingEvening);

  const greetingNight = document.createElement('span');
  greetingNight.classList.add('hide', 'greeting--night');
  greetingNight.textContent = greetingNightRow?.textContent.trim() || '';
  moveInstrumentation(greetingNightRow, greetingNight);
  greetingsContainer.append(greetingNight);

  introInfo.append(greetingsContainer);

  const guideText = document.createElement('div');
  guideText.classList.add('guide-text', 'labelMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-6');
  guideText.textContent = guideTextRow?.textContent.trim() || '';
  moveInstrumentation(guideTextRow, guideText);
  introInfo.append(guideText);

  headerCell.append(introInfo);
  maxWidthContainer.append(headerCell);

  const swiperPaginationContainer = document.createElement('div');
  swiperPaginationContainer.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'swiper-pagination-container', 'padding-x', 'animate-enter-fade-up-short', 'animate-delay-15');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-progressbar', 'swiper-pagination-horizontal');
  swiperPaginationContainer.append(swiperPagination);
  maxWidthContainer.append(swiperPaginationContainer);

  const swiperCell = document.createElement('div');
  swiperCell.classList.add('cell', 'small-12');
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'coffee-profiler-swiper'); // Removed swiper-initialized, swiper-horizontal, swiper-backface-hidden
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperEl.append(swiperWrapper);

  const slides = [];
  const options = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // Coffee Profiler Slide has 1 cell (questionLabel)
    if (cells.length === 1 && cells[0].querySelector('picture') === null) {
      slides.push(row);
    }
    // Coffee Profiler Option has 2 cells (icon, label)
    else if (cells.length === 2 && cells[0].querySelector('picture')) {
      options.push(row);
    }
  });

  slides.forEach((slideRow, slideIndex) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    // Swiper adds active/next classes automatically, do not add manually
    // if (slideIndex === 0) {
    //   slide.classList.add('initial-slide', 'swiper-slide-active');
    // } else if (slideIndex === 1) {
    //   slide.classList.add('swiper-slide-next');
    // }
    slide.setAttribute('data-slide-index', slideIndex);
    slide.setAttribute('aria-label', `${slideIndex + 1} / ${slides.length}`);

    const slideContent = document.createElement('div');
    slideContent.classList.add('coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');

    const questionLabel = document.createElement('h3');
    questionLabel.classList.add('question-label');
    // Access the content of the first cell directly for the question label
    questionLabel.textContent = slideRow.children[0]?.textContent.trim() || '';
    moveInstrumentation(slideRow, questionLabel);
    slideContent.append(questionLabel);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    // Assuming 2 options per slide based on ORIGINAL HTML, adjust as needed
    const slideOptions = options.splice(0, 2);
    optionsContainer.classList.add(`options-count--${slideOptions.length}`);

    slideOptions.forEach((optionRow) => {
      const [optionIconCell, optionLabelCell] = [...optionRow.children]; // Destructuring for fixed schema
      const optionButton = document.createElement('button');
      optionButton.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
      optionButton.setAttribute('role', 'radio');
      optionButton.setAttribute('aria-checked', 'false');
      optionButton.style.minHeight = '159px';

      const optionIconPicture = optionIconCell.querySelector('picture');
      if (optionIconPicture) {
        const optionIcon = optionIconPicture.querySelector('img');
        if (optionIcon) {
          const newIcon = document.createElement('img');
          newIcon.classList.add('option-icon', 'lazyloaded');
          newIcon.src = optionIcon.src;
          newIcon.alt = optionIcon.alt;
          moveInstrumentation(optionIconCell, newIcon);
          optionButton.append(newIcon);
        }
      }

      const optionLabel = document.createElement('span');
      optionLabel.classList.add('option-label', 'labelMediumRegular');
      optionLabel.textContent = optionLabelCell?.textContent.trim() || '';
      moveInstrumentation(optionLabelCell, optionLabel);
      optionButton.append(optionLabel);
      optionsContainer.append(optionButton);
    });

    slideContent.append(optionsContainer);
    slide.append(slideContent);
    swiperWrapper.append(slide);
  });

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

  swiperControls.append(prevBtn, nextBtn);
  swiperEl.append(swiperControls);
  swiperCell.append(swiperEl);
  maxWidthContainer.append(swiperCell);

  root.append(maxWidthContainer);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.setAttribute('data-default-message', 'Error! Please try again.');
  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  errorMessageText.textContent = errorMessageRow?.textContent.trim() || '';
  moveInstrumentation(errorMessageRow, errorMessageText);
  errorMessageDiv.append(errorMessageText);
  root.append(errorMessageDiv);

  const form = document.createElement('form');
  form.classList.add('hide', 'coffee-profiler-form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', 'https://www.nescafe.com/in/coffee-profiler/result');
  form.innerHTML = `
    <input name="type" value="" type="hidden"/>
    <input name="intensity" value="" type="hidden"/>
    <input name="format" value="" type="hidden"/>
    <input name="features" value="" type="hidden"/>
    <input name="exc-type" value="" type="hidden"/>
    <input name="exc-intensity" value="" type="hidden"/>
    <input name="exc-format" value="" type="hidden"/>
    <input name="exc-features" value="" type="hidden"/>
  `;
  root.append(form);

  // moveInstrumentation for the slidesContainerRow is not strictly necessary as it's a structural placeholder,
  // but if it had any direct content, it would be moved here.
  // For now, we'll keep it as it doesn't hurt.
  moveInstrumentation(slidesContainerRow, swiperEl);

  block.replaceChildren(root);

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
      type: 'progressbar',
      clickable: true,
    },
  });

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
