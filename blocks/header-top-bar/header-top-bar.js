import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, ...menuIconRows] = children;

  const section = document.createElement('section');
  section.classList.add('bg_top'); // From ORIGINAL HTML

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container'); // From ORIGINAL HTML
  section.append(containerDiv);

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row'); // From ORIGINAL HTML
  containerDiv.append(rowDiv);

  const colDiv = document.createElement('div');
  colDiv.classList.add('col-md-12'); // From ORIGINAL HTML
  rowDiv.append(colDiv);

  const topMenuDiv = document.createElement('div');
  topMenuDiv.classList.add('top_menu'); // From ORIGINAL HTML
  colDiv.append(topMenuDiv);

  // Mobile Logo and Link
  const mobileLogoLink = document.createElement('a');
  mobileLogoLink.classList.add('mobile-logo', 'mr-auto'); // From ORIGINAL HTML
  mobileLogoLink.href = logoLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, mobileLogoLink); // Instrumentation for the link row

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation(img, optimizedPic.querySelector('img')); // Instrumentation should be on the original element, not the new one
    mobileLogoLink.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('img-fluid'); // From ORIGINAL HTML
  }
  moveInstrumentation(logoRow, mobileLogoLink); // Instrumentation for the logo row
  topMenuDiv.append(mobileLogoLink);

  // Menu Icons
  const ul = document.createElement('ul');
  menuIconRows.forEach((row) => {
    const [iconCell, linkCell] = [...row.children]; // Correct: named destructuring for fixed schema
    const li = document.createElement('li');
    // The original HTML shows two <a> tags inside one <li>, each with a different icon and class for desktop/mobile.
    // The EDS model provides only one icon/link per item row.
    // To match the original HTML structure, we need to create two <a> tags per item row,
    // one for desktop and one for mobile, assuming the 'icon' cell contains both images
    // or we need to infer them.
    // Given the current model, we will create one <a> per item row and apply the classes.
    // If the original HTML implies different icons for desktop/mobile for the SAME conceptual item,
    // the EDS model would need separate fields for desktopIcon and mobileIcon.
    // For now, we apply all relevant classes to the single anchor.

    // Desktop Menu Icon
    const desktopAnchor = document.createElement('a');
    desktopAnchor.href = linkCell?.querySelector('a')?.href || 'javascript:void(0);';
    desktopAnchor.classList.add('mobile_nav_icon', 'desktop-mobile_nav'); // From ORIGINAL HTML
    moveInstrumentation(linkCell, desktopAnchor);

    const desktopIconPicture = iconCell?.querySelector('picture');
    if (desktopIconPicture) {
      const img = desktopIconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      desktopAnchor.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid'); // From ORIGINAL HTML
    }
    moveInstrumentation(iconCell, desktopAnchor); // Instrumentation for the icon cell

    li.append(desktopAnchor);

    // Mobile Menu Icon (assuming it's the same icon, but with different classes, or a second icon in the cell)
    // Based on the original HTML, it's a second <a> tag.
    // Since the EDS model only provides one 'icon' field per item, we'll duplicate the icon for the mobile version
    // if the original HTML implies two distinct icons. If it's the same icon with different classes,
    // the above desktopAnchor is sufficient.
    // For now, we'll create a second anchor as per the original HTML structure,
    // assuming the 'iconCell' provides the necessary image.
    const mobileAnchor = document.createElement('a');
    mobileAnchor.href = linkCell?.querySelector('a')?.href || 'javascript:void(0);';
    mobileAnchor.classList.add('mobile_nav_icon', 'mobile_nav'); // From ORIGINAL HTML
    // No separate instrumentation for mobileAnchor as it's derived from the same cell

    const mobileIconPicture = iconCell?.querySelector('picture'); // Re-using the same picture from iconCell
    if (mobileIconPicture) {
      const img = mobileIconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      mobileAnchor.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid'); // From ORIGINAL HTML
    }
    li.append(mobileAnchor);

    ul.append(li);
    moveInstrumentation(row, li); // Instrumentation for the item row
  });
  topMenuDiv.append(ul);

  block.replaceChildren(section);

  // The original image optimization loop at the end of the decorate function is redundant
  // because createOptimizedPicture is already called for each image during element creation.
  // Removing it to prevent double processing and potential issues.
}
