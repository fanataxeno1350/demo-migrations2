import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageRow, descriptionRow, signInLinkRow, signInLabelRow, registerLinkRow, registerLabelRow, ctaSeparatorRow] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('home-page-description', 'grid-container', 'padding', 'animate-enter', 'in-view');
  section.setAttribute('aria-label', 'Home Page Description Module');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');

  const cell = document.createElement('div');
  cell.classList.add('cell', 'large-offset-1', 'large-10', 'xlarge-offset-2', 'xlarge-8', 'text-center', 'wrapper');

  // Image
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container', 'animate-enter-fade-up-short', 'animate-delay-3');
  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageContainer.append(optimizedPic);
    }
  }
  moveInstrumentation(imageRow, imageContainer);
  cell.append(imageContainer);

  // Description
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('description1', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
  if (descriptionRow) {
    const [descriptionCell] = [...descriptionRow.children]; // Fixed: Destructuring for description cell
    descriptionDiv.innerHTML = descriptionCell?.innerHTML || '';
  }
  moveInstrumentation(descriptionRow, descriptionDiv);
  cell.append(descriptionDiv);

  // CTA Container
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('cta-container');

  // Sign In Link
  const signInAnchor = document.createElement('a');
  signInAnchor.classList.add('link', 'small', 'black', 'sign-in', 'animate-enter-fade-up-short', 'animate-delay-9');
  signInAnchor.setAttribute('aria-label', 'Sign in');
  signInAnchor.setAttribute('rel', 'follow');
  const signInLink = signInLinkRow.querySelector('a');
  if (signInLink) {
    signInAnchor.href = signInLink.href;
  }
  const signInSpan = document.createElement('span');
  signInSpan.classList.add('button-text');
  if (signInLabelRow) {
    const [signInLabelCell] = [...signInLabelRow.children]; // Fixed: Destructuring for signInLabel cell
    signInSpan.textContent = signInLabelCell.textContent.trim();
  }
  signInAnchor.append(signInSpan);
  moveInstrumentation(signInLinkRow, signInAnchor);
  moveInstrumentation(signInLabelRow, signInSpan);
  ctaContainer.append(signInAnchor);

  // Separator
  const separatorSpan = document.createElement('span');
  separatorSpan.classList.add('labelSmallBold', 'separator', 'animate-enter-fade-up-short', 'animate-delay-9');
  if (ctaSeparatorRow) {
    const [ctaSeparatorCell] = [...ctaSeparatorRow.children]; // Fixed: Destructuring for ctaSeparator cell
    separatorSpan.textContent = ctaSeparatorCell.textContent.trim();
  }
  moveInstrumentation(ctaSeparatorRow, separatorSpan);
  ctaContainer.append(separatorSpan);

  // Register Link
  const registerAnchor = document.createElement('a');
  registerAnchor.classList.add('link', 'small', 'black', 'register', 'animate-enter-fade-up-short', 'animate-delay-9');
  registerAnchor.setAttribute('aria-label', 'Register');
  registerAnchor.setAttribute('rel', 'follow');
  const registerLink = registerLinkRow.querySelector('a');
  if (registerLink) {
    registerAnchor.href = registerLink.href;
  }
  const registerSpan = document.createElement('span');
  registerSpan.classList.add('button-text');
  if (registerLabelRow) {
    const [registerLabelCell] = [...registerLabelRow.children]; // Fixed: Destructuring for registerLabel cell
    registerSpan.textContent = registerLabelCell.textContent.trim();
  }
  registerAnchor.append(registerSpan);
  moveInstrumentation(registerLinkRow, registerAnchor);
  moveInstrumentation(registerLabelRow, registerSpan);
  ctaContainer.append(registerAnchor);

  cell.append(ctaContainer);

  const productCardWtb = document.createElement('div');
  productCardWtb.classList.add('product-card__wtb');
  cell.append(productCardWtb);

  gridX.append(cell);
  section.append(gridX);

  block.replaceChildren(section);
}
