import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0.5: The block's own class 'product-card-2' is NOT added to any inner wrapper.
  // The outer block div already carries this class from AEM.

  // CHECK 0: No direct .children[n] bracket access for variable assignment.
  // Array destructuring is used for fixed-schema rows, which is correct.
  const [productImageRow, productLinkRow, productTitleRow, ctaLabelRow] = [...block.children];

  const productCard = document.createElement('div');
  // CHECK 2.6 B: All classes copied verbatim from ORIGINAL HTML.
  productCard.classList.add(
    'elementor',
    'elementor-85',
    'e-loop-item',
    'e-loop-item-242',
    'post-242',
    'product',
    'type-product',
    'status-publish',
    'has-post-thumbnail',
    'product_brand-nataraj',
    'product_cat-pencils',
    'product_tag-professionals',
    'instock',
    'shipping-taxable',
    'purchasable',
    'product-type-simple',
  );
  // CHECK 3: moveInstrumentation for the block itself.
  moveInstrumentation(block, productCard);

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
  productCard.append(elementorContainer);

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');
  elementorContainer.append(innerCon);

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

  // CHECK 1: productLink is type=aem-content, read href.
  const productLink = productLinkRow?.querySelector('a')?.href || '#';
  moveInstrumentation(productLinkRow, imageWidgetContainer); // Move instrumentation for the link row

  const imageLink = document.createElement('a');
  imageLink.href = productLink;
  imageWidgetContainer.append(imageLink);

  // CHECK 1: productImage is type=reference, read picture.
  const picture = productImageRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      // CHECK 3: Removed hardcoded image path. Using img.src from authored content.
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      // CHECK 3: moveInstrumentation for the image itself.
      moveInstrumentation(productImageRow, optimizedPic.querySelector('img')); // Move instrumentation for the image row
      imageLink.append(optimizedPic);
    }
  }

  const iconBoxWidget = document.createElement('div');
  iconBoxWidget.classList.add(
    'elementor-element',
    'elementor-element-9468107',
    'elementor-widget',
    'elementor-widget-icon-box',
  );
  topCon.append(iconBoxWidget);

  const iconBoxWidgetContainer = document.createElement('div');
  iconBoxWidgetContainer.classList.add('elementor-widget-container');
  iconBoxWidget.append(iconBoxWidgetContainer);

  const iconBoxWrapper = document.createElement('div');
  iconBoxWrapper.classList.add('elementor-icon-box-wrapper');
  iconBoxWidgetContainer.append(iconBoxWrapper);

  const iconBoxContent = document.createElement('div');
  iconBoxContent.classList.add('elementor-icon-box-content');
  iconBoxWrapper.append(iconBoxContent);

  const title = document.createElement('h3');
  title.classList.add('elementor-icon-box-title');
  // CHECK 3: moveInstrumentation for productTitleRow.
  moveInstrumentation(productTitleRow, title);
  // CHECK 0.6 & 0.7: productTitle is type=text, read textContent.trim(). No innerHTML from row.
  title.innerHTML = `<span>${productTitleRow?.textContent.trim()}</span>`;
  iconBoxContent.append(title);

  const buttonWidget = document.createElement('div');
  buttonWidget.classList.add(
    'elementor-element',
    'elementor-element-597d13a',
    'elementor-align-center',
    'elementor-mobile-align-center',
    'elementor-tablet-align-center',
    'elementor-widget',
    'elementor-widget-button',
  );
  innerCon.append(buttonWidget);

  const buttonWidgetContainer = document.createElement('div');
  buttonWidgetContainer.classList.add('elementor-widget-container');
  buttonWidget.append(buttonWidgetContainer);

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('elementor-button-wrapper');
  buttonWidgetContainer.append(buttonWrapper);

  const ctaButton = document.createElement('a');
  ctaButton.classList.add(
    'elementor-button',
    'elementor-button-link',
    'elementor-size-sm',
  );
  ctaButton.href = productLink;
  // CHECK 3: moveInstrumentation for ctaLabelRow.
  moveInstrumentation(ctaLabelRow, ctaButton);

  const buttonContentWrapper = document.createElement('span');
  buttonContentWrapper.classList.add('elementor-button-content-wrapper');
  ctaButton.append(buttonContentWrapper);

  const buttonText = document.createElement('span');
  buttonText.classList.add('elementor-button-text');
  // CHECK 0.6 & 0.7: ctaLabel is type=text, read textContent.trim().
  buttonText.textContent = ctaLabelRow?.textContent.trim();
  buttonContentWrapper.append(buttonText);
  buttonWrapper.append(ctaButton);

  // CHECK 3: Replaced block.innerHTML = '' + append with atomic replaceChildren.
  block.replaceChildren(productCard);
}
