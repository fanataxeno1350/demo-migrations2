import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // The outer block div already has 'purpose-led' class from AEM.
  // The original HTML has 'section grey-bg spirit-of-rise' on the outer <section>.
  // So, add only the classes from the original HTML's outer section.
  section.classList.add('grey-bg', 'spirit-of-rise');
  moveInstrumentation(block, section); // Move instrumentation from block to the new section

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  if (headingRow || descriptionRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

    if (headingRow) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      // No data-aos attributes, as per Rule 19
      moveInstrumentation(headingRow, heading);
      // heading is richtext, use innerHTML from the cell, not the row
      heading.innerHTML = headingRow.children[0]?.innerHTML || '';
      sectionHeader.append(heading);
    }

    if (descriptionRow) {
      const description = document.createElement('p');
      description.classList.add('aos-init', 'aos-animate');
      // No data-aos attributes, as per Rule 19
      moveInstrumentation(descriptionRow, description);
      // description is plain text, use textContent from the cell
      description.textContent = descriptionRow.children[0]?.textContent.trim() || '';
      sectionHeader.append(description);
    }
    container.append(sectionHeader);
  }

  // Cards Grid
  const cardsGrid = document.createElement('div');
  cardsGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');
  // No specific placeholder row for cards container, instrumentation should be on the block itself
  // moveInstrumentation(cardsContainerPlaceholder, cardsGrid); // Removed, as cardsContainerPlaceholder is not a distinct row for instrumentation

  cardRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row) => {
      // Fixed schema for purpose-led-card, use destructuring
      const [imageMobileCell, imageDesktopCell, imageAltCell, linkCell, cardTextCell] = [...row.children];

      const col = document.createElement('div');
      col.classList.add('col-md-6', 'aos-init', 'aos-animate');
      // No data-aos attributes, as per Rule 19

      const cardWrap = document.createElement('a');
      cardWrap.classList.add('card-wrap');
      moveInstrumentation(row, cardWrap); // Move instrumentation from row to the card link

      const link = linkCell?.querySelector('a');
      if (link) {
        cardWrap.href = link.href;
        // The original HTML has target="_blank", add it.
        cardWrap.target = '_blank';
      }

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      const pictureMobile = imageMobileCell?.querySelector('picture');
      const pictureDesktop = imageDesktopCell?.querySelector('picture');
      const altText = imageAltCell?.textContent.trim() || '';

      if (pictureMobile && pictureDesktop) {
        // createOptimizedPicture handles combining sources and img, no need for manual picture creation
        // The createOptimizedPicture function expects the original img src and alt,
        // and returns a new <picture> element.
        // We need to extract the img src from the picture elements.

        const mobileSrc = pictureMobile.querySelector('img')?.src || '';
        const desktopSrc = pictureDesktop.querySelector('img')?.src || '';

        // Create a temporary img to pass to createOptimizedPicture for desktop
        const tempImg = document.createElement('img');
        tempImg.src = desktopSrc;
        tempImg.alt = altText;
        tempImg.classList.add('img-fluid'); // Add img-fluid to the img inside the optimized picture

        const optimizedPic = createOptimizedPicture(tempImg.src, tempImg.alt, false, [{ media: '(max-width: 576px)', width: '750', srcset: mobileSrc }, { width: '750' }]);
        
        // Ensure img-fluid is applied to the final img within the optimized picture
        optimizedPic.querySelector('img').classList.add('img-fluid');

        cardImage.append(optimizedPic);
        moveInstrumentation(imageDesktopCell, optimizedPic.querySelector('img')); // Move instrumentation to the main img
      }


      const cardText = document.createElement('div');
      cardText.classList.add('card-text');
      if (cardTextCell) {
        const descP = document.createElement('p');
        descP.classList.add('desc');
        // cardText is richtext, use innerHTML from the cell
        descP.innerHTML = cardTextCell.innerHTML;
        cardText.append(descP);
      }

      cardWrap.append(cardImage, cardText);
      col.append(cardWrap);
      cardsGrid.append(col);
    });

  container.append(cardsGrid);
  block.replaceChildren(section);
}
