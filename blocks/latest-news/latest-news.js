import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [headingRow, ...itemRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderMobileWrap = document.createElement('div');
  flickitySliderMobileWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderMobileWrap.dataset.flickity = '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }';

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides'); // This is the wrapper for individual slides

  const elfsightEmbeds = itemRows.filter((row) => row.children.length === 3);
  const newsItems = itemRows.filter((row) => row.children.length === 7);

  elfsightEmbeds.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];

    const embedKind = embedKindCell?.textContent.trim();
    const embedUrl = embedUrlCell?.textContent.trim();
    const embedConfig = embedConfigCell?.textContent.trim();

    const embedEl = document.createElement('div');
    embedEl.classList.add('slides'); // Each embed is an individual slide
    moveInstrumentation(row, embedEl);

    if (embedKind === 'elfsight-widget') {
      try {
        const config = JSON.parse(embedConfig);
        embedEl.classList.add(`elfsight-app-${config.app_id}`);
        embedEl.dataset.elfsightAppLazy = '';
        loadScript('https://static.elfsight.com/platform/platform.js');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse Elfsight config:', e);
      }
    } else if (embedKind === 'walls-io') {
      const wallScript = document.createElement('script');
      wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
      wallScript.dataset.wallurl = embedUrl;
      wallScript.dataset.width = '100%';
      wallScript.dataset.autoheight = '1';
      wallScript.async = true;
      embedEl.append(wallScript);
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
      embedEl.append(link);
    } else {
      embedEl.textContent = `[${embedKind} placeholder]`;
    }
    slidesContainer.append(embedEl);
  });

  newsItems.forEach((row) => {
    const [imageCell, imageHorizontalCell, imageVerticalCell, categoryCell, headlineCell, linkCell, dateCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides'); // Each news item is an individual slide
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = imageCell?.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;

    if (img) {
      // Create optimized picture and replace the original picture element
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('thumb-img', 'img-fluid');

      const horizontalImg = imageHorizontalCell?.querySelector('img');
      if (horizontalImg) {
        optimizedImg.dataset.imgHorizontal = horizontalImg.src;
      }
      const verticalImg = imageVerticalCell?.querySelector('img');
      if (verticalImg) {
        optimizedImg.dataset.imgVertical = verticalImg.src;
      }
      imageWrap.append(optimizedPic);
    }
    wrap.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const category = document.createElement('div');
    category.classList.add('category');
    category.textContent = categoryCell?.textContent.trim();
    contentWrap.append(category);

    const text = document.createElement('div');
    text.classList.add('text');
    text.textContent = headlineCell?.textContent.trim();
    contentWrap.append(text);

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      readMoreLink.href = foundLink.href;
    }
    readMoreLink.textContent = 'Read more';
    contentWrap.append(readMoreLink);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.datetime = dateCell?.textContent.trim();
    time.textContent = dateCell?.textContent.trim(); // Assuming date format is already suitable
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    slidesContainer.append(slide);
  });

  flickitySliderMobileWrap.append(slidesContainer);
  container.append(flickitySliderMobileWrap);
  section.append(container);

  block.replaceChildren(section);

  // Swiper initialization for the flickity-slider-mobile-wrap
  // The original HTML uses flickity-slider-mobile-wrap with data-flickity,
  // which implies Flickity.js. However, the prompt asks for Swiper.js if
  // Swiper classes are present. Since no Swiper classes are in the original
  // HTML, but the prompt specifically asked for Swiper initialization,
  // I will assume Flickity.js is intended, but provide Swiper init as per prompt.
  // If Flickity.js is truly intended, this Swiper code should be removed.

  // Based on the original HTML's `data-flickity` attribute, this block
  // is designed for Flickity.js, not Swiper.js.
  // The prompt's instruction to add Swiper.js initialization is contradictory
  // to the provided HTML. I will proceed with the assumption that Flickity.js
  // is the intended library, and thus no Swiper.js initialization is needed.
  // The `loadScript` for Flickity.js would typically be handled by a global
  // script or a specific block-level script if it's not globally available.
  // Since the prompt explicitly asked for Swiper.js checks, and no Swiper classes
  // are present, I will not add Swiper.js init. The `flickity-slider-mobile-wrap`
  // and `data-flickity` attribute suggest Flickity.js is expected to be loaded
  // and initialized externally or via a different mechanism.

  // The final `section.querySelectorAll('picture > img').forEach` loop
  // is redundant and potentially problematic after `createOptimizedPicture`
  // has already been called for each image. It should be removed.
  // The `moveInstrumentation` call inside this loop is also incorrect as it
  // tries to move instrumentation from an `img` element to an `img` element
  // within a newly created `picture`. Instrumentation should be moved from
  // the original cell to the new container element.
}
