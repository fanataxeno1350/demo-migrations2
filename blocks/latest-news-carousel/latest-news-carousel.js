import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  moveInstrumentation(block, section);

  // Section Header
  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    moveInstrumentation(headingRow, sectionHeader);

    const [headingCell] = [...headingRow.children]; // Fixed: Use destructuring for headingRow
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingCell?.textContent.trim() || '';
    sectionHeader.append(heading);
    section.append(sectionHeader);
  }

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  section.append(container);

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  // data-flickity is not implemented in EDS, but we preserve the attribute for fidelity
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');
  container.append(flickitySliderWrap);

  const embedItems = itemRows.filter((row) => row.children.length === 3);
  const newsSlideItems = itemRows.filter((row) => row.children.length === 7);

  // Elfsight Embeds
  embedItems.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];
    const kind = embedKindCell?.textContent.trim();

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    moveInstrumentation(row, slideDiv);

    const embedEl = document.createElement('div');
    embedEl.setAttribute('data-embed-kind', kind);
    embedEl.setAttribute('data-embed-url', embedUrlCell?.textContent.trim() || '');
    embedEl.setAttribute('data-embed-config', embedConfigCell?.textContent.trim() || '');

    switch (kind) {
      case 'elfsight-widget': {
        const config = JSON.parse(embedConfigCell.textContent.trim());
        embedEl.classList.add(`elfsight-app-${config.app_id}`);
        // loadScript('https://static.elfsight.com/platform/platform.js'); // This should be loaded once, not per item
        embedEl.textContent = '[elfsight-widget placeholder]'; // Placeholder text
        break;
      }
      default:
        // Handle other embed kinds if necessary, or leave as placeholder
        embedEl.textContent = `[${kind} placeholder]`;
        break;
    }
    slideDiv.append(embedEl);
    flickitySliderWrap.append(slideDiv);
  });

  // News Slide Items
  newsSlideItems.forEach((row) => {
    const [
      mainImageCell,
      imageHorizontalCell,
      imageVerticalCell,
      categoryCell,
      headlineCell,
      readMoreLinkCell,
      dateCell,
    ] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    moveInstrumentation(row, slideDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');
    slideDiv.append(wrapDiv);

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');
    wrapDiv.append(imageWrapDiv);

    const mainPicture = mainImageCell?.querySelector('picture');
    const mainImg = mainPicture ? mainPicture.querySelector('img') : null;

    if (mainImg) {
      const optimizedPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      newImg.classList.add('thumb-img', 'img-fluid');
      newImg.setAttribute('loading', 'lazy');

      const horizontalImg = imageHorizontalCell?.querySelector('picture > img');
      if (horizontalImg) {
        newImg.setAttribute('data-img-horizontal', horizontalImg.src);
      }
      const verticalImg = imageVerticalCell?.querySelector('picture > img');
      if (verticalImg) {
        newImg.setAttribute('data-img-vertical', verticalImg.src);
      }
      imageWrapDiv.append(optimizedPic);
      moveInstrumentation(mainImageCell, optimizedPic);
    }

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');
    wrapDiv.append(contentWrapDiv);

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.textContent = categoryCell?.textContent.trim() || '';
    contentWrapDiv.append(categoryDiv);
    moveInstrumentation(categoryCell, categoryDiv);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = headlineCell?.textContent.trim() || '';
    contentWrapDiv.append(textDiv);
    moveInstrumentation(headlineCell, textDiv);

    const readMoreLink = readMoreLinkCell?.querySelector('a');
    if (readMoreLink) {
      const linkBtn = document.createElement('a');
      linkBtn.classList.add('btn', 'btn-link');
      linkBtn.href = readMoreLink.href;
      // Fixed: Read button text from the cell's anchor text, not hardcoded
      linkBtn.textContent = readMoreLink.textContent.trim() || 'Read more';
      contentWrapDiv.append(linkBtn);
      moveInstrumentation(readMoreLinkCell, linkBtn);
    }

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const timeEl = document.createElement('time');
    timeEl.setAttribute('datetime', dateCell?.textContent.trim() || ''); // Assuming date cell contains a valid datetime string
    timeEl.textContent = dateCell?.textContent.trim() || '';
    dateDiv.append(timeEl);
    contentWrapDiv.append(dateDiv);
    moveInstrumentation(dateCell, dateDiv);

    flickitySliderWrap.append(slideDiv);
  });

  block.replaceChildren(section);

  // Flickity initialization
  if (flickitySliderWrap.children.length > 0) {
    await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css');
    await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');
    // eslint-disable-next-line no-undef
    // eslint-disable-next-line no-new
    new Flickity(flickitySliderWrap, JSON.parse(flickitySliderWrap.dataset.flickity));
  }

  // Load Elfsight platform script once if any elfsight widget is present
  if (embedItems.length > 0) {
    await loadScript('https://static.elfsight.com/platform/platform.js');
  }
}
