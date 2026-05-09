import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children].filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [headingRow, descriptionRow, ...businessVerticalRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
  }

  if (descriptionRow) {
    const description = document.createElement('div'); // Changed to div to safely hold richtext
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionRow, description);
    description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    sectionHeader.append(description);
  }

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  section.append(ourBusinessVerticals);

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  // Swiper structure for mobile
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'mobile-slider'); // 'swiper' class is essential for Swiper.js
  mobileContainer.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperEl.append(swiperWrapper);

  const mobileSlides = [];
  let currentSlideWrapper = document.createElement('div');
  currentSlideWrapper.classList.add('swiper-slide'); // Swiper slide wrapper
  let currentMobileRow = document.createElement('div');
  currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentSlideWrapper.append(currentMobileRow);
  mobileSlides.push(currentSlideWrapper);

  businessVerticalRows.forEach((row, index) => {
    const [imageDesktopCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [
      ...row.children,
    ];

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    col.dataset.aos = 'fade-up';
    col.dataset.aosDelay = `${100 + (index % 3) * 300}`; // Stagger delay

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    col.append(wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    wrap.append(imageDiv);

    const desktopPicture = imageDesktopCell?.querySelector('picture');
    if (desktopPicture) {
      const optimizedPic = createOptimizedPicture(
        desktopPicture.querySelector('img')?.src,
        desktopPicture.querySelector('img')?.alt,
        false,
        [{ media: '(min-width: 992px)', width: '376' }],
      );
      moveInstrumentation(desktopPicture.querySelector('img'), optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
    }

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell?.textContent.trim() || '';
    wrap.append(titleDiv);

    const arrowIcon = arrowIconCell?.querySelector('picture');
    if (arrowIcon) {
      const img = arrowIcon.querySelector('img');
      if (img) {
        const optimizedArrow = createOptimizedPicture(img.src, img.alt, false, [{ width: '10' }]);
        moveInstrumentation(img, optimizedArrow.querySelector('img'));
        titleDiv.append(optimizedArrow);
      }
    }

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    }
    moveInstrumentation(row, link);
    wrap.append(link);

    desktopRow.append(col);

    // Mobile slider items (3 per slide)
    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    // Clone the entire wrap structure for mobile, ensuring instrumentation is moved correctly
    const mobileWrap = wrap.cloneNode(true);
    // Re-instrument cloned elements if necessary, or ensure original instrumentation is not lost
    // For now, assuming cloning is sufficient for display, but interactive elements might need re-wiring
    mobileCol.append(mobileWrap);
    currentMobileRow.append(mobileCol);

    if ((index + 1) % 3 === 0 && index < businessVerticalRows.length - 1) {
      currentSlideWrapper = document.createElement('div');
      currentSlideWrapper.classList.add('swiper-slide');
      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlideWrapper.append(currentMobileRow);
      mobileSlides.push(currentSlideWrapper);
    }
  });

  mobileSlides.forEach((slide) => swiperWrapper.append(slide));

  // Swiper initialization for mobile slider
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Add Swiper navigation and pagination elements
  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination');
  swiperEl.append(paginationEl);

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    loop: false, // Original HTML has data-flickity="{ &quot;wrapAround&quot;: false ... }"
    navigation: {
      prevEl: null, // No prev/next buttons in original HTML
      nextEl: null,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    imagesLoaded: true, // Equivalent to Flickity's imagesLoaded
    cellAlign: 'left', // Equivalent to Flickity's cellAlign
    adaptiveHeight: true, // Equivalent to Flickity's adaptiveHeight
  });

  block.replaceChildren(section);

  // The original JS had a redundant image optimization loop at the end.
  // createOptimizedPicture is already called for each image in the loop.
  // This final loop is likely unnecessary and could cause issues if images are already optimized.
  // Removing it based on the assumption that images are handled correctly within the main loop.
}
