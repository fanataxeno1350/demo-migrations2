import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [scarpImageRow] = [...block.children];

  const scarpComponent = document.createElement('div');
  scarpComponent.classList.add('scarp-component', 'fade-in');
  scarpComponent.setAttribute('data-fade-in', '');

  const scarpContainer = document.createElement('div');
  scarpContainer.classList.add('scarp_container');

  if (scarpImageRow) {
    // FIX: Use index destructuring for fixed schema row, as per BlockJson model
    const [imageCell] = [...scarpImageRow.children];
    const picture = imageCell ? imageCell.querySelector('picture') : null;
    const img = picture ? picture.querySelector('img') : null;

    if (img) {
      const newPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const newImgElement = newPicture.querySelector('img');
      newImgElement.classList.add('scarp-separator__scarp', 'green-scarp');
      newImgElement.setAttribute('aria-hidden', 'true');
      // FIX: moveInstrumentation should be applied to the picture element, not the img
      moveInstrumentation(picture, newPicture);
      scarpContainer.append(newPicture);
    }
    // moveInstrumentation for the row is also correct
    moveInstrumentation(scarpImageRow, scarpContainer);
  }

  scarpComponent.append(scarpContainer);
  block.replaceChildren(scarpComponent);
}
