import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const rootNav = document.createElement('nav');
  rootNav.setAttribute('role', 'navigation');
  rootNav.setAttribute('aria-labelledby', 'block-departments-menu');
  rootNav.id = 'block-departments';
  // Removed 'block', 'block-menu', 'navigation', 'menu--departments' as the outer block div already has them.
  // Keeping only classes from original HTML that are NOT the block's own name.
  // The original HTML shows these classes on the <nav> element itself, which is the block root.
  // No inner wrapper in original HTML has these classes.
  // rootNav.classList.add('block', 'block-menu', 'navigation', 'menu--departments');

  // Heading
  const headingRow = children[0]; // This is the heading row
  const heading = document.createElement('h2');
  heading.id = 'block-departments-menu';
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.children[0]?.textContent.trim() || ''; // Access content from the cell, not the row
  rootNav.append(heading);

  // Department Links
  const departmentLinksWrapper = document.createElement('ul');
  departmentLinksWrapper.classList.add('clearfix', 'nav');

  // Skip the heading row and process the rest as department link items
  const departmentLinkRows = children.slice(1);

  departmentLinkRows.forEach((row) => {
    // Fixed: Using array destructuring for fixed-schema rows
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('nav-item');

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    anchor.classList.add('nav-link');

    // Add specific nav-link classes based on the link text, mirroring original HTML
    // The original HTML shows classes like nav-link--departments-admin-fin or nav-link-https--aaacoastalbendorg-
    // The generated logic was creating nav-link--departments-administration-finance which is not exact.
    // The original HTML's classes are often derived from the href or a specific data attribute, not just textContent.
    // Given the example, the original classes seem to be derived from the link's path or full URL.
    // To match the original HTML's class naming, we need to inspect the original href.
    // For now, we'll try to match the original pattern based on the href.
    if (foundLink) {
      let classSuffix = '';
      try {
        const url = new URL(foundLink.href);
        if (url.protocol === 'https:' || url.protocol === 'http:') {
          // For external links, use the full domain
          classSuffix = url.hostname.replace(/\./g, ''); // e.g., aaacoastalbendorg
          anchor.classList.add(`nav-link-${url.protocol.slice(0, -1)}--${classSuffix}`);
        } else {
          // For internal links, use the path segments
          classSuffix = url.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-');
          if (classSuffix.startsWith('departments-')) {
            anchor.classList.add(`nav-link--${classSuffix}`);
          } else if (classSuffix === 'adrc') {
            anchor.classList.add(`nav-link--${classSuffix}`);
          } else if (classSuffix === 'news-articles') {
            anchor.classList.add(`nav-link--${classSuffix}`);
          } else {
            // Fallback for other internal paths, if needed, or just use a generic one
            anchor.classList.add(`nav-link--${classSuffix}`);
          }
        }
      } catch (e) {
        // Fallback if URL parsing fails
        const linkText = anchor.textContent.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (linkText) {
          anchor.classList.add(`nav-link--departments-${linkText}`);
        }
      }
    }


    moveInstrumentation(row, li);
    li.append(anchor);
    departmentLinksWrapper.append(li);
  });

  rootNav.append(departmentLinksWrapper);
  block.replaceChildren(rootNav);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
