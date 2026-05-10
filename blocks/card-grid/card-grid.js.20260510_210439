import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The outer block div already has 'rs-cards' from AEM.
  // We create an inner div to hold the 'row' and other content.
  const rootContainer = document.createElement('div');
  // No classList.add('rs-cards') here to avoid double padding/CSS.
  // The original HTML shows 'rs-cards' on the outermost div, which is `block` itself.

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  // moveInstrumentation(block, rowDiv); // No, moveInstrumentation should be on individual rows/cells

  [...block.children].forEach((cardRow) => {
    const [
      rightshiftImageCell,
      kitchensImageCell,
      ctaLinkCell,
      ctaIconCell,
      headlineCell,
      descriptionCell,
    ] = [...cardRow.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-xl-4', 'col-lg-6', 'pb-md-0', 'pb-4', 'row-gap-4', 'koi-rscard-padding');
    moveInstrumentation(cardRow, colDiv); // Move instrumentation from cardRow to colDiv

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'rs-card');

    // Rightshift Image
    const rightshiftPicture = rightshiftImageCell?.querySelector('picture');
    if (rightshiftPicture) {
      const rightshiftImg = rightshiftPicture.querySelector('img');
      if (rightshiftImg) {
        const optimizedRightshiftPic = createOptimizedPicture(
          rightshiftImg.src,
          rightshiftImg.alt,
          false,
          [{ width: '750' }],
        );
        optimizedRightshiftPic.querySelector('img').classList.add('w-100', 'rightshift-image');
        optimizedRightshiftPic.querySelector('img').style.display = 'none';
        moveInstrumentation(rightshiftImageCell, optimizedRightshiftPic.querySelector('img'));
        cardDiv.append(optimizedRightshiftPic);
      }
    }

    // Kitchens Image
    const kitchensPicture = kitchensImageCell?.querySelector('picture');
    if (kitchensPicture) {
      const kitchensImg = kitchensPicture.querySelector('img');
      if (kitchensImg) {
        const optimizedKitchensPic = createOptimizedPicture(
          kitchensImg.src,
          kitchensImg.alt,
          false,
          [{ width: '750' }],
        );
        optimizedKitchensPic.querySelector('img').classList.add('w-100', 'kitchens-image');
        optimizedKitchensPic.querySelector('img').style.display = 'block';
        moveInstrumentation(kitchensImageCell, optimizedKitchensPic.querySelector('img'));
        cardDiv.append(optimizedKitchensPic);
      }
    }

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    // CTA Link and Icon
    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaIconPicture = ctaIconCell?.querySelector('picture');

    if (ctaLink || ctaIconPicture) {
      const anchor = document.createElement('a');
      anchor.setAttribute('aria-label', `Read more about '${headlineCell?.textContent.trim()}'`);
      anchor.setAttribute('target', '_self');
      anchor.setAttribute('id', 'explore-btn-hide-id');
      // The original HTML shows display: none on the first card's anchor, but not others.
      // We should only apply it if the original ctaLink has it, or if it's a default.
      // For now, mirroring the generated JS, but this might need refinement based on specific original HTML.
      // If the original HTML has a consistent display style, it should be applied.
      // For now, keeping the `style.display = 'none'` as generated, assuming it's a default that gets overridden.
      anchor.style.display = 'none';

      if (ctaLink) {
        anchor.href = ctaLink.href;
        moveInstrumentation(ctaLinkCell, anchor); // Move instrumentation from ctaLinkCell to anchor
      }

      if (ctaIconPicture) {
        const ctaIconImg = ctaIconPicture.querySelector('img');
        if (ctaIconImg) {
          const optimizedCtaIconPic = createOptimizedPicture(
            ctaIconImg.src,
            ctaIconImg.alt,
            false,
            [{ width: '24' }], // Assuming a small icon size
          );
          optimizedCtaIconPic.querySelector('img').setAttribute('loading', 'lazy');
          moveInstrumentation(ctaIconCell, optimizedCtaIconPic.querySelector('img'));
          anchor.append(optimizedCtaIconPic);
        }
      }
      cardBodyDiv.append(anchor);
    }

    // Headline
    const headline = document.createElement('h5');
    headline.classList.add('blog-card-title');
    headline.style.display = 'block';
    headline.textContent = headlineCell?.textContent.trim() || '';
    moveInstrumentation(headlineCell, headline);
    cardBodyDiv.append(headline);

    // Description
    // Description is richtext, so it can contain <p> tags. Assigning to <h5> creates invalid HTML.
    // Use a <div> instead for richtext content.
    const description = document.createElement('div'); // Changed from h5 to div
    description.classList.add('card-title'); // Keep the class from original HTML
    description.innerHTML = descriptionCell?.innerHTML || '';
    moveInstrumentation(descriptionCell, description);
    cardBodyDiv.append(description);

    cardDiv.append(cardBodyDiv);
    colDiv.append(cardDiv);
    rowDiv.append(colDiv);
  });

  // The 'tab-para' div is present in the original HTML, but it's an empty div
  // and not part of the card-item structure. It appears after all card columns.
  // It should be appended to the rowDiv, not the rootDiv.
  // The original HTML shows it as a sibling to the col-xl-4 divs, inside the 'row' div.
  const tabParaDiv = document.createElement('div');
  tabParaDiv.classList.add('tab-para');
  // No moveInstrumentation for an empty structural div that doesn't map to a block row.
  rowDiv.append(tabParaDiv);

  rootContainer.append(rowDiv);
  block.replaceChildren(rootContainer);
}
