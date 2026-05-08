import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('mx-md-0', 'mx-4'); // Removed 'itc-club-section' as it's the block's own class

  const container = document.createElement('div');
  container.classList.add('container');

  const carousel = document.createElement('div');
  carousel.classList.add('carousel', 'slide', 'itc-club-carousel');
  carousel.id = 'carousel';
  carousel.setAttribute('data-ride', 'carousel');

  const carouselShift = document.createElement('div');
  carouselShift.classList.add('itc-carousel-shift');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('swiper-wrapper'); // Swiper wrapper

  const carouselIndicators = document.createElement('div'); // Changed to div for Swiper pagination
  carouselIndicators.classList.add('swiper-pagination');

  carouselItems.forEach((row, index) => {
    const [imageCell, titleCell, descriptionCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item', 'swiper-slide'); // Swiper slide

    const flexWrapper = document.createElement('div');
    flexWrapper.classList.add('d-md-flex', 'd-block');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('carousel__img', 'd-block', 'w-md-50', 'w-100');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        flexWrapper.append(optimizedPic);
      }
    }

    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('w-md-50', 'w-100', 'itc-club-right-wrapper', 'read-more');

    if (titleCell) {
      const title = document.createElement('h2');
      title.classList.add('carousel-inner__title');
      // Fix: richtext cell content assigned to div, not p, to avoid <p> inside <p>
      title.innerHTML = titleCell.innerHTML;
      rightWrapper.append(title);
    }

    if (descriptionCell) {
      const description = document.createElement('div'); // Changed to div to avoid <p> inside <p>
      description.classList.add('carousel-inner__description');
      // Fix: richtext cell content assigned to div, not p, to avoid <p> inside <p>
      description.innerHTML = descriptionCell.innerHTML;
      rightWrapper.append(description);
    }

    flexWrapper.append(rightWrapper);
    carouselItem.append(flexWrapper);
    carouselInner.append(carouselItem);
    moveInstrumentation(row, carouselItem);
  });

  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-control-prev', 'swiper-button-prev'); // Swiper nav button
  prevButton.type = 'button';
  prevButton.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span>';

  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-control-next', 'swiper-button-next'); // Swiper nav button
  nextButton.type = 'button';
  nextButton.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span>';

  carouselShift.append(carouselInner, prevButton, nextButton, carouselIndicators); // Add pagination div
  carousel.append(carouselShift);
  container.append(carousel);
  section.append(container);

  block.replaceChildren(section);

  // Load Swiper CSS and JS
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Initialize Swiper
  const swiperEl = block.querySelector('.itc-club-carousel');
  if (swiperEl) {
    // eslint-disable-next-line no-undef
    new Swiper(swiperEl, {
      slidesPerView: 'auto',
      loop: false, // Original HTML data-ride="carousel" implies no loop, but Swiper default is false.
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
