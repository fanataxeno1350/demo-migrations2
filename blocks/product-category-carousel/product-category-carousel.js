import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const slides = [...block.children];

  const root = document.createElement('div');
  root.classList.add('elementor-element', 'elementor-element-67886307', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');
  root.append(innerCon);

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add(
    'elementor-element',
    'elementor-element-56e2d22b',
    'elementor-pagination-type-bullets',
    'elementor-pagination-position-outside',
    'elementor-widget',
    'elementor-widget-n-carousel',
    'e-widget-swiper',
  );
  innerCon.append(carouselWrapper);

  const widgetContainer = document.createElement('div');
  widgetContainer.classList.add('elementor-widget-container');
  carouselWrapper.append(widgetContainer);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('e-n-carousel', 'swiper', 'offset-right');
  swiperEl.setAttribute('role', 'region');
  swiperEl.setAttribute('aria-roledescription', 'carousel');
  swiperEl.setAttribute('aria-label', 'Explore Other Categories');
  swiperEl.setAttribute('dir', 'ltr');
  // Swiper adds these classes automatically on init. Do not add manually.
  // swiperEl.classList.add('swiper-initialized', 'swiper-horizontal', 'swiper-pointer-events');
  widgetContainer.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('aria-live', 'polite');
  swiperEl.append(swiperWrapper);

  slides.forEach((row, index) => {
    const [imageCell, labelCell, linkCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    slide.setAttribute('data-slide', index + 1);
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} / ${slides.length}`);
    moveInstrumentation(row, slide);

    const slideInnerCon = document.createElement('div');
    slideInnerCon.classList.add('elementor-element', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');
    slide.append(slideInnerCon);

    const slideInnerInnerCon = document.createElement('div');
    slideInnerInnerCon.classList.add('e-con-inner');
    slideInnerCon.append(slideInnerInnerCon);

    const fullCon = document.createElement('div');
    fullCon.classList.add('elementor-element', 'e-con-full', 'e-flex', 'e-con', 'e-child');
    slideInnerInnerCon.append(fullCon);

    const imageWidget = document.createElement('div');
    imageWidget.classList.add(
      'elementor-element',
      'dce_masking-none',
      'elementor-widget',
      'elementor-widget-image',
    );
    fullCon.append(imageWidget);

    const imageWidgetContainer = document.createElement('div');
    imageWidgetContainer.classList.add('elementor-widget-container');
    imageWidget.append(imageWidgetContainer);

    const categoryLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      categoryLink.href = foundLink.href;
    }

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        categoryLink.append(optimizedPic);
      }
    }
    imageWidgetContainer.append(categoryLink);

    const buttonWidget = document.createElement('div');
    buttonWidget.classList.add(
      'elementor-element',
      'elementor-align-justify',
      'elementor-widget',
      'elementor-widget-button',
    );
    fullCon.append(buttonWidget);

    const buttonWidgetContainer = document.createElement('div');
    buttonWidgetContainer.classList.add('elementor-widget-container');
    buttonWidget.append(buttonWidgetContainer);

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('elementor-button-wrapper');
    buttonWidgetContainer.append(buttonWrapper);

    const buttonLink = document.createElement('a');
    buttonLink.classList.add('elementor-button', 'elementor-button-link', 'elementor-size-sm');
    if (foundLink) {
      buttonLink.href = foundLink.href;
    }
    buttonWrapper.append(buttonLink);

    const buttonContentWrapper = document.createElement('span');
    buttonContentWrapper.classList.add('elementor-button-content-wrapper');
    buttonLink.append(buttonContentWrapper);

    const buttonIcon = document.createElement('span');
    buttonIcon.classList.add('elementor-button-icon');
    buttonIcon.innerHTML = `<svg aria-hidden="true" class="e-font-icon-svg e-fas-arrow-right" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>`;
    buttonContentWrapper.append(buttonIcon);

    const buttonText = document.createElement('span');
    buttonText.classList.add('elementor-button-text');
    buttonText.textContent = labelCell.textContent.trim();
    buttonContentWrapper.append(buttonText);

    swiperWrapper.append(slide);
  });

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  widgetContainer.append(paginationEl);

  block.replaceChildren(root);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 3,
    spaceBetween: 0,
    loop: swiperEl.dataset.infinite === 'yes', // Read from original HTML data-settings
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 75, // From offset_width_mobile
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 15, // From offset_width_tablet
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 80, // From offset_width
      },
    },
  });
}
