import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rootSection = document.createElement('section');
  rootSection.classList.add('theme-medium', 'theme-bg', 'theme-section-spacing');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  rootSection.append(containerDiv);

  const ul = document.createElement('ul');
  containerDiv.append(ul);

  // The first child of the block is the container placeholder for "items"
  // We need to consume it and move its instrumentation.
  const [containerPlaceholder, ...itemRows] = [...block.children];
  moveInstrumentation(containerPlaceholder, ul); // Move instrumentation to the <ul>

  itemRows.forEach((row, index) => {
    const [primaryStatCell, secondaryLabelCell, descriptionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('first:[&>div]:pt-0', 'theme-dark:border-stroke-light/10', 'grid-full', 'items-center', 'gap-grid-gutter');
    moveInstrumentation(row, li); // Move instrumentation from the original row to the new <li>

    const innerDiv = document.createElement('div');
    innerDiv.classList.add(
      'py-lg',
      'border-b',
      'border-stroke-medium',
      'flex',
      'flex-col',
      'md:grid-centered-12',
      'md:grid',
      'md:grid-cols-12',
      'gap-grid-gutter',
    );
    li.append(innerDiv);

    const statWrapper = document.createElement('div');
    statWrapper.classList.add('col-span-1', 'md:col-span-7', 'flex', 'items-center', 'gap-grid-gutter');
    innerDiv.append(statWrapper);

    const h3 = document.createElement('h3');
    h3.classList.add('font-semibold', 'inline', 'text-h2');
    statWrapper.append(h3);

    const primaryStatSpan = document.createElement('span');
    primaryStatSpan.classList.add('text-foreground-colored', 'theme-dark:text-foreground-colored-light', 'theme-medium:text-foreground-tm');
    primaryStatSpan.textContent = primaryStatCell?.textContent.trim() || '';
    h3.append(primaryStatSpan);

    const secondaryLabelSpan = document.createElement('span');
    secondaryLabelSpan.classList.add('text-foreground-colored-strong', 'theme-dark:text-foreground-colored-muted', 'theme-medium:text-foreground-muted');
    secondaryLabelSpan.textContent = secondaryLabelCell?.textContent.trim() || '';
    h3.append(secondaryLabelSpan);

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('col-span-1', 'md:col-span-5');
    innerDiv.append(descriptionWrapper);

    const descriptionContent = document.createElement('div');
    descriptionContent.classList.add('text-p1', 'prose', 'theme-dark:prose-td', 'theme-medium:prose-p:text-foreground-strong', 'theme-dark:text-foreground-td');
    descriptionContent.innerHTML = descriptionCell?.innerHTML || '';
    descriptionWrapper.append(descriptionContent);

    ul.append(li);
  });

  block.replaceChildren(rootSection);
}
