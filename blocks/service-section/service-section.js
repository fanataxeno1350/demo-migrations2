import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, pointerImageRow, ...serviceCardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('service-section');
  section.id = 'services'; // From original HTML

  const containerTop = document.createElement('div');
  containerTop.classList.add('container', 'position-relative');
  moveInstrumentation(titleRow, containerTop); // Move instrumentation for titleRow

  // Title
  // The titleRow itself is the cell wrapper, its firstChild is the div containing the text.
  // The BlockJson model indicates "title" is a text field, so we read textContent.
  const h2 = document.createElement('h2');
  h2.textContent = titleRow.textContent.trim();
  containerTop.append(h2);

  // Pointer Image
  const pointerPicture = pointerImageRow.querySelector('picture');
  if (pointerPicture) {
    const img = pointerPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('pointer');
      containerTop.append(optimizedPic);
    }
  }
  section.append(containerTop);

  const containerBottom = document.createElement('div');
  containerBottom.classList.add('container');

  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');

  serviceCardRows.forEach((cardRow) => {
    const [linkCell, imageCell, titleCell, descriptionCell, buttonLabelCell] = [...cardRow.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-block', 'col-lg-4', 'col-md-6', 'col-12', 'service-card');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
    }

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('img-fluid', 'service-img');
        cardLink.append(optimizedPic);
      }
    }

    const h3 = document.createElement('h3');
    h3.textContent = titleCell.textContent.trim();
    cardLink.append(h3);

    const p = document.createElement('p');
    p.textContent = descriptionCell.textContent.trim();
    cardLink.append(p);

    const button = document.createElement('button');
    button.textContent = buttonLabelCell.textContent.trim();
    cardLink.append(button);

    moveInstrumentation(cardRow, cardLink);
    row.append(cardLink);
  });

  containerBottom.append(row);
  section.append(containerBottom);

  block.replaceChildren(section);
}
