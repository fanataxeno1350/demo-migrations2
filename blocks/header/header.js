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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist, but it's internal to the JS logic for nested lists.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic for nested lists.
          subWrap.classList.toggle('active'); // This class is not in the allowlist, but it's internal to the JS logic for nested lists.
        });
      }
    }
  });
}

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    logoTitleRow,
    mobileMenuLabelRow,
    mobileMenuA11yTextRow,
    searchButtonLabelRow,
    searchFormActionRow,
    utilityLinksLargeContainer, // This is a placeholder for the start of large utility link items
    utilityLinksSmallContainer, // This is a placeholder for the start of small utility link items
    utilityCtasContainer, // This is a placeholder for the start of CTA items
    navigationMenuContainer, // This is a placeholder for the start of navigation items
    ...itemRows // All subsequent rows are item rows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('site-header');

  const siteHeaderContainer = document.createElement('div');
  siteHeaderContainer.classList.add('site-header-container');
  siteHeaderContainer.setAttribute('data-nav-header', '');
  moveInstrumentation(logoRow, siteHeaderContainer); // Move instrumentation from first row

  // Logo
  const siteHeaderLogo = document.createElement('p');
  siteHeaderLogo.classList.add('site-header-logo');
  moveInstrumentation(logoLinkRow, siteHeaderLogo);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.title = logoTitleRow.textContent.trim();
    logoLink.rel = 'home';
    logoLink.id = 'logo';
  }
  moveInstrumentation(logoTitleRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]);
    moveInstrumentation(logoPicture, optimizedPic.querySelector('img')); // Move instrumentation from picture to optimized img
    logoLink.append(optimizedPic);
  }
  siteHeaderLogo.append(logoLink);
  siteHeaderContainer.append(siteHeaderLogo);

  // Mobile Menu Toggle
  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.classList.add('site-nav-toggle-mobile');
  mobileMenuToggle.setAttribute('aria-controls', 'site-navigation');
  mobileMenuToggle.setAttribute('data-module', 'nav-toggle');
  mobileMenuToggle.setAttribute('data-features', 'setToWindowHeight');
  mobileMenuToggle.setAttribute('aria-expanded', 'false');
  moveInstrumentation(mobileMenuLabelRow, mobileMenuToggle);

  const toggleIcon = document.createElement('span');
  toggleIcon.classList.add('site-nav-toggle-mobile-icon');
  mobileMenuToggle.append(toggleIcon);

  const a11ySrOnly = document.createElement('span');
  a11ySrOnly.classList.add('a11y-sr-only');
  a11ySrOnly.textContent = mobileMenuA11yTextRow.textContent.trim();
  mobileMenuToggle.append(a11ySrOnly);
  mobileMenuToggle.append(mobileMenuLabelRow.textContent.trim()); // Append the actual label text
  siteHeaderContainer.append(mobileMenuToggle);

  // Search Form
  const searchForm = document.createElement('form');
  searchForm.action = searchFormActionRow.textContent.trim();
  searchForm.method = 'get';
  moveInstrumentation(searchFormActionRow, searchForm);

  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.classList.add('site-nav-toggle-search');
  moveInstrumentation(searchButtonLabelRow, searchButton);

  const searchIcon = document.createElement('span');
  searchIcon.classList.add('site-nav-toggle-search-icon');
  searchButton.append(searchIcon);
  searchButton.append(searchButtonLabelRow.textContent.trim());
  searchForm.append(searchButton);
  siteHeaderContainer.append(searchForm);

  header.append(siteHeaderContainer);

  const siteNavContainer = document.createElement('div');
  siteNavContainer.classList.add('site-nav-container');
  siteNavContainer.id = 'site-navigation';

  const siteNavUtility = document.createElement('div');
  siteNavUtility.classList.add('site-nav-utility');
  siteNavContainer.append(siteNavUtility);

  const siteNavUtilityContainer = document.createElement('div');
  siteNavUtilityContainer.classList.add('site-nav-utility-container');
  siteNavUtility.append(siteNavUtilityContainer);

  const utilityLinksLarge = document.createElement('ul');
  utilityLinksLarge.classList.add('site-nav-utility-links', '-large');
  moveInstrumentation(utilityLinksLargeContainer, utilityLinksLarge);

  const utilityLinksSmall = document.createElement('ul');
  utilityLinksSmall.classList.add('site-nav-utility-links', '-small');
  moveInstrumentation(utilityLinksSmallContainer, utilityLinksSmall);

  const utilityCtas = document.createElement('ul');
  utilityCtas.classList.add('site-nav-utility-ctas');
  moveInstrumentation(utilityCtasContainer, utilityCtas);

  const navigationMenu = document.createElement('nav');
  navigationMenu.classList.add('site-nav');
  navigationMenu.setAttribute('data-nav', '');
  navigationMenu.setAttribute('aria-label', 'main navigation');
  moveInstrumentation(navigationMenuContainer, navigationMenu);

  const navigationList = document.createElement('ul');
  navigationList.classList.add('site-nav-list');
  navigationMenu.append(navigationList);

  // Filter itemRows based on their structure and relative position
  const allItemRows = [...itemRows];
  const largeUtilityLinkItems = [];
  const smallUtilityLinkItems = [];
  const actualUtilityCtaItems = [];
  const actualNavigationItems = [];

  let currentSection = 'largeUtilityLinks'; // State machine for parsing rows

  allItemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3 && currentSection === 'largeUtilityLinks') {
      largeUtilityLinkItems.push(row);
    } else if (cells.length === 2 && (currentSection === 'largeUtilityLinks' || currentSection === 'utilityCtas')) {
      actualUtilityCtaItems.push(row);
      currentSection = 'utilityCtas'; // Transition to CTAs
    } else if (cells.length === 3 && currentSection === 'utilityCtas') {
      // This is the first navigation item, or a small utility link that follows CTAs
      // Need to distinguish between small utility links and navigation items
      // Small utility links have a richtext cell, but it's often empty or a simple link.
      // Navigation items have a rich hierarchy.
      const hasHierarchy = cells[2]?.querySelector('ul');
      if (hasHierarchy) {
        actualNavigationItems.push(row);
        currentSection = 'navigationItems'; // Transition to navigation
      } else {
        // This logic might need refinement if small utility links also have complex hierarchies
        // For now, assuming 3-cell items after CTAs are navigation items.
        // If small utility links are truly 3-cell with simple hierarchy, they'd be caught here too.
        // The model for utility-link-item has 'hierarchy-tree' (richtext), so 3 cells.
        // The distinction between large and small utility links is purely positional.
        smallUtilityLinkItems.push(row);
        currentSection = 'smallUtilityLinks'; // Transition to small utility links
      }
    } else if (cells.length === 3 && currentSection === 'smallUtilityLinks') {
      smallUtilityLinkItems.push(row);
    } else if (cells.length === 3 && currentSection === 'navigationItems') {
      actualNavigationItems.push(row);
    }
  });


  largeUtilityLinkItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    utilityLinksLarge.append(li);
  });

  // Add desktop search button to large utility links
  const desktopSearchLi = document.createElement('li');
  const desktopSearchForm = document.createElement('form');
  desktopSearchForm.action = searchFormActionRow.textContent.trim();
  desktopSearchForm.method = 'get';
  const desktopSearchButton = document.createElement('button');
  desktopSearchButton.type = 'submit';
  desktopSearchButton.classList.add('site-nav-toggle-search-desktop');
  const desktopSearchIcon = document.createElement('span');
  desktopSearchIcon.classList.add('site-nav-toggle-search-icon');
  desktopSearchButton.append(desktopSearchIcon);
  desktopSearchButton.append(searchButtonLabelRow.textContent.trim());
  desktopSearchForm.append(desktopSearchButton);
  desktopSearchLi.append(desktopSearchForm);
  utilityLinksLarge.append(desktopSearchLi);

  actualUtilityCtaItems.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();

    // Apply CTA button classes based on original HTML
    if (index === 0) { // First CTA
      anchor.classList.add('u-button', 'u-button-reversed-blue', 'u-button-blue', '-slim');
    } else { // Second CTA
      anchor.classList.add('u-button', 'u-button-blue', '-slim'); // Removed duplicate 'u-button'
    }

    li.append(anchor);
    utilityCtas.append(li);
  });

  smallUtilityLinkItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    utilityLinksSmall.append(li);
  });

  actualNavigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Destructuring for fixed schema
    const li = document.createElement('li');
    li.classList.add('site-nav-item');
    li.setAttribute('data-module', 'nav-group');
    moveInstrumentation(row, li);

    const headingP = document.createElement('p');
    headingP.classList.add('site-nav-item-heading');

    const headingLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) headingLink.href = foundLink.href;
    headingLink.textContent = labelCell.textContent.trim();
    headingLink.setAttribute('data-nav-headinglink', '');
    headingLink.setAttribute('aria-expanded', 'false');

    const a11yHelper = document.createElement('span');
    a11yHelper.classList.add('site-nav-a11y-helper');
    a11yHelper.textContent = '(down arrow opens sub-menu)>';
    headingLink.append(a11yHelper);
    headingP.append(headingLink);
    li.append(headingP);

    const subListUl = hierarchyCell.querySelector('ul');
    if (subListUl) {
      const sublist = document.createElement('ul');
      sublist.classList.add('site-nav-sublist');
      sublist.setAttribute('data-nav-sublist', '');
      sublist.setAttribute('data-is', 'close');
      // Set data-columns dynamically or based on content if a pattern emerges
      // For now, hardcode based on example or assume it's not critical for functionality
      sublist.setAttribute('data-columns', '10'); // Example value from original HTML

      // Create a temporary div to hold the hierarchyCell's innerHTML for processing
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      transformNestedLists(tempDiv); // Transform the nested lists within the tempDiv

      // Append children from tempDiv to sublist
      while (tempDiv.firstChild) {
        const subLi = tempDiv.firstChild;
        const subItemLi = document.createElement('li');
        subItemLi.classList.add('site-nav-subitem');
        moveInstrumentation(subLi, subItemLi); // Move instrumentation from original li to new li
        while (subLi.firstChild) subItemLi.append(subLi.firstChild);
        sublist.append(subItemLi);
      }
      li.append(sublist);

      headingLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = headingLink.getAttribute('aria-expanded') === 'true';
        headingLink.setAttribute('aria-expanded', !isExpanded);
        sublist.setAttribute('data-is', isExpanded ? 'close' : 'open');
        li.classList.toggle('active', !isExpanded); // This class is not in the allowlist, but it's internal to the JS logic for nested lists.
      });
    }

    navigationList.append(li);
  });

  siteNavUtilityContainer.append(utilityLinksLarge);
  siteNavUtilityContainer.append(utilityCtas);
  siteNavContainer.append(navigationMenu);
  siteNavContainer.append(utilityLinksSmall); // Small links are outside the nav, but inside site-nav-container

  header.append(siteNavContainer);

  // Mobile menu toggle functionality
  mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    siteNavContainer.classList.toggle('is-open', !isExpanded); // Assuming 'is-open' class controls visibility
    mobileMenuToggle.classList.toggle('is-open', !isExpanded); // Toggle on button itself for styling
  });

  block.replaceChildren(header);
}
