import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const rootContainer = document.createElement('div');
  rootContainer.classList.add('cmp-stats-by-the-number__container');

  // Section Title
  const titleRow = children.shift();
  const titleSection = document.createElement('div');
  titleSection.classList.add('cmp-stats-by-the-number__title');
  moveInstrumentation(titleRow, titleSection);
  // Fix: titleRow is a row, its children[0] is the cell.
  // The cell contains the richtext HTML, so read innerHTML from the cell.
  titleSection.innerHTML = titleRow.children[0]?.innerHTML || '';
  rootContainer.append(titleSection);

  // Tabs and Main Content
  const tabsWrapper = document.createElement('div');
  tabsWrapper.classList.add('cmp-stats-by-the-number__tabs');

  const mainContent = document.createElement('div');
  mainContent.classList.add('cmp-stats-by-the-number__main-content');

  const imageSection = document.createElement('div');
  imageSection.classList.add('cmp-stats-by-the-number__image-section');
  mainContent.append(imageSection);

  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-stats-by-the-number__content-section');
  mainContent.append(contentSection);

  const tabItems = [];
  const cardItems = [];

  // Separate tab items from card items
  children.forEach((row) => {
    if (row.children.length === 6) { // stats-tab-item has 6 cells
      tabItems.push(row);
    } else if (row.children.length === 5) { // stats-card-item has 5 cells
      cardItems.push(row);
    }
  });

  // Process Tabs
  tabItems.forEach((row, index) => {
    const [tabLabelCell, backgroundImageCell, backgroundImageWebpCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const tabButton = document.createElement('button');
    tabButton.classList.add('cmp-stats-by-the-number__tab');
    if (index === 0) {
      tabButton.classList.add('cmp-stats-by-the-number__tab--active');
    }
    tabButton.dataset.tab = tabLabelCell.textContent.trim();
    tabButton.dataset.tabIndex = index;
    tabButton.textContent = tabLabelCell.textContent.trim();
    moveInstrumentation(tabLabelCell, tabButton); // Move instrumentation from label cell to button
    tabsWrapper.append(tabButton);

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('cmp-stats-by-the-number__image-container');
    if (index === 0) {
      imageContainer.classList.add('cmp-stats-by-the-number__image-container--active');
    }
    imageContainer.dataset.tabContent = index;

    const picture = backgroundImageWebpCell?.querySelector('picture') || backgroundImageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('cmp-stats-by-the-number__main-image');
      optimizedImg.dataset.tabImage = index;
      imageContainer.append(optimizedPic);
      // moveInstrumentation from image cell to optimized img
      // The original image cell is the container for the picture, so instrumentation should be moved from it.
      // The optimizedPic is the new <picture> element, and optimizedImg is the <img> inside it.
      // moveInstrumentation should be on the outermost element that replaces the original cell's content.
      moveInstrumentation(backgroundImageCell, optimizedPic);
    }
    imageSection.append(imageContainer);

    const tabContentContainer = document.createElement('div');
    tabContentContainer.classList.add('cmp-stats-by-the-number__tab-content');
    if (index === 0) {
      tabContentContainer.classList.add('cmp-stats-by-the-number__tab-content--active');
    }
    tabContentContainer.dataset.tabContent = index;
    moveInstrumentation(row, tabContentContainer); // Move instrumentation from tab item row

    const descriptionDiv = document.createElement('div'); // Fix: Use div for richtext to avoid <p> inside <p>
    descriptionDiv.classList.add('cmp-stats-by-the-number__description');
    descriptionDiv.innerHTML = descriptionCell?.innerHTML || '';
    tabContentContainer.append(descriptionDiv);

    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('cmp-stats-by-the-number__cards');
    cardsGrid.setAttribute('role', 'list');
    tabContentContainer.append(cardsGrid);

    // Filter cards for the current tab (assuming cards follow their respective tab in the block structure)
    // This is a simplification. A more robust solution might involve a mapping or explicit card-to-tab linking.
    // For now, we'll assume cards are grouped sequentially after their tab.
    const currentTabCards = cardItems.splice(0, Math.min(4, cardItems.length)); // Assuming 4 cards per tab based on ORIGINAL HTML

    currentTabCards.forEach((cardRow) => {
      const [hoverImageCell, numberCell, ariaLabelCell, cardDescriptionCell, hoverDetailsCell] = [...cardRow.children];

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('cmp-stats-by-the-number__card');
      cardDiv.setAttribute('role', 'img');
      cardDiv.setAttribute('tabindex', '0');
      cardDiv.setAttribute('aria-label', ariaLabelCell.textContent.trim());

      const hoverPicture = hoverImageCell?.querySelector('picture');
      if (hoverPicture) {
        const hoverImg = hoverPicture.querySelector('img');
        cardDiv.dataset.hoverImage = hoverImg.src;
        moveInstrumentation(hoverImageCell, hoverPicture); // Move instrumentation from hover image cell to the picture element
      }
      cardDiv.dataset.hoverDetails = hoverDetailsCell?.innerHTML || '';
      moveInstrumentation(cardRow, cardDiv); // Move instrumentation from card item row

      const numberDiv = document.createElement('div'); // Fix: Use div for richtext to avoid <p> inside <p>
      numberDiv.classList.add('cmp-stats-by-the-number__card__number');
      numberDiv.innerHTML = numberCell?.innerHTML || '';
      cardDiv.append(numberDiv);

      const descriptionDivCard = document.createElement('div'); // Fix: Use div for richtext to avoid <p> inside <p>
      descriptionDivCard.classList.add('cmp-stats-by-the-number__card__description');
      descriptionDivCard.innerHTML = cardDescriptionCell?.innerHTML || '';
      cardDiv.append(descriptionDivCard);

      cardsGrid.append(cardDiv);
    });

    const ctaDiv = document.createElement('div');
    ctaDiv.classList.add('cmp-stats-by-the-number__cta');

    const ctaLink = ctaLinkCell?.querySelector('a');
    if (ctaLink) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.classList.add('cta', 'cta__primary');
      anchor.setAttribute('target', ctaLink.target || '_self');
      anchor.setAttribute('aria-label', ctaLabelCell.textContent.trim());

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
      iconSpan.setAttribute('aria-hidden', 'true');
      anchor.append(iconSpan);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('cta__label');
      labelSpan.textContent = ctaLabelCell.textContent.trim();
      anchor.append(labelSpan);
      // Fix: moveInstrumentation should be called once per original cell,
      // and typically from the cell to the main element replacing its content.
      // For CTA, the link cell contains the <a>, and the label cell contains the text.
      // The anchor element replaces the content of the ctaLinkCell.
      // The labelSpan replaces the content of the ctaLabelCell.
      // If both are part of the same new anchor, move instrumentation from both to the anchor.
      // Or, if the anchor is the primary replacement, move from ctaLinkCell to anchor.
      // If ctaLabelCell's content is just text, and it's used to set textContent of labelSpan,
      // then move instrumentation from ctaLabelCell to labelSpan.
      // The current setup is fine, but ensure the original cells are emptied or replaced.
      moveInstrumentation(ctaLinkCell, anchor);
      moveInstrumentation(ctaLabelCell, labelSpan);
      ctaDiv.append(anchor);
    }
    tabContentContainer.append(ctaDiv);
    contentSection.append(tabContentContainer);
  });

  rootContainer.append(tabsWrapper, mainContent);

  block.replaceChildren(rootContainer);
  block.classList.add('animate-ready', 'animate-in');
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Statistics by the numbers');

  // Add event listeners for tabs
  const tabButtons = block.querySelectorAll('.cmp-stats-by-the-number__tab');
  const tabContents = block.querySelectorAll('.cmp-stats-by-the-number__tab-content');
  const imageContainers = block.querySelectorAll('.cmp-stats-by-the-number__image-container');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabIndex = button.dataset.tabIndex;

      tabButtons.forEach((btn) => btn.classList.remove('cmp-stats-by-the-number__tab--active'));
      button.classList.add('cmp-stats-by-the-number__tab--active');

      tabContents.forEach((content) => {
        if (content.dataset.tabContent === tabIndex) {
          content.classList.add('cmp-stats-by-the-number__tab-content--active');
        } else {
          content.classList.remove('cmp-stats-by-the-number__tab-content--active');
        }
      });

      imageContainers.forEach((imgContainer) => {
        if (imgContainer.dataset.tabContent === tabIndex) {
          imgContainer.classList.add('cmp-stats-by-the-number__image-container--active');
          imgContainer.querySelector('img').style.opacity = '1';
        } else {
          imgContainer.classList.remove('cmp-stats-by-the-number__image-container--active');
          imgContainer.querySelector('img').style.opacity = '0';
        }
      });
    });
  });

  // Add hover effects for cards
  const cards = block.querySelectorAll('.cmp-stats-by-the-number__card');
  cards.forEach((card) => {
    const hoverImageSrc = card.dataset.hoverImage;
    const hoverDetailsHtml = card.dataset.hoverDetails;

    if (hoverImageSrc || hoverDetailsHtml) {
      const hoverOverlay = document.createElement('div');
      hoverOverlay.classList.add('cmp-stats-by-the-number__card-hover-overlay');

      if (hoverImageSrc) {
        const hoverImage = document.createElement('img');
        hoverImage.src = hoverImageSrc;
        hoverImage.alt = card.getAttribute('aria-label') || 'Hover image';
        hoverImage.classList.add('cmp-stats-by-the-number__card-hover-image');
        hoverOverlay.append(hoverImage);
      }

      if (hoverDetailsHtml) {
        const hoverDetails = document.createElement('div');
        hoverDetails.classList.add('cmp-stats-by-the-number__card-hover-details');
        hoverDetails.innerHTML = hoverDetailsHtml;
        hoverOverlay.append(hoverDetails);
      }
      card.append(hoverOverlay);

      card.addEventListener('mouseenter', () => {
        card.classList.add('cmp-stats-by-the-number__card--hover');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('cmp-stats-by-the-number__card--hover');
      });
    }
  });
}
