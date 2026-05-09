import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const itemRows = [...block.children];

  const section = document.createElement('section');
  section.classList.add('theme-medium', 'theme-bg', 'theme-section-spacing');

  const container = document.createElement('div');
  container.classList.add('container');

  const ul = document.createElement('ul');

  itemRows.forEach((row) => {
    const [headlineHighlightCell, headlineRestCell, descriptionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add(
      'first:[&>div]:pt-0',
      'theme-dark:border-stroke-light/10',
      'grid-full',
      'items-center',
      'gap-grid-gutter',
    );

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

    const headlineWrapper = document.createElement('div');
    headlineWrapper.classList.add('col-span-1', 'md:col-span-7', 'flex', 'items-center', 'gap-grid-gutter');

    const h3 = document.createElement('h3');
    h3.classList.add('font-semibold', 'inline', 'text-h2');

    const headlineHighlightSpan = document.createElement('span');
    headlineHighlightSpan.classList.add(
      'text-foreground-colored',
      'theme-dark:text-foreground-colored-light',
      'theme-medium:text-foreground-tm',
    );
    headlineHighlightSpan.textContent = headlineHighlightCell.textContent.trim();

    const headlineRestSpan = document.createElement('span');
    headlineRestSpan.classList.add(
      'text-foreground-colored-strong',
      'theme-dark:text-foreground-colored-muted',
      'theme-medium:text-foreground-muted',
    );
    headlineRestSpan.textContent = headlineRestCell.textContent.trim();

    h3.append(headlineHighlightSpan, headlineRestSpan);
    headlineWrapper.append(h3);

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.classList.add('col-span-1', 'md:col-span-5');

    const descriptionContent = document.createElement('div');
    descriptionContent.classList.add(
      'text-p1',
      'prose',
      'theme-dark:prose-td',
      'theme-medium:prose-p:text-foreground-strong',
      'theme-dark:text-foreground-td',
    );
    descriptionContent.innerHTML = descriptionCell.innerHTML;

    descriptionWrapper.append(descriptionContent);

    innerDiv.append(headlineWrapper, descriptionWrapper);
    moveInstrumentation(row, li);
    li.append(innerDiv);
    ul.append(li);
  });

  container.append(ul);
  section.append(container);
  block.replaceChildren(section);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
