import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cards = [...block.children];

  // The outer block div already has 'performance-driven-cards-2' from AEM.
  // The original HTML shows 'performance-driven performace-driven-home' as the root wrapper.
  // We should create this root wrapper and move the block's content into it.
  const root = document.createElement('div');
  root.classList.add('performance-driven', 'performace-driven-home'); // Classes from ORIGINAL HTML

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container'); // Class from ORIGINAL HTML
  root.append(containerDiv);

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards'); // Class from ORIGINAL HTML
  containerDiv.append(performaceDrivenCards);

  cards.forEach((cardRow) => {
    // Fixed schema for performance-driven-card-item: imageDesktop, imageMobile, description, link
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...cardRow.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link'); // Class from ORIGINAL HTML
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = foundLink.target || '_blank'; // Ensure target is taken from original link if present, else default
    }
    moveInstrumentation(cardRow, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper'); // Class from ORIGINAL HTML
    cardLink.append(cardWrapper);

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image'); // Class from ORIGINAL HTML
    cardWrapper.append(cardImageDiv);

    const desktopImg = imageDesktopCell.querySelector('img');
    const mobileImg = imageMobileCell.querySelector('img');

    // Create optimized picture with sources for responsive images
    let optimizedPicture;
    if (desktopImg) {
      optimizedPicture = createOptimizedPicture(
        desktopImg.src,
        desktopImg.alt || '',
        false, // Eager loading for cards
        [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }], // Mobile and Desktop widths
      );
      // If mobile image exists, update the srcset for the mobile source
      if (mobileImg) {
        const sourceMobile = optimizedPicture.querySelector('source[media="(max-width: 576px)"]');
        if (sourceMobile) {
          sourceMobile.srcset = mobileImg.src;
        } else {
          // Fallback if createOptimizedPicture didn't create the mobile source (shouldn't happen with above widths)
          const newSourceMobile = document.createElement('source');
          newSourceMobile.media = '(max-width: 576px)';
          newSourceMobile.srcset = mobileImg.src;
          optimizedPicture.prepend(newSourceMobile);
        }
      }
    } else if (mobileImg) {
      // If only mobile image is available
      optimizedPicture = createOptimizedPicture(
        mobileImg.src,
        mobileImg.alt || '',
        false,
        [{ width: '576' }],
      );
    } else {
      // No image available
      optimizedPicture = document.createElement('picture');
    }

    cardImageDiv.append(optimizedPicture);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card'); // Class from ORIGINAL HTML
    cardWrapper.append(homeBoxCard);

    const descriptionDiv = document.createElement('div'); // Use div for richtext content to avoid <p> inside <p>
    descriptionDiv.classList.add('desc'); // Class from ORIGINAL HTML
    descriptionDiv.innerHTML = descriptionCell.innerHTML; // Description is type=text but can contain <br/> from original HTML, so innerHTML is safer.
    homeBoxCard.append(descriptionDiv);

    performaceDrivenCards.append(cardLink);
  });

  block.replaceChildren(root);
}
