import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    tabsContainerRow, // This row is empty, just a placeholder for the container field
    recipesContainerRow, // This row is empty, just a placeholder for the container field
    ctaLabelRow,
    ...itemRows
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('cmp-recipe-group');

  // Header Section
  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-recipe-group__header-section');

  const title = document.createElement('h2');
  moveInstrumentation(titleRow, title);
  title.classList.add('cmp-recipe-group__title');
  title.textContent = titleRow.textContent.trim();
  headerSection.append(title);

  const subtitle = document.createElement('div');
  moveInstrumentation(subtitleRow, subtitle);
  subtitle.classList.add('cmp-recipe-group__subtitle');
  subtitle.textContent = subtitleRow.textContent.trim();
  headerSection.append(subtitle);

  root.append(headerSection);

  // Tabs Section
  const tabsSection = document.createElement('div');
  tabsSection.classList.add('cmp-recipe-group__tabs');
  // moveInstrumentation(tabsContainerRow, tabsSection); // tabsContainerRow is a placeholder, no content to move

  const tabGroup = document.createElement('div');
  tabGroup.classList.add('tab-group', 'cmp-tab-group');

  const tabCarouselItem = document.createElement('div');
  tabCarouselItem.classList.add(
    'cmp-tab-group__carousel-item',
    'cmp-carousel__item',
    'scrollbar-style-h',
    'scrollbar-style-w',
  );

  // Filter itemRows for tab-item (1 cell)
  const tabItems = itemRows.filter((row) => row.children.length === 1);
  tabItems.forEach((row, index) => {
    const [labelCell] = [...row.children]; // Destructuring for fixed schema
    const tabItemDiv = document.createElement('div');
    moveInstrumentation(row, tabItemDiv);
    tabItemDiv.classList.add('cmp-tab-group__tab-item');

    const tabDiv = document.createElement('div');
    tabDiv.classList.add('tab', 'cmp-tab--primary');

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('cmp-tab');
    if (index === 0) {
      button.classList.add('selected');
    }

    const span = document.createElement('span');
    span.classList.add('cmp-tab__text');
    span.textContent = labelCell.textContent.trim();
    button.append(span);
    tabDiv.append(button);
    tabItemDiv.append(tabDiv);
    tabCarouselItem.append(tabItemDiv);
  });

  tabGroup.append(tabCarouselItem);
  tabsSection.append(tabGroup);
  root.append(tabsSection);

  // Content Section (Recipes Carousel)
  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-recipe-group__content');
  // moveInstrumentation(recipesContainerRow, contentSection); // recipesContainerRow is a placeholder

  const recipeCarousel = document.createElement('div');
  recipeCarousel.classList.add('cmp-recipe-group__carousel', 'undefined'); // 'undefined' from original HTML
  // The original HTML uses 'slickcarousel carousel panelcontainer' as a wrapper,
  // but the actual Swiper container is 'cmp-carousel'
  const slickCarouselWrapper = document.createElement('div');
  slickCarouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');

  const swiperEl = document.createElement('div'); // This will be the Swiper container
  swiperEl.classList.add('cmp-carousel');
  swiperEl.setAttribute('data-component', 'carousel');
  swiperEl.setAttribute('data-show-infinite-scroll', 'false');
  swiperEl.setAttribute('data-show-arrows', 'true');
  swiperEl.setAttribute('data-show-dots', 'false');
  swiperEl.setAttribute('data-item-count-per-slide', '3');
  swiperEl.setAttribute('data-auto-play-is-enabled', 'false');
  swiperEl.setAttribute('data-auto-play-speed-in-ms', '500');
  swiperEl.setAttribute('data-reveal-next-item-partially', 'false');
  swiperEl.setAttribute('data-show-center-zoom', 'false');
  swiperEl.setAttribute('data-slides-to-scroll', '3');
  // Swiper adds 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden' automatically

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('cmp-carousel__container', 'swiper'); // Add 'swiper' class for Swiper init

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-disabled', 'true');
  prevBtn.textContent = 'Previous';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('slick-list', 'draggable', 'swiper-wrapper'); // Add 'swiper-wrapper'

  // Filter itemRows for recipe-card-item (6 cells)
  const recipeCards = itemRows.filter((row) => row.children.length === 6);
  recipeCards.forEach((row, index) => {
    const [imageCell, tagCell, recipeTitleCell, timeCell, difficultyCell, linkCell] = [...row.children]; // Destructuring for fixed schema

    const carouselItem = document.createElement('div');
    moveInstrumentation(row, carouselItem);
    carouselItem.classList.add('cmp-recipe-group__carousel-item', 'cmp-carousel__item', 'swiper-slide'); // Use 'swiper-slide'
    // Swiper adds 'slick-current', 'slick-active' automatically
    carouselItem.setAttribute('data-slick-index', index);
    carouselItem.setAttribute('aria-hidden', index !== 0);
    carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('card', 'cmp-card--recipe', 'cmp-card--aashirvaad-recipe', 'color-background-background-2');
    recipeLink.setAttribute('tabindex', index === 0 ? '0' : '-1');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      recipeLink.href = foundLink.href;
    }

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('cmp-card');

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');

    const cardMedia = document.createElement('div');
    cardMedia.classList.add('cmp-card__media');

    const cardOptions = document.createElement('div');
    cardOptions.classList.add('cmp-card__options');
    const threeDots = document.createElement('div');
    threeDots.classList.add('cmp-card__three-dots', 'icon-open-card-popup');
    cardOptions.append(threeDots);
    cardMedia.append(cardOptions);

    const cardImage = document.createElement('div');
    cardImage.classList.add('cmp-card__image');
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      lazyImageContainer.append(optimizedPic);
    }
    cardImage.append(lazyImageContainer);
    cardMedia.append(cardImage);
    cardContent.append(cardMedia);

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cmp-card__info');

    const cardTag = document.createElement('div');
    cardTag.classList.add('cmp-card__tag', 'cmp-card__tag--with-heart');
    const tagWrapper = document.createElement('div');
    tagWrapper.classList.add('cmp-card__tag-wrapper');
    const tagP = document.createElement('p');
    tagP.textContent = tagCell.textContent.trim();
    tagWrapper.append(tagP);
    cardTag.append(tagWrapper);
    const heartsWrapper = document.createElement('div');
    heartsWrapper.classList.add('cmp-card__hearts-wrapper', 'hidden');
    const heartIcon = document.createElement('div');
    heartIcon.classList.add('cmp-card__icon', 'icon-favorite_FILL1_wght400_GRAD0_opsz20');
    heartsWrapper.append(heartIcon);
    heartsWrapper.append(document.createElement('p')); // Empty p tag for consistency
    cardTag.append(heartsWrapper);
    cardInfo.append(cardTag);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('cmp-card__title');
    const titleH4 = document.createElement('h4');
    titleH4.textContent = recipeTitleCell.textContent.trim();
    cardTitle.append(titleH4);
    cardInfo.append(cardTitle);

    const recipeFooter = document.createElement('div');
    recipeFooter.classList.add('cmp-card__recipe_footer');

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('cmp-card__time-in-minutes');
    const timeIcon = document.createElement('div');
    timeIcon.classList.add('cmp-card__icon', 'icon-Group-21690');
    const timeP = document.createElement('p');
    timeP.textContent = timeCell.textContent.trim();
    timeDiv.append(timeIcon, timeP);
    recipeFooter.append(timeDiv);

    const difficultyDiv = document.createElement('div');
    difficultyDiv.classList.add('cmp-card__difficulty-level', 'icon-chef-cap');
    const difficultyIcon = document.createElement('div');
    difficultyIcon.classList.add('cmp-card__icon', 'path1');
    const difficultyP = document.createElement('p');
    difficultyP.textContent = difficultyCell.textContent.trim();
    difficultyDiv.append(difficultyIcon, difficultyP);
    recipeFooter.append(difficultyDiv);

    cardInfo.append(recipeFooter);
    cardContent.append(cardInfo);
    cardDiv.append(cardContent);
    recipeLink.append(cardDiv);
    carouselItem.append(recipeLink);
    swiperWrapper.append(carouselItem); // Append to swiperWrapper
  });

  swiperContainer.append(swiperWrapper); // swiperWrapper is inside swiperContainer

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('slick-next', 'slick-arrow');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-disabled', 'false');
  nextBtn.textContent = 'Next';

  // Append prev/next buttons and swiper container to swiperEl
  swiperEl.append(prevBtn, swiperContainer, nextBtn);
  slickCarouselWrapper.append(swiperEl); // Wrap swiperEl in slickCarouselWrapper
  recipeCarousel.append(slickCarouselWrapper); // Wrap slickCarouselWrapper in recipeCarousel
  contentSection.append(recipeCarousel);
  root.append(contentSection);

  // Action Section
  const actionSection = document.createElement('div');
  actionSection.classList.add('cmp-recipe-group__action');

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-light');

  const ctaButton = document.createElement('button');
  moveInstrumentation(ctaLabelRow, ctaButton);
  ctaButton.type = 'button';
  ctaButton.classList.add('cmp-button');

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('cmp-button__text');
  ctaSpan.textContent = ctaLabelRow.textContent.trim();
  ctaButton.append(ctaSpan);
  buttonDiv.append(ctaButton);
  actionSection.append(buttonDiv);
  root.append(actionSection);

  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  root.append(shareDiv);

  block.replaceChildren(root);

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  const swiper = new Swiper(swiperContainer, { // Initialize Swiper on swiperContainer
    slidesPerView: 'auto',
    loop: false, // data-show-infinite-scroll="false"
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: '.swiper-pagination', // Placeholder, as original HTML has no dots
      clickable: true,
    },
    // The original HTML has data-item-count-per-slide="3" and data-slides-to-scroll="3"
    // which translates to Swiper's slidesPerView and slidesPerGroup
    slidesPerView: parseInt(swiperEl.dataset.itemCountPerSlide, 10) || 3,
    slidesPerGroup: parseInt(swiperEl.dataset.slidesToScroll, 10) || 3,
    // Add other Swiper options as needed from the original HTML's data attributes
    // e.g., spaceBetween, centeredSlides, etc.
  });

  // Swiper handles button states automatically, so manual event listeners are not needed
  // if navigation is configured correctly.
  // The initial 'slick-disabled' class on prevBtn will be managed by Swiper.
}
