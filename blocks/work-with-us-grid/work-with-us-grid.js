import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [headingRow, ...itemRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');

  // Section Header
  if (headingRow) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    const [headingCell] = [...headingRow.children]; // Destructuring for fixed schema
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingCell?.textContent.trim();
    sectionHeader.append(heading);
    section.append(sectionHeader);
  }

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  itemRows.forEach((row) => {
    const [imageMobile576Cell, imageMobile799Cell, imageDesktopCell, itemHeadingCell, itemDescriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const slides = document.createElement('div');
    slides.classList.add('slides');
    moveInstrumentation(row, slides); // Move instrumentation for the whole item row

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    // Image Wrap
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');

    const imgMobile576 = imageMobile576Cell?.querySelector('img');
    if (imgMobile576) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = imgMobile576.src;
      picture.append(source576);
      moveInstrumentation(imageMobile576Cell, source576); // Instrumentation for source
    }

    const imgMobile799 = imageMobile799Cell?.querySelector('img');
    if (imgMobile799) {
      const source799 = document.createElement('source');
      source799.media = '(max-width: 799px)';
      source799.srcset = imgMobile799.src;
      picture.append(source799);
      moveInstrumentation(imageMobile799Cell, source799); // Instrumentation for source
    }

    const imgDesktop = imageDesktopCell?.querySelector('img');
    if (imgDesktop) {
      const optimizedPic = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      const desktopImg = optimizedPic.querySelector('img');
      desktopImg.classList.add('img-fluid');
      desktopImg.loading = 'lazy';
      picture.append(desktopImg);
      moveInstrumentation(imageDesktopCell, desktopImg); // Instrumentation for desktop image
    }

    if (picture.children.length > 0) {
      imageWrap.append(picture);
      wrap.append(imageWrap);
    }

    // Content Wrap
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const itemHeading = document.createElement('h3');
    itemHeading.classList.add('heading', 'font-regular');
    itemHeading.textContent = itemHeadingCell?.textContent.trim();
    moveInstrumentation(itemHeadingCell, itemHeading);
    contentSectionHeader.append(itemHeading);

    const itemDescription = document.createElement('p'); // Changed to div for richtext
    itemDescription.classList.add('text-size-body');
    // For richtext, use innerHTML directly from the cell, not querySelector('p')
    // If the original HTML has <p> inside the cell, assigning to <p> creates <p><p> which is invalid.
    // Use a div as a safe container for richtext.
    itemDescription.innerHTML = itemDescriptionCell?.innerHTML || '';
    moveInstrumentation(itemDescriptionCell, itemDescription);
    contentSectionHeader.append(itemDescription);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundCtaLink = ctaLinkCell?.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
      moveInstrumentation(foundCtaLink, ctaLink); // Instrumentation for the actual link element
    }
    ctaLink.textContent = ctaLabelCell?.textContent.trim();
    moveInstrumentation(ctaLabelCell, ctaLink); // Instrumentation for the label cell
    contentSectionHeader.append(ctaLink);

    contentWrap.append(contentSectionHeader);
    wrap.append(contentWrap);
    slides.append(wrap);
    gridLayout.append(slides);
  });

  container.append(gridLayout);
  positionRelativeDiv.append(container);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);
}
