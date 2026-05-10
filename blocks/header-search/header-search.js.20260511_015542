import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // block.children[0]: field="closeIcon" label="Close Icon" type=reference
  // block.children[1]: field="searchPlaceholder" label="Search Input Placeholder" type=text
  // block.children[2]: field="submitLabel" label="Submit Button Label" type=text
  const [closeIconRow, searchPlaceholderRow, submitLabelRow] = [...block.children];

  const searchBox = document.createElement('div');
  searchBox.classList.add('search-box'); // From ORIGINAL HTML

  // Close Icon
  const closeLink = document.createElement('a');
  closeLink.href = 'JavaScript:Void(0);';
  closeLink.classList.add('search-close'); // From ORIGINAL HTML

  if (closeIconRow) {
    const closeIconCell = closeIconRow.children[0]; // Access the cell within the row
    const picture = closeIconCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation for the picture element itself, not just the img inside it
        moveInstrumentation(picture, optimizedPic);
        closeLink.append(optimizedPic);
      }
    }
    moveInstrumentation(closeIconRow, closeLink); // Move instrumentation from the row to the link
  }
  searchBox.append(closeLink);

  const searchBoxMain = document.createElement('div');
  searchBoxMain.classList.add('search-box-main'); // From ORIGINAL HTML

  // Search Input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'ctl00_search_txtsearch'; // Retain original ID for potential form submission
  if (searchPlaceholderRow) {
    const searchPlaceholderCell = searchPlaceholderRow.children[0]; // Access the cell
    searchInput.placeholder = searchPlaceholderCell?.textContent.trim() || '';
    moveInstrumentation(searchPlaceholderRow, searchInput); // Move instrumentation from the row to the input
  }
  searchBoxMain.append(searchInput);

  // Submit Button
  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.id = 'ctl00_search_btnsearch'; // Retain original ID
  submitButton.classList.add('search-btn'); // From ORIGINAL HTML
  if (submitLabelRow) {
    const submitLabelCell = submitLabelRow.children[0]; // Access the cell
    submitButton.value = submitLabelCell?.textContent.trim() || '';
    moveInstrumentation(submitLabelRow, submitButton); // Move instrumentation from the row to the button
  }
  searchBoxMain.append(submitButton);

  searchBox.append(searchBoxMain);

  block.replaceChildren(searchBox);
}
