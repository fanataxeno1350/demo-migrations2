import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];
  const sliderItems = allRows.filter((row) => row.children.length === 8);
  const quickLinkItems = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  // Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress' as Swiper adds them automatically
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  moveInstrumentation(block, beamSlider); // Move instrumentation from block to the main slider container

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  sliderItems.forEach((row) => {
    const [
      imageDesktopCell,
      imageTabletCell,
      imageMobileCell,
      smallTextCell,
      headlineCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, swiperSlide); // Move instrumentation from row to swiperSlide

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');
    const desktopImg = imageDesktopCell.querySelector('img');
    const tabletImg = imageTabletCell.querySelector('img');
    const mobileImg = imageMobileCell.querySelector('img');

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '576' }]).querySelector('img').src;
      picture.append(sourceMobile);
    }
    if (tabletImg) {
      const sourceTablet = document.createElement('source');
      sourceTablet.media = '(max-width: 799px)';
      sourceTablet.srcset = createOptimizedPicture(tabletImg.src, tabletImg.alt, false, [{ width: '799' }]).querySelector('img').src;
      picture.append(sourceTablet);
    }
    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, true, [{ width: '1903' }]).querySelector('img');
      img.setAttribute('fetchpriority', 'high');
      picture.append(img);
    }

    slideBgImg.append(picture);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');

    if (smallTextCell && smallTextCell.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = smallTextCell.textContent.trim();
      content.append(small);
    }

    if (headlineCell && headlineCell.textContent.trim()) {
      const heading = document.createElement('h1');
      heading.classList.add('heading', 'font-medium', 'font-size-tb');
      heading.innerHTML = headlineCell.textContent.trim(); // Use innerHTML to allow <br/>
      content.append(heading);
    }

    if (descriptionCell && descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${descriptionCell.textContent.trim()}</strong>`;
      content.append(p);
    }

    if (ctaLinkCell && ctaLinkCell.querySelector('a') && ctaLabelCell && ctaLabelCell.textContent.trim()) {
      const ctaLink = document.createElement('a');
      ctaLink.href = ctaLinkCell.querySelector('a').href;
      ctaLink.textContent = ctaLabelCell.textContent.trim();
      ctaLink.classList.add('btn');
      content.append(ctaLink);
    }

    mobContentHomeSpotlight.append(content);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
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

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(pagination);

  section.append(beamSlider);

  if (quickLinkItems.length > 0) {
    const quickLinksParentDiv = document.createElement('div');
    quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

    const container = document.createElement('div');
    container.classList.add('container', 'aos-init', 'aos-animate');
    container.setAttribute('data-aos', 'fade-up');
    container.setAttribute('data-aos-offset', '-100');
    container.setAttribute('data-aos-duration', '650');
    container.setAttribute('data-aos-easing', 'ease-in-out');

    const ul = document.createElement('ul');
    ul.classList.add('quick-links-div');

    quickLinkItems.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];
      const li = document.createElement('li');
      const a = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        a.href = foundLink.href;
      }
      a.textContent = labelCell.textContent.trim();
      a.classList.add('with-full-underline');
      moveInstrumentation(row, a); // Move instrumentation from row to the quick link anchor
      li.append(a);
      ul.append(li);
    });

    container.append(ul);
    quickLinksParentDiv.append(container);
    section.append(quickLinksParentDiv);
  }

  block.replaceChildren(section);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
  });
}
