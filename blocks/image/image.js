import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [desktopImageRow, mobileImageRow] = [...block.children];

  // desktopImageCell and mobileImageCell are already the div elements,
  // no need for querySelector('div')
  const desktopImageCell = desktopImageRow ? desktopImageRow.children[0] : null;
  const mobileImageCell = mobileImageRow ? mobileImageRow.children[0] : null;

  const picture = document.createElement('picture');
  picture.classList.add('cmp-image');
  // moveInstrumentation should be called on the block itself, not the picture,
  // as the picture is replacing the block's content.
  // moveInstrumentation(block, picture); // This was incorrect.

  let mobileSource = null;
  if (mobileImageCell) {
    const mobileImg = mobileImageCell.querySelector('img');
    if (mobileImg) {
      mobileSource = document.createElement('source');
      mobileSource.media = '(max-width:767px)';
      mobileSource.srcset = mobileImg.src;
      picture.append(mobileSource);
    }
  }

  let desktopImgElement = null;
  if (desktopImageCell) {
    const desktopImg = desktopImageCell.querySelector('img');
    if (desktopImg) {
      // createOptimizedPicture returns a <picture> element.
      // We need to extract its <img> and potentially its <source> if it generates one.
      const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      desktopImgElement = optimizedPic.querySelector('img');
      desktopImgElement.classList.add('cmp-image__image');
      // moveInstrumentation should be on the original cell, not the new img element
      moveInstrumentation(desktopImageCell, desktopImgElement);

      // If mobileSource was created, it's already in 'picture'.
      // If optimizedPic generated a source for desktop, append it.
      // The original HTML only has one source for mobile, and the img for desktop.
      // So, we only append the desktop image here.
      if (optimizedPic.querySelector('source') && !mobileSource) {
        // Only append if there's a source and we didn't already add a mobile source
        picture.append(optimizedPic.querySelector('source'));
      }
      picture.append(desktopImgElement);
    }
  }

  // Move instrumentation from the original block to the new picture element
  // before replacing children.
  moveInstrumentation(block, picture);
  block.replaceChildren(picture);
}
