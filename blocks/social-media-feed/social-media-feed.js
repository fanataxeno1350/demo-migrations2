import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const titleRow = children[0];
  const subtitleRow = children[1];
  const buttonLinkRow = children[2];
  const buttonLabelRow = children[3];

  const socialImageItemRows = children.slice(4);

  const cmpSocial = document.createElement('div');
  cmpSocial.classList.add('cmp-social');
  moveInstrumentation(block, cmpSocial);

  const titleContainer = document.createElement('div');
  titleContainer.classList.add('cmp-social__title-container');

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('title', 'cmp-social__title');
  const cmpTitle = document.createElement('div');
  cmpTitle.classList.add('cmp-title');
  const h2 = document.createElement('h2');
  h2.classList.add('cmp-title__text');
  moveInstrumentation(titleRow, h2);
  h2.textContent = titleRow.textContent.trim();
  cmpTitle.append(h2);
  titleDiv.append(cmpTitle);
  titleContainer.append(titleDiv);

  const subtitleDiv = document.createElement('div');
  subtitleDiv.classList.add('text', 'cmp-social__sub-title', 'body-3');
  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text');
  const p = document.createElement('p');
  moveInstrumentation(subtitleRow, p);
  p.textContent = subtitleRow.textContent.trim();
  cmpText.append(p);
  subtitleDiv.append(cmpText);
  titleContainer.append(subtitleDiv);

  cmpSocial.append(titleContainer);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('cmp-social__card-container', 'cmp-social__card-container--anchor');

  // Group social images into columns (5 columns as per original HTML)
  const numColumns = 5;
  const columns = Array.from({ length: numColumns }, () => {
    const column = document.createElement('div');
    column.classList.add('cmp-social__card-column');
    return column;
  });

  socialImageItemRows.forEach((row, index) => {
    // Fixed schema for social-image-item: [image, link]
    const [imageCell, linkCell] = [...row.children];

    const anchor = document.createElement('a');
    if (linkCell) {
      anchor.href = linkCell.querySelector('a')?.href || '';
    }

    if (imageCell) {
      const img = imageCell.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100%' }]);
        // moveInstrumentation should be from the original cell to the new container, not img to img
        moveInstrumentation(imageCell, optimizedPic);
        anchor.append(optimizedPic);
      }
    }
    moveInstrumentation(row, anchor);
    columns[index % numColumns].append(anchor);
  });

  columns.forEach((col) => cardContainer.append(col));
  cmpSocial.append(cardContainer);

  const socialButtonDiv = document.createElement('div');
  socialButtonDiv.classList.add('socialButton', 'button', 'cmp-button--primary-anchor');

  const buttonLinkAnchor = buttonLinkRow.querySelector('a');
  const buttonLabel = buttonLabelRow.textContent.trim();

  if (buttonLinkAnchor && buttonLabel) {
    const anchor = document.createElement('a');
    anchor.classList.add('cmp-button');
    anchor.href = buttonLinkAnchor.href;
    anchor.target = '_blank'; // Assuming target blank from original HTML
    moveInstrumentation(buttonLinkRow, anchor); // Move instrumentation from the row
    moveInstrumentation(buttonLabelRow, anchor); // Move instrumentation from the row

    const span = document.createElement('span');
    span.classList.add('cmp-button__text');
    span.textContent = buttonLabel;
    anchor.append(span);
    socialButtonDiv.append(anchor);
  }
  cmpSocial.append(socialButtonDiv);

  const gradientDiv = document.createElement('div');
  gradientDiv.classList.add('cmp-social__gradient');
  cmpSocial.append(gradientDiv);

  block.replaceChildren(cmpSocial);
}
