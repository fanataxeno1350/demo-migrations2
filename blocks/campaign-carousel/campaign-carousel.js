import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const [
    backgroundImageRow,
    titleRow,
    descriptionRow,
    ...slideRows
  ] = children;

  const root = document.createElement('section');
  root.classList.add('campaign-carousel', 'grid-container', 'bg--paper-white');

  // Background Image
  const backgroundImagePicture = backgroundImageRow.querySelector('picture');
  if (backgroundImagePicture) {
    const parallaxBg = document.createElement('div');
    parallaxBg.classList.add('parallax-bg', 'js-parallax-bg', 'lazyLoadedImage');
    const img = backgroundImagePicture.querySelector('img');
    if (img) {
      parallaxBg.style.backgroundImage = `url(${img.src})`;
    }
    moveInstrumentation(backgroundImageRow, parallaxBg);
    root.append(parallaxBg);
  }

  const contentWrapper = document.createElement('div');
  const headerGrid = document.createElement('div');
  headerGrid.classList.add('grid-x', 'campaign-carousel__header-grid');
  contentWrapper.append(headerGrid);

  const emptyCell1 = document.createElement('div');
  emptyCell1.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell1);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cell', 'small-12', 'large-8', 'xlarge-6', 'campaign-carousel__header-wrapper');
  headerGrid.append(headerWrapper);

  const emptyCell2 = document.createElement('div');
  emptyCell2.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell2);

  // Title
  if (titleRow) {
    const title = document.createElement('h2');
    title.classList.add('campaign-carousel__title');
    moveInstrumentation(titleRow, title);
    title.textContent = titleRow.textContent.trim();
    headerWrapper.append(title);
  }

  // Description
  if (descriptionRow) {
    const description = document.createElement('div');
    description.classList.add('campaign-carousel__description', 'bodyMediumRegular');
    moveInstrumentation(descriptionRow, description);
    description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    headerWrapper.append(description);
  }

  // Swiper Carousel
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'campaign-carousel__swiper');
  contentWrapper.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'campaign-carousel__swiper-wrapper');
  swiperEl.append(swiperWrapper);

  slideRows.forEach((row) => {
    const cells = [...row.children];
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    moveInstrumentation(row, swiperSlide);

    if (cells.length === 3) { // Quotation Slide
      swiperSlide.classList.add('campaign-carousel__swiper__quotation-slide');
      const [quoteTextCell, authorCell, slideBgImageCell] = cells;

      const campaignQuotation = document.createElement('div');
      campaignQuotation.classList.add('campaign-quotation');
      swiperSlide.append(campaignQuotation);

      const blockquote = document.createElement('blockquote');
      blockquote.classList.add('campaign-quotation__text', 'headline-h4');
      blockquote.innerHTML = quoteTextCell?.innerHTML || '';

      const quoteIconWrapper = document.createElement('span');
      quoteIconWrapper.classList.add('campaign-quotation__quote-icon-wrapper');
      quoteIconWrapper.innerHTML = '<i class="icon quote-start-brown"></i>';
      blockquote.append(quoteIconWrapper);
      campaignQuotation.append(blockquote);

      const authorWrapper = document.createElement('div');
      authorWrapper.classList.add('campaign-quotation__author-and-location-wrapper');
      const author = document.createElement('div');
      author.classList.add('labelSmallBold', 'campaign-quotation__author');
      author.textContent = authorCell?.textContent.trim();
      authorWrapper.append(author);
      campaignQuotation.append(authorWrapper);

      const slideBgImageWrapper = document.createElement('div');
      slideBgImageWrapper.classList.add('campaign-quotation__background-image-wrapper');
      const picture = slideBgImageCell.querySelector('picture');
      if (picture) {
        slideBgImageWrapper.append(picture);
      }
      campaignQuotation.append(slideBgImageWrapper);
    } else if (cells.length === 9) { // Recipe Card Slide
      swiperSlide.classList.add('campaign-carousel__swiper__recipe-card-slide');
      const [
        recipeLinkCell,
        recipeImageCell,
        tagLabelCell,
        nameCell,
        descriptionCell,
        stepsCountCell,
        stepsLabelCell,
        ingredientsCountCell,
        ingredientsLabelCell,
      ] = cells;

      const recipeLink = recipeLinkCell?.querySelector('a')?.href || '#';
      const anchor = document.createElement('a');
      anchor.href = recipeLink;
      anchor.classList.add('campaign-recipe-card', 'elevation-4');
      anchor.setAttribute('aria-label', `${nameCell?.textContent.trim()} - Read More`);
      swiperSlide.append(anchor);

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-recipe-card__img-container');
      const picture = recipeImageCell.querySelector('picture');
      if (picture) {
        imgContainer.append(picture);
      }
      anchor.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-recipe-card__details');
      anchor.append(details);

      const tagWrapper = document.createElement('div');
      tagWrapper.classList.add('campaign-recipe-card__tag');
      const tag = document.createElement('div');
      tag.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagLabelCell?.textContent.trim();
      tag.append(tagLabel);
      tagWrapper.append(tag);
      details.append(tagWrapper);

      const name = document.createElement('div');
      name.classList.add('labelLargeBold', 'campaign-recipe-card__name');
      name.textContent = nameCell?.textContent.trim();
      details.append(name);

      const description = document.createElement('div');
      description.classList.add('bodySmallRegular', 'campaign-recipe-card__description');
      description.textContent = descriptionCell?.textContent.trim();
      details.append(description);

      const stepsAndIngredients = document.createElement('div');
      stepsAndIngredients.classList.add('campaign-recipe-card__steps-and-ingredients');
      details.append(stepsAndIngredients);

      const stepsContainer = document.createElement('div');
      stepsContainer.classList.add('campaign-recipe-card__steps-container');
      const stepsCount = document.createElement('span');
      stepsCount.classList.add('labelSmallBold', 'campaign-recipe-card__steps-count');
      stepsCount.textContent = stepsCountCell?.textContent.trim();
      const stepsLabel = document.createElement('span');
stepsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__steps-label');
      stepsLabel.textContent = stepsLabelCell?.textContent.trim();
      stepsContainer.append(stepsCount, stepsLabel);
      stepsAndIngredients.append(stepsContainer);

      const separator = document.createElement('div');
      separator.classList.add('campaign-recipe-card__steps-separator');
      stepsAndIngredients.append(separator);

      const ingredientsContainer = document.createElement('div');
      ingredientsContainer.classList.add('campaign-recipe-card__ingredients-container');
      const ingredientsCount = document.createElement('span');
      ingredientsCount.classList.add('labelSmallBold', 'campaign-recipe-card__ingredients-count');
      ingredientsCount.textContent = ingredientsCountCell?.textContent.trim();
      const ingredientsLabel = document.createElement('span');
      ingredientsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__ingredients-label');
      ingredientsLabel.textContent = ingredientsLabelCell?.textContent.trim();
      ingredientsContainer.append(ingredientsCount, ingredientsLabel);
      stepsAndIngredients.append(ingredientsContainer);
    } else if (cells.length === 5) { // Fact Card Slide
      swiperSlide.classList.add('campaign-carousel__swiper__fact-card-slide');
      const [
        factImageCell,
        nameCell,
        descriptionCell,
        ctaLinkCell,
        ctaLabelCell,
      ] = cells;

      const factCard = document.createElement('div');
      factCard.classList.add('campaign-fact-card', 'campaign-fact', 'elevation-4');
      // Check for specific class based on content, e.g., 'campaign-make-difference'
      if (nameCell?.textContent.trim().toLowerCase().includes('one cup makes a big difference')) {
        factCard.classList.add('campaign-make-difference', 'bg--paper-brown');
      } else {
        factCard.classList.add('bg--paper-green');
      }
      swiperSlide.append(factCard);

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-fact-card__img-container');
      const picture = factImageCell.querySelector('picture');
      if (picture) {
        imgContainer.append(picture);
      }
      factCard.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-fact-card__details');
      factCard.append(details);

      const name = document.createElement('div');
      name.classList.add('campaign-fact-card__name', 'utilityScriptLarge');
      name.textContent = nameCell?.textContent.trim();
      details.append(name);

      const description = document.createElement('div');
      description.classList.add('bodyMediumRegular', 'campaign-fact-card__description');
      description.innerHTML = descriptionCell?.innerHTML || '';
      details.append(description);

      const cta = document.createElement('div');
      cta.classList.add('campaign-fact-card__cta');
      const ctaAnchor = document.createElement('a');
      ctaAnchor.classList.add('link', 'link-auto', 'labelSmallBold');
      ctaAnchor.href = ctaLinkCell?.querySelector('a')?.href || '#';
      ctaAnchor.textContent = ctaLabelCell?.textContent.trim();
      cta.append(ctaAnchor);
      details.append(cta);
    }
    swiperWrapper.append(swiperSlide);
  });

  // Navigation buttons
  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--prev', 'show-for-large');
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
  prevBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  prevBtnControl.append(prevBtn);
  swiperEl.append(prevBtnControl);

  const nextBtnControl = document.createElement('div');
  nextBtnControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--next', 'show-for-large');
  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  nextBtnControl.append(nextBtn);
  swiperEl.append(nextBtnControl);

  // Pagination
  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'campaign-carousel__swiper-pagination');
  swiperEl.append(paginationEl);

  root.append(contentWrapper);
  block.replaceChildren(root);

  // Optimize images
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Load and initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: false,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
}
