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

  // Heading and Description
  const [headingRow, descriptionRow, ...businessVerticals] = children;

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
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
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const mobileSlides = [];
  let currentSlideDiv = document.createElement('div');
  currentSlideDiv.classList.add('slides');
  let currentMobileSlideRow = document.createElement('div');
  currentMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentSlideDiv.append(currentMobileSlideRow);
  mobileSlides.push(currentSlideDiv);
  flickitySlider.append(currentSlideDiv);

  businessVerticals.forEach((row, index) => {
    const [imageDesktopCell, imageTabletCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');

    const desktopPicture = imageDesktopCell.querySelector('picture');
    const tabletPicture = imageTabletCell.querySelector('picture');
    const mobilePicture = imageMobileCell.querySelector('picture');

    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ media: '(min-width: 992px)', width: '376' }]);
      moveInstrumentation(desktopImg, optimizedDesktopPic.querySelector('img'));
      imageDiv.append(optimizedDesktopPic);
    }
    if (tabletPicture) {
      const tabletImg = tabletPicture.querySelector('img');
      const optimizedTabletPic = createOptimizedPicture(tabletImg.src, tabletImg.alt, false, [{ media: '(min-width: 450px)', width: '376' }]);
      moveInstrumentation(tabletImg, optimizedTabletPic.querySelector('img'));
      imageDiv.append(optimizedTabletPic);
    }
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '376' }]);
      moveInstrumentation(mobileImg, optimizedMobilePic.querySelector('img'));
      imageDiv.append(optimizedMobilePic);
    }

    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();

    const arrowIcon = arrowIconCell.querySelector('picture');
    if (arrowIcon) {
      const arrowImg = arrowIcon.querySelector('img');
      const optimizedArrowPic = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(arrowImg, optimizedArrowPic.querySelector('img'));
      titleDiv.append(optimizedArrowPic);
    }
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    wrap.append(link);

    moveInstrumentation(row, wrap);

    // Desktop column
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delays
    desktopCol.append(wrap.cloneNode(true)); // Clone for desktop
    desktopRow.append(desktopCol);

    // Mobile column (grouped into slides of 3)
    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    mobileCol.append(wrap); // Use the original 'wrap' for mobile

    if (index > 0 && index % 3 === 0) {
      currentSlideDiv = document.createElement('div');
      currentSlideDiv.classList.add('slides');
      currentSlideDiv.setAttribute('aria-hidden', 'true');
      currentMobileSlideRow = document.createElement('div');
      currentMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlideDiv.append(currentMobileSlideRow);
      mobileSlides.push(currentSlideDiv);
      flickitySlider.append(currentSlideDiv);
    }
    currentMobileSlideRow.append(mobileCol);
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

  // Initialize Flickity
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is in /libs
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is in /libs

  if (typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(mobileSlider, JSON.parse(mobileSlider.dataset.flickity));
  }
}
