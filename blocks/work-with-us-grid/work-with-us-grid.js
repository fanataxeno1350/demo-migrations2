import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);
  sectionHeader.setAttribute('data-aos', 'fade-up');
  sectionHeader.setAttribute('data-aos-offset', '100');
  sectionHeader.setAttribute('data-aos-duration', '650');
  sectionHeader.setAttribute('data-aos-easing', 'ease-in-out');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  const [headingTextCell] = [...headingRow.children]; // Fixed: named destructuring
  heading.textContent = headingTextCell?.textContent.trim() || '';
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

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  itemRows.forEach((row) => {
    const [
      desktopImageCell,
      mobileImage576Cell,
      mobileImage799Cell,
      titleCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slides = document.createElement('div');
    slides.classList.add('slides');
    moveInstrumentation(row, slides);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');
    const mobileImage576 = mobileImage576Cell?.querySelector('img');
    const mobileImage799 = mobileImage799Cell?.querySelector('img');
    const desktopImage = desktopImageCell?.querySelector('img');

    if (mobileImage576) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = mobileImage576.src;
      picture.append(source576);
    }

    if (mobileImage799) {
      const source799 = document.createElement('source');
      source799.media = '(max-width: 799px)';
      source799.srcset = mobileImage799.src;
      picture.append(source799);
    }

    if (desktopImage) {
      const img = createOptimizedPicture(desktopImage.src, desktopImage.alt, false, [{ width: '750' }]);
      img.querySelector('img').classList.add('img-fluid');
      picture.append(img.querySelector('img'));
    }

    imageWrap.append(picture);
    wrap.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const itemSectionHeader = document.createElement('div');
    itemSectionHeader.classList.add('section-header');

    const itemTitle = document.createElement('h3');
    itemTitle.classList.add('heading', 'font-regular');
    itemTitle.textContent = titleCell?.textContent.trim() || '';
    itemSectionHeader.append(itemTitle);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell?.textContent.trim() || '';
    itemSectionHeader.append(description);

    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaLabel = ctaLabelCell?.textContent.trim();

    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn', 'btn-primary', 'stretched-link');
      itemSectionHeader.append(anchor);
    }

    contentWrap.append(itemSectionHeader);
    wrap.append(contentWrap);
    slides.append(wrap);
    gridLayout.append(slides);
  });

  container.append(gridLayout);
  positionRelativeDiv.append(container);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);
}
