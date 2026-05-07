import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [productImageCell, productLinkCell, productTitleCell, ctaLabelCell] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('elementor', 'elementor-85', 'e-loop-item', 'e-loop-item-94', 'post-94', 'product', 'type-product', 'status-publish', 'has-post-thumbnail', 'product_brand-nataraj', 'product_cat-pencils', 'product_tag-pre-school', 'product_tag-school', 'first', 'instock', 'shipping-taxable', 'purchasable', 'product-type-simple');

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('elementor-element', 'elementor-element-dc6b024', 'e-flex', 'e-con-boxed', 'e-con', 'e-parent', 'e-lazyloaded');
  // Removed 'product-card' class from mainContainer as the outer block already has it.
  root.append(mainContainer);

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');
  mainContainer.append(innerCon);

  const topSection = document.createElement('div');
  topSection.classList.add('elementor-element', 'elementor-element-bcbf0be', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  innerCon.append(topSection);

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('elementor-element', 'elementor-element-bcab75b', 'plp-image', 'dce_masking-none', 'elementor-widget', 'elementor-widget-image');
  topSection.append(imageWrapper);

  const imageWidgetContainer = document.createElement('div');
  imageWidgetContainer.classList.add('elementor-widget-container');
  imageWrapper.append(imageWidgetContainer);

  const productLink = productLinkCell.querySelector('a');
  const imageLink = document.createElement('a');
  if (productLink) {
    imageLink.href = productLink.href;
  }
  imageWidgetContainer.append(imageLink);

  const picture = productImageCell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1500' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    imageLink.append(optimizedPic);
  }
  moveInstrumentation(productImageCell, imageWrapper);

  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('elementor-element', 'elementor-element-9468107', 'elementor-widget', 'elementor-widget-icon-box');
  topSection.append(titleWrapper);

  const titleWidgetContainer = document.createElement('div');
  titleWidgetContainer.classList.add('elementor-widget-container');
  titleWrapper.append(titleWidgetContainer);

  const iconBoxWrapper = document.createElement('div');
  iconBoxWrapper.classList.add('elementor-icon-box-wrapper');
  titleWidgetContainer.append(iconBoxWrapper);

  const iconBoxContent = document.createElement('div');
  iconBoxContent.classList.add('elementor-icon-box-content');
  iconBoxWrapper.append(iconBoxContent);

  const titleElement = document.createElement('h3');
  titleElement.classList.add('elementor-icon-box-title');
  moveInstrumentation(productTitleCell, titleElement);
  // Replaced textContent with innerHTML to preserve potential rich text formatting,
  // and wrapped in a span as per original HTML structure.
  titleElement.innerHTML = `<span>${productTitleCell.innerHTML.trim()}</span>`;
  iconBoxContent.append(titleElement);

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('elementor-element', 'elementor-element-597d13a', 'elementor-align-center', 'elementor-mobile-align-center', 'elementor-tablet-align-center', 'elementor-widget', 'elementor-widget-button');
  innerCon.append(ctaWrapper);

  const ctaWidgetContainer = document.createElement('div');
  ctaWidgetContainer.classList.add('elementor-widget-container');
  ctaWrapper.append(ctaWidgetContainer);

  const ctaButtonWrapper = document.createElement('div');
  ctaButtonWrapper.classList.add('elementor-button-wrapper');
  ctaWidgetContainer.append(ctaButtonWrapper);

  const ctaButton = document.createElement('a');
  ctaButton.classList.add('elementor-button', 'elementor-button-link', 'elementor-size-sm');
  if (productLink) {
    ctaButton.href = productLink.href;
  }
  moveInstrumentation(ctaLabelCell, ctaButton);
  // Replaced textContent with innerHTML to preserve potential rich text formatting,
  // and wrapped in spans as per original HTML structure.
  ctaButton.innerHTML = `<span class="elementor-button-content-wrapper"><span class="elementor-button-text">${ctaLabelCell.innerHTML.trim()}</span></span>`;
  ctaButtonWrapper.append(ctaButton);

  block.replaceChildren(root);
}
