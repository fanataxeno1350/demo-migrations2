import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [labelRow, linkRow] = [...block.children];

  const linkElement = document.createElement('a');
  linkElement.classList.add(
    'z-99',
    'fixed',
    'top-[-1000px]',
    'inset-[auto]',
    'p-4',
    'border-primary',
    'border',
    'rounded-md',
    'font-bold',
    'focus:top-6',
    'focus:left-6',
    'bg-brand-1',
    'text-white',
    'theme-focus-outline',
  );

  // Access the cell from the linkRow
  const authoredLinkCell = linkRow.children[0];
  const authoredLink = authoredLinkCell?.querySelector('a');
  if (authoredLink) {
    linkElement.href = authoredLink.href;
  } else {
    linkElement.href = '#main-content'; // Fallback to a common skip link target
  }

  linkElement.textContent = labelRow.textContent.trim();

  // Move instrumentation from both original rows to the new link element
  moveInstrumentation(labelRow, linkElement);
  moveInstrumentation(linkRow, linkElement);

  block.replaceChildren(linkElement);
}
