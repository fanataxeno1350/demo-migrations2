import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    imageRow,
    descriptionRow,
    signInLinkRow,
    signInLabelRow,
    separatorRow,
    registerLinkRow,
    registerLabelRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add(
    'home-page-description',
    'grid-container',
    'padding',
    'animate-enter',
    'in-view',
  );
  section.setAttribute('aria-label', 'Home Page Description Module');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');
  section.append(gridX);

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
  gridX.append(cellWrapper);

  // Image
  const imageContainer = document.createElement('div');
  imageContainer.classList.add(
    'image-container',
    'animate-enter-fade-up-short',
    'animate-delay-3',
  );
  if (imageRow) {
    const [imageCell] = [...imageRow.children]; // Destructure for fixed schema
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageContainer.append(optimizedPic);
      }
    }
    moveInstrumentation(imageRow, imageContainer);
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
  if (descriptionRow) {
    const [descriptionCell] = [...descriptionRow.children]; // Destructure for fixed schema
    descriptionDiv.innerHTML = descriptionCell?.innerHTML || ''; // Read innerHTML for richtext
    moveInstrumentation(descriptionRow, descriptionDiv);
  }
  cellWrapper.append(descriptionDiv);

  // CTA Container
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('cta-container');
  cellWrapper.append(ctaContainer);

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
  signInLink.setAttribute('aria-label', 'Sign in');
  signInLink.setAttribute('rel', 'follow');

  if (signInLinkRow) {
    const [signInLinkCell] = [...signInLinkRow.children]; // Destructure for fixed schema
    const foundSignInLink = signInLinkCell?.querySelector('a');
    if (foundSignInLink) {
      signInLink.href = foundSignInLink.href;
    }
    moveInstrumentation(signInLinkRow, signInLink);
  }

  const signInSpan = document.createElement('span');
  signInSpan.classList.add('button-text');
  if (signInLabelRow) {
    const [signInLabelCell] = [...signInLabelRow.children]; // Destructure for fixed schema
    signInSpan.textContent = signInLabelCell?.textContent.trim() || '';
    moveInstrumentation(signInLabelRow, signInSpan); // Move instrumentation for label
  }
  signInLink.append(signInSpan);
  ctaContainer.append(signInLink);

  // Separator
  const separatorSpan = document.createElement('span');
  separatorSpan.classList.add(
    'labelSmallBold',
    'separator',
    'animate-enter-fade-up-short',
    'animate-delay-9',
  );
  if (separatorRow) {
    const [separatorCell] = [...separatorRow.children]; // Destructure for fixed schema
    separatorSpan.textContent = separatorCell?.textContent.trim() || '';
    moveInstrumentation(separatorRow, separatorSpan);
  }
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
  registerLink.setAttribute('aria-label', 'Register');
  registerLink.setAttribute('rel', 'follow');

  if (registerLinkRow) {
    const [registerLinkCell] = [...registerLinkRow.children]; // Destructure for fixed schema
    const foundRegisterLink = registerLinkCell?.querySelector('a');
    if (foundRegisterLink) {
      registerLink.href = foundRegisterLink.href;
    }
    moveInstrumentation(registerLinkRow, registerLink);
  }

  const registerSpan = document.createElement('span');
  registerSpan.classList.add('button-text');
  if (registerLabelRow) {
    const [registerLabelCell] = [...registerLabelRow.children]; // Destructure for fixed schema
    registerSpan.textContent = registerLabelCell?.textContent.trim() || '';
    moveInstrumentation(registerLabelRow, registerSpan); // Move instrumentation for label
  }
  registerLink.append(registerSpan);
  ctaContainer.append(registerLink);

  // Product Card WTB (empty div as per original HTML)
  const productCardWtb = document.createElement('div');
  productCardWtb.classList.add('product-card__wtb');
  cellWrapper.append(productCardWtb);

  block.replaceChildren(section);
}
