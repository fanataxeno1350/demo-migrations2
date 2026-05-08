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

  // Menu Icon (hardcoded SVG as per original HTML)
  const menuWrapper = document.createElement('div');
  menuWrapper.classList.add('d-flex', 'w-25');
  const menuIcon = document.createElement('svg');
  menuIcon.classList.add('header__menu-icon', 'text-boing-primary', 'analytics_cta_click');
  // TODO: Replace hardcoded SVG path with a configurable value from a model field if available.
  // For now, leaving as a placeholder since the original HTML uses a sprite.
  menuIcon.innerHTML = `<use xlink:href="/content/dam/aemigrate/uploaded-folder/letsboing-com/image/sprite-boing-fabbe8.svg#menu"></use>`;
  menuWrapper.append(menuIcon);
  header.append(menuWrapper);

  // Add event listener for the menu icon (interactivity check)
  menuIcon.addEventListener('click', () => {
    // Implement menu toggle logic here, e.g.,
    // document.body.classList.toggle('menu-open');
    // console.log('Menu icon clicked!');
  });

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('d-flex', 'justify-content-center', 'w-25');

  const logoLink = document.createElement('a');
  logoLink.classList.add('analytics_cta_click');
  logoLink.setAttribute('data-ct', '');
  logoLink.setAttribute('a-label', 'header-logo-boing');
  // logoLinkRow is a row, its first child is the cell containing the <a> tag
  logoLink.href = logoLinkRow.children[0]?.querySelector('a')?.href || '/'; // Default to '/' if no link

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header__logo', 'd-flex', 'align-items-center');

  // logoRow is a row, its first child is the cell containing the <picture> tag
  const logoPicture = logoRow.children[0]?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('header__logo-img');
    // Move instrumentation from the original image to the new optimized image
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoDiv.append(optimizedPic);
  } else {
    // Fallback if no logo picture is found
    const fallbackImg = document.createElement('img');
    fallbackImg.src = ''; // No hardcoded path, leave empty or provide a default via CSS
    fallbackImg.alt = 'Logo';
    fallbackImg.classList.add('header__logo-img');
    logoDiv.append(fallbackImg);
  }

  logoLink.append(logoDiv);
  logoWrapper.append(logoLink);
  header.append(logoWrapper);

  // Login Button
  const loginWrapper = document.createElement('div');
  loginWrapper.classList.add('d-flex', 'w-25', 'justify-content-end');

  const loginAnchor = document.createElement('a');
  loginAnchor.classList.add('header__login-btn-wrapper', 'analytics_cta_click');
  loginAnchor.style.display = 'inline'; // From original HTML
  // loginLinkRow is a row, its first child is the cell containing the <a> tag
  loginAnchor.href = loginLinkRow.children[0]?.querySelector('a')?.href || '#'; // Default to '#' if no link

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
  // loginLabelRow is a row, its first child is the cell containing the text
  loginButton.textContent = loginLabelRow.children[0]?.textContent.trim() || 'Login'; // Default label

  // Move instrumentation from the loginLinkRow to the loginAnchor
  moveInstrumentation(loginLinkRow, loginAnchor);
  loginAnchor.append(loginButton);
  loginWrapper.append(loginAnchor);
  header.append(loginWrapper);

  block.replaceChildren(header);
}
