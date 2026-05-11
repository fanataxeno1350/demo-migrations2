import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, descriptionRow, ctaLabelRow, ctaLinkRow, backgroundImageRow] = [...block.children];

  const calloutSection = document.createElement('div');
  calloutSection.classList.add('callout-section');

  const calloutSectionLeft = document.createElement('div');
  calloutSectionLeft.classList.add('callout-section-left');
  calloutSectionLeft.setAttribute('data-module', 'in-view');
  calloutSectionLeft.setAttribute('data-offset', 'bottom-in-view');
  calloutSectionLeft.setAttribute('data-is', 'visible');

  const calloutSectionLeftContent = document.createElement('div');
  calloutSectionLeftContent.classList.add('callout-section-left-content', 'u-background-green');

  const calloutSectionLeftContentHolder = document.createElement('div');
  calloutSectionLeftContentHolder.classList.add('callout-section-left-content-holder', 'u-background-green');

  const title = document.createElement('div');
  title.classList.add('callout-section-title');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  calloutSectionLeftContentHolder.append(title);

  const description = document.createElement('div');
  description.classList.add('callout-section-description');
  moveInstrumentation(descriptionRow, description);
  // FIX: description is richtext, read innerHTML directly from the row's cell
  description.innerHTML = descriptionRow.innerHTML;
  calloutSectionLeftContentHolder.append(description);

  const ctaP = document.createElement('p');
  ctaP.classList.add('u-text-centered');

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('u-button', 'u-button-reversed-white');
  const foundLink = ctaLinkRow.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
  }
  moveInstrumentation(ctaLinkRow, ctaLink);
  ctaLink.textContent = ctaLabelRow.textContent.trim();
  ctaP.append(ctaLink);
  calloutSectionLeftContentHolder.append(ctaP);

  calloutSectionLeftContent.append(calloutSectionLeftContentHolder);
  calloutSectionLeft.append(calloutSectionLeftContent);
  calloutSection.append(calloutSectionLeft);

  const calloutSectionRight = document.createElement('div');
  calloutSectionRight.classList.add('callout-section-right');
  calloutSectionRight.setAttribute('data-module', 'in-view');
  calloutSectionRight.setAttribute('data-offset', 'bottom-in-view');
  calloutSectionRight.setAttribute('data-is', 'visible');

  const homecontentStripe = document.createElement('div');
  homecontentStripe.classList.add('homecontent-stripe', 'homecontent-stripe-bottom');

  const picture = backgroundImageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      // FIX: moveInstrumentation should be called on the original row, not the img element
      moveInstrumentation(backgroundImageRow, optimizedImg);
      homecontentStripe.style.backgroundImage = `url("${optimizedImg.src}")`;
    }
  }
  // moveInstrumentation(backgroundImageRow, homecontentStripe); // This was redundant after fixing above
  calloutSectionRight.append(homecontentStripe);
  calloutSection.append(calloutSectionRight);

  block.replaceChildren(calloutSection);
}
