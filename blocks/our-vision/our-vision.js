import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [titleRow, containerRow, ...itemRows] = [...block.children];

  const root = document.createElement('div');
  // root.classList.add('cmp-our-foot-print'); // Removed: outer block div already has this class

  const header = document.createElement('div');
  header.classList.add('cmp-our-foot-print__header');
  moveInstrumentation(titleRow, header);

  const title = document.createElement('h2');
  title.classList.add('cmp-our-foot-print__title');
  title.textContent = titleRow.textContent.trim();
  header.append(title);
  root.append(header);

  const content = document.createElement('div');
  content.classList.add('cmp-our-foot-print__content');
  moveInstrumentation(containerRow, content);

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  cmpCarousel.dataset.component = 'carousel';
  cmpCarousel.dataset.showInfiniteScroll = 'false';
  cmpCarousel.dataset.showArrows = 'false';
  cmpCarousel.dataset.showDots = 'true';
  cmpCarousel.dataset.itemCountPerSlide = '1';
  cmpCarousel.dataset.autoPlayIsEnabled = 'false';
  cmpCarousel.dataset.autoPlaySpeedInMs = '500';
  cmpCarousel.dataset.revealNextItemPartially = 'false';
  cmpCarousel.dataset.showCenterZoom = 'false';
  cmpCarousel.dataset.slidesToScroll = '1';
  // cmpCarousel.classList.add('slick-initialized', 'slick-slider'); // Removed: Swiper adds these

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  itemRows.forEach((row, index) => {
    const [headlineCell, descriptionCell, videoUrlCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add(
      'cmp-our-foot-print__carousel-item',
      'cmp-carousel__item',
      `cmp-our-foot-print-carouselcard-index-${index}`,
      'slick-slide',
    );
    moveInstrumentation(row, carouselItem);

    const item = document.createElement('div');
    item.classList.add('item');

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--foot-print');

    // Apply specific background classes based on index or content if needed,
    // for now, use default/highlighted as per original HTML
    if (index === 0) {
      card.classList.add('cmp-card--foot-print-highlighted', 'color-background-background-2');
    } else if (index === 1) {
      card.classList.add('cmp-card--foot-print-default', 'color-background-primary-6');
    } else {
      card.classList.add('cmp-card--foot-print-default', 'color-background-background-3');
    }

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');

    const videoUrl = videoUrlCell.textContent.trim();
    if (videoUrl) {
      const cmpCardMedia = document.createElement('div');
      cmpCardMedia.classList.add('cmp-card__media');

      const cmpCardImage = document.createElement('div');
      cmpCardImage.classList.add('cmp-card__image');

      const video = document.createElement('div');
      video.classList.add('video', 'cmp-video--foot-print-card');

      const cmpVideo = document.createElement('div');
      cmpVideo.classList.add('cmp-video');

      const youtubeWrapper = document.createElement('div');
      youtubeWrapper.classList.add('cmp-video__youtube-wrapper');

      const iframeWrapper = document.createElement('div');
      iframeWrapper.classList.add('cmp-video__iframe-wrapper');

      const iframe = document.createElement('iframe');
      iframe.classList.add('cmp-video__iframe');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('loading', 'lazy');

      // Extract YouTube video ID from URL
      const urlParams = new URLSearchParams(new URL(videoUrl).search);
      const videoId = urlParams.get('v');
      if (videoId) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&showinfo=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&rel=0&enablejsapi=1&origin=${window.location.origin}`;
      } else {
        // Handle cases where the URL might not be a standard YouTube video URL
        console.warn('Invalid YouTube video URL:', videoUrl);
        // Optionally, hide the video section or display a placeholder
        video.style.display = 'none';
      }

      iframeWrapper.append(iframe);
      youtubeWrapper.append(iframeWrapper);
      cmpVideo.append(youtubeWrapper);
      video.append(cmpVideo);
      cmpCardImage.append(video);
      cmpCardMedia.append(cmpCardImage);
      cmpCardContent.append(cmpCardMedia);
    }

    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');

    const cmpCardTitle = document.createElement('div');
    cmpCardTitle.classList.add('cmp-card__title');
    cmpCardTitle.textContent = headlineCell.textContent.trim();
    cmpCardInfo.append(cmpCardTitle);

    const cmpCardDesc = document.createElement('div');
    cmpCardDesc.classList.add('cmp-card__desc');
    cmpCardDesc.innerHTML = descriptionCell.innerHTML;
    cmpCardInfo.append(cmpCardDesc);

    cmpCardContent.append(cmpCardInfo);
    cmpCard.append(cmpCardContent);
    card.append(cmpCard);
    item.append(card);
    carouselItem.append(item);
    slickTrack.append(carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);
  cmpCarousel.append(carouselContainer);
  carouselWrapper.append(cmpCarousel);
  content.append(carouselWrapper);
  root.append(content);

  block.replaceChildren(root);

  // Initialize Swiper Carousel (replacing Slick)
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Create navigation and pagination elements if they are part of the original HTML
  // For this block, the original HTML shows no explicit nav buttons, only dots.
  // We'll create a simple pagination container if dots are enabled.
  let paginationEl = null;
  if (cmpCarousel.dataset.showDots === 'true') {
    paginationEl = document.createElement('div');
    paginationEl.classList.add('swiper-pagination');
    cmpCarousel.append(paginationEl);
  }

  // eslint-disable-next-line no-undef
  new Swiper(cmpCarousel, { // Use cmpCarousel as the Swiper container
    slidesPerView: 1,
    loop: cmpCarousel.dataset.showInfiniteScroll === 'true', // Use dataset for loop
    navigation: {
      // prevEl: prevBtn, // No explicit prev/next buttons in original HTML
      // nextEl: nextBtn,
    },
    pagination: {
      el: paginationEl,
      clickable: true,
    },
  });
}
