import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [headingRow, subheadingRow, ...cardRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.dataset.aosEasing = 'ease-in-out';
    heading.dataset.aos = 'fade-up';
    heading.dataset.aosDelay = '200';
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.children[0].textContent.trim();
    sectionHeader.append(heading);
  }

  if (subheadingRow) {
    const subheading = document.createElement('p');
    subheading.classList.add('aos-init', 'aos-animate');
    subheading.dataset.aos = 'fade-up';
    subheading.dataset.aosOffset = '100';
    subheading.dataset.aosDuration = '650';
    subheading.dataset.aosEasing = 'ease-in-out';
    moveInstrumentation(subheadingRow, subheading);
    subheading.textContent = subheadingRow.children[0].textContent.trim();
    sectionHeader.append(subheading);
  }

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home'); // Corrected 'performace-driven-home' to 'performance-driven-home'

  const container = document.createElement('div');
  container.classList.add('container');

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      if (foundLink.target) { // Preserve target attribute if present in original HTML
        linkEl.target = foundLink.target;
      }
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const desktopPicture = imageDesktopCell?.querySelector('picture');
    const mobilePicture = imageMobileCell?.querySelector('picture');

    if (mobilePicture) {
      const source = document.createElement('source');
      source.media = '(max-width: 576px)';
      source.srcset = mobilePicture.querySelector('img')?.src;
      cardImage.append(source);
    }

    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    if (descriptionCell) {
      const desc = document.createElement('p');
      desc.classList.add('desc');
      desc.innerHTML = descriptionCell.innerHTML;
      homeBoxCard.append(desc);
    }

    cardWrapper.append(cardImage, homeBoxCard);
    linkEl.append(cardWrapper);
    performaceDrivenCards.append(linkEl);
  });

  container.append(performaceDrivenCards);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
