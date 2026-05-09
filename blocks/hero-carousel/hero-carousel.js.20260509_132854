import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const slideRows = allRows.filter((row) => row.children.length === 8);
  const quickLinkRows = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  beamSlider.dataset.aos = 'fade-up';
  beamSlider.dataset.aosOffset = '-100';
  beamSlider.dataset.aosDuration = '650';
  beamSlider.dataset.aosEasing = 'ease-in-out';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row) => {
    const [
      desktopBgImageCell,
      mobileBgImage576Cell,
      mobileBgImage799Cell,
      preTitleCell,
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
    const desktopImg = desktopBgImageCell?.querySelector('img');
    const mobile576Img = mobileBgImage576Cell?.querySelector('img');
    const mobile799Img = mobileBgImage779Cell?.querySelector('img'); // Corrected variable name

    if (mobile576Img) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = mobile576Img.src;
      picture.append(source576);
    }
    if (mobile799Img) {
      const source799 = document.createElement('source');
      source799.media = '(max-width: 799px)';
      source799.srcset = mobile799Img.src;
      picture.append(source799);
    }
    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, true, [{ width: '1903' }]);
      picture.append(img.querySelector('img'));
    }
    slideBgImg.append(picture);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    if (preTitleCell?.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = preTitleCell.textContent.trim();
      contentDiv.append(small);
    }

    if (headlineCell?.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      h2.innerHTML = headlineCell.textContent.trim();
      contentDiv.append(h2);
    }

    if (descriptionCell?.innerHTML.trim()) {
      // FIX: Changed <p> to <div> for richtext content to prevent <p> inside <p>
      const descriptionContainer = document.createElement('div');
      descriptionContainer.innerHTML = descriptionCell.innerHTML.trim();
      contentDiv.append(descriptionContainer);
    }

    const ctaLink = ctaLinkCell?.querySelector('a');
    if (ctaLink && ctaLabelCell?.textContent.trim()) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabelCell.textContent.trim();
      anchor.classList.add('btn');
      contentDiv.append(anchor);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(swiperSlide);
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

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.dataset.aos = 'fade-up';
  containerDiv.dataset.aosOffset = '-100';
  containerDiv.dataset.aosDuration = '650';
  containerDiv.dataset.aosEasing = 'ease-in-out';

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.textContent = labelCell?.textContent.trim() || '';
      anchor.classList.add('with-full-underline');
    }
    moveInstrumentation(row, li);
    li.append(anchor);
    quickLinksUl.append(li);
  });

  containerDiv.append(quickLinksUl);
  quickLinksParentDiv.append(containerDiv);

  section.append(beamSlider, quickLinksParentDiv);
  block.replaceChildren(section);

  // Swiper initialization
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
