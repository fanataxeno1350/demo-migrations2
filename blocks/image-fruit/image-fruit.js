import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // block.children[0] is imageDesktopRow, block.children[1] is imageMobileRow
  const [imageDesktopRow, imageMobileRow] = [...block.children];

  // The cell itself contains the picture element, not an inner div.
  // Access the cell directly.
  const imageDesktopCell = imageDesktopRow;
  const imageMobileCell = imageMobileRow;

  const pictureDesktop = imageDesktopCell?.querySelector('picture');
  const pictureMobile = imageMobileCell?.querySelector('picture');

  const wrapper = document.createElement('div');
  wrapper.classList.add('image', 'sticky__wave');

  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cmp-image');
  imageDiv.setAttribute('itemscope', '');
  imageDiv.setAttribute('itemtype', 'http://schema.org/ImageObject');

  if (pictureDesktop) {
    const imgDesktop = pictureDesktop.querySelector('img');
    if (imgDesktop) {
      // createOptimizedPicture expects an img element or its src/alt
      // The '767' width is for the desktop image, not the mobile source.
      // The original HTML shows the desktop image having no max-width source.
      // The mobile source is for (max-width:767px).
      const optimizedPicDesktop = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '2000' }]); // Use a larger default width for desktop

      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width:767px)');

      if (pictureMobile) {
        const imgMobile = pictureMobile.querySelector('img');
        if (imgMobile) {
          sourceMobile.setAttribute('srcset', imgMobile.src);
        }
      } else {
        // If no separate mobile image, use desktop image for mobile source
        sourceMobile.setAttribute('srcset', imgDesktop.src);
      }
      optimizedPicDesktop.prepend(sourceMobile);

      // moveInstrumentation should target the picture element, not just the img inside it
      moveInstrumentation(imageDesktopRow, optimizedPicDesktop);
      imageDiv.append(optimizedPicDesktop);
    }
  }

  wrapper.append(imageDiv);
  block.replaceChildren(wrapper);
}
