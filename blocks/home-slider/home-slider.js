import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children].filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  // Consume container placeholders for 'slides' and 'quickLinks'
  const [slidesContainerRow, quickLinksContainerRow, ...itemRows] = allRows;

  const slideItems = itemRows.filter((row) => row.children.length === 8);
  const quickLinkItems = itemRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const swiperEl = document.createElement('div');
  // Removed 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress' as Swiper adds them
  swiperEl.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  moveInstrumentation(slidesContainerRow, swiperEl);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideItems.forEach((row) => {
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

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, slide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = document.createElement('picture');
    const desktopImg = imageDesktopCell?.querySelector('img');
    const tabletImg = imageTabletCell?.querySelector('img');
    const mobileImg = imageMobileCell?.querySelector('img');

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
      img.loading = 'eager';
      img.fetchPriority = 'high';
      picture.append(img);
    }
    slideBgImg.append(picture);

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');

    const smallText = smallTextCell?.textContent.trim();
    if (smallText) {
      const smallEl = document.createElement('small');
      smallEl.style.fontWeight = 'bold';
      smallEl.textContent = smallText;
      content.append(smallEl);
    }

    const headline = headlineCell?.innerHTML.trim();
    if (headline) {
      const headlineEl = document.createElement('div'); // Changed from h1 to div to handle richtext <p>
      headlineEl.classList.add('heading', 'font-medium', 'font-size-tb');
      headlineEl.innerHTML = headline;
      content.append(headlineEl);
    }

    const description = descriptionCell?.innerHTML.trim();
    if (description) {
      const descriptionEl = document.createElement('div'); // Changed from p to div to handle richtext <p>
      descriptionEl.innerHTML = description;
      content.append(descriptionEl);
    }

    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaLabel = ctaLabelCell?.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.classList.add('btn');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      content.append(anchor);
    }

    mobContent.append(content);
    slide.append(slideBgImg, mobContent);
    swiperWrapper.append(slide);
  });

  const prevBtn = document.createElement('div');
  prevBtn.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';

  const nextBtn = document.createElement('div');
  nextBtn.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextBtn.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';

  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination', 'bullet-bottom');

  swiperEl.append(swiperWrapper, prevBtn, nextBtn, paginationEl);

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
  moveInstrumentation(quickLinksContainerRow, quickLinksParentDiv);

  const container = document.createElement('div');
  container.classList.add('container');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  quickLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);
    ul.append(li);
  });

  container.append(ul);
  quickLinksParentDiv.append(container);

  section.append(swiperEl, quickLinksParentDiv);
  block.replaceChildren(section);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
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
      el: paginationEl,
      clickable: true,
    },
  });
}
