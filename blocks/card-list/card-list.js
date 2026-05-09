import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The cardsContainerRow is not a content row, it's just a placeholder in the block structure.
  // We should only destructure actual content rows.
  const [headingRow, ctaLinkRow, ctaLabelRow, ...cardRows] = [...block.children];

  const root = document.createElement('div');
  // block.classList.add('cmp-card-list') is already handled by AEM.
  // Adding 'cmp-card-list__content' here would cause double padding/CSS if the block CSS targets it.
  // The original HTML shows 'cmp-card-list__content' as an inner wrapper, not the block itself.
  // So, we don't add the block's own class to an inner wrapper.
  // The root element created here will become the direct child of the block.
  // The original HTML has a div with class 'cmp-card-list__content' directly inside 'cmp-card-list'.
  // So, we add this class to our root element.
  root.classList.add('cmp-card-list__content');


  // Top section (heading and CTA)
  const slideWrap = document.createElement('div');
  slideWrap.classList.add('slide-wrap');
  root.append(slideWrap);

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-card-list__content__top', 'slide-up');
  topContent.setAttribute('data-slide-type', 'slide-up');
  // moveInstrumentation(cardsContainerRow, topContent); // cardsContainerRow is not a content row, no instrumentation to move
  slideWrap.append(topContent);

  // Heading
  const headingWrapper = document.createElement('div');
  headingWrapper.classList.add('cmp-card-list__content__heading', 'is-visible');
  headingWrapper.setAttribute('tabindex', '0');
  topContent.append(headingWrapper);

  const headingTitle = document.createElement('div');
  headingTitle.id = 'card-list-heading';
  headingTitle.classList.add('cmp-card-list__content__heading__title');
  moveInstrumentation(headingRow, headingTitle);
  // Heading is richtext, so we should read innerHTML from the cell, not the row.
  // The row itself is a div containing a div (the cell).
  headingTitle.innerHTML = headingRow.children[0]?.innerHTML || '';
  headingWrapper.append(headingTitle);

  // CTA
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('cmp-card-list__content__cta-wrapper', 'is-visible');
  topContent.append(ctaWrapper);

  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add('cta', 'cta__primary');
  const foundCtaLink = ctaLinkRow.querySelector('a');
  if (foundCtaLink) {
    ctaAnchor.href = foundCtaLink.href;
  }
  ctaAnchor.setAttribute('target', '_self');
  ctaAnchor.setAttribute('data-palette', 'palette-1');
  moveInstrumentation(ctaLinkRow, ctaAnchor);

  const ctaIcon = document.createElement('span');
  ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  ctaIcon.setAttribute('aria-hidden', 'true');
  ctaAnchor.append(ctaIcon);

  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('cta__label');
  // ctaLabelRow is a row, its first child is the cell containing the text.
  ctaLabel.textContent = ctaLabelRow.children[0]?.textContent.trim() || '';
  ctaAnchor.setAttribute('aria-label', ctaLabel.textContent);
  // moveInstrumentation should be from the row to the element that represents its content.
  // Here, ctaAnchor is the primary element for the CTA, so instrumentation from ctaLabelRow
  // should ideally be moved to ctaAnchor, or to ctaLabel if it's considered the main content carrier.
  // Given ctaLabel is a span inside ctaAnchor, moving to ctaLabel is acceptable.
  moveInstrumentation(ctaLabelRow, ctaLabel);
  ctaAnchor.append(ctaLabel);
  ctaWrapper.append(ctaAnchor);

  // Card items
  const itemsWrapper = document.createElement('div');
  itemsWrapper.classList.add('cmp-card-list__content__items');
  root.append(itemsWrapper);

  cardRows.forEach((row, index) => {
    // Fixed schema for card items, so destructuring is correct.
    const [imageCell, titleCell, descriptionCell] = [...row.children];

    const cardItem = document.createElement('div');
    cardItem.classList.add('cmp-card-list__content__card-item', 'is-visible', 'slide-up');
    cardItem.setAttribute('data-animation', 'card');
    cardItem.setAttribute('data-slide-type', 'slide-up');
    cardItem.setAttribute('data-slide-no-wrap', '');
    cardItem.setAttribute('data-slide-delay', `${index * 100}`);
    cardItem.style.transitionDelay = `${index * 0.2}s`;
    moveInstrumentation(row, cardItem);
    itemsWrapper.append(cardItem);

    // Card Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // createOptimizedPicture handles the picture element creation.
      // The original HTML shows the img inside picture has the class.
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('cmp-card-list__content__card-item__image');
      cardItem.append(optimizedPic);
      moveInstrumentation(imageCell, optimizedPic);
    }

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card-list__content__card-item-content');
    cardItem.append(cardContent);

    // Card Title
    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('cmp-card-list__content__card-item-content__heading-wrapper');
    titleWrapper.setAttribute('tabindex', '0');
    cardContent.append(titleWrapper);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('cmp-card-list__content__card-item-content__title');
    titleDiv.setAttribute('aria-hidden', 'false');
    titleDiv.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, titleDiv);
    titleWrapper.append(titleDiv);

    // Card Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-card-list__content__card-item-content__description');
    descriptionDiv.setAttribute('tabindex', '0');
    descriptionDiv.setAttribute('aria-label', descriptionCell.textContent.trim());
    descriptionDiv.setAttribute('aria-hidden', 'false');
    // Description is richtext, so innerHTML is correct.
    descriptionDiv.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, descriptionDiv);
    cardContent.append(descriptionDiv);
  });

  block.replaceChildren(root);
}
