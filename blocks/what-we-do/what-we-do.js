import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap'); // Removed 'what-we-do' as it's the block name

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading
  const headingRow = children[0];
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  // Description
  const descriptionRow = children[1];
  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  section.append(ourBusinessVerticals);

  // Desktop View
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile View
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // Flickity will add flickity-enabled, is-draggable
  mobileContainer.append(mobileSlider);

  const mobileSliderViewport = document.createElement('div');
  mobileSliderViewport.classList.add('flickity-viewport');
  mobileSlider.append(mobileSliderViewport);

  const mobileSliderFlickity = document.createElement('div');
  mobileSliderFlickity.classList.add('flickity-slider');
  mobileSliderViewport.append(mobileSliderFlickity);

  const businessVerticalRows = children.slice(2);
  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  mobileSlides.push(currentMobileSlide);

  let mobileColCount = 0;
  let mobileRowDiv = document.createElement('div');
  mobileRowDiv.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(mobileRowDiv);

  businessVerticalRows.forEach((row, i) => {
    // Fixed schema for business-vertical-item, using destructuring
    const [imageDesktopCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${100 + (i % 3) * 300}`); // Stagger delay
    desktopRow.append(desktopCol);

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');
    desktopCol.append(desktopWrap);

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    desktopWrap.append(desktopImageDiv);
    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      desktopImageDiv.append(desktopPicture);
    }

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell.textContent.trim();
    desktopWrap.append(desktopTitleDiv);
    const desktopArrowIcon = arrowIconCell.querySelector('picture');
    if (desktopArrowIcon) {
      desktopTitleDiv.append(desktopArrowIcon);
    }

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    desktopLink.href = linkCell.querySelector('a')?.href || '#';
    desktopLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    desktopWrap.append(desktopLink);

    moveInstrumentation(row, desktopCol);

    // Mobile item
    if (mobileColCount >= 3) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      mobileSlides.push(currentMobileSlide);
      mobileColCount = 0;
      mobileRowDiv = document.createElement('div'); // Create a new rowDiv for the new slide
      mobileRowDiv.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(mobileRowDiv);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    mobileRowDiv.append(mobileCol); // Append to the current mobileRowDiv

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    mobileWrap.append(mobileImageDiv);
    const mobilePicture = imageMobileCell.querySelector('picture');
    if (mobilePicture) {
      mobileImageDiv.append(mobilePicture);
    }

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    mobileWrap.append(mobileTitleDiv);
    const mobileArrowIcon = arrowIconCell.querySelector('picture');
    if (mobileArrowIcon) {
      mobileTitleDiv.append(mobileArrowIcon);
    }

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    mobileLink.href = linkCell.querySelector('a')?.href || '#';
    mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    mobileWrap.append(mobileLink);

    mobileColCount += 1;
  });

  mobileSlides.forEach((slide, index) => {
    mobileSliderFlickity.append(slide); // Append slides to flickity-slider
    if (index === 0) {
      slide.classList.add('is-selected');
    }
  });

  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  mobileSlider.append(flickityPageDots);

  mobileSlides.forEach((_, index) => {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${index + 1}`);
    if (index === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    flickityPageDots.append(dot);
  });

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(section);

  // Flickity Initialization
  // Load Flickity CSS and JS
  await loadCSS('/blocks/what-we-do/flickity.min.css'); // Assuming flickity.min.css is in the block folder
  await loadScript('/blocks/what-we-do/flickity.pkgd.min.js'); // Assuming flickity.pkgd.min.js is in the block folder

  // Initialize Flickity only if mobileSlider exists and is visible
  if (mobileSlider && window.Flickity) {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(mobileSlider, {
      wrapAround: false,
      lazyLoad: true,
      pageDots: true,
      prevNextButtons: false,
      imagesLoaded: true,
      cellAlign: 'left',
      adaptiveHeight: true,
    });
  }
}
