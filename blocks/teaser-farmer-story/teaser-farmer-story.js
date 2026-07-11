import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    mainImageRow,
    smallImageRow,
  ] = [...block.children];

  const teaser = document.createElement('div');
  teaser.classList.add(
    'teaser',
    'cmp-teaser--right-image-aligned',
    'cmp-button--primary-anchor',
  );

  const cmpTeaser = document.createElement('div');
  cmpTeaser.classList.add('cmp-teaser');
  teaser.append(cmpTeaser);

  const content = document.createElement('div');
  content.classList.add('cmp-teaser__content');
  cmpTeaser.append(content);

  const title = document.createElement('h3');
  title.classList.add('cmp-teaser__title');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  content.append(title);

  const description = document.createElement('div'); // Changed to div for richtext
  description.classList.add('cmp-teaser__description');
  moveInstrumentation(descriptionRow, description);
  // descriptionRow is a row, its innerHTML is "<div><p>...</p></div>".
  // The content is inside its first child (the cell).
  // The cell itself contains the richtext HTML, e.g., "<p>...</p>".
  // Assigning cell.innerHTML to a div is correct for richtext.
  description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  content.append(description);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('cmp-teaser__action-container');
  content.append(actionContainer);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('cmp-teaser__action-link', 'cmp-button');
  // ctaLinkRow is a row, its first child is the cell, which contains the <a> tag.
  const foundCtaLink = ctaLinkRow.children[0]?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  }
  moveInstrumentation(ctaLinkRow, ctaLink);
  ctaLink.textContent = ctaLabelRow.textContent.trim();
  moveInstrumentation(ctaLabelRow, ctaLink); // ctaLabelRow instrumentation moved to ctaLink
  actionContainer.append(ctaLink);

  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cmp-teaser__image');
  cmpTeaser.append(imageDiv);

  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  imageDiv.append(cmpImage);

  const mainPicture = mainImageRow.querySelector('picture');
  if (mainPicture) {
    const img = mainPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' },
    ]);
    moveInstrumentation(mainImageRow, optimizedPic.querySelector('img'));
    cmpImage.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('cmp-image__image');
  }

  const animationDiv = document.createElement('div');
  animationDiv.classList.add('cmp-animation', 'visible');
  cmpTeaser.append(animationDiv);

  const smallPicture = smallImageRow.querySelector('picture');
  if (smallPicture) {
    const img = smallPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '300' },
    ]);
    moveInstrumentation(smallImageRow, optimizedPic.querySelector('img'));
    animationDiv.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('cmp-teaser__smallimage');
  }

  block.replaceChildren(teaser);
}
