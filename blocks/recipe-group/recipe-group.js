import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    backgroundImageRow,
    titleRow,
    subtitleRow,
    tabsContainerRow, // This row is empty in the model, used for instrumentation
    recipesSectionTitleRow,
    recipeCardsContainerRow, // This row is empty in the model, used for instrumentation
    ctaLinkRow,
    ctaLabelRow,
    ...itemRows
  ] = [...block.children];

  const root = document.createElement('div');
  // root.classList.add('cmp-recipe-group'); // Removed: outer block div already has 'recipe-group'

  // Background Image
  const backgroundImagePicture = backgroundImageRow?.querySelector('picture');
  if (backgroundImagePicture) {
    const img = backgroundImagePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    moveInstrumentation(backgroundImageRow, optimizedPic);
    root.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
  }

  // Header Section
  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-recipe-group__header-section');
  moveInstrumentation(titleRow, headerSection);
  moveInstrumentation(subtitleRow, headerSection);

  const title = document.createElement('h2');
  title.classList.add('cmp-recipe-group__title', 'text-center', 'title-star-icon');
  title.textContent = titleRow?.textContent.trim() || '';
  headerSection.append(title);

  const subtitle = document.createElement('div');
  subtitle.classList.add('cmp-recipe-group__sub-title', 'text-center');
  subtitle.textContent = subtitleRow?.textContent.trim() || '';
  headerSection.append(subtitle);

  root.append(headerSection);

  // Tabs Section
  const tabGroup = document.createElement('div');
  tabGroup.classList.add('cmp-tab-group');
  moveInstrumentation(tabsContainerRow, tabGroup); // Instrument the empty tabsContainerRow

  const tabGroupWrapper = document.createElement('div');
  tabGroupWrapper.classList.add('cmp-tab-group__wrapper');
  tabGroup.append(tabGroupWrapper);

  const tabItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  const recipeCardItems = itemRows.filter((row) => row.children.length === 3);

  const tabContentContainer = document.createElement('div'); // Container for tab content
  tabContentContainer.classList.add('cmp-tab-content-container');
  root.append(tabContentContainer);

  tabItems.forEach((row, index) => {
    const [tabImageCell, tabLabelCell] = [...row.children];

    const tab = document.createElement('div');
    tab.classList.add('cmp-tab-group__tab');
    if (index === 0) {
      tab.classList.add('active');
    }
    moveInstrumentation(row, tab);

    const tabImage = document.createElement('div');
    tabImage.classList.add('cmp-tab-group__image');
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    const picture = tabImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
      moveInstrumentation(tabImageCell, optimizedPic.querySelector('img'));
      lazyImageContainer.append(optimizedPic);
    }
    tabImage.append(lazyImageContainer);
    tab.append(tabImage);

    const tabTitle = document.createElement('div');
    tabTitle.classList.add('cmp-tab-group__title', 'body-3');
    tabTitle.textContent = tabLabelCell?.textContent.trim() || '';
    tab.append(tabTitle);

    if (index === 0) {
      const titleBorderWrapper = document.createElement('div');
      titleBorderWrapper.classList.add('cmp-tab-group__title-border-wrapper');
      const titleBorder = document.createElement('div');
      titleBorder.classList.add('cmp-tab-group__title-border');
      titleBorderWrapper.append(titleBorder);
      tab.append(titleBorderWrapper);
    }

    tabGroupWrapper.append(tab);

    // Create a corresponding content panel for each tab
    const tabContentPanel = document.createElement('div');
    tabContentPanel.classList.add('cmp-tab-content-panel');
    tabContentPanel.setAttribute('data-tab-id', `tab-${index}`);
    if (index === 0) {
      tabContentPanel.classList.add('active');
    }
    // TODO: Populate tabContentPanel with relevant content based on the tab.
    // For now, it's just a placeholder. The original HTML doesn't show separate tab content.
    tabContentPanel.textContent = `Content for ${tabLabelCell?.textContent.trim() || 'Tab'} (TODO: Implement content)`;
    tabContentContainer.append(tabContentPanel);


    tab.addEventListener('click', () => {
      tabGroupWrapper.querySelectorAll('.cmp-tab-group__tab').forEach((t) => t.classList.remove('active'));
      tabGroupWrapper.querySelectorAll('.cmp-tab-group__title-border-wrapper').forEach((b) => b.remove());
      tab.classList.add('active');
      const newTitleBorderWrapper = document.createElement('div');
      newTitleBorderWrapper.classList.add('cmp-tab-group__title-border-wrapper');
      const newTitleBorder = document.createElement('div');
      newTitleBorder.classList.add('cmp-tab-group__title-border');
      newTitleBorderWrapper.append(newTitleBorder);
      tab.append(newTitleBorderWrapper);

      // Tab content switching logic
      tabContentContainer.querySelectorAll('.cmp-tab-content-panel').forEach((panel) => {
        panel.classList.remove('active');
      });
      tabContentPanel.classList.add('active');
    });
  });

  root.append(tabGroup);

  // Recipes Content Section
  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-recipe-group__content');
  moveInstrumentation(recipesSectionTitleRow, contentSection);
  moveInstrumentation(recipeCardsContainerRow, contentSection); // Instrument the empty recipeCardsContainerRow

  const recipesSectionTitle = document.createElement('h2');
  recipesSectionTitle.classList.add('cmp-recipe-group__content-title', 'text-center');
  recipesSectionTitle.textContent = recipesSectionTitleRow?.textContent.trim() || '';
  contentSection.append(recipesSectionTitle);

  // Swiper Carousel for Recipe Cards
  // The original HTML uses Slick Carousel, but EDS uses Swiper.js.
  // We will adapt the structure to Swiper.js conventions.
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('cmp-carousel', 'swiper'); // Add 'swiper' class for Swiper.js
  swiperContainer.setAttribute('data-component', 'carousel');
  swiperContainer.setAttribute('data-show-infinite-scroll', 'false');
  swiperContainer.setAttribute('data-show-arrows', 'true');
  swiperContainer.setAttribute('data-show-dots', 'true');
  swiperContainer.setAttribute('data-item-count-per-slide', '3');
  swiperContainer.setAttribute('data-auto-play-is-enabled', 'false');
  swiperContainer.setAttribute('data-auto-play-speed-in-ms', '500');
  swiperContainer.setAttribute('data-reveal-next-item-partially', 'false');
  swiperContainer.setAttribute('data-show-center-zoom', 'false');
  swiperContainer.setAttribute('data-slides-to-scroll', '3');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('cmp-carousel__container', 'swiper-wrapper'); // 'swiper-wrapper' for Swiper.js
  swiperContainer.append(swiperWrapper);

  recipeCardItems.forEach((row) => {
    const [cardImageCell, cardTitleCell, prepTimeCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('cmp-carousel__item', 'swiper-slide'); // 'swiper-slide' for Swiper.js
    moveInstrumentation(row, swiperSlide);

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--yippee-recipe');
    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');
    card.append(cmpCard);

    const mainContent = document.createElement('div');
    mainContent.classList.add('cmp-card__main-content');
    cmpCard.append(mainContent);

    const options = document.createElement('div');
    options.classList.add('cmp-card__options');
    const threeDots = document.createElement('div');
    threeDots.classList.add('cmp-card__three-dots', 'icon-Ellipses');
    options.append(threeDots);
    mainContent.append(options);

    const media = document.createElement('div');
    media.classList.add('cmp-card__media');
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    const picture = cardImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '342' }]);
      moveInstrumentation(cardImageCell, optimizedPic.querySelector('img'));
      const cardImg = optimizedPic.querySelector('img');
      cardImg.classList.add('cmp-card__img', 'is-clickable');
      lazyImageContainer.append(optimizedPic);
    }
    media.append(lazyImageContainer);
    mainContent.append(media);

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');
    mainContent.append(cardContent);

    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('cmp-card__title');
    cardTitle.textContent = cardTitleCell?.textContent.trim() || '';
    cardContent.append(cardTitle);

    const timeInMinutes = document.createElement('div');
    timeInMinutes.classList.add('cmp-card__time-in-minutes');
    const timeWrapper = document.createElement('div');
    timeWrapper.classList.add('cmp-card__time-wrapper');
    const timeIcon = document.createElement('div');
    timeIcon.classList.add('cmp-card__time-icon'); // Placeholder for icon
    timeWrapper.append(timeIcon);
    const time = document.createElement('div');
    time.classList.add('cmp-card__time');
    time.textContent = prepTimeCell?.textContent.trim() || '';
    timeWrapper.append(time);
    timeInMinutes.append(timeWrapper);
    const minutesText = document.createElement('p');
    minutesText.classList.add('cmp-card__minutes', 'body-3');
    minutesText.textContent = ' Mins';
    timeInMinutes.append(minutesText);
    cardContent.append(timeInMinutes);

    swiperSlide.append(card);
    swiperWrapper.append(swiperSlide);
  });

  // Swiper Navigation (Prev/Next buttons)
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-button-prev', 'slick-arrow'); // Swiper class, keep slick-arrow for styling
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.setAttribute('type', 'button');
  prevBtn.textContent = '‹'; // Unicode arrow
  swiperContainer.append(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-button-next', 'slick-arrow'); // Swiper class, keep slick-arrow for styling
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.setAttribute('type', 'button');
  nextBtn.textContent = '›'; // Unicode arrow
  swiperContainer.append(nextBtn);

  // Swiper Pagination (Dots)
  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'slick-dots'); // Swiper class, keep slick-dots for styling
  swiperContainer.append(paginationEl);

  contentSection.append(swiperContainer);
  root.append(contentSection);

  // CTA Link
  const actionSection = document.createElement('div');
  actionSection.classList.add('cmp-recipe-group__action');
  moveInstrumentation(ctaLinkRow, actionSection);
  moveInstrumentation(ctaLabelRow, actionSection);

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('button', 'cmp-button--primary-anchor', 'cmp-button--primary-anchor-undefined');
  actionSection.append(buttonWrapper);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('cmp-button');
  const foundLink = ctaLinkRow.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
  }
  ctaLink.setAttribute('target', '_self');
  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('cmp-button__text');
  ctaSpan.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaLink.append(ctaSpan);
  buttonWrapper.append(ctaLink);

  root.append(actionSection);

  // Share section (empty in original HTML, just a div)
  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  root.append(shareDiv);

  block.replaceChildren(root);

  // Initialize Swiper Carousel
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 3,
    spaceBetween: 0, // Adjust as needed
    loop: false, // data-show-infinite-scroll is false
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      // when window width is >= 600px
      600: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      1200: { // Desktop breakpoint
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
    },
  });
}
