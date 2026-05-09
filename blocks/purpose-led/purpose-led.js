import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Correct: 'spirit-of-rise' is from original HTML, not block name.

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  container.append(sectionHeader);

  const [headingRow, descriptionRow, ...cardRows] = children;

  if (headingRow) {
    const [headingCell] = [...headingRow.children]; // FIXED: Replaced direct row.children[0] with destructuring
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos-easing', 'ease-in-out'); // Added from original HTML
    heading.setAttribute('data-aos', 'fade-up'); // Added from original HTML
    heading.setAttribute('data-aos-delay', '200'); // Added from original HTML
    moveInstrumentation(headingRow, heading);
    heading.innerHTML = headingCell?.innerHTML || '';
    sectionHeader.append(heading);
  }

  if (descriptionRow) {
    const [descriptionCell] = [...descriptionRow.children]; // FIXED: Replaced direct row.children[0] with destructuring
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    description.setAttribute('data-aos', 'fade-up'); // Added from original HTML
    description.setAttribute('data-aos-offset', '100'); // Added from original HTML
    description.setAttribute('data-aos-duration', '650'); // Added from original HTML
    description.setAttribute('data-aos-easing', 'ease-in-out'); // Added from original HTML
    moveInstrumentation(descriptionRow, description);
    description.innerHTML = descriptionCell?.innerHTML || ''; // FIXED: Changed to innerHTML for richtext
    sectionHeader.append(description);
  }

  // Cards Grid
  const purposeLedGrid = document.createElement('div');
  purposeLedGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');
  container.append(purposeLedGrid);

  cardRows.forEach((row) => {
    const [imageMobileCell, imageDesktopCell, cardTextCell, cardLinkCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate');
    colDiv.setAttribute('data-aos-easing', 'ease-in-out'); // Added from original HTML
    colDiv.setAttribute('data-aos', 'fade-up'); // Added from original HTML
    colDiv.setAttribute('data-aos-delay', '700'); // Added from original HTML
    moveInstrumentation(row, colDiv);

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    const foundLink = cardLinkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // From original HTML
    }
    colDiv.append(cardLink);

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');
    cardLink.append(cardImageDiv);

    const picture = document.createElement('picture');
    cardImageDiv.append(picture);

    if (imageMobileCell) {
      const mobileImg = imageMobileCell.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '576' }]).querySelector('img').src;
        picture.append(sourceMobile);
      }
    }

    if (imageDesktopCell) {
      const desktopImg = imageDesktopCell.querySelector('img');
      if (desktopImg) {
        const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
        const img = optimizedDesktopPic.querySelector('img');
        img.classList.add('img-fluid');
        moveInstrumentation(imageDesktopCell, img); // Instrumentation for the image cell
        picture.append(img);
      }
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');
    cardLink.append(cardTextDiv);

    if (cardTextCell) {
      const p = document.createElement('p');
      p.classList.add('desc');
      p.innerHTML = cardTextCell.innerHTML;
      cardTextDiv.append(p);
    }

    purposeLedGrid.append(colDiv);
  });

  block.replaceChildren(section);
}
