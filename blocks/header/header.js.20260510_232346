import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    menuToggleLabelRow,
    ...itemRows // All remaining rows are item rows of various types
  ] = children;

  const header = document.createElement('header');
  header.classList.add('site-header'); // From ORIGINAL HTML

  const topNav = document.createElement('div');
  topNav.classList.add('top-nav'); // From ORIGINAL HTML

  const topNavContainer = document.createElement('div');
  topNavContainer.classList.add('container'); // From ORIGINAL HTML

  const mainNav = document.createElement('div');
  mainNav.classList.add('main-nav'); // From ORIGINAL HTML

  const mainNavContainer = document.createElement('div');
  mainNavContainer.classList.add('container'); // From ORIGINAL HTML

  const siteBranding = document.createElement('div');
  siteBranding.classList.add('site-branding'); // From ORIGINAL HTML

  const logoPicture = logoRow.querySelector('picture');
  const logoLink = logoLinkRow.querySelector('a');

  if (logoPicture && logoLink) {
    const brandLink = document.createElement('a');
    brandLink.href = logoLink.href;
    moveInstrumentation(logoLinkRow, brandLink); // Move instrumentation from link row

    const optimizedPic = createOptimizedPicture(
      logoPicture.querySelector('img').src,
      logoPicture.querySelector('img').alt,
      false,
      [{ width: '750' }],
    );
    // Move instrumentation from the original logoRow to the picture element itself
    // The optimizedPic is a <picture> element, not just an <img>
    moveInstrumentation(logoRow, optimizedPic);
    brandLink.append(optimizedPic);
    siteBranding.append(brandLink);
  }
  mainNavContainer.append(siteBranding);

  const nav = document.createElement('nav');
  nav.id = 'site-navigation';
  nav.classList.add('main-navigation'); // From ORIGINAL HTML

  const menuToggle = document.createElement('button');
  menuToggle.classList.add('menu-toggle'); // From ORIGINAL HTML
  menuToggle.setAttribute('aria-controls', 'primary-menu');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = `
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="text">${menuToggleLabelRow.textContent.trim()}</span>
  `;
  moveInstrumentation(menuToggleLabelRow, menuToggle); // Move instrumentation from menu toggle label row

  const menuNavContainer = document.createElement('div');
  menuNavContainer.classList.add('menu-nav-old-dutch-container'); // From ORIGINAL HTML

  const brandMenu = document.createElement('ul');
  brandMenu.id = 'brand-menu';
  brandMenu.classList.add('menu', 'nav-menu'); // From ORIGINAL HTML

  const mobileNavBottom = document.createElement('div');
  mobileNavBottom.classList.add('mobile-nav-bottom'); // From ORIGINAL HTML
  // The search form in mobileNavBottom should be constructed from elements, not hardcoded HTML
  const mobileSearchFormWrapper = document.createElement('div');
  const mobileSearchForm = document.createElement('form');
  mobileSearchForm.classList.add('search-form'); // From ORIGINAL HTML
  mobileSearchForm.setAttribute('role', 'search');
  mobileSearchForm.setAttribute('method', 'get');
  mobileSearchForm.setAttribute('action', '#'); // Action should be dynamic if needed
  mobileSearchForm.innerHTML = `
    <input type="search" class="search-field" placeholder="Site search" value="" name="s"/>
    <input type="submit" class="search-submit" value=""/>
  `;
  mobileSearchFormWrapper.append(mobileSearchForm);
  mobileNavBottom.append(mobileSearchFormWrapper);


  const searchForm = document.createElement('form');
  searchForm.classList.add('search-form'); // From ORIGINAL HTML
  searchForm.setAttribute('role', 'search');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('action', '#'); // Action should be dynamic if needed
  searchForm.innerHTML = `
    <input type="search" class="search-field" placeholder="Site search" value="" name="s"/>
    <input type="submit" class="search-submit" value=""/>
  `;

  const contactItems = [];
  const socialIcons = [];
  const navigationItems = [];

  // Iterate through itemRows to categorize them based on content
  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2) {
      const [cell0, cell1] = cells;
      const hasPictureInCell0 = cell0.querySelector('picture');
      const hasLinkInCell1 = cell1.querySelector('a');

      if (hasPictureInCell0 && hasLinkInCell1) {
        socialIcons.push(row);
      } else if (!hasPictureInCell0 && hasLinkInCell1) {
        // Distinguish contact items from navigation items by their order in the BlockJson
        // Contact items appear before navigation items.
        // This relies on the authored content following the BlockJson order.
        if (socialIcons.length === 0 && navigationItems.length === 0) {
          // If no social icons or navigation items have been found yet, it's a contact item
          contactItems.push(row);
        } else {
          // Otherwise, it's a navigation item
          navigationItems.push(row);
        }
      }
    }
  });

  // Populate top navigation with contact items
  const contactDivs = document.createElement('div');
  contactItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const phoneLink = document.createElement('div');
    // The original HTML uses 'phone' and 'care' classes.
    // We need to check the labelCell content to determine if it's 'phone' or 'care'.
    // Assuming 'care' is for 'Consumer Care' and 'phone' for numbers.
    const labelText = labelCell.textContent.trim().toLowerCase();
    if (labelText.includes('consumer care')) {
      phoneLink.classList.add('care'); // From ORIGINAL HTML
    } else {
      phoneLink.classList.add('phone'); // From ORIGINAL HTML
    }

    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor); // Move instrumentation from row to anchor
    phoneLink.append(anchor);
    contactDivs.append(phoneLink);
  });
  topNavContainer.append(contactDivs);

  // Populate top navigation with social icons
  const socialIconsDiv = document.createElement('div');
  socialIconsDiv.classList.add('social-icons'); // From ORIGINAL HTML
  socialIcons.forEach((row) => {
    const [iconCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const socialDiv = document.createElement('div');
    socialDiv.classList.add('social'); // From ORIGINAL HTML
    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.target = '_blank'; // Assuming from original HTML, adjust if needed
    moveInstrumentation(row, anchor); // Move instrumentation from row to anchor

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(
        img.src,
        img.alt,
        false,
        [{ width: '32' }], // Assuming small size for social icons
      );
      // Move instrumentation from the original iconCell to the picture element itself
      moveInstrumentation(iconCell, optimizedPic);
      anchor.append(optimizedPic);
    }
    socialDiv.append(anchor);
    socialIconsDiv.append(socialDiv);
  });
  topNavContainer.append(socialIconsDiv);

  topNav.append(topNavContainer);
  header.append(topNav);

  // Populate main navigation with navigation items
  navigationItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    li.classList.add('menu-item'); // From ORIGINAL HTML
    // Add specific menu-item-type classes from ORIGINAL HTML if available
    // This would require parsing the original HTML's li elements more deeply
    // For now, only 'menu-item' is added as it's common.
    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor); // Move instrumentation from row to anchor
    li.append(anchor);
    brandMenu.append(li);
  });

  menuNavContainer.append(brandMenu);
  nav.append(menuToggle, menuNavContainer, mobileNavBottom);
  mainNavContainer.append(nav, searchForm);
  mainNav.append(mainNavContainer);
  header.append(mainNav);

  // Toggle functionality for mobile menu
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active'); // Use 'active' class for styling
    menuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
  });

  block.replaceChildren(header);
}
