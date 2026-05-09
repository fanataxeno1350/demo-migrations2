import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // The first row is always the title.
  const [titleRow, ...remainingRows] = children;

  // Filter tab and card item rows based on cell count.
  // stats-tab-item has 5 cells (tabLabel, backgroundImage, description, ctaLink, ctaLabel)
  // stats-card-item has 4 cells (statNumber, statLabel, hoverImage, hoverDetails)
  const tabItemRows = remainingRows.filter((row) => row.children.length === 5);
  const cardItemRows = remainingRows.filter((row) => row.children.length === 4);

  const container = document.createElement('div');
  container.classList.add('cmp-stats-by-the-number__container');
  moveInstrumentation(block, container);

  // Title Section
  const titleSection = document.createElement('div');
  titleSection.classList.add('cmp-stats-by-the-number__title');
  moveInstrumentation(titleRow, titleSection);
  const title = document.createElement('h2');
  // title field is richtext, so use innerHTML
  title.innerHTML = titleRow.children[0]?.innerHTML || '';
  titleSection.append(title);
  container.append(titleSection);

  // Tabs Section
  const tabsSection = document.createElement('div');
  tabsSection.classList.add('cmp-stats-by-the-number__tabs');
  container.append(tabsSection);

  // Main Content Layout
  const mainContent = document.createElement('div');
  mainContent.classList.add('cmp-stats-by-the-number__main-content');
  container.append(mainContent);

  // Left Side - Dynamic Image
  const imageSection = document.createElement('div');
  imageSection.classList.add('cmp-stats-by-the-number__image-section');
  mainContent.append(imageSection);

  // Right Side - Content and Stats
  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-stats-by-the-number__content-section');
  mainContent.append(contentSection);

  const tabContents = [];
  const cardGroups = []; // This will hold the cardsGrid elements for each tab

  tabItemRows.forEach((row, tabIndex) => {
    // Destructure cells for stats-tab-item
    const [tabLabelCell, backgroundImageCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('cmp-stats-by-the-number__tab');
    if (tabIndex === 0) {
      tabButton.classList.add('cmp-stats-by-the-number__tab--active');
    }
    tabButton.dataset.tab = tabLabelCell.textContent.trim();
    tabButton.dataset.tabIndex = tabIndex;
    tabButton.textContent = tabLabelCell.textContent.trim();
    tabsSection.append(tabButton);
    moveInstrumentation(tabLabelCell, tabButton);

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('cmp-stats-by-the-number__image-container');
    if (tabIndex === 0) {
      imageContainer.classList.add('cmp-stats-by-the-number__image-container--active');
    }
    imageContainer.dataset.tabContent = tabIndex;
    const picture = backgroundImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // createOptimizedPicture handles alt text and other attributes
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('cmp-stats-by-the-number__main-image');
      optimizedImg.dataset.tabImage = tabIndex;
      imageContainer.append(optimizedPic);
      moveInstrumentation(backgroundImageCell, optimizedPic);
    }
    imageSection.append(imageContainer);

    // Create tab content container
    const tabContent = document.createElement('div');
    tabContent.classList.add('cmp-stats-by-the-number__tab-content');
    if (tabIndex === 0) {
      tabContent.classList.add('cmp-stats-by-the-number__tab-content--active');
    }
    tabContent.dataset.tabContent = tabIndex;
    contentSection.append(tabContent);
    tabContents.push(tabContent);
    // moveInstrumentation for the entire tab content container
    moveInstrumentation(row, tabContent); // Move from the tab row itself

    // Description Text
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-stats-by-the-number__description');
    // description field is richtext, so use innerHTML
    descriptionDiv.innerHTML = descriptionCell?.innerHTML || '';
    tabContent.append(descriptionDiv);

    // Stats Cards Grid
    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('cmp-stats-by-the-number__cards');
    cardsGrid.setAttribute('role', 'list');
    tabContent.append(cardsGrid);
    cardGroups.push(cardsGrid); // Store the cardsGrid for later population

    // Call to Action Button
    const ctaDiv = document.createElement('div');
    ctaDiv.classList.add('cmp-stats-by-the-number__cta');
    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.classList.add('cta', 'cta__primary');
      anchor.textContent = ctaLabelCell.textContent.trim();
      anchor.setAttribute('aria-label', ctaLabelCell.textContent.trim());
      const icon = document.createElement('span');
      icon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
      icon.setAttribute('aria-hidden', 'true');
      anchor.prepend(icon);
      ctaDiv.append(anchor);
      moveInstrumentation(ctaLinkCell, anchor);
    }
    tabContent.append(ctaDiv);
  });

  // Populate card groups
  // The BlockJson indicates 'cards' is a container field within 'stats-tab-item'.
  // However, the EDS block structure shows stats-card-item rows as siblings.
  // We need to associate them. The ORIGINAL HTML shows 4 cards per tab.
  const cardsPerTab = 4;
  let currentCardItemIndex = 0; // Track which cardItemRow we are processing

  cardGroups.forEach((cardsGrid, tabIndex) => {
    for (let i = 0; i < cardsPerTab && currentCardItemIndex < cardItemRows.length; i++) {
      const cardRow = cardItemRows[currentCardItemIndex];
      // Destructure cells for stats-card-item
      const [statNumberCell, statLabelCell, hoverImageCell, hoverDetailsCell] = [...cardRow.children];

      const card = document.createElement('div');
      card.classList.add('cmp-stats-by-the-number__card');
      card.setAttribute('role', 'img');
      card.setAttribute('tabindex', '0');

      const statNumberDiv = document.createElement('div');
      statNumberDiv.classList.add('cmp-stats-by-the-number__card__number');
      // statNumber field is richtext, so use innerHTML
      statNumberDiv.innerHTML = statNumberCell?.innerHTML || '';
      card.append(statNumberDiv);

      const statLabelDiv = document.createElement('div');
      statLabelDiv.classList.add('cmp-stats-by-the-number__card__description');
      // statLabel is text, wrap in p as per original HTML
      statLabelDiv.innerHTML = `<p>${statLabelCell.textContent.trim()}</p>`;
      card.append(statLabelDiv);

      const hoverImage = hoverImageCell.querySelector('picture > img');
      if (hoverImage) {
        card.dataset.hoverImage = hoverImage.src;
      }
      // hoverDetails field is richtext, so use innerHTML
      card.dataset.hoverDetails = hoverDetailsCell?.innerHTML || '';
      card.setAttribute('aria-label', `${statNumberCell.textContent.trim()}: ${statLabelCell.textContent.trim()}`);

      cardsGrid.append(card);
      moveInstrumentation(cardRow, card); // Move instrumentation from the card row to the new card div
      currentCardItemIndex++;
    }
  });

  // Tab switching logic
  tabsSection.querySelectorAll('.cmp-stats-by-the-number__tab').forEach((button) => {
    button.addEventListener('click', () => {
      const tabIndex = button.dataset.tabIndex;

      // Deactivate all tabs and content
      tabsSection.querySelectorAll('.cmp-stats-by-the-number__tab').forEach((btn) => {
        btn.classList.remove('cmp-stats-by-the-number__tab--active');
      });
      imageSection.querySelectorAll('.cmp-stats-by-the-number__image-container').forEach((imgContainer) => {
        imgContainer.classList.remove('cmp-stats-by-the-number__image-container--active');
      });
      contentSection.querySelectorAll('.cmp-stats-by-the-number__tab-content').forEach((tabContent) => {
        tabContent.classList.remove('cmp-stats-by-the-number__tab-content--active');
      });

      // Activate selected tab and content
      button.classList.add('cmp-stats-by-the-number__tab--active');
      imageSection.querySelector(`[data-tab-content="${tabIndex}"]`).classList.add('cmp-stats-by-the-number__image-container--active');
      contentSection.querySelector(`[data-tab-content="${tabIndex}"]`).classList.add('cmp-stats-by-the-number__tab-content--active');
    });
  });

  // Card hover logic (for hover image and details)
  contentSection.querySelectorAll('.cmp-stats-by-the-number__card').forEach((card) => {
    const hoverImageSrc = card.dataset.hoverImage;
    const hoverDetailsHtml = card.dataset.hoverDetails;

    // Create hover details overlay
    const hoverOverlay = document.createElement('div');
    // No specific class for overlay in ORIGINAL HTML, so we'll add content directly
    hoverOverlay.innerHTML = hoverDetailsHtml;

    // Create hover image element
    const hoverImage = document.createElement('img');
    // No specific class for hover image in ORIGINAL HTML
    hoverImage.src = hoverImageSrc;
    hoverImage.alt = card.getAttribute('aria-label'); // Use card's aria-label as alt text

    card.addEventListener('mouseenter', () => {
      // Append hover image and overlay to the card for display
      card.append(hoverImage, hoverOverlay);
      // No specific class for hover state in ORIGINAL HTML, manage visibility with CSS on card
    });

    card.addEventListener('mouseleave', () => {
      hoverImage.remove();
      hoverOverlay.remove();
    });
  });

  block.replaceChildren(container);
}
