import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const productRows = [...block.children];

  const loopContainer = document.createElement('div');
  loopContainer.classList.add('elementor-loop-container', 'elementor-grid');
  loopContainer.setAttribute('role', 'list');

  productRows.forEach((row) => {
    const [imageCell, imageLinkCell, titleCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const productItem = document.createElement('div');
    productItem.classList.add(
      'elementor',
      'elementor-85',
      'e-loop-item',
      // 'e-loop-item-94', // Removed generic item number
      // 'post-94', // Removed generic post number
      'product',
      'type-product',
      'status-publish',
      'has-post-thumbnail',
      'product_brand-nataraj',
      'product_cat-pencils',
      'product_tag-pre-school',
      'product_tag-school',
      'instock',
      'shipping-taxable',
      'purchasable',
      'product-type-simple',
    );
    // Add custom-edit-handle for Universal Editor if needed, but not in original HTML for this div.

    const productInnerContainer = document.createElement('div');
    productInnerContainer.classList.add(
      'elementor-element',
      'elementor-element-dc6b024',
      'e-flex',
      'e-con-boxed',
      'e-con',
      'e-parent',
      'e-lazyloaded',
    );

    const innerCon = document.createElement('div');
    innerCon.classList.add('e-con-inner');

    const topSection = document.createElement('div');
    topSection.classList.add(
      'elementor-element',
      'elementor-element-bcbf0be',
      'e-con-full',
      'e-flex',
      'e-con',
      'e-child',
    );

    // Image Section
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add(
      'elementor-element',
      'elementor-element-bcab75b',
      'plp-image',
      'dce_masking-none',
      'elementor-widget',
      'elementor-widget-image',
    );
    const imageWidgetContainer = document.createElement('div');
    imageWidgetContainer.classList.add('elementor-widget-container');

    const imageLink = document.createElement('a');
    const originalImageLink = imageLinkCell.querySelector('a');
    if (originalImageLink) {
      imageLink.href = originalImageLink.href;
    }

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1500' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageLink.append(optimizedPic);
      }
    }
    imageWidgetContainer.append(imageLink);
    imageWrapper.append(imageWidgetContainer);
    topSection.append(imageWrapper);

    // Title Section
    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add(
      'elementor-element',
      'elementor-element-9468107',
      'elementor-widget',
      'elementor-widget-icon-box',
    );
    const titleWidgetContainer = document.createElement('div');
    titleWidgetContainer.classList.add('elementor-widget-container');
    const iconBoxWrapper = document.createElement('div');
    iconBoxWrapper.classList.add('elementor-icon-box-wrapper');
    const iconBoxContent = document.createElement('div');
    iconBoxContent.classList.add('elementor-icon-box-content');
    const titleElement = document.createElement('h3');
    titleElement.classList.add('elementor-icon-box-title');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, titleSpan);
    titleElement.append(titleSpan);
    iconBoxContent.append(titleElement);
    iconBoxWrapper.append(iconBoxContent);
    titleWidgetContainer.append(iconBoxWrapper);
    titleWrapper.append(titleWidgetContainer);
    topSection.append(titleWrapper);

    innerCon.append(topSection);

    // CTA Section
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add(
      'elementor-element',
      'elementor-element-597d13a',
      'elementor-align-center',
      'elementor-mobile-align-center',
      'elementor-tablet-align-center',
      'elementor-widget',
      'elementor-widget-button',
    );
    const ctaWidgetContainer = document.createElement('div');
    ctaWidgetContainer.classList.add('elementor-widget-container');
    const ctaButtonWrapper = document.createElement('div');
    ctaButtonWrapper.classList.add('elementor-button-wrapper');
    const ctaButton = document.createElement('a');
    ctaButton.classList.add('elementor-button', 'elementor-button-link', 'elementor-size-sm');
    const originalCtaLink = ctaLinkCell.querySelector('a');
    if (originalCtaLink) {
      ctaButton.href = originalCtaLink.href;
    }
    const ctaContentWrapper = document.createElement('span');
    ctaContentWrapper.classList.add('elementor-button-content-wrapper');
    const ctaText = document.createElement('span');
    ctaText.classList.add('elementor-button-text');
    ctaText.textContent = ctaLabelCell.textContent.trim();
    moveInstrumentation(ctaLabelCell, ctaText);
    ctaContentWrapper.append(ctaText);
    ctaButton.append(ctaContentWrapper);
    ctaButtonWrapper.append(ctaButton);
    ctaWidgetContainer.append(ctaButtonWrapper);
    ctaWrapper.append(ctaWidgetContainer);

    innerCon.append(ctaWrapper);
    productInnerContainer.append(innerCon);
    moveInstrumentation(row, productItem);
    productItem.append(productInnerContainer);
    loopContainer.append(productItem);
  });

  const widgetContainer = document.createElement('div');
  widgetContainer.classList.add('elementor-widget-container');
  widgetContainer.append(loopContainer);

  // The outer block div already has the 'product-grid' class.
  // We need to add the other classes from the original HTML to the block itself.
  block.classList.add(
    'woocommerce',
    'elementor-element',
    'elementor-element-e5eeeb8',
    'elementor-grid-tablet-3',
    'elementor-grid-mobile-2',
    'elementor-grid-3',
    'elementor-widget',
    'elementor-widget-loop-grid',
  );
  block.setAttribute(
    'data-settings',
    '{"_skin":"product","template_id":"85","pagination_type":"load_more_infinite_scroll","columns_tablet":3,"columns_mobile":2,"row_gap_tablet":{"unit":"px","size":15,"sizes":[]},"columns":"3","edit_handle_selector":"[data-elementor-type=\"loop-item\"]","load_more_spinner":{"value":"fas fa-spinner","library":"fa-solid"},"row_gap":{"unit":"px","size":""},"row_gap_mobile":{"unit":"px","size":""}}',
  );
  block.setAttribute('data-widget_type', 'loop-grid.product');
  block.setAttribute('data-id', 'e5eeeb8');
  block.setAttribute('data-element_type', 'widget');

  block.replaceChildren(widgetContainer);
}
