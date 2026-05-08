import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader); // Move instrumentation from headingRow

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.children[0]?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.children[0]?.textContent.trim() || '';
  moveInstrumentation(descriptionRow, description); // Move instrumentation from descriptionRow
  sectionHeader.append(description);

  container.append(sectionHeader);

  // Cards Grid
  const rowGrid = document.createElement('div');
  rowGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col); // Move instrumentation from the card item row

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const cardLink = linkCell.querySelector('a');
    if (cardLink) {
      cardWrap.href = cardLink.href;
      cardWrap.target = '_blank'; // Assuming target blank from original HTML
    }

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      if (imgDesktop && imgMobile) {
        const optimizedPicture = createOptimizedPicture(
          imgDesktop.src,
          imgDesktop.alt,
          false,
          [
            { media: '(max-width: 576px)', width: '576', url: imgMobile.src },
            { width: '750' },
          ],
        );
        cardImage.append(optimizedPicture);
      }
    } else if (pictureDesktop) {
      // Fallback if only desktop image is provided
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        const optimizedPicture = createOptimizedPicture(
          imgDesktop.src,
          imgDesktop.alt,
          false,
          [{ width: '750' }],
        );
        cardImage.append(optimizedPicture);
      }
    }

    cardWrap.append(cardImage);

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    const descP = document.createElement('p');
    descP.classList.add('desc');
    descP.innerHTML = descriptionCell?.innerHTML || '';
    cardText.append(descP);

    cardWrap.append(cardText);
    col.append(cardWrap);
    rowGrid.append(col);
  });

  container.append(rowGrid);
  block.replaceChildren(section);
}
