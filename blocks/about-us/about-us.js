import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use array destructuring for fixed-schema root rows
  const [
    sectionTitleRow,
    aboutDescriptionRow,
    aboutPointerImageRow,
    aboutMainImageRow,
    featuresTitleRow,
    ...featureItemRows
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('about-section');

  // About Us Section
  const h2 = document.createElement('h2');
  // sectionTitle is type=text, read from cell.textContent.trim()
  const sectionTitleCell = sectionTitleRow?.children[0];
  if (sectionTitleCell) {
    moveInstrumentation(sectionTitleRow, h2);
    h2.textContent = sectionTitleCell.textContent.trim();
  }
  section.append(h2);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-center');
  container.append(row);

  const col1 = document.createElement('div');
  col1.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-1', 'order-md-1', 'order-2');
  row.append(col1);

  // aboutDescription is type=richtext, read from cell.innerHTML, use <div> as container
  const aboutDescriptionCell = aboutDescriptionRow?.children[0];
  const p = document.createElement('div'); // Changed to div to avoid <p> inside <p>
  if (aboutDescriptionCell) {
    moveInstrumentation(aboutDescriptionRow, p);
    p.innerHTML = aboutDescriptionCell.innerHTML;
  }
  col1.append(p);

  // aboutPointerImage is type=reference
  const aboutPointerImageCell = aboutPointerImageRow?.children[0];
  if (aboutPointerImageCell) {
    const aboutPointerImage = aboutPointerImageCell.querySelector('picture');
    if (aboutPointerImage) {
      const img = aboutPointerImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.classList.add('img-fluid', 'about-pointer');
      p.append(optimizedPic); // Append to the richtext div
    }
  }

  const col2 = document.createElement('div');
  col2.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-2', 'order-md-2', 'order-1');
  row.append(col2);

  // aboutMainImage is type=reference
  const aboutMainImageCell = aboutMainImageRow?.children[0];
  if (aboutMainImageCell) {
    const aboutMainImage = aboutMainImageCell.querySelector('picture');
    if (aboutMainImage) {
      const img = aboutMainImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.classList.add('img-fluid');
      col2.append(optimizedPic);
    }
  }

  // Features Section
  const featuresContainer = document.createElement('div');
  featuresContainer.classList.add('container');
  section.append(featuresContainer);

  const aboutContainer = document.createElement('div');
  aboutContainer.classList.add('about-container', 'shadow-lg');
  featuresContainer.append(aboutContainer);

  const h4 = document.createElement('h4');
  // featuresTitle is type=text, read from cell.textContent.trim()
  const featuresTitleCell = featuresTitleRow?.children[0];
  if (featuresTitleCell) {
    moveInstrumentation(featuresTitleRow, h4);
    h4.textContent = featuresTitleCell.textContent.trim();
  }
  aboutContainer.append(h4);

  const featuresRow = document.createElement('div');
  featuresRow.classList.add('row');
  aboutContainer.append(featuresRow);

  // All remaining children are feature items
  featureItemRows.forEach((rowEl) => {
    // Use array destructuring for fixed-schema feature item cells
    const [featureImageCell, featureTitleCell, featureDescriptionCell] = [...rowEl.children];

    if (featureImageCell && featureTitleCell && featureDescriptionCell) { // Ensure all cells exist
      const col = document.createElement('div');
      col.classList.add('col-lg-4', 'col-md-6', 'col-12');
      moveInstrumentation(rowEl, col); // Move instrumentation from the row to the new column element
      featuresRow.append(col);

      // featureImage is type=reference
      const featureImage = featureImageCell.querySelector('picture');
      if (featureImage) {
        const img = featureImage.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.classList.add('img-fluid');
        col.append(optimizedPic);
      }

      const h5 = document.createElement('h5');
      // featureTitle is type=text, read from cell.textContent.trim()
      if (featureTitleCell) {
        h5.textContent = featureTitleCell.textContent.trim();
      }
      col.append(h5);

      // featureDescription is type=richtext, read from cell.innerHTML, use <div> as container
      const featureP = document.createElement('div'); // Changed to div to avoid <p> inside <p>
      if (featureDescriptionCell) {
        featureP.innerHTML = featureDescriptionCell.innerHTML;
      }
      col.append(featureP);
    }
  });

  block.replaceChildren(section);

  // The original code had a redundant image optimization loop at the end.
  // createOptimizedPicture is already called for each image when it's created.
  // This final loop is not needed and can be removed.
}
