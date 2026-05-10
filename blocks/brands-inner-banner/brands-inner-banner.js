import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [mobileImageRow, desktopImageRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-inner-banner');

  // Mobile Banner
  const mobileBannerDiv = document.createElement('div');
  mobileBannerDiv.classList.add('inner-banner', 'brand_mobile');
  if (mobileImageRow) {
    const [mobileImageCell] = [...mobileImageRow.children]; // Destructuring for fixed schema
    const mobilePicture = mobileImageCell?.querySelector('picture');
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      if (mobileImg) {
        const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
        optimizedMobilePic.querySelector('img').classList.add('img-fluid', 'lozad');
        moveInstrumentation(mobileImageRow, optimizedMobilePic.querySelector('img'));
        mobileBannerDiv.append(optimizedMobilePic);
      }
    }
  }
  section.append(mobileBannerDiv);

  // Desktop Banner
  const desktopBannerDiv = document.createElement('div');
  desktopBannerDiv.classList.add('inner-banner', 'brand_desktop');
  if (desktopImageRow) {
    const [desktopImageCell] = [...desktopImageRow.children]; // Destructuring for fixed schema
    const desktopPicture = desktopImageCell?.querySelector('picture');
    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        // For background images, we typically just need the src.
        // The original HTML implies a background-image style.
        // We'll apply it directly to the div.
        desktopBannerDiv.style.backgroundImage = `url("${desktopImg.src}")`;
        desktopBannerDiv.style.backgroundRepeat = 'no-repeat';
        desktopBannerDiv.style.backgroundSize = '100%';
        // Move instrumentation from the original row to the new div
        moveInstrumentation(desktopImageRow, desktopBannerDiv);
      }
    }
  }
  section.append(desktopBannerDiv);

  block.replaceChildren(section);
}
