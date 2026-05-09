import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const quickLinkItems = [...block.children];

  const rootDiv = document.createElement('div');
  rootDiv.classList.add(
    'mt-0',
    'pt-1',
    'pb-1',
    'm-none1',
    'bottom-0',
    'w-100',
    'quick-links-parents-div',
    'position-relative',
  );

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  quickLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      // Check if the link is external and add target="_blank"
      try {
        const url = new URL(foundLink.href);
        if (url.origin !== window.location.origin) {
          anchor.target = '_blank';
        }
      } catch (e) {
        // Handle invalid URLs if necessary
        // eslint-disable-next-line no-console
        console.warn('Invalid URL in quick link:', foundLink.href, e);
      }
    }

    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor); // Move instrumentation from row to anchor
    li.append(anchor);
    ul.append(li);
  });

  containerDiv.append(ul);
  rootDiv.append(containerDiv);
  block.replaceChildren(rootDiv);
}
