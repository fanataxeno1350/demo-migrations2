import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [desktopImageRow, mobileImageRow] = [...block.children];

  // Image cells contain the picture/img directly, not wrapped in an extra div.
  // Access the first child of the row, which is the cell itself.
  const desktopImageCell = desktopImageRow?.children[0];
  const mobileImageCell = mobileImageRow?.children[0];

  const picture = document.createElement('picture');
  picture.classList.add('cmp-image');

  if (mobileImageCell) {
    const mobileImg = mobileImageCell.querySelector('img');
    if (mobileImg) {
      const source = document.createElement('source');
      source.media = '(max-width:767px)';
      source.srcset = mobileImg.src;
      picture.append(source);
      // moveInstrumentation should be called on the original cell, not the source element
      moveInstrumentation(mobileImageCell, source);
    }
  }

  if (desktopImageCell) {
    const desktopImg = desktopImageCell.querySelector('img');
    if (desktopImg) {
      // createOptimizedPicture returns a <picture> element, but we only need the <img> inside it.
      // The original HTML shows the <img> directly appended to the <picture> element.
      const optimizedPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      const img = optimizedPicture.querySelector('img');
      img.classList.add('cmp-image__image');
      picture.append(img);
      // moveInstrumentation should be called on the original cell, not the img element
      moveInstrumentation(desktopImageCell, img);
    }
  }

  const wrapper = document.createElement('div');
  wrapper.classList.add('image', 'sticky__wave');
  // moveInstrumentation for the block itself, moving its original instrumentation to the new wrapper
  moveInstrumentation(block, wrapper);
  wrapper.append(picture);

  block.replaceChildren(wrapper);
}
