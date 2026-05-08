import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const sectionHeadingRow = children[0];
  const slideRows = children.slice(1);

  const root = document.createElement('section');
  root.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, root);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(sectionHeadingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = sectionHeadingRow.textContent.trim();
  sectionHeader.append(heading);
  root.append(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('slides'); // This will be the Swiper container

  slideRows.forEach((row) => {
    const [
      desktopImageCell,
      mobileImage576Cell,
      mobileImage799Cell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap', 'swiper-slide'); // Add swiper-slide class
    moveInstrumentation(row, wrapDiv);

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');

    // Mobile Image (max-width: 576px)
    const mobileImage576 = mobileImage576Cell.querySelector('img');
    if (mobileImage576) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = mobileImage576.src;
      picture.append(source576);
    }

    // Mobile Image (max-width: 799px)
    const mobileImage799 = mobileImage799Cell.querySelector('img');
    if (mobileImage799) {
      const source799 = document.createElement('source');
      source799.media = '(max-width: 799px)';
      source799.srcset = mobileImage799.src;
      picture.append(source799);
    }

    // Desktop Image
    const desktopImage = desktopImageCell.querySelector('img');
    if (desktopImage) {
      const img = createOptimizedPicture(desktopImage.src, desktopImage.alt, false, [{ width: '750' }]);
      // createOptimizedPicture returns a <picture> element, we need its <img> child
      img.querySelector('img').classList.add('img-fluid');
      picture.append(img.querySelector('img'));
    }

    if (picture.children.length > 0) {
      imageWrap.append(picture);
      wrapDiv.append(imageWrap);
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentHeader = document.createElement('div');
    contentHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = headingCell.textContent.trim();
    contentHeader.append(slideHeading);

    const description = document.createElement('div'); // Changed to div to avoid <p> inside <p>
    description.classList.add('text-size-body');
    description.innerHTML = descriptionCell.innerHTML;
    contentHeader.append(description);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentHeader.append(ctaLink);

    contentWrap.append(contentHeader);
    wrapDiv.append(contentWrap);
    slidesWrapper.append(wrapDiv);
  });

  gridLayoutDiv.append(slidesWrapper);
  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);
  root.append(positionRelativeDiv);

  block.replaceChildren(root);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Create Swiper navigation and pagination elements if needed
  const swiperContainer = root.querySelector('.slides');
  if (swiperContainer) {
    // Add swiper-wrapper class to the slides container
    swiperContainer.classList.add('swiper-wrapper');

    // Create pagination dots container
    const paginationEl = document.createElement('div');
    paginationEl.classList.add('swiper-pagination');
    positionRelativeDiv.append(paginationEl); // Append to the position-relative div

    // Create navigation buttons (if needed, based on original HTML or design)
    // The original HTML does not show prev/next buttons, only pageDots.
    // If buttons are needed, they would be created here and passed to Swiper config.

    // eslint-disable-next-line no-undef
    new Swiper(swiperContainer, {
      slidesPerView: 'auto',
      loop: false, // Original HTML has data-flickity='{ "wrapAround": false ... }'
      // navigation: { prevEl: prevBtn, nextEl: nextBtn }, // Uncomment if navigation buttons are added
      pagination: {
        el: paginationEl,
        clickable: true,
      },
      // Add other Swiper options based on original Flickity config if applicable
      // e.g., cellAlign: 'left', watchCSS: true, adaptiveHeight: true
    });
  }
}
