import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const header = document.createElement('header');
  const nav = document.createElement('nav');
  const container = document.createElement('div');
  container.classList.add('container', 'd-flex', 'align-items-center', 'justify-content-between');

  // Logo Section
  const logoWrapper = document.createElement('div');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'd-flex', 'align-items-center', 'gap-2');

  const [logoRow, logoLinkRow, logoLabelRow, ...navigationItemRows] = children;

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be called on the original element, not the new img inside optimizedPic
      moveInstrumentation(logoPicture, optimizedPic);
      logoLink.append(optimizedPic);
    }
  }

  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  } else {
    logoLink.href = '/'; // Fallback to home if no link is provided
  }

  const logoLabel = document.createElement('h4');
  logoLabel.textContent = logoLabelRow.textContent.trim();
  logoLink.append(logoLabel);

  // moveInstrumentation for the logo elements
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  moveInstrumentation(logoLabelRow, logoLabel); // Instrument the label itself, not the link again

  logoWrapper.append(logoLink);
  container.append(logoWrapper);

  // Navigation List
  const navList = document.createElement('div');
  navList.classList.add('nav-list');

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const navItem = document.createElement('a');
    navItem.classList.add('navitems');

    const linkAnchor = linkCell.querySelector('a');
    if (linkAnchor) {
      navItem.href = linkAnchor.href;
    }

    navItem.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, navItem);
    navList.append(navItem);
  });
  container.append(navList);

  // Navbar Toggler
  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler');
  toggler.type = 'button';
  toggler.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
    </svg>
  `;

  // Toggle functionality for mobile navigation
  toggler.addEventListener('click', () => {
    navList.classList.toggle('show'); // Assuming 'show' class will reveal the nav-list
  });

  container.append(toggler);

  nav.append(container);
  header.append(nav);

  block.replaceChildren(header);
}
