import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const titleRow = children.shift(); // First row is always the block title

  const statsTabs = [];
  const statsCards = [];

  // Separate stats-tab and stats-card rows based on cell count and content type
  children.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 5) {
      // stats-tab has a picture in the second cell (index 1)
      // stats-card has a picture in the first cell (index 0)
      if (cells[1]?.querySelector('picture')) {
        statsTabs.push(row);
      } else if (cells[0]?.querySelector('picture')) {
        statsCards.push(row);
      }
    }
  });

  const root = document.createElement('div');
  root.classList.add('cmp-stats-by-the-number__container');
  moveInstrumentation(block, root); // Move instrumentation from the original block div to the new root

  // Title Section
  if (titleRow) {
    const titleSection = document.createElement('div');
    titleSection.classList.add('cmp-stats-by-the-number__title');
    moveInstrumentation(titleRow, titleSection);
    // Read innerHTML from the cell, not the row, to avoid invalid nesting
    titleSection.innerHTML = titleRow.children[0]?.innerHTML || '';
    root.append(titleSection);
  }

  // Tabs Section
  const tabsSection = document.createElement('div');
  tabsSection.classList.add('cmp-stats-by-the-number__tabs');
  const mainContent = document.createElement('div');
  mainContent.classList.add('cmp-stats-by-the-number__main-content');
  const imageSection = document.createElement('div');
  imageSection.classList.add('cmp-stats-by-the-number__image-section');
  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-stats-by-the-number__content-section');

  // Keep track of which cards belong to which tab
  const tabCardMap = new Map();
  let cardIndex = 0;
  statsTabs.forEach((tabRow, tabIndex) => {
    // For each tab, determine how many cards follow it in the original structure
    // This assumes cards for a tab immediately follow that tab's row.
    // This is a heuristic and might need adjustment if the content structure changes.
    const cardsForThisTab = [];
    while (cardIndex < statsCards.length) {
      const cardRow = statsCards[cardIndex];
      // Check if the cardRow is still part of the current tab's cards.
      // This logic is tricky without explicit markers. For now, we assume
      // cards are grouped sequentially after their tab.
      // A more robust solution would involve a 'tab-id' field on cards.
      // For this block, the original JS's splice logic is problematic.
      // Let's assume the cards are globally ordered and we just need to assign them.
      // The original HTML implies a fixed number of cards per tab.
      // Let's use the original HTML's structure: 4 cards per tab.
      if (cardsForThisTab.length < 4) { // Assuming 4 cards per tab based on original HTML
        cardsForThisTab.push(cardRow);
        cardIndex += 1;
      } else {
        break;
      }
    }
    tabCardMap.set(tabIndex, cardsForThisTab);
  });

  statsTabs.forEach((tabRow, tabIndex) => {
    const [tabLabelCell, mainImageCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...tabRow.children];

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('cmp-stats-by-the-number__tab');
    if (tabIndex === 0) {
      tabButton.classList.add('cmp-stats-by-the-number__tab--active');
    }
    tabButton.dataset.tab = tabLabelCell.textContent.trim();
    tabButton.dataset.tabIndex = tabIndex;
    tabButton.textContent = tabLabelCell.textContent.trim();
    moveInstrumentation(tabLabelCell, tabButton);

    tabsSection.append(tabButton);

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('cmp-stats-by-the-number__image-container');
    if (tabIndex === 0) {
      imageContainer.classList.add('cmp-stats-by-the-number__image-container--active');
    }
    imageContainer.dataset.tabContent = tabIndex;

    const picture = mainImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // The original HTML has data-image-path on the container, but the JS uses img.src.
        // Let's stick to img.src for createOptimizedPicture.
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('cmp-stats-by-the-number__main-image');
        optimizedImg.dataset.tabImage = tabIndex;
        if (tabIndex === 0) {
          optimizedImg.style.opacity = '1';
        }
        imageContainer.append(optimizedPic);
        moveInstrumentation(mainImageCell, optimizedImg);
      }
    }
    imageSection.append(imageContainer);

    // Create tab content container
    const tabContentContainer = document.createElement('div');
    tabContentContainer.classList.add('cmp-stats-by-the-number__tab-content');
    if (tabIndex === 0) {
      tabContentContainer.classList.add('cmp-stats-by-the-number__tab-content--active');
    }
    tabContentContainer.dataset.tabContent = tabIndex;

    // Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-stats-by-the-number__description');
    descriptionDiv.innerHTML = descriptionCell?.innerHTML || '';
    moveInstrumentation(descriptionCell, descriptionDiv);
    tabContentContainer.append(descriptionDiv);

    // Stats Cards Grid
    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('cmp-stats-by-the-number__cards');
    cardsGrid.setAttribute('role', 'list');

    // Use the pre-filtered cards for this tab
    const currentTabCards = tabCardMap.get(tabIndex) || [];

    currentTabCards.forEach((cardRow) => {
      const [hoverImageCell, hoverDetailsCell, numberCell, ariaLabelCell, cardDescriptionCell] = [...cardRow.children];

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('cmp-stats-by-the-number__card');
      cardDiv.setAttribute('role', 'img');
      cardDiv.setAttribute('tabindex', '0');
      // The original HTML uses data-hover-image and data-hover-details directly from content.
      // The JS extracts img.src for data-hover-image.
      cardDiv.dataset.hoverImage = hoverImageCell.querySelector('picture')?.querySelector('img')?.src || '';
      cardDiv.dataset.hoverDetails = hoverDetailsCell?.innerHTML || '';
      cardDiv.setAttribute('aria-label', ariaLabelCell.textContent.trim());
      moveInstrumentation(cardRow, cardDiv);

      const numberDiv = document.createElement('div');
      numberDiv.classList.add('cmp-stats-by-the-number__card__number');
      // The original HTML has a span.readOnlyAuthor with the number, and then the div.
      // The JS reads innerHTML directly from the cell. This is correct for richtext.
      numberDiv.dataset.count = numberCell?.innerHTML || '';
      numberDiv.innerHTML = numberCell?.innerHTML || '';
      moveInstrumentation(numberCell, numberDiv);
      cardDiv.append(numberDiv);

      const cardDescriptionDiv = document.createElement('div');
      cardDescriptionDiv.classList.add('cmp-stats-by-the-number__card__description');
      cardDescriptionDiv.innerHTML = cardDescriptionCell?.innerHTML || '';
      moveInstrumentation(cardDescriptionCell, cardDescriptionDiv);
      cardDiv.append(cardDescriptionDiv);

      cardsGrid.append(cardDiv);
    });
    tabContentContainer.append(cardsGrid);

    // CTA Button
    const ctaDiv = document.createElement('div');
    ctaDiv.classList.add('cmp-stats-by-the-number__cta');

    const ctaAnchor = document.createElement('a');
    ctaAnchor.classList.add('cta', 'cta__primary');
    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      ctaAnchor.href = ctaLink.href;
      if (ctaLink.target) ctaAnchor.target = ctaLink.target;
      if (ctaLink.getAttribute('aria-label')) ctaAnchor.setAttribute('aria-label', ctaLink.getAttribute('aria-label'));
    }
    ctaAnchor.setAttribute('aria-label', ctaLabelCell.textContent.trim());

    const ctaIcon = document.createElement('span');
    ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
    ctaIcon.setAttribute('aria-hidden', 'true');
    ctaAnchor.append(ctaIcon);

    const ctaLabel = document.createElement('span');
    ctaLabel.classList.add('cta__label');
    ctaLabel.textContent = ctaLabelCell.textContent.trim();
    ctaAnchor.append(ctaLabel);

    ctaDiv.append(ctaAnchor);
    moveInstrumentation(ctaLinkCell, ctaAnchor);
    moveInstrumentation(ctaLabelCell, ctaLabel);
    tabContentContainer.append(ctaDiv);

    contentSection.append(tabContentContainer);
  });

  mainContent.append(imageSection, contentSection);
  root.append(tabsSection, mainContent);

  block.replaceChildren(root);

  // Add event listeners for tab switching
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

      imageContainers.forEach((imageContainer) => {
        const mainImage = imageContainer.querySelector('.cmp-stats-by-the-number__main-image');
        if (imageContainer.dataset.tabContent === tabIndex) {
          imageContainer.classList.add('cmp-stats-by-the-number__image-container--active');
          if (mainImage) mainImage.style.opacity = '1';
        } else {
          imageContainer.classList.remove('cmp-stats-by-the-number__image-container--active');
          if (mainImage) mainImage.style.opacity = '0';
        }
      });
    });
  });

  // Image optimization - This section seems redundant if createOptimizedPicture is already used above.
  // The original JS has this at the end, but createOptimizedPicture is already called for main images.
  // This might be for hover images or other images not explicitly handled.
  // Let's keep it for now, assuming it's a general cleanup.
  root.querySelectorAll('picture > img').forEach((img) => {
    // Ensure we don't re-optimize images already handled by createOptimizedPicture for main images
    // or if they are already optimized.
    if (!img.closest('picture').dataset.optimized) { // Add a flag to prevent re-optimization
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
      optimizedPic.dataset.optimized = 'true'; // Mark as optimized
    }
  });
}
