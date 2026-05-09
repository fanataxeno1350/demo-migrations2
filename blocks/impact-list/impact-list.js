import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const root = document.createElement('section');
  root.classList.add('theme-medium', 'theme-bg', 'theme-section-spacing');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const ul = document.createElement('ul');

  // The first child of the block is the container placeholder for "items"
  // We need to consume it and move its instrumentation.
  const [containerPlaceholder, ...itemRows] = [...block.children];
  moveInstrumentation(containerPlaceholder, ul); // Move instrumentation from placeholder to the ul

  itemRows.forEach((row) => {
    const [highlightCell, labelCell, descriptionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('first:[&>div]:pt-0', 'theme-dark:border-stroke-light/10', 'grid-full', 'items-center', 'gap-grid-gutter');

    const innerDiv = document.createElement('div');
    innerDiv.classList.add('py-lg', 'border-b', 'border-stroke-medium', 'flex', 'flex-col', 'md:grid-centered-12', 'md:grid', 'md:grid-cols-12', 'gap-grid-gutter');

    const highlightWrapper = document.createElement('div');
    highlightWrapper.classList.add('col-span-1', 'md:col-span-7', 'flex', 'items-center', 'gap-grid-gutter');

    const h3 = document.createElement('h3');
    h3.classList.add('font-semibold', 'inline', 'text-h2');

    const highlightSpan = document.createElement('span');
    highlightSpan.classList.add('text-foreground-colored', 'theme-dark:text-foreground-colored-light', 'theme-medium:text-foreground-tm');
    highlightSpan.textContent = highlightCell?.textContent.trim() || '';

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('text-foreground-colored-strong', 'theme-dark:text-foreground-colored-muted', 'theme-medium:text-foreground-muted');
    labelSpan.textContent = labelCell?.textContent.trim() || '';

    h3.append(highlightSpan, labelSpan);
    highlightWrapper.append(h3);

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('col-span-1', 'md:col-span-5');

    const descriptionContent = document.createElement('div');
    descriptionContent.classList.add('text-p1', 'prose', 'theme-dark:prose-td', 'theme-medium:prose-p:text-foreground-strong', 'theme-dark:text-foreground-td');
    descriptionContent.innerHTML = descriptionCell?.innerHTML || '';

    descriptionWrapper.append(descriptionContent);

    innerDiv.append(highlightWrapper, descriptionWrapper);
    li.append(innerDiv);

    moveInstrumentation(row, li); // Move instrumentation from the authored row to the new li
    ul.append(li);
  });

  containerDiv.append(ul);
  root.append(containerDiv);

  block.replaceChildren(root);

  // Image optimization (if any images were present in the description richtext)
  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
