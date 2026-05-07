import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const headingCell = headingRow.querySelector('div');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingCell ? headingCell.textContent.trim() : '';
  sectionHeader.append(heading);

  const subheadingCell = subheadingRow.querySelector('div');
  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingCell ? subheadingCell.textContent.trim() : '';
  sectionHeader.append(subheading);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [desktopImageCell, mobileImageCell, descriptionCell, linkCell] = [...row.children];

    const link = document.createElement('a');
    link.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank'; // From original HTML
    }
    moveInstrumentation(row, link);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const desktopPicture = desktopImageCell.querySelector('picture');
    const mobilePicture = mobileImageCell.querySelector('picture');

    if (desktopPicture && mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const desktopImg = desktopPicture.querySelector('img');

      if (mobileImg && desktopImg) {
        const optimizedPic = createOptimizedPicture(
          desktopImg.src,
          desktopImg.alt,
          false,
          [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }],
        );
        // Ensure instrumentation is moved for the original images if they exist
        moveInstrumentation(mobileImg, optimizedPic.querySelector('source[media="(max-width: 576px)"]'));
        moveInstrumentation(desktopImg, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    } else if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(desktopImg, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    } else if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      if (mobileImg) {
        const optimizedPic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '576' }]);
        moveInstrumentation(mobileImg, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }

    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('div'); // Changed to div to safely contain richtext
    description.classList.add('desc');
    description.innerHTML = descriptionCell ? descriptionCell.innerHTML : '';
    homeBoxCard.append(description);

    cardWrapper.append(homeBoxCard);
    link.append(cardWrapper);
    cardsWrapper.append(link);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);

  const root = document.createElement('section');
  root.classList.add('section', 'grey-bg', 'spirit-of-rise');
  root.append(sectionHeader);
  root.append(performanceDriven);

  // The createOptimizedPicture calls are now handled within the card loop
  // and replace the original picture elements directly.
  // This block is no longer needed:
  // root.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });

  block.replaceChildren(root);
}
