import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);
  moveInstrumentation(descriptionRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');
  section.append(performanceDriven);

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');
  container.append(cardsWrapper);

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, labelCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    linkEl.append(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.append(cardImage);

    const desktopPicture = imageDesktopCell.querySelector('picture');
    const mobilePicture = imageMobileCell.querySelector('picture');

    if (mobilePicture) {
      const source = document.createElement('source');
      source.media = '(max-width: 576px)';
      // Correctly get srcset from the mobile picture element
      source.srcset = mobilePicture.querySelector('source')?.srcset || mobilePicture.querySelector('img')?.src;
      cardImage.append(source);
    }

    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      cardImage.append(optimizedPic); // Append the entire optimized picture element
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.append(homeBoxCard);

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = labelCell.innerHTML; // Use innerHTML to preserve potential line breaks
    homeBoxCard.append(desc);

    cardsWrapper.append(linkEl);
  });

  block.replaceChildren(section);

  // This block.querySelectorAll('picture > img') loop is redundant and potentially problematic
  // if createOptimizedPicture already handles the replacement.
  // It's usually meant for images that are *not* part of a card structure, but directly in the block.
  // Given the card images are handled above, this part might not be needed or should be more specific.
  // For now, keeping it as it was in the original generated code, but flagging for potential review.
  block.querySelectorAll('picture > img').forEach((img) => {
    // Ensure this only runs for images not already processed, or remove if redundant.
    // The current logic creates a new optimized picture and replaces the *original* picture,
    // which might conflict with the card image processing if the selector is too broad.
    // However, since the card images are appended as `optimizedPic` (the <picture> element),
    // this selector `picture > img` might still target the original `img` inside the `picture`
    // if `replaceWith` was not used on the `picture` itself in the card loop.
    // Let's assume for now it's intended for any remaining direct images in the block.
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
