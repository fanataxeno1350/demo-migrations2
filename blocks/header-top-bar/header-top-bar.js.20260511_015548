import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...menuIconRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('bg_top');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  section.append(containerDiv);

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  containerDiv.append(rowDiv);

  const colDiv = document.createElement('div');
  colDiv.classList.add('col-md-12');
  rowDiv.append(colDiv);

  const topMenuDiv = document.createElement('div');
  topMenuDiv.classList.add('top_menu');
  colDiv.append(topMenuDiv);

  // Logo and Logo Link
  if (logoRow && logoLinkRow) {
    const logoPicture = logoRow.querySelector('picture');
    const logoLink = logoLinkRow.querySelector('a');

    if (logoPicture && logoLink) {
      const mobileLogoAnchor = document.createElement('a');
      mobileLogoAnchor.classList.add('mobile-logo', 'mr-auto');
      mobileLogoAnchor.href = logoLink.href;
      moveInstrumentation(logoLinkRow, mobileLogoAnchor); // Move instrumentation from logoLinkRow

      const logoImg = logoPicture.querySelector('img');
      if (logoImg) {
        const optimizedLogoPicture = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
        // Instrumentation should be moved from the original picture element, not the new img
        moveInstrumentation(logoRow.children[0], optimizedLogoPicture);
        optimizedLogoPicture.querySelector('img').classList.add('img-fluid');
        mobileLogoAnchor.append(optimizedLogoPicture);
      }
      topMenuDiv.append(mobileLogoAnchor);
    }
  }

  // Menu Icons
  if (menuIconRows.length > 0) {
    const ul = document.createElement('ul');
    menuIconRows.forEach((row) => {
      // Fixed: Use destructuring for fixed-schema item rows
      const [iconCell, linkCell] = [...row.children];
      const iconPicture = iconCell?.querySelector('picture');
      const iconLink = linkCell?.querySelector('a');

      if (iconPicture && iconLink) {
        const li = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = iconLink.href;
        anchor.classList.add('mobile_nav_icon'); // Base class from original HTML

        const img = iconPicture.querySelector('img');
        if (img) {
          // Fixed: Logic for adding desktop-mobile_nav and mobile_nav classes
          // Based on original HTML, both desktop and mobile icons are present for the menu toggle.
          // The original HTML shows two <a> tags for the menu icon, one with desktop-mobile_nav
          // and one with mobile_nav. The current JS creates only one <a>.
          // For now, we'll add both classes if the alt text indicates a menu icon.
          // A more robust solution might involve creating two <a> elements if the model supports it.
          if (img.alt.toLowerCase().includes('menu')) {
            anchor.classList.add('desktop-mobile_nav', 'mobile_nav');
          } else {
            // Default for other icons if they were to exist
            anchor.classList.add('desktop-mobile_nav');
          }

          const optimizedIconPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(iconCell, optimizedIconPicture); // Move instrumentation from the cell
          optimizedIconPicture.querySelector('img').classList.add('img-fluid');
          anchor.append(optimizedIconPicture);
        }
        moveInstrumentation(row, li);
        li.append(anchor);
        ul.append(li);
      }
    });
    topMenuDiv.append(ul);
  }

  block.replaceChildren(section);
}
