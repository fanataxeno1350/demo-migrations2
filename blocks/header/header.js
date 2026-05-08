import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('boing-container', 'header', 'd-flex', 'justify-content-between', 'align-items-center', 'h-15', 'px-5', 'py-2', 'fixed-top', 'w-100', 'bg-white');

  // Menu icon wrapper
  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('d-flex', 'w-25');
  const menuIcon = document.createElement('svg');
  menuIcon.classList.add('header__menu-icon', 'text-boing-primary', 'analytics_cta_click');
  // Replaced hardcoded sprite path with inline SVG as per Rule 25.4
  menuIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>'; // Generic menu icon
  menuWrapper.append(menuIcon);
  headerContainer.append(menuWrapper);

  // Logo and Logo Link
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('d-flex', 'justify-content-center', 'w-25');

  const logoLink = document.createElement('a');
  logoLink.classList.add('analytics_cta_click');
  logoLink.setAttribute('data-ct', '');
  logoLink.setAttribute('a-label', 'header-logo-boing');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header__logo', 'd-flex', 'align-items-center');

  const [logoRow, logoLinkRow, ...loginLinkRows] = children;

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoDiv.append(optimizedPic);
  }

  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  } else {
    logoLink.href = '/'; // Default to root if no link is provided
  }

  moveInstrumentation(logoRow, logoDiv);
  moveInstrumentation(logoLinkRow, logoLink);

  logoLink.append(logoDiv);
  logoWrapper.append(logoLink);
  headerContainer.append(logoWrapper);

  // Login Links
  const loginLinksWrapper = document.createElement('div');
  loginLinksWrapper.classList.add('d-flex', 'w-25', 'justify-content-end');

  loginLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const loginLinkAnchor = document.createElement('a');
    loginLinkAnchor.classList.add('header__login-btn-wrapper', 'analytics_cta_click');
    loginLinkAnchor.style.display = 'inline'; // This style is from original HTML

    const loginButton = document.createElement('button');
    loginButton.classList.add('header__login-btn', 'btn', 'text-boing-primary', 'bg-transparent', 'fw-semibold', 'rounded-4', 'btn-sm', 'py-3', 'px-4');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      loginLinkAnchor.href = foundLink.href;
    }

    if (labelCell) {
      loginButton.textContent = labelCell.textContent.trim();
    }

    loginLinkAnchor.append(loginButton);
    moveInstrumentation(row, loginLinkAnchor);
    loginLinksWrapper.append(loginLinkAnchor);
  });

  headerContainer.append(loginLinksWrapper);

  block.replaceChildren(headerContainer);
}
