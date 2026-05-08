import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // block.classList.add('future-ready-cards') is already applied by AEM.
  // Adding 'spirit-of-rise' from ORIGINAL HTML.
  section.classList.add('spirit-of-rise');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim();
  sectionHeader.append(subheading);

  section.append(sectionHeader);

  // Performance Driven Cards
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, descriptionCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
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
    const source = document.createElement('source');
    source.media = '(max-width: 576px)';
    const mobileImg = imageMobileCell.querySelector('img');
    if (mobileImg) {
      source.srcset = mobileImg.src;
    }
    picture.append(source);

    const desktopImg = imageDesktopCell.querySelector('img');
    if (desktopImg) {
      // createOptimizedPicture returns a <picture> element, not just an <img>.
      // We need to append its children (source and img) to our existing picture.
      const optimizedDesktopPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      // Append all children of the optimized picture to our current picture element
      while (optimizedDesktopPicture.firstChild) {
        picture.append(optimizedDesktopPicture.firstChild);
      }
    }
    cardImage.append(picture);
    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    // Description is type=text, but original HTML shows it can contain <br/>.
    // The BlockJson says 'valueType: string' for description, but the original HTML
    // shows `<p>Automotive &amp;<br/> Farm Equipment</p>`.
    // Reading innerHTML from the cell ensures <br/> is preserved.
    // The cell itself is `<div>example text value</div>` or `<div><p>text<br/>text</p></div>`.
    // To avoid <p><p>...</p></p> nesting, we should take the innerHTML of the cell's first child
    // if it's a paragraph, or the cell's innerHTML if it's just text.
    const descriptionContent = descriptionCell.querySelector('p')?.innerHTML || descriptionCell.innerHTML;
    description.innerHTML = descriptionContent;
    homeBoxCard.append(description);

    cardWrapper.append(homeBoxCard);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceChildren(section);

  // The original image optimization loop is redundant after fixing createOptimizedPicture usage above.
  // The images are already optimized when the card is built.
  // If there are other images outside the cards that need optimization, this loop might be needed,
  // but for the current structure, it's likely not. Removing for now.
  // section.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
