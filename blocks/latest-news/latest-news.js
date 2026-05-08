import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  // Data attribute value from ORIGINAL HTML
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const embedsDiv = document.createElement('div');
  // Flickity adds 'slides' class automatically, no need to add it here
  // embedsDiv.classList.add('slides');

  const newsItemsDiv = document.createElement('div');
  // Flickity adds 'slides' class automatically, no need to add it here
  // newsItemsDiv.classList.add('slides');

  const elfsightEmbeds = itemRows.filter((row) => row.children.length === 3);
  const newsItems = itemRows.filter((row) => row.children.length === 8);

  elfsightEmbeds.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const embedKind = embedKindCell.textContent.trim();
    const embedUrl = embedUrlCell.textContent.trim();
    const embedConfig = embedConfigCell.textContent.trim();

    const embedEl = document.createElement('div');
    embedEl.setAttribute('data-embed-kind', embedKind);
    embedEl.setAttribute('data-embed-url', embedUrl);
    embedEl.setAttribute('data-embed-config', embedConfig);
    moveInstrumentation(row, embedEl);

    if (embedKind === 'elfsight-widget') {
      const config = JSON.parse(embedConfig);
      embedEl.classList.add(`elfsight-app-${config.app_id}`);
      loadScript('https://static.elfsight.com/platform/platform.js');
    }
    embedsDiv.append(embedEl);
  });

  newsItems.forEach((row) => {
    const [
      imageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      headlineCell,
      linkCell,
      ctaLabelCell,
      dateCell,
    ] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    moveInstrumentation(row, wrap);

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      picture.replaceWith(optimizedPic);

      const horizontalImg = imageHorizontalCell.querySelector('img');
      if (horizontalImg) {
        optimizedPic.querySelector('img').setAttribute('data-img-horizontal', horizontalImg.src);
      }
      const verticalImg = imageVerticalCell.querySelector('img');
      if (verticalImg) {
        optimizedPic.querySelector('img').setAttribute('data-img-vertical', verticalImg.src);
      }
      optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
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

    const anchor = document.createElement('a');
    anchor.classList.add('btn', 'btn-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = ctaLabelCell.textContent.trim();
    contentWrap.append(anchor);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', new Date(dateCell.textContent.trim()).toISOString());
    time.textContent = dateCell.textContent.trim();
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    newsItemsDiv.append(wrap);
  });

  if (elfsightEmbeds.length > 0) {
    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    slidesDiv.append(embedsDiv); // Append the actual embeds content
    flickitySliderWrap.append(slidesDiv);
  }
  if (newsItems.length > 0) {
    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    slidesDiv.append(newsItemsDiv); // Append the actual news items content
    flickitySliderWrap.append(slidesDiv);
  }

  container.append(flickitySliderWrap);
  section.append(container);

  block.replaceChildren(section);

  // Flickity Initialization
  // Load Flickity CSS and JS
  await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css');
  await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');

  // Initialize Flickity after all elements are in the DOM
  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // The data-flickity attribute already contains the config
    // We just need to initialize it on the flickitySliderWrap element
    // eslint-disable-next-line no-new
    new Flickity(flickitySliderWrap, JSON.parse(flickitySliderWrap.dataset.flickity));
  }
}
