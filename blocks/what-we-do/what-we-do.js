import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Use array destructuring for fixed-schema root rows
  const [headingRow, descriptionRow, ...itemRows] = children;

  if (headingRow) {
    const headingCell = headingRow.children[0]; // Access cell directly
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      moveInstrumentation(headingRow, heading);
      heading.textContent = headingCell.textContent.trim();
      sectionHeader.append(heading);
    }
  }

  if (descriptionRow) {
    const descriptionCell = descriptionRow.children[0]; // Access cell directly
    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('aos-init', 'aos-animate');
      moveInstrumentation(descriptionRow, description);
      // Read innerHTML directly from the cell for richtext content
      description.innerHTML = descriptionCell.innerHTML;
      sectionHeader.append(description);
    }
  }

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  section.append(ourBusinessVerticals);

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile view
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');
  ourBusinessVerticals.append(mobileContainer);

  // Flickity initialization
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is in libs
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is in libs

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // Flickity adds flickity-enabled and is-draggable
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileSlider.setAttribute('tabindex', '0');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const mobileSlides = [];
  const itemsPerSlide = 3;
  let currentSlide;
  let currentRow;

  itemRows.forEach((row, index) => {
    // Use array destructuring for fixed-schema item rows
    const [imageDesktopCell, imageMobileCell, titleCell, iconCell, linkCell] = [...row.children];

    // Desktop Item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`);
    desktopRow.append(desktopCol);

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');
    desktopCol.append(desktopWrap);

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    desktopWrap.append(desktopImageDiv);

    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(desktopPicture, optimizedPic.querySelector('img'));
      desktopImageDiv.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid');
    }

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell.textContent.trim();
    desktopWrap.append(desktopTitleDiv);

    const desktopIcon = iconCell.querySelector('picture');
    if (desktopIcon) {
      const img = desktopIcon.querySelector('img');
      const optimizedIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '10' }]);
      moveInstrumentation(desktopIcon, optimizedIcon.querySelector('img'));
      desktopTitleDiv.append(optimizedIcon);
    }

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      desktopLink.href = foundLink.href;
      desktopLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    desktopWrap.append(desktopLink);
    moveInstrumentation(row, desktopCol); // Move instrumentation for the desktop item

    // Mobile Item
    if (index % itemsPerSlide === 0) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      if (index === 0) currentSlide.classList.add('is-selected');
      flickitySlider.append(currentSlide);

      currentRow = document.createElement('div');
      currentRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(currentRow);
      mobileSlides.push(currentSlide);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    currentRow.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    mobileWrap.append(mobileImageDiv);

    const mobilePicture = imageMobileCell.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(mobilePicture, optimizedPic.querySelector('img')); // Move instrumentation for mobile picture
      mobileImageDiv.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid');
    }

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    mobileWrap.append(mobileTitleDiv);

    const mobileIcon = iconCell.querySelector('picture');
    if (mobileIcon) {
      const img = mobileIcon.querySelector('img');
      const optimizedIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '10' }]);
      moveInstrumentation(mobileIcon, optimizedIcon.querySelector('img')); // Move instrumentation for mobile icon
      mobileTitleDiv.append(optimizedIcon);
    }

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    if (foundLink) {
      mobileLink.href = foundLink.href;
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    mobileWrap.append(mobileLink);
    // moveInstrumentation(row, mobileCol); // Instrumentation for the row is already moved to desktopCol
  });

  const pageDots = document.createElement('ol');
  pageDots.classList.add('flickity-page-dots');
  mobileSlider.append(pageDots);

  mobileSlides.forEach((slide, idx) => {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${idx + 1}`);
    if (idx === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    pageDots.append(dot);
  });

  block.replaceChildren(section);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Initialize Flickity after all elements are in the DOM
  // eslint-disable-next-line no-undef
  new Flickity(mobileSlider, {
    wrapAround: mobileSlider.dataset.flickity.includes('"wrapAround": true'),
    lazyLoad: mobileSlider.dataset.flickity.includes('"lazyLoad": true'),
    pageDots: mobileSlider.dataset.flickity.includes('"pageDots": true'),
    prevNextButtons: mobileSlider.dataset.flickity.includes('"prevNextButtons": true'),
    imagesLoaded: mobileSlider.dataset.flickity.includes('"imagesLoaded": true'),
    cellAlign: 'left',
    adaptiveHeight: mobileSlider.dataset.flickity.includes('"adaptiveHeight": true'),
  });
}
