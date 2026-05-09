import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // Root rows based on BlockJson: heading, newsItems container, embeds container.
  // The actual newsItems and embeds are item rows that follow.
  const [headingRow, newsItemsContainerRow, embedsContainerRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Main Container for items
  const container = document.createElement('div');
  container.classList.add('container');
  // Instrumentation for the container should come from the first actual content row for it,
  // or a placeholder if no content rows exist.
  // For this block, the container itself doesn't have direct instrumentation from a row.
  // The original HTML shows data-aos attributes on the container, which are not from AEM rows.
  // We will move instrumentation from the first item row if available, or the block itself.
  if (itemRows.length > 0) {
    moveInstrumentation(itemRows[0], container);
  } else {
    // If no item rows, move instrumentation from the block itself to the container
    moveInstrumentation(block, container);
  }

  const flickityWrap = document.createElement('div');
  flickityWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickityWrap.dataset.flickity = `{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }`;
  container.append(flickityWrap);

  // Filter item rows based on cell count as per BlockJson model
  const newsItems = itemRows.filter((row) => row.children.length === 8);
  const embedItems = itemRows.filter((row) => row.children.length === 3);

  // Process Embeds first
  embedItems.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    moveInstrumentation(row, slidesDiv);

    const embedKind = embedKindCell?.textContent.trim();
    const embedUrl = embedUrlCell?.textContent.trim();
    const embedConfig = embedConfigCell?.textContent.trim();

    if (embedKind === 'elfsight-widget') {
      const elfsightDiv = document.createElement('div');
      try {
        const config = JSON.parse(embedConfig);
        elfsightDiv.classList.add(`elfsight-app-${config.app_id}`);
        elfsightDiv.dataset.elfsightAppLazy = '';
        loadScript('https://static.elfsight.com/platform/platform.js');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse Elfsight config:', e);
      }
      slidesDiv.append(elfsightDiv);
    } else if (embedKind === 'walls-io') {
      const wallScript = document.createElement('script');
      wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
      wallScript.dataset.wallurl = embedUrl;
      wallScript.dataset.width = '100%';
      wallScript.dataset.autoheight = '1';
      wallScript.async = true;
      slidesDiv.append(wallScript);
    } else if (['twitter-embed', 'instagram-embed', 'tiktok-embed'].includes(embedKind)) {
      const platforms = {
        'twitter-embed': 'https://platform.twitter.com/widgets.js',
        'instagram-embed': 'https://www.instagram.com/embed.js',
        'tiktok-embed': 'https://www.tiktok.com/embed.js',
      };
      loadScript(platforms[embedKind]);
      const link = document.createElement('a');
      link.href = embedUrl;
      link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
      slidesDiv.append(link);
    } else {
      const placeholder = document.createElement('div');
      placeholder.textContent = `[${embedKind} placeholder]`;
      slidesDiv.append(placeholder);
    }
    flickityWrap.append(slidesDiv);
  });

  // Process News Items
  newsItems.forEach((row) => {
    const [
      imageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      headlineCell,
      readMoreLinkCell,
      readMoreLabelCell,
      dateCell,
    ] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    moveInstrumentation(row, slidesDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');
    slidesDiv.append(wrapDiv);

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    wrapDiv.append(imageWrap);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('thumb-img', 'img-fluid');
        // moveInstrumentation should be called on the original img element, not the optimized one
        moveInstrumentation(img, optimizedImg);

        // Get horizontal and vertical image sources from their respective cells
        const imgHorizontal = imageHorizontalCell?.querySelector('img');
        if (imgHorizontal) {
          optimizedImg.dataset.imgHorizontal = imgHorizontal.src;
        }
        const imgVertical = imageVerticalCell?.querySelector('img');
        if (imgVertical) {
          optimizedImg.dataset.imgVertical = imgVertical.src;
        }

        imageWrap.append(optimizedPic);
      }
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');
    wrapDiv.append(contentWrap);

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.textContent = categoryCell?.textContent.trim() || '';
    contentWrap.append(categoryDiv);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = headlineCell?.textContent.trim() || '';
    contentWrap.append(textDiv);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-link');
    const foundLink = readMoreLinkCell?.querySelector('a');
    if (foundLink) {
      readMoreLink.href = foundLink.href;
    }
    readMoreLink.textContent = readMoreLabelCell?.textContent.trim() || '';
    contentWrap.append(readMoreLink);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    time.datetime = dateCell?.textContent.trim() || ''; // Assuming date is in a format suitable for datetime
    time.textContent = dateCell?.textContent.trim() || '';
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    flickityWrap.append(slidesDiv);
  });

  section.append(container);
  block.replaceChildren(section);

  // Load Flickity and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/flickity@2.3.0/dist/flickity.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/flickity@2.3.0/dist/flickity.pkgd.min.js');

  // eslint-disable-next-line no-undef
  new Flickity(flickityWrap, JSON.parse(flickityWrap.dataset.flickity));
}
