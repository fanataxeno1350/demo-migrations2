import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children].filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  // Consume container placeholders first
  // The first two rows are implicitly the "slides" and "quickLinks" containers based on the model.
  // The actual items for these containers follow.
  const [slidesContainerRow, quickLinksContainerRow, ...itemRows] = allRows;

  const sliderItems = itemRows.filter((row) => row.children.length === 8);
  const quickLinkItems = itemRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  moveInstrumentation(slidesContainerRow, beamSlider); // Move instrumentation from slides container

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  sliderItems.forEach((row) => {
    const [
      desktopImageCell,
      tabletImageCell,
      mobileImageCell,
      pretitleCell,
      headlineCell,
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

    const mobileSource = document.createElement('source');
    mobileSource.media = '(max-width: 576px)';
    const mobileImg = mobileImageCell?.querySelector('img');
    if (mobileImg) {
      mobileSource.srcset = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [
        { width: '576' },
      ]).querySelector('img').src;
    }
    picture.append(mobileSource);

    const tabletSource = document.createElement('source');
    tabletSource.media = '(max-width: 799px)';
    const tabletImg = tabletImageCell?.querySelector('img');
    if (tabletImg) {
      tabletSource.srcset = createOptimizedPicture(tabletImg.src, tabletImg.alt, false, [
        { width: '799' },
      ]).querySelector('img').src;
    }
    picture.append(tabletSource);

    const desktopImg = desktopImageCell?.querySelector('img');
    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [
        { width: '1903' },
      ]).querySelector('img');
      img.loading = 'eager';
      img.fetchPriority = 'high';
      picture.append(img);
    }
    slideBgImg.append(picture);
    swiperSlide.append(slideBgImg);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    const pretitle = pretitleCell?.textContent.trim();
    if (pretitle) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = pretitle;
      contentDiv.append(small);
    }

    const headline = headlineCell?.textContent.trim();
    if (headline) {
      // Use h1 for the first slide, h2 for subsequent as per original HTML
      const headingTag = sliderItems.indexOf(row) === 0 ? 'h1' : 'h2';
      const h = document.createElement(headingTag);
      h.classList.add('heading', 'font-medium', 'font-size-tb');
      // Only add banner-text-dark if it's the first slide (as per original HTML)
      if (sliderItems.indexOf(row) === 0) {
        h.classList.add('banner-text-dark');
      }
      h.innerHTML = headline; // Use innerHTML for potential <br/>
      contentDiv.append(h);
    }

    const description = descriptionCell?.textContent.trim();
    if (description) {
      const p = document.createElement('p');
      // Original HTML wraps description in <strong>
      p.innerHTML = `<strong>${description}</strong>`;
      contentDiv.append(p);
    }

    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaLabel = ctaLabelCell?.textContent.trim();
    if (ctaLink && ctaLabel) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLabel;
      a.classList.add('btn');
      // Add btn-primary if present in original HTML for specific slides
      // This logic is simplified; a more robust solution might involve checking the original cell for a class.
      // For now, assuming default 'btn' unless specifically 'btn-primary' is needed.
      if (ctaLink.classList.contains('btn-primary')) {
        a.classList.add('btn-primary');
      }
      if (ctaLink.target) {
        a.target = ctaLink.target;
      }
      contentDiv.append(a);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(mobContentHomeSpotlight);
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>`;
  beamSlider.append(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>`;
  beamSlider.append(nextBtn);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(swiperPagination);

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
  moveInstrumentation(quickLinksContainerRow, quickLinksParentDiv); // Move instrumentation from quickLinks container

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const a = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      a.href = foundLink.href;
      if (foundLink.target) a.target = foundLink.target; // Preserve target attribute
    }
    a.textContent = labelCell?.textContent.trim() || '';
    a.classList.add('with-full-underline');
    li.append(a);
    quickLinksUl.append(li);
  });

  containerDiv.append(quickLinksUl);
  quickLinksParentDiv.append(containerDiv);
  section.append(quickLinksParentDiv);

  block.replaceChildren(section);

  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true, // Original HTML has loop behavior
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: swiperPagination,
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      992: {
        slidesPerView: 1,
      },
    },
  });
}
