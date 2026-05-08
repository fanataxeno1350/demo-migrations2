import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-club-section', 'mx-md-0', 'mx-4');

  const container = document.createElement('div');
  container.classList.add('container');

  const carousel = document.createElement('div');
  carousel.classList.add('carousel', 'slide', 'itc-club-carousel', 'swiper'); // Added 'swiper' class
  carousel.id = 'carousel';
  carousel.setAttribute('data-ride', 'carousel');

  const carouselShift = document.createElement('div');
  carouselShift.classList.add('itc-carousel-shift');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner', 'swiper-wrapper'); // Added 'swiper-wrapper' class

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('carousel-indicators', 'swiper-pagination'); // Added 'swiper-pagination' class

  carouselItems.forEach((row, index) => {
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#carousel');
    indicator.setAttribute('data-slide-to', index.toString());
    // Swiper handles active state for pagination
    // if (index === 0) {
    //   indicator.classList.add('active');
    // }
    carouselIndicators.append(indicator);

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item', 'swiper-slide'); // Added 'swiper-slide' class
    // Swiper handles active state for slides
    // if (index === 0) {
    //   carouselItem.classList.add('active');
    // }

    const itemContent = document.createElement('div');
    itemContent.classList.add('d-md-flex', 'd-block');

    const [imageCell, titleCell, descriptionCell] = [...row.children];

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.classList.add('carousel__img', 'd-block', 'w-md-50', 'w-100');
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        itemContent.append(optimizedPic);
      }
    }

    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('w-md-50', 'w-100', 'itc-club-right-wrapper', 'read-more');

    const title = document.createElement('h2');
    title.classList.add('carousel-inner__title');
    title.textContent = titleCell?.textContent.trim() || '';
    moveInstrumentation(titleCell, title);
    rightWrapper.append(title);

    const description = document.createElement('div'); // Changed to div to safely contain richtext HTML
    description.classList.add('carousel-inner__description');
    description.innerHTML = descriptionCell?.innerHTML || '';
    moveInstrumentation(descriptionCell, description);
    rightWrapper.append(description);

    itemContent.append(rightWrapper);
    carouselItem.append(itemContent);
    carouselInner.append(carouselItem);
    moveInstrumentation(row, carouselItem);
  });

  carouselShift.append(carouselInner);

  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-control-prev', 'swiper-button-prev'); // Added 'swiper-button-prev'
  prevButton.type = 'button';
  prevButton.setAttribute('data-target', '#carousel');
  prevButton.setAttribute('data-slide', 'prev');
  prevButton.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span>';

  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-control-next', 'swiper-button-next'); // Added 'swiper-button-next'
  nextButton.type = 'button';
  nextButton.setAttribute('data-target', '#carousel');
  nextButton.setAttribute('data-slide', 'next');
  nextButton.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span>';

  carouselShift.append(prevButton, nextButton);
  carousel.append(carouselShift, carouselIndicators); // Append indicators to carousel root for Swiper
  container.append(carousel);
  section.append(container);

  block.replaceChildren(section);

  // Load Swiper.js CSS and JS
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper
  const swiperEl = block.querySelector('.swiper');
  if (swiperEl) {
    // eslint-disable-next-line no-undef
    new Swiper(swiperEl, {
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
}
