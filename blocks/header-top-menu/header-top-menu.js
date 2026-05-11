import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, ...menuIconRows] = children;

  const section = document.createElement('section');
  section.classList.add('bg_top');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  const col = document.createElement('div');
  col.classList.add('col-md-12');
  row.append(col);

  const topMenu = document.createElement('div');
  topMenu.classList.add('top_menu');
  col.append(topMenu);

  // Logo and Logo Link
  const logoLink = document.createElement('a');
  logoLink.classList.add('mobile-logo', 'mr-auto');
  if (logoLinkRow) {
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) logoLink.href = foundLink.href;
    moveInstrumentation(logoLinkRow, logoLink);
  }

  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Use the img.src from the authored content, not a hardcoded path
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
  }
  topMenu.append(logoLink);

  // Menu Icons
  const ul = document.createElement('ul');
  menuIconRows.forEach((menuIconRow, index) => {
    const [iconCell, linkCell] = [...menuIconRow.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Use the img.src from the authored content, not a hardcoded path
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        moveInstrumentation(iconCell, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }

    // Apply specific classes based on original HTML patterns
    // The original HTML shows two mobile_nav_icon links within the last <li>
    if (index === menuIconRows.length - 1) {
      // First anchor (desktop-mobile_nav)
      anchor.classList.add('mobile_nav_icon', 'desktop-mobile_nav');
      li.append(anchor); // Append the first anchor

      // Create and append the second anchor (mobile_nav)
      const mobileNavAnchor = document.createElement('a');
      mobileNavAnchor.href = anchor.href; // Same link as the first
      mobileNavAnchor.classList.add('mobile_nav_icon', 'mobile_nav');

      // Re-create the picture for the second icon, assuming it's the same image or a different one
      // For now, we'll assume it's the same image as the last iconCell
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPicMobile = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPicMobile.querySelector('img').classList.add('img-fluid');
          // No separate instrumentation for this cloned image, as it's part of the same logical row
          mobileNavAnchor.append(optimizedPicMobile);
        }
      }
      li.append(mobileNavAnchor); // Append the second anchor
    } else {
      li.append(anchor);
    }

    moveInstrumentation(menuIconRow, li); // Instrument the li, as it's the direct child of ul
    ul.append(li);
  });
  topMenu.append(ul);

  block.replaceChildren(section);
}
