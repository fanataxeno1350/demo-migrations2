import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [headingRow, embedsContainer, newsItemsContainer, ...itemRows] = children;

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

  const sliderWrap = document.createElement('div');
  sliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  sliderWrap.dataset.flickity = '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }';

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('slides');

  const embedRows = itemRows.filter((row) => row.children.length === 3);
  const newsItemRows = itemRows.filter((row) => row.children.length === 7);

  // Process embed items
  embedRows.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const kind = embedKindCell?.textContent.trim();
    const embedEl = document.createElement('div');
    moveInstrumentation(row, embedEl);

    if (kind === 'elfsight-widget') {
      const config = JSON.parse(embedConfigCell.textContent.trim());
      embedEl.classList.add(`elfsight-app-${config.app_id}`);
      embedEl.dataset.elfsightAppLazy = true;
      loadScript('https://static.elfsight.com/platform/platform.js');
    }
    slidesWrapper.append(embedEl);
  });

  // Process news items
  newsItemRows.forEach((row) => {
    const [imageCell, imageHorizontalCell, imageVerticalCell, categoryCell, headlineCell, linkCell, dateCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides'); // Corrected from 'slides' to 'slide-item' if it were a single item, but 'slides' is used in original HTML for each item.
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation should be moved from the original row, not the img
        // The original picture is replaced, so move instrumentation to the new picture's img
        const newImg = optimizedPic.querySelector('img');
        moveInstrumentation(img, newImg); // Move instrumentation from original img to the new img
        img.closest('picture').replaceWith(optimizedPic);

        newImg.classList.add('thumb-img', 'img-fluid');
        newImg.dataset.imgHorizontal = imageHorizontalCell?.querySelector('picture')?.querySelector('img')?.src || '';
        newImg.dataset.imgVertical = imageVerticalCell?.querySelector('picture')?.querySelector('img')?.src || '';
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

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      readMoreLink.href = foundLink.href;
      // The original HTML has "Read more" hardcoded, so we'll keep it for now.
      // If the link text was meant to be dynamic, it would come from a cell.
      // For now, assume "Read more" is a static label.
    }
    readMoreLink.textContent = 'Read more';
    contentWrap.append(readMoreLink);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell?.textContent.trim() || '');
    time.textContent = dateCell?.textContent.trim() || '';
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    wrap.append(contentWrap);
    slide.append(wrap);
    slidesWrapper.append(slide);
  });

  sliderWrap.append(slidesWrapper);
  container.append(sliderWrap);
  section.append(container);

  // Move instrumentation for container placeholders
  // The original embedsContainer and newsItemsContainer are placeholders for the *list* of items.
  // The items themselves are moved individually. The placeholders should be moved to the container
  // that holds all the items, which is `sliderWrap` in this case.
  moveInstrumentation(embedsContainer, sliderWrap);
  moveInstrumentation(newsItemsContainer, sliderWrap);

  block.replaceChildren(section);

  // Flickity initialization
  // Load Flickity CSS and JS
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming flickity is in libs/flickity
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming flickity is in libs/flickity

  // Initialize Flickity
  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(sliderWrap, JSON.parse(sliderWrap.dataset.flickity));
  }
}
