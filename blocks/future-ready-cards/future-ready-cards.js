import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Removed 'spirit-of-rise' as block already has it
  section.classList.add('section', 'grey-bg'); // Added 'section' and 'grey-bg' from original HTML

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  heading.textContent = headingRow ? headingRow.textContent.trim() : '';
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  subheading.textContent = subheadingRow ? subheadingRow.textContent.trim() : '';
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  // Performance Driven Cards
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows
    .filter((row) => row.children.length === 4)
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

      const link = document.createElement('a');
      link.classList.add('performace-driven-cards-link');
      const foundLink = linkCell ? linkCell.querySelector('a') : null;
      if (foundLink) {
        link.href = foundLink.href;
        link.target = '_blank'; // Assuming target blank from original HTML
      }
      moveInstrumentation(row, link);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      const picture = document.createElement('picture');
      const imgDesktop = imageDesktopCell ? imageDesktopCell.querySelector('img') : null;
      const imgMobile = imageMobileCell ? imageMobileCell.querySelector('img') : null;

      if (imgMobile) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = imgMobile.src;
        picture.append(sourceMobile);
      }

      if (imgDesktop) {
        const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        if (optimizedImg) {
          optimizedImg.alt = imgDesktop.alt;
          picture.append(optimizedImg);
        }
      }
      cardImage.append(picture);
      cardWrapper.append(cardImage);

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card');

      const description = document.createElement('p');
      description.classList.add('desc');
      // description.innerHTML = descriptionCell ? descriptionCell.innerHTML : ''; // descriptionCell is a cell, its innerHTML is already <p>content</p>
      description.innerHTML = descriptionCell?.querySelector('p')?.innerHTML ?? descriptionCell?.textContent.trim() ?? ''; // Extract content from inner <p> or fallback to textContent
      homeBoxCard.append(description);
      cardWrapper.append(homeBoxCard);
      link.append(cardWrapper);
      cardsWrapper.append(link);
    });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
