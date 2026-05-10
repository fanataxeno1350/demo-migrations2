import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    headlineRow,
    bodyRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('component-photo-lockup', 'bg-light-gray', 'pad-top-lg');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper', 'block-right');
  container.append(wrapper);

  const backgroundDesktopPicture = backgroundDesktopRow.querySelector('picture');
  if (backgroundDesktopPicture) {
    const img = backgroundDesktopPicture.querySelector('img');
    if (img) {
      wrapper.style.backgroundImage = `url("${img.src}")`;
    }
  }
  moveInstrumentation(backgroundDesktopRow, wrapper);

  const accent = document.createElement('div');
  accent.classList.add('accent');
  wrapper.append(accent);

  const layer1 = document.createElement('div');
  layer1.classList.add('layer', 'layer1', 'bg-primary-d2-blue');
  accent.append(layer1);

  const layer2 = document.createElement('div');
  layer2.classList.add('layer', 'layer2', 'bg-primary-d2-blue');
  accent.append(layer2);

  const layer3 = document.createElement('div');
  layer3.classList.add('layer', 'layer3', 'bg-primary-d2-blue');
  accent.append(layer3);

  const wrapperMobile = document.createElement('div');
  wrapperMobile.classList.add('wrapper-mobile');
  wrapper.append(wrapperMobile);

  const backgroundMobilePicture = backgroundMobileRow.querySelector('picture');
  if (backgroundMobilePicture) {
    const img = backgroundMobilePicture.querySelector('img');
    if (img) {
      wrapperMobile.style.backgroundImage = `url("${img.src}")`;
    }
  }
  moveInstrumentation(backgroundMobileRow, wrapperMobile);

  const innerContainer = document.createElement('div');
  innerContainer.classList.add('container');
  wrapper.append(innerContainer);

  const row = document.createElement('div');
  row.classList.add('row');
  innerContainer.append(row);

  // The 'block-text' div was empty in the original HTML, so it's not recreated here.
  // If it needs to be present for layout, it should be added, but without content.
  // const blockText = document.createElement('div');
  // blockText.classList.add('block-text', 'col-md-12', 'col-lg-6', 'offset-lg-5');
  // row.append(blockText);

  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('block-wrapper', 'col-md-12', 'col-lg-5', 'offset-lg-6');
  row.append(blockWrapper);

  // Original HTML has h5 with aria-hidden="true" followed by h3.
  // Assuming h3 is the visible headline and h5 is for accessibility or legacy.
  // Recreating the h5 as per original HTML.
  const hiddenHeadline = document.createElement('h5');
  hiddenHeadline.setAttribute('aria-hidden', 'true');
  hiddenHeadline.classList.add('data-uw-rm-autofix-hide'); // Add class from original HTML
  // The content of this h5 is typically an empty span or similar for screen readers,
  // but since it's aria-hidden, we'll leave it without content here.
  blockWrapper.append(hiddenHeadline);

  const headline = document.createElement('h3');
  headline.textContent = headlineRow.textContent.trim();
  blockWrapper.append(headline);
  moveInstrumentation(headlineRow, headline);

  const separator = document.createElement('div');
  separator.classList.add('separator');
  blockWrapper.append(separator);

  const tileBody = document.createElement('div');
  tileBody.classList.add('tile-body');
  // FIX: Read from the cell's first child (the <p>) or the cell's innerHTML directly
  // to avoid <p><p> nesting.
  tileBody.innerHTML = bodyRow.children[0]?.innerHTML || '';
  blockWrapper.append(tileBody);
  moveInstrumentation(bodyRow, tileBody);

  const cta = document.createElement('div');
  cta.classList.add('cta');
  blockWrapper.append(cta);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('btn', 'bg-primary-d2-blue');
  const foundLink = ctaLinkRow.querySelector('a');
  if (foundLink) {
    ctaLink.href = foundLink.href;
  }
  ctaLink.textContent = ctaLabelRow.textContent.trim();
  cta.append(ctaLink);
  moveInstrumentation(ctaLinkRow, ctaLink);
  moveInstrumentation(ctaLabelRow, ctaLink);

  block.replaceChildren(section);

  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
