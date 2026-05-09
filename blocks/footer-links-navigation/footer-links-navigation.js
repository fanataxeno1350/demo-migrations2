import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const navElement = document.createElement('nav');
  // Removed 'block' and 'block-menu' classes as the outer block div already has them.
  // Added 'navigation' and 'menu--links' as per ORIGINAL HTML.
  navElement.classList.add('navigation', 'menu--links');
  navElement.setAttribute('role', 'navigation');
  navElement.setAttribute('aria-labelledby', 'block-links-menu');
  navElement.id = 'block-links';

  const headingRow = children[0]; // This is acceptable as it's a root-level row with a fixed schema.
  const heading = document.createElement('h2');
  heading.id = 'block-links-menu';
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.children[0]?.textContent.trim() || ''; // Read from the cell, not the row
  navElement.append(heading);

  const ul = document.createElement('ul');
  ul.classList.add('clearfix', 'nav');
  ul.setAttribute('data-component-id', 'bootstrap_barrio:menu');

  const linkRows = children.slice(1); // All subsequent rows are footer-link-item

  linkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Correct: named destructuring for fixed schema

    const li = document.createElement('li');
    li.classList.add('nav-item');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;

      // Apply specific nav-link classes directly from ORIGINAL HTML based on href
      // The original heuristic was correct in its intent but needs to use the exact class names.
      if (foundLink.href.includes('texas.gov')) {
        anchor.classList.add('nav-link-https--texasgov-');
      } else if (foundLink.href.includes('equal-opportunity-and-affirmative-action')) {
        anchor.classList.add('nav-link--equal-opportunity-and-affirmative-action');
      } else if (foundLink.href.includes('2020census.gov')) {
        anchor.classList.add('nav-link-https--2020censusgov-');
      } else if (foundLink.href.includes('user/login')) {
        anchor.classList.add('nav-link--user-login');
      }
    }
    anchor.classList.add('nav-link');
    anchor.textContent = labelCell.textContent.trim();

    moveInstrumentation(row, li); // Move instrumentation from the row to the new li
    li.append(anchor);
    ul.append(li);
  });

  navElement.append(ul);
  block.replaceChildren(navElement);
}
