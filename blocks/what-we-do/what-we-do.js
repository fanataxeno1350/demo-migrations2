import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, descriptionRow, ...businessVerticalRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('what-we-do-wrap'); // Removed 'section' class as outer block div already has it

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  container.append(sectionHeader);
  section.append(container);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile view - Flickity carousel
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');
  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileContainer.append(mobileSlider);

  // Group items into slides for mobile (3 items per slide)
  const mobileSlides = [];
  let currentSlide = null;
  businessVerticalRows.forEach((row, index) => {
    if (index % 3 === 0) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      const slideRow = document.createElement('div');
      slideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(slideRow);
      mobileSlides.push(currentSlide);
    }
    const slideRow = currentSlide.querySelector('.row');
    const col = document.createElement('div');
    col.classList.add('col');
    slideRow.append(col);

    const [imageDesktopCell, imageTabletCell, imageMobileCell, titleCell, arrowIconCell, ctaLinkCell] = [...row.children];

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delays from original HTML
    desktopRow.append(desktopCol); // Append desktopCol here to maintain order

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
      moveInstrumentation(desktopPicture, optimizedPic.querySelector('img'));
      desktopImageDiv.append(optimizedPic);
    }
    desktopWrap.append(desktopImageDiv);

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleCell.textContent.trim();
    const desktopArrowIcon = arrowIconCell.querySelector('picture');
    if (desktopArrowIcon) {
      const img = desktopArrowIcon.querySelector('img');
      const optimizedArrow = createOptimizedPicture(img.src, img.alt, false, [{ width: '10' }]);
      optimizedArrow.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
      moveInstrumentation(img, optimizedArrow.querySelector('img'));
      desktopTitleDiv.append(optimizedArrow);
    }
    desktopWrap.append(desktopTitleDiv);

    const desktopCtaLink = document.createElement('a');
    desktopCtaLink.classList.add('stretched-link');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      desktopCtaLink.href = foundLink.href;
      // Original HTML has varied aria-label values, ensure it's dynamic
      desktopCtaLink.setAttribute('aria-label', foundLink.getAttribute('aria-label') || `Learn more about ${titleCell.textContent.trim()}`);
    }
    desktopWrap.append(desktopCtaLink);
    moveInstrumentation(row, desktopWrap); // Move instrumentation from original row to desktop wrap
    desktopCol.append(desktopWrap);

    // Mobile item (for flickity slide)
    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    const mobilePicture = imageMobileCell.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
      // Note: Instrumentation for mobile items is implicitly handled by the desktop item's moveInstrumentation
      // as they share the same source row.
      mobileImageDiv.append(optimizedPic);
    }
    mobileWrap.append(mobileImageDiv);

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleCell.textContent.trim();
    const mobileArrowIcon = arrowIconCell.querySelector('picture');
    if (mobileArrowIcon) {
      const img = mobileArrowIcon.querySelector('img');
      const optimizedArrow = createOptimizedPicture(img.src, img.alt, false, [{ width: '10' }]);
      optimizedArrow.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
      mobileTitleDiv.append(optimizedArrow);
    }
    mobileWrap.append(mobileTitleDiv);

    const mobileCtaLink = document.createElement('a');
    mobileCtaLink.classList.add('stretched-link');
    if (foundLink) {
      mobileCtaLink.href = foundLink.href;
      // Original HTML has varied aria-label values, ensure it's dynamic
      mobileCtaLink.setAttribute('aria-label', foundLink.getAttribute('aria-label') || `Learn more about ${titleCell.textContent.trim()}`);
    }
    mobileWrap.append(mobileCtaLink);
    col.append(mobileWrap);
  });

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  mobileSlides.forEach((slide) => flickitySlider.append(slide));
  flickityViewport.append(flickitySlider);
  mobileSlider.append(flickityViewport);

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

  ourBusinessVerticals.append(desktopContainer, mobileContainer);
  section.append(ourBusinessVerticals);

  block.replaceChildren(section);

  // Initialize Flickity for mobile slider
  if (mobileSlides.length > 0) {
    await loadCSS('/libs/flickity/flickity.min.css');
    await loadScript('/libs/flickity/flickity.pkgd.min.js');

    // eslint-disable-next-line no-undef
    const flkty = new Flickity(mobileSlider, {
      wrapAround: false,
      lazyLoad: true,
      pageDots: true,
      prevNextButtons: false,
      imagesLoaded: true,
      cellAlign: 'left',
      adaptiveHeight: true,
    });

    flkty.on('change', (index) => {
      [...flickityPageDots.children].forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('is-selected');
          dot.setAttribute('aria-current', 'step');
        } else {
          dot.classList.remove('is-selected');
          dot.removeAttribute('aria-current');
        }
      });
    });
  }
}
