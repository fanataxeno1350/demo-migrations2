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
      subWrap.classList.add('has-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
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

export default function decorate(block) {
  const [logoLinkRow, primaryNavContainer, primaryActionsContainer, socialLinksContainer, ...itemRows] = [...block.children];

  const headerNav = document.createElement('nav');
  headerNav.classList.add('lg:grid-full', 'flex', 'justify-between', 'gap-2', 'lg:gap-grid-gutter');
  headerNav.setAttribute('data-desktop-menu-wrapper', '');
  headerNav.setAttribute('aria-label', 'Main menu');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-start-1', '[.nav-shrunk_&]:max-h-[30px]', 'max-h-[60px]', 'flex', 'items-center', 'justify-start');

  const logoLinkEl = document.createElement('a');
  const logoLinkFound = logoLinkRow.querySelector('a');
  if (logoLinkFound) {
    logoLinkEl.href = logoLinkFound.href;
  }
  logoLinkEl.classList.add('inline-flex', 'items-center', 'shrink-0', '[[data-mobile-menu]_&]:outline-none', 'not-[[data-mobile-menu]_&]:theme-focus-outline', 'dark-mode:bg-denali', 'dark-mode:py-0.5', 'dark-mode:px-0.5', 'forced-colors:px-0.5', 'forced-colors:py-0.5', 'forced-colors:bg-[CanvasText]!');
  logoLinkEl.setAttribute('data-brand-logo-link', '');
  moveInstrumentation(logoLinkRow, logoLinkEl);

  const srOnlySpan = document.createElement('span');
  srOnlySpan.classList.add('sr-only');
  srOnlySpan.textContent = 'World Wildlife Fund';
  logoLinkEl.append(srOnlySpan);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('brand-logo-svg', 'w-full', 'h-auto', 'max-w-[39px]', 'max-h-[56px]', 'sm:max-w-[41px]', 'sm:max-h-[60px]');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('viewBox', '0 0 81.63 122.37');
  svg.innerHTML = `
    <path data-wwf-logo-letters="" class="wwf-letters" d="M28.5,100.04c-.75,0-1.38.47-1.61,1.12l-3.29,8.33-.29.95-.26-.96-2.54-8.1s-.02-.06-.03-.07v-.02c-.24-.68-.88-1.16-1.63-1.16h-4.11c-.92.05-1.66.8-1.66,1.74,0,.25.12.58.2.89l.54,1.69-2.01,5.07-.32.94-.26-.95-2.53-8.12s-.03-.06-.04-.07v-.02c-.23-.68-.89-1.16-1.63-1.16H2.91c-.91.05-1.66.8-1.66,1.74,0,.25.1.58.21.89l6.15,18.33c.18.75.88,1.3,1.67,1.3s1.44-.5,1.65-1.21l4.31-10.87.32-.97.26.96,3.63,10.79c.19.75.86,1.3,1.68,1.3s1.44-.52,1.67-1.26l7.29-18.58c.1-.23.18-.49.18-.75,0-.97-.78-1.75-1.74-1.75" fill="#000000"></path>
    <path data-wwf-logo-letters="" class="wwf-letters" d="M59.15,100.04c-.75,0-1.38.47-1.63,1.12l-3.27,8.33-.31.95-.24-.96-2.56-8.1s0-.06-.01-.07v-.02c-.25-.68-.89-1.16-1.64-1.16h-4.11c-.92.05-1.65.8-1.65,1.74,0,.25.09.58.2.89l.54,1.69-2.02,5.07-.33.94-.25-.95-2.53-8.12s-.03-.06-.04-.07v-.02c-.23-.68-.87-1.16-1.61-1.16h-4.12c-.93.05-1.66.8-1.66,1.74,0,.25.12.58.2.89l6.17,18.33c.18.75.86,1.3,1.67,1.3.77,0,1.42-.5,1.65-1.21l4.3-10.87.3-.97.27.96,3.61,10.79c.2.75.87,1.3,1.68,1.3s1.46-.52,1.67-1.26l7.29-18.58c.11-.23.17-.49.17-.75,0-.97-.79-1.75-1.74-1.75" fill="#000000"></path>
    <path data-wwf-logo-letters="" class="wwf-letters" d="M79.06,100.07h-14.37c-.83,0-1.5.67-1.5,1.5h0v19.09s0,0,0,0h0c.03.86.75,1.56,1.61,1.56h4.07c.88-.03,1.57-.72,1.59-1.61v-8.92s5.83-.01,5.86-.01c.86,0,1.55-.7,1.55-1.58s-.7-1.57-1.58-1.57h-5.81v-5.1s8.67,0,8.67,0c.89-.04,1.61-.78,1.61-1.69s-.77-1.68-1.69-1.68" fill="#000000"></path>
    <path d="M56.77,39.24c2.62,2.93,2.9,11.64,9.47,8.18,3.95-2.08,3.9-10.88-1.37-14.05-4.27-2.52-6.6.88-8.14,5.05-.12.33-.13.66.05.82" fill="#000000"></path>
    <path d="M46.57,37.84c-2.75,2.28-4.64,8.52-9.69,6.4-4.08-2.08-4.48-10.17,2.56-13.91,4.9-2.25,7.39,2.21,7.43,6.95,0,.17-.16.42-.3.55" fill="#000000"></path>
    <path d="M53.35,53.77c2.71-.28,2.1-2.8.04-3.43-1.84-.55-4.62-.9-6.59-.87-3.49.08-3.4,2.75-1.59,3.2,1.37.46,2.26.64,3.44,2.17,1.08,2.1.6-.63,4.69-1.07" fill="#000000"></path>
    <path d="M66.15,8.74c3.41-5.67,9.34-4.57,12.31-1.75,3.27,3.07,3.8,6.62,2.54,9.12-1.71,3.35-6.07,7.42-8.91,3.48-1.25-1.74-3.92-3.82-5.37-4.41-2.23-.94-2.66-2.96-.57-6.44" fill="#000000"></path>
    <path d="M53.58,59.69c-1.49,3.93-9.2,2.58-9.44-1.22,0-.15.21-.12.29-.1,3.43.8,6.7,1.18,8.91,1.17.08,0,.26-.05.23.15M79.72,33.76c-.31-1.01-.81-.95-.78-.12.28,10.34-5.9,21.42-19.12,21.5-3.38,0-2.37,5.42-8.53,2.7-4.45-3-6.99,2.9-10.16-3.45-.69-1.83-1.73-2.56-3.08-2.9-13.05-3.23-17.22-21.2-5.71-35.7,2.28,1.36,3.11,1.57,5.54-.66,1.27-1.17,3.39-2.46,4.55-2.89,2.77-1.06,4.27-2.24,1.87-7.51-3.07-6.85-9.35-4.91-12.23-2.55-3.24,2.68-5.52,6.99-1.34,12.07-11.69,7.89-13.7,17.58-13.43,26,.28,8.96-2.01,8.19.84,17.31.25.8-.31.78-.74.52-12.19-7.8-18.77-31.6.22-44.72.43-.38.25-.88-1.31.03C-.13,22.09-1.64,38.93,1.08,50.28c1.33,5.49-.69,6.51,1.44,13.73,4.89,15.05,9.06,16.23,14.96,16.67,10.73,0,3.45-5.91,3.84-13.35,0-.43.53-.65.83.25,5.9,13.24,10.07,25.29,25.59,24.16,8.98-1.17,4-5.63,3.45-8.16-6.61-21.92,9.42-27.09,4.89-5.72-3,12.24,6.48,11.02,13.14,6.62,6.88-4.52,15.47-34.32,10.5-50.72" fill="#000000"></path>
    <path d="M16.28,82.82c-1.9,0-3.45,1.55-3.45,3.44s1.55,3.45,3.45,3.45,3.43-1.55,3.43-3.45-1.53-3.44-3.43-3.44M19.15,86.25c0,1.59-1.3,2.87-2.87,2.87s-2.87-1.28-2.87-2.87,1.28-2.86,2.87-2.86,2.87,1.29,2.87,2.86" fill="#000000"></path>
    <path d="M17.26,86.79c-.07.42-.42.71-.9.71-.66,0-1.08-.59-1.08-1.25s.38-1.22,1.08-1.22c.46,0,.81.27.9.68h.48c-.08-.76-.68-1.19-1.39-1.19-1.03,0-1.61.75-1.61,1.73s.64,1.74,1.63,1.74c.7,0,1.26-.45,1.4-1.19h-.5Z" fill="#000000"></path>
    <path data-wwf-logo-restricted="" class="wwf-r" d="M76.77,91.03c-1.92,0-3.44,1.54-3.44,3.44s1.53,3.44,3.44,3.44,3.44-1.52,3.44-3.44-1.54-3.44-3.44-3.44M79.64,94.47c0,1.59-1.3,2.87-2.87,2.87s-2.89-1.28-2.89-2.87,1.29-2.86,2.89-2.86,2.87,1.28,2.87,2.86" fill="#000000"></path>
    <path data-wwf-logo-restricted="" class="wwf-r" d="M76.17,94.27v-1.01h.67c.34,0,.7.09.7.49,0,.5-.37.52-.8.52h-.58ZM76.17,94.7h.56l.87,1.4h.54l-.93-1.44c.48-.06.85-.31.85-.88,0-.65-.37-.92-1.14-.92h-1.25v3.24h.51v-1.4Z" fill="#000000"></path>
  `;
  logoLinkEl.append(svg);
  logoWrapper.append(logoLinkEl);
  headerNav.append(logoWrapper);

  const navContentWrapper = document.createElement('div');
  navContentWrapper.classList.add('lg:col-start-2', 'lg:col-span-14', 'flex', 'justify-start', 'items-center');

  const innerNavContent = document.createElement('div');
  innerNavContent.classList.add('flex', 'justify-between', 'items-center', 'gap-4', 'xl:gap-grid-gutter', 'w-full');

  const desktopMenu = document.createElement('div');
  desktopMenu.classList.add('hidden', 'lg:flex', 'justify-center', 'items-center');
  desktopMenu.setAttribute('data-desktop-menu', '');

  const primaryNavUl = document.createElement('ul');
  primaryNavUl.classList.add('flex', 'flex-row', 'justify-center', 'items-center', 'lg:gap-6', 'xl:gap-8');
  primaryNavUl.setAttribute('data-primary-nav', '');

  // Filter itemRows based on cell count for different sub-components
  const primaryNavItems = itemRows.filter((row) => row.children.length === 3);
  const primaryActionItems = itemRows.filter((row) => row.children.length === 2);
  const socialLinkItems = itemRows.filter((row) => row.children.length === 1);

  primaryNavItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('group', 'list-none', 'leading-[1.1]');
    li.setAttribute('data-has-subnav', '');

    const button = document.createElement('button');
    button.classList.add('lg:text-16', 'xl:text-18', 'link', 'group/nav-link', 'text-foreground', 'text-start', 'lg:text-15', 'xl:text-16', 'no-underline', 'font-semibold', 'inline-flex', 'flex-row', 'items-start', 'justify-start', 'gap-2', 'forced-colors:text-[ButtonText]', 'hocus:underline', 'hocus:text-brand-1', 'hocus:underline-offset-8', 'group-[.active]:underline', 'group-[.active]:text-brand-1', 'group-[.active]:decoration-[3px]', 'group-[.active]:underline-offset-8', 'motion-safe:not-focus-visible:transition-underline');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('data-open-subnav', '');
    button.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, button);

    const chevronDiv = document.createElement('div');
    chevronDiv.classList.add('group-[.active]:-rotate-180', 'motion-safe:transition-transform', 'will-change-transform', 'flex', 'h-[1lh]', 'items-center');
    chevronDiv.innerHTML = `
      <svg class="icon icon--chevron-down size-3 text-foreground-muted group-hover/nav-link:text-brand-1 group-focus-visible/nav-link:text-brand-1 not-forced-colors:[.active_&]:text-brand-1 forced-colors:group-hover/nav-link:text-[ButtonText]!" aria-hidden="true">
        <use xlink:href="#chevron-down" href="#chevron-down"></use>
      </svg>
    `;
    button.append(chevronDiv);
    li.append(button);

    const subnavDiv = document.createElement('div');
    subnavDiv.classList.add('transition-display', 'max-lg:overflow-auto', 'max-lg:w-full', 'max-lg:h-[calc(100dvh-var(--navbar-height))]', 'duration-200', 'hidden', 'allow-discrete', 'opacity-0', 'starting:group-[.active]:opacity-0', 'group-[.active]:opacity-100', 'group-[.active]:block', 'absolute', 'bg-surface-navbar', 'inset-x-0', 'top-full', 'py-12', 'lg:py-2xl', 'shadow-md', 'border-t', 'border-t-stroke-muted');
    subnavDiv.setAttribute('data-subnav', '');

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('container', 'grid-full');
    const gridCenteredDiv = document.createElement('div');
    gridCenteredDiv.classList.add('grid-centered-12', 'w-full');
    const gridDiv = document.createElement('div');
    gridDiv.classList.add('grid', 'grid-cols-1', 'lg:grid-cols-12', 'gap-13', 'lg:gap-grid-gutter');
    gridDiv.setAttribute('data-animated', '');

    const mobileTitle = document.createElement('div');
    mobileTitle.classList.add('w-full', 'text-h6', 'lg:hidden', 'animated-fade-in-up');
    mobileTitle.textContent = labelCell.textContent.trim();
    gridDiv.append(mobileTitle);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      const colDiv = document.createElement('div');
      colDiv.classList.add('animated-fade-in-up', 'lg:col-span-4'); // Adjust column span as needed
      const flexColDiv = document.createElement('div');
      flexColDiv.classList.add('not-last:mb-md', 'md:mb-0', 'flex', 'flex-col');
      flexColDiv.append(hierarchyUl);
      colDiv.append(flexColDiv);
      gridDiv.append(colDiv);
    }

    gridCenteredDiv.append(gridDiv);
    containerDiv.append(gridCenteredDiv);
    subnavDiv.append(containerDiv);
    li.append(subnavDiv);
    primaryNavUl.append(li);

    button.addEventListener('click', () => {
      li.classList.toggle('active');
      subnavDiv.classList.toggle('hidden');
      subnavDiv.classList.toggle('opacity-0');
      subnavDiv.classList.toggle('opacity-100');
      button.setAttribute('aria-expanded', li.classList.contains('active'));
    });
  });

  desktopMenu.append(primaryNavUl);
  innerNavContent.append(desktopMenu);

  const rightNavWrapper = document.createElement('div');
  rightNavWrapper.classList.add('flex', 'items-center');

  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('hidden', 'lg:flex', 'ml-4', 'lg:ml-0', 'justify-center', 'items-center');
  const searchButton = document.createElement('button');
  searchButton.classList.add('group', 'inline-flex', 'gap-2', 'p-3', 'xl:p-3.5', 'border-1', 'rounded-full', 'items-center', 'cursor-pointer', 'transition-colors', 'border-navbar-search-button-foreground', 'text-navbar-search-button-foreground', 'bg-navbar-search-button-surface', 'hocus:text-navbar-search-button-foreground-accent', 'hocus:bg-navbar-search-button-surface-accent', 'hocus:border-navbar-search-button-surface-accent', 'aria-expanded:bg-navbar-search-button-surface-active', 'aria-expanded:hocus:bg-navbar-search-button-surface-active', 'aria-expanded:hocus:text-navbar-search-button-foreground-active', 'aria-expanded:text-navbar-search-button-foreground-active', 'theme-focus-outline');
  searchButton.setAttribute('aria-label', 'Search');
  searchButton.setAttribute('data-toggle-search', '');
  searchButton.innerHTML = `
    <svg class="icon icon--magnifying-glass size-4.5" aria-hidden="true">
      <use xlink:href="#magnifying-glass" href="#magnifying-glass"></use>
    </svg>
  `;
  searchWrapper.append(searchButton);
  rightNavWrapper.append(searchWrapper);

  const desktopActionMenu = document.createElement('div');
  desktopActionMenu.classList.add('lg:ml-2', 'xl:ml-5');
  desktopActionMenu.setAttribute('data-desktop-menu', '');
  desktopActionMenu.setAttribute('data-keep-open-mobile', '');

  const primaryActionUl = document.createElement('ul');
  primaryActionUl.classList.add('flex', 'flex-row', 'gap-1.5', 'xl:gap-4', 'items-center');
  primaryActionUl.setAttribute('data-primary-nav', '');

  primaryActionItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('group', 'list-none', 'leading-[1.1]');
    li.setAttribute('data-has-subnav', '');

    const linkEl = document.createElement('a');
    linkEl.classList.add('button', 'text-14', 'xl:text-18', 'p-[15px]', 'xl:px-8', 'xl:py-4', 'forced-colors:border', 'button--sedona');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
    }
    linkEl.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, linkEl);
    li.append(linkEl);
    primaryActionUl.append(li);
  });

  desktopActionMenu.append(primaryActionUl);
  rightNavWrapper.append(desktopActionMenu);

  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.classList.add('lg:hidden', 'no-underline', 'flex', 'flex-row', 'items-center', 'gap-2', 'group/toggle', 'ml-4', 'max-[375px]:ml-2', 'lg:ml-5', 'h-3.5', 'theme-focus-outline');
  mobileMenuToggle.setAttribute('data-mobile-menu-toggle', '');
  mobileMenuToggle.setAttribute('data-mobile-menu-open-text', 'Open Navigation');
  mobileMenuToggle.setAttribute('data-mobile-menu-close-text', 'Close Navigation');
  mobileMenuToggle.setAttribute('aria-haspopup', 'true');
  mobileMenuToggle.setAttribute('aria-expanded', 'false');
  mobileMenuToggle.setAttribute('data-open-only', '');

  mobileMenuToggle.innerHTML = `
    <span class="relative w-6 h-3.5 flex flex-col justify-between">
      <span class="absolute left-0 w-full h-[2px] rounded-lg bg-foreground transition-all duration-300 ease-in-out group-hover/toggle:bg-foreground-accent top-0 group-aria-expanded/toggle:top-1/2 group-aria-expanded/toggle:left-1/2 group-aria-expanded/toggle:w-0"></span>
      <span class="absolute left-0 w-full h-[2px] rounded-lg bg-foreground transition-all duration-300 ease-in-out group-hover/toggle:bg-foreground-accent top-1/2 group-aria-expanded/toggle:rotate-45"></span>
      <span class="absolute left-0 w-full h-[2px] rounded-lg bg-foreground transition-all duration-300 ease-in-out group-hover/toggle:bg-foreground-accent top-1/2 group-aria-expanded/toggle:-rotate-45"></span>
      <span class="absolute left-0 w-full h-[2px] rounded-lg bg-foreground transition-all duration-300 ease-in-out group-hover/toggle:bg-foreground-accent top-full group-aria-expanded/toggle:top-1/2 group-aria-expanded/toggle:left-1/2 group-aria-expanded/toggle:w-0"></span>
    </span>
    <span class="sr-only" data-mobile-menu-toggle-text="">Open Navigation</span>
  `;
  rightNavWrapper.append(mobileMenuToggle);

  const searchDropdown = document.createElement('div');
  searchDropdown.classList.add('transition-display', 'hidden', 'allow-discrete', 'opacity-0', 'starting:[&.active]:opacity-0', '[&.active]:opacity-100', '[&.active]:block', 'absolute', 'bg-surface-navbar', 'inset-x-0', 'py-3xl', 'top-full', 'shadow-md');
  searchDropdown.setAttribute('data-search-dropdown', '');
  searchDropdown.innerHTML = `
    <form action="/search/" method="get" role="search" class="container">
      <div class="grid-full">
        <div class="relative grid-centered-12 w-full flex items-center gap-4 border-b border-stroke-default text-h6">
          <input id="search-bar" data-search-input="" name="query" type="text" placeholder="Search…" class="peer w-full bg-transparent pt-2 lg:pb-5 placeholder-transparent focus:outline-none transition-colors"/>
          <label for="search-bar" class="absolute left-0 top-2 origin-left transform transition-transform duration-200 text-h6 text-input-label pointer-events-none
                     peer-placeholder-shown:translate-y-0
                     peer-placeholder-shown:scale-100
                     peer-focus:-translate-y-full
                     peer-focus:scale-75
                     peer-focus:font-semibold
                     peer-not-placeholder-shown:-translate-y-full
                     peer-not-placeholder-shown:font-semibold
                     peer-not-placeholder-shown:scale-75">
              Search
          </label>
          <button class="button bg-transparent text-foreground p-0 theme-focus-outline motion-safe:hocus:translate-x-0.5 transition-transform" type="submit">
            <svg class="icon icon--arrow-right-thin block size-5 md:size-8 lg:size-10 forced-colors:text-[LinkText]" aria-hidden="true">
              <use xlink:href="#arrow-right-thin" href="#arrow-right-thin"></use>
            </svg>
            <span class="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  `;
  rightNavWrapper.append(searchDropdown);

  innerNavContent.append(rightNavWrapper);
  navContentWrapper.append(innerNavContent);
  headerNav.append(navContentWrapper);

  moveInstrumentation(primaryNavContainer, primaryNavUl);
  moveInstrumentation(primaryActionsContainer, primaryActionUl);
  // Social links are not directly rendered in this structure, but their instrumentation must be moved.
  // Create a dummy element or append to an existing one if they are meant to be rendered.
  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('hidden-social-links'); // Hidden by default if not displayed
  moveInstrumentation(socialLinksContainer, socialLinksWrapper);
  socialLinkItems.forEach((row) => {
    const linkEl = document.createElement('a');
    const foundLink = row.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.textContent = foundLink.href; // Use href as text content for social links if no label
    }
    moveInstrumentation(row, linkEl);
    socialLinksWrapper.append(linkEl);
  });
  headerNav.append(socialLinksWrapper); // Append to headerNav, though it might be hidden

  block.replaceChildren(headerNav);

  // Add event listener for search button
  searchButton.addEventListener('click', () => {
    searchButton.setAttribute('aria-expanded', searchDropdown.classList.toggle('active'));
    searchDropdown.classList.toggle('hidden');
    searchDropdown.classList.toggle('opacity-0');
    searchDropdown.classList.toggle('opacity-100');
  });

  // Add event listener for mobile menu toggle
  mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    // Toggle classes for mobile menu container (assuming it's a separate element not shown in this snippet)
    // For now, just toggle the button's state.
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
