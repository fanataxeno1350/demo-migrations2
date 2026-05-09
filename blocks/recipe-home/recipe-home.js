import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    iconRow,
    iconAltRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    ...recipeCardRows
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add(
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

  const imageTextGrid = document.createElement('div');
  imageTextGrid.classList.add('grid-x', 'recipe-home--image-text');

  const cellLarge10 = document.createElement('div');
  cellLarge10.classList.add('cell', 'small-12', 'large-10', 'large-offset-1');

  // Icon Section
  const iconSection = document.createElement('div');
  iconSection.classList.add(
    'recipe-home--icon-section',
    'animate-enter-fade-left-long',
    'animate-delay-3',
    'text-center',
  );
  if (iconRow) {
    const picture = iconRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, iconAltRow?.textContent.trim() || img.alt, false, [{ width: 'auto' }]);
      moveInstrumentation(iconRow, optimizedPic.querySelector('img'));
      const iconImg = optimizedPic.querySelector('img');
      iconImg.classList.add('recipe-home--icon-section-img');
      iconSection.append(optimizedPic);
    }
  }
  moveInstrumentation(iconRow, iconSection);
  moveInstrumentation(iconAltRow, iconSection);

  // Text Section
  const textSection = document.createElement('div');
  textSection.classList.add(
    'recipe-home--text-section',
    'animate-enter-fade-up-short',
    'animate-delay-3',
  );

  const title = document.createElement('h2');
  title.classList.add('recipe-home--title');
  if (titleRow) {
    moveInstrumentation(titleRow, title);
    title.textContent = titleRow.textContent.trim();
  }

  const description = document.createElement('div');
  description.classList.add('recipe-home--desc', 'bodyMediumRegular');
  if (descriptionRow) {
    moveInstrumentation(descriptionRow, description);
    // FIX: Read innerHTML directly from the descriptionRow (which is a cell wrapper)
    // or from its first child if it's a <p> inside a <div>.
    // The BlockJson says 'description' is richtext, so innerHTML is correct.
    description.innerHTML = descriptionRow.innerHTML;
  }

  textSection.append(title, description);
  cellLarge10.append(iconSection, textSection);
  imageTextGrid.append(cellLarge10);
  gridX.append(imageTextGrid);

  // Recipe Cards Wrapper
  const recipeHomeWrapper = document.createElement('div');
  recipeHomeWrapper.classList.add('cell', 'small-12', 'recipe-home--wrapper');

  const swiperEl = document.createElement('div');
  // FIX: Removed swiper-initialized, swiper-horizontal, swiper-backface-hidden as Swiper adds them
  swiperEl.classList.add('swiper', 'swipper--full-view-padding', 'recipe-home--wrapper--in');

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

  const swiperWrapper = document.createElement('ul');
  swiperWrapper.classList.add('swiper-wrapper', 'recipe-home--list');

  recipeCardRows
    .filter((row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      // FIX: Added moveInstrumentation for each cell in the recipe card row
      const [
        recipeLinkCell,
        imageDesktopCell,
        imageMobileCell,
        imageAltCell,
        tagCell,
        nameCell,
        descriptionCell,
        stepsCountCell,
        stepsLabelCell,
        ingredientsCountCell,
        ingredientsLabelCell,
      ] = [...row.children];

      const listItem = document.createElement('li');
      listItem.classList.add('swiper-slide', 'recipe-home--list-item');

      const recipeLink = document.createElement('a');
      recipeLink.classList.add('recipe-card-grid-view--link');
      const foundLink = recipeLinkCell?.querySelector('a');
      if (foundLink) {
        recipeLink.href = foundLink.href;
        recipeLink.title = nameCell?.textContent.trim() || '';
        recipeLink.setAttribute('aria-label', nameCell?.textContent.trim() || '');
        moveInstrumentation(recipeLinkCell, recipeLink); // FIX: moveInstrumentation for aem-content link
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

      const tagMobile = document.createElement('div');
      tagMobile.classList.add(
        'recipe-tag-mobile',
        'animate-enter-fade-up-short',
        'animate-delay-9',
      );
      const tagDiv = document.createElement('div');
      tagDiv.classList.add('tag', 'bg--brand-green');
      const tagLabel = document.createElement('span');
      tagLabel.classList.add('tag__label');
      tagLabel.textContent = tagCell?.textContent.trim() || '';
      tagDiv.append(tagLabel);
      tagMobile.append(tagDiv);
      moveInstrumentation(tagCell, tagMobile); // FIX: moveInstrumentation for tag cell

      let recipePicture = null;
      if (imageDesktopCell || imageMobileCell) {
        const desktopPic = imageDesktopCell?.querySelector('picture');
        const mobilePic = imageMobileCell?.querySelector('picture');
        const imgAlt = imageAltCell?.textContent.trim() || '';

        if (desktopPic) {
          const desktopImg = desktopPic.querySelector('img');
          const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, imgAlt, false, [{ media: '(min-width: 768px)', width: '750' }]);
          moveInstrumentation(imageDesktopCell, optimizedDesktopPic.querySelector('img'));
          recipePicture = optimizedDesktopPic;
        } else if (mobilePic) {
          const mobileImg = mobilePic.querySelector('img');
          const optimizedMobilePic = createOptimizedPicture(mobileImg.src, imgAlt, false, [{ width: '750' }]);
          moveInstrumentation(imageMobileCell, optimizedMobilePic.querySelector('img'));
          recipePicture = optimizedMobilePic;
        }
        moveInstrumentation(imageAltCell, imgContainer); // FIX: moveInstrumentation for imageAlt cell
      }

      if (recipePicture) {
        imgContainer.append(tagMobile, recipePicture);
      }

      const recipeDetails = document.createElement('div');
      recipeDetails.classList.add('cell', 'small-12', 'medium-12', 'large-6', 'recipe-details');

      const recipeInfo = document.createElement('div');
      recipeInfo.classList.add('recipe-info');

      const recipeName = document.createElement('div');
      recipeName.classList.add(
        'recipe-name',
        'labelLargeBold',
        'animate-enter-fade-up-short',
        'animate-delay-9',
      );
      recipeName.textContent = nameCell?.textContent.trim() || '';
      moveInstrumentation(nameCell, recipeName); // FIX: moveInstrumentation for name cell

      const descGrid = document.createElement('div');
      descGrid.classList.add('grid-x');
      const descCell = document.createElement('div');
      descCell.classList.add(
        'cell',
        'recipe-description',
        'bodySmallRegular',
        'animate-enter-fade-up-short',
        'animate-delay-11',
      );
      descCell.textContent = descriptionCell?.textContent.trim() || '';
      descGrid.append(descCell);
      moveInstrumentation(descriptionCell, descCell); // FIX: moveInstrumentation for description cell

      const stepsIngredientsGrid = document.createElement('div');
      stepsIngredientsGrid.classList.add('grid-x');
      const stepsIngredientsCell = document.createElement('div');
      stepsIngredientsCell.classList.add(
        'cell',
        'recipe-steps-and-ingredients',
        'animate-enter-fade-up-short',
        'animate-delay-11',
      );

      const stepsContainer = document.createElement('div');
      stepsContainer.classList.add('recipe-steps-container');
      const stepsCount = document.createElement('span');
      stepsCount.classList.add('recipe-steps-count', 'labelSmallBold');
      stepsCount.textContent = stepsCountCell?.textContent.trim() || '';
      const stepsLabel = document.createElement('span');
      stepsLabel.classList.add('recipe-steps-label', 'utilityTagHighCaps');
      stepsLabel.textContent = stepsLabelCell?.textContent.trim() || '';
      stepsContainer.append(stepsCount, stepsLabel);
      moveInstrumentation(stepsCountCell, stepsCount); // FIX: moveInstrumentation for stepsCount cell
      moveInstrumentation(stepsLabelCell, stepsLabel); // FIX: moveInstrumentation for stepsLabel cell

      const stepsSeparator = document.createElement('div');
      stepsSeparator.classList.add('recipe-steps-separator');

      const ingredientsContainer = document.createElement('div');
      ingredientsContainer.classList.add('recipe-ingredients-container');
      const ingredientsCount = document.createElement('span');
      ingredientsCount.classList.add('recipe-ingredients-count', 'labelSmallBold');
      ingredientsCount.textContent = ingredientsCountCell?.textContent.trim() || '';
      const ingredientsLabel = document.createElement('span');
      ingredientsLabel.classList.add('recipe-ingredients-label', 'utilityTagHighCaps');
      ingredientsLabel.textContent = ingredientsLabelCell?.textContent.trim() || '';
      ingredientsContainer.append(ingredientsCount, ingredientsLabel);
      moveInstrumentation(ingredientsCountCell, ingredientsCount); // FIX: moveInstrumentation for ingredientsCount cell
      moveInstrumentation(ingredientsLabelCell, ingredientsLabel); // FIX: moveInstrumentation for ingredientsLabel cell

      stepsIngredientsCell.append(stepsContainer, stepsSeparator, ingredientsContainer);
      stepsIngredientsGrid.append(stepsIngredientsCell);

      const tagDesktop = document.createElement('div');
      tagDesktop.classList.add(
        'recipe-tag-desktop',
        'animate-enter-fade-up-short',
        'animate-delay-9',
      );
      const tagDivDesktop = document.createElement('div');
      tagDivDesktop.classList.add('tag', 'bg--brand-green');
      const tagLabelDesktop = document.createElement('span');
      tagLabelDesktop.classList.add('tag__label');
      tagLabelDesktop.textContent = tagCell?.textContent.trim() || '';
      tagDivDesktop.append(tagLabelDesktop);
      tagDesktop.append(tagDivDesktop);

      recipeInfo.append(
        recipeName,
        descGrid,
        stepsIngredientsGrid,
        tagDesktop,
      );
      recipeDetails.append(recipeInfo);
      recipeCard.append(imgContainer, recipeDetails);
      recipeLink.append(recipeCard);
      listItem.append(recipeLink);
      moveInstrumentation(row, listItem);
    });

  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add(
    'recipe-home--pagination',
    'animate-enter-fade-left-long',
    'animate-delay-8',
  );
  const swiperPagination = document.createElement('div');
  // FIX: Removed swiper-pagination-clickable, swiper-pagination-bullets, swiper-pagination-horizontal as Swiper adds them
  swiperPagination.classList.add(
    'swiper-pagination',
  );
  paginationDiv.append(swiperPagination);

  swiperEl.append(prevBtnControl, nextBtnControl, swiperWrapper, paginationDiv);
  recipeHomeWrapper.append(swiperEl);
  gridX.append(recipeHomeWrapper);

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
    ctaLink.setAttribute('rel', 'follow');
    moveInstrumentation(ctaLinkRow, ctaLink); // FIX: moveInstrumentation for ctaLink cell
  }
  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('button-text');
  ctaSpan.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaLink.append(ctaSpan);

  ctaCell.append(ctaLink);
  ctaContainer.append(ctaCell);
  moveInstrumentation(ctaLabelRow, ctaSpan); // FIX: moveInstrumentation for ctaLabel cell

  section.append(gridX, ctaContainer);
  block.replaceChildren(section);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
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
      el: swiperPagination,
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
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}
