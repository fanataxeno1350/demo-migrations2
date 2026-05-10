import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure all rows from block.children based on the BlockJson model
  const [closeIconRow, closeIconLinkRow, searchPlaceholderRow, submitLabelRow] = [...block.children];

  // Close Icon and Link
  const closeLink = document.createElement('a');
  closeLink.classList.add('search-close');
  moveInstrumentation(closeIconLinkRow, closeLink); // Move instrumentation from link row

  // Extract the picture element from the closeIconRow's first cell
  const closeIconCell = closeIconRow.children[0];
  const closeIconPicture = closeIconCell?.querySelector('picture');

  if (closeIconPicture) {
    const img = closeIconPicture.querySelector('img');
    if (img) {
      // Create optimized picture and move instrumentation from the original img to the new img
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      closeLink.append(optimizedPic);
    }
  }

  // Extract the href from the closeIconLinkRow's first cell
  const closeIconLinkCell = closeIconLinkRow.children[0];
  const closeIconHref = closeIconLinkCell?.querySelector('a')?.href;
  if (closeIconHref) {
    closeLink.href = closeIconHref;
  } else {
    closeLink.href = 'JavaScript:Void(0);';
  }

  // Search Box Main
  const searchBoxMain = document.createElement('div');
  searchBoxMain.classList.add('search-box-main');

  // Search Input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'ctl00_search_txtsearch'; // Using ID from original HTML
  searchInput.name = 'ctl00$search$txtsearch'; // Using name from original HTML
  // Extract placeholder text from the searchPlaceholderRow's first cell
  const searchPlaceholderCell = searchPlaceholderRow.children[0];
  searchInput.placeholder = searchPlaceholderCell?.textContent.trim() || '';
  moveInstrumentation(searchPlaceholderRow, searchInput);

  // Hidden input (from original HTML)
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = 'ctl00$search$ValidatorCalloutExtender9_ClientState';
  hiddenInput.id = 'ctl00_search_ValidatorCalloutExtender9_ClientState';

  // Submit Button
  const submitButton = document.createElement('input');
  submitButton.type = 'submit';
  submitButton.name = 'ctl00$search$btnsearch'; // Using name from original HTML
  submitButton.id = 'ctl00_search_btnsearch'; // Using ID from original HTML
  submitButton.classList.add('search-btn');
  // Extract submit button value from the submitLabelRow's first cell
  const submitLabelCell = submitLabelRow.children[0];
  submitButton.value = submitLabelCell?.textContent.trim() || 'Submit';
  submitButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default form submission
    // Add any custom submission logic here if needed
  });
  moveInstrumentation(submitLabelRow, submitButton);

  searchBoxMain.append(searchInput, hiddenInput, submitButton);

  // Replace block children with new structure
  block.replaceChildren(closeLink, searchBoxMain);
}
