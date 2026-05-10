import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-club-section', 'mx-md-0', 'mx-4');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const carousel = document.createElement('div');
  carousel.classList.add('carousel', 'slide', 'itc-club-carousel', 'swiper'); // Added swiper class
  carousel.id = 'carousel';
  // data-ride="carousel" is a Bootstrap attribute, not needed for Swiper
  container.append(carousel);

  const carouselShift = document.createElement('div');
  carouselShift.classList.add('itc-carousel-shift');
  carousel.append(carouselShift);

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner', 'swiper-wrapper'); // Added swiper-wrapper class
  carouselShift.append(carouselInner);

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('carousel-indicators', 'swiper-pagination'); // Added swiper-pagination class
  carouselShift.append(carouselIndicators); // Append indicators to carouselShift for Swiper pagination

  slides.forEach((row, i) => {
    const [imageCell, titleCell, descriptionCell] = [...row.children];

    // Carousel Item
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item', 'swiper-slide'); // Added swiper-slide class
    moveInstrumentation(row, carouselItem);

    const itemContentWrapper = document.createElement('div');
    itemContentWrapper.classList.add('d-md-flex', 'd-block');
    carouselItem.append(itemContentWrapper);

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.classList.add('carousel__img', 'd-block', 'w-md-50', 'w-100');
        itemContentWrapper.append(optimizedPic);
      }
    }

    // Right Wrapper
    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('w-md-50', 'w-100', 'itc-club-right-wrapper', 'read-more');
    itemContentWrapper.append(rightWrapper);

    // Title
    const title = document.createElement('h2');
    title.classList.add('carousel-inner__title');
    title.textContent = titleCell.textContent.trim();
    rightWrapper.append(title);

    // Description
    const description = document.createElement('div');
    description.classList.add('carousel-inner__description');
    description.innerHTML = descriptionCell.innerHTML;
    rightWrapper.append(description);

    carouselInner.append(carouselItem);
  });

  // Navigation Buttons
  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-control-prev', 'swiper-button-prev'); // Added swiper-button-prev class
  prevButton.type = 'button';
  prevButton.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span>';
  carouselShift.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-control-next', 'swiper-button-next'); // Added swiper-button-next class
  nextButton.type = 'button';
  nextButton.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span>';
  carouselShift.append(nextButton);

  block.replaceChildren(section);

  // Load Swiper library and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(carousel, {
    slidesPerView: 'auto',
    loop: false, // Original HTML doesn't indicate loop
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
