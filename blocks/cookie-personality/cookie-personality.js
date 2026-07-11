import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageRow,
    headlineRow,
    stepperStep4ImageRow,
    questionRow,
    // optionsContainerRow is a placeholder, its instrumentation is moved to the 'options' div
    optionsContainerRow,
    ctaLabelRow,
    ...optionItemRows
  ] = [...block.children];

  const cmpCookiePersonality = document.createElement('div');
  cmpCookiePersonality.classList.add('cmp-cookie-personality');

  // Background Image
  const backgroundImage = backgroundImageRow.querySelector('picture');
  if (backgroundImage) {
    const img = backgroundImage.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1366' }]);
    moveInstrumentation(backgroundImage, optimizedPic.querySelector('img'));
    cmpCookiePersonality.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
  }

  // Headline
  const headline = document.createElement('h2');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  cmpCookiePersonality.append(headline);

  // Stepper (hardcoded structure from original HTML)
  const stepper = document.createElement('div');
  stepper.classList.add('cmp-cookie-personality__stepper');
  cmpCookiePersonality.append(stepper);

  for (let i = 1; i <= 3; i += 1) {
    const step = document.createElement('div');
    step.classList.add('cmp-cookie-personality__stepper--step');
    if (i === 1) {
      step.classList.add('active');
    }
    const span = document.createElement('span');
    span.textContent = i;
    step.append(span);
    stepper.append(step);
  }

  const step4 = document.createElement('div');
  step4.classList.add('cmp-cookie-personality__stepper--step-4');
  const step4ImageContainer = document.createElement('div');
  step4ImageContainer.classList.add('lazy-image-container');
  const stepperStep4Image = stepperStep4ImageRow.querySelector('picture');
  if (stepperStep4Image) {
    const img = stepperStep4Image.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: 'auto' }]);
    moveInstrumentation(stepperStep4Image, optimizedPic.querySelector('img'));
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('lazy-image', 'loaded');
    optimizedImg.loading = 'lazy';
    optimizedImg.fetchpriority = 'low';
    step4ImageContainer.append(optimizedPic);
  }
  step4.append(step4ImageContainer);
  stepper.append(step4);

  // Question Wrapper
  const questionWrapper = document.createElement('div');
  questionWrapper.classList.add('cmp-cookie-personality__question-wrapper');
  cmpCookiePersonality.append(questionWrapper);

  const question = document.createElement('h3');
  moveInstrumentation(questionRow, question);
  question.textContent = questionRow.textContent.trim();
  questionWrapper.append(question);

  // Options
  const options = document.createElement('div');
  options.classList.add('cmp-cookie-personality__options', 'body-3');
  moveInstrumentation(optionsContainerRow, options); // Move instrumentation from the options container placeholder
  questionWrapper.append(options);

  const nextButton = document.createElement('button'); // Declare button here to make it accessible
  nextButton.type = 'button';
  nextButton.classList.add('cmp-button');
  nextButton.disabled = true; // Initially disabled as per original HTML
  moveInstrumentation(ctaLabelRow, nextButton); // Move instrumentation from ctaLabelRow to the button

  optionItemRows.forEach((row) => {
    const [optionLabelCell] = [...row.children];
    const option = document.createElement('div');
    option.classList.add('cmp-cookie-personality__option'); // Removed 'false' class as it's not in original HTML
    moveInstrumentation(row, option);
    option.textContent = optionLabelCell.textContent.trim();
    options.append(option);

    option.addEventListener('click', () => {
      // Remove 'active' from all options
      options.querySelectorAll('.cmp-cookie-personality__option').forEach((opt) => {
        opt.classList.remove('active');
      });
      // Add 'active' to the clicked option
      option.classList.add('active');
      // Enable the next button
      nextButton.disabled = false;
    });
  });

  // Actions
  const actions = document.createElement('div');
  actions.classList.add('cmp-cookie-personality__actions');
  cmpCookiePersonality.append(actions);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined');
  actions.append(buttonDiv);

  buttonDiv.append(nextButton); // Append the button declared earlier

  const buttonText = document.createElement('span');
  buttonText.classList.add('cmp-button__text');
  buttonText.textContent = ctaLabelRow.textContent.trim();
  nextButton.append(buttonText);

  block.replaceChildren(cmpCookiePersonality);
}
