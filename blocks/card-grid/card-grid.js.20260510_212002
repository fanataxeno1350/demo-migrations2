import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The outer block div already has the 'card-grid' class from AEM.
  // No need to add it to an inner wrapper.
  // const cardGridDiv = document.createElement('div');
  // cardGridDiv.classList.add('card-grid'); // Removed this line

  const cardRows = [...block.children];

  const rsCardsDiv = document.createElement('div');
  rsCardsDiv.classList.add('rs-cards');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');

  cardRows.forEach((row) => {
    const [mainImageCell, headlineCell, descriptionCell, ctaLinkCell, ctaIconCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-xl-4', 'col-lg-6', 'pb-md-0', 'pb-4', 'row-gap-4', 'koi-rscard-padding');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'rs-card');

    // Main Image
    const mainPicture = mainImageCell?.querySelector('picture');
    if (mainPicture) {
      const img = mainPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.classList.add('w-100', 'kitchens-image');
        cardDiv.append(optimizedPic);
      }
    }

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    // Headline
    const headline = document.createElement('h5');
    headline.classList.add('blog-card-title');
    headline.textContent = headlineCell?.textContent.trim() || '';
    cardBodyDiv.append(headline);

    // Description - Changed from h5 to div to avoid <p> inside <p>
    const description = document.createElement('div'); // Changed from h5 to div
    description.classList.add('card-title');
    description.innerHTML = descriptionCell?.innerHTML || '';
    cardBodyDiv.append(description);

    // CTA Link and Icon
    const ctaLink = ctaLinkCell?.querySelector('a');
    const ctaIconPicture = ctaIconCell?.querySelector('picture');

    if (ctaLink || ctaIconPicture) {
      const anchor = document.createElement('a');
      if (ctaLink) {
        anchor.href = ctaLink.href;
        // The original HTML does not have text content for this anchor,
        // it only contains an image. So, we don't set textContent here.
      }
      anchor.setAttribute('aria-label', `Read more about '${headline.textContent}'`);
      anchor.setAttribute('target', '_self');
      anchor.id = 'explore-btn-hide-id';

      if (ctaIconPicture) {
        const img = ctaIconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]); // Assuming a small icon width
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          anchor.append(optimizedPic);
        }
      }
      cardBodyDiv.append(anchor);
    }

    cardDiv.append(cardBodyDiv);
    moveInstrumentation(row, colDiv); // Move instrumentation from the authored row to the new column div
    colDiv.append(cardDiv);
    rowDiv.append(colDiv);
  });

  rsCardsDiv.append(rowDiv);

  // The tab-para div is a sibling of the row div, not a child of it.
  // Also, it's an empty div in the original HTML, so it should be created and appended
  // at the same level as rsCardsDiv, or if it's meant to be inside the row,
  // it should be outside the forEach loop and appended once.
  // Based on the original HTML, it's inside the 'row' div but after all 'col' divs.
  // The current code appends it to rowDiv, which is correct for its position.
  // However, the original HTML shows it as an empty div, so no need to populate it.
  const tabParaDiv = document.createElement('div');
  tabParaDiv.classList.add('tab-para');
  rowDiv.append(tabParaDiv); // This places it correctly after all colDivs within rowDiv.

  block.replaceChildren(rsCardsDiv);
}
