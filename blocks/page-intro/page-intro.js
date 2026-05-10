import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageRow, headlineRow, bodyRow] = [...block.children];

  const root = document.createElement('section');
  root.classList.add('page-intro');

  const imageDiv = document.createElement('div');
  imageDiv.classList.add('image');
  if (imageRow) {
    const picture = imageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDiv.append(optimizedPic);
      }
    }
    moveInstrumentation(imageRow, imageDiv);
  }

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content');
  if (imageRow) {
    contentDiv.classList.add('with-image');
  }

  const innerDiv = document.createElement('div');
  innerDiv.classList.add('inner');

  if (headlineRow) {
    const h1 = document.createElement('h1');
    moveInstrumentation(headlineRow, h1);
    h1.textContent = headlineRow.textContent.trim();
    innerDiv.append(h1);
  }

  if (bodyRow) {
    const bodyContent = document.createElement('div');
    moveInstrumentation(bodyRow, bodyContent);
    // FIX: bodyRow is a row element, its innerHTML includes the cell wrapper.
    // The model indicates 'body' is richtext, so we should read the innerHTML of the cell itself.
    // The cell is the first child of the row.
    bodyContent.innerHTML = bodyRow.innerHTML;
    innerDiv.append(bodyContent);
  }

  contentDiv.append(innerDiv);

  if (imageDiv.children.length > 0) {
    root.append(imageDiv);
  }
  root.append(contentDiv);

  block.replaceChildren(root);
}
