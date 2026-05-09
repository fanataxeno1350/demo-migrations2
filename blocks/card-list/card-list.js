import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ctaLinkRow, ctaLabelRow, containerRow, ...cardRows] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('cmp-card-list', 'parallax-child');

  const content = document.createElement('div');
  content.classList.add('cmp-card-list__content');
  root.append(content);

  const slideWrap = document.createElement('div');
  slideWrap.classList.add('slide-wrap');
  content.append(slideWrap);

  const contentTop = document.createElement('div');
  contentTop.classList.add('cmp-card-list__content__top', 'slide-up');
  contentTop.dataset.slideType = 'slide-up';
  slideWrap.append(contentTop);

  // Heading
  const headingWrapper = document.createElement('div');
  headingWrapper.classList.add('cmp-card-list__content__heading', 'is-visible');
  headingWrapper.tabIndex = 0;
  contentTop.append(headingWrapper);

  const headingTitle = document.createElement('div');
  headingTitle.classList.add('cmp-card-list__content__heading__title');
  headingTitle.id = 'card-list-heading';
  headingTitle.tabIndex = 0;
  // FIX: Replaced direct row.children[0] access with named destructuring for headingRow
  const [headingCell] = [...headingRow.children];
  headingTitle.innerHTML = headingCell?.innerHTML || '';
  moveInstrumentation(headingRow, headingTitle);
  headingWrapper.append(headingTitle);

  // CTA
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('cmp-card-list__content__cta-wrapper', 'is-visible');
  contentTop.append(ctaWrapper);

  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add('cta', 'cta__primary');
  ctaAnchor.target = '_self';
  ctaAnchor.dataset.palette = 'palette-1';

  const foundCtaLink = ctaLinkRow.querySelector('a');
  if (foundCtaLink) {
    ctaAnchor.href = foundCtaLink.href;
    ctaAnchor.ariaLabel = ctaLabelRow.textContent.trim();
  }
  moveInstrumentation(ctaLinkRow, ctaAnchor);
  moveInstrumentation(ctaLabelRow, ctaAnchor);

  const ctaIcon = document.createElement('span');
  ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  ctaIcon.ariaHidden = 'true';
  ctaAnchor.append(ctaIcon);

  const ctaLabel = document.createElement('span');
  ctaLabel.classList.add('cta__label');
  ctaLabel.textContent = ctaLabelRow.textContent.trim();
  ctaAnchor.append(ctaLabel);
  ctaWrapper.append(ctaAnchor);

  // Cards
  const itemsWrapper = document.createElement('div');
  itemsWrapper.classList.add('cmp-card-list__content__items');
  moveInstrumentation(containerRow, itemsWrapper);
  content.append(itemsWrapper);

  cardRows.forEach((row, index) => {
    const [imageCell, titleCell, descriptionCell] = [...row.children];

    const cardItem = document.createElement('div');
    cardItem.classList.add('cmp-card-list__content__card-item', 'is-visible', 'slide-up');
    cardItem.dataset.animation = 'card';
    cardItem.dataset.slideType = 'slide-up';
    cardItem.dataset.slideNoWrap = '';
    cardItem.dataset.slideDelay = `${index * 100}`;
    cardItem.style.transitionDelay = `${index * 0.2}s`;
    moveInstrumentation(row, cardItem);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('cmp-card-list__content__card-item__image');
        cardItem.append(optimizedPic);
        moveInstrumentation(imageCell, optimizedPic.querySelector('img'));
      }
    }

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card-list__content__card-item-content');
    cardItem.append(cardContent);

    const cardHeadingWrapper = document.createElement('div');
    cardHeadingWrapper.classList.add('cmp-card-list__content__card-item-content__heading-wrapper');
    cardHeadingWrapper.tabIndex = 0;
    cardContent.append(cardHeadingWrapper);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('cmp-card-list__content__card-item-content__title');
    cardTitle.ariaHidden = 'false';
    cardTitle.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, cardTitle);
    cardHeadingWrapper.append(cardTitle);

    const cardDescription = document.createElement('div');
    cardDescription.classList.add('cmp-card-list__content__card-item-content__description');
    cardDescription.tabIndex = 0;
    // FIX: Changed ariaLabel to use textContent.trim() to avoid invalid HTML in aria-label attribute
    cardDescription.ariaLabel = descriptionCell.textContent.trim();
    cardDescription.ariaHidden = 'false';
    cardDescription.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, cardDescription);
    cardContent.append(cardDescription);

    itemsWrapper.append(cardItem);
  });

  block.replaceChildren(root);
}
