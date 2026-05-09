import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [addressRow, taxInfoRow, copyrightRow, ...footerLinkRows] = [...block.children];

  const root = document.createElement('div');
  root.classList.add('py-2xl', 'text-foreground-invert', 'bg-punaluu-500');

  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid-full', 'container');
  root.append(gridContainer);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('md:col-span-11', 'space-y-sm', '[&>p]:text-p2');
  gridContainer.append(contentWrapper);

  // Address
  if (addressRow) {
    const addressDiv = document.createElement('div');
    moveInstrumentation(addressRow, addressDiv);
    // Address is richtext, so use innerHTML directly from the cell
    addressDiv.innerHTML = addressRow.children[0]?.innerHTML || '';
    contentWrapper.append(addressDiv);
  }

  // Tax Info
  if (taxInfoRow) {
    const taxInfoDiv = document.createElement('div');
    moveInstrumentation(taxInfoRow, taxInfoDiv);
    // Tax Info is richtext, so use innerHTML directly from the cell
    taxInfoDiv.innerHTML = taxInfoRow.children[0]?.innerHTML || '';
    contentWrapper.append(taxInfoDiv);
  }

  // Copyright
  if (copyrightRow) {
    const copyrightDiv = document.createElement('div');
    moveInstrumentation(copyrightRow, copyrightDiv);
    // Copyright is richtext, so use innerHTML directly from the cell
    copyrightDiv.innerHTML = copyrightRow.children[0]?.innerHTML || '';
    contentWrapper.append(copyrightDiv);
  }

  // Footer Links
  if (footerLinkRows.length > 0) {
    const navWrapper = document.createElement('div');
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Secondary footer');
    const ul = document.createElement('ul');
    ul.classList.add('md:flex', 'flex-wrap', 'gap-sm');

    footerLinkRows.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('text-p2', 'mb-sm', 'md:mb-0');

      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        // Check for target and rel attributes from the original link if available
        if (foundLink.target) link.target = foundLink.target;
        if (foundLink.rel) link.rel = foundLink.rel;
      }

      link.textContent = labelCell.textContent.trim();
      link.classList.add(
        'link',
        'text-cta-size',
        'font-semibold',
        'decoration-2',
        'underline-offset-8',
        'text-foreground-invert',
        'hocus:text-foreground-strong-invert',
      );

      // Special handling for "Cookie settings" button
      if (labelCell.textContent.trim().toLowerCase() === 'cookie settings') {
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
        moveInstrumentation(row, link);
        li.append(link);
      }
      ul.append(li);
    });

    nav.append(ul);
    navWrapper.append(nav);
    contentWrapper.append(navWrapper);
  }

  block.replaceChildren(root);
}
