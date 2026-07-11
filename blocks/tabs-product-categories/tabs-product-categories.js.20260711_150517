import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const tabCategoryItems = [];
  const productCardItems = [];

  // Separate tab-category-item rows from product-card-item rows
  children.forEach((row) => {
    // tab-category-item has 4 cells (tabLabel, description, exploreAllLink, exploreAllLabel)
    // The 'products' container field does not add a cell to the row.
    if (row.children.length === 4) {
      tabCategoryItems.push(row);
    }
    // product-card-item has 5 cells (productLink, desktopImageDefault, mobileImageDefault, desktopImageHover, mobileImageHover)
    else if (row.children.length === 5) {
      productCardItems.push(row);
    }
  });

  const tablist = document.createElement('ol');
  tablist.classList.add('cmp-tabs__tablist');
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-multiselectable', 'false');

  const tabpanelsContainer = document.createElement('div');
  // Removed 'cmp-tabs' class from tabpanelsContainer to prevent double padding/styling.
  // The outer 'wrapper' element already has 'tabs' and 'panelcontainer' which aligns with original HTML.
  // The 'cmp-tabs' class is on the outer div in the ORIGINAL HTML, not an inner container.

  // Create tabs and tab panels
  tabCategoryItems.forEach((tabRow, index) => {
    const [tabLabelCell, descriptionCell, exploreAllLinkCell, exploreAllLabelCell] = [
      ...tabRow.children,
    ];

    // Create tab
    const tab = document.createElement('li');
    tab.classList.add('cmp-tabs__tab');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('data-cmp-hook-tabs', 'tab');
    tab.textContent = tabLabelCell.textContent.trim();

    const tabId = `tab-${index}`;
    const tabpanelId = `tabpanel-${index}`;
    tab.id = tabId;
    tab.setAttribute('aria-controls', tabpanelId);
    tab.setAttribute('tabindex', '-1');
    tab.setAttribute('aria-selected', 'false');
    moveInstrumentation(tabLabelCell, tab); // Move instrumentation from tabLabelCell to tab

    // Create tab panel
    const tabpanel = document.createElement('div');
    tabpanel.classList.add('cmp-tabs__tabpanel');
    tabpanel.id = tabpanelId;
    tabpanel.setAttribute('role', 'tabpanel');
    tabpanel.setAttribute('aria-labelledby', tabId);
    tabpanel.setAttribute('tabindex', '0');
    tabpanel.setAttribute('data-cmp-hook-tabs', 'tabpanel');
    tabpanel.setAttribute('aria-hidden', 'true');
    moveInstrumentation(tabRow, tabpanel); // Move instrumentation from the whole tabRow to tabpanel

    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cards');

    const cardImageHoverContainer = document.createElement('div');
    cardImageHoverContainer.classList.add('cmp-card--image-hover', 'cmp-card--default');

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('cmp-card__container');

    // As per EDS BLOCK STRUCTURE, product-card-items are siblings to tab-category-items,
    // not nested. The 'products' container field within 'tab-category-item' implies
    // a logical grouping, but not a physical nesting in the block.children array.
    // Without a specific field on product-card-item to link it to a tab,
    // the most robust interpretation is that all product cards are available to all tabs,
    // or filtered by client-side logic (which is not in scope for block decoration).
    // For this implementation, all product cards will be added to each tab panel.
    productCardItems.forEach((productRow) => {
      const [
        productLinkCell,
        desktopImageDefaultCell,
        mobileImageDefaultCell,
        desktopImageHoverCell,
        mobileImageHoverCell,
      ] = [...productRow.children];

      const productLink = productLinkCell.querySelector('a');
      const productAnchor = document.createElement('a');
      if (productLink) {
        productAnchor.href = productLink.href;
      }
      productAnchor.setAttribute('target', '_self');

      const cardContent = document.createElement('div');
      cardContent.classList.add('cmp-card__content');
      cardContent.setAttribute('tabindex', '0');

      const desktopDefaultPicture = desktopImageDefaultCell.querySelector('picture');
      if (desktopDefaultPicture) {
        const desktopDefaultImg = desktopDefaultPicture.querySelector('img');
        const optimizedDesktopDefaultPic = createOptimizedPicture(
          desktopDefaultImg.src,
          desktopDefaultImg.alt,
          false,
          [{ media: '(max-width:767px)', width: '360' }, { width: '750' }],
        );
        optimizedDesktopDefaultPic.classList.add('cmp-image__image', 'cmp-image__default');
        moveInstrumentation(desktopDefaultImg, optimizedDesktopDefaultPic.querySelector('img')); // Move instrumentation from original img
        cardContent.append(optimizedDesktopDefaultPic);
      }

      const desktopHoverPicture = desktopImageHoverCell.querySelector('picture');
      if (desktopHoverPicture) {
        const desktopHoverImg = desktopHoverPicture.querySelector('img');
        const optimizedDesktopHoverPic = createOptimizedPicture(
          desktopHoverImg.src,
          desktopHoverImg.alt,
          false,
          [{ media: '(max-width:767px)', width: '360' }, { width: '750' }],
        );
        optimizedDesktopHoverPic.classList.add('cmp-image__image', 'cmp-image__hover');
        moveInstrumentation(desktopHoverImg, optimizedDesktopHoverPic.querySelector('img')); // Move instrumentation from original img
        cardContent.append(optimizedDesktopHoverPic);
      }

      productAnchor.append(cardContent);
      cardContainer.append(productAnchor);
      moveInstrumentation(productRow, productAnchor); // Move instrumentation from productRow to productAnchor
    });

    cardImageHoverContainer.append(cardContainer);
    cardsContainer.append(cardImageHoverContainer);

    // Add description
    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('cards__description', 'text');
    const descriptionText = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    descriptionText.classList.add('cmp-text');
    descriptionText.innerHTML = descriptionCell.innerHTML; // richtext field, use innerHTML
    descriptionWrapper.append(descriptionText);
    cardsContainer.append(descriptionWrapper);
    moveInstrumentation(descriptionCell, descriptionText); // Move instrumentation from descriptionCell to descriptionText

    // Add explore all link
    const exploreAllButtonWrapper = document.createElement('div');
    exploreAllButtonWrapper.classList.add('exploremore', 'button', 'cmp-button--secondary');
    const exploreAllLink = exploreAllLinkCell.querySelector('a');
    const exploreAllAnchor = document.createElement('a');
    exploreAllAnchor.classList.add('cmp-button');
    if (exploreAllLink) {
      exploreAllAnchor.href = exploreAllLink.href;
    }
    const exploreAllSpan = document.createElement('span');
    exploreAllSpan.classList.add('cmp-button__text');
    exploreAllSpan.textContent = exploreAllLabelCell.textContent.trim();
    exploreAllAnchor.append(exploreAllSpan);
    exploreAllButtonWrapper.append(exploreAllAnchor);
    cardsContainer.append(exploreAllButtonWrapper);
    moveInstrumentation(exploreAllLinkCell, exploreAllAnchor); // Move instrumentation from exploreAllLinkCell to exploreAllAnchor

    tabpanel.append(cardsContainer);
    tabpanelsContainer.append(tabpanel);
    tablist.append(tab);

    // Set first tab as active
    if (index === 0) {
      tab.classList.add('cmp-tabs__tab--active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      tabpanel.classList.add('cmp-tabs__tabpanel--active');
      tabpanel.setAttribute('aria-hidden', 'false');
    }
  });

  // Tab switching logic
  tablist.addEventListener('click', (event) => {
    const clickedTab = event.target.closest('.cmp-tabs__tab');
    if (!clickedTab) return;

    // Deactivate current tab
    const currentActiveTab = tablist.querySelector('.cmp-tabs__tab--active');
    if (currentActiveTab) {
      currentActiveTab.classList.remove('cmp-tabs__tab--active');
      currentActiveTab.setAttribute('aria-selected', 'false');
      currentActiveTab.setAttribute('tabindex', '-1');
      const currentActivePanelId = currentActiveTab.getAttribute('aria-controls');
      const currentActivePanel = tabpanelsContainer.querySelector(`#${currentActivePanelId}`);
      if (currentActivePanel) {
        currentActivePanel.classList.remove('cmp-tabs__tabpanel--active');
        currentActivePanel.setAttribute('aria-hidden', 'true');
      }
    }

    // Activate clicked tab
    clickedTab.classList.add('cmp-tabs__tab--active');
    clickedTab.setAttribute('aria-selected', 'true');
    clickedTab.setAttribute('tabindex', '0');
    const targetPanelId = clickedTab.getAttribute('aria-controls');
    const targetPanel = tabpanelsContainer.querySelector(`#${targetPanelId}`);
    if (targetPanel) {
      targetPanel.classList.add('cmp-tabs__tabpanel--active');
      targetPanel.setAttribute('aria-hidden', 'false');
    }
  });

  const wrapper = document.createElement('div');
  wrapper.classList.add('tabs', 'panelcontainer', 'cmp-tabs'); // Added cmp-tabs to the wrapper as per original HTML
  wrapper.append(tablist, tabpanelsContainer);

  block.replaceChildren(wrapper);

  // Optimize images after all DOM manipulation
  wrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
