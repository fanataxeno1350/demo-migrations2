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
  section.classList.add(
    'home-page-description',
    'grid-container',
    'padding',
    'animate-enter',
    'in-view',
  );
  section.setAttribute('aria-label', 'Home Page Description Module');
  moveInstrumentation(block, section); // Move instrumentation from the block itself to the new root

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'max-width-container');
  section.append(gridX);

  const cell = document.createElement('div');
  cell.classList.add(
    'cell',
    'large-offset-1',
    'large-10',
    'xlarge-offset-2',
    'xlarge-8',
    'text-center',
    'wrapper',
  );
  gridX.append(cell);

  // Image
  if (imageRow) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add(
      'image-container',
      'animate-enter-fade-up-short',
      'animate-delay-3',
    );
    const picture = imageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { width: '750' },
        ]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageContainer.append(optimizedPic);
      }
    }
    moveInstrumentation(imageRow, imageContainer);
    cell.append(imageContainer);
  }

  // Description
  if (descriptionRow) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add(
      'description1',
      'bodyMediumRegular',
      'animate-enter-fade-up-short',
      'animate-delay-5',
    );
    moveInstrumentation(descriptionRow, descriptionDiv);
    // description is richtext, so use innerHTML from the cell itself
    descriptionDiv.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    cell.append(descriptionDiv);
  }

  // CTA Container
  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('cta-container');
  cell.append(ctaContainer);

  // Sign In Link
  if (signInLinkRow && signInLabelRow) {
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

    const foundSignInLink = signInLinkRow.querySelector('a');
    if (foundSignInLink) {
      signInLink.href = foundSignInLink.href;
    }
    moveInstrumentation(signInLinkRow, signInLink); // Move instrumentation for the link row

    const signInSpan = document.createElement('span');
    signInSpan.classList.add('button-text');
    // signInLabel is type=text, so use textContent.trim() from the cell
    signInSpan.textContent = signInLabelRow.children[0]?.textContent.trim() || '';
    signInLink.append(signInSpan);
    moveInstrumentation(signInLabelRow, signInSpan); // Move instrumentation for the label row
    ctaContainer.append(signInLink);
  }

  // Separator
  const separator = document.createElement('span');
  separator.classList.add(
    'labelSmallBold',
    'separator',
    'animate-enter-fade-up-short',
    'animate-delay-9',
  );
  separator.textContent = ' / ';
  ctaContainer.append(separator);

  // Register Link
  if (registerLinkRow && registerLabelRow) {
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

    const foundRegisterLink = registerLinkRow.querySelector('a');
    if (foundRegisterLink) {
      registerLink.href = foundRegisterLink.href;
    }
    moveInstrumentation(registerLinkRow, registerLink); // Move instrumentation for the link row

    const registerSpan = document.createElement('span');
    registerSpan.classList.add('button-text');
    // registerLabel is type=text, so use textContent.trim() from the cell
    registerSpan.textContent = registerLabelRow.children[0]?.textContent.trim() || '';
    registerLink.append(registerSpan);
    moveInstrumentation(registerLabelRow, registerSpan); // Move instrumentation for the label row
    ctaContainer.append(registerLink);
  }

  // Product Card WTB (empty div from original HTML)
  const productCardWtb = document.createElement('div');
  productCardWtb.classList.add('product-card__wtb');
  cell.append(productCardWtb);

  block.replaceChildren(section);
}
