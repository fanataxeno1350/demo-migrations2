import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // Heading and Description
  const [headingRow, descriptionRow, ...businessVerticals] = children;

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(descriptionRow, description);
  description.textContent = descriptionRow.textContent.trim();
  sectionHeader.append(description);

  container.append(sectionHeader);
  section.append(container);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  // Mobile view (Flickity slider)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // Flickity adds flickity-enabled and is-draggable
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileSlider.setAttribute('tabindex', '0');

  // Group items for mobile slider (3 items per slide)
  const mobileSlides = [];
  for (let i = 0; i < businessVerticals.length; i += 3) {
    mobileSlides.push(businessVerticals.slice(i, i + 3));
  }

  businessVerticals.forEach((row, index) => {
    const [imageDesktopCell, imageTabletCell, arrowIconCell, titleCell, linkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delays

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');

    // Desktop Image
    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const optimizedDesktopPicture = createOptimizedPicture(
        desktopPicture.querySelector('img').src,
        desktopPicture.querySelector('img').alt,
        false,
        [{ media: '(min-width: 992px)', width: '376' }],
      );
      moveInstrumentation(desktopPicture, optimizedDesktopPicture.querySelector('img'));
      imageDiv.append(optimizedDesktopPicture);
    }

    // Tablet/Mobile Image (will be replaced by desktop if desktop is present)
    const tabletPicture = imageTabletCell.querySelector('picture');
    if (tabletPicture) {
      const optimizedTabletPicture = createOptimizedPicture(
        tabletPicture.querySelector('img').src,
        tabletPicture.querySelector('img').alt,
        false,
        [{ media: '(min-width: 450px)', width: '376' }],
      );
      // If desktop picture was not added, add tablet picture, otherwise it's already handled
      if (!imageDiv.querySelector('picture')) {
        moveInstrumentation(tabletPicture, optimizedTabletPicture.querySelector('img'));
        imageDiv.append(optimizedTabletPicture);
      } else {
        // Find the img inside the existing picture and add a source for tablet
        const existingPicture = imageDiv.querySelector('picture');
        const tabletSource = document.createElement('source');
        tabletSource.setAttribute('media', '(min-width: 450px)');
        tabletSource.setAttribute('srcset', tabletPicture.querySelector('img').src);
        existingPicture.prepend(tabletSource);
      }
    }

    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();

    const arrowIcon = arrowIconCell.querySelector('picture');
    if (arrowIcon) {
      const img = arrowIcon.querySelector('img');
      img.classList.add('img-fluid');
      moveInstrumentation(arrowIcon, img);
      titleDiv.append(img);
    }
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const authoredLink = linkCell.querySelector('a');
    if (authoredLink) {
      link.href = authoredLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(row, link);
    wrap.append(link);

    col.append(wrap);
    desktopRow.append(col);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  mobileSlides.forEach((slideItems, slideIndex) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    // Flickity handles 'is-selected'
    // slideDiv.style.position = 'absolute'; // Flickity sets this
    // slideDiv.style.left = '0px'; // Flickity sets this

    const slideRow = document.createElement('div');
    slideRow.classList.add('row', 'row-cols-1', 'gy-3');

    slideItems.forEach((row) => {
      const [imageDesktopCell, imageTabletCell, arrowIconCell, titleCell, linkCell] = [...row.children];

      const col = document.createElement('div');
      col.classList.add('col');

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image');

      // Desktop Image
      const desktopPicture = imageDesktopCell.querySelector('picture');
      if (desktopPicture) {
        const optimizedDesktopPicture = createOptimizedPicture(
          desktopPicture.querySelector('img').src,
          desktopPicture.querySelector('img').alt,
          false,
          [{ media: '(min-width: 992px)', width: '376' }],
        );
        moveInstrumentation(desktopPicture, optimizedDesktopPicture.querySelector('img'));
        imageDiv.append(optimizedDesktopPicture);
      }

      // Tablet/Mobile Image
      const tabletPicture = imageTabletCell.querySelector('picture');
      if (tabletPicture) {
        const optimizedTabletPicture = createOptimizedPicture(
          tabletPicture.querySelector('img').src,
          tabletPicture.querySelector('img').alt,
          false,
          [{ media: '(min-width: 450px)', width: '376' }],
        );
        // If desktop picture was not added, add tablet picture, otherwise it's already handled
        if (!imageDiv.querySelector('picture')) {
          moveInstrumentation(tabletPicture, optimizedTabletPicture.querySelector('img'));
          imageDiv.append(optimizedTabletPicture);
        } else {
          // Find the img inside the existing picture and add a source for tablet
          const existingPicture = imageDiv.querySelector('picture');
          const tabletSource = document.createElement('source');
          tabletSource.setAttribute('media', '(min-width: 450px)');
          tabletSource.setAttribute('srcset', tabletPicture.querySelector('img').src);
          existingPicture.prepend(tabletSource);
        }
      }

      wrap.append(imageDiv);

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');
      titleDiv.textContent = titleCell.textContent.trim();

      const arrowIcon = arrowIconCell.querySelector('picture');
      if (arrowIcon) {
        const img = arrowIcon.querySelector('img');
        img.classList.add('img-fluid');
        moveInstrumentation(arrowIcon, img);
        titleDiv.append(img);
      }
      wrap.append(titleDiv);

      const link = document.createElement('a');
      link.classList.add('stretched-link');
      const authoredLink = linkCell.querySelector('a');
      if (authoredLink) {
        link.href = authoredLink.href;
        link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      }
      moveInstrumentation(row, link);
      wrap.append(link);

      col.append(wrap);
      slideRow.append(col);
    });
    slideDiv.append(slideRow);
    mobileSlider.append(slideDiv); // Append slides directly to mobileSlider, Flickity handles viewport/slider
  });

  mobileContainer.append(mobileSlider);
  ourBusinessVerticals.append(mobileContainer);

  section.append(ourBusinessVerticals);

  block.replaceChildren(section);

  // Flickity initialization for mobile slider
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is available
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is available

  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(mobileSlider, {
      wrapAround: mobileSlider.dataset.flickity.includes('"wrapAround": true'),
      lazyLoad: mobileSlider.dataset.flickity.includes('"lazyLoad": true'),
      pageDots: mobileSlider.dataset.flickity.includes('"pageDots": true'),
      prevNextButtons: mobileSlider.dataset.flickity.includes('"prevNextButtons": true'),
      imagesLoaded: mobileSlider.dataset.flickity.includes('"imagesLoaded": true'),
      cellAlign: mobileSlider.dataset.flickity.includes('"cellAlign": "right"') ? 'right' : 'left',
      adaptiveHeight: mobileSlider.dataset.flickity.includes('"adaptiveHeight": true'),
    });
  }
}
