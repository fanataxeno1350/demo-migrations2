import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // block.children are the rows, each row contains a single cell (div)
  // We need to destructure the cells from the first child of each row.
  const [
    productImageRow,
    productLinkRow,
    productTitleRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const root = document.createElement('div');
  root.classList.add(
    'elementor',
    'elementor-85',
    'e-loop-item',
    'e-loop-item-245',
    'post-245',
    'product',
    'type-product',
    'status-publish',
    'has-post-thumbnail',
    'product_brand-nataraj',
    'product_cat-pencils',
    'product_tag-college',
    'product_tag-school',
    'instock',
    'shipping-taxable',
    'purchasable',
    'product-type-simple',
  );
  moveInstrumentation(block, root);

  const elementorElementDc6b024 = document.createElement('div');
  elementorElementDc6b024.classList.add(
    'elementor-element',
    'elementor-element-dc6b024',
    'e-flex',
    'e-con-boxed',
    'e-con',
    'e-parent',
    'e-lazyloaded',
  );
  root.append(elementorElementDc6b024);

  const eConInner = document.createElement('div');
  eConInner.classList.add('e-con-inner');
  elementorElementDc6b024.append(eConInner);

  const elementorElementBcbf0be = document.createElement('div');
  elementorElementBcbf0be.classList.add(
    'elementor-element',
    'elementor-element-bcbf0be',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-child',
  );
  eConInner.append(elementorElementBcbf0be);

  const elementorElementBcab75b = document.createElement('div');
  elementorElementBcab75b.classList.add(
    'elementor-element',
    'elementor-element-bcab75b',
    'plp-image',
    'dce_masking-none',
    'elementor-widget',
    'elementor-widget-image',
  );
  elementorElementBcbf0be.append(elementorElementBcab75b);

  const elementorWidgetContainerImage = document.createElement('div');
  elementorWidgetContainerImage.classList.add('elementor-widget-container');
  elementorElementBcab75b.append(elementorWidgetContainerImage);

  // Access the actual cell content from the row's first child
  const productLinkCell = productLinkRow?.children[0];
  const productLink = productLinkCell?.querySelector('a')?.href || '#';
  const imageAnchor = document.createElement('a');
  imageAnchor.href = productLink;
  elementorWidgetContainerImage.append(imageAnchor);

  // Access the actual cell content from the row's first child
  const productImageCell = productImageRow?.children[0];
  const picture = productImageCell?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
        { width: '1500' },
      ]);
      // moveInstrumentation should be from the original picture element to the new optimized picture
      moveInstrumentation(picture, optimizedPic);
      imageAnchor.append(optimizedPic);
    }
  }

  const elementorElement9468107 = document.createElement('div');
  elementorElement9468107.classList.add(
    'elementor-element',
    'elementor-element-9468107',
    'elementor-widget',
    'elementor-widget-icon-box',
  );
  elementorElementBcbf0be.append(elementorElement9468107);

  const elementorWidgetContainerIconBox = document.createElement('div');
  elementorWidgetContainerIconBox.classList.add('elementor-widget-container');
  elementorElement9468107.append(elementorWidgetContainerIconBox);

  const elementorIconBoxWrapper = document.createElement('div');
  elementorIconBoxWrapper.classList.add('elementor-icon-box-wrapper');
  elementorWidgetContainerIconBox.append(elementorIconBoxWrapper);

  const elementorIconBoxContent = document.createElement('div');
  elementorIconBoxContent.classList.add('elementor-icon-box-content');
  elementorIconBoxWrapper.append(elementorIconBoxContent);

  const productTitle = document.createElement('h3');
  productTitle.classList.add('elementor-icon-box-title');
  // Access the actual cell content from the row's first child
  const productTitleCell = productTitleRow?.children[0];
  moveInstrumentation(productTitleCell, productTitle);
  const titleSpan = document.createElement('span');
  titleSpan.textContent = productTitleCell?.textContent.trim() || '';
  productTitle.append(titleSpan);
  elementorIconBoxContent.append(productTitle);

  const elementorElement597d13a = document.createElement('div');
  elementorElement597d13a.classList.add(
    'elementor-element',
    'elementor-element-597d13a',
    'elementor-align-center',
    'elementor-mobile-align-center',
    'elementor-tablet-align-center',
    'elementor-widget',
    'elementor-widget-button',
  );
  eConInner.append(elementorElement597d13a);

  const elementorWidgetContainerButton = document.createElement('div');
  elementorWidgetContainerButton.classList.add('elementor-widget-container');
  elementorElement597d13a.append(elementorWidgetContainerButton);

  const elementorButtonWrapper = document.createElement('div');
  elementorButtonWrapper.classList.add('elementor-button-wrapper');
  elementorWidgetContainerButton.append(elementorButtonWrapper);

  // Access the actual cell content from the row's first child
  const ctaLinkCell = ctaLinkRow?.children[0];
  const ctaLink = ctaLinkCell?.querySelector('a')?.href || '#';
  const ctaButton = document.createElement('a');
  ctaButton.classList.add(
    'elementor-button',
    'elementor-button-link',
    'elementor-size-sm',
  );
  ctaButton.href = ctaLink;
  moveInstrumentation(ctaLinkCell, ctaButton);
  elementorButtonWrapper.append(ctaButton);

  const ctaSpanWrapper = document.createElement('span');
  ctaSpanWrapper.classList.add('elementor-button-content-wrapper');
  ctaButton.append(ctaSpanWrapper);

  const ctaText = document.createElement('span');
  ctaText.classList.add('elementor-button-text');
  // Access the actual cell content from the row's first child
  const ctaLabelCell = ctaLabelRow?.children[0];
  moveInstrumentation(ctaLabelCell, ctaText);
  ctaText.textContent = ctaLabelCell?.textContent.trim() || '';
  ctaSpanWrapper.append(ctaText);

  block.replaceChildren(root);
}
