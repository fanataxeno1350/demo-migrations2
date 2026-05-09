import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [headingRow, ...itemRows] = children; // Removed embedWidgetsContainer and newsItemsContainer as they are not distinct rows in the block.children

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  // Main container for items
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  // Flickity data attributes from ORIGINAL HTML
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');


  const embedSlides = document.createElement('div');
  embedSlides.classList.add('slides');
  // moveInstrumentation(embedWidgetsContainer, embedSlides); // This was incorrect, embedWidgetsContainer is not a row

  const newsSlides = document.createElement('div');
  newsSlides.classList.add('slides');
  // moveInstrumentation(newsItemsContainer, newsSlides); // This was incorrect, newsItemsContainer is not a row

  const embedItems = itemRows.filter((row) => row.children.length === 3);
  const newsItems = itemRows.filter((row) => row.children.length === 7);

  // Process Embed Widgets
  await Promise.all(
    embedItems.map(async (row) => {
      const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
      const embedKind = embedKindCell.textContent.trim();
      const el = document.createElement('div');
      moveInstrumentation(row, el);

      switch (embedKind) {
        case 'elfsight-widget': {
          const config = JSON.parse(embedConfigCell.textContent.trim());
          el.classList.add(`elfsight-app-${config.app_id}`);
          el.setAttribute('data-embed-kind', embedKind);
          el.setAttribute('data-embed-url', embedUrlCell.textContent.trim());
          el.setAttribute('data-embed-config', embedConfigCell.textContent.trim());
          await loadScript('https://static.elfsight.com/platform/platform.js');
          break;
        }
        case 'walls-io': {
          const wallScript = document.createElement('script');
          wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
          wallScript.dataset.wallurl = embedUrlCell.textContent.trim();
          wallScript.dataset.width = '100%';
          wallScript.dataset.autoheight = '1';
          wallScript.async = true;
          el.append(wallScript);
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
          await loadScript(platforms[embedKind]);
          const link = document.createElement('a');
          link.href = embedUrlCell.textContent.trim();
          link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
          el.append(link);
          break;
        }
        default:
          break;
      }
      embedSlides.append(el);
    }),
  );

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
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');

      const imgEl = optimizedPic.querySelector('img');
      if (imageHorizontalCell.querySelector('picture')) {
        imgEl.setAttribute('data-img-horizontal', imageHorizontalCell.querySelector('img').src);
      }
      if (imageVerticalCell.querySelector('picture')) {
        imgEl.setAttribute('data-img-vertical', imageVerticalCell.querySelector('img').src);
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

    const link = document.createElement('a');
    link.classList.add('btn', 'btn-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = 'Read more';
    contentWrap.append(link);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', new Date(dateCell.textContent.trim()).toISOString());
    time.textContent = dateCell.textContent.trim();
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    newsSlides.append(slide);
  });

  if (embedSlides.children.length > 0) {
    flickitySliderWrap.append(embedSlides);
  }
  if (newsSlides.children.length > 0) {
    flickitySliderWrap.append(newsSlides);
  }

  container.append(flickitySliderWrap);
  section.append(container);

  block.replaceChildren(section);
}
