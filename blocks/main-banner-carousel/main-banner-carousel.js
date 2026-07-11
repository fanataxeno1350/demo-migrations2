import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  // Consume the container placeholder row for 'banners' field
  const [bannersContainerRow, ...itemRows] = allRows;

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('cmp-carousel__container');
  moveInstrumentation(bannersContainerRow, carouselWrapper);

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  carouselWrapper.append(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.append(slickTrack);

  itemRows.forEach((row, index) => {
    const [
      backgroundImageCell,
      logoImageCell,
      titleCell,
      subtitleCell,
      desktopImageCell,
      mobileImageCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      itemDiv.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
    }
    itemDiv.setAttribute('data-slick-index', index);
    itemDiv.setAttribute('aria-hidden', index !== 0);
    itemDiv.setAttribute('tabindex', index === 0 ? '0' : '-1');
    itemDiv.setAttribute('role', 'tabpanel');
    itemDiv.setAttribute('aria-roledescription', 'slide');
    itemDiv.setAttribute('aria-label', `Slide ${index + 1} of ${itemRows.length}`);
    moveInstrumentation(row, itemDiv);

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner', 'cmp-banner--logo');
    itemDiv.append(bannerDiv);

    const cmpBannerDiv = document.createElement('div');
    cmpBannerDiv.classList.add('cmp-banner');
    cmpBannerDiv.setAttribute('data-component', 'banner');
    if (backgroundImageCell) {
      const bgImg = backgroundImageCell.querySelector('img');
      if (bgImg) {
        cmpBannerDiv.style.backgroundImage = `url("${bgImg.src}")`;
      }
    }
    bannerDiv.append(cmpBannerDiv);

    const cmpBannerContentDiv = document.createElement('div');
    cmpBannerContentDiv.classList.add('cmp-banner__content');
    cmpBannerDiv.append(cmpBannerContentDiv);

    if (logoImageCell) {
      const logoWrapper = document.createElement('div');
      logoWrapper.classList.add('cmp-banner__item-logo');
      const logoImg = logoImageCell.querySelector('img');
      if (logoImg) {
        const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '100' }]);
        // moveInstrumentation for picture element
        const originalPicture = logoImg.closest('picture');
        if (originalPicture) {
          moveInstrumentation(originalPicture, optimizedLogoPic);
        }
        logoWrapper.append(optimizedLogoPic);
      }
      cmpBannerContentDiv.append(logoWrapper);
    }

    if (titleCell && titleCell.textContent.trim()) {
      const titleH2 = document.createElement('h2');
      titleH2.classList.add('cmp-banner__title');
      titleH2.textContent = titleCell.textContent.trim();
      cmpBannerContentDiv.append(titleH2);
    }

    if (subtitleCell && subtitleCell.textContent.trim()) {
      const subtitleH3 = document.createElement('h3');
      subtitleH3.classList.add('cmp-banner__sub-title');
      subtitleH3.textContent = subtitleCell.textContent.trim();
      cmpBannerContentDiv.append(subtitleH3);
    }

    if (desktopImageCell || mobileImageCell) {
      const picture = document.createElement('picture');
      picture.classList.add('w-100', 'd-block');

      if (mobileImageCell) {
        const mobileImg = mobileImageCell.querySelector('img');
        if (mobileImg) {
          const source = document.createElement('source');
          source.setAttribute('media', '(max-width: 600px)');
          source.setAttribute('srcset', mobileImg.src);
          picture.append(source);
        }
      }

      if (desktopImageCell) {
        const desktopImg = desktopImageCell.querySelector('img');
        if (desktopImg) {
          const img = document.createElement('img');
          img.src = desktopImg.src;
          img.alt = desktopImg.alt;
          img.classList.add('cmp-banner__image', 'w-100', 'd-block');
          picture.append(img);
        }
      }
      cmpBannerContentDiv.append(picture);
    }

    if (ctaLinkCell || ctaLabelCell) {
      const buttonWrapper = document.createElement('div');
      // Original HTML has 'null button cmp-button--primary-anchor', 'null' is not a valid class.
      // Assuming 'button-container' is the intended wrapper class for buttons.
      buttonWrapper.classList.add('button-container', 'button', 'cmp-button--primary-anchor');

      const ctaLink = document.createElement('a');
      ctaLink.classList.add('cmp-button');
      const foundLink = ctaLinkCell?.querySelector('a');
      if (foundLink) {
        ctaLink.href = foundLink.href;
        // moveInstrumentation for the anchor element
        moveInstrumentation(foundLink, ctaLink);
      } else {
        ctaLink.href = '#';
      }
      ctaLink.setAttribute('data-request', 'true');
      ctaLink.setAttribute('tabindex', index === 0 ? '0' : '-1');

      const ctaSpan = document.createElement('span');
      ctaSpan.classList.add('cmp-button__text');
      ctaSpan.textContent = ctaLabelCell?.textContent.trim() || 'Click to Explore';
      ctaLink.append(ctaSpan);

      buttonWrapper.append(ctaLink);
      cmpBannerContentDiv.append(buttonWrapper);
    }

    slickTrack.append(itemDiv);
  });

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('aria-disabled', 'true');
  prevBtn.textContent = 'Previous';
  carouselWrapper.prepend(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('slick-next', 'slick-arrow');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('aria-disabled', 'false');
  nextBtn.textContent = 'Next';
  carouselWrapper.append(nextBtn);

  const paginationUl = document.createElement('ul');
  paginationUl.classList.add('slick-dots');
  paginationUl.setAttribute('role', 'tablist');
  carouselWrapper.append(paginationUl);

  itemRows.forEach((_, index) => {
    const li = document.createElement('li');
    if (index === 0) {
      li.classList.add('slick-active');
    }
    li.setAttribute('role', 'presentation');

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.setAttribute('id', `slick-slide-control0${index}`);
    button.setAttribute('aria-controls', `slick-slide0${index}`);
    button.setAttribute('aria-label', `${index + 1} of ${itemRows.length}`);
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    button.setAttribute('aria-selected', index === 0);
    button.textContent = index + 1;
    li.append(button);
    paginationUl.append(li);
  });

  const mainDiv = document.createElement('div');
  mainDiv.classList.add('slickcarousel', 'carousel', 'panelcontainer', 'main-banner');
  mainDiv.append(carouselWrapper);

  block.replaceChildren(mainDiv);

  // Load Slick Carousel and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css');
  await loadScript('https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js');

  // Initialize Slick Carousel
  // eslint-disable-next-line no-undef
  $(slickList).slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: prevBtn,
    nextArrow: nextBtn,
    appendDots: paginationUl,
    customPaging: function (slider, i) {
      return $(paginationUl.children[i]);
    },
  });

  // Update button tabindex based on active slide
  $(slickList).on('afterChange', function (event, slick, currentSlide) {
    itemRows.forEach((_, index) => {
      const itemEl = slickTrack.children[index];
      const ctaButton = itemEl.querySelector('.cmp-button');
      const dotButton = paginationUl.children[index].querySelector('button');

      if (index === currentSlide) {
        itemEl.setAttribute('tabindex', '0');
        itemEl.setAttribute('aria-hidden', 'false');
        if (ctaButton) ctaButton.setAttribute('tabindex', '0');
        if (dotButton) dotButton.setAttribute('tabindex', '0');
      } else {
        itemEl.setAttribute('tabindex', '-1');
        itemEl.setAttribute('aria-hidden', 'true');
        if (ctaButton) ctaButton.setAttribute('tabindex', '-1');
        if (dotButton) dotButton.setAttribute('tabindex', '-1');
      }
    });

    if (currentSlide === 0) {
      prevBtn.classList.add('slick-disabled');
      prevBtn.setAttribute('aria-disabled', 'true');
    } else {
      prevBtn.classList.remove('slick-disabled');
      prevBtn.setAttribute('aria-disabled', 'false');
    }

    if (currentSlide === slick.slideCount - 1) {
      nextBtn.classList.add('slick-disabled');
      nextBtn.setAttribute('aria-disabled', 'true');
    } else {
      nextBtn.classList.remove('slick-disabled');
      nextBtn.setAttribute('aria-disabled', 'false');
    }
  });
}
