import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [sectionHeadingRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(sectionHeadingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  const [sectionHeadingCell] = [...sectionHeadingRow.children]; // Fix: Named destructuring
  heading.textContent = sectionHeadingCell?.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  // Swiper container setup
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'slides'); // 'slides' is the class for the swiper container
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row) => {
    const [
      desktopImageCell,
      mobileImage576Cell,
      mobileImage799Cell,
      slideHeadingCell,
      slideBodyCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('swiper-slide', 'wrap'); // Each slide item is a swiper-slide
    moveInstrumentation(row, wrap);

    // Image Wrap
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');

    // Mobile Image (max-width: 576px)
    const mobileImage576 = mobileImage576Cell?.querySelector('img');
    if (mobileImage576) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = mobileImage576.src;
      picture.append(source576);
    }

    // Mobile Image (max-width: 799px)
    const mobileImage799 = mobileImage799Cell?.querySelector('img');
    if (mobileImage799) {
      const source799 = document.createElement('source');
      source799.media = '(max-width: 799px)';
      source799.srcset = mobileImage799.src;
      picture.append(source799);
    }

    // Desktop Image
    const desktopImage = desktopImageCell?.querySelector('img');
    if (desktopImage) {
      const img = createOptimizedPicture(
        desktopImage.src,
        desktopImage.alt || '',
        false,
        [{ width: '750' }],
      ).querySelector('img');
      img.classList.add('img-fluid');
      picture.append(img);
    }
    imageWrap.append(picture);
    wrap.append(imageWrap);

    // Content Wrap
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = slideHeadingCell?.textContent.trim();
    contentSectionHeader.append(slideHeading);

    const slideBody = document.createElement('p');
    slideBody.classList.add('text-size-body');
    slideBody.textContent = slideBodyCell?.textContent.trim();
    contentSectionHeader.append(slideBody);

    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaLabel = ctaLabelCell?.textContent.trim();
    if (ctaLink && ctaLabel) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.href = ctaLink.href;
      ctaAnchor.textContent = ctaLabel;
      ctaAnchor.classList.add('btn', 'btn-primary', 'stretched-link');
      contentSectionHeader.append(ctaAnchor);
    }

    contentWrap.append(contentSectionHeader);
    wrap.append(contentWrap);

    swiperWrapper.append(wrap);
  });

  swiperContainer.append(swiperWrapper);
  // Add Swiper pagination and navigation if needed based on original HTML (not present in this example)
  // const paginationEl = document.createElement('div');
  // paginationEl.classList.add('swiper-pagination');
  // swiperContainer.append(paginationEl);

  gridLayout.append(swiperContainer);
  container.append(gridLayout);
  positionRelativeDiv.append(container);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);

  // Swiper Initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    loop: false, // Based on original HTML data-flickity='{ "wrapAround": false, ... }'
    // navigation: { prevEl: prevBtn, nextEl: nextBtn }, // Add if navigation buttons are present
    // pagination: { el: paginationEl, clickable: true }, // Add if pagination is present
  });
}
