import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  [...block.children].forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      // Copy target attribute from original link if present
      if (foundLink.hasAttribute('target')) {
        anchor.setAttribute('target', foundLink.getAttribute('target'));
      }
    }
    anchor.textContent = labelCell.textContent.trim();
    anchor.classList.add('with-full-underline');

    moveInstrumentation(row, li);
    li.append(anchor);
    quickLinksUl.append(li);
  });

  containerDiv.append(quickLinksUl);
  quickLinksParentDiv.append(containerDiv);
  block.replaceChildren(quickLinksParentDiv);
}
