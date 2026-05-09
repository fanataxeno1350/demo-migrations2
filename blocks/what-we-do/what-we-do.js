import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  // moveInstrumentation(block, section); // Instrumentation is moved to the root element (section) by replaceChildren

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  // Description
  const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Read innerHTML from the cell
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

  // Mobile view (Swiper based)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper'); // Swiper container
  mobileContainer.append(swiperContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper'); // Swiper wrapper for slides
  swiperContainer.append(swiperWrapper);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination');
  swiperContainer.append(paginationEl);

  // Consume the container row instrumentation (no explicit container row in model, so apply to desktopContainer)
  // The original code had `containerRow` in destructuring, but the model only has heading, description, and then item rows.
  // Assuming the `containerRow` variable was meant to represent the block itself for instrumentation,
  // but `moveInstrumentation(block, section)` already handles the root.
  // If there was an actual "container" row in the block.children, it would need its own instrumentation.
  // Based on the model, `itemRows` start directly after `descriptionRow`.

  itemRows
    .filter(row =>
      row.children.length > 0 &&
      [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
    )
    .forEach((row, index) => {
      const [imageDesktopCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

      // Desktop item
      const desktopCol = document.createElement('div');
      desktopCol.classList.add('col', 'aos-init', 'aos-animate');
      desktopCol.dataset.aos = 'fade-up';
      desktopCol.dataset.aosDelay = `${100 + (index % 3) * 300}`; // Stagger delay
      desktopRow.append(desktopCol);

      const desktopWrap = document.createElement('div');
      desktopWrap.classList.add('wrap');
      moveInstrumentation(row, desktopWrap); // Move instrumentation to the desktop item wrapper
      desktopCol.append(desktopWrap);

      const desktopImageDiv = document.createElement('div');
      desktopImageDiv.classList.add('image');
      desktopWrap.append(desktopImageDiv);

      const desktopPicture = imageDesktopCell?.querySelector('picture');
      if (desktopPicture) {
        desktopImageDiv.append(desktopPicture);
        desktopImageDiv.querySelectorAll('picture > img').forEach((img) => {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
          // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation moved to the parent picture
          img.closest('picture').replaceWith(optimizedPic);
        });
      }

      const desktopTitleDiv = document.createElement('div');
      desktopTitleDiv.classList.add('title');
      desktopTitleDiv.textContent = titleCell?.textContent.trim() || '';
      desktopWrap.append(desktopTitleDiv);

      const desktopArrowIcon = arrowIconCell?.querySelector('picture');
      if (desktopArrowIcon) {
        desktopTitleDiv.append(desktopArrowIcon);
        desktopTitleDiv.querySelectorAll('picture > img').forEach((img) => {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '10' }]);
          // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation moved to the parent picture
          img.closest('picture').replaceWith(optimizedPic);
        });
      }

      const desktopLink = document.createElement('a');
      desktopLink.classList.add('stretched-link');
      desktopLink.href = linkCell?.querySelector('a')?.href || '#';
      desktopLink.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || 'Business'}`);
      desktopWrap.append(desktopLink);

      // Mobile item (Swiper slide)
      const mobileSlide = document.createElement('div');
      mobileSlide.classList.add('swiper-slide'); // Swiper slide class
      swiperWrapper.append(mobileSlide);

      const mobileCol = document.createElement('div');
      mobileCol.classList.add('col'); // Original HTML has 'col' inside 'slides'
      mobileSlide.append(mobileCol);

      const mobileWrap = document.createElement('div');
      mobileWrap.classList.add('wrap');
      // Instrumentation for mobile item is already moved to desktopWrap, no need to move again for mobileWrap
      mobileCol.append(mobileWrap);

      const mobileImageDiv = document.createElement('div');
      mobileImageDiv.classList.add('image');
      mobileWrap.append(mobileImageDiv);

      const mobilePicture = imageMobileCell?.querySelector('picture');
      if (mobilePicture) {
        mobileImageDiv.append(mobilePicture);
        mobileImageDiv.querySelectorAll('picture > img').forEach((img) => {
          // Optimized picture for mobile view, using the same breakpoints as desktop for consistency
          // The original HTML had different srcset for mobile, but the JS used desktop's optimizedPicture config.
          // Adjusting to match the original HTML's mobile specific sources if they were different,
          // but for now, using the same as desktop as per original JS.
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
          // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation moved to the parent picture
          img.closest('picture').replaceWith(optimizedPic);
        });
      }

      const mobileTitleDiv = document.createElement('div');
      mobileTitleDiv.classList.add('title');
      mobileTitleDiv.textContent = titleCell?.textContent.trim() || '';
      mobileWrap.append(mobileTitleDiv);

      const mobileArrowIcon = arrowIconCell?.querySelector('picture');
      if (mobileArrowIcon) {
        mobileTitleDiv.append(mobileArrowIcon);
        mobileTitleDiv.querySelectorAll('picture > img').forEach((img) => {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '10' }]);
          // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation moved to the parent picture
          img.closest('picture').replaceWith(optimizedPic);
        });
      }

      const mobileLink = document.createElement('a');
      mobileLink.classList.add('stretched-link');
      mobileLink.href = linkCell?.querySelector('a')?.href || '#';
      mobileLink.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || 'Business'}`);
      mobileWrap.append(mobileLink);
    });

  // Swiper (mobile slider) initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  if (typeof Swiper !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Swiper(swiperContainer, {
      slidesPerView: 'auto',
      loop: false, // Original HTML data-flickity had wrapAround: false
      pagination: {
        el: paginationEl,
        clickable: true,
      },
      // No prev/next buttons in original Flickity config, so not adding them for Swiper
      // navigation: { prevEl: prevBtn, nextEl: nextBtn }, // If buttons were needed
    });
  }

  block.replaceChildren(section);
}
