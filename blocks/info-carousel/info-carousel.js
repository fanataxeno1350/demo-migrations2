import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-club-section', 'mx-md-0', 'mx-4');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const swiperEl = document.createElement('div'); // Renamed to swiperEl for Swiper.js
  swiperEl.classList.add('carousel', 'slide', 'itc-club-carousel', 'swiper'); // Added 'swiper' class
  swiperEl.id = 'carousel';
  // data-ride="carousel" is Bootstrap specific, removed for Swiper
  container.append(swiperEl);

  const carouselShift = document.createElement('div');
  carouselShift.classList.add('itc-carousel-shift');
  swiperEl.append(carouselShift); // Append to swiperEl

  const swiperWrapper = document.createElement('div'); // Renamed to swiperWrapper for Swiper.js
  swiperWrapper.classList.add('carousel-inner', 'swiper-wrapper'); // Added 'swiper-wrapper' class
  carouselShift.append(swiperWrapper);

  const paginationEl = document.createElement('div'); // Pagination element for Swiper
  paginationEl.classList.add('carousel-indicators', 'swiper-pagination'); // Added 'swiper-pagination' class
  swiperWrapper.append(paginationEl); // Append pagination to swiperWrapper

  carouselItems.forEach((row, index) => {
    // Swiper.js handles indicators automatically, so we don't need to create <li> elements here.
    // The paginationEl will be populated by Swiper.

    const [imageCell, titleCell, descriptionCell] = [...row.children];

    const swiperSlide = document.createElement('div'); // Renamed to swiperSlide for Swiper.js
    swiperSlide.classList.add('carousel-item', 'swiper-slide'); // Added 'swiper-slide' class
    // Swiper.js handles 'active' class
    moveInstrumentation(row, swiperSlide);
    swiperWrapper.append(swiperSlide);

    const flexWrapper = document.createElement('div');
    flexWrapper.classList.add('d-md-flex', 'd-block');
    swiperSlide.append(flexWrapper);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('carousel__img', 'd-block', 'w-md-50', 'w-100');
        flexWrapper.append(optimizedPic);
      }
    }

    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('w-md-50', 'w-100', 'itc-club-right-wrapper', 'read-more');
    flexWrapper.append(rightWrapper);

    const title = document.createElement('h2');
    title.classList.add('carousel-inner__title');
    title.textContent = titleCell.textContent.trim();
    rightWrapper.append(title);

    const description = document.createElement('div');
    description.classList.add('carousel-inner__description');
    description.innerHTML = descriptionCell.innerHTML;
    rightWrapper.append(description);
  });

  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-control-prev', 'swiper-button-prev'); // Added 'swiper-button-prev'
  prevButton.type = 'button';
  // data-target and data-slide are Bootstrap specific, removed for Swiper
  prevButton.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span>';
  carouselShift.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-control-next', 'swiper-button-next'); // Added 'swiper-button-next'
  nextButton.type = 'button';
  // data-target and data-slide are Bootstrap specific, removed for Swiper
  nextButton.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span>';
  carouselShift.append(nextButton);

  // Load Swiper.js CSS and JS
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    loop: false, // Based on original HTML not having data-loop="true"
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
  });

  block.replaceChildren(section);
}
