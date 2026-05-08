import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    mainImageRow,
    descriptionRow,
    signInLinkRow,
    signInLabelRow,
    registerLinkRow,
    registerLabelRow,
  ] = [...block.children];

  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid-x', 'max-width-container');

  const cellWrapper = document.createElement('div');
  cellWrapper.classList.add(
    'cell',
    'large-offset-1',
    'large-10',
    'xlarge-offset-2',
    'xlarge-8',
    'text-center',
    'wrapper',
  );

  // Main Image
  const imageContainer = document.createElement('div');
  imageContainer.classList.add(
    'image-container',
    'animate-enter-fade-up-short',
    'animate-delay-3',
  );
  const mainImagePicture = mainImageRow.querySelector('picture');
  if (mainImagePicture) {
    const img = mainImagePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    imageContainer.append(optimizedPic);
    moveInstrumentation(mainImageRow, imageContainer);
  }
  cellWrapper.append(imageContainer);

  // Description
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add(
    'description1',
    'bodyMediumRegular',
    'animate-enter-fade-up-short',
    'animate-delay-5',
  );
  // Description is richtext, read innerHTML directly from the cell
  if (descriptionRow.children[0]) {
    descriptionDiv.innerHTML = descriptionRow.children[0].innerHTML;
    moveInstrumentation(descriptionRow, descriptionDiv);
  }
  cellWrapper.append(descriptionDiv);

  // CTA Container
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('cta-container');

  // Sign In Link
  const signInLink = document.createElement('a');
  signInLink.classList.add(
    'link',
    'small',
    'black',
    'sign-in',
    'animate-enter-fade-up-short',
    'animate-delay-9',
  );
  // signInLink is aem-content, read href from the anchor
  const signInAnchor = signInLinkRow.children[0]?.querySelector('a');
  if (signInAnchor) {
    signInLink.href = signInAnchor.href;
  }
  const signInLabelSpan = document.createElement('span');
  signInLabelSpan.classList.add('button-text');
  // signInLabel is text, read textContent from the cell
  if (signInLabelRow.children[0]) {
    signInLabelSpan.textContent = signInLabelRow.children[0].textContent.trim();
    moveInstrumentation(signInLabelRow, signInLabelSpan);
  }
  signInLink.append(signInLabelSpan);
  moveInstrumentation(signInLinkRow, signInLink);
  ctaContainer.append(signInLink);

  // Separator
  const separatorSpan = document.createElement('span');
  separatorSpan.classList.add(
    'labelSmallBold',
    'separator',
    'animate-enter-fade-up-short',
    'animate-delay-9',
  );
  separatorSpan.textContent = ' / ';
  ctaContainer.append(separatorSpan);

  // Register Link
  const registerLink = document.createElement('a');
  registerLink.classList.add(
    'link',
    'small',
    'black',
    'register',
    'animate-enter-fade-up-short',
    'animate-delay-9',
  );
  // registerLink is aem-content, read href from the anchor
  const registerAnchor = registerLinkRow.children[0]?.querySelector('a');
  if (registerAnchor) {
    registerLink.href = registerAnchor.href;
  }
  const registerLabelSpan = document.createElement('span');
  registerLabelSpan.classList.add('button-text');
  // registerLabel is text, read textContent from the cell
  if (registerLabelRow.children[0]) {
    registerLabelSpan.textContent = registerLabelRow.children[0].textContent.trim();
    moveInstrumentation(registerLabelRow, registerLabelSpan);
  }
  registerLink.append(registerLabelSpan);
  moveInstrumentation(registerLinkRow, registerLink);
  ctaContainer.append(registerLink);

  cellWrapper.append(ctaContainer);

  gridContainer.append(cellWrapper);

  const section = document.createElement('section');
  // Removed 'home-page-description' class as the outer block div already has it.
  section.classList.add('grid-container', 'padding', 'animate-enter', 'in-view');
  section.setAttribute('aria-label', 'Home Page Description Module');
  section.append(gridContainer);

  block.replaceChildren(section);
}
