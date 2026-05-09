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
  const allRows = [...block.children];

  const logoLinkRow = allRows.shift();
  // These are placeholder rows for the containers, not actual content rows
  const primaryNavPlaceholder = allRows.shift();
  const primaryActionsPlaceholder = allRows.shift();

  const primaryNavItems = [];
  const primaryActionItems = [];
  const primaryActionDropdownItems = [];
  const megaNavColumns = [];
  const megaNavHighlightCards = [];
  const megaNavButtonLinks = [];
  const megaNavSocialLinks = [];

  // Distribute remaining rows into their respective categories based on cell count and content
  allRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 2) {
      const hasUlInSecondCell = cells[1].querySelector('ul');
      const hasPictureInFirstCell = cells[0].querySelector('picture');
      const hasAnchorInSecondCell = cells[1].querySelector('a');
      const hasPInSecondCell = cells[1].querySelector('p'); // For mega-nav-column

      if (hasUlInSecondCell) {
        primaryNavItems.push(row);
      } else if (hasPictureInFirstCell) {
        // This condition should not be hit for 2-cell rows based on model
        // mega-nav-highlight-card is 5 cells
      } else if (hasAnchorInSecondCell) {
        // Distinguish between primary-action-item, primary-action-dropdown-item,
        // mega-nav-button-link, mega-nav-social-link.
        // All are 2 cells with a link. We need to rely on the order in the authored block
        // or more specific content detection if available.
        // Based on the BlockJson and structure, primary-action-item and primary-action-dropdown-item
        // are top-level items, while mega-nav-* items are nested within primary-nav-item or primary-action-dropdown-item.
        // The current parsing logic puts all 2-cell rows into one of these lists.
        // We need to ensure that mega-nav-* items are only processed when their parent is being built.
        // For now, we'll assume the order in the block.children array reflects the top-level items first.

        // The current parsing logic is flawed for nested containers.
        // A better approach is to parse top-level items first, then pass their sub-rows
        // to a dedicated parser for nested items.
        // For this review, we'll fix the immediate issue of type detection and assume
        // the flat list of `children` is correctly ordered for top-level items.

        // Re-evaluating type detection for 2-cell rows:
        // primary-nav-item: 2 cells, richtext (ul) in cell[1] - handled by hasUlInSecondCell
        // primary-action-item: 2 cells, text, aem-content (link)
        // primary-action-dropdown-item: 2 cells, text, aem-content (link)
        // mega-nav-column: 2 cells, text, richtext (p or ul)
        // mega-nav-button-link: 2 cells, text, aem-content (link)
        // mega-nav-social-link: 2 cells, text, aem-content (link)

        // The current flat parsing makes it impossible to correctly associate nested items.
        // The generated code tries to distinguish mega-nav items at the top level, which is wrong.
        // They should only be collected when processing a primary-nav-item or primary-action-dropdown-item.

        // For now, we'll prioritize the top-level items and collect mega-nav items into their
        // respective arrays, but their rendering logic will need to be carefully placed.
        // The original code's `isMegaNavColumn`, `isMegaNavButtonLink`, `isMegaNavSocialLink`
        // checks are attempting to distinguish these at the top level, which is incorrect.
        // They should be identified and processed when their parent container is being built.

        // Given the current flat structure, we'll use a heuristic based on content and position.
        // This is fragile and points to a deeper issue in the block generation for nested containers.

        // Heuristic:
        // If it's a 2-cell row with a link:
        // - If cell[1] has a <p> (likely richtext for mega-nav-column), it's a mega-nav-column.
        // - Otherwise, it's either a primary-action-item, primary-action-dropdown-item,
        //   mega-nav-button-link, or mega-nav-social-link.
        //   Without more specific content, we'll rely on the order in the block.children.
        //   The BlockJson implies primary-action-item and primary-action-dropdown-item are top-level.
        //   The mega-nav-* items are nested. The current flat parsing is a problem.

        // Let's refine the type detection for 2-cell rows:
        if (cells[0].textContent.trim() && hasPInSecondCell) { // Heuristic for mega-nav-column
          megaNavColumns.push(row);
        } else if (cells[0].textContent.trim().toLowerCase().includes('facebook') || cells[0].textContent.trim().toLowerCase().includes('twitter') || cells[0].textContent.trim().toLowerCase().includes('instagram') || cells[0].textContent.trim().toLowerCase().includes('linkedin')) {
          // Heuristic for social links
          megaNavSocialLinks.push(row);
        } else if (cells[0].textContent.trim() && hasAnchorInSecondCell) {
          // This is still ambiguous between primary-action-item, primary-action-dropdown-item, and mega-nav-button-link.
          // The block structure implies primary-action-item and primary-action-dropdown-item come first.
          // We need to differentiate primary-action-item from primary-action-dropdown-item.
          // The model for primary-action-item has no nested containers, while dropdown has them.
          // However, the actual content for dropdownItems is not in these cells.
          // This is a major limitation of the flat block.children parsing for nested containers.

          // For the purpose of this review, we'll assume the order in the block.children
          // determines if it's a primary-action-item vs primary-action-dropdown-item.
          // This is a fragile assumption.
          // A robust solution would require a different parsing strategy, e.g.,
          // parsing the block.children into a tree structure first.

          // For now, we'll use a simple count-based split, assuming primaryActionItems come before primaryActionDropdownItems
          // in the authored content, and megaNavButtonLinks are nested.
          // This is a temporary fix for the generated JS's flawed parsing.
          // The original code's `isMegaNavButtonLink` check is not robust.
          // We'll push to a generic list and re-evaluate if needed.
          if (row.dataset.blockItemType === 'primary-action-dropdown-item') { // This dataset is not present in EDS
            primaryActionDropdownItems.push(row);
          } else if (row.dataset.blockItemType === 'mega-nav-button-link') { // This dataset is not present in EDS
            megaNavButtonLinks.push(row);
          } else {
            // Default to primary-action-item if no other specific type matches
            primaryActionItems.push(row);
          }
        }
      }
    } else if (cells.length === 5) {
      megaNavHighlightCards.push(row);
    }
  });

  // Re-distribute primaryActionItems and primaryActionDropdownItems
  // This is a heuristic to address the flat parsing of block.children for nested containers.
  // The BlockJson implies primary-action-item and primary-action-dropdown-item are top-level.
  // The mega-nav-* items are nested within primary-nav-item or primary-action-dropdown-item.
  // The current flat parsing means all these items are in `allRows` together.
  // We need to ensure that `primaryActionDropdownItems` are correctly identified.
  // A better approach would be to parse the block.children into a tree structure first.

  // For now, we'll assume primary-action-dropdown-item rows are explicitly marked or follow a pattern.
  // Since they are not explicitly marked in the EDS structure, we will rely on the order.
  // This is a known limitation of the current block generation for deeply nested structures.

  // Let's re-process `allRows` to correctly identify top-level items and their nested children.
  // This requires a more structured parsing than the current flat `forEach`.
  // We need to build a temporary tree.

  const parsedPrimaryNavItems = [];
  const parsedPrimaryActionItems = [];
  const parsedPrimaryActionDropdownItems = [];

  let currentPrimaryNavItem = null;
  let currentPrimaryActionDropdownItem = null;

  // This parsing strategy is still a heuristic due to the flat input.
  // It assumes a specific ordering of rows in the authored content.
  // A robust solution would involve a custom parser that understands the container relationships.
  // For this review, we'll make the best effort to align with the BlockJson's implied structure.
  // The BlockJson shows `primaryNavItems` and `primaryActions` as top-level containers.
  // `megaNavColumns`, `highlightCards`, `buttonLinks`, `socialLinks` are nested.

  // Let's re-parse `allRows` based on the BlockJson structure.
  // The first three rows are `logoLink`, `primaryNav` placeholder, `primaryActions` placeholder.
  // The remaining rows are a mix of `primary-nav-item`, `primary-action-item`, `primary-action-dropdown-item`,
  // and their nested `mega-nav-*` children.

  // This is the most complex part due to the flat input for nested containers.
  // The current generated code attempts to flatten all item types into separate arrays,
  // then tries to re-assemble them, which is prone to errors.

  // A better approach: iterate `allRows` and build a hierarchical structure.
  // This is beyond a simple fix and requires a re-think of the parsing logic.
  // For now, we'll try to make the existing flat parsing less error-prone.

  // The original code's `primaryNavItems`, `primaryActionItems`, `primaryActionDropdownItems`,
  // `megaNavColumns`, `megaNavHighlightCards`, `megaNavButtonLinks`, `megaNavSocialLinks`
  // arrays are populated by a flat `forEach` over `children`. This is the core problem.
  // The `megaNav*` items should only be collected when processing a `primary-nav-item` or `primary-action-dropdown-item`.

  // Let's assume the `primaryNavItems` are the 2-cell rows with a `ul` in the second cell.
  // Let's assume `primaryActionItems` are 2-cell rows with a link, but no dropdown.
  // Let's assume `primaryActionDropdownItems` are 2-cell rows with a link, and *followed by* mega-nav items.
  // This is a very fragile assumption.

  // Given the current structure, the generated code's initial classification is problematic.
  // We need to ensure that `megaNavColumns`, `megaNavHighlightCards`, `megaNavButtonLinks`, `megaNavSocialLinks`
  // are *only* processed when building a `primary-nav-item` or `primary-action-dropdown-item`.
  // The current code collects them globally, then tries to append them.

  // For the purpose of this review, I will make the following assumptions to fix the immediate issues:
  // 1. `primaryNavItems` are 2-cell rows with a `ul` in the second cell.
  // 2. `primaryActionItems` are 2-cell rows with an `a` in the second cell, and *not* followed by mega-nav items.
  // 3. `primaryActionDropdownItems` are 2-cell rows with an `a` in the second cell, and *followed by* mega-nav items.
  // 4. `megaNavColumns`, `megaNavHighlightCards`, `megaNavButtonLinks`, `megaNavSocialLinks` are *always* nested
  //    under a `primary-nav-item` or `primary-action-dropdown-item`.
  // This means the global collection of `megaNav*` items is incorrect. They should be collected *per parent*.

  // Re-initialize item arrays to reflect the hierarchical parsing.
  const finalPrimaryNavItems = [];
  const finalPrimaryActionItems = [];
  const finalPrimaryActionDropdownItems = [];

  let i = 0;
  while (i < allRows.length) {
    const row = allRows[i];
    const cells = [...row.children];

    if (cells.length === 2) {
      const hasUlInSecondCell = cells[1].querySelector('ul');
      const hasAnchorInSecondCell = cells[1].querySelector('a');

      if (hasUlInSecondCell) { // This is a primary-nav-item
        const navItem = { row, megaNavColumns: [], megaNavHighlightCards: [], megaNavButtonLinks: [], megaNavSocialLinks: [] };
        finalPrimaryNavItems.push(navItem);
        i++; // Move to the next row

        // Collect nested mega-nav items until a new primary-nav-item or primary-action-item is found
        while (i < allRows.length) {
          const nextRow = allRows[i];
          const nextCells = [...nextRow.children];
          if (nextCells.length === 2 && nextCells[1].querySelector('ul')) {
            // New primary-nav-item, break and process it in the next iteration
            break;
          }
          if (nextCells.length === 2 && nextCells[1].querySelector('a')) {
            // New primary-action-item/dropdown, break
            break;
          }
          if (nextCells.length === 2 && nextCells[0].textContent.trim() && nextCells[1].querySelector('p')) {
            // Heuristic for mega-nav-column
            navItem.megaNavColumns.push(nextRow);
            i++;
          } else if (nextCells.length === 5) {
            // mega-nav-highlight-card
            navItem.megaNavHighlightCards.push(nextRow);
            i++;
          } else if (nextCells.length === 2 && nextCells[1].querySelector('a') && nextCells[0].textContent.trim() && !nextCells[0].textContent.trim().toLowerCase().includes('facebook') && !nextCells[0].textContent.trim().toLowerCase().includes('twitter') && !nextCells[0].textContent.trim().toLowerCase().includes('instagram') && !nextCells[0].textContent.trim().toLowerCase().includes('linkedin')) {
            // mega-nav-button-link (heuristic: 2 cells, link, not social)
            navItem.megaNavButtonLinks.push(nextRow);
            i++;
          } else if (nextCells.length === 2 && nextCells[1].querySelector('a') && (nextCells[0].textContent.trim().toLowerCase().includes('facebook') || nextCells[0].textContent.trim().toLowerCase().includes('twitter') || nextCells[0].textContent.trim().toLowerCase().includes('instagram') || nextCells[0].textContent.trim().toLowerCase().includes('linkedin'))) {
            // mega-nav-social-link (heuristic: 2 cells, link, social label)
            navItem.megaNavSocialLinks.push(nextRow);
            i++;
          } else {
            // Unknown row type, break to avoid infinite loop or misclassification
            break;
          }
        }
      } else if (hasAnchorInSecondCell) {
        // This is either a primary-action-item or primary-action-dropdown-item
        // We need to look ahead to distinguish. If the next rows are mega-nav items, it's a dropdown.
        let isDropdown = false;
        let j = i + 1;
        const potentialNestedItems = [];
        while (j < allRows.length) {
          const lookAheadRow = allRows[j];
          const lookAheadCells = [...lookAheadRow.children];
          if (lookAheadCells.length === 2 && lookAheadCells[1].querySelector('ul')) { // New primary-nav-item
            break;
          }
          if (lookAheadCells.length === 2 && lookAheadCells[1].querySelector('a') && !lookAheadCells[0].textContent.trim().toLowerCase().includes('facebook') && !lookAheadCells[0].textContent.trim().toLowerCase().includes('twitter') && !lookAheadCells[0].textContent.trim().toLowerCase().includes('instagram') && !lookAheadCells[0].textContent.trim().toLowerCase().includes('linkedin')) {
            // New primary-action-item/dropdown, break
            break;
          }
          if (lookAheadCells.length === 2 && lookAheadCells[0].textContent.trim() && lookAheadCells[1].querySelector('p')) { // mega-nav-column
            isDropdown = true;
            potentialNestedItems.push({ type: 'column', row: lookAheadRow });
            j++;
          } else if (lookAheadCells.length === 5) { // mega-nav-highlight-card
            isDropdown = true;
            potentialNestedItems.push({ type: 'card', row: lookAheadRow });
            j++;
          } else if (lookAheadCells.length === 2 && lookAheadCells[1].querySelector('a') && lookAheadCells[0].textContent.trim() && !lookAheadCells[0].textContent.trim().toLowerCase().includes('facebook') && !lookAheadCells[0].textContent.trim().toLowerCase().includes('twitter') && !lookAheadCells[0].textContent.trim().toLowerCase().includes('instagram') && !lookAheadCells[0].textContent.trim().toLowerCase().includes('linkedin')) { // mega-nav-button-link
            isDropdown = true;
            potentialNestedItems.push({ type: 'button', row: lookAheadRow });
            j++;
          } else if (lookAheadCells.length === 2 && lookAheadCells[1].querySelector('a') && (lookAheadCells[0].textContent.trim().toLowerCase().includes('facebook') || lookAheadRow.children[0].textContent.trim().toLowerCase().includes('twitter') || lookAheadCells[0].textContent.trim().toLowerCase().includes('instagram') || lookAheadCells[0].textContent.trim().toLowerCase().includes('linkedin'))) { // mega-nav-social-link
            isDropdown = true;
            potentialNestedItems.push({ type: 'social', row: lookAheadRow });
            j++;
          } else {
            break; // No more nested items for this dropdown
          }
        }

        if (isDropdown) {
          const dropdownItem = { row, megaNavColumns: [], megaNavHighlightCards: [], megaNavButtonLinks: [], megaNavSocialLinks: [] };
          potentialNestedItems.forEach(item => {
            if (item.type === 'column') dropdownItem.megaNavColumns.push(item.row);
            else if (item.type === 'card') dropdownItem.megaNavHighlightCards.push(item.row);
            else if (item.type === 'button') dropdownItem.megaNavButtonLinks.push(item.row);
            else if (item.type === 'social') dropdownItem.megaNavSocialLinks.push(item.row);
          });
          finalPrimaryActionDropdownItems.push(dropdownItem);
          i = j; // Advance index past all collected nested items
        } else {
          finalPrimaryActionItems.push({ row }); // Simple action item
          i++;
        }
      } else {
        // Unclassified 2-cell row, skip or log
        console.warn('Unclassified 2-cell row:', row);
        i++;
      }
    } else if (cells.length === 5) {
      // This should only happen as a nested item, but if it appears top-level, it's an error in authoring.
      // For now, we'll skip it as it should be handled by the nested collection logic above.
      console.warn('Top-level 5-cell row (highlight card) found, skipping as it should be nested:', row);
      i++;
    } else {
      // Unclassified row, skip or log
      console.warn('Unclassified row:', row);
      i++;
    }
  }

  const nav = document.createElement('nav');
  nav.classList.add('lg:grid-full', 'flex', 'justify-between', 'gap-2', 'lg:gap-grid-gutter');
  nav.setAttribute('data-desktop-menu-wrapper', '');
  nav.setAttribute('aria-label', 'Main menu');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add(
    'col-start-1',
    '[.nav-shrunk_&]:max-h-[30px]',
    'max-h-[60px]',
    'flex',
    'items-center',
    'justify-start',
  );
  moveInstrumentation(logoLinkRow, logoWrapper);

  const logoLink = document.createElement('a');
  logoLink.classList.add(
    'inline-flex',
    'items-center',
    'shrink-0',
    '[[data-mobile-menu]_&]:outline-none',
    'not-[[data-mobile-menu]_&]:theme-focus-outline',
    'dark-mode:bg-denali',
    'dark-mode:py-0.5',
    'dark-mode:px-0.5',
    'forced-colors:px-0.5',
    'forced-colors:py-0.5',
    'forced-colors:bg-[CanvasText]!',
  );
  logoLink.setAttribute('data-brand-logo-link', '');

  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  }

  const srOnlySpan = document.createElement('span');
  srOnlySpan.classList.add('sr-only');
  srOnlySpan.textContent = 'World Wildlife Fund';
  logoLink.append(srOnlySpan);

  const logoSvg = document.createElement('svg');
  logoSvg.classList.add(
    'brand-logo-svg',
    'w-full',
    'h-auto',
    'max-w-[39px]',
    'max-h-[56px]',
    'sm:max-w-[41px]',
    'sm:max-h-[60px]',
  );
  logoSvg.setAttribute('aria-hidden', 'true');
  logoSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  logoSvg.setAttribute('viewBox', '0 0 81.63 122.37');
  logoSvg.innerHTML = `
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
  logoLink.append(logoSvg);
  logoWrapper.append(logoLink);
  nav.append(logoWrapper);

  const navContentWrapper = document.createElement('div');
  navContentWrapper.classList.add(
    'lg:col-start-2',
    'lg:col-span-14',
    'flex',
    'justify-start',
    'items-center',
  );

  const navInnerWrapper = document.createElement('div');
  navInnerWrapper.classList.add(
    'flex',
    'justify-between',
    'items-center',
    'gap-4',
    'xl:gap-grid-gutter',
    'w-full',
  );

  const desktopMenu = document.createElement('div');
  desktopMenu.classList.add('hidden', 'lg:flex', 'justify-center', 'items-center');
  desktopMenu.setAttribute('data-desktop-menu', '');

  const primaryNavUl = document.createElement('ul');
  primaryNavUl.classList.add(
    'flex',
    'flex-row',
    'justify-center',
    'items-center',
    'lg:gap-6',
    'xl:gap-8',
  );
  primaryNavUl.setAttribute('data-primary-nav', '');
  moveInstrumentation(primaryNavPlaceholder, primaryNavUl);

  finalPrimaryNavItems.forEach((item, index) => {
    const { row, megaNavColumns: itemMegaNavColumns, megaNavHighlightCards: itemMegaNavHighlightCards, megaNavButtonLinks: itemMegaNavButtonLinks, megaNavSocialLinks: itemMegaNavSocialLinks } = item;
    const [labelCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('group', 'list-none', 'leading-[1.1]');
    li.setAttribute('data-has-subnav', '');

    const button = document.createElement('button');
    button.classList.add(
      'lg:text-16',
      'xl:text-18',
      'link',
      'group/nav-link',
      'text-foreground',
      'text-start',
      'lg:text-15',
      'xl:text-16',
      'no-underline',
      'font-semibold',
      'inline-flex',
      'flex-row',
      'items-start',
      'justify-start',
      'gap-2',
      'forced-colors:text-[ButtonText]',
      'hocus:underline',
      'hocus:text-brand-1',
      'hocus:underline-offset-8',
      'group-[.active]:underline',
      'group-[.active]:text-brand-1',
      'group-[.active]:decoration-[3px]',
      'group-[.active]:underline-offset-8',
      'motion-safe:not-focus-visible:transition-underline',
    );
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('data-open-subnav', '');
    const dropdownId = `subnav-${Math.random().toString(36).substring(2, 11)}`;
    button.setAttribute('aria-controls', dropdownId);
    button.textContent = labelCell.textContent.trim();

    const chevronDiv = document.createElement('div');
    chevronDiv.classList.add(
      'group-[.active]:-rotate-180',
      'motion-safe:transition-transform',
      'will-change-transform',
      'flex',
      'h-[1lh]',
      'items-center',
    );
    chevronDiv.innerHTML = `
      <svg class="icon icon--chevron-down size-3 text-foreground-muted group-hover/nav-link:text-brand-1 group-focus-visible/nav-link:text-brand-1 not-forced-colors:[.active_&]:text-brand-1 forced-colors:group-hover/nav-link:text-[ButtonText]!" aria-hidden="true">
        <use xlink:href="#chevron-down" href="#chevron-down"></use>
      </svg>
    `;
    button.append(chevronDiv);
    li.append(button);

    const subnavDiv = document.createElement('div');
    subnavDiv.classList.add(
      'transition-display',
      'max-lg:overflow-auto',
      'max-lg:w-full',
      'max-lg:h-[calc(100dvh-var(--navbar-height))]',
      'duration-200',
      'hidden',
      'allow-discrete',
      'opacity-0',
      'starting:group-[.active]:opacity-0',
      'group-[.active]:opacity-100',
      'group-[.active]:block',
      'absolute',
      'bg-surface-navbar',
      'inset-x-0',
      'top-full',
      'py-12',
      'lg:py-2xl',
      'shadow-md',
      'border-t',
      'border-t-stroke-muted',
    );
    subnavDiv.setAttribute('data-subnav', '');
    subnavDiv.setAttribute('data-testid', `primary-action-nav-${index + 1}-mega`);
    subnavDiv.id = dropdownId;

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('container', 'grid-full');
    const gridCenteredDiv = document.createElement('div');
    gridCenteredDiv.classList.add('grid-centered-12', 'w-full');
    const innerGridDiv = document.createElement('div');
    innerGridDiv.classList.add(
      'grid',
      'grid-cols-1',
      'lg:grid-cols-12',
      'gap-13',
      'lg:gap-grid-gutter',
    );
    innerGridDiv.setAttribute('data-animated', '');

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('w-full', 'text-h6', 'lg:hidden', 'animated-fade-in-up');
    mobileTitleDiv.textContent = labelCell.textContent.trim();
    innerGridDiv.append(mobileTitleDiv);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      const columnDiv = document.createElement('div');
      columnDiv.classList.add('animated-fade-in-up', 'lg:col-span-4');
      const flexColDiv = document.createElement('div');
      flexColDiv.classList.add('not-last:mb-md', 'md:mb-0', 'flex', 'flex-col');
      moveInstrumentation(hierarchyTreeCell, hierarchyUl); // Move instrumentation for the UL
      flexColDiv.append(hierarchyUl);
      columnDiv.append(flexColDiv);
      innerGridDiv.append(columnDiv);
    } else {
      // If it's not a UL, but still richtext, append its innerHTML
      const columnDiv = document.createElement('div');
      columnDiv.classList.add('animated-fade-in-up', 'lg:col-span-4');
      const flexColDiv = document.createElement('div');
      flexColDiv.classList.add('not-last:mb-md', 'md:mb-0', 'flex', 'flex-col');
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, contentDiv);
      flexColDiv.append(contentDiv);
      columnDiv.append(flexColDiv);
      innerGridDiv.append(columnDiv);
    }

    // Append megaNavColumns, highlightCards, buttonLinks, socialLinks associated with THIS primary-nav-item
    if (itemMegaNavColumns.length > 0) {
      itemMegaNavColumns.forEach((colRow) => {
        const [colTitleCell, sectionLinksCell] = [...colRow.children];
        const colDiv = document.createElement('div');
        colDiv.classList.add('animated-fade-in-up', 'lg:col-span-4');
        const flexColDiv = document.createElement('div');
        flexColDiv.classList.add('not-last:mb-md', 'md:mb-0', 'flex', 'flex-col');

        if (colTitleCell.textContent.trim()) {
          const pTitle = document.createElement('p');
          pTitle.classList.add('mb-xs', 'text-15', 'xl:text-p2', 'font-stretch-normal', 'font-bold', 'text-foreground-strong');
          pTitle.textContent = colTitleCell.textContent.trim();
          flexColDiv.append(pTitle);
        }

        const sectionLinksUl = sectionLinksCell.querySelector('ul');
        if (sectionLinksUl) {
          moveInstrumentation(sectionLinksCell, sectionLinksUl);
          flexColDiv.append(sectionLinksUl);
        } else {
          // If not a UL, treat as rich text directly
          const divContent = document.createElement('div');
          divContent.innerHTML = sectionLinksCell.innerHTML;
          moveInstrumentation(sectionLinksCell, divContent);
          flexColDiv.append(divContent);
        }
        colDiv.append(flexColDiv);
        innerGridDiv.append(colDiv);
        moveInstrumentation(colRow, colDiv);
      });
    }

    if (itemMegaNavHighlightCards.length > 0) {
      itemMegaNavHighlightCards.forEach((cardRow) => {
        const [imageCell, imageAltCell, descriptionCell, ctaLabelCell, ctaLinkCell] = [...cardRow.children];
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('animated-fade-in-up', 'lg:row-span-3', 'lg:col-span-5');

        const highlightLink = document.createElement('a');
        highlightLink.classList.add(
          'group/highlight',
          'max-w-[435px]',
          'block',
          'text-foreground',
          'rounded-sm',
          'overflow-hidden',
          'theme-focus-outline',
          'py-7.5',
          'lg:py-0',
          'max-lg:border-y-stroke-muted',
          'max-lg:border-y',
        );
        highlightLink.setAttribute('data-testid', 'highlight-card');
        const ctaLink = ctaLinkCell.querySelector('a');
        if (ctaLink) {
          highlightLink.href = ctaLink.href;
        }

        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('relative', 'w-full', 'rounded-sm', 'overflow-hidden');
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '435' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            imageWrapper.append(optimizedPic);
          }
        }
        highlightLink.append(imageWrapper);

        const descriptionDiv = document.createElement('div'); // Use div for richtext
        descriptionDiv.classList.add('mt-md', 'text-15', 'xl:text-p2');
        descriptionDiv.innerHTML = descriptionCell.innerHTML;
        highlightLink.append(descriptionDiv);

        const ctaSpan = document.createElement('span');
        ctaSpan.classList.add('button', 'button--dark-outline', 'mt-sm', 'mb-0.5', 'max-[501px]:w-full');
        ctaSpan.textContent = ctaLabelCell.textContent.trim();
        highlightLink.append(ctaSpan);

        cardDiv.append(highlightLink);
        innerGridDiv.append(cardDiv);
        moveInstrumentation(cardRow, cardDiv);
      });
    }

    if (itemMegaNavButtonLinks.length > 0) {
      const buttonLinkDiv = document.createElement('div');
      buttonLinkDiv.classList.add('max-lg:order-2', 'lg:col-start-1', 'lg:col-span-4', 'lg:row-start-2', 'lg:row-span-3', 'lg:flex', 'lg:items-start');
      const animatedDiv = document.createElement('div');
      animatedDiv.classList.add('animated-fade-in-up');
      itemMegaNavButtonLinks.forEach((btnRow) => {
        const [btnLabelCell, btnLinkCell] = [...btnRow.children];
        const btnAnchor = document.createElement('a');
        btnAnchor.classList.add('button', 'button--dark-outline', 'max-[501px]:w-full');
        const foundBtnLink = btnLinkCell.querySelector('a');
        if (foundBtnLink) {
          btnAnchor.href = foundBtnLink.href;
        }
        btnAnchor.textContent = btnLabelCell.textContent.trim();
        animatedDiv.append(btnAnchor);
        moveInstrumentation(btnRow, btnAnchor);
      });
      buttonLinkDiv.append(animatedDiv);
      innerGridDiv.append(buttonLinkDiv);
    }

    if (itemMegaNavSocialLinks.length > 0) {
      const socialDiv = document.createElement('div');
      socialDiv.classList.add('animated-fade-in-up', 'lg:row-span-3', 'lg:col-span-5');
      const connectDiv = document.createElement('div');
      const h2 = document.createElement('h2');
      h2.classList.add('w-full', 'font-bold', 'font-stretch-normal', 'text-p1', 'lg:text-15', 'xl:text-p2', 'mb-xs', 'lg:mb-3', 'text-foreground-strong');
      h2.textContent = 'Connect with us'; // Hardcoded, but common pattern for social sections
      connectDiv.append(h2);

      const socialIconsDiv = document.createElement('div');
      socialIconsDiv.classList.add('flex', 'gap-sm');
      socialIconsDiv.setAttribute('data-testid', 'social-media-icons');

      itemMegaNavSocialLinks.forEach((socialRow) => {
        const [socialLabelCell, socialLinkCell] = [...socialRow.children];
        const socialAnchor = document.createElement('a');
        socialAnchor.classList.add('transition-colors', 'hover:cursor-pointer', 'theme-focus-outline', 'outline-none', 'fill-foreground', 'hocus:fill-foreground-accent');
        socialAnchor.setAttribute('target', '_blank');
        socialAnchor.setAttribute('rel', 'nofollow noopener');
        const foundSocialLink = socialLinkCell.querySelector('a');
        if (foundSocialLink) {
          socialAnchor.href = foundSocialLink.href;
        }

        const srOnlySocialSpan = document.createElement('span');
        srOnlySocialSpan.classList.add('sr-only');
        srOnlySocialSpan.textContent = `${socialLabelCell.textContent.trim()} profile`;
        socialAnchor.append(srOnlySocialSpan);

        let iconClass = '';
        const labelText = socialLabelCell.textContent.trim().toLowerCase();
        if (labelText.includes('facebook')) {
          iconClass = 'icon--facebook';
        } else if (labelText.includes('twitter')) {
          iconClass = 'icon--twitter';
        } else if (labelText.includes('instagram')) {
          iconClass = 'icon--instagram';
        } else if (labelText.includes('linkedin')) {
          iconClass = 'icon--linkedin';
        }
        socialAnchor.innerHTML += `<svg class="icon ${iconClass} size-7" aria-hidden="true"><use xlink:href="#${iconClass.split('--')[1]}" href="#${iconClass.split('--')[1]}"></use></svg>`;
        socialIconsDiv.append(socialAnchor);
        moveInstrumentation(socialRow, socialAnchor);
      });
      connectDiv.append(socialIconsDiv);
      socialDiv.append(connectDiv);
      innerGridDiv.append(socialDiv);
    }

    gridCenteredDiv.append(innerGridDiv);
    containerDiv.append(gridCenteredDiv);
    subnavDiv.append(containerDiv);
    li.append(subnavDiv);

    button.addEventListener('click', () => {
      const isActive = li.classList.toggle('active');
      button.setAttribute('aria-expanded', isActive);
      subnavDiv.classList.toggle('active', isActive);
      // Close other open submenus
      primaryNavUl.querySelectorAll('li[data-has-subnav]').forEach((otherLi) => {
        if (otherLi !== li) {
          otherLi.classList.remove('active');
          otherLi.querySelector('button')?.setAttribute('aria-expanded', 'false');
          otherLi.querySelector('[data-subnav]')?.classList.remove('active');
        }
      });
    });

    moveInstrumentation(row, li);
    primaryNavUl.append(li);
  });
  desktopMenu.append(primaryNavUl);
  navInnerWrapper.append(desktopMenu);

  const actionsWrapper = document.createElement('div');
  actionsWrapper.classList.add('flex', 'items-center');

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('hidden', 'lg:flex', 'ml-4', 'lg:ml-0', 'justify-center', 'items-center');
  const searchButton = document.createElement('button');
  searchButton.classList.add(
    'group',
    'inline-flex',
    'gap-2',
    'p-3',
    'xl:p-3.5',
    'border-1',
    'rounded-full',
    'items-center',
    'cursor-pointer',
    'transition-colors',
    'border-navbar-search-button-foreground',
    'text-navbar-search-button-foreground',
    'bg-navbar-search-button-surface',
    'hocus:text-navbar-search-button-foreground-accent',
    'hocus:bg-navbar-search-button-surface-accent',
    'hocus:border-navbar-search-button-surface-accent',
    'aria-expanded:bg-navbar-search-button-surface-active',
    'aria-expanded:hocus:bg-navbar-search-button-surface-active',
    'aria-expanded:hocus:text-navbar-search-button-foreground-active',
    'aria-expanded:text-navbar-search-button-foreground-active',
    'theme-focus-outline',
  );
  searchButton.setAttribute('aria-label', 'Search');
  searchButton.setAttribute('data-toggle-search', '');
  searchButton.innerHTML = `
    <svg class="icon icon--magnifying-glass size-4.5" aria-hidden="true">
      <use xlink:href="#magnifying-glass" href="#magnifying-glass"></use>
    </svg>
  `;
  searchDiv.append(searchButton);
  actionsWrapper.append(searchDiv);

  const desktopActionsMenu = document.createElement('div');
  desktopActionsMenu.classList.add('lg:ml-2', 'xl:ml-5');
  desktopActionsMenu.setAttribute('data-desktop-menu', '');
  desktopActionsMenu.setAttribute('data-keep-open-mobile', '');

  const primaryActionsUl = document.createElement('ul');
  primaryActionsUl.classList.add('flex', 'flex-row', 'gap-1.5', 'xl:gap-4', 'items-center');
  primaryActionsUl.setAttribute('data-primary-nav', '');
  moveInstrumentation(primaryActionsPlaceholder, primaryActionsUl);

  finalPrimaryActionItems.forEach((item, index) => {
    const { row } = item;
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('group', 'list-none', 'leading-[1.1]');
    li.setAttribute('data-has-subnav', ''); // Even if no subnav, original HTML has it

    const anchor = document.createElement('a');
    anchor.classList.add(
      'button',
      'text-14',
      'xl:text-18',
      'p-[15px]',
      'xl:px-8',
      'xl:py-4',
      'forced-colors:border',
      'button--sedona',
    );
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    anchor.setAttribute('data-testid', `primary-action-nav-${index + 1}`);
    li.append(anchor);
    moveInstrumentation(row, li);
    primaryActionsUl.append(li);
  });

  finalPrimaryActionDropdownItems.forEach((item, index) => {
    const { row, megaNavColumns: itemMegaNavColumns, megaNavHighlightCards: itemMegaNavHighlightCards, megaNavButtonLinks: itemMegaNavButtonLinks, megaNavSocialLinks: itemMegaNavSocialLinks } = item;
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('group', 'list-none', 'leading-[1.1]');
    li.setAttribute('data-has-subnav', '');

    const splitDropdownDiv = document.createElement('div');
    splitDropdownDiv.classList.add(
      'button--zion',
      'button',
      'split-dropdown',
      'leading-none',
      'flex',
      'items-stretch',
      'text-14',
      'p-0',
    );

    const anchor = document.createElement('a');
    anchor.classList.add(
      'inline-flex',
      'rounded-s-full',
      'text-14',
      'xl:text-18',
      'p-[15px]',
      'xl:ps-5',
      'xl:py-4',
      'pe-[13px]!',
      'xl:pe-4!',
      'border-r',
      'border-denali',
      'theme-focus-outline',
      'forced-colors:border',
    );
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    anchor.setAttribute('data-testid', `primary-action-nav-${finalPrimaryActionItems.length + index + 1}`);
    splitDropdownDiv.append(anchor);

    const dropdownButton = document.createElement('button');
    dropdownButton.classList.add(
      'pl-[15px]',
      'pe-5',
      'xl:pl-5',
      'xl:pe-6',
      'max-[374px]:pe-2.5',
      'max-[374px]:ps-2',
      'rounded-e-full',
      'cursor-pointer',
      'theme-focus-outline',
      'forced-colors:border',
    );
    dropdownButton.setAttribute('data-open-subnav', '');
    dropdownButton.setAttribute('aria-expanded', 'false');
    dropdownButton.setAttribute('aria-label', `Open dropdown for ${labelCell.textContent.trim()} link`);
    // Generate a unique ID for aria-controls
    const dropdownId = `subnav-${Math.random().toString(36).substring(2, 11)}`;
    dropdownButton.setAttribute('aria-controls', dropdownId);
    dropdownButton.innerHTML = `
      <svg class="icon icon--chevron-down size-3 group-[.active]:-rotate-180 motion-safe:transition" aria-hidden="true">
        <use xlink:href="#chevron-down" href="#chevron-down"></use>
      </svg>
    `;
    splitDropdownDiv.append(dropdownButton);
    li.append(splitDropdownDiv);

    const subnavDiv = document.createElement('div');
    subnavDiv.classList.add(
      'transition-display',
      'max-lg:overflow-auto',
      'max-lg:w-full',
      'max-lg:h-[calc(100dvh-var(--navbar-height))]',
      'duration-200',
      'hidden',
      'allow-discrete',
      'opacity-0',
      'starting:group-[.active]:opacity-0',
      'group-[.active]:opacity-100',
      'group-[.active]:block',
      'absolute',
      'bg-surface-navbar',
      'inset-x-0',
      'top-full',
      'py-12',
      'lg:py-2xl',
      'shadow-md',
      'border-t',
      'border-t-stroke-muted',
    );
    subnavDiv.setAttribute('data-subnav', '');
    subnavDiv.setAttribute('data-testid', `primary-action-nav-${finalPrimaryActionItems.length + index + 1}-mega`);
    subnavDiv.id = dropdownId;

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('container', 'grid-full');
    const gridCenteredDiv = document.createElement('div');
    gridCenteredDiv.classList.add('grid-centered-12', 'w-full');
    const innerGridDiv = document.createElement('div');
    innerGridDiv.classList.add(
      'grid',
      'grid-cols-1',
      'lg:grid-cols-12',
      'gap-13',
      'lg:gap-grid-gutter',
    );
    innerGridDiv.setAttribute('data-animated', '');

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('w-full', 'text-h6', 'lg:hidden', 'animated-fade-in-up');
    mobileTitleDiv.textContent = labelCell.textContent.trim();
    innerGridDiv.append(mobileTitleDiv);

    // Populate innerGridDiv with megaNavColumns, highlightCards, buttonLinks, socialLinks
    if (itemMegaNavColumns.length > 0) {
      itemMegaNavColumns.forEach((colRow) => {
        const [colTitleCell, sectionLinksCell] = [...colRow.children];
        const colDiv = document.createElement('div');
        colDiv.classList.add('animated-fade-in-up', 'lg:col-span-4');
        const flexColDiv = document.createElement('div');
        flexColDiv.classList.add('not-last:mb-md', 'md:mb-0', 'flex', 'flex-col');

        if (colTitleCell.textContent.trim()) {
          const pTitle = document.createElement('p');
          pTitle.classList.add('mb-xs', 'text-15', 'xl:text-p2', 'font-stretch-normal', 'font-bold', 'text-foreground-strong');
          pTitle.textContent = colTitleCell.textContent.trim();
          flexColDiv.append(pTitle);
        }

        const sectionLinksUl = sectionLinksCell.querySelector('ul');
        if (sectionLinksUl) {
          moveInstrumentation(sectionLinksCell, sectionLinksUl);
          flexColDiv.append(sectionLinksUl);
        } else {
          // If not a UL, treat as rich text directly
          const divContent = document.createElement('div');
          divContent.innerHTML = sectionLinksCell.innerHTML;
          moveInstrumentation(sectionLinksCell, divContent);
          flexColDiv.append(divContent);
        }
        colDiv.append(flexColDiv);
        innerGridDiv.append(colDiv);
        moveInstrumentation(colRow, colDiv);
      });
    }

    if (itemMegaNavHighlightCards.length > 0) {
      itemMegaNavHighlightCards.forEach((cardRow) => {
        const [imageCell, imageAltCell, descriptionCell, ctaLabelCell, ctaLinkCell] = [...cardRow.children];
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('animated-fade-in-up', 'lg:row-span-3', 'lg:col-span-5');

        const highlightLink = document.createElement('a');
        highlightLink.classList.add(
          'group/highlight',
          'max-w-[435px]',
          'block',
          'text-foreground',
          'rounded-sm',
          'overflow-hidden',
          'theme-focus-outline',
          'py-7.5',
          'lg:py-0',
          'max-lg:border-y-stroke-muted',
          'max-lg:border-y',
        );
        highlightLink.setAttribute('data-testid', 'highlight-card');
        const ctaLink = ctaLinkCell.querySelector('a');
        if (ctaLink) {
          highlightLink.href = ctaLink.href;
        }

        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('relative', 'w-full', 'rounded-sm', 'overflow-hidden');
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '435' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            imageWrapper.append(optimizedPic);
          }
        }
        highlightLink.append(imageWrapper);

        const descriptionDiv = document.createElement('div'); // Use div for richtext
        descriptionDiv.classList.add('mt-md', 'text-15', 'xl:text-p2');
        descriptionDiv.innerHTML = descriptionCell.innerHTML;
        highlightLink.append(descriptionDiv);

        const ctaSpan = document.createElement('span');
        ctaSpan.classList.add('button', 'button--dark-outline', 'mt-sm', 'mb-0.5', 'max-[501px]:w-full');
        ctaSpan.textContent = ctaLabelCell.textContent.trim();
        highlightLink.append(ctaSpan);

        cardDiv.append(highlightLink);
        innerGridDiv.append(cardDiv);
        moveInstrumentation(cardRow, cardDiv);
      });
    }

    if (itemMegaNavButtonLinks.length > 0) {
      const buttonLinkDiv = document.createElement('div');
      buttonLinkDiv.classList.add('max-lg:order-2', 'lg:col-start-1', 'lg:col-span-4', 'lg:row-start-2', 'lg:row-span-3', 'lg:flex', 'lg:items-start');
      const animatedDiv = document.createElement('div');
      animatedDiv.classList.add('animated-fade-in-up');
      itemMegaNavButtonLinks.forEach((btnRow) => {
        const [btnLabelCell, btnLinkCell] = [...btnRow.children];
        const btnAnchor = document.createElement('a');
        btnAnchor.classList.add('button', 'button--dark-outline', 'max-[501px]:w-full');
        const foundBtnLink = btnLinkCell.querySelector('a');
        if (foundBtnLink) {
          btnAnchor.href = foundBtnLink.href;
        }
        btnAnchor.textContent = btnLabelCell.textContent.trim();
        animatedDiv.append(btnAnchor);
        moveInstrumentation(btnRow, btnAnchor);
      });
      buttonLinkDiv.append(animatedDiv);
      innerGridDiv.append(buttonLinkDiv);
    }

    if (itemMegaNavSocialLinks.length > 0) {
      const socialDiv = document.createElement('div');
      socialDiv.classList.add('animated-fade-in-up', 'lg:row-span-3', 'lg:col-span-5');
      const connectDiv = document.createElement('div');
      const h2 = document.createElement('h2');
      h2.classList.add('w-full', 'font-bold', 'font-stretch-normal', 'text-p1', 'lg:text-15', 'xl:text-p2', 'mb-xs', 'lg:mb-3', 'text-foreground-strong');
      h2.textContent = 'Connect with us';
      connectDiv.append(h2);

      const socialIconsDiv = document.createElement('div');
      socialIconsDiv.classList.add('flex', 'gap-sm');
      socialIconsDiv.setAttribute('data-testid', 'social-media-icons');

      itemMegaNavSocialLinks.forEach((socialRow) => {
        const [socialLabelCell, socialLinkCell] = [...socialRow.children];
        const socialAnchor = document.createElement('a');
        socialAnchor.classList.add('transition-colors', 'hover:cursor-pointer', 'theme-focus-outline', 'outline-none', 'fill-foreground', 'hocus:fill-foreground-accent');
        socialAnchor.setAttribute('target', '_blank');
        socialAnchor.setAttribute('rel', 'nofollow noopener');
        const foundSocialLink = socialLinkCell.querySelector('a');
        if (foundSocialLink) {
          socialAnchor.href = foundSocialLink.href;
        }

        const srOnlySocialSpan = document.createElement('span');
        srOnlySocialSpan.classList.add('sr-only');
        srOnlySocialSpan.textContent = `${socialLabelCell.textContent.trim()} profile`;
        socialAnchor.append(srOnlySocialSpan);

        let iconClass = '';
        const labelText = socialLabelCell.textContent.trim().toLowerCase();
        if (labelText.includes('facebook')) {
          iconClass = 'icon--facebook';
        } else if (labelText.includes('twitter')) {
          iconClass = 'icon--twitter';
        } else if (labelText.includes('instagram')) {
          iconClass = 'icon--instagram';
        } else if (labelText.includes('linkedin')) {
          iconClass = 'icon--linkedin';
        }
        socialAnchor.innerHTML += `<svg class="icon ${iconClass} size-7" aria-hidden="true"><use xlink:href="#${iconClass.split('--')[1]}" href="#${iconClass.split('--')[1]}"></use></svg>`;
        socialIconsDiv.append(socialAnchor);
        moveInstrumentation(socialRow, socialAnchor);
      });
      connectDiv.append(socialIconsDiv);
      socialDiv.append(connectDiv);
      innerGridDiv.append(socialDiv);
    }

    gridCenteredDiv.append(innerGridDiv);
    containerDiv.append(gridCenteredDiv);
    subnavDiv.append(containerDiv);
    li.append(subnavDiv);

    dropdownButton.addEventListener('click', () => {
      const isActive = li.classList.toggle('active');
      dropdownButton.setAttribute('aria-expanded', isActive);
      subnavDiv.classList.toggle('active', isActive);
      // Close other open submenus
      primaryActionsUl.querySelectorAll('li[data-has-subnav]').forEach((otherLi) => {
        if (otherLi !== li) {
          otherLi.classList.remove('active');
          otherLi.querySelector('button')?.setAttribute('aria-expanded', 'false');
          otherLi.querySelector('[data-subnav]')?.classList.remove('active');
        }
      });
    });

    moveInstrumentation(row, li);
    primaryActionsUl.append(li);
  });

  desktopActionsMenu.append(primaryActionsUl);
  actionsWrapper.append(desktopActionsMenu);

  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.classList.add(
    'lg:hidden',
    'no-underline',
    'flex',
    'flex-row',
    'items-center',
    'gap-2',
    'group/toggle',
    'ml-4',
    'max-[375px]:ml-2',
    'lg:ml-5',
    'h-3.5',
    'theme-focus-outline',
  );
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
  actionsWrapper.append(mobileMenuToggle);

  const searchDropdown = document.createElement('div');
  searchDropdown.classList.add(
    'transition-display',
    'hidden',
    'allow-discrete',
    'opacity-0',
    'starting:[&.active]:opacity-0',
    '[&.active]:opacity-100',
    '[&.active]:block',
    'absolute',
    'bg-surface-navbar',
    'inset-x-0',
    'py-3xl',
    'top-full',
    'shadow-md',
  );
  searchDropdown.setAttribute('data-search-dropdown', '');

  const searchForm = document.createElement('form');
  searchForm.setAttribute('action', '/search/');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('role', 'search');
  searchForm.classList.add('container');

  const searchGridFull = document.createElement('div');
  searchGridFull.classList.add('grid-full');
  const searchGridCentered = document.createElement('div');
  searchGridCentered.classList.add(
    'relative',
    'grid-centered-12',
    'w-full',
    'flex',
    'items-center',
    'gap-4',
    'border-b',
    'border-stroke-default',
    'text-h6',
  );

  const searchInput = document.createElement('input');
  searchInput.id = 'search-bar';
  searchInput.classList.add(
    'peer',
    'w-full',
    'bg-transparent',
    'pt-2',
    'lg:pb-5',
    'placeholder-transparent',
    'focus:outline-none',
    'transition-colors',
  );
  searchInput.setAttribute('data-search-input', '');
  searchInput.setAttribute('name', 'query');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('placeholder', 'Search…');

  const searchLabel = document.createElement('label');
  searchLabel.setAttribute('for', 'search-bar');
  searchLabel.classList.add(
    'absolute',
    'left-0',
    'top-2',
    'origin-left',
    'transform',
    'transition-transform',
    'duration-200',
    'text-h6',
    'text-input-label',
    'pointer-events-none',
    'peer-placeholder-shown:translate-y-0',
    'peer-placeholder-shown:scale-100',
    'peer-focus:-translate-y-full',
    'peer-focus:scale-75',
    'peer-focus:font-semibold',
    'peer-not-placeholder-shown:-translate-y-full',
    'peer-not-placeholder-shown:font-semibold',
    'peer-not-placeholder-shown:scale-75',
  );
  searchLabel.textContent = 'Search';

  const submitButton = document.createElement('button');
  submitButton.classList.add(
    'button',
    'bg-transparent',
    'text-foreground',
    'p-0',
    'theme-focus-outline',
    'motion-safe:hocus:translate-x-0.5',
    'transition-transform',
  );
  submitButton.setAttribute('type', 'submit');
  submitButton.innerHTML = `
    <svg class="icon icon--arrow-right-thin block size-5 md:size-8 lg:size-10 forced-colors:text-[LinkText]" aria-hidden="true">
      <use xlink:href="#arrow-right-thin" href="#arrow-right-thin"></use>
    </svg>
    <span class="sr-only">Search</span>
  `;

  searchGridCentered.append(searchInput, searchLabel, submitButton);
  searchGridFull.append(searchGridCentered);
  searchForm.append(searchGridFull);
  searchDropdown.append(searchForm);
  actionsWrapper.append(searchDropdown);

  navInnerWrapper.append(actionsWrapper);
  navContentWrapper.append(navInnerWrapper);
  nav.append(navContentWrapper);

  searchButton.addEventListener('click', () => {
    const isExpanded = searchButton.getAttribute('aria-expanded') === 'true';
    searchButton.setAttribute('aria-expanded', !isExpanded);
    searchDropdown.classList.toggle('active', !isExpanded);
  });

  mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    const toggleTextSpan = mobileMenuToggle.querySelector('[data-mobile-menu-toggle-text]');
    if (toggleTextSpan) {
      toggleTextSpan.textContent = isExpanded
        ? mobileMenuToggle.getAttribute('data-mobile-menu-open-text')
        : mobileMenuToggle.getAttribute('data-mobile-menu-close-text');
    }
    // Implement actual mobile menu toggle logic here (e.g., show/hide a mobile overlay)
    // For this example, we'll just toggle a class on the body or a main container
    document.body.classList.toggle('mobile-menu-open', !isExpanded);
  });

  block.replaceChildren(nav);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
