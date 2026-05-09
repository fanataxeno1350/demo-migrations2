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
    const [headlineCell] = [...headlineRow.children]; // Destructure for headline cell
    if (headlineCell) {
      const h2 = document.createElement('h2');
      // Extract "Why Choose " and wrap "Techatom?" in span with curve-underline
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = headlineCell.innerHTML; // Use innerHTML for richtext
      const p = tempDiv.querySelector('p');
      if (p) {
        const text = p.textContent.trim();
        const chooseText = text.substring(0, text.indexOf('Techatom?'));
        const techatomText = text.substring(text.indexOf('Techatom?'));

        h2.textContent = chooseText;
        const span = document.createElement('span');
        span.classList.add('curve-underline');
        span.textContent = techatomText;
        h2.append(span);
      } else {
        // Fallback if no <p> is found, just append the content
        h2.innerHTML = headlineCell.innerHTML;
      }
      moveInstrumentation(headlineRow, h2);
      rowDiv.append(h2);
    }
  }

  // Cards
  cardRows.forEach((row) => {
    const [linkCell, iconCell, titleCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        // Apply specific class based on alt text or original HTML pattern
        if (img.alt === 'expert' || img.alt === 'customer') {
          optimizedImg.classList.add('expert-svg');
        } else if (img.alt === 'badge') {
          optimizedImg.classList.add('badge-svg');
        }
        // moveInstrumentation should be on the original element, not the optimized one
        // The original `img` is part of the `picture` which is moved as a whole.
        cardLink.append(optimizedPic);
      }
    }

    const h3 = document.createElement('h3');
    h3.textContent = titleCell.textContent.trim();
    cardLink.append(h3);

    const p = document.createElement('p');
    p.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext
    cardLink.append(p);

    moveInstrumentation(row, cardLink);
    rowDiv.append(cardLink);
  });

  whyTechatomContainer.append(rowDiv);
  block.replaceChildren(whyTechatomContainer);
}
