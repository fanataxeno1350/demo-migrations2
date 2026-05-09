import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  // The first row is implicitly the container for slides, the second for quick links.
  // We don't need to filter by length for these "container" rows, as they are structural.
  const slidesContainerRow = allRows[0];
  const quickLinksContainerRow = allRows[1];

  // Filter for actual item rows based on cell count
  const slideRows = allRows.filter((row) => row.children.length === 8);
  const quickLinkRows = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  // The block already has the 'home-slider' class from AEM.
  // The 'section' class is from the ORIGINAL HTML, but not on the block itself.
  // The 'spotlight-home-wrap', 'm-0', 'p-0' are from the ORIGINAL HTML.
  section.classList.add('spotlight-home-wrap', 'm-0', 'p-0');

  // Main Slider
  const beamSlider = document.createElement('div');
  // Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress' as Swiper adds them.
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  moveInstrumentation(slidesContainerRow, beamSlider); // Move instrumentation from the slides container row

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row) => {
    const [
      imageDesktopCell,
      imageTabletCell,
      imageMobileCell,
      smallTitleCell,
      headlineCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, slide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');
    const sourceMobile = document.createElement('source');
    sourceMobile.media = '(max-width: 576px)';
    const imgMobile = imageMobileCell.querySelector('img');
    if (imgMobile) {
      sourceMobile.srcset = imgMobile.src;
    }
    picture.append(sourceMobile);

    const sourceTablet = document.createElement('source');
    sourceTablet.media = '(max-width: 799px)';
    const imgTablet = imageTabletCell.querySelector('img');
    if (imgTablet) {
      sourceTablet.srcset = imgTablet.src;
    }
    picture.append(sourceTablet);

    const imgDesktop = imageDesktopCell.querySelector('img');
    if (imgDesktop) {
      const img = document.createElement('img');
      img.loading = 'eager';
      img.src = imgDesktop.src;
      img.alt = imgDesktop.alt;
      img.width = imgDesktop.width;
      img.height = imgDesktop.height;
      picture.append(img);
    }
    slideBgImg.append(picture);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');

    const smallTitleText = smallTitleCell.textContent.trim();
    if (smallTitleText) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = smallTitleText;
      content.append(small);
    }

    const headlineText = headlineCell.textContent.trim();
    if (headlineText) {
      const heading = document.createElement('h1'); // Can be h1 or h2 based on content
      heading.classList.add('heading', 'font-medium', 'font-size-tb', 'banner-text-dark');
      heading.innerHTML = headlineText; // Use innerHTML for rich text content
      content.append(heading);
    }

    const descriptionHtml = descriptionCell.innerHTML.trim();
    if (descriptionHtml) {
      const description = document.createElement('p'); // Use div if content could be complex HTML
      description.innerHTML = descriptionHtml;
      content.append(description);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn');
      if (ctaLink.target) { // Preserve target attribute if present
        anchor.target = ctaLink.target;
      }
      content.append(anchor);
    }

    mobContentHomeSpotlight.append(content);
    slide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(slide);
  });

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');

  beamSlider.append(swiperWrapper, prevBtn, nextBtn, pagination);

  // Quick Links
  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
  moveInstrumentation(quickLinksContainerRow, quickLinksParentDiv); // Move instrumentation from the quick links container row

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.dataset.aos = 'fade-up';
  container.dataset.aosOffset = '-100';
  container.dataset.aosDuration = '650';
  container.dataset.aosEasing = 'ease-in-out';

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      if (foundLink.target) {
        anchor.target = foundLink.target;
      }
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.append(anchor);
    quickLinksUl.append(li);
  });

  container.append(quickLinksUl);
  quickLinksParentDiv.append(container);

  section.append(beamSlider, quickLinksParentDiv);

  block.replaceChildren(section);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation needs to be called on the original img element, not the new one.
    // However, since we are replacing the picture, the instrumentation on the img itself
    // is less critical than on the row/slide.
    // For now, we'll keep it as is, assuming the original img's parent picture was instrumented.
    // If the original img itself had data-aue-prop, this would need a more complex solution.
    // For now, it's generally safe as createOptimizedPicture handles the new img.
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Load Swiper and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true, // Original HTML doesn't specify data-loop, assuming default true for carousel
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
