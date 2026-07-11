import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('cmp-carousel__container'); // Swiper adds slick-initialized, slick-slider

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  // The first child of the block is the container placeholder for "slides"
  // Consume it and move its instrumentation.
  const [containerPlaceholder, ...slideRows] = [...block.children];
  moveInstrumentation(containerPlaceholder, slidesContainer);

  slideRows.forEach((row, index) => {
    const [imageDesktopCell, imageMobileCell, ctaLabelCell, ctaLinkCell] = [...row.children];

    const slideItem = document.createElement('div');
    slideItem.classList.add('cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      slideItem.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
    }
    slideItem.setAttribute('data-slick-index', index);
    slideItem.setAttribute('aria-hidden', index !== 0);
    slideItem.setAttribute('tabindex', index === 0 ? '0' : '-1');
    slideItem.setAttribute('role', 'tabpanel');
    slideItem.setAttribute('aria-labelledby', `slickcarousel-item-${index}-tab`);
    slideItem.setAttribute('aria-roledescription', 'slide');
    slideItem.setAttribute('aria-label', `Slide ${index + 1} of ${slideRows.length}`);

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner', 'cmp-banner--cta-left-aligned');

    const cmpBannerDiv = document.createElement('div');
    cmpBannerDiv.classList.add('cmp-banner');
    cmpBannerDiv.setAttribute('data-component', 'banner');
    cmpBannerDiv.setAttribute('data-initialized', 'true');

    const cmpBannerContent = document.createElement('div');
    cmpBannerContent.classList.add('cmp-banner__content');

    const picture = document.createElement('picture');
    picture.classList.add('w-100', 'd-block');

    const desktopImg = imageDesktopCell.querySelector('img');
    const mobileImg = imageMobileCell.querySelector('img');

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width: 600px)');
      sourceMobile.setAttribute('srcset', mobileImg.src);
      picture.append(sourceMobile);
    }

    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1366' }]);
      img.querySelector('img').classList.add('cmp-banner__image', 'w-100', 'd-block');
      img.querySelector('img').setAttribute('data-desktop-src', desktopImg.src);
      if (mobileImg) {
        img.querySelector('img').setAttribute('data-mobile-src', mobileImg.src);
      }
      img.querySelector('img').setAttribute('fetchpriority', 'high');
      picture.append(img.querySelector('img'));
    }

    cmpBannerContent.append(picture);

    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('button', 'cmp-button--primary-anchor'); // Removed 'null' class

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('cmp-button');
    ctaLink.setAttribute('data-request', 'true');
    ctaLink.setAttribute('data-show-pop', 'false');
    ctaLink.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href; // Correctly read href from the aem-content cell
    }

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('cmp-button__text');
    ctaSpan.textContent = ctaLabelCell.textContent.trim();
    ctaLink.append(ctaSpan);
    ctaWrapper.append(ctaLink);
    cmpBannerContent.append(ctaWrapper);

    cmpBannerDiv.append(cmpBannerContent);
    bannerDiv.append(cmpBannerDiv);
    slideItem.append(bannerDiv);
    slickTrack.append(slideItem);

    moveInstrumentation(row, slideItem);
  });

  slickList.append(slickTrack);
  slidesContainer.append(slickList);
  block.replaceChildren(slidesContainer);

  // Swiper.js initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(slidesContainer, {
    slidesPerView: 1,
    loop: false, // Based on ORIGINAL HTML data-show-infinite-scroll="true" which means loop is false for Swiper
    // Add navigation and pagination if they exist in the original HTML
    // For this specific block, the original HTML shows data-show-arrows="false" and data-show-dots="true"
    // So we'll only add pagination if needed, and no navigation.
    pagination: {
      el: '.cmp-carousel__container .slick-list', // Placeholder, adjust selector if actual pagination element is created
      clickable: true,
    },
  });
}
