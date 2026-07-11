import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [arrowLeftIconRow, arrowRightIconRow, ...slideRows] = [...block.children];

  const carouselWrapper = document.createElement('div');
  // carouselWrapper.classList.add('cmp-carousel'); // Outer block div already has 'carousel' class from AEM.
  carouselWrapper.classList.add('panelcontainer'); // Add 'panelcontainer' from original HTML
  moveInstrumentation(block, carouselWrapper);

  const carouselContent = document.createElement('div');
  carouselContent.classList.add('cmp-carousel__content');
  carouselContent.setAttribute('aria-atomic', 'false');
  carouselContent.setAttribute('aria-live', 'polite');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('swiper-wrapper');

  slideRows.forEach((row, index) => {
    const [desktopImageCell, mobileImageCell, slideLinkCell] = [...row.children];

    const slideItem = document.createElement('div');
    slideItem.classList.add('cmp-carousel__item', 'swiper-slide');
    if (index === 0) {
      slideItem.classList.add('cmp-carousel__item--active');
    }
    slideItem.setAttribute('role', 'tabpanel');
    slideItem.setAttribute('aria-roledescription', 'slide');
    slideItem.setAttribute('aria-label', `Slide ${index + 1} of ${slideRows.length}`);
    moveInstrumentation(row, slideItem);

    const teaser = document.createElement('div');
    teaser.classList.add('teaser', 'cmp-teaser--first-component');

    const cmpTeaser = document.createElement('div');
    cmpTeaser.classList.add('cmp-teaser');

    const slideLink = slideLinkCell?.querySelector('a');
    let anchorElement = cmpTeaser;
    if (slideLink) {
      anchorElement = document.createElement('a');
      anchorElement.classList.add('cmp-teaser__link');
      anchorElement.href = slideLink.href;
      cmpTeaser.append(anchorElement);
    }

    const teaserImage = document.createElement('div');
    teaserImage.classList.add('cmp-teaser__image');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('cmp-image');

    const desktopPicture = desktopImageCell.querySelector('picture');
    const mobilePicture = mobileImageCell.querySelector('picture');

    if (desktopPicture || mobilePicture) {
      const picture = document.createElement('picture');
      if (mobilePicture) {
        const mobileSource = document.createElement('source');
        mobileSource.setAttribute('media', '(max-width:767px)');
        mobileSource.srcset = mobilePicture.querySelector('img')?.src;
        picture.append(mobileSource);
      }
      if (desktopPicture) {
        const img = desktopPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          const optimizedImg = optimizedPic.querySelector('img');
          optimizedImg.classList.add('cmp-image__image');
          picture.append(optimizedImg);
          moveInstrumentation(img, optimizedImg);
        }
      }
      imageWrapper.append(picture);
    }
    teaserImage.append(imageWrapper);
    anchorElement.append(teaserImage);
    teaser.append(cmpTeaser);
    slideItem.append(teaser);
    slidesContainer.append(slideItem);
  });

  carouselContent.append(slidesContainer);

  const carouselActions = document.createElement('div');
  carouselActions.classList.add('cmp-carousel__actions');

  const prevButton = document.createElement('button');
  prevButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');

  const prevIconSpan = document.createElement('span');
  prevIconSpan.classList.add('cmp-carousel__action-icon');
  const prevIconImg = arrowLeftIconRow.querySelector('img');
  if (prevIconImg) {
    prevIconSpan.innerHTML = `<img src="${prevIconImg.src}" alt="${prevIconImg.alt}">`;
    moveInstrumentation(prevIconImg, prevIconSpan.querySelector('img'));
  }
  prevButton.append(prevIconSpan);

  const nextButton = document.createElement('button');
  nextButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');

  const nextIconSpan = document.createElement('span');
  nextIconSpan.classList.add('cmp-carousel__action-icon');
  const nextIconImg = arrowRightIconRow.querySelector('img');
  if (nextIconImg) {
    nextIconSpan.innerHTML = `<img src="${nextIconImg.src}" alt="${nextIconImg.alt}">`;
    moveInstrumentation(nextIconImg, nextIconSpan.querySelector('img'));
  }
  nextButton.append(nextIconSpan);

  carouselActions.append(prevButton, nextButton);
  carouselContent.append(carouselActions);

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('cmp-carousel__indicators');
  carouselIndicators.setAttribute('role', 'tablist');
  carouselIndicators.setAttribute('aria-label', 'Choose a slide to display');

  slideRows.forEach((_, index) => {
    const indicator = document.createElement('li');
    indicator.classList.add('cmp-carousel__indicator');
    if (index === 0) {
      indicator.classList.add('cmp-carousel__indicator--active');
    }
    carouselIndicators.append(indicator);
  });

  carouselContent.append(carouselIndicators);
  carouselWrapper.append(carouselContent);

  block.replaceChildren(carouselWrapper);

  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(carouselContent, { // Initialize Swiper on carouselContent, not carouselWrapper
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: carouselIndicators,
      clickable: true,
    },
    autoplay: {
      delay: 15000,
      disableOnInteraction: false,
    },
  });
}
