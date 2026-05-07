import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    productImageCell,
    productLinkCell,
    productTitleCell,
    ctaLabelCell,
    ctaLinkCell,
  ] = [...block.children];

  const root = document.createElement('div');
  // The block's own class 'product-card-4' is already on the outer div from AEM.
  // Adding it here would cause double padding/CSS.
  // The classes below are from the ORIGINAL HTML's inner wrapper elements.
  root.classList.add(
    'elementor',
    'elementor-85',
    'e-loop-item',
    'e-loop-item-243',
    'post-243',
    'product',
    'type-product',
    'status-publish',
    'has-post-thumbnail',
    'product_brand-nataraj',
    'product_cat-pencils',
    'product_tag-school',
    'last',
    'instock',
    'shipping-taxable',
    'purchasable',
    'product-type-simple',
  );
  moveInstrumentation(block, root);

  const mainContainer = document.createElement('div');
  mainContainer.classList.add(
    'elementor-element',
    'elementor-element-dc6b024',
    'e-flex',
    'e-con-boxed',
    'e-con',
    'e-parent',
    'e-lazyloaded',
  );
  root.append(mainContainer);

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');
  mainContainer.append(innerCon);

  const topCon = document.createElement('div');
  topCon.classList.add(
    'elementor-element',
    'elementor-element-bcbf0be',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-child',
  );
  innerCon.append(topCon);

  // Product Image
  const imageWidget = document.createElement('div');
  imageWidget.classList.add(
    'elementor-element',
    'elementor-element-bcab75b',
    'plp-image',
    'dce_masking-none',
    'elementor-widget',
    'elementor-widget-image',
  );
  topCon.append(imageWidget);

  const imageWidgetContainer = document.createElement('div');
  imageWidgetContainer.classList.add('elementor-widget-container');
  imageWidget.append(imageWidgetContainer);

  const productLink = document.createElement('a');
  const foundProductLink = productLinkCell.querySelector('a');
  if (foundProductLink) {
    productLink.href = foundProductLink.href;
    moveInstrumentation(productLinkCell, productLink);
  }
  imageWidgetContainer.append(productLink);

  const picture = productImageCell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1500' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    productLink.append(optimizedPic);
  }

  // Product Title
  const titleWidget = document.createElement('div');
  titleWidget.classList.add(
    'elementor-element',
    'elementor-element-9468107',
    'elementor-widget',
    'elementor-widget-icon-box',
  );
  topCon.append(titleWidget);

  const titleWidgetContainer = document.createElement('div');
  titleWidgetContainer.classList.add('elementor-widget-container');
  titleWidget.append(titleWidgetContainer);

  const iconBoxWrapper = document.createElement('div');
  iconBoxWrapper.classList.add('elementor-icon-box-wrapper');
  titleWidgetContainer.append(iconBoxWrapper);

  const iconBoxContent = document.createElement('div');
  iconBoxContent.classList.add('elementor-icon-box-content');
  iconBoxWrapper.append(iconBoxContent);

  const productTitle = document.createElement('h3');
  productTitle.classList.add('elementor-icon-box-title');
  const spanTitle = document.createElement('span');
  spanTitle.textContent = productTitleCell.textContent.trim();
  moveInstrumentation(productTitleCell, spanTitle);
  productTitle.append(spanTitle);
  iconBoxContent.append(productTitle);

  // CTA Button
  const ctaWidget = document.createElement('div');
  ctaWidget.classList.add(
    'elementor-element',
    'elementor-element-597d13a',
    'elementor-align-center',
    'elementor-mobile-align-center',
    'elementor-tablet-align-center',
    'elementor-widget',
    'elementor-widget-button',
  );
  innerCon.append(ctaWidget);

  const ctaWidgetContainer = document.createElement('div');
  ctaWidgetContainer.classList.add('elementor-widget-container');
  ctaWidget.append(ctaWidgetContainer);

  const ctaButtonWrapper = document.createElement('div');
  ctaButtonWrapper.classList.add('elementor-button-wrapper');
  ctaWidgetContainer.append(ctaButtonWrapper);

  const ctaButton = document.createElement('a');
  ctaButton.classList.add(
    'elementor-button',
    'elementor-button-link',
    'elementor-size-sm',
  );
  const foundCtaLink = ctaLinkCell.querySelector('a');
  if (foundCtaLink) {
    ctaButton.href = foundCtaLink.href;
    moveInstrumentation(ctaLinkCell, ctaButton);
  }
  ctaButtonWrapper.append(ctaButton);

  const ctaContentWrapper = document.createElement('span');
  ctaContentWrapper.classList.add('elementor-button-content-wrapper');
  ctaButton.append(ctaContentWrapper);

  const ctaText = document.createElement('span');
  ctaText.classList.add('elementor-button-text');
  ctaText.textContent = ctaLabelCell.textContent.trim();
  moveInstrumentation(ctaLabelCell, ctaText);
  ctaContentWrapper.append(ctaText);

  block.replaceChildren(root);
}
