import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const appSection = document.createElement('div');
  appSection.classList.add('app-section');

  const container = document.createElement('div');
  container.classList.add('container');
  appSection.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  const colLeft = document.createElement('div');
  colLeft.classList.add('col-md-6');
  row.append(colLeft);

  // Headline
  const headlineRow = children[0];
  const headline = document.createElement('h3');
  headline.classList.add('hd2', 'os-animation', 'animated', 'fadeInUp');
  headline.setAttribute('data-os-animation', 'fadeInUp');
  headline.setAttribute('data-os-animation-delay', '.2s');
  moveInstrumentation(headlineRow, headline);
  // headlineRow is a row, its first child is the cell. The cell contains plain text.
  headline.textContent = headlineRow.children[0]?.textContent.trim() || '';
  colLeft.append(headline);

  // Application list
  const appList = document.createElement('ul');
  appList.classList.add('app-list');
  colLeft.append(appList);

  // Application items start from index 2
  const applicationItemRows = children.slice(2);
  applicationItemRows.forEach((rowEl) => {
    const li = document.createElement('li');
    li.classList.add('os-animation', 'animated', 'fadeInUp');
    li.setAttribute('data-os-animation', 'fadeInUp');
    li.setAttribute('data-os-animation-delay', '0.2s');

    const anchor = document.createElement('a');
    anchor.href = 'javascript:;';
    anchor.classList.add('nolink');
    moveInstrumentation(rowEl, anchor);
    // Each application item row has one cell: the label.
    anchor.textContent = rowEl.children[0]?.textContent.trim() || '';

    li.append(anchor);
    appList.append(li);
  });

  // Section Image
  const imageRow = children[1];
  const colRight = document.createElement('div');
  colRight.classList.add('col-md-6', 'hidden-sm', 'hidden-xs', 'os-animation', 'animated', 'fadeInUp');
  colRight.setAttribute('data-os-animation', 'fadeInUp');
  colRight.setAttribute('data-os-animation-delay', '.2s');

  // imageRow is a row, its first child is the cell containing the picture.
  const picture = imageRow.children[0]?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('img-responsive');
    moveInstrumentation(imageRow, optimizedPic.querySelector('img'));
    colRight.append(optimizedPic);
  }
  row.append(colRight);

  block.replaceChildren(appSection);
}
