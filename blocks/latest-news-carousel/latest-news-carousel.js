import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // The block's own class 'latest-news-carousel' is already on the outer div.
  // Adding 'section' to an inner element causes double padding/CSS.
  // Instead, apply block-level classes to the block itself if needed, or
  // ensure the outer block div already has them.
  // The generated JS creates a <section> element and adds classes to it.
  // The original HTML shows these classes on the <section> that wraps the block content.
  // We should create the section and add the classes, but NOT the block name itself.
  // The block name 'latest-news-carousel' is already on the block element.

  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [headingRow, ...itemRows] = children;

  const section = document.createElement('section');
  // Add classes from ORIGINAL HTML, excluding the block name 'latest-news-carousel'
  // which is already on the outer block div.
  section.classList.add('grey-bg', 'latest-stories', 'home-stories');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  // Add data-aos attributes from original HTML
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  // Add data-aos attributes from original HTML
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  // Add data-flickity attribute from original HTML
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');
  container.append(flickitySliderWrap);
  section.append(container);

  itemRows.forEach((row) => {
    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    // Detect if it's a news-carousel-item (9 cells) or an embed (3 cells)
    if (row.children.length === 9) {
      const [
        imageCell,
        imageHorizontalCell,
        imageVerticalCell,
        categoryCell,
        headlineCell,
        linkCell,
        ctaLabelCell,
        dateCell,
        dateIsoCell,
      ] = [...row.children];

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');

      const thumbPic = imageCell?.querySelector('picture');
      if (thumbPic) {
        const img = thumbPic.querySelector('img');
        if (img) {
          // Create optimized picture, then move instrumentation from the original img to the new img
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          const optimizedImg = optimizedPic.querySelector('img');
          moveInstrumentation(img, optimizedImg); // Move instrumentation from original img to the new optimized img
          optimizedImg.classList.add('thumb-img', 'img-fluid'); // Add classes from original HTML
          optimizedImg.setAttribute('loading', 'lazy'); // Add loading attribute from original HTML

          const horizontalImgSrc = imageHorizontalCell?.querySelector('picture > img')?.src;
          const verticalImgSrc = imageVerticalCell?.querySelector('picture > img')?.src;

          if (horizontalImgSrc) optimizedImg.dataset.imgHorizontal = horizontalImgSrc;
          if (verticalImgSrc) optimizedImg.dataset.imgVertical = verticalImgSrc;

          imageWrap.append(optimizedPic);
        }
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

      const link = document.createElement('a');
      link.classList.add('btn', 'btn-link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }
      link.textContent = ctaLabelCell?.textContent.trim() || 'Read more';
      contentWrap.append(link);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const time = document.createElement('time');
      time.setAttribute('datetime', dateIsoCell?.textContent.trim() || '');
      time.textContent = dateCell?.textContent.trim() || '';
      dateDiv.append(time);
      contentWrap.append(dateDiv);

      wrap.append(contentWrap);
      slide.append(wrap);
    } else if (row.children.length === 3) {
      const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
      const kind = embedKindCell?.textContent.trim();

      const embedContainer = document.createElement('div');
      embedContainer.dataset.embedKind = kind;
      embedContainer.dataset.embedUrl = embedUrlCell?.textContent.trim() || '';
      embedContainer.dataset.embedConfig = embedConfigCell?.textContent.trim() || '';

      switch (kind) {
        case 'elfsight-widget': {
          const config = JSON.parse(embedConfigCell?.textContent.trim() || '{}');
          embedContainer.classList.add(`elfsight-app-${config.app_id}`);
          // The original HTML has data-elfsight-app-lazy, which is not handled by loadScript.
          // The platform.js script should be loaded once.
          loadScript('https://static.elfsight.com/platform/platform.js', { async: true, defer: true });
          break;
        }
        case 'walls-io': {
          const wallScript = document.createElement('script');
          wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
          wallScript.dataset.wallurl = embedUrlCell?.textContent.trim() || '';
          wallScript.dataset.width = '100%';
          wallScript.dataset.autoheight = '1';
          wallScript.async = true;
          embedContainer.append(wallScript);
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
          loadScript(platforms[kind], { async: true, defer: true });
          const link = document.createElement('a');
          link.href = embedUrlCell?.textContent.trim() || '';
          link.textContent = `View post on ${kind.split('-')[0].charAt(0).toUpperCase()}${kind.split('-')[0].slice(1)}`;
          embedContainer.append(link);
          break;
        }
        default:
          break;
      }
      slide.append(embedContainer);
    }
    flickitySliderWrap.append(slide);
  });

  block.replaceChildren(section);

  // Flickity.js initialization
  // Flickity is not Swiper, it's a different carousel library.
  // The original HTML has data-flickity attribute, indicating Flickity.js.
  // We need to load Flickity.js and initialize it.
  await loadCSS('/blocks/latest-news-carousel/flickity.min.css'); // Assuming flickity.min.css is in the block folder
  await loadScript('/blocks/latest-news-carousel/flickity.pkgd.min.js'); // Assuming flickity.pkgd.min.js is in the block folder

  // Initialize Flickity after the block is in the DOM and scripts are loaded
  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // The data-flickity attribute contains the configuration.
    // Flickity will automatically initialize on elements with data-flickity attribute.
    // We just need to ensure the script is loaded.
    // However, if we want to manually initialize or ensure it's initialized,
    // we can do it here. The current setup with data-flickity should work.
    // For explicit initialization:
    // const flkty = new Flickity(flickitySliderWrap, JSON.parse(flickitySliderWrap.dataset.flickity));
  }
}
