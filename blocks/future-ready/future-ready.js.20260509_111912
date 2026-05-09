import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');
  moveInstrumentation(block, section); // Move instrumentation from block to the new section

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.textContent.trim();
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows
    .filter(row =>
      row.children.length === 4 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row) => {
      const [imageMobileCell, imageDesktopCell, cardDescriptionCell, cardLinkCell] = [...row.children];

      const cardLinkAnchor = document.createElement('a');
      cardLinkAnchor.classList.add('performace-driven-cards-link');
      const foundLink = cardLinkCell?.querySelector('a');
      if (foundLink) {
        cardLinkAnchor.href = foundLink.href;
        cardLinkAnchor.target = '_blank';
      }
      moveInstrumentation(row, cardLinkAnchor);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      const pictureMobile = imageMobileCell?.querySelector('picture');
      const pictureDesktop = imageDesktopCell?.querySelector('picture');

      if (pictureMobile && pictureDesktop) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = pictureMobile.querySelector('img')?.src || '';

        const imgDesktop = document.createElement('img');
        imgDesktop.src = pictureDesktop.querySelector('img')?.src || '';
        imgDesktop.alt = pictureDesktop.querySelector('img')?.alt || '';

        const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }]);
        optimizedPic.prepend(sourceMobile);
        cardImage.append(optimizedPic);
      } else if (pictureDesktop) {
        const imgDesktop = pictureDesktop.querySelector('img');
        if (imgDesktop) {
          const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
          cardImage.append(optimizedPic);
        }
      }

      const cardBox = document.createElement('div');
      cardBox.classList.add('performace-driven-home-box-card');

      const desc = document.createElement('p');
      desc.classList.add('desc');
      desc.innerHTML = cardDescriptionCell?.innerHTML || '';
      cardBox.append(desc);

      cardWrapper.append(cardImage, cardBox);
      cardLinkAnchor.append(cardWrapper);
      cardsContainer.append(cardLinkAnchor);
    });

  container.append(cardsContainer);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
