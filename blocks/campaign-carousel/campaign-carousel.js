import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    bgImageRow,
    titleRow,
    descriptionRow,
    quotationSlidesContainer, // This is a container row, not an item row.
    recipeCardSlidesContainer, // This is a container row, not an item row.
    factCardSlidesContainer, // This is a container row, not an item row.
    ...itemRows
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('campaign-carousel', 'grid-container', 'bg--paper-white');
  moveInstrumentation(block, section);

  // Background Image
  const parallaxBg = document.createElement('div');
  parallaxBg.classList.add('parallax-bg', 'js-parallax-bg', 'lazyLoadedImage');
  const bgPicture = bgImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) {
      parallaxBg.style.backgroundImage = `url(${img.src})`;
      // Optimized picture for parallax background
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(bgImageRow, optimizedPic.querySelector('img'));
      // The original HTML sets background-image directly, so we just need the src.
      // We don't append the picture itself to the parallaxBg div.
    }
  }
  section.append(parallaxBg);

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

  const title = document.createElement('h2');
  title.classList.add('campaign-carousel__title');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  headerWrapper.append(title);

  const description = document.createElement('div'); // Use div for richtext
  description.classList.add('campaign-carousel__description', 'bodyMediumRegular');
  moveInstrumentation(descriptionRow, description);
  // Fix: descriptionRow is a row, not a cell. Read from its first child (the cell).
  description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  headerWrapper.append(description);

  const emptyCell2 = document.createElement('div');
  emptyCell2.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell2);

  // Swiper setup
  const swiperEl = document.createElement('div');
  // Removed swiper-initialized, swiper-horizontal, swiper-backface-hidden as Swiper adds them
  swiperEl.classList.add('swiper', 'campaign-carousel__swiper');
  contentWrapper.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'campaign-carousel__swiper-wrapper');
  swiperEl.append(swiperWrapper);

  // Consume container rows for instrumentation
  // These are not rendered directly, but their instrumentation needs to be moved
  // to ensure the block is fully instrumented.
  moveInstrumentation(quotationSlidesContainer, swiperWrapper); // Move to a parent that will contain its items
  moveInstrumentation(recipeCardSlidesContainer, swiperWrapper); // Move to a parent that will contain its items
  moveInstrumentation(factCardSlidesContainer, swiperWrapper); // Move to a parent that will contain its items

  itemRows
    .filter(row => row.children.length > 0 && [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      moveInstrumentation(row, slide); // Move instrumentation for each item row

      if (row.children.length === 3) { // quotation-slide
        slide.classList.add('campaign-carousel__swiper__quotation-slide');
        const [quoteTextCell, authorCell, bgImageCell] = [...row.children];

        const campaignQuotation = document.createElement('div');
        campaignQuotation.classList.add('campaign-quotation');

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
        author.textContent = authorCell?.textContent.trim() || '';
        authorWrapper.append(author);
        campaignQuotation.append(authorWrapper);

        const bgImgWrapper = document.createElement('div');
        bgImgWrapper.classList.add('campaign-quotation__background-image-wrapper');
        const picture = bgImageCell?.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(bgImageCell, optimizedPic.querySelector('img'));
          bgImgWrapper.append(optimizedPic);
        }
        campaignQuotation.append(bgImgWrapper);
        slide.append(campaignQuotation);
      } else if (row.children.length === 9) { // recipe-card-slide
        slide.classList.add('campaign-carousel__swiper__recipe-card-slide');
        const [
          imageCell,
          tagCell,
          nameCell,
          descriptionCell,
          stepsCountCell,
          stepsLabelCell,
          ingredientsCountCell,
          ingredientsLabelCell,
          linkCell,
        ] = [...row.children];

        const recipeCardLink = document.createElement('a');
        recipeCardLink.classList.add('campaign-recipe-card', 'elevation-4');
        const foundLink = linkCell?.querySelector('a');
        if (foundLink) {
          recipeCardLink.href = foundLink.href;
          recipeCardLink.setAttribute('aria-label', `${nameCell?.textContent.trim() || 'Recipe'} - Read More`);
        }

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('campaign-recipe-card__img-container');
        const picture = imageCell?.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '566' }]);
          moveInstrumentation(imageCell, optimizedPic.querySelector('img'));
          imgContainer.append(optimizedPic);
        }
        recipeCardLink.append(imgContainer);

        const details = document.createElement('div');
        details.classList.add('campaign-recipe-card__details');

        const tagWrapper = document.createElement('div');
        tagWrapper.classList.add('campaign-recipe-card__tag');
        const tagDiv = document.createElement('div');
        tagDiv.classList.add('tag', 'bg--brand-green');
        const tagSpan = document.createElement('span');
        tagSpan.classList.add('tag__label');
        tagSpan.textContent = tagCell?.textContent.trim() || '';
        tagDiv.append(tagSpan);
        tagWrapper.append(tagDiv);
        details.append(tagWrapper);

        const name = document.createElement('div');
        name.classList.add('labelLargeBold', 'campaign-recipe-card__name');
        name.textContent = nameCell?.textContent.trim() || '';
        details.append(name);

        const description = document.createElement('div'); // Use div for richtext
        description.classList.add('bodySmallRegular', 'campaign-recipe-card__description');
        description.innerHTML = descriptionCell?.innerHTML || '';
        details.append(description);

        const stepsAndIngredients = document.createElement('div');
        stepsAndIngredients.classList.add('campaign-recipe-card__steps-and-ingredients');

        const stepsContainer = document.createElement('div');
        stepsContainer.classList.add('campaign-recipe-card__steps-container');
        const stepsCount = document.createElement('span');
        stepsCount.classList.add('labelSmallBold', 'campaign-recipe-card__steps-count');
        stepsCount.textContent = stepsCountCell?.textContent.trim() || '';
        const stepsLabel = document.createElement('span');
        stepsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__steps-label');
        stepsLabel.textContent = stepsLabelCell?.textContent.trim() || '';
        stepsContainer.append(stepsCount, stepsLabel);
        stepsAndIngredients.append(stepsContainer);

        const separator = document.createElement('div');
        separator.classList.add('campaign-recipe-card__steps-separator');
        stepsAndIngredients.append(separator);

        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.add('campaign-recipe-card__ingredients-container');
        const ingredientsCount = document.createElement('span');
        ingredientsCount.classList.add('labelSmallBold', 'campaign-recipe-card__ingredients-count');
        ingredientsCount.textContent = ingredientsCountCell?.textContent.trim() || '';
        const ingredientsLabel = document.createElement('span');
        ingredientsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__ingredients-label');
        ingredientsLabel.textContent = ingredientsLabelCell?.textContent.trim() || '';
        ingredientsContainer.append(ingredientsCount, ingredientsLabel);
        stepsAndIngredients.append(ingredientsContainer);

        details.append(stepsAndIngredients);
        recipeCardLink.append(details);
        slide.append(recipeCardLink);
      } else if (row.children.length === 5) { // fact-card-slide
        slide.classList.add('campaign-carousel__swiper__fact-card-slide');
        const [imageCell, nameCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

        const factCard = document.createElement('div');
        factCard.classList.add('campaign-fact-card', 'campaign-fact', 'elevation-4');
        if (row.classList.contains('campaign-make-difference')) { // Check for specific class from original HTML
          factCard.classList.add('campaign-make-difference', 'bg--paper-brown');
        } else {
          factCard.classList.add('bg--paper-green');
        }

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('campaign-fact-card__img-container');
        const picture = imageCell?.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '630' }]);
          moveInstrumentation(imageCell, optimizedPic.querySelector('img'));
          imgContainer.append(optimizedPic);
        }
        factCard.append(imgContainer);

        const details = document.createElement('div');
        details.classList.add('campaign-fact-card__details');

        const name = document.createElement('div');
        name.classList.add('campaign-fact-card__name', 'utilityScriptLarge');
        name.textContent = nameCell?.textContent.trim() || '';
        details.append(name);

        const description = document.createElement('div'); // Use div for richtext
        description.classList.add('bodyMediumRegular', 'campaign-fact-card__description');
        description.innerHTML = descriptionCell?.innerHTML || '';
        details.append(description);

        const ctaWrapper = document.createElement('div');
        ctaWrapper.classList.add('campaign-fact-card__cta');
        const ctaLink = document.createElement('a');
        ctaLink.classList.add('link', 'link-auto', 'labelSmallBold');
        const foundLink = ctaLinkCell?.querySelector('a');
        if (foundLink) {
          ctaLink.href = foundLink.href;
          ctaLink.setAttribute('title', ctaLabelCell?.textContent.trim() || '');
          ctaLink.setAttribute('aria-label', ctaLabelCell?.textContent.trim() || '');
          ctaLink.setAttribute('rel', 'follow');
        }
        const ctaSpan = document.createElement('span');
        ctaSpan.classList.add('button-text');
        ctaSpan.textContent = ctaLabelCell?.textContent.trim() || '';
        ctaLink.append(ctaSpan);
        ctaWrapper.append(ctaLink);
        details.append(ctaWrapper);

        factCard.append(details);
        slide.append(factCard);
      }
      swiperWrapper.append(slide);
    });

  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--prev', 'show-for-large');
  const prevBtn = document.createElement('button');
  // Removed swiper-button-disabled, swiper-button-lock as Swiper adds them
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
  prevBtn.setAttribute('aria-label', 'Previous slide');
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
  // Removed swiper-button-disabled, swiper-button-lock as Swiper adds them
  nextBtn.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  nextBtnControl.append(nextBtn);
  swiperEl.append(nextBtnControl);

  const paginationEl = document.createElement('div');
  // Removed swiper-pagination-clickable, swiper-pagination-bullets, swiper-pagination-horizontal, swiper-pagination-lock as Swiper adds them
  paginationEl.classList.add('swiper-pagination', 'campaign-carousel__swiper-pagination');
  swiperEl.append(paginationEl);

  section.append(contentWrapper);
  block.replaceChildren(section);

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
      576: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}
