import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('elementor-nav-menu--dropdown'); // Use class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('elementor-item-anchor', 'has-submenu'); // Use classes from ORIGINAL HTML
        const subArrow = document.createElement('span');
        subArrow.classList.add('sub-arrow');
        subArrow.innerHTML = '<svg class="e-font-icon-svg e-fas-caret-down" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
        trigger.append(subArrow);

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find(
    (row) => row.querySelector('a') && !row.querySelector('picture'),
  );

  const navigationItemRows = children.filter(
    (row) => row.children.length === 3,
  );
  const audienceLinkItemRows = children.filter(
    (row) => row.children.length === 2,
  );

  const headerContainer = document.createElement('div');
  headerContainer.classList.add(
    'elementor-element',
    'elementor-element-7910b0b',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-parent',
    'e-lazyloaded',
    'elementor-sticky',
    'elementor-sticky--active',
    'elementor-section--handles-inside',
    'elementor-sticky--effects',
  );

  const innerContainer = document.createElement('div');
  innerContainer.classList.add(
    'elementor-element',
    'elementor-element-2dcde62',
    'e-flex',
    'e-con-boxed',
    'e-con',
    'e-child',
  );

  const innerConInner = document.createElement('div');
  innerConInner.classList.add('e-con-inner');

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add(
    'elementor-element',
    'elementor-element-5fef5c1',
    'elementor-widget__width-initial',
    'elementor-widget',
    'elementor-widget-theme-site-logo',
    'elementor-widget-image',
  );
  const logoWidgetContainer = document.createElement('div');
  logoWidgetContainer.classList.add('elementor-widget-container');
  const logoLink = document.createElement('a');
  if (logoLinkRow) {
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoLink.href = foundLogoLink.href;
      moveInstrumentation(logoLinkRow, logoLink);
    }
  }

  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '503' }]);
        moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
  }
  logoWidgetContainer.append(logoLink);
  logoWrapper.append(logoWidgetContainer);
  innerConInner.append(logoWrapper);

  // Navigation Menu
  const navMenuWrapper = document.createElement('div');
  navMenuWrapper.classList.add(
    'elementor-element',
    'elementor-element-f6dc590',
    'elementor-widget__width-initial',
    'elementor-nav-menu--stretch',
    'elementor-nav-menu__text-align-center',
    'elementor-nav-menu__align-end',
    'elementor-nav-menu--dropdown-tablet',
    'elementor-nav-menu--toggle',
    'elementor-nav-menu--burger',
    'elementor-widget',
    'elementor-widget-nav-menu',
  );
  const navMenuWidgetContainer = document.createElement('div');
  navMenuWidgetContainer.classList.add('elementor-widget-container');
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Menu');
  nav.classList.add(
    'elementor-nav-menu--main',
    'elementor-nav-menu__container',
    'elementor-nav-menu--layout-horizontal',
    'e--pointer-underline',
    'e--animation-fade',
  );
  const ul = document.createElement('ul');
  ul.classList.add('elementor-nav-menu');

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('menu-item', 'menu-item-type-custom', 'menu-item-object-custom');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;

    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    rootEl.classList.add('elementor-item');
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      li.classList.add('menu-item-has-children');
      const wrapper = document.createElement('div');
      wrapper.classList.add('elementor-nav-menu--dropdown'); // Use class from ORIGINAL HTML
      wrapper.appendChild(hierarchyRoot);
      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        wrapper.classList.toggle('active');
      });
      li.appendChild(wrapper);
      transformNestedLists(hierarchyRoot);
    }
    ul.appendChild(li);
  });

  nav.append(ul);
  navMenuWidgetContainer.append(nav);

  const menuToggle = document.createElement('div');
  menuToggle.classList.add('elementor-menu-toggle');
  menuToggle.setAttribute('role', 'button');
  menuToggle.setAttribute('tabindex', '0');
  menuToggle.setAttribute('aria-label', 'Menu Toggle');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = `
    <svg aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z"></path></svg>
    <svg aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"></path></svg>
  `;
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('elementor-active');
  });

  navMenuWidgetContainer.append(menuToggle);
  navMenuWrapper.append(navMenuWidgetContainer);
  innerConInner.append(navMenuWrapper);

  innerContainer.append(innerConInner);
  headerContainer.append(innerContainer);

  // Audience Links
  const audienceLinksContainer = document.createElement('div');
  audienceLinksContainer.classList.add(
    'elementor-element',
    'elementor-element-ff0ccea',
    'elementor-hidden-mobile',
    'e-flex',
    'e-con-boxed',
    'e-con',
    'e-child',
  );
  const audienceInnerConInner = document.createElement('div');
  audienceInnerConInner.classList.add('e-con-inner');
  const audienceWidget = document.createElement('div');
  audienceWidget.classList.add(
    'elementor-element',
    'elementor-element-8b8d930',
    'elementor-icon-list--layout-inline',
    'elementor-align-center',
    'elementor-list-item-link-full_width',
    'elementor-widget',
    'elementor-widget-icon-list',
  );
  const audienceWidgetContainer = document.createElement('div');
  audienceWidgetContainer.classList.add('elementor-widget-container');
  const audienceUl = document.createElement('ul');
  audienceUl.classList.add('elementor-icon-list-items', 'elementor-inline-items');

  audienceLinkItemRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('elementor-icon-list-item', 'elementor-inline-item');
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    const span = document.createElement('span');
    span.classList.add('elementor-icon-list-text');
    span.textContent = labelCell?.textContent.trim() || '';
    anchor.append(span);
    moveInstrumentation(row, anchor);
    li.append(anchor);
    audienceUl.append(li);
  });

  audienceWidgetContainer.append(audienceUl);
  audienceWidget.append(audienceWidgetContainer);
  audienceInnerConInner.append(audienceWidget);
  audienceLinksContainer.append(audienceInnerConInner);
  headerContainer.append(audienceLinksContainer);

  block.replaceChildren(headerContainer);
}
