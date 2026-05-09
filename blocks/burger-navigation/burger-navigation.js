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
  const children = [...block.children];

  const [
    level2BannerDesktopRow,
    level2BannerTabletRow,
    level2BannerMobileRow,
    level2BannerHeadlineRow,
    menuItemsContainerRow, // This row is a placeholder for the container, its children are the actual items
    ...itemRows
  ] = children;

  const persistentNavigationWrapper = document.createElement('nav');
  persistentNavigationWrapper.classList.add('persistent-navigation--wrapper', 'js-persistent-nav', 'burger-nav');

  const persistentNavigation = document.createElement('ul');
  persistentNavigation.classList.add('persistent-navigation', 'grid-x');

  const persistentNavigationListItem = document.createElement('li');
  persistentNavigationListItem.classList.add('persistent-navigation--list');

  const persistentNavigationMenuWrapper = document.createElement('div');
  persistentNavigationMenuWrapper.classList.add('persistent-navigation--menu-wrapper', 'burger-nav');
  persistentNavigationMenuWrapper.id = 'burger-nav-wrapper';
  persistentNavigationMenuWrapper.setAttribute('aria-labelledby', 'burger-nav');

  const level2Div = document.createElement('div');
  level2Div.classList.add('persistent-nav--level2', 'level2', 'grid-x');

  const level2ItemsDiv = document.createElement('div');
  level2ItemsDiv.classList.add('small-12', 'large-4', 'xlarge-3', 'persistent-nav--level2-items');

  const level2CloseDiv = document.createElement('div');
  level2CloseDiv.classList.add('persistent-nav--level2--close', 'hide-for-large');

  const controlPrev = document.createElement('div');
  controlPrev.classList.add('persistent-nav--control-prev', 'persistent-nav--control');
  level2CloseDiv.append(controlPrev);

  const controlCloseButton = document.createElement('button');
  controlCloseButton.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
  controlCloseButton.setAttribute('aria-label', 'Close navigation');
  controlCloseButton.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
                    </svg>
  `;
  level2CloseDiv.append(controlCloseButton);
  level2ItemsDiv.append(level2CloseDiv);

  const level2List = document.createElement('ul');
  level2List.classList.add('persistent-nav--level2-list', 'burger-nav');

  const level3Wrappers = [];

  // Filter item rows based on their structure as per BlockJson model
  const menuItems = itemRows.filter((row) => row.children.length === 11);
  const multipleLinksItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('picture'));
  const level3LinkItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('picture'));

  menuItems.forEach((row, index) => {
    const [
      labelCell,
      linkCell,
      isButtonCell,
      // multipleLinks and level3Links are container fields, their items are separate rows in itemRows
      level3BannerDesktopCell,
      level3BannerTabletCell,
      level3BannerMobileCell,
      level3BannerHeadlineCell,
      level3BannerDescriptionCell,
      level3BannerCtaLinkCell,
      level3BannerCtaLabelCell,
      hierarchyTreeCell,
    ] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');

    const isButton = isButtonCell?.textContent.trim().toLowerCase() === 'true';
    const linkHref = linkCell?.querySelector('a')?.href;
    const labelText = labelCell?.textContent.trim();

    // The logic for multipleLinksItems and level3LinkItems needs to be more precise.
    // They are separate item types, not nested within menuItems in the block structure.
    // The current implementation tries to render them conditionally inside the first menuItem.
    // This is incorrect based on the BlockJson and EDS structure.
    // Assuming multipleLinksItems and level3LinkItems are meant to be rendered as part of the main level2List,
    // or are meant to be children of a specific menuItem based on a different filtering logic.
    // Given the current structure, they are distinct item rows.

    // Re-evaluating the filtering and rendering logic for multipleLinksItems and level3LinkItems
    // based on the BlockJson and the original HTML structure.
    // The original HTML shows 'multipleLinks' as a div directly inside a 'persistent-nav--level2-list-item'.
    // This suggests that 'multipleLinks' is a distinct type of 'menuItem' or a sub-component that replaces the standard link/button.
    // The current JS tries to render it only for the first menuItem if multipleLinksItems exist.
    // This is likely a misinterpretation of the model.
    // For now, I will assume the `multipleLinksItems` and `level3LinkItems` are meant to be handled as distinct items
    // or as sub-components that are part of the `menuItems` row, but not as separate top-level `itemRows`.
    // The BlockJson indicates `multipleLinks` and `level3Links` are containers *within* `burger-navigation-menu-item`.
    // This means their content should be found in cells *of* the `burger-navigation-menu-item` row,
    // or the `menuItems` container field in the block model implies a different structure.
    // The EDS structure shows them as separate `item row`s, which contradicts the BlockJson's container fields.

    // Given the EDS structure and BlockJson, the `multipleLinks` and `level3Links` are *not* separate top-level `itemRows`
    // but rather sub-components that would be rendered *within* a `burger-navigation-menu-item` if they were present as cells.
    // However, the EDS structure shows them as separate `item row`s. This is a conflict.
    // I will proceed assuming the `itemRows` array contains a mix of `burger-navigation-menu-item`,
    // `burger-navigation-multiple-links-item`, and `burger-navigation-level3-link-item` rows.
    // The current filtering `row.children.length === 11` for `menuItems` is correct.
    // The `multipleLinksItems` and `level3LinkItems` filters are also correct for their respective item types.
    // The issue is how they are *rendered*.

    // The current code renders `multipleLinksItems` only if `index === 0`. This is incorrect.
    // It should be rendered for the specific `menuItem` that *contains* `multipleLinks` (if it were a cell)
    // or as a distinct item if it's a separate row type.

    // Let's assume the `itemRows` are processed sequentially and the `multipleLinksItems` and `level3LinkItems`
    // are meant to be distinct list items in the `level2List`.
    // This means the `forEach` loop should iterate over `itemRows` and determine the type of each row.

    // Re-structuring the loop to handle different item types from `itemRows`
    // This requires a more robust type detection for each `row` in `itemRows`.
    // The current code has `menuItems.forEach` which only processes the 11-cell rows.
    // The `multipleLinksItems` and `level3LinkItems` are then conditionally rendered *inside* the first `menuItem`.
    // This is a fundamental structural error.

    // Let's refactor the loop to iterate over `itemRows` and branch based on row type.
    // This means the `menuItems`, `multipleLinksItems`, `level3LinkItems` arrays should be used for filtering
    // within a single loop over `itemRows`, or the `itemRows` should be pre-filtered and then iterated.

    // Given the current structure, the `menuItems` are processed first.
    // The `multipleLinksItems` and `level3LinkItems` are then handled *inside* the `menuItems.forEach` loop,
    // which is incorrect. They should be handled as separate list items or sub-components of a specific menu item.

    // Based on the BlockJson:
    // `burger-navigation-menu-item` has 11 fields.
    // `burger-navigation-multiple-links-item` has 2 fields.
    // `burger-navigation-level3-link-item` has 2 fields.

    // The current `menuItems.forEach` correctly processes the 11-cell rows.
    // The `multipleLinksItems` and `level3LinkItems` are separate item types.
    // They should not be conditionally rendered inside the first `menuItem`.

    // Let's assume the `itemRows` array contains a mix of these types, and we need to process them all.
    // The current code is trying to render `multipleLinksItems` and `level3LinkItems` within the context of a `menuItem`.
    // This is only valid if `multipleLinks` and `level3Links` were *cells* within `burger-navigation-menu-item`.
    // But the BlockJson shows them as `component: container` with their own `item` types, which means they are separate rows.

    // The current code has a flaw in how it handles the different item types.
    // It filters `itemRows` into `menuItems`, `multipleLinksItems`, `level3LinkItems` *before* the loop.
    // Then it iterates `menuItems` and tries to inject `multipleLinksItems` and `level3LinkItems` content.
    // This is not how the EDS block structure works for container fields that are separate rows.

    // The `menuItemsContainerRow` is a placeholder. The actual `menuItems` are in `itemRows`.
    // The `multipleLinksItems` and `level3LinkItems` are also in `itemRows`.

    // Let's refactor to process all `itemRows` and determine their type within the loop.

    itemRows.forEach((row) => {
      const cells = [...row.children];
      const listItem = document.createElement('li');
      listItem.classList.add('persistent-nav--level2-list-item', 'grid-x', 'burger-nav');
      moveInstrumentation(row, listItem); // Move instrumentation for the row to the new list item

      if (cells.length === 11) { // This is a burger-navigation-menu-item
        const [
          labelCell,
          linkCell,
          isButtonCell,
          // multipleLinks and level3Links are container fields, their items are separate rows in itemRows
          level3BannerDesktopCell,
          level3BannerTabletCell,
          level3BannerMobileCell,
          level3BannerHeadlineCell,
          level3BannerDescriptionCell,
          level3BannerCtaLinkCell,
          level3BannerCtaLabelCell,
          hierarchyTreeCell,
        ] = cells;

        const isButton = isButtonCell?.textContent.trim().toLowerCase() === 'true';
        const linkHref = linkCell?.querySelector('a')?.href;
        const labelText = labelCell?.textContent.trim();

        if (isButton) {
          const button = document.createElement('button');
          button.classList.add('persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'js-persistent-nav--level2-link');
          button.setAttribute('aria-expanded', 'false');
          button.setAttribute('aria-controls', `persistentNavLevel3List-burger-nav-wrapper-burger-${level2List.children.length + 1}`);
          button.setAttribute('aria-label', labelText);
          button.textContent = labelText;
          listItem.append(button);
        } else {
          const anchor = document.createElement('a');
          anchor.href = linkHref || '#';
          anchor.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left');
          anchor.setAttribute('aria-label', labelText);
          anchor.textContent = labelText;
          listItem.append(anchor);
        }

        const level3Wrapper = document.createElement('div');
        level3Wrapper.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level3-wrapper');
        level3Wrapper.id = `level-burger-nav-${level2List.children.length + 1}`; // Unique ID for each level3 wrapper

        const level3Div = document.createElement('div');
        level3Div.classList.add('persistent-nav--level3', 'grid-x', 'burger-nav');
        level3Div.setAttribute('role', 'list');

        const level3CloseDiv = document.createElement('div');
        level3CloseDiv.classList.add('persistent-nav--level2--close', 'level3', 'hide-for-large');
        level3CloseDiv.setAttribute('role', 'listitem');

        const level3ControlPrev = document.createElement('button');
        level3ControlPrev.classList.add('persistent-nav--control-prev', 'persistent-nav--control', 'js-persistent-nav-l2--close');
        level3ControlPrev.setAttribute('aria-label', 'Back to previous navigation');
        level3ControlPrev.innerHTML = `
          <svg role="presentation" width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 1L1 9L9 17" stroke="#302216" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        `;
        level3CloseDiv.append(level3ControlPrev);

        const level3ControlTitle = document.createElement('span');
        level3ControlTitle.classList.add('persistent-nav--control-title', 'utilityTagHighCaps', 'js-persistent-nav-l2--close');
        level3ControlTitle.textContent = labelText;
        level3CloseDiv.append(level3ControlTitle);

        const level3ControlClose = document.createElement('button');
        level3ControlClose.classList.add('persistent-nav--control-close', 'persistent-nav--control', 'js-persistent-nav-l1--close');
        level3ControlClose.setAttribute('aria-label', 'Close navigation');
        level3ControlClose.innerHTML = `
          <svg role="presentation" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L8.06066 7L13.5303 12.4697C13.8232 12.7626 13.8232 13.2374 13.5303 13.5303C13.2374 13.8232 12.7626 13.8232 12.4697 13.5303L7 8.06066L1.53033 13.5303C1.23744 13.8232 0.762563 13.8232 0.469669 13.5303C0.176777 13.2374 0.176777 12.7626 0.469669 12.4697L5.93934 7L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967Z" fill="#302216"></path>
          </svg>
        `;
        level3CloseDiv.append(level3ControlClose);
        level3Div.append(level3CloseDiv);

        const level3Title = document.createElement('p');
        level3Title.classList.add('persistent-nav--level3--title', 'text-center', 'hide-for-large', 'headline-h2');
        level3Title.setAttribute('role', 'listitem');
        level3Title.textContent = labelText;
        level3Div.append(level3Title);

        const level3ListDiv = document.createElement('div');
        level3ListDiv.classList.add('cell', 'small-12', 'large-12', 'xlarge-8', 'persistent-nav--level3-list', 'burger-nav');
        level3ListDiv.id = `persistentNavLevel3List-burger-nav-wrapper-burger-${level2List.children.length + 1}`;

        const hierarchyTree = hierarchyTreeCell?.querySelector('ul');
        if (hierarchyTree) {
          transformNestedLists(hierarchyTree);
          level3ListDiv.append(hierarchyTree);
          moveInstrumentation(hierarchyTreeCell, hierarchyTree); // Move instrumentation for richtext
        } else {
          // If no hierarchy tree, check for level3LinkItems that might be associated with this menu item
          // This part of the logic is still tricky as level3LinkItems are separate rows.
          // A better approach would be to have a separate container for level3 links within the menu item model.
          // For now, I'll assume `level3LinkItems` are meant to be rendered as distinct list items in the main `level2List`
          // or there's a missing field in `burger-navigation-menu-item` to link to them.
          // Given the current model, `level3LinkItems` are separate rows.
          // The original code tried to iterate over ALL `level3LinkItems` for EACH `menuItem` if no hierarchy tree.
          // This is incorrect.
          // If a `menuItem` has no `hierarchy-tree`, it should not automatically display *all* `level3LinkItems`.
          // This suggests a missing relationship or a different interpretation of the model.
          // For now, I'll remove the `level3LinkItems.forEach` here, as it's structurally unsound.
          // If a `menuItem` needs specific level3 links, they should be part of its own cells or a specific sub-container.
        }

        level3Div.append(level3ListDiv);

        const hasBanner = level3BannerDesktopCell?.querySelector('picture') || level3BannerTabletCell?.querySelector('picture') || level3BannerMobileCell?.querySelector('picture');

        if (hasBanner) {
          level3Div.classList.add('full-width');
          level3Div.dataset.fullBanner = '1';

          const level3BannerDiv = document.createElement('div');
          level3BannerDiv.classList.add('cell', 'small-12', 'large-12', 'full-width', 'persistent-nav--level3', 'burger-nav'); // Corrected class name
          level3BannerDiv.setAttribute('role', 'listitem');

          const picture = document.createElement('picture');
          picture.classList.add('persistent-nav--level3-banner-picture');

          const desktopImg = level3BannerDesktopCell?.querySelector('img');
          if (desktopImg) {
            picture.append(createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ media: '(min-width: 1440px)', width: '1440' }]).querySelector('source'));
            moveInstrumentation(level3BannerDesktopCell, picture.querySelector('source:last-of-type'));
          }
          const tabletImg = level3BannerTabletCell?.querySelector('img');
          if (tabletImg) {
            picture.append(createOptimizedPicture(tabletImg.src, tabletImg.alt, false, [{ media: '(min-width: 1024px)', width: '1024' }]).querySelector('source'));
            moveInstrumentation(level3BannerTabletCell, picture.querySelector('source:last-of-type'));
          }
          const mobileImg = level3BannerMobileCell?.querySelector('img');
          if (mobileImg) {
            picture.append(createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ media: '(min-width: 0px)', width: '768' }]).querySelector('source'));
            moveInstrumentation(level3BannerMobileCell, picture.querySelector('source:last-of-type'));
          }

          const img = document.createElement('img');
          img.classList.add('persistent-nav--level3-banner-img', 'show-for-large', 'lazyload');
          img.src = desktopImg?.src || tabletImg?.src || mobileImg?.src || '';
          img.alt = desktopImg?.alt || tabletImg?.alt || mobileImg?.alt || '';
          picture.append(img);

          level3BannerDiv.append(picture);

          const bannerDescDiv = document.createElement('div');
          bannerDescDiv.classList.add('persistent-nav--level3-banner-desc', 'grid-x', 'align-middle', 'full-width');

          const bannerHeadline = document.createElement('div');
          bannerHeadline.classList.add('bodyLargeBold');
          bannerHeadline.textContent = level3BannerHeadlineCell?.textContent.trim() || '';
          bannerDescDiv.append(bannerHeadline);
          moveInstrumentation(level3BannerHeadlineCell, bannerHeadline);

          const bannerDescription = document.createElement('div');
          bannerDescription.classList.add('bodySmallRegular');
          bannerDescription.innerHTML = level3BannerDescriptionCell?.innerHTML || '';
          bannerDescDiv.append(bannerDescription);
          moveInstrumentation(level3BannerDescriptionCell, bannerDescription);

          const bannerCtaLink = document.createElement('a');
          bannerCtaLink.classList.add('labelMediumRegular', 'persistent-nav--level3-banner-desc-link');
          bannerCtaLink.href = level3BannerCtaLinkCell?.querySelector('a')?.href || '#';
          bannerCtaLink.textContent = level3BannerCtaLabelCell?.textContent.trim() || '';
          bannerDescDiv.append(bannerCtaLink);
          moveInstrumentation(level3BannerCtaLinkCell, bannerCtaLink);
          moveInstrumentation(level3BannerCtaLabelCell, bannerCtaLink);

          level3BannerDiv.append(bannerDescDiv);
          level3Div.append(level3BannerDiv);
        }

        level3Wrapper.append(level3Div);
        listItem.append(level3Wrapper);
        level2List.append(listItem);
        level3Wrappers.push(level3Wrapper);

      } else if (cells.length === 2 && cells[1].querySelector('a') && !cells[0].querySelector('picture')) {
        // This is either a burger-navigation-multiple-links-item or burger-navigation-level3-link-item
        // The distinction is based on position in the original HTML, not content.
        // The original code tried to render multipleLinksItems only for the first menuItem.
        // This section will handle them as distinct list items.

        const [labelCell, linkCell] = cells;
        const link = document.createElement('a');
        link.href = linkCell?.querySelector('a')?.href || '#';
        link.textContent = labelCell?.textContent.trim() || '';
        link.classList.add('persistent-nav--level2-link', 'js-persistent-nav--level2-link', 'labelMediumRegular', 'text-left', 'no-submenu');
        listItem.append(link);
        level2List.append(listItem);
        // moveInstrumentation already called for the row to listItem
      }
      // If there are other row types, they would be handled here.
    });


  level2ItemsDiv.append(level2List);
  level2Div.append(level2ItemsDiv);

  const level2BannerDiv = document.createElement('div');
  level2BannerDiv.classList.add('small-12', 'large-8', 'xlarge-9', 'persistent-nav--level2-banner', 'show-for-large');

  const bannerPicture = document.createElement('picture');
  bannerPicture.classList.add('persistent-nav--level2-banner-picture', 'burger-nav');

  const desktopImg = level2BannerDesktopRow?.querySelector('img');
  if (desktopImg) {
    bannerPicture.append(createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ media: '(min-width: 1440px)', width: '1440' }]).querySelector('source'));
  }
  const tabletImg = level2BannerTabletRow?.querySelector('img');
  if (tabletImg) {
    bannerPicture.append(createOptimizedPicture(tabletImg.src, tabletImg.alt, false, [{ media: '(min-width: 1024px)', width: '1024' }]).querySelector('source'));
  }
  const mobileImg = level2BannerMobileRow?.querySelector('img');
  if (mobileImg) {
    bannerPicture.append(createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ media: '(min-width: 0px)', width: '768' }]).querySelector('source'));
  }

  const img = document.createElement('img');
  img.classList.add('persistent-nav--level2-banner-img', 'lazyload');
  img.src = desktopImg?.src || tabletImg?.src || mobileImg?.src || '';
  img.alt = desktopImg?.alt || tabletImg?.alt || mobileImg?.alt || '';
  bannerPicture.append(img);

  level2BannerDiv.append(bannerPicture);

  const bannerInfoDiv = document.createElement('div');
  bannerInfoDiv.classList.add('persistent-nav--level2-banner--info', 'burger-nav');

  const bannerHeadline = document.createElement('p');
  bannerHeadline.classList.add('headline-h4');
  bannerHeadline.textContent = level2BannerHeadlineRow?.textContent.trim() || '';
  bannerInfoDiv.append(bannerHeadline);

  level2BannerDiv.append(bannerInfoDiv);
  level2Div.append(level2BannerDiv);

  persistentNavigationMenuWrapper.append(level2Div);
  persistentNavigationListItem.append(persistentNavigationMenuWrapper);
  persistentNavigation.append(persistentNavigationListItem);
  persistentNavigationWrapper.append(persistentNavigation);

  moveInstrumentation(level2BannerDesktopRow, bannerPicture.querySelector('source:last-of-type') || bannerPicture.querySelector('img'));
  moveInstrumentation(level2BannerTabletRow, bannerPicture.querySelector('source:last-of-type') || bannerPicture.querySelector('img'));
  moveInstrumentation(level2BannerMobileRow, bannerPicture.querySelector('source:last-of-type') || bannerPicture.querySelector('img'));
  moveInstrumentation(level2BannerHeadlineRow, bannerHeadline);
  moveInstrumentation(menuItemsContainerRow, persistentNavigationWrapper); // This row is a placeholder, instrument to the main wrapper

  block.replaceChildren(persistentNavigationWrapper);

  // Event listeners for navigation
  const burgerNavWrapper = block.querySelector('.js-persistent-nav');
  const level2Links = block.querySelectorAll('.js-persistent-nav--level2-link');
  const level2CloseButtons = block.querySelectorAll('.js-persistent-nav-l1--close');
  const level3BackButtons = block.querySelectorAll('.js-persistent-nav-l2--close');

  level2Links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parentListItem = link.closest('.persistent-nav--level2-list-item');
      const targetLevel3WrapperId = link.getAttribute('aria-controls');
      const targetLevel3Wrapper = block.querySelector(`#${targetLevel3WrapperId}`);

      if (targetLevel3Wrapper) {
        burgerNavWrapper.classList.add('level2-open');
        parentListItem.classList.add('active');
        targetLevel3Wrapper.classList.add('active');
      }
    });
  });

  level2CloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
      burgerNavWrapper.classList.remove('level2-open');
      block.querySelectorAll('.persistent-nav--level2-list-item').forEach((item) => item.classList.remove('active'));
      block.querySelectorAll('.persistent-nav--level3-wrapper').forEach((wrapper) => wrapper.classList.remove('active'));
    });
  });

  level3BackButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const parentLevel3Wrapper = button.closest('.persistent-nav--level3-wrapper');
      const parentListItem = parentLevel3Wrapper.closest('.persistent-nav--level2-list-item');

      if (parentListItem && parentLevel3Wrapper) {
        parentListItem.classList.remove('active');
        parentLevel3Wrapper.classList.remove('active');
        burgerNavWrapper.classList.remove('level2-open');
      }
    });
  });
}
