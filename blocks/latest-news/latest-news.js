import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  // The first row is always the heading.
  const [headingRow, ...contentRows] = allRows;

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const headingEl = document.createElement('h2');
  headingEl.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, headingEl);
  headingEl.textContent = headingRow.textContent.trim();
  sectionHeader.append(headingEl);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const sliderWrap = document.createElement('div');
  sliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  // NOTE: Flickity is not loaded by EDS, so data-flickity attribute is inert.
  // We will build the structure and apply classes, but not initialize Flickity.

  const embedRows = contentRows.filter((row) => row.children.length === 3);
  const newsItemRows = contentRows.filter((row) => row.children.length === 8);

  // Process Embed Rows
  embedRows.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const kind = embedKindCell.textContent.trim();
    const embedEl = document.createElement('div');
    embedEl.classList.add('slides');
    moveInstrumentation(row, embedEl);

    const embedContent = document.createElement('div');
    embedContent.dataset.embedKind = kind;
    embedContent.dataset.embedUrl = embedUrlCell.textContent.trim();
    if (embedConfigCell.textContent.trim()) {
      embedContent.dataset.embedConfig = embedConfigCell.textContent.trim();
    }

    switch (kind) {
      case 'elfsight-widget': {
        const config = JSON.parse(embedConfigCell.textContent.trim());
        embedContent.classList.add(`elfsight-app-${config.app_id}`);
        loadScript('https://static.elfsight.com/platform/platform.js');
        embedContent.textContent = '[elfsight-widget placeholder]';
        break;
      }
      case 'walls-io': {
        const wallScript = document.createElement('script');
        wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
        wallScript.dataset.wallurl = embedUrlCell.textContent.trim();
        wallScript.dataset.width = '100%';
        wallScript.dataset.autoheight = '1';
        wallScript.async = true;
        embedContent.append(wallScript);
        break;
      }
      case 'twitter-embed':
      case 'instagram-embed':
      case 'tiktok-embed': {
        const platforms = {
          'twitter-embed': 'https://platform.twitter.com/widgets.js',
          'instagram-embed': 'https://www.instagram.com/embed.js',
          'tiktok-embed': 'https://www.tiktok.com/embed.js',
        };
        loadScript(platforms[kind]);
        const link = document.createElement('a');
        link.href = embedUrlCell.textContent.trim();
        link.textContent = `View post on ${kind.split('-')[0].charAt(0).toUpperCase()}${kind.split('-')[0].slice(1)}`;
        embedContent.append(link);
        break;
      }
      default:
        // Handle other embed kinds or render a placeholder
        embedContent.textContent = `[${kind} embed placeholder]`;
        break;
    }
    embedEl.append(embedContent);
    sliderWrap.append(embedEl);
  });

  // Process News Item Rows
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
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // Copy data attributes from original img to the new img within optimizedPic
        const newImg = optimizedPic.querySelector('img');
        if (imageHorizontalCell.textContent.trim()) {
          newImg.dataset.imgHorizontal = imageHorizontalCell.textContent.trim();
        }
        if (imageVerticalCell.textContent.trim()) {
          newImg.dataset.imgVertical = imageVerticalCell.textContent.trim();
        }
        newImg.classList.add('thumb-img', 'img-fluid');
        newImg.loading = 'lazy';
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

    const headline = document.createElement('div');
    headline.classList.add('text');
    headline.textContent = headlineCell.textContent.trim();
    contentWrap.append(headline);

    const ctaLink = document.createElement('a');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.classList.add('btn', 'btn-link');
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentWrap.append(ctaLink);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    const dateText = dateCell.textContent.trim();
    time.datetime = dateText ? new Date(dateText).toISOString() : '';
    time.textContent = dateText;
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    sliderWrap.append(slide);
  });

  container.append(sliderWrap);
  section.append(container);

  block.replaceChildren(section);

  // Image optimization for all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const originalPicture = img.closest('picture');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation should be called on the original element (img) and applied to the new element (optimizedPic.querySelector('img'))
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    originalPicture.replaceWith(optimizedPic);
  });
}
