import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-carousel-section');

  const carouselWrapper = document.createElement('div');
  carouselWrapper.id = 'carouselExampleSlidesOnly'; // Keep ID for data-target
  carouselWrapper.classList.add('bannerCarousel', 'carousel', 'slide');
  carouselWrapper.setAttribute('data-ride', 'carousel'); // Keep for potential legacy CSS

  const indicators = document.createElement('div'); // Changed from ol to div for Swiper pagination
  indicators.classList.add('carousel-indicators', 'swiper-pagination'); // Added swiper-pagination

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner', 'swiper-wrapper'); // Added swiper-wrapper

  slides.forEach((slide, i) => {
    const [
      desktopImageCell,
      mobileImageCell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...slide.children];

    // Carousel Item (Swiper Slide)
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item', 'swiper-slide'); // Added swiper-slide

    // Desktop Image
    const desktopPicture = desktopImageCell.querySelector('picture');
    const desktopImg = desktopPicture ? desktopPicture.querySelector('img') : null;
    if (desktopImg) {
      const optimizedDesktopPic = createOptimizedPicture(
        desktopImg.src,
        desktopImg.alt,
        i === 0, // Eager load first image
        [{ width: '2000' }],
      );
      optimizedDesktopPic.querySelector('img').classList.add('d-none', 'd-sm-block', 'w-100', 'desktop-image');
      moveInstrumentation(desktopImageCell, optimizedDesktopPic.querySelector('img'));
      carouselItem.append(optimizedDesktopPic);
    }

    // Mobile Image
    const mobilePicture = mobileImageCell.querySelector('picture');
    const mobileImg = mobilePicture ? mobilePicture.querySelector('img') : null;
    if (mobileImg) {
      const optimizedMobilePic = createOptimizedPicture(
        mobileImg.src,
        mobileImg.alt,
        i === 0, // Eager load first image
        [{ width: '750' }],
      );
      optimizedMobilePic.querySelector('img').classList.add('d-block', 'd-sm-none', 'w-100', 'mobile-image');
      moveInstrumentation(mobileImageCell, optimizedMobilePic.querySelector('img'));
      carouselItem.append(optimizedMobilePic);
    }

    // Banner Content Wrapper
    const bannerContentWrapper = document.createElement('div');
    bannerContentWrapper.classList.add('banner-content-wrapper', 'position-absolute');

    // Heading
    const heading = document.createElement('h1');
    heading.classList.add('koi-carousel-heading', 'text-sm-left');
    moveInstrumentation(headingCell, heading);
    heading.textContent = headingCell.textContent.trim();
    bannerContentWrapper.append(heading);

    // Description
    const description = document.createElement('div');
    description.classList.add('koi-carousel-description');
    moveInstrumentation(descriptionCell, description);
    description.innerHTML = descriptionCell.innerHTML;
    bannerContentWrapper.append(description);

    // CTA Link
    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaButton = document.createElement('a');
    ctaButton.classList.add('koi-carousel-cta', 'btn', 'btn-primary', 'btn-start-now');
    if (ctaLink) {
      ctaButton.href = ctaLink.href;
      ctaButton.target = '_blank';
      ctaButton.rel = 'noopener noreferrer';
    }
    moveInstrumentation(ctaLinkCell, ctaButton);
    ctaButton.textContent = ctaLabelCell.textContent.trim();
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    ctaButton.append(screenReaderSpan);
    bannerContentWrapper.append(ctaButton);

    carouselItem.append(bannerContentWrapper);
    carouselInner.append(carouselItem);
    moveInstrumentation(slide, carouselItem); // Move instrumentation from original slide row
  });

  carouselWrapper.append(indicators, carouselInner);

  // Next and previous buttons (Swiper navigation)
  const nextCarouselBtn = document.createElement('div');
  nextCarouselBtn.classList.add('next-carousel-btn');

  const prevButton = document.createElement('a');
  prevButton.classList.add('carousel-control-prev', 'swiper-button-prev'); // Added swiper-button-prev
  prevButton.href = '#'; // Swiper handles navigation, no need for data-target
  prevButton.setAttribute('role', 'button');
  prevButton.innerHTML = `
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  `;
  // Removed manual click listener, Swiper will handle it

  const nextButton = document.createElement('a');
  nextButton.classList.add('carousel-control-next', 'swiper-button-next'); // Added swiper-button-next
  nextButton.href = '#'; // Swiper handles navigation, no need for data-target
  nextButton.setAttribute('role', 'button');
  nextButton.innerHTML = `
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  `;
  // Removed manual click listener, Swiper will handle it

  nextCarouselBtn.append(prevButton, nextButton);
  carouselWrapper.append(nextCarouselBtn);

  section.append(carouselWrapper);
  block.replaceChildren(section);

  // Load Swiper CSS and JS
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper
  // eslint-disable-next-line no-undef
  new Swiper(carouselWrapper, {
    slidesPerView: 1,
    loop: false, // Original HTML doesn't specify loop, default to false
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: indicators,
      clickable: true,
      renderBullet: (index, className) => `<li class="${className}" data-target="#carouselExampleSlidesOnly" data-slide-to="${index}"></li>`,
    },
  });

  // Removed redundant image optimization loop as createOptimizedPicture already handles it.
}
