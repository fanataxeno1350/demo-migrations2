import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const [
    titleRow,
    subtitleRow,
    ctaLinkRow,
    ctaLabelRow,
    ...cardRows
  ] = children;

  const cmpSocial = document.createElement('div');
  cmpSocial.classList.add('cmp-social'); // This class is already on the outer block div, but the original HTML also has it on this inner wrapper.

  // Title Container
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('cmp-social__title-container');

  // Section Title
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('title', 'cmp-social__title');
  moveInstrumentation(titleRow, titleDiv);

  const cmpTitle = document.createElement('div');
  cmpTitle.classList.add('cmp-title', 'title-star-icon');

  const h2 = document.createElement('h2');
  h2.classList.add('cmp-title__text');
  h2.textContent = titleRow.textContent.trim();
  cmpTitle.append(h2);
  titleDiv.append(cmpTitle);
  titleContainer.append(titleDiv);

  // Section Subtitle
  const subtitleDiv = document.createElement('div');
  subtitleDiv.classList.add('text', 'cmp-social__sub-title', 'body-3');
  moveInstrumentation(subtitleRow, subtitleDiv);

  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text');

  const p = document.createElement('p');
  p.textContent = subtitleRow.textContent.trim();
  cmpText.append(p);
  subtitleDiv.append(cmpText);
  titleContainer.append(subtitleDiv);

  cmpSocial.append(titleContainer);

  // Social Media Cards Container
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('cmp-social__card-container', 'cmp-social__card-container--anchor');

  // Group cards into columns (assuming 4 columns as per original HTML structure)
  const columns = Array.from({ length: 4 }, () => {
    const col = document.createElement('div');
    col.classList.add('cmp-social__card-column');
    return col;
  });

  cardRows.forEach((row, index) => {
    const [imageCell, linkCell] = [...row.children];

    const column = columns[index % columns.length];

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    moveInstrumentation(row, anchor);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // createOptimizedPicture handles lazy loading and source sets
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100%' }]);
        // The original HTML has js-lazy-image on the img tag, not the picture tag.
        // createOptimizedPicture returns a <picture> element, so we need to target its <img> child.
        optimizedPic.querySelector('img').classList.add('js-lazy-image');
        moveInstrumentation(img, optimizedPic.querySelector('img')); // Move instrumentation from original img to new img
        anchor.append(optimizedPic);
      }
    }
    column.append(anchor);
  });

  columns.forEach((col) => cardContainer.append(col));
  cmpSocial.append(cardContainer);

  // CTA Button
  const socialButton = document.createElement('div');
  socialButton.classList.add('socialButton', 'button', 'cmp-button--primary-anchor');
  moveInstrumentation(ctaLinkRow, socialButton); // Move instrumentation from ctaLinkRow

  const ctaLink = ctaLinkRow.querySelector('a');
  const ctaLabel = ctaLabelRow.textContent.trim();

  if (ctaLink && ctaLabel) {
    const buttonAnchor = document.createElement('a');
    buttonAnchor.id = `button-${Math.random().toString(36).substring(2, 9)}`; // Unique ID
    buttonAnchor.classList.add('cmp-button');
    buttonAnchor.href = ctaLink.href;
    buttonAnchor.target = '_blank'; // Assuming target blank from original HTML
    buttonAnchor.setAttribute('data-request', 'true');

    const buttonTextSpan = document.createElement('span');
    buttonTextSpan.classList.add('cmp-button__text');
    buttonTextSpan.textContent = ctaLabel;
    buttonAnchor.append(buttonTextSpan);
    socialButton.append(buttonAnchor);
  }
  cmpSocial.append(socialButton);

  // Gradient
  const gradientDiv = document.createElement('div');
  gradientDiv.classList.add('cmp-social__gradient');
  cmpSocial.append(gradientDiv);

  block.replaceChildren(cmpSocial);
}
