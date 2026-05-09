import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, descriptionRow, containerRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('what-we-do-wrap'); // Removed 'section' as outer block div already has it

  // Section Header
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  sectionHeader.append(description);

  containerDiv.append(sectionHeader);
  section.append(containerDiv);

  // Business Verticals
  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  moveInstrumentation(containerRow, ourBusinessVerticals);

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  // Mobile view (Flickity slider)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.dataset.flickity = '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }';

  // Flickity creates its own viewport and slider track, so we don't manually create them here.
  // const mobileSliderViewport = document.createElement('div');
  // mobileSliderViewport.classList.add('flickity-viewport');
  // const mobileSliderTrack = document.createElement('div');
  // mobileSliderTrack.classList.add('flickity-slider');
  // mobileSliderViewport.append(mobileSliderTrack);
  // mobileSlider.append(mobileSliderViewport);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  let currentMobileRow = document.createElement('div');
  currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(currentMobileRow);
  mobileSlides.push(currentMobileSlide);

  itemRows.forEach((row, index) => {
    const [desktopImageCell, tabletImageCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Optimize images
    const desktopPicture = desktopImageCell?.querySelector('picture');
    const tabletPicture = tabletImageCell?.querySelector('picture');
    const arrowPicture = arrowIconCell?.querySelector('picture');

    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '992' }, { media: '(min-width: 450px)', width: '450' }, { width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      desktopImageCell.replaceWith(optimizedPic);
    }
    if (tabletPicture) {
      const img = tabletPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '992' }, { media: '(min-width: 450px)', width: '450' }, { width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      tabletImageCell.replaceWith(optimizedPic);
    }
    if (arrowPicture) {
      const img = arrowPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      arrowIconCell.replaceWith(optimizedPic);
    }

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    // Apply data-aos-delay based on index for staggered animation
    const delay = (index % 3) * 300 + 100; // 100, 400, 700, 100, 400, 700...
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', delay.toString());

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    // Use desktop image for desktop view, tablet/mobile for mobile view
    const desktopImage = desktopImageCell?.querySelector('picture');
    if (desktopImage) {
      imageDiv.append(desktopImage.cloneNode(true)); // Clone to use in both desktop and mobile
    }
    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell?.textContent.trim() || '';
    const arrowIcon = arrowIconCell?.querySelector('picture');
    if (arrowIcon) {
      const arrowImg = arrowIcon.querySelector('img');
      if (arrowImg) {
        const newArrowImg = document.createElement('img');
        newArrowImg.loading = 'lazy';
        newArrowImg.src = arrowImg.src;
        newArrowImg.alt = arrowImg.alt;
        newArrowImg.width = arrowImg.width;
        newArrowImg.height = arrowImg.height;
        titleDiv.append(' ', newArrowImg); // Add space then image
      }
    }
    wrap.append(titleDiv);

    const linkEl = document.createElement('a');
    linkEl.classList.add('stretched-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    }
    moveInstrumentation(row, linkEl);
    wrap.append(linkEl);

    col.append(wrap);
    desktopRow.append(col);

    // Mobile slider logic
    if (index > 0 && index % 3 === 0) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(currentMobileRow);
      mobileSlides.push(currentMobileSlide);
    }
    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    const mobileWrap = wrap.cloneNode(true); // Clone the wrap for mobile
    // Replace desktop image with tablet/mobile image if available
    const mobileImageDiv = mobileWrap.querySelector('.image');
    if (mobileImageDiv && tabletImageCell?.querySelector('picture')) {
      mobileImageDiv.innerHTML = ''; // Clear desktop image
      mobileImageDiv.append(tabletImageCell.querySelector('picture').cloneNode(true));
    }
    mobileCol.append(mobileWrap);
    currentMobileRow.append(mobileCol);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  // Append mobile slides to track
  // Flickity will create the flickity-slider div, we append slides to the mobileSlider directly
  mobileSlides.forEach((slide) => mobileSlider.append(slide));
  mobileContainer.append(mobileSlider);
  ourBusinessVerticals.append(mobileContainer);

  section.append(ourBusinessVerticals);
  block.replaceChildren(section);

  // Flickity initialization for mobile slider
  if (mobileSlider.classList.contains('mobile-slider')) {
    const flickityConfig = JSON.parse(mobileSlider.dataset.flickity);
    await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css'); // Added loadCSS for Flickity
    await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');
    // eslint-disable-next-line no-undef
    new Flickity(mobileSlider, flickityConfig);
  }
}
