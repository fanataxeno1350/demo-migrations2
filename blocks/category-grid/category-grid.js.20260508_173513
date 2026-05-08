import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    variationImageRow,
    headingRow,
    subheadingRow,
    descriptionRow,
    ctaLabelRow,
    ctaLinkRow,
    ...categoryItemRows
  ] = children;

  const section = document.createElement('section');
  // section.classList.add('itc-how-shift'); // Block name class already on outer div
  moveInstrumentation(block, section);

  // Left Image Div
  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('left-image-div');
  moveInstrumentation(variationImageRow, leftImageDiv);
  const variationPicture = variationImageRow.querySelector('picture');
  if (variationPicture) {
    const img = variationPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    leftImageDiv.append(optimizedPic);
  }
  section.append(leftImageDiv);

  // Container Read More Div
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'read-more');

  // Heading
  const heading = document.createElement('h1');
  heading.classList.add('text-center', 'pb-4', 'rs-heading');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  containerDiv.append(heading);

  // Subheading and Description
  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text');
  moveInstrumentation(subheadingRow, readMoreTextDiv);

  const subheading = document.createElement('h2');
  subheading.textContent = subheadingRow.textContent.trim();
  readMoreTextDiv.append(subheading);

  const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Read from cell's innerHTML
  readMoreTextDiv.append(description);

  containerDiv.append(readMoreTextDiv);

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore');
  containerDiv.append(readMoreSpan);

  // Category Grid Wrapper
  const whyShiftWrapper = document.createElement('div');
  whyShiftWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper');

  categoryItemRows.forEach((row) => {
    const [imageCell, labelCell, linkCell] = [...row.children];

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('mb-md-0', 'mb-3', 'text-center');
    moveInstrumentation(row, itemDiv);

    const itcHealthGoalWrapper = document.createElement('div');
    itcHealthGoalWrapper.classList.add('itc-health-goal-wrapper');

    const categoryPicture = imageCell.querySelector('picture');
    if (categoryPicture) {
      const img = categoryPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      itcHealthGoalWrapper.append(optimizedPic);
    }
    itemDiv.append(itcHealthGoalWrapper);

    const categoryLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      categoryLink.href = foundLink.href;
    }
    categoryLink.alt = labelCell.textContent.trim();
    categoryLink.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');
    categoryLink.textContent = labelCell.textContent.trim();
    itemDiv.append(categoryLink);

    whyShiftWrapper.append(itemDiv);
  });

  containerDiv.append(whyShiftWrapper);

  const emptyDiv = document.createElement('div');
  emptyDiv.classList.add('d-md-none', 'd-block');
  containerDiv.append(emptyDiv);

  // CTA Button
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'how-shift-button');
  moveInstrumentation(ctaLinkRow, buttonDiv);

  const ctaAnchor = document.createElement('a');
  const foundCtaLink = ctaLinkRow.querySelector('a');
  if (foundCtaLink) {
    ctaAnchor.href = foundCtaLink.href;
  }
  ctaAnchor.classList.add('cmp-button');
  ctaAnchor.alt = ctaLabelRow.textContent.trim(); // Use ctaLabelRow for alt text

  const ctaSpanText = document.createElement('span');
  ctaSpanText.classList.add('cmp-button__text');
  ctaSpanText.textContent = ctaLabelRow.textContent.trim();
  ctaAnchor.append(ctaSpanText);

  // Add a screen reader only span for external links if needed
  if (ctaAnchor.href && !ctaAnchor.href.startsWith(window.location.origin)) {
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    ctaAnchor.append(screenReaderSpan);
    ctaAnchor.target = '_blank';
  }

  buttonDiv.append(ctaAnchor);
  containerDiv.append(buttonDiv);

  section.append(containerDiv);

  block.replaceChildren(section);
}
