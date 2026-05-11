import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [mobileImageRow, desktopImageRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-inner-banner');
  // moveInstrumentation(block, section); // Block instrumentation is handled by block.replaceChildren()

  // Mobile Banner
  const mobileBannerDiv = document.createElement('div');
  mobileBannerDiv.classList.add('inner-banner', 'brand_mobile');
  if (mobileImageRow) {
    const mobilePicture = mobileImageRow.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      const optimizedMobilePicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation needs to be called on the element that is actually moved, which is the img inside the picture
      moveInstrumentation(mobileImageRow, optimizedMobilePicture.querySelector('img'));
      optimizedMobilePicture.querySelector('img').classList.add('img-fluid', 'lozad');
      mobileBannerDiv.append(optimizedMobilePicture);
    }
  }
  section.append(mobileBannerDiv);

  // Desktop Banner
  const desktopBannerDiv = document.createElement('div');
  desktopBannerDiv.classList.add('inner-banner', 'brand_desktop');
  if (desktopImageRow) {
    const desktopPicture = desktopImageRow.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedDesktopPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]); // Desktop image larger width
      // moveInstrumentation needs to be called on the element that is actually moved, which is the img inside the picture
      moveInstrumentation(desktopImageRow, optimizedDesktopPicture.querySelector('img'));
      optimizedDesktopPicture.querySelector('img').classList.add('img-fluid', 'lozad'); // Added missing classes from original HTML
      desktopBannerDiv.append(optimizedDesktopPicture);
    }
  }
  section.append(desktopBannerDiv);

  block.replaceChildren(section);
}
