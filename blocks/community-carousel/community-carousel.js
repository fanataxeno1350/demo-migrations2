import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // Load Swiper CSS and JS
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('cmp-carousel__container', 'swiper'); // 'swiper' class for Swiper.js
  swiperContainer.setAttribute('data-cmp-is', 'carousel'); // From original HTML
  swiperContainer.setAttribute('data-show-arrows', 'true'); // From original HTML
  swiperContainer.setAttribute('data-show-dots', 'true'); // From original HTML
  swiperContainer.setAttribute('data-item-count-per-slide', '1'); // From original HTML
  swiperContainer.setAttribute('data-auto-play-is-enabled', 'false'); // From original HTML
  swiperContainer.setAttribute('data-auto-play-speed-in-ms', '5000'); // From original HTML
  swiperContainer.setAttribute('data-reveal-next-item-partially', 'false'); // From original HTML
  swiperContainer.setAttribute('data-component', 'carousel'); // From original HTML

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('slick-prev', 'slick-arrow', 'swiper-button-prev'); // Swiper navigation class
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.setAttribute('type', 'button');
  prevBtn.textContent = 'Previous';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('slick-list', 'draggable', 'swiper-wrapper'); // 'swiper-wrapper' for Swiper.js

  const paginationDots = document.createElement('div'); // Swiper uses a div for pagination
  paginationDots.classList.add('slick-dots', 'swiper-pagination'); // 'swiper-pagination' for Swiper.js
  paginationDots.setAttribute('role', 'tablist');

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('slick-next', 'slick-arrow', 'swiper-button-next'); // Swiper navigation class
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.setAttribute('type', 'button');
  nextBtn.textContent = 'Next';

  const allRows = [...block.children];

  // Consume the container placeholder row (Rule 13a)
  const containerRow = allRows.shift();
  if (containerRow) {
    // move instrumentation from the placeholder row to the main slides container
    moveInstrumentation(containerRow, swiperContainer);
  }

  allRows.forEach((row, index) => {
    const [
      backgroundImageDesktopCell,
      backgroundImageMobileCell,
      titleCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('cmp-carousel__item', 'swiper-slide'); // 'swiper-slide' for Swiper.js
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${index + 1} of ${allRows.length}`);
    slide.setAttribute('data-cmp-hook-carousel', 'item');

    const teaser = document.createElement('div');
    teaser.classList.add('teaser', 'cmp-teaser--carousel-teaser');

    const cmpTeaser = document.createElement('div');
    cmpTeaser.classList.add('cmp-teaser');
    cmpTeaser.setAttribute('data-component', 'teaser');
    cmpTeaser.setAttribute('data-show-media-url', 'false');
    cmpTeaser.setAttribute('data-initialized', 'true');

    const desktopPicture = backgroundImageDesktopCell?.querySelector('picture');
    const mobilePicture = backgroundImageMobileCell?.querySelector('picture');

    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
        // Move instrumentation for the original image to the optimized one
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cmpTeaser.setAttribute('data-background-image-desktop', optimizedPic.querySelector('img').src);
        cmpTeaser.style.backgroundImage = `url("${optimizedPic.querySelector('img').src}")`;
      }
    }
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // Move instrumentation for the original image to the optimized one
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cmpTeaser.setAttribute('data-background-image-mobile', optimizedPic.querySelector('img').src);
      }
    }

    const content = document.createElement('div');
    content.classList.add('cmp-teaser__content');

    const title = document.createElement('h2');
    title.classList.add('cmp-teaser__title');
    title.textContent = titleCell?.textContent.trim() || '';

    const description = document.createElement('div');
    description.classList.add('cmp-teaser__description');
    description.innerHTML = descriptionCell?.innerHTML || '';

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('cmp-teaser__action-container');

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--primary-anchor');

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('cmp-button');
    const foundLink = ctaLinkCell?.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
      ctaLink.target = foundLink.target;
    }
    ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';

    // Move instrumentation from the authored row to the new slide element
    moveInstrumentation(row, slide);

    buttonDiv.append(ctaLink);
    actionContainer.append(buttonDiv);
    content.append(title, description, actionContainer);
    cmpTeaser.append(content);
    teaser.append(cmpTeaser);
    slide.append(teaser);
    swiperWrapper.append(slide);
  });

  swiperContainer.append(prevBtn, swiperWrapper, nextBtn, paginationDots);
  block.replaceChildren(swiperContainer);

  // Initialize Swiper
  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 1,
    loop: false, // Based on data-show-infinite-scroll="false"
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationDots,
      clickable: true,
      renderBullet(index, className) {
        return `<button type="button" role="tab" class="${className}" aria-label="${index + 1} of ${allRows.length}" tabindex="-1">${index + 1}</button>`;
      },
    },
  });

  // Update initial active states for pagination and navigation buttons
  const initialActiveSlide = swiperContainer.querySelector('.swiper-slide-active');
  if (initialActiveSlide) {
    const initialIndex = Array.from(swiperWrapper.children).indexOf(initialActiveSlide);
    const initialPaginationButton = paginationDots.querySelector(`.swiper-pagination-bullet:nth-child(${initialIndex + 1})`);
    if (initialPaginationButton) {
      initialPaginationButton.setAttribute('tabindex', '0');
      initialPaginationButton.setAttribute('aria-selected', 'true');
    }
  }
}
