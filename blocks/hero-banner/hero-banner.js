import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use array destructuring for fixed-schema rows
  const [imageRow, headlineRow, breadcrumbRow] = [...block.children];

  // Create the main container div
  const mainContainer = document.createElement('div');
  mainContainer.classList.add('elementor-element', 'elementor-element-7a30379', 'e-con-full', 'e-flex', 'e-con', 'e-parent', 'e-lazyloaded');

  // Process the image row
  // imageRow.children[0] is the actual cell containing the picture
  const imageCell = imageRow?.children[0];
  if (imageCell) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('elementor-element', 'elementor-element-07c6b9c', 'dce_masking-none', 'elementor-widget', 'elementor-widget-image');
    moveInstrumentation(imageRow, imageWrapper);

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
        optimizedPic.querySelector('img').classList.add('attachment-full', 'size-full', 'wp-image-66');
        widgetContainer.append(optimizedPic);
      }
    }
    imageWrapper.append(widgetContainer);
    mainContainer.append(imageWrapper);
  }

  // Process the headline row
  // headlineRow.children[0] is the actual cell containing the headline text
  const headlineCell = headlineRow?.children[0];
  if (headlineCell) {
    const headlineWrapper = document.createElement('div');
    headlineWrapper.classList.add('elementor-element', 'elementor-element-cbf9496', 'elementor-widget', 'elementor-widget-theme-archive-title', 'elementor-page-title', 'elementor-widget-heading');
    moveInstrumentation(headlineRow, headlineWrapper);

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');

    const h1 = document.createElement('h1');
    h1.classList.add('elementor-heading-title', 'elementor-size-default');
    h1.textContent = headlineCell.textContent.trim();
    widgetContainer.append(h1);

    headlineWrapper.append(widgetContainer);
    mainContainer.append(headlineWrapper);
  }

  // Process the breadcrumb row
  // breadcrumbRow.children[0] is the actual cell containing the richtext breadcrumb
  const breadcrumbCell = breadcrumbRow?.children[0];
  if (breadcrumbCell) {
    const breadcrumbWrapper = document.createElement('div');
    breadcrumbWrapper.classList.add('elementor-element', 'elementor-element-f87ddb8', 'elementor-widget', 'elementor-widget-woocommerce-breadcrumb');
    moveInstrumentation(breadcrumbRow, breadcrumbWrapper);

    const widgetContainer = document.createElement('div');
    widgetContainer.classList.add('elementor-widget-container');

    const nav = document.createElement('nav');
    nav.classList.add('woocommerce-breadcrumb');
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.innerHTML = breadcrumbCell.innerHTML; // richtext content
    widgetContainer.append(nav);

    breadcrumbWrapper.append(widgetContainer);
    mainContainer.append(breadcrumbWrapper);
  }

  block.replaceChildren(mainContainer);
}
