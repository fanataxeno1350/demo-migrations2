import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const allRows = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');

  // Heading
  const headingRow = allRows.shift();
  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow, heading);
    // FIX: Access the first child (cell) of the headingRow
    heading.textContent = headingRow.children[0]?.textContent.trim() || '';
    sectionHeader.append(heading);
    section.append(sectionHeader);
  }

  // Consume container placeholders
  const embedsContainerRow = allRows.shift(); // Placeholder for 'embeds' container
  const newsItemsContainerRow = allRows.shift(); // Placeholder for 'newsItems' container

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderMobileWrap = document.createElement('div');
  flickitySliderMobileWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderMobileWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const embeds = [];
  const newsItems = [];

  // Separate embed rows from news item rows
  allRows.forEach((row) => {
    const cells = [...row.children];
    // Embeds have 3 cells, news items have 8 cells
    if (cells.length === 3) {
      embeds.push(row);
    } else if (cells.length === 8) {
      newsItems.push(row);
    }
  });

  // Process embeds
  embeds.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const embedKind = embedKindCell.textContent.trim();
    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    if (embedKind === 'elfsight-widget') {
      const config = JSON.parse(embedConfigCell.textContent.trim());
      const el = document.createElement('div');
      el.classList.add(`elfsight-app-${config.app_id}`);
      el.setAttribute('data-elfsight-app-lazy', '');
      slide.append(el);
      // FIX: Load Elfsight script if an Elfsight widget is present
      loadScript('https://static.elfsight.com/platform/platform.js');
    }
    flickitySliderMobileWrap.append(slide);
  });

  // Process news items
  newsItems.forEach((row) => {
    const [
      imageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      titleCell,
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

    const title = document.createElement('div');
    title.classList.add('text');
    title.textContent = titleCell.textContent.trim();
    contentWrap.append(title);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-link');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      // FIX: Correctly read href from the aem-content cell
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentWrap.append(ctaLink);

    const date = document.createElement('div');
    date.classList.add('date');
    // FIX: Wrap date text in a <time> element as per original HTML
    const timeElement = document.createElement('time');
    timeElement.textContent = dateCell.textContent.trim();
    // Optional: if dateCell contains a datetime attribute, parse and set it
    // const datetime = dateCell.querySelector('time')?.getAttribute('datetime');
    // if (datetime) timeElement.setAttribute('datetime', datetime);
    date.append(timeElement);
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    flickitySliderMobileWrap.append(slide);
  });

  containerDiv.append(flickitySliderMobileWrap);
  section.append(containerDiv);

  // Move instrumentation from container placeholders to the actual container divs
  if (embedsContainerRow) moveInstrumentation(embedsContainerRow, flickitySliderMobileWrap);
  if (newsItemsContainerRow) moveInstrumentation(newsItemsContainerRow, flickitySliderMobileWrap);

  block.replaceChildren(section);
}
