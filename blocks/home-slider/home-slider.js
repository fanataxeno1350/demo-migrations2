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
  // Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress' as Swiper adds these automatically
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  beamSlider.setAttribute('data-aos', 'fade-up');
  beamSlider.setAttribute('data-aos-offset', '-100');
  beamSlider.setAttribute('data-aos-duration', '650');
  beamSlider.setAttribute('data-aos-easing', 'ease-in-out');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row) => {
    const [desktopImageCell, tabletImageCell, mobileImageCell, smallHeadlineCell, headlineCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');
    const mobileSource = document.createElement('source');
    mobileSource.media = '(max-width: 576px)';
    mobileSource.srcset = mobileImageCell.querySelector('img')?.src || '';
    picture.appendChild(mobileSource);

    const tabletSource = document.createElement('source');
    tabletSource.media = '(max-width: 799px)';
    tabletSource.srcset = tabletImageCell.querySelector('img')?.src || '';
    picture.appendChild(tabletSource);

    const desktopImg = desktopImageCell.querySelector('img');
    if (desktopImg) {
      const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1903' }]);
      moveInstrumentation(desktopImg, optimizedPic.querySelector('img'));
      picture.appendChild(optimizedPic.querySelector('img'));
    }

    slideBgImg.appendChild(picture);
    swiperSlide.appendChild(slideBgImg);

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    if (smallHeadlineCell.textContent.trim()) {
      const smallHeadline = document.createElement('small');
      smallHeadline.style.fontWeight = 'bold';
      smallHeadline.textContent = smallHeadlineCell.textContent.trim();
      contentDiv.appendChild(smallHeadline);
    }

    if (headlineCell.innerHTML.trim()) {
      const headline = document.createElement('h1');
      headline.classList.add('heading', 'font-medium', 'font-size-tb');
      headline.innerHTML = headlineCell.innerHTML;
      contentDiv.appendChild(headline);
    }

    if (descriptionCell.innerHTML.trim()) {
      const description = document.createElement('p');
      description.innerHTML = descriptionCell.innerHTML;
      contentDiv.appendChild(description);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const button = document.createElement('a');
      button.href = ctaLink.href;
      button.textContent = ctaLabel;
      button.classList.add('btn');
      contentDiv.appendChild(button);
    }

    mobContentHomeSpotlight.appendChild(contentDiv);
    swiperSlide.appendChild(mobContentHomeSpotlight);
    swiperWrapper.appendChild(swiperSlide);
  });

  beamSlider.appendChild(swiperWrapper);

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.appendChild(prevBtn);

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.appendChild(nextBtn);

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.appendChild(paginationEl);

  section.appendChild(beamSlider);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');
    anchor.textContent = labelCell.textContent.trim();
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Assuming quick links open in new tab based on original HTML
    }
    moveInstrumentation(row, li);
    li.appendChild(anchor);
    quickLinksUl.appendChild(li);
  });

  containerDiv.appendChild(quickLinksUl);
  quickLinksParentDiv.appendChild(containerDiv);
  section.appendChild(quickLinksParentDiv);

  block.replaceChildren(section);

  // Initialize Swiper
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(beamSlider, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
  });
}
