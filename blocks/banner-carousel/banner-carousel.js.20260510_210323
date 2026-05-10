import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-carousel-section');

  const carouselContainer = document.createElement('div');
  carouselContainer.id = 'carouselExampleSlidesOnly';
  carouselContainer.classList.add('bannerCarousel', 'carousel', 'slide');
  carouselContainer.setAttribute('data-ride', 'carousel'); // This is for Bootstrap 4, will be handled by JS

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('carousel-indicators');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner');

  carouselItems.forEach((row, index) => {
    const [desktopImageCell, mobileImageCell, headingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    // Indicators
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#carouselExampleSlidesOnly');
    indicator.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      indicator.classList.add('active');
    }
    carouselIndicators.append(indicator);

    // Carousel Item
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if (index === 0) {
      carouselItem.classList.add('active');
    }

    // Desktop Image
    const desktopPicture = desktopImageCell.querySelector('picture');
    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const optimizedDesktopPic = createOptimizedPicture(
        desktopImg.src,
        desktopImg.alt,
        index === 0,
        [{ width: '2000' }],
      );
      optimizedDesktopPic.querySelector('img').classList.add('d-none', 'd-sm-block', 'w-100', 'desktop-image');
      moveInstrumentation(desktopImageCell, optimizedDesktopPic);
      carouselItem.append(optimizedDesktopPic);
    }

    // Mobile Image
    const mobilePicture = mobileImageCell.querySelector('picture');
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const optimizedMobilePic = createOptimizedPicture(
        mobileImg.src,
        mobileImg.alt,
        index === 0,
        [{ width: '750' }],
      );
      optimizedMobilePic.querySelector('img').classList.add('d-block', 'd-sm-none', 'w-100', 'mobile-image');
      moveInstrumentation(mobileImageCell, optimizedMobilePic);
      carouselItem.append(optimizedMobilePic);
    }

    // Banner Content Wrapper
    const bannerContentWrapper = document.createElement('div');
    bannerContentWrapper.classList.add('banner-content-wrapper', 'position-absolute');

    // Heading
    const heading = document.createElement('h1');
    heading.classList.add('koi-carousel-heading', 'text-sm-left');
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, heading);
    bannerContentWrapper.append(heading);

    // Description
    const description = document.createElement('div');
    description.classList.add('koi-carousel-description');
    description.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, description);
    bannerContentWrapper.append(description);

    // CTA Link
    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.href = ctaLink.href;
      ctaAnchor.textContent = ctaLabelCell.textContent.trim();
      ctaAnchor.classList.add('koi-carousel-cta', 'btn', 'btn-primary', 'btn-start-now');
      ctaAnchor.setAttribute('alt', ctaLabelCell.textContent.trim());
      // Check for target="_blank" from original HTML if available, otherwise assume default
      if (ctaLink.target === '_blank') {
        ctaAnchor.setAttribute('target', '_blank');
        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('cmp-link__screen-reader-only');
        srOnlySpan.textContent = 'opens in a new tab';
        ctaAnchor.append(srOnlySpan);
      }
      moveInstrumentation(ctaLinkCell, ctaAnchor);
      moveInstrumentation(ctaLabelCell, ctaAnchor);
      bannerContentWrapper.append(ctaAnchor);
    }

    carouselItem.append(bannerContentWrapper);
    carouselInner.append(carouselItem);
    moveInstrumentation(row, carouselItem);
  });

  carouselContainer.append(carouselIndicators, carouselInner);

  // Next and previous buttons
  const nextCarouselBtn = document.createElement('div');
  nextCarouselBtn.classList.add('next-carousel-btn');

  const prevButton = document.createElement('a');
  prevButton.classList.add('carousel-control-prev');
  prevButton.href = '#carouselExampleSlidesOnly';
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('data-slide', 'prev');
  prevButton.innerHTML = `
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  `;

  const nextButton = document.createElement('a');
  nextButton.classList.add('carousel-control-next');
  nextButton.href = '#carouselExampleSlidesOnly';
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('data-slide', 'next');
  nextButton.innerHTML = `
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  `;

  nextCarouselBtn.append(prevButton, nextButton);
  carouselContainer.append(nextCarouselBtn);

  section.append(carouselContainer);
  block.replaceChildren(section);

  // Load Bootstrap Carousel JS and CSS
  await loadCSS('https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js');

  // Initialize Bootstrap Carousel
  // eslint-disable-next-line no-undef
  $(carouselContainer).carousel({
    interval: false, // Disable auto-advance if not specified in original HTML
  });
}
