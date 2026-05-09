import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');

  // First row is the heading
  const [headingRow, ...itemRows] = children;

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');
  positionRelativeDiv.setAttribute('data-aos', 'fade-up');
  positionRelativeDiv.setAttribute('data-aos-offset', '100');
  positionRelativeDiv.setAttribute('data-aos-duration', '650');
  positionRelativeDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const container = document.createElement('div');
  container.classList.add('container');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  itemRows.forEach((row) => {
    const [
      imageMobile576Cell,
      imageMobile799Cell,
      imageDesktopCell,
      titleCell,
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

    const picture = document.createElement('picture');
    const imgMobile576 = imageMobile576Cell?.querySelector('img');
    const imgMobile799 = imageMobile799Cell?.querySelector('img');
    const imgDesktop = imageDesktopCell?.querySelector('img');

    // Create optimized picture with all sources
    const sources = [];
    if (imgMobile576) {
      sources.push({ media: '(max-width: 576px)', srcset: imgMobile576.src });
    }
    if (imgMobile799) {
      sources.push({ media: '(max-width: 799px)', srcset: imgMobile799.src });
    }

    if (imgDesktop) {
      const optimizedPicture = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }], sources);
      optimizedPicture.querySelector('img').classList.add('img-fluid');
      picture.replaceWith(optimizedPicture); // Replace the empty picture element with the optimized one
    } else if (sources.length > 0) {
      // If no desktop image, but mobile sources exist, create a picture with just sources
      const tempImg = document.createElement('img'); // Placeholder img for createOptimizedPicture
      tempImg.src = sources[0].srcset; // Use first mobile source as fallback
      tempImg.alt = 'Image';
      const optimizedPicture = createOptimizedPicture(tempImg.src, tempImg.alt, false, [{ width: '750' }], sources);
      optimizedPicture.querySelector('img').classList.add('img-fluid');
      picture.replaceWith(optimizedPicture);
    }

    if (picture.closest('picture')) { // Check if picture was replaced by optimizedPicture
      imageWrapDiv.append(picture.closest('picture'));
      wrapDiv.append(imageWrapDiv);
    }


    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const itemTitle = document.createElement('h3');
    itemTitle.classList.add('heading', 'font-regular');
    itemTitle.textContent = titleCell?.textContent.trim() || '';
    contentSectionHeader.append(itemTitle);

    const itemDescription = document.createElement('div'); // Use div for richtext
    itemDescription.classList.add('text-size-body');
    itemDescription.innerHTML = descriptionCell?.innerHTML || '';
    contentSectionHeader.append(itemDescription);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundCtaLink = ctaLinkCell?.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.textContent = ctaLabelCell?.textContent.trim() || '';
    contentSectionHeader.append(ctaLink);

    contentWrapDiv.append(contentSectionHeader);
    wrapDiv.append(contentWrapDiv);
    slidesDiv.append(wrapDiv);
    gridLayout.append(slidesDiv);

    moveInstrumentation(row, slidesDiv);
  });

  container.append(gridLayout);
  positionRelativeDiv.append(container);
  section.append(positionRelativeDiv);

  block.replaceChildren(section);

  // The createOptimizedPicture is now handled within the loop for each item,
  // so this final loop is no longer needed and can be removed.
  // section.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
