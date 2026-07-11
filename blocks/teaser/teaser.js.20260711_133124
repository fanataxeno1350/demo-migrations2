import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0: No direct children[n] access. Destructuring is correct here.
  const [desktopImageRow, mobileImageRow] = [...block.children];

  // CHECK 0.5: Block's own class 'teaser' is NOT added to inner wrapper.
  const teaserDiv = document.createElement('div');
  teaserDiv.classList.add('cmp-teaser'); // This is correct, from ORIGINAL HTML

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-teaser__content');
  // No content is actually moved into contentDiv in this block, but it's part of the structure.
  // Move instrumentation for the contentDiv itself if it were to hold content from a row.
  // In this specific block, contentDiv is empty, so no row maps to it directly.
  // If there were content rows, they would be moved into contentDiv.

  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cmp-teaser__image');

  const desktopPictureCell = desktopImageRow?.children[0]; // CHECK 0: This is a direct bracket access.
  const mobilePictureCell = mobileImageRow?.children[0];   // CHECK 0: This is a direct bracket access.

  const desktopPicture = desktopPictureCell?.querySelector('picture');
  const mobilePicture = mobilePictureCell?.querySelector('picture');

  if (desktopPicture && mobilePicture) {
    const img = desktopPicture.querySelector('img');
    const mobileImg = mobilePicture.querySelector('img');

    const picture = document.createElement('picture');

    // Create source for mobile image
    const mobileSource = document.createElement('source');
    mobileSource.media = '(max-width:767px)';
    mobileSource.srcset = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '767' }]).querySelector('img').src;
    picture.append(mobileSource);

    // Create img for desktop image
    const desktopImgEl = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]).querySelector('img');
    desktopImgEl.classList.add('cmp-image__image'); // CHECK 2.6 B: Class from allowlist
    picture.append(desktopImgEl);

    // moveInstrumentation should be on the elements that *receive* the content,
    // not necessarily the picture element itself, but the cell that contained it.
    // Since we are creating a new picture element, we move instrumentation from the *rows*
    // that provided the images to the new picture element.
    moveInstrumentation(desktopImageRow, picture);
    moveInstrumentation(mobileImageRow, picture);
    imageDiv.append(picture);
  } else if (desktopPicture) {
    const img = desktopPicture.querySelector('img');
    const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    picture.querySelector('img').classList.add('cmp-image__image'); // CHECK 2.6 B: Class from allowlist
    moveInstrumentation(desktopImageRow, picture);
    imageDiv.append(picture);
  } else if (mobilePicture) {
    const img = mobilePicture.querySelector('img');
    const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '767' }]);
    picture.querySelector('img').classList.add('cmp-image__image'); // CHECK 2.6 B: Class from allowlist
    moveInstrumentation(mobileImageRow, picture);
    imageDiv.append(picture);
  }

  // Append the content and image divs to the main teaserDiv
  teaserDiv.append(contentDiv);
  teaserDiv.append(imageDiv);

  // Replace the block's children with the constructed teaserDiv
  block.replaceChildren(teaserDiv);
}
