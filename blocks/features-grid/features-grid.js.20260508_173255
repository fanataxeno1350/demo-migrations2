import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const featureCards = [...block.children];

  const root = document.createElement('div');
  root.classList.add('rs-cards');

  const row = document.createElement('div');
  row.classList.add('row');
  root.append(row);

  featureCards.forEach((cardRow) => {
    const [mainImageCell, hiddenImageCell, featureTitleCell, featureDescriptionCell, ctaIconCell, ctaLinkCell] = [...cardRow.children];

    const col = document.createElement('div');
    col.classList.add('col-xl-4', 'col-lg-6', 'pb-md-0', 'pb-4', 'row-gap-4', 'koi-rscard-padding');

    const card = document.createElement('div');
    card.classList.add('card', 'rs-card');
    moveInstrumentation(cardRow, card); // Move instrumentation from original row to the new card div
    col.append(card);

    // Hidden Image (rightshift-image)
    const hiddenImagePicture = hiddenImageCell?.querySelector('picture');
    if (hiddenImagePicture) {
      const hiddenImg = hiddenImagePicture.querySelector('img');
      if (hiddenImg) {
        const optimizedHiddenPic = createOptimizedPicture(hiddenImg.src, hiddenImg.alt, false, [{ width: '750' }]);
        optimizedHiddenPic.querySelector('img').classList.add('w-100', 'rightshift-image');
        card.append(optimizedHiddenPic);
      }
    }

    // Main Image (visible)
    const mainImagePicture = mainImageCell?.querySelector('picture');
    if (mainImagePicture) {
      const mainImg = mainImagePicture.querySelector('img');
      if (mainImg) {
        const optimizedMainPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
        optimizedMainPic.querySelector('img').classList.add('w-100', 'kitchens-image');
        card.append(optimizedMainPic);
      }
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.append(cardBody);

    // CTA Link and Icon
    const ctaLinkElement = ctaLinkCell?.querySelector('a');
    const ctaIconPicture = ctaIconCell?.querySelector('picture');

    if (ctaLinkElement) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.href = ctaLinkElement.href;
      ctaAnchor.setAttribute('aria-label', `Read more about '${featureTitleCell?.textContent.trim() || ''}'`);
      ctaAnchor.target = '_self';
      ctaAnchor.id = 'explore-btn-hide-id';

      if (ctaIconPicture) {
        const ctaIconImg = ctaIconPicture.querySelector('img');
        if (ctaIconImg) {
          const optimizedCtaIcon = createOptimizedPicture(ctaIconImg.src, ctaIconImg.alt, false, [{ width: '24' }]); // Assuming a small icon size
          optimizedCtaIcon.querySelector('img').classList.add('w-100');
          ctaAnchor.append(optimizedCtaIcon);
        }
      }
      cardBody.append(ctaAnchor);
    }

    // Feature Title
    if (featureTitleCell) {
      const title = document.createElement('h5');
      title.classList.add('blog-card-title');
      title.textContent = featureTitleCell.textContent.trim();
      cardBody.append(title);
    }

    // Feature Description
    if (featureDescriptionCell) {
      const description = document.createElement('div'); // Changed from h5 to div to avoid <p> inside <h5>
      description.classList.add('card-title'); // Keep the class for styling
      description.innerHTML = featureDescriptionCell.innerHTML; // richtext content
      cardBody.append(description);
    }

    row.append(col);
  });

  // The 'tab-para' div is not present in the ORIGINAL HTML structure provided.
  // If it's not part of the original structure, it should not be added.
  // const tabPara = document.createElement('div');
  // tabPara.classList.add('tab-para');
  // row.append(tabPara);

  block.replaceChildren(root);

  // Removed the redundant image optimization loop at the end.
  // createOptimizedPicture is already called for each image when it's created.
}
