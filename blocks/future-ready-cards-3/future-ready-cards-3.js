import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [headingRow, subheadingRow, ...cardRows] = children;

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, linkEl);

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
        const optimizedPicture = createOptimizedPicture(
          imgDesktop.src,
          imgDesktop.alt,
          false,
          [{ media: '(max-width: 576px)', width: '576', url: imgMobile.src }],
          [{ width: '750' }],
        );
        cardImage.append(optimizedPicture);
      }
    } else if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        const optimizedPicture = createOptimizedPicture(
          imgDesktop.src,
          imgDesktop.alt,
          false,
          [{ width: '750' }],
        );
        cardImage.append(optimizedPicture);
      }
    } else if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      if (imgMobile) {
        const optimizedPicture = createOptimizedPicture(
          imgMobile.src,
          imgMobile.alt,
          false,
          [{ width: '576' }],
        );
        cardImage.append(optimizedPicture);
      }
    }
    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell.innerHTML;
    homeBoxCard.append(description);

    cardWrapper.append(homeBoxCard);
    linkEl.append(cardWrapper);
    performaceDrivenCards.append(linkEl);
  });

  container.append(performaceDrivenCards);
  performanceDriven.append(container);

  const root = document.createElement('section');
  root.classList.add('section', 'grey-bg', 'spirit-of-rise');
  root.append(sectionHeader);
  root.append(performanceDriven);

  block.replaceChildren(root);
}
