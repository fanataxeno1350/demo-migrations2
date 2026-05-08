import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-club-section', 'mx-md-0', 'mx-4');

  const container = document.createElement('div');
  container.classList.add('container');

  const carousel = document.createElement('div');
  carousel.classList.add('carousel', 'slide', 'itc-club-carousel', 'swiper'); // Add swiper class for Swiper.js
  carousel.id = 'carousel'; // Hardcoded ID from original HTML

  const carouselShift = document.createElement('div');
  carouselShift.classList.add('itc-carousel-shift');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner', 'swiper-wrapper'); // Add swiper-wrapper for Swiper.js

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('carousel-indicators', 'swiper-pagination'); // Add swiper-pagination for Swiper.js

  slides.forEach((slide, index) => {
    const [imageCell, titleCell, descriptionCell] = [...slide.children];

    // Create indicator (Swiper.js handles active class automatically)
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#carousel');
    indicator.setAttribute('data-slide-to', index.toString());
    carouselIndicators.append(indicator);

    // Create carousel item
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item', 'swiper-slide'); // Add swiper-slide for Swiper.js

    const itemContentWrapper = document.createElement('div');
    itemContentWrapper.classList.add('d-md-flex', 'd-block');

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('carousel__img', 'd-block', 'w-md-50', 'w-100');
        optimizedImg.setAttribute('loading', 'lazy');
        optimizedImg.alt = img.alt; // Ensure alt text is copied
        moveInstrumentation(img, optimizedImg); // Move instrumentation from original img to optimized img
        itemContentWrapper.append(optimizedPic);
      }
    }

    // Right wrapper for title and description
    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('w-md-50', 'w-100', 'itc-club-right-wrapper', 'read-more');

    // Title
    const title = document.createElement('h2');
    title.classList.add('carousel-inner__title');
    moveInstrumentation(titleCell, title);
    title.textContent = titleCell.textContent.trim();
    rightWrapper.append(title);

    // Description
    const description = document.createElement('div'); // Changed to div for richtext
    description.classList.add('carousel-inner__description');
    moveInstrumentation(descriptionCell, description);
    description.innerHTML = descriptionCell.innerHTML; // Richtext content
    rightWrapper.append(description);

    itemContentWrapper.append(rightWrapper);
    carouselItem.append(itemContentWrapper);
    carouselInner.append(carouselItem);

    moveInstrumentation(slide, carouselItem); // Move instrumentation from original slide row to new carousel item
  });

  carouselShift.append(carouselInner);
  carouselShift.append(carouselIndicators); // Append indicators inside shift as per original HTML

  // Previous button
  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-control-prev', 'swiper-button-prev'); // Add swiper-button-prev
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('data-target', '#carousel');
  prevButton.setAttribute('data-slide', 'prev');
  prevButton.innerHTML = `
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  `;
  carouselShift.append(prevButton);

  // Next button
  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-control-next', 'swiper-button-next'); // Add swiper-button-next
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('data-target', '#carousel');
  nextButton.setAttribute('data-slide', 'next');
  nextButton.innerHTML = `
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  `;
  carouselShift.append(nextButton);

  carousel.append(carouselShift);
  container.append(carousel);
  section.append(container);

  block.replaceChildren(section);

  // Load Swiper.js assets and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(carousel, {
    slidesPerView: 'auto',
    loop: false, // Original HTML doesn't specify loop, default to false
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: carouselIndicators,
      clickable: true,
    },
  });
}
