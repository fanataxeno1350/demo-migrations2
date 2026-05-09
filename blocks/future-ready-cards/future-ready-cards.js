import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos-easing', 'ease-in-out');
    heading.setAttribute('data-aos', 'fade-up');
    heading.setAttribute('data-aos-delay', '200');
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
  }

  if (subheadingRow) {
    const subheading = document.createElement('p');
    subheading.setAttribute('data-aos', 'fade-up');
    subheading.setAttribute('data-aos-offset', '100');
    subheading.setAttribute('data-aos-duration', '650');
    subheading.setAttribute('data-aos-easing', 'ease-in-out');
    subheading.classList.add('aos-init', 'aos-animate');
    subheading.textContent = subheadingRow.textContent.trim();
    sectionHeader.append(subheading);
  }

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');
  container.append(performaceDrivenCards);

  cardRows
    .filter(
      (row) =>
        row.children.length > 0 &&
        [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
    )
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

      const linkEl = document.createElement('a');
      linkEl.classList.add('performace-driven-cards-link');
      const foundLink = linkCell?.querySelector('a');
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

      const pictureDesktop = imageDesktopCell?.querySelector('picture');
      const pictureMobile = imageMobileCell?.querySelector('picture');

      if (pictureDesktop || pictureMobile) {
        const sourceMobile = pictureMobile?.querySelector('source');
        const imgDesktop = pictureDesktop?.querySelector('img');

        const picture = document.createElement('picture');
        if (sourceMobile) {
          const newSource = document.createElement('source');
          newSource.media = '(max-width: 576px)';
          newSource.srcset = sourceMobile.srcset;
          picture.append(newSource);
        }

        if (imgDesktop) {
          const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [
            { width: '756' },
          ]);
          // moveInstrumentation should be called on the original img element,
          // and then the optimized picture's img should replace it.
          // createOptimizedPicture returns a <picture> element, not just an <img>.
          // We need to append the entire optimized picture.
          moveInstrumentation(imgDesktop, optimizedPic.querySelector('img'));
          picture.append(optimizedPic.querySelector('img'));
        }
        cardImage.append(picture);
      }

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card');
      cardWrapper.append(homeBoxCard);

      if (descriptionCell) {
        const description = document.createElement('p');
        description.classList.add('desc');
        description.innerHTML = descriptionCell.innerHTML;
        homeBoxCard.append(description);
      }

      performaceDrivenCards.append(linkEl);
    });

  block.replaceChildren(sectionHeader, performanceDriven);
}
