import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const productItems = [...block.children];

  const mainContainer = document.createElement('div');
  // Removed 'product-grid' class as the outer block div already has it.
  mainContainer.classList.add('woocommerce', 'elementor-element', 'elementor-element-e5eeeb8', 'elementor-grid-tablet-3', 'elementor-grid-mobile-2', 'elementor-grid-3', 'elementor-widget', 'elementor-widget-loop-grid');

  const widgetContainer = document.createElement('div');
  widgetContainer.classList.add('elementor-widget-container');
  mainContainer.append(widgetContainer);

  const loopContainer = document.createElement('div');
  loopContainer.classList.add('elementor-loop-container', 'elementor-grid');
  loopContainer.setAttribute('role', 'list');
  widgetContainer.append(loopContainer);

  productItems.forEach((row) => {
    const [imageCell, imageLinkCell, titleCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const loopItem = document.createElement('div');
    loopItem.classList.add('elementor', 'elementor-85', 'e-loop-item', 'e-loop-item-94', 'post-94', 'product', 'type-product', 'status-publish', 'has-post-thumbnail', 'product_brand-nataraj', 'product_cat-pencils', 'product_tag-pre-school', 'product_tag-school', 'first', 'instock', 'shipping-taxable', 'purchasable', 'product-type-simple');
    loopItem.setAttribute('data-elementor-type', 'loop-item');
    loopItem.setAttribute('data-elementor-id', '85');
    loopItem.setAttribute('data-elementor-post-type', 'elementor_library');
    loopItem.setAttribute('data-custom-edit-handle', '1');
    moveInstrumentation(row, loopItem); // Move instrumentation from original row to the new loopItem
    loopContainer.append(loopItem);

    const productContainer = document.createElement('div');
    productContainer.classList.add('elementor-element', 'elementor-element-dc6b024', 'e-flex', 'e-con-boxed', 'e-con', 'e-parent', 'e-lazyloaded');
    loopItem.append(productContainer);

    const innerContainer = document.createElement('div');
    innerContainer.classList.add('e-con-inner');
    productContainer.append(innerContainer);

    const topSection = document.createElement('div');
    topSection.classList.add('elementor-element', 'elementor-element-bcbf0be', 'e-con-full', 'e-flex', 'e-con', 'e-child');
    innerContainer.append(topSection);

    // Product Image
    const imageWidget = document.createElement('div');
    imageWidget.classList.add('elementor-element', 'elementor-element-bcab75b', 'plp-image', 'dce_masking-none', 'elementor-widget', 'elementor-widget-image');
    topSection.append(imageWidget);

    const imageWidgetContainer = document.createElement('div');
    imageWidgetContainer.classList.add('elementor-widget-container');
    imageWidget.append(imageWidgetContainer);

    const imageLink = document.createElement('a');
    const foundImageLink = imageLinkCell.querySelector('a');
    if (foundImageLink) {
      imageLink.href = foundImageLink.href;
    }
    imageWidgetContainer.append(imageLink);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1500' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageLink.append(optimizedPic);
      }
    }

    // Product Title
    const titleWidget = document.createElement('div');
    titleWidget.classList.add('elementor-element', 'elementor-element-9468107', 'elementor-widget', 'elementor-widget-icon-box');
    topSection.append(titleWidget);

    const titleWidgetContainer = document.createElement('div');
    titleWidgetContainer.classList.add('elementor-widget-container');
    titleWidget.append(titleWidgetContainer);

    const iconBoxWrapper = document.createElement('div');
    iconBoxWrapper.classList.add('elementor-icon-box-wrapper');
    titleWidgetContainer.append(iconBoxWrapper);

    const iconBoxContent = document.createElement('div');
    iconBoxContent.classList.add('elementor-icon-box-content');
    iconBoxWrapper.append(iconBoxContent);

    const titleElement = document.createElement('h3');
    titleElement.classList.add('elementor-icon-box-title');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = titleCell.textContent.trim();
    titleElement.append(titleSpan);
    iconBoxContent.append(titleElement);

    // CTA Button
    const ctaWidget = document.createElement('div');
    ctaWidget.classList.add('elementor-element', 'elementor-element-597d13a', 'elementor-align-center', 'elementor-mobile-align-center', 'elementor-tablet-align-center', 'elementor-widget', 'elementor-widget-button');
    innerContainer.append(ctaWidget);

    const ctaWidgetContainer = document.createElement('div');
    ctaWidgetContainer.classList.add('elementor-widget-container');
    ctaWidget.append(ctaWidgetContainer);

    const ctaButtonWrapper = document.createElement('div');
    ctaButtonWrapper.classList.add('elementor-button-wrapper');
    ctaWidgetContainer.append(ctaButtonWrapper);

    const ctaButton = document.createElement('a');
    ctaButton.classList.add('elementor-button', 'elementor-button-link', 'elementor-size-sm');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaButton.href = foundCtaLink.href;
    }

    const ctaButtonContentWrapper = document.createElement('span');
    ctaButtonContentWrapper.classList.add('elementor-button-content-wrapper');
    ctaButton.append(ctaButtonContentWrapper);

    const ctaButtonText = document.createElement('span');
    ctaButtonText.classList.add('elementor-button-text');
    ctaButtonText.textContent = ctaLabelCell.textContent.trim();
    ctaButtonContentWrapper.append(ctaButtonText);

    ctaButtonWrapper.append(ctaButton);
  });

  const loadMoreSpinner = document.createElement('span');
  loadMoreSpinner.classList.add('e-load-more-spinner');
  loadMoreSpinner.innerHTML = `
    <svg aria-hidden="true" class="e-font-icon-svg e-fas-spinner" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"></path></svg>
  `;
  widgetContainer.append(loadMoreSpinner);

  block.replaceChildren(mainContainer);
}
