import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [arrowLeftIconRow, arrowRightIconRow, ...itemRows] = [...block.children];

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('cmp-carousel');
  carouselWrapper.setAttribute('role', 'group');
  carouselWrapper.setAttribute('aria-live', 'polite');
  carouselWrapper.setAttribute('aria-roledescription', 'carousel');
  carouselWrapper.setAttribute('data-cmp-is', 'carousel');
  carouselWrapper.setAttribute('data-component', 'carousel');
  carouselWrapper.setAttribute('data-auto-play-is-enabled', 'false');
  carouselWrapper.setAttribute('data-show-arrows', 'true');
  carouselWrapper.setAttribute('data-show-dots', 'true');
  carouselWrapper.setAttribute('data-auto-play-speed-in-ms', '15000');
  carouselWrapper.setAttribute('data-cmp-autopause-disabled', '');
  carouselWrapper.setAttribute('data-placeholder-text', 'false');
  moveInstrumentation(block, carouselWrapper);

  const carouselContent = document.createElement('div');
  carouselContent.classList.add('cmp-carousel__content');
  carouselContent.setAttribute('aria-atomic', 'false');
  carouselContent.setAttribute('aria-live', 'polite');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper'); // Swiper adds this class

  itemRows.forEach((row, index) => {
    const [imageDesktopCell, imageMobileCell, linkCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('cmp-carousel__item'); // Swiper adds 'swiper-slide' automatically
    if (index === 0) {
      slide.classList.add('cmp-carousel__item--active');
    }
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${index + 1} of ${itemRows.length}`);
    moveInstrumentation(row, slide);

    const teaser = document.createElement('div');
    teaser.classList.add('teaser', 'cmp-teaser');
    if (index === 0) {
      teaser.classList.add('cmp-teaser--first-component');
    }

    const linkEl = linkCell?.querySelector('a');
    let anchorWrapper = teaser;
    if (linkEl) {
      anchorWrapper = document.createElement('a');
      anchorWrapper.classList.add('cmp-teaser__link');
      anchorWrapper.href = linkEl.href;
      moveInstrumentation(linkCell, anchorWrapper);
      teaser.append(anchorWrapper);
    }

    const teaserImage = document.createElement('div');
    teaserImage.classList.add('cmp-teaser__image');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('cmp-image');
    imageDiv.setAttribute('itemscope', '');
    imageDiv.setAttribute('itemtype', 'http://schema.org/ImageObject');

    const picture = document.createElement('picture');
    const desktopPicture = imageDesktopCell.querySelector('picture');
    const mobilePicture = imageMobileCell.querySelector('picture');

    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      if (mobileImg) {
        const source = document.createElement('source');
        source.setAttribute('media', '(max-width:767px)');
        source.setAttribute('srcset', mobileImg.src);
        picture.append(source);
      }
    }

    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
        picture.append(img.querySelector('img'));
        moveInstrumentation(desktopPicture, img.querySelector('img'));
      }
    }
    imageDiv.append(picture);
    teaserImage.append(imageDiv);
    anchorWrapper.append(teaserImage);
    slide.append(teaser);
    swiperWrapper.append(slide);
  });

  carouselContent.append(swiperWrapper);

  const carouselActions = document.createElement('div');
  carouselActions.classList.add('cmp-carousel__actions');
  carouselActions.style.visibility = 'visible';

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.setAttribute('data-cmp-hook-carousel', 'previous');
  const prevSpan = document.createElement('span');
  prevSpan.classList.add('cmp-carousel__action-icon');
  const prevIcon = arrowLeftIconRow.querySelector('img');
  if (prevIcon) {
    const prevImg = document.createElement('img');
    prevImg.src = prevIcon.src;
    prevSpan.append(prevImg);
    moveInstrumentation(arrowLeftIconRow, prevImg);
  }
  prevBtn.append(prevSpan);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.setAttribute('data-cmp-hook-carousel', 'next');
  const nextSpan = document.createElement('span');
  nextSpan.classList.add('cmp-carousel__action-icon');
  const nextIcon = arrowRightIconRow.querySelector('img');
  if (nextIcon) {
    const nextImg = document.createElement('img');
    nextImg.src = nextIcon.src;
    nextSpan.append(nextImg);
    moveInstrumentation(arrowRightIconRow, nextImg);
  }
  nextBtn.append(nextSpan);

  carouselActions.append(prevBtn, nextBtn);
  carouselContent.append(carouselActions);

  const paginationEl = document.createElement('ol');
  paginationEl.classList.add('cmp-carousel__indicators');
  paginationEl.setAttribute('role', 'tablist');
  paginationEl.setAttribute('aria-label', 'Choose a slide to display');
  paginationEl.setAttribute('data-cmp-hook-carousel', 'indicators');
  paginationEl.style.visibility = 'visible';

  for (let i = 0; i < itemRows.length; i += 1) {
    const indicator = document.createElement('li');
    indicator.classList.add('cmp-carousel__indicator');
    if (i === 0) {
      indicator.classList.add('cmp-carousel__indicator--active');
    }
    paginationEl.append(indicator);
  }
  carouselContent.append(paginationEl);
  carouselWrapper.append(carouselContent);

  block.replaceChildren(carouselWrapper);

  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(carouselContent, { // Swiper container should be carouselContent, not swiperWrapper.parentElement
    slidesPerView: 'auto', // Changed to 'auto' to match original behavior
    spaceBetween: 0,
    loop: true,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
  });
}
