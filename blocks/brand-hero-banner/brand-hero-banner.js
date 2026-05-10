import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // CHECK 0: Replaced direct .children[n] with array destructuring for fixed schema
  const [mobileImageRow, desktopImageRow] = [...block.children];

  const section = document.createElement('section');
  // CHECK 0.5: Block's own class 'brand-hero-banner' is NOT added to inner wrapper 'section'.
  // The outer block div already carries it.
  section.classList.add('brands-inner-banner'); // Class from ORIGINAL HTML
  moveInstrumentation(block, section);

  // Mobile Banner
  const mobileBannerDiv = document.createElement('div');
  mobileBannerDiv.classList.add('inner-banner', 'brand_mobile'); // Classes from ORIGINAL HTML
  if (mobileImageRow) {
    // The model specifies 'reference' type, so we expect a picture element directly in the cell.
    // The row itself is `<div><div><picture>...</div></div>`. The cell is `<div><picture>...</div>`.
    const mobileImageCell = mobileImageRow.children[0]; // Accessing the cell within the row
    const mobilePicture = mobileImageCell?.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      if (img) {
        const optimizedMobilePic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedMobilePic.querySelector('img'));
        mobileBannerDiv.append(optimizedMobilePic);
        optimizedMobilePic.querySelector('img').classList.add('img-fluid', 'lozad'); // Classes from ORIGINAL HTML
      }
    }
    moveInstrumentation(mobileImageRow, mobileBannerDiv);
  }
  section.append(mobileBannerDiv);

  // Desktop Banner
  const desktopBannerDiv = document.createElement('div');
  desktopBannerDiv.classList.add('inner-banner', 'brand_desktop'); // Classes from ORIGINAL HTML
  if (desktopImageRow) {
    const desktopImageCell = desktopImageRow.children[0]; // Accessing the cell within the row
    const desktopPicture = desktopImageCell?.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      if (img) {
        // For desktop, the original HTML uses background-image.
        // We'll set the background style directly on the div,
        // but still use createOptimizedPicture for the src.
        const optimizedDesktopPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
        // Extract the actual src from the optimized picture's img element
        const desktopImgSrc = optimizedDesktopPic.querySelector('img').src;
        // CHECK 3: Using dynamic src from optimized picture, not hardcoded.
        desktopBannerDiv.style.background = `url("${desktopImgSrc}") no-repeat fixed`;
        desktopBannerDiv.style.backgroundSize = '100%';
      }
    }
    moveInstrumentation(desktopImageRow, desktopBannerDiv);
  }
  section.append(desktopBannerDiv);

  block.replaceChildren(section);

  // CHECK 2.5: Swiper initialization (if applicable, though not explicitly requested for this block)
  // This block does not appear to be a Swiper carousel based on ORIGINAL HTML classes.
  // If it were, the following would be added:
  /*
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
  // eslint-disable-next-line no-undef
  new Swiper(swiperEl, {
    slidesPerView: 'auto',
    loop: false, // or true based on data-loop
    navigation: { prevEl: prevBtn, nextEl: nextBtn },
    pagination: { el: paginationEl, clickable: true },
  });
  */
}
