import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];
  const headingRow = children[0];
  const itemRows = children.slice(1);

  const embedWidgetItems = itemRows.filter((row) => row.children.length === 3);
  const newsItems = itemRows.filter((row) => row.children.length === 8);

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular'); // Removed aos-init, aos-animate
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container'); // Removed aos-init, aos-animate

  // Swiper setup - replacing flickity-slider-mobile-wrap
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper-container', 'grid-layout'); // Renamed from flickity-slider-mobile-wrap

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  embedWidgetItems.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const embedKind = embedKindCell.textContent.trim();
    const embedUrl = embedUrlCell.textContent.trim();
    const embedConfig = embedConfigCell.textContent.trim();

    const slide = document.createElement('div');
    slide.classList.add('slides', 'swiper-slide'); // Added swiper-slide
    moveInstrumentation(row, slide);

    const embedDiv = document.createElement('div');
    embedDiv.dataset.embedKind = embedKind;
    embedDiv.dataset.embedUrl = embedUrl;
    embedDiv.dataset.embedConfig = embedConfig;

    switch (embedKind) {
      case 'elfsight-widget':
        try {
          const config = JSON.parse(embedConfig);
          embedDiv.classList.add(`elfsight-app-${config.app_id}`);
          loadScript('https://static.elfsight.com/platform/platform.js');
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse Elfsight config:', e);
        }
        break;
      case 'walls-io':
        const wallScript = document.createElement('script');
        wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
        wallScript.dataset.wallurl = embedUrl;
        wallScript.dataset.width = '100%';
        wallScript.dataset.autoheight = '1';
        wallScript.async = true;
        embedDiv.append(wallScript);
        break;
      case 'twitter-embed':
      case 'instagram-embed':
      case 'tiktok-embed':
        const platforms = {
          'twitter-embed': 'https://platform.twitter.com/widgets.js',
          'instagram-embed': 'https://www.instagram.com/embed.js',
          'tiktok-embed': 'https://www.tiktok.com/embed.js',
        };
        loadScript(platforms[embedKind]);
        const link = document.createElement('a');
        link.href = embedUrl;
        link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
        embedDiv.append(link);
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unknown embed kind: ${embedKind}`);
        break;
    }
    slide.append(embedDiv);
    swiperWrapper.append(slide); // Append to swiperWrapper
  });

  newsItems.forEach((row) => {
    const [
      imageSmallCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      headlineCell,
      ctaLinkCell,
      ctaLabelCell,
      dateCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides', 'swiper-slide'); // Added swiper-slide
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const imageSmall = imageSmallCell.querySelector('picture');
    const imageHorizontal = imageHorizontalCell.querySelector('picture');
    const imageVertical = imageVerticalCell.querySelector('picture');

    if (imageSmall) {
      const img = imageSmall.querySelector('img');
      // Corrected createOptimizedPicture to use img.src directly for optimization
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('thumb-img', 'img-fluid');
      if (imageHorizontal) {
        optimizedImg.dataset.imgHorizontal = imageHorizontal.querySelector('img').src;
      }
      if (imageVertical) {
        optimizedImg.dataset.imgVertical = imageVertical.querySelector('img').src;
      }
      imageWrap.append(optimizedPic);
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

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-link');
    const ctaAnchor = ctaLinkCell.querySelector('a');
    if (ctaAnchor) {
      ctaLink.href = ctaAnchor.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentWrap.append(ctaLink);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.datetime = dateCell.textContent.trim(); // Assuming date format is compatible with datetime
    time.textContent = dateCell.textContent.trim();
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    swiperWrapper.append(slide); // Append to swiperWrapper
  });

  swiperContainer.append(swiperWrapper);

  // Add Swiper navigation and pagination elements
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination');
  swiperContainer.append(swiperPagination);

  const swiperButtonPrev = document.createElement('div');
  swiperButtonPrev.classList.add('swiper-button-prev');
  swiperContainer.append(swiperButtonPrev);

  const swiperButtonNext = document.createElement('div');
  swiperButtonNext.classList.add('swiper-button-next');
  swiperContainer.append(swiperButtonNext);

  container.append(swiperContainer);
  section.append(container);
  block.replaceChildren(section);

  // Load Swiper CSS and JS, then initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    loop: false, // data-flickity="{ &quot;wrapAround&quot;: false
    navigation: {
      prevEl: swiperButtonPrev,
      nextEl: swiperButtonNext,
    },
    pagination: {
      el: swiperPagination,
      clickable: true, // data-flickity="{ &quot;pageDots&quot;: true
    },
    // Add other Swiper options based on Flickity config if needed
    // lazyLoad: true, // data-flickity="{ &quot;lazyLoad&quot;: true
    // imagesLoaded: true, // data-flickity="{ &quot;imagesLoaded&quot;: true
    // autoHeight: true, // data-flickity="{ &quot;adaptiveHeight&quot;: true
    // cellAlign: 'left', // data-flickity="{ &quot;cellAlign&quot;: &quot;left&quot;
    // watchSlidesVisibility: true, // for lazyLoad
  });
}
