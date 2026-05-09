import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children].filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some(
        (c) => c.children.length > 0 || c.textContent.trim() !== '',
      ),
  );

  const [headingRow, descriptionRow, ...cardRows] = children;

  const section = document.createElement('section');
  // Removed 'spirit-of-rise' as it's the block's own class and already on the outer div
  section.classList.add('section', 'grey-bg');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  section.append(sectionHeader);

  // Heading
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
  }

  // Description
  if (descriptionRow) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionRow, description);
    description.textContent = descriptionRow.textContent.trim();
    sectionHeader.append(description);
  }

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');
  section.append(performanceDriven);

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const performanceCards = document.createElement('div');
  performanceCards.classList.add('performace-driven-cards');
  container.append(performanceCards);

  cardRows.forEach((row) => {
    const [imageMobileCell, imageDesktopCell, labelCell, linkCell] = [
      ...row.children,
    ];

    const link = document.createElement('a');
    link.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      // Copy data attributes from original link if any
      [...foundLink.attributes].forEach(attr => {
        if (attr.name.startsWith('data-')) {
          link.setAttribute(attr.name, attr.value);
        }
      });
      // Copy target attribute
      if (foundLink.target) {
        link.target = foundLink.target;
      }
    }
    moveInstrumentation(row, link);
    performanceCards.append(link);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    link.append(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.append(cardImage);

    if (imageMobileCell || imageDesktopCell) {
      const picture = document.createElement('picture');

      const mobileImg = imageMobileCell?.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = mobileImg.src;
        picture.append(sourceMobile);
      }

      const desktopImg = imageDesktopCell?.querySelector('img');
      if (desktopImg) {
        const optimizedPicture = createOptimizedPicture(
          desktopImg.src,
          desktopImg.alt,
          false,
          [{ width: '750' }],
        );
        // createOptimizedPicture returns a <picture> element, we need its <img> child
        const imgElement = optimizedPicture.querySelector('img');
        if (imgElement) {
          moveInstrumentation(desktopImg, imgElement);
          picture.append(imgElement);
        }
      }
      cardImage.append(picture);
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.append(homeBoxCard);

    if (labelCell) {
      // label is richtext, so use innerHTML and put into a div to avoid <p> inside <p>
      const label = document.createElement('div'); // Changed from <p> to <div>
      label.classList.add('desc');
      label.innerHTML = labelCell.innerHTML;
      homeBoxCard.append(label);
    }
  });

  block.replaceChildren(section);
}
