import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const tabItems = [];
  const cardItems = [];

  // Separate tab-item rows from card-item rows based on cell count
  children.forEach((row) => {
    // A tab-item has 4 cells: tabLabel, description, exploreAllLink, exploreAllLabel
    // It also has a container field "cards", but this doesn't add a cell to the row.
    if (row.children.length === 4) {
      tabItems.push(row);
    }
    // A card-item has 5 cells: link, imageDesktopDefault, imageMobileDefault, imageDesktopHover, imageMobileHover
    else if (row.children.length === 5) {
      cardItems.push(row);
    }
  });

  const tabList = document.createElement('ol');
  tabList.classList.add('cmp-tabs__tablist');
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-multiselectable', 'false');

  const tabPanelsContainer = document.createElement('div');

  tabItems.forEach((tabRow, index) => {
    const [tabLabelCell, descriptionCell, exploreAllLinkCell, exploreAllLabelCell] = [...tabRow.children];

    const tabLabel = tabLabelCell.textContent.trim();
    const tabId = `tab-${index}`;
    const panelId = `tabpanel-${index}`;

    // Create tab item
    const tabLi = document.createElement('li');
    tabLi.classList.add('cmp-tabs__tab');
    tabLi.setAttribute('role', 'tab');
    tabLi.id = `${block.id || 'tabs'}-item-${tabId}-tab`;
    tabLi.setAttribute('aria-controls', `${block.id || 'tabs'}-item-${panelId}-tabpanel`);
    tabLi.setAttribute('tabindex', index === 0 ? '0' : '-1');
    tabLi.setAttribute('data-cmp-hook-tabs', 'tab');
    tabLi.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabLi.textContent = tabLabel;
    moveInstrumentation(tabRow, tabLi); // Move instrumentation from tabRow to tabLi

    if (index === 0) {
      tabLi.classList.add('cmp-tabs__tab--active');
    }

    tabList.append(tabLi);

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.classList.add('cmp-tabs__tabpanel');
    tabPanel.id = `${block.id || 'tabs'}-item-${panelId}-tabpanel`;
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-labelledby', tabLi.id);
    tabPanel.setAttribute('tabindex', '0');
    tabPanel.setAttribute('data-cmp-hook-tabs', 'tabpanel');

    if (index !== 0) {
      tabPanel.setAttribute('aria-hidden', 'true');
    } else {
      tabPanel.classList.add('cmp-tabs__tabpanel--active');
    }

    // Tab description
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cards__description', 'text');
    descriptionDiv.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, descriptionDiv);

    // Explore All Link
    const exploreAllLinkDiv = document.createElement('div');
    exploreAllLinkDiv.classList.add('exploremore', 'button', 'cmp-button--secondary');
    const exploreAllAnchor = document.createElement('a');
    exploreAllAnchor.classList.add('cmp-button');
    const foundExploreAllLink = exploreAllLinkCell.querySelector('a');
    if (foundExploreAllLink) {
      exploreAllAnchor.href = foundExploreAllLink.href;
    }
    exploreAllAnchor.textContent = exploreAllLabelCell.textContent.trim();
    exploreAllLinkDiv.append(exploreAllAnchor);
    moveInstrumentation(exploreAllLinkCell, exploreAllLinkDiv);
    moveInstrumentation(exploreAllLabelCell, exploreAllLinkDiv);

    // Cards container
    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('cards');
    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cmp-card--image-hover', 'cmp-card--default');
    const cardContentContainer = document.createElement('div');
    cardContentContainer.classList.add('cmp-card__container');

    cardItems.forEach((cardRow) => {
      const [
        cardLinkCell,
        imageDesktopDefaultCell,
        imageMobileDefaultCell,
        imageDesktopHoverCell,
        imageMobileHoverCell,
      ] = [...cardRow.children];

      const cardLink = cardLinkCell.querySelector('a');
      const cardAnchor = document.createElement('a');
      if (cardLink) {
        cardAnchor.href = cardLink.href;
      }

      const cardContent = document.createElement('div');
      cardContent.classList.add('cmp-card__content');
      cardContent.setAttribute('tabindex', '0');

      // Default images
      const desktopDefaultPicture = imageDesktopDefaultCell.querySelector('picture');
      if (desktopDefaultPicture) {
        const optimizedDesktopDefaultPic = createOptimizedPicture(
          desktopDefaultPicture.querySelector('img').src,
          desktopDefaultPicture.querySelector('img').alt,
          false,
          [{ width: '750' }],
        );
        optimizedDesktopDefaultPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__default');
        moveInstrumentation(desktopDefaultPicture.querySelector('img'), optimizedDesktopDefaultPic.querySelector('img'));
        cardContent.append(optimizedDesktopDefaultPic);
      }

      const mobileDefaultPicture = imageMobileDefaultCell.querySelector('picture');
      if (mobileDefaultPicture) {
        const optimizedMobileDefaultPic = createOptimizedPicture(
          mobileDefaultPicture.querySelector('img').src,
          mobileDefaultPicture.querySelector('img').alt,
          false,
          [{ width: '360', media: '(max-width: 767px)' }],
        );
        optimizedMobileDefaultPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__default');
        moveInstrumentation(mobileDefaultPicture.querySelector('img'), optimizedMobileDefaultPic.querySelector('img'));
        cardContent.append(optimizedMobileDefaultPic);
      }

      // Hover images
      const desktopHoverPicture = imageDesktopHoverCell.querySelector('picture');
      if (desktopHoverPicture) {
        const optimizedDesktopHoverPic = createOptimizedPicture(
          desktopHoverPicture.querySelector('img').src,
          desktopHoverPicture.querySelector('img').alt,
          false,
          [{ width: '750' }],
        );
        optimizedDesktopHoverPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__hover');
        moveInstrumentation(desktopHoverPicture.querySelector('img'), optimizedDesktopHoverPic.querySelector('img'));
        cardContent.append(optimizedDesktopHoverPic);
      }

      const mobileHoverPicture = imageMobileHoverCell.querySelector('picture');
      if (mobileHoverPicture) {
        const optimizedMobileHoverPic = createOptimizedPicture(
          mobileHoverPicture.querySelector('img').src,
          mobileHoverPicture.querySelector('img').alt,
          false,
          [{ width: '360', media: '(max-width: 767px)' }],
        );
        optimizedMobileHoverPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__hover');
        moveInstrumentation(mobileHoverPicture.querySelector('img'), optimizedMobileHoverPic.querySelector('img'));
        cardContent.append(optimizedMobileHoverPic);
      }

      cardAnchor.append(cardContent);
      cardContentContainer.append(cardAnchor);
      moveInstrumentation(cardRow, cardAnchor); // Move instrumentation from cardRow to cardAnchor
    });

    cardsContainer.append(cardContentContainer);
    cardsWrapper.append(cardsContainer);
    tabPanel.append(cardsWrapper, descriptionDiv, exploreAllLinkDiv);
    tabPanelsContainer.append(tabPanel);
  });

  // Event listener for tab clicks
  tabList.addEventListener('click', (event) => {
    const clickedTab = event.target.closest('.cmp-tabs__tab');
    if (!clickedTab) return;

    // Deactivate current tab
    const currentActiveTab = tabList.querySelector('.cmp-tabs__tab--active');
    if (currentActiveTab) {
      currentActiveTab.classList.remove('cmp-tabs__tab--active');
      currentActiveTab.setAttribute('aria-selected', 'false');
      currentActiveTab.setAttribute('tabindex', '-1');
      const currentActivePanelId = currentActiveTab.getAttribute('aria-controls');
      const currentActivePanel = tabPanelsContainer.querySelector(`#${currentActivePanelId}`);
      if (currentActivePanel) {
        currentActivePanel.classList.remove('cmp-tabs__tabpanel--active');
        currentActivePanel.setAttribute('aria-hidden', 'true');
      }
    }

    // Activate new tab
    clickedTab.classList.add('cmp-tabs__tab--active');
    clickedTab.setAttribute('aria-selected', 'true');
    clickedTab.setAttribute('tabindex', '0');
    const newActivePanelId = clickedTab.getAttribute('aria-controls');
    const newActivePanel = tabPanelsContainer.querySelector(`#${newActivePanelId}`);
    if (newActivePanel) {
      newActivePanel.classList.add('cmp-tabs__tabpanel--active');
      newActivePanel.setAttribute('aria-hidden', 'false');
    }
  });

  block.replaceChildren(tabList, tabPanelsContainer);
  // block.classList.add('cmp-tabs'); // Removed: The outer block div already has this class from AEM.
}
