import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // FIX: headingRow is a row, not a cell. Access its first child (the cell) for content.
  // Also, heading is a text field, so textContent is appropriate.
  heading.textContent = headingRow.children[0]?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  // FIX: descriptionRow is a row, not a cell. Access its first child (the cell) for content.
  // Also, description is a text field, so textContent is appropriate.
  description.textContent = descriptionRow.children[0]?.textContent.trim() || '';
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, cardLabelCell, cardLinkCell] = [...row.children];

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
    const imgDesktop = pictureDesktop ? pictureDesktop.querySelector('img') : null;
    if (imgDesktop) {
      const optimizedPicDesktop = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      moveInstrumentation(imgDesktop, optimizedPicDesktop.querySelector('img'));
      cardImage.append(optimizedPicDesktop);
    }

    const pictureMobile = imageMobileCell.querySelector('picture');
    const imgMobile = pictureMobile ? pictureMobile.querySelector('img') : null;
    if (imgMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = imgMobile.src;
      // Ensure picture element exists before prepending source
      const existingPicture = cardImage.querySelector('picture');
      if (existingPicture) {
        existingPicture.prepend(sourceMobile);
      } else {
        // Fallback if no picture element was created for desktop, create one for mobile
        const newPicture = document.createElement('picture');
        newPicture.append(sourceMobile);
        const newImg = document.createElement('img');
        newImg.src = imgMobile.src;
        newImg.alt = imgMobile.alt;
        newPicture.append(newImg);
        cardImage.append(newPicture);
      }
    }

    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    // FIX: cardLabel is a text field, but the original HTML shows it can contain <br/>,
    // so innerHTML is safer than textContent to preserve formatting.
    desc.innerHTML = cardLabelCell.innerHTML;
    homeBoxCard.append(desc);

    cardWrapper.append(homeBoxCard);
    cardLink.append(cardWrapper);
    cardsContainer.append(cardLink);
  });

  container.append(cardsContainer);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
