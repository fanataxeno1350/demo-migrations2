import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-carousel-section');

  const carouselId = `carousel-${Math.random().toString(36).substring(2, 9)}`;
  const carousel = document.createElement('div');
  carousel.id = carouselId;
  carousel.classList.add('bannerCarousel', 'carousel', 'slide');
  carousel.setAttribute('data-ride', 'carousel'); // This is a Bootstrap 3/4 attribute, Swiper doesn't use it. Keeping for fidelity.

  const indicators = document.createElement('ol');
  indicators.classList.add('carousel-indicators');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner', 'swiper-wrapper'); // Add swiper-wrapper for Swiper.js

  slides.forEach((slideRow, index) => {
    const [desktopImageCell, mobileImageCell, headlineCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...slideRow.children];

    // Indicators
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', `#${carouselId}`);
    indicator.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      indicator.classList.add('active');
    }
    indicators.append(indicator);

    // Carousel Item
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item', 'swiper-slide'); // Add swiper-slide for Swiper.js
    if (index === 0) {
      carouselItem.classList.add('active');
    }

    // Desktop Image
    const desktopPicture = desktopImageCell.querySelector('picture');
    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, index === 0, [{ width: '2000' }]);
      moveInstrumentation(desktopImg, optimizedDesktopPic.querySelector('img'));
      const desktopImageEl = optimizedDesktopPic.querySelector('img');
      desktopImageEl.classList.add('d-none', 'd-sm-block', 'w-100', 'desktop-image');
      desktopImageEl.setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      desktopImageEl.setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItem.append(optimizedDesktopPic);
    }

    // Mobile Image
    const mobilePicture = mobileImageCell.querySelector('picture');
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, index === 0, [{ width: '750' }]);
      moveInstrumentation(mobileImg, optimizedMobilePic.querySelector('img'));
      const mobileImageEl = optimizedMobilePic.querySelector('img');
      mobileImageEl.classList.add('d-block', 'd-sm-none', 'w-100', 'mobile-image');
      mobileImageEl.setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      mobileImageEl.setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItem.append(optimizedMobilePic);
    }

    // Content Wrapper
    const bannerContentWrapper = document.createElement('div');
    bannerContentWrapper.classList.add('banner-content-wrapper', 'position-absolute');

    // Headline
    const headline = document.createElement('h1');
    headline.classList.add('koi-carousel-heading', 'text-sm-left');
    headline.textContent = headlineCell?.textContent.trim() || '';
    bannerContentWrapper.append(headline);

    // Description
    const description = document.createElement('div');
    description.classList.add('koi-carousel-description');
    description.innerHTML = descriptionCell?.innerHTML || '';
    bannerContentWrapper.append(description);

    // CTA Link
    const ctaLink = document.createElement('a');
    const ctaAnchor = ctaLinkCell.querySelector('a');
    if (ctaAnchor) {
      ctaLink.href = ctaAnchor.href;
      ctaLink.classList.add('koi-carousel-cta', 'btn', 'btn-primary', 'btn-start-now');
      ctaLink.textContent = ctaLabelCell?.textContent.trim() || ''; // Fixed: Use ctaLabelCell for textContent
      ctaLink.setAttribute('target', '_blank'); // From original HTML
      ctaLink.append(Object.assign(document.createElement('span'), {
        className: 'cmp-link__screen-reader-only',
        textContent: 'opens in a new tab',
      }));
      moveInstrumentation(ctaLinkCell, ctaLink);
      bannerContentWrapper.append(ctaLink);
    }

    carouselItem.append(bannerContentWrapper);
    moveInstrumentation(slideRow, carouselItem);
    carouselInner.append(carouselItem);
  });

  carousel.append(indicators, carouselInner);

  // Next and Previous buttons
  const nextCarouselBtn = document.createElement('div');
  nextCarouselBtn.classList.add('next-carousel-btn');

  const prevControl = document.createElement('a');
  prevControl.classList.add('carousel-control-prev');
  prevControl.href = `#${carouselId}`;
  prevControl.setAttribute('role', 'button');
  // prevControl.setAttribute('data-slide', 'prev'); // Swiper handles navigation via JS
  prevControl.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span>';

  const nextControl = document.createElement('a');
  nextControl.classList.add('carousel-control-next');
  nextControl.href = `#${carouselId}`;
  nextControl.setAttribute('role', 'button');
  // nextControl.setAttribute('data-slide', 'next'); // Swiper handles navigation via JS
  nextControl.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span>';

  nextCarouselBtn.append(prevControl, nextControl);
  carousel.append(nextCarouselBtn);

  section.append(carousel);
  block.replaceChildren(section);

  // Load Swiper.js assets
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper carousel
  const swiperEl = block.querySelector('.carousel');
  const prevBtn = block.querySelector('.carousel-control-prev');
  const nextBtn = block.querySelector('.carousel-control-next');
  const paginationEl = block.querySelector('.carousel-indicators');

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 1, // Display one slide at a time
    loop: false, // Based on original HTML, no data-loop="true"
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
      renderBullet: (index, className) => {
        // Custom render to match original HTML's <li data-target="..." data-slide-to="...">
        const indicator = document.createElement('li');
        indicator.classList.add(className);
        indicator.setAttribute('data-target', `#${carouselId}`);
        indicator.setAttribute('data-slide-to', index.toString());
        return indicator.outerHTML;
      },
    },
  });
}
