import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const productCardRows = [...block.children];

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('carousel', 'panelcontainer');

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  // Attributes from ORIGINAL HTML
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

  const cmpCarouselContent = document.createElement('div');
  cmpCarouselContent.classList.add('cmp-carousel__content', 'cmp-carousel__card-flex');
  cmpCarouselContent.setAttribute('aria-atomic', 'false');
  cmpCarouselContent.setAttribute('aria-live', 'polite');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('cmp-card--image-hover-text', 'cmp-card--default');
  cardsWrapper.setAttribute('data-component', 'cards');

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('cmp-card__container');

  productCardRows.forEach((row, index) => {
    // Fixed: Use array destructuring for fixed-schema rows
    const [imageCell, linkCell, headlineCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item');
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.setAttribute('aria-roledescription', 'slide');
    carouselItem.setAttribute('aria-label', `Slide ${index + 1} of ${productCardRows.length}`);
    carouselItem.setAttribute('data-cmp-hook-carousel', 'item');
    if (index === 0) {
      carouselItem.classList.add('cmp-carousel__item--active');
    }

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      // Fixed: Ensure target="_self" is explicitly set as per original HTML
      anchor.target = '_self';
    }

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');
    cardContent.setAttribute('tabindex', '0');

    const imageHoverWrapper = document.createElement('div');
    imageHoverWrapper.classList.add('cmp-card__image-hover-wrapper');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('cmp-card__image-wrapper');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // Fixed: moveInstrumentation should be on the original img element, not the new optimized one
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageWrapper.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('cmp-card__image-hover');
      optimizedPic.querySelector('img').setAttribute('itemprop', 'contentUrl');
    }

    const headline = document.createElement('h4');
    headline.classList.add('cmp-card__image-hover-para');
    headline.textContent = headlineCell.textContent.trim();

    imageHoverWrapper.append(imageWrapper, headline);
    cardContent.append(imageHoverWrapper);
    anchor.append(cardContent);
    carouselItem.append(anchor); // Append anchor to carouselItem
    cardContainer.append(carouselItem); // Append carouselItem to cardContainer
    moveInstrumentation(row, carouselItem); // Move instrumentation from original row to the new carouselItem
  });

  cardsWrapper.append(cardContainer);
  cmpCarouselContent.append(cardsWrapper);
  cmpCarousel.append(cmpCarouselContent);
  carouselContainer.append(cmpCarousel);

  // Carousel actions (navigation buttons) - create and append
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('cmp-carousel__actions');
  actionsDiv.style.visibility = 'hidden'; // Hidden by default as per original HTML

  const prevButton = document.createElement('button');
  prevButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('data-cmp-hook-carousel', 'previous');
  const prevIconSpan = document.createElement('span');
  prevIconSpan.classList.add('cmp-carousel__action-icon');
  // Using unicode arrow as per Rule 23.4
  prevIconSpan.textContent = '‹';
  prevButton.append(prevIconSpan);

  const nextButton = document.createElement('button');
  nextButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('data-cmp-hook-carousel', 'next');
  const nextIconSpan = document.createElement('span');
  nextIconSpan.classList.add('cmp-carousel__action-icon');
  // Using unicode arrow as per Rule 23.4
  nextIconSpan.textContent = '›';
  nextButton.append(nextIconSpan);

  actionsDiv.append(prevButton, nextButton);
  cmpCarousel.append(actionsDiv);

  // Carousel indicators (pagination dots) - create and append
  const indicatorsOl = document.createElement('ol');
  indicatorsOl.classList.add('cmp-carousel__indicators');
  indicatorsOl.setAttribute('role', 'tablist');
  indicatorsOl.setAttribute('aria-label', 'Choose a slide to display');
  indicatorsOl.setAttribute('data-cmp-hook-carousel', 'indicators');
  indicatorsOl.style.visibility = 'hidden'; // Hidden by default as per original HTML

  // For each product card, add an indicator
  productCardRows.forEach((_, index) => {
    const indicatorLi = document.createElement('li');
    indicatorLi.classList.add('cmp-carousel__indicator');
    if (index === 0) { // First item is active by default
      indicatorLi.classList.add('cmp-carousel__indicator--active');
    }
    indicatorsOl.append(indicatorLi);
  });

  cmpCarousel.append(indicatorsOl);

  block.replaceChildren(carouselContainer);

  // Basic carousel functionality (non-Swiper, based on original HTML structure)
  const items = [...cardContainer.children]; // These are now the cmp-carousel__item divs
  let currentIndex = 0;

  function updateCarousel() {
    items.forEach((item, i) => {
      item.style.display = (i === currentIndex) ? 'block' : 'none';
      if (i === currentIndex) {
        item.classList.add('cmp-carousel__item--active');
        item.setAttribute('aria-hidden', 'false');
      } else {
        item.classList.remove('cmp-carousel__item--active');
        item.setAttribute('aria-hidden', 'true');
      }
    });

    [...indicatorsOl.children].forEach((indicator, i) => {
      if (i === currentIndex) {
        indicator.classList.add('cmp-carousel__indicator--active');
      } else {
        indicator.classList.remove('cmp-carousel__indicator--active');
      }
    });
  }

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  });

  indicatorsOl.addEventListener('click', (event) => {
    const clickedIndicator = event.target.closest('.cmp-carousel__indicator');
    if (clickedIndicator) {
      const newIndex = [...indicatorsOl.children].indexOf(clickedIndicator);
      if (newIndex !== -1) {
        currentIndex = newIndex;
        updateCarousel();
      }
    }
  });

  // Initial state
  updateCarousel();

  // Make navigation visible if there's more than one item
  if (items.length > 1) {
    actionsDiv.style.visibility = 'visible';
    indicatorsOl.style.visibility = 'visible';
  }
}
