import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const root = document.createElement('section');
  root.classList.add('theme-medium', 'theme-bg', 'theme-section-spacing');

  const container = document.createElement('div');
  container.classList.add('container');

  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const [statisticCell, statisticLabelCell, descriptionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('first:[&>div]:pt-0', 'theme-dark:border-stroke-light/10', 'grid-full', 'items-center', 'gap-grid-gutter');
    moveInstrumentation(row, li); // Move instrumentation from original row to new li

    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('py-lg', 'border-b', 'border-stroke-medium', 'flex', 'flex-col', 'md:grid-centered-12', 'md:grid', 'md:grid-cols-12', 'gap-grid-gutter');

    const statisticWrapper = document.createElement('div');
    statisticWrapper.classList.add('col-span-1', 'md:col-span-7', 'flex', 'items-center', 'gap-grid-gutter');

    const h3 = document.createElement('h3');
    h3.classList.add('font-semibold', 'inline', 'text-h2');

    const statisticSpan = document.createElement('span');
    statisticSpan.classList.add('text-foreground-colored', 'theme-dark:text-foreground-colored-light', 'theme-medium:text-foreground-tm');
    statisticSpan.textContent = statisticCell.textContent.trim();

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('text-foreground-colored-strong', 'theme-dark:text-foreground-colored-muted', 'theme-medium:text-foreground-muted');
    labelSpan.textContent = statisticLabelCell.textContent.trim();

    h3.append(statisticSpan, labelSpan);
    statisticWrapper.append(h3);

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('col-span-1', 'md:col-span-5');

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('text-p1', 'prose', 'theme-dark:prose-td', 'theme-medium:prose-p:text-foreground-strong', 'theme-dark:text-foreground-td');
    descriptionDiv.innerHTML = descriptionCell.innerHTML;

    descriptionWrapper.append(descriptionDiv);

    itemWrapper.append(statisticWrapper, descriptionWrapper);
    li.append(itemWrapper);
    ul.append(li);
  });

  container.append(ul);
  root.append(container);
  block.replaceChildren(root);

  root.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
