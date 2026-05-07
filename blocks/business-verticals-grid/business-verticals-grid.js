import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const itemRows = [...block.children];

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  // Group items for mobile slider (3 items per slide)
  const mobileSlides = [];
  for (let i = 0; i < itemRows.length; i += 3) {
    mobileSlides.push(itemRows.slice(i, i + 3));
  }

  itemRows.forEach((row, index) => {
    const [imageDesktopCell, imageMobileCell, titleCell, arrowIconCell, linkCell] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');

    // Handle desktop image
    const desktopPicture = imageDesktopCell.querySelector('picture');
    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        // Create optimized picture for desktop, ensuring all sources are included
        const optimizedDesktopPic = createOptimizedPicture(
          desktopImg.src,
          desktopImg.alt,
          false,
          [
            { media: '(min-width: 992px)', width: '992' },
            { media: '(min-width: 450px)', width: '450' },
            { width: '376' },
          ],
        );
        optimizedDesktopPic.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
        moveInstrumentation(desktopPicture, optimizedDesktopPic); // Move instrumentation from original picture to new picture
        imageDiv.append(optimizedDesktopPic);
      }
    }

    // Handle mobile image - if different, add as a separate picture or sources
    // The original HTML shows that desktop and mobile images are handled by <source media> within ONE <picture> tag.
    // The current logic creates a combined picture, but `createOptimizedPicture` is designed to handle this.
    // Let's simplify: `createOptimizedPicture` should generate the correct <picture> with <source> tags.
    // If imageMobileCell contains a *different* image, it should be a separate picture element.
    // Given the model, imageDesktop and imageMobile are distinct fields, implying distinct assets.
    // So, we should create a separate picture for mobile if it's truly a different asset.
    // However, the original HTML structure implies a single picture with responsive sources.
    // Let's assume `createOptimizedPicture` from `imageDesktopCell` is sufficient for the responsive sources.
    // If `imageMobileCell` contains a truly different image, it should be added as a separate picture
    // and CSS would manage its visibility. For now, we'll stick to the idea that `imageDesktopCell`
    // provides the primary responsive image. If `imageMobileCell` is meant to override completely,
    // the logic needs to be more complex.
    // For now, we'll assume the `imageDesktopCell` contains the primary responsive image.
    // The previous code had a complex "combinedPicture" logic which is usually handled by createOptimizedPicture.
    // Let's ensure `createOptimizedPicture` is used for the primary image, and if `imageMobileCell`
    // is truly a distinct image, it should be added as a separate picture element with appropriate classes
    // for CSS to hide/show.
    // Based on the ORIGINAL HTML, there's only one <picture> per item, with multiple <source> tags.
    // So, `imageDesktopCell` should contain all the necessary sources. `imageMobileCell` might be redundant
    // or intended for a different use case not reflected in the example HTML.
    // For now, we'll use the desktop image as the primary and assume `createOptimizedPicture` handles
    // the responsive sources correctly. If `imageMobileCell` is truly a separate asset, it would need
    // its own <picture> tag and CSS to toggle visibility.
    // Given the model, `imageDesktop` and `imageMobile` are separate fields.
    // This implies two distinct images. The original HTML only shows one <picture> with multiple sources.
    // This is a discrepancy. Let's create two distinct pictures and let CSS handle.
    const mobilePicture = imageMobileCell.querySelector('picture');
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      if (mobileImg) {
        const optimizedMobilePic = createOptimizedPicture(
          mobileImg.src,
          mobileImg.alt,
          false,
          [
            { media: '(min-width: 992px)', width: '992' },
            { media: '(min-width: 450px)', width: '450' },
            { width: '376' },
          ],
        );
        optimizedMobilePic.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
        // Add a class to distinguish mobile picture if needed for CSS
        optimizedMobilePic.classList.add('mobile-only-picture');
        moveInstrumentation(mobilePicture, optimizedMobilePic);
        imageDiv.append(optimizedMobilePic);
      }
    }


    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();

    const arrowIcon = arrowIconCell.querySelector('picture');
    if (arrowIcon) {
      const arrowImg = arrowIcon.querySelector('img');
      if (arrowImg) {
        const optimizedArrowPic = createOptimizedPicture(arrowImg.src, arrowImg.alt, false, [{ width: '10' }]);
        moveInstrumentation(arrowImg, optimizedArrowPic.querySelector('img'));
        titleDiv.append(' ', optimizedArrowPic); // Add a space before the icon
      }
    }

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      moveInstrumentation(foundLink, link); // Move instrumentation from original link to new link
    }

    moveInstrumentation(row, wrap); // Move instrumentation from original row to the new wrap div
    wrap.append(imageDiv, titleDiv, link);

    // Desktop layout
    const colDesktop = document.createElement('div');
    colDesktop.classList.add('col', 'aos-init', 'aos-animate');
    colDesktop.setAttribute('data-aos', 'fade-up');
    colDesktop.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Example delay pattern
    colDesktop.append(wrap.cloneNode(true)); // Clone for desktop
    desktopRow.append(colDesktop);

    // Mobile layout (grouped in slides of 3)
    const slideIndex = Math.floor(index / 3);
    if (!mobileSlides[slideIndex]) {
      mobileSlides[slideIndex] = [];
    }
    mobileSlides[slideIndex].push(wrap);
  });

  // Construct mobile slides
  mobileSlides.forEach((slideItems, slideIdx) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    if (slideIdx === 0) {
      slideDiv.classList.add('is-selected');
    }
    const slideRow = document.createElement('div');
    slideRow.classList.add('row', 'row-cols-1', 'gy-3');
    slideItems.forEach((item) => {
      const colMobile = document.createElement('div');
      colMobile.classList.add('col');
      colMobile.append(item.cloneNode(true)); // Clone for mobile
      slideRow.append(colMobile);
    });
    slideDiv.append(slideRow);
    mobileSlider.append(slideDiv);
  });

  // The block itself already has the 'business-verticals-grid' class from AEM.
  // Adding 'our-business-verticals' to an inner root div would cause double padding/CSS.
  // Instead, add 'our-business-verticals' to the block element directly.
  block.classList.add('our-business-verticals');
  block.replaceChildren(desktopContainer, mobileContainer);

  // Load Flickity for mobile slider
  await loadCSS('https://unpkg.com/flickity@2/dist/flickity.min.css');
  await loadScript('https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js');

  // eslint-disable-next-line no-undef
  if (typeof Flickity !== 'undefined') {
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
}
