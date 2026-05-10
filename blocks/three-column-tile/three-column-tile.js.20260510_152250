import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Corrected destructuring to match the BlockJson model:
  // block.children[0]: headingRow
  // block.children[1]: tilesContainerRow (container field, its instrumentation needs to be moved)
  // block.children[2]: ctaLabelRow
  // block.children[3]: ctaLinkRow
  // ...tileItemRows (remaining rows are tile-item sub-components)
  const [headingRow, tilesContainerRow, ctaLabelRow, ctaLinkRow, ...tileItemRows] = children;

  const section = document.createElement('section');
  section.classList.add('component-three-column-tile', 'pad-top-lg');

  const containerXl = document.createElement('div');
  containerXl.classList.add('container-xl');
  section.append(containerXl);

  const container = document.createElement('div');
  container.classList.add('container');
  containerXl.append(container);

  const tileContainerWrapper = document.createElement('div');
  tileContainerWrapper.classList.add('tile-container');
  container.append(tileContainerWrapper);

  // Section Heading
  if (headingRow) {
    const heading = document.createElement('h3');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.textContent.trim();
    tileContainerWrapper.append(heading);
  }

  const separator = document.createElement('div');
  separator.classList.add('separator');
  tileContainerWrapper.append(separator);

  const innerTileContainer = document.createElement('div');
  innerTileContainer.classList.add('tile-container');
  tileContainerWrapper.append(innerTileContainer);

  const row = document.createElement('div');
  row.classList.add('row', 'tile-slider');
  innerTileContainer.append(row);

  // Tiles
  tileItemRows.forEach((tileItemRow) => {
    const [linkCell, backgroundImageCell, flagLabelCell, titleCell, readMoreLabelCell] = [...tileItemRow.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6');
    row.append(col);

    const tileBlockLink = document.createElement('a');
    tileBlockLink.classList.add('tile-block-link');
    moveInstrumentation(tileItemRow, tileBlockLink);
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      tileBlockLink.href = foundLink.href;
    }
    col.append(tileBlockLink);

    const tile = document.createElement('div');
    tile.classList.add('tile');
    tileBlockLink.append(tile);

    const tileImage = document.createElement('div');
    tileImage.classList.add('tile-image', 'show-overlay');
    tile.append(tileImage);

    const picture = backgroundImageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        tileImage.append(optimizedPic);
      }
    }

    const tileOverlay = document.createElement('div');
    tileOverlay.classList.add('tile-overlay');
    tileImage.append(tileOverlay);

    if (flagLabelCell && flagLabelCell.textContent.trim()) {
      const flag = document.createElement('div');
      flag.classList.add('flag');
      // Original HTML has bg-secondary-d8-spearmint and bg-secondary-d4-cornflower
      // We cannot determine which color to apply from the block data, so we omit specific color classes.
      // If color is authorable, it should be a separate field.
      const flagText = document.createElement('div');
      flagText.classList.add('text');
      flagText.textContent = flagLabelCell.textContent.trim();
      flag.append(flagText);
      tileImage.append(flag);
    }

    if (titleCell && titleCell.textContent.trim()) {
      const tileCaption = document.createElement('h4');
      tileCaption.classList.add('tile-caption');
      tileCaption.textContent = titleCell.textContent.trim();
      tile.append(tileCaption);
    }

    if (readMoreLabelCell && readMoreLabelCell.textContent.trim()) {
      const readMore = document.createElement('div');
      readMore.classList.add('read-more');
      readMore.textContent = readMoreLabelCell.textContent.trim();
      tile.append(readMore);
    }
  });

  // CTA Button
  const cta = document.createElement('div');
  cta.classList.add('cta');
  innerTileContainer.append(cta);

  if (ctaLinkRow && ctaLabelRow) {
    const ctaAnchor = document.createElement('a');
    ctaAnchor.classList.add('btn', 'transparent', 'border-white');
    moveInstrumentation(ctaLinkRow, ctaAnchor); // Move instrumentation from ctaLinkRow
    const foundCtaLink = ctaLinkRow.querySelector('a');
    if (foundCtaLink) {
      ctaAnchor.href = foundCtaLink.href;
    }
    ctaAnchor.textContent = ctaLabelRow.textContent.trim();
    cta.append(ctaAnchor);
  }

  // Move instrumentation for the tiles container row (block.children[1])
  // This row represents the "Tiles" container field in the model.
  // Its instrumentation needs to be moved even if it doesn't directly become a visible element.
  moveInstrumentation(tilesContainerRow, section); // Moving to the root section for UE tracking

  block.replaceChildren(section);
}
