import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [blockHeadingRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  // The block already has 'work-with-us' class from AEM. No need to add it again.
  // moveInstrumentation(block, section); // moveInstrumentation should be on the inner content, not the block itself

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(blockHeadingRow, heading);
  heading.textContent = blockHeadingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  // Original HTML has data-aos attributes on this div, but they are not handled by EDS.
  // For now, we'll just add the classes.

  const container = document.createElement('div');
  container.classList.add('container');

  // The original HTML has a flickity-slider-mobile-wrap div with data-flickity attributes.
  // This indicates a carousel. We need to initialize Swiper.js for this.
  // The 'grid-layout' div will be our Swiper container.
  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout', 'swiper'); // Add 'swiper' class for Swiper initialization

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper'); // Swiper requires a wrapper for slides

  slideRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row) => {
      const [
        desktopImageCell,
        mobileImage576Cell,
        mobileImage799Cell,
        slideHeadingCell,
        slideDescriptionCell,
        ctaLinkCell,
        ctaLabelCell,
      ] = [...row.children];

      const slidesDiv = document.createElement('div');
      slidesDiv.classList.add('slides', 'swiper-slide'); // Add 'swiper-slide' for Swiper
      moveInstrumentation(row, slidesDiv); // Move instrumentation for the slide row

      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');

      const picture = document.createElement('picture');

      const mobileImage576 = mobileImage576Cell?.querySelector('picture');
      if (mobileImage576) {
        const source576 = document.createElement('source');
        source576.media = '(max-width: 576px)';
        source576.srcset = mobileImage576.querySelector('img')?.src;
        picture.append(source576);
      }

      const mobileImage799 = mobileImage799Cell?.querySelector('picture');
      if (mobileImage799) {
        const source799 = document.createElement('source');
        source799.media = '(max-width: 799px)';
        source799.srcset = mobileImage799.querySelector('img')?.src;
        picture.append(source799);
      }

      const desktopImage = desktopImageCell?.querySelector('picture');
      if (desktopImage) {
        const img = document.createElement('img');
        img.classList.add('img-fluid');
        img.src = desktopImage.querySelector('img')?.src;
        img.alt = desktopImage.querySelector('img')?.alt || '';
        img.title = desktopImage.querySelector('img')?.title || '';
        img.loading = 'lazy';
        picture.append(img);
      }

      imageWrap.append(picture);
      wrapDiv.append(imageWrap);

      const contentWrap = document.createElement('div');
      contentWrap.classList.add('content-wrap');

      const contentSectionHeader = document.createElement('div');
      contentSectionHeader.classList.add('section-header');

      const slideHeading = document.createElement('h3');
      slideHeading.classList.add('heading', 'font-regular');
      slideHeading.textContent = slideHeadingCell.textContent.trim();
      contentSectionHeader.append(slideHeading);

      const slideDescription = document.createElement('p');
      slideDescription.classList.add('text-size-body');
      slideDescription.innerHTML = slideDescriptionCell.innerHTML;
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

      slidesDiv.append(wrapDiv);
      swiperWrapper.append(slidesDiv); // Append slides to swiperWrapper
    });

  gridLayout.append(swiperWrapper); // Append swiperWrapper to gridLayout (which is the swiper container)

  // Add Swiper pagination and navigation if needed based on original Flickity config
  // The original Flickity config had "pageDots": true, "prevNextButtons": false
  // So we'll add pagination dots.
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination');
  gridLayout.append(swiperPagination);

  container.append(gridLayout);
  positionRelativeDiv.append(container);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);

  // Load Swiper CSS and JS
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper
  // eslint-disable-next-line no-undef
  new Swiper(gridLayout, {
    slidesPerView: 'auto',
    loop: false, // Original Flickity had wrapAround: false
    pagination: {
      el: swiperPagination,
      clickable: true,
    },
    // prevNextButtons: false, so no navigation buttons
  });

  section.querySelectorAll('picture > img').forEach((img) => {
    // The createOptimizedPicture function expects the original img element,
    // and it will replace the picture element.
    // The moveInstrumentation should be applied to the new img element inside the optimized picture.
    const originalPicture = img.closest('picture');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation needs to be called on the original element and the new element's child
    moveInstrumentation(originalPicture, optimizedPic.querySelector('img'));
    originalPicture.replaceWith(optimizedPic);
  });
}
