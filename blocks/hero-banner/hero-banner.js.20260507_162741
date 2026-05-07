import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [backgroundImageRow, headlineRow, breadcrumbRow] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('elementor-element', 'elementor-element-7a30379', 'e-con-full', 'e-flex', 'e-con', 'e-parent', 'e-lazyloaded');

  // Background Image
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('elementor-element', 'elementor-element-07c6b9c', 'dce_masking-none', 'elementor-widget', 'elementor-widget-image');
  moveInstrumentation(backgroundImageRow, imageContainer);

  const widgetContainer = document.createElement('div');
  widgetContainer.classList.add('elementor-widget-container');

  const picture = backgroundImageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      widgetContainer.append(optimizedPic);
    }
  }
  imageContainer.append(widgetContainer);
  root.append(imageContainer);

  // Headline
  const headlineContainer = document.createElement('div');
  headlineContainer.classList.add('elementor-element', 'elementor-element-cbf9496', 'elementor-widget', 'elementor-widget-theme-archive-title', 'elementor-page-title', 'elementor-widget-heading');
  moveInstrumentation(headlineRow, headlineContainer);

  const headlineWidgetContainer = document.createElement('div');
  headlineWidgetContainer.classList.add('elementor-widget-container');

  const h1 = document.createElement('h1');
  h1.classList.add('elementor-heading-title', 'elementor-size-default');
  h1.textContent = headlineRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  headlineWidgetContainer.append(h1);
  headlineContainer.append(headlineWidgetContainer);
  root.append(headlineContainer);

  // Breadcrumb
  const breadcrumbContainer = document.createElement('div');
  breadcrumbContainer.classList.add('elementor-element', 'elementor-element-f87ddb8', 'elementor-widget', 'elementor-widget-woocommerce-breadcrumb');
  moveInstrumentation(breadcrumbRow, breadcrumbContainer);

  const breadcrumbWidgetContainer = document.createElement('div');
  breadcrumbWidgetContainer.classList.add('elementor-widget-container');

  const nav = document.createElement('nav');
  nav.classList.add('woocommerce-breadcrumb');
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.innerHTML = breadcrumbRow.children[0]?.innerHTML || ''; // richtext content from the cell
  breadcrumbWidgetContainer.append(nav);
  breadcrumbContainer.append(breadcrumbWidgetContainer);
  root.append(breadcrumbContainer);

  block.replaceChildren(root);
}
