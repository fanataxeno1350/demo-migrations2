import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    headingRow,
    subHeadingRow,
    ctaLinkRow,
    ctaLabelRow,
    cardsContainerRow, // This is the placeholder for the 'cards' container field
    ...recipeCardRows
  ] = [...block.children];

  const recipeCardsWrapper = document.createElement('div');
  recipeCardsWrapper.classList.add('cmp-cards', 'cmp-cards--recipe');
  moveInstrumentation(block, recipeCardsWrapper); // Move instrumentation from block to new wrapper

  const heading = document.createElement('h2');
  heading.classList.add('cmp-cards__heading');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  recipeCardsWrapper.append(heading);

  const subHeading = document.createElement('p');
  subHeading.classList.add('cmp-cards__sub-heading', 'body-3');
  moveInstrumentation(subHeadingRow, subHeading);
  subHeading.textContent = subHeadingRow.textContent.trim();
  recipeCardsWrapper.append(subHeading);

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');
  moveInstrumentation(cardsContainerRow, carouselWrapper); // Move instrumentation from container placeholder

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  cmpCarousel.dataset.component = 'carousel';
  cmpCarousel.dataset.showInfiniteScroll = 'false';
  cmpCarousel.dataset.showArrows = 'true';
  cmpCarousel.dataset.showDots = 'true';
  cmpCarousel.dataset.itemCountPerSlide = '3';
  cmpCarousel.dataset.autoPlayIsEnabled = 'false';
  cmpCarousel.dataset.autoPlaySpeedInMs = '3000';
  cmpCarousel.dataset.revealNextItemPartially = 'false';
  cmpCarousel.dataset.showCenterZoom = 'false';
  cmpCarousel.dataset.slidesToScroll = '3';
  // cmpCarousel.dataset.initialized = 'true'; // Slick.js adds this, do not manually add

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container');

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('aria-disabled', 'true');
  prevBtn.textContent = 'Previous';

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  recipeCardRows.forEach((row, index) => {
    const [imageCell, cardLinkCell, titleCell, tagCell, timeCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      carouselItem.classList.add('slick-current', 'slick-active');
    }
    carouselItem.dataset.slickIndex = index;
    carouselItem.setAttribute('aria-hidden', index !== 0);
    carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.id = `slick-slide2${index}`;
    carouselItem.setAttribute('aria-describedby', `slick-slide-control2${Math.floor(index / 3)}`); // Corrected aria-describedby

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'cmp-card--recipe');

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');

    const cmpCardMedia = document.createElement('div');
    cmpCardMedia.classList.add('cmp-card__media');

    const cmpCardOptions = document.createElement('div');
    cmpCardOptions.classList.add('cmp-card__options');
    const threeDots = document.createElement('div');
    threeDots.classList.add('cmp-card__three-dots', 'icon-open-card-popup');
    cmpCardOptions.append(threeDots);

    const cmpCardImage = document.createElement('div');
    cmpCardImage.classList.add('cmp-card__image');
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    const cardLink = cardLinkCell?.querySelector('a')?.href;
    if (cardLink) {
      lazyImageContainer.dataset.redirectionUrl = cardLink;
    }

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      lazyImageContainer.append(optimizedPic);
    }
    cmpCardImage.append(lazyImageContainer);

    cmpCardMedia.append(cmpCardOptions, cmpCardImage);

    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');

    const cmpCardTag = document.createElement('div');
    cmpCardTag.classList.add('cmp-card__tag');
    const tagWrapper = document.createElement('div');
    tagWrapper.classList.add('cmp-card__tag-wrapper');
    const tagP = document.createElement('p');
    tagP.textContent = tagCell?.textContent.trim() || '';
    tagWrapper.append(tagP);
    cmpCardTag.append(tagWrapper);

    const cmpCardTitle = document.createElement('div');
    cmpCardTitle.classList.add('cmp-card__title');
    const titleLink = document.createElement('a');
    if (cardLink) {
      titleLink.href = cardLink;
    }
    titleLink.setAttribute('tabindex', index === 0 ? '0' : '-1');
    const titleH5 = document.createElement('h5');
    titleH5.textContent = titleCell?.textContent.trim() || '';
    titleLink.append(titleH5);
    cmpCardTitle.append(titleLink);

    const cmpCardTime = document.createElement('div');
    cmpCardTime.classList.add('cmp-card__time-in-minutes', 'desc-1');
    cmpCardTime.textContent = `Time: ${timeCell?.textContent.trim() || ''}`;

    cmpCardInfo.append(cmpCardTag, cmpCardTitle, cmpCardTime);
    cmpCardContent.append(cmpCardMedia, cmpCardInfo);
    cmpCard.append(cmpCardContent);
    cardDiv.append(cmpCard);
    carouselItem.append(cardDiv);
    slickTrack.append(carouselItem);

    moveInstrumentation(row, carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(prevBtn, slickList);
  cmpCarousel.append(carouselContainer);
  carouselWrapper.append(cmpCarousel);
  recipeCardsWrapper.append(carouselWrapper);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('slick-next', 'slick-arrow');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.setAttribute('type', 'button');
  nextBtn.textContent = 'Next';
  carouselContainer.append(nextBtn);

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');
  const totalSlides = Math.ceil(recipeCardRows.length / 3); // Assuming 3 items per slide
  for (let i = 0; i < totalSlides; i += 1) {
    const li = document.createElement('li');
    if (i === 0) {
      li.classList.add('slick-active');
    }
    li.setAttribute('role', 'presentation');
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.id = `slick-slide-control2${i}`;
    button.setAttribute('aria-controls', `slick-slide2${i * 3}`); // Corrected aria-controls
    button.setAttribute('aria-label', `${i + 1} of ${totalSlides}`); // Corrected aria-label
    button.setAttribute('tabindex', i === 0 ? '0' : '-1');
    if (i === 0) {
      button.setAttribute('aria-selected', 'true');
    }
    button.textContent = i + 1;
    li.append(button);
    slickDots.append(li);
  }
  carouselContainer.append(slickDots);

  const ctaButtonDiv = document.createElement('div');
  ctaButtonDiv.classList.add('button', 'cmp-button--primary-anchor', 'cmp-button--primary-anchor-undefined', 'cards-cta-button');
  moveInstrumentation(ctaLinkRow, ctaButtonDiv); // Move instrumentation from CTA link row

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('cmp-button');
  const ctaHref = ctaLinkRow?.querySelector('a')?.href;
  if (ctaHref) {
    ctaLink.href = ctaHref;
  }
  ctaLink.setAttribute('target', '_self');

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('cmp-button__text');
  ctaSpan.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaLink.append(ctaSpan);
  ctaButtonDiv.append(ctaLink);
  recipeCardsWrapper.append(ctaButtonDiv);

  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  recipeCardsWrapper.append(shareDiv);

  block.replaceChildren(recipeCardsWrapper);

  // Load Slick.js and initialize carousel
  await loadCSS('https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css');
  await loadScript('https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js');

  // eslint-disable-next-line no-undef
  $(cmpCarousel).slick({ // Use cmpCarousel directly as the element
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: true,
    arrows: true,
    infinite: false,
    prevArrow: prevBtn, // Pass the DOM element directly
    nextArrow: nextBtn, // Pass the DOM element directly
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  // Manually handle slick-dots updates as the library doesn't always re-render them correctly
  const updateSlickDots = () => {
    // eslint-disable-next-line no-undef
    const currentSlide = $(cmpCarousel).slick('slickCurrentSlide');
    slickDots.querySelectorAll('li').forEach((li, i) => {
      li.classList.remove('slick-active');
      li.querySelector('button').setAttribute('aria-selected', 'false');
      li.querySelector('button').setAttribute('tabindex', '-1');
      if (i === Math.floor(currentSlide / 3)) { // Assuming 3 items per slide
        li.classList.add('slick-active');
        li.querySelector('button').setAttribute('aria-selected', 'true');
        li.querySelector('button').setAttribute('tabindex', '0');
      }
    });
  };

  // eslint-disable-next-line no-undef
  $(cmpCarousel).on('afterChange', updateSlickDots);
  updateSlickDots(); // Initial call to set correct active dot
}
