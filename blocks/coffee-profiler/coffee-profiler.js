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
    introTextRow,
    errorMessageRow,
    questionsContainerPlaceholder, // This is actually the first question row, not a placeholder
    ...remainingRows // This will contain all subsequent question and option rows
  ] = children;

  const root = document.createElement('section');
  // Removed 'coffee-profiler' from root.classList.add() as the outer block div already has it.
  root.classList.add('grid-container', 'animate-enter', 'in-view');
  root.setAttribute('data-api-url', 'https://www.nescafe.com/in/nc/cprofiler-status'); // Assuming this URL is static or from a metadata field

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

  const headerCellWrapper = document.createElement('div');
  headerCellWrapper.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'padding-x');

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'animate-enter-fade-up-short', 'animate-delay-3');
  if (headingRow) {
    heading.textContent = headingRow.textContent.trim();
    moveInstrumentation(headingRow, heading);
  }
  headerCellWrapper.append(heading);

  // Intro Info
  const introInfo = document.createElement('div');
  introInfo.classList.add('intro-info', 'animate-enter-fade', 'animate-delay-1', 'no-avatar-image');

  // Greetings Container
  const greetingsContainer = document.createElement('div');
  greetingsContainer.classList.add('greetings-container', 'headline-h4', 'animate-enter-fade-up-short', 'animate-delay-3', 'stagger-1');

  const greetingMorning = document.createElement('span');
  greetingMorning.classList.add('greeting--morning');
  if (greetingMorningRow) {
    greetingMorning.textContent = greetingMorningRow.textContent.trim();
    moveInstrumentation(greetingMorningRow, greetingMorning);
  }
  greetingsContainer.append(greetingMorning);

  const greetingAfternoon = document.createElement('span');
    // Original HTML has 'hide' class, so add it here.
  greetingAfternoon.classList.add('hide', 'greeting--afternoon');
  if (greetingAfternoonRow) {
    greetingAfternoon.textContent = greetingAfternoonRow.textContent.trim();
    moveInstrumentation(greetingAfternoonRow, greetingAfternoon);
  }
  greetingsContainer.append(greetingAfternoon);

  const greetingEvening = document.createElement('span');
    // Original HTML has 'hide' class, so add it here.
  greetingEvening.classList.add('hide', 'greeting--evening');
  if (greetingEveningRow) {
    greetingEvening.textContent = greetingEveningRow.textContent.trim();
    moveInstrumentation(greetingEveningRow, greetingEvening);
  }
  greetingsContainer.append(greetingEvening);

  const greetingNight = document.createElement('span');
    // Original HTML has 'hide' class, so add it here.
  greetingNight.classList.add('hide', 'greeting--night');
  if (greetingNightRow) {
    greetingNight.textContent = greetingNightRow.textContent.trim();
    moveInstrumentation(greetingNightRow, greetingNight);
  }
  greetingsContainer.append(greetingNight);

  introInfo.append(greetingsContainer);

  // Guide Text
  const guideText = document.createElement('div');
  guideText.classList.add('guide-text', 'labelMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-6');
  if (introTextRow) {
    guideText.textContent = introTextRow.textContent.trim();
    moveInstrumentation(introTextRow, guideText);
  }
  introInfo.append(guideText);
  headerCellWrapper.append(introInfo);
  maxWidthContainer.append(headerCellWrapper);

  // Swiper Pagination Container
  const swiperPaginationContainer = document.createElement('div');
  swiperPaginationContainer.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'swiper-pagination-container', 'padding-x', 'animate-enter-fade-up-short', 'animate-delay-15');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-progressbar', 'swiper-pagination-horizontal');
  swiperPaginationContainer.append(swiperPagination);
  maxWidthContainer.append(swiperPaginationContainer);

  // Swiper
  const swiperCell = document.createElement('div');
  swiperCell.classList.add('cell', 'small-12');
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'coffee-profiler-swiper');
  swiperEl.style.minHeight = '407px'; // From original HTML
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperEl.append(swiperWrapper);
  swiperCell.append(swiperEl);
  maxWidthContainer.append(swiperCell);

  // Parse question and option rows
  const allItemRows = [questionsContainerPlaceholder, ...remainingRows]; // Re-include the first question row
  const questionsWithOptions = [];
  let currentQuestion = null;

  allItemRows.forEach((row) => {
    const cells = [...row.children];
    // A question row has 1 cell (questionLabel)
    if (cells.length === 1) {
      currentQuestion = {
        questionLabel: cells[0]?.textContent.trim(),
        options: [],
        instrumentation: row,
      };
      questionsWithOptions.push(currentQuestion);
    }
    // An option row has 2 cells (icon, optionLabel)
    else if (cells.length === 2 && currentQuestion) {
      const [iconCell, optionLabelCell] = cells; // Destructuring for fixed schema
      currentQuestion.options.push({
        icon: iconCell.querySelector('picture'),
        optionLabel: optionLabelCell?.textContent.trim(),
        instrumentation: row,
      });
    }
  });

  questionsWithOptions.forEach((questionData, index) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');
    if (index === 0) {
      slide.classList.add('initial-slide', 'swiper-slide-active');
    }
    slide.setAttribute('data-slide-index', index);
    slide.setAttribute('aria-label', `${index + 1} / ${questionsWithOptions.length}`);

    // Move instrumentation from the question row to the slide
    moveInstrumentation(questionData.instrumentation, slide);

    const questionLabel = document.createElement('h3');
    questionLabel.classList.add('question-label');
    questionLabel.textContent = questionData.questionLabel;
    slide.append(questionLabel);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container', `options-count--${questionData.options.length}`);

    questionData.options.forEach((optionData) => {
      const button = document.createElement('button');
      button.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', 'false');
      button.style.minHeight = '159px'; // From original HTML

      // Move instrumentation from the option row to the button
      moveInstrumentation(optionData.instrumentation, button);

      if (optionData.icon) {
        const img = optionData.icon.querySelector('img');
        if (img) {
          // createOptimizedPicture handles lazyloading and alt text
          const optionIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optionIcon.classList.add('option-icon', 'lazyloaded');
          button.append(optionIcon);
        }
      }

      const optionLabel = document.createElement('span');
      optionLabel.classList.add('option-label', 'labelMediumRegular');
      optionLabel.textContent = optionData.optionLabel;
      button.append(optionLabel);
      optionsContainer.append(button);
    });
    slide.append(optionsContainer);
    swiperWrapper.append(slide);
  });

  // Swiper Controls
  const swiperControls = document.createElement('div');
  swiperControls.classList.add('swiper-controls', 'animate-enter-fade', 'animate-delay-15');

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper-control--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-15', 'swiper-button-disabled');
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
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.setAttribute('aria-disabled', 'false');
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  swiperControls.append(nextBtn);
  swiperEl.append(swiperControls);

  // Error Message
  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.setAttribute('data-default-message', 'Error! Please try again.');
  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  if (errorMessageRow) {
    errorMessageText.textContent = errorMessageRow.textContent.trim();
    moveInstrumentation(errorMessageRow, errorMessageText);
  }
  errorMessageDiv.append(errorMessageText);
  root.append(errorMessageDiv);

  // Form (hidden)
  const form = document.createElement('form');
  form.classList.add('hide', 'coffee-profiler-form');
  form.method = 'POST';
  form.action = 'https://www.nescafe.com/in/coffee-profiler/result';
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

  // The questionsContainerPlaceholder was actually the first question row.
  // Instrumentation for all item rows (questions and options) is moved to their respective
  // slide/button elements within the loop.
  // No need to move instrumentation from questionsContainerPlaceholder to swiperWrapper here,
  // as each question row's instrumentation is moved to its corresponding slide.
  block.replaceChildren(root);

  // Swiper Initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false, // Original HTML does not indicate looping, default to false
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
}
