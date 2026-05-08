import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(titleRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // FIX: Read textContent directly from titleRow, as it's a text field.
  heading.textContent = titleRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  // Flickity is not supported, replacing with Swiper.js setup
  // The original HTML uses 'flickity-slider-mobile-wrap' and 'grid-layout' for the main slider container.
  // We'll use these classes for the Swiper container.
  const swiperEl = document.createElement('div');
  swiperEl.classList.add('flickity-slider-mobile-wrap', 'grid-layout', 'swiper'); // Add 'swiper' class for Swiper.js
  // The data-flickity attribute is specific to Flickity and should not be carried over.
  // Swiper options will be passed in the JS.

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('swiper-wrapper'); // Swiper requires 'swiper-wrapper' for slides container

  const embedItems = itemRows.filter((row) => row.children.length === 3);
  const newsItems = itemRows.filter((row) => row.children.length === 7);

  // Process Embed Items
  embedItems.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];

    const embedEl = document.createElement('div');
    embedEl.classList.add('swiper-slide'); // Each item is a swiper-slide
    moveInstrumentation(row, embedEl);

    const kind = embedKindCell.textContent.trim();
    embedEl.setAttribute('data-embed-kind', kind);
    embedEl.setAttribute('data-embed-url', embedUrlCell.textContent.trim());

    if (embedConfigCell.textContent.trim()) {
      embedEl.setAttribute('data-embed-config', embedConfigCell.textContent.trim());
    }

    if (kind === 'elfsight-widget') {
      const config = JSON.parse(embedConfigCell.textContent.trim());
      embedEl.classList.add(`elfsight-app-${config.app_id}`);
      loadScript('https://static.elfsight.com/platform/platform.js');
    } else if (kind === 'walls-io') {
      const wallScript = document.createElement('script');
      wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
      wallScript.dataset.wallurl = embedUrlCell.textContent.trim();
      wallScript.dataset.width = '100%';
      wallScript.dataset.autoheight = '1';
      wallScript.async = true;
      embedEl.append(wallScript);
    } else if (['twitter-embed', 'instagram-embed', 'tiktok-embed'].includes(kind)) {
      const platforms = {
        'twitter-embed': 'https://platform.twitter.com/widgets.js',
        'instagram-embed': 'https://www.instagram.com/embed.js',
        'tiktok-embed': 'https://www.tiktok.com/embed.js',
      };
      loadScript(platforms[kind]);
      const link = document.createElement('a');
      link.href = embedUrlCell.textContent.trim();
      link.textContent = `View post on ${kind.split('-')[0].charAt(0).toUpperCase()}${kind.split('-')[0].slice(1)}`;
      embedEl.append(link);
    }
    slidesWrapper.append(embedEl);
  });

  // Process News Items
  newsItems.forEach((row) => {
    const [
      imageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      headlineCell,
      linkCell,
      dateCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    // FIX: Changed 'slides' to 'swiper-slide' to match Swiper.js structure.
    // The original HTML uses 'slides' for the wrapper, and then individual divs inside.
    // For Swiper, each individual item should be 'swiper-slide'.
    slide.classList.add('swiper-slide');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const mainPicture = imageCell.querySelector('picture');
    if (mainPicture) {
      const img = mainPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
        optimizedPic.querySelector('img').setAttribute('loading', 'lazy');
        if (imageHorizontalCell.querySelector('picture > img')) {
          optimizedPic.querySelector('img').setAttribute('data-img-horizontal', imageHorizontalCell.querySelector('picture > img').src);
        }
        if (imageVerticalCell.querySelector('picture > img')) {
          optimizedPic.querySelector('img').setAttribute('data-img-vertical', imageVerticalCell.querySelector('picture > img').src);
        }
        imageWrap.append(optimizedPic);
      }
    }
    wrap.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const category = document.createElement('div');
    category.classList.add('category');
    category.textContent = categoryCell.textContent.trim();
    contentWrap.append(category);

    const text = document.createElement('div');
    text.classList.add('text');
    text.textContent = headlineCell.textContent.trim();
    contentWrap.append(text);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-link');
    // FIX: Ensure href is read from the <a> tag within the cell, not textContent.
    readMoreLink.href = linkCell.querySelector('a')?.href || '#';
    readMoreLink.textContent = 'Read more';
    contentWrap.append(readMoreLink);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', new Date(dateCell.textContent.trim()).toISOString());
    time.textContent = dateCell.textContent.trim();
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    slidesWrapper.append(slide);
  });

  swiperEl.append(slidesWrapper);

  // Add Swiper navigation and pagination elements if needed based on original HTML,
  // or if the design implies them. Original HTML had prevNextButtons: false and pageDots: true.
  // So, we'll add pagination dots.
  const paginationEl = document.createElement('div');
  paginationEl.classList.add('swiper-pagination');
  swiperEl.append(paginationEl);

  container.append(swiperEl);
  section.append(container);

  block.replaceChildren(section);

  // Image optimization - this part seems to be a generic optimization applied after block decoration.
  // It should be fine as is, assuming createOptimizedPicture handles the replacement correctly.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be on the picture element, not the img inside it,
    // as the picture is the instrumented element from AEM.
    moveInstrumentation(img.closest('picture'), optimizedPic);
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Swiper.js Initialization
  // Ensure decorate is async, and load Swiper assets after block content is replaced.
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    loop: false, // From original data-flickity="{ "wrapAround": false ... }"
    // navigation: { prevEl: prevBtn, nextEl: nextBtn }, // Original had prevNextButtons: false
    pagination: {
      el: paginationEl,
      clickable: true, // From original data-flickity="{ ... "pageDots": true ... }"
    },
    // Add other Swiper options based on the original Flickity config and desired behavior
    // "lazyLoad": true, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true
    lazy: {
      loadPrevNext: true,
    },
    imagesLoaded: true,
    centeredSlides: false, // cellAlign: "left" implies not centered
    watchSlidesProgress: true, // watchCSS might relate to this
    autoHeight: true, // adaptiveHeight
  });
}
