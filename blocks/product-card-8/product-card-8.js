import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    productImageCell,
    productImageLinkCell,
    productTitleCell,
    ctaLabelCell,
    ctaLinkCell,
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add(
    'elementor',
    'elementor-85',
    'e-loop-item',
    'e-loop-item-244',
    'post-244',
    'product',
    'type-product',
    'status-publish',
    'has-post-thumbnail',
    'product_brand-nataraj',
    'product_cat-pencils',
    'product_tag-college',
    'product_tag-school',
    'last',
    'instock',
    'shipping-taxable',
    'purchasable',
    'product-type-simple',
  );

  const elementorContainer = document.createElement('div');
  elementorContainer.classList.add(
    'elementor-element',
    'elementor-element-dc6b024',
    'e-flex',
    'e-con-boxed',
    'e-con',
    'e-parent',
    'e-lazyloaded',
  );
  root.append(elementorContainer);

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');
  elementorContainer.append(innerCon);

  const contentCon = document.createElement('div');
  contentCon.classList.add(
    'elementor-element',
    'elementor-element-bcbf0be',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-child',
  );
  innerCon.append(contentCon);

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
  contentCon.append(imageWidget);

  const imageWidgetContainer = document.createElement('div');
  imageWidgetContainer.classList.add('elementor-widget-container');
  imageWidget.append(imageWidgetContainer);

  const imageLink = document.createElement('a');
  const foundImageLink = productImageLinkCell?.querySelector('a');
  if (foundImageLink) {
    imageLink.href = foundImageLink.href;
  } else {
    imageLink.href = '#';
  }
  moveInstrumentation(productImageLinkCell, imageLink);
  imageWidgetContainer.append(imageLink);

  const picture = productImageCell?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageLink.append(optimizedPic);
    }
  }

  // Product Title
  const titleWidget = document.createElement('div');
  titleWidget.classList.add(
    'elementor-element',
    'elementor-element-9468107',
    'elementor-widget',
    'elementor-widget-icon-box',
  );
  contentCon.append(titleWidget);

  const titleWidgetContainer = document.createElement('div');
  titleWidgetContainer.classList.add('elementor-widget-container');
  titleWidget.append(titleWidgetContainer);

  const iconBoxWrapper = document.createElement('div');
  iconBoxWrapper.classList.add('elementor-icon-box-wrapper');
  titleWidgetContainer.append(iconBoxWrapper);

  const iconBoxContent = document.createElement('div');
  iconBoxContent.classList.add('elementor-icon-box-content');
  iconBoxWrapper.append(iconBoxContent);

  const title = document.createElement('h3');
  title.classList.add('elementor-icon-box-title');
  moveInstrumentation(productTitleCell, title);
  const titleSpan = document.createElement('span');
  titleSpan.textContent = productTitleCell?.textContent.trim() || '';
  title.append(titleSpan);
  iconBoxContent.append(title);

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

  const ctaLink = document.createElement('a');
  ctaLink.classList.add(
    'elementor-button',
    'elementor-button-link',
    'elementor-size-sm',
  );
  const foundCtaLink = ctaLinkCell?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  } else {
    ctaLink.href = '#';
  }
  moveInstrumentation(ctaLinkCell, ctaLink);
  ctaButtonWrapper.append(ctaLink);

  const ctaSpanWrapper = document.createElement('span');
  ctaSpanWrapper.classList.add('elementor-button-content-wrapper');
  ctaLink.append(ctaSpanWrapper);

  const ctaTextSpan = document.createElement('span');
  ctaTextSpan.classList.add('elementor-button-text');
  moveInstrumentation(ctaLabelCell, ctaTextSpan);
  ctaTextSpan.textContent = ctaLabelCell?.textContent.trim() || '';
  ctaSpanWrapper.append(ctaTextSpan);

  block.replaceChildren(root);
}
