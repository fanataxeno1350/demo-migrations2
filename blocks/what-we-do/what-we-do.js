import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children].filter(
    (row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''),
  );

  const [headingRow, descriptionRow, ...verticalRows] = children;

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Section Heading
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.children[0]?.textContent.trim() || '';
    sectionHeader.append(heading);
  }

  // Section Description
  if (descriptionRow) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionRow, description);
    description.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    sectionHeader.append(description);
  }

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  section.append(ourBusinessVerticals);

  // Desktop View
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile View
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // Flickity adds flickity-enabled and is-draggable
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const slides = [];
  let currentSlide = document.createElement('div');
  currentSlide.classList.add('slides');
  flickitySlider.append(currentSlide);
  slides.push(currentSlide);

  let mobileSlideRow = document.createElement('div');
  mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentSlide.append(mobileSlideRow);

  verticalRows.forEach((row, index) => {
    const [imageDesktopCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    // Desktop Item
    const colDesktop = document.createElement('div');
    colDesktop.classList.add('col', 'aos-init', 'aos-animate');
    colDesktop.setAttribute('data-aos', 'fade-up');
    colDesktop.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delays
    desktopRow.append(colDesktop);

    const wrapDesktop = document.createElement('div');
    wrapDesktop.classList.add('wrap');
    moveInstrumentation(row, wrapDesktop); // Move instrumentation from original row to desktop wrap
    colDesktop.append(wrapDesktop);

    const imageDesktopDiv = document.createElement('div');
    imageDesktopDiv.classList.add('image');
    wrapDesktop.append(imageDesktopDiv);

    if (imageDesktopCell) {
      const pictureDesktop = imageDesktopCell.querySelector('picture');
      if (pictureDesktop) {
        const imgDesktop = pictureDesktop.querySelector('img');
        if (imgDesktop) {
          const optimizedPicDesktop = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
          moveInstrumentation(imgDesktop, optimizedPicDesktop.querySelector('img'));
          imageDesktopDiv.append(optimizedPicDesktop);
        }
      }
    }

    const titleDesktopDiv = document.createElement('div');
    titleDesktopDiv.classList.add('title');
    titleDesktopDiv.textContent = titleCell?.textContent.trim() || '';
    wrapDesktop.append(titleDesktopDiv);

    if (arrowIconCell) {
      const arrowIconPicture = arrowIconCell.querySelector('picture');
      if (arrowIconPicture) {
        const arrowIconImg = arrowIconPicture.querySelector('img');
        if (arrowIconImg) {
          const optimizedArrowIcon = createOptimizedPicture(arrowIconImg.src, arrowIconImg.alt, false, [{ width: '10' }]);
          moveInstrumentation(arrowIconImg, optimizedArrowIcon.querySelector('img'));
          titleDesktopDiv.append(optimizedArrowIcon);
        }
      }
    }

    const linkDesktop = document.createElement('a');
    linkDesktop.classList.add('stretched-link');
    const foundLinkDesktop = linkCell?.querySelector('a');
    if (foundLinkDesktop) {
      linkDesktop.href = foundLinkDesktop.href;
      linkDesktop.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    }
    wrapDesktop.append(linkDesktop);

    // Mobile Item - Group into slides of 3 items
    const colMobile = document.createElement('div');
    colMobile.classList.add('col');
    mobileSlideRow.append(colMobile);

    const wrapMobile = document.createElement('div');
    wrapMobile.classList.add('wrap');
    colMobile.append(wrapMobile);

    const imageMobileDiv = document.createElement('div');
    imageMobileDiv.classList.add('image');
    wrapMobile.append(imageMobileDiv);

    if (imageMobileCell) {
      const pictureMobile = imageMobileCell.querySelector('picture');
      if (pictureMobile) {
        const imgMobile = pictureMobile.querySelector('img');
        if (imgMobile) {
          const optimizedPicMobile = createOptimizedPicture(imgMobile.src, imgMobile.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
          moveInstrumentation(imgMobile, optimizedPicMobile.querySelector('img')); // Add instrumentation for mobile image
          imageMobileDiv.append(optimizedPicMobile);
        }
      }
    }

    const titleMobileDiv = document.createElement('div');
    titleMobileDiv.classList.add('title');
    titleMobileDiv.textContent = titleCell?.textContent.trim() || '';
    wrapMobile.append(titleMobileDiv);

    if (arrowIconCell) {
      const arrowIconPicture = arrowIconCell.querySelector('picture');
      if (arrowIconPicture) {
        const arrowIconImg = arrowIconPicture.querySelector('img');
        if (arrowIconImg) {
          const optimizedArrowIcon = createOptimizedPicture(arrowIconImg.src, arrowIconImg.alt, false, [{ width: '10' }]);
          titleMobileDiv.append(optimizedArrowIcon);
        }
      }
    }

    const linkMobile = document.createElement('a');
    linkMobile.classList.add('stretched-link');
    const foundLinkMobile = linkCell?.querySelector('a');
    if (foundLinkMobile) {
      linkMobile.href = foundLinkMobile.href;
      linkMobile.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
    }
    wrapMobile.append(linkMobile);

    if ((index + 1) % 3 === 0 && (index + 1) < verticalRows.length) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      flickitySlider.append(currentSlide);
      slides.push(currentSlide);

      mobileSlideRow = document.createElement('div');
      mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(mobileSlideRow);
    }
  });

  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  slides.forEach((_, i) => {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    flickityPageDots.append(dot);
  });
  mobileSlider.append(flickityPageDots);

  block.replaceChildren(section);

  // Flickity Initialization
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is available in /libs
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is available in /libs

  // eslint-disable-next-line no-undef
  new Flickity(mobileSlider, {
    wrapAround: mobileSlider.dataset.flickity.includes('"wrapAround": true'),
    lazyLoad: mobileSlider.dataset.flickity.includes('"lazyLoad": true'),
    pageDots: mobileSlider.dataset.flickity.includes('"pageDots": true'),
    prevNextButtons: mobileSlider.dataset.flickity.includes('"prevNextButtons": true'),
    imagesLoaded: mobileSlider.dataset.flickity.includes('"imagesLoaded": true'),
    cellAlign: 'left', // Default from original HTML
    adaptiveHeight: mobileSlider.dataset.flickity.includes('"adaptiveHeight": true'),
  });
}
