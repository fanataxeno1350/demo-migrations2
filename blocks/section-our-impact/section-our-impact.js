import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rootSection = document.createElement('section');
  rootSection.classList.add('theme-medium', 'theme-bg', 'theme-section-spacing');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const ul = document.createElement('ul');

  // The first child of the block is the container placeholder for 'items'
  // We need to consume it and move its instrumentation.
  const [containerPlaceholder, ...itemRows] = [...block.children];
  moveInstrumentation(containerPlaceholder, ul); // Move instrumentation from placeholder to the ul

  itemRows.forEach((row) => {
    const [statPrimaryCell, statSecondaryCell, descriptionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('first:[&>div]:pt-0', 'theme-dark:border-stroke-light/10', 'grid-full', 'items-center', 'gap-grid-gutter');

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('py-lg', 'border-b', 'border-stroke-medium', 'flex', 'flex-col', 'md:grid-centered-12', 'md:grid', 'md:grid-cols-12', 'gap-grid-gutter');

    const statWrapperDiv = document.createElement('div');
    statWrapperDiv.classList.add('col-span-1', 'md:col-span-7', 'flex', 'items-center', 'gap-grid-gutter');

    const h3 = document.createElement('h3');
    h3.classList.add('font-semibold', 'inline', 'text-h2');

    const primarySpan = document.createElement('span');
    primarySpan.classList.add('text-foreground-colored', 'theme-dark:text-foreground-colored-light', 'theme-medium:text-foreground-tm');
    primarySpan.textContent = statPrimaryCell?.textContent.trim() || '';

    const secondarySpan = document.createElement('span');
    secondarySpan.classList.add('text-foreground-colored-strong', 'theme-dark:text-foreground-colored-muted', 'theme-medium:text-foreground-muted');
    secondarySpan.textContent = statSecondaryCell?.textContent.trim() || '';

    h3.append(primarySpan, secondarySpan);
    statWrapperDiv.append(h3);

    const descriptionWrapperDiv = document.createElement('div');
    descriptionWrapperDiv.classList.add('col-span-1', 'md:col-span-5');

    const descriptionContentDiv = document.createElement('div');
    descriptionContentDiv.classList.add('text-p1', 'prose', 'theme-dark:prose-td', 'theme-medium:prose-p:text-foreground-strong', 'theme-dark:text-foreground-td');
    descriptionContentDiv.innerHTML = descriptionCell?.innerHTML || '';

    descriptionWrapperDiv.append(descriptionContentDiv);

    itemDiv.append(statWrapperDiv, descriptionWrapperDiv);
    moveInstrumentation(row, li); // Move instrumentation from item row to the new li
    li.append(itemDiv);
    ul.append(li);
  });

  containerDiv.append(ul);
  rootSection.append(containerDiv);

  block.replaceChildren(rootSection);
}
