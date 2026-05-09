import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  const performanceDrivenContainer = document.createElement('div');
  performanceDrivenContainer.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const linkElement = linkCell?.querySelector('a');
    if (linkElement) {
      cardLink.href = linkElement.href;
      // Preserve target="_blank" if it exists in the original link
      if (linkElement.target) {
        cardLink.target = linkElement.target;
      }
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell?.querySelector('picture');
    const pictureMobile = imageMobileCell?.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      // Create optimized picture with both sources
      const optimizedPic = createOptimizedPicture(
        imgDesktop.src,
        imgDesktop.alt,
        false,
        [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }], // Mobile and Desktop widths
        imgMobile.src, // Use mobile image for the mobile source
      );
      cardImage.append(optimizedPic);
      // Move instrumentation from original img elements to the new optimized picture's img
      moveInstrumentation(imgDesktop, optimizedPic.querySelector('img'));
      if (imgMobile) {
        moveInstrumentation(imgMobile, optimizedPic.querySelector('source[media="(max-width: 576px)"]'));
      }
    } else if (pictureDesktop) {
      // Only desktop picture exists
      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      cardImage.append(optimizedPic);
      moveInstrumentation(imgDesktop, optimizedPic.querySelector('img'));
    } else if (pictureMobile) {
      // Only mobile picture exists (less common, but handle)
      const imgMobile = pictureMobile.querySelector('img');
      const optimizedPic = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '576' }]);
      cardImage.append(optimizedPic);
      moveInstrumentation(imgMobile, optimizedPic.querySelector('img'));
    }


    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    // Ensure description content is handled correctly, preserving any rich text if present
    // Although model says 'text', original HTML shows <br/>, so innerHTML is safer.
    description.innerHTML = descriptionCell?.innerHTML || '';
    cardBox.append(description);

    cardWrapper.append(cardImage, cardBox);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
  });

  container.append(cardsWrapper);
  performanceDrivenContainer.append(container);
  section.append(performanceDrivenContainer);

  block.replaceChildren(section);

  // The createOptimizedPicture calls are now handled within the loop,
  // so this block.querySelectorAll('picture > img') is no longer needed
  // as the pictures are already optimized when created.
  // If there were any other images outside the card loop, this might be relevant,
  // but for this block, it's redundant.
}
