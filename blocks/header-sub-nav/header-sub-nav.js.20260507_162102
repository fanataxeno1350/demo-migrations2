import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const navItems = [...block.children];

  const root = document.createElement('div');
  root.classList.add('elementor-element', 'elementor-element-ff0ccea', 'elementor-hidden-mobile', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');
  root.setAttribute('data-id', 'ff0ccea');
  root.setAttribute('data-element_type', 'container');
  root.setAttribute('data-settings', '{"background_background":"classic"}');

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');
  root.append(innerCon);

  const iconListWidget = document.createElement('div');
  iconListWidget.classList.add('elementor-element', 'elementor-element-8b8d930', 'elementor-icon-list--layout-inline', 'elementor-align-center', 'elementor-list-item-link-full_width', 'elementor-widget', 'elementor-widget-icon-list');
  iconListWidget.setAttribute('data-id', '8b8d930');
  iconListWidget.setAttribute('data-element_type', 'widget');
  iconListWidget.setAttribute('data-widget_type', 'icon-list.default');
  innerCon.append(iconListWidget);

  const widgetContainer = document.createElement('div');
  widgetContainer.classList.add('elementor-widget-container');
  iconListWidget.append(widgetContainer);

  const ul = document.createElement('ul');
  ul.classList.add('elementor-icon-list-items', 'elementor-inline-items');
  widgetContainer.append(ul);

  navItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('elementor-icon-list-item', 'elementor-inline-item');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }

    const span = document.createElement('span');
    span.classList.add('elementor-icon-list-text');
    span.textContent = labelCell.textContent.trim();

    anchor.append(span);
    moveInstrumentation(row, anchor); // Move instrumentation from the row to the anchor
    li.append(anchor);
    ul.append(li);
  });

  block.replaceChildren(root);
}
