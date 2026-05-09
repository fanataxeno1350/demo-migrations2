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

  // Heading and Intro rows
  const [headingRow, introRow, ...itemRows] = children;

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  sectionHeader.append(heading);

  // Intro
  const intro = document.createElement('p');
  moveInstrumentation(introRow, intro);
  // Intro is richtext, but assigned to a <p> element, so extract inner <p> content to avoid <p><p> nesting
  intro.innerHTML = introRow.children[0]?.querySelector('p')?.innerHTML ?? introRow.children[0]?.textContent.trim() ?? '';
  sectionHeader.append(intro);

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
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const mobileSlidesWrapper = document.createElement('div');
  // mobileSlidesWrapper.classList.add('flickity-slider'); // Flickity adds this class automatically
  mobileSlider.append(mobileSlidesWrapper);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  const mobileSlideRow = document.createElement('div');
  mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(mobileSlideRow);
  mobileSlides.push(currentMobileSlide);

  let mobileItemCount = 0;

  // Business Vertical Items
  itemRows.forEach((row) => {
    const [imageDesktopCell, imageTabletCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop Item
    const col = document.createElement('div');
    col.classList.add('col');
    desktopRow.append(col);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    col.append(wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    wrap.append(imageDiv);

    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const optimizedPic = createOptimizedPicture(
        desktopPicture.querySelector('img').src,
        desktopPicture.querySelector('img').alt,
        false,
        [{ media: '(min-width: 992px)', width: '376' }, { width: '376' }],
      );
      moveInstrumentation(desktopPicture, optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
    }

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    wrap.append(titleDiv);

    const arrowIcon = arrowIconCell.querySelector('picture');
    if (arrowIcon) {
      const arrowImg = arrowIcon.querySelector('img');
      const optimizedArrow = createOptimizedPicture(
        arrowImg.src,
        arrowImg.alt,
        false,
        [{ width: '10' }],
      );
      moveInstrumentation(arrowIcon, optimizedArrow.querySelector('img'));
      titleDiv.append(optimizedArrow);
    }

    const linkEl = document.createElement('a');
    linkEl.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(row, linkEl);
    wrap.append(linkEl);

    // Mobile Item (grouped into slides of 3)
    if (mobileItemCount > 0 && mobileItemCount % 3 === 0) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      const newMobileSlideRow = document.createElement('div');
      newMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(newMobileSlideRow);
      mobileSlides.push(currentMobileSlide);
      // The original logic was replacing mobileSlideRow with newMobileSlideRow,
      // but mobileSlideRow was a local variable for the first slide's row.
      // We need to ensure the new row is appended to the current slide.
      // This part of the logic needs careful review to ensure correct DOM manipulation.
      // For now, let's just append the new slide to the mobileSlidesWrapper.
      // The loop will append all slides at the end.
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    // Ensure we append to the row of the *current* mobile slide
    mobileSlides[mobileSlides.length - 1].querySelector('.row.row-cols-1.gy-3').append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    mobileWrap.append(mobileImageDiv);

    const mobilePicture = imageTabletCell.querySelector('picture');
    if (mobilePicture) {
      const optimizedMobilePic = createOptimizedPicture(
        mobilePicture.querySelector('img').src,
        mobilePicture.querySelector('img').alt,
        false,
        [{ media: '(min-width: 450px)', width: '376' }, { width: '376' }],
      );
      moveInstrumentation(mobilePicture, optimizedMobilePic.querySelector('img'));
      mobileImageDiv.append(optimizedMobilePic);
    }

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    mobileWrap.append(mobileTitleDiv);

    const mobileArrowIcon = arrowIconCell.querySelector('picture');
    if (mobileArrowIcon) {
      const mobileArrowImg = mobileArrowIcon.querySelector('img');
      const optimizedMobileArrow = createOptimizedPicture(
        mobileArrowImg.src,
        mobileArrowImg.alt,
        false,
        [{ width: '10' }],
      );
      moveInstrumentation(mobileArrowIcon, optimizedMobileArrow.querySelector('img'));
      mobileTitleDiv.append(optimizedMobileArrow);
    }

    const mobileLinkEl = document.createElement('a');
    mobileLinkEl.classList.add('stretched-link');
    if (foundLink) { // foundLink is from desktop item, re-use it
      mobileLinkEl.href = foundLink.href;
      mobileLinkEl.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    // moveInstrumentation(row, mobileLinkEl); // row instrumentation already moved to desktop link
    mobileWrap.append(mobileLinkEl);

    mobileItemCount += 1;
  });

  mobileSlides.forEach((slide) => mobileSlidesWrapper.append(slide));

  block.replaceChildren(section);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Flickity initialization for mobile slider
  if (mobileSlider) {
    await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is in /libs
    await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is in /libs

    // eslint-disable-next-line no-undef
    new Flickity(mobileSlider, {
      wrapAround: mobileSlider.dataset.flickity.includes('"wrapAround": true'),
      lazyLoad: mobileSlider.dataset.flickity.includes('"lazyLoad": true'),
      pageDots: mobileSlider.dataset.flickity.includes('"pageDots": true'),
      prevNextButtons: mobileSlider.dataset.flickity.includes('"prevNextButtons": true'),
      imagesLoaded: mobileSlider.dataset.flickity.includes('"imagesLoaded": true'),
      cellAlign: mobileSlider.dataset.flickity.includes('"cellAlign": "left"') ? 'left' : 'center', // Default to center if not specified
      adaptiveHeight: mobileSlider.dataset.flickity.includes('"adaptiveHeight": true'),
    });
  }
}
