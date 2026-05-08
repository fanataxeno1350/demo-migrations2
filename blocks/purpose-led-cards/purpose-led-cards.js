import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model: headline, description, then card rows
  const [headlineRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Block name 'purpose-led-cards' is already on outer div

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  container.append(sectionHeader);

  if (headlineRow) {
    // headline is type=text, so read textContent from the cell directly
    const headlineCell = headlineRow.children[0];
    if (headlineCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      moveInstrumentation(headlineRow, heading);
      heading.textContent = headlineCell.textContent.trim();
      sectionHeader.append(heading);
    }
  }

  if (descriptionRow) {
    // description is type=text, so read textContent from the cell directly
    const descriptionCell = descriptionRow.children[0];
    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('aos-init', 'aos-animate');
      moveInstrumentation(descriptionRow, description);
      description.textContent = descriptionCell.textContent.trim();
      sectionHeader.append(description);
    }
  }

  const purposeLedGrid = document.createElement('div');
  purposeLedGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');
  container.append(purposeLedGrid);

  cardRows.forEach((row) => {
    // For fixed-schema item rows, use array destructuring for cells
    const [imageDesktopCell, imageMobileCell, linkCell, cardTextCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col);

    const anchor = document.createElement('a');
    anchor.classList.add('card-wrap');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // From original HTML
    }
    col.append(anchor);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    anchor.append(cardImage);

    const pictureDesktop = imageDesktopCell?.querySelector('picture');
    const pictureMobile = imageMobileCell?.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = pictureMobile.querySelector('img')?.src;

      const img = document.createElement('img');
      img.classList.add('img-fluid');
      img.src = pictureDesktop.querySelector('img')?.src;
      img.alt = pictureDesktop.querySelector('img')?.alt;

      const pictureElement = document.createElement('picture');
      pictureElement.append(sourceMobile, img);
      cardImage.append(pictureElement);

      // Optimize images
      cardImage.querySelectorAll('picture > img').forEach((imgEl) => {
        const optimizedPic = createOptimizedPicture(imgEl.src, imgEl.alt, false, [{ width: '750' }]);
        moveInstrumentation(imgEl, optimizedPic.querySelector('img'));
        imgEl.closest('picture').replaceWith(optimizedPic);
      });
    }

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');
    anchor.append(cardText);

    if (cardTextCell) {
      const p = document.createElement('p');
      p.classList.add('desc');
      // cardText is type=richtext, so read innerHTML directly from the cell
      p.innerHTML = cardTextCell.innerHTML;
      cardText.append(p);
    }

    purposeLedGrid.append(col);
  });

  block.replaceChildren(section);
}
