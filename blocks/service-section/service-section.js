import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('service-section');
  section.id = 'services';

  const containerTop = document.createElement('div');
  containerTop.classList.add('container', 'position-relative');
  section.append(containerTop);

  // Heading and Pointer Image rows
  const [headingRow, pointerImageRow, ...serviceCardRows] = children;

  // Heading
  const headingCell = headingRow.children[0]; // Access the first (and only) cell of the heading row
  const h2 = document.createElement('h2');
  moveInstrumentation(headingRow, h2);
  h2.textContent = headingCell ? headingCell.textContent.trim() : '';
  containerTop.append(h2);

  // Pointer Image
  const pointerImageCell = pointerImageRow.children[0]; // Access the first (and only) cell of the pointer image row
  const pointerPicture = pointerImageCell ? pointerImageCell.querySelector('picture') : null;
  if (pointerPicture) {
    const pointerImg = pointerPicture.querySelector('img');
    const optimizedPointerPic = createOptimizedPicture(
      pointerImg.src,
      pointerImg.alt,
      false,
      [{ width: '750' }],
    );
    // moveInstrumentation should be on the picture element itself, not just the img
    moveInstrumentation(pointerImageRow, optimizedPointerPic);
    optimizedPointerPic.querySelector('img').classList.add('pointer');
    containerTop.append(optimizedPointerPic);
  }

  const containerCards = document.createElement('div');
  containerCards.classList.add('container');
  section.append(containerCards);

  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');
  containerCards.append(row);

  // Service Cards
  serviceCardRows.forEach((cardRow) => {
    const [cardLinkCell, cardImageCell, cardTitleCell, cardDescriptionCell, ctaLabelCell] = [
      ...cardRow.children,
    ];

    const cardLink = cardLinkCell ? cardLinkCell.querySelector('a') : null;
    const cardAnchor = document.createElement('a');
    cardAnchor.classList.add('d-block', 'col-lg-4', 'col-md-6', 'col-12', 'service-card');
    if (cardLink) {
      cardAnchor.href = cardLink.href;
    }
    moveInstrumentation(cardRow, cardAnchor);

    const cardPicture = cardImageCell ? cardImageCell.querySelector('picture') : null;
    if (cardPicture) {
      const cardImg = cardPicture.querySelector('img');
      const optimizedCardPic = createOptimizedPicture(
        cardImg.src,
        cardImg.alt,
        false,
        [{ width: '750' }],
      );
      optimizedCardPic.querySelector('img').classList.add('img-fluid', 'service-img');
      cardAnchor.append(optimizedCardPic);
    }

    const h3 = document.createElement('h3');
    h3.textContent = cardTitleCell ? cardTitleCell.textContent.trim() : '';
    cardAnchor.append(h3);

    const p = document.createElement('p');
    // cardDescription is richtext, so innerHTML is correct
    p.innerHTML = cardDescriptionCell ? cardDescriptionCell.innerHTML : '';
    cardAnchor.append(p);

    const button = document.createElement('button');
    button.textContent = ctaLabelCell ? ctaLabelCell.textContent.trim() : '';
    cardAnchor.append(button);

    row.append(cardAnchor);
  });

  block.replaceChildren(section);

  // The original block.querySelectorAll('picture > img') loop is redundant.
  // createOptimizedPicture is already called for pointerImage and cardImages.
  // This loop would re-optimize images that are already optimized or not part of the block's final structure.
  // It's also problematic because moveInstrumentation is called on `img` but then `img.closest('picture').replaceWith(optimizedPic)`
  // would remove the original `img` from the DOM, potentially losing instrumentation.
  // Removing this redundant loop.
}
