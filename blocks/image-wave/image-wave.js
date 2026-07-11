import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Fixed schema: desktopImage and mobileImage are always the first two rows.
  // Use destructuring for fixed-schema rows.
  const [desktopImageRow, mobileImageRow] = [...block.children];

  const root = document.createElement('div');
  // Class names from ORIGINAL HTML
  root.classList.add('image', 'sticky__wave');

  const imageWrapper = document.createElement('div');
  // Class name from ORIGINAL HTML
  imageWrapper.classList.add('cmp-image');

  // Access the picture element from the first cell of each row
  const desktopPicture = desktopImageRow?.children[0]?.querySelector('picture');
  const mobilePicture = mobileImageRow?.children[0]?.querySelector('picture');

  if (desktopPicture || mobilePicture) {
    const img = desktopPicture ? desktopPicture.querySelector('img') : mobilePicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const pictureElement = optimizedPic.querySelector('picture');

      if (mobilePicture) {
        const mobileSource = document.createElement('source');
        mobileSource.media = '(max-width:767px)';
        mobileSource.srcset = mobilePicture.querySelector('img')?.src;
        pictureElement.prepend(mobileSource);
      }

      const optimizedImg = optimizedPic.querySelector('img');
      // Class name from ORIGINAL HTML
      optimizedImg.classList.add('cmp-image__image');
      optimizedImg.loading = 'lazy';
      optimizedImg.fetchPriority = 'low';

      // moveInstrumentation for both original rows
      moveInstrumentation(desktopImageRow, imageWrapper);
      moveInstrumentation(mobileImageRow, imageWrapper); // Also move instrumentation for mobile image row
      imageWrapper.append(optimizedPic);
    }
  }

  root.append(imageWrapper);
  block.replaceChildren(root);
}
