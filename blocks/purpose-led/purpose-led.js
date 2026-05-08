import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Removed 'spirit-of-rise' as outer block div already has it
  section.classList.add('section', 'grey-bg'); // Added classes from ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  container.append(sectionHeader);

  // Heading
  const headingRow = children.shift();
  if (headingRow) {
    const headingCell = headingRow.children[0]; // Access cell directly
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      moveInstrumentation(headingRow, heading);
      heading.innerHTML = headingCell.innerHTML; // richtext field, use innerHTML
      sectionHeader.append(heading);
    }
  }

  // Description
  const descriptionRow = children.shift();
  if (descriptionRow) {
    const descriptionCell = descriptionRow.children[0]; // Access cell directly
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

  children.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col);

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardWrap.href = foundLink.href;
      cardWrap.target = '_blank'; // Assuming target blank from original HTML
    }

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = document.createElement('picture');
    const source = document.createElement('source');
    source.media = '(max-width: 576px)';
    const img = document.createElement('img');
    img.classList.add('img-fluid');

    const desktopPic = imageDesktopCell.querySelector('picture');
    const mobilePic = imageMobileCell.querySelector('picture');

    // Extract srcset from mobile picture's img and alt
    if (mobilePic) {
      const mobileImg = mobilePic.querySelector('img');
      if (mobileImg) {
        source.srcset = mobileImg.src; // Use src for srcset
        img.alt = mobileImg.alt;
      }
    }

    // Extract src from desktop picture's img
    if (desktopPic) {
      const desktopImg = desktopPic.querySelector('img');
      if (desktopImg) {
        img.src = desktopImg.src;
        if (!img.alt) img.alt = desktopImg.alt; // Only set alt if not already set by mobile
      }
    }

    picture.append(source, img);
    cardImage.append(picture);
    cardWrap.append(cardImage);

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');
    const desc = document.createElement('p'); // Changed to div to avoid <p> inside <p>
    desc.classList.add('desc');
    desc.innerHTML = descriptionCell.innerHTML; // richtext field, use innerHTML
    cardText.append(desc);
    cardWrap.append(cardText);

    col.append(cardWrap);
    purposeLedGrid.append(col);
  });

  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
