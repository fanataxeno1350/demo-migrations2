import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Root-level rows are read by index as per BlockJson model
  const sectionTitleRow = children[0];
  const aboutDescriptionRow = children[1];
  const aboutPointerImageRow = children[2];
  const aboutMainImageRow = children[3];
  const featureSectionTitleRow = children[4];
  // block.children[5] is the placeholder for the 'features' container,
  // but it doesn't contain content itself, only marks the position.
  // The actual feature item rows start from children[5] in the original array,
  // but since we're slicing from 6, we need to adjust the index for the container.
  // The BlockJson indicates 'features' is a container, so the row at index 5
  // is just a placeholder for the container's instrumentation.
  const featuresContainerPlaceholderRow = children[5];
  const featureItemRows = children.slice(6);

  const aboutSection = document.createElement('section');
  aboutSection.classList.add('about-section');

  // Section Title
  const sectionTitle = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, sectionTitle);
  sectionTitle.textContent = sectionTitleRow.textContent.trim();
  aboutSection.append(sectionTitle);

  // About Us Description and Main Image Section
  const container = document.createElement('div');
  container.classList.add('container');
  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');

  const descriptionCol = document.createElement('div');
  descriptionCol.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-1', 'order-md-1', 'order-2');
  const descriptionP = document.createElement('p');
  moveInstrumentation(aboutDescriptionRow, descriptionP);
  // FIX: aboutDescription is richtext, so use innerHTML directly from the cell
  descriptionP.innerHTML = aboutDescriptionRow.children[0]?.innerHTML || '';

  const aboutPointerImage = aboutPointerImageRow.children[0]?.querySelector('picture');
  if (aboutPointerImage) {
    const img = aboutPointerImage.querySelector('img');
    // createOptimizedPicture already handles img-fluid, just add about-pointer if needed
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('img-fluid', 'about-pointer');
    moveInstrumentation(aboutPointerImageRow.children[0], optimizedPic.querySelector('img'));
    descriptionP.append(optimizedPic);
  }
  descriptionCol.append(descriptionP);

  const mainImageCol = document.createElement('div');
  mainImageCol.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-2', 'order-md-2', 'order-1');
  const aboutMainImage = aboutMainImageRow.children[0]?.querySelector('picture');
  if (aboutMainImage) {
    const img = aboutMainImage.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('img-fluid');
    moveInstrumentation(aboutMainImageRow.children[0], optimizedPic.querySelector('img'));
    mainImageCol.append(optimizedPic);
  }

  row.append(descriptionCol, mainImageCol);
  container.append(row);
  aboutSection.append(container);

  // Features Section
  const featuresContainer = document.createElement('div');
  featuresContainer.classList.add('container');
  // Move instrumentation from the placeholder row for the 'features' container
  moveInstrumentation(featuresContainerPlaceholderRow, featuresContainer);

  const aboutContainer = document.createElement('div');
  aboutContainer.classList.add('about-container', 'shadow-lg');

  const featureSectionTitle = document.createElement('h4');
  moveInstrumentation(featureSectionTitleRow, featureSectionTitle);
  featureSectionTitle.textContent = featureSectionTitleRow.textContent.trim();
  aboutContainer.append(featureSectionTitle);

  const featureRow = document.createElement('div');
  featureRow.classList.add('row');

  featureItemRows.forEach((rowEl) => {
    // FIX: Use array destructuring for fixed-schema item rows
    const [featureImageCell, featureTitleCell, featureDescriptionCell] = [...rowEl.children];

    const col = document.createElement('div');
    col.classList.add('col-lg-4', 'col-md-6', 'col-12');

    const featureImage = featureImageCell?.querySelector('picture');
    if (featureImage) {
      const img = featureImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid');
      moveInstrumentation(featureImageCell, optimizedPic.querySelector('img'));
      col.append(optimizedPic);
    }

    const featureTitle = document.createElement('h5');
    moveInstrumentation(featureTitleCell, featureTitle);
    featureTitle.textContent = featureTitleCell?.textContent.trim() || '';
    col.append(featureTitle);

    const featureDescription = document.createElement('p');
    moveInstrumentation(featureDescriptionCell, featureDescription);
    // FIX: featureDescription is richtext, use innerHTML
    featureDescription.innerHTML = featureDescriptionCell?.innerHTML || '';
    col.append(featureDescription);

    moveInstrumentation(rowEl, col); // Move instrumentation from the item row
    featureRow.append(col);
  });

  aboutContainer.append(featureRow);
  featuresContainer.append(aboutContainer);
  aboutSection.append(featuresContainer);

  block.replaceChildren(aboutSection);

  // FIX: Removed redundant image optimization loop. createOptimizedPicture already
  // replaces the picture element. This loop was attempting to re-optimize images
  // that were already handled, and moveInstrumentation was called on 'img'
  // which might not be the original instrumented element after replaceWith.
  // The createOptimizedPicture calls above are sufficient.
}
