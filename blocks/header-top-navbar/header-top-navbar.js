import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rootNav = document.createElement('nav');
  rootNav.classList.add('navbar');
  rootNav.id = 'navbar-top';

  const section = document.createElement('section');
  section.classList.add('row', 'region', 'region-secondary-menu');

  const navBlock = document.createElement('nav');
  navBlock.classList.add('block', 'block-menu', 'navigation', 'menu--account');
  navBlock.setAttribute('role', 'navigation');
  navBlock.setAttribute('aria-labelledby', 'block-cbcog-account-menu-menu');
  navBlock.id = 'block-cbcog-account-menu';
  navBlock.setAttribute('data-block-plugin-id', 'system_menu_block:account');

  const h2 = document.createElement('h2');
  h2.classList.add('visually-hidden');
  h2.id = 'block-cbcog-account-menu-menu';
  h2.textContent = 'User account menu';

  const ul = document.createElement('ul');
  ul.classList.add('clearfix', 'nav', 'flex-row');
  ul.setAttribute('data-component-id', 'bootstrap_barrio:menu_columns');

  // Account Menu Items
  [...block.children].forEach((row) => {
    // FIXED: Replaced row.querySelector with array destructuring for fixed-schema item rows
    const [labelCell, linkCell] = [...row.children];

    if (labelCell && linkCell) {
      const li = document.createElement('li');
      li.classList.add('nav-item');

      const anchor = document.createElement('a');
      anchor.classList.add('nav-link', 'nav-link--user-login');
      // FIXED: Removed hardcoded data-drupal-link-system-path. If this attribute is needed,
      // it should come from a model field, not hardcoded in JS.

      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      anchor.textContent = labelCell.textContent.trim();

      moveInstrumentation(row, li);
      li.append(anchor);
      ul.append(li);
    }
  });

  navBlock.append(h2, ul);
  section.append(navBlock);
  rootNav.append(section);

  block.replaceChildren(rootNav);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
