import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
  }

  // Description (richtext)
  if (descriptionRow) {
    const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionRow, description);
    description.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Read innerHTML from the cell
    sectionHeader.append(description);
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

  // Mobile view (Flickity setup)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // Flickity adds flickity-enabled, is-draggable
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const slides = [];
  let currentSlide = document.createElement('div');
  currentSlide.classList.add('slides');
  let mobileRow = document.createElement('div'); // Declare mobileRow with let
  mobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentSlide.append(mobileRow);
  slides.push(currentSlide);

  let itemCounter = 0;

  itemRows.forEach((row) => {
    // Destructure item row cells based on BlockJson model
    const [imageDesktopCell, imageTabletCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    moveInstrumentation(row, desktopCol);

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');
    desktopCol.append(desktopWrap);

    const desktopImage = document.createElement('div');
    desktopImage.classList.add('image');
    if (imageDesktopCell) {
      const picture = imageDesktopCell.querySelector('picture');
      if (picture) {
        desktopImage.append(createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ media: '(min-width: 992px)', width: '376' }]));
      }
    }
    desktopWrap.append(desktopImage);

    const desktopTitle = document.createElement('div');
    desktopTitle.classList.add('title');
    desktopTitle.textContent = titleCell?.textContent.trim() || '';
    if (arrowIconCell) {
      const arrowPicture = arrowIconCell.querySelector('picture');
      if (arrowPicture) {
        desktopTitle.append(createOptimizedPicture(arrowPicture.querySelector('img').src, arrowPicture.querySelector('img').alt, false, [{ width: '10' }]));
      }
    }
    desktopWrap.append(desktopTitle);

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    desktopLink.href = linkCell?.querySelector('a')?.href || '#';
    desktopLink.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    desktopWrap.append(desktopLink);

    desktopRow.append(desktopCol);

    // Mobile item
    if (itemCounter > 0 && itemCounter % 3 === 0) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      const newMobileRow = document.createElement('div');
      newMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(newMobileRow);
      slides.push(currentSlide);
      mobileRow = newMobileRow; // Assign newMobileRow to mobileRow
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    moveInstrumentation(row, mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImage = document.createElement('div');
    mobileImage.classList.add('image');
    if (imageMobileCell) {
      const picture = imageMobileCell.querySelector('picture');
      if (picture) {
        mobileImage.append(createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ media: '(min-width: 450px)', width: '376' }]));
      }
    }
    mobileWrap.append(mobileImage);

    const mobileTitle = document.createElement('div');
    mobileTitle.classList.add('title');
    mobileTitle.textContent = titleCell?.textContent.trim() || '';
    if (arrowIconCell) {
      const arrowPicture = arrowIconCell.querySelector('picture');
      if (arrowPicture) {
        mobileTitle.append(createOptimizedPicture(arrowPicture.querySelector('img').src, arrowPicture.querySelector('img').alt, false, [{ width: '10' }]));
      }
    }
    mobileWrap.append(mobileTitle);

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    mobileLink.href = linkCell?.querySelector('a')?.href || '#';
    mobileLink.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    mobileWrap.append(mobileLink);

    mobileRow.append(mobileCol);
    itemCounter += 1;
  });

  slides.forEach((slide, index) => {
    if (index === 0) slide.classList.add('is-selected');
    flickitySlider.append(slide);
  });

  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  for (let i = 0; i < slides.length; i += 1) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) dot.classList.add('is-selected');
    flickityPageDots.append(dot);
  }
  mobileSlider.append(flickityPageDots);

  block.replaceChildren(section);

  // Flickity Initialization
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is available in /libs
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is available in /libs

  // eslint-disable-next-line no-undef
  new Flickity(mobileSlider, {
    wrapAround: false,
    lazyLoad: true,
    pageDots: true,
    prevNextButtons: false,
    imagesLoaded: true,
    cellAlign: 'left',
    adaptiveHeight: true,
  });

  // Image optimization for all pictures in the block
  // This should be done after all content is added to the DOM
  block.querySelectorAll('picture > img').forEach((img) => {
    // Ensure img.src is a valid URL before passing to createOptimizedPicture
    const imgSrc = img.src || img.dataset.src; // Fallback for lazy-loaded images
    if (imgSrc) {
      const optimizedPic = createOptimizedPicture(imgSrc, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation is for block rows, not individual img elements
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
}
