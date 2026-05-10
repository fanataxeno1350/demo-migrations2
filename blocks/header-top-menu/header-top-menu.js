import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

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

  // Logo Image and Link
  const [logoImageRow, logoLinkRow, ...menuIconRows] = children;

  const logoLink = document.createElement('a');
  logoLink.classList.add('mobile-logo', 'mr-auto');
  logoLink.id = 'ctl00_moblog';

  const logoHref = logoLinkRow.querySelector('a')?.href;
  if (logoHref) {
    logoLink.href = logoHref;
  }

  const logoPicture = logoImageRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(logoImg, optimizedLogoPic.querySelector('img'));
      logoLink.append(optimizedLogoPic);
      optimizedLogoPic.querySelector('img').classList.add('img-fluid');
      optimizedLogoPic.querySelector('img').id = 'ctl00_imglogomob';
    }
  }
  moveInstrumentation(logoImageRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  topMenu.append(logoLink);

  // Menu Icons
  const ul = document.createElement('ul');
  menuIconRows.forEach((rowEl) => {
    const [iconImageCell, iconLinkCell] = [...rowEl.children];
    const li = document.createElement('li');
    const iconAnchor = document.createElement('a');
    
    // Original HTML has specific classes for menu icons, assuming these are authored
    // in the AEM content or derived from the icon image alt text.
    // For now, applying generic mobile_nav_icon, if specific classes are needed,
    // they should be authored in the content or derived from a dedicated field.
    iconAnchor.classList.add('mobile_nav_icon'); // Base class from original HTML

    const iconHref = iconLinkCell.querySelector('a')?.href;
    if (iconHref) {
      iconAnchor.href = iconHref;
    }

    const iconPicture = iconImageCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      if (iconImg) {
        const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(iconImg, optimizedIconPic.querySelector('img'));
        iconAnchor.append(optimizedIconPic);
        optimizedIconPic.querySelector('img').classList.add('img-fluid');
      }
    }
    moveInstrumentation(rowEl, li); // Move instrumentation for the whole row to the li
    li.append(iconAnchor);
    ul.append(li);

    // The original HTML shows two menu icons with different classes:
    // <a class="mobile_nav_icon desktop-mobile_nav">
    // <a class="mobile_nav_icon mobile_nav">
    // This logic needs to be driven by content, not heuristics.
    // For now, we'll add both classes to each icon, assuming the CSS handles visibility.
    // If specific icons need specific classes, they should be authored in AEM.
    // The previous heuristic based on 'alt' text is fragile and removed.
    iconAnchor.classList.add('desktop-mobile_nav', 'mobile_nav');
  });

  topMenu.append(ul);

  block.replaceChildren(section);
}
