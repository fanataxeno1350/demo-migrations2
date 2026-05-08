import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    mainImageRow,
    headlineRow,
    subHeadlineRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    ...categoryItemRows
  ] = children;

  const section = document.createElement('section');
  section.classList.add('itc-how-shift'); // From ORIGINAL HTML

  // Left Image Div
  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('left-image-div'); // From ORIGINAL HTML
  moveInstrumentation(mainImageRow, leftImageDiv);
  const mainPicture = mainImageRow.querySelector('picture');
  if (mainPicture) {
    const mainImg = mainPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(mainImg, optimizedPic.querySelector('img'));
    mainPicture.replaceWith(optimizedPic);
    leftImageDiv.append(optimizedPic);
  }
  section.append(leftImageDiv);

  // Container Read More Div
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'read-more'); // From ORIGINAL HTML
  section.append(containerDiv);

  // Headline
  const headline = document.createElement('h1');
  headline.classList.add('text-center', 'pb-4', 'rs-heading'); // From ORIGINAL HTML
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  containerDiv.append(headline);

  // Read More Text Div (for Sub Headline and Description)
  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text'); // From ORIGINAL HTML
  containerDiv.append(readMoreTextDiv);

  // Sub Headline
  const subHeadline = document.createElement('h2');
  moveInstrumentation(subHeadlineRow, subHeadline);
  subHeadline.textContent = subHeadlineRow.textContent.trim();
  readMoreTextDiv.append(subHeadline);

  // Description
  const description = document.createElement('div'); // Use div for richtext
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.innerHTML; // Read innerHTML directly from the row for richtext
  readMoreTextDiv.append(description);

  // Read More Span (empty in original, for JS functionality)
  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore'); // From ORIGINAL HTML
  containerDiv.append(readMoreSpan);

  // Categories Wrapper
  const categoriesWrapper = document.createElement('div');
  categoriesWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper'); // From ORIGINAL HTML
  containerDiv.append(categoriesWrapper);

  categoryItemRows.forEach((row) => {
    const [imageCell, linkCell, labelCell] = [...row.children]; // Fixed schema, use index destructuring

    const categoryItemDiv = document.createElement('div');
    categoryItemDiv.classList.add('mb-md-0', 'mb-3', 'text-center'); // From ORIGINAL HTML
    moveInstrumentation(row, categoryItemDiv); // Move instrumentation from row to new div

    const itcHealthGoalWrapper = document.createElement('div');
    itcHealthGoalWrapper.classList.add('itc-health-goal-wrapper'); // From ORIGINAL HTML
    categoryItemDiv.append(itcHealthGoalWrapper);

    const categoryPicture = imageCell.querySelector('picture');
    if (categoryPicture) {
      const categoryImg = categoryPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(categoryImg.src, categoryImg.alt, false, [{ width: '200' }]);
      moveInstrumentation(categoryImg, optimizedPic.querySelector('img'));
      categoryPicture.replaceWith(optimizedPic);
      itcHealthGoalWrapper.append(optimizedPic);
    }

    const categoryLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      categoryLink.href = foundLink.href;
      categoryLink.alt = labelCell.textContent.trim(); // Use label as alt text
    }
    categoryLink.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label'); // From ORIGINAL HTML
    categoryLink.innerHTML = labelCell.innerHTML; // richtext label
    categoryItemDiv.append(categoryLink);

    categoriesWrapper.append(categoryItemDiv);
  });

  // Empty div for mobile spacing
  const mobileSpacingDiv = document.createElement('div');
  mobileSpacingDiv.classList.add('d-md-none', 'd-block'); // From ORIGINAL HTML
  containerDiv.append(mobileSpacingDiv);

  // CTA Button
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'how-shift-button'); // From ORIGINAL HTML
  containerDiv.append(buttonDiv);

  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add('cmp-button'); // From ORIGINAL HTML
  const foundCtaLink = ctaLinkRow.querySelector('a');
  if (foundCtaLink) {
    ctaAnchor.href = foundCtaLink.href;
  }
  ctaAnchor.alt = ctaLabelRow.textContent.trim(); // Use label as alt text
  moveInstrumentation(ctaLinkRow, ctaAnchor); // Move instrumentation from ctaLinkRow to new anchor

  const ctaSpanText = document.createElement('span');
  ctaSpanText.classList.add('cmp-button__text'); // From ORIGINAL HTML
  ctaSpanText.textContent = ctaLabelRow.textContent.trim();
  ctaAnchor.append(ctaSpanText);

  // Screen reader only span (empty in original, for accessibility)
  const screenReaderSpan = document.createElement('span');
  screenReaderSpan.classList.add('cmp-link__screen-reader-only'); // From ORIGINAL HTML
  // No specific text content for this span in the provided original HTML example
  ctaAnchor.append(screenReaderSpan);

  buttonDiv.append(ctaAnchor);
  moveInstrumentation(ctaLabelRow, ctaAnchor); // Also move instrumentation from ctaLabelRow

  block.replaceChildren(section);
}
