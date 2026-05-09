import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Distinguish header rows from card item rows
  const headingRow = children[0];
  const subheadingRow = children[1];
  const cardRows = children.slice(2);

  const section = document.createElement('section');
  // The block's own class 'future-ready' is already on the outer div.
  // Add other classes from ORIGINAL HTML to the inner wrapper.
  section.classList.add('grey-bg', 'spirit-of-rise'); // Removed 'section' as it's a generic tag name, not a block-specific class

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
    moveInstrumentation(subheadingRow, subheading); // Move instrumentation from subheadingRow to subheading
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

  cardRows
    .filter(row => row.children.length > 0 && [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

      const cardLink = document.createElement('a');
      cardLink.classList.add('performace-driven-cards-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        cardLink.href = foundLink.href;
        cardLink.target = '_blank'; // From original HTML
      }
      moveInstrumentation(row, cardLink);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      const pictureDesktop = imageDesktopCell?.querySelector('picture');
      const pictureMobile = imageMobileCell?.querySelector('picture');

      if (pictureDesktop && pictureMobile) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = pictureMobile.querySelector('img')?.src;

        const img = pictureDesktop.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.prepend(sourceMobile);
        cardImage.append(optimizedPic);
      } else if (pictureDesktop) {
        const img = pictureDesktop.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        cardImage.append(optimizedPic);
      } else if (pictureMobile) {
        const img = pictureMobile.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        cardImage.append(optimizedPic);
      }

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card');

      if (descriptionCell) {
        const desc = document.createElement('p');
        desc.classList.add('desc');
        // Fix: richtext cell innerHTML contains <p>... so assigning it to <p> creates <p><p>...</p></p>
        // Extract the innerHTML of the first <p> or fallback to textContent
        desc.innerHTML = descriptionCell.querySelector('p')?.innerHTML ?? descriptionCell.textContent.trim();
        homeBoxCard.append(desc);
      }

      cardWrapper.append(cardImage, homeBoxCard);
      cardLink.append(cardWrapper);
      cardsContainer.append(cardLink);
    });

  container.append(cardsContainer);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
