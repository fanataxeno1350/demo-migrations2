import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const mainImageRow = children[0];
  const mainHeadingRow = children[1];
  const subHeadingRow = children[2];
  const descriptionRow = children[3];
  const buttonLabelRow = children[4];
  const buttonLinkRow = children[5];

  const categoryItemRows = children.slice(6);

  const root = document.createElement('section');
  // root.classList.add('itc-how-shift'); // Removed: Block already has this class from AEM

  // Left Image Div
  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('left-image-div');
  leftImageDiv.id = 'leftDivId';
  if (mainImageRow) {
    const picture = mainImageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      leftImageDiv.append(optimizedPic);
    }
    moveInstrumentation(mainImageRow, leftImageDiv);
  }
  root.append(leftImageDiv);

  // Container Read More Div
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'read-more');

  // Main Heading
  if (mainHeadingRow) {
    const mainHeading = document.createElement('h1');
    mainHeading.classList.add('text-center', 'pb-4', 'rs-heading');
    mainHeading.textContent = mainHeadingRow.textContent.trim();
    moveInstrumentation(mainHeadingRow, mainHeading);
    containerDiv.append(mainHeading);
  }

  // Sub Heading and Description
  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text');
  if (subHeadingRow) {
    const subHeading = document.createElement('h2');
    subHeading.textContent = subHeadingRow.textContent.trim();
    moveInstrumentation(subHeadingRow, subHeading);
    readMoreTextDiv.append(subHeading);
  }
  if (descriptionRow) {
    const description = document.createElement('div'); // Changed from p to div to avoid <p> inside <p>
    description.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Read from cell's child to get inner content
    moveInstrumentation(descriptionRow, description);
    readMoreTextDiv.append(description);
  }
  if (subHeadingRow || descriptionRow) {
    containerDiv.append(readMoreTextDiv);
  }

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore');
  containerDiv.append(readMoreSpan);

  // Add event listener for the readMoreSpan (assuming it's a toggle)
  readMoreSpan.addEventListener('click', () => {
    readMoreTextDiv.classList.toggle('expanded'); // Example toggle class
    readMoreSpan.textContent = readMoreTextDiv.classList.contains('expanded') ? 'Read Less' : 'Read More';
  });
  // Initialize text content for readMoreSpan
  readMoreSpan.textContent = 'Read More';


  // Categories Wrapper
  const whyShiftWrapper = document.createElement('div');
  whyShiftWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper');

  categoryItemRows.forEach((row) => {
    const categoryItemDiv = document.createElement('div');
    categoryItemDiv.classList.add('mb-md-0', 'mb-3', 'text-center');

    const itcHealthGoalWrapper = document.createElement('div');
    itcHealthGoalWrapper.classList.add('itc-health-goal-wrapper');

    // Destructure cells for fixed schema category-item
    const [categoryImageCell, categoryLinkLabelCell, categoryLinkCell] = [...row.children];

    const categoryImagePicture = categoryImageCell?.querySelector('picture');
    if (categoryImagePicture) {
      const img = categoryImagePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      itcHealthGoalWrapper.append(optimizedPic);
    }
    categoryItemDiv.append(itcHealthGoalWrapper);

    const categoryLink = document.createElement('a');
    const foundLink = categoryLinkCell?.querySelector('a');
    if (foundLink) {
      categoryLink.href = foundLink.href;
    }
    categoryLink.textContent = categoryLinkLabelCell?.textContent.trim() || '';
    categoryLink.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');
    categoryItemDiv.append(categoryLink);

    moveInstrumentation(row, categoryItemDiv);
    whyShiftWrapper.append(categoryItemDiv);
  });

  containerDiv.append(whyShiftWrapper);

  const mobileDiv = document.createElement('div');
  mobileDiv.classList.add('d-md-none', 'd-block');
  containerDiv.append(mobileDiv);

  // Button
  if (buttonLabelRow && buttonLinkRow) {
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'how-shift-button');

    const buttonAnchor = document.createElement('a');
    const foundButtonLink = buttonLinkRow.querySelector('a');
    if (foundButtonLink) {
      buttonAnchor.href = foundButtonLink.href;
    }
    buttonAnchor.classList.add('cmp-button');

    const buttonSpan = document.createElement('span');
    buttonSpan.classList.add('cmp-button__text');
    buttonSpan.textContent = buttonLabelRow.textContent.trim();
    buttonAnchor.append(buttonSpan);

    moveInstrumentation(buttonLabelRow, buttonAnchor);
    moveInstrumentation(buttonLinkRow, buttonAnchor);

    buttonDiv.append(buttonAnchor);
    containerDiv.append(buttonDiv);
  }

  root.append(containerDiv);
  block.replaceChildren(root);
}
