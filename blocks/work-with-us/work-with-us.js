import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const root = document.createElement('section');
  root.classList.add('section', 'pb-0'); // Removed 'work-with-us' as the outer block div already has it

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Access cell content via destructuring or querySelector if needed, not direct children[0] on row
  const [headingCell] = [...headingRow.children];
  heading.textContent = headingCell?.textContent.trim();
  sectionHeader.append(heading);
  root.append(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // Original HTML has flickity-slider-mobile-wrap with data-flickity, implying a carousel.
  // EDS does not ship Flickity, so we'll use Swiper.
  // Add swiper-container and swiper-wrapper for Swiper.
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'grid-layout'); // 'grid-layout' is from original HTML, 'swiper' for Swiper.
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row) => {
    const [
      imageMobile576Cell,
      imageMobile799Cell,
      imageDesktopCell,
      slideHeadingCell,
      slideDescriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slideDiv = document.createElement('div'); // Renamed from slidesDiv to slideDiv for clarity
    slideDiv.classList.add('slides', 'swiper-slide'); // Add swiper-slide class

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    // Image Wrap
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');
    const imgMobile576 = imageMobile576Cell.querySelector('img');
    const imgMobile799 = imageMobile799Cell.querySelector('img');
    const imgDesktop = imageDesktopCell.querySelector('img');

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
      const img = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      img.querySelector('img').classList.add('img-fluid');
      picture.append(img.querySelector('img'));
    }

    if (picture.children.length > 0) {
      imageWrap.append(picture);
      wrapDiv.append(imageWrap);
    }

    // Content Wrap
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = slideHeadingCell.textContent.trim();
    contentSectionHeader.append(slideHeading);

    const slideDescription = document.createElement('div'); // Changed to div to avoid <p> inside <p>
    slideDescription.classList.add('text-size-body');
    slideDescription.innerHTML = slideDescriptionCell.innerHTML; // richtext content
    contentSectionHeader.append(slideDescription);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentSectionHeader.append(ctaLink);

    contentWrap.append(contentSectionHeader);
    wrapDiv.append(contentWrap);

    moveInstrumentation(row, slideDiv); // Move instrumentation from original row to the new slide div
    slideDiv.append(wrapDiv);
    swiperWrapper.append(slideDiv); // Append to swiperWrapper
  });

  swiperContainer.append(swiperWrapper);

  // Add Swiper pagination dots
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination');
  swiperContainer.append(swiperPagination);

  containerDiv.append(swiperContainer);
  positionRelativeDiv.append(containerDiv);
  root.append(positionRelativeDiv);

  block.replaceChildren(root);

  // Load Swiper CSS and JS
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper
  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    loop: false, // Original HTML data-flickity has wrapAround: false
    pagination: {
      el: swiperPagination,
      clickable: true,
    },
    // prevNextButtons: false from original Flickity config, so no navigation buttons
  });
}
