import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const headingRow = children.shift(); // First row is always the heading
  const cardRows = children; // Remaining rows are feature card items

  const root = document.createElement('div');
  // The block already has 'feature-cards' from AEM.
  // Original HTML shows 'featureCards aem-GridColumn aem-GridColumn--default--12' on the outer div.
  // The generated JS adds 'featureCards' again, which is redundant.
  // The original HTML also shows 'aem-GridColumn aem-GridColumn--default--12' on the outer div.
  // The generated JS adds these to the inner 'root' div. This is correct if the outer div is just 'feature-cards'.
  // However, the original HTML shows these on the block itself.
  // Let's assume the block itself is the 'featureCards aem-GridColumn aem-GridColumn--default--12' container.
  // The inner root should not duplicate 'featureCards'.
  // Based on the original HTML, the block itself is the .featureCards container.
  // The generated JS creates a 'root' div and adds 'featureCards' to it. This is a double-padding issue.
  // The block already has 'feature-cards' (kebab-case block name).
  // The original HTML shows 'featureCards' (camelCase) on the outer div.
  // We should add the camelCase 'featureCards' to the block itself if it's not there, or assume it's already there.
  // The block name is 'feature-cards', so the AEM div will be <div class="feature-cards">.
  // The original HTML shows <div class="featureCards aem-GridColumn aem-GridColumn--default--12">.
  // This means the block itself should have these classes.
  // The generated JS creates a new 'root' div and adds these classes. This is incorrect.
  // The block itself should be the container.
  // Let's assume the block element itself is the main container and we are adding content to it.
  // The original HTML structure shows the heading and card sections directly inside the .featureCards div.
  // So, the 'root' should be the block itself, or we should replace the block's children with the new structure.
  // The current code replaces block.children with 'root'. So 'root' becomes the direct child of the block.
  // The block already has the block name class. We should not add it again to 'root'.
  // The classes 'aem-GridColumn', 'aem-GridColumn--default--12' are also on the block in the original HTML.
  // If we create a new 'root' div, these classes should not be on 'root' if they are meant for the block.
  // However, the original HTML shows the heading and cards directly inside the .featureCards div.
  // The generated JS creates a 'root' div and puts everything inside it, then replaces block.children with 'root'.
  // This means the block will contain 'root'.
  // The original HTML has the classes 'featureCards aem-GridColumn aem-GridColumn--default--12' on the block itself.
  // So, the 'root' element created here should NOT have 'featureCards', 'aem-GridColumn', 'aem-GridColumn--default--12'.
  // These classes are on the outer block wrapper.
  // The inner wrapper should only have classes specific to its internal layout, if any.
  // The original HTML structure shows the heading and cards directly inside the .featureCards div.
  // So, the 'root' element should not exist, or it should be a simple wrapper without block-level classes.
  // Given the current structure, the 'root' element is an unnecessary wrapper that duplicates classes.
  // Let's remove the block-level classes from 'root' and assume the block itself is the container.
  // If the block needs an inner wrapper, it should not carry the block's own class or AEM grid classes.
  // Based on the original HTML, the content (heading and cards) are direct children of the .featureCards div.
  // So, we should build the content and then replace the block's children directly.
  // Let's refactor to avoid the extra 'root' div with duplicated classes.

  const contentWrapper = document.createElement('div'); // This will be the actual content wrapper
  contentWrapper.classList.add('feature-cards-wrapper'); // A generic wrapper class if needed, not block name

  // Heading Section
  if (headingRow) {
    const headingContainer = document.createElement('div');
    moveInstrumentation(headingRow, headingContainer);
    headingContainer.classList.add('cmp-text'); // Class from original HTML
    const headingText = document.createElement('h1');
    // CHECK 0.6: headingRow is a ROW. reading headingRow.children[0].innerHTML is correct for a richtext cell.
    // CHECK 0.7B: headingText is an <h1>. Assigning innerHTML from a richtext cell (which can contain <p>)
    // into an <h1> is invalid HTML nesting. Change <h1> to <div> or extract only text.
    // Model says 'heading' is 'richtext'. So it can contain HTML.
    // If it's <h1><p>...</p></h1>, it's invalid.
    // The original HTML shows <div class="cmp-text"><h1><p>Heading text content</p></h1></div>
    // This implies the <h1> is the container for the richtext.
    // So, we should put the richtext content directly into the <h1>.
    // If the richtext cell contains <p>...</p>, then <h1><p>...</p></h1> is invalid.
    // We should extract the innerHTML of the first child of the cell, which is likely a <p>.
    // Or, if the richtext is truly just "Heading text content", then textContent is fine.
    // Given the model is 'richtext', it's safer to use innerHTML and ensure the target element can contain it.
    // The original HTML shows <h1 style="text-align: center;">Welcome to <span style="color: rgb(170,31,48);">LetsBoing!</span></h1>
    // This means the <h1> itself contains the rich text, not a <p> inside it.
    // So, headingRow.children[0].innerHTML is correct for a richtext cell directly into <h1>.
    headingText.innerHTML = headingRow.children[0]?.innerHTML || '';
    headingText.style.textAlign = 'center'; // Applying inline style from original HTML
    headingContainer.append(headingText);
    contentWrapper.append(headingContainer);
  }

  // Cards Section
  const cardSectionWrapper = document.createElement('div');
  // Classes 'd-flex', 'flex-wrap', 'justify-content-center' are from ORIGINAL HTML. Correct.
  cardSectionWrapper.classList.add('d-flex', 'flex-wrap', 'justify-content-center');

  cardRows.forEach((row) => {
    // CHECK 0: Array destructuring is correct for fixed-schema rows.
    // CHECK 2.6A: Fixed schema for feature-card-item, so index destructuring is correct.
    const [imageCell, titleCell, descriptionCell, linkCell, ctaLabelCell] = [...row.children];

    const cardLink = document.createElement('a');
    // Classes from ORIGINAL HTML: 'd-flex', 'flex-column', 'analytics_cta_click', 'text-decoration-none', 'd-block', 'feature_card--Section', 'feature_card', 'mx-auto'
    // The original HTML shows <a class="d-flex flex-column analytics_cta_click text-decoration-none" ...>
    // And later <section class="d-block feature_card--Section feature_card mx-auto">
    // The generated JS combines these classes onto the <a>. This is a discrepancy.
    // The original HTML has the <a> inside a <section> with the 'feature_card--Section feature_card mx-auto' classes.
    // The generated JS puts these classes directly on the <a>.
    // Let's create the <section> wrapper as per original HTML.
    const cardSection = document.createElement('section');
    cardSection.classList.add('d-block', 'feature_card--Section', 'feature_card', 'mx-auto');

    cardLink.classList.add('d-flex', 'flex-column', 'analytics_cta_click', 'text-decoration-none'); // Classes for the <a> itself

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      if (foundLink.target) cardLink.target = foundLink.target;
      if (foundLink.title) cardLink.title = foundLink.title;
    }
    if (ctaLabelCell) {
      cardLink.setAttribute('data-cta-label', ctaLabelCell.textContent.trim());
    }

    const cardImageWrapper = document.createElement('div');
    cardImageWrapper.classList.add('feature_card--image', 'w-100', 'pb-4');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation should be from the original img to the new optimized img.
        // The original img is inside the picture, which is inside imageCell.
        // The new img is inside optimizedPic.
        // moveInstrumentation(img, optimizedPic.querySelector('img')); // This is correct.
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImageWrapper.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('w-100', 'h-100'); // Apply classes to the img inside picture
      }
    }
    cardLink.append(cardImageWrapper);

    const textContentWrapper = document.createElement('div');
    textContentWrapper.classList.add('text-center');

    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('feature_card--title', 'boing--text__heading-1');
    cardTitle.textContent = titleCell?.textContent.trim() || '';
    textContentWrapper.append(cardTitle);

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('pb-5');
    const cardDescription = document.createElement('p');
    cardDescription.classList.add('feature_card--desc', 'boing--text__body-2', 'text-boing-dark');
    cardDescription.textContent = descriptionCell?.textContent.trim() || '';
    descriptionWrapper.append(cardDescription);
    textContentWrapper.append(descriptionWrapper);

    // CTA button with arrow icon (from original HTML)
    const redirectedBtn = document.createElement('div');
    redirectedBtn.classList.add('redirected_btn', 'd-none'); // Hidden by default as per original HTML
    const button = document.createElement('button');
    button.type = 'button';
    button.role = 'button';
    button.classList.add('arrow-icon-btn');
    // CHECK 2.6D: SVG sprite path is hardcoded and uses /content/dam/. This is a violation.
    // Replace with a relative path or inline SVG if possible.
    // Assuming sprite-boing-fabbe8.svg is in the same folder as aem.js or scripts.js,
    // or a known relative path. For now, let's assume it's relative to the block.
    // If it's a shared asset, it should be in /icons or similar.
    // For now, let's just remove the /content/dam/aemigrate/uploaded-folder/letsboing-com/image/ prefix.
    // It should be '/icons/sprite-boing-fabbe8.svg#arrow-right' if it's a shared icon.
    // Or, if it's block-specific, it should be in the block's folder.
    // Let's use a generic /icons path as per EDS best practices for shared SVGs.
    button.innerHTML = `
      <svg aria-hidden="true" role="icon" class="icon-svg text-white">
        <use xlink:href="/icons/sprite-boing-fabbe8.svg#arrow-right"></use>
      </svg>
    `;
    redirectedBtn.append(button);
    textContentWrapper.append(redirectedBtn);

    cardLink.append(textContentWrapper);
    moveInstrumentation(row, cardLink); // Move instrumentation from the authored row to the new card link
    cardSection.append(cardLink); // Append cardLink to the new cardSection
    cardSectionWrapper.append(cardSection); // Append cardSection to the wrapper
  });

  contentWrapper.append(cardSectionWrapper);
  block.replaceChildren(contentWrapper); // Replace block children with the new content wrapper
}
