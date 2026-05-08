import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const headlineRow = children.find((row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'));
  const cardRows = children.filter((row) => row.children.length === 4);

  const whyTechatomContainer = document.createElement('div');
  whyTechatomContainer.classList.add('why-techatom-container', 'shadow-lg');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around', 'gy-5');

  if (headlineRow) {
    const headline = document.createElement('h2');
    moveInstrumentation(headlineRow, headline);
    const textContent = headlineRow.textContent.trim();
    const chooseIndex = textContent.toLowerCase().indexOf('choose');
    const techatomIndex = textContent.toLowerCase().indexOf('techatom');

    if (chooseIndex !== -1 && techatomIndex !== -1 && techatomIndex > chooseIndex) {
      const beforeTechatom = textContent.substring(0, techatomIndex);
      const techatomText = textContent.substring(techatomIndex, techatomIndex + 'Techatom'.length);
      const afterTechatom = textContent.substring(techatomIndex + 'Techatom'.length);

      headline.innerHTML = `${beforeTechatom}<span class="curve-underline">${techatomText}</span>${afterTechatom}`;
    } else {
      headline.textContent = textContent;
    }
    rowDiv.append(headline);
  }

  cardRows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
    } else {
      cardLink.href = '#';
    }

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        moveInstrumentation(img, optimizedImg); // Move instrumentation from original img to optimized img

        // Apply classes based on alt text, matching original HTML
        if (img.alt === 'expert' || img.alt === 'customer') {
          optimizedImg.classList.add('expert-svg');
        } else if (img.alt === 'badge') {
          optimizedImg.classList.add('badge-svg');
        }
        cardLink.append(optimizedPic);
      }
    }

    const title = document.createElement('h3');
    title.textContent = titleCell.textContent.trim();
    cardLink.append(title);

    const description = document.createElement('p');
    description.innerHTML = descriptionCell.innerHTML;
    cardLink.append(description);

    moveInstrumentation(row, cardLink);
    rowDiv.append(cardLink);
  });

  whyTechatomContainer.append(rowDiv);
  block.replaceChildren(whyTechatomContainer);
}
