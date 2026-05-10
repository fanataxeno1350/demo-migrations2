import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('bg_top'); // From ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // From ORIGINAL HTML

  const row = document.createElement('div');
  row.classList.add('row'); // From ORIGINAL HTML

  const col = document.createElement('div');
  col.classList.add('col-md-12'); // From ORIGINAL HTML

  const topMenu = document.createElement('div');
  topMenu.classList.add('top_menu'); // From ORIGINAL HTML

  // Logo and Logo Link
  // BlockJson model: logo (reference), logoLink (aem-content), menuIcons (container)
  // So the first two rows are for logo and logoLink, the rest are menuIconRows
  const [logoRow, logoLinkRow, ...menuIconRows] = children;

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  logoLink.id = 'ctl00_moblog'; // From ORIGINAL HTML
  logoLink.classList.add('mobile-logo', 'mr-auto'); // From ORIGINAL HTML

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoLinkRow, logoLink);
  moveInstrumentation(logoRow, logoLink);
  topMenu.append(logoLink);

  // Menu Icons
  const ul = document.createElement('ul');
  menuIconRows.forEach((rowEl) => {
    // BlockJson model for menu-icon-item: icon (reference), link (aem-content)
    const [iconCell, linkCell] = [...rowEl.children]; // CORRECT: index destructuring for fixed schema

    const li = document.createElement('li');

    // Handle the first link (desktop version of the mobile menu icon, or other icons)
    const link1 = document.createElement('a');
    const foundLink1 = linkCell.querySelector('a');
    if (foundLink1) {
      link1.href = foundLink1.href;
    }

    const iconPicture1 = iconCell.querySelector('picture');
    if (iconPicture1) {
      const img = iconPicture1.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      link1.append(optimizedPic);
    }

    // Based on ORIGINAL HTML, the last menuIconRow is for the mobile menu icon,
    // which has two <a> tags inside one <li>.
    // The first <a> has classes 'mobile_nav_icon desktop-mobile_nav'
    // The second <a> has classes 'mobile_nav_icon mobile_nav'
    // Both use the same icon and link from the cell.
    if (rowEl === menuIconRows[menuIconRows.length - 1]) {
      link1.classList.add('mobile_nav_icon', 'desktop-mobile_nav'); // From ORIGINAL HTML
      li.append(link1);

      // Create the second link for the mobile version
      const link2 = document.createElement('a');
      if (foundLink1) { // Use the same href as the first link
        link2.href = foundLink1.href;
      }
      link2.classList.add('mobile_nav_icon', 'mobile_nav'); // From ORIGINAL HTML

      if (iconPicture1) { // Use the same icon as the first link
        const img = iconPicture1.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // No need to moveInstrumentation again for the same img, it's already moved to link1's pic
        link2.append(optimizedPic.cloneNode(true)); // Clone the optimized picture for the second link
      }
      li.append(link2);
    } else {
      // For other icons (if any, e.g., search icon from commented HTML), just append the single link
      // The original HTML only shows the mobile menu icon, so this else block might not be hit
      // if only one menuIconRow exists. If other icons are added to the model, their classes
      // would need to be determined from their original HTML.
      li.append(link1);
    }

    moveInstrumentation(rowEl, li);
    ul.append(li);
  });
  topMenu.append(ul);

  col.append(topMenu);
  row.append(col);
  container.append(row);
  section.append(container);

  block.replaceChildren(section);
}
