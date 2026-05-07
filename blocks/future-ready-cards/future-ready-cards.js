import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  // CHECK 0.5: block.classList.add('section', 'spirit-of-rise'); is applied to the block div itself.
  // The block name 'future-ready-cards' is not added to any inner wrapper. This is correct.

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  if (descriptionRow) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    description.textContent = descriptionRow.textContent.trim();
    moveInstrumentation(descriptionRow, description);
    sectionHeader.append(description);
  }

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // CHECK 0: Replaced direct bracket access with destructuring for fixed-schema item rows.
    // CHECK 2.6 A: For container item rows with fixed schema, cells MUST be read by index destructuring.
    const [imageDesktopCell, imageMobileCell, cardDescriptionCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank';
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      if (imgDesktop && imgMobile) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = imgMobile.src;
        cardImage.append(sourceMobile);

        const img = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        cardImage.append(img);
        moveInstrumentation(imageDesktopCell, img);
      }
    }

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    // CHECK 0.7 B: Fixed <p>-inside-<p> violation. Card description is type=text, but original HTML
    // shows it wrapped in <p> with <br/> tags, so it's safer to use a <div> to preserve structure.
    const description = document.createElement('div'); // Changed from <p> to <div>
    description.classList.add('desc');
    description.innerHTML = cardDescriptionCell.innerHTML; // Use innerHTML to preserve <br/>
    moveInstrumentation(cardDescriptionCell, description);
    cardBox.append(description);

    cardWrapper.append(cardImage, cardBox);
    cardLink.append(cardWrapper);
    performaceDrivenCards.append(cardLink);
  });

  container.append(performaceDrivenCards);
  performanceDriven.append(container);

  block.replaceChildren(sectionHeader, performanceDriven);

  // The block's own class 'future-ready-cards' is not added here,
  // but 'section' and 'spirit-of-rise' are from the original HTML.
  block.classList.add('section', 'spirit-of-rise');
}
