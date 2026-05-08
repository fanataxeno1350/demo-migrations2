import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader); // Move instrumentation from heading row
  moveInstrumentation(descriptionRow, sectionHeader); // Move instrumentation from description row
  container.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

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
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // Flickity adds flickity-enabled, is-draggable
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  mobileSlides.push(currentMobileSlide);
  flickitySlider.append(currentMobileSlide);

  let mobileColCount = 0;

  itemRows.forEach((row) => {
    const [imageDesktopCell, imageTabletCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop card
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopRow.append(desktopCol);
    moveInstrumentation(row, desktopCol);

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');
    desktopCol.append(desktopWrap);

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    desktopWrap.append(desktopImageDiv);

    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }]);
      desktopImageDiv.append(optimizedPic);
    }

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell.textContent.trim();
    desktopWrap.append(desktopTitleDiv);

    const desktopArrowIcon = arrowIconCell.querySelector('img');
    if (desktopArrowIcon) {
      const arrowImg = document.createElement('img');
      arrowImg.loading = 'lazy';
      arrowImg.src = desktopArrowIcon.src;
      arrowImg.alt = desktopArrowIcon.alt;
      arrowImg.width = desktopArrowIcon.width;
      arrowImg.height = desktopArrowIcon.height;
      desktopTitleDiv.append(arrowImg);
    }

    const desktopLink = document.createElement('a');
    desktopLink.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      desktopLink.href = foundLink.href;
      desktopLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    desktopWrap.append(desktopLink);

    // Mobile card
    if (mobileColCount >= 3) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      flickitySlider.append(currentMobileSlide);
      mobileSlides.push(currentMobileSlide);
      mobileColCount = 0;
    }

    const mobileRowDiv = document.createElement('div');
    mobileRowDiv.classList.add('row', 'row-cols-1', 'gy-3');
    currentMobileSlide.append(mobileRowDiv);

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    mobileRowDiv.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    mobileWrap.append(mobileImageDiv);

    const mobilePicture = imageTabletCell.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 450px)', width: '376' }]);
      mobileImageDiv.append(optimizedPic);
    }

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    mobileWrap.append(mobileTitleDiv);

    const mobileArrowIcon = arrowIconCell.querySelector('img');
    if (mobileArrowIcon) {
      const arrowImg = document.createElement('img');
      arrowImg.loading = 'lazy';
      arrowImg.src = mobileArrowIcon.src;
      arrowImg.alt = mobileArrowIcon.alt;
      arrowImg.width = mobileArrowIcon.width;
      arrowImg.height = mobileArrowIcon.height;
      mobileTitleDiv.append(arrowImg);
    }

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    if (foundLink) {
      mobileLink.href = foundLink.href;
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`); // Corrected aria-label
    }
    mobileWrap.append(mobileLink);

    mobileColCount += 1;
  });

  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  mobileSlides.forEach((_, i) => {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    flickityPageDots.append(dot);
  });
  mobileSlider.append(flickityPageDots);

  block.replaceChildren(section);

  // Flickity initialization
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is in /libs
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is in /libs

  // eslint-disable-next-line no-undef
  if (typeof Flickity === 'function') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(mobileSlider, {
      wrapAround: mobileSlider.dataset.flickity.includes('"wrapAround": true'),
      lazyLoad: mobileSlider.dataset.flickity.includes('"lazyLoad": true'),
      pageDots: mobileSlider.dataset.flickity.includes('"pageDots": true'),
      prevNextButtons: mobileSlider.dataset.flickity.includes('"prevNextButtons": true'),
      imagesLoaded: mobileSlider.dataset.flickity.includes('"imagesLoaded": true'),
      cellAlign: mobileSlider.dataset.flickity.includes('"cellAlign": "left"') ? 'left' : 'center',
      adaptiveHeight: mobileSlider.dataset.flickity.includes('"adaptiveHeight": true'),
    });
  }
}
