import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, containerRow, ...articleRows] = [...block.children];

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

  const gridXWrapper = document.createElement('div');
  gridXWrapper.classList.add('grid-x');
  root.append(gridXWrapper);

  const carouselWrapperCell = document.createElement('div');
  carouselWrapperCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-11', 'sustainability-article-carousel__wrapper');
  moveInstrumentation(containerRow, carouselWrapperCell); // Move instrumentation from the container placeholder
  gridXWrapper.append(carouselWrapperCell);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('swiper', 'swipper--full-view-padding', 'sustainability-article-carousel__wrapper--inner');
  carouselWrapperCell.append(swiperEl);

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
  swiperEl.append(prevBtnControl);

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
  swiperEl.append(nextBtnControl);

  const swiperWrapper = document.createElement('ul');
  swiperWrapper.classList.add('swiper-wrapper', 'sustainability-article-carousel__list');
  swiperEl.append(swiperWrapper);

  articleRows.forEach((row) => {
    const [tagLabelCell, imageDesktopCell, imageMobileCell, linkCell, articleTitleCell, descriptionCell, readingDurationCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'sustainability-article-carousel__list-item', 'animate-enter-fade-left-short', 'animate-delay-1');
    moveInstrumentation(row, listItem);

    const articleLink = document.createElement('a');
    articleLink.classList.add('sustainability-card', 'elevation-2', 'has-hover');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      articleLink.href = foundLink.href;
      articleLink.setAttribute('aria-label', articleTitleCell.textContent.trim());
    }
    listItem.append(articleLink);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('sustainability-card__img-container', 'animate-enter-fade', 'animate-delay-5');
    articleLink.append(imgContainer);

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

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    if (pictureDesktop) {
      const img = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 0px)', width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imgContainer.append(optimizedPic);
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('sustainability-card__content');
    articleLink.append(contentDiv);

    const innerContentDiv = document.createElement('div');
    contentDiv.append(innerContentDiv);

    const articleTitleDiv = document.createElement('div');
    articleTitleDiv.classList.add('sustainability-card__title', 'animate-enter-fade-up-short', 'animate-delay-7');
    const articleTitleSpan = document.createElement('span');
    articleTitleSpan.classList.add('labelLargeBold');
    articleTitleSpan.textContent = articleTitleCell.textContent.trim();
    articleTitleDiv.append(articleTitleSpan);
    innerContentDiv.append(articleTitleDiv);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('sustainability-card__description', 'animate-enter-fade-up-short', 'animate-delay-9');
    const bodyMediumRegularDiv = document.createElement('div');
    bodyMediumRegularDiv.classList.add('bodyMediumRegular');
    bodyMediumRegularDiv.innerHTML = descriptionCell.innerHTML;
    descriptionDiv.append(bodyMediumRegularDiv);
    innerContentDiv.append(descriptionDiv);

    const signInTooltip = document.createElement('div');
    signInTooltip.classList.add('signIn-Info-Tooltip', 'animate-enter-fade-up-short', 'animate-delay-9');
    contentDiv.append(signInTooltip);

    const readingDurationDiv = document.createElement('div');
    readingDurationDiv.classList.add('sustainability-card__reading-duration');
    const readingDurationSpan = document.createElement('span');
    readingDurationSpan.classList.add('labelSmallBold', 'animate-enter-fade-up-short', 'animate-delay-11');
    readingDurationSpan.textContent = readingDurationCell.textContent.trim();
    readingDurationDiv.append(readingDurationSpan);
    const readingDurationSuffixSpan = document.createElement('span');
    readingDurationSuffixSpan.classList.add('utilityTagHighCaps', 'text-uppercase', 'sustainability-card__reading-duration-suffix', 'animate-enter-fade-up-short', 'animate-delay-13');
    readingDurationSuffixSpan.textContent = 'mins';
    readingDurationDiv.append(readingDurationSuffixSpan);
    contentDiv.append(readingDurationDiv);

    swiperWrapper.append(listItem);
  });

  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('sustainability-article-carousel__pagination', 'animate-enter-fade-left-short', 'animate-delay-3');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination'); // Removed swiper-pagination-clickable, swiper-pagination-bullets, swiper-pagination-horizontal, swiper-pagination-lock as Swiper adds these
  paginationDiv.append(swiperPagination);
  swiperEl.append(paginationDiv);

  block.replaceChildren(root);

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
      el: swiperPagination,
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
}
