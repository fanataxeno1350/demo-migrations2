import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // block.children[0] is blockHeadlineRow
  // block.children[1] is the "container" field, but it's not a content row, it's just a placeholder for itemRows
  // So, we take the first row as headline, and all subsequent rows as itemRows.
  const [blockHeadlineRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(blockHeadlineRow, section);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = blockHeadlineRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  // There is no separate "containerRow" in the block.children that needs instrumentation moved.
  // The instrumentation for the overall container is handled by the block itself.

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  itemRows.forEach((row) => {
    const [
      imageDesktopCell,
      imageMobile576Cell,
      imageMobile799Cell,
      itemHeadlineCell,
      itemDescriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const picture = document.createElement('picture');

    // Mobile image (max-width: 576px)
    const img576 = imageMobile576Cell.querySelector('img');
    if (img576) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = img576.src;
      picture.append(source576);
    }

    // Mobile image (max-width: 799px)
    const img799 = imageMobile799Cell.querySelector('img');
    if (img799) {
      const source799 = document.createElement('source');
      source799.media = '(max-width: 799px)';
      source799.srcset = img799.src;
      picture.append(source799);
    }

    // Desktop image
    const imgDesktop = imageDesktopCell.querySelector('img');
    if (imgDesktop) {
      const img = document.createElement('img');
      img.src = imgDesktop.src;
      img.alt = imgDesktop.alt;
      img.classList.add('img-fluid');
      img.loading = 'lazy';
      picture.append(img);
    }

    if (picture.children.length > 0) {
      imageWrapDiv.append(picture);
      wrapDiv.append(imageWrapDiv);
    }

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const itemHeadline = document.createElement('h3');
    itemHeadline.classList.add('heading', 'font-regular');
    itemHeadline.textContent = itemHeadlineCell.textContent.trim();
    contentSectionHeader.append(itemHeadline);

    const itemDescription = document.createElement('p');
    itemDescription.classList.add('text-size-body');
    itemDescription.innerHTML = itemDescriptionCell.innerHTML; // richtext field
    contentSectionHeader.append(itemDescription);

    const ctaLink = document.createElement('a');
    const ctaAnchor = ctaLinkCell.querySelector('a');
    if (ctaAnchor) {
      ctaLink.href = ctaAnchor.href;
    }
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentSectionHeader.append(ctaLink);

    contentWrapDiv.append(contentSectionHeader);
    wrapDiv.append(contentWrapDiv);
    slidesDiv.append(wrapDiv);

    moveInstrumentation(row, slidesDiv); // Move instrumentation from the item row

    gridLayoutDiv.append(slidesDiv);
  });

  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);

  // Optimize images
  section.querySelectorAll('picture').forEach((pictureElement) => {
    const img = pictureElement.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be called on the original img, not the new optimizedPic's img
      // The original img is replaced, so its instrumentation is lost.
      // We should move instrumentation from the original picture element if it exists,
      // or from the original img if the picture was created by the block.
      // Since the picture is created by the block, we can't move instrumentation from it.
      // The instrumentation for the row is already moved to slidesDiv.
      // The optimizedPic replaces the entire picture element, so no need to move instrumentation to its inner img.
      pictureElement.replaceWith(optimizedPic);
    }
  });
}
