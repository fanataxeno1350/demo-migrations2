import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0.5: The block's own class 'teaser-cta' should not be added to an inner wrapper.
  // The outer block div already carries that class from AEM.
  // The original HTML shows 'teaser cmp-teaser--cta' on the outer div.
  // The generated JS creates 'teaserCta' and adds 'cmp-teaser', 'cmp-teaser--cta'.
  // 'cmp-teaser--cta' is already on the outer block. 'cmp-teaser' is also on the outer div.
  // The outer block already has 'teaser-cta' from AEM.
  // The original HTML shows the main wrapper as <div class="teaser cmp-teaser--cta">
  // So, the root element should be 'cmp-teaser' and 'cmp-teaser--cta' should be applied to the block itself.
  // Let's create the inner wrapper as 'cmp-teaser' and ensure the block has 'teaser-cta'.
  // The block already has 'teaser-cta' from AEM.
  // The original HTML has <div class="teaser cmp-teaser--cta"> which means the block itself is the 'teaser' and 'cmp-teaser--cta'.
  // The inner element is <div id="teaser-da4b81de79" class="cmp-teaser" ...>
  // So the inner element should be 'cmp-teaser'.

  const [
    backgroundImageDesktopRow,
    backgroundImageMobileRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const ctaLink = ctaLinkRow.querySelector('a')?.href;
  const ctaLabel = ctaLabelRow.textContent.trim();

  // The block itself already has 'teaser-cta' class.
  // The inner wrapper should be 'cmp-teaser' as per original HTML.
  const teaserCmp = document.createElement('div');
  teaserCmp.classList.add('cmp-teaser'); // This is the inner wrapper with the cmp-teaser class
  // No need to add 'cmp-teaser--cta' here, as it's on the block already.

  const linkWrapper = document.createElement('a');
  linkWrapper.classList.add('cmp-teaser__link');
  if (ctaLink) {
    linkWrapper.href = ctaLink;
  }
  moveInstrumentation(ctaLinkRow, linkWrapper);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-teaser__content');

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('cmp-teaser__action-container');

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor');

  const button = document.createElement('button');
  button.classList.add('cmp-button');
  button.type = 'button';
  moveInstrumentation(ctaLabelRow, button);

  const buttonText = document.createElement('span');
  buttonText.classList.add('cmp-button__text');
  buttonText.textContent = ctaLabel;

  button.append(buttonText);
  buttonDiv.append(button);
  actionContainer.append(buttonDiv);
  contentDiv.append(actionContainer);
  linkWrapper.append(contentDiv);
  teaserCmp.append(linkWrapper); // Append to the inner cmp-teaser div

  // Set background images
  const desktopPicture = backgroundImageDesktopRow.querySelector('picture');
  // The original HTML applies the background image to the 'cmp-teaser' div.
  // So, apply the style to 'teaserCmp'.
  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    if (desktopImg) {
      const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
      // moveInstrumentation should be on the picture element, not the img inside it.
      // The optimizedPic is a <picture> element.
      moveInstrumentation(backgroundImageDesktopRow, optimizedPic);
      // The style should be applied to the teaserCmp element.
      // We need the src from the optimized picture's img.
      teaserCmp.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
    }
  }

  // Handle mobile background image for responsive design if needed
  // The original HTML has data-background-image-mobile but only one background-image style.
  // This implies CSS media queries would handle switching.
  // The JS should just ensure the mobile image is optimized if it exists,
  // but not directly apply it as a background-image style unless there's a specific JS requirement.
  // The current code optimizes it but doesn't use it, which is fine if CSS handles it.
  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    if (mobileImg) {
      const optimizedPic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
      // moveInstrumentation should be on the picture element.
      moveInstrumentation(backgroundImageMobileRow, optimizedPic);
    }
  }

  // Replace block children with the new structure.
  block.replaceChildren(teaserCmp);
}
