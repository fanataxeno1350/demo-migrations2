import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // block.children[0]: logoImageRow
  // block.children[1]: logoLinkRow
  // block.children[2...N]: menuIconRows
  const [logoImageRow, logoLinkRow, ...menuIconRows] = [...block.children];

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

  // Logo Link and Image
  const logoLink = document.createElement('a');
  logoLink.classList.add('mobile-logo', 'mr-auto');
  moveInstrumentation(logoLinkRow, logoLink);
  // logoLinkRow is a row, its content is in its first child (cell)
  const logoLinkCell = logoLinkRow.children[0];
  logoLink.href = logoLinkCell?.querySelector('a')?.href || '#';

  const logoImageCell = logoImageRow.children[0];
  const logoPicture = logoImageCell?.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
    // moveInstrumentation should target the element that contains the original row's content
    moveInstrumentation(logoImageRow, optimizedLogoPic.querySelector('img'));
    logoLink.append(optimizedLogoPic);
    optimizedLogoPic.querySelector('img').classList.add('img-fluid');
  }
  topMenu.append(logoLink);

  // Menu Icons
  const ul = document.createElement('ul');
  menuIconRows.forEach((menuIconRow) => {
    // Each menuIconRow has a fixed schema: [iconImageCell, iconLinkCell]
    const [iconImageCell, iconLinkCell] = [...menuIconRow.children];

    const li = document.createElement('li');
    moveInstrumentation(menuIconRow, li);

    const iconLink = document.createElement('a');
    moveInstrumentation(iconLinkCell, iconLink); // Move instrumentation for the link cell
    const originalLink = iconLinkCell.querySelector('a');
    if (originalLink) {
      iconLink.href = originalLink.href;
    } else {
      iconLink.href = '#';
    }

    const iconPicture = iconImageCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      iconLink.append(optimizedIconPic);
      optimizedIconPic.querySelector('img').classList.add('img-fluid');

      // Apply specific classes based on the alt text or content if needed,
      // for now, assuming the original HTML only shows one type of icon.
      // If there were different icon types, we'd need a way to distinguish them.
      if (iconImg.alt === 'Menu') {
        // Original HTML has two links for 'Menu' icon, one for desktop-mobile_nav and one for mobile_nav
        // The current block structure only provides one iconImage and one iconLink per row.
        // To replicate the original HTML, we would need two iconImage/iconLink pairs or
        // a way to specify the classes for the single link.
        // For now, applying the classes from the first 'Menu' link in original HTML.
        iconLink.classList.add('mobile_nav_icon', 'desktop-mobile_nav');
        // If there was a second link in the original HTML for mobile_nav, it would need to be created here
        // based on additional data from the block structure.
      }
    }
    li.append(iconLink);
    ul.append(li);
  });
  topMenu.append(ul);

  block.replaceChildren(section);

  // The block.querySelectorAll('picture > img') loop is redundant as createOptimizedPicture
  // is already called for each image and replaces the original picture.
  // This loop would re-optimize images that are already optimized.
  // It is removed.
}
