import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader); // Move instrumentation from headingRow to sectionHeader

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.dataset.aosEasing = 'ease-in-out';
  heading.dataset.aos = 'fade-up';
  heading.dataset.aosDelay = '200';
  const [headingCell] = [...headingRow.children];
  heading.textContent = headingCell?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.dataset.aos = 'fade-up';
  description.dataset.aosOffset = '100';
  description.dataset.aosDuration = '650';
  description.dataset.aosEasing = 'ease-in-out';
  const [descriptionCell] = [...descriptionRow.children];
  description.textContent = descriptionCell?.textContent.trim() || '';
  sectionHeader.append(description);

  section.append(sectionHeader);

  // Performance Driven Cards Section
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, cardLabelCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = cardLinkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, cardLink); // Move instrumentation from card item row to the new link

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const pictureDesktop = imageDesktopCell?.querySelector('picture');
    const pictureMobile = imageMobileCell?.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      if (imgDesktop && imgMobile) {
        const optimizedPic = createOptimizedPicture(
          imgDesktop.src,
          imgDesktop.alt,
          false,
          [{ media: '(max-width: 576px)', width: '576', url: imgMobile.src }, { width: '750' }],
        );
        cardImage.append(optimizedPic);
      }
    } else if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        cardImage.append(optimizedPic);
      }
    } else if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      if (imgMobile) {
        const optimizedPic = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ width: '576' }]);
        cardImage.append(optimizedPic);
      }
    }

    cardWrapper.append(cardImage);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const cardDesc = document.createElement('p');
    cardDesc.classList.add('desc');
    // cardLabelCell is type=text, so innerHTML is safe and preserves line breaks
    cardDesc.innerHTML = cardLabelCell?.innerHTML || '';

    cardBox.append(cardDesc);
    cardWrapper.append(cardBox);
    cardLink.append(cardWrapper);
    performaceDrivenCards.append(cardLink);
  });

  container.append(performaceDrivenCards);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
