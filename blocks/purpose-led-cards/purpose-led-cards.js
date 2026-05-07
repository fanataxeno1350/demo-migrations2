import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('grey-bg', 'spirit-of-rise'); // Removed 'section' class as outer block already has it

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader); // Move instrumentation for headingRow to sectionHeader
  container.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  const [headingCell] = [...headingRow.children]; // Destructuring for heading cell
  heading.textContent = headingCell?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  const [descriptionCell] = [...descriptionRow.children]; // Destructuring for description cell
  description.textContent = descriptionCell?.textContent.trim() || '';
  sectionHeader.append(description);
  moveInstrumentation(descriptionRow, description); // Move instrumentation for descriptionRow to description

  // Cards Grid
  const row = document.createElement('div');
  row.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');
  container.append(row);

  cardRows.forEach((cardRow) => {
    const [imageDesktopCell, imageMobileCell, linkCell, cardTextCell] = [...cardRow.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', '700');
    moveInstrumentation(cardRow, col);
    row.append(col);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Original HTML has target="_blank"
    }
    anchor.classList.add('card-wrap');
    col.append(anchor);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    anchor.append(cardImage);

    const picture = document.createElement('picture');
    cardImage.append(picture);

    const mobileImg = imageMobileCell.querySelector('img');
    if (mobileImg) {
      const source = document.createElement('source');
      source.media = '(max-width: 576px)';
      source.srcset = mobileImg.src;
      picture.append(source);
    }

    const desktopImg = imageDesktopCell.querySelector('img');
    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]).querySelector('img');
      img.classList.add('img-fluid');
      picture.append(img);
    }

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');
    anchor.append(cardText);

    if (cardTextCell) {
      const pContainer = document.createElement('div'); // Use a div to contain richtext to prevent <p> inside <p>
      pContainer.classList.add('desc'); // Apply 'desc' class to the container div
      pContainer.innerHTML = cardTextCell.innerHTML; // Richtext content
      cardText.append(pContainer);
    }
  });

  block.replaceChildren(section);
}
