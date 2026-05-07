import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  const root = document.createElement('section');
  root.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  root.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.dataset.flickity = '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }';

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  const embedWidgetRows = itemRows.filter((row) => row.children.length === 3);
  const newsItemRows = itemRows.filter((row) => row.children.length === 9);

  // Process Embed Widgets
  embedWidgetRows.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const embedKind = embedKindCell?.textContent.trim();
    const embedUrl = embedUrlCell?.textContent.trim();
    const embedConfig = embedConfigCell?.textContent.trim();

    const slide = document.createElement('div');
    // The original HTML has 'slides' class on the container, not individual slides for embed widgets.
    // The 'slides' class is applied to the news items.
    // moveInstrumentation(row, slide); // moved to the embedEl for better AUE experience

    const embedEl = document.createElement('div');
    embedEl.dataset.embedKind = embedKind;
    if (embedUrl) embedEl.dataset.embedUrl = embedUrl;
    moveInstrumentation(row, embedEl); // Instrumentation moved here

    switch (embedKind) {
      case 'elfsight-widget':
        if (embedConfig) {
          try {
            const config = JSON.parse(embedConfig);
            if (config.app_id) {
              embedEl.classList.add(`elfsight-app-${config.app_id}`);
              loadScript('https://static.elfsight.com/platform/platform.js');
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to parse Elfsight config:', e);
          }
        }
        break;
      case 'walls-io':
        if (embedUrl) {
          const wallScript = document.createElement('script');
          wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
          wallScript.dataset.wallurl = embedUrl;
          wallScript.dataset.width = '100%';
          wallScript.dataset.autoheight = '1';
          wallScript.async = true;
          embedEl.append(wallScript);
        }
        break;
      case 'twitter-embed':
      case 'instagram-embed':
      case 'tiktok-embed': {
        const platforms = {
          'twitter-embed': 'https://platform.twitter.com/widgets.js',
          'instagram-embed': 'https://www.instagram.com/embed.js',
          'tiktok-embed': 'https://www.tiktok.com/embed.js',
        };
        loadScript(platforms[embedKind]);
        const link = document.createElement('a');
        link.href = embedUrl;
        link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
        embedEl.append(link);
        break;
      }
      default:
        embedEl.textContent = `[${embedKind} placeholder]`;
        break;
    }
    slide.append(embedEl);
    slidesContainer.append(slide);
  });

  // Process News Items
  newsItemRows.forEach((row) => {
    const [
      imageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      headlineCell,
      ctaLinkCell,
      ctaLabelCell,
      dateCell,
      dateTimeCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const mainPicture = imageCell?.querySelector('picture');
    const img = mainPicture ? mainPicture.querySelector('img') : null;
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('thumb-img', 'img-fluid');
      optimizedImg.dataset.imgHorizontal = imageHorizontalCell?.querySelector('img')?.src || '';
      optimizedImg.dataset.imgVertical = imageVerticalCell?.querySelector('img')?.src || '';
      imageWrap.append(optimizedPic);
      moveInstrumentation(imageCell, optimizedImg);
    }
    wrap.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const category = document.createElement('div');
    category.classList.add('category');
    category.textContent = categoryCell?.textContent.trim() || '';
    contentWrap.append(category);

    const text = document.createElement('div');
    text.classList.add('text');
    text.textContent = headlineCell?.textContent.trim() || '';
    contentWrap.append(text);

    const ctaLink = ctaLinkCell?.querySelector('a');
    if (ctaLink) {
      const link = document.createElement('a');
      link.classList.add('btn', 'btn-link');
      link.href = ctaLink.href;
      link.textContent = ctaLabelCell?.textContent.trim() || 'Read more';
      contentWrap.append(link);
      moveInstrumentation(ctaLinkCell, link);
    }

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateTimeCell?.textContent.trim() || '');
    time.textContent = dateCell?.textContent.trim() || '';
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    wrap.append(contentWrap);
    slide.append(wrap);
    slidesContainer.append(slide);
  });

  flickitySliderWrap.append(slidesContainer);
  container.append(flickitySliderWrap);
  root.append(container);

  block.replaceChildren(root);

  // Load Flickity for carousel functionality
  await loadCSS('/scripts/flickity/flickity.min.css'); // Corrected path
  await loadScript('/scripts/flickity/flickity.pkgd.min.js'); // Corrected path

  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(flickitySliderWrap, JSON.parse(flickitySliderWrap.dataset.flickity));
  }
}
