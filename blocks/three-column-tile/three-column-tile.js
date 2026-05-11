import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Corrected destructuring to match the BlockJson model order
  // The "tiles" field is a container, its item rows are handled in the forEach loop.
  const [
    headlineRow,
    ctaLabelRow,
    ctaLinkRow,
    ...tileItemRows // All remaining rows are tile items
  ] = children;

  const section = document.createElement('section');
  section.classList.add('component-three-column-tile', 'pad-top-lg');
  moveInstrumentation(block, section);

  const containerXl = document.createElement('div');
  containerXl.classList.add('container-xl');
  section.append(containerXl);

  const container = document.createElement('div');
  container.classList.add('container');
  containerXl.append(container);

  const tileContainer = document.createElement('div');
  tileContainer.classList.add('tile-container');
  container.append(tileContainer);

  const headline = document.createElement('h3');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  tileContainer.append(headline);

  const separator = document.createElement('div');
  separator.classList.add('separator');
  tileContainer.append(separator);

  const innerTileContainer = document.createElement('div');
  innerTileContainer.classList.add('tile-container');
  tileContainer.append(innerTileContainer);

  const rowTileSlider = document.createElement('div');
  rowTileSlider.classList.add('row', 'tile-slider');
  // No instrumentation for a "tilesContainerRow" as it's a conceptual container field, not a physical row.
  innerTileContainer.append(rowTileSlider);

  tileItemRows.forEach((row) => {
    const [
      backgroundImageCell,
      flagLabelCell,
      titleCell,
      readMoreLabelCell,
      tileLinkCell,
    ] = [...row.children];

    const colMd6 = document.createElement('div');
    colMd6.classList.add('col-md-6');
    moveInstrumentation(row, colMd6); // Move instrumentation from the item row

    const tileBlockLink = document.createElement('a');
    tileBlockLink.classList.add('tile-block-link');
    const tileLink = tileLinkCell?.querySelector('a');
    if (tileLink) {
      tileBlockLink.href = tileLink.href;
    }
    colMd6.append(tileBlockLink);

    const tileDiv = document.createElement('div');
    tileDiv.classList.add('tile');
    tileBlockLink.append(tileDiv);

    const tileImageDiv = document.createElement('div');
    tileImageDiv.classList.add('tile-image', 'show-overlay');
    tileDiv.append(tileImageDiv);

    const picture = backgroundImageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        tileImageDiv.append(optimizedPic);
        // Set background-image style directly from the optimized image src
        const optimizedImg = optimizedPic.querySelector('img');
        if (optimizedImg) {
          tileImageDiv.style.backgroundImage = `url("${optimizedImg.src}")`;
        }
      }
    }

    const tileOverlay = document.createElement('div');
    tileOverlay.classList.add('tile-overlay');
    tileImageDiv.append(tileOverlay);

    const flagDiv = document.createElement('div');
    // Using one of the example flag classes from ORIGINAL HTML.
    // Note: original HTML has dynamic border-color, which is not authorable via EDS.
    // If specific colors are needed, they would require a separate field in the model.
    flagDiv.classList.add('flag', 'bg-secondary-d8-spearmint');
    tileImageDiv.append(flagDiv);

    const flagText = document.createElement('div');
    flagText.classList.add('text');
    flagText.textContent = flagLabelCell?.textContent.trim() || '';
    flagDiv.append(flagText);

    const tileCaption = document.createElement('h4');
    tileCaption.classList.add('tile-caption');
    tileCaption.textContent = titleCell?.textContent.trim() || '';
    tileDiv.append(tileCaption);

    const readMoreDiv = document.createElement('div');
    readMoreDiv.classList.add('read-more');
    readMoreDiv.textContent = readMoreLabelCell?.textContent.trim() || '';
    tileDiv.append(readMoreDiv);

    rowTileSlider.append(colMd6);
  });

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  innerTileContainer.append(ctaDiv);

  const ctaButton = document.createElement('a');
  ctaButton.classList.add('btn', 'transparent', 'border-white');
  // moveInstrumentation for ctaButton should come from ctaLinkRow as it's the interactive element
  moveInstrumentation(ctaLinkRow, ctaButton);
  const ctaLink = ctaLinkRow?.querySelector('a');
  if (ctaLink) {
    ctaButton.href = ctaLink.href;
  }
  // ctaButton text content comes from ctaLabelRow
  ctaButton.textContent = ctaLabelRow?.textContent.trim() || '';
  ctaDiv.append(ctaButton);

  block.replaceChildren(section);
}
