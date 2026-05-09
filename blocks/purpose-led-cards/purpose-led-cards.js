import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // block.classList already contains 'purpose-led-cards' and 'spirit-of-rise'
  // Adding 'spirit-of-rise' again to an inner wrapper causes double padding/CSS.
  // The 'section' and 'grey-bg' classes are from the original HTML and are valid.
  section.classList.add('section', 'grey-bg');

  const container = document.createElement('div');
  container.classList.add('container');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // headingRow is a row, its first child is the cell containing the text.
  // The EDS Block Structure indicates 'heading' is type=text, so read textContent directly.
  heading.textContent = headingRow.children[0]?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  // descriptionRow is a row, its first child is the cell containing the text.
  // The EDS Block Structure indicates 'description' is type=text, so read textContent directly.
  description.textContent = descriptionRow.children[0]?.textContent.trim() || '';
  moveInstrumentation(descriptionRow, description);
  sectionHeader.append(description);

  container.append(sectionHeader);

  // Cards Grid
  const cardsGrid = document.createElement('div');
  cardsGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row) => {
      // Fixed schema for purpose-led-card-item, use destructuring
      const [imageDesktopCell, imageMobileCell, linkCell, descriptionCell] = [...row.children];

      const col = document.createElement('div');
      col.classList.add('col-md-6', 'aos-init', 'aos-animate');
      moveInstrumentation(row, col);

      const cardWrap = document.createElement('a');
      cardWrap.classList.add('card-wrap');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        cardWrap.href = foundLink.href;
        cardWrap.target = '_blank'; // Assuming target blank from original HTML
      }

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      const pictureDesktop = imageDesktopCell?.querySelector('picture');
      const pictureMobile = imageMobileCell?.querySelector('picture');

      if (pictureDesktop || pictureMobile) {
        // createOptimizedPicture expects an img src and alt, and returns a <picture> element.
        // We should construct the img src/alt first, then pass to createOptimizedPicture.
        // The original code was trying to append the img from optimizedPic.querySelector('img')
        // directly, which is redundant as createOptimizedPicture already returns a picture.
        let imgSrc = '';
        let imgAlt = '';
        let sources = [];

        if (pictureMobile) {
          const mobileImg = pictureMobile.querySelector('img');
          if (mobileImg) {
            sources.push({ media: '(max-width: 576px)', srcset: mobileImg.src });
            // If only mobile image is present, use its src/alt as default
            if (!pictureDesktop) {
              imgSrc = mobileImg.src;
              imgAlt = mobileImg.alt || '';
            }
          }
        }

        if (pictureDesktop) {
          const desktopImg = pictureDesktop.querySelector('img');
          if (desktopImg) {
            imgSrc = desktopImg.src; // Desktop image is primary
            imgAlt = desktopImg.alt || '';
          }
        }

        if (imgSrc) {
          const optimizedPicture = createOptimizedPicture(imgSrc, imgAlt, false, [{ width: '750' }], sources);
          // moveInstrumentation should be called on the original picture/img if it exists,
          // but since we're creating a new one, we move it to the new picture element.
          // The original picture elements are not directly moved, but their content is used.
          // For instrumentation, we can move it from the original cell to the new picture.
          moveInstrumentation(imageDesktopCell || imageMobileCell, optimizedPicture);
          cardImage.append(optimizedPicture);
        }
      }

      const cardText = document.createElement('div');
      cardText.classList.add('card-text');

      const desc = document.createElement('p');
      desc.classList.add('desc');
      // description is type=richtext, so read innerHTML directly from the cell
      desc.innerHTML = descriptionCell?.innerHTML || '';
      cardText.append(desc);

      cardWrap.append(cardImage, cardText);
      col.append(cardWrap);
      cardsGrid.append(col);
    });

  container.append(cardsGrid);
  section.append(container);
  block.replaceChildren(section);
}
