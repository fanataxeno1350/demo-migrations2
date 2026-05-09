import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Removed 'spirit-of-rise' as block already has it
  section.classList.add('section', 'grey-bg'); // Retained other classes from ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader); // Move instrumentation for heading

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  description.textContent = descriptionRow.textContent.trim();
  moveInstrumentation(descriptionRow, description); // Move instrumentation for description
  sectionHeader.append(description);

  container.append(sectionHeader);

  // Cards Grid
  const purposeLedGrid = document.createElement('div');
  purposeLedGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows.forEach((row, index) => {
    const [imageCell, imageMobileCell, cardLinkCell, cardTextCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', `${700 + index * 100}`); // Stagger delay

    const cardLink = cardLinkCell.querySelector('a');
    const anchor = document.createElement('a');
    if (cardLink) {
      anchor.href = cardLink.href;
      anchor.target = '_blank';
    }
    anchor.classList.add('card-wrap');
    moveInstrumentation(row, anchor); // Move instrumentation from row to anchor

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const desktopPicture = imageCell.querySelector('picture');
    const mobilePicture = imageMobileCell.querySelector('picture');

    if (desktopPicture && mobilePicture) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = mobilePicture.querySelector('img')?.src || '';

      const img = desktopPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.prepend(sourceMobile);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        cardImageDiv.append(optimizedPic);
      }
    } else if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        cardImageDiv.append(optimizedPic);
      }
    }

    anchor.append(cardImageDiv);

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');
    const p = document.createElement('p');
    p.classList.add('desc');
    p.innerHTML = cardTextCell.innerHTML; // Rich text content
    cardTextDiv.append(p);
    anchor.append(cardTextDiv);

    col.append(anchor);
    purposeLedGrid.append(col);
  });

  container.append(purposeLedGrid);
  section.append(container);

  block.replaceChildren(section);
}
