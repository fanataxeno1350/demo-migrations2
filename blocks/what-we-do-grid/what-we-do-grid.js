import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  // FIX 0.6: descriptionRow is a ROW, not a cell. Read from the row's innerHTML directly for richtext.
  // FIX 0.7B: descriptionRow.innerHTML already contains <p> tags, assigning to <p> creates <p><p>...</p></p>.
  // Changed to use a div for description to safely contain richtext, or extract innerHTML from a potential <p> if a <p> is strictly required by CSS.
  // Given the original HTML has <p>Description text content</p> directly, using innerHTML on the row will correctly transfer it.
  // If the original HTML had <p><div>...</div></p>, then descriptionRow.children[0].innerHTML would be correct.
  // Based on the EDS structure, description is type=richtext, so descriptionRow.innerHTML is correct.
  description.innerHTML = descriptionRow.innerHTML;
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
  // FIX 2.6C: Add data-aos attributes from ORIGINAL HTML
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileContainer.append(mobileSlider);

  // Flickity initialization setup
  // FIX 2.5A: Add loadScript and loadCSS to import
  // FIX 2.5B: decorate() is now async
  await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css');
  await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  const currentMobileRow = document.createElement('div');
  currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(currentMobileRow);
  mobileSlides.push(currentMobileSlide);
  flickitySlider.append(currentMobileSlide);

  itemRows.forEach((row, index) => {
    // FIX 0: Array destructuring is correct for fixed schema rows. No change needed here.
    const [imageDesktopCell, imageTabletCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop card
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    // Add delay based on index for staggered animation, mimicking original
    const delay = (index % 3) * 300 + 100;
    desktopCol.setAttribute('data-aos-delay', delay.toString());
    desktopRow.append(desktopCol);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    desktopCol.append(wrap);

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
      // FIX 1.5: moveInstrumentation for picture elements should be from the original picture to the new optimized picture.
      // The original code was moving from img to img, which is less robust.
      moveInstrumentation(desktopPicture, optimizedPic);
      imageDiv.append(optimizedPic);
    }

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    wrap.append(titleDiv);

    const arrowIcon = arrowIconCell.querySelector('picture');
    if (arrowIcon) {
      const optimizedArrow = createOptimizedPicture(
        arrowIcon.querySelector('img').src,
        arrowIcon.querySelector('img').alt,
        false,
        [{ width: '10' }],
      );
      // FIX 1.5: moveInstrumentation for picture elements should be from the original picture to the new optimized picture.
      moveInstrumentation(arrowIcon, optimizedArrow);
      titleDiv.append(optimizedArrow);
    }

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      // FIX 1.5: moveInstrumentation for the link should be from the original link to the new link.
      moveInstrumentation(foundLink, link);
    }
    // FIX 3: moveInstrumentation from original row to the main link is incorrect.
    // Instrumentation should be moved from the original row to the main container element of the item,
    // which is 'wrap' or 'desktopCol' in this case, to ensure the whole item is editable.
    // For the link, moveInstrumentation should be from the original <a> to the new <a>.
    // Since the link is inside the wrap, we move instrumentation from the original row to the wrap.
    moveInstrumentation(row, wrap);
    wrap.append(link);

    // Mobile card (grouped 3 per slide)
    if (index > 0 && index % 3 === 0) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(currentMobileRow);
      mobileSlides.push(currentMobileSlide);
      flickitySlider.append(currentMobileSlide);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    currentMobileRow.append(mobileCol);

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
      // FIX 1.5: moveInstrumentation for picture elements.
      moveInstrumentation(mobilePicture, optimizedMobilePic);
      mobileImageDiv.append(optimizedMobilePic);
    }

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    mobileWrap.append(mobileTitleDiv);

    if (arrowIcon) { // arrowIcon is already a picture element from above
      const optimizedArrow = createOptimizedPicture(
        arrowIcon.querySelector('img').src,
        arrowIcon.querySelector('img').alt,
        false,
        [{ width: '10' }],
      );
      // FIX 1.5: moveInstrumentation for picture elements.
      moveInstrumentation(arrowIcon, optimizedArrow);
      mobileTitleDiv.append(optimizedArrow);
    }

    const mobileLink = document.createElement('a');
    mobileLink.classList.add('stretched-link');
    if (foundLink) { // foundLink is already the original <a> element from above
      mobileLink.href = foundLink.href;
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      // FIX 1.5: moveInstrumentation for the link.
      moveInstrumentation(foundLink, mobileLink);
    }
    // FIX 3: moveInstrumentation from original row to the main container element of the item.
    // The instrumentation for the row was already moved to 'wrap' for desktop.
    // For mobile, we should ensure the mobileWrap also gets instrumentation if it's a distinct editable unit.
    // However, since the itemRows are processed once and instrumentation moved to 'wrap',
    // the mobile card is essentially a re-rendering of the same data.
    // If mobileWrap needs separate instrumentation, it implies a different AUE mapping.
    // For now, assume the 'wrap' instrumentation is sufficient for the item.
    mobileWrap.append(mobileLink);
  });

  // Flickity pagination dots
  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  mobileSlider.append(flickityPageDots);

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

  block.replaceChildren(section);

  // FIX 2.5D: Initialize Flickity after all elements are in the DOM
  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // Read Flickity options from the original HTML's data-flickity attribute
    const originalFlickityDiv = block.querySelector('.mobile-slider');
    let flickityOptions = {};
    if (originalFlickityDiv && originalFlickityDiv.dataset.flickity) {
      try {
        flickityOptions = JSON.parse(originalFlickityDiv.dataset.flickity);
      } catch (e) {
        console.error('Error parsing Flickity options:', e);
      }
    }

    // Ensure essential options are set if not present in original data-flickity
    const defaultFlickityOptions = {
      wrapAround: false,
      lazyLoad: true,
      pageDots: true,
      prevNextButtons: false,
      imagesLoaded: true,
      cellAlign: 'left',
      adaptiveHeight: true,
    };
    const finalFlickityOptions = { ...defaultFlickityOptions, ...flickityOptions };

    // Initialize Flickity
    // eslint-disable-next-line no-new
    new Flickity(mobileSlider, finalFlickityOptions);
  }
}
