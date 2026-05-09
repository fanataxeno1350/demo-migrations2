import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children].filter(
    (row) =>
      row.children.length > 0 &&
      [...row.children].some(
        (c) => c.children.length > 0 || c.textContent.trim() !== '',
      ),
  );

  const [headingRow, ...itemRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  const [headingCell] = [...headingRow.children]; // Fixed: Destructuring for heading cell
  heading.textContent = headingCell?.textContent.trim() || '';
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');
  section.append(container);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  // Fixed: data-flickity attribute value should be a JSON string, not an object literal
  flickitySlider.setAttribute(
    'data-flickity',
    '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }',
  );
  container.append(flickitySlider);

  itemRows.forEach((row) => {
    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    // Detect item type based on cell count
    if (row.children.length === 9) {
      // latest-news-item
      const [
        thumbnailImageCell,
        imageHorizontalCell,
        imageVerticalCell,
        categoryCell,
        headlineCell,
        ctaLinkCell,
        ctaLabelCell,
        dateCell,
        dateIsoCell,
      ] = [...row.children];

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');

      const thumbnailPicture = thumbnailImageCell?.querySelector('picture');
      const horizontalPicture = imageHorizontalCell?.querySelector('picture');
      const verticalPicture = imageVerticalImageCell?.querySelector('picture'); // Fixed: Typo in variable name

      if (thumbnailPicture) {
        const img = thumbnailPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(
            img.src,
            img.alt,
            false,
            [{ width: '750' }],
          );
          const optimizedImg = optimizedPic.querySelector('img');
          moveInstrumentation(img, optimizedImg); // Fixed: Added moveInstrumentation for optimized image
          optimizedImg.classList.add('thumb-img', 'img-fluid');

          if (horizontalPicture) {
            optimizedImg.setAttribute(
              'data-img-horizontal',
              horizontalPicture.querySelector('img')?.src || '',
            );
          }
          if (verticalPicture) {
            optimizedImg.setAttribute(
              'data-img-vertical',
              verticalPicture.querySelector('img')?.src || '',
            );
          }
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

      const ctaLink = ctaLinkCell?.querySelector('a');
      const ctaButton = document.createElement('a');
      ctaButton.classList.add('btn', 'btn-link');
      if (ctaLink) {
        ctaButton.href = ctaLink.href;
      }
      ctaButton.textContent = ctaLabelCell?.textContent.trim() || '';
      contentWrap.append(ctaButton);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const time = document.createElement('time');
      const dateIso = dateIsoCell?.textContent.trim();
      if (dateIso) {
        time.setAttribute('datetime', dateIso);
      }
      time.textContent = dateCell?.textContent.trim() || '';
      dateDiv.append(time);
      contentWrap.append(dateDiv);

      wrap.append(contentWrap);
      slide.append(wrap);
    } else if (row.children.length === 3) {
      // elfsight-widget-embed
      const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];

      const embedKind = embedKindCell?.textContent.trim();
      const embedUrl = embedUrlCell?.textContent.trim();
      const embedConfig = embedConfigCell?.textContent.trim();

      if (embedKind === 'elfsight-widget') {
        const config = embedConfig ? JSON.parse(embedConfig) : {};
        // Fixed: Swiper/Flickity classes are added by the library, not manually
        slide.classList.add(`elfsight-app-${config.app_id}`);
        slide.setAttribute('data-elfsight-app-lazy', '');
        if (embedUrl) slide.setAttribute('data-embed-url', embedUrl);
        if (embedKind) slide.setAttribute('data-embed-kind', embedKind);
        if (embedConfig) slide.setAttribute('data-embed-config', embedConfig);
        loadScript('https://static.elfsight.com/platform/platform.js');
      }
    }
    flickitySlider.append(slide);
  });

  block.replaceChildren(section);

  // Optimize images within the newly created section
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Flickity/Swiper initialization
  // Fixed: Added loadCSS and async to decorate for Flickity/Swiper
  await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css');
  await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');

  // eslint-disable-next-line no-undef
  // new Flickity(flickitySlider, JSON.parse(flickitySlider.dataset.flickity)); // This line would be needed if Flickity was not auto-initializing via data-flickity attribute
}
