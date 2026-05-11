import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, containerRow, ...articleRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('sustainability-article-carousel', 'grid-container', 'bg--paper-green', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x');

  const cell = document.createElement('div');
  cell.classList.add('cell', 'small-12', 'large-10', 'large-offset-1', 'xlarge-8', 'xlarge-offset-2');

  const textSection = document.createElement('div');
  textSection.classList.add('sustainability-article-carousel__text-section');

  const titleElement = document.createElement('h2');
  titleElement.classList.add('sustainability-article-carousel__title', 'animate-enter-fade-up-short');
  moveInstrumentation(titleRow, titleElement);
  titleElement.textContent = titleRow.textContent.trim();

  textSection.append(titleElement);
  cell.append(textSection);
  gridX.append(cell);
  maxWidthContainer.append(gridX);
  section.append(maxWidthContainer);

  const gridXWrapper = document.createElement('div');
  gridXWrapper.classList.add('grid-x');

  const wrapperCell = document.createElement('div');
  wrapperCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-11', 'sustainability-article-carousel__wrapper');
  moveInstrumentation(containerRow, wrapperCell);

  const swiperEl = document.createElement('div');
  // Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden' as Swiper adds them automatically
  swiperEl.classList.add('swiper', 'swipper--full-view-padding', 'sustainability-article-carousel__wrapper--inner');

  const prevBtnControl = document.createElement('div');
  prevBtnControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--prev', 'show-for-large');
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('swiper-control', 'swiper-button', 'swiper--prev', 'elevation-1');
  prevBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 7L17 7M1 7L6.33333 2M1 7L6.33333 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  prevBtnControl.append(prevBtn);

  const nextBtnControl = document.createElement('div');
  nextBtnControl.classList.add('sustainability-article-carousel__btn-control', 'sustainability-article-carousel--next', 'show-for-large');
  const nextBtn = document.createElement('button');
  nextBtn.classList.add('swiper-control', 'swiper-button', 'swiper--next', 'elevation-1');
  nextBtn.innerHTML = `
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 7L1 7M17 7L11.6667 2M17 7L11.6667 12" stroke="#222222" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"></path>
    </svg>
  `;
  nextBtnControl.append(nextBtn);

  const swiperWrapper = document.createElement('ul');
  swiperWrapper.classList.add('swiper-wrapper', 'sustainability-article-carousel__list');

  articleRows.forEach((row) => {
    const [tagLabelCell, imageCell, linkCell, articleTitleCell, descriptionCell, readingDurationCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'sustainability-article-carousel__list-item', 'animate-enter-fade-left-short', 'animate-delay-1');

    const cardLink = document.createElement('a');
    cardLink.classList.add('sustainability-card', 'elevation-2', 'has-hover');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) cardLink.href = foundLink.href;
    moveInstrumentation(row, cardLink);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('sustainability-card__img-container', 'animate-enter-fade', 'animate-delay-5');

    const tagDiv = document.createElement('div');
    tagDiv.classList.add('sustainability-card__tag');
    const tagInnerDiv = document.createElement('div');
    tagInnerDiv.classList.add('tag', 'bg--brand-green');
    const tagLabelSpan = document.createElement('span');
    tagLabelSpan.classList.add('tag__label');
    tagLabelSpan.textContent = tagLabelCell.textContent.trim();
    tagInnerDiv.append(tagLabelSpan);
    tagDiv.append(tagInnerDiv);
    imgContainer.append(tagDiv);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      imgContainer.append(createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]));
    }
    cardLink.append(imgContainer);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('sustainability-card__content');

    const contentInnerDiv = document.createElement('div');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('sustainability-card__title', 'animate-enter-fade-up-short', 'animate-delay-7');
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('labelLargeBold');
    titleSpan.textContent = articleTitleCell.textContent.trim();
    titleDiv.append(titleSpan);
    contentInnerDiv.append(titleDiv);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('sustainability-card__description', 'animate-enter-fade-up-short', 'animate-delay-9');
    const bodyMediumRegularDiv = document.createElement('div');
    bodyMediumRegularDiv.classList.add('bodyMediumRegular');
    bodyMediumRegularDiv.innerHTML = descriptionCell.innerHTML;
    descriptionDiv.append(bodyMediumRegularDiv);
    contentInnerDiv.append(descriptionDiv);

    contentDiv.append(contentInnerDiv);

    const signInTooltip = document.createElement('div');
    signInTooltip.classList.add('signIn-Info-Tooltip', 'animate-enter-fade-up-short', 'animate-delay-9');
    contentDiv.append(signInTooltip);

    const readingDurationDiv = document.createElement('div');
    readingDurationDiv.classList.add('sustainability-card__reading-duration');
    const durationSpan = document.createElement('span');
    durationSpan.classList.add('labelSmallBold', 'animate-enter-fade-up-short', 'animate-delay-11');
    durationSpan.textContent = readingDurationCell.textContent.trim();
    const suffixSpan = document.createElement('span');
    suffixSpan.classList.add('utilityTagHighCaps', 'text-uppercase', 'sustainability-card__reading-duration-suffix', 'animate-enter-fade-up-short', 'animate-delay-13');
    suffixSpan.textContent = 'mins';
    readingDurationDiv.append(durationSpan, suffixSpan);
    contentDiv.append(readingDurationDiv);

    cardLink.append(contentDiv);
    listItem.append(cardLink);
    swiperWrapper.append(listItem);
  });

  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('sustainability-article-carousel__pagination', 'animate-enter-fade-left-short', 'animate-delay-3');
  const swiperPagination = document.createElement('div');
  // Removed 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal' as Swiper adds them automatically
  swiperPagination.classList.add('swiper-pagination');
  paginationDiv.append(swiperPagination);

  swiperEl.append(prevBtnControl, nextBtnControl, swiperWrapper, paginationDiv);
  wrapperCell.append(swiperEl);
  gridXWrapper.append(wrapperCell);
  section.append(gridXWrapper);

  block.replaceChildren(section);

  // Swiper initialization
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
