import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const navItemsWrapper = document.createElement('ul');
  navItemsWrapper.classList.add('site-footer-nav');

  // The first row is the container placeholder for 'navItems'.
  // We need to consume it and move its instrumentation.
  const [containerPlaceholderRow, ...navItemRows] = [...block.children];
  moveInstrumentation(containerPlaceholderRow, navItemsWrapper);

  navItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('site-footer-nav-item');

    const anchor = document.createElement('a');
    // The 'link' field is type=aem-content, so we must read its href from the <a> tag.
    // The original JS correctly identified this but had a redundant 'foundLink' variable.
    anchor.href = linkCell.querySelector('a')?.href || '';
    anchor.textContent = labelCell.textContent.trim();

    moveInstrumentation(row, li);
    li.append(anchor);
    navItemsWrapper.append(li);
  });

  block.replaceChildren(navItemsWrapper);
}
