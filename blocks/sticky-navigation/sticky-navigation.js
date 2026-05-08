import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add(
    'sticky-bottom-nav',
    'position-fixed',
    'bottom-0',
    'p-3',
    'd-flex',
    'align-items-center',
    'boing-container',
    'bg-boing-primary',
  );

  const ul = document.createElement('ul');
  ul.classList.add(
    'sticky-bottom-nav__list',
    'd-flex',
    'justify-content-around',
    'align-items-center',
    'flex-grow-1',
  );

  [...block.children].forEach((row) => {
    const [iconCell, labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('sticky-bottom-nav__item', 'position-relative');

    const linkEl = document.createElement('a');
    linkEl.classList.add(
      'sticky-bottom-nav__link',
      'd-flex',
      'flex-column',
      'align-items-center',
      'gap-1',
      'analytics_cta_click',
    );

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      // Copy data attributes from the original link if they exist
      if (foundLink.dataset.consent) {
        linkEl.dataset.consent = foundLink.dataset.consent;
      }
      if (foundLink.dataset.link) {
        linkEl.dataset.link = foundLink.dataset.link;
      }
      // Move instrumentation from the original <a> to the new <a>
      moveInstrumentation(foundLink, linkEl);
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.classList.add('sticky-bottom-nav__icon');
        linkEl.append(optimizedPic);
        // Move instrumentation from the original img to the new optimized img
        moveInstrumentation(img, optimizedPic.querySelector('img'));
      }
    }

    const span = document.createElement('span');
    span.classList.add('sticky-bottom-nav__label');
    span.textContent = labelCell.textContent.trim();
    linkEl.append(span);

    moveInstrumentation(row, li);
    li.append(linkEl);
    ul.append(li);
  });

  section.append(ul);
  block.replaceChildren(section);
}
