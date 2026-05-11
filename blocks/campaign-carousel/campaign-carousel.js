import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    bgImageRow,
    titleRow,
    descriptionRow,
    quotationSlidesContainer,
    recipeSlidesContainer,
    factSlidesContainer,
    ...itemRows
  ] = [...block.children];

  const root = document.createElement('section');
  root.classList.add('campaign-carousel', 'grid-container', 'bg--paper-white');

  // Background Image
<<<<<<< Updated upstream
  const backgroundImageCell = backgroundImageRow.children[0];
  const parallaxBg = document.createElement('div');
  parallaxBg.classList.add('parallax-bg', 'js-parallax-bg', 'lazyLoadedImage');
  if (backgroundImageCell) {
    const picture = backgroundImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        parallaxBg.style.backgroundImage = `url(${img.src})`;
      }
      moveInstrumentation(backgroundImageCell, parallaxBg);
=======
  const parallaxBg = document.createElement('div');
  parallaxBg.classList.add('parallax-bg', 'js-parallax-bg', 'lazyLoadedImage');
  const bgPicture = bgImageRow.querySelector('picture');
  if (bgPicture) {
    const bgImg = bgPicture.querySelector('img');
    if (bgImg) {
      parallaxBg.style.backgroundImage = `url(${bgImg.src})`;
      moveInstrumentation(bgImageRow, parallaxBg);
>>>>>>> Stashed changes
    }
  }
  root.append(parallaxBg);

  const contentWrapper = document.createElement('div');
<<<<<<< Updated upstream
=======
  root.append(contentWrapper);

>>>>>>> Stashed changes
  const headerGrid = document.createElement('div');
  headerGrid.classList.add('grid-x', 'campaign-carousel__header-grid');
  contentWrapper.append(headerGrid);

  const emptyCell1 = document.createElement('div');
  emptyCell1.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell1);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('cell', 'small-12', 'large-8', 'xlarge-6', 'campaign-carousel__header-wrapper');
  headerGrid.append(headerWrapper);

<<<<<<< Updated upstream
  const emptyCell2 = document.createElement('div');
  emptyCell2.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell2);

  // Title
  const titleCell = titleRow.children[0];
  if (titleCell) {
    const title = document.createElement('h2');
    title.classList.add('campaign-carousel__title');
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, title);
    headerWrapper.append(title);
  }

  // Description
  const descriptionCell = descriptionRow.children[0];
  if (descriptionCell) {
    const description = document.createElement('div');
    description.classList.add('campaign-carousel__description', 'bodyMediumRegular');
    description.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, description);
    headerWrapper.append(description);
  }

  // Swiper setup
=======
  // Title
  const title = document.createElement('h2');
  title.classList.add('campaign-carousel__title');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  headerWrapper.append(title);

  // Description
  const description = document.createElement('div'); // Use div for richtext
  description.classList.add('campaign-carousel__description', 'bodyMediumRegular');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Correctly read from cell, not row
  headerWrapper.append(description);

  const emptyCell2 = document.createElement('div');
  emptyCell2.classList.add('cell', 'large-2', 'xlarge-3');
  headerGrid.append(emptyCell2);

  // Swiper Carousel
>>>>>>> Stashed changes
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'campaign-carousel__swiper');
  contentWrapper.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper', 'campaign-carousel__swiper-wrapper');
  swiperEl.append(swiperWrapper);

<<<<<<< Updated upstream
  // Move instrumentation for container placeholders
  // These are not rendered directly, but their instrumentation needs to be moved
  // to ensure Universal Editor works correctly. We can move it to a dummy element
  // or the root if they don't have a direct rendered counterpart.
  // For now, moving to a dummy div to ensure they are tracked.
  const quotationSlidesWrapper = document.createElement('div');
  moveInstrumentation(quotationSlidesContainer, quotationSlidesWrapper);
  const recipeCardSlidesWrapper = document.createElement('div');
  moveInstrumentation(recipeCardSlidesContainer, recipeCardSlidesWrapper);
  const factCardSlidesWrapper = document.createElement('div');
  moveInstrumentation(factCardSlidesContainer, factCardSlidesWrapper);


  itemRows.forEach((row) => {
    const cells = [...row.children];
    let slideContent;
    let slideClass;

    if (cells.length === 3) {
      // Quotation Slide Item
      const [quotationCell, authorCell, backgroundImageCellItem] = cells;
      slideClass = 'campaign-carousel__swiper__quotation-slide';
      slideContent = document.createElement('div');
      slideContent.classList.add('campaign-quotation');

      const blockquote = document.createElement('blockquote');
      blockquote.classList.add('campaign-quotation__text', 'headline-h4');
      if (quotationCell) {
        blockquote.innerHTML = quotationCell.innerHTML;
        moveInstrumentation(quotationCell, blockquote);
      }

      const quoteIconWrapper = document.createElement('span');
      quoteIconWrapper.classList.add('campaign-quotation__quote-icon-wrapper');
      const icon = document.createElement('i');
      icon.classList.add('icon', 'quote-start-brown');
      quoteIconWrapper.append(icon);
      blockquote.append(quoteIconWrapper);
      slideContent.append(blockquote);

      const authorLocationWrapper = document.createElement('div');
      authorLocationWrapper.classList.add('campaign-quotation__author-and-location-wrapper');
      if (authorCell) {
        const author = document.createElement('div');
        author.classList.add('labelSmallBold', 'campaign-quotation__author');
        author.textContent = authorCell.textContent.trim();
        moveInstrumentation(authorCell, author);
        authorLocationWrapper.append(author);
      }
      slideContent.append(authorLocationWrapper);

      const backgroundImageWrapper = document.createElement('div');
      backgroundImageWrapper.classList.add('campaign-quotation__background-image-wrapper');
      if (backgroundImageCellItem) {
        const picture = backgroundImageCellItem.querySelector('picture');
        if (picture) {
          // moveInstrumentation should be on the picture element, not the img inside.
          // createOptimizedPicture replaces the picture, so instrumentation needs to be moved to the new picture.
          const optimizedPic = createOptimizedPicture(
            picture.querySelector('img').src,
            picture.querySelector('img').alt,
            false,
            [{ width: '750' }],
          );
          moveInstrumentation(backgroundImageCellItem, optimizedPic); // Move to the new picture element
          backgroundImageWrapper.append(optimizedPic);
        }
      }
      slideContent.append(backgroundImageWrapper);
    } else if (cells.length === 9) {
      // Recipe Card Slide Item
      const [
        linkCell,
        imageCell,
        tagCell,
        nameCell,
        descriptionCellItem,
        stepsCountCell,
        stepsLabelCell,
        ingredientsCountCell,
        ingredientsLabelCell,
      ] = cells;
      slideClass = 'campaign-carousel__swiper__recipe-card-slide';
      slideContent = document.createElement('a');
      slideContent.classList.add('campaign-recipe-card', 'elevation-4');
      const link = linkCell?.querySelector('a');
      if (link) {
        slideContent.href = link.href;
        slideContent.setAttribute('aria-label', `${nameCell?.textContent.trim() || ''} - Read More`);
        moveInstrumentation(linkCell, slideContent);
      }

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-recipe-card__img-container');
      if (imageCell) {
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const optimizedPic = createOptimizedPicture(
            picture.querySelector('img').src,
            picture.querySelector('img').alt,
            false,
            [{ width: '750' }],
          );
          moveInstrumentation(imageCell, optimizedPic); // Move to the new picture element
          imgContainer.append(optimizedPic);
        }
      }
      slideContent.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-recipe-card__details');

      if (tagCell) {
        const tagWrapper = document.createElement('div');
        tagWrapper.classList.add('campaign-recipe-card__tag');
        const tag = document.createElement('div');
        tag.classList.add('tag', 'bg--brand-green');
        const tagLabel = document.createElement('span');
        tagLabel.classList.add('tag__label');
        tagLabel.textContent = tagCell.textContent.trim();
        tag.append(tagLabel);
        tagWrapper.append(tag);
        moveInstrumentation(tagCell, tagWrapper);
        details.append(tagWrapper);
      }

      if (nameCell) {
        const name = document.createElement('div');
        name.classList.add('labelLargeBold', 'campaign-recipe-card__name');
        name.textContent = nameCell.textContent.trim();
        moveInstrumentation(nameCell, name);
        details.append(name);
      }

      if (descriptionCellItem) {
        const description = document.createElement('div');
        description.classList.add('bodySmallRegular', 'campaign-recipe-card__description');
        description.textContent = descriptionCellItem.textContent.trim();
        moveInstrumentation(descriptionCellItem, description);
        details.append(description);
      }

      const stepsAndIngredients = document.createElement('div');
      stepsAndIngredients.classList.add('campaign-recipe-card__steps-and-ingredients');

      if (stepsCountCell || stepsLabelCell) {
        const stepsContainer = document.createElement('div');
        stepsContainer.classList.add('campaign-recipe-card__steps-container');
        const stepsCount = document.createElement('span');
        stepsCount.classList.add('labelSmallBold', 'campaign-recipe-card__steps-count');
        stepsCount.textContent = stepsCountCell?.textContent.trim() || '';
        const stepsLabel = document.createElement('span');
        stepsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__steps-label');
        stepsLabel.textContent = stepsLabelCell?.textContent.trim() || '';
        stepsContainer.append(stepsCount, stepsLabel);
        moveInstrumentation(stepsCountCell || stepsLabelCell, stepsContainer);
        stepsAndIngredients.append(stepsContainer);
      }

      const separator = document.createElement('div');
      separator.classList.add('campaign-recipe-card__steps-separator');
      stepsAndIngredients.append(separator);

      if (ingredientsCountCell || ingredientsLabelCell) {
        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.add('campaign-recipe-card__ingredients-container');
        const ingredientsCount = document.createElement('span');
        ingredientsCount.classList.add('labelSmallBold', 'campaign-recipe-card__ingredients-count');
        ingredientsCount.textContent = ingredientsCountCell?.textContent.trim() || '';
        const ingredientsLabel = document.createElement('span');
        ingredientsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__ingredients-label');
        ingredientsLabel.textContent = ingredientsLabelCell?.textContent.trim() || '';
        ingredientsContainer.append(ingredientsCount, ingredientsLabel);
        moveInstrumentation(ingredientsCountCell || ingredientsLabelCell, ingredientsContainer);
        stepsAndIngredients.append(ingredientsContainer);
      }
      details.append(stepsAndIngredients);
      slideContent.append(details);
    } else if (cells.length === 5) {
      // Fact Card Slide Item
      const [imageCell, nameCell, descriptionCellItem, ctaLinkCell, ctaLabelCell] = cells;
      slideClass = 'campaign-carousel__swiper__fact-card-slide';
      slideContent = document.createElement('div');
      slideContent.classList.add('campaign-fact-card', 'campaign-fact', 'elevation-4', 'bg--paper-green');

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('campaign-fact-card__img-container');
      if (imageCell) {
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const optimizedPic = createOptimizedPicture(
            picture.querySelector('img').src,
            picture.querySelector('img').alt,
            false,
            [{ width: '750' }],
          );
          moveInstrumentation(imageCell, optimizedPic); // Move to the new picture element
          imgContainer.append(optimizedPic);
        }
      }
      slideContent.append(imgContainer);

      const details = document.createElement('div');
      details.classList.add('campaign-fact-card__details');

      if (nameCell) {
        const name = document.createElement('div');
        name.classList.add('campaign-fact-card__name', 'utilityScriptLarge');
        name.textContent = nameCell.textContent.trim();
        moveInstrumentation(nameCell, name);
        details.append(name);
      }

      if (descriptionCellItem) {
        const description = document.createElement('div');
        description.classList.add('bodyMediumRegular', 'campaign-fact-card__description');
        description.innerHTML = descriptionCellItem.innerHTML;
        moveInstrumentation(descriptionCellItem, description);
        details.append(description);
      }

      if (ctaLinkCell || ctaLabelCell) {
        const ctaWrapper = document.createElement('div');
        ctaWrapper.classList.add('campaign-fact-card__cta');
        const ctaLink = document.createElement('a');
        ctaLink.classList.add('link', 'link-auto', 'labelSmallBold');
        const link = ctaLinkCell?.querySelector('a');
        if (link) {
          ctaLink.href = link.href;
          moveInstrumentation(ctaLinkCell, ctaLink);
        }
        ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';
        ctaWrapper.append(ctaLink);
        details.append(ctaWrapper);
      }
      slideContent.append(details);
    }

    if (slideContent) {
      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide', slideClass);
      moveInstrumentation(row, swiperSlide);
      swiperSlide.append(slideContent);
      swiperWrapper.append(swiperSlide);
    }
  });

  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--prev', 'show-for-large');
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
=======
  // Consume container placeholders
  moveInstrumentation(quotationSlidesContainer, swiperWrapper);
  moveInstrumentation(recipeSlidesContainer, swiperWrapper);
  moveInstrumentation(factSlidesContainer, swiperWrapper);

  itemRows
    .filter(row => row.children.length > 0 && [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const cells = [...row.children];
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');

      if (cells.length === 3) { // campaign-quotation-item
        slide.classList.add('campaign-carousel__swiper__quotation-slide');
        const [quoteCell, authorCell, quoteBgImageCell] = cells;

        const campaignQuotation = document.createElement('div');
        campaignQuotation.classList.add('campaign-quotation');
        moveInstrumentation(row, campaignQuotation);
        slide.append(campaignQuotation);

        const blockquote = document.createElement('blockquote');
        blockquote.classList.add('campaign-quotation__text', 'headline-h4');
        blockquote.innerHTML = quoteCell?.innerHTML || '';
        campaignQuotation.append(blockquote);

        const quoteIconWrapper = document.createElement('span');
        quoteIconWrapper.classList.add('campaign-quotation__quote-icon-wrapper');
        quoteIconWrapper.innerHTML = '<i class="icon quote-start-brown"></i>';
        blockquote.append(quoteIconWrapper);

        const authorLocationWrapper = document.createElement('div');
        authorLocationWrapper.classList.add('campaign-quotation__author-and-location-wrapper');
        campaignQuotation.append(authorLocationWrapper);

        const author = document.createElement('div');
        author.classList.add('labelSmallBold', 'campaign-quotation__author');
        author.textContent = authorCell?.textContent.trim() || '';
        authorLocationWrapper.append(author);

        const backgroundImageWrapper = document.createElement('div');
        backgroundImageWrapper.classList.add('campaign-quotation__background-image-wrapper');
        campaignQuotation.append(backgroundImageWrapper);

        const quoteBgPicture = quoteBgImageCell?.querySelector('picture');
        if (quoteBgPicture) {
          backgroundImageWrapper.append(quoteBgPicture);
          quoteBgPicture.querySelectorAll('img').forEach((img) => {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            img.closest('picture').replaceWith(optimizedPic);
          });
        }
      } else if (cells.length === 9) { // campaign-recipe-card-item
        slide.classList.add('campaign-carousel__swiper__recipe-card-slide');
        const [
          linkCell,
          imageCell,
          tagCell,
          nameCell,
          descriptionCell,
          stepsCountCell,
          stepsLabelCell,
          ingredientsCountCell,
          ingredientsLabelCell,
        ] = cells;

        const recipeLink = document.createElement('a');
        recipeLink.classList.add('campaign-recipe-card', 'elevation-4');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          recipeLink.href = foundLink.href;
          recipeLink.setAttribute('aria-label', `${nameCell?.textContent.trim() || ''} - Read More`);
        }
        moveInstrumentation(row, recipeLink);
        slide.append(recipeLink);

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('campaign-recipe-card__img-container');
        recipeLink.append(imgContainer);

        const recipePicture = imageCell?.querySelector('picture');
        if (recipePicture) {
          imgContainer.append(recipePicture);
          recipePicture.querySelectorAll('img').forEach((img) => {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            img.closest('picture').replaceWith(optimizedPic);
          });
        }

        const details = document.createElement('div');
        details.classList.add('campaign-recipe-card__details');
        recipeLink.append(details);

        const tagWrapper = document.createElement('div');
        tagWrapper.classList.add('campaign-recipe-card__tag');
        details.append(tagWrapper);

        const tag = document.createElement('div');
        tag.classList.add('tag', 'bg--brand-green');
        tagWrapper.append(tag);

        const tagLabel = document.createElement('span');
        tagLabel.classList.add('tag__label');
        tagLabel.textContent = tagCell?.textContent.trim() || '';
        tag.append(tagLabel);

        const name = document.createElement('div');
        name.classList.add('labelLargeBold', 'campaign-recipe-card__name');
        name.textContent = nameCell?.textContent.trim() || '';
        details.append(name);

        const recipeDescription = document.createElement('div');
        recipeDescription.classList.add('bodySmallRegular', 'campaign-recipe-card__description');
        recipeDescription.textContent = descriptionCell?.textContent.trim() || '';
        details.append(recipeDescription);

        const stepsAndIngredients = document.createElement('div');
        stepsAndIngredients.classList.add('campaign-recipe-card__steps-and-ingredients');
        details.append(stepsAndIngredients);

        const stepsContainer = document.createElement('div');
        stepsContainer.classList.add('campaign-recipe-card__steps-container');
        stepsAndIngredients.append(stepsContainer);

        const stepsCount = document.createElement('span');
        stepsCount.classList.add('labelSmallBold', 'campaign-recipe-card__steps-count');
        stepsCount.textContent = stepsCountCell?.textContent.trim() || '';
        stepsContainer.append(stepsCount);

        const stepsLabel = document.createElement('span');
        stepsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__steps-label');
        stepsLabel.textContent = stepsLabelCell?.textContent.trim() || '';
        stepsContainer.append(stepsLabel);

        const separator = document.createElement('div');
        separator.classList.add('campaign-recipe-card__steps-separator');
        stepsAndIngredients.append(separator);

        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.add('campaign-recipe-card__ingredients-container');
        stepsAndIngredients.append(ingredientsContainer);

        const ingredientsCount = document.createElement('span');
        ingredientsCount.classList.add('labelSmallBold', 'campaign-recipe-card__ingredients-count');
        ingredientsCount.textContent = ingredientsCountCell?.textContent.trim() || '';
        ingredientsContainer.append(ingredientsCount);

        const ingredientsLabel = document.createElement('span');
        ingredientsLabel.classList.add('utilityTagHighCaps', 'campaign-recipe-card__ingredients-label');
        ingredientsLabel.textContent = ingredientsLabelCell?.textContent.trim() || '';
        ingredientsContainer.append(ingredientsLabel);
      } else if (cells.length === 5) { // campaign-fact-card-item
        slide.classList.add('campaign-carousel__swiper__fact-card-slide');
        const [imageCell, nameCell, descriptionCell, ctaLinkCell, ctaLabelCell] = cells;

        const factCard = document.createElement('div');
        factCard.classList.add('campaign-fact-card', 'campaign-fact', 'elevation-4');
        factCard.classList.add('bg--paper-green'); // Default color
        // Check for 'campaign-make-difference' class in original HTML for specific color
        if (row.classList.contains('campaign-make-difference')) {
          factCard.classList.remove('bg--paper-green');
          factCard.classList.add('campaign-make-difference', 'bg--paper-brown');
        }
        moveInstrumentation(row, factCard);
        slide.append(factCard);

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('campaign-fact-card__img-container');
        factCard.append(imgContainer);

        const factPicture = imageCell?.querySelector('picture');
        if (factPicture) {
          imgContainer.append(factPicture);
          factPicture.querySelectorAll('img').forEach((img) => {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            img.closest('picture').replaceWith(optimizedPic);
          });
        }

        const details = document.createElement('div');
        details.classList.add('campaign-fact-card__details');
        factCard.append(details);

        const name = document.createElement('div');
        name.classList.add('campaign-fact-card__name', 'utilityScriptLarge');
        name.textContent = nameCell?.textContent.trim() || '';
        details.append(name);

        const factDescription = document.createElement('div');
        factDescription.classList.add('bodyMediumRegular', 'campaign-fact-card__description');
        factDescription.innerHTML = descriptionCell?.innerHTML || '';
        details.append(factDescription);

        const cta = document.createElement('div');
        cta.classList.add('campaign-fact-card__cta');
        details.append(cta);

        const ctaAnchor = document.createElement('a');
        ctaAnchor.classList.add('link', 'link-auto', 'labelSmallBold');
        const foundCtaLink = ctaLinkCell.querySelector('a');
        if (foundCtaLink) {
          ctaAnchor.href = foundCtaLink.href;
          ctaAnchor.title = ctaLabelCell?.textContent.trim() || '';
          ctaAnchor.setAttribute('aria-label', ctaLabelCell?.textContent.trim() || '');
        }
        const ctaSpan = document.createElement('span');
        ctaSpan.classList.add('button-text');
        ctaSpan.textContent = ctaLabelCell?.textContent.trim() || '';
        ctaAnchor.append(ctaSpan);
        cta.append(ctaAnchor);
      }
      swiperWrapper.append(slide);
    });

  // Swiper navigation buttons
  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--prev', 'show-for-large');
  swiperEl.append(prevBtnControl);

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
  prevBtn.setAttribute('aria-label', 'Previous slide');
>>>>>>> Stashed changes
  prevBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  prevBtnControl.append(prevBtn);
<<<<<<< Updated upstream
  swiperEl.append(prevBtnControl);

  const nextBtnControl = document.createElement('div');
  nextBtnControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--next', 'show-for-large');
  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
=======

  const nextBtnControl = document.createElement('div');
  nextBtnControl.classList.add('campaign-carousel__btn-control', 'campaign-carousel--next', 'show-for-large');
  swiperEl.append(nextBtnControl);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
  nextBtn.setAttribute('aria-label', 'Next slide');
>>>>>>> Stashed changes
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  nextBtnControl.append(nextBtn);
<<<<<<< Updated upstream
  swiperEl.append(nextBtnControl);
=======
>>>>>>> Stashed changes

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'campaign-carousel__swiper-pagination');
  swiperEl.append(paginationEl);

<<<<<<< Updated upstream
  root.append(contentWrapper);
  block.replaceChildren(root);

  // Swiper initialization
=======
  block.replaceChildren(root);

  // Initialize Swiper
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      576: { slidesPerView: 1 }, // Default for small screens
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 3 },
    },
  });

  // This part is for optimizing pictures that might be directly in the block,
  // but the current code already handles pictures within the slide items.
  // If there are other pictures outside the slides that need optimization,
  // this loop should be adjusted to target them specifically.
  // For now, it's fine as a general post-processing step if needed.
  root.querySelectorAll('picture > img').forEach((img) => {
    // Ensure moveInstrumentation is called on the original picture element
    // before it's replaced, and then on the new optimized picture.
    const originalPicture = img.closest('picture');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    if (originalPicture) {
      moveInstrumentation(originalPicture, optimizedPic); // Move instrumentation from old picture to new
      originalPicture.replaceWith(optimizedPic);
    }
  });
=======
      576: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 3 },
      1440: { slidesPerView: 3 },
    },
  });
>>>>>>> Stashed changes
}
