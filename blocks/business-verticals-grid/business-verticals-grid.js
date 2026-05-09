import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);
  container.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  // FIX: description is richtext, read innerHTML directly from the row, not its first child
  description.innerHTML = descriptionRow.innerHTML;
  sectionHeader.append(description);

  // Business Verticals Grid
  const businessVerticals = document.createElement('div');
  businessVerticals.classList.add('our-business-verticals');
  section.append(businessVerticals);

  // Desktop View
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  businessVerticals.append(desktopContainer);

  const desktopGridRow = document.createElement('div');
  desktopGridRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopGridRow);

  // Mobile View (Slider)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  businessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  // Data-flickity attribute is present in original HTML
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  // Flickity requires these wrappers to be present for initialization
  const mobileSlidesWrapper = document.createElement('div');
  mobileSlidesWrapper.classList.add('flickity-viewport');
  const mobileSliderInner = document.createElement('div');
  mobileSliderInner.classList.add('flickity-slider');
  mobileSlidesWrapper.append(mobileSliderInner);
  mobileSlider.append(mobileSlidesWrapper);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  let mobileSlideRow = document.createElement('div');
  mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(mobileSlideRow);
  mobileSlides.push(currentMobileSlide);

  itemRows
    .filter((row) => row.children.length === 5)
    .forEach((row, index) => {
      const [imageDesktopCell, imageTabletCell, titleCell, arrowIconCell, businessLinkCell] = [...row.children];

      // Desktop Item
      const desktopCol = document.createElement('div');
      desktopCol.classList.add('col', 'aos-init', 'aos-animate');
      desktopCol.setAttribute('data-aos', 'fade-up');
      desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`);
      desktopGridRow.append(desktopCol);

      const desktopWrap = document.createElement('div');
      desktopWrap.classList.add('wrap');
      moveInstrumentation(row, desktopWrap);
      desktopCol.append(desktopWrap);

      const desktopImageDiv = document.createElement('div');
      desktopImageDiv.classList.add('image');
      const desktopPicture = imageDesktopCell.querySelector('picture');
      if (desktopPicture) {
        desktopImageDiv.append(createOptimizedPicture(
          desktopPicture.querySelector('img').src,
          desktopPicture.querySelector('img').alt,
          false,
          [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }],
        ));
      }
      desktopWrap.append(desktopImageDiv);

      const desktopTitleDiv = document.createElement('div');
      desktopTitleDiv.classList.add('title');
      desktopTitleDiv.textContent = titleCell.textContent.trim();
      const desktopArrowIcon = arrowIconCell.querySelector('picture');
      if (desktopArrowIcon) {
        const img = desktopArrowIcon.querySelector('img');
        if (img) {
          const arrowImg = document.createElement('img');
          arrowImg.src = img.src;
          arrowImg.alt = img.alt;
          arrowImg.loading = 'lazy';
          arrowImg.width = img.width;
          arrowImg.height = img.height;
          desktopTitleDiv.append(' ', arrowImg);
        }
      }
      desktopWrap.append(desktopTitleDiv);

      const desktopLink = document.createElement('a');
      desktopLink.classList.add('stretched-link');
      desktopLink.href = businessLinkCell.querySelector('a')?.href || '#';
      desktopLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      desktopWrap.append(desktopLink);

      // Mobile Item
      if (mobileSlideRow.children.length === 3) {
        currentMobileSlide = document.createElement('div');
        currentMobileSlide.classList.add('slides');
        mobileSlideRow = document.createElement('div');
        mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
        currentMobileSlide.append(mobileSlideRow);
        mobileSlides.push(currentMobileSlide);
      }

      const mobileCol = document.createElement('div');
      mobileCol.classList.add('col');
      mobileSlideRow.append(mobileCol);

      const mobileWrap = document.createElement('div');
      mobileWrap.classList.add('wrap');
      mobileCol.append(mobileWrap);

      const mobileImageDiv = document.createElement('div');
      mobileImageDiv.classList.add('image');
      const mobilePicture = imageTabletCell.querySelector('picture');
      if (mobilePicture) {
        mobileImageDiv.append(createOptimizedPicture(
          mobilePicture.querySelector('img').src,
          mobilePicture.querySelector('img').alt,
          false,
          [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }],
        ));
      }
      mobileWrap.append(mobileImageDiv);

      const mobileTitleDiv = document.createElement('div');
      mobileTitleDiv.classList.add('title');
      mobileTitleDiv.textContent = titleCell.textContent.trim();
      const mobileArrowIcon = arrowIconCell.querySelector('picture');
      if (mobileArrowIcon) {
        const img = mobileArrowIcon.querySelector('img');
        if (img) {
          const arrowImg = document.createElement('img');
          arrowImg.src = img.src;
          arrowImg.alt = img.alt;
          arrowImg.loading = 'lazy';
          arrowImg.width = img.width;
          arrowImg.height = img.height;
          mobileTitleDiv.append(' ', arrowImg);
        }
      }
      mobileWrap.append(mobileTitleDiv);

      const mobileLink = document.createElement('a');
      mobileLink.classList.add('stretched-link');
      mobileLink.href = businessLinkCell.querySelector('a')?.href || '#';
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      mobileWrap.append(mobileLink);
    });

  mobileSlides.forEach((slide) => mobileSliderInner.append(slide));

  block.replaceChildren(section);

  // Flickity Initialization
  // Load Flickity CSS and JS
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is available in libs
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is available in libs

  // eslint-disable-next-line no-undef
  if (typeof Flickity === 'function') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(mobileSlider, {
      wrapAround: mobileSlider.dataset.flickity.includes('"wrapAround": true'),
      lazyLoad: mobileSlider.dataset.flickity.includes('"lazyLoad": true'),
      pageDots: mobileSlider.dataset.flickity.includes('"pageDots": true'),
      prevNextButtons: mobileSlider.dataset.flickity.includes('"prevNextButtons": true'),
      imagesLoaded: mobileSlider.dataset.flickity.includes('"imagesLoaded": true'),
      cellAlign: 'left', // Default from original HTML
      adaptiveHeight: mobileSlider.dataset.flickity.includes('"adaptiveHeight": true'),
    });
  }
}
