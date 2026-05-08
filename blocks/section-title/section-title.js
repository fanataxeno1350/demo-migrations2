import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titlesRow] = [...block.children];

  const sectionTitleWrapper = document.createElement('div');
  sectionTitleWrapper.classList.add(
    'text',
    'text-align-center',
    'koi-theme',
    'pm-left-right',
    'aem-GridColumn--default--none',
    'aem-GridColumn--phone--none',
    'aem-GridColumn--phone--7',
    'aem-GridColumn',
    'aem-GridColumn--default--8',
    'aem-GridColumn--offset--phone--2',
    'aem-GridColumn--offset--default--2',
  );

  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text');

  if (titlesRow) {
    // CHECK 0: Replaced direct bracket access with array destructuring for fixed schema
    const [titlesCell] = [...titlesRow.children];
    if (titlesCell) {
      // CHECK 3: moveInstrumentation called for the row
      moveInstrumentation(titlesRow, cmpText);
      // CHECK 1.5: richtext field uses innerHTML
      cmpText.innerHTML = titlesCell.innerHTML;
    }
  }

  sectionTitleWrapper.append(cmpText);
  // CHECK 0.5: block.classList.add('section-title') removed from inner wrapper
  block.replaceChildren(sectionTitleWrapper);
}

