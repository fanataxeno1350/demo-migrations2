import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
  }

  if (subheadingRow) {
    const subheading = document.createElement('p');
    subheading.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(subheadingRow, subheading);
    subheading.textContent = subheadingRow.textContent.trim();
    sectionHeader.append(subheading);
  }

  const performanceDrivenHome = document.createElement('div');
  performanceDrivenHome.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // Destructure card item cells based on BlockJson model
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // From original HTML
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = document.createElement('picture');

    const sourceMobile = document.createElement('source');
    sourceMobile.media = '(max-width: 576px)';
    const imgMobile = imageMobileCell?.querySelector('img');
    if (imgMobile) {
      sourceMobile.srcset = imgMobile.src;
    }

    const imgDesktop = imageDesktopCell?.querySelector('img');
    const img = document.createElement('img');
    if (imgDesktop) {
      img.src = imgDesktop.src;
      img.alt = imgDesktop.alt;
    }

    picture.append(sourceMobile, img);
    cardImage.append(picture);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    if (descriptionCell) {
      description.textContent = descriptionCell.textContent.trim();
    }

    homeBoxCard.append(description);
    cardWrapper.append(cardImage, homeBoxCard);
    linkEl.append(cardWrapper);
    performaceDrivenCards.append(linkEl);
  });

  container.append(performaceDrivenCards);
  performanceDrivenHome.append(container);

  const root = document.createElement('section');
  root.classList.add('section', 'spirit-of-rise');
  root.append(sectionHeader, performanceDrivenHome);

  block.replaceChildren(root);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation needs to be called on the original img element,
    // then the new optimized img element is passed to it.
    // The original img element is replaced by the new picture element.
    const originalImgParent = img.closest('div'); // Assuming img is directly in a div or picture
    if (originalImgParent) {
      moveInstrumentation(originalImgParent, optimizedPic.querySelector('img'));
    }
    img.closest('picture').replaceWith(optimizedPic);
  });
}
