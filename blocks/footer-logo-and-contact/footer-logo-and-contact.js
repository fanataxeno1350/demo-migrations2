import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [mobileLogoRow, footerFirstRegionRow, ...otherRows] = [...block.children];

  const rootDiv = document.createElement('div');
  rootDiv.classList.add('row'); // From ORIGINAL HTML

  // Mobile Logo Only
  if (mobileLogoRow) {
    const mobileLogoWrapper = document.createElement('div');
    mobileLogoWrapper.id = 'mobile-logo-only'; // From ORIGINAL HTML
    mobileLogoWrapper.classList.add('row'); // From ORIGINAL HTML

    const logoFooterMobileWrapper = document.createElement('div');
    logoFooterMobileWrapper.id = 'logo-footer-mobile-wrapper'; // From ORIGINAL HTML

    // Move instrumentation from the original row to the new wrapper
    moveInstrumentation(mobileLogoRow, mobileLogoWrapper);

    // Append all children from the original mobile logo row to the new logoFooterMobileWrapper
    while (mobileLogoRow.firstChild) {
      logoFooterMobileWrapper.append(mobileLogoRow.firstChild);
    }
    mobileLogoWrapper.append(logoFooterMobileWrapper);
    rootDiv.append(mobileLogoWrapper);
  }

  // Footer First Region
  if (footerFirstRegionRow) {
    const section = document.createElement('section');
    section.classList.add('region', 'region-footer-first'); // From ORIGINAL HTML

    const logoFooterContainer = document.createElement('div');
    logoFooterContainer.id = 'logo-footer-container'; // From ORIGINAL HTML

    // Move instrumentation from the original row to the new section
    moveInstrumentation(footerFirstRegionRow, section);

    // Append all children from the original footer first region row to the new logoFooterContainer
    while (footerFirstRegionRow.firstChild) {
      logoFooterContainer.append(footerFirstRegionRow.firstChild);
    }
    section.append(logoFooterContainer);
    rootDiv.append(section);
  }

  // Optimize images within the block
  rootDiv.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(rootDiv);
}
