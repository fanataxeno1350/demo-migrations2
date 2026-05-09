import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure the first two rows (heading and description) and then the card rows
  const [headingRow, descriptionRow, ...cardRowsRaw] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.children[0]?.textContent.trim() || ''; // Access cell content
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.children[0]?.textContent.trim() || ''; // Access cell content
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performaceDriven = document.createElement('div');
  performaceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  // All remaining rows are card rows based on the model
  cardRowsRaw.forEach((row) => {
    const [imageMobileCell, imageDesktopCell, cardDescriptionCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Add target="_blank" from original HTML
    }
    moveInstrumentation(cardLinkCell, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const mobilePicture = imageMobileCell?.querySelector('picture');
    const desktopPicture = imageDesktopCell?.querySelector('picture');

    if (mobilePicture || desktopPicture) {
      const picture = document.createElement('picture');
      const imgElement = desktopPicture?.querySelector('img') || mobilePicture?.querySelector('img');
      if (imgElement) {
        const optimizedPic = createOptimizedPicture(imgElement.src, imgElement.alt, false, [
          { media: '(max-width: 576px)', width: '576' }, // Use a reasonable mobile width
          { width: '750' }, // Desktop width
        ]);
        // Move instrumentation from the original picture/img to the new optimized picture
        moveInstrumentation(imageMobileCell, optimizedPic.querySelector('img'));
        moveInstrumentation(imageDesktopCell, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic); // Replace the temporary picture with the optimized one
        cardImage.append(optimizedPic);
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.textContent = cardDescriptionCell?.textContent.trim() || '';
    moveInstrumentation(cardDescriptionCell, desc);
    homeBoxCard.append(desc);

    cardWrapper.append(cardImage, homeBoxCard);
    cardLink.append(cardWrapper);
    performaceDrivenCards.append(cardLink);
  });

  container.append(performaceDrivenCards);
  performaceDriven.append(container);
  section.append(performaceDriven);

  block.replaceChildren(section);
}
