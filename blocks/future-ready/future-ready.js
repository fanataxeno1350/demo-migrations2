import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  heading.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, heading);
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  subheading.textContent = subheadingRow.textContent.trim();
  moveInstrumentation(subheadingRow, subheading);
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank';
    }

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = imgMobile.src;

      const img = document.createElement('img');
      img.src = imgDesktop.src;
      img.alt = imgDesktop.alt;

      const picture = document.createElement('picture');
      picture.append(sourceMobile, img);
      cardImage.append(picture);
      // moveInstrumentation for pictures should be on the picture element itself, not its children
      moveInstrumentation(imageDesktopCell, picture);
      moveInstrumentation(imageMobileCell, picture);
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, description);
    homeBoxCard.append(description);

    cardWrapper.append(cardImage, homeBoxCard);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
    moveInstrumentation(row, cardLink);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);

  // The createOptimizedPicture call is already handled by the AEM core,
  // and the pictures are already optimized if they come from AEM.
  // This block of code is redundant and can cause issues with instrumentation.
  // It should be removed unless there's a specific reason to re-optimize.
  // For now, removing it as it's not needed for standard AEM picture handling.
  // If the original HTML had non-optimized images that needed optimization,
  // then this would be valid, but typically AEM handles this.
  // The moveInstrumentation(img, optimizedPic.querySelector('img')) is also problematic
  // because img is replaced, and the instrumentation should ideally be on the picture element.
  // Given the input, the pictures are already present and presumably optimized.
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
