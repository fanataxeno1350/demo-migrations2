import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    iconImageRow,
    headlineRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    recipesContainerRow, // This row is a placeholder for the container, not an actual row with content
    ...recipeItemRows
  ] = [...block.children];

  const root = document.createElement('section');
  root.classList.add(
    'recipe-home',
    'grid-container',
    'overflow-x-hidden',
    'recipe-home--has-icon',
    'bg--paper-white',
    'animate-enter',
    'in-view',
  );

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x');
  root.append(gridX);

  const imageTextWrapper = document.createElement('div');
  imageTextWrapper.classList.add('grid-x', 'recipe-home--image-text');
  gridX.append(imageTextWrapper);

  const cellLarge10 = document.createElement('div');
  cellLarge10.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');
  imageTextWrapper.append(cellLarge10);

  // Icon Section
  const iconSection = document.createElement('div');
  iconSection.classList.add(
    'recipe-home--icon-section',
    'animate-enter-fade-left-long',
    'animate-delay-3',
    'text-center',
  );
  if (iconImageRow) {
    const iconPicture = iconImageRow.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      // The original HTML uses a specific width, let's try to match that or use a more flexible approach
      // createOptimizedPicture handles srcset, so a single width might not be ideal if multiple sizes are needed.
      // For now, keeping the original generated width.
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('recipe-home--icon-section-img');
      moveInstrumentation(iconImageRow, optimizedImg);
      iconSection.append(optimizedPic);
    }
  }
  cellLarge10.append(iconSection);

  // Text Section
  const textSection = document.createElement('div');
  textSection.classList.add(
    'recipe-home--text-section',
    'animate-enter-fade-up-short',
    'animate-delay-3',
  );

  const headline = document.createElement('h2');
  headline.classList.add('recipe-home--title');
  if (headlineRow) {
    moveInstrumentation(headlineRow, headline);
    headline.textContent = headlineRow.textContent.trim();
  }
  textSection.append(headline);

  const description = document.createElement('div'); // Use div for richtext
  description.classList.add('recipe-home--desc', 'bodyMediumRegular');
  if (descriptionRow) {
    moveInstrumentation(descriptionRow, description);
    // Description is richtext, use innerHTML directly from the cell
    description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  }
  textSection.append(description);
  cellLarge10.append(textSection);

  // Recipes Wrapper
  const recipeWrapper = document.createElement('div');
  recipeWrapper.classList.add('cell', 'small-12', 'recipe-home--wrapper');
  gridX.append(recipeWrapper);

  const swiperEl = document.createElement('div');
  // Removed swiper-initialized, swiper-horizontal, swiper-backface-hidden as Swiper adds them
  swiperEl.classList.add('swiper', 'swipper--full-view-padding', 'recipe-home--wrapper--in');
  // moveInstrumentation for recipesContainerRow is correct as it's a placeholder
  moveInstrumentation(recipesContainerRow, swiperEl);
  recipeWrapper.append(swiperEl);

  // Swiper Navigation Buttons
  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('recipe-home--btn-control', 'recipe-home--prev', 'show-for-large');
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-9');
  prevBtn.innerHTML = `
    <svg role="presentation" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  prevBtnControl.append(prevBtn);
  swiperEl.append(prevBtnControl);

  const nextBtnControl = document.createElement('div');
  nextBtnControl.classList.add('recipe-home--btn-control', 'recipe-home--next', 'show-for-large');
  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-control', 'swiper--next', 'elevation-1', 'animate-enter-fade-left-short', 'animate-delay-9');
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

  recipeItemRows.forEach((row) => {
    const [
      recipeLinkCell,
      imageDesktopCell,
      imageMobileCell,
      tagLabelCell,
      recipeNameCell,
      recipeDescriptionCell,
      stepsCountCell,
      stepsLabelCell,
      ingredientsCountCell,
      ingredientsLabelCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'recipe-home--list-item');

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card-grid-view--link');
    const foundRecipeLink = recipeLinkCell?.querySelector('a');
    if (foundRecipeLink) {
      recipeLink.href = foundRecipeLink.href;
      recipeLink.title = recipeNameCell?.textContent.trim() || '';
      recipeLink.setAttribute('aria-label', recipeNameCell?.textContent.trim() || '');
    }
    moveInstrumentation(row, recipeLink);
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

    const imageContainer = document.createElement('div');
    imageContainer.classList.add(
      'cell',
      'small-12',
      'medium-12',
      'large-6',
      'recipe-img-container',
      'animate-enter-fade',
      'animate-delay-5',
    );
    recipeCard.append(imageContainer);

    // Tag Mobile
    const tagMobile = document.createElement('div');
    tagMobile.classList.add('recipe-tag-mobile', 'animate-enter-fade-up-short', 'animate-delay-9');
    const tagDivMobile = document.createElement('div');
    tagDivMobile.classList.add('tag', 'bg--brand-green');
    const tagLabelMobile = document.createElement('span');
    tagLabelMobile.classList.add('tag__label');
    tagLabelMobile.textContent = tagLabelCell?.textContent.trim() || '';
    tagDivMobile.append(tagLabelMobile);
    tagMobile.append(tagDivMobile);
    imageContainer.append(tagMobile);

    // Recipe Image
    const pictureDesktop = imageDesktopCell?.querySelector('picture');
    const pictureMobile = imageMobileCell?.querySelector('picture');

    if (pictureDesktop && pictureMobile) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const imgMobile = pictureMobile.querySelector('img');

      const sourceDesktop = document.createElement('source');
      sourceDesktop.media = '(min-width: 768px)';
      sourceDesktop.srcset = imgDesktop.src;

      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(min-width: 0px)';
      sourceMobile.srcset = imgMobile.src;

      const img = document.createElement('img');
      img.src = imgDesktop.src;
      img.loading = 'lazy';
      img.alt = imgDesktop.alt || '';
      img.classList.add('lazyloaded');

      const pictureElement = document.createElement('picture');
      pictureElement.append(sourceDesktop, sourceMobile, img);
      imageContainer.append(pictureElement);
    }

    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-details');
    recipeCard.append(recipeDetails);

    const recipeInfo = document.createElement('div');
    recipeInfo.classList.add('recipe-info');
    recipeDetails.append(recipeInfo);

    const recipeName = document.createElement('div');
    recipeName.classList.add('recipe-name', 'labelLargeBold', 'animate-enter-fade-up-short', 'animate-delay-9');
    recipeName.textContent = recipeNameCell?.textContent.trim() || '';
    recipeInfo.append(recipeName);

    const gridXDesc = document.createElement('div');
    gridXDesc.classList.add('grid-x');
    const cellDesc = document.createElement('div');
    cellDesc.classList.add('cell', 'recipe-description', 'bodySmallRegular', 'animate-enter-fade-up-short', 'animate-delay-11');
    cellDesc.textContent = recipeDescriptionCell?.textContent.trim() || '';
    gridXDesc.append(cellDesc);
    recipeInfo.append(gridXDesc);

    const gridXSteps = document.createElement('div');
    gridXSteps.classList.add('grid-x');
    const cellSteps = document.createElement('div');
    cellSteps.classList.add('cell', 'recipe-steps-and-ingredients', 'animate-enter-fade-up-short', 'animate-delay-11');
    gridXSteps.append(cellSteps);
    recipeInfo.append(gridXSteps);

    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('recipe-steps-container');
    const stepsCount = document.createElement('span');
    stepsCount.classList.add('recipe-steps-count', 'labelSmallBold');
    stepsCount.textContent = stepsCountCell?.textContent.trim() || '';
    const stepsLabel = document.createElement('span');
    stepsLabel.classList.add('recipe-steps-label', 'utilityTagHighCaps');
    stepsLabel.textContent = stepsLabelCell?.textContent.trim() || '';
    stepsContainer.append(stepsCount, stepsLabel);
    cellSteps.append(stepsContainer);

    const separator = document.createElement('div');
    separator.classList.add('recipe-steps-separator');
    cellSteps.append(separator);

    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.classList.add('recipe-ingredients-container');
    const ingredientsCount = document.createElement('span');
    ingredientsCount.classList.add('recipe-ingredients-count', 'labelSmallBold');
    ingredientsCount.textContent = ingredientsCountCell?.textContent.trim() || '';
    const ingredientsLabel = document.createElement('span');
    ingredientsLabel.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
    ingredientsLabel.textContent = ingredientsLabelCell?.textContent.trim() || '';
    ingredientsContainer.append(ingredientsCount, ingredientsLabel);
    cellSteps.append(ingredientsContainer);

    // Tag Desktop
    const tagDesktop = document.createElement('div');
    tagDesktop.classList.add('recipe-tag-desktop', 'animate-enter-fade-up-short', 'animate-delay-9');
    const tagDivDesktop = document.createElement('div');
    tagDivDesktop.classList.add('tag', 'bg--brand-green');
    const tagLabelDesktop = document.createElement('span');
    tagLabelDesktop.classList.add('tag__label');
    tagLabelDesktop.textContent = tagLabelCell?.textContent.trim() || '';
    tagDivDesktop.append(tagLabelDesktop);
    tagDesktop.append(tagDivDesktop);
    recipeInfo.append(tagDesktop);

    swiperWrapper.append(listItem);
  });

  // Swiper Pagination
  const paginationWrapper = document.createElement('div');
  paginationWrapper.classList.add('recipe-home--pagination', 'animate-enter-fade-left-long', 'animate-delay-8');
  const paginationEl = document.createElement('div');
  // Removed swiper-pagination-clickable, swiper-pagination-bullets, swiper-pagination-horizontal as Swiper adds them
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
  const ctaCell = document.createElement('div');
  ctaCell.classList.add('cell', 'large-10', 'large-offset-1', 'see-all-recipies-cta');
  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-auto');
  const foundCtaLink = ctaLinkRow?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
    ctaLink.title = ctaLabelRow?.textContent.trim() || '';
    ctaLink.setAttribute('aria-label', ctaLabelRow?.textContent.trim() || '');
    ctaLink.rel = 'follow';
  }
  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('button-text');
  ctaSpan.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaLink.append(ctaSpan);
  moveInstrumentation(ctaLinkRow, ctaLink);
  moveInstrumentation(ctaLabelRow, ctaSpan);
  ctaCell.append(ctaLink);
  ctaContainer.append(ctaCell);
  root.append(ctaContainer);

  block.replaceChildren(root);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    spaceBetween: 32,
    loop: false, // Original HTML doesn't specify loop, default to false
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
        slidesPerView: 2.1,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3.1,
        spaceBetween: 32,
      },
      1280: {
        slidesPerView: 3.1,
        spaceBetween: 32,
      },
    },
  });
}
