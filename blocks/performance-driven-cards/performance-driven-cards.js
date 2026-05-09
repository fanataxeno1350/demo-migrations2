import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  // The outer block div already has 'performance-driven-cards' class from AEM.
  // The original HTML shows the root element inside the block is a <section class="section spirit-of-rise">.
  // We should create this section and move the block's content into it.
  const section = document.createElement('section');
  section.classList.add('section', 'spirit-of-rise'); // Classes from ORIGINAL HTML

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3'); // Classes from ORIGINAL HTML
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate'); // Classes from ORIGINAL HTML
  // Preserve data attributes from original headingRow
  if (headingRow.children[0]) {
    [...headingRow.children[0].attributes].forEach((attr) => {
      if (attr.name.startsWith('data-')) {
        heading.setAttribute(attr.name, attr.value);
      }
    });
  }
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate'); // Classes from ORIGINAL HTML
  // Preserve data attributes from original subheadingRow
  if (subheadingRow.children[0]) {
    [...subheadingRow.children[0].attributes].forEach((attr) => {
      if (attr.name.startsWith('data-')) {
        subheading.setAttribute(attr.name, attr.value);
      }
    });
  }
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home'); // Classes from ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // Classes from ORIGINAL HTML

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards'); // Classes from ORIGINAL HTML

  cardRows
    .filter(
      (row) =>
        row.children.length > 0 &&
        [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
    )
    .forEach((row) => {
      // Fixed schema for performance-card-item, using destructuring as per CHECK 1
      const [imageMobileCell, imageDesktopCell, descriptionCell, linkCell] = [...row.children];

      const linkEl = document.createElement('a');
      linkEl.classList.add('performace-driven-cards-link'); // Class from ORIGINAL HTML
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
        linkEl.target = foundLink.target || '_blank'; // Preserve target from original link
      }
      moveInstrumentation(row, linkEl);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper'); // Class from ORIGINAL HTML

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image'); // Class from ORIGINAL HTML

      if (imageMobileCell || imageDesktopCell) {
        const mobilePicture = imageMobileCell?.querySelector('picture');
        const desktopPicture = imageDesktopCell?.querySelector('picture');

        if (mobilePicture && desktopPicture) {
          const mobileSource = mobilePicture.querySelector('source');
          const desktopImg = desktopPicture.querySelector('img');

          if (mobileSource && desktopImg) {
            const picture = document.createElement('picture');
            const source = document.createElement('source');
            source.media = '(max-width: 576px)';
            source.srcset = mobileSource.srcset;
            picture.append(source);

            // createOptimizedPicture returns a <picture> element, not just an <img>.
            // We need to append the entire picture element.
            const optimizedDesktopPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [
              { width: '750' },
            ]);
            // Append all children of the optimized picture (source, img)
            while (optimizedDesktopPicture.firstChild) {
              picture.append(optimizedDesktopPicture.firstChild);
            }
            cardImage.append(picture);
          }
        } else if (mobilePicture) {
          const optimizedPicture = createOptimizedPicture(
            mobilePicture.querySelector('img').src,
            mobilePicture.querySelector('img').alt,
            false,
            [{ width: '750' }],
          );
          cardImage.append(optimizedPicture); // Append the entire picture element
        } else if (desktopPicture) {
          const optimizedPicture = createOptimizedPicture(
            desktopPicture.querySelector('img').src,
            desktopPicture.querySelector('img').alt,
            false,
            [{ width: '750' }],
          );
          cardImage.append(optimizedPicture); // Append the entire picture element
        }
      }

      cardWrapper.append(cardImage);

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card'); // Class from ORIGINAL HTML

      const description = document.createElement('p');
      description.classList.add('desc'); // Class from ORIGINAL HTML
      // descriptionCell is richtext, so innerHTML is correct.
      // CHECK 0.7B: description is a <p>, so assigning innerHTML directly from a cell
      // that contains "<p>content</p>" would create <p><p>content</p></p>.
      // Fix: extract innerHTML of the paragraph inside the cell, or use a <div>.
      // Given the original HTML uses <p class="desc">, we should extract the inner content.
      description.innerHTML = descriptionCell?.querySelector('p')?.innerHTML ?? descriptionCell?.textContent.trim() ?? '';
      homeBoxCard.append(description);

      cardWrapper.append(homeBoxCard);
      linkEl.append(cardWrapper);
      cardsWrapper.append(linkEl);
    });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);
}
