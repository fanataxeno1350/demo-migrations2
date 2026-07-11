import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageDesktopRow,
    backgroundImageMobileRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const teaser = document.createElement('div');
  // teaser.classList.add('cmp-teaser'); // Removed: block's own class already on outer div

  const backgroundImageDesktopCell = backgroundImageDesktopRow?.querySelector('div');
  const backgroundImageMobileCell = backgroundImageMobileRow?.querySelector('div');

  const desktopPicture = backgroundImageDesktopCell?.querySelector('picture');
  const mobilePicture = backgroundImageMobileCell?.querySelector('picture');

  let desktopImageUrl = '';
  if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    if (img) {
      desktopImageUrl = img.src;
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      desktopPicture.replaceWith(optimizedPic);
    }
  }

  let mobileImageUrl = '';
  if (mobilePicture) {
    const img = mobilePicture.querySelector('img');
    if (img) {
      mobileImageUrl = img.src;
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      mobilePicture.replaceWith(optimizedPic);
    }
  }

  if (desktopImageUrl) {
    teaser.style.backgroundImage = `url("${desktopImageUrl}")`;
  } else if (mobileImageUrl) {
    teaser.style.backgroundImage = `url("${mobileImageUrl}")`;
  }

  const content = document.createElement('div');
  content.classList.add('cmp-teaser__content');

  const title = document.createElement('h2');
  title.classList.add('cmp-teaser__title');
  moveInstrumentation(titleRow, title);
  // Correctly read text from the cell, not an inner div
  title.textContent = titleRow.textContent.trim() || '';
  content.append(title);

  const description = document.createElement('div');
  description.classList.add('cmp-teaser__description');
  moveInstrumentation(descriptionRow, description); // Added moveInstrumentation for descriptionRow
  // Correctly read richtext HTML from the cell, not an inner div
  description.innerHTML = descriptionRow.innerHTML || '';
  content.append(description);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('cmp-teaser__action-container');

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor', 'cmp-button--primary-anchor-light');

  const ctaLinkElement = ctaLinkRow?.querySelector('div')?.querySelector('a');
  // Correctly read text from the cell, not an inner div
  const ctaLabelText = ctaLabelRow.textContent.trim() || '';

  if (ctaLinkElement && ctaLabelText) {
    const ctaAnchor = document.createElement('a');
    ctaAnchor.classList.add('cmp-button');
    ctaAnchor.href = ctaLinkElement.href;
    moveInstrumentation(ctaLinkRow, ctaAnchor);

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('cmp-button__text');
    ctaSpan.textContent = ctaLabelText;
    ctaAnchor.append(ctaSpan);
    buttonDiv.append(ctaAnchor);
    actionContainer.append(buttonDiv);
    content.append(actionContainer);
  }

  teaser.append(content);
  block.replaceChildren(teaser);
  // The outer block div already has 'teaser-first-half-center-aligned' from AEM.
  // 'teaser' is also from the outer div.
  // The original HTML shows 'cmp-teaser' on the inner div.
  block.classList.add('cmp-teaser', 'teaser', 'cmp-teaser--first-half-center-aligned');
}
