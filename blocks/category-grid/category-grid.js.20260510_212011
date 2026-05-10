import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    variationImageRow,
    mainTitleRow,
    subtitleRow,
    descriptionRow,
    ...restRows
  ] = children;

  const ctaLinkRow = restRows.find(
    (row) => row.children.length === 1 && row.querySelector('a'),
  );
  const ctaLabelRow = restRows.find(
    (row) => row.children.length === 1 && !row.querySelector('a'),
  );
  const categoryItemRows = restRows.filter(
    (row) => row.children.length === 3,
  );

  const section = document.createElement('section');
  section.classList.add('itc-how-shift');

  // Left Image Div
  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('left-image-div');
  leftImageDiv.id = 'leftDivId';
  if (variationImageRow) {
    const picture = variationImageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '750' }],
      );
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      leftImageDiv.append(optimizedPic);
    }
    moveInstrumentation(variationImageRow, leftImageDiv);
  }
  section.append(leftImageDiv);

  // Container Read More Div
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'read-more');

  // Main Title
  if (mainTitleRow) {
    const mainTitle = document.createElement('h1');
    mainTitle.classList.add('text-center', 'pb-4', 'rs-heading');
    moveInstrumentation(mainTitleRow, mainTitle);
    mainTitle.textContent = mainTitleRow.textContent.trim();
    containerDiv.append(mainTitle);
  }

  // Subtitle and Description
  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text');
  if (subtitleRow) {
    const subtitle = document.createElement('h2');
    moveInstrumentation(subtitleRow, subtitle);
    subtitle.textContent = subtitleRow.textContent.trim();
    readMoreTextDiv.append(subtitle);
  }
  if (descriptionRow) {
    const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    moveInstrumentation(descriptionRow, description);
    description.innerHTML = descriptionRow.innerHTML; // Read innerHTML directly from the row
    readMoreTextDiv.append(description);
  }
  containerDiv.append(readMoreTextDiv);

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore');
  containerDiv.append(readMoreSpan);

  // Category Grid Items
  if (categoryItemRows.length > 0) {
    const whyShiftWrapper = document.createElement('div');
    whyShiftWrapper.classList.add(
      'd-flex',
      'justify-content-evenly',
      'flex-wrap',
      'why-shift-wrapper',
    );

    categoryItemRows.forEach((row) => {
      const [categoryImageCell, categoryLinkCell, categoryLabelCell] = [
        ...row.children,
      ];

      const itemDiv = document.createElement('div');
      itemDiv.classList.add('mb-md-0', 'mb-3', 'text-center');

      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('itc-health-goal-wrapper');
      if (categoryImageCell) {
        const picture = categoryImageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(
            img.src,
            img.alt,
            false,
            [{ width: '750' }],
          );
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageWrapper.append(optimizedPic);
        }
      }
      itemDiv.append(imageWrapper);

      const link = document.createElement('a');
      link.classList.add(
        'text-center',
        'd-block',
        'text-capitalize',
        'pt-2',
        'image-label',
      );
      const foundLink = categoryLinkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      if (categoryLabelCell) {
        // categoryLabel is richtext, so use innerHTML
        link.innerHTML = categoryLabelCell.innerHTML;
      }
      moveInstrumentation(row, link);
      itemDiv.append(link);
      whyShiftWrapper.append(itemDiv);
    });
    containerDiv.append(whyShiftWrapper);
  }

  const emptyDiv = document.createElement('div');
  emptyDiv.classList.add('d-md-none', 'd-block');
  containerDiv.append(emptyDiv);

  // CTA Button
  if (ctaLinkRow && ctaLabelRow) {
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'how-shift-button');

    const ctaAnchor = document.createElement('a');
    ctaAnchor.classList.add('cmp-button');
    const foundCtaLink = ctaLinkRow.querySelector('a');
    if (foundCtaLink) {
      ctaAnchor.href = foundCtaLink.href;
    }

    const spanText = document.createElement('span');
    spanText.classList.add('cmp-button__text');
    spanText.textContent = ctaLabelRow.textContent.trim();
    ctaAnchor.append(spanText);

    const spanScreenReader = document.createElement('span');
    spanScreenReader.classList.add('cmp-link__screen-reader-only');
    spanScreenReader.textContent = 'opens in a new tab'; // Default text, adjust if needed
    ctaAnchor.append(spanScreenReader);

    moveInstrumentation(ctaLinkRow, ctaAnchor);
    moveInstrumentation(ctaLabelRow, ctaAnchor);
    buttonDiv.append(ctaAnchor);
    containerDiv.append(buttonDiv);
  }

  section.append(containerDiv);
  block.replaceChildren(section);

  // The following block.querySelectorAll('picture > img') loop is redundant
  // because createOptimizedPicture is already called for each image when it's appended.
  // Removing it to prevent double optimization and potential issues.
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
  //     { width: '750' },
  //   ]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
