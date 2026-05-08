import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // BlockJson model:
  // - block.children[0] is the 'title' field (richtext)
  // - Subsequent rows are 'tabs' (container of stats-tab-item) and 'cards' (container of stats-card-item)
  //   stats-tab-item has 5 cells
  //   stats-card-item has 4 cells

  const [titleRow, ...restRows] = children;
  const tabItemRows = restRows.filter((row) => row.children.length === 5);
  const cardItemRows = restRows.filter((row) => row.children.length === 4);

  const root = document.createElement('div');
  root.classList.add('cmp-stats-by-the-number__container');
  moveInstrumentation(block, root);

  // Title Section
  const titleSection = document.createElement('div');
  titleSection.classList.add('cmp-stats-by-the-number__title');
  moveInstrumentation(titleRow, titleSection);
  // Title is richtext, so use innerHTML
  titleSection.innerHTML = titleRow.children[0]?.innerHTML || '';
  root.append(titleSection);

  // Tabs Section
  const tabsSection = document.createElement('div');
  tabsSection.classList.add('cmp-stats-by-the-number__tabs');
  const tabContents = [];
  const imageContainers = [];

  tabItemRows.forEach((row, index) => {
    // stats-tab-item has a fixed schema of 5 cells
    const [tabLabelCell, mainImageCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [
      ...row.children,
    ];

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.classList.add('cmp-stats-by-the-number__tab');
    if (index === 0) {
      tabButton.classList.add('cmp-stats-by-the-number__tab--active');
    }
    tabButton.textContent = tabLabelCell.textContent.trim();
    tabButton.dataset.tab = tabLabelCell.textContent.trim();
    tabButton.dataset.tabIndex = index;
    moveInstrumentation(tabLabelCell, tabButton); // Move instrumentation for tab label

    tabsSection.append(tabButton);

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('cmp-stats-by-the-number__image-container');
    if (index === 0) {
      imageContainer.classList.add('cmp-stats-by-the-number__image-container--active');
    }
    imageContainer.dataset.tabContent = index;
    // The mainImageCell contains the picture element
    const picture = mainImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('cmp-stats-by-the-number__main-image');
        optimizedImg.dataset.tabImage = index;
        imageContainer.append(optimizedPic);
        moveInstrumentation(mainImageCell, optimizedPic); // Move instrumentation from image cell
      }
    }
    imageContainers.push(imageContainer);

    // Create tab content container
    const tabContent = document.createElement('div');
    tabContent.classList.add('cmp-stats-by-the-number__tab-content');
    if (index === 0) {
      tabContent.classList.add('cmp-stats-by-the-number__tab-content--active');
    }
    tabContent.dataset.tabContent = index;
    moveInstrumentation(row, tabContent); // Move instrumentation from tab item row

    // Description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cmp-stats-by-the-number__description');
    // Description is richtext, so use innerHTML
    descriptionDiv.innerHTML = descriptionCell.innerHTML || '';
    tabContent.append(descriptionDiv);

    // Stats Cards Grid
    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('cmp-stats-by-the-number__cards');
    cardsGrid.setAttribute('role', 'list');
    tabContent.append(cardsGrid);

    // Filter cards for the current tab
    // This logic assumes an equal distribution of cards per tab.
    // A more robust solution might involve a data attribute on tabItemRows
    // to indicate how many cards belong to it, or a unique identifier.
    // For now, we'll proceed with the assumption of equal distribution.
    const cardsPerTab = cardItemRows.length / tabItemRows.length;
    const startIndex = index * cardsPerTab;
    const endIndex = startIndex + cardsPerTab;
    const cardsForTab = cardItemRows.slice(startIndex, endIndex);

    cardsForTab.forEach((cardRow) => {
      // stats-card-item has a fixed schema of 4 cells
      const [hoverImageCell, hoverDetailsCell, statNumberCell, statDescriptionCell] = [
        ...cardRow.children,
      ];

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('cmp-stats-by-the-number__card');
      cardDiv.setAttribute('role', 'img');
      cardDiv.setAttribute('tabindex', '0');
      moveInstrumentation(cardRow, cardDiv); // Move instrumentation from card item row

      const hoverImage = hoverImageCell.querySelector('img');
      if (hoverImage) {
        cardDiv.dataset.hoverImage = hoverImage.src;
      }
      // Hover Details is richtext, so use innerHTML
      cardDiv.dataset.hoverDetails = hoverDetailsCell.innerHTML || '';

      const statNumberDiv = document.createElement('div');
      statNumberDiv.classList.add('cmp-stats-by-the-number__card__number');
      // Stat Number is richtext, so use innerHTML
      statNumberDiv.innerHTML = statNumberCell.innerHTML || '';
      cardDiv.append(statNumberDiv);

      const statDescriptionDiv = document.createElement('div');
      statDescriptionDiv.classList.add('cmp-stats-by-the-number__card__description');
      // Stat Description is richtext, so use innerHTML
      statDescriptionDiv.innerHTML = statDescriptionCell.innerHTML || '';
      cardDiv.append(statDescriptionDiv);

      cardsGrid.append(cardDiv);
    });

    // CTA Button
    const ctaDiv = document.createElement('div');
    ctaDiv.classList.add('cmp-stats-by-the-number__cta');
    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const anchor = document.createElement('a');
      anchor.classList.add('cta', 'cta__primary');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabelCell.textContent.trim();
      moveInstrumentation(ctaLinkCell, anchor); // Move instrumentation from CTA link cell

      // Original HTML uses a span with classes for the icon. Replicate that.
      const icon = document.createElement('span');
      icon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
      icon.setAttribute('aria-hidden', 'true');
      anchor.prepend(icon);

      ctaDiv.append(anchor);
    }
    tabContent.append(ctaDiv);

    tabContents.push(tabContent);
  });

  root.append(tabsSection);

  // Main Content Layout
  const mainContent = document.createElement('div');
  mainContent.classList.add('cmp-stats-by-the-number__main-content');

  const imageSection = document.createElement('div');
  imageSection.classList.add('cmp-stats-by-the-number__image-section');
  imageContainers.forEach((imgContainer) => imageSection.append(imgContainer));
  mainContent.append(imageSection);

  const contentSection = document.createElement('div');
  contentSection.classList.add('cmp-stats-by-the-number__content-section');
  tabContents.forEach((tabContent) => contentSection.append(tabContent));
  mainContent.append(contentSection);

  root.append(mainContent);

  block.replaceChildren(root);

  // Add event listeners for tabs
  const tabButtons = block.querySelectorAll('.cmp-stats-by-the-number__tab');
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabIndex = button.dataset.tabIndex;

      // Deactivate all tabs and activate the clicked one
      block.querySelectorAll('.cmp-stats-by-the-number__tab').forEach((btn) => {
        btn.classList.remove('cmp-stats-by-the-number__tab--active');
      });
      button.classList.add('cmp-stats-by-the-number__tab--active');

      // Deactivate all tab contents and activate the corresponding one
      block.querySelectorAll('.cmp-stats-by-the-number__tab-content').forEach((content) => {
        content.classList.remove('cmp-stats-by-the-number__tab-content--active');
      });
      block
        .querySelector(`.cmp-stats-by-the-number__tab-content[data-tab-content="${tabIndex}"]`)
        .classList.add('cmp-stats-by-the-number__tab-content--active');

      // Deactivate all image containers and activate the corresponding one
      block.querySelectorAll('.cmp-stats-by-the-number__image-container').forEach((imgCont) => {
        imgCont.classList.remove('cmp-stats-by-the-number__image-container--active');
      });
      block
        .querySelector(`.cmp-stats-by-the-number__image-container[data-tab-content="${tabIndex}"]`)
        .classList.add('cmp-stats-by-the-number__image-container--active');
    });
  });
}
