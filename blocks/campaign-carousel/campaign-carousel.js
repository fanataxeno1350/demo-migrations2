import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    backgroundImageRow,
    titleRow,
    descriptionRow,
    ...itemRows
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('grid-container', 'bg--paper-white');
  moveInstrumentation(block, root);

  // Background Image
  const parallaxBg = document.createElement('div');
  parallaxBg.classList.add('parallax-bg', 'js-parallax-bg', 'lazyLoadedImage');
  const bgPicture = backgroundImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      parallaxBg.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
    }
  }
  moveInstrumentation(backgroundImageRow, parallaxBg);
  root.append(parallaxBg);

  const contentWrapper = document.createElement('div');
  root.append(contentWrapper);

  // Header Grid
  const headerGrid = document.createElement('div');
  headerGrid.classList.add('grid-x', 'campaign-carousel__header-grid');
  contentWrapper.append(headerGrid);

  const cellLarge2Xlarge3Left = document.createElement('div');
  cellLarge2Xlarge3Left.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(cellLarge2Xlarge3Left);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cell', 'small-12', 'large-8', 'xlarge-6', 'campaign-carousel__header-wrapper');
  headerGrid.append(headerWrapper);

  // Title
  const title = document.createElement('h2');
  title.classList.add('campaign-carousel__title');
  title.textContent = titleRow.textContent.trim();
  moveInstrumentation(titleRow, title);
  headerWrapper.append(title);

  // Description
  const description = document.createElement('div'); // Fixed: was document.div
  description.classList.add('campaign-carousel__description', 'bodyMediumRegular');
  // Fixed: descriptionRow is a row, its innerHTML is "<div><p>...</p></div>".
  // Assigning to a div is fine, but if it were a <p>, it would be <p><p>...</p></p>
  description.innerHTML = descriptionRow.innerHTML;
  moveInstrumentation(descriptionRow, description);
  headerWrapper.append(description);

  const cellLarge2Xlarge3Right = document.createElement('div');
  cellLarge2Xlarge3Right.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(cellLarge2Xlarge3Right);

  // Swiper Container
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'campaign-carousel__swiper');
  contentWrapper.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'campaign-carousel__swiper-wrapper');
  swiperEl.append(swiperWrapper);

  itemRows.forEach((row) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    moveInstrumentation(row, slide);

    const cells = [...row.children];

    // Quotation Slide (3 cells)
    // Fixed: Replaced direct cells[n] access with named destructuring for fixed schema
    if (cells.length === 3 && cells[0].querySelector('p') && cells[2].querySelector('picture')) {
      const [quotationTextCell, authorCell, quotationBgImageCell] = cells;
      slide.classList.add('campaign-carousel__swiper__quotation-slide');
      const quotation = document.createElement('div');
      quotation.classList.add('campaign-quotation');
      slide.append(quotation);

      const quotationText = document.createElement('blockquote');
      quotationText.classList.add('campaign-quotation__text', 'headline-h4');
      quotationText.innerHTML = quotationTextCell.innerHTML;
      quotation.append(quotationText);

      const quoteIconWrapper = document.createElement('span');
      quoteIconWrapper.classList.add('campaign-quotation__quote-icon-wrapper');
      quoteIconWrapper.innerHTML = '<i class="icon quote-start-brown"></i>';
      quotationText.append(quoteIconWrapper);

      const authorWrapper = document.createElement('div');
      authorWrapper.classList.add('campaign-quotation__author-and-location-wrapper');
      quotation.append(authorWrapper);

      const author = document.createElement('div');
      author.classList.add('labelSmallBold', 'campaign-quotation__author');
      author.textContent = authorCell.textContent.trim();
      authorWrapper.append(author);

      const bgImageWrapper = document.createElement('div');
      bgImageWrapper.classList.add('campaign-quotation__background-image-wrapper');
      const picture = quotationBgImageCell.querySelector('picture');
      if (picture) {
        bgImageWrapper.append(picture);
      }
      quotation.append(bgImageWrapper);
    }
    // Recipe Card Slide (9 cells)
    // Fixed: Replaced direct cells[n] access with named destructuring for fixed schema
    else if (cells.length === 9 && cells[0].querySelector('a') && cells[1].querySelector('picture')) {
      const [
        recipeLinkCell,
        recipeImageCell,
        tagLabelCell,
        recipeNameCell,
        recipeDescriptionCell,
        stepsCountCell,
        stepsLabelCell,
        ingredientsCountCell,
        ingredientsLabelCell,
      ] = cells;

      slide.classList.add('campaign-carousel__swiper__recipe-card-slide');
      const link = recipeLinkCell.querySelector('a');
      const recipeCard = document.createElement('a');
      recipeCard.classList.add('campaign-recipe-card', 'elevation-4');
      if (link) {
        recipeCard.href = link.href;
        recipeCard.setAttribute('aria-label', `${recipeNameCell.textContent.trim()} - Read More`);
      }
      slide.append(recipeCard);

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-recipe-card__img-container');
      const picture = recipeImageCell.querySelector('picture');
      if (picture) {
        imgContainer.append(picture);
      }
      recipeCard.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-recipe-card__details');
      recipeCard.append(details);

      const tag = document.createElement('div');
      tag.classList.add('campaign-recipe-card__tag');
      details.append(tag);

      const tagDiv = document.createElement('div');
      tagDiv.classList.add('tag', 'bg--brand-green');
      tag.append(tagDiv);

      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagLabelCell.textContent.trim();
      tagDiv.append(tagLabel);

      const name = document.createElement('div');
      name.classList.add('labelLargeBold', 'campaign-recipe-card__name');
      name.textContent = recipeNameCell.textContent.trim();
      details.append(name);

      const description = document.createElement('div');
      description.classList.add('bodySmallRegular', 'campaign-recipe-card__description');
      description.innerHTML = recipeDescriptionCell.innerHTML;
      details.append(description);

      const stepsAndIngredients = document.createElement('div');
      stepsAndIngredients.classList.add('campaign-recipe-card__steps-and-ingredients');
      details.append(stepsAndIngredients);

      const stepsContainer = document.createElement('div');
      stepsContainer.classList.add('campaign-recipe-card__steps-container');
      stepsAndIngredients.append(stepsContainer);

      const stepsCount = document.createElement('span');
      stepsCount.classList.add('labelSmallBold', 'campaign-recipe-card__steps-count');
      stepsCount.textContent = stepsCountCell.textContent.trim();
      stepsContainer.append(stepsCount);

      const stepsLabel = document.createElement('span');
      stepsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__steps-label');
      stepsLabel.textContent = stepsLabelCell.textContent.trim();
      stepsContainer.append(stepsLabel);

      const separator = document.createElement('div');
      separator.classList.add('campaign-recipe-card__steps-separator');
      stepsAndIngredients.append(separator);

      const ingredientsContainer = document.createElement('div');
      ingredientsContainer.classList.add('campaign-recipe-card__ingredients-container');
      stepsAndIngredients.append(ingredientsContainer);

      const ingredientsCount = document.createElement('span');
      ingredientsCount.classList.add('labelSmallBold', 'campaign-recipe-card__ingredients-count');
      ingredientsCount.textContent = ingredientsCountCell.textContent.trim();
      ingredientsContainer.append(ingredientsCount);

      const ingredientsLabel = document.createElement('span');
      ingredientsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__ingredients-label');
      ingredientsLabel.textContent = ingredientsLabelCell.textContent.trim();
      ingredientsContainer.append(ingredientsLabel);
    }
    // Fact Card Slide (5 cells)
    // Fixed: Replaced direct cells[n] access with named destructuring for fixed schema
    else if (cells.length === 5 && cells[0].querySelector('picture') && cells[3].querySelector('a')) {
      const [
        factCardImageCell,
        factCardNameCell,
        factCardDescriptionCell,
        ctaLinkCell,
        ctaLabelCell,
      ] = cells;

      slide.classList.add('campaign-carousel__swiper__fact-card-slide');
      const factCard = document.createElement('div');
      factCard.classList.add('campaign-fact-card', 'campaign-fact', 'elevation-4');
      // Adding specific background classes based on content or position if needed,
      // for now, using a generic one from original HTML
      factCard.classList.add('bg--paper-green');
      slide.append(factCard);

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-fact-card__img-container');
      const picture = factCardImageCell.querySelector('picture');
      if (picture) {
        imgContainer.append(picture);
      }
      factCard.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-fact-card__details');
      factCard.append(details);

      const name = document.createElement('div');
      name.classList.add('campaign-fact-card__name', 'utilityScriptLarge');
      name.textContent = factCardNameCell.textContent.trim();
      details.append(name);

      const description = document.createElement('div');
      description.classList.add('bodyMediumRegular', 'campaign-fact-card__description');
      description.innerHTML = factCardDescriptionCell.innerHTML;
      details.append(description);

      const cta = document.createElement('div');
      cta.classList.add('campaign-fact-card__cta');
      details.append(cta);

      const ctaLink = document.createElement('a');
      ctaLink.classList.add('link', 'link-auto', 'labelSmallBold');
      const link = ctaLinkCell.querySelector('a');
      if (link) {
        ctaLink.href = link.href;
        ctaLink.setAttribute('aria-label', ctaLabelCell.textContent.trim());
      }
      const span = document.createElement('span');
      span.classList.add('button-text');
      span.textContent = ctaLabelCell.textContent.trim();
      ctaLink.append(span);
      cta.append(ctaLink);
    }
    swiperWrapper.append(slide);
  });

  // Swiper Navigation Buttons
  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--prev', 'show-for-large');
  swiperEl.append(prevBtnControl);

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
  prevBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>`;
  prevBtnControl.append(prevBtn);

  const nextBtnControl = document.createElement('div');
  nextBtnControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--next', 'show-for-large');
  swiperEl.append(nextBtnControl);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>`;
  nextBtnControl.append(nextBtn);

  // Swiper Pagination
  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'campaign-carousel__swiper-pagination');
  swiperEl.append(paginationEl);

  block.replaceChildren(root);

  // Optimize images
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Load Swiper and initialize
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
      576: { slidesPerView: 1 }, // Default to 1 for mobile
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 3 }, // Adjust as per design
    },
  });
}
