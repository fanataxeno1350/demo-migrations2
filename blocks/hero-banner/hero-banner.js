import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [mobileImageRow, desktopImageRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('brands-inner-banner');

  // Mobile Banner
  const mobileBannerDiv = document.createElement('div');
  mobileBannerDiv.classList.add('inner-banner', 'brand_mobile');
  if (mobileImageRow) {
    const mobilePicture = mobileImageRow.children[0]?.querySelector('picture');
    if (mobilePicture) {
      const img = mobilePicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      mobileBannerDiv.append(optimizedPic);
      mobileBannerDiv.querySelector('img').classList.add('img-fluid', 'lozad');
    }
    moveInstrumentation(mobileImageRow, mobileBannerDiv);
  }
  section.append(mobileBannerDiv);

  // Desktop Banner
  const desktopBannerDiv = document.createElement('div');
  desktopBannerDiv.classList.add('inner-banner', 'brand_desktop');
  if (desktopImageRow) {
    const desktopPicture = desktopImageRow.children[0]?.querySelector('picture');
    if (desktopPicture) {
      const img = desktopPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]); // Desktop image, larger width
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      desktopBannerDiv.append(optimizedPic);
      // The original HTML uses a background image for desktop, so we'll apply it via style
      // This is a special case to match the original HTML's background-image usage.
      desktopBannerDiv.style.backgroundImage = `url('${img.src}')`;
      desktopBannerDiv.style.backgroundRepeat = 'no-repeat';
      desktopBannerDiv.style.backgroundAttachment = 'fixed';
      desktopBannerDiv.style.backgroundSize = '100%';
    }
    moveInstrumentation(desktopImageRow, desktopBannerDiv);
  }
  section.append(desktopBannerDiv);

  block.replaceChildren(section);
}
