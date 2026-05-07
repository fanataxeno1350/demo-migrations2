import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const container = document.createElement('div');
  container.classList.add('container');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular'); // aos-init, aos-animate are added by AOS library, not manually
  heading.textContent = headingRow ? headingRow.textContent.trim() : '';
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  // aos-init, aos-animate are added by AOS library, not manually
  subheading.textContent = subheadingRow ? subheadingRow.textContent.trim() : '';
  moveInstrumentation(subheadingRow, subheading);
  sectionHeader.append(subheading);

  container.append(sectionHeader);

  // Cards Grid
  const cardsGrid = document.createElement('div');
  cardsGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, altTextCell, descriptionCell, linkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6'); // aos-init, aos-animate are added by AOS library, not manually
    moveInstrumentation(row, col);

    const anchor = document.createElement('a');
    anchor.classList.add('card-wrap');
    const foundLink = linkCell ? linkCell.querySelector('a') : null;
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Assuming target blank from original HTML
    }

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell ? imageDesktopCell.querySelector('picture') : null;
    const pictureMobile = imageMobileCell ? imageMobileCell.querySelector('picture') : null;
    const altText = altTextCell ? altTextCell.textContent.trim() : '';

    if (pictureDesktop && pictureMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = pictureMobile.querySelector('img')?.src || '';

      const img = document.createElement('img');
      img.src = pictureDesktop.querySelector('img')?.src || '';
      img.classList.add('img-fluid');
      img.alt = altText;
      img.loading = 'lazy'; // Add loading lazy as per best practice

      const picture = document.createElement('picture');
      picture.append(sourceMobile, img);
      cardImage.append(picture);
    } else if (pictureDesktop) {
      const img = document.createElement('img');
      img.src = pictureDesktop.querySelector('img')?.src || '';
      img.classList.add('img-fluid');
      img.alt = altText;
      img.loading = 'lazy';
      const picture = document.createElement('picture');
      picture.append(img);
      cardImage.append(picture);
    } else if (pictureMobile) {
      const img = document.createElement('img');
      img.src = pictureMobile.querySelector('img')?.src || '';
      img.classList.add('img-fluid');
      img.alt = altText;
      img.loading = 'lazy';
      const picture = document.createElement('picture');
      picture.append(img);
      cardImage.append(picture);
    }

    anchor.append(cardImage);

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = descriptionCell ? descriptionCell.innerHTML : '';
    cardText.append(desc);

    anchor.append(cardText);
    col.append(anchor);
    cardsGrid.append(col);
  });

  container.append(cardsGrid);
  section.append(container);
  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be called on the original img element, not the new one inside optimizedPic
    moveInstrumentation(img.closest('picture'), optimizedPic);
    img.closest('picture').replaceWith(optimizedPic);
  });
}
