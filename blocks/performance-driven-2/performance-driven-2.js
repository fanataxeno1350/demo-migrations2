import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('grey-bg', 'spirit-of-rise'); // Removed 'section' as block already has it

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
  }

  if (subheadingRow) {
    const subheading = document.createElement('p');
    subheading.classList.add('aos-init', 'aos-animate');
    subheading.textContent = subheadingRow.textContent.trim();
    sectionHeader.append(subheading);
  }
  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');
  container.append(cardsWrapper);

  cardRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

      const link = document.createElement('a');
      link.classList.add('performace-driven-cards-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        if (foundLink.target) link.target = foundLink.target; // Preserve target attribute
      }
      moveInstrumentation(row, link);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');
      link.append(cardWrapper);

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');
      cardWrapper.append(cardImage);

      const pictureDesktop = imageDesktopCell?.querySelector('picture');
      const pictureMobile = imageMobileCell?.querySelector('picture');

      if (pictureDesktop || pictureMobile) {
        const sources = [];
        if (pictureMobile) {
          const mobileImg = pictureMobile.querySelector('img');
          if (mobileImg) {
            sources.push({ media: '(max-width: 576px)', srcset: mobileImg.src });
          }
        }
        if (pictureDesktop) {
          const desktopImg = pictureDesktop.querySelector('img');
          if (desktopImg) {
            const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }], sources);
            // moveInstrumentation from the original img to the new optimized img within the picture
            const newImg = optimizedPic.querySelector('img');
            if (newImg) {
              moveInstrumentation(desktopImg, newImg);
            }
            cardImage.append(optimizedPic);
          }
        } else if (pictureMobile) { // If only mobile picture exists, use it as fallback for desktop
          const mobileImg = pictureMobile.querySelector('img');
          if (mobileImg) {
            const optimizedPic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }], sources);
            const newImg = optimizedPic.querySelector('img');
            if (newImg) {
              moveInstrumentation(mobileImg, newImg);
            }
            cardImage.append(optimizedPic);
          }
        }
      }

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card');
      cardWrapper.append(homeBoxCard);

      if (descriptionCell) {
        const description = document.createElement('p');
        description.classList.add('desc');
        description.innerHTML = descriptionCell.innerHTML; // Use innerHTML to preserve <br/>
        homeBoxCard.append(description);
      }
      cardsWrapper.append(link);
    });
  section.append(performanceDriven);
  block.replaceChildren(section);
}
