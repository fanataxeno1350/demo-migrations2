import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [
    sectionTitleRow,
    sectionDescriptionRow,
    ctaLinkRow,
    ctaLabelRow,
    ...articleRows
  ] = [...block.children];

  const wrapper = document.createElement('section');
  wrapper.classList.add('article_listing--wrapper');

  const articleListingDiv = document.createElement('div');
  articleListingDiv.classList.add('article_listing', 'position-relative');
  wrapper.append(articleListingDiv);

  const firstSection = document.createElement('div');
  firstSection.classList.add('article_listing_section--first', 'text-white', 'text-center');
  articleListingDiv.append(firstSection);

  // Section Title
  const title = document.createElement('h2');
  title.classList.add('article_listing--title', 'boing--text__heading-1', 'text-white', 'pb-3');
  moveInstrumentation(sectionTitleRow, title);
  title.textContent = sectionTitleRow.textContent.trim();
  firstSection.append(title);

  // Section Description (richtext field)
  const description = document.createElement('p'); // Use p as per original HTML
  description.classList.add('article_listing--desc', 'boing--text__body-2', 'pb-4');
  moveInstrumentation(sectionDescriptionRow, description);
  // Read innerHTML directly from the cell for richtext
  description.innerHTML = sectionDescriptionRow.children[0]?.innerHTML || '';
  firstSection.append(description);

  // CTA Link and Label
  const ctaBtnWrapper = document.createElement('div');
  ctaBtnWrapper.classList.add('article_listing--btnWrapper');
  firstSection.append(ctaBtnWrapper);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('boing--text__title-3', 'article_listing--btn', 'analytics_cta_click');
  moveInstrumentation(ctaLinkRow, ctaLink);
  const foundCtaLink = ctaLinkRow.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  }
  ctaLink.textContent = ctaLabelRow.textContent.trim();

  const arrowIcon = document.createElement('svg');
  arrowIcon.classList.add('arrow-icon');
  // Replaced hardcoded SVG path with inline SVG as per Rule 25.4
  arrowIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>'; // Example arrow_forward SVG
  ctaLink.append(arrowIcon);
  ctaBtnWrapper.append(ctaLink);

  const secondSection = document.createElement('div');
  secondSection.classList.add('article_listing_section--second', 'd-flex');
  articleListingDiv.append(secondSection);

  articleRows.forEach((row) => {
    // Destructure article item cells based on BlockJson model
    const [imageCell, publishedDateCell, headlineCell, linkCell] = [...row.children];

    const articleCardLink = document.createElement('a');
    articleCardLink.classList.add('article_listing--cardWrapper', 'analytics_cta_click');

    if (linkCell) {
      const actualLink = linkCell.querySelector('a');
      if (actualLink) {
        articleCardLink.href = actualLink.href;
        articleCardLink.setAttribute('data-cta-label', headlineCell.textContent.trim());
      }
    }

    const articleCard = document.createElement('div');
    articleCard.classList.add('article_listing--cards');
    articleCardLink.append(articleCard);

    const cardImageWrapper = document.createElement('div');
    cardImageWrapper.classList.add('article_listing--cardImageWrapper');
    articleCard.append(cardImageWrapper);

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          // moveInstrumentation should be called on the original element, not the new img inside optimizedPic
          moveInstrumentation(picture, optimizedPic.querySelector('img'));
          cardImageWrapper.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('article_listing--cardImage', 'w-100', 'h-100');
        }
      }
    }

    const cardContentWrapper = document.createElement('div');
    cardContentWrapper.classList.add('cards_content--wrapper');
    articleCard.append(cardContentWrapper);

    const publishedDate = document.createElement('p');
    publishedDate.classList.add('boing--text__body-5', 'p-0', 'm-0', 'mb-3', 'published_date');
    if (publishedDateCell) {
      publishedDate.textContent = publishedDateCell.textContent.trim();
    }
    cardContentWrapper.append(publishedDate);

    const headline = document.createElement('p');
    headline.classList.add('boing--text__body-2', 'boing--text__body');
    if (headlineCell) {
      headline.textContent = headlineCell.textContent.trim();
    }
    cardContentWrapper.append(headline);

    moveInstrumentation(row, articleCardLink);
    secondSection.append(articleCardLink);
  });

  block.replaceChildren(wrapper);
}
