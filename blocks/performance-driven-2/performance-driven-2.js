import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure the root rows based on the BlockJson model
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  // Move instrumentation for the heading and subheading rows to the sectionHeader
  moveInstrumentation(headingRow, sectionHeader);
  moveInstrumentation(subheadingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // Destructure cells for each card row based on the 'performance-driven-2-card' model
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank';
    }
    moveInstrumentation(row, cardLink); // Move instrumentation from the row to the cardLink

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      if (imgMobile) {
        const optimizedPicMobile = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ media: '(max-width: 576px)', width: '576' }]);
        // moveInstrumentation(imgMobile, optimizedPicMobile.querySelector('img')); // No need to move instrumentation for individual img elements within a picture
        cardImage.append(optimizedPicMobile); // Append the entire picture element
      }
    }

    if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        const optimizedPicDesktop = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        // moveInstrumentation(imgDesktop, optimizedPicDesktop.querySelector('img')); // No need to move instrumentation for individual img elements within a picture
        cardImage.append(optimizedPicDesktop); // Append the entire picture element
      }
    }

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    // descriptionCell is richtext, so use innerHTML
    description.innerHTML = descriptionCell.innerHTML;
    cardBox.append(description);

    cardWrapper.append(cardImage, cardBox);
    cardLink.append(cardWrapper);
    cardsContainer.append(cardLink);
  });

  container.append(cardsContainer);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
