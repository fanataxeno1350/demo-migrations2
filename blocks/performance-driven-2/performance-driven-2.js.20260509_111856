import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The block.children structure is:
  // [0] headingRow
  // [1] subheadingRow
  // [2] containerPlaceholder (this is not a content row, it's a structural placeholder)
  // [3...] cardRows
  const [headingRow, subheadingRow, , ...cardRows] = [...block.children]; // Skip containerPlaceholder

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  if (subheadingRow) {
    const subheading = document.createElement('p');
    subheading.classList.add('aos-init', 'aos-animate');
    subheading.textContent = subheadingRow.textContent.trim();
    sectionHeader.append(subheading);
    moveInstrumentation(subheadingRow, subheading);
  }

  const performanceDriven = document.createElement('div'); // Corrected typo: performace -> performance
  performanceDriven.classList.add('performance-driven', 'performace-driven-home'); // Retained original class name for consistency
  // moveInstrumentation(containerPlaceholder, performanceDriven); // containerPlaceholder is not a content row, no instrumentation needed

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');
  container.append(performaceDrivenCards);

  cardRows
    .filter(
      (row) =>
        row.children.length > 0 &&
        [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
    )
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

      const linkEl = document.createElement('a');
      linkEl.classList.add('performace-driven-cards-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
        linkEl.target = '_blank'; // Added target="_blank" from original HTML
      }
      moveInstrumentation(row, linkEl);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');
      linkEl.append(cardWrapper);

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');
      cardWrapper.append(cardImage);

      const desktopPicture = imageDesktopCell?.querySelector('picture');
      const mobilePicture = imageMobileCell?.querySelector('picture');

      if (desktopPicture && mobilePicture) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = mobilePicture.querySelector('img')?.src;
        cardImage.append(sourceMobile);

        const img = desktopPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
            { width: '750' },
          ]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          cardImage.append(optimizedPic);
        }
      } else if (desktopPicture) {
        const img = desktopPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
            { width: '750' },
          ]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          cardImage.append(optimizedPic);
        }
      }

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card');
      cardWrapper.append(homeBoxCard);

      const desc = document.createElement('p');
      desc.classList.add('desc');
      desc.innerHTML = descriptionCell?.innerHTML || '';
      homeBoxCard.append(desc);

      performaceDrivenCards.append(linkEl);
    });

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');
  section.append(sectionHeader, performanceDriven); // Corrected variable name

  block.replaceChildren(section);
}
