import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ctaLinkRow, ctaLabelRow, ...cardRows] = [...block.children];

  const cmpCardList = document.createElement('div');
  cmpCardList.classList.add('cmp-card-list', 'parallax-child');
  // The outer block div already has 'card-list' from AEM.
  // The original HTML shows 'cmp-card-list' on an inner div, so we add it here.
  // No need to add 'card-list' again.
  moveInstrumentation(block, cmpCardList); // Move instrumentation from block to new root

  const cmpCardListContent = document.createElement('div');
  cmpCardListContent.classList.add('cmp-card-list__content');
  cmpCardList.append(cmpCardListContent);

  // Top section (heading and CTA)
  const slideWrap = document.createElement('div');
  slideWrap.classList.add('slide-wrap');
  cmpCardListContent.append(slideWrap);

  const cmpCardListContentTop = document.createElement('div');
  cmpCardListContentTop.classList.add('cmp-card-list__content__top', 'slide-up');
  slideWrap.append(cmpCardListContentTop);

  // Heading
  if (headingRow) {
    const cmpCardListContentHeading = document.createElement('div');
    cmpCardListContentHeading.classList.add('cmp-card-list__content__heading', 'is-visible');
    moveInstrumentation(headingRow, cmpCardListContentHeading);

    const cmpCardListContentHeadingTitle = document.createElement('div');
    cmpCardListContentHeadingTitle.classList.add('cmp-card-list__content__heading__title');
    cmpCardListContentHeadingTitle.tabIndex = 0;
    // headingRow is a root row, its first child is the cell.
    // The cell content is richtext, so innerHTML is correct.
    const [headingCell] = [...headingRow.children];
    cmpCardListContentHeadingTitle.innerHTML = headingCell?.innerHTML || '';
    cmpCardListContentHeading.append(cmpCardListContentHeadingTitle);
    cmpCardListContentTop.append(cmpCardListContentHeading);
  }

  // CTA
  if (ctaLinkRow && ctaLabelRow) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('cmp-card-list__content__cta-wrapper', 'is-visible');
    moveInstrumentation(ctaLinkRow, ctaWrapper); // Move instrumentation from ctaLinkRow

    const ctaLink = ctaLinkRow.children[0]?.querySelector('a');
    const ctaLabel = ctaLabelRow.children[0]?.textContent.trim();

    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.classList.add('cta', 'cta__primary');
      anchor.target = '_self';
      anchor.setAttribute('aria-label', ctaLabel);
      anchor.setAttribute('data-palette', 'palette-1');

      const ctaIcon = document.createElement('span');
      ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
      ctaIcon.setAttribute('aria-hidden', 'true');
      anchor.append(ctaIcon);

      const ctaLabelSpan = document.createElement('span');
      ctaLabelSpan.classList.add('cta__label');
      ctaLabelSpan.textContent = ctaLabel;
      anchor.append(ctaLabelSpan);

      ctaWrapper.append(anchor);
      cmpCardListContentTop.append(ctaWrapper);
    }
  }

  // Card items
  const cmpCardListContentItems = document.createElement('div');
  cmpCardListContentItems.classList.add('cmp-card-list__content__items');
  cmpCardListContent.append(cmpCardListContentItems);

  cardRows.forEach((row, index) => {
    // Destructuring is correct for fixed-schema item rows
    const [imageCell, titleCell, descriptionCell] = [...row.children];

    const cardItem = document.createElement('div');
    cardItem.classList.add('cmp-card-list__content__card-item', 'is-visible', 'slide-up');
    cardItem.setAttribute('data-animation', 'card');
    cardItem.setAttribute('data-slide-type', 'slide-up');
    cardItem.setAttribute('data-slide-no-wrap', '');
    cardItem.setAttribute('data-slide-delay', `${index * 100}`);
    cardItem.style.transitionDelay = `${index * 0.2}s`;
    moveInstrumentation(row, cardItem);

    // Image
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // createOptimizedPicture handles alt text, no need to pass it again
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('cmp-card-list__content__card-item__image');
      cardItem.append(optimizedPic);
    }

    const cardItemContent = document.createElement('div');
    cardItemContent.classList.add('cmp-card-list__content__card-item-content');
    cardItem.append(cardItemContent);

    // Title
    if (titleCell) {
      const headingWrapper = document.createElement('div');
      headingWrapper.classList.add('cmp-card-list__content__card-item-content__heading-wrapper');
      headingWrapper.tabIndex = 0;

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('cmp-card-list__content__card-item-content__title');
      titleDiv.setAttribute('aria-hidden', 'false');
      titleDiv.textContent = titleCell.textContent.trim();
      headingWrapper.append(titleDiv);
      cardItemContent.append(headingWrapper);
    }

    // Description
    if (descriptionCell) {
      const descriptionDiv = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
      descriptionDiv.classList.add('cmp-card-list__content__card-item-content__description');
      descriptionDiv.tabIndex = 0;
      // The aria-label should probably be the text content, not the raw HTML
      descriptionDiv.setAttribute('aria-label', descriptionCell.textContent.trim());
      descriptionDiv.setAttribute('aria-hidden', 'false');
      descriptionDiv.innerHTML = descriptionCell.innerHTML; // Correctly preserves richtext HTML
      cardItemContent.append(descriptionDiv);
    }

    cmpCardListContentItems.append(cardItem);
  });

  block.replaceChildren(cmpCardList);
}
