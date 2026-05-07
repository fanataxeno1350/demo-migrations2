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
      subWrap.classList.add('elementor-nav-menu--dropdown');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        const subArrow = document.createElement('span');
        subArrow.classList.add('sub-arrow');
        // Replaced hardcoded SVG with Unicode character for sub-arrow
        subArrow.textContent = '▼'; // Unicode down arrow
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

export default function decorate(block) {
  const children = [...block.children];
  const header = document.createElement('header');
  header.classList.add('elementor-element', 'elementor-element-7910b0b', 'e-con-full', 'e-flex', 'e-con', 'e-parent', 'elementor-sticky', 'elementor-section--handles-inside', 'elementor-sticky--effects');

  const mainHeaderContainer = document.createElement('div');
  mainHeaderContainer.classList.add('elementor-element', 'elementor-element-2dcde62', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');
  header.append(mainHeaderContainer);

  const mainHeaderInner = document.createElement('div');
  mainHeaderInner.classList.add('e-con-inner');
  mainHeaderContainer.append(mainHeaderInner);

  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.children.length === 1 && row.querySelector('a') && !row.querySelector('picture'));

  if (logoRow && logoLinkRow) {
    const logoWrapper = document.createElement('div');
    logoWrapper.classList.add('elementor-element', 'elementor-element-5fef5c1', 'elementor-widget__width-initial', 'elementor-widget', 'elementor-widget-theme-site-logo', 'elementor-widget-image');
    mainHeaderInner.append(logoWrapper);

    const logoWidgetContainer = document.createElement('div');
    logoWidgetContainer.classList.add('elementor-widget-container');
    logoWrapper.append(logoWidgetContainer);

    const logoLink = document.createElement('a');
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) logoLink.href = foundLogoLink.href;
    moveInstrumentation(logoLinkRow, logoLink);

    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '503' }]);
      moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
    logoWidgetContainer.append(logoLink);
  }

  const navMenuWrapper = document.createElement('div');
  navMenuWrapper.classList.add('elementor-element', 'elementor-element-f6dc590', 'elementor-widget__width-initial', 'elementor-nav-menu--stretch', 'elementor-nav-menu__text-align-center', 'elementor-nav-menu__align-end', 'elementor-nav-menu--dropdown-tablet', 'elementor-nav-menu--toggle', 'elementor-nav-menu--burger', 'elementor-widget', 'elementor-widget-nav-menu');
  mainHeaderInner.append(navMenuWrapper);

  const navWidgetContainer = document.createElement('div');
  navWidgetContainer.classList.add('elementor-widget-container');
  navMenuWrapper.append(navWidgetContainer);

  const nav = document.createElement('nav');
  nav.classList.add('elementor-nav-menu--main', 'elementor-nav-menu__container', 'elementor-nav-menu--layout-horizontal', 'e--pointer-underline', 'e--animation-fade');
  nav.setAttribute('aria-label', 'Menu');
  navWidgetContainer.append(nav);

  const navUl = document.createElement('ul');
  navUl.classList.add('elementor-nav-menu');
  nav.append(navUl);

  const navigationItemRows = children.filter(
    (row) => row.children.length === 3 && row.querySelector('div:nth-child(3) ul'),
  );

  navigationItemRows.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('menu-item', 'menu-item-type-custom', 'menu-item-object-custom', 'menu-item-has-children');

    const foundLink = linkCell.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('elementor-item', 'elementor-item-anchor', 'has-submenu');
    } else {
      rootEl = document.createElement('span');
      rootEl.classList.add('elementor-item');
    }
    rootEl.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('elementor-nav-menu--dropdown');
      // moveInstrumentation for hierarchyRoot's children
      moveInstrumentation(hierarchyCell, hierarchyRoot);
      wrapper.appendChild(hierarchyRoot);

      const subArrow = document.createElement('span');
      subArrow.classList.add('sub-arrow');
      // Replaced hardcoded SVG with Unicode character for sub-arrow
      subArrow.textContent = '▼'; // Unicode down arrow
      rootEl.append(subArrow);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('elementor-active');
        li.classList.toggle('elementor-active');
      });
      li.appendChild(wrapper);
      transformNestedLists(hierarchyRoot);
    }
    navUl.appendChild(li);
  });

  const menuToggle = document.createElement('div');
  menuToggle.classList.add('elementor-menu-toggle');
  menuToggle.setAttribute('role', 'button');
  menuToggle.setAttribute('tabindex', '0');
  menuToggle.setAttribute('aria-label', 'Menu Toggle');
  menuToggle.setAttribute('aria-expanded', 'false');
  // Replaced hardcoded SVGs with Unicode characters for menu toggle icons
  menuToggle.innerHTML = `
    <span aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar">☰</span>
    <span aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close">✕</span>
  `;
  navWidgetContainer.append(menuToggle);

  const mobileNav = document.createElement('nav');
  mobileNav.classList.add('elementor-nav-menu--dropdown', 'elementor-nav-menu__container');
  mobileNav.setAttribute('aria-hidden', 'true');
  const mobileUl = navUl.cloneNode(true);
  mobileNav.append(mobileUl);
  navWidgetContainer.append(mobileNav);

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('elementor-active', !isExpanded);
    mobileNav.setAttribute('aria-hidden', isExpanded);
  });

  const audienceLinksContainer = document.createElement('div');
  audienceLinksContainer.classList.add('elementor-element', 'elementor-element-ff0ccea', 'elementor-hidden-mobile', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');
  header.append(audienceLinksContainer);

  const audienceInner = document.createElement('div');
  audienceInner.classList.add('e-con-inner');
  audienceLinksContainer.append(audienceInner);

  const audienceWidget = document.createElement('div');
  audienceWidget.classList.add('elementor-element', 'elementor-element-8b8d930', 'elementor-icon-list--layout-inline', 'elementor-align-center', 'elementor-list-item-link-full_width', 'elementor-widget', 'elementor-widget-icon-list');
  audienceInner.append(audienceWidget);

  const audienceWidgetContainer = document.createElement('div');
  audienceWidgetContainer.classList.add('elementor-widget-container');
  audienceWidget.append(audienceWidgetContainer);

  const audienceUl = document.createElement('ul');
  audienceUl.classList.add('elementor-icon-list-items', 'elementor-inline-items');
  audienceWidgetContainer.append(audienceUl);

  const audienceLinkRows = children.filter(
    (row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('picture'),
  );

  audienceLinkRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('elementor-icon-list-item', 'elementor-inline-item');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    moveInstrumentation(row, anchor);

    const span = document.createElement('span');
    span.classList.add('elementor-icon-list-text');
    span.textContent = labelCell.textContent.trim();
    anchor.append(span);
    li.append(anchor);
    audienceUl.append(li);
  });

  block.replaceChildren(header);
}
