import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The outer block div already has the 'header-nav' class from AEM.
  // Do NOT add it to any inner wrapper element.

  const children = [...block.children];

  // Destructure fixed fields: logo, logoLink, siteTitle, and the container placeholder
  // The navigationMenuContainerRow is a placeholder row for the container field,
  // it doesn't contain content itself but its instrumentation needs to be moved.
  const [logoRow, logoLinkRow, siteTitleRow, navigationMenuContainerRow, ...navigationItemRows] = children;

  const header = document.createElement('header');
  const nav = document.createElement('nav');
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'd-flex', 'align-items-center', 'justify-content-between');

  // Logo and Site Title
  const logoWrapper = document.createElement('div');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo', 'd-flex', 'align-items-center', 'gap-2');

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }

  const siteTitle = document.createElement('h4');
  if (siteTitleRow) {
    moveInstrumentation(siteTitleRow, siteTitle); // Move instrumentation for siteTitleRow
    siteTitle.textContent = siteTitleRow.textContent.trim();
  }
  logoLink.append(siteTitle);

  const foundLogoLink = logoLinkRow?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  } else {
    logoLink.href = '/'; // Default to home if no link is provided
  }

  moveInstrumentation(logoRow, logoLink); // Move instrumentation from logoRow to logoLink
  moveInstrumentation(logoLinkRow, logoLink); // Move instrumentation from logoLinkRow to logoLink

  logoWrapper.append(logoLink);
  containerDiv.append(logoWrapper);

  // Navigation Menu
  const navList = document.createElement('div');
  navList.classList.add('nav-list');

  // Move instrumentation from the container placeholder row to the navList element
  if (navigationMenuContainerRow) {
    moveInstrumentation(navigationMenuContainerRow, navList);
  }

  navigationItemRows.forEach((row) => {
    // For fixed-schema item rows, use destructuring for cells
    const [labelCell, linkCell] = [...row.children];
    const navItem = document.createElement('a');
    navItem.classList.add('navitems');

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      navItem.href = foundLink.href;
    } else {
      navItem.href = '#'; // Default to a placeholder if no link is provided
    }

    if (labelCell) {
      navItem.textContent = labelCell.textContent.trim();
    }

    moveInstrumentation(row, navItem);
    navList.append(navItem);
  });

  containerDiv.append(navList);

  // Navbar Toggler
  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler');
  toggler.type = 'button';
  toggler.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"></path>
    </svg>
  `;

  toggler.addEventListener('click', () => {
    navList.classList.toggle('show'); // Toggle a 'show' class for the nav-list
    toggler.classList.toggle('collapsed'); // Toggle a 'collapsed' class for the toggler
  });

  containerDiv.append(toggler);
  nav.append(containerDiv);
  header.append(nav);

  block.replaceChildren(header);
}
