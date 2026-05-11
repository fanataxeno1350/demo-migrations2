import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [mobileImageRow, desktopImageRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-inner-banner'); // Class from ORIGINAL HTML
  // moveInstrumentation(block, section); // Removed: block is replaced, not moved

  // Mobile Banner Image
  const mobileImageCell = mobileImageRow?.firstElementChild;
  if (mobileImageCell) {
    const mobileDiv = document.createElement('div');
    mobileDiv.classList.add('inner-banner', 'brand_mobile'); // Classes from ORIGINAL HTML
    moveInstrumentation(mobileImageRow, mobileDiv); // Move instrumentation from row to new div

    const picture = mobileImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation(img, optimizedPic.querySelector('img')); // Redundant: img is replaced by optimizedPic
        mobileDiv.append(optimizedPic);
      }
    }
    section.append(mobileDiv);
  }

  // Desktop Banner Image
  const desktopImageCell = desktopImageRow?.firstElementChild;
  if (desktopImageCell) {
    const desktopDiv = document.createElement('div');
    desktopDiv.classList.add('inner-banner', 'brand_desktop'); // Classes from ORIGINAL HTML
    moveInstrumentation(desktopImageRow, desktopDiv); // Move instrumentation from row to new div

    const picture = desktopImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]); // Assuming desktop width
        // moveInstrumentation(img, optimizedPic.querySelector('img')); // Redundant: img is replaced by optimizedPic
        desktopDiv.append(optimizedPic);
      }
    }
    section.append(desktopDiv);
  }

  block.replaceChildren(section);
}
