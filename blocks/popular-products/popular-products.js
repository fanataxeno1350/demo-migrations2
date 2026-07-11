import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, subtitleRow, productsContainer, ...itemRows] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('cmp-popular-products'); // Class from ORIGINAL HTML

  // Header section
  const headerSection = document.createElement('div');
  headerSection.classList.add('cmp-popular-products__header-section'); // Class from ORIGINAL HTML
  moveInstrumentation(titleRow, headerSection);

  const title = document.createElement('h2');
  title.classList.add('cmp-popular-products__title'); // Class from ORIGINAL HTML
  title.textContent = titleRow?.textContent.trim() || '';
  headerSection.append(title);

  const subtitle = document.createElement('div');
  subtitle.classList.add('cmp-popular-products__subtitle'); // Class from ORIGINAL HTML
  subtitle.textContent = subtitleRow?.textContent.trim() || '';
  moveInstrumentation(subtitleRow, subtitle);
  headerSection.append(subtitle);

  root.append(headerSection);

  // Carousel section
  const carouselSection = document.createElement('div');
  carouselSection.classList.add('cmp-popular-products__carousel'); // Class from ORIGINAL HTML

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer'); // Classes from ORIGINAL HTML

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel', 'swiper'); // 'swiper' class added for Swiper.js
  moveInstrumentation(productsContainer, cmpCarousel); // Move instrumentation from the container placeholder

  // Extract data attributes from the original block for Swiper config
  const blockDataset = block.dataset;
  cmpCarousel.dataset.showInfiniteScroll = blockDataset.infiniteScroll === 'true';
  cmpCarousel.dataset.showArrows = blockDataset.showArrows === 'true';
  cmpCarousel.dataset.showDots = blockDataset.meatballs === 'true';
  cmpCarousel.dataset.itemCountPerSlide = blockDataset.itemCountPerSlide || '1'; // Read from block, default to 1
  cmpCarousel.dataset.autoPlayIsEnabled = blockDataset.autoPlayIsEnabled === 'true';
  cmpCarousel.dataset.autoPlaySpeedInMs = blockDataset.autoPlaySpeedInMs || '3000';
  cmpCarousel.dataset.revealNextItemPartially = blockDataset.revealNextItemPartially || 'false';
  cmpCarousel.dataset.showCenterZoom = blockDataset.showCenterZoom || 'false';
  cmpCarousel.dataset.slidesToScroll = blockDataset.slidesToScroll || '1';

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'swiper-wrapper'); // 'swiper-wrapper' class for Swiper.js

  itemRows
    .filter((row) => row.children.length === 6) // Filter for popular-product-item rows
    .forEach((row) => {
      const [
        backgroundImageCell,
        productImageCell,
        productLinkCell,
        productNameCell,
        productDetailsCell,
        ctaLabelCell,
      ] = [...row.children]; // Destructuring for fixed schema

      const carouselItem = document.createElement('div');
      carouselItem.classList.add('cmp-popular-products__carousel-item', 'cmp-carousel__item', 'swiper-slide'); // 'swiper-slide' class for Swiper.js
      moveInstrumentation(row, carouselItem);

      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('cmp-popular-products__content-wrapper'); // Class from ORIGINAL HTML

      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('cmp-popular-products__image'); // Class from ORIGINAL HTML
      // Handle background image from the cell
      if (backgroundImageCell) {
        const bgPicture = backgroundImageCell.querySelector('picture');
        if (bgPicture) {
          const img = bgPicture.querySelector('img');
          // Use createOptimizedPicture for the background image
          const optimizedBgPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedBgPic.querySelector('img'));
          // Instead of appending, set as background-image style if that's the original intent
          // For now, appending as a direct image, but if it's truly a background, CSS is better.
          // ORIGINAL HTML shows `style="background-image: url(...)` so we should replicate that.
          // However, EDS blocks typically don't generate inline styles.
          // For this exercise, we'll append the image and let CSS handle positioning if needed.
          imageWrapper.append(optimizedBgPic);
        }
      }

      const productLink = productLinkCell?.querySelector('a');
      const productAnchor = document.createElement('a');
      if (productLink) {
        productAnchor.href = productLink.href;
      }

      const lazyImageContainer = document.createElement('div');
      lazyImageContainer.classList.add('lazy-image-container'); // Class from ORIGINAL HTML

      if (productImageCell) {
        const productPicture = productImageCell.querySelector('picture');
        if (productPicture) {
          const img = productPicture.querySelector('img');
          const optimizedProdPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedProdPic.querySelector('img').classList.add('cmp-popular-products__prod-image', 'lazy-image', 'loaded'); // Classes from ORIGINAL HTML
          moveInstrumentation(img, optimizedProdPic.querySelector('img'));
          lazyImageContainer.append(optimizedProdPic);
        }
      }
      productAnchor.append(lazyImageContainer);
      imageWrapper.append(productAnchor);
      contentWrapper.append(imageWrapper);

      const productDescription = document.createElement('div');
      productDescription.classList.add('cmp-popular-products__product-description'); // Class from ORIGINAL HTML

      const productName = document.createElement('div');
      productName.classList.add('cmp-popular-products__product-name'); // Class from ORIGINAL HTML
      productName.textContent = productNameCell?.textContent.trim() || '';
      const mobileWeightSpan = document.createElement('span');
      mobileWeightSpan.classList.add('cmp-popular-products__mobile-weight'); // Class from ORIGINAL HTML
      productName.append(mobileWeightSpan);
      productDescription.append(productName);

      const quantityContainer = document.createElement('div');
      quantityContainer.classList.add('cmp-popular-products__quantity-container'); // Class from ORIGINAL HTML
      productDescription.append(quantityContainer);

      const productDetails = document.createElement('div');
      productDetails.classList.add('cmp-popular-products__product-details'); // Class from ORIGINAL HTML
      productDetails.innerHTML = productDetailsCell?.innerHTML || ''; // Richtext field, use innerHTML
      productDescription.append(productDetails);

      const actionDiv = document.createElement('div');
      actionDiv.classList.add('cmp-popular-products__action'); // Class from ORIGINAL HTML
      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-light'); // Classes from ORIGINAL HTML
      const ctaButton = document.createElement('button');
      ctaButton.classList.add('cmp-button'); // Class from ORIGINAL HTML
      ctaButton.setAttribute('type', 'button');
      const ctaSpan = document.createElement('span');
      ctaSpan.classList.add('cmp-button__text'); // Class from ORIGINAL HTML
      ctaSpan.textContent = ctaLabelCell?.textContent.trim() || '';
      ctaButton.append(ctaSpan);
      buttonWrapper.append(ctaButton);
      actionDiv.append(buttonWrapper);
      productDescription.append(actionDiv);

      contentWrapper.append(productDescription);
      carouselItem.append(contentWrapper);
      carouselContainer.append(carouselItem); // Append to swiper-wrapper
    });

  cmpCarousel.append(carouselContainer); // Swiper container holds the wrapper

  // Swiper navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('slick-prev', 'slick-arrow', 'swiper-button-prev'); // Classes from ORIGINAL HTML, plus Swiper class
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.setAttribute('type', 'button');
  prevBtn.textContent = 'Previous';
  cmpCarousel.append(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('slick-next', 'slick-arrow', 'swiper-button-next'); // Classes from ORIGINAL HTML, plus Swiper class
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.setAttribute('type', 'button');
  nextBtn.textContent = 'Next';
  cmpCarousel.append(nextBtn);

  // Swiper pagination dots
  const paginationEl = document.createElement('div'); // Swiper pagination is typically a div
  paginationEl.classList.add('slick-dots', 'swiper-pagination'); // Classes from ORIGINAL HTML, plus Swiper class
  paginationEl.setAttribute('role', 'tablist');
  cmpCarousel.append(paginationEl);

  carouselWrapper.append(cmpCarousel);
  carouselSection.append(carouselWrapper);
  root.append(carouselSection);

  block.replaceChildren(root);

  // Load Swiper Carousel and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(cmpCarousel, {
    slidesPerView: parseInt(cmpCarousel.dataset.itemCountPerSlide, 10),
    loop: cmpCarousel.dataset.showInfiniteScroll === 'true', // Use dataset for loop
    autoplay: cmpCarousel.dataset.autoPlayIsEnabled === 'true' ? {
      delay: parseInt(cmpCarousel.dataset.autoPlaySpeedInMs, 10),
      disableOnInteraction: false,
    } : false,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
      renderBullet: function (index, className) {
        return `<button type="button" role="tab" class="${className}" id="slick-slide-control${index}" aria-controls="slick-slide${index}" aria-label="${index + 1} of ${this.slides.length}" tabindex="-1">${index + 1}</button>`;
      },
    },
    // Add other Swiper options based on original blockDataset
    spaceBetween: 0, // Adjust as needed
    // revealNextItemPartially, showCenterZoom, slidesToScroll are not direct Swiper options
    // and would require custom Swiper configuration or CSS.
  });
}
