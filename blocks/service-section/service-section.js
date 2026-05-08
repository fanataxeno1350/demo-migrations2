import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  // block.children[0]: heading
  // block.children[1]: pointerImage
  // block.children[2...N]: service-card-item rows
  const [headingRow, pointerImageRow, ...serviceCardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('service-section');
  section.id = 'services'; // From original HTML

  const container1 = document.createElement('div');
  container1.classList.add('container', 'position-relative');

  const heading = document.createElement('h2');
  if (headingRow) {
    heading.textContent = headingRow.textContent.trim();
    moveInstrumentation(headingRow, heading); // Move instrumentation for heading row
  }
  container1.append(heading);

  const pointerImage = document.createElement('img');
  if (pointerImageRow) {
    const picture = pointerImageRow.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    if (img) {
      // Optimize the pointer image and append the picture element
      const optimizedPointerPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPointerPic.querySelector('img').classList.add('pointer'); // Add class to the img inside the picture
      moveInstrumentation(pointerImageRow, optimizedPointerPic); // Move instrumentation to the picture element
      container1.append(optimizedPointerPic); // Append the entire optimized picture element
    }
  }
  section.append(container1);

  const container2 = document.createElement('div');
  container2.classList.add('container');
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around');

  // serviceCardRows are already filtered by destructuring above.
  // The BlockJson model defines service-card-item rows having 5 cells.
  // No need for row.children.length === 5 filter here.

  serviceCardRows.forEach((row) => {
    // Destructure cells for service-card-item based on BlockJson model
    const [cardLinkCell, cardImageCell, cardTitleCell, cardDescriptionCell, ctaLabelCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-block', 'col-lg-4', 'col-md-6', 'col-12', 'service-card');

    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
    }

    const cardImagePicture = cardImageCell.querySelector('picture');
    const cardImageImg = cardImagePicture ? cardImagePicture.querySelector('img') : null;
    if (cardImageImg) {
      const optimizedPic = createOptimizedPicture(cardImageImg.src, cardImageImg.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid', 'service-img'); // Add classes to the img inside the picture
      moveInstrumentation(cardImageCell, optimizedPic); // Move instrumentation to the picture element
      cardLink.append(optimizedPic); // Append the entire optimized picture element
    }

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = cardTitleCell.textContent.trim();
    cardLink.append(cardTitle);

    const cardDescription = document.createElement('p');
    cardDescription.innerHTML = cardDescriptionCell.innerHTML; // richtext field, use innerHTML
    cardLink.append(cardDescription);

    const ctaButton = document.createElement('button');
    ctaButton.textContent = ctaLabelCell.textContent.trim();
    cardLink.append(ctaButton);

    moveInstrumentation(row, cardLink);
    rowDiv.append(cardLink);
  });

  container2.append(rowDiv);
  section.append(container2);

  block.replaceChildren(section);
}
