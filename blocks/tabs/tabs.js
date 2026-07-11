import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const tabItems = [];
  const cardItems = [];

  // Separate tab items and card items based on cell count
  // tab-item has 4 cells: tabLabel, description, exploreAllLink, exploreAllLabel
  // tab-card-item has 5 cells: link, desktopImageDefault, mobileImageDefault, desktopImageHover, mobileImageHover
  children.forEach((row) => {
    if (row.children.length === 4) {
      tabItems.push(row);
    } else if (row.children.length === 5) {
      cardItems.push(row);
    }
  });

  const tabList = document.createElement('ol');
  tabList.classList.add('cmp-tabs__tablist');
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-multiselectable', 'false');

  const tabPanelsContainer = document.createElement('div');

  tabItems.forEach((tabRow, index) => {
    // Correct destructuring for tab-item based on BlockJson model
    const [tabLabelCell, descriptionCell, exploreAllLinkCell, exploreAllLabelCell] = [...tabRow.children];

    const tabId = `tab-${index}`;
    const tabPanelId = `tabpanel-${index}`;

    // Create tab list item
    const tabListItem = document.createElement('li');
    tabListItem.classList.add('cmp-tabs__tab');
    tabListItem.setAttribute('role', 'tab');
    tabListItem.id = `${tabId}-tab`;
    tabListItem.setAttribute('aria-controls', tabPanelId);
    tabListItem.setAttribute('tabindex', '-1');
    tabListItem.setAttribute('data-cmp-hook-tabs', 'tab');
    tabListItem.setAttribute('aria-selected', 'false');
    tabListItem.textContent = tabLabelCell.textContent.trim();
    moveInstrumentation(tabLabelCell, tabListItem); // Move instrumentation from the cell that provided textContent
    tabList.append(tabListItem);

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.classList.add('cmp-tabs__tabpanel');
    tabPanel.id = tabPanelId;
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-labelledby', `${tabId}-tab`);
    tabPanel.setAttribute('tabindex', '0');
    tabPanel.setAttribute('data-cmp-hook-tabs', 'tabpanel');
    tabPanel.setAttribute('aria-hidden', 'true');
    moveInstrumentation(tabRow, tabPanel); // Move instrumentation from the tabRow to the tabPanel

    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('cards');

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('cmp-card--image-hover', 'cmp-card--default');
    cardContainer.setAttribute('data-component', 'cards');

    const cardContentContainer = document.createElement('div');
    cardContentContainer.classList.add('cmp-card__container');

    cardItems.forEach((cardRow) => {
      // Correct destructuring for tab-card-item based on BlockJson model
      const [linkCell, desktopImageDefaultCell, mobileImageDefaultCell, desktopImageHoverCell, mobileImageHoverCell] = [...cardRow.children];

      const linkEl = linkCell.querySelector('a');

      const cardLink = document.createElement('a');
      if (linkEl) cardLink.href = linkEl.href;
      cardLink.setAttribute('target', '_self');

      const cardContent = document.createElement('div');
      cardContent.classList.add('cmp-card__content');
      cardContent.setAttribute('tabindex', '0');

      // Helper function to process image cells
      const processImageCell = (imageCell, className) => {
        if (imageCell) {
          const pictureEl = imageCell.querySelector('picture');
          if (pictureEl) {
            const imgEl = pictureEl.querySelector('img');
            if (imgEl) {
              const optimizedPic = createOptimizedPicture(
                imgEl.src,
                imgEl.alt,
                false,
                [{ media: '(max-width:767px)', width: '360' }, { width: '750' }],
              );
              optimizedPic.querySelector('img').classList.add('cmp-image__image', className);
              moveInstrumentation(imageCell, optimizedPic.querySelector('img'));
              cardContent.append(optimizedPic);
            }
          }
        }
      };

      processImageCell(desktopImageDefaultCell, 'cmp-image__default');
      processImageCell(mobileImageDefaultCell, 'cmp-image__default');
      processImageCell(desktopImageHoverCell, 'cmp-image__hover');
      processImageCell(mobileImageHoverCell, 'cmp-image__hover');

      cardLink.append(cardContent);
      moveInstrumentation(linkCell, cardLink); // Move instrumentation from the link cell to the cardLink
      cardContentContainer.append(cardLink);
    });

    cardContainer.append(cardContentContainer);
    cardsWrapper.append(cardContainer);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('cards__description', 'text');
    const cmpTextDiv = document.createElement('div');
    cmpTextDiv.classList.add('cmp-text');
    cmpTextDiv.innerHTML = descriptionCell.innerHTML; // richtext field, use innerHTML
    moveInstrumentation(descriptionCell, cmpTextDiv);
    descriptionDiv.append(cmpTextDiv);
    cardsWrapper.append(descriptionDiv);

    const exploreMoreDiv = document.createElement('div');
    exploreMoreDiv.classList.add('exploremore', 'button', 'cmp-button--secondary');
    const exploreLink = document.createElement('a');
    exploreLink.classList.add('cmp-button');
    const exploreLinkFound = exploreAllLinkCell.querySelector('a');
    if (exploreLinkFound) exploreLink.href = exploreLinkFound.href;
    const exploreSpan = document.createElement('span');
    exploreSpan.classList.add('cmp-button__text');
    exploreSpan.textContent = exploreAllLabelCell.textContent.trim();
    exploreLink.append(exploreSpan);
    moveInstrumentation(exploreAllLinkCell, exploreLink);
    moveInstrumentation(exploreAllLabelCell, exploreSpan);
    exploreMoreDiv.append(exploreLink);
    cardsWrapper.append(exploreMoreDiv);

    tabPanel.append(cardsWrapper);
    tabPanelsContainer.append(tabPanel);
  });

  block.replaceChildren(tabList, tabPanelsContainer);

  const tabs = block.querySelectorAll('.cmp-tabs__tab');
  const tabpanels = block.querySelectorAll('.cmp-tabs__tabpanel');

  const activateTab = (activeTab) => {
    tabs.forEach((tab) => {
      tab.classList.remove('cmp-tabs__tab--active');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });
    tabpanels.forEach((panel) => {
      panel.classList.remove('cmp-tabs__tabpanel--active');
      panel.setAttribute('aria-hidden', 'true');
    });

    activeTab.classList.add('cmp-tabs__tab--active');
    activeTab.setAttribute('aria-selected', 'true');
    activeTab.setAttribute('tabindex', '0');

    const targetPanelId = activeTab.getAttribute('aria-controls');
    const targetPanel = block.querySelector(`#${targetPanelId}`);
    if (targetPanel) {
      targetPanel.classList.add('cmp-tabs__tabpanel--active');
      targetPanel.setAttribute('aria-hidden', 'false');
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab));
  });

  // Activate the first tab by default
  if (tabs.length > 0) {
    activateTab(tabs[0]);
  }
}
