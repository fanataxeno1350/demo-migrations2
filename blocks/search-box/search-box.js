import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [closeIconRow, closeLinkRow, searchPlaceholderRow, submitLabelRow] = [...block.children];

  const closeLink = closeLinkRow.querySelector('a')?.href || 'JavaScript:Void(0);';
  const searchPlaceholder = searchPlaceholderRow.textContent.trim();
  const submitLabel = submitLabelRow.textContent.trim();

  const closeAnchor = document.createElement('a');
  closeAnchor.href = closeLink;
  closeAnchor.classList.add('search-close');
  moveInstrumentation(closeLinkRow, closeAnchor);

  const closePicture = closeIconRow.querySelector('picture');
  if (closePicture) {
    const img = closePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be called on the original element that contained the content
    // and the new element that now contains it.
    // The original 'img' element is inside 'closePicture', so we pass 'closePicture' as the source.
    moveInstrumentation(closePicture, optimizedPic.querySelector('img'));
    closeAnchor.append(optimizedPic);
  }

  const searchBoxMain = document.createElement('div');
  searchBoxMain.classList.add('search-box-main');

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = searchPlaceholder;

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.value = submitLabel;
  submitButton.classList.add('search-btn');

  moveInstrumentation(searchPlaceholderRow, searchInput);
  moveInstrumentation(submitLabelRow, submitButton);

  searchBoxMain.append(searchInput, submitButton);

  block.replaceChildren(closeAnchor, searchBoxMain);
}
