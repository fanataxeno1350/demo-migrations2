import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageRow,
    imageAltRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const section = document.createElement('section');
  // block.classList.add('banner-2') is already on the outer div from AEM.
  // Adding 'banner-section' here would cause double padding/CSS.
  // The original HTML shows 'banner-section' on the <section> element,
  // so we add it here.
  section.classList.add('banner-section');
  moveInstrumentation(block, section);

  const wrapper = document.createElement('div');
  wrapper.classList.add('position-relative', 'boing', 'banner-section__wrapper');

  // Background Image
  const picture = backgroundImageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      // Use imageAltRow.textContent.trim() for alt text
      const optimizedPic = createOptimizedPicture(img.src, imageAltRow.textContent.trim(), true, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'banner-image');
      optimizedImg.setAttribute('fetchpriority', 'high');
      optimizedImg.setAttribute('decoding', 'async');
      moveInstrumentation(backgroundImageRow, optimizedImg);
      wrapper.append(optimizedPic);
    }
  }

  // CTA
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('position-absolute', 'start-50', 'translate-middle-x', 'w-100', 'boing__banner--cta');

  const bannerCta = document.createElement('div');
  bannerCta.classList.add('banner-cta');

  const textCenterDiv = document.createElement('div');
  textCenterDiv.classList.add('text-center');

  const ctaLink = ctaLinkRow.querySelector('a');
  const ctaLabel = ctaLabelRow.textContent.trim();

  if (ctaLink && ctaLabel) {
    const anchor = document.createElement('a');
    anchor.id = `cta-${Math.random().toString(36).substring(2, 11)}`; // Generate a unique ID
    anchor.classList.add('cmp-button', 'analytics_cta_click', 'text-center', 'cta-layout');
    anchor.href = ctaLink.href;
    anchor.setAttribute('data-link-region', 'CTA');
    anchor.setAttribute('data-is-internal', 'true');
    anchor.setAttribute('data-enable-gating', 'false');
    anchor.target = '_blank'; // Assuming target blank from original HTML

    const span = document.createElement('span');
    span.classList.add('cmp-button__text', 'primary-btn', 'w-75', 'p-5', 'rounded-pill', 'd-inline-flex', 'justify-content-center', 'align-items-center', 'famlf-cta-btn');
    span.textContent = ctaLabel;

    anchor.append(span);
    moveInstrumentation(ctaLinkRow, anchor);
    moveInstrumentation(ctaLabelRow, span);
    textCenterDiv.append(anchor);
  }

  // Add the pop-up div (empty as per original HTML)
  const popUpDiv = document.createElement('div');
  popUpDiv.classList.add('pop-up', 'd-none');
  // The original HTML shows these as empty input tags, not hardcoded values.
  // We should create them as elements and append, not use innerHTML with hardcoded values.
  const popupMessage = document.createElement('input');
  popupMessage.type = 'hidden';
  popupMessage.classList.add('popup-message');
  popUpDiv.append(popupMessage);

  const proceedButtonLabel = document.createElement('input');
  proceedButtonLabel.type = 'hidden';
  proceedButtonLabel.classList.add('proceed-button-label');
  popUpDiv.append(proceedButtonLabel);

  const cancelButtonLabel = document.createElement('input');
  cancelButtonLabel.type = 'hidden';
  cancelButtonLabel.classList.add('cancel-button-label');
  popUpDiv.append(cancelButtonLabel);

  const backgroundColor = document.createElement('input');
  backgroundColor.type = 'hidden';
  backgroundColor.classList.add('background-color');
  popUpDiv.append(backgroundColor);

  textCenterDiv.append(popUpDiv);

  bannerCta.append(textCenterDiv);
  ctaWrapper.append(bannerCta);
  wrapper.append(ctaWrapper);
  section.append(wrapper);

  block.replaceChildren(section);
}
