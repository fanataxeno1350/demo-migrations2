import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [mobileImageRow, desktopImageRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-inner-banner');
  moveInstrumentation(block, section);

  // Mobile Banner
  const mobileBannerDiv = document.createElement('div');
  mobileBannerDiv.classList.add('inner-banner', 'brand_mobile');
  if (mobileImageRow) {
    const mobileImageCell = mobileImageRow.children[0]; // Access the cell containing the picture
    const mobilePicture = mobileImageCell?.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      // createOptimizedPicture handles responsive images, no need for manual width attribute
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('img-fluid', 'lozad');
      moveInstrumentation(mobileImageRow, optimizedImg); // Instrument the row to the image
      mobileBannerDiv.append(optimizedPic);
    }
  }
  section.append(mobileBannerDiv);

  // Desktop Banner
  const desktopBannerDiv = document.createElement('div');
  desktopBannerDiv.classList.add('inner-banner', 'brand_desktop');
  if (desktopImageRow) {
    const desktopImageCell = desktopImageRow.children[0]; // Access the cell containing the picture
    const desktopPicture = desktopImageCell?.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const imgSrc = img ? img.src : '';
      if (imgSrc) {
        // Original HTML uses background-image style, so we apply it directly.
        // The 'fixed' keyword in original HTML's background style is likely for background-attachment.
        // We'll replicate the style as closely as possible.
        desktopBannerDiv.style.background = `url("${imgSrc}") no-repeat`;
        desktopBannerDiv.style.backgroundSize = '100%';
        desktopBannerDiv.style.backgroundAttachment = 'fixed'; // Added based on 'fixed' keyword in original HTML
      }
      // Move instrumentation from the original row to the desktopBannerDiv
      moveInstrumentation(desktopImageRow, desktopBannerDiv);
    }
  }
  section.append(desktopBannerDiv);

  block.replaceChildren(section);
}
