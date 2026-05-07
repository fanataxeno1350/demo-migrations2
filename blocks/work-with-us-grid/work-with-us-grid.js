import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  [...block.children].forEach((row) => {
    const [
      imageDesktopCell,
      imageMobile576Cell,
      imageMobile799Cell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const desktopImg = imageDesktopCell.querySelector('img');
    const mobile576Img = imageMobile576Cell.querySelector('img');
    const mobile799Img = imageMobile799Cell.querySelector('img');

    if (desktopImg) {
      const sources = [];
      if (mobile576Img) {
        sources.push({ media: '(max-width: 576px)', width: '576', srcset: mobile576Img.src });
      }
      if (mobile799Img) {
        sources.push({ media: '(max-width: 799px)', width: '799', srcset: mobile799Img.src });
      }
      sources.push({ width: '1200' }); // Default desktop size

      const picture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, sources);
      const optimizedImg = picture.querySelector('img');
      optimizedImg.classList.add('img-fluid');
      optimizedImg.alt = desktopImg.alt;
      optimizedImg.title = desktopImg.title;
      optimizedImg.loading = 'lazy';
      moveInstrumentation(desktopImg, optimizedImg); // Move instrumentation from original img to optimized img
      imageWrapDiv.append(picture);
      wrapDiv.append(imageWrapDiv);
    }


    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const sectionHeaderDiv = document.createElement('div');
    sectionHeaderDiv.classList.add('section-header');

    const heading = document.createElement('h3');
    heading.classList.add('heading', 'font-regular');
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingCell, heading);
    sectionHeaderDiv.append(heading);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell.textContent.trim();
    moveInstrumentation(descriptionCell, description);
    sectionHeaderDiv.append(description);

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const ctaButton = document.createElement('a');
      ctaButton.classList.add('btn', 'btn-primary', 'stretched-link');
      ctaButton.href = ctaLink.href;
      ctaButton.textContent = ctaLabelCell.textContent.trim();
      moveInstrumentation(ctaLinkCell, ctaButton);
      sectionHeaderDiv.append(ctaButton);
    }

    contentWrapDiv.append(sectionHeaderDiv);
    wrapDiv.append(contentWrapDiv);
    slidesDiv.append(wrapDiv);
    moveInstrumentation(row, slidesDiv);
    gridLayout.append(slidesDiv);
  });

  block.replaceChildren(gridLayout);
}
