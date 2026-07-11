import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const productTabsWrapper = document.createElement('div');
  productTabsWrapper.classList.add('cmp-product-tabs', 'cmp-product-tabs--yippee-without-image');

  // Title (block.children[0])
  const [titleRow] = children; // Destructuring for fixed schema root row
  const titleEl = document.createElement('h2');
  titleEl.classList.add('cmp-product-tabs__title');
  moveInstrumentation(titleRow, titleEl);
  // Title is richtext, so use innerHTML to preserve potential formatting like <p>
  titleEl.innerHTML = titleRow.children[0]?.innerHTML || '';
  productTabsWrapper.append(titleEl);

  // Tabs container
  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add('cmp-product-tabs__tabs');
  productTabsWrapper.append(tabsContainer);

  // Content container (for future dynamic content, currently empty in EDS structure)
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('cmp-product-tabs__content');
  productTabsWrapper.append(contentContainer);

  // Placeholder for temporary images (as seen in original HTML)
  // These are hardcoded in the original HTML, but not part of the EDS block model.
  // They should be generated based on the original HTML structure, not tied to block.children.
  const tempImagesContainer = document.createElement('div');
  tempImagesContainer.classList.add('cmp-product-tabs__temp-images');
  for (let i = 0; i < 7; i += 1) { // Original HTML has 7 lazy-image-container divs
    const lazyImage = document.createElement('div');
    lazyImage.classList.add('lazy-image-container');
    tempImagesContainer.append(lazyImage);
  }
  productTabsWrapper.prepend(tempImagesContainer); // Prepend to match original HTML order

  // Tab items (all rows after the title row)
  const tabItemRows = children.slice(1); // Skip the title row
  tabItemRows.forEach((row, index) => {
    // For fixed-schema item rows, use destructuring
    const [tabLabelCell] = [...row.children];

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined');
    if (index === 0) {
      buttonWrapper.classList.add('active'); // First tab is active by default
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('cmp-button');

    const buttonText = document.createElement('span');
    buttonText.classList.add('cmp-button__text');
    // Move instrumentation from row to the buttonWrapper, as it's the main container for the tab item
    moveInstrumentation(row, buttonWrapper);
    buttonText.textContent = tabLabelCell?.textContent.trim() || '';

    button.append(buttonText);
    buttonWrapper.append(button);
    tabsContainer.append(buttonWrapper);

    // Add event listener for tab switching
    button.addEventListener('click', () => {
      // Deactivate all tabs
      tabsContainer.querySelectorAll('.button').forEach((btn) => btn.classList.remove('active'));
      // Activate clicked tab
      buttonWrapper.classList.add('active');
      // TODO: Implement logic to show/hide corresponding content in contentContainer
      // This would typically involve fetching content or showing pre-rendered sections.
      // Since the EDS structure only provides tab labels, this part is left as a placeholder.
    });
  });

  block.replaceChildren(productTabsWrapper);
}
