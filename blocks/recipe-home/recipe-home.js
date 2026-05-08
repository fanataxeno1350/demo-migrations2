import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    iconImageRow,
    iconImageAltRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    ...recipeCardRows
  ] = [...block.children];

  const root = document.createElement('section');
  // Removed 'recipe-home' class from root as the outer block div already has it.
  root.classList.add('grid-container', 'overflow-x-hidden', 'recipe-home--has-icon', 'bg--paper-white', 'animate-enter', 'in-view');
  moveInstrumentation(block, root);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x');

  const imageTextSection = document.createElement('div');
  imageTextSection.classList.add('grid-x', 'recipe-home--image-text');

  const cellLarge10 = document.createElement('div');
  cellLarge10.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');

  // Icon Section
  const iconSection = document.createElement('div');
  iconSection.classList.add('recipe-home--icon-section', 'animate-enter-fade-left-long', 'animate-delay-3', 'text-center');
  if (iconImageRow) {
    const picture = iconImageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, iconImageAltRow?.textContent.trim() || img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('recipe-home--icon-section-img');
        moveInstrumentation(iconImageRow, optimizedPic.querySelector('img'));
        iconSection.append(optimizedPic);
      }
    }
  }
  cellLarge10.append(iconSection);

  // Text Section
  const textSection = document.createElement('div');
  textSection.classList.add('recipe-home--text-section', 'animate-enter-fade-up-short', 'animate-delay-3');
  moveInstrumentation(titleRow, textSection);

  const title = document.createElement('h2');
  title.classList.add('recipe-home--title');
  title.textContent = titleRow?.textContent.trim() || '';
  textSection.append(title);

  const description = document.createElement('div');
  description.classList.add('recipe-home--desc', 'bodyMediumRegular');
  // descriptionRow is type=richtext, so read innerHTML directly from the cell.
  // The cell itself contains the <p> tag, so no need for .children[0] or .querySelector('p').
  description.innerHTML = descriptionRow?.innerHTML || '';
  textSection.append(description);

  cellLarge10.append(textSection);
  imageTextSection.append(cellLarge10);
  gridX.append(imageTextSection);

  // Recipe Cards Wrapper (Swiper)
  const recipeWrapperCell = document.createElement('div');
  recipeWrapperCell.classList.add('cell', 'small-12', 'recipe-home--wrapper');

  const swiperEl = document.createElement('div');
  // Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden' as Swiper.js adds these automatically.
  swiperEl.classList.add('swiper', 'swipper--full-view-padding', 'recipe-home--wrapper--in');

  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('recipe-home--btn-control', 'recipe-home--prev', 'show-for-large');
  const prevBtn = document.createElement('button');
  // Removed 'swiper-button-disabled' as Swiper.js manages this class.
  prevBtn.classList.add('swiper-control', 'swiper--prev', 'elevation-1', 'animate-enter-fade-right-short', 'animate-delay-9');
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = `
    <svg role="presentation" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  prevBtnControl.append(prevBtn);

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

  const swiperWrapper = document.createElement('ul');
  swiperWrapper.classList.add('swiper-wrapper', 'recipe-home--list');

  recipeCardRows.forEach((row) => {
    const [
      linkCell,
      desktopImageCell,
      mobileImageCell,
      imageAltCell,
      tagLabelCell,
      nameCell,
      descriptionCardCell,
      stepsCountCell,
      stepsLabelCell,
      ingredientsCountCell,
      ingredientsLabelCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    // Removed 'swiper-slide-active' and 'swiper-slide-next' as Swiper.js manages these classes.
    listItem.classList.add('swiper-slide', 'recipe-home--list-item');
    moveInstrumentation(row, listItem);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card-grid-view--link');
    recipeLink.href = linkCell?.querySelector('a')?.href || '#';
    recipeLink.setAttribute('title', nameCell?.textContent.trim() || '');
    recipeLink.setAttribute('aria-label', nameCell?.textContent.trim() || '');

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('grid-x', 'recipe-card', 'recipe-card--grid-view-card', 'elevation-2', 'has-hover', 'recipe-card-grid-view');

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-img-container', 'animate-enter-fade', 'animate-delay-5');

    const tagMobile = document.createElement('div');
    tagMobile.classList.add('recipe-tag-mobile', 'animate-enter-fade-up-short', 'animate-delay-9');
    const tagDivMobile = document.createElement('div');
    tagDivMobile.classList.add('tag', 'bg--brand-green');
    const tagLabelMobile = document.createElement('span');
    tagLabelMobile.classList.add('tag__label');
    tagLabelMobile.textContent = tagLabelCell?.textContent.trim() || '';
    tagDivMobile.append(tagLabelMobile);
    tagMobile.append(tagDivMobile);
    imgContainer.append(tagMobile);

    const picture = document.createElement('picture');
    const desktopImg = desktopImageCell?.querySelector('img');
    const mobileImg = mobileImageCell?.querySelector('img');
    const altText = imageAltCell?.textContent.trim() || '';

    if (desktopImg) {
      const sourceDesktop = document.createElement('source');
      sourceDesktop.setAttribute('media', '(min-width: 768px)');
      sourceDesktop.setAttribute('srcset', desktopImg.src);
      picture.append(sourceDesktop);
    }
    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(min-width: 0px)');
      sourceMobile.setAttribute('srcset', mobileImg.src);
      picture.append(sourceMobile);
    }
    if (desktopImg || mobileImg) {
      const img = document.createElement('img');
      img.setAttribute('loading', 'lazy');
      img.classList.add('lazyloaded');
      img.setAttribute('alt', altText);
      img.src = desktopImg?.src || mobileImg?.src || '';
      picture.append(img);
    }
    imgContainer.append(picture);
    recipeCard.append(imgContainer);

    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-details');

    const recipeInfo = document.createElement('div');
    recipeInfo.classList.add('recipe-info');

    const recipeName = document.createElement('div');
    recipeName.classList.add('recipe-name', 'labelLargeBold', 'animate-enter-fade-up-short', 'animate-delay-9');
    recipeName.textContent = nameCell?.textContent.trim() || '';
    recipeInfo.append(recipeName);

    const gridXDesc = document.createElement('div');
    gridXDesc.classList.add('grid-x');
    const cellDesc = document.createElement('div');
    cellDesc.classList.add('cell', 'recipe-description', 'bodySmallRegular', 'animate-enter-fade-up-short', 'animate-delay-11');
    cellDesc.textContent = descriptionCardCell?.textContent.trim() || '';
    gridXDesc.append(cellDesc);
    recipeInfo.append(gridXDesc);

    const gridXStepsIngredients = document.createElement('div');
    gridXStepsIngredients.classList.add('grid-x');
    const cellStepsIngredients = document.createElement('div');
    cellStepsIngredients.classList.add('cell', 'recipe-steps-and-ingredients', 'animate-enter-fade-up-short', 'animate-delay-11');

    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('recipe-steps-container');
    const stepsCount = document.createElement('span');
    stepsCount.classList.add('recipe-steps-count', 'labelSmallBold');
    stepsCount.textContent = stepsCountCell?.textContent.trim() || '';
    const stepsLabel = document.createElement('span');
    stepsLabel.classList.add('recipe-steps-label', 'utilityTagHighCaps');
    stepsLabel.textContent = stepsLabelCell?.textContent.trim() || '';
    stepsContainer.append(stepsCount, stepsLabel);
    cellStepsIngredients.append(stepsContainer);

    const separator = document.createElement('div');
    separator.classList.add('recipe-steps-separator');
    cellStepsIngredients.append(separator);

    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.classList.add('recipe-ingredients-container');
    const ingredientsCount = document.createElement('span');
    ingredientsCount.classList.add('recipe-ingredients-count', 'labelSmallBold');
    ingredientsCount.textContent = ingredientsCountCell?.textContent.trim() || '';
    const ingredientsLabel = document.createElement('span');
    ingredientsLabel.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
    ingredientsLabel.textContent = ingredientsLabelCell?.textContent.trim() || '';
    ingredientsContainer.append(ingredientsCount, ingredientsLabel);
    cellStepsIngredients.append(ingredientsContainer);

    gridXStepsIngredients.append(cellStepsIngredients);
    recipeInfo.append(gridXStepsIngredients);

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

    recipeDetails.append(recipeInfo);
    recipeCard.append(recipeDetails);
    recipeLink.append(recipeCard);
    listItem.append(recipeLink);
    swiperWrapper.append(listItem);
  });

  swiperEl.append(prevBtnControl, nextBtnControl, swiperWrapper);

  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('recipe-home--pagination', 'animate-enter-fade-left-long', 'animate-delay-8');
  const paginationEl = document.createElement('div');
  // Removed 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal' as Swiper.js adds these.
  paginationEl.classList.add('swiper-pagination');
  paginationContainer.append(paginationEl);
  swiperEl.append(paginationContainer);

  recipeWrapperCell.append(swiperEl);
  gridX.append(recipeWrapperCell);

  // CTA Section
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('grid-x', 'recipe-home--cta-container', 'text-center', 'animate-enter-fade-up-short', 'animate-delay-10');
  const ctaCell = document.createElement('div');
  ctaCell.classList.add('cell', 'large-10', 'large-offset-1', 'see-all-recipies-cta');

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('button', 'transparent-auto');
  ctaLink.href = ctaLinkRow?.querySelector('a')?.href || '#';
  ctaLink.setAttribute('title', ctaLabelRow?.textContent.trim() || '');
  ctaLink.setAttribute('aria-label', ctaLabelRow?.textContent.trim() || '');
  ctaLink.setAttribute('rel', 'follow');

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('button-text');
  ctaSpan.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaLink.append(ctaSpan);

  moveInstrumentation(ctaLinkRow, ctaLink);
  ctaCell.append(ctaLink);
  ctaContainer.append(ctaCell);
  gridX.append(ctaContainer);

  root.append(gridX);
  block.replaceChildren(root);

  // Optimize images
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Initialize Swiper
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
        slidesPerView: 1,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      1440: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
    },
  });
}
