import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, headerDiv); // Move instrumentation from the first row

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  headerDiv.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading); // Move instrumentation from the second row
  subheading.textContent = subheadingRow.textContent.trim();
  headerDiv.append(subheading);

  section.append(headerDiv);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageMobileCell, imageDesktopCell, descriptionCell, cardLinkCell] = [...row.children];

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

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const pictureMobile = imageMobileCell.querySelector('picture');
    const pictureDesktop = imageDesktopCell.querySelector('picture');

    if (pictureMobile && pictureDesktop) {
      const imgMobileSrc = pictureMobile.querySelector('img')?.src;
      const imgDesktopSrc = pictureDesktop.querySelector('img')?.src;
      const imgDesktopAlt = pictureDesktop.querySelector('img')?.alt || '';

      const optimizedPic = createOptimizedPicture(
        imgDesktopSrc,
        imgDesktopAlt,
        false,
        [{ media: '(max-width: 576px)', width: '576', url: imgMobileSrc }, { width: '750' }],
      );
      // move instrumentation from the original picture element to the new optimized one
      moveInstrumentation(pictureDesktop, optimizedPic);
      cardImageDiv.append(optimizedPic);
    }

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, description);

    cardBox.append(description);
    cardWrapper.append(cardImageDiv, cardBox);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
