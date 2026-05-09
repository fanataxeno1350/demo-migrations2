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
  heading.textContent = sectionHeadingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // Flickity setup
  // The original HTML uses Flickity, so we need to load it and initialize it.
  await loadCSS('/blocks/work-with-us/flickity.css'); // Assuming flickity.css is local to the block
  await loadScript('/blocks/work-with-us/flickity.pkgd.min.js'); // Assuming flickity.pkgd.min.js is local to the block

  const flickitySliderMobileWrap = document.createElement('div');
  flickitySliderMobileWrap.classList.add('flickity-slider-mobile-wrap');
  flickitySliderMobileWrap.dataset.flickity = '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }';

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout'); // This will be the Flickity container

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

    // Image Wrap
    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const picture = document.createElement('picture');
    const desktopImg = imageDesktopCell.querySelector('img');
    const mobile576Img = imageMobile576Cell.querySelector('img');
    const mobile799Img = imageMobile799Cell.querySelector('img');

    if (mobile576Img) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = mobile576Img.src;
      picture.append(source576);
    }
    if (mobile799Img) {
      const source799 = document.createElement('source');
      source779.media = '(max-width: 799px)';
      source779.srcset = mobile799Img.src;
      picture.append(source779);
    }
    if (desktopImg) {
      // createOptimizedPicture returns a <picture> element, we need its inner <img>
      const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      const img = optimizedDesktopPic.querySelector('img');
      img.classList.add('img-fluid');
      picture.append(img);
    }
    imageWrapDiv.append(picture);
    wrapDiv.append(imageWrapDiv);

    // Content Wrap
    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = slideHeadingCell.textContent.trim();
    contentSectionHeader.append(slideHeading);

    const slideDescription = document.createElement('p');
    slideDescription.classList.add('text-size-body');
    slideDescription.innerHTML = slideDescriptionCell.innerHTML; // richtext field
    contentSectionHeader.append(slideDescription);

    const ctaLink = document.createElement('a');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentSectionHeader.append(ctaLink);

    contentWrapDiv.append(contentSectionHeader);
    wrapDiv.append(contentWrapDiv);
    slidesDiv.append(wrapDiv);
    gridLayoutDiv.append(slidesDiv);
  });

  flickitySliderMobileWrap.append(gridLayoutDiv);
  containerDiv.append(flickitySliderMobileWrap);
  positionRelativeDiv.append(containerDiv);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);

  // Initialize Flickity after elements are in DOM
  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(gridLayoutDiv, {
      wrapAround: false,
      lazyLoad: true,
      pageDots: true,
      prevNextButtons: false,
      imagesLoaded: true,
      cellAlign: 'left',
      watchCSS: true,
      adaptiveHeight: true,
    });
  }

  // Image optimization
  // This part is redundant if createOptimizedPicture is used correctly above.
  // If createOptimizedPicture is used to create the initial <img>, it's already optimized.
  // This loop would re-optimize already optimized images or replace non-optimized ones.
  // Given the current logic, the desktopImg is already handled by createOptimizedPicture.
  // The mobile images are just srcsets, so they don't need re-optimization here.
  // Removing this for now to avoid potential double processing or issues.
  /*
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  */
}
