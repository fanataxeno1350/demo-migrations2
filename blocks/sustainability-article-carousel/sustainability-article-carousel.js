import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [carouselTitleRow, containerRow, ...articleRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('sustainability-article-carousel', 'grid-container', 'bg--paper-green', 'animate-enter', 'in-view');
  moveInstrumentation(block, section);

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x');

  const cell = document.createElement('div');
  cell.classList.add('cell', 'small-12', 'large-10', 'large-offset-1', 'xlarge-8', 'xlarge-offset-2');

  const textSection = document.createElement('div');
  textSection.classList.add('sustainability-article-carousel__text-section');

  const title = document.createElement('h2');
  title.classList.add('sustainability-article-carousel__title', 'animate-enter-fade-up-short');
  moveInstrumentation(carouselTitleRow, title);
  title.textContent = carouselTitleRow.textContent.trim();
  textSection.append(title);
  cell.append(textSection);
  gridX.append(cell);
  maxWidthContainer.append(gridX);
  section.append(maxWidthContainer);

  const wrapperGridX = document.createElement('div');
  wrapperGridX.classList.add('grid-x');

  const wrapperCell = document.createElement('div');
  wrapperCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-11', 'sustainability-article-carousel__wrapper');
  moveInstrumentation(containerRow, wrapperCell); // Move instrumentation from the container row

  const swiperEl = document.createElement('div');
  // Removed swiper-initialized, swiper-horizontal, swiper-backface-hidden as Swiper adds them automatically
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
    const [tagLabelCell, imageDesktopCell, imageMobileCell, articleLinkCell, titleCell, descriptionCell, readingDurationCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'sustainability-article-carousel__list-item', 'animate-enter-fade-left-short', 'animate-delay-1');

    const articleLink = document.createElement('a');
    articleLink.classList.add('sustainability-card', 'elevation-2', 'has-hover');
    const foundLink = articleLinkCell.querySelector('a');
    if (foundLink) {
      articleLink.href = foundLink.href;
      articleLink.setAttribute('aria-label', titleCell.textContent.trim());
    }
    moveInstrumentation(row, articleLink);

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

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop) {
      const img = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 0px)', width: '750' }]);
      imgContainer.append(optimizedPic);
    } else if (pictureMobile) {
      const img = pictureMobile.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 0px)', width: '750' }]);
      imgContainer.append(optimizedPic);
    }

    articleLink.append(imgContainer);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('sustainability-card__content');

    const innerContentDiv = document.createElement('div');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('sustainability-card__title', 'animate-enter-fade-up-short', 'animate-delay-7');
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('labelLargeBold');
    // titleCell is type=text, so textContent.trim() is correct.
    titleSpan.innerHTML = titleCell.textContent.trim();
    titleDiv.append(titleSpan);
    innerContentDiv.append(titleDiv);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('sustainability-card__description', 'animate-enter-fade-up-short', 'animate-delay-9');
    const bodyMediumRegularDiv = document.createElement('div');
    bodyMediumRegularDiv.classList.add('bodyMediumRegular');
    // descriptionCell is type=richtext, so innerHTML is correct.
    // Ensure it's not assigned to a <p> element to avoid <p><p> nesting.
    bodyMediumRegularDiv.innerHTML = descriptionCell.innerHTML;
    descriptionDiv.append(bodyMediumRegularDiv);
    innerContentDiv.append(descriptionDiv);

    contentDiv.append(innerContentDiv);

    const signInTooltip = document.createElement('div');
    signInTooltip.classList.add('signIn-Info-Tooltip', 'animate-enter-fade-up-short', 'animate-delay-9');
    contentDiv.append(signInTooltip);

    const readingDurationDiv = document.createElement('div');
    readingDurationDiv.classList.add('sustainability-card__reading-duration');
    const readingDurationSpan = document.createElement('span');
    readingDurationSpan.classList.add('labelSmallBold', 'animate-enter-fade-up-short', 'animate-delay-11');
    readingDurationSpan.textContent = readingDurationCell.textContent.trim();
    readingDurationDiv.append(readingDurationSpan);

    const suffixSpan = document.createElement('span');
    suffixSpan.classList.add('utilityTagHighCaps', 'text-uppercase', 'sustainability-card__reading-duration-suffix', 'animate-enter-fade-up-short', 'animate-delay-13');
    suffixSpan.textContent = ' mins';
    readingDurationDiv.append(suffixSpan);
    contentDiv.append(readingDurationDiv);

    articleLink.append(contentDiv);
    listItem.append(articleLink);
    swiperWrapper.append(listItem);
  });

  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('sustainability-article-carousel__pagination', 'animate-enter-fade-left-short', 'animate-delay-3');
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  paginationDiv.append(swiperPagination);

  swiperEl.append(prevBtnControl, nextBtnControl, swiperWrapper, paginationDiv);
  wrapperCell.append(swiperEl);
  wrapperGridX.append(wrapperCell);
  section.append(wrapperGridX);

  block.replaceChildren(section);

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
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });
}
