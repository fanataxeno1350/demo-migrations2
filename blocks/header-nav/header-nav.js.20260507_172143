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
          li.classList.toggle('current-menu-ancestor');
          li.classList.toggle('current-menu-parent');
          subWrap.classList.toggle('active'); // Use 'active' for visibility toggle
        });
      }
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, ...itemRows] = children;

  const header = document.createElement('div');
  header.classList.add('elementor', 'elementor-30', 'elementor-location-header');

  const stickyContainer = document.createElement('div');
  stickyContainer.classList.add('elementor-element', 'elementor-element-7910b0b', 'e-con-full', 'e-flex', 'e-con', 'e-parent', 'e-lazyloaded', 'elementor-sticky', 'elementor-sticky--effects');
  // Do NOT add elementor-sticky--active or elementor-section--handles-inside - these are runtime classes

  const headerMain = document.createElement('div');
  headerMain.classList.add('elementor-element', 'elementor-element-2dcde62', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');

  const innerCon = document.createElement('div');
  innerCon.classList.add('e-con-inner');

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('elementor-element', 'elementor-element-5fef5c1', 'elementor-widget__width-initial', 'elementor-widget', 'elementor-widget-theme-site-logo', 'elementor-widget-image');
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
  innerCon.append(logoWrapper);

  // Navigation Menu
  const navMenuWrapper = document.createElement('div');
  navMenuWrapper.classList.add('elementor-element', 'elementor-element-f6dc590', 'elementor-widget__width-initial', 'elementor-nav-menu--stretch', 'elementor-nav-menu__text-align-center', 'elementor-nav-menu__align-end', 'elementor-nav-menu--dropdown-tablet', 'elementor-nav-menu--toggle', 'elementor-nav-menu--burger', 'elementor-widget', 'elementor-widget-nav-menu');
  const navWidgetContainer = document.createElement('div');
  navWidgetContainer.classList.add('elementor-widget-container');
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Menu');
  nav.classList.add('elementor-nav-menu--main', 'elementor-nav-menu__container', 'elementor-nav-menu--layout-horizontal', 'e--pointer-underline', 'e--animation-fade');
  const ul = document.createElement('ul');
  ul.classList.add('elementor-nav-menu');
  ul.id = 'menu-1-f6dc590';
  ul.setAttribute('data-smartmenus-id', '17781500430689502');

  // Separate navigation items from audience links
  const navigationItemRows = itemRows.filter((row) => row.children.length === 3);
  const audienceLinkRows = itemRows.filter((row) => row.children.length === 2);

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('menu-item', 'menu-item-type-custom', 'menu-item-object-custom', 'menu-item-has-children');

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
      const wrapper = document.createElement('ul');
      wrapper.classList.add('sub-menu', 'elementor-nav-menu--dropdown');
      // Move instrumentation from the original hierarchy cell to the new wrapper
      moveInstrumentation(hierarchyCell, wrapper);
      wrapper.appendChild(hierarchyRoot);
      transformNestedLists(hierarchyRoot);

      // Add dropdown toggle behavior
      const subArrow = document.createElement('span');
      subArrow.classList.add('sub-arrow');
      subArrow.innerHTML = '<svg class="e-font-icon-svg e-fas-caret-down" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
      rootEl.append(subArrow);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('current-menu-ancestor');
        li.classList.toggle('current-menu-parent');
        wrapper.classList.toggle('active'); // Use 'active' for visibility toggle
      });
      li.appendChild(wrapper);
    }
    ul.append(li);
  });

  nav.append(ul);
  navWidgetContainer.append(nav);
  navMenuWrapper.append(navWidgetContainer);
  innerCon.append(navMenuWrapper);

  headerMain.append(innerCon);
  stickyContainer.append(headerMain);

  // Audience Links (hidden on mobile)
  const audienceLinksContainer = document.createElement('div');
  audienceLinksContainer.classList.add('elementor-element', 'elementor-element-ff0ccea', 'elementor-hidden-mobile', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');
  const audienceInnerCon = document.createElement('div');
  audienceInnerCon.classList.add('e-con-inner');

  const iconListWrapper = document.createElement('div');
  iconListWrapper.classList.add('elementor-element', 'elementor-element-8b8d930', 'elementor-icon-list--layout-inline', 'elementor-align-center', 'elementor-list-item-link-full_width', 'elementor-widget', 'elementor-widget-icon-list');
  const iconListWidgetContainer = document.createElement('div');
  iconListWidgetContainer.classList.add('elementor-widget-container');
  const iconListUl = document.createElement('ul');
  iconListUl.classList.add('elementor-icon-list-items', 'elementor-inline-items');

  audienceLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('elementor-icon-list-item', 'elementor-inline-item');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    const span = document.createElement('span');
    span.classList.add('elementor-icon-list-text');
    span.textContent = labelCell.textContent.trim();
    anchor.append(span);
    moveInstrumentation(row, anchor);
    li.append(anchor);
    iconListUl.append(li);
  });

  iconListWidgetContainer.append(iconListUl);
  iconListWrapper.append(iconListWidgetContainer);
  audienceInnerCon.append(iconListWrapper);
  audienceLinksContainer.append(audienceInnerCon);
  stickyContainer.append(audienceLinksContainer);

  header.append(stickyContainer);

  block.replaceChildren(header);

  // Optimize all images after DOM construction
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '503' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
