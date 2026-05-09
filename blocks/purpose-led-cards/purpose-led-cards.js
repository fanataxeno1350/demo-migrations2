import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const container = document.createElement('div');
  container.classList.add('container');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  const [headingCell] = [...headingRow.children]; // Destructuring for fixed schema
  heading.innerHTML = headingCell?.innerHTML || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  const [descriptionCell] = [...descriptionRow.children]; // Destructuring for fixed schema
  // Description is type=text in model, but original HTML shows it can contain <br/>, so innerHTML is safer.
  description.innerHTML = descriptionCell?.innerHTML || '';
  moveInstrumentation(descriptionRow, description);
  sectionHeader.append(description);

  container.append(sectionHeader);

  // Cards Grid
  const cardsGrid = document.createElement('div');
  cardsGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows
    .filter((row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, cardLinkCell, cardDescriptionCell] = [...row.children];

      const col = document.createElement('div');
      col.classList.add('col-md-6', 'aos-init', 'aos-animate');
      moveInstrumentation(row, col);

      const cardLink = cardLinkCell?.querySelector('a');
      const cardWrap = document.createElement('a');
      if (cardLink) {
        cardWrap.href = cardLink.href;
        cardWrap.target = '_blank';
      }
      cardWrap.classList.add('card-wrap');

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      const pictureDesktop = imageDesktopCell?.querySelector('picture');
      const pictureMobile = imageMobileCell?.querySelector('picture');

      if (pictureDesktop || pictureMobile) {
        const desktopImg = pictureDesktop?.querySelector('img');
        const mobileImg = pictureMobile?.querySelector('img');

        const picture = document.createElement('picture');
        if (mobileImg) {
          const source = document.createElement('source');
          source.media = '(max-width: 576px)';
          source.srcset = mobileImg.src;
          picture.append(source);
        }
        if (desktopImg) {
          // Use createOptimizedPicture directly for the desktop image
          const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
          optimizedDesktopPic.querySelector('img').classList.add('img-fluid');
          picture.append(optimizedDesktopPic.querySelector('img'));
        }
        cardImage.append(picture);
      }
      cardWrap.append(cardImage);

      const cardText = document.createElement('div');
      cardText.classList.add('card-text');

      const descriptionP = document.createElement('p');
      descriptionP.classList.add('desc');
      descriptionP.innerHTML = cardDescriptionCell?.innerHTML || '';
      cardText.append(descriptionP);

      cardWrap.append(cardText);
      col.append(cardWrap);
      cardsGrid.append(col);
    });

  container.append(cardsGrid);
  section.append(container);

  block.replaceChildren(section);

  // The original image optimization loop is redundant because createOptimizedPicture
  // is already used when creating the images for the cards.
  // Removing it to prevent double optimization and potential issues.
}
