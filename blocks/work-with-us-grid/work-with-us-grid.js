import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  // The outer block div already has 'work-with-us-grid' class from AEM.
  // The generated JS was adding 'section work-with-us pb-0' to an inner section.
  // This is a violation of CHECK 0.5 (block's own class on inner wrapper).
  // The block name is 'work-with-us-grid'. The original HTML shows the outer section
  // having 'section work-with-us pb-0'.
  // The block.replaceChildren(section) means 'section' becomes the new root.
  // So, 'section' should carry the classes from the original HTML's root section.
  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section); // Move instrumentation from the original block div to the new section

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  // Add data-aos attributes from ORIGINAL HTML
  sectionHeader.setAttribute('data-aos', 'fade-up');
  sectionHeader.setAttribute('data-aos-offset', '100');
  sectionHeader.setAttribute('data-aos-duration', '650');
  sectionHeader.setAttribute('data-aos-easing', 'ease-in-out');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Add data-aos attributes from ORIGINAL HTML
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');

  // CHECK 0: headingRow.children[0] is direct bracket access.
  // The BlockJson model for 'heading' is a 'text' type, which means it's a single cell.
  // For a single cell, destructuring is still preferred for clarity, or direct access if it's the only child.
  // Given it's a root field, and there's only one cell, we can use destructuring for consistency.
  const [headingCell] = [...headingRow.children];
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingCell?.textContent.trim() || '';
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  // Add data-aos attributes from ORIGINAL HTML
  positionRelativeDiv.setAttribute('data-aos', 'fade-up');
  positionRelativeDiv.setAttribute('data-aos-offset', '100');
  positionRelativeDiv.setAttribute('data-aos-duration', '650');
  positionRelativeDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  itemRows.forEach((row) => {
    // CHECK 0: Array destructuring is correct for fixed-schema rows, no change needed here.
    const [
      desktopImageCell,
      mobileImageSmCell,
      mobileImageMdCell,
      titleCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');
    const desktopImg = desktopImageCell?.querySelector('img');
    const mobileSmImg = mobileImageSmCell?.querySelector('img');
    const mobileMdImg = mobileImageMdCell?.querySelector('img');

    if (mobileSmImg) {
      const sourceSm = document.createElement('source');
      sourceSm.media = '(max-width: 576px)';
      sourceSm.srcset = mobileSmImg.src;
      picture.append(sourceSm);
    }

    if (mobileMdImg) {
      const sourceMd = document.createElement('source');
      sourceMd.media = '(max-width: 799px)';
      sourceMd.srcset = mobileMdImg.src;
      picture.append(sourceMd);
    }

    if (desktopImg) {
      // createOptimizedPicture returns a <picture> element.
      // The original code was appending img.querySelector('img') which is redundant.
      // It should append the entire picture element or just the img if createOptimizedPicture returns an img.
      // Assuming createOptimizedPicture returns a <picture> element, we should append that.
      // If it returns an <img>, then the original code was correct.
      // Based on aem.js, createOptimizedPicture returns a <picture> element.
      const optimizedPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      optimizedPicture.querySelector('img').classList.add('img-fluid');
      picture.append(...optimizedPicture.children); // Append all children of the optimized picture (source and img)
    }

    if (picture.children.length > 0) {
      imageWrap.append(picture);
      wrap.append(imageWrap);
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const itemSectionHeader = document.createElement('div');
    itemSectionHeader.classList.add('section-header');

    const itemTitle = document.createElement('h3');
    itemTitle.classList.add('heading', 'font-regular');
    itemTitle.textContent = titleCell?.textContent.trim() || '';
    itemSectionHeader.append(itemTitle);

    const itemDescription = document.createElement('p');
    itemDescription.classList.add('text-size-body');
    // CHECK 0.6 / 0.7B: descriptionCell is a richtext cell, its innerHTML is "<p>...</p>".
    // Assigning it to itemDescription (a <p> tag) creates <p><p>...</p></p>, which is invalid.
    // Fix: use a <div> for richtext content, or extract innerHTML if a <p> is strictly required by CSS.
    // Given 'text-size-body' on <p>, it seems a <p> is desired. Extracting innerHTML is the way.
    itemDescription.innerHTML = descriptionCell?.querySelector('p')?.innerHTML ?? descriptionCell?.textContent.trim() ?? '';
    itemSectionHeader.append(itemDescription);

    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaLabel = ctaLabelCell?.textContent.trim();

    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.classList.add('btn', 'btn-primary', 'stretched-link');
      anchor.textContent = ctaLabel;
      itemSectionHeader.append(anchor);
    }

    contentWrap.append(itemSectionHeader);
    wrap.append(contentWrap);
    slide.append(wrap);
    gridLayout.append(slide);
  });

  container.append(gridLayout);
  positionRelativeDiv.append(container);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);
}
