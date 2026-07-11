import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    headingRow,
    subHeadingRow,
    carouselEndpointRow,
    ctaLinkRow,
    ctaLabelRow,
    itemsContainerRow, // This is the placeholder for the container field "items"
    ...itemRows
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('cmp-cards', 'cmp-cards--yippee-diy', 'color-background-default');

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('cmp-cards__heading', 'text-center', 'title-star-icon');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  root.append(heading);

  // Sub Heading
  const subHeading = document.createElement('p');
  subHeading.classList.add('cmp-cards__sub-heading', 'body-3', 'text-center');
  moveInstrumentation(subHeadingRow, subHeading);
  subHeading.textContent = subHeadingRow.textContent.trim();
  root.append(subHeading);

  // Carousel Endpoint (not directly rendered, used for data attribute)
  const carouselEndpoint = carouselEndpointRow.textContent.trim();

  // Carousel Wrapper
  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  cmpCarousel.setAttribute('data-component', 'carousel');

  // Set data attributes from ORIGINAL HTML
  // The original HTML uses 'data-meatballs' and 'data-endpoint' on the outer div,
  // but the inner 'cmp-carousel' has the Swiper-specific data attributes.
  // We'll extract from the original HTML's cmp-carousel div.
  const originalCarouselDiv = document.querySelector('.cmp-carousel');
  if (originalCarouselDiv) {
    cmpCarousel.setAttribute('data-show-infinite-scroll', originalCarouselDiv.dataset.showInfiniteScroll || 'false');
    cmpCarousel.setAttribute('data-show-arrows', originalCarouselDiv.dataset.showArrows || 'true');
    cmpCarousel.setAttribute('data-show-dots', originalCarouselDiv.dataset.showDots || 'true');
    cmpCarousel.setAttribute('data-item-count-per-slide', originalCarouselDiv.dataset.itemCountPerSlide || '3');
    cmpCarousel.setAttribute('data-auto-play-is-enabled', originalCarouselDiv.dataset.autoPlayIsEnabled || 'false');
    cmpCarousel.setAttribute('data-auto-play-speed-in-ms', originalCarouselDiv.dataset.autoPlaySpeedInMs || '1000');
    cmpCarousel.setAttribute('data-reveal-next-item-partially', originalCarouselDiv.dataset.revealNextItemPartially || 'false');
    cmpCarousel.setAttribute('data-show-center-zoom', originalCarouselDiv.dataset.showCenterZoom || 'false');
    cmpCarousel.setAttribute('data-slides-to-scroll', originalCarouselDiv.dataset.slidesToScroll || '3');
  }
  // Swiper adds 'data-initialized' automatically, so we don't add it here.

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container'); // slick-initialized, slick-slider, slick-dotted are added by Swiper

  // Prev Button
  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow'); // slick-disabled is added by Swiper
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.textContent = 'Previous'; // Text content from original HTML

  // Slick List (wrapper for track)
  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  // Slick Track (wrapper for slides)
  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  // Move instrumentation from the container placeholder row to the main carousel wrapper
  moveInstrumentation(itemsContainerRow, cmpCarousel);

  itemRows.forEach((row, index) => {
    const [cardImageCell, playIconCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide');
    carouselItem.setAttribute('data-slick-index', index);
    carouselItem.setAttribute('aria-hidden', 'true'); // Swiper manages this
    carouselItem.setAttribute('tabindex', '-1'); // Swiper manages this
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.setAttribute('id', `slick-slide4${index}`);
    carouselItem.setAttribute('aria-describedby', `slick-slide-control4${index}`);

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--yippee-diy');

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const starDiv = document.createElement('div');
    starDiv.classList.add('cmp-card__star');
    cmpCard.append(starDiv);

    const mainContent = document.createElement('div');
    mainContent.classList.add('cmp-card__main-content');

    const mediaDiv = document.createElement('div');
    mediaDiv.classList.add('cmp-card__media');

    // Card Image
    const cardImageContainer = document.createElement('div');
    cardImageContainer.classList.add('lazy-image-container');
    const cardPicture = cardImageCell.querySelector('picture');
    if (cardPicture) {
      const img = cardPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      cardImageContainer.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('cmp-card__img', 'lazy-image', 'loaded');
    }
    mediaDiv.append(cardImageContainer);

    // Play Icon
    const playIconContainer = document.createElement('div');
    playIconContainer.classList.add('lazy-image-container');
    const playIconPicture = playIconCell.querySelector('picture');
    if (playIconPicture) {
      const img = playIconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      playIconContainer.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('play-icon', 'lazy-image', 'loaded');
    }
    mediaDiv.append(playIconContainer);

    mainContent.append(mediaDiv);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('cmp-card__content');
    mainContent.append(contentDiv);

    cmpCard.append(mainContent);
    card.append(cmpCard);
    carouselItem.append(card);
    slickTrack.append(carouselItem);

    // Move instrumentation from the authored row to the new carousel item
    moveInstrumentation(row, carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(prevButton, slickList);

  // Next Button
  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.textContent = 'Next'; // Text content from original HTML
  carouselContainer.append(nextButton);

  // Slick Dots (pagination)
  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');
  // Add pagination items based on itemRows count
  itemRows.forEach((_, index) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'presentation');
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.setAttribute('id', `slick-slide-control4${index}`);
    button.setAttribute('aria-controls', `slick-slide4${index}`);
    button.setAttribute('aria-label', `${index + 1} of ${itemRows.length}`);
    button.setAttribute('tabindex', '-1'); // Swiper manages this
    button.setAttribute('aria-selected', 'false'); // Swiper manages this
    button.textContent = index + 1;
    li.append(button);
    slickDots.append(li);
  });
  carouselContainer.append(slickDots);

  cmpCarousel.append(carouselContainer);
  carouselWrapper.append(cmpCarousel);
  root.append(carouselWrapper);

  // CTA Link
  const ctaLinkWrapper = document.createElement('div');
  ctaLinkWrapper.classList.add('button', 'cmp-button--primary-anchor', 'cmp-button--primary-anchor-undefined', 'cards-cta-button');

  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add('cmp-button');
  const foundCtaLink = ctaLinkRow.querySelector('a');
  if (foundCtaLink) {
    ctaAnchor.href = foundCtaLink.href;
  }
  // Set target from original HTML if present (e.g., target="_self")
  ctaAnchor.setAttribute('target', '_self');

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('cmp-button__text');
  moveInstrumentation(ctaLabelRow, ctaSpan);
  ctaSpan.textContent = ctaLabelRow.textContent.trim();
  ctaAnchor.append(ctaSpan);
  ctaLinkWrapper.append(ctaAnchor);
  root.append(ctaLinkWrapper);

  // Share div (empty in original, but exists structurally)
  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  root.append(shareDiv);

  block.replaceChildren(root);

  // Swiper Carousel initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Get the dynamically created elements for Swiper navigation and pagination
  const swiperContainer = root.querySelector('.cmp-carousel__container');
  const swiperPrevButton = root.querySelector('.slick-prev');
  const swiperNextButton = root.querySelector('.slick-next');
  const swiperPagination = root.querySelector('.slick-dots');

  // Extract Swiper config from data attributes
  const slidesPerView = parseInt(cmpCarousel.dataset.itemCountPerSlide, 10) || 3;
  const slidesToScroll = parseInt(cmpCarousel.dataset.slidesToScroll, 10) || 3;
  const autoPlayIsEnabled = cmpCarousel.dataset.autoPlayIsEnabled === 'true';
  const autoPlaySpeedInMs = parseInt(cmpCarousel.dataset.autoPlaySpeedInMs, 10) || 1000;
  const showArrows = cmpCarousel.dataset.showArrows === 'true';
  const showDots = cmpCarousel.dataset.showDots === 'true';
  const showInfiniteScroll = cmpCarousel.dataset.showInfiniteScroll === 'true';

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView,
    slidesPerGroup: slidesToScroll,
    loop: showInfiniteScroll,
    autoplay: autoPlayIsEnabled ? { delay: autoPlaySpeedInMs, disableOnInteraction: false } : false,
    navigation: showArrows ? { prevEl: swiperPrevButton, nextEl: swiperNextButton } : false,
    pagination: showDots ? { el: swiperPagination, clickable: true } : false,
    // Additional Swiper options based on original HTML if needed
    // e.g., centeredSlides: cmpCarousel.dataset.showCenterZoom === 'true',
  });
}
