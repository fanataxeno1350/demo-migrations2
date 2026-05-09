import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [scarpImageRow] = [...block.children];

  const scarpComponent = document.createElement('div');
  scarpComponent.classList.add('scarp-component', 'fade-in');
  scarpComponent.setAttribute('data-fade-in', '');

  const scarpContainer = document.createElement('div');
  scarpContainer.classList.add('scarp_container');

  // Correctly access the cell using destructuring or direct children[0]
  const scarpImageCell = scarpImageRow.children[0];
  const picture = scarpImageCell ? scarpImageCell.querySelector('picture') : null;

  if (picture) {
    // createOptimizedPicture takes the picture element directly or its src/alt
    // If we want to use the existing picture, we can append it directly
    // or create a new optimized one. Given the original HTML, it's an img inside a picture.
    // The original HTML shows an <img> with a specific class.
    // Let's create an optimized picture and then apply the classes.
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      if (optimizedImg) {
        optimizedImg.setAttribute('aria-hidden', 'true');
        optimizedImg.classList.add('scarp-separator__scarp', 'green-scarp');
        moveInstrumentation(scarpImageCell, optimizedImg);
        scarpContainer.append(optimizedPic);
      }
    }
  }

  moveInstrumentation(scarpImageRow, scarpComponent);
  scarpComponent.append(scarpContainer);
  block.replaceChildren(scarpComponent);
}
