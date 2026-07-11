import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Re-process children to group tabs and their associated product cards
  const groupedTabs = [];
  let currentTab = null;
  children.forEach((row) => {
    if (row.children.length === 4) { // It's a product-category-tab row
      const [tabLabelCell, descriptionCell, exploreAllLinkCell, exploreAllLabelCell] = [...row.children];
      currentTab = {
        tabLabel: tabLabelCell.textContent.trim(),
        descriptionHTML: descriptionCell.innerHTML, // richtext field
        exploreAllLink: exploreAllLinkCell.querySelector('a')?.href || '#', // aem-content field
        exploreAllLabel: exploreAllLabelCell.textContent.trim(), // text field
        productCards: [],
        rowElement: row, // Keep reference to original row for instrumentation
        tabLabelCell, // Keep reference to specific cells for instrumentation
        descriptionCell,
        exploreAllLinkCell,
        exploreAllLabelCell,
      };
      groupedTabs.push(currentTab);
    } else if (row.children.length === 5 && currentTab) { // It's a product-card row and associated with currentTab
      const [
        imageDesktopDefaultCell,
        imageMobileDefaultCell,
        imageDesktopHoverCell,
        imageMobileHoverCell,
        productLinkCell,
      ] = [...row.children];

      currentTab.productCards.push({
        imageDesktopDefault: imageDesktopDefaultCell.querySelector('picture'),
        imageMobileDefault: imageMobileDefaultCell.querySelector('picture'),
        imageDesktopHover: imageDesktopHoverCell.querySelector('picture'),
        imageMobileHover: imageMobileHoverCell.querySelector('picture'),
        productLink: productLinkCell.querySelector('a')?.href || '#',
        rowElement: row, // Keep reference to original row for instrumentation
        imageDesktopDefaultCell, // Keep reference to specific cells for instrumentation
        imageDesktopHoverCell,
        productLinkCell,
      });
    }
  });

  // Now, build the final DOM structure using groupedTabs
  const newTabList = document.createElement('ol');
  newTabList.classList.add('cmp-tabs__tablist');
  newTabList.setAttribute('role', 'tablist');
  newTabList.setAttribute('aria-multiselectable', 'false');

  const newTabPanelsContainer = document.createElement('div');
  newTabPanelsContainer.classList.add('cmp-tabs');

  groupedTabs.forEach((tabData, index) => {
    const tabId = `tab-${index}`;
    const tabpanelId = `tabpanel-${index}`;

    // Create tab list item
    const li = document.createElement('li');
    li.classList.add('cmp-tabs__tab');
    li.setAttribute('role', 'tab');
    li.setAttribute('id', `${tabId}-tab`);
    li.setAttribute('aria-controls', tabpanelId);
    li.setAttribute('tabindex', '-1');
    li.setAttribute('data-cmp-hook-tabs', 'tab');
    li.setAttribute('aria-selected', 'false');
    li.textContent = tabData.tabLabel;
    moveInstrumentation(tabData.tabLabelCell, li); // Use tabLabelCell for instrumentation
    newTabList.append(li);

    // Create tab panel
    const tabpanel = document.createElement('div');
    tabpanel.classList.add('cmp-tabs__tabpanel');
    tabpanel.setAttribute('id', tabpanelId);
    tabpanel.setAttribute('role', 'tabpanel');
    tabpanel.setAttribute('aria-labelledby', `${tabId}-tab`);
    tabpanel.setAttribute('tabindex', '0');
    tabpanel.setAttribute('data-cmp-hook-tabs', 'tabpanel');
    tabpanel.setAttribute('aria-hidden', 'true');
    moveInstrumentation(tabData.rowElement, tabpanel); // Move instrumentation from the tab row to the tabpanel

    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('cards');
    tabpanel.append(cardsWrapper);

    const cmpCardImageHover = document.createElement('div');
    cmpCardImageHover.classList.add('cmp-card--image-hover', 'cmp-card--default');
    cmpCardImageHover.setAttribute('data-component', 'cards');
    cardsWrapper.append(cmpCardImageHover);

    const cmpCardContainer = document.createElement('div');
    cmpCardContainer.classList.add('cmp-card__container');
    cmpCardImageHover.append(cmpCardContainer);

    tabData.productCards.forEach((cardData) => {
      const productLinkAnchor = document.createElement('a');
      productLinkAnchor.href = cardData.productLink;
      productLinkAnchor.setAttribute('target', '_self');
      moveInstrumentation(cardData.productLinkCell, productLinkAnchor); // Instrumentation from productLinkCell
      cmpCardContainer.append(productLinkAnchor);

      const cmpCardContent = document.createElement('div');
      cmpCardContent.classList.add('cmp-card__content');
      cmpCardContent.setAttribute('tabindex', '0');
      productLinkAnchor.append(cmpCardContent);

      if (cardData.imageDesktopDefault) {
        const optimizedPic = createOptimizedPicture(
          cardData.imageDesktopDefault.querySelector('img').src,
          cardData.imageDesktopDefault.querySelector('img').alt,
          false,
          [{ media: '(max-width:767px)', width: '360' }, { width: '498' }],
        );
        optimizedPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__default');
        moveInstrumentation(cardData.imageDesktopDefaultCell, optimizedPic.querySelector('img')); // Instrumentation from imageDesktopDefaultCell
        cmpCardContent.append(optimizedPic);
      }

      if (cardData.imageDesktopHover) {
        const optimizedPic = createOptimizedPicture(
          cardData.imageDesktopHover.querySelector('img').src,
          cardData.imageDesktopHover.querySelector('img').alt,
          false,
          [{ media: '(max-width:767px)', width: '360' }, { width: '498' }],
        );
        optimizedPic.querySelector('img').classList.add('cmp-image__image', 'cmp-image__hover');
        moveInstrumentation(cardData.imageDesktopHoverCell, optimizedPic.querySelector('img')); // Instrumentation from imageDesktopHoverCell
        cmpCardContent.append(optimizedPic);
      }
      // Note: Mobile images are handled by <source media> within createOptimizedPicture
    });

    // Description
    const cardsDescription = document.createElement('div');
    cardsDescription.classList.add('cards__description', 'text');
    tabpanel.append(cardsDescription);

    const cmpText = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    cmpText.classList.add('cmp-text');
    cmpText.innerHTML = tabData.descriptionHTML;
    moveInstrumentation(tabData.descriptionCell, cmpText); // Instrumentation from descriptionCell
    cardsDescription.append(cmpText);

    // Explore All Link
    const exploreMoreButton = document.createElement('div');
    exploreMoreButton.classList.add('exploremore', 'button', 'cmp-button--secondary');
    tabpanel.append(exploreMoreButton);

    const exploreLink = document.createElement('a');
    exploreLink.classList.add('cmp-button');
    exploreLink.href = tabData.exploreAllLink;
    exploreLink.setAttribute('target', '_self');
    moveInstrumentation(tabData.exploreAllLinkCell, exploreLink); // Instrumentation from exploreAllLinkCell
    exploreMoreButton.append(exploreLink);

    const exploreSpan = document.createElement('span');
    exploreSpan.classList.add('cmp-button__text');
    exploreSpan.textContent = tabData.exploreAllLabel;
    moveInstrumentation(tabData.exploreAllLabelCell, exploreSpan); // Instrumentation from exploreAllLabelCell
    exploreLink.append(exploreSpan);

    newTabPanelsContainer.append(tabpanel);
  });

  // Initial state: activate the first tab
  if (newTabList.firstElementChild) {
    newTabList.firstElementChild.classList.add('cmp-tabs__tab--active');
    newTabList.firstElementChild.setAttribute('tabindex', '0');
    newTabList.firstElementChild.setAttribute('aria-selected', 'true');
  }
  if (newTabPanelsContainer.firstElementChild) {
    newTabPanelsContainer.firstElementChild.classList.add('cmp-tabs__tabpanel--active');
    newTabPanelsContainer.firstElementChild.setAttribute('aria-hidden', 'false');
  }

  // Add event listeners for tab switching
  [...newTabList.children].forEach((tab, i) => {
    tab.addEventListener('click', () => {
      // Deactivate current active tab and panel
      newTabList.querySelector('.cmp-tabs__tab--active')?.classList.remove('cmp-tabs__tab--active');
      newTabList.querySelector('.cmp-tabs__tab--active')?.setAttribute('aria-selected', 'false');
      newTabList.querySelector('.cmp-tabs__tab--active')?.setAttribute('tabindex', '-1');

      newTabPanelsContainer.querySelector('.cmp-tabs__tabpanel--active')?.classList.remove('cmp-tabs__tabpanel--active');
      newTabPanelsContainer.querySelector('.cmp-tabs__tabpanel--active')?.setAttribute('aria-hidden', 'true');

      // Activate clicked tab and corresponding panel
      tab.classList.add('cmp-tabs__tab--active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');

      newTabPanelsContainer.children[i].classList.add('cmp-tabs__tabpanel--active');
      newTabPanelsContainer.children[i].setAttribute('aria-hidden', 'false');
    });
  });

  const root = document.createElement('div');
  // Removed 'tabs' class from root as the outer block div already has it.
  // The 'panelcontainer' class is from the ORIGINAL HTML and is kept.
  root.classList.add('panelcontainer');
  root.append(newTabList, newTabPanelsContainer);

  block.replaceChildren(root);
}
