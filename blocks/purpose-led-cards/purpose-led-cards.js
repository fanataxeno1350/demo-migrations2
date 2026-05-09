import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // Removed 'section' class as the outer block div already has it from AEM.
  // The block name is 'purpose-led-cards', but the original HTML uses 'spirit-of-rise'
  // for the outer section. We should use the classes from the original HTML.
  section.classList.add('grey-bg', 'spirit-of-rise');

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  heading.textContent = headingRow.textContent.trim(); // Use textContent for plain text
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  subheading.setAttribute('data-aos', 'fade-up');
  subheading.setAttribute('data-aos-offset', '100');
  subheading.setAttribute('data-aos-duration', '650');
  subheading.setAttribute('data-aos-easing', 'ease-in-out');
  subheading.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(subheadingRow, subheading);
  subheading.textContent = subheadingRow.textContent.trim(); // Use textContent for plain text
  sectionHeader.append(subheading);

  container.append(sectionHeader);

  const rowGrid = document.createElement('div');
  rowGrid.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows.forEach((cardRow, index) => {
    const [imageCell, imageMobileCell, descriptionCell, cardLinkCell] = [...cardRow.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    // Original HTML has data-aos-delay="700" for all cards.
    // The generated JS had a staggered delay, which is not in the original.
    // Reverting to original delay. If staggering is desired, it should be explicitly in the model.
    col.setAttribute('data-aos-delay', '700');

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    const linkElement = cardLinkCell.querySelector('a');
    if (linkElement) {
      cardLink.href = linkElement.href;
      cardLink.target = '_blank'; // From original HTML
    }
    moveInstrumentation(cardRow, cardLink);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = document.createElement('picture');

    // Mobile image source
    const sourceMobile = document.createElement('source');
    sourceMobile.setAttribute('media', '(max-width: 576px)');
    const imgMobile = imageMobileCell.querySelector('img');
    if (imgMobile) {
      sourceMobile.srcset = imgMobile.src; // Use imgMobile.src directly for srcset
    }
    picture.append(sourceMobile);

    // Main image
    const img = imageCell.querySelector('img');
    if (img) {
      // createOptimizedPicture returns a <picture> element.
      // We need to extract the <img> from it and append it.
      const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const mainImgElement = optimizedPicture.querySelector('img');
      if (mainImgElement) {
        mainImgElement.classList.add('img-fluid');
        picture.append(mainImgElement);
      }
    }
    cardImage.append(picture);
    cardLink.append(cardImage);

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    const description = document.createElement('p');
    description.classList.add('desc');
    // descriptionCell is richtext, so innerHTML is correct.
    description.innerHTML = descriptionCell.innerHTML;
    cardText.append(description);
    cardLink.append(cardText);

    col.append(cardLink);
    rowGrid.append(col);
  });

  container.append(rowGrid);
  section.append(container);
  block.replaceChildren(section);
}
