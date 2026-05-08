import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, loginLinkRow, loginLabelRow] = [...block.children];

  const header = document.createElement('header');
  header.classList.add(
    'boing-container',
    'header',
    'd-flex',
    'justify-content-between',
    'align-items-center',
    'h-15',
    'px-5',
    'py-2',
    'fixed-top',
    'w-100',
    'bg-white',
  );
  moveInstrumentation(block, header);

  // Left section (menu icon)
  const leftSection = document.createElement('div');
  leftSection.classList.add('d-flex', 'w-25');
  // TODO: Replace hardcoded SVG path with a dynamic value from a block field if available.
  // For now, keeping it hardcoded as it's an icon, but ideally it should be configurable.
  leftSection.innerHTML = `
    <svg class="header__menu-icon text-boing-primary analytics_cta_click">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/letsboing-com/image/sprite-boing-fabbe8.svg#menu"></use>
    </svg>
  `;
  header.append(leftSection);

  // Middle section (logo)
  const middleSection = document.createElement('div');
  middleSection.classList.add('d-flex', 'justify-content-center', 'w-25');

  const logoLink = document.createElement('a');
  logoLink.classList.add('analytics_cta_click');
  logoLink.setAttribute('data-ct', '');
  logoLink.setAttribute('a-label', 'header-logo-boing');
  if (logoLinkRow) {
    logoLink.href = logoLinkRow.querySelector('a')?.href || '/';
    moveInstrumentation(logoLinkRow, logoLink); // Move instrumentation for logoLinkRow
  } else {
    logoLink.href = '/';
  }

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header__logo', 'd-flex', 'align-items-center');

  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('header__logo-img');
        moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
        logoDiv.append(optimizedPic);
      }
    }
  }
  logoLink.append(logoDiv);
  middleSection.append(logoLink);
  header.append(middleSection);

  // Right section (login button)
  const rightSection = document.createElement('div');
  rightSection.classList.add('d-flex', 'w-25', 'justify-content-end');

  if (loginLinkRow || loginLabelRow) {
    const loginLinkWrapper = document.createElement('a');
    loginLinkWrapper.classList.add('header__login-btn-wrapper', 'analytics_cta_click');
    loginLinkWrapper.style.display = 'inline'; // Match original HTML style

    if (loginLinkRow) {
      loginLinkWrapper.href = loginLinkRow.querySelector('a')?.href || '#';
      moveInstrumentation(loginLinkRow, loginLinkWrapper); // Move instrumentation for loginLinkRow
    } else {
      loginLinkWrapper.href = '#';
    }

    const loginButton = document.createElement('button');
    loginButton.classList.add(
      'header__login-btn',
      'btn',
      'text-boing-primary',
      'bg-transparent',
      'fw-semibold',
      'rounded-4',
      'btn-sm',
      'py-3',
      'px-4',
    );
    if (loginLabelRow) {
      loginButton.textContent = loginLabelRow.textContent.trim();
      moveInstrumentation(loginLabelRow, loginButton);
    } else {
      loginButton.textContent = 'Login';
    }

    loginLinkWrapper.append(loginButton);
    rightSection.append(loginLinkWrapper);
  }

  header.append(rightSection);

  block.replaceChildren(header);
}
