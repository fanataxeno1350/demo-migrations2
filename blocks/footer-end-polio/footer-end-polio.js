import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block.children to get the logo and logoLink rows
  const [logoRow, logoLinkRow] = [...block.children];

  const logoContainer = document.createElement('p');
  const logoLink = document.createElement('a');
  const logoImage = document.createElement('img');

  // Apply classes from ORIGINAL HTML
  // The original HTML shows the image wrapped in an anchor, which is then wrapped in a <p>
  // We'll replicate this structure and class names.

  // Logo Link
  // The logoLinkRow contains a single cell, which in turn contains the <a> tag.
  // We need to access the cell first, then query for the <a>.
  const logoLinkCell = logoLinkRow.children[0];
  const foundLogoLink = logoLinkCell?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    // Move instrumentation from the cell containing the link to the new link element
    moveInstrumentation(logoLinkCell, logoLink);
  }

  // Logo Image
  // The logoRow contains a single cell, which in turn contains the <picture> tag.
  const logoImageCell = logoRow.children[0];
  const picture = logoImageCell?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      logoImage.alt = img.alt;
      logoImage.src = img.src;
      // Copy height and width if present in original HTML img tag
      if (img.hasAttribute('height')) {
        logoImage.height = img.height;
      }
      if (img.hasAttribute('width')) {
        logoImage.width = img.width;
      }
      // Move instrumentation from the cell containing the picture to the new image element
      moveInstrumentation(logoImageCell, logoImage);
    }
  }

  // Append image to link, then link to paragraph
  logoLink.append(logoImage);
  logoContainer.append(logoLink);

  // Optimize picture if it exists
  if (picture) {
    const optimizedPic = createOptimizedPicture(logoImage.src, logoImage.alt, false, [{ width: '80' }]);
    // moveInstrumentation should be called on the original element (logoImage)
    // and the new element (the img inside optimizedPic)
    moveInstrumentation(logoImage, optimizedPic.querySelector('img'));
    logoLink.replaceChild(optimizedPic, logoImage);
  }

  block.replaceChildren(logoContainer);
}
