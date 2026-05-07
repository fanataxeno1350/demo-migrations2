import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    productImageRow,
    productImageLinkRow,
    productTitleRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add(
    'elementor',
    'elementor-85',
    'e-loop-item',
    'e-loop-item-246',
    'post-246',
    'product',
    'type-product',
    'status-publish',
    'has-post-thumbnail',
    'product_brand-nataraj',
    'product_cat-pencils',
    'product_tag-school',
    'instock',
    'shipping-taxable',
    'purchasable',
    'product-type-simple',
  );

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

  const innerContainer = document.createElement('div');
  innerContainer.classList.add('e-con-inner');
  mainContainer.append(innerContainer);

  const contentContainer = document.createElement('div');
  contentContainer.classList.add(
    'elementor-element',
    'elementor-element-bcbf0be',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-child',
  );
  innerContainer.append(contentContainer);

  // Product Image
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add(
    'elementor-element',
    'elementor-element-bcab75b',
    'plp-image',
    'dce_masking-none',
    'elementor-widget',
    'elementor-widget-image',
  );
  contentContainer.append(imageWrapper);

  const imageWidgetContainer = document.createElement('div');
  imageWidgetContainer.classList.add('elementor-widget-container');
  imageWrapper.append(imageWidgetContainer);

  const imageLink = document.createElement('a');
  const productImageHref = productImageLinkRow?.querySelector('a')?.href || '#';
  imageLink.href = productImageHref;
  imageWidgetContainer.append(imageLink);

  const picture = productImageRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    imageLink.append(optimizedPic);
  }
  moveInstrumentation(productImageRow, imageWrapper);
  moveInstrumentation(productImageLinkRow, imageLink);

  // Product Title
  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add(
    'elementor-element',
    'elementor-element-9468107',
    'elementor-widget',
    'elementor-widget-icon-box',
  );
  contentContainer.append(titleWrapper);

  const titleWidgetContainer = document.createElement('div');
  titleWidgetContainer.classList.add('elementor-widget-container');
  titleWrapper.append(titleWidgetContainer);

  const iconBoxWrapper = document.createElement('div');
  iconBoxWrapper.classList.add('elementor-icon-box-wrapper');
  titleWidgetContainer.append(iconBoxWrapper);

  const iconBoxContent = document.createElement('div');
  iconBoxContent.classList.add('elementor-icon-box-content');
  iconBoxWrapper.append(iconBoxContent);

  const titleHeading = document.createElement('h3');
  titleHeading.classList.add('elementor-icon-box-title');
  const titleSpan = document.createElement('span');
  titleSpan.textContent = productTitleRow?.textContent.trim() || '';
  titleHeading.append(titleSpan);
  iconBoxContent.append(titleHeading);
  moveInstrumentation(productTitleRow, titleWrapper);

  // CTA Button
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
  innerContainer.append(ctaWrapper);

  const ctaWidgetContainer = document.createElement('div');
  ctaWidgetContainer.classList.add('elementor-widget-container');
  ctaWrapper.append(ctaWidgetContainer);

  const ctaButtonWrapper = document.createElement('div');
  ctaButtonWrapper.classList.add('elementor-button-wrapper');
  ctaWidgetContainer.append(ctaButtonWrapper);

  const ctaButton = document.createElement('a');
  ctaButton.classList.add(
    'elementor-button',
    'elementor-button-link',
    'elementor-size-sm',
  );
  const ctaHref = ctaLinkRow?.querySelector('a')?.href || '#';
  ctaButton.href = ctaHref;
  ctaButtonWrapper.append(ctaButton);

  const ctaContentWrapper = document.createElement('span');
  ctaContentWrapper.classList.add('elementor-button-content-wrapper');
  ctaButton.append(ctaContentWrapper);

  const ctaText = document.createElement('span');
  ctaText.classList.add('elementor-button-text');
  ctaText.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaContentWrapper.append(ctaText);
  moveInstrumentation(ctaLinkRow, ctaButton);
  moveInstrumentation(ctaLabelRow, ctaButton);

  block.replaceChildren(root);
}
