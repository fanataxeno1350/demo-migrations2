import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const carouselItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('itc-carousel-section');

  const carouselWrapper = document.createElement('div');
  carouselWrapper.id = 'carouselExampleSlidesOnly';
  carouselWrapper.classList.add('bannerCarousel', 'carousel', 'slide');
  // Use Bootstrap's native data-bs-ride for automatic carousel behavior
  carouselWrapper.setAttribute('data-bs-ride', 'carousel');

  const indicators = document.createElement('ol');
  indicators.classList.add('carousel-indicators');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner');

  carouselItems.forEach((row, i) => {
    const [
      desktopImageCell,
      mobileImageCell,
      headlineCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    // Create indicator
    const indicator = document.createElement('li');
    indicator.setAttribute('data-bs-target', '#carouselExampleSlidesOnly'); // Use data-bs-target for Bootstrap 5
    indicator.setAttribute('data-bs-slide-to', i); // Use data-bs-slide-to for Bootstrap 5
    if (i === 0) {
      indicator.classList.add('active');
      indicator.setAttribute('aria-current', 'true'); // Add aria-current for accessibility
    }
    indicators.append(indicator);

    // Create carousel item
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if (i === 0) {
      carouselItem.classList.add('active');
    }
    moveInstrumentation(row, carouselItem);

    // Desktop Image
    const desktopPicture = desktopImageCell.querySelector('picture');
    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const optimizedDesktopPic = createOptimizedPicture(
        desktopImg.src,
        desktopImg.alt,
        i === 0,
        [{ width: '2000' }],
      );
      optimizedDesktopPic.querySelector('img').classList.add('d-none', 'd-sm-block', 'w-100', 'desktop-image');
      if (i === 0) {
        optimizedDesktopPic.querySelector('img').setAttribute('fetchpriority', 'high');
      } else {
        optimizedDesktopPic.querySelector('img').setAttribute('loading', 'lazy');
        optimizedDesktopPic.querySelector('img').setAttribute('fetchpriority', 'low');
      }
      moveInstrumentation(desktopImageCell, optimizedDesktopPic.querySelector('img'));
      carouselItem.append(optimizedDesktopPic);
    }

    // Mobile Image
    const mobilePicture = mobileImageCell.querySelector('picture');
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const optimizedMobilePic = createOptimizedPicture(
        mobileImg.src,
        mobileImg.alt,
        i === 0,
        [{ width: '750' }],
      );
      optimizedMobilePic.querySelector('img').classList.add('d-block', 'd-sm-none', 'w-100', 'mobile-image');
      if (i === 0) {
        optimizedMobilePic.querySelector('img').setAttribute('fetchpriority', 'high');
      } else {
        optimizedMobilePic.querySelector('img').setAttribute('loading', 'lazy');
        optimizedMobilePic.querySelector('img').setAttribute('fetchpriority', 'low');
      }
      moveInstrumentation(mobileImageCell, optimizedMobilePic.querySelector('img'));
      carouselItem.append(optimizedMobilePic);
    }

    // Content Wrapper
    const bannerContentWrapper = document.createElement('div');
    bannerContentWrapper.classList.add('banner-content-wrapper', 'position-absolute');

    // Headline
    const headline = document.createElement('h1');
    headline.classList.add('koi-carousel-heading', 'text-sm-left');
    headline.textContent = headlineCell.textContent.trim();
    moveInstrumentation(headlineCell, headline);
    bannerContentWrapper.append(headline);

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
      ctaAnchor.setAttribute('target', '_blank'); // Assuming target blank from original HTML
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      ctaAnchor.append(screenReaderSpan);
      moveInstrumentation(ctaLinkCell, ctaAnchor);
      moveInstrumentation(ctaLabelCell, ctaAnchor);
      bannerContentWrapper.append(ctaAnchor);
    }

    carouselItem.append(bannerContentWrapper);
    carouselInner.append(carouselItem);
  });

  carouselWrapper.append(indicators, carouselInner);

  // Next and previous buttons
  const nextCarouselBtn = document.createElement('div');
  nextCarouselBtn.classList.add('next-carousel-btn');

  const prevControl = document.createElement('a');
  prevControl.classList.add('carousel-control-prev');
  prevControl.href = '#carouselExampleSlidesOnly';
  prevControl.setAttribute('role', 'button');
  prevControl.setAttribute('data-bs-slide', 'prev'); // Use data-bs-slide for Bootstrap 5
  prevControl.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span>';

  const nextControl = document.createElement('a');
  nextControl.classList.add('carousel-control-next');
  nextControl.href = '#carouselExampleSlidesOnly';
  nextControl.setAttribute('role', 'button');
  nextControl.setAttribute('data-bs-slide', 'next'); // Use data-bs-slide for Bootstrap 5
  nextControl.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span>';

  nextCarouselBtn.append(prevControl, nextControl);
  carouselWrapper.append(nextCarouselBtn);

  section.append(carouselWrapper);
  block.replaceChildren(section);

  // Load Bootstrap CSS and JS for carousel functionality
  await loadCSS('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js');

  // No need for manual event listeners; Bootstrap handles them via data-bs- attributes.
}
