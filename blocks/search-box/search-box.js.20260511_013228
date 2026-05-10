import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [closeIconRow, closeLinkRow, searchPlaceholderRow, submitLabelRow] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('search-box'); // Class from ORIGINAL HTML

  // Close Link and Icon
  const closeLink = document.createElement('a');
  closeLink.classList.add('search-close'); // Class from ORIGINAL HTML

  // The closeLinkRow contains the actual href text, not the closeIconRow.
  // The closeLinkRow is type=text, so its content is the href.
  // The original HTML shows JavaScript:Void(0); as the href.
  const closeLinkHref = closeLinkRow?.children[0]?.textContent.trim();
  closeLink.href = closeLinkHref || 'JavaScript:Void(0);';

  // The closeIconRow contains the picture element.
  const closeIconCell = closeIconRow?.children[0];
  const closeIconPicture = closeIconCell?.querySelector('picture');
  if (closeIconPicture) {
    const img = closeIconPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation from the original img to the new optimized img
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      closeLink.append(optimizedPic);
    }
  }
  // moveInstrumentation for the entire rows to the new closeLink element
  moveInstrumentation(closeIconRow, closeLink);
  moveInstrumentation(closeLinkRow, closeLink);
  root.append(closeLink);

  // Search Box Main
  const searchBoxMain = document.createElement('div');
  searchBoxMain.classList.add('search-box-main'); // Class from ORIGINAL HTML

  const searchInput = document.createElement('input');
  searchInput.type = 'text';

  // Search Placeholder is in the first cell of searchPlaceholderRow
  const searchPlaceholderCell = searchPlaceholderRow?.children[0];
  searchInput.placeholder = searchPlaceholderCell?.textContent.trim() || '';
  moveInstrumentation(searchPlaceholderRow, searchInput); // Move instrumentation from row to input
  searchBoxMain.append(searchInput);

  const submitButton = document.createElement('input');
  submitButton.type = 'submit';

  // Submit Label is in the first cell of submitLabelRow
  const submitLabelCell = submitLabelRow?.children[0];
  submitButton.value = submitLabelCell?.textContent.trim() || '';
  submitButton.classList.add('search-btn'); // Class from ORIGINAL HTML

  // Add event listener for the submit action, as data-attributes are inert
  submitButton.addEventListener('click', (e) => {
    // Prevent default form submission if this were part of a form
    e.preventDefault();
    // Implement search logic here, e.g., redirect to search results page
    const searchTerm = searchInput.value;
    if (searchTerm) {
      // Example: window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      // eslint-disable-next-line no-console
      console.log('Searching for:', searchTerm);
    }
  });
  moveInstrumentation(submitLabelRow, submitButton); // Move instrumentation from row to button
  searchBoxMain.append(submitButton);

  root.append(searchBoxMain);

  block.replaceChildren(root);
}
