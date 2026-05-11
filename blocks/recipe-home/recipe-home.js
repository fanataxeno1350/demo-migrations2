import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    iconImageRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    ...recipeCardRows
  ] = [...block.children];

  const root = document.createElement('section');
  root.classList.add(
    'grid-container',
    'overflow-x-hidden',
    'recipe-home--has-icon',
    'bg--paper-white',
    'animate-enter',
    'in-view',
  );

  const gridXWrapper = document.createElement('div');
  gridXWrapper.classList.add('grid-x');
  root.append(gridXWrapper);

  const imageTextWrapper = document.createElement('div');
  imageTextWrapper.classList.add('grid-x', 'recipe-home--image-text');
  gridXWrapper.append(imageTextWrapper);

  const cellWrapper = document.createElement('div');
  cellWrapper.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');
  imageTextWrapper.append(cellWrapper);

  // Icon Section
  const iconSection = document.createElement('div');
  iconSection.classList.add(
    'recipe-home--icon-section',
    'animate-enter-fade-left-long',
    'animate-delay-3',
    'text-center',
  );
  if (iconImageRow) {
    const picture = iconImageRow.querySelector('picture');
    if (picture) {
      // createOptimizedPicture already handles img and source creation/optimization
      const optimizedPic = createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('recipe-home--icon-section-img');
      moveInstrumentation(iconImageRow, optimizedPic.querySelector('img'));
      iconSection.append(optimizedPic);
    }
  }
  cellWrapper.append(iconSection);

  // Text Section
  const textSection = document.createElement('div');
  textSection.classList.add(
    'recipe-home--text-section',
    'animate-enter-fade-up-short',
    'animate-delay-3',
  );
  cellWrapper.append(textSection);

  const title = document.createElement('h2');
  title.classList.add('recipe-home--title');
  if (titleRow) {
    moveInstrumentation(titleRow, title);
    title.textContent = titleRow.textContent.trim();
  }
  textSection.append(title);

  const description = document.createElement('div'); // Use div for richtext
  description.classList.add('recipe-home--desc', 'bodyMediumRegular');
  if (descriptionRow) {
    moveInstrumentation(descriptionRow, description);
    description.innerHTML = descriptionRow.innerHTML; // Read innerHTML for richtext
  }
  textSection.append(description);

  // Recipe Cards Wrapper
  const recipeWrapperCell = document.createElement('div');
  recipeWrapperCell.classList.add('cell', 'small-12', 'recipe-home--wrapper');
  gridXWrapper.append(recipeWrapperCell);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add(
    'swiper',
    'swipper--full-view-padding',
    'recipe-home--wrapper--in',
  );
  recipeWrapperCell.append(swiperEl);

  // Navigation buttons
  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add(
    'recipe-home--btn-control',
    'recipe-home--prev',
    'show-for-large',
  );
  const prevBtn = document.createElement('button');
  prevBtn.classList.add(
    'swiper-control',
    'swiper--prev',
    'elevation-1',
    'animate-enter-fade-right-short',
    'animate-delay-9',
  );
  prevBtn.innerHTML = `
    <svg role="presentation" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  prevBtnControl.append(prevBtn);
  swiperEl.append(prevBtnControl);

  const nextBtnControl = document.createElement('div');
  nextBtnControl.classList.add(
    'recipe-home--btn-control',
    'recipe-home--next',
    'show-for-large',
  );
  const nextBtn = document.createElement('button');
  nextBtn.classList.add(
    'swiper-control',
    'swiper--next',
    'elevation-1',
    'animate-enter-fade-left-short',
    'animate-delay-9',
  );
  nextBtn.innerHTML = `
    <svg role="presentation" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  nextBtnControl.append(nextBtn);
  swiperEl.append(nextBtnControl);

  const swiperWrapper = document.createElement('ul');
  swiperWrapper.classList.add('swiper-wrapper', 'recipe-home--list');
  swiperEl.append(swiperWrapper);

  recipeCardRows.forEach((row) => {
    const [
      tagLabelCell,
      imageDesktopCell,
      imageMobileCell,
      recipeNameCell,
      recipeDescriptionCell,
      stepsCountCell,
      stepsLabelCell,
      ingredientsCountCell,
      ingredientsLabelCell,
      recipeLinkCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'recipe-home--list-item');
    moveInstrumentation(row, listItem);
    swiperWrapper.append(listItem);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card-grid-view--link');
    const foundRecipeLink = recipeLinkCell?.querySelector('a');
    if (foundRecipeLink) {
      recipeLink.href = foundRecipeLink.href;
      recipeLink.title = recipeNameCell?.textContent.trim();
      recipeLink.setAttribute('aria-label', recipeNameCell?.textContent.trim());
    }
    listItem.append(recipeLink);

    const recipeCard = document.createElement('div');
    recipeCard.classList.add(
      'grid-x',
      'recipe-card',
      'recipe-card--grid-view-card',
      'elevation-2',
      'has-hover',
      'recipe-card-grid-view',
    );
    recipeLink.append(recipeCard);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add(
      'cell',
      'small-12',
      'medium-12',
      'large-6',
      'recipe-img-container',
      'animate-enter-fade',
      'animate-delay-5',
    );
    recipeCard.append(imgContainer);

    // Tag Mobile
    const tagMobile = document.createElement('div');
    tagMobile.classList.add('recipe-tag-mobile', 'animate-enter-fade-up-short', 'animate-delay-9');
    const tagDivMobile = document.createElement('div');
    tagDivMobile.classList.add('tag', 'bg--brand-green');
    const tagLabelMobile = document.createElement('span');
    tagLabelMobile.classList.add('tag__label');
    tagLabelMobile.textContent = tagLabelCell?.textContent.trim();
    tagDivMobile.append(tagLabelMobile);
    tagMobile.append(tagDivMobile);
    imgContainer.append(tagMobile);

    // Picture element for recipe image
    const picture = document.createElement('picture');
    const desktopImg = imageDesktopCell?.querySelector('img');
    const mobileImg = imageMobileCell?.querySelector('img');

    if (desktopImg) {
      const sourceDesktop = document.createElement('source');
      sourceDesktop.media = '(min-width: 768px)';
      sourceDesktop.srcset = desktopImg.src;
      picture.append(sourceDesktop);
    }
    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(min-width: 0px)';
      sourceMobile.srcset = mobileImg.src;
      picture.append(sourceMobile);
    }
    if (desktopImg) {
      const img = document.createElement('img');
      img.src = desktopImg.src;
      img.alt = desktopImg.alt;
      img.loading = 'lazy';
      img.classList.add('lazyloaded');
      picture.append(img);
    }
    imgContainer.append(picture);

    // Recipe Details
    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-details');
    recipeCard.append(recipeDetails);

    const recipeInfo = document.createElement('div');
    recipeInfo.classList.add('recipe-info');
    recipeDetails.append(recipeInfo);

    const recipeName = document.createElement('div');
    recipeName.classList.add('recipe-name', 'labelLargeBold', 'animate-enter-fade-up-short', 'animate-delay-9');
    recipeName.textContent = recipeNameCell?.textContent.trim();
    recipeInfo.append(recipeName);

    const gridXDesc = document.createElement('div');
    gridXDesc.classList.add('grid-x');
    const descCell = document.createElement('div');
    descCell.classList.add('cell', 'recipe-description', 'bodySmallRegular', 'animate-enter-fade-up-short', 'animate-delay-11');
    descCell.textContent = recipeDescriptionCell?.textContent.trim();
    gridXDesc.append(descCell);
    recipeInfo.append(gridXDesc);

    const gridXStepsIngredients = document.createElement('div');
    gridXStepsIngredients.classList.add('grid-x');
    const stepsIngredientsCell = document.createElement('div');
    stepsIngredientsCell.classList.add('cell', 'recipe-steps-and-ingredients', 'animate-enter-fade-up-short', 'animate-delay-11');
    gridXStepsIngredients.append(stepsIngredientsCell);
    recipeInfo.append(gridXStepsIngredients);

    // Steps Container
    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('recipe-steps-container');
    const stepsCount = document.createElement('span');
    stepsCount.classList.add('recipe-steps-count', 'labelSmallBold');
    stepsCount.textContent = stepsCountCell?.textContent.trim();
    const stepsLabel = document.createElement('span');
    stepsLabel.classList.add('recipe-steps-label', 'utilityTagHighCaps');
    stepsLabel.textContent = stepsLabelCell?.textContent.trim();
    stepsContainer.append(stepsCount, stepsLabel);
    stepsIngredientsCell.append(stepsContainer);

    const stepsSeparator = document.createElement('div');
    stepsSeparator.classList.add('recipe-steps-separator');
    stepsIngredientsCell.append(stepsSeparator);

    // Ingredients Container
    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.classList.add('recipe-ingredients-container');
    const ingredientsCount = document.createElement('span');
    ingredientsCount.classList.add('recipe-ingredients-count', 'labelSmallBold');
    ingredientsCount.textContent = ingredientsCountCell?.textContent.trim();
    const ingredientsLabel = document.createElement('span');
    ingredientsLabel.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
    ingredientsLabel.textContent = ingredientsLabelCell?.textContent.trim();
    ingredientsContainer.append(ingredientsCount, ingredientsLabel);
    stepsIngredientsCell.append(ingredientsContainer);

    // Tag Desktop
    const tagDesktop = document.createElement('div');
    tagDesktop.classList.add('recipe-tag-desktop', 'animate-enter-fade-up-short', 'animate-delay-9');
    const tagDivDesktop = document.createElement('div');
    tagDivDesktop.classList.add('tag', 'bg--brand-green');
    const tagLabelDesktop = document.createElement('span');
    tagLabelDesktop.classList.add('tag__label');
    tagLabelDesktop.textContent = tagLabelCell?.textContent.trim();
    tagDivDesktop.append(tagLabelDesktop);
    tagDesktop.append(tagDivDesktop);
    recipeInfo.append(tagDesktop);
  });

  // Pagination
  const paginationWrapper = document.createElement('div');
  paginationWrapper.classList.add('recipe-home--pagination', 'animate-enter-fade-left-long', 'animate-delay-8');
  const paginationEl = document.createElement('div');
  // Remove Swiper-specific classes that Swiper.js adds automatically
  paginationEl.classList.add('swiper-pagination');
  paginationWrapper.append(paginationEl);
  swiperEl.append(paginationWrapper);

  // CTA Container
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add(
    'grid-x',
    'recipe-home--cta-container',
    'text-center',
    'animate-enter-fade-up-short',
    'animate-delay-10',
  );
  root.append(ctaContainer);

  const ctaCell = document.createElement('div');
  ctaCell.classList.add('cell', 'large-10', 'large-offset-1', 'see-all-recipies-cta');
  ctaContainer.append(ctaCell);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-auto');
  const foundCtaLink = ctaLinkRow?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
    ctaLink.title = ctaLabelRow?.textContent.trim();
    ctaLink.setAttribute('aria-label', ctaLabelRow?.textContent.trim());
    ctaLink.rel = 'follow';
  }
  const ctaButtonText = document.createElement('span');
  ctaButtonText.classList.add('button-text');
  ctaButtonText.textContent = ctaLabelRow?.textContent.trim();
  ctaLink.append(ctaButtonText);
  ctaCell.append(ctaLink);

  block.replaceChildren(root);

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    spaceBetween: 32,
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
      0: {
        slidesPerView: 1.1,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 32,
      },
    },
  });
}
