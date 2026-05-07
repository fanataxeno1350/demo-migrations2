import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
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
  carouselWrapper.setAttribute('data-id', '56e2d22b');
  carouselWrapper.setAttribute('data-element_type', 'widget');
  carouselWrapper.setAttribute(
    'data-settings',
    '{"carousel_items":[],"slides_to_show":"3","offset_sides":"right","offset_width_tablet":{"unit":"px","size":15,"sizes":[]},"offset_width_mobile":{"unit":"px","size":75,"sizes":[]},"image_spacing_custom_mobile":{"unit":"px","size":0,"sizes":[]},"image_spacing_custom":{"unit":"px","size":0,"sizes":[]},"slides_to_show_tablet":"3","slides_to_show_mobile":"1","infinite":"yes","speed":500,"offset_width":{"unit":"px","size":80,"sizes":[]},"pagination":"bullets","image_spacing_custom_tablet":{"unit":"px","size":"","sizes":[]}}',
  );
  carouselWrapper.setAttribute('data-widget_type', 'nested-carousel.default');
  innerCon.append(carouselWrapper);

  const widgetContainer = document.createElement('div');
  widgetContainer.classList.add('elementor-widget-container');
  carouselWrapper.append(widgetContainer);

  const swiperEl = document.createElement('div');
  swiperEl.classList.add('e-n-carousel', 'swiper', 'offset-right');
  // Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-pointer-events' as Swiper adds them
  swiperEl.setAttribute('role', 'region');
  swiperEl.setAttribute('aria-roledescription', 'carousel');
  swiperEl.setAttribute('aria-label', 'Explore Other Categories');
  swiperEl.setAttribute('dir', 'ltr');
  widgetContainer.append(swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('aria-live', 'polite');
  swiperEl.append(swiperWrapper);

  [...block.children].forEach((row) => {
    const [imageCell, linkCell, labelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-roledescription', 'slide');
    swiperWrapper.append(swiperSlide);

    const slideInnerContainer = document.createElement('div');
    slideInnerContainer.classList.add('elementor-element', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');
    swiperSlide.append(slideInnerContainer);

    const eConInner = document.createElement('div');
    eConInner.classList.add('e-con-inner');
    slideInnerContainer.append(eConInner);

    const fullCon = document.createElement('div');
    fullCon.classList.add('elementor-element', 'e-con-full', 'e-flex', 'e-con', 'e-child');
    eConInner.append(fullCon);

    const imageWidget = document.createElement('div');
    imageWidget.classList.add('elementor-element', 'dce_masking-none', 'elementor-widget', 'elementor-widget-image');
    imageWidget.setAttribute('data-element_type', 'widget');
    imageWidget.setAttribute('data-widget_type', 'image.default');
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
    buttonWidget.classList.add('elementor-element', 'elementor-align-justify', 'elementor-widget', 'elementor-widget-button');
    buttonWidget.setAttribute('data-element_type', 'widget');
    buttonWidget.setAttribute('data-widget_type', 'button.default');
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
    buttonIcon.innerHTML = `
      <svg aria-hidden="true" class="e-font-icon-svg e-fas-arrow-right" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
    `;
    buttonContentWrapper.append(buttonIcon);

    const buttonText = document.createElement('span');
    buttonText.classList.add('elementor-button-text');
    buttonText.textContent = labelCell.textContent.trim();
    buttonContentWrapper.append(buttonText);

    moveInstrumentation(row, swiperSlide);
  });

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'swiper-pagination-clickable', 'swiper-pagination-bullets', 'swiper-pagination-horizontal');
  widgetContainer.append(paginationEl);

  block.replaceChildren(root);

  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 3,
    spaceBetween: 80, // Matches offset_width from data-settings
    loop: true, // Matches infinite: "yes" from data-settings
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 75, // Matches offset_width_mobile
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 15, // Matches offset_width_tablet
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 80, // Matches offset_width
      },
    },
  });
}
