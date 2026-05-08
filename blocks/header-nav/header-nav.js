import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLabelRow, logoLinkRow, ...navItemRows] = children;

  const header = document.createElement('header');
  const nav = document.createElement('nav');
  const container = document.createElement('div');
  container.classList.add('container', 'd-flex', 'align-items-center', 'justify-content-between');

  // Logo section
  const logoWrapper = document.createElement('div');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'd-flex', 'align-items-center', 'gap-2');

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img')); // Move instrumentation from original img to new img
      logoLink.append(optimizedPic);
    }
  }

  const logoLabel = document.createElement('h4');
  logoLabel.textContent = logoLabelRow?.textContent.trim() || '';
  logoLink.append(logoLabel);

  const foundLogoLink = logoLinkRow?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    moveInstrumentation(logoLinkRow, logoLink); // Move instrumentation from the logoLinkRow to the new logoLink
  } else {
    logoLink.href = '/'; // Default to home if no link is provided
  }

  moveInstrumentation(logoRow, logoLink); // Move instrumentation from the logoRow to the new logoLink
  moveInstrumentation(logoLabelRow, logoLabel); // Move instrumentation from the logoLabelRow to the new logoLabel

  logoWrapper.append(logoLink);
  container.append(logoWrapper);

  // Navigation list
  const navList = document.createElement('div');
  navList.classList.add('nav-list');

  navItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const navItem = document.createElement('a');
    navItem.classList.add('navitems');
    navItem.textContent = labelCell?.textContent.trim() || '';

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      navItem.href = foundLink.href;
    } else {
      navItem.href = '#'; // Default href
    }
    moveInstrumentation(row, navItem);
    navList.append(navItem);
  });
  container.append(navList);

  // Navbar toggler button
  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler');
  toggler.type = 'button';
  toggler.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
    </svg>
  `;

  toggler.addEventListener('click', () => {
    navList.classList.toggle('show'); // Assuming 'show' class will handle visibility
  });
  container.append(toggler);

  nav.append(container);
  header.append(nav);

  block.replaceChildren(header);
}
