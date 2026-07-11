import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [prevArrowRow, nextArrowRow, ...slideRows] = [...block.children];

  const carouselWrapper = document.createElement('div');
  // carouselWrapper.classList.add('cmp-carousel'); // Removed: block already has this class
  carouselWrapper.classList.add('panelcontainer'); // Added from ORIGINAL HTML
  carouselWrapper.setAttribute('role', 'group');
  carouselWrapper.setAttribute('aria-live', 'polite');
  carouselWrapper.setAttribute('aria-roledescription', 'carousel');
  carouselWrapper.setAttribute('data-cmp-is', 'carousel');
  carouselWrapper.setAttribute('data-component', 'carousel');
  carouselWrapper.setAttribute('data-auto-play-is-enabled', 'false');
  carouselWrapper.setAttribute('data-show-arrows', 'true');
  carouselWrapper.setAttribute('data-show-dots', 'true');
  carouselWrapper.setAttribute('data-auto-play-speed-in-ms', '15000');
  carouselWrapper.setAttribute('data-cmp-autopause-disabled', '');
  carouselWrapper.setAttribute('data-placeholder-text', 'false');
  moveInstrumentation(block, carouselWrapper);

  const carouselContent = document.createElement('div');
  carouselContent.classList.add('cmp-carousel__content');
  carouselContent.setAttribute('aria-atomic', 'false');
  carouselContent.setAttribute('aria-live', 'polite');

  const carouselActions = document.createElement('div');
  carouselActions.classList.add('cmp-carousel__actions');
  carouselActions.style.visibility = 'visible';

  const prevButton = document.createElement('button');
  prevButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('data-cmp-hook-carousel', 'previous');

  const prevIconSpan = document.createElement('span');
  prevIconSpan.classList.add('cmp-carousel__action-icon');
  const prevIconPicture = prevArrowRow.querySelector('picture');
  if (prevIconPicture) {
    const img = prevIconPicture.querySelector('img');
    // For simple icons, createOptimizedPicture is often overkill and can add unnecessary wrappers.
    // Directly append the img element or a simple picture if needed.
    // The original HTML shows a direct <img> inside the span.
    const iconImg = document.createElement('img');
    iconImg.src = img.src;
    iconImg.alt = img.alt;
    prevIconSpan.append(iconImg);
  }
  prevButton.append(prevIconSpan);
  moveInstrumentation(prevArrowRow, prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('data-cmp-hook-carousel', 'next');

  const nextIconSpan = document.createElement('span');
  nextIconSpan.classList.add('cmp-carousel__action-icon');
  const nextIconPicture = nextArrowRow.querySelector('picture');
  if (nextIconPicture) {
    const img = nextIconPicture.querySelector('img');
    const iconImg = document.createElement('img');
    iconImg.src = img.src;
    iconImg.alt = img.alt;
    nextIconSpan.append(iconImg);
  }
  nextButton.append(nextIconSpan);
  moveInstrumentation(nextArrowRow, nextButton);

  carouselActions.append(prevButton, nextButton);

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('cmp-carousel__indicators');
  carouselIndicators.setAttribute('role', 'tablist');
  carouselIndicators.setAttribute('aria-label', 'Choose a slide to display');
  carouselIndicators.setAttribute('data-cmp-hook-carousel', 'indicators');
  carouselIndicators.style.visibility = 'visible';

  slideRows
    .filter((row) => row.children.length === 3)
    .forEach((row, i) => {
      const [desktopImageCell, mobileImageCell, slideLinkCell] = [...row.children];

      const itemPanel = document.createElement('div');
      itemPanel.classList.add('cmp-carousel__item');
      if (i === 0) {
        itemPanel.classList.add('cmp-carousel__item--active');
      }
      itemPanel.setAttribute('role', 'tabpanel');
      itemPanel.setAttribute('aria-roledescription', 'slide');
      itemPanel.setAttribute('aria-label', `Slide ${i + 1} of ${slideRows.length}`);
      itemPanel.setAttribute('data-cmp-hook-carousel', 'item');
      moveInstrumentation(row, itemPanel);

      const teaserDiv = document.createElement('div');
      teaserDiv.classList.add('teaser', 'cmp-teaser--first-component', 'cmp-teaser');
      // Original HTML also has cmp-teaser--full-bg-text-center-image-bottom-button and cmp-button--secondary-anchor
      // These are conditional based on content, but not present in the first slide example.
      // For now, only add the ones that are consistently present.

      const slideLink = slideLinkCell.querySelector('a');
      let linkElement;
      if (slideLink) {
        linkElement = document.createElement('a');
        linkElement.classList.add('cmp-teaser__link');
        linkElement.href = slideLink.href;
      }

      const teaserContent = document.createElement('div');
      teaserContent.classList.add('cmp-teaser__content');

      const teaserImage = document.createElement('div');
      teaserImage.classList.add('cmp-teaser__image');

      const imageDiv = document.createElement('div');
      imageDiv.classList.add('cmp-image');
      imageDiv.setAttribute('itemscope', '');
      imageDiv.setAttribute('itemtype', 'http://schema.org/ImageObject');

      const picture = document.createElement('picture');
      const desktopImg = desktopImageCell.querySelector('img');
      const mobileImg = mobileImageCell.querySelector('img');

      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.setAttribute('media', '(max-width:767px)');
        sourceMobile.srcset = mobileImg.src;
        picture.append(sourceMobile);
      }

      if (desktopImg) {
        const img = document.createElement('img');
        img.src = desktopImg.src;
        img.alt = desktopImg.alt;
        img.loading = 'lazy';
        img.fetchPriority = 'low';
        img.classList.add('cmp-image__image');
        img.setAttribute('itemprop', 'contentUrl');
        picture.append(img);
        moveInstrumentation(desktopImageCell, img);
      }
      imageDiv.append(picture);
      teaserImage.append(imageDiv);

      if (linkElement) {
        linkElement.append(teaserContent, teaserImage);
        teaserDiv.append(linkElement);
      } else {
        teaserDiv.append(teaserContent, teaserImage);
      }

      itemPanel.append(teaserDiv);
      carouselContent.append(itemPanel);

      const indicator = document.createElement('li');
      indicator.classList.add('cmp-carousel__indicator');
      if (i === 0) {
        indicator.classList.add('cmp-carousel__indicator--active');
      }
      carouselIndicators.append(indicator);
    });

  carouselWrapper.append(carouselContent, carouselActions, carouselIndicators);

  // Add event listeners for carousel functionality
  let currentSlide = 0;
  const slides = [...carouselContent.children];
  const indicators = [...carouselIndicators.children];
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('cmp-carousel__item--active', i === index);
      indicators[i].classList.toggle('cmp-carousel__indicator--active', i === index);
    });
    currentSlide = index;
  }

  prevButton.addEventListener('click', () => {
    const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(newIndex);
  });

  nextButton.addEventListener('click', () => {
    const newIndex = (currentSlide + 1) % totalSlides;
    showSlide(newIndex);
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSlide(index);
    });
  });

  block.replaceChildren(carouselWrapper);
}
