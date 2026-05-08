import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  const slideRows = allRows.filter((row) => row.children.length === 8);
  const quickLinkRows = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  // Swiper will add swiper-initialized, swiper-horizontal, swiper-watch-progress

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row) => {
    const [
      imageDesktopCell,
      imageTabletCell,
      imageMobileCell,
      pretitleCell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');
    const imgDesktop = imageDesktopCell.querySelector('img');
    const imgTablet = imageTabletCell.querySelector('img');
    const imgMobile = imageMobileCell.querySelector('img');

    if (imgMobile) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = imgMobile.src;
      picture.append(sourceMobile);
    }
    if (imgTablet) {
      const sourceTablet = document.createElement('source');
      sourceTablet.media = '(max-width: 799px)';
      sourceTablet.srcset = imgTablet.src;
      picture.append(sourceTablet);
    }
    if (imgDesktop) {
      const optimizedImg = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '1903' }]);
      const img = optimizedImg.querySelector('img');
      img.setAttribute('width', '1903');
      img.setAttribute('height', '841');
      img.setAttribute('loading', 'eager');
      picture.append(img);
    }
    slideBgImg.append(picture);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    const pretitleText = pretitleCell.textContent.trim();
    if (pretitleText) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = pretitleText;
      contentDiv.append(small);
    }

    const headingText = headingCell.textContent.trim();
    if (headingText) {
      const heading = document.createElement('h1');
      heading.classList.add('heading', 'font-medium', 'font-size-tb');
      heading.innerHTML = headingText;
      contentDiv.append(heading);
    }

    const descriptionText = descriptionCell.textContent.trim();
    if (descriptionText) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${descriptionText}</strong>`;
      contentDiv.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      // Check original HTML for target attribute, assuming _blank for CTA links
      anchor.target = ctaLink.target || '_self';
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn');
      contentDiv.append(anchor);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(swiperSlide);
  });

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>`;

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>`;

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');

  beamSlider.append(swiperWrapper, prevBtn, nextBtn, pagination);
  section.append(beamSlider);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add(
    'mt-0',
    'pt-1',
    'pb-1',
    'm-none1',
    'bottom-0',
    'w-100',
    'quick-links-parents-div',
    'position-relative',
  );

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksDiv = document.createElement('ul');
  quickLinksDiv.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = foundLink.target || '_blank'; // Preserve target from original HTML
    }
    anchor.textContent = labelCell.textContent.trim();
    anchor.classList.add('with-full-underline');
    moveInstrumentation(row, anchor);
    li.append(anchor);
    quickLinksDiv.append(li);
  });

  container.append(quickLinksDiv);
  quickLinksParentDiv.append(container);
  section.append(quickLinksParentDiv);

  block.replaceChildren(section);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true, // Assuming loop from typical hero sliders
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });

  // The createOptimizedPicture call is already handled for each image in the slideRows.forEach loop.
  // This block.querySelectorAll loop is redundant and can cause issues if run after Swiper's DOM manipulation.
  // Removing it.
}
