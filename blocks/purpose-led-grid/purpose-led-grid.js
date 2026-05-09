import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Remove the block's own class from the block element as it will be added to the inner wrapper
  block.classList.remove('purpose-led-grid');

  const cards = [...block.children].filter(
    (row) =>
      row.children.length === 4 &&
      (row.querySelector('picture') || row.querySelector('a'))
  );

  const gridContainer = document.createElement('div');
  // Add the block's own class to the inner wrapper, along with other classes from ORIGINAL HTML
  gridContainer.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cards.forEach((cardRow) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, cardLinkCell] = [
      ...cardRow.children,
    ];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', '700');

    const cardLink = cardLinkCell.querySelector('a');
    const anchor = document.createElement('a');
    if (cardLink) {
      anchor.href = cardLink.href;
      anchor.target = '_blank';
    }
    anchor.classList.add('card-wrap');
    moveInstrumentation(cardRow, anchor);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      if (imgDesktop && imgMobile) {
        // Create optimized picture for mobile first
        const optimizedPicture = createOptimizedPicture(
          imgDesktop.src,
          imgDesktop.alt,
          false,
          [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }],
        );

        // Update the source for mobile to use the mobile image src
        const sourceMobile = optimizedPicture.querySelector('source[media="(max-width: 576px)"]');
        if (sourceMobile) {
          sourceMobile.srcset = imgMobile.src;
        }

        const img = optimizedPicture.querySelector('img');
        if (img) {
          img.classList.add('img-fluid');
        }

        // moveInstrumentation for the entire picture element, not just the img
        moveInstrumentation(pictureDesktop, optimizedPicture);
        cardImage.appendChild(optimizedPicture);
      }
    }

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    // Fix: descriptionCell contains <p>...</p>, assigning to <p> creates <p><p>...</p></p>
    // Use a div for richtext content to avoid invalid nesting.
    const descriptionContent = document.createElement('div'); // Changed to div
    descriptionContent.classList.add('desc');
    descriptionContent.innerHTML = descriptionCell.innerHTML;

    cardText.appendChild(descriptionContent);

    anchor.appendChild(cardImage);
    anchor.appendChild(cardText);
    col.appendChild(anchor);
    gridContainer.appendChild(col);
  });

  block.replaceChildren(gridContainer);
}
