import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('grey-bg', 'spirit-of-rise'); // Removed 'section' class as outer block already has it

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader); // Move instrumentation from headingRow to sectionHeader

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  // Heading is type=text, read directly from cell.textContent.trim()
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  subheading.classList.add('aos-init', 'aos-animate');
  // Subheading is type=text, read directly from cell.textContent.trim()
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageMobileCell, imageDesktopCell, cardTextCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = document.createElement('picture');
    const sourceMobile = document.createElement('source');
    sourceMobile.setAttribute('media', '(max-width: 576px)');
    const imgMobile = imageMobileCell.querySelector('img');
    if (imgMobile) {
      sourceMobile.srcset = imgMobile.src;
    }

    const imgDesktop = imageDesktopCell.querySelector('img');
    const img = document.createElement('img');
    if (imgDesktop) {
      img.src = imgDesktop.src;
      img.alt = imgDesktop.alt;
    }

    picture.append(sourceMobile, img);
    cardImage.append(picture);

    // Optimize images
    cardImage.querySelectorAll('picture > img').forEach((image) => {
      const optimizedPic = createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]);
      moveInstrumentation(image, optimizedPic.querySelector('img'));
      image.closest('picture').replaceWith(optimizedPic);
    });

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = cardTextCell.innerHTML; // richtext content

    homeBoxCard.append(desc);
    cardWrapper.append(cardImage, homeBoxCard);
    cardLink.append(cardWrapper);
    performaceDrivenCards.append(cardLink);
  });

  container.append(performaceDrivenCards);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
