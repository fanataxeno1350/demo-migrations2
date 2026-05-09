import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const headingRow = children[0];
  const itemRows = children.slice(1);

  const elfsightEmbeds = itemRows.filter((row) => row.children.length === 3);
  const newsItems = itemRows.filter((row) => row.children.length === 8);

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

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

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute(
    'data-flickity',
    '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }',
  );

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  elfsightEmbeds.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const kind = embedKindCell.textContent.trim();
    const embedDiv = document.createElement('div');
    embedDiv.setAttribute('data-embed-kind', kind);
    embedDiv.setAttribute('data-embed-url', embedUrlCell.textContent.trim());
    embedDiv.setAttribute('data-embed-config', embedConfigCell.textContent.trim());

    if (kind === 'elfsight-widget') {
      const config = JSON.parse(embedConfigCell.textContent.trim());
      embedDiv.classList.add(`elfsight-app-${config.app_id}`);
      embedDiv.setAttribute('data-elfsight-app-lazy', '');
      loadScript('https://static.elfsight.com/platform/platform.js');
    }
    moveInstrumentation(row, embedDiv);
    slidesContainer.append(embedDiv);
  });

  newsItems.forEach((row) => {
    const [imageCell, imageHorizontalCell, imageVerticalCell, categoryCell, headlineCell, linkCell, dateCell, dateTimeCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const img = imageCell.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be called on the original cell, not the img inside the picture
      moveInstrumentation(imageCell, optimizedPic); // Move instrumentation from the cell to the new picture element
      imageWrap.append(optimizedPic);

      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('thumb-img', 'img-fluid');
      optimizedImg.setAttribute('loading', 'lazy');

      const horizontalImg = imageHorizontalCell.querySelector('img');
      if (horizontalImg) {
        optimizedImg.setAttribute('data-img-horizontal', horizontalImg.src);
      }
      const verticalImg = imageVerticalCell.querySelector('img');
      if (verticalImg) {
        optimizedImg.setAttribute('data-img-vertical', verticalImg.src);
      }
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
    anchor.textContent = 'Read more';
    contentWrap.append(anchor);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateTimeCell.textContent.trim());
    time.textContent = dateCell.textContent.trim();
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    wrap.append(contentWrap);
    moveInstrumentation(row, wrap);
    slide.append(wrap);
    slidesContainer.append(slide);
  });

  flickitySliderWrap.append(slidesContainer);
  container.append(flickitySliderWrap);
  section.append(container);

  block.replaceChildren(section);

  // Image optimization for all pictures within the block
  // This section is problematic. It re-optimizes images already handled above
  // and replaces existing pictures, potentially losing instrumentation.
  // Given the newsItems loop already handles image optimization and instrumentation,
  // this general block-wide optimization should be removed or carefully re-evaluated.
  // For now, removing it to prevent double processing and potential instrumentation loss.
  // If there are other images outside newsItems that need optimization,
  // they should be handled specifically.
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img')); // This moves instrumentation from the img to the new img
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
