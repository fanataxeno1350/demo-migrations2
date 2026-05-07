import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('steel-stories');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  // Left column: Title and Image
  const leftCol = document.createElement('div');
  leftCol.classList.add('col-sm-6', 'os-animation', 'animated', 'fadeInLeft');
  leftCol.setAttribute('data-os-animation', 'fadeInLeft');
  leftCol.setAttribute('data-os-animation-delay', '.2s');
  row.append(leftCol);

  const storiesSteelBox = document.createElement('div');
  storiesSteelBox.classList.add('stories-steel-box');
  leftCol.append(storiesSteelBox);

  // The title is the first row, and it's a text type, so its content is in the first child div.
  const titleRow = children[0];
  const title = document.createElement('h2');
  if (titleRow) {
    moveInstrumentation(titleRow, title);
    // Access the content of the first cell (div) within the titleRow
    title.textContent = titleRow.children[0]?.textContent.trim() || '';
  }
  storiesSteelBox.append(title);

  // The image is the second row.
  const imageRow = children[1];
  const figure = document.createElement('figure');
  figure.classList.add('MT30');
  if (imageRow) {
    // The picture element is in the first cell of the imageRow
    const picture = imageRow.children[0]?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        figure.append(optimizedPic);
      }
    }
    moveInstrumentation(imageRow, figure);
  }
  storiesSteelBox.append(figure);

  // Right column: Features list
  const rightCol = document.createElement('div');
  rightCol.classList.add('col-sm-6', 'os-animation', 'ohidden', 'animated', 'fadeInRight');
  rightCol.setAttribute('data-os-animation', 'fadeInRight');
  rightCol.setAttribute('data-os-animation-delay', '.1s');
  row.append(rightCol);

  const storyList = document.createElement('ul');
  storyList.classList.add('story-list', 'op1');
  rightCol.append(storyList);

  // Feature rows start from the third child (index 2)
  const featureRows = children.slice(2);

  featureRows.forEach((featureRow, index) => {
    const li = document.createElement('li');
    li.classList.add('os-animation', 'animated', 'fadeInLeft');
    const delay = 0.2 + index * 0.2;
    li.setAttribute('data-os-animation', 'fadeInLeft');
    li.setAttribute('data-os-animation-delay', `${delay.toFixed(1)}s`);

    const p = document.createElement('p');
    moveInstrumentation(featureRow, p);
    // Access the content of the first cell (div) within the featureRow
    p.textContent = featureRow.children[0]?.textContent.trim() || '';
    li.append(p);
    storyList.append(li);
  });

  block.replaceChildren(section);
}
