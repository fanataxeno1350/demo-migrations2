import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block.children directly as per fixed schema
  const [
    productImageRow,
    productLinkRow,
    productTitleRow,
    ctaLabelRow,
    ctaLinkRow,
  ] = [...block.children];

  // Extract cells from rows (each row has one cell)
  const productImageCell = productImageRow.children[0];
  const productLinkCell = productLinkRow.children[0];
  const productTitleCell = productTitleRow.children[0];
  const ctaLabelCell = ctaLabelRow.children[0];
  const ctaLinkCell = ctaLinkRow.children[0];

  const root = document.createElement('div');
  // The outer block div already has 'product-card-6' from AEM.
  // Add other classes from ORIGINAL HTML.
  root.classList.add(
    'elementor',
    'elementor-85',
    'e-loop-item',
    'e-loop-item-248',
    'post-248',
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
  // Move instrumentation from the block itself to the root element
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

  const imageAndTitleContainer = document.createElement('div');
  imageAndTitleContainer.classList.add(
    'elementor-element',
    'elementor-element-bcbf0be',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-child',
  );
  innerCon.append(imageAndTitleContainer);

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
  imageAndTitleContainer.append(imageWidget);

  const imageWidgetContainer = document.createElement('div');
  imageWidgetContainer.classList.add('elementor-widget-container');
  imageWidget.append(imageWidgetContainer);

  const productLink = productLinkCell.querySelector('a')?.href || '#';
  const imageAnchor = document.createElement('a');
  imageAnchor.href = productLink;
  imageWidgetContainer.append(imageAnchor);
  moveInstrumentation(productLinkRow, imageAnchor); // Move instrumentation from productLinkRow

  const picture = productImageCell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
        { width: '1500' },
      ]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageAnchor.append(optimizedPic);
    }
  }
  moveInstrumentation(productImageRow, imageAnchor); // Move instrumentation from productImageRow

  // Product Title
  const titleWidget = document.createElement('div');
  titleWidget.classList.add(
    'elementor-element',
    'elementor-element-9468107',
    'elementor-widget',
    'elementor-widget-icon-box',
  );
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
  moveInstrumentation(productTitleRow, titleHeading); // Move instrumentation from productTitleRow
  const titleSpan = document.createElement('span');
  titleSpan.textContent = productTitleCell.textContent.trim();
  titleHeading.append(titleSpan);
  iconBoxContent.append(titleHeading);

  // CTA Button
  const ctaButtonWidget = document.createElement('div');
  ctaButtonWidget.classList.add(
    'elementor-element',
    'elementor-element-597d13a',
    'elementor-align-center',
    'elementor-mobile-align-center',
    'elementor-tablet-align-center',
    'elementor-widget',
    'elementor-widget-button',
  );
  innerCon.append(ctaButtonWidget);

  const ctaWidgetContainer = document.createElement('div');
  ctaWidgetContainer.classList.add('elementor-widget-container');
  ctaButtonWidget.append(ctaWidgetContainer);

  const ctaButtonWrapper = document.createElement('div');
  ctaButtonWrapper.classList.add('elementor-button-wrapper');
  ctaWidgetContainer.append(ctaButtonWrapper);

  const ctaLinkHref = ctaLinkCell.querySelector('a')?.href || '#';
  const ctaAnchor = document.createElement('a');
  ctaAnchor.classList.add(
    'elementor-button',
    'elementor-button-link',
    'elementor-size-sm',
  );
  ctaAnchor.href = ctaLinkHref;
  moveInstrumentation(ctaLinkRow, ctaAnchor); // Move instrumentation from ctaLinkRow
  ctaButtonWrapper.append(ctaAnchor);

  const ctaContentWrapper = document.createElement('span');
  ctaContentWrapper.classList.add('elementor-button-content-wrapper');
  ctaAnchor.append(ctaContentWrapper);

  const ctaTextSpan = document.createElement('span');
  ctaTextSpan.classList.add('elementor-button-text');
  moveInstrumentation(ctaLabelRow, ctaTextSpan); // Move instrumentation from ctaLabelRow
  ctaTextSpan.textContent = ctaLabelCell.textContent.trim();
  ctaContentWrapper.append(ctaTextSpan);

  block.replaceChildren(root);
}
