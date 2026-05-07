import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  const [headingCell] = [...headingRow.children]; // Destructure for heading
  heading.textContent = headingCell?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  const [descriptionCell] = [...descriptionRow.children]; // Destructure for description
  description.textContent = descriptionCell?.textContent.trim() || '';
  sectionHeader.append(description);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, cardTitleCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
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
        const optimizedPicture = document.createElement('picture');

        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = imgMobile.src;
        optimizedPicture.append(sourceMobile);

        const img = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]).querySelector('img');
        optimizedPicture.append(img);
        cardImage.append(optimizedPicture);
      }
    }

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const cardTitle = document.createElement('p');
    cardTitle.classList.add('desc');
    // Card title can contain <br/> so use innerHTML
    cardTitle.innerHTML = cardTitleCell.innerHTML.trim();
    cardBox.append(cardTitle);

    cardWrapper.append(cardImage, cardBox);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);

  const root = document.createElement('section');
  root.classList.add('section', 'spirit-of-rise');
  root.append(sectionHeader, performanceDriven);

  block.replaceChildren(root);
}
