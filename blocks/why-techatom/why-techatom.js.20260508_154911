import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...cardRows] = [...block.children];

  const whyTechatomContainer = document.createElement('div');
  whyTechatomContainer.classList.add('why-techatom-container', 'shadow-lg');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around', 'gy-5');

  if (headingRow) {
    const [headingCell] = [...headingRow.children]; // FIXED: Named destructuring
    const h2 = document.createElement('h2');
    moveInstrumentation(headingRow, h2);

    // The heading is richtext, so innerHTML is correct.
    // The check for curve-underline span is redundant as innerHTML already handles it.
    h2.innerHTML = headingCell?.innerHTML || '';
    rowDiv.append(h2);
  }

  cardRows.forEach((row) => {
    const [imageCell, linkCell, titleCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
    }

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        moveInstrumentation(img, optimizedImg); // Move instrumentation from original img to optimized img
        picture.replaceWith(optimizedPic); // Replace original picture with optimized picture
        optimizedImg.classList.add(img.alt.includes('expert') || img.alt.includes('customer') ? 'expert-svg' : 'badge-svg');
        cardLink.append(optimizedPic);
      }
    }

    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.textContent = titleCell.textContent.trim();
      cardLink.append(h3);
    }

    if (descriptionCell) {
      const p = document.createElement('p');
      p.innerHTML = descriptionCell.innerHTML; // richtext content, can contain <p>
      cardLink.append(p);
    }

    moveInstrumentation(row, cardLink);
    rowDiv.append(cardLink);
  });

  whyTechatomContainer.append(rowDiv);
  block.replaceChildren(whyTechatomContainer);
}
