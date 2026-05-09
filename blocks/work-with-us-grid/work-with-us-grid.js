import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [sectionTitleRow, cardsContainerRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  // Removed 'work-with-us' class as the outer block div already has it.
  section.classList.add('section', 'pb-0');
  moveInstrumentation(block, section);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(sectionTitleRow, heading);
  heading.textContent = sectionTitleRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  cardRows.forEach((row) => {
    const [
      imageDesktopCell,
      imageMobile576Cell,
      imageMobile799Cell,
      cardTitleCell,
      cardDescriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    moveInstrumentation(row, slidesDiv); // Move instrumentation from the row to the slide container

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const picture = document.createElement('picture');

    const mobile576Source = document.createElement('source');
    mobile576Source.media = '(max-width: 576px)';
    const mobile576Img = imageMobile576Cell.querySelector('img');
    if (mobile576Img) {
      mobile576Source.srcset = mobile576Img.src;
      moveInstrumentation(mobile576Img, mobile576Source);
    }
    picture.append(mobile576Source);

    const mobile799Source = document.createElement('source');
    mobile799Source.media = '(max-width: 799px)';
    const mobile799Img = imageMobile799Cell.querySelector('img');
    if (mobile799Img) {
      mobile799Source.srcset = mobile799Img.src;
      moveInstrumentation(mobile799Img, mobile799Source);
    }
    picture.append(mobile799Source);

    const desktopImg = imageDesktopCell.querySelector('img');
    if (desktopImg) {
      // createOptimizedPicture returns a <picture> element, not just an <img>.
      // We need to append the entire picture element and then move instrumentation to its inner img.
      const optimizedPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      const imgElement = optimizedPicture.querySelector('img');
      if (imgElement) {
        imgElement.classList.add('img-fluid');
        moveInstrumentation(desktopImg, imgElement);
        picture.append(imgElement);
      }
    }
    imageWrapDiv.append(picture);
    wrapDiv.append(imageWrapDiv);

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const cardTitle = document.createElement('h3');
    cardTitle.classList.add('heading', 'font-regular');
    moveInstrumentation(cardTitleCell, cardTitle);
    cardTitle.textContent = cardTitleCell.textContent.trim();
    contentSectionHeader.append(cardTitle);

    const cardDescription = document.createElement('p');
    cardDescription.classList.add('text-size-body');
    moveInstrumentation(cardDescriptionCell, cardDescription);
    cardDescription.innerHTML = cardDescriptionCell.innerHTML;
    contentSectionHeader.append(cardDescription);

    const ctaLink = document.createElement('a');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
      moveInstrumentation(foundCtaLink, ctaLink); // Move instrumentation from the original <a> to the new <a>
    }
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentSectionHeader.append(ctaLink);

    contentWrapDiv.append(contentSectionHeader);
    wrapDiv.append(contentWrapDiv);
    slidesDiv.append(wrapDiv);
    gridLayoutDiv.append(slidesDiv);
  });

  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);
  section.append(positionRelativeDiv);

  // Move instrumentation from the container placeholder row to the gridLayoutDiv
  moveInstrumentation(cardsContainerRow, gridLayoutDiv);

  block.replaceChildren(section);
}
