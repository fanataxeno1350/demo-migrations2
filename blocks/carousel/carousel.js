import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [arrowPreviousIconRow, arrowNextIconRow, containerRow, ...slideRows] = [...block.children];

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('cmp-carousel');
  moveInstrumentation(block, carouselWrapper);

  const carouselContent = document.createElement('div');
  carouselContent.classList.add('cmp-carousel__content');
  carouselWrapper.append(carouselContent);

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('swiper-wrapper'); // Swiper specific class

  slideRows.forEach((row) => {
    const [imageDesktopCell, imageMobileCell, linkCell] = [...row.children];

    const slideItem = document.createElement('div');
    slideItem.classList.add('cmp-carousel__item', 'swiper-slide'); // Swiper specific class
    // Swiper adds 'cmp-carousel__item--active' automatically on init, do not add manually
    moveInstrumentation(row, slideItem);

    const teaserDiv = document.createElement('div');
    teaserDiv.classList.add('teaser', 'cmp-teaser--first-component');

    const cmpTeaserDiv = document.createElement('div');
    cmpTeaserDiv.classList.add('cmp-teaser');

    const linkElement = linkCell.querySelector('a');
    let anchorTag;
    if (linkElement && linkElement.href) {
      anchorTag = document.createElement('a');
      anchorTag.classList.add('cmp-teaser__link');
      anchorTag.href = linkElement.href;
    }

    const teaserImageDiv = document.createElement('div');
    teaserImageDiv.classList.add('cmp-teaser__image');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('cmp-image');

    const pictureDesktop = imageDesktopCell.querySelector('picture');
    const pictureMobile = imageMobileCell.querySelector('picture');

    if (pictureDesktop) {
      const imgDesktop = pictureDesktop.querySelector('img');
      const optimizedPictureDesktop = createOptimizedPicture(
        imgDesktop.src,
        imgDesktop.alt,
        false,
        [{ media: '(min-width: 768px)', width: '2000' }],
      );
      optimizedPictureDesktop.classList.add('cmp-image__image');
      moveInstrumentation(imgDesktop, optimizedPictureDesktop.querySelector('img'));
      imageDiv.append(optimizedPictureDesktop);
    }

    if (pictureMobile) {
      const imgMobile = pictureMobile.querySelector('img');
      const optimizedPictureMobile = createOptimizedPicture(
        imgMobile.src,
        imgMobile.alt,
        false,
        [{ media: '(max-width: 767px)', width: '767' }],
      );
      optimizedPictureMobile.classList.add('cmp-image__image');
      moveInstrumentation(imgMobile, optimizedPictureMobile.querySelector('img'));
      // Find the existing picture element from desktop and append mobile source
      const existingPicture = imageDiv.querySelector('picture');
      if (existingPicture) {
        optimizedPictureMobile.querySelectorAll('source').forEach((source) => {
          existingPicture.prepend(source);
        });
      } else {
        imageDiv.append(optimizedPictureMobile);
      }
    }

    teaserImageDiv.append(imageDiv);
    cmpTeaserDiv.append(teaserImageDiv);

    if (anchorTag) {
      anchorTag.append(cmpTeaserDiv);
      teaserDiv.append(anchorTag);
    } else {
      teaserDiv.append(cmpTeaserDiv);
    }
    slideItem.append(teaserDiv);
    slidesContainer.append(slideItem);
  });

  carouselContent.append(slidesContainer);

  const carouselActions = document.createElement('div');
  carouselActions.classList.add('cmp-carousel__actions');

  const prevButton = document.createElement('button');
  prevButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevButton.type = 'button';
  prevButton.setAttribute('aria-label', 'Previous');

  const prevIconSpan = document.createElement('span');
  prevIconSpan.classList.add('cmp-carousel__action-icon');
  const prevIconPicture = arrowPreviousIconRow.querySelector('picture');
  if (prevIconPicture) {
    const prevIconImg = prevIconPicture.querySelector('img');
    const optimizedPrevIcon = createOptimizedPicture(prevIconImg.src, prevIconImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(prevIconImg, optimizedPrevIcon.querySelector('img'));
    prevIconSpan.append(optimizedPrevIcon);
  }
  prevButton.append(prevIconSpan);
  moveInstrumentation(arrowPreviousIconRow, prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Next');

  const nextIconSpan = document.createElement('span');
  nextIconSpan.classList.add('cmp-carousel__action-icon');
  const nextIconPicture = arrowNextIconRow.querySelector('picture');
  if (nextIconPicture) {
    const nextIconImg = nextIconPicture.querySelector('img');
    const optimizedNextIcon = createOptimizedPicture(nextIconImg.src, nextIconImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(nextIconImg, optimizedNextIcon.querySelector('img'));
    nextIconSpan.append(optimizedNextIcon);
  }
  nextButton.append(nextIconSpan);
  moveInstrumentation(arrowNextIconRow, nextButton);

  carouselActions.append(prevButton, nextButton);
  carouselWrapper.append(carouselActions);

  const pagination = document.createElement('ol');
  pagination.classList.add('cmp-carousel__indicators');
  carouselWrapper.append(pagination);

  // Consume the containerRow instrumentation
  moveInstrumentation(containerRow, slidesContainer);

  block.replaceChildren(carouselWrapper);

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(carouselWrapper.querySelector('.cmp-carousel__content'), {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: pagination,
      clickable: true,
      renderBullet: (index, className) => `<li class="${className} cmp-carousel__indicator"></li>`, // Added cmp-carousel__indicator class
    },
  });
}
