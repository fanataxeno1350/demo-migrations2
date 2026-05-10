import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const root = document.createElement('section');
  root.classList.add('component-three-column-tile', 'pad-top-lg');

  const containerXl = document.createElement('div');
  containerXl.classList.add('container-xl');
  root.append(containerXl);

  const container = document.createElement('div');
  container.classList.add('container');
  containerXl.append(container);

  // Headline
  // The model defines: headline, tiles (container), ctaLink, ctaLabel
  // So the first row is headline, then item rows, then ctaLink, then ctaLabel.
  // The original JS had a `containerPlaceholder` which is not in the model.
  // Let's re-evaluate the children based on the model.
  // The first row is the headline.
  const headlineRow = children[0];
  const headline = document.createElement('h3');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  container.append(headline); // Append to 'container' as per original HTML structure

  const separator = document.createElement('div');
  separator.classList.add('separator');
  container.append(separator); // Append to 'container' as per original HTML structure

  // The item rows (tiles) start from the second row (index 1) up to the last two rows (ctaLink, ctaLabel)
  // The model has: headline (1st row), tiles (N rows), ctaLink (last-1 row), ctaLabel (last row)
  const tileItemRows = children.slice(1, children.length - 2);
  const ctaLinkRow = children[children.length - 2];
  const ctaLabelRow = children[children.length - 1];

  const tileContainerWrapper = document.createElement('div');
  tileContainerWrapper.classList.add('tile-container'); // This is the wrapper for the tiles
  container.append(tileContainerWrapper);

  const row = document.createElement('div');
  row.classList.add('row', 'tile-slider');
  tileContainerWrapper.append(row);

  tileItemRows
    .filter((tileRow) => tileRow.children.length === 5) // Ensure it's a tile-item row
    .forEach((tileRow) => {
      const [backgroundImageCell, flagLabelCell, titleCell, tileLinkCell, readMoreLabelCell] = [...tileRow.children];

      const col = document.createElement('div');
      col.classList.add('col-md-6');
      row.append(col);

      const tileBlockLink = document.createElement('a');
      tileBlockLink.classList.add('tile-block-link');
      const tileLink = tileLinkCell.querySelector('a');
      if (tileLink) {
        tileBlockLink.href = tileLink.href;
      }
      moveInstrumentation(tileRow, tileBlockLink);
      col.append(tileBlockLink);

      const tileDiv = document.createElement('div');
      tileDiv.classList.add('tile');
      tileBlockLink.append(tileDiv);

      const tileImageDiv = document.createElement('div');
      tileImageDiv.classList.add('tile-image', 'show-overlay');
      const picture = backgroundImageCell.querySelector('picture');
      if (picture) {
        tileImageDiv.append(createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ width: '750' }]));
      }
      tileDiv.append(tileImageDiv);

      const tileOverlay = document.createElement('div');
      tileOverlay.classList.add('tile-overlay');
      tileImageDiv.append(tileOverlay);

      const flag = document.createElement('div');
      // Original HTML shows dynamic classes like 'bg-secondary-d8-spearmint'
      // The generated JS only adds 'flag'. We should add 'flag' and any other static classes.
      // Dynamic classes are not handled by the block JS.
      flag.classList.add('flag');
      const flagText = document.createElement('div');
      flagText.classList.add('text');
      flagText.textContent = flagLabelCell.textContent.trim();
      flag.append(flagText);
      tileDiv.append(flag);

      const tileCaption = document.createElement('h4');
      tileCaption.classList.add('tile-caption');
      tileCaption.textContent = titleCell.textContent.trim();
      tileDiv.append(tileCaption);

      const readMore = document.createElement('div');
      readMore.classList.add('read-more');
      readMore.textContent = readMoreLabelCell.textContent.trim();
      tileDiv.append(readMore);
    });

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  container.append(ctaDiv);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('btn', 'transparent', 'border-white');
  const originalCtaLink = ctaLinkRow.querySelector('a');
  if (originalCtaLink) {
    ctaLink.href = originalCtaLink.href;
  }
  ctaLink.textContent = ctaLabelRow.textContent.trim(); // CTA Label comes from ctaLabelRow
  moveInstrumentation(ctaLinkRow, ctaLink); // Instrumentation for the link row
  moveInstrumentation(ctaLabelRow, ctaLink); // Instrumentation for the label row
  ctaDiv.append(ctaLink);

  block.replaceChildren(root);
}
