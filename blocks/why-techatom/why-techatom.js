import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, ...cardRows] = [...block.children];

  const whyTechatomContainer = document.createElement('div');
  whyTechatomContainer.classList.add('why-techatom-container', 'shadow-lg');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around', 'gy-5');

  // Headline
  if (headlineRow) {
    // headline is richtext, read innerHTML directly from the cell
    const headlineCell = headlineRow.children[0];
    const headlineContent = headlineCell?.innerHTML || '';
    const h2 = document.createElement('h2');
    moveInstrumentation(headlineRow, h2);

    // Check for "Techatom" with curve-underline
    // Use a temporary div to parse HTML and then extract text for comparison
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = headlineContent;
    const techatomText = tempDiv.textContent.trim();

    if (techatomText.includes('Techatom')) {
      // Reconstruct HTML, preserving original tags if any, and applying curve-underline
      // This is a simplified approach assuming 'Techatom' is within a single text node
      // For more complex HTML, a DOM traversal would be needed.
      // Given the original HTML example, it's a simple text node.
      const parts = headlineContent.split('Techatom');
      h2.innerHTML = `${parts[0]}<span class="curve-underline">Techatom</span>${parts[1]}`;
    } else {
      h2.innerHTML = headlineContent; // Use innerHTML to preserve any original formatting
    }
    rowDiv.append(h2);
  }

  // Cards
  cardRows.forEach((row) => {
    const [iconCell, titleCell, descriptionCell, linkCell] = [...row.children];

    const anchor = document.createElement('a');
    anchor.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');
    moveInstrumentation(row, anchor);

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#'; // Fallback link if none is provided
    }

    // Icon
    const picture = iconCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Create optimized picture and apply instrumentation
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        moveInstrumentation(img, optimizedImg); // Move instrumentation from original img to optimized img

        // Apply specific icon classes based on alt text
        if (img.alt.toLowerCase().includes('expert')) {
          optimizedImg.classList.add('expert-svg');
        } else if (img.alt.toLowerCase().includes('badge')) {
          optimizedImg.classList.add('badge-svg');
        } else if (img.alt.toLowerCase().includes('customer')) {
          optimizedImg.classList.add('expert-svg'); // Original HTML uses expert-svg for customer
        }
        anchor.append(optimizedPic);
      }
    }

    // Title
    const h3 = document.createElement('h3');
    h3.textContent = titleCell?.textContent.trim() || '';
    anchor.append(h3);

    // Description (richtext field, use innerHTML)
    const p = document.createElement('p');
    p.innerHTML = descriptionCell?.innerHTML || '';
    anchor.append(p);

    rowDiv.append(anchor);
  });

  whyTechatomContainer.append(rowDiv);
  block.replaceChildren(whyTechatomContainer);

  // The original JS had a redundant loop for image optimization.
  // createOptimizedPicture already handles optimization, and instrumentation is moved above.
  // This loop is no longer needed.
}
