import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const root = document.createElement('div');
  root.classList.add('cmp-stats-by-the-number__container');

  // Block Title
  const titleRow = children.shift();
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('cmp-stats-by-the-number__title');
  moveInstrumentation(titleRow, titleDiv);
  // Corrected: Use destructuring for fixed schema, and innerHTML for richtext
  const [titleCell] = [...titleRow.children];
  titleDiv.innerHTML = titleCell?.innerHTML || '';
  root.append(titleDiv);

  const tabRows = [];
  const statsCardRows = [];

  // Separate tab rows from stats card rows
  children.forEach((row) => {
    if (row.children.length === 5) { // stats-tab has 5 cells
      tabRows.push(row);
    } else if (row.children.length === 4) { // stats-card has 4 cells
      statsCardRows.push(row);
    }
  });

  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add('cmp-stats-by-the-number__tabs');

  const mainContent = document.createElement('div');
  mainContent.classList.add('cmp-stats-by-the-number__main-content');

  const imageSection = document.createElement('div');
  imageSection.classList.add('cmp-stats-by-the-number__image-section');

  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-stats-by-the-number__content-section');

  // Map to store stats cards per tab index
  const cardsPerTabMap = new Map();
  let cardIndex = 0;
  // This assumes a fixed number of cards per tab based on the original HTML example.
  // A more robust solution would require a field in stats-tab to specify card count
  // or a different block structure where stats-card rows are direct children of stats-tab rows.
  const cardsPerTab = 4; // Based on original HTML example

  tabRows.forEach((row, i) => {
    const [tabLabelCell, mainImageCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('cmp-stats-by-the-number__tab');
    if (i === 0) {
      tabButton.classList.add('cmp-stats-by-the-number__tab--active');
    }
    tabButton.dataset.tab = tabLabelCell.textContent.trim();
    tabButton.dataset.tabIndex = i;
    tabButton.textContent = tabLabelCell.textContent.trim();
    moveInstrumentation(tabLabelCell, tabButton);
    tabsContainer.append(tabButton);

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('cmp-stats-by-the-number__image-container');
    if (i === 0) {
      imageContainer.classList.add('cmp-stats-by-the-number__image-container--active');
    }
    imageContainer.dataset.tabContent = i;

    const picture = mainImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('cmp-stats-by-the-number__main-image');
      optimizedImg.dataset.tabImage = i;
      imageContainer.append(optimizedPic);
      moveInstrumentation(mainImageCell, optimizedImg);
    }
    imageSection.append(imageContainer);

    // Create tab content container
    const tabContent = document.createElement('div');
    tabContent.classList.add('cmp-stats-by-the-number__tab-content');
    if (i === 0) {
      tabContent.classList.add('cmp-stats-by-the-number__tab-content--active');
    }
    tabContent.dataset.tabContent = i;
    moveInstrumentation(row, tabContent);

    // Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-stats-by-the-number__description');
    descriptionDiv.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, descriptionDiv);
    tabContent.append(descriptionDiv);

    // Stats Cards Grid
    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('cmp-stats-by-the-number__cards');
    cardsGrid.setAttribute('role', 'list');

    // Slice statsCardRows for the current tab based on the hardcoded cardsPerTab
    const currentTabStatsCards = statsCardRows.slice(cardIndex, cardIndex + cardsPerTab);
    cardIndex += cardsPerTab; // Increment for the next tab

    currentTabStatsCards.forEach((cardRow) => {
      const [hoverImageCell, statNumberCell, statDescriptionCell, hoverDetailsCell] = [...cardRow.children];

      const card = document.createElement('div');
      card.classList.add('cmp-stats-by-the-number__card');
      card.setAttribute('role', 'img');
      card.setAttribute('tabindex', '0');

      const hoverImage = hoverImageCell.querySelector('picture > img');
      if (hoverImage) {
        card.dataset.hoverImage = hoverImage.src;
      }
      card.dataset.hoverDetails = hoverDetailsCell.innerHTML;
      card.setAttribute('aria-label', `${statNumberCell.textContent.trim()}: ${statDescriptionCell.textContent.trim()}`);
      moveInstrumentation(cardRow, card);

      // Stat Number (richtext)
      const statNumberDiv = document.createElement('div');
      statNumberDiv.classList.add('cmp-stats-by-the-number__card__number');
      statNumberDiv.dataset.count = statNumberCell.innerHTML; // data-count from original HTML
      statNumberDiv.innerHTML = statNumberCell.innerHTML;
      moveInstrumentation(statNumberCell, statNumberDiv);
      card.append(statNumberDiv);

      // Stat Description (text)
      const statDescriptionDiv = document.createElement('div');
      statDescriptionDiv.classList.add('cmp-stats-by-the-number__card__description');
      // Corrected: statDescription is type=text, so read textContent.trim()
      // and wrap in a div to avoid <p> inside <p> if descriptionDiv is a <p>
      // The original HTML wraps it in <p></p><p>Of space to Play</p><p></p>
      // so we should just take the text and wrap it in a single <p>
      statDescriptionDiv.innerHTML = `<p>${statDescriptionCell.textContent.trim()}</p>`;
      moveInstrumentation(statDescriptionCell, statDescriptionDiv);
      card.append(statDescriptionDiv);

      cardsGrid.append(card);
    });
    tabContent.append(cardsGrid);

    // CTA Button
    const ctaDiv = document.createElement('div');
    ctaDiv.classList.add('cmp-stats-by-the-number__cta');
    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const anchor = document.createElement('a');
      anchor.classList.add('cta', 'cta__primary');
      anchor.href = ctaLink.href;
      anchor.setAttribute('aria-label', ctaLabelCell.textContent.trim());
      anchor.setAttribute('target', ctaLink.getAttribute('target') || '_self');
      // Corrected: data-palette is hardcoded in original HTML, so keep it
      anchor.dataset.palette = 'palette-1';

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
      iconSpan.setAttribute('aria-hidden', 'true');
      anchor.append(iconSpan);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('cta__label');
      labelSpan.textContent = ctaLabelCell.textContent.trim();
      anchor.append(labelSpan);

      moveInstrumentation(ctaLinkCell, anchor);
      moveInstrumentation(ctaLabelCell, labelSpan);
      ctaDiv.append(anchor);
    }
    tabContent.append(ctaDiv);

    contentSection.append(tabContent);
  });

  mainContent.append(imageSection, contentSection);
  root.append(tabsContainer, mainContent);

  block.replaceChildren(root);
  block.classList.add('animate-ready', 'animate-in');

  // Add event listeners for tab switching
  const tabButtons = block.querySelectorAll('.cmp-stats-by-the-number__tab');
  const imageContainers = block.querySelectorAll('.cmp-stats-by-the-number__image-container');
  const tabContents = block.querySelectorAll('.cmp-stats-by-the-number__tab-content');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabIndex = button.dataset.tabIndex;

      tabButtons.forEach((btn) => btn.classList.remove('cmp-stats-by-the-number__tab--active'));
      button.classList.add('cmp-stats-by-the-number__tab--active');

      imageContainers.forEach((container) => {
        if (container.dataset.tabContent === tabIndex) {
          container.classList.add('cmp-stats-by-the-number__image-container--active');
          const img = container.querySelector('.cmp-stats-by-the-number__main-image');
          if (img) img.style.opacity = '1';
        } else {
          container.classList.remove('cmp-stats-by-the-number__image-container--active');
          const img = container.querySelector('.cmp-stats-by-the-number__main-image');
          if (img) img.style.opacity = '0';
        }
      });

      tabContents.forEach((content) => {
        if (content.dataset.tabContent === tabIndex) {
          content.classList.add('cmp-stats-by-the-number__tab-content--active');
        } else {
          content.classList.remove('cmp-stats-by-the-number__tab-content--active');
        }
      });
    });
  });

  // Removed redundant image optimization loop at the end.
  // Images are already optimized when created within the tabRows.forEach loop.
}
