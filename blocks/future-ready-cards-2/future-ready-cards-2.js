import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise'); // Correct: 'spirit-of-rise' is from ORIGINAL HTML, not block name

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.textContent.trim();
  moveInstrumentation(descriptionRow, description); // Added moveInstrumentation for descriptionRow
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const performaceDrivenCards = document.createElement('div');
  performaceDrivenCards.classList.add('performace-driven-cards');
  container.append(performaceDrivenCards);

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, cardLabelCell, linkCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Added target="_blank" from ORIGINAL HTML
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    linkEl.append(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.append(cardImage);

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    const picture = document.createElement('picture'); // Create picture element once

    if (pictureMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      const imgMobile = pictureMobile.querySelector('img');
      if (imgMobile) {
        sourceMobile.srcset = imgMobile.src;
        picture.append(sourceMobile);
      }
    }

    if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      if (imgDesktop) {
        // createOptimizedPicture returns a <picture> element, not just an <img>
        // We need to append the img from the optimized picture to our existing picture element
        const optimizedPicture = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPicture.querySelector('img');
        if (optimizedImg) {
          moveInstrumentation(imgDesktop, optimizedImg); // Move instrumentation from original img to optimized img
          picture.append(optimizedImg);
        }
      }
    }
    // Only append the picture if it has content (either desktop or mobile)
    if (picture.children.length > 0) {
      cardImage.append(picture);
    }


    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.append(homeBoxCard);

    const desc = document.createElement('p');
    desc.classList.add('desc');
    // cardLabelCell is type=text, so its innerHTML is "<p>content</p>".
    // Assigning to <p> creates <p><p>content</p></p>, which is invalid.
    // Use textContent for plain text cells.
    desc.textContent = cardLabelCell.textContent.trim();
    homeBoxCard.append(desc);

    performaceDrivenCards.append(linkEl);
  });

  section.append(performanceDriven);
  block.replaceChildren(section);
}
