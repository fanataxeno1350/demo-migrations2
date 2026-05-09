import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [headingRow, subheadingRow, ...cardRows] = children;

  const section = document.createElement('section');
  // section.classList.add('section', 'spirit-of-rise'); // Removed: block already has 'performance-driven'
  section.classList.add('spirit-of-rise'); // Added spirit-of-rise from original HTML

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

  section.append(sectionHeader);

  const performanceDrivenContainer = document.createElement('div');
  performanceDrivenContainer.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Original HTML has target="_blank"
    }

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureMobile = imageMobileCell?.querySelector('picture');
    const pictureDesktop = imageDesktopCell?.querySelector('picture');

    if (pictureDesktop || pictureMobile) {
      const picture = document.createElement('picture');
      const sourceMobile = pictureMobile?.querySelector('img')
        ? `<source media="(max-width: 576px)" srcset="${pictureMobile.querySelector('img').src}">`
        : '';
      const imgDesktop = pictureDesktop?.querySelector('img');

      if (imgDesktop) {
        picture.innerHTML = `${sourceMobile}<img src="${imgDesktop.src}" alt="${imgDesktop.alt || ''}">`;
        cardImage.append(picture);

        // Optimize images
        const imgElement = picture.querySelector('img');
        if (imgElement) {
          const optimizedPic = createOptimizedPicture(imgElement.src, imgElement.alt, false, [{ width: '750' }]);
          // moveInstrumentation should be called on the original picture element, not the img inside the optimized one
          moveInstrumentation(picture, optimizedPic);
          picture.replaceWith(optimizedPic);
        }
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell?.innerHTML || '';
    homeBoxCard.append(description);

    cardWrapper.append(cardImage, homeBoxCard);
    moveInstrumentation(row, linkEl); // Move instrumentation from the row to the link element
    linkEl.append(cardWrapper);
    cardsWrapper.append(linkEl);
  });

  container.append(cardsWrapper);
  performanceDrivenContainer.append(container);
  section.append(performanceDrivenContainer);

  block.replaceChildren(section);
}
