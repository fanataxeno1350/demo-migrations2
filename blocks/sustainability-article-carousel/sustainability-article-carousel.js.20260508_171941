import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, ...articleRows] = [...block.children];

  const root = document.createElement('section');
  root.classList.add('sustainability-article-carousel', 'grid-container', 'bg--paper-green', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');
  root.append(maxWidthContainer);

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x');
  maxWidthContainer.append(gridX);

  const cell = document.createElement('div');
  cell.classList.add('cell', 'small-12', 'large-10', 'large-offset-1', 'xlarge-8', 'xlarge-offset-2');
  gridX.append(cell);

  const textSection = document.createElement('div');
  textSection.classList.add('sustainability-article-carousel__text-section');
  cell.append(textSection);

  const title = document.createElement('h2');
  title.classList.add('sustainability-article-carousel__title', 'animate-enter-fade-up-short');
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.textContent.trim();
  textSection.append(title);

  const carouselGridX = document.createElement('div');
  carouselGridX.classList.add('grid-x');
  root.append(carouselGridX);

  const carouselCell = document.createElement('div');
  carouselCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-11', 'sustainability-article-carousel__wrapper');
  carouselCell.style.marginLeft = '0px';
  carouselCell.style.paddingLeft = '0px';
  carouselCell.style.width = '100%';
  carouselGridX.append(carouselCell);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'swipper--full-view-padding', 'sustainability-article-carousel__wrapper--inner');
  carouselCell.append(swiperEl);

  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--prev', 'show-for-large');
  swiperEl.append(prevBtnControl);

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  prevBtnControl.append(prevBtn);

  const nextBtnControl = document.createElement('div');
  nextBtnControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--next', 'show-for-large');
  swiperEl.append(nextBtnControl);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  nextBtnControl.append(nextBtn);

  const swiperWrapper = document.createElement('ul');
  swiperWrapper.classList.add('swiper-wrapper', 'sustainability-article-carousel__list');
  swiperEl.append(swiperWrapper);

  articleRows.forEach((row) => {
    const [tagCell, imageCell, articleTitleCell, descriptionCell, linkCell, readingDurationCell, readingDurationSuffixCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'sustainability-article-carousel__list-item', 'animate-enter-fade-left-short', 'animate-delay-1');
    moveInstrumentation(row, listItem);

    const link = document.createElement('a');
    link.classList.add('sustainability-card', 'elevation-2', 'has-hover');
    link.href = linkCell?.querySelector('a')?.href || '#';
    link.setAttribute('aria-label', articleTitleCell?.textContent.trim() || '');
    listItem.append(link);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('sustainability-card__img-container', 'animate-enter-fade', 'animate-delay-5');
    link.append(imgContainer);

    const tagDiv = document.createElement('div');
    tagDiv.classList.add('sustainability-card__tag');
    imgContainer.append(tagDiv);

    const tagInner = document.createElement('div');
    tagInner.classList.add('tag', 'bg--brand-green');
    tagDiv.append(tagInner);

    const tagLabel = document.createElement('span');
    tagLabel.classList.add('tag__label');
    tagLabel.textContent = tagCell?.textContent.trim() || '';
    tagInner.append(tagLabel);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation should be called on the original picture element if it's being replaced,
        // or on the new img element if the original img is being replaced within the picture.
        // Here, we're replacing the whole picture, so instrument the new picture.
        moveInstrumentation(picture, optimizedPic);
        imgContainer.append(optimizedPic);
      }
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('sustainability-card__content');
    link.append(contentDiv);

    const contentInnerDiv = document.createElement('div');
    contentDiv.append(contentInnerDiv);

    const articleTitleDiv = document.createElement('div');
    articleTitleDiv.classList.add('sustainability-card__title', 'animate-enter-fade-up-short', 'animate-delay-7');
    contentInnerDiv.append(articleTitleDiv);

    const articleTitleSpan = document.createElement('span');
    articleTitleSpan.classList.add('labelLargeBold');
    articleTitleSpan.textContent = articleTitleCell?.textContent.trim() || '';
    articleTitleDiv.append(articleTitleSpan);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('sustainability-card__description', 'animate-enter-fade-up-short', 'animate-delay-9');
    contentInnerDiv.append(descriptionDiv);

    const bodyMediumRegular = document.createElement('div');
    bodyMediumRegular.classList.add('bodyMediumRegular');
    bodyMediumRegular.innerHTML = descriptionCell?.innerHTML || '';
    descriptionDiv.append(bodyMediumRegular);

    const signInTooltip = document.createElement('div');
    signInTooltip.classList.add('signIn-Info-Tooltip', 'animate-enter-fade-up-short', 'animate-delay-9');
    contentDiv.append(signInTooltip);

    const readingDurationDiv = document.createElement('div');
    readingDurationDiv.classList.add('sustainability-card__reading-duration');
    contentDiv.append(readingDurationDiv);

    const readingDurationSpan = document.createElement('span');
    readingDurationSpan.classList.add('labelSmallBold', 'animate-enter-fade-up-short', 'animate-delay-11');
    readingDurationSpan.textContent = readingDurationCell?.textContent.trim() || '';
    readingDurationDiv.append(readingDurationSpan);

    const readingDurationSuffixSpan = document.createElement('span');
    readingDurationSuffixSpan.classList.add('utilityTagHighCaps', 'text-uppercase', 'sustainability-card__reading-duration-suffix', 'animate-enter-fade-up-short', 'animate-delay-13');
    readingDurationSuffixSpan.textContent = readingDurationSuffixCell?.textContent.trim() || '';
    readingDurationDiv.append(readingDurationSuffixSpan);

    swiperWrapper.append(listItem);
  });

  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('sustainability-article-carousel__pagination', 'animate-enter-fade-left-short', 'animate-delay-3');
  swiperEl.append(paginationDiv);

  const swiperPagination = document.createElement('div');
  // Swiper adds 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal' automatically
  swiperPagination.classList.add('swiper-pagination');
  paginationDiv.append(swiperPagination);

  block.replaceChildren(root);

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
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });
}
