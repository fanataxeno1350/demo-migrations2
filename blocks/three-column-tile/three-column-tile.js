import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // The BlockJson model defines: headline, tiles (container), ctaLink, ctaLabel
  // The 'tiles' field is a container, so its item rows appear *after* the root fields.
  // The first three children are the root fields: headline, ctaLink, ctaLabel.
  // All subsequent children are 'tile-item' rows.
  const [
    headlineRow,
    ctaLinkRow,
    ctaLabelRow,
    ...tileItemRows // All remaining rows are tile items
  ] = children;

  const section = document.createElement('section');
  section.classList.add('component-three-column-tile', 'pad-top-lg');

  const containerXl = document.createElement('div');
  containerXl.classList.add('container-xl');
  section.append(containerXl);

  const container = document.createElement('div');
  container.classList.add('container');
  containerXl.append(container);

  const tileContainer = document.createElement('div');
  tileContainer.classList.add('tile-container');
  container.append(tileContainer);

  // Headline
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

  const row = document.createElement('div');
  row.classList.add('row', 'tile-slider');
  innerTileContainer.append(row);

  // Tiles
  // No specific instrumentation for a 'tilesContainerRow' as it's a logical container,
  // not a physical row in the block.children array. Instrumentation is moved from individual tileItemRows.

  tileItemRows.forEach((tileItemRow) => {
    const [
      backgroundImageCell,
      flagLabelCell,
      titleCell,
      tileLinkCell,
      readMoreLabelCell,
    ] = [...tileItemRow.children];

    const colMd6 = document.createElement('div');
    colMd6.classList.add('col-md-6');
    row.append(colMd6);

    const tileBlockLink = document.createElement('a');
    tileBlockLink.classList.add('tile-block-link');
    const foundTileLink = tileLinkCell?.querySelector('a');
    if (foundTileLink) {
      tileBlockLink.href = foundTileLink.href;
    }
    moveInstrumentation(tileItemRow, tileBlockLink); // Instrumentation for the whole tile item row
    colMd6.append(tileBlockLink);

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
        tileImage.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
      }
    }

    const tileOverlay = document.createElement('div');
    tileOverlay.classList.add('tile-overlay');
    tileImage.append(tileOverlay);

    const flag = document.createElement('div');
    flag.classList.add('flag', 'bg-secondary-d8-spearmint'); // Using one of the flag classes from original HTML
    tileImage.append(flag);

    const flagText = document.createElement('div');
    flagText.classList.add('text');
    flagText.textContent = flagLabelCell?.textContent.trim() || '';
    flag.append(flagText);

    const tileCaption = document.createElement('h4');
    tileCaption.classList.add('tile-caption');
    tileCaption.textContent = titleCell?.textContent.trim() || '';
    tile.append(tileCaption);

    const readMore = document.createElement('div');
    readMore.classList.add('read-more');
    readMore.textContent = readMoreLabelCell?.textContent.trim() || '';
    tile.append(readMore);
  });

  // CTA
  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('cta');
  innerTileContainer.append(ctaDiv);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('btn', 'transparent', 'border-white');
  const foundCtaLink = ctaLinkRow?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
  }
  // The CTA label is in ctaLabelRow, not ctaLinkRow's textContent (which would be a JCR path)
  ctaLink.textContent = ctaLabelRow?.textContent.trim() || '';
  moveInstrumentation(ctaLinkRow, ctaLink); // Instrumentation for the link
  moveInstrumentation(ctaLabelRow, ctaLink); // Instrumentation for the label
  ctaDiv.append(ctaLink);

  block.replaceChildren(section);
}
