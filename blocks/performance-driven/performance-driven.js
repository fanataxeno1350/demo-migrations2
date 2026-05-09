import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
  }

  if (descriptionRow) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionRow, description);
    description.textContent = descriptionRow.textContent.trim();
    sectionHeader.append(description);
  }

  const performanceDrivenContainer = document.createElement('div');
  performanceDrivenContainer.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row) => {
      // Destructure card item cells based on BlockJson model
      const [desktopImageCell, mobileImageCell, labelCell, linkCell] = [...row.children];

      const cardLink = document.createElement('a');
      cardLink.classList.add('performace-driven-cards-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        cardLink.href = foundLink.href;
      }
      moveInstrumentation(row, cardLink);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      const desktopPicture = desktopImageCell?.querySelector('picture');
      const mobilePicture = mobileImageCell?.querySelector('picture');

      if (mobilePicture) {
        const source = document.createElement('source');
        source.media = '(max-width: 576px)';
        const mobileImg = mobilePicture.querySelector('img');
        if (mobileImg) {
          source.srcset = mobileImg.src;
          cardImage.append(source);
        }
      }

      if (desktopPicture) {
        const desktopImg = desktopPicture.querySelector('img');
        if (desktopImg) {
          const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
          const imgEl = optimizedPic.querySelector('img');
          if (imgEl) {
            moveInstrumentation(desktopImg, imgEl);
          }
          cardImage.append(optimizedPic);
        }
      }

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card');

      const desc = document.createElement('p');
      desc.classList.add('desc');
      if (labelCell) {
        // Corrected: label is richtext, but assigning innerHTML of cell directly to <p>
        // creates <p><p>...</p></p>. Extract inner <p> content or use textContent.
        desc.innerHTML = labelCell.querySelector('p')?.innerHTML ?? labelCell.textContent.trim();
      }

      homeBoxCard.append(desc);
      cardWrapper.append(cardImage, homeBoxCard);
      cardLink.append(cardWrapper);
      performaceDrivenCards.append(cardLink);
    });

  container.append(performaceDrivenCards);
  performanceDrivenContainer.append(container);

  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise');
  section.append(sectionHeader, performanceDrivenContainer);

  block.replaceChildren(section);
}
