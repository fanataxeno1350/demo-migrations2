import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, ...statsCardRows] = [...block.children];

  const section = document.createElement('section');
  // Removed 'paragraph--type--counter-stats-cards' as the outer block div already has it.
  // The outer block div already carries the block's own class from AEM.
  section.classList.add('paragraph', 'paragraph--view-mode--default');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  // Headline
  const headlineWrapper = document.createElement('div');
  headlineWrapper.classList.add('row', 'justify-content-center');
  const headlineCol = document.createElement('div');
  headlineCol.classList.add('col-md-10');
  const headline = document.createElement('h2');
  headline.classList.add('border-yellow');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  headlineCol.append(headline);
  headlineWrapper.append(headlineCol);
  container.append(headlineWrapper);

  // Stats Cards
  if (statsCardRows.length > 0) {
    const cardsRowWrapper = document.createElement('div');
    cardsRowWrapper.classList.add('row', 'justify-content-center');
    const cardsCol = document.createElement('div');
    cardsCol.classList.add('col-md-10');
    const cardsInnerRow = document.createElement('div');
    cardsInnerRow.classList.add('row', 'm-0');

    statsCardRows.forEach((row, index) => {
      const [prefixCell, numberCell, numberSuffixCell, descriptionCell] = [...row.children];

      const cardColumn = document.createElement('div');
      cardColumn.classList.add('col-xl', 'col-lg-6', 'stats-card-column');

      // Assign background colors based on index, matching original HTML pattern
      const bgClasses = [
        'bg-secondary-d5-navy',
        'bg-secondary-d7-violet',
        'bg-primary-d2-blue',
        'bg-gradient',
      ];
      cardColumn.classList.add(bgClasses[index % bgClasses.length]);

      const cardNumberStats = document.createElement('div');
      cardNumberStats.classList.add('card-number-stats');

      const numberStatsGroup = document.createElement('div');
      numberStatsGroup.classList.add('number-stats-group', 'text-primary-d1-yellow');

      const numberStats = document.createElement('div');
      numberStats.classList.add('number-stats');

      const prefixSpan = document.createElement('span');
      prefixSpan.textContent = prefixCell.textContent.trim();
      if (prefixSpan.textContent) {
        numberStats.append(prefixSpan);
      }

      const odometerSpan = document.createElement('span');
      odometerSpan.classList.add('odometer', 'odometer-theme-default');
      // The odometer library is not loaded by EDS, so we just display the number
      odometerSpan.textContent = numberCell.textContent.trim();
      numberStats.append(odometerSpan);

      numberStatsGroup.append(numberStats);

      const suffixP = document.createElement('p');
      suffixP.textContent = numberSuffixCell.textContent.trim();
      if (suffixP.textContent) {
        numberStatsGroup.append(suffixP);
      }

      cardNumberStats.append(numberStatsGroup);

      const cardText = document.createElement('div');
      cardText.classList.add('card-text', 'text-white');
      const descriptionP = document.createElement('p');
      descriptionP.textContent = descriptionCell.textContent.trim();
      cardText.append(descriptionP);
      cardNumberStats.append(cardText);

      moveInstrumentation(row, cardNumberStats); // Ensure instrumentation is moved for each item row
      cardColumn.append(cardNumberStats);
      cardsInnerRow.append(cardColumn);
    });

    cardsCol.append(cardsInnerRow);
    cardsRowWrapper.append(cardsCol);
    container.append(cardsRowWrapper);
  }

  block.replaceChildren(section);
}
