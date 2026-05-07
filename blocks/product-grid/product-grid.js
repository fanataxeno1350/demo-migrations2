import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const productItems = [...block.children];

  const productGridContainer = document.createElement('div');
  productGridContainer.classList.add(
    'woocommerce',
    'elementor-element',
    'elementor-element-e5eeeb8',
    'elementor-grid-tablet-3',
    'elementor-grid-mobile-2',
    'elementor-grid-3',
    'elementor-widget',
    'elementor-widget-loop-grid',
  );

  const widgetContainer = document.createElement('div');
  widgetContainer.classList.add('elementor-widget-container');
  productGridContainer.append(widgetContainer);

  const loopContainer = document.createElement('div');
  loopContainer.classList.add('elementor-loop-container', 'elementor-grid');
  loopContainer.setAttribute('role', 'list');
  widgetContainer.append(loopContainer);

  productItems.forEach((row) => {
    const [imageCell, imageLinkCell, titleCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const productWrapper = document.createElement('div');
    productWrapper.classList.add(
      'elementor',
      'elementor-85',
      'e-loop-item',
      // 'e-loop-item-94', // This class changes per item in original, removed
      // 'post-94', // This class changes per item in original, removed
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
    // Move instrumentation from the original row to the new productWrapper
    moveInstrumentation(row, productWrapper);

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
    productWrapper.append(mainContainer);

    const innerContainer = document.createElement('div');
    innerContainer.classList.add('e-con-inner');
    mainContainer.append(innerContainer);

    const topSection = document.createElement('div');
    topSection.classList.add(
      'elementor-element',
      'elementor-element-bcbf0be',
      'e-con-full',
      'e-flex',
      'e-con',
      'e-child',
    );
    innerContainer.append(topSection);

    // Product Image
    const imageElement = imageCell.querySelector('picture');
    if (imageElement) {
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add(
        'elementor-element',
        'elementor-element-bcab75b',
        'plp-image',
        'dce_masking-none',
        'elementor-widget',
        'elementor-widget-image',
      );
      topSection.append(imageWrapper);

      const imageWidgetContainer = document.createElement('div');
      imageWidgetContainer.classList.add('elementor-widget-container');
      imageWrapper.append(imageWidgetContainer);

      const imageLink = document.createElement('a');
      const foundImageLink = imageLinkCell.querySelector('a');
      if (foundImageLink) {
        imageLink.href = foundImageLink.href;
      } else {
        imageLink.href = '#';
      }

      const img = imageElement.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1500' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageLink.append(optimizedPic);
      imageWidgetContainer.append(imageLink);
    }

    // Product Title
    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add(
      'elementor-element',
      'elementor-element-9468107',
      'elementor-widget',
      'elementor-widget-icon-box',
    );
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

    const titleHeading = document.createElement('h3');
    titleHeading.classList.add('elementor-icon-box-title');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = titleCell.textContent.trim();
    titleHeading.append(titleSpan);
    iconBoxContent.append(titleHeading);

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

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('elementor-button', 'elementor-button-link', 'elementor-size-sm');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    } else {
      ctaLink.href = '#';
    }

    const ctaContentWrapper = document.createElement('span');
    ctaContentWrapper.classList.add('elementor-button-content-wrapper');
    ctaLink.append(ctaContentWrapper);

    const ctaText = document.createElement('span');
    ctaText.classList.add('elementor-button-text');
    ctaText.textContent = ctaLabelCell.textContent.trim();
    ctaContentWrapper.append(ctaText);

    ctaButtonWrapper.append(ctaLink);

    loopContainer.append(productWrapper);
  });

  block.replaceChildren(productGridContainer);
}
