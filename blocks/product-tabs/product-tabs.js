import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const [
    titleRow,
    autoPlayIsEnabledRow,
    autoPlaySpeedInMsRow,
    infiniteScrollRow,
    tabCategoriesContainer, // Placeholder for tabCategories
    carouselItemsContainer, // Placeholder for carouselItems
    ctaLabelRow,
    ...itemRows
  ] = children;

  const sectionTitle = titleRow?.textContent.trim();
  const autoPlayIsEnabled = autoPlayIsEnabledRow?.textContent.trim() === 'true';
  const autoPlaySpeedInMs = parseInt(autoPlaySpeedInMsRow?.textContent.trim(), 10) || 3000;
  const infiniteScroll = infiniteScrollRow?.textContent.trim() === 'true';
  const ctaLabel = ctaLabelRow?.textContent.trim();

  const tabCategoryItems = itemRows.filter((row) => row.children.length === 1);
  const productCarouselItems = itemRows.filter((row) => row.children.length === 3);

  const rootDiv = document.createElement('div');
  // rootDiv.classList.add('cmp-product-tabs'); // Removed: block already has this class
  moveInstrumentation(block, rootDiv);

  if (sectionTitle) {
    const title = document.createElement('h2');
    title.classList.add('cmp-product-tabs__title');
    title.textContent = sectionTitle;
    moveInstrumentation(titleRow, title);
    rootDiv.append(title);
  }

  const tabsDiv = document.createElement('div');
  tabsDiv.classList.add('cmp-product-tabs__tabs');
  moveInstrumentation(tabCategoriesContainer, tabsDiv);

  const tabContentDiv = document.createElement('div');
  tabContentDiv.classList.add('cmp-product-tabs__content');
  moveInstrumentation(carouselItemsContainer, tabContentDiv);

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer'); // Original HTML uses 'slickcarousel'

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel');
  carouselContainer.dataset.component = 'carousel';
  carouselContainer.dataset.showInfiniteScroll = infiniteScroll;
  carouselContainer.dataset.showArrows = 'true';
  carouselContainer.dataset.showDots = 'true';
  carouselContainer.dataset.itemCountPerSlide = '3';
  carouselContainer.dataset.autoPlayIsEnabled = autoPlayIsEnabled;
  carouselContainer.dataset.autoPlaySpeedInMs = autoPlaySpeedInMs;
  carouselContainer.dataset.revealNextItemPartially = 'false';
  carouselContainer.dataset.showCenterZoom = 'false';
  carouselContainer.dataset.slidesToScroll = '3';

  // Swiper specific elements
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper'); // Swiper container
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper'); // Swiper wrapper for slides

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('slick-prev', 'slick-arrow'); // Using original slick classes for styling
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.setAttribute('type', 'button');
  prevBtn.textContent = 'Previous';

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('slick-next', 'slick-arrow'); // Using original slick classes for styling
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.setAttribute('type', 'button');
  nextBtn.textContent = 'Next';

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('slick-dots'); // Using original slick classes for styling

  productCarouselItems.forEach((row) => {
    const [imageCell, productNameCell, productLinkCell] = [...row.children];

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cmp-carousel__item', 'swiper-slide'); // Changed slick-slide to swiper-slide
    moveInstrumentation(row, itemDiv);

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');

    const productLink = productLinkCell?.querySelector('a');
    if (productLink) {
      lazyImageContainer.dataset.redirectionUrl = productLink.href;
    }

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      lazyImageContainer.append(optimizedPic);
    }
    itemDiv.append(lazyImageContainer);
    swiperWrapper.append(itemDiv); // Append to swiperWrapper
  });

  swiperContainer.append(swiperWrapper);
  carouselContainer.append(prevBtn, swiperContainer, nextBtn, paginationEl); // Append swiper elements
  carouselWrapper.append(carouselContainer);
  tabContentDiv.append(carouselWrapper);

  const tabButtons = [];
  tabCategoryItems.forEach((row, index) => {
    const [categoryLabelCell] = [...row.children]; // Fixed: named destructuring
    const categoryLabel = categoryLabelCell?.textContent.trim();
    if (categoryLabel) {
      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined');
      if (index === 0) {
        buttonWrapper.classList.add('active');
      }
      moveInstrumentation(row, buttonWrapper);

      const button = document.createElement('button');
      button.classList.add('cmp-button');
      button.setAttribute('type', 'button');
      button.dataset.category = categoryLabel; // Add data attribute for filtering

      const span = document.createElement('span');
      span.classList.add('cmp-button__text');
      span.textContent = categoryLabel;

      button.append(span);
      buttonWrapper.append(button);
      tabsDiv.append(buttonWrapper);
      tabButtons.push(buttonWrapper);

      // Add event listener for tab switching
      buttonWrapper.addEventListener('click', () => {
        tabButtons.forEach((btn) => btn.classList.remove('active'));
        buttonWrapper.classList.add('active');
        // TODO: Implement actual filtering of carousel items based on category
        // This block only builds the UI, filtering logic would go here
        // For now, it just switches the active tab visually.
      });
    }
  });

  rootDiv.append(tabsDiv, tabContentDiv);

  if (ctaLabel) {
    const ctaButtonWrapper = document.createElement('div');
    ctaButtonWrapper.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-undefined', 'cmp-product-tabs__button-range');
    moveInstrumentation(ctaLabelRow, ctaButtonWrapper);

    const ctaButton = document.createElement('button');
    ctaButton.classList.add('cmp-button');
    ctaButton.setAttribute('type', 'button');

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('cmp-button__text');
    ctaSpan.textContent = ctaLabel;

    ctaButton.append(ctaSpan);
    ctaButtonWrapper.append(ctaButton);
    rootDiv.append(ctaButtonWrapper);
  }

  block.replaceChildren(rootDiv);

  // Initialize Swiper Carousel (replacing Slick)
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 3, // Default for desktop
    spaceBetween: 30, // Example space between slides
    loop: infiniteScroll, // Use infiniteScroll from block config
    autoplay: autoPlayIsEnabled ? { delay: autoPlaySpeedInMs, disableOnInteraction: false } : false,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 992px
      992: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      // when window width is < 768px
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  });
}
