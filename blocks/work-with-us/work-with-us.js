import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(titleRow, heading);
  // FIX: Use named destructuring for titleRow to avoid direct children[0] access
  const [titleCell] = [...titleRow.children];
  heading.textContent = titleCell?.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  positionRelativeDiv.setAttribute('data-aos', 'fade-up');
  positionRelativeDiv.setAttribute('data-aos-offset', '100');
  positionRelativeDiv.setAttribute('data-aos-duration', '650');
  positionRelativeDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const container = document.createElement('div');
  container.classList.add('container');
  positionRelativeDiv.append(container);

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');
  container.append(gridLayout);

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');
  gridLayout.append(slidesContainer);

  slideRows.forEach((row) => {
    const [
      imageMobile576Cell,
      imageMobile799Cell,
      imageDesktopCell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    moveInstrumentation(row, wrap);

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');

    const sourceMobile576 = document.createElement('source');
    sourceMobile576.media = '(max-width: 576px)';
    sourceMobile576.srcset = imageMobile576Cell.querySelector('img')?.src || '';
    picture.append(sourceMobile576);

    const sourceMobile799 = document.createElement('source');
    sourceMobile799.media = '(max-width: 799px)';
    sourceMobile799.srcset = imageMobile799Cell.querySelector('img')?.src || '';
    picture.append(sourceMobile799);

    const img = imageDesktopCell.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('img-fluid');
      moveInstrumentation(img, optimizedImg);
      picture.append(optimizedImg);
    }
    imageWrap.append(picture);
    wrap.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const slideSectionHeader = document.createElement('div');
    slideSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = headingCell?.textContent.trim();
    slideSectionHeader.append(slideHeading);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.innerHTML = descriptionCell?.innerHTML;
    slideSectionHeader.append(description);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    ctaLink.href = ctaLinkCell.querySelector('a')?.href || '#';
    ctaLink.textContent = ctaLabelCell?.textContent.trim();
    slideSectionHeader.append(ctaLink);

    contentWrap.append(slideSectionHeader);
    wrap.append(contentWrap);
    slidesContainer.append(wrap);
  });

  section.append(positionRelativeDiv);
  block.replaceChildren(section);
}
