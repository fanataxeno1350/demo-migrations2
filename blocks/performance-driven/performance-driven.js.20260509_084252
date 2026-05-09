import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const [headingRow, descriptionRow, ...cardRows] = children; // Destructuring for fixed-schema root rows

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageMobileCell, imageDesktopCell, cardDescriptionCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank';
    }

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureMobile = imageMobileCell.querySelector('picture');
    const pictureDesktop = imageDesktopCell.querySelector('picture');

    if (pictureMobile && pictureDesktop) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = pictureMobile.querySelector('img').src;

      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      moveInstrumentation(imgDesktop, newImg);

      const newPicture = document.createElement('picture');
      newPicture.append(sourceMobile, newImg);
      cardImage.append(newPicture);
    } else if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      moveInstrumentation(imgDesktop, newImg);
      cardImage.append(optimizedPic); // Append the entire picture element
    } else if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      moveInstrumentation(imgMobile, newImg);
      cardImage.append(optimizedPic); // Append the entire picture element
    }

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const cardDesc = document.createElement('p');
    cardDesc.classList.add('desc');
    cardDesc.textContent = cardDescriptionCell.textContent.trim();

    cardBox.append(cardDesc);
    cardWrapper.append(cardImage, cardBox);
    cardLink.append(cardWrapper);
    moveInstrumentation(row, cardLink);
    performaceDrivenCards.append(cardLink);
  });

  const container = document.createElement('div');
  container.classList.add('container');
  container.append(performaceDrivenCards);

  const performaceDrivenHome = document.createElement('div');
  performaceDrivenHome.classList.add('performance-driven', 'performace-driven-home');
  performaceDrivenHome.append(container);

  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise');
  section.append(sectionHeader, performaceDrivenHome);

  block.replaceChildren(section);
}
