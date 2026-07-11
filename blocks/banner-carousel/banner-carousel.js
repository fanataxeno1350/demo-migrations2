import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  // The first row is the container placeholder, consume it.
  const [containerRow, ...itemRows] = allRows;

  const root = document.createElement('div');
  root.classList.add('cmp-carousel'); // From ORIGINAL HTML
  moveInstrumentation(containerRow, root);

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('cmp-carousel__container', 'swiper'); // Added 'swiper' class for Swiper.js
  root.append(swiperContainer);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('slick-track', 'swiper-wrapper'); // Renamed from slickList/slickTrack, added swiper-wrapper
  swiperContainer.append(swiperWrapper);

  itemRows
    .filter(row => row.children.length > 0 && [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row, index) => {
      const [desktopImageCell, mobileImageCell, ctaLabelCell, ctaLinkCell] = [...row.children];

      const carouselItem = document.createElement('div');
      carouselItem.classList.add('cmp-carousel__item', 'slick-slide', 'swiper-slide'); // Added swiper-slide
      if (index === 0) {
        carouselItem.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active'); // From ORIGINAL HTML
      }
      carouselItem.setAttribute('aria-label', `Slide ${index + 1} of ${itemRows.length}`);
      carouselItem.setAttribute('data-slick-index', index);
      carouselItem.setAttribute('aria-hidden', index !== 0);
      carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');

      const bannerDiv = document.createElement('div');
      bannerDiv.classList.add('banner', 'cmp-banner--cta-left-aligned'); // From ORIGINAL HTML
      carouselItem.append(bannerDiv);

      const cmpBanner = document.createElement('div');
      cmpBanner.classList.add('cmp-banner'); // From ORIGINAL HTML
      bannerDiv.append(cmpBanner);

      const bannerContent = document.createElement('div');
      bannerContent.classList.add('cmp-banner__content'); // From ORIGINAL HTML
      cmpBanner.append(bannerContent);

      const picture = document.createElement('picture');
      picture.classList.add('w-100', 'd-block'); // From ORIGINAL HTML

      const mobileImg = mobileImageCell?.querySelector('img');
      if (mobileImg) {
        const mobileSource = document.createElement('source');
        mobileSource.setAttribute('media', '(max-width: 600px)');
        mobileSource.srcset = mobileImg.src;
        picture.append(mobileSource);
      }

      const desktopImg = desktopImageCell?.querySelector('img');
      const img = document.createElement('img');
      img.classList.add('cmp-banner__image', 'w-100', 'd-block'); // From ORIGINAL HTML
      if (desktopImg) {
        img.src = desktopImg.src;
        img.alt = desktopImg.alt;
        img.setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      }
      picture.append(img);
      bannerContent.append(picture);

      // Optimize image
      // createOptimizedPicture returns a new <picture> element, so we replace the existing one.
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be called on the original image element, not the new one's img
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      picture.replaceWith(optimizedPic);


      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('null', 'button', 'cmp-button--primary-anchor'); // From ORIGINAL HTML

      const ctaLink = ctaLinkCell?.querySelector('a');
      const ctaAnchor = document.createElement('a');
      ctaAnchor.classList.add('cmp-button'); // From ORIGINAL HTML
      if (ctaLink) {
        ctaAnchor.href = ctaLink.href;
      }
      ctaAnchor.textContent = ctaLabelCell?.textContent.trim() || '';

      moveInstrumentation(row, carouselItem); // Move instrumentation from original row to carousel item
      buttonWrapper.append(ctaAnchor);
      bannerContent.append(buttonWrapper);
      swiperWrapper.append(carouselItem);
    });

  // Add Swiper navigation buttons and pagination
  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev');
  swiperContainer.append(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next');
  swiperContainer.append(nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination');
  swiperContainer.append(paginationEl);


  block.replaceChildren(root);

  // Load Swiper Carousel and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 1,
    loop: swiperContainer.dataset.showInfiniteScroll === 'true', // Use dataset for loop
    speed: parseInt(swiperContainer.dataset.speed || '500', 10),
    autoplay: swiperContainer.dataset.autoPlayIsEnabled === 'true' ? {
      delay: parseInt(swiperContainer.dataset.autoPlaySpeedInMs || '4200', 10),
      disableOnInteraction: false,
    } : false,
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
