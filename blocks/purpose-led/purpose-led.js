import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader); // Move instrumentation from heading row

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading); // Move instrumentation from subheading row
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  container.append(sectionHeader);

  // Cards Grid
  const cardsGrid = document.createElement('div');
  cardsGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');
  container.append(cardsGrid);

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col); // Move instrumentation from card item row

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const link = linkCell.querySelector('a');
    if (link) {
      cardWrap.href = link.href;
      cardWrap.target = '_blank'; // Assuming target blank from original HTML
    }

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      // Create optimized picture with both desktop and mobile sources
      const optimizedPic = createOptimizedPicture(
        imgDesktop.src,
        imgDesktop.alt,
        false,
        [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }],
      );
      // Ensure img-fluid class is applied to the img inside the optimized picture
      optimizedPic.querySelector('img').classList.add('img-fluid');
      moveInstrumentation(imgDesktop, optimizedPic.querySelector('img')); // Move instrumentation from original desktop img
      cardImage.append(optimizedPic);
    } else if (pictureDesktop) {
      const img = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      cardImage.append(optimizedPic);
    } else if (pictureMobile) { // Fallback if only mobile picture is provided
      const img = pictureMobile.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '576' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      cardImage.append(optimizedPic);
    }

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell.innerHTML;
    cardText.append(description);

    cardWrap.append(cardImage, cardText);
    col.append(cardWrap);
    cardsGrid.append(col);
  });

  block.replaceChildren(section);
}
