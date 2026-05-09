import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [orgInfoRow, disclaimerRow, copyrightRow, ...legalLinkRows] = children;

  const root = document.createElement('div');
  root.classList.add('py-2xl', 'text-foreground-invert', 'bg-punaluu-500');

  const gridFullContainer = document.createElement('div');
  gridFullContainer.classList.add('grid-full', 'container');
  root.append(gridFullContainer);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('md:col-span-11', 'space-y-sm', '[&>p]:text-p2');
  gridFullContainer.append(contentWrapper);

  // Organization Info
  if (orgInfoRow) {
    const orgInfoDiv = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    moveInstrumentation(orgInfoRow, orgInfoDiv);
    orgInfoDiv.innerHTML = orgInfoRow.children[0]?.innerHTML || '';
    contentWrapper.append(orgInfoDiv);
  }

  // Disclaimer
  if (disclaimerRow) {
    const disclaimerDiv = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    moveInstrumentation(disclaimerRow, disclaimerDiv);
    disclaimerDiv.innerHTML = disclaimerRow.children[0]?.innerHTML || '';
    contentWrapper.append(disclaimerDiv);
  }

  // Copyright
  if (copyrightRow) {
    const copyrightParagraph = document.createElement('p');
    moveInstrumentation(copyrightRow, copyrightParagraph);
    copyrightParagraph.textContent = copyrightRow.children[0]?.textContent.trim() || '';
    contentWrapper.append(copyrightParagraph);
  }

  // Legal Links
  if (legalLinkRows.length > 0) {
    const navWrapper = document.createElement('div');
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Secondary footer');
    navWrapper.append(nav);

    const ul = document.createElement('ul');
    ul.classList.add('md:flex', 'flex-wrap', 'gap-sm');
    nav.append(ul);

    legalLinkRows.forEach((row) => {
      const [labelCell, linkCell] = [...row.children]; // Fixed: named destructuring for fixed schema
      const li = document.createElement('li');
      li.classList.add('text-p2', 'mb-sm', 'md:mb-0');

      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        // Check for target and rel attributes from original HTML
        if (foundLink.target) anchor.target = foundLink.target;
        if (foundLink.rel) anchor.rel = foundLink.rel;
      }
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add(
        'link',
        'text-cta-size',
        'font-semibold',
        'decoration-2',
        'underline-offset-8',
        'text-foreground-invert',
        'hocus:text-foreground-strong-invert',
      );
      moveInstrumentation(row, anchor);
      li.append(anchor);
      ul.append(li);
    });

    // Add Cookie Settings button from ORIGINAL HTML
    const cookieSettingsLi = document.createElement('li');
    cookieSettingsLi.classList.add('text-p2', 'mb-sm', 'md:mb-0');
    const cookieSettingsButton = document.createElement('button');
    cookieSettingsButton.type = 'button';
    cookieSettingsButton.classList.add(
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
    cookieSettingsButton.textContent = 'Cookie settings'; // Hardcoded text from original HTML
    cookieSettingsLi.append(cookieSettingsButton);
    ul.append(cookieSettingsLi);

    // Add event listener for the cookie settings button
    cookieSettingsButton.addEventListener('click', () => {
      // Assuming OneTrust is loaded globally as 'window.OneTrust'
      if (window.OneTrust && typeof window.OneTrust.ToggleInfoDisplay === 'function') {
        window.OneTrust.ToggleInfoDisplay();
      } else {
        console.warn('OneTrust SDK not found or ToggleInfoDisplay not available.');
      }
    });

    contentWrapper.append(navWrapper);
  }

  block.replaceChildren(root);
}
