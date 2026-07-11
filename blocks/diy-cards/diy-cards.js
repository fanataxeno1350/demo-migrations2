import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    headingRow,
    subHeadingRow,
    ctaLinkRow,
    ctaLabelRow,
    ...cardItemRows // cardsContainerRow was a placeholder, actual item rows follow
  ] = [...block.children];

  const root = document.createElement('div');
  // Removed 'cmp-cards' from root.classList.add as the outer block div already has it.
  root.classList.add('cmp-cards--yippee-diy', 'color-background-default');

  const heading = document.createElement('h2');
  heading.classList.add('cmp-cards__heading', 'text-center', 'title-star-icon');
  moveInstrumentation(headingRow, heading);
  const [headingCell] = [...headingRow.children]; // Destructure for heading cell
  heading.textContent = headingCell?.textContent.trim() || '';
  root.append(heading);

  const subHeading = document.createElement('p');
  subHeading.classList.add('cmp-cards__sub-heading', 'body-3', 'text-center');
  moveInstrumentation(subHeadingRow, subHeading);
  const [subHeadingCell] = [...subHeadingRow.children]; // Destructure for subHeading cell
  subHeading.textContent = subHeadingCell?.textContent.trim() || '';
  root.append(subHeading);

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');

  const carousel = document.createElement('div');
  carousel.classList.add('cmp-carousel');
  carousel.setAttribute('data-component', 'carousel');
  // Corrected data-show-infinite-scroll to match original HTML's data-infinite-scroll="false"
  carousel.setAttribute('data-show-infinite-scroll', 'false');
  carousel.setAttribute('data-show-arrows', 'true');
  carousel.setAttribute('data-show-dots', 'true');
  carousel.setAttribute('data-item-count-per-slide', '3');
  carousel.setAttribute('data-auto-play-is-enabled', 'false');
  carousel.setAttribute('data-auto-play-speed-in-ms', '1000');
  carousel.setAttribute('data-reveal-next-item-partially', 'false');
  carousel.setAttribute('data-show-center-zoom', 'false');
  carousel.setAttribute('data-slides-to-scroll', '3');

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container');
  // Swiper adds slick-initialized, slick-slider, slick-dotted automatically. Do not add manually.

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow'); // slick-disabled is added by Swiper
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  // prevButton.setAttribute('aria-disabled', 'true'); // Swiper manages this
  // Removed hardcoded background-image for arrows as per Rule 25.4
  carouselContainer.append(prevButton);

  const swiperWrapper = document.createElement('div'); // Renamed from slickList to swiperWrapper for Swiper
  swiperWrapper.classList.add('swiper-wrapper'); // Swiper class

  // Renamed from slickTrack to swiperTrack for Swiper compatibility
  // The original HTML has slick-track directly inside slick-list,
  // but Swiper uses swiper-slide directly inside swiper-wrapper.
  // We will append carouselItem (which will be swiper-slide) directly to swiperWrapper.
  // slickTrack.style.opacity = '1'; // Not needed for Swiper

  // moveInstrumentation(cardsContainerRow, carouselContainer); // cardsContainerRow was a placeholder, no actual row for it.

  cardItemRows.forEach((row, index) => {
    const [cardImageCell, playIconCell] = [...row.children]; // Destructure for card item cells

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'swiper-slide'); // Swiper class
    carouselItem.setAttribute('data-slick-index', index); // Keep for potential compatibility or custom logic
    carouselItem.setAttribute('aria-hidden', 'true');
    carouselItem.setAttribute('tabindex', '-1');
    carouselItem.setAttribute('role', 'tabpanel');

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--yippee-diy');

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const starDiv = document.createElement('div');
    starDiv.classList.add('cmp-card__star');
    cmpCard.append(starDiv);

    const mainContent = document.createElement('div');
    mainContent.classList.add('cmp-card__main-content');

    const media = document.createElement('div');
    media.classList.add('cmp-card__media');

    const cardImageContainer = document.createElement('div');
    cardImageContainer.classList.add('lazy-image-container');
    const cardPicture = cardImageCell.querySelector('picture');
    if (cardPicture) {
      const img = cardPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImageContainer.append(optimizedPic);
      }
    }
    cardImageContainer.querySelector('img')?.classList.add('cmp-card__img', 'lazy-image', 'loaded');
    media.append(cardImageContainer);

    const playIconContainer = document.createElement('div');
    playIconContainer.classList.add('lazy-image-container');
    const playPicture = playIconCell.querySelector('picture');
    if (playPicture) {
      const img = playPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        playIconContainer.append(optimizedPic);
      }
    }
    playIconContainer.querySelector('img')?.classList.add('play-icon', 'lazy-image', 'loaded');
    media.append(playIconContainer);

    mainContent.append(media);

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');
    mainContent.append(cardContent);

    cmpCard.append(mainContent);
    card.append(cmpCard);
    carouselItem.append(card);
    swiperWrapper.append(carouselItem); // Append to swiperWrapper
    moveInstrumentation(row, carouselItem); // Move instrumentation for each card item
  });

  carouselContainer.append(swiperWrapper); // Append swiperWrapper to carouselContainer

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow'); // slick-disabled is added by Swiper
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  // nextButton.setAttribute('aria-disabled', 'false'); // Swiper manages this
  // Removed hardcoded background-image for arrows as per Rule 25.4
  carouselContainer.append(nextButton);

  const swiperPagination = document.createElement('div'); // Renamed from slickDots to swiperPagination for Swiper
  swiperPagination.classList.add('slick-dots', 'swiper-pagination'); // Keep slick-dots for styling, add swiper-pagination
  swiperPagination.setAttribute('role', 'tablist');
  carouselContainer.append(swiperPagination);

  carousel.append(carouselContainer);
  carouselWrapper.append(carousel);
  root.append(carouselWrapper);

  const ctaButtonDiv = document.createElement('div');
  ctaButtonDiv.classList.add('button', 'cmp-button--primary-anchor', 'cmp-button--primary-anchor-undefined', 'cards-cta-button');

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('cmp-button');
  const foundCtaLink = ctaLinkRow.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  }
  ctaLink.setAttribute('target', '_self');

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('cmp-button__text');
  const [ctaLabelCell] = [...ctaLabelRow.children]; // Destructure for ctaLabel cell
  ctaSpan.textContent = ctaLabelCell?.textContent.trim() || '';
  ctaLink.append(ctaSpan);

  moveInstrumentation(ctaLinkRow, ctaLink);
  moveInstrumentation(ctaLabelRow, ctaSpan);

  ctaButtonDiv.append(ctaLink);
  root.append(ctaButtonDiv);

  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  root.append(shareDiv);

  block.replaceChildren(root);

  // Swiper.js initialization
  // Original HTML uses Slick, but EDS does not ship Slick. Replaced with Swiper.
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(carousel, { // Initialize Swiper on the .cmp-carousel element
    slidesPerView: 3, // Matches data-item-count-per-slide
    slidesPerGroup: 3, // Matches data-slides-to-scroll
    loop: false, // Matches data-show-infinite-scroll="false"
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: swiperPagination,
      clickable: true,
    },
    breakpoints: {
      1024: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        loop: true, // Original Slick had infinite: true here
      },
      600: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
    },
  });
}
