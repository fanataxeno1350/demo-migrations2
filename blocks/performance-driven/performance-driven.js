import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  // The outer block div already has the 'performance-driven' class from AEM.
  // The original HTML shows a <section class="section spirit-of-rise"> as the top-level wrapper.
  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise'); // Classes from ORIGINAL HTML

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Add data attributes from ORIGINAL HTML
  heading.dataset.aosEasing = 'ease-in-out';
  heading.dataset.aos = 'fade-up';
  heading.dataset.aosDelay = '200';
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  // Add data attributes from ORIGINAL HTML
  subheading.dataset.aos = 'fade-up';
  subheading.dataset.aosOffset = '100';
  subheading.dataset.aosDuration = '650';
  subheading.dataset.aosEasing = 'ease-in-out';
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  // The original HTML has a div with 'performance-driven performace-driven-home'
  // directly inside the section. The block itself is also 'performance-driven'.
  // We need to ensure this inner div is created.
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

      const linkEl = document.createElement('a');
      linkEl.classList.add('performace-driven-cards-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
        linkEl.target = '_blank';
      }

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');

      const desktopPicture = imageDesktopCell?.querySelector('picture');
      const mobilePicture = imageMobileCell?.querySelector('picture');

      if (desktopPicture) {
        const desktopImg = desktopPicture.querySelector('img');
        if (desktopImg) {
          // Create the optimized picture for desktop
          const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);

          // If a mobile picture exists, create a source element for it
          if (mobilePicture) {
            const mobileImg = mobilePicture.querySelector('img');
            if (mobileImg) {
              const source = document.createElement('source');
              source.media = '(max-width: 576px)';
              source.srcset = mobileImg.src;
              optimizedDesktopPic.prepend(source); // Add mobile source to the desktop picture
            }
          }
          cardImage.append(optimizedDesktopPic);
          moveInstrumentation(imageDesktopCell, optimizedDesktopPic.querySelector('img'));
        }
      }

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card');

      const desc = document.createElement('p'); // Use <p> as per ORIGINAL HTML
      desc.classList.add('desc');
      if (descriptionCell) {
        // description is richtext, so use innerHTML
        desc.innerHTML = descriptionCell.innerHTML;
      }
      homeBoxCard.append(desc);

      cardWrapper.append(cardImage, homeBoxCard);
      linkEl.append(cardWrapper);
      cardsWrapper.append(linkEl);
      moveInstrumentation(row, linkEl);
    });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);

  // The block.querySelectorAll('picture > img') loop at the end is redundant
  // because createOptimizedPicture is already called for each image in the loop above.
  // Removing it to avoid double optimization and potential issues.
}
