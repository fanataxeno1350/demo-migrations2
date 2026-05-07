import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Normalize label-only nodes
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
        // Add sub-arrow for visual indication
        const subArrow = document.createElement('span');
        subArrow.classList.add('sub-arrow');
        subArrow.innerHTML = '<svg class="e-font-icon-svg e-fas-caret-down" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>';
        trigger.append(subArrow);

        trigger.classList.add('elementor-item-anchor', 'has-submenu');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('current-menu-ancestor'); // Example state class from ORIGINAL HTML
          li.classList.toggle('current-menu-parent'); // Example state class from ORIGINAL HTML
          li.classList.toggle('menu-item-has-children'); // Example state class from ORIGINAL HTML
          // subWrap.classList.toggle('elementor-nav-menu--dropdown-open'); // Removed: hypothetical class
        });
      }
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, ...itemRows] = children;

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('elementor-element', 'elementor-element-7910b0b', 'e-con-full', 'e-flex', 'e-con', 'e-parent', 'e-lazyloaded', 'elementor-sticky', 'elementor-sticky--active', 'elementor-section--handles-inside', 'elementor-sticky--effects');

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add('elementor-element', 'elementor-element-2dcde62', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');
  const mainHeaderInner = document.createElement('div');
  mainHeaderInner.classList.add('e-con-inner');
  mainHeaderContainer.append(mainHeaderInner);
  headerWrapper.append(mainHeaderContainer);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('elementor-element', 'elementor-element-5fef5c1', 'elementor-widget__width-initial', 'elementor-widget', 'elementor-widget-theme-site-logo', 'elementor-widget-image');
  const logoWidgetContainer = document.createElement('div');
  logoWidgetContainer.classList.add('elementor-widget-container');
  logoWrapper.append(logoWidgetContainer);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

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
  logoWidgetContainer.append(logoLink);
  mainHeaderInner.append(logoWrapper);

  // Navigation Menu
  const navMenuWrapper = document.createElement('div');
  navMenuWrapper.classList.add('elementor-element', 'elementor-element-f6dc590', 'elementor-widget__width-initial', 'elementor-nav-menu--stretch', 'elementor-nav-menu__text-align-center', 'elementor-nav-menu__align-end', 'elementor-nav-menu--dropdown-tablet', 'elementor-nav-menu--toggle', 'elementor-nav-menu--burger', 'elementor-widget', 'elementor-widget-nav-menu');
  const navMenuWidgetContainer = document.createElement('div');
  navMenuWidgetContainer.classList.add('elementor-widget-container');
  navMenuWrapper.append(navMenuWidgetContainer);

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Menu');
  nav.classList.add('elementor-nav-menu--main', 'elementor-nav-menu__container', 'elementor-nav-menu--layout-horizontal', 'e--pointer-underline', 'e--animation-fade');
  navMenuWidgetContainer.append(nav);

  const navUl = document.createElement('ul');
  navUl.classList.add('elementor-nav-menu');
  nav.append(navUl);

  // Audience Links container (for desktop)
  const audienceLinksDesktopContainer = document.createElement('div');
  audienceLinksDesktopContainer.classList.add('elementor-element', 'elementor-element-ff0ccea', 'elementor-hidden-mobile', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');
  const audienceLinksDesktopInner = document.createElement('div');
  audienceLinksDesktopInner.classList.add('e-con-inner');
  audienceLinksDesktopContainer.append(audienceLinksDesktopInner);
  headerWrapper.append(audienceLinksDesktopContainer);

  const audienceListWrapper = document.createElement('div');
  audienceListWrapper.classList.add('elementor-element', 'elementor-element-8b8d930', 'elementor-icon-list--layout-inline', 'elementor-align-center', 'elementor-list-item-link-full_width', 'elementor-widget', 'elementor-widget-icon-list');
  const audienceListWidgetContainer = document.createElement('div');
  audienceListWidgetContainer.classList.add('elementor-widget-container');
  audienceListWrapper.append(audienceListWidgetContainer);
  audienceLinksDesktopInner.append(audienceListWrapper);

  const audienceUl = document.createElement('ul');
  audienceUl.classList.add('elementor-icon-list-items', 'elementor-inline-items');
  audienceListWidgetContainer.append(audienceUl);

  const navigationMenuRows = itemRows.filter((row) => row.children.length === 3);
  const audienceLinkRows = itemRows.filter((row) => row.children.length === 2);

  navigationMenuRows.forEach((row) => {
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
      rootEl.classList.add('elementor-item');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      const hierarchyRoot = tempDiv.querySelector('ul');

      if (hierarchyRoot) {
        li.classList.add('menu-item-has-children');
        const wrapper = document.createElement('ul');
        wrapper.classList.add('sub-menu', 'elementor-nav-menu--dropdown');
        
        // Apply classes to nested elements from ORIGINAL HTML
        hierarchyRoot.querySelectorAll('a').forEach(a => a.classList.add('elementor-sub-item'));
        hierarchyRoot.querySelectorAll('li').forEach(liItem => liItem.classList.add('menu-item', 'menu-item-type-custom', 'menu-item-object-custom'));
        
        // Move instrumentation for nested elements
        moveInstrumentation(hierarchyCell, hierarchyRoot); // Move instrumentation from the cell to the root of the hierarchy
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
          li.classList.toggle('current-menu-ancestor');
          li.classList.toggle('current-menu-parent');
          // wrapper.classList.toggle('elementor-nav-menu--dropdown-open'); // Removed: hypothetical class
        });
        li.appendChild(wrapper);
        transformNestedLists(wrapper); // Apply transformation to the newly created wrapper
      }
    }
    navUl.appendChild(li);
  });

  audienceLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('elementor-icon-list-item', 'elementor-inline-item');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    const span = document.createElement('span');
    span.classList.add('elementor-icon-list-text');
    span.textContent = labelCell.textContent.trim();
    link.append(span);
    moveInstrumentation(row, link);
    li.append(link);
    audienceUl.append(li);
  });

  block.replaceChildren(headerWrapper);

  // Add event listener for sticky header effects if needed
  // window.addEventListener('scroll', () => {
  //   if (window.scrollY > 0) {
  //     headerWrapper.classList.add('elementor-sticky--effects');
  //   } else {
  //     headerWrapper.classList.remove('elementor-sticky--effects');
  //   }
  // });
}
