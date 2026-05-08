import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [scarpImageRow] = [...block.children];

  const scarpComponent = document.createElement('div');
  scarpComponent.classList.add('scarp-component', 'fade-in');
  scarpComponent.setAttribute('data-fade-in', '');

  const scarpContainer = document.createElement('div');
  scarpContainer.classList.add('scarp_container');

  // FIX: Replaced direct row.children[0] with array destructuring for fixed-schema row
  const [scarpImageCell] = [...scarpImageRow.children];
  const picture = scarpImageCell.querySelector('picture');
  const img = picture ? picture.querySelector('img') : null;

  if (img) {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('scarp-separator__scarp', 'green-scarp');
    optimizedImg.setAttribute('aria-hidden', 'true');
    moveInstrumentation(img, optimizedImg);
    scarpContainer.append(optimizedPic);
  }

  moveInstrumentation(scarpImageRow, scarpComponent);
  scarpComponent.append(scarpContainer);
  block.replaceChildren(scarpComponent);
}
