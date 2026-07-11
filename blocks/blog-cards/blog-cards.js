import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [exploreAllLabelRow, exploreAllLinkRow, ...cardRows] = children;

  const root = document.createElement('div');
  root.classList.add('cmp-card--blog-details', 'cmp-card--default');

  const container = document.createElement('div');
  container.classList.add('cmp-card__container');

  cardRows
    .filter((row) => row.children.length === 5)
    .forEach((row) => {
      const [imageDesktopCell, imageMobileCell, dateAndCategoryCell, headlineCell, cardLinkCell] = [
        ...row.children,
      ];

      const cardLinkAnchor = document.createElement('a');
      const foundCardLink = cardLinkCell.querySelector('a');
      if (foundCardLink) {
        cardLinkAnchor.href = foundCardLink.href;
        cardLinkAnchor.target = '_self';
      }
      moveInstrumentation(row, cardLinkAnchor);

      const cardContent = document.createElement('div');
      cardContent.classList.add('cmp-card__content');
      cardContent.tabIndex = 0;

      const mediaWrapper = document.createElement('div');
      mediaWrapper.classList.add('cmp-card__media', 'youtube-url-wrapper');

      const picture = document.createElement('picture');
      const desktopImg = imageDesktopCell.querySelector('img');
      const mobileImg = imageMobileCell.querySelector('img');

      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width:767px)';
        sourceMobile.srcset = mobileImg.src;
        picture.append(sourceMobile);
      }

      if (desktopImg) {
        // createOptimizedPicture returns a <picture> element, not just an <img>
        const optimizedPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
        // Append all children of the optimized picture to the current picture element
        while (optimizedPicture.firstChild) {
          picture.append(optimizedPicture.firstChild);
        }
        // moveInstrumentation should be called on the original cell and the new picture element
        // or on the original img and the new img within the optimized picture
        moveInstrumentation(desktopImg, picture.querySelector('img'));
      }

      mediaWrapper.append(picture);

      const cardInfo = document.createElement('div');
      cardInfo.classList.add('cmp-card__info');

      const cardTitle = document.createElement('div');
      cardTitle.classList.add('cmp-card__title');
      const dateCategoryP = document.createElement('p');
      dateCategoryP.classList.add('body-2');
      dateCategoryP.textContent = dateAndCategoryCell.textContent.trim();
      cardTitle.append(dateCategoryP);

      const cardDescription = document.createElement('div');
      cardDescription.classList.add('cmp-card__description');
      const headlineH4 = document.createElement('h4');
      headlineH4.textContent = headlineCell.textContent.trim();
      cardDescription.append(headlineH4);

      cardInfo.append(cardTitle, cardDescription);
      cardContent.append(mediaWrapper, cardInfo);
      cardLinkAnchor.append(cardContent);
      container.append(cardLinkAnchor);
    });

  root.append(container);

  const exploreMoreDiv = document.createElement('div');
  exploreMoreDiv.classList.add('exploremore', 'button', 'cmp-button--secondary');

  const exploreAllLink = document.createElement('a');
  exploreAllLink.classList.add('cmp-button');
  const foundExploreAllLink = exploreAllLinkRow.querySelector('a');
  if (foundExploreAllLink) {
    exploreAllLink.href = foundExploreAllLink.href;
  }
  moveInstrumentation(exploreAllLinkRow, exploreAllLink);

  const exploreAllSpan = document.createElement('span');
  exploreAllSpan.classList.add('cmp-button__text');
  exploreAllSpan.textContent = exploreAllLabelRow.textContent.trim();
  moveInstrumentation(exploreAllLabelRow, exploreAllSpan);

  exploreAllLink.append(exploreAllSpan);
  exploreMoreDiv.append(exploreAllLink);
  root.append(exploreMoreDiv);

  block.replaceChildren(root);
}
