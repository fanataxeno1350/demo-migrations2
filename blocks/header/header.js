import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const logoRow = children[0];
  const logoLinkRow = children[1];
  const menuToggleLabelRow = children[2];

  const itemRows = children.slice(3);

  // Use content detection for filtering different item types
  const phoneItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a[href^="tel:"]'));
  const careItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a[href^="mailto:"]'));
  const socialItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  const navigationItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture') && !row.querySelector('a[href^="tel:"]') && !row.querySelector('a[href^="mailto:"]'));

  const header = document.createElement('header');
  header.id = 'masthead';
  header.classList.add('site-header');

  const topNav = document.createElement('div');
  topNav.classList.add('top-nav');

  const topNavContainer = document.createElement('div');
  topNavContainer.classList.add('container');

  phoneItems.forEach((row) => {
    // Fixed schema for phone-item: [label, link]
    const [phoneCell, linkCell] = [...row.children];

    const phoneDiv = document.createElement('div');
    phoneDiv.classList.add('phone');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.textContent = phoneCell.textContent.trim();
    }
    moveInstrumentation(row, phoneDiv);
    phoneDiv.append(link);
    topNavContainer.append(phoneDiv);
  });

  careItems.forEach((row) => {
    // Fixed schema for care-item: [label, link]
    const [careCell, linkCell] = [...row.children];

    const careDiv = document.createElement('div');
    careDiv.classList.add('care');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.textContent = careCell.textContent.trim();
    }
    moveInstrumentation(row, careDiv);
    careDiv.append(link);
    topNavContainer.append(careDiv);
  });

  const socialIconsDiv = document.createElement('div');
  socialIconsDiv.classList.add('social-icons');

  socialItems.forEach((row) => {
    // Fixed schema for social-item: [icon, link]
    const [iconCell, linkCell] = [...row.children];

    const socialDiv = document.createElement('div');
    socialDiv.classList.add('social');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank';
    }
    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '32' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      link.append(optimizedPic);
    }
    moveInstrumentation(row, socialDiv);
    socialDiv.append(link);
    socialIconsDiv.append(socialDiv);
  });
  topNavContainer.append(socialIconsDiv);
  topNav.append(topNavContainer);
  header.append(topNav);

  const mainNav = document.createElement('div');
  mainNav.classList.add('main-nav');

  const mainNavContainer = document.createElement('div');
  mainNavContainer.classList.add('container');

  const siteBranding = document.createElement('div');
  siteBranding.classList.add('site-branding');

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: 'auto' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  siteBranding.append(logoLink);
  mainNavContainer.append(siteBranding);

  const nav = document.createElement('nav');
  nav.id = 'site-navigation';
  nav.classList.add('main-navigation');

  const menuToggle = document.createElement('button');
  menuToggle.classList.add('menu-toggle');
  menuToggle.setAttribute('aria-controls', 'primary-menu');
  menuToggle.setAttribute('aria-expanded', 'false');

  const menuToggleLabelDiv = menuToggleLabelRow.querySelector('div'); // Get the div containing the text
  if (menuToggleLabelDiv) {
    for (let i = 0; i < 3; i++) {
      const iconBar = document.createElement('span');
      iconBar.classList.add('icon-bar');
      menuToggle.append(iconBar);
    }
    const textSpan = document.createElement('span');
    textSpan.classList.add('text');
    textSpan.textContent = menuToggleLabelDiv.textContent.trim();
    menuToggle.append(textSpan);
  }
  moveInstrumentation(menuToggleLabelRow, menuToggle);
  nav.append(menuToggle);

  const menuNavContainer = document.createElement('div');
  menuNavContainer.classList.add('menu-nav-old-dutch-container');

  const ul = document.createElement('ul');
  ul.id = 'brand-menu';
  ul.classList.add('menu', 'nav-menu');

  navigationItems.forEach((row, i) => {
    // Fixed schema for navigation-item: [label, link]
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.id = `menu-item-${21960 + i}`; // Use a dynamic ID based on index
    li.classList.add('menu-item', 'menu-item-type-post_type', 'menu-item-object-page', `menu-item-${21960 + i}`);
    if (i === 0) li.classList.add('menu-item-home'); // First item is home

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.textContent = labelCell.textContent.trim();
    }
    moveInstrumentation(row, li);
    li.append(link);
    ul.append(li);
  });
  menuNavContainer.append(ul);
  nav.append(menuNavContainer);

  const mobileNavBottom = document.createElement('div');
  mobileNavBottom.classList.add('mobile-nav-bottom');
  const searchDiv = document.createElement('div');
  const searchForm = document.createElement('form');
  searchForm.setAttribute('role', 'search');
  searchForm.setAttribute('method', 'get');
  searchForm.classList.add('search-form');
  // Hardcoded URL from original HTML - this should ideally come from a block field if it's dynamic
  // For now, keeping it as is, but flagging as a potential improvement.
  searchForm.setAttribute('action', 'https://olddutchfoods.com/');

  const searchField = document.createElement('input');
  searchField.setAttribute('type', 'search');
  searchField.classList.add('search-field');
  searchField.setAttribute('placeholder', 'Site search');
  searchField.setAttribute('value', '');
  searchField.setAttribute('name', 's');
  searchForm.append(searchField);

  const searchSubmit = document.createElement('input');
  searchSubmit.setAttribute('type', 'submit');
  searchSubmit.classList.add('search-submit');
  searchSubmit.setAttribute('value', '');
  searchForm.append(searchSubmit);

  searchDiv.append(searchForm);
  mobileNavBottom.append(searchDiv);
  nav.append(mobileNavBottom);

  mainNavContainer.append(nav);

  const searchFormDesktop = document.createElement('form');
  searchFormDesktop.setAttribute('role', 'search');
  searchFormDesktop.setAttribute('method', 'get');
  searchFormDesktop.classList.add('search-form');
  // Hardcoded URL from original HTML - this should ideally come from a block field if it's dynamic
  // For now, keeping it as is, but flagging as a potential improvement.
  searchFormDesktop.setAttribute('action', 'https://olddutchfoods.com/');

  const searchFieldDesktop = document.createElement('input');
  searchFieldDesktop.setAttribute('type', 'search');
  searchFieldDesktop.classList.add('search-field');
  searchFieldDesktop.setAttribute('placeholder', 'Site search');
  searchFieldDesktop.setAttribute('value', '');
  searchFieldDesktop.setAttribute('name', 's');
  searchFormDesktop.append(searchFieldDesktop);

  const searchSubmitDesktop = document.createElement('input');
  searchSubmitDesktop.setAttribute('type', 'submit');
  searchSubmitDesktop.classList.add('search-submit');
  searchSubmitDesktop.setAttribute('value', '');
  searchFormDesktop.append(searchSubmitDesktop);

  mainNavContainer.append(searchFormDesktop);

  mainNav.append(mainNavContainer);
  header.append(mainNav);

  block.replaceChildren(header);

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('toggled');
    menuToggle.setAttribute('aria-expanded', nav.classList.contains('toggled'));
  });

  // This part seems to be a generic image optimization that might be better in aem.js or a separate utility
  // It's not directly related to the header's specific structure but rather a post-processing step.
  // Keeping it for now as it was in the original generated code.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
