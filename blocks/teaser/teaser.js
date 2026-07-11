import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [mainImageRow] = [...block.children];

  const teaserDiv = document.createElement('div');
  teaserDiv.classList.add('cmp-teaser'); // From ORIGINAL HTML

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-teaser__content'); // From ORIGINAL HTML
  teaserDiv.append(contentDiv);

  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cmp-teaser__image'); // From ORIGINAL HTML

  const imageElement = mainImageRow.querySelector('picture');
  if (imageElement) {
    const img = imageElement.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageElement.replaceWith(optimizedPic);
    }
    // Move instrumentation from the original row to the new image container
    moveInstrumentation(mainImageRow, imageDiv);
    imageDiv.append(imageElement); // Append the picture element (which now contains optimizedPic)
  }

  teaserDiv.append(imageDiv);

  block.replaceChildren(teaserDiv);
  block.classList.add('cmp-teaser--first-component'); // From ORIGINAL HTML
}
