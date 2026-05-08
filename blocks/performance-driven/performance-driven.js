import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0.5: The block's own class 'performance-driven' should not be added to an inner wrapper.
  // The outer block div already carries this class from AEM.
  // The 'performace-driven-home' class is from the original HTML and is fine.
  // const performanceDrivenHome = document.createElement('div');
  // performanceDrivenHome.classList.add('performance-driven', 'performace-driven-home'); // VIOLATION

  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  // CHECK 0.5 FIX: Removed 'performance-driven' class from this inner wrapper.
  const performanceDrivenHome = document.createElement('div');
  performanceDrivenHome.classList.add('performace-driven-home'); // Corrected

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDrivenHome.append(container);

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');
  container.append(performaceDrivenCards);

  cardRows.forEach((row) => {
    // CHECK 0: No direct children[n] access. Destructuring is correct here.
    const [imageDesktopCell, imageMobileCell, cardLabelCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Original HTML has target="_blank"
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    cardLink.append(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.append(cardImage);

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    // CHECK 1.5: Correctly handling picture elements for desktop and mobile.
    // The original code was appending only the img from desktop picture, and source from mobile.
    // It should append the entire optimized picture element.
    if (pictureDesktop && pictureMobile) {
      // Create a new picture element to hold both sources and img
      const newPicture = document.createElement('picture');

      // Mobile source
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      // Ensure srcset uses the src from the img inside pictureMobile
      sourceMobile.srcset = pictureMobile.querySelector('img')?.src || '';
      newPicture.append(sourceMobile);

      // Desktop image (optimized)
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        // createOptimizedPicture returns a <picture> element, not just an <img>.
        // We need to extract the <img> from it or append the whole picture.
        // For this scenario, we want to append the <img> from the desktop picture
        // after the mobile source, as the original HTML structure suggests.
        const optimizedImg = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        // createOptimizedPicture returns a <picture> element, we need its <img> child
        const finalImg = optimizedImg.querySelector('img');
        if (finalImg) {
          newPicture.append(finalImg);
        }
      }
      cardImage.append(newPicture); // Append the complete new picture element
    } else if (pictureDesktop) {
      // Fallback if only desktop picture is available
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        cardImage.append(optimizedPic); // Append the whole optimized picture element
      }
    } else if (pictureMobile) {
      // Fallback if only mobile picture is available
      const imgMobile = pictureMobile.querySelector('img');
      if (imgMobile) {
        const optimizedPic = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '576' }]);
        cardImage.append(optimizedPic); // Append the whole optimized picture element
      }
    }


    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.append(homeBoxCard);

    // CHECK 0.7 B: <p>-inside-<p> violation. cardLabelCell is richtext, its innerHTML is "<p>...</p>".
    // Assigning to <p>desc> creates <p><p>...</p></p>.
    // FIX: Use a <div> for richtext content to avoid invalid nesting.
    const desc = document.createElement('div'); // Changed from 'p' to 'div'
    desc.classList.add('desc');
    desc.innerHTML = cardLabelCell.innerHTML;
    homeBoxCard.append(desc);

    performaceDrivenCards.append(cardLink);
  });

  block.replaceChildren(sectionHeader, performanceDrivenHome);
}
