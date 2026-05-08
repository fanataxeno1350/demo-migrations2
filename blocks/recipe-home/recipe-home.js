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
  moveInstrumentation(block, root);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x');
  root.append(gridX);

  const imageTextWrapper = document.createElement('div');
  imageTextWrapper.classList.add('grid-x', 'recipe-home--image-text');
  gridX.append(imageTextWrapper);

  const cellWrapper = document.createElement('div');
  cellWrapper.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');
  imageTextWrapper.append(cellWrapper);

  // Section Icon
  const iconSection = document.createElement('div');
  iconSection.classList.add(
    'recipe-home--icon-section',
    'animate-enter-fade-left-long',
    'animate-delay-3',
    'text-center',
  );
  const iconPicture = iconRow?.querySelector('picture');
  if (iconPicture) {
    const iconImg = iconPicture.querySelector('img');
    if (iconImg) {
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
      iconPicture.replaceWith(optimizedPic);
    }
    const imgEl = iconPicture.querySelector('img');
    if (imgEl) {
      imgEl.classList.add('recipe-home--icon-section-img');
      iconSection.append(iconPicture);
    }
  }
  moveInstrumentation(iconRow, iconSection);
  cellWrapper.append(iconSection);

  // Section Title and Description
  const textSection = document.createElement('div');
  textSection.classList.add(
    'recipe-home--text-section',
    'animate-enter-fade-up-short',
    'animate-delay-3',
  );

  const title = document.createElement('h2');
  title.classList.add('recipe-home--title');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow?.textContent.trim() || '';
  textSection.append(title);

  const description = document.createElement('div');
  description.classList.add('recipe-home--desc', 'bodyMediumRegular');
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow?.innerHTML || '';
  textSection.append(description);

  cellWrapper.append(textSection);

  // Recipe Cards Swiper
  const recipeWrapperCell = document.createElement('div');
  recipeWrapperCell.classList.add('cell', 'small-12', 'recipe-home--wrapper');
  gridX.append(recipeWrapperCell);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add(
    'swiper',
    'swipper--full-view-padding',
    'recipe-home--wrapper--in',
  );
  // Removed Swiper-managed classes: 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden'
  recipeWrapperCell.append(swiperEl);

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
  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('recipe-home--btn-control', 'recipe-home--prev', 'show-for-large');
  prevBtnControl.append(prevBtn);
  swiperEl.append(prevBtnControl);

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
  const nextBtnControl = document.createElement('div');
  nextBtnControl.classList.add('recipe-home--btn-control', 'recipe-home--next', 'show-for-large');
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
      linkCell,
      nameCell,
      descriptionCell,
      stepsCountCell,
      ingredientsCountCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'recipe-home--list-item');
    moveInstrumentation(row, listItem);

    const recipeLink = document.createElement('a');
    recipeLink.classList.add('recipe-card-grid-view--link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      recipeLink.href = foundLink.href;
      recipeLink.title = nameCell?.textContent.trim() || '';
      recipeLink.setAttribute('aria-label', nameCell?.textContent.trim() || '');
    }

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

    const tagMobile = document.createElement('div');
    tagMobile.classList.add('recipe-tag-mobile', 'animate-enter-fade-up-short', 'animate-delay-9');
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tag', 'bg--brand-green');
    const tagSpan = document.createElement('span');
    tagSpan.classList.add('tag__label');
    tagSpan.textContent = tagLabelCell?.textContent.trim() || '';
    tagDiv.append(tagSpan);
    tagMobile.append(tagDiv);
    imgContainer.append(tagMobile);

    const picture = document.createElement('picture');
    const desktopImg = imageDesktopCell.querySelector('img');
    const mobileImg = imageMobileCell.querySelector('img');

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
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]).querySelector('img');
      img.classList.add('ls-is-cached', 'lazyloaded');
      picture.append(img);
    }
    imgContainer.append(picture);

    const recipeDetails = document.createElement('div');
    recipeDetails.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-details');
    recipeCard.append(recipeDetails);

    const recipeInfo = document.createElement('div');
    recipeInfo.classList.add('recipe-info');
    recipeDetails.append(recipeInfo);

    const recipeName = document.createElement('div');
    recipeName.classList.add('recipe-name', 'labelLargeBold', 'animate-enter-fade-up-short', 'animate-delay-9');
    recipeName.textContent = nameCell?.textContent.trim() || '';
    recipeInfo.append(recipeName);

    const descriptionGrid = document.createElement('div');
    descriptionGrid.classList.add('grid-x');
    const descriptionCellEl = document.createElement('div');
    descriptionCellEl.classList.add('cell', 'recipe-description', 'bodySmallRegular', 'animate-enter-fade-up-short', 'animate-delay-11');
    descriptionCellEl.textContent = descriptionCell?.textContent.trim() || '';
    descriptionGrid.append(descriptionCellEl);
    recipeInfo.append(descriptionGrid);

    const stepsIngredientsGrid = document.createElement('div');
    stepsIngredientsGrid.classList.add('grid-x');
    const stepsIngredientsCell = document.createElement('div');
    stepsIngredientsCell.classList.add('cell', 'recipe-steps-and-ingredients', 'animate-enter-fade-up-short', 'animate-delay-11');

    const stepsContainer = document.createElement('div');
    stepsContainer.classList.add('recipe-steps-container');
    const stepsCount = document.createElement('span');
    stepsCount.classList.add('recipe-steps-count', 'labelSmallBold');
    stepsCount.textContent = stepsCountCell?.textContent.trim() || '0';
    const stepsLabel = document.createElement('span');
    stepsLabel.classList.add('recipe-steps-label', 'utilityTagHighCaps');
    stepsLabel.textContent = 'Steps';
    stepsContainer.append(stepsCount, stepsLabel);
    stepsIngredientsCell.append(stepsContainer);

    const separator = document.createElement('div');
    separator.classList.add('recipe-steps-separator');
    stepsIngredientsCell.append(separator);

    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.classList.add('recipe-ingredients-container');
    const ingredientsCount = document.createElement('span');
    ingredientsCount.classList.add('recipe-ingredients-count', 'labelSmallBold');
    ingredientsCount.textContent = ingredientsCountCell?.textContent.trim() || '0';
    const ingredientsLabel = document.createElement('span');
    ingredientsLabel.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
    ingredientsLabel.textContent = 'Ingredients';
    ingredientsContainer.append(ingredientsCount, ingredientsLabel);
    stepsIngredientsCell.append(ingredientsContainer);

    stepsIngredientsGrid.append(stepsIngredientsCell);
    recipeInfo.append(stepsIngredientsGrid);

    const tagDesktop = document.createElement('div');
    tagDesktop.classList.add('recipe-tag-desktop', 'animate-enter-fade-up-short', 'animate-delay-9');
    const tagDivDesktop = document.createElement('div');
    tagDivDesktop.classList.add('tag', 'bg--brand-green');
    const tagSpanDesktop = document.createElement('span');
    tagSpanDesktop.classList.add('tag__label');
    tagSpanDesktop.textContent = tagLabelCell?.textContent.trim() || '';
    tagDivDesktop.append(tagSpanDesktop);
    tagDesktop.append(tagDivDesktop);
    recipeInfo.append(tagDesktop);

    listItem.append(recipeLink);
    swiperWrapper.append(listItem);
  });

  const paginationWrapper = document.createElement('div');
  paginationWrapper.classList.add('recipe-home--pagination', 'animate-enter-fade-left-long', 'animate-delay-8');
  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  paginationWrapper.append(paginationEl);
  swiperEl.append(paginationWrapper);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  swiperEl.append(swiperNotification);

  // CTA Link
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

  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add('button', 'transparent-auto');
  const ctaFoundLink = ctaLinkRow.querySelector('a');
  if (ctaFoundLink) {
    ctaAnchor.href = ctaFoundLink.href;
    ctaAnchor.title = ctaLabelRow?.textContent.trim() || '';
    ctaAnchor.setAttribute('aria-label', ctaLabelRow?.textContent.trim() || '');
    ctaAnchor.rel = 'follow';
  }
  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('button-text');
  ctaSpan.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaAnchor.append(ctaSpan);
  moveInstrumentation(ctaLinkRow, ctaAnchor);
  moveInstrumentation(ctaLabelRow, ctaSpan);
  ctaCell.append(ctaAnchor);
  ctaContainer.append(ctaCell);
  root.append(ctaContainer);

  block.replaceChildren(root);

  // Load Swiper
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
        slidesPerView: 'auto',
        spaceBetween: 32,
      },
    },
  });
}
