import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const headerRow = children[0];
  const subheadingRow = children[1];

  if (headerRow || subheadingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

    if (headerRow) {
      const [headingCell] = [...headerRow.children]; // Fixed: named destructuring
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      moveInstrumentation(headerRow, heading);
      heading.textContent = headingCell?.textContent.trim() || '';
      sectionHeader.append(heading);
    }

    if (subheadingRow) {
      const [subheadingCell] = [...subheadingRow.children]; // Fixed: named destructuring
      const subheading = document.createElement('p'); // Fixed: correct element creation
      subheading.classList.add('aos-init', 'aos-animate'); // Fixed: apply classes correctly
      moveInstrumentation(subheadingRow, subheading);
      subheading.textContent = subheadingCell?.textContent.trim() || '';
      sectionHeader.append(subheading);
    }
    container.append(sectionHeader);
  }

  // Cards Grid
  const cardRows = children.slice(2).filter(row =>
    row.children.length > 0 &&
    [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
  );

  if (cardRows.length > 0) {
    const grid = document.createElement('div');
    grid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

    cardRows.forEach((row) => {
      const [imageDesktopCell, imageMobileCell, linkCell, descriptionCell] = [...row.children];

      const col = document.createElement('div');
      col.classList.add('col-md-6', 'aos-init', 'aos-animate');

      const cardWrap = document.createElement('a');
      cardWrap.classList.add('card-wrap');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        cardWrap.href = foundLink.href;
        cardWrap.target = '_blank'; // From original HTML
      } else {
        cardWrap.href = '#';
      }
      moveInstrumentation(row, cardWrap);

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      let picture;
      const desktopPicture = imageDesktopCell?.querySelector('picture');
      const mobilePicture = imageMobileCell?.querySelector('picture');

      if (desktopPicture && mobilePicture) {
        picture = document.createElement('picture');
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = mobilePicture.querySelector('img')?.src || '';
        picture.append(sourceMobile);

        const img = document.createElement('img');
        img.classList.add('img-fluid');
        img.src = desktopPicture.querySelector('img')?.src || '';
        img.alt = desktopPicture.querySelector('img')?.alt || '';
        img.loading = 'lazy';
        picture.append(img);
      } else if (desktopPicture) {
        picture = desktopPicture.cloneNode(true);
        const img = picture.querySelector('img');
        if (img) img.classList.add('img-fluid');
      } else if (mobilePicture) {
        picture = mobilePicture.cloneNode(true);
        const img = picture.querySelector('img');
        if (img) img.classList.add('img-fluid');
      }

      if (picture) {
        cardImage.append(picture);
        cardWrap.append(cardImage);
      }

      const cardText = document.createElement('div');
      cardText.classList.add('card-text');

      if (descriptionCell) {
        const descP = document.createElement('p');
        descP.classList.add('desc');
        descP.innerHTML = descriptionCell.innerHTML;
        cardText.append(descP);
      }
      cardWrap.append(cardText);
      col.append(cardWrap);
      grid.append(col);
    });
    container.append(grid);
  }

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(section);
}
