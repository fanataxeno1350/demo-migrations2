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
  const parallaxBg = document.createElement('div');
  parallaxBg.classList.add('parallax-bg', 'js-parallax-bg', 'lazyLoadedImage');
  const bgPicture = backgroundImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    parallaxBg.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
  }
  moveInstrumentation(backgroundImageRow, parallaxBg);
  root.append(parallaxBg);

  const contentWrapper = document.createElement('div');
  const headerGrid = document.createElement('div');
  headerGrid.classList.add('grid-x', 'campaign-carousel__header-grid');

  const emptyCell1 = document.createElement('div');
  emptyCell1.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell1);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cell', 'small-12', 'large-8', 'xlarge-6', 'campaign-carousel__header-wrapper');

  // Title
  const title = document.createElement('h2');
  title.classList.add('campaign-carousel__title');
  title.textContent = titleRow.textContent.trim();
  moveInstrumentation(titleRow, title);
  headerWrapper.append(title);

  // Description
  const description = document.createElement('div'); // Changed to div for richtext
  description.classList.add('campaign-carousel__description', 'bodyMediumRegular');
  description.innerHTML = descriptionRow.innerHTML; // Read innerHTML directly from row
  moveInstrumentation(descriptionRow, description);
  headerWrapper.append(description);

  headerGrid.append(headerWrapper);

  const emptyCell2 = document.createElement('div');
  emptyCell2.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell2);

  contentWrapper.append(headerGrid);

  // Swiper Container
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'campaign-carousel__swiper');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'campaign-carousel__swiper-wrapper');

  slideRows.forEach((row) => {
    const cells = [...row.children];
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    moveInstrumentation(row, slide);

    // Determine slide type based on cell count and content
    if (cells.length === 3) {
      // Quotation Slide
      slide.classList.add('campaign-carousel__swiper__quotation-slide');
      const [quoteCell, authorCell, bgImageCell] = cells;

      const campaignQuotation = document.createElement('div');
      campaignQuotation.classList.add('campaign-quotation');

      const blockquote = document.createElement('blockquote');
      blockquote.classList.add('campaign-quotation__text', 'headline-h4');
      blockquote.innerHTML = quoteCell.innerHTML;

      const quoteIconWrapper = document.createElement('span');
      quoteIconWrapper.classList.add('campaign-quotation__quote-icon-wrapper');
      quoteIconWrapper.innerHTML = '<i class="icon quote-start-brown"></i>';
      blockquote.append(quoteIconWrapper);
      campaignQuotation.append(blockquote);

      const authorLocationWrapper = document.createElement('div');
      authorLocationWrapper.classList.add('campaign-quotation__author-and-location-wrapper');
      const author = document.createElement('div');
      author.classList.add('labelSmallBold', 'campaign-quotation__author');
      author.textContent = authorCell.textContent.trim();
      authorLocationWrapper.append(author);
      campaignQuotation.append(authorLocationWrapper);

      const bgImageWrapper = document.createElement('div');
      bgImageWrapper.classList.add('campaign-quotation__background-image-wrapper');
      const picture = bgImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        bgImageWrapper.append(optimizedPic);
      }
      campaignQuotation.append(bgImageWrapper);
      slide.append(campaignQuotation);
    } else if (cells.length === 9) {
      // Recipe Card Slide
      slide.classList.add('campaign-carousel__swiper__recipe-card-slide');
      const [
        linkCell,
        imageCell,
        tagLabelCell,
        nameCell,
        descriptionCell,
        stepsCountCell,
        stepsLabelCell,
        ingredientsCountCell,
        ingredientsLabelCell,
      ] = cells;

      const link = document.createElement('a');
      link.classList.add('campaign-recipe-card', 'elevation-4');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) link.href = foundLink.href;
      link.ariaLabel = `${nameCell.textContent.trim()} - Read More`;

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-recipe-card__img-container');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imgContainer.append(optimizedPic);
      }
      link.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-recipe-card__details');

      const tagDiv = document.createElement('div');
      tagDiv.classList.add('campaign-recipe-card__tag');
      const tagInner = document.createElement('div');
      tagInner.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagLabelCell.textContent.trim();
      tagInner.append(tagLabel);
      tagDiv.append(tagInner);
      details.append(tagDiv);

      const name = document.createElement('div');
      name.classList.add('labelLargeBold', 'campaign-recipe-card__name');
      name.textContent = nameCell.textContent.trim();
      details.append(name);

      const description = document.createElement('div');
      description.classList.add('bodySmallRegular', 'campaign-recipe-card__description');
      description.textContent = descriptionCell.textContent.trim();
      details.append(description);

      const stepsAndIngredients = document.createElement('div');
      stepsAndIngredients.classList.add('campaign-recipe-card__steps-and-ingredients');

      const stepsContainer = document.createElement('div');
      stepsContainer.classList.add('campaign-recipe-card__steps-container');
      const stepsCount = document.createElement('span');
      stepsCount.classList.add('labelSmallBold', 'campaign-recipe-card__steps-count');
      stepsCount.textContent = stepsCountCell.textContent.trim();
      const stepsLabel = document.createElement('span');
      stepsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__steps-label');
      stepsLabel.textContent = stepsLabelCell.textContent.trim();
      stepsContainer.append(stepsCount, stepsLabel);
      stepsAndIngredients.append(stepsContainer);

      const separator = document.createElement('div');
      separator.classList.add('campaign-recipe-card__steps-separator');
      stepsAndIngredients.append(separator);

      const ingredientsContainer = document.createElement('div');
      ingredientsContainer.classList.add('campaign-recipe-card__ingredients-container');
      const ingredientsCount = document.createElement('span');
      ingredientsCount.classList.add('labelSmallBold', 'campaign-recipe-card__ingredients-count');
      ingredientsCount.textContent = ingredientsCountCell.textContent.trim();
      const ingredientsLabel = document.createElement('span');
      ingredientsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__ingredients-label');
      ingredientsLabel.textContent = ingredientsLabelCell.textContent.trim();
      ingredientsContainer.append(ingredientsCount, ingredientsLabel);
      stepsAndIngredients.append(ingredientsContainer);

      details.append(stepsAndIngredients);
      link.append(details);
      slide.append(link);
    } else if (cells.length === 5) {
      // Fact Card Slide
      slide.classList.add('campaign-carousel__swiper__fact-card-slide');
      const [imageCell, titleCell, descriptionCell, ctaLinkCell, ctaLabelCell] = cells;

      const campaignFactCard = document.createElement('div');
      campaignFactCard.classList.add('campaign-fact-card', 'campaign-fact', 'elevation-4', 'bg--paper-green');

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-fact-card__img-container');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '630' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imgContainer.append(optimizedPic);
      }
      campaignFactCard.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-fact-card__details');

      const name = document.createElement('div');
      name.classList.add('campaign-fact-card__name', 'utilityScriptLarge');
      name.textContent = titleCell.textContent.trim();
      details.append(name);

      const description = document.createElement('div'); // Changed to div for richtext
      description.classList.add('bodyMediumRegular', 'campaign-fact-card__description');
      description.innerHTML = descriptionCell.innerHTML; // Read innerHTML directly from cell
      details.append(description);

      const cta = document.createElement('div');
      cta.classList.add('campaign-fact-card__cta');
      const ctaLink = document.createElement('a');
      ctaLink.classList.add('link', 'link-auto', 'labelSmallBold');
      const foundCtaLink = ctaLinkCell.querySelector('a');
      if (foundCtaLink) ctaLink.href = foundCtaLink.href;
      ctaLink.title = ctaLabelCell.textContent.trim();
      ctaLink.ariaLabel = ctaLabelCell.textContent.trim();
      ctaLink.rel = 'follow';
      const ctaButtonText = document.createElement('span');
      ctaButtonText.classList.add('button-text');
      ctaButtonText.textContent = ctaLabelCell.textContent.trim();
      ctaLink.append(ctaButtonText);
      cta.append(ctaLink);
      details.append(cta);

      campaignFactCard.append(details);
      slide.append(campaignFactCard);
    }
    swiperWrapper.append(slide);
  });

  swiperEl.append(swiperWrapper);

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('campaign-carousel__btn-control', 'campaign-carousel--prev', 'show-for-large');
  prevBtn.innerHTML = `
    <button class="swiper-control swiper-button swiper--prev elevation-1" aria-label="Previous slide">
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
      </svg>
    </button>
  `;
  swiperEl.append(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('campaign-carousel__btn-control', 'campaign-carousel--next', 'show-for-large');
  nextBtn.innerHTML = `
    <button class="swiper-control swiper-button swiper--next elevation-1" aria-label="Next slide">
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
      </svg>
    </button>
  `;
  swiperEl.append(nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'campaign-carousel__swiper-pagination');
  swiperEl.append(paginationEl);

  contentWrapper.append(swiperEl);
  root.append(contentWrapper);

  block.replaceChildren(root);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: false,
    navigation: {
      prevEl: prevBtn.querySelector('button'), // Corrected to reference the button element
      nextEl: nextBtn.querySelector('button'), // Corrected to reference the button element
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 1.2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 16,
      },
      992: {
        slidesPerView: 3.2,
        spaceBetween: 16,
      },
      1200: {
        slidesPerView: 3.2,
        spaceBetween: 16,
      },
      1440: {
        slidesPerView: 3.2,
        spaceBetween: 16,
      },
    },
  });

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
