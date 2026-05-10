import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-club-section', 'mx-md-0', 'mx-4');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const carousel = document.createElement('div');
  carousel.classList.add('carousel', 'slide', 'itc-club-carousel');
  carousel.id = 'carousel'; // Hardcoded ID from original HTML
  carousel.setAttribute('data-ride', 'carousel');
  container.append(carousel);

  const carouselShift = document.createElement('div');
  carouselShift.classList.add('itc-carousel-shift');
  carousel.append(carouselShift);

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner');
  carouselShift.append(carouselInner);

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('carousel-indicators');
  carousel.append(carouselIndicators); // Indicators are direct child of carousel, not carouselInner

  carouselItems.forEach((row, i) => {
    const [imageCell, titleCell, descriptionCell] = [...row.children];

    // Create indicator
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#carousel');
    indicator.setAttribute('data-slide-to', i.toString());
    if (i === 0) {
      indicator.classList.add('active');
    }
    carouselIndicators.append(indicator);

    // Create carousel item
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if (i === 0) {
      carouselItem.classList.add('active');
    }
    carouselInner.append(carouselItem);

    const itemContentWrapper = document.createElement('div');
    itemContentWrapper.classList.add('d-md-flex', 'd-block');
    carouselItem.append(itemContentWrapper);

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('carousel__img', 'd-block', 'w-md-50', 'w-100');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        itemContentWrapper.append(optimizedPic);
      }
    }

    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('w-md-50', 'w-100', 'itc-club-right-wrapper', 'read-more');
    itemContentWrapper.append(rightWrapper);

    // Title
    const title = document.createElement('h2');
    title.classList.add('carousel-inner__title');
    title.innerHTML = titleCell?.innerHTML || '';
    rightWrapper.append(title);

    // Description
    const description = document.createElement('p');
    description.classList.add('carousel-inner__description');
    description.innerHTML = descriptionCell?.innerHTML || '';
    rightWrapper.append(description);

    moveInstrumentation(row, carouselItem); // Move instrumentation from original row to new carousel item
  });

  // Previous button
  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-control-prev');
  prevButton.type = 'button';
  prevButton.setAttribute('data-target', '#carousel');
  prevButton.setAttribute('data-slide', 'prev');
  prevButton.innerHTML = `
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  `;
  carouselShift.append(prevButton);

  // Next button
  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-control-next');
  nextButton.type = 'button';
  nextButton.setAttribute('data-target', '#carousel');
  nextButton.setAttribute('data-slide', 'next');
  nextButton.innerHTML = `
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  `;
  carouselShift.append(nextButton);

  // Replace the block content with the new structure
  block.replaceChildren(section);

  // Add event listeners for carousel functionality (mimicking Bootstrap's data-ride="carousel")
  let currentSlide = 0;
  const totalSlides = carouselItems.length;

  const updateCarousel = (newIndex, direction = 'next') => {
    const prevActiveItem = carouselInner.querySelector('.carousel-item.active');
    const prevActiveIndicator = carouselIndicators.querySelector('li.active');

    if (prevActiveItem) {
      prevActiveItem.classList.remove('active');
      // Add temporary classes for transition effect, then remove them
      if (direction === 'next') {
        prevActiveItem.classList.add('carousel-item-left');
      } else {
        prevActiveItem.classList.add('carousel-item-right');
      }
    }
    if (prevActiveIndicator) {
      prevActiveIndicator.classList.remove('active');
    }

    const nextActiveItem = carouselInner.children[newIndex];
    const nextActiveIndicator = carouselIndicators.children[newIndex];

    if (nextActiveItem) {
      if (direction === 'next') {
        nextActiveItem.classList.add('carousel-item-next');
      } else {
        nextActiveItem.classList.add('carousel-item-prev');
      }

      // Force reflow
      // eslint-disable-next-line no-unused-expressions
      nextActiveItem.offsetWidth;

      nextActiveItem.classList.add('active');
      if (direction === 'next') {
        nextActiveItem.classList.remove('carousel-item-next');
      } else {
        nextActiveItem.classList.remove('carousel-item-prev');
      }
    }
    if (nextActiveIndicator) {
      nextActiveIndicator.classList.add('active');
    }

    // Clean up old item's temporary classes after a short delay to allow transition
    if (prevActiveItem) {
      setTimeout(() => {
        prevActiveItem.classList.remove('carousel-item-left', 'carousel-item-right');
      }, 600); // Match Bootstrap's default transition duration
    }

    currentSlide = newIndex;
  };

  prevButton.addEventListener('click', () => {
    let newIndex = currentSlide - 1;
    if (newIndex < 0) {
      newIndex = totalSlides - 1;
    }
    updateCarousel(newIndex, 'prev');
  });

  nextButton.addEventListener('click', () => {
    let newIndex = currentSlide + 1;
    if (newIndex >= totalSlides) {
      newIndex = 0;
    }
    updateCarousel(newIndex, 'next');
  });

  carouselIndicators.querySelectorAll('li').forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      const direction = index > currentSlide ? 'next' : 'prev';
      updateCarousel(index, direction);
    });
  });
}
