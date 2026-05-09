import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // The block.children directly contains the headline row followed by all item rows.
  // The "embeds" and "newsItems" fields in the model are containers, not actual rows themselves.
  const [headlineRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headlineRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular'); // aos-init, aos-animate are added by AOS
  heading.textContent = headlineRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Main Container for embeds and news items
  const container = document.createElement('div');
  container.classList.add('container'); // aos-init, aos-animate are added by AOS
  section.append(container);

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  // Flickity options from ORIGINAL HTML data-flickity attribute
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');
  container.append(flickitySliderWrap);

  const embedsWrapper = document.createElement('div');
  embedsWrapper.classList.add('slides');
  // moveInstrumentation for embedsWrapper is not directly tied to a single row,
  // but rather the collection of embed items.
  flickitySliderWrap.append(embedsWrapper);

  const newsItemsWrapper = document.createElement('div');
  newsItemsWrapper.classList.add('slides');
  // moveInstrumentation for newsItemsWrapper is not directly tied to a single row,
  // but rather the collection of news items.
  flickitySliderWrap.append(newsItemsWrapper);

  const embedItems = [];
  const newsItems = [];

  // Filter out empty rows and categorize items
  itemRows
    .filter(row => row.children.length > 0 && [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      // Item type detection based on cell count from BlockJson model
      // elfsight-widget-embed has 3 cells
      // latest-news-item has 8 cells
      if (row.children.length === 3) {
        embedItems.push(row);
      } else if (row.children.length === 8) {
        newsItems.push(row);
      }
    });

  // Process Embed Items
  for (const row of embedItems) {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const kind = embedKindCell.textContent.trim();
    const embedEl = document.createElement('div');
    embedEl.setAttribute('data-embed-kind', kind);
    embedEl.setAttribute('data-embed-url', embedUrlCell.textContent.trim());

    if (kind === 'elfsight-widget') {
      try {
        const config = JSON.parse(embedConfigCell.textContent.trim());
        embedEl.classList.add(`elfsight-app-${config.app_id}`);
        embedEl.setAttribute('data-elfsight-app-lazy', '');
        // Load Elfsight script only if an elfsight-widget is present
        await loadScript('https://static.elfsight.com/platform/platform.js');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse Elfsight embed config:', e);
        // Fallback to a link if config is invalid
        const link = document.createElement('a');
        link.href = embedUrlCell.textContent.trim();
        link.textContent = `View post on ${kind.split('-')[0].charAt(0).toUpperCase() + kind.split('-')[0].slice(1)}`;
        embedEl.append(link);
      }
    } else {
      // For other embed kinds, just display the URL as a link
      const link = document.createElement('a');
      link.href = embedUrlCell.textContent.trim();
      link.textContent = `View post on ${kind.split('-')[0].charAt(0).toUpperCase() + kind.split('-')[0].slice(1)}`;
      embedEl.append(link);
    }
    moveInstrumentation(row, embedEl);
    embedsWrapper.append(embedEl);
  }

  // Process News Items
  newsItems.forEach((row) => {
    const [
      newsImageCell,
      newsImageHorizontalCell,
      newsImageVerticalCell,
      categoryCell,
      titleCell,
      ctaLinkCell,
      ctaLabelCell,
      dateCell,
    ] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    moveInstrumentation(row, wrap);

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = newsImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // Move instrumentation from the original img to the new optimized img
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.append(optimizedPic);

        // Set data-img-horizontal and data-img-vertical attributes
        const imgEl = optimizedPic.querySelector('img');
        if (imgEl) {
          imgEl.classList.add('thumb-img', 'img-fluid');
          const horizontalImg = newsImageHorizontalCell.querySelector('img');
          if (horizontalImg) {
            imgEl.setAttribute('data-img-horizontal', horizontalImg.src);
          }
          const verticalImg = newsImageVerticalCell.querySelector('img');
          if (verticalImg) {
            imgEl.setAttribute('data-img-vertical', verticalImg.src);
          }
        }
      }
    }
    wrap.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const category = document.createElement('div');
    category.classList.add('category');
    category.textContent = categoryCell.textContent.trim();
    contentWrap.append(category);

    const title = document.createElement('div');
    title.classList.add('text');
    title.textContent = titleCell.textContent.trim();
    contentWrap.append(title);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-link');
    const ctaAnchor = ctaLinkCell.querySelector('a'); // ctaLink is type=aem-content
    if (ctaAnchor) {
      ctaLink.href = ctaAnchor.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentWrap.append(ctaLink);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date cell contains ISO format
    try {
      time.textContent = new Date(dateCell.textContent.trim()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Invalid date format:', dateCell.textContent.trim(), e);
      time.textContent = dateCell.textContent.trim(); // Fallback to raw text if date parsing fails
    }
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    newsItemsWrapper.append(wrap);
  });

  block.replaceChildren(section);

  // Load Flickity CSS and JS and initialize it after block is replaced
  // Flickity is used for the mobile slider functionality
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is available in libs
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is available in libs

  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(flickitySliderWrap, {
      wrapAround: flickitySliderWrap.dataset.flickity.includes('"wrapAround": true'),
      lazyLoad: flickitySliderWrap.dataset.flickity.includes('"lazyLoad": true'),
      pageDots: flickitySliderWrap.dataset.flickity.includes('"pageDots": true'),
      prevNextButtons: flickitySliderWrap.dataset.flickity.includes('"prevNextButtons": true'),
      imagesLoaded: flickitySliderWrap.dataset.flickity.includes('"imagesLoaded": true'),
      cellAlign: flickitySliderWrap.dataset.flickity.includes('"cellAlign": "right"') ? 'right' : 'left',
      watchCSS: flickitySliderWrap.dataset.flickity.includes('"watchCSS": true'),
      adaptiveHeight: flickitySliderWrap.dataset.flickity.includes('"adaptiveHeight": true'),
    });
  }
}
