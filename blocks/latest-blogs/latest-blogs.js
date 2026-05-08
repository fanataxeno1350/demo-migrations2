import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionTitleRow = children[0];
  const sectionDescriptionRow = children[1];
  const ctaLinkRow = children[2];
  const ctaLabelRow = children[3];
  const blogCardRows = children.slice(4);

  const wrapper = document.createElement('section');
  wrapper.classList.add('article_listing--wrapper');

  const articleListing = document.createElement('div');
  articleListing.classList.add('article_listing', 'position-relative');
  wrapper.append(articleListing);

  const firstSection = document.createElement('div');
  firstSection.classList.add('article_listing_section--first', 'text-white', 'text-center');
  articleListing.append(firstSection);

  const title = document.createElement('h2');
  title.classList.add('article_listing--title', 'boing--text__heading-1', 'text-white', 'pb-3');
  moveInstrumentation(sectionTitleRow, title);
  title.textContent = sectionTitleRow.textContent.trim();
  firstSection.append(title);

  const description = document.createElement('p');
  description.classList.add('article_listing--desc', 'boing--text__body-2', 'pb-4');
  moveInstrumentation(sectionDescriptionRow, description);
  description.textContent = sectionDescriptionRow.textContent.trim();
  firstSection.append(description);

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('article_listing--btnWrapper');
  firstSection.append(ctaWrapper);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('boing--text__title-3', 'article_listing--btn', 'analytics_cta_click');
  const ctaAnchor = ctaLinkRow.querySelector('a');
  if (ctaAnchor) {
    ctaLink.href = ctaAnchor.href;
  }
  ctaLink.title = ctaLabelRow.textContent.trim();
  ctaLink.textContent = ctaLabelRow.textContent.trim();

  moveInstrumentation(ctaLinkRow, ctaLink);
  moveInstrumentation(ctaLabelRow, ctaLink);

  const arrowIcon = document.createElement('svg');
  arrowIcon.classList.add('arrow-icon');
  // Replaced hardcoded SVG path with inline SVG as per Rule 25.4
  arrowIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>`;
  ctaLink.append(arrowIcon);
  ctaWrapper.append(ctaLink);

  const secondSection = document.createElement('div');
  secondSection.classList.add('article_listing_section--second', 'd-flex');
  articleListing.append(secondSection);

  blogCardRows.forEach((row) => {
    const [imageCell, dateCell, titleCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('article_listing--cardWrapper', 'analytics_cta_click');
    const authoredLink = linkCell.querySelector('a');
    if (authoredLink) {
      cardLink.href = authoredLink.href;
      cardLink.dataset.ctaLabel = titleCell.textContent.trim();
    }
    moveInstrumentation(row, cardLink);

    const card = document.createElement('div');
    card.classList.add('article_listing--cards');
    cardLink.append(card);

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('article_listing--cardImageWrapper');
    card.append(imageWrapper);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('article_listing--cardImage', 'w-100', 'h-100');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapper.append(optimizedPic);
      }
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('cards_content--wrapper');
    card.append(contentWrapper);

    const date = document.createElement('p');
    date.classList.add('boing--text__body-5', 'p-0', 'm-0', 'mb-3', 'published_date');
    date.textContent = dateCell.textContent.trim();
    contentWrapper.append(date);

    const cardTitle = document.createElement('p');
    cardTitle.classList.add('boing--text__body-2', 'boing--text__body');
    cardTitle.textContent = titleCell.textContent.trim();
    contentWrapper.append(cardTitle);

    secondSection.append(cardLink);
  });

  block.replaceChildren(wrapper);
}
