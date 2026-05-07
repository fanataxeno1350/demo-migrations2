import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [backgroundImageRow, headlineRow, breadcrumbRow] = [...block.children];

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('elementor-element', 'elementor-element-7a30379', 'e-con-full', 'e-flex', 'e-con', 'e-parent', 'e-lazyloaded');
  moveInstrumentation(block, mainContainer); // Move instrumentation from block to mainContainer

  // Background Image
  if (backgroundImageRow) {
    const [imageCell] = [...backgroundImageRow.children]; // Destructure to get the image cell
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('elementor-element', 'elementor-element-07c6b9c', 'dce_masking-none', 'elementor-widget', 'elementor-widget-image');

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');

    const picture = imageCell.querySelector('picture'); // Use imageCell
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
        optimizedPic.querySelector('img').classList.add('attachment-full', 'size-full', 'wp-image-66');
        // Move instrumentation from the original cell to the optimized picture element
        moveInstrumentation(imageCell, optimizedPic);
        widgetContainer.append(optimizedPic);
      }
    }
    imageContainer.append(widgetContainer);
    mainContainer.append(imageContainer);
  }

  // Headline
  if (headlineRow) {
    const [headlineCell] = [...headlineRow.children]; // Destructure to get the headline cell
    const headlineContainer = document.createElement('div');
    headlineContainer.classList.add('elementor-element', 'elementor-element-cbf9496', 'elementor-widget', 'elementor-widget-theme-archive-title', 'elementor-page-title', 'elementor-widget-heading');

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');

    const h1 = document.createElement('h1');
    h1.classList.add('elementor-heading-title', 'elementor-size-default');
    h1.textContent = headlineCell.textContent.trim(); // Use headlineCell
    moveInstrumentation(headlineCell, h1); // Move instrumentation from the cell
    widgetContainer.append(h1);
    headlineContainer.append(widgetContainer);
    mainContainer.append(headlineContainer);
  }

  // Breadcrumb
  if (breadcrumbRow) {
    const [breadcrumbCell] = [...breadcrumbRow.children]; // Destructure to get the breadcrumb cell
    const breadcrumbContainer = document.createElement('div');
    breadcrumbContainer.classList.add('elementor-element', 'elementor-element-f87ddb8', 'elementor-widget', 'elementor-widget-woocommerce-breadcrumb');

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');

    const nav = document.createElement('nav');
    nav.classList.add('woocommerce-breadcrumb');
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.innerHTML = breadcrumbCell.innerHTML; // richtext content from breadcrumbCell
    moveInstrumentation(breadcrumbCell, nav); // Move instrumentation from the cell
    widgetContainer.append(nav);
    breadcrumbContainer.append(widgetContainer);
    mainContainer.append(breadcrumbContainer);
  }

  block.replaceChildren(mainContainer);
}
