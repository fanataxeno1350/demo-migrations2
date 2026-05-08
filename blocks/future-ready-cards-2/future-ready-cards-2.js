import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Block already has 'future-ready-cards-2' class, and outer div has 'section' and 'grey-bg' from AEM. Adding again causes double padding/CSS.
  // The original HTML shows 'section grey-bg spirit-of-rise' on the outermost element.
  // The block's own class 'future-ready-cards-2' is on the outer div.
  // The generated JS creates a new <section> element.
  // The original HTML's <section> has classes 'section grey-bg spirit-of-rise'.
  // We should add these classes to the new 'section' element created here.
  // The block's own class 'future-ready-cards-2' should NOT be added here.
  section.classList.add('grey-bg', 'spirit-of-rise'); // 'section' is the tag name, not a class to add.

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader); // Move instrumentation from headingRow to sectionHeader

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

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target="_blank" from original HTML
    }
    moveInstrumentation(row, cardLink); // Move instrumentation from card row to the link

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = document.createElement('picture');
    if (imageMobileCell) {
      const mobileImg = imageMobileCell.querySelector('img');
      if (mobileImg) {
        const source = document.createElement('source');
        source.media = '(max-width: 576px)';
        source.srcset = mobileImg.src;
        picture.append(source);
      }
    }

    if (imageDesktopCell) {
      const desktopImg = imageDesktopCell.querySelector('img');
      if (desktopImg) {
        const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
        // createOptimizedPicture returns a <picture> element, not just an <img>.
        // We should append the entire optimized picture, or its children, to the existing picture element.
        // The original code was appending optimizedPic.querySelector('img') which is redundant if optimizedPic is already a picture.
        // Let's append the children of the optimized picture to the existing picture.
        Array.from(optimizedPic.children).forEach((child) => picture.append(child));
      }
    }
    cardImage.append(picture);
    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    if (descriptionCell) {
      const desc = document.createElement('div'); // Changed to div to safely contain richtext <p>
      desc.classList.add('desc');
      desc.innerHTML = descriptionCell.innerHTML; // richtext content, can contain <p> etc.
      homeBoxCard.append(desc);
    }
    cardWrapper.append(homeBoxCard);
    cardLink.append(cardWrapper);
    cardsContainer.append(cardLink);
  });

  container.append(cardsContainer);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
