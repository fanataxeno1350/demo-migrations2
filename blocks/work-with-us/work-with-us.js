import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [sectionHeadingRow, containerRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(sectionHeadingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  // FIX: Replaced direct children[0] access with named destructuring for sectionHeadingRow
  const [sectionHeadingCell] = [...sectionHeadingRow.children];
  heading.textContent = sectionHeadingCell?.textContent.trim() || '';
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  positionRelativeDiv.setAttribute('data-aos', 'fade-up');
  positionRelativeDiv.setAttribute('data-aos-offset', '100');
  positionRelativeDiv.setAttribute('data-aos-duration', '650');
  positionRelativeDiv.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(containerRow, positionRelativeDiv); // Move instrumentation from the container placeholder

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const [
      imageDesktopCell,
      imageMobile576Cell,
      imageMobile799Cell,
      slideHeadingCell,
      slideDescriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    moveInstrumentation(row, slidesDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const picture = document.createElement('picture');
    const imgDesktop = imageDesktopCell.querySelector('img');
    const imgMobile576 = imageMobile576Cell.querySelector('img');
    const imgMobile799 = imageMobile799Cell.querySelector('img');

    if (imgMobile576) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = imgMobile576.src;
      picture.append(source576);
    }
    if (imgMobile799) {
      const source799 = document.createElement('source');
      source799.media = '(max-width: 799px)';
      source799.srcset = imgMobile799.src;
      picture.append(source799);
    }

    if (imgDesktop) {
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      newImg.classList.add('img-fluid');
      newImg.title = imgDesktop.title; // Copy title if available
      picture.append(...optimizedPic.children);
    }
    imageWrapDiv.append(picture);
    wrapDiv.append(imageWrapDiv);


    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = slideHeadingCell?.textContent.trim() || '';
    contentSectionHeader.append(slideHeading);

    const slideDescription = document.createElement('p');
    slideDescription.classList.add('text-size-body');
    slideDescription.innerHTML = slideDescriptionCell?.innerHTML || '';
    contentSectionHeader.append(slideDescription);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const originalCtaAnchor = ctaLinkCell?.querySelector('a');
    if (originalCtaAnchor) {
      ctaLink.href = originalCtaAnchor.href;
    }
    ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';
    contentSectionHeader.append(ctaLink);

    contentWrapDiv.append(contentSectionHeader);
    wrapDiv.append(contentWrapDiv);
    slidesDiv.append(wrapDiv);
    gridLayoutDiv.append(slidesDiv);
  });

  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);
}
