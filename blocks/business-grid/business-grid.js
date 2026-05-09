import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js'; // Added loadScript, loadCSS
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) { // Added async
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading and Description rows
  const [headingRow, descriptionRow, ...itemRowsRaw] = children; // Fixed: array destructuring

  // Heading
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    sectionHeader.append(heading);
  }

  // Description
  if (descriptionRow) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionRow, description);
    // Fixed: richtext field, read innerHTML directly from the row's first cell
    description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    sectionHeader.append(description);
  }

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  section.append(ourBusinessVerticals);

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile view
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  // Removed data-flickity attribute as it will be initialized via JS
  mobileContainer.append(mobileSlider);

  const itemRows = itemRowsRaw.filter(row =>
    row.children.length > 0 &&
    [...row.children].some(c => c.children.length > 0 || c.textContent.trim() !== '')
  );

  itemRows.forEach((row) => {
    // Fixed: array destructuring for item cells
    const [imageDesktopCell, imageTabletCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop item
    const colDesktop = document.createElement('div');
    colDesktop.classList.add('col', 'aos-init', 'aos-animate');
    colDesktop.setAttribute('data-aos', 'fade-up');
    desktopRow.append(colDesktop);

    const wrapDesktop = document.createElement('div');
    wrapDesktop.classList.add('wrap');
    colDesktop.append(wrapDesktop);

    const imageDesktopDiv = document.createElement('div');
    imageDesktopDiv.classList.add('image');
    wrapDesktop.append(imageDesktopDiv);

    const pictureDesktop = imageDesktopCell?.querySelector('picture');
    if (pictureDesktop) {
      const img = pictureDesktop.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(pictureDesktop, optimizedPic.querySelector('img'));
      imageDesktopDiv.append(optimizedPic);
    }

    const titleDesktopDiv = document.createElement('div');
    titleDesktopDiv.classList.add('title');
    titleDesktopDiv.textContent = titleCell?.textContent.trim() || '';
    wrapDesktop.append(titleDesktopDiv);

    const arrowIconDesktop = arrowIconCell?.querySelector('picture');
    if (arrowIconDesktop) {
      const arrowImg = arrowIconDesktop.querySelector('img');
      const optimizedArrow = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(arrowIconDesktop, optimizedArrow.querySelector('img'));
      titleDesktopDiv.append(optimizedArrow);
    }

    const linkDesktop = document.createElement('a');
    linkDesktop.classList.add('stretched-link');
    const foundLinkDesktop = linkCell?.querySelector('a');
    if (foundLinkDesktop) {
      linkDesktop.href = foundLinkDesktop.href;
      linkDesktop.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    }
    moveInstrumentation(row, linkDesktop); // Move instrumentation from the original row to the link
    wrapDesktop.append(linkDesktop);

    // Mobile item
    const slideMobile = document.createElement('div');
    slideMobile.classList.add('slides');
    mobileSlider.append(slideMobile);

    const rowMobile = document.createElement('div');
    rowMobile.classList.add('row', 'row-cols-1', 'gy-3');
    slideMobile.append(rowMobile);

    const colMobile = document.createElement('div');
    colMobile.classList.add('col');
    rowMobile.append(colMobile);

    const wrapMobile = document.createElement('div');
    wrapMobile.classList.add('wrap');
    colMobile.append(wrapMobile);

    const imageMobileDiv = document.createElement('div');
    imageMobileDiv.classList.add('image');
    wrapMobile.append(imageMobileDiv);

    const pictureMobile = imageMobileCell?.querySelector('picture');
    if (pictureMobile) {
      const img = pictureMobile.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(pictureMobile, optimizedPic.querySelector('img')); // Added moveInstrumentation
      imageMobileDiv.append(optimizedPic);
    }

    const titleMobileDiv = document.createElement('div');
    titleMobileDiv.classList.add('title');
    titleMobileDiv.textContent = titleCell?.textContent.trim() || '';
    wrapMobile.append(titleMobileDiv);

    const arrowIconMobile = arrowIconCell?.querySelector('picture');
    if (arrowIconMobile) {
      const arrowImg = arrowIconMobile.querySelector('img');
      const optimizedArrow = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(arrowIconMobile, optimizedArrow.querySelector('img')); // Added moveInstrumentation
      titleMobileDiv.append(optimizedArrow);
    }

    const linkMobile = document.createElement('a');
    linkMobile.classList.add('stretched-link');
    const foundLinkMobile = linkCell?.querySelector('a');
    if (foundLinkMobile) {
      linkMobile.href = foundLinkMobile.href;
      linkMobile.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    }
    // No moveInstrumentation for mobile link as it's already moved to the desktop link (same logical item)
    wrapMobile.append(linkMobile);
  });

  block.replaceChildren(section);

  // Load Flickity for mobile slider
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is available in /libs
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is available in /libs

  // Initialize Flickity
  if (mobileSlider && typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(mobileSlider, {
      wrapAround: false,
      lazyLoad: true,
      pageDots: true,
      prevNextButtons: false,
      imagesLoaded: true,
      cellAlign: 'left',
      adaptiveHeight: true,
    });
  }

  // Optimise images - this loop should run on the final block content
  // Fixed: querySelectorAll('picture') and replace the picture element itself
  block.querySelectorAll('picture').forEach((picture) => {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(picture, optimizedPic.querySelector('img'));
      picture.replaceWith(optimizedPic);
    }
  });
}
