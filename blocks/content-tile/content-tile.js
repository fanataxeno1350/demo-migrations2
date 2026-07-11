import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    ...itemRows
  ] = [...block.children];

  const root = document.createElement('div');
  // Removed 'cmp-our-values' as the outer block div already has it.
  root.classList.add('cmp-our-values--better-world');

  // Block Title
  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('cmp-our-values__title-wrapper');
  const title = document.createElement('h1');
  title.classList.add('cmp-our-values__title', 'star-icon');
  moveInstrumentation(titleRow, title);
  // Title is a text field, read from the cell directly.
  title.textContent = titleRow.children[0]?.textContent.trim() || '';
  titleWrapper.append(title);
  root.append(titleWrapper);

  // Items Container
  const itemContainer = document.createElement('div');
  itemContainer.classList.add('cmp-our-values__item-container');

  itemRows
    .filter(
      (row) =>
        row.children.length === 3 &&
        (row.querySelector('picture') ||
          row.children[1]?.textContent.trim() || // Check second cell
          row.children[2]?.textContent.trim()), // Check third cell
    )
    .forEach((row) => {
      const detailsContainer = document.createElement('div');
      detailsContainer.classList.add('cmp-our-values__details-container');

      // Item rows have a fixed schema: [image, title, description]
      const [imageCell, titleCell, descriptionCell] = [...row.children];

      // Image
      if (imageCell) {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('cmp-our-values__item-image-container');
        const lazyImageContainer = document.createElement('div');
        lazyImageContainer.classList.add('lazy-image-container');
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(
              img.src,
              img.alt,
              false,
              [{ width: '750' }],
            );
            optimizedPic
              .querySelector('img')
              .classList.add('cmp-our-values__item-image', 'lazy-image', 'loaded');
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            lazyImageContainer.append(optimizedPic);
          }
        }
        imageContainer.append(lazyImageContainer);
        detailsContainer.append(imageContainer);
      }

      // Content Wrapper
      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('cmp-our-values__item-content-wrapper');

      // Tile Title
      if (titleCell) {
        const itemTitle = document.createElement('div');
        itemTitle.classList.add('cmp-our-values__item-title');
        itemTitle.textContent = titleCell.textContent.trim();
        contentWrapper.append(itemTitle);
      }

      // Tile Description
      if (descriptionCell) {
        const itemDescription = document.createElement('div');
        itemDescription.classList.add('cmp-our-values__item-title--description');
        itemDescription.textContent = descriptionCell.textContent.trim();
        contentWrapper.append(itemDescription);
      }

      detailsContainer.append(contentWrapper);
      moveInstrumentation(row, detailsContainer);
      itemContainer.append(detailsContainer);
    });
  root.append(itemContainer);

  // Block Description
  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('cmp-our-values__description-container');
  const description = document.createElement('div');
  description.classList.add('cmp-our-values__description');
  moveInstrumentation(descriptionRow, description);
  // Description is a richtext field, read from the cell directly.
  description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  descriptionContainer.append(description);
  root.append(descriptionContainer);

  // CTA Link
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add(
    'button',
    'cmp-button--primary-anchor',
    'cmp-button--primary-anchor-undefined',
  );
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('cmp-button');
  const foundLink = ctaLinkRow.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
  }
  ctaLink.target = '_self'; // Assuming default target as _self based on original HTML

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add('cmp-button__text');
  moveInstrumentation(ctaLabelRow, ctaLabelSpan);
  // CTA Label is a text field, read from the cell directly.
  ctaLabelSpan.textContent = ctaLabelRow.children[0]?.textContent.trim() || '';
  ctaLink.append(ctaLabelSpan);
  buttonWrapper.append(ctaLink);
  // Move instrumentation from ctaLinkRow to the buttonWrapper, which is the direct parent of the link
  moveInstrumentation(ctaLinkRow, buttonWrapper);
  root.append(buttonWrapper);

  block.replaceChildren(root);
}
