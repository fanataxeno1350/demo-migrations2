import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [carouselTitleRow, ...articleRows] = [...block.children];

  const root = document.createElement('section');
  root.classList.add('grid-container', 'bg--paper-green', 'animate-enter', 'in-view');

  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.classList.add('max-width-container');
  root.append(maxWidthContainer);

  const gridXTitle = document.createElement('div');
  gridXTitle.classList.add('grid-x');
  maxWidthContainer.append(gridXTitle);

  const cellTitle = document.createElement('div');
  cellTitle.classList.add('cell', 'small-12', 'large-10', 'large-offset-1', 'xlarge-8', 'xlarge-offset-2');
  gridXTitle.append(cellTitle);

  const textSection = document.createElement('div');
  textSection.classList.add('sustainability-article-carousel__text-section');
  cellTitle.append(textSection);

  const title = document.createElement('h2');
  title.classList.add('sustainability-article-carousel__title', 'animate-enter-fade-up-short');
  moveInstrumentation(carouselTitleRow, title);
  // FIX: Replaced direct children[0] access with destructuring for the single cell in carouselTitleRow
  const [carouselTitleCell] = [...carouselTitleRow.children];
  title.textContent = carouselTitleCell?.textContent.trim() || '';
  textSection.append(title);

  const gridXCarousel = document.createElement('div');
  gridXCarousel.classList.add('grid-x');
  root.append(gridXCarousel);

  const cellCarousel = document.createElement('div');
  cellCarousel.classList.add('cell', 'small-12', 'large-offset-1', 'large-11', 'sustainability-article-carousel__wrapper');
  gridXCarousel.append(cellCarousel);

  const swiperEl = document.createElement('div');
  // FIX: Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-backface-hidden' as Swiper adds these automatically
  swiperEl.classList.add('swiper', 'swipper--full-view-padding', 'sustainability-article-carousel__wrapper--inner');
  cellCarousel.append(swiperEl);

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

  articleRows.forEach((row, index) => {
    const [tagLabelCell, imageDesktopCell, imageMobileCell, titleCell, descriptionCell, readingDurationCell, articleLinkCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('swiper-slide', 'sustainability-article-carousel__list-item', 'animate-enter-fade-left-short', `animate-delay-${index + 1}`);

    const articleLink = document.createElement('a');
    articleLink.classList.add('sustainability-card', 'elevation-2', 'has-hover');
    const foundLink = articleLinkCell?.querySelector('a');
    if (foundLink) articleLink.href = foundLink.href;
    moveInstrumentation(row, articleLink);
    listItem.append(articleLink);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('sustainability-card__img-container', 'animate-enter-fade', 'animate-delay-5');
    articleLink.append(imgContainer);

    const tagDiv = document.createElement('div');
    tagDiv.classList.add('sustainability-card__tag');
    const tagInner = document.createElement('div');
    tagInner.classList.add('tag', 'bg--brand-green');
    const tagLabelSpan = document.createElement('span');
    tagLabelSpan.classList.add('tag__label');
    tagLabelSpan.textContent = tagLabelCell?.textContent.trim() || '';
    tagInner.append(tagLabelSpan);
    tagDiv.append(tagInner);
    imgContainer.append(tagDiv);

    const pictureDesktop = imageDesktopCell?.querySelector('picture');
    const pictureMobile = imageMobileCell?.querySelector('picture');

    if (pictureDesktop || pictureMobile) {
      const picture = document.createElement('picture');
      if (pictureDesktop) {
        pictureDesktop.querySelectorAll('source').forEach((source) => {
          const newSource = document.createElement('source');
          newSource.media = source.media;
          newSource.srcset = source.srcset;
          newSource.sizes = source.sizes;
          picture.append(newSource);
        });
        const img = pictureDesktop.querySelector('img');
        if (img) {
          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt;
          newImg.loading = 'lazy';
          newImg.classList.add('lazyautosizes', 'lazyloaded');
          picture.append(newImg);
        }
      } else if (pictureMobile) {
        pictureMobile.querySelectorAll('source').forEach((source) => {
          const newSource = document.createElement('source');
          newSource.media = source.media;
          newSource.srcset = source.srcset;
          newSource.sizes = source.sizes;
          picture.append(newSource);
        });
        const img = pictureMobile.querySelector('img');
        if (img) {
          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt;
          newImg.loading = 'lazy';
          newImg.classList.add('lazyautosizes', 'lazyloaded');
          picture.append(newImg);
        }
      }
      imgContainer.append(picture);
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('sustainability-card__content');
    articleLink.append(contentDiv);

    const contentInnerDiv = document.createElement('div');
    contentDiv.append(contentInnerDiv);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('sustainability-card__title', 'animate-enter-fade-up-short', 'animate-delay-7');
    const cardTitleSpan = document.createElement('span');
    cardTitleSpan.classList.add('labelLargeBold');
    // FIX: Richtext cell content should be assigned to a div, not directly to a span, to avoid <p>-inside-<p> issues.
    // The span is for styling, the innerHTML should go into a div or directly into the span if it's guaranteed to be plain text.
    // Given it's richtext, it might contain <p> tags, so using a div is safer.
    const titleContentDiv = document.createElement('div');
    titleContentDiv.innerHTML = titleCell?.innerHTML || '';
    cardTitleSpan.append(...titleContentDiv.children); // Append children to avoid <p><p>...</p></p>
    cardTitle.append(cardTitleSpan);
    contentInnerDiv.append(cardTitle);

    const description = document.createElement('div');
    description.classList.add('sustainability-card__description', 'animate-enter-fade-up-short', 'animate-delay-9');
    const descriptionInner = document.createElement('div');
    descriptionInner.classList.add('bodyMediumRegular');
    // FIX: Richtext cell content should be assigned to a div, not directly to a span, to avoid <p>-inside-<p> issues.
    descriptionInner.innerHTML = descriptionCell?.innerHTML || '';
    description.append(descriptionInner);
    contentInnerDiv.append(description);

    const signInTooltip = document.createElement('div');
    signInTooltip.classList.add('signIn-Info-Tooltip', 'animate-enter-fade-up-short', 'animate-delay-9');
    contentInnerDiv.append(signInTooltip);

    const readingDurationDiv = document.createElement('div');
    readingDurationDiv.classList.add('sustainability-card__reading-duration');
    const durationSpan = document.createElement('span');
    durationSpan.classList.add('labelSmallBold', 'animate-enter-fade-up-short', 'animate-delay-11');
    durationSpan.textContent = readingDurationCell?.textContent.trim() || '';
    readingDurationDiv.append(durationSpan);
    const suffixSpan = document.createElement('span');
    suffixSpan.classList.add('utilityTagHighCaps', 'text-uppercase', 'sustainability-card__reading-duration-suffix', 'animate-enter-fade-up-short', 'animate-delay-13');
    suffixSpan.textContent = 'mins';
    readingDurationDiv.append(suffixSpan);
    contentDiv.append(readingDurationDiv);

    swiperWrapper.append(listItem);
  });

  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('sustainability-article-carousel__pagination', 'animate-enter-fade-left-short', 'animate-delay-3');
  const swiperPagination = document.createElement('div');
  // FIX: Added 'swiper-pagination-lock' class from ORIGINAL HTML
  swiperPagination.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal', 'swiper-pagination-lock');
  paginationDiv.append(swiperPagination);
  swiperEl.append(paginationDiv);

  block.replaceChildren(root);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    spaceBetween: 32, // Based on original HTML margin-right: 32px
    // FIX: Added loop: false as per Swiper.js default and common practice for content carousels
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
