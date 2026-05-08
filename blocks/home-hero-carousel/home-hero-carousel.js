import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];
  const slideRows = allRows.filter((row) => row.children.length === 8);
  const quickLinkRows = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  // Swiper Carousel
  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  beamSlider.setAttribute('data-aos', 'fade-up');
  beamSlider.setAttribute('data-aos-offset', '100');
  beamSlider.setAttribute('data-aos-duration', '650');
  beamSlider.setAttribute('data-aos-easing', 'ease-in-out');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row) => {
    const [imageDesktopCell, imageTabletCell, imageMobileCell, smallTextCell, headlineCell,
      descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');

    const sourceMobile = document.createElement('source');
    sourceMobile.media = '(max-width: 576px)';
    const mobileImg = imageMobileCell.querySelector('img');
    if (mobileImg) {
      sourceMobile.srcset = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '576' }]).querySelector('img').src;
      moveInstrumentation(mobileImg, sourceMobile);
    }
    picture.append(sourceMobile);

    const sourceTablet = document.createElement('source');
    sourceTablet.media = '(max-width: 799px)';
    const tabletImg = imageTabletCell.querySelector('img');
    if (tabletImg) {
      sourceTablet.srcset = createOptimizedPicture(tabletImg.src, tabletImg.alt, false, [{ width: '799' }]).querySelector('img').src;
      moveInstrumentation(tabletImg, sourceTablet);
    }
    picture.append(sourceTablet);

    const img = document.createElement('img');
    const desktopImg = imageDesktopCell.querySelector('img');
    if (desktopImg) {
      img.loading = 'eager';
      img.src = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1903' }]).querySelector('img').src;
      img.alt = desktopImg.alt;
      img.width = '1903';
      img.height = '841';
      img.fetchPriority = 'high';
      moveInstrumentation(desktopImg, img);
    }
    picture.append(img);
    slideBgImg.append(picture);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    const smallText = smallTextCell.textContent.trim();
    if (smallText) {
      const smallEl = document.createElement('small');
      smallEl.textContent = smallText;
      smallEl.style.fontWeight = 'bold';
      contentDiv.append(smallEl);
    }

    const headline = headlineCell.textContent.trim();
    if (headline) {
      const hTag = document.createElement(smallText ? 'h2' : 'h1');
      hTag.classList.add('heading', 'font-medium', 'font-size-tb');
      if (!smallText) hTag.classList.add('banner-text-dark');
      hTag.innerHTML = headline;
      contentDiv.append(hTag);
    }

    const description = descriptionCell.textContent.trim();
    if (description) {
      const p = document.createElement('p');
      // Fix: description cell is type=text, so its content is plain text.
      // Original HTML shows it wrapped in <strong> inside <p>.
      // We create the <p> and <strong> tags here.
      const strong = document.createElement('strong');
      strong.textContent = description;
      p.append(strong);
      contentDiv.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn');
      if (smallText) anchor.classList.add('btn-primary');
      moveInstrumentation(ctaLinkCell, anchor);
      contentDiv.append(anchor);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(nextBtn);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(pagination);

  section.append(beamSlider);

  // Quick Links
  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      if (foundLink.target) anchor.target = foundLink.target;
    }
    anchor.textContent = labelCell.textContent.trim();
    anchor.classList.add('with-full-underline');
    moveInstrumentation(row, li);
    li.append(anchor);
    quickLinksUl.append(li);
  });

  container.append(quickLinksUl);
  quickLinksParentDiv.append(container);
  section.append(quickLinksParentDiv);

  block.replaceChildren(section);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    // Fix: loop should be false as per original HTML's data-loop="false" (implied by absence)
    loop: false,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
  });

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
