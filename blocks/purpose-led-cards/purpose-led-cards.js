import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0.5: Block's own class on inner wrapper - 'purpose-led-cards' is the block name.
  // The generated JS creates a 'section' element and adds 'section', 'grey-bg', 'spirit-of-rise'.
  // The block name 'purpose-led-cards' is NOT added to the inner wrapper, which is correct.

  // CHECK 0: DIRECT .children[n] BRACKET ACCESS
  // The original code used `children[0]` and `children[1]`.
  // This is a fixed schema for the root rows (heading, description), so destructuring is appropriate.
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Classes from ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // Class from ORIGINAL HTML
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3'); // Classes from ORIGINAL HTML
  container.append(sectionHeader);

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate'); // Classes from ORIGINAL HTML
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.children[0].textContent.trim(); // Read from cell, not row
  sectionHeader.append(heading);

  // Description
  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate'); // Classes from ORIGINAL HTML
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.children[0].textContent.trim(); // Read from cell, not row
  sectionHeader.append(description);

  // Cards Grid
  const cardsGrid = document.createElement('div');
  cardsGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3'); // Classes from ORIGINAL HTML
  container.append(cardsGrid);

  // All subsequent rows are card items
  cardRows.forEach((row) => {
    // CHECK 0: Array destructuring for item rows is correct for fixed schema.
    const [imageDesktopCell, imageMobileCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate'); // Classes from ORIGINAL HTML

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap'); // Class from ORIGINAL HTML
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, cardLink);

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image'); // Class from ORIGINAL HTML

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    // Re-evaluate picture handling for better optimization and structure
    const pictureElement = document.createElement('picture');
    let hasImage = false;

    if (pictureMobile) {
      const mobileImg = pictureMobile.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = mobileImg.src;
        pictureElement.append(sourceMobile);
        hasImage = true;
      }
    }

    if (pictureDesktop) {
      const desktopImg = pictureDesktop.querySelector('img');
      if (desktopImg) {
        const img = document.createElement('img');
        img.src = desktopImg.src;
        img.alt = desktopImg.alt;
        img.classList.add('img-fluid'); // Class from ORIGINAL HTML
        pictureElement.append(img);
        moveInstrumentation(desktopImg, img);
        hasImage = true;
      }
    }

    if (hasImage) {
      cardImageDiv.append(pictureElement);
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text'); // Class from ORIGINAL HTML

    const descP = document.createElement('p');
    descP.classList.add('desc'); // Class from ORIGINAL HTML
    descP.textContent = descriptionCell.textContent.trim();
    cardTextDiv.append(descP);

    cardLink.append(cardImageDiv, cardTextDiv);
    col.append(cardLink);
    cardsGrid.append(col);
  });

  block.replaceChildren(section);

  // The createOptimizedPicture call should be applied to the final img elements
  // that are part of the rendered structure, not the initial ones.
  // The current logic creates a new picture element and appends sources/img.
  // The createOptimizedPicture should be called on the final img element that is
  // part of the DOM after all other transformations.
  // Since we are constructing the <picture> element manually, we need to ensure
  // createOptimizedPicture is applied correctly.
  // The current implementation of createOptimizedPicture expects to replace an existing <picture>
  // or <img>. Here, we are building the <picture> from scratch.
  // Let's adjust to use createOptimizedPicture for the desktop image, which is the primary one.
  block.querySelectorAll('.card-image img').forEach((img) => {
    // Ensure we only optimize the main img, not the source for mobile
    if (!img.closest('source')) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be from the original img to the new optimized img
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      // The original img is already inside a picture element. We need to replace that picture.
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
}
