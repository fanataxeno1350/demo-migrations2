import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const [
    iconRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    ...recipeCardRows
  ] = children;

  const section = document.createElement('section');
  section.classList.add('recipe-home', 'grid-container', 'overflow-x-hidden', 'recipe-home--has-icon', 'bg--paper-white', 'animate-enter', 'in-view');
  moveInstrumentation(block, section);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x');
  section.append(gridX);

  const imageTextWrapper = document.createElement('div');
  imageTextWrapper.classList.add('grid-x', 'recipe-home--image-text');
  gridX.append(imageTextWrapper);

  const cellLarge10 = document.createElement('div');
  cellLarge10.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');
  imageTextWrapper.append(cellLarge10);

  // Section Icon
  if (iconRow) {
    const iconSection = document.createElement('div');
    iconSection.classList.add('recipe-home--icon-section', 'animate-enter-fade-left-long', 'animate-delay-3', 'text-center');
    const picture = iconRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.classList.add('recipe-home--icon-section-img');
      iconSection.append(optimizedPic);
    }
    moveInstrumentation(iconRow, iconSection);
    cellLarge10.append(iconSection);
  }

  // Section Title and Description
  const textSection = document.createElement('div');
  textSection.classList.add('recipe-home--text-section', 'animate-enter-fade-up-short', 'animate-delay-3');

  if (titleRow) {
    const title = document.createElement('h2');
    title.classList.add('recipe-home--title');
    title.textContent = titleRow.textContent.trim();
    moveInstrumentation(titleRow, title);
    textSection.append(title);
  }

  if (descriptionRow) {
    const desc = document.createElement('div'); // Changed from p to div for richtext
    desc.classList.add('recipe-home--desc', 'bodyMediumRegular');
    // Correctly handle richtext by assigning innerHTML directly from the cell
    desc.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    moveInstrumentation(descriptionRow, desc);
    textSection.append(desc);
  }
  cellLarge10.append(textSection);

  // Recipe Cards Swiper
  const recipeWrapperCell = document.createElement('div');
  recipeWrapperCell.classList.add('cell', 'small-12', 'recipe-home--wrapper');
  gridX.append(recipeWrapperCell);

  const swiperEl = document.createElement('div');
  // Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden' as Swiper.js adds them
  swiperEl.classList.add('swiper', 'swipper--full-view-padding', 'recipe-home--wrapper--in');
  recipeWrapperCell.append(swiperEl);

  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('recipe-home--btn-control', 'recipe-home--prev', 'show-for-large');
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-9');
  prevBtn.setAttribute('aria-label', 'Previous slide');
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
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = `
    <svg role="presentation" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  nextBtnControl.append(nextBtn);
  swiperEl.append(nextBtnControl);

  const swiperWrapper = document.createElement('ul');
  swiperWrapper.classList.add('swiper-wrapper', 'recipe-home--list');
  swiperWrapper.setAttribute('aria-live', 'polite');
  swiperEl.append(swiperWrapper);

  recipeCardRows.forEach((row) => {
    const [
      recipeLinkCell,
      imageDesktopCell,
      imageMobileCell,
      tagLabelCell,
      nameCell,
      recipeDescriptionCell,
      stepsCountCell,
      ingredientsCountCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'recipe-home--list-item');
    moveInstrumentation(row, listItem);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card-grid-view--link');
    const foundLink = recipeLinkCell.querySelector('a');
    if (foundLink) {
      recipeLink.href = foundLink.href;
      recipeLink.title = nameCell?.textContent.trim() || '';
      recipeLink.setAttribute('aria-label', nameCell?.textContent.trim() || '');
    }

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('grid-x', 'recipe-card', 'recipe-card--grid-view-card', 'elevation-2', 'has-hover', 'recipe-card-grid-view');
    recipeLink.append(recipeCard);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-img-container', 'animate-enter-fade', 'animate-delay-5');
    recipeCard.append(imgContainer);

    if (tagLabelCell) {
      const tagMobile = document.createElement('div');
      tagMobile.classList.add('recipe-tag-mobile', 'animate-enter-fade-up-short', 'animate-delay-9');
      const tag = document.createElement('div');
      tag.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagLabelCell.textContent.trim();
      tag.append(tagLabel);
      tagMobile.append(tag);
      imgContainer.append(tagMobile);
    }

    if (imageDesktopCell || imageMobileCell) {
      const picture = imageDesktopCell?.querySelector('picture') || imageMobileCell?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 768px)', width: '1066' }, { width: '1066' }]);
        optimizedPic.querySelector('img').classList.add('lazyloaded');
        imgContainer.append(optimizedPic);
      }
    }

    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-details');
    recipeCard.append(recipeDetails);

    const recipeInfo = document.createElement('div');
    recipeInfo.classList.add('recipe-info');
    recipeDetails.append(recipeInfo);

    if (nameCell) {
      const recipeName = document.createElement('div');
      recipeName.classList.add('recipe-name', 'labelLargeBold', 'animate-enter-fade-up-short', 'animate-delay-9');
      recipeName.textContent = nameCell.textContent.trim();
      recipeInfo.append(recipeName);
    }

    if (recipeDescriptionCell) {
      const gridXDesc = document.createElement('div');
      gridXDesc.classList.add('grid-x');
      const descCell = document.createElement('div');
      descCell.classList.add('cell', 'recipe-description', 'bodySmallRegular', 'animate-enter-fade-up-short', 'animate-delay-11');
      descCell.textContent = recipeDescriptionCell.textContent.trim();
      gridXDesc.append(descCell);
      recipeInfo.append(gridXDesc);
    }

    if (stepsCountCell || ingredientsCountCell) {
      const gridXSteps = document.createElement('div');
      gridXSteps.classList.add('grid-x');
      const stepsIngredientsCell = document.createElement('div');
      stepsIngredientsCell.classList.add('cell', 'recipe-steps-and-ingredients', 'animate-enter-fade-up-short', 'animate-delay-11');
      gridXSteps.append(stepsIngredientsCell);

      if (stepsCountCell) {
        const stepsContainer = document.createElement('div');
        stepsContainer.classList.add('recipe-steps-container');
        const stepsCount = document.createElement('span');
        stepsCount.classList.add('recipe-steps-count', 'labelSmallBold');
        stepsCount.textContent = stepsCountCell.textContent.trim();
        const stepsLabel = document.createElement('span');
        stepsLabel.classList.add('recipe-steps-label', 'utilityTagHighCaps');
        stepsLabel.textContent = 'Steps';
        stepsContainer.append(stepsCount, stepsLabel);
        stepsIngredientsCell.append(stepsContainer);
      }

      const separator = document.createElement('div');
      separator.classList.add('recipe-steps-separator');
      stepsIngredientsCell.append(separator);

      if (ingredientsCountCell) {
        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.add('recipe-ingredients-container');
        const ingredientsCount = document.createElement('span');
        ingredientsCount.classList.add('recipe-ingredients-count', 'labelSmallBold');
        ingredientsCount.textContent = ingredientsCountCell.textContent.trim();
        const ingredientsLabel = document.createElement('span');
        ingredientsLabel.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
        ingredientsLabel.textContent = 'Ingredients';
        ingredientsContainer.append(ingredientsCount, ingredientsLabel);
        stepsIngredientsCell.append(ingredientsContainer);
      }
      recipeInfo.append(gridXSteps);
    }

    if (tagLabelCell) {
      const tagDesktop = document.createElement('div');
      tagDesktop.classList.add('recipe-tag-desktop', 'animate-enter-fade-up-short', 'animate-delay-9');
      const tag = document.createElement('div');
      tag.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagLabelCell.textContent.trim();
      tag.append(tagLabel);
      tagDesktop.append(tag);
      recipeInfo.append(tagDesktop);
    }

    listItem.append(recipeLink);
    swiperWrapper.append(listItem);
  });

  const paginationWrapper = document.createElement('div');
  paginationWrapper.classList.add('recipe-home--pagination', 'animate-enter-fade-left-long', 'animate-delay-8');
  const paginationEl = document.createElement('div');
  // Removed 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal' as Swiper.js adds them
  paginationEl.classList.add('swiper-pagination');
  paginationWrapper.append(paginationEl);
  swiperEl.append(paginationWrapper);

  // CTA Link
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('grid-x', 'recipe-home--cta-container', 'text-center', 'animate-enter-fade-up-short', 'animate-delay-10');
  const ctaCell = document.createElement('div');
  ctaCell.classList.add('cell', 'large-10', 'large-offset-1', 'see-all-recipies-cta');
  ctaContainer.append(ctaCell);

  if (ctaLinkRow && ctaLabelRow) {
    const ctaLink = document.createElement('a');
    ctaLink.classList.add('button', 'transparent-auto');
    const foundCtaLink = ctaLinkRow.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
      ctaLink.title = ctaLabelRow.textContent.trim();
      ctaLink.setAttribute('aria-label', ctaLabelRow.textContent.trim());
    }
    const ctaText = document.createElement('span');
    ctaText.classList.add('button-text');
    ctaText.textContent = ctaLabelRow.textContent.trim();
    ctaLink.append(ctaText);
    moveInstrumentation(ctaLinkRow, ctaLink);
    moveInstrumentation(ctaLabelRow, ctaText);
    ctaCell.append(ctaLink);
  }
  section.append(ctaContainer);

  block.replaceChildren(section);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    spaceBetween: 32, // Based on original HTML margin-right: 32px
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
        slidesPerView: 1,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 1, // 'auto' for larger screens, adjust if needed
        spaceBetween: 32,
      },
    },
  });
}
