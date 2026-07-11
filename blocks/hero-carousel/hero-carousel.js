import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [arrowLeftIconRow, arrowRightIconRow, ...slideRows] = [...block.children];

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('carousel', 'panelcontainer');
  // The block already has the 'hero-carousel' class from AEM.
  // Adding 'cmp-carousel' to an inner wrapper would cause double padding/CSS.
  // The original HTML shows 'cmp-carousel' on the div with id="carousel-eef86f51d3",
  // which is the element we are creating as 'cmpCarousel'.
  // moveInstrumentation(block, carouselWrapper); // moveInstrumentation should be on the block's direct replacement

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel'); // This is the correct place for cmp-carousel
  cmpCarousel.setAttribute('role', 'group');
  cmpCarousel.setAttribute('aria-live', 'polite');
  cmpCarousel.setAttribute('aria-roledescription', 'carousel');
  cmpCarousel.setAttribute('data-cmp-is', 'carousel');
  cmpCarousel.setAttribute('data-component', 'carousel');
  cmpCarousel.setAttribute('data-auto-play-is-enabled', 'false');
  cmpCarousel.setAttribute('data-show-arrows', 'true');
  cmpCarousel.setAttribute('data-show-dots', 'true');
  cmpCarousel.setAttribute('data-auto-play-speed-in-ms', '5000');
  cmpCarousel.setAttribute('data-placeholder-text', 'false');
  moveInstrumentation(block, cmpCarousel); // moveInstrumentation should be on the main block replacement

  const cmpCarouselContent = document.createElement('div');
  cmpCarouselContent.classList.add('cmp-carousel__content');
  cmpCarouselContent.setAttribute('aria-atomic', 'false');
  cmpCarouselContent.setAttribute('aria-live', 'polite');

  const cmpCarouselIndicators = document.createElement('ol');
  cmpCarouselIndicators.classList.add('cmp-carousel__indicators');
  cmpCarouselIndicators.setAttribute('role', 'tablist');
  cmpCarouselIndicators.setAttribute('aria-label', 'Choose a slide to display');
  cmpCarouselIndicators.setAttribute('data-cmp-hook-carousel', 'indicators');
  cmpCarouselIndicators.style.visibility = 'visible';

  slideRows.forEach((row, index) => {
    const [ctaLinkCell, ctaLabelCell, desktopImageCell, mobileImageCell] = [...row.children];

    const cmpCarouselItem = document.createElement('div');
    cmpCarouselItem.classList.add('cmp-carousel__item');
    if (index === 0) {
      cmpCarouselItem.classList.add('cmp-carousel__item--active');
    }
    cmpCarouselItem.setAttribute('role', 'tabpanel');
    cmpCarouselItem.setAttribute('aria-roledescription', 'slide');
    cmpCarouselItem.setAttribute('aria-label', `Slide ${index + 1} of ${slideRows.length}`);
    cmpCarouselItem.setAttribute('data-cmp-hook-carousel', 'item');
    moveInstrumentation(row, cmpCarouselItem);

    const teaser = document.createElement('div');
    teaser.classList.add('teaser', 'cmp-image--ar-none', 'cmp-teaser--full-bg-text-center-image-bottom-button', 'cmp-button--secondary-anchor');

    const cmpTeaser = document.createElement('div');
    cmpTeaser.classList.add('cmp-teaser');
    cmpTeaser.setAttribute('data-component', 'teaser');

    const cmpTeaserContent = document.createElement('div');
    cmpTeaserContent.classList.add('cmp-teaser__content');

    const cmpTeaserDescription = document.createElement('div');
    cmpTeaserDescription.classList.add('cmp-teaser__description');
    // The original HTML has empty <p> tags for spacing, so we'll replicate that.
    cmpTeaserDescription.innerHTML = '<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>';

    const cmpTeaserActionContainer = document.createElement('div');
    cmpTeaserActionContainer.classList.add('cmp-teaser__action-container');

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('cmp-teaser__action-link', 'cmp-button');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    cmpTeaserActionContainer.append(ctaLink);

    cmpTeaserContent.append(cmpTeaserDescription, cmpTeaserActionContainer);

    const cmpTeaserImage = document.createElement('div');
    cmpTeaserImage.classList.add('cmp-teaser__image');

    const cmpImage = document.createElement('div');
    cmpImage.classList.add('cmp-image');
    cmpImage.setAttribute('data-cmp-hook-image', 'imageV3');
    cmpImage.setAttribute('itemscope', '');
    cmpImage.setAttribute('itemtype', 'http://schema.org/ImageObject');

    const picture = document.createElement('picture');
    const desktopImg = desktopImageCell.querySelector('img');
    const mobileImg = mobileImageCell.querySelector('img');

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width:767px)');
      sourceMobile.setAttribute('srcset', createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '767' }]).querySelector('img').src);
      picture.append(sourceMobile);
    }

    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1366' }]).querySelector('img');
      img.classList.add('cmp-image__image');
      img.setAttribute('itemprop', 'contentUrl');
      picture.append(img);
    }

    cmpImage.append(picture);
    cmpTeaserImage.append(cmpImage);

    cmpTeaser.append(cmpTeaserContent, cmpTeaserImage);
    teaser.append(cmpTeaser);
    cmpCarouselItem.append(teaser);
    cmpCarouselContent.append(cmpCarouselItem);

    const indicator = document.createElement('li');
    indicator.classList.add('cmp-carousel__indicator');
    if (index === 0) {
      indicator.classList.add('cmp-carousel__indicator--active');
    }
    cmpCarouselIndicators.append(indicator);
  });

  const cmpCarouselActions = document.createElement('div');
  cmpCarouselActions.classList.add('cmp-carousel__actions');
  cmpCarouselActions.style.visibility = 'visible';

  const prevButton = document.createElement('button');
  prevButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('data-cmp-hook-carousel', 'previous');
  const prevIconSpan = document.createElement('span');
  prevIconSpan.classList.add('cmp-carousel__action-icon');
  // Replaced image path with inline SVG as per Rule 25.4
  prevIconSpan.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
  `;
  prevButton.append(prevIconSpan);
  moveInstrumentation(arrowLeftIconRow, prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('data-cmp-hook-carousel', 'next');
  const nextIconSpan = document.createElement('span');
  nextIconSpan.classList.add('cmp-carousel__action-icon');
  // Replaced image path with inline SVG as per Rule 25.4
  nextIconSpan.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>
  `;
  nextButton.append(nextIconSpan);
  moveInstrumentation(arrowRightIconRow, nextButton);

  cmpCarouselActions.append(prevButton, nextButton);

  cmpCarousel.append(cmpCarouselContent, cmpCarouselActions, cmpCarouselIndicators);
  carouselWrapper.append(cmpCarousel);

  block.replaceChildren(carouselWrapper);

  // Swiper.js initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(cmpCarousel, {
    slidesPerView: 1, // Display one slide at a time
    loop: false, // Original HTML data-auto-play-is-enabled="false"
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: cmpCarouselIndicators,
      clickable: true,
      renderBullet: (index, className) => `<li class="${className}"></li>`,
    },
  });

  // The custom carousel logic below is no longer needed as Swiper handles it.
  // Keeping it commented out for reference if Swiper is not used.

  /*
  let currentSlide = 0;

  const updateCarousel = () => {
    const items = carouselWrapper.querySelectorAll('.cmp-carousel__item');
    const indicators = carouselWrapper.querySelectorAll('.cmp-carousel__indicator');

    items.forEach((item, idx) => {
      item.classList.toggle('cmp-carousel__item--active', idx === currentSlide);
      item.setAttribute('aria-label', `Slide ${idx + 1} of ${items.length}`);
      item.setAttribute('tabindex', idx === currentSlide ? '0' : '-1');
    });

    indicators.forEach((indicator, idx) => {
      indicator.classList.toggle('cmp-carousel__indicator--active', idx === currentSlide);
      indicator.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      indicator.setAttribute('tabindex', idx === currentSlide ? '0' : '-1');
    });

    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === items.length - 1;
  };

  prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    const items = carouselWrapper.querySelectorAll('.cmp-carousel__item');
    if (currentSlide < items.length - 1) {
      currentSlide += 1;
      updateCarousel();
    }
  });

  cmpCarouselIndicators.querySelectorAll('.cmp-carousel__indicator').forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      currentSlide = idx;
      updateCarousel();
    });
  });

  updateCarousel();
  */
}
