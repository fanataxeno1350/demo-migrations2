import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-carousel-section');

  const carouselContainer = document.createElement('div');
  carouselContainer.id = 'carouselExampleSlidesOnly';
  carouselContainer.classList.add('bannerCarousel', 'carousel', 'slide');
  // data-ride="carousel" is a Bootstrap attribute, Swiper handles its own initialization
  // carouselContainer.setAttribute('data-ride', 'carousel'); // Removed as Swiper will manage

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('carousel-indicators');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner', 'swiper-wrapper'); // Added swiper-wrapper for Swiper.js

  carouselItems.forEach((row, index) => {
    const [desktopImageCell, mobileImageCell, headlineCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item', 'swiper-slide'); // Added swiper-slide for Swiper.js
    if (index === 0) {
      carouselItem.classList.add('active');
    }
    moveInstrumentation(row, carouselItem);

    const desktopPicture = desktopImageCell.querySelector('picture');
    const desktopImg = desktopPicture ? desktopPicture.querySelector('img') : null;
    if (desktopImg) {
      const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, index === 0, [{ width: '2000' }]);
      optimizedDesktopPic.querySelector('img').classList.add('d-none', 'd-sm-block', 'w-100', 'desktop-image');
      carouselItem.append(optimizedDesktopPic);
    }

    const mobilePicture = mobileImageCell.querySelector('picture');
    const mobileImg = mobilePicture ? mobilePicture.querySelector('img') : null;
    if (mobileImg) {
      const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, index === 0, [{ width: '750' }]);
      optimizedMobilePic.querySelector('img').classList.add('d-block', 'd-sm-none', 'w-100', 'mobile-image');
      carouselItem.append(optimizedMobilePic);
    }

    const bannerContentWrapper = document.createElement('div');
    bannerContentWrapper.classList.add('banner-content-wrapper', 'position-absolute');

    const headline = document.createElement('h1');
    headline.classList.add('koi-carousel-heading', 'text-sm-left');
    headline.textContent = headlineCell?.textContent.trim() || '';
    bannerContentWrapper.append(headline);

    const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    description.classList.add('koi-carousel-description');
    description.innerHTML = descriptionCell?.innerHTML || ''; // Correctly read richtext HTML
    bannerContentWrapper.append(description);

    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaLabel = ctaLabelCell?.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('koi-carousel-cta', 'btn', 'btn-primary', 'btn-start-now');
      anchor.target = '_blank'; // Assuming target blank from original HTML
      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('cmp-link__screen-reader-only');
      srOnlySpan.textContent = 'opens in a new tab';
      anchor.append(srOnlySpan);
      bannerContentWrapper.append(anchor);
    }

    carouselItem.append(bannerContentWrapper);
    carouselInner.append(carouselItem);

    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#carouselExampleSlidesOnly');
    indicator.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      indicator.classList.add('active');
    }
    carouselIndicators.append(indicator);
  });

  carouselContainer.append(carouselIndicators);
  carouselContainer.append(carouselInner);

  const nextCarouselBtn = document.createElement('div');
  nextCarouselBtn.classList.add('next-carousel-btn');

  const prevControl = document.createElement('a');
  prevControl.classList.add('carousel-control-prev');
  prevControl.href = '#carouselExampleSlidesOnly';
  prevControl.setAttribute('role', 'button');
  prevControl.setAttribute('data-slide', 'prev');
  prevControl.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span>';
  nextCarouselBtn.append(prevControl);

  const nextControl = document.createElement('a');
  nextControl.classList.add('carousel-control-next');
  nextControl.href = '#carouselExampleSlidesOnly';
  nextControl.setAttribute('role', 'button');
  nextControl.setAttribute('data-slide', 'next');
  nextControl.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span>';
  nextCarouselBtn.append(nextControl);

  carouselContainer.append(nextCarouselBtn);
  section.append(carouselContainer);

  block.replaceChildren(section);

  // Load Swiper.js assets
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper
  // eslint-disable-next-line no-undef
  new Swiper(carouselContainer, {
    slidesPerView: 1, // Assuming one slide visible at a time for a banner carousel
    loop: false, // Original HTML doesn't specify loop, default to false
    navigation: {
      prevEl: prevControl,
      nextEl: nextControl,
    },
    pagination: {
      el: carouselIndicators,
      clickable: true,
      renderBullet: (index, className) => {
        // Swiper needs to render its own bullets, or we need to map existing ones
        // For simplicity, let Swiper manage, or adapt existing `li` elements
        // This example assumes Swiper will create/manage bullets based on `el`
        // If the existing `li` elements need to be used, more complex logic is needed.
        // For now, we'll let Swiper take over the `carouselIndicators` element.
        return `<li class="${className}" data-target="#carouselExampleSlidesOnly" data-slide-to="${index}"></li>`;
      },
    },
  });

  // Remove manual event listeners as Swiper handles navigation and pagination
  // The manual `updateCarousel` function and its calls are no longer needed.
}
