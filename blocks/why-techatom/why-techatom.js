import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, ...cardRows] = [...block.children];

  const whyTechatomContainer = document.createElement('div');
  whyTechatomContainer.classList.add('why-techatom-container', 'shadow-lg'); // Removed 'why-techatom' class

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around', 'gy-5');

  const headlineEl = document.createElement('h2');
  moveInstrumentation(headlineRow, headlineEl);
  // Headline is richtext, so use innerHTML to preserve potential formatting like <span>
  headlineEl.innerHTML = headlineRow.querySelector('div')?.innerHTML || '';

  rowDiv.append(headlineEl);

  cardRows
    .filter((row) => row.children.length === 4)
    .forEach((row) => {
      const [linkCell, imageCell, titleCell, descriptionCell] = [...row.children];

      const anchor = document.createElement('a');
      anchor.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      } else {
        anchor.href = '#'; // Fallback if no link is found
      }
      moveInstrumentation(row, anchor);

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          // moveInstrumentation for the image itself, not the picture wrapper
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          const optimizedImg = optimizedPic.querySelector('img');
          // Apply specific image classes based on alt text or other detection if needed.
          // For this block, using a generic class from original HTML.
          if (img.alt === 'expert' || img.alt === 'customer') {
            optimizedImg.classList.add('expert-svg');
          } else if (img.alt === 'badge') {
            optimizedImg.classList.add('badge-svg');
          }
          anchor.append(optimizedPic);
        }
      }

      const titleEl = document.createElement('h3');
      titleEl.textContent = titleCell.textContent.trim();
      anchor.append(titleEl);

      const descriptionEl = document.createElement('p');
      // Description is richtext, so use innerHTML to preserve potential formatting
      descriptionEl.innerHTML = descriptionCell.innerHTML;
      anchor.append(descriptionEl);

      rowDiv.append(anchor);
    });

  whyTechatomContainer.append(rowDiv);
  block.replaceChildren(whyTechatomContainer);
}
