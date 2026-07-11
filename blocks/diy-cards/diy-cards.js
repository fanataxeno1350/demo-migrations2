import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const headingRow = children[0];
  const subHeadingRow = children[1];
  const ctaLinkRow = children[2];
  const ctaLabelRow = children[3];
  const cardsContainerRow = children[4]; // This is the empty container placeholder
  const itemRows = children.slice(5); // All subsequent rows are card items

  const root = document.createElement('div');
  root.classList.add('cmp-cards', 'cmp-cards--yippee-diy', 'color-background-default');

  const heading = document.createElement('h2');
  heading.classList.add('cmp-cards__heading', 'text-center', 'title-star-icon');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  root.append(heading);

  const subHeading = document.createElement('p');
  subHeading.classList.add('cmp-cards__sub-heading', 'body-3', 'text-center');
  moveInstrumentation(subHeadingRow, subHeading);
  subHeading.textContent = subHeadingRow.textContent.trim();
  root.append(subHeading);

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  cmpCarousel.dataset.component = 'carousel';
  cmpCarousel.dataset.showInfiniteScroll = 'false';
  cmpCarousel.dataset.showArrows = 'true';
  cmpCarousel.dataset.showDots = 'true';
  cmpCarousel.dataset.itemCountPerSlide = '3';
  cmpCarousel.dataset.autoPlayIsEnabled = 'false';
  cmpCarousel.dataset.autoPlaySpeedInMs = '1000';
  cmpCarousel.dataset.revealNextItemPartially = 'false';
  cmpCarousel.dataset.showCenterZoom = 'false';
  cmpCarousel.dataset.slidesToScroll = '3';
  // cmpCarousel.dataset.initialized = 'true'; // Swiper adds this automatically

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container'); // Swiper adds slick-initialized, slick-slider, slick-dotted

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  // Background image is from clientlibs, so use an inline SVG
  prevButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" transform="rotate(180 12 12)"/></svg>';
  carouselContainer.append(prevButton);

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.append(slickTrack);

  itemRows.forEach((row, index) => {
    const [cardImageCell, playIconCell] = [...row.children]; // Destructure cells for fixed schema

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'swiper-slide'); // Use swiper-slide
    carouselItem.dataset.slickIndex = index;
    carouselItem.setAttribute('aria-hidden', index !== 0);
    carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.id = `slick-slide4${index}`;
    carouselItem.setAttribute('aria-describedby', `slick-slide-control4${Math.floor(index / 3)}`);

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--yippee-diy');

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const cardStar = document.createElement('div');
    cardStar.classList.add('cmp-card__star');
    cmpCard.append(cardStar);

    const mainContent = document.createElement('div');
    mainContent.classList.add('cmp-card__main-content');

    const media = document.createElement('div');
    media.classList.add('cmp-card__media');

    if (cardImageCell) {
      const lazyImageContainer = document.createElement('div');
      lazyImageContainer.classList.add('lazy-image-container');
      const img = cardImageCell.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('cmp-card__img', 'lazy-image', 'loaded');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.append(optimizedPic);
      }
      media.append(lazyImageContainer);
    }

    if (playIconCell) {
      const playIconPicture = playIconCell.querySelector('picture');
      if (playIconPicture) {
        const playIconImg = playIconPicture.querySelector('img');
        if (playIconImg) {
          const playIconContainer = document.createElement('div');
          playIconContainer.classList.add('lazy-image-container');
          const optimizedPlayIcon = createOptimizedPicture(playIconImg.src, playIconImg.alt, false, [{ width: 'auto' }]);
          optimizedPlayIcon.querySelector('img').classList.add('play-icon', 'lazy-image', 'loaded');
          moveInstrumentation(playIconImg, optimizedPlayIcon.querySelector('img'));
          playIconContainer.append(optimizedPlayIcon);
          media.append(playIconContainer);
        }
      }
    }

    mainContent.append(media);

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');
    mainContent.append(cardContent);

    cmpCard.append(mainContent);
    card.append(cmpCard);
    carouselItem.append(card);
    slickTrack.append(carouselItem);
    moveInstrumentation(row, carouselItem); // Move instrumentation from original item row
  });

  carouselContainer.append(slickList);

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  // Background image is from clientlibs, so use an inline SVG
  nextButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';
  carouselContainer.append(nextButton);

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');
  // Swiper will handle dot creation, but we need a container for it
  carouselContainer.append(slickDots);

  cmpCarousel.append(carouselContainer);
  carouselWrapper.append(cmpCarousel);
  root.append(carouselWrapper);
  moveInstrumentation(cardsContainerRow, carouselWrapper); // Instrumentation for the container

  const ctaButtonDiv = document.createElement('div');
  ctaButtonDiv.classList.add('button', 'cmp-button--primary-anchor', 'cmp-button--primary-anchor-undefined', 'cards-cta-button');

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('cmp-button');
  const foundLink = ctaLinkRow.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
  }
  ctaLink.setAttribute('target', '_self'); // Assuming default target

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('cmp-button__text');
  ctaSpan.textContent = ctaLabelRow.textContent.trim();
  ctaLink.append(ctaSpan);

  ctaButtonDiv.append(ctaLink);
  root.append(ctaButtonDiv);
  moveInstrumentation(ctaLinkRow, ctaLink); // Move instrumentation for CTA link
  moveInstrumentation(ctaLabelRow, ctaSpan); // Move instrumentation for CTA label

  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  root.append(shareDiv);

  block.replaceChildren(root);

  // Load Swiper CSS and JS
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper
  // eslint-disable-next-line no-undef
  new Swiper(cmpCarousel, {
    slidesPerView: parseInt(cmpCarousel.dataset.itemCountPerSlide, 10) || 3,
    spaceBetween: 0, // Adjust as needed
    loop: cmpCarousel.dataset.showInfiniteScroll === 'true',
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: slickDots,
      clickable: true,
      renderBullet: (index, className) => {
        const numDots = Math.ceil(itemRows.length / (parseInt(cmpCarousel.dataset.itemCountPerSlide, 10) || 3));
        return `<li class="${className}" role="presentation"><button type="button" role="tab" id="slick-slide-control4${index}" aria-controls="slick-slide4${index * (parseInt(cmpCarousel.dataset.itemCountPerSlide, 10) || 3)}" aria-label="${index + 1} of ${numDots}" tabindex="${index === 0 ? '0' : '-1'}" aria-selected="${index === 0 ? 'true' : 'false'}">${index + 1}</button></li>`;
      },
    },
    // Add other Swiper options based on original HTML data attributes
    // e.g., autoPlayIsEnabled, autoPlaySpeedInMs, revealNextItemPartially, showCenterZoom
    autoplay: cmpCarousel.dataset.autoPlayIsEnabled === 'true' ? {
      delay: parseInt(cmpCarousel.dataset.autoPlaySpeedInMs, 10) || 1000,
      disableOnInteraction: false,
    } : false,
  });
}
