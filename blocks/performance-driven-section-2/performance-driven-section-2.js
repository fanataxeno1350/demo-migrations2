import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Block name 'performance-driven-section-2' is NOT added here

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  if (headingRow) {
    // headingRow is a row, its child is the cell
    const headingCell = headingRow.children[0];
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      heading.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, heading);
      sectionHeader.append(heading);
    }
  }

  if (subheadingRow) {
    // subheadingRow is a row, its child is the cell
    const subheadingCell = subheadingRow.children[0];
    if (subheadingCell) {
      const subheading = document.createElement('p');
      subheading.classList.add('aos-init', 'aos-animate');
      subheading.textContent = subheadingCell.textContent.trim();
      moveInstrumentation(subheadingRow, subheading);
      sectionHeader.append(subheading);
    }
  }

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // Use array destructuring for fixed-schema card item rows
    const [desktopImageCell, mobileImageCell, descriptionCell, linkCell] = [...row.children];

    const link = document.createElement('a');
    link.classList.add('performace-driven-cards-link');
    const foundLink = linkCell ? linkCell.querySelector('a') : null;
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank'; // Assuming target="_blank" from original HTML
    }

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    if (desktopImageCell && mobileImageCell) {
      const desktopPicture = desktopImageCell.querySelector('picture');
      const mobilePicture = mobileImageCell.querySelector('picture');

      if (desktopPicture && mobilePicture) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 576px)';
        sourceMobile.srcset = mobilePicture.querySelector('img')?.src || '';

        const img = document.createElement('img');
        img.src = desktopPicture.querySelector('img')?.src || '';
        img.alt = desktopPicture.querySelector('img')?.alt || '';

        const picture = document.createElement('picture');
        picture.append(sourceMobile, img);
        cardImage.append(picture);

        // Optimize images
        cardImage.querySelectorAll('picture > img').forEach((image) => {
          const optimizedPic = createOptimizedPicture(image.src, image.alt, false, [{ width: '750' }]);
          // moveInstrumentation should be called on the original image element, not the new optimized one
          // The original image is replaced, so instrumentation needs to be moved from the original picture/img
          // to the new picture/img that replaces it.
          // For createOptimizedPicture, it returns a <picture> element. We need to move instrumentation
          // from the original picture to the new one, or from the original img to the new img.
          // Given the structure, it's safer to move from the original cell to the new picture.
          // However, the current implementation replaces the picture, so we'll move from the original image.
          // This is a common pattern, but it's important to ensure the correct element is instrumented.
          // For now, we'll keep it as is, assuming createOptimizedPicture handles the replacement correctly
          // and the instrumentation is moved to the new img within the optimized picture.
          moveInstrumentation(image, optimizedPic.querySelector('img'));
          image.closest('picture').replaceWith(optimizedPic);
        });
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('desc');
      // description is type=text, but original HTML shows it can contain <br/>, so use innerHTML
      // and read from the cell's innerHTML, not textContent, to preserve potential HTML.
      // The original JS used textContent.trim().replace(/\n/g, '<br/>'), which is a manual
      // attempt to preserve line breaks. If the original HTML had <br/>, innerHTML is better.
      // Given the EDS structure says type=text, it's usually plain text.
      // However, the original HTML shows `<p>Best in<br/> Talent</p>`, meaning the cell
      // content is `<p>Best in<br/> Talent</p>`. Assigning `textContent` would flatten this.
      // Assigning `innerHTML` to a `<p>` would create `<p><p>Best in<br/> Talent</p></p>`,
      // which is invalid.
      // The best approach for a `type=text` cell that might contain `<br/>` is to
      // extract the content of the inner `<p>` if it exists, or fall back to `textContent`.
      description.innerHTML = descriptionCell.querySelector('p')?.innerHTML ?? descriptionCell.textContent.trim();
      homeBoxCard.append(description);
    }

    cardWrapper.append(cardImage, homeBoxCard);
    link.append(cardWrapper);
    cardsWrapper.append(link);
    moveInstrumentation(row, link);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
