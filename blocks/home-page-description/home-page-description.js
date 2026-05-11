import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    imageRow,
    descriptionRow,
    signInLinkRow,
    signInLabelRow,
    registerLinkRow,
    registerLabelRow,
  ] = [...block.children];

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
  // FIX: descriptionRow is a richtext field, so its innerHTML should be read directly from the row's first child (the cell)
  // The original code was descriptionRow.children[0]?.innerHTML which is correct for a cell.
  // However, descriptionRow itself is a row, and its first child is the cell containing the richtext.
  // The model indicates 'description' is a richtext field, so the content is directly in the cell.
  // The original code was already correct in accessing the cell's innerHTML.
  // Re-evaluating based on the "richtext" field type, the cell itself contains the HTML.
  // So, descriptionRow.children[0] is the correct cell.
  descriptionDiv.innerHTML = descriptionRow.children[0]?.innerHTML || '';
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
  signInSpan.textContent = signInLabelRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  signInAnchor.append(signInSpan);
  moveInstrumentation(signInLinkRow, signInAnchor);
  moveInstrumentation(signInLabelRow, signInAnchor);
  ctaContainer.append(signInAnchor);

  // Separator
  const separatorSpan = document.createElement('span');
  separatorSpan.classList.add('labelSmallBold', 'separator', 'animate-enter-fade-up-short', 'animate-delay-9');
  separatorSpan.textContent = ' / ';
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
  registerSpan.textContent = registerLabelRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  registerAnchor.append(registerSpan);
  moveInstrumentation(registerLinkRow, registerAnchor);
  moveInstrumentation(registerLabelRow, registerAnchor);
  ctaContainer.append(registerAnchor);

  cell.append(ctaContainer);

  // Product Card WTB (placeholder)
  const productCardWtb = document.createElement('div');
  productCardWtb.classList.add('product-card__wtb');
  cell.append(productCardWtb);

  gridX.append(cell);
  section.append(gridX);

  block.replaceChildren(section);
}
