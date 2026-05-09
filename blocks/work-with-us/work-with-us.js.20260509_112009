import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0'); // Add classes from ORIGINAL HTML

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  const [headingTextCell] = [...headingRow.children]; // Fixed: named destructuring
  heading.textContent = headingTextCell?.textContent.trim() || '';
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // Original HTML had a flickity-slider-mobile-wrap with data-flickity attributes.
  // We need to create this wrapper and apply the data attributes.
  const flickitySliderMobileWrap = document.createElement('div');
  flickitySliderMobileWrap.classList.add('grid-layout'); // Original HTML uses grid-layout for the flickity container
  flickitySliderMobileWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  slideRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row) => {
      const [
        imageMobile576Cell,
        imageMobile799Cell,
        imageDesktopCell,
        titleCell,
        descriptionCell,
        ctaLinkCell,
        ctaLabelCell,
      ] = [...row.children];

      const slideDiv = document.createElement('div');
      slideDiv.classList.add('slides');
      moveInstrumentation(row, slideDiv);

      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap');

      // Image Wrap
      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');

      const picture = document.createElement('picture');
      const img576 = imageMobile576Cell?.querySelector('img');
      const img799 = imageMobile799Cell?.querySelector('img');
      const imgDesktop = imageDesktopCell?.querySelector('img');

      if (img576) {
        const source576 = document.createElement('source');
        source576.media = '(max-width: 576px)';
        source576.srcset = img576.src;
        picture.append(source576);
      }
      if (img799) {
        const source799 = document.createElement('source'); // Fixed: typo source779 to source799
        source799.media = '(max-width: 799px)';
        source799.srcset = img799.src;
        picture.append(source799);
      }
      if (imgDesktop) {
        // createOptimizedPicture already handles img element creation and optimization
        const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
        const imgElement = optimizedPic.querySelector('img');
        if (imgElement) {
          imgElement.classList.add('img-fluid');
          picture.append(imgElement);
        }
      }
      if (picture.children.length > 0) {
        imageWrapDiv.append(picture);
        wrapDiv.append(imageWrapDiv);
      }

      // Content Wrap
      const contentWrapDiv = document.createElement('div');
      contentWrapDiv.classList.add('content-wrap');

      const contentSectionHeader = document.createElement('div');
      contentSectionHeader.classList.add('section-header');

      const title = document.createElement('h3');
      title.classList.add('heading', 'font-regular');
      title.textContent = titleCell?.textContent.trim() || '';
      contentSectionHeader.append(title);

      const description = document.createElement('p');
      description.classList.add('text-size-body');
      description.textContent = descriptionCell?.textContent.trim() || '';
      contentSectionHeader.append(description);

      const ctaLink = ctaLinkCell?.querySelector('a');
      const ctaLabel = ctaLabelCell?.textContent.trim();

      if (ctaLink && ctaLabel) {
        const anchor = document.createElement('a');
        anchor.href = ctaLink.href;
        anchor.textContent = ctaLabel;
        anchor.classList.add('btn', 'btn-primary', 'stretched-link');
        contentSectionHeader.append(anchor);
      }

      contentWrapDiv.append(contentSectionHeader);
      wrapDiv.append(contentWrapDiv);
      slideDiv.append(wrapDiv);
      flickitySliderMobileWrap.append(slideDiv); // Append to flickity container
    });

  containerDiv.append(flickitySliderMobileWrap); // Append flickity container to main container
  positionRelativeDiv.append(containerDiv);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);

  // Optimize images within the block
  // This part should be handled by createOptimizedPicture directly when creating the image.
  // The existing loop might re-optimize images already handled by createOptimizedPicture.
  // Removing this redundant optimization loop.
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });

  // Flickity Carousel Initialization
  // The original HTML uses Flickity, so we need to load and initialize it.
  await loadCSS('/blocks/work-with-us/flickity.min.css'); // Assuming flickity.min.css is in the block folder
  await loadScript('/blocks/work-with-us/flickity.pkgd.min.js'); // Assuming flickity.pkgd.min.js is in the block folder

  // Initialize Flickity after the block is in the DOM
  // eslint-disable-next-line no-undef
  const flkty = new Flickity(flickitySliderMobileWrap, {
    wrapAround: flickitySliderMobileWrap.dataset.flickity.includes('"wrapAround": true'),
    lazyLoad: flickitySliderMobileWrap.dataset.flickity.includes('"lazyLoad": true'),
    pageDots: flickitySliderMobileWrap.dataset.flickity.includes('"pageDots": true'),
    prevNextButtons: flickitySliderMobileWrap.dataset.flickity.includes('"prevNextButtons": true'),
    imagesLoaded: flickitySliderMobileWrap.dataset.flickity.includes('"imagesLoaded": true'),
    cellAlign: 'left', // Default from original HTML
    watchCSS: flickitySliderMobileWrap.dataset.flickity.includes('"watchCSS": true'),
    adaptiveHeight: flickitySliderMobileWrap.dataset.flickity.includes('"adaptiveHeight": true'),
  });
}
