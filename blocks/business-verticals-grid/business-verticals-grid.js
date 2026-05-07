import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const verticalItems = [...block.children];

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  // Flickity classes 'flickity-enabled', 'is-draggable' are added by Flickity itself, not manually
  // mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const mobileSlides = [];
  const itemsPerSlide = 3;

  verticalItems.forEach((row, index) => {
    const [imageDesktopCell, imageTabletCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop View
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delays

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');
    moveInstrumentation(row, desktopWrap); // Move instrumentation to the main wrapper
    desktopCol.append(desktopWrap);

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { width: '376' }]);
      desktopImageDiv.append(optimizedDesktopPic);
    }
    desktopWrap.append(desktopImageDiv);

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell.textContent.trim();
    const desktopArrowIcon = arrowIconCell.querySelector('picture');
    if (desktopArrowIcon) {
      const desktopArrowImg = desktopArrowIcon.querySelector('img');
      const arrowImg = document.createElement('img');
      arrowImg.loading = 'lazy';
      arrowImg.src = desktopArrowImg.src;
      arrowImg.alt = desktopArrowImg.alt;
      arrowImg.width = '10';
      arrowImg.height = '29';
      desktopTitleDiv.append(arrowImg);
    }
    desktopWrap.append(desktopTitleDiv);

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      desktopLink.href = foundLink.href;
      desktopLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    desktopWrap.append(desktopLink);
    desktopRow.append(desktopCol);

    // Mobile View (for Flickity slider)
    let currentSlide;
    const slideIndex = Math.floor(index / itemsPerSlide);
    if (!mobileSlides[slideIndex]) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      if (slideIndex === 0) {
        currentSlide.classList.add('is-selected');
      }
      const slideRow = document.createElement('div');
      slideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(slideRow);
      mobileSlides.push(currentSlide);
    } else {
      currentSlide = mobileSlides[slideIndex];
    }
    const slideRow = currentSlide.querySelector('.row');

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    const mobilePicture = imageTabletCell.querySelector('picture');
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      mobileImageDiv.append(optimizedMobilePic);
    }
    mobileWrap.append(mobileImageDiv);

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    const mobileArrowIcon = arrowIconCell.querySelector('picture');
    if (mobileArrowIcon) {
      const mobileArrowImg = mobileArrowIcon.querySelector('img');
      const arrowImg = document.createElement('img');
      arrowImg.loading = 'lazy';
      arrowImg.src = mobileArrowImg.src;
      arrowImg.alt = mobileArrowImg.alt;
      arrowImg.width = '10';
      arrowImg.height = '29';
      mobileTitleDiv.append(arrowImg);
    }
    mobileWrap.append(mobileTitleDiv);

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    if (foundLink) {
      mobileLink.href = foundLink.href;
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    mobileWrap.append(mobileLink);
    slideRow.append(mobileCol);
  });

  mobileSlides.forEach((slide) => mobileSlider.append(slide));

  const root = document.createElement('div');
  // The block's own class 'our-business-verticals' is already on the outer block div.
  // Adding it here would cause double padding/CSS.
  // root.classList.add('our-business-verticals');
  root.append(desktopContainer);
  root.append(mobileContainer);

  block.replaceChildren(root);

  // Initialize Flickity for mobile slider
  await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css');
  await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');

  // eslint-disable-next-line no-undef
  new Flickity(mobileSlider, { // Use mobileSlider element directly
    wrapAround: false,
    lazyLoad: true,
    pageDots: true,
    prevNextButtons: false,
    imagesLoaded: true,
    cellAlign: 'left',
    adaptiveHeight: true,
  });
}
