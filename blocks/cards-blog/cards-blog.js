import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Model: blogCards (container) | ctaLabel (text) | ctaLink (aem-content)
  // The first two rows are for ctaLabel and ctaLink, the rest are blogCardItemRows.
  // The 'blogCards' container field itself does not correspond to a physical row in block.children.
  const [ctaLabelRow, ctaLinkRow, ...blogCardItemRows] = children;

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('cards');
  // No instrumentation to move for a non-existent blogCardsContainerRow.
  // The block itself is the container for blogCards.

  const blogDetailsWrapper = document.createElement('div');
  blogDetailsWrapper.classList.add('cmp-card--blog-details', 'cmp-card--default');
  cardsWrapper.append(blogDetailsWrapper);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('cmp-card__container');
  blogDetailsWrapper.append(cardContainer);

  blogCardItemRows.forEach((row) => {
    // Fixed schema for blog-card-item: imageDesktop | imageMobile | dateAndType | title | link
    const [imageDesktopCell, imageMobileCell, dateAndTypeCell, titleCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // From original HTML
    }
    moveInstrumentation(row, cardLink); // Move instrumentation from the row to the main link

    const cardContent = document.createElement('div');
    cardContent.classList.add('cmp-card__content');
    cardContent.setAttribute('tabindex', '0');
    cardLink.append(cardContent);

    const cardMedia = document.createElement('div');
    cardMedia.classList.add('cmp-card__media', 'youtube-url-wrapper');
    cardContent.append(cardMedia);

    if (imageDesktopCell || imageMobileCell) {
      const picture = document.createElement('picture');
      if (imageMobileCell) {
        const mobileImg = imageMobileCell.querySelector('img');
        if (mobileImg) {
          const sourceMobile = document.createElement('source');
          sourceMobile.media = '(max-width:767px)';
          sourceMobile.srcset = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '360' }]).querySelector('img').src;
          picture.append(sourceMobile);
        }
      }

      if (imageDesktopCell) {
        const desktopImg = imageDesktopCell.querySelector('img');
        if (desktopImg) {
          const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]).querySelector('img');
          img.alt = desktopImg.alt;
          img.title = titleCell?.textContent.trim() || ''; // From original HTML
          img.loading = 'lazy';
          img.fetchPriority = 'low';
          moveInstrumentation(imageDesktopCell, img);
          picture.append(img);
        }
      }
      cardMedia.append(picture);
    }

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cmp-card__info');
    cardContent.append(cardInfo);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('cmp-card__title');
    cardInfo.append(cardTitle);

    const dateAndType = document.createElement('p');
    dateAndType.classList.add('body-2');
    dateAndType.textContent = dateAndTypeCell?.textContent.trim() || '';
    cardTitle.append(dateAndType);

    const cardDescription = document.createElement('div');
    cardDescription.classList.add('cmp-card__description');
    cardInfo.append(cardDescription);

    const title = document.createElement('h4');
    title.textContent = titleCell?.textContent.trim() || '';
    cardDescription.append(title);

    cardContainer.append(cardLink);
  });

  const exploreMoreDiv = document.createElement('div');
  exploreMoreDiv.classList.add('exploremore', 'button', 'cmp-button--secondary');
  cardsWrapper.append(exploreMoreDiv);

  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add('cmp-button');
  const ctaLink = ctaLinkRow?.querySelector('a');
  if (ctaLink) {
    ctaAnchor.href = ctaLink.href;
  }
  moveInstrumentation(ctaLinkRow, ctaAnchor);

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('cmp-button__text');
  ctaSpan.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaAnchor.append(ctaSpan);

  exploreMoreDiv.append(ctaAnchor);

  block.replaceChildren(cardsWrapper);
}
