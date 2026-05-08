import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const root = document.createElement('section');
  // Removed 'sticky-bottom-nav' from root.classList.add as the outer block div already has it.
  root.classList.add(
    'position-fixed',
    'bottom-0',
    'p-3',
    'd-flex',
    'align-items-center',
    'boing-container',
    'bg-boing-primary',
  );

  const navList = document.createElement('ul');
  navList.classList.add(
    'sticky-bottom-nav__list',
    'd-flex',
    'justify-content-around',
    'align-items-center',
    'flex-grow-1',
  );

  [...block.children].forEach((row) => {
    const [iconCell, labelCell, linkCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('sticky-bottom-nav__item', 'position-relative');

    const linkAnchor = document.createElement('a');
    linkAnchor.classList.add(
      'sticky-bottom-nav__link',
      'd-flex',
      'flex-column',
      'align-items-center',
      'gap-1',
      'analytics_cta_click',
    );

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkAnchor.href = foundLink.href;
      // Copy data attributes from the original link if they exist
      if (foundLink.dataset.consent) {
        linkAnchor.dataset.consent = foundLink.dataset.consent;
      }
      if (foundLink.dataset.link) {
        linkAnchor.dataset.link = foundLink.dataset.link;
      }
    } else {
      linkAnchor.href = '#'; // Fallback href
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('sticky-bottom-nav__icon');
        // moveInstrumentation from original img to optimized img
        moveInstrumentation(img, optimizedImg);
        linkAnchor.append(optimizedPic);
      }
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('sticky-bottom-nav__label');
    labelSpan.textContent = labelCell.textContent.trim();
    linkAnchor.append(labelSpan);

    moveInstrumentation(row, listItem);
    listItem.append(linkAnchor);
    navList.append(listItem);
  });

  root.append(navList);
  block.replaceChildren(root);
}
