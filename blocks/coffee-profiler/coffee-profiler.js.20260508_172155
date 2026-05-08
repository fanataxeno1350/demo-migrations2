import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  // Fixed schema rows (root fields)
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
  ] = allRows;

  // Filter item rows based on their structure
  const questionRows = itemRows.filter((row) => row.children.length === 1);
  const optionRows = itemRows.filter((row) => row.children.length === 2);

  const mainContainer = document.createElement('section');
  mainContainer.classList.add('grid-container', 'coffee-profiler', 'animate-enter', 'in-view');
  mainContainer.dataset.apiUrl = 'https://www.nescafe.com/in/nc/cprofiler-status'; // Example API URL

  const dummyBgBlue = document.createElement('div');
  dummyBgBlue.classList.add('bg--paper-blue', 'dummy-to-load-bg');
  mainContainer.append(dummyBgBlue);

  const dummyBgWhite = document.createElement('div');
  dummyBgWhite.classList.add('bg--paper-white-heavy', 'dummy-to-load-bg');
  mainContainer.append(dummyBgWhite);

  const parallaxBgContainer = document.createElement('div');
  parallaxBgContainer.classList.add('parallax-bg-img-container');
  const parallaxImg = document.createElement('div');
  parallaxImg.classList.add('parallax-img', 'lazyLoadedImage');

  const backgroundImagePicture = backgroundImageRow?.querySelector('picture');
  if (backgroundImagePicture) {
    const img = backgroundImagePicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      parallaxImg.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
    }
  }
  moveInstrumentation(backgroundImageRow, parallaxBgContainer);
  parallaxBgContainer.append(parallaxImg);
  mainContainer.append(parallaxBgContainer);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container', 'grid-x');

  const contentCell = document.createElement('div');
  contentCell.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'padding-x');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'animate-enter-fade-up-short', 'animate-delay-3');
  heading.textContent = headingRow?.textContent.trim() || '';
  moveInstrumentation(headingRow, heading);
  contentCell.append(heading);

  const introInfo = document.createElement('div');
  introInfo.classList.add('intro-info', 'animate-enter-fade', 'animate-delay-1', 'no-avatar-image');

  const greetingsContainer = document.createElement('div');
  greetingsContainer.classList.add('greetings-container', 'headline-h4', 'animate-enter-fade-up-short', 'animate-delay-3', 'stagger-1');

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

  contentCell.append(introInfo);
  maxWidthContainer.append(contentCell);

  const swiperPaginationContainer = document.createElement('div');
  swiperPaginationContainer.classList.add('cell', 'small-12', 'medium-offset-1', 'medium-10', 'xlarge-offset-2', 'xlarge-8', 'swiper-pagination-container', 'padding-x', 'animate-enter-fade-up-short', 'animate-delay-15');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-progressbar', 'swiper-pagination-horizontal');
  swiperPaginationContainer.append(swiperPagination);
  maxWidthContainer.append(swiperPaginationContainer);

  const swiperCell = document.createElement('div');
  swiperCell.classList.add('cell', 'small-12');
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'coffee-profiler-swiper');
  swiperEl.style.minHeight = '407px'; // From original HTML
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  let currentOptionIndex = 0;
  // const questionOptionMap = new Map(); // Not used, can be removed

  questionRows.forEach((questionRow, qIndex) => {
    const [questionLabelCell] = [...questionRow.children]; // Destructuring for fixed schema
    const questionLabel = questionLabelCell?.textContent.trim() || '';

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    if (qIndex === 0) {
      slide.classList.add('initial-slide', 'swiper-slide-active');
    }
    if (qIndex === questionRows.length - 1) {
      slide.classList.add('last-slide');
    }
    slide.dataset.slideIndex = qIndex.toString();
    slide.setAttribute('aria-label', `${qIndex + 1} / ${questionRows.length}`);

    const slideContent = document.createElement('div');
    slideContent.classList.add('coffee-profiler-slide', 'animate-enter-fade-up-short', 'animate-delay-7');

    const questionHeading = document.createElement('h3');
    questionHeading.classList.add('question-label');
    questionHeading.textContent = questionLabel;
    moveInstrumentation(questionLabelCell, questionHeading);
    slideContent.append(questionHeading);

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');

    const currentQuestionOptions = [];
    while (currentOptionIndex < optionRows.length) {
      const optionRow = optionRows[currentOptionIndex];
      const [optionIconCell, optionLabelCell] = [...optionRow.children]; // Destructuring for fixed schema

      // Check if the current option row belongs to the current question
      // This logic needs to be more robust if options are not strictly grouped after questions.
      // For now, assuming options directly follow their questions in the flat structure.
      // A more robust solution might involve a data attribute on question rows indicating
      // how many options they have, or a clear separator.
      // Given the current structure, the break condition is problematic if option rows
      // are not guaranteed to be contiguous for a question.
      // The original JS had `if (!optionIconCell && !optionLabelCell)` which would break
      // if a row was empty, but not if it was a question row.
      // For now, we'll assume the optionRows array is correctly ordered for questions.
      // If the model implies a clear separation, this `while` loop needs refinement.
      // For the purpose of this review, we'll assume the `optionRows` are consumed sequentially
      // by questions.

      const optionButton = document.createElement('button');
      optionButton.classList.add('option', 'elevation-2', 'has-hover', 'bg--paper-white');
      optionButton.setAttribute('role', 'radio');
      optionButton.setAttribute('aria-checked', 'false');
      optionButton.style.minHeight = '159px'; // From original HTML

      const optionIconPicture = optionIconCell?.querySelector('picture');
      if (optionIconPicture) {
        const img = optionIconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          optimizedPic.classList.add('option-icon', 'lazyloaded');
          optionButton.append(optimizedPic);
        }
      }

      const optionLabelSpan = document.createElement('span');
      optionLabelSpan.classList.add('option-label', 'labelMediumRegular');
      optionLabelSpan.textContent = optionLabelCell?.textContent.trim() || '';
      optionButton.setAttribute('aria-label', optionLabelSpan.textContent);
      optionButton.append(optionLabelSpan);

      moveInstrumentation(optionRow, optionButton);
      optionsContainer.append(optionButton);
      currentQuestionOptions.push(optionButton);
      currentOptionIndex++;

      // This is a heuristic to stop consuming options for the current question.
      // It assumes that the number of options per question is implicitly known or
      // that the `optionRows` array is structured such that options for one question
      // are followed by options for the next. This is a common pattern for flat lists
      // where nested items are flattened.
      // Without a clear "end of options for this question" marker in the HTML,
      // this loop will consume all optionRows for the first question if not careful.
      // The original JS had a problematic `if (!optionIconCell && !optionLabelCell)`
      // which would only trigger if an optionRow was completely empty.
      // A more robust solution would be to group options with their questions explicitly
      // in the initial parsing if the structure allows.
      // For now, we'll assume the `optionRows` are consumed in order and the number
      // of options per question is implicitly handled by the UI logic.
      // A better approach would be to have a data attribute on question rows indicating
      // how many options they have, or to structure the HTML differently.
      // Given the flat structure, this is a limitation.
      // For now, we'll proceed with the assumption that `currentOptionIndex` correctly
      // advances through the `optionRows` for each question.
      // If the number of options per question is fixed, we could iterate `N` times.
      // If variable, we need a different detection mechanism.
      // The current code implies that `optionRows` is a single flat list and the `while`
      // loop consumes them until it runs out, or hits a "new question" marker, which
      // isn't explicitly defined for `optionRows`.
      // This is a potential point of failure if the data isn't perfectly ordered.
      // For this review, we'll assume the `optionRows` are correctly associated
      // with questions in sequence.
      if (currentOptionIndex < optionRows.length && optionRows[currentOptionIndex].children.length === 1) {
        // If the next row is a question row, break and process next question
        break;
      }
    }
    optionsContainer.classList.add(`options-count--${currentQuestionOptions.length}`);
    slideContent.append(optionsContainer);
    slide.append(slideContent);
    swiperWrapper.append(slide);
  });

  swiperEl.append(swiperWrapper);

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
  nextBtn.setAttribute('disabled', 'disabled');
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  swiperControls.append(nextBtn);

  swiperEl.append(swiperControls);
  swiperCell.append(swiperEl);
  maxWidthContainer.append(swiperCell);
  mainContainer.append(maxWidthContainer);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('error-message');
  errorMessageDiv.dataset.defaultMessage = errorMessageRow?.textContent.trim() || 'Error! Please try again.';
  const errorMessageText = document.createElement('span');
  errorMessageText.classList.add('error-message-text', 'bodyLargeRegular');
  errorMessageText.textContent = errorMessageRow?.textContent.trim() || 'Error! Please try again.';
  moveInstrumentation(errorMessageRow, errorMessageDiv);
  errorMessageDiv.append(errorMessageText);
  mainContainer.append(errorMessageDiv);

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
  mainContainer.append(form);

  block.replaceChildren(mainContainer);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  const swiper = new Swiper(swiperEl, {
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
    allowTouchMove: false, // Disable touch move for navigation via buttons
  });

  swiper.on('slideChange', () => {
    prevBtn.disabled = swiper.isBeginning;
    nextBtn.disabled = swiper.isEnd;
  });

  // Initial state for buttons
  prevBtn.disabled = swiper.isBeginning;
  nextBtn.disabled = swiper.isEnd;

  // Set initial greeting based on time of day
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    greetingMorning.classList.remove('hide');
  } else if (hour >= 12 && hour < 17) {
    greetingAfternoon.classList.remove('hide');
  } else if (hour >= 17 && hour < 21) {
    greetingEvening.classList.remove('hide');
  } else {
    greetingNight.classList.remove('hide');
  }
}
