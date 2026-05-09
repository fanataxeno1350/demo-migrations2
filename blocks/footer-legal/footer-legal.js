import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The block.children array will contain the addressRow followed by all footerLinkRows.
  // The 'footerLinksContainer' is a conceptual container field in the model, not a distinct row in block.children.
  const [addressRow, ...footerLinkRows] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('py-2xl', 'text-foreground-invert', 'bg-punaluu-500');

  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid-full', 'container');

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('md:col-span-11', 'space-y-sm', '[&>p]:text-p2');

  // Address and Organization Info (richtext field)
  if (addressRow) {
    // The address field is richtext, so its content is directly in the first child div (the cell).
    // We need to read innerHTML to preserve formatting.
    const addressCell = addressRow.children[0];
    if (addressCell) {
      moveInstrumentation(addressRow, contentWrapper);
      // Append innerHTML directly to preserve rich text structure
      contentWrapper.innerHTML += addressCell.innerHTML;
    }
  }

  // Footer Links
  if (footerLinkRows.length > 0) {
    const navDiv = document.createElement('div');
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Secondary footer');
    const ul = document.createElement('ul');
    ul.classList.add('md:flex', 'flex-wrap', 'gap-sm');

    footerLinkRows.forEach((row) => {
      // Each footerLinkRow has a fixed schema: [labelCell, linkCell]
      const [labelCell, linkCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('text-p2', 'mb-sm', 'md:mb-0');

      // Check for 'Cookie settings' special case first
      if (labelCell && labelCell.textContent.trim().toLowerCase() === 'cookie settings') {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add(
          'ot-sdk-show-settings',
          'cursor-pointer',
          'link',
          'text-cta-size',
          'font-semibold',
          'decoration-2',
          'underline-offset-8',
          'text-foreground-invert',
          'hocus:text-foreground-strong-invert',
        );
        button.textContent = labelCell.textContent.trim();
        moveInstrumentation(row, button);
        li.append(button);
      } else {
        // Regular link
        const linkEl = document.createElement('a');
        linkEl.classList.add(
          'link',
          'text-cta-size',
          'font-semibold',
          'decoration-2',
          'underline-offset-8',
          'text-foreground-invert',
          'hocus:text-foreground-strong-invert',
        );

        const foundLink = linkCell?.querySelector('a'); // linkCell is aem-content, so it contains an <a>
        if (foundLink) {
          linkEl.href = foundLink.href;
          // Copy target and rel attributes if they exist in the original link
          if (foundLink.target) linkEl.target = foundLink.target;
          if (foundLink.rel) linkEl.rel = foundLink.rel;
        }

        if (labelCell) {
          linkEl.textContent = labelCell.textContent.trim();
        }
        moveInstrumentation(row, linkEl);
        li.append(linkEl);
      }

      ul.append(li);
    });

    nav.append(ul);
    navDiv.append(nav);
    contentWrapper.append(navDiv);
  }

  // No need to move instrumentation from 'footerLinksContainer' as it's not a distinct DOM element.
  // Instrumentation is moved from individual rows.

  gridContainer.append(contentWrapper);
  root.append(gridContainer);

  block.replaceChildren(root);
}
