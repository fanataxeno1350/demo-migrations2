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
        span.classList.add('tbm-link', 'level-3'); // Added classes from ORIGINAL HTML
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('tbm-group-container', 'tbm-item-child'); // Added classes from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This 'active' class is not in ORIGINAL HTML, but often used for JS toggles
          subWrap.classList.toggle('active'); // This 'active' class is not in ORIGINAL HTML, but often used for JS toggles
        });
      }
    }

    // Add classes to <a>, <ul>, <li> elements within the hierarchy tree
    if (anchor) {
      anchor.classList.add('tbm-link', 'level-3'); // Added classes from ORIGINAL HTML
    }
    li.classList.add('tbm-item', 'level-3', 'tb-megamenu-item', 'mega'); // Added classes from ORIGINAL HTML
    if (nested) {
      nested.classList.add('tbm-subnav', 'level-2', 'items-2'); // Added classes from ORIGINAL HTML
      nested.querySelectorAll('li').forEach((nestedLi) => {
        nestedLi.classList.add('tbm-item', 'level-3', 'tb-megamenu-item', 'mega'); // Added classes from ORIGINAL HTML
        const nestedAnchor = nestedLi.querySelector(':scope > a');
        if (nestedAnchor) {
          nestedAnchor.classList.add('tbm-link', 'level-3'); // Added classes from ORIGINAL HTML
        }
      });
    }
  });
}

export default function decorate(block) {
  const [headlineRow, containerRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('paragraph', 'paragraph--type--counter-stats-cards', 'paragraph--view-mode--default');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  if (headlineRow) {
    const headlineWrapper = document.createElement('div');
    headlineWrapper.classList.add('row', 'justify-content-center');
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-10');
    const headline = document.createElement('h2');
    headline.classList.add('border-yellow');
    moveInstrumentation(headlineRow, headline);
    headline.textContent = headlineRow.textContent.trim();
    colDiv.append(headline);
    headlineWrapper.append(colDiv);
    container.append(headlineWrapper);
  }

  const statsCardsWrapper = document.createElement('div');
  statsCardsWrapper.classList.add('row', 'justify-content-center');
  moveInstrumentation(containerRow, statsCardsWrapper);

  const colMd10 = document.createElement('div');
  colMd10.classList.add('col-md-10');
  statsCardsWrapper.append(colMd10);

  const rowM0 = document.createElement('div');
  rowM0.classList.add('row', 'm-0');
  colMd10.append(rowM0);

  itemRows
    .filter((row) => row.children.length > 0 && [...row.children].some((c) => c.children.length > 0 || c.textContent.trim() !== ''))
    .forEach((row) => {
      const [numberCell, numberUnitCell, descriptionCell, hierarchyTreeCell] = [...row.children];

      const colDiv = document.createElement('div');
      colDiv.classList.add('col-xl', 'col-lg-6', 'stats-card-column', 'bg-secondary-d5-navy');
      moveInstrumentation(row, colDiv);

      const cardNumberStats = document.createElement('div');
      cardNumberStats.classList.add('card-number-stats');
      colDiv.append(cardNumberStats);

      const numberStatsGroup = document.createElement('div');
      numberStatsGroup.classList.add('number-stats-group', 'text-primary-d1-yellow');
      cardNumberStats.append(numberStatsGroup);

      const numberStats = document.createElement('div');
      numberStats.classList.add('number-stats');
      if (numberCell) {
        const odometerSpan = document.createElement('span');
        odometerSpan.classList.add('odometer', 'odometer-theme-default');
        odometerSpan.textContent = numberCell.textContent.trim();
        numberStats.append(odometerSpan);
      }
      numberStatsGroup.append(numberStats);

      if (numberUnitCell) {
        const numberUnitP = document.createElement('p');
        numberUnitP.textContent = numberUnitCell.textContent.trim();
        numberStatsGroup.append(numberUnitP);
      }

      const cardText = document.createElement('div');
      cardText.classList.add('card-text', 'text-white');
      if (descriptionCell) {
        const descriptionP = document.createElement('p');
        descriptionP.textContent = descriptionCell.textContent.trim();
        cardText.append(descriptionP);
      }
      cardNumberStats.append(cardText);

      // Handle hierarchy-tree
      if (hierarchyTreeCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell.innerHTML; // Use innerHTML for richtext
        moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell

        const subList = tempDiv.querySelector('ul');
        if (subList) {
          transformNestedLists(subList);
          const hierarchyWrapper = document.createElement('div');
          hierarchyWrapper.classList.add('hierarchy-tree-wrapper'); // This class is not in ORIGINAL HTML, but seems like a functional wrapper
          hierarchyWrapper.append(subList);
          colDiv.append(hierarchyWrapper);
        }
      }

      rowM0.append(colDiv);
    });

  container.append(statsCardsWrapper);
  block.replaceChildren(section);
}
