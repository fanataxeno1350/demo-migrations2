import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('paragraph', 'paragraph--type--counter-stats-cards', 'paragraph--view-mode--default');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Heading
  if (headingRow) {
    const headingWrapper = document.createElement('div');
    headingWrapper.classList.add('row', 'justify-content-center');
    const col = document.createElement('div');
    col.classList.add('col-md-10');
    const heading = document.createElement('h2');
    heading.classList.add('border-yellow');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    col.append(heading);
    headingWrapper.append(col);
    container.append(headingWrapper);
  }

  // Stats Cards
  if (itemRows.length > 0) {
    const cardsWrapperRow = document.createElement('div');
    cardsWrapperRow.classList.add('row', 'justify-content-center');
    const cardsCol = document.createElement('div');
    cardsCol.classList.add('col-md-10');
    const cardsInnerRow = document.createElement('div');
    cardsInnerRow.classList.add('row', 'm-0');

    itemRows.forEach((row, index) => {
      const [prefixCell, numberCell, suffixCell, descriptionCell] = [...row.children];

      const cardColumn = document.createElement('div');
      cardColumn.classList.add('col-xl', 'col-lg-6', 'stats-card-column');

      // Apply background classes based on index (matching original HTML pattern)
      if (index % 4 === 0) {
        cardColumn.classList.add('bg-secondary-d5-navy');
      } else if (index % 4 === 1) {
        cardColumn.classList.add('bg-secondary-d7-violet');
      } else if (index % 4 === 2) {
        cardColumn.classList.add('bg-primary-d2-blue');
      } else if (index % 4 === 3) {
        cardColumn.classList.add('bg-gradient');
      }

      const cardNumberStats = document.createElement('div');
      cardNumberStats.classList.add('card-number-stats');

      const numberStatsGroup = document.createElement('div');
      numberStatsGroup.classList.add('number-stats-group', 'text-primary-d1-yellow');

      const numberStats = document.createElement('div');
      numberStats.classList.add('number-stats');

      if (prefixCell?.textContent.trim()) {
        const prefixSpan = document.createElement('span');
        prefixSpan.textContent = prefixCell.textContent.trim();
        numberStats.append(prefixSpan);
      }

      const odometerSpan = document.createElement('span');
      odometerSpan.classList.add('odometer', 'odometer-theme-default');
      odometerSpan.textContent = numberCell?.textContent.trim() || '';
      numberStats.append(odometerSpan);
      numberStatsGroup.append(numberStats);

      if (suffixCell?.textContent.trim()) {
        const suffixP = document.createElement('p');
        suffixP.textContent = suffixCell.textContent.trim();
        numberStatsGroup.append(suffixP);
      }

      cardNumberStats.append(numberStatsGroup);

      const cardText = document.createElement('div');
      cardText.classList.add('card-text', 'text-white');
      if (descriptionCell?.textContent.trim()) {
        const descriptionP = document.createElement('p');
        descriptionP.textContent = descriptionCell.textContent.trim();
        cardText.append(descriptionP);
      }
      cardNumberStats.append(cardText);

      moveInstrumentation(row, cardColumn);
      cardColumn.append(cardNumberStats);
      cardsInnerRow.append(cardColumn);
    });

    cardsCol.append(cardsInnerRow);
    cardsWrapperRow.append(cardsCol);
    container.append(cardsWrapperRow);
  }

  block.replaceChildren(section);
}
