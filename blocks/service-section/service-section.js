import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('service-section'); // Block's own class, already on outer div
  section.id = 'services'; // From original HTML

  // Heading and Pointer Image
  const headingRow = children[0];
  const pointerImageRow = children[1];
  const containerTop = document.createElement('div');
  containerTop.classList.add('container', 'position-relative');
  moveInstrumentation(headingRow, containerTop); // Move instrumentation for headingRow

  const heading = document.createElement('h2');
  heading.textContent = headingRow.textContent.trim();
  containerTop.append(heading);

  const pointerPicture = pointerImageRow.querySelector('picture');
  if (pointerPicture) {
    const pointerImg = pointerPicture.querySelector('img');
    const optimizedPointerPic = createOptimizedPicture(pointerImg.src, pointerImg.alt, false, [{ width: '750' }]);
    const newPointerImg = optimizedPointerPic.querySelector('img');
    newPointerImg.classList.add('pointer'); // From original HTML
    moveInstrumentation(pointerImageRow, newPointerImg); // Move instrumentation for pointerImageRow
    pointerPicture.replaceWith(optimizedPointerPic);
    containerTop.append(optimizedPointerPic);
  }

  section.append(containerTop);

  // Service Cards
  const serviceCardsContainer = document.createElement('div');
  serviceCardsContainer.classList.add('container');
  const serviceCardsRow = document.createElement('div');
  serviceCardsRow.classList.add('row', 'justify-content-around');
  serviceCardsContainer.append(serviceCardsRow);

  // Skip the first two rows (heading and pointer image)
  const serviceCardItemRows = children.slice(2);

  serviceCardItemRows
    .filter((row) => row.children.length === 5) // Ensure it's a service-card-item row
    .forEach((row) => {
      const [cardLinkCell, cardImageCell, cardTitleCell, cardDescriptionCell, buttonLabelCell] = [...row.children];

      const cardLink = document.createElement('a');
      cardLink.classList.add('d-block', 'col-lg-4', 'col-md-6', 'col-12', 'service-card'); // From original HTML

      const foundLink = cardLinkCell.querySelector('a');
      if (foundLink) {
        cardLink.href = foundLink.href;
      }
      moveInstrumentation(cardLinkCell, cardLink); // Move instrumentation for cardLinkCell

      const cardPicture = cardImageCell.querySelector('picture');
      if (cardPicture) {
        const cardImg = cardPicture.querySelector('img');
        const optimizedCardPic = createOptimizedPicture(cardImg.src, cardImg.alt, false, [{ width: '750' }]);
        const newCardImg = optimizedCardPic.querySelector('img');
        newCardImg.classList.add('img-fluid', 'service-img'); // From original HTML
        moveInstrumentation(cardImageCell, newCardImg); // Move instrumentation for cardImageCell
        cardPicture.replaceWith(optimizedCardPic);
        cardLink.append(optimizedCardPic);
      }

      const cardTitle = document.createElement('h3');
      cardTitle.textContent = cardTitleCell.textContent.trim();
      cardLink.append(cardTitle);

      const cardDescription = document.createElement('p');
      cardDescription.innerHTML = cardDescriptionCell.innerHTML; // Richtext content
      cardLink.append(cardDescription);

      // The button is part of the cardLink, but needs its own instrumentation
      const buttonContainer = document.createElement('div'); // Wrapper for button instrumentation
      const button = document.createElement('button');
      button.textContent = buttonLabelCell.textContent.trim();
      buttonContainer.append(button);
      moveInstrumentation(buttonLabelCell, buttonContainer); // Move instrumentation for buttonLabelCell
      cardLink.append(buttonContainer);


      moveInstrumentation(row, cardLink); // Move instrumentation for the entire item row
      serviceCardsRow.append(cardLink);
    });

  section.append(serviceCardsContainer);

  block.replaceChildren(section);
}
