import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];
  const [headlineRow, ...itemRows] = children; // Destructure headlineRow

  const embeds = [];
  const slides = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) { // Elfsight-widget-embed has 3 cells
      embeds.push(row);
    } else if (cells.length === 8) { // Latest-news-slide-item has 8 cells
      slides.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  sectionHeader.setAttribute('data-aos', 'fade-up');
  sectionHeader.setAttribute('data-aos-offset', '100');
  sectionHeader.setAttribute('data-aos-duration', '650');
  sectionHeader.setAttribute('data-aos-easing', 'ease-in-out');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headlineRow, heading);
  heading.textContent = headlineRow.children[0]?.textContent.trim() || '';
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Container for carousel
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.dataset.flickity = '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }';

  // Embeds
  embeds.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const embedKind = embedKindCell?.textContent.trim();
    const embedUrl = embedUrlCell?.textContent.trim();
    const embedConfig = embedConfigCell?.textContent.trim();

    const embedEl = document.createElement('div');
    embedEl.classList.add('slides');
    embedEl.dataset.embedKind = embedKind;
    embedEl.dataset.embedUrl = embedUrl;
    embedEl.dataset.embedConfig = embedConfig;

    switch (embedKind) {
      case 'elfsight-widget': {
        const config = JSON.parse(embedConfig || '{}');
        embedEl.classList.add(`elfsight-app-${config.app_id}`);
        embedEl.setAttribute('data-elfsight-app-lazy', '');
        loadScript('https://static.elfsight.com/platform/platform.js');
        break;
      }
      default:
        // Handle other embed kinds if necessary, or leave as a placeholder
        embedEl.textContent = `[${embedKind} placeholder]`;
        break;
    }
    moveInstrumentation(row, embedEl);
    flickitySliderWrap.append(embedEl);
  });

  // Slides
  slides.forEach((row) => {
    const [
      mainImageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      titleCell,
      linkCell,
      ctaLabelCell,
      dateCell,
    ] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const img = mainImageCell?.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('thumb-img', 'img-fluid');
      optimizedImg.dataset.imgHorizontal = imageHorizontalCell?.querySelector('img')?.src || '';
      optimizedImg.dataset.imgVertical = imageVerticalCell?.querySelector('img')?.src || '';
      optimizedImg.loading = 'lazy';
      moveInstrumentation(img, optimizedImg);
      imageWrapDiv.append(optimizedPic);
    }
    wrapDiv.append(imageWrapDiv);

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.textContent = categoryCell?.textContent.trim() || '';
    contentWrapDiv.append(categoryDiv);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = titleCell?.textContent.trim() || '';
    contentWrapDiv.append(textDiv);

    const linkEl = document.createElement('a');
    linkEl.classList.add('btn', 'btn-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
    }
    linkEl.textContent = ctaLabelCell?.textContent.trim() || 'Read more';
    contentWrapDiv.append(linkEl);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const dateText = dateCell?.textContent.trim();
    if (dateText) {
      const timeEl = document.createElement('time');
      // Attempt to parse date for datetime attribute, default to text if invalid
      try {
        const date = new Date(dateText);
        if (!Number.isNaN(date.getTime())) { // Check if date is valid
          timeEl.setAttribute('datetime', date.toISOString());
        }
      } catch (e) {
        // Fallback if date parsing fails
      }
      timeEl.textContent = dateText;
      dateDiv.append(timeEl);
    }
    contentWrapDiv.append(dateDiv);

    wrapDiv.append(contentWrapDiv);
    slideDiv.append(wrapDiv);
    moveInstrumentation(row, slideDiv);
    flickitySliderWrap.append(slideDiv);
  });

  container.append(flickitySliderWrap);
  section.append(container);

  block.replaceChildren(section);

  // Load Flickity and initialize
  await loadCSS('/libs/flickity/flickity.min.css');
  await loadScript('/libs/flickity/flickity.pkgd.min.js');

  // eslint-disable-next-line no-undef
  if (typeof Flickity === 'function') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(flickitySliderWrap, JSON.parse(flickitySliderWrap.dataset.flickity));
  }
}
