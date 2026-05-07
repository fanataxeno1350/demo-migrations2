import { createOptimizedPicture } from '../../scripts/aem.js';
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
      subWrap.classList.add('sub-menu', 'elementor-nav-menu--dropdown');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('elementor-item', 'elementor-item-anchor', 'has-submenu');
        const subArrow = document.createElement('span');
        subArrow.classList.add('sub-arrow');
        subArrow.innerHTML = '<svg class="e-font-icon-svg e-fas-caret-down" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
        trigger.append(subArrow);

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('elementor-active');
          subWrap.classList.toggle('elementor-active');
        });
      }
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];
  const [logoRow, logoLinkRow, ...itemRows] = children;

  const header = document.createElement('header');
  header.classList.add('elementor', 'elementor-30', 'elementor-location-header');

  const stickyContainer = document.createElement('div');
  stickyContainer.classList.add(
    'elementor-element',
    'elementor-element-7910b0b',
    'e-con-full',
    'e-flex',
    'e-con',
    'e-parent',
    'elementor-sticky',
    'elementor-sticky--active',
    'elementor-section--handles-inside',
    'elementor-sticky--effects',
    'e-lazyloaded',
  );

  const mainNavContainer = document.createElement('div');
  mainNavContainer.classList.add(
    'elementor-element',
    'elementor-element-2dcde62',
    'e-flex',
    'e-con-boxed',
    'e-con',
    'e-child',
  );

  const mainNavInner = document.createElement('div');
  mainNavInner.classList.add('e-con-inner');
  mainNavContainer.append(mainNavInner);

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
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '503' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);

  logoWidgetContainer.append(logoLink);
  logoWrapper.append(logoWidgetContainer);
  mainNavInner.append(logoWrapper);

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
  navMenuWrapper.append(navMenuWidgetContainer);

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Menu');
  nav.classList.add(
    'elementor-nav-menu--main',
    'elementor-nav-menu__container',
    'elementor-nav-menu--layout-horizontal',
    'e--pointer-underline',
    'e--animation-fade',
  );
  navMenuWidgetContainer.append(nav);

  const ul = document.createElement('ul');
  ul.classList.add('elementor-nav-menu');
  nav.append(ul);

  const navigationItemRows = itemRows.filter((row) => row.children.length === 3);
  const audienceLinkRows = itemRows.filter((row) => row.children.length === 2);

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('menu-item', 'menu-item-type-custom', 'menu-item-object-custom');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('elementor-item');
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(labelCell, rootEl); // Move instrumentation from labelCell to rootEl
    moveInstrumentation(linkCell, rootEl); // Move instrumentation from linkCell to rootEl
    li.appendChild(rootEl);

    const hierarchyRootContainer = document.createElement('div');
    hierarchyRootContainer.innerHTML = hierarchyCell?.innerHTML || ''; // Read richtext HTML
    const hierarchyRoot = hierarchyRootContainer.querySelector('ul');

    if (hierarchyRoot) {
      li.classList.add('menu-item-has-children');
      const wrapper = document.createElement('div');
      wrapper.classList.add('sub-menu', 'elementor-nav-menu--dropdown');
      
      // Move instrumentation from the hierarchyCell to the wrapper before appending children
      moveInstrumentation(hierarchyCell, wrapper); 

      // Append children from hierarchyRoot to wrapper
      while (hierarchyRoot.firstChild) {
        wrapper.append(hierarchyRoot.firstChild);
      }
      
      rootEl.classList.add('elementor-item-anchor', 'has-submenu');

      const subArrow = document.createElement('span');
      subArrow.classList.add('sub-arrow');
      subArrow.innerHTML = '<svg class="e-font-icon-svg e-fas-caret-down" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
      rootEl.append(subArrow);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('elementor-active');
        li.classList.toggle('elementor-active');
      });
      li.appendChild(wrapper);
      transformNestedLists(wrapper); // Pass the wrapper containing the ul
    }
    moveInstrumentation(row, li); // Move instrumentation from the original row to the new li
    ul.appendChild(li);
  });

  mainNavInner.append(navMenuWrapper);

  const menuToggle = document.createElement('div');
  menuToggle.classList.add('elementor-menu-toggle');
  menuToggle.setAttribute('role', 'button');
  menuToggle.setAttribute('tabindex', '0');
  menuToggle.setAttribute('aria-label', 'Menu Toggle');
  menuToggle.setAttribute('aria-expanded', 'false');

  const iconOpen = document.createElement('svg');
  iconOpen.setAttribute('aria-hidden', 'true');
  iconOpen.setAttribute('role', 'presentation');
  iconOpen.classList.add('elementor-menu-toggle__icon--open', 'e-font-icon-svg', 'e-eicon-menu-bar');
  iconOpen.setAttribute('viewBox', '0 0 1000 1000');
  iconOpen.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  iconOpen.innerHTML = '<path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z"></path>';

  const iconClose = document.createElement('svg');
  iconClose.setAttribute('aria-hidden', 'true');
  iconClose.setAttribute('role', 'presentation');
  iconClose.classList.add('elementor-menu-toggle__icon--close', 'e-font-icon-svg', 'e-eicon-close');
  iconClose.setAttribute('viewBox', '0 0 1000 1000');
  iconClose.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  iconClose.innerHTML = '<path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"></path>';

  menuToggle.append(iconOpen, iconClose);
  navMenuWidgetContainer.append(menuToggle);

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('elementor-active');
    menuToggle.classList.toggle('elementor-active');
  });

  stickyContainer.append(mainNavContainer);

  // Audience Links (hidden on mobile)
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
  const audienceLinksInner = document.createElement('div');
  audienceLinksInner.classList.add('e-con-inner');
  audienceLinksContainer.append(audienceLinksInner);

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
  audienceWidget.append(audienceWidgetContainer);

  const audienceUl = document.createElement('ul');
  audienceUl.classList.add('elementor-icon-list-items', 'elementor-inline-items');
  audienceWidgetContainer.append(audienceUl);

  audienceLinkRows.forEach((row) => {
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

  audienceLinksInner.append(audienceWidget);
  stickyContainer.append(audienceLinksContainer);

  header.append(stickyContainer);
  block.replaceChildren(header);
}
