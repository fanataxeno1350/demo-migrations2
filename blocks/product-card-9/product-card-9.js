import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageCell, imageLinkCell, titleCell, buttonLinkCell, buttonLabelCell] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('elementor', 'elementor-85', 'e-loop-item', 'e-loop-item-239', 'post-239', 'product', 'type-product', 'status-publish', 'has-post-thumbnail', 'product_brand-nataraj', 'product_cat-pencils', 'first', 'instock', 'shipping-taxable', 'purchasable', 'product-type-simple');
  moveInstrumentation(block, root); // Move instrumentation from block to new root

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('elementor-element', 'elementor-element-dc6b024', 'e-flex', 'e-con-boxed', 'e-con', 'e-parent', 'e-lazyloaded');
  root.append(mainContainer);

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');
  mainContainer.append(innerCon);

  const imageAndTitleContainer = document.createElement('div');
  imageAndTitleContainer.classList.add('elementor-element', 'elementor-element-bcbf0be', 'e-con-full', 'e-flex', 'e-con', 'e-child');
  innerCon.append(imageAndTitleContainer);

  // Product Image
  const imageWidget = document.createElement('div');
  imageWidget.classList.add('elementor-element', 'elementor-element-bcab75b', 'plp-image', 'dce_masking-none', 'elementor-widget', 'elementor-widget-image');
  moveInstrumentation(imageCell, imageWidget);
  imageAndTitleContainer.append(imageWidget);

  const imageWidgetContainer = document.createElement('div');
  imageWidgetContainer.classList.add('elementor-widget-container');
  imageWidget.append(imageWidgetContainer);

  const imageAnchor = document.createElement('a');
  const foundImageLink = imageLinkCell?.querySelector('a');
  if (foundImageLink) {
    imageAnchor.href = foundImageLink.href;
  } else {
    imageAnchor.href = '#';
  }
  imageWidgetContainer.append(imageAnchor);

  const picture = imageCell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1500' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageAnchor.append(optimizedPic);
    }
  }

  // Product Title
  const titleWidget = document.createElement('div');
  titleWidget.classList.add('elementor-element', 'elementor-element-9468107', 'elementor-widget', 'elementor-widget-icon-box');
  moveInstrumentation(titleCell, titleWidget);
  imageAndTitleContainer.append(titleWidget);

  const titleWidgetContainer = document.createElement('div');
  titleWidgetContainer.classList.add('elementor-widget-container');
  titleWidget.append(titleWidgetContainer);

  const iconBoxWrapper = document.createElement('div');
  iconBoxWrapper.classList.add('elementor-icon-box-wrapper');
  titleWidgetContainer.append(iconBoxWrapper);

  const iconBoxContent = document.createElement('div');
  iconBoxContent.classList.add('elementor-icon-box-content');
  iconBoxWrapper.append(iconBoxContent);

  const titleHeading = document.createElement('h3');
  titleHeading.classList.add('elementor-icon-box-title');
  iconBoxContent.append(titleHeading);

  const titleSpan = document.createElement('span');
  titleSpan.textContent = titleCell?.textContent.trim() || '';
  titleHeading.append(titleSpan);

  // Button
  const buttonWidget = document.createElement('div');
  buttonWidget.classList.add('elementor-element', 'elementor-element-597d13a', 'elementor-align-center', 'elementor-mobile-align-center', 'elementor-tablet-align-center', 'elementor-widget', 'elementor-widget-button');
  moveInstrumentation(buttonLinkCell, buttonWidget);
  innerCon.append(buttonWidget);

  const buttonWidgetContainer = document.createElement('div');
  buttonWidgetContainer.classList.add('elementor-widget-container');
  buttonWidget.append(buttonWidgetContainer);

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('elementor-button-wrapper');
  buttonWidgetContainer.append(buttonWrapper);

  const buttonAnchor = document.createElement('a');
  buttonAnchor.classList.add('elementor-button', 'elementor-button-link', 'elementor-size-sm');
  const foundButtonLink = buttonLinkCell?.querySelector('a');
  if (foundButtonLink) {
    buttonAnchor.href = foundButtonLink.href;
  } else {
    buttonAnchor.href = '#';
  }
  buttonWrapper.append(buttonAnchor);

  const buttonContentWrapper = document.createElement('span');
  buttonContentWrapper.classList.add('elementor-button-content-wrapper');
  buttonAnchor.append(buttonContentWrapper);

  const buttonText = document.createElement('span');
  buttonText.classList.add('elementor-button-text');
  buttonText.textContent = buttonLabelCell?.textContent.trim() || '';
  buttonContentWrapper.append(buttonText);

  block.replaceChildren(root);
}
