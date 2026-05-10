import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Destructure fixed fields
  const [
    leftImageRow,
    mainHeadingRow,
    sectionTitleRow,
    sectionDescriptionRow,
    ...restRows
  ] = children;

  // Identify CTA rows and category item rows using content detection
  // Based on BlockJson and original HTML, ctaLabel and ctaLink are the first two rows
  // after the fixed header rows, and they each have 1 cell.
  // Category item rows have 3 cells and contain a picture and a link.
  const ctaLabelRow = restRows.find(
    (row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'),
  );
  const ctaLinkRow = restRows.find(
    (row) => row.children.length === 1 && row.querySelector('a'),
  );
  const categoryItemRows = restRows.filter(
    (row) => row.children.length === 3 && row.querySelector('picture') && row.querySelector('a'),
  );

  const section = document.createElement('section');
  section.classList.add('itc-how-shift');
  moveInstrumentation(block, section);

  // Left Image Div
  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('left-image-div');
  if (leftImageRow) {
    const picture = leftImageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(leftImageRow, optimizedPic.querySelector('img'));
        leftImageDiv.append(optimizedPic);
      }
    }
  }
  section.append(leftImageDiv);

  // Container for text and categories
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'read-more');

  // Main Heading
  if (mainHeadingRow) {
    const mainHeading = document.createElement('h1');
    mainHeading.classList.add('text-center', 'pb-4', 'rs-heading');
    moveInstrumentation(mainHeadingRow, mainHeading);
    mainHeading.textContent = mainHeadingRow.textContent.trim();
    containerDiv.append(mainHeading);
  }

  // Section Title and Description
  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text');

  if (sectionTitleRow) {
    const sectionTitle = document.createElement('h2');
    moveInstrumentation(sectionTitleRow, sectionTitle);
    sectionTitle.textContent = sectionTitleRow.textContent.trim();
    readMoreTextDiv.append(sectionTitle);
  }

  if (sectionDescriptionRow) {
    const sectionDescription = document.createElement('div'); // Use div for richtext content
    moveInstrumentation(sectionDescriptionRow, sectionDescription);
    sectionDescription.innerHTML = sectionDescriptionRow.children[0]?.innerHTML || ''; // Read from cell's innerHTML
    readMoreTextDiv.append(sectionDescription);
  }
  containerDiv.append(readMoreTextDiv);

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore');
  containerDiv.append(readMoreSpan);

  // Category Items
  const whyShiftWrapper = document.createElement('div');
  whyShiftWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper');

  categoryItemRows.forEach((row) => {
    const [categoryImageCell, categoryLabelCell, categoryLinkCell] = [...row.children];

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('mb-md-0', 'mb-3', 'text-center');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('itc-health-goal-wrapper');
    const picture = categoryImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(categoryImageCell, optimizedPic.querySelector('img'));
        imageWrapper.append(optimizedPic);
      }
    }
    itemDiv.append(imageWrapper);

    const linkEl = document.createElement('a');
    linkEl.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');
    const foundLink = categoryLinkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.alt = categoryLabelCell.textContent.trim();
    }
    linkEl.textContent = categoryLabelCell.textContent.trim();
    moveInstrumentation(row, linkEl);
    itemDiv.append(linkEl);

    whyShiftWrapper.append(itemDiv);
  });
  containerDiv.append(whyShiftWrapper);

  const emptyDiv = document.createElement('div');
  emptyDiv.classList.add('d-md-none', 'd-block');
  containerDiv.append(emptyDiv);

  // CTA Button
  if (ctaLabelRow && ctaLinkRow) {
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'how-shift-button');

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('cmp-button');
    const foundCtaLink = ctaLinkRow.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
      ctaLink.alt = ctaLabelRow.textContent.trim();
    }

    const spanText = document.createElement('span');
    spanText.classList.add('cmp-button__text');
    spanText.textContent = ctaLabelRow.textContent.trim();
    ctaLink.append(spanText);

    const spanSrOnly = document.createElement('span');
    spanSrOnly.classList.add('cmp-link__screen-reader-only');
    spanSrOnly.textContent = 'opens in a new tab';
    ctaLink.append(spanSrOnly);

    moveInstrumentation(ctaLinkRow, ctaLink);
    buttonDiv.append(ctaLink);
    containerDiv.append(buttonDiv);
  }

  section.append(containerDiv);
  block.replaceChildren(section);
}
