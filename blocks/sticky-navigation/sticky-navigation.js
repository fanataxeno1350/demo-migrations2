import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const navItems = [...block.children];

  const section = document.createElement('section');
  section.classList.add('sticky-bottom-nav', 'position-fixed', 'bottom-0', 'p-3', 'd-flex', 'align-items-center', 'boing-container', 'bg-boing-primary');

  const ul = document.createElement('ul');
  ul.classList.add('sticky-bottom-nav__list', 'd-flex', 'justify-content-around', 'align-items-center', 'flex-grow-1');

  navItems.forEach((row) => {
    const [linkCell, iconCell, labelCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('sticky-bottom-nav__item', 'position-relative');

    const link = document.createElement('a');
    link.classList.add('sticky-bottom-nav__link', 'd-flex', 'flex-column', 'align-items-center', 'gap-1', 'analytics_cta_click');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      // Copy data-consent and data-link if they exist on the original anchor
      if (foundLink.dataset.consent) link.dataset.consent = foundLink.dataset.consent;
      if (foundLink.dataset.link) link.dataset.link = foundLink.dataset.link;
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('sticky-bottom-nav__icon');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
    }

    const span = document.createElement('span');
    span.classList.add('sticky-bottom-nav__label');
    span.textContent = labelCell.textContent.trim();
    link.append(span);

    moveInstrumentation(row, li); // Move instrumentation from the original row to the new li
    li.append(link);
    ul.append(li);
  });

  section.append(ul);
  block.replaceChildren(section);
}
