import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const [
    headingRow,
    bodyRow,
    ...itemRows // All remaining rows are item rows
  ] = children;

  // The socialIconsContainer and wallsIoEmbedsContainer are not actual rows in the block.children.
  // They are conceptual containers for the item rows.
  // We need to find the first social icon item row and the first walls.io embed item row
  // to correctly apply moveInstrumentation to their respective conceptual containers.
  const socialIconItems = itemRows.filter((row) => row.children.length === 3 && (row.querySelector('picture') || row.querySelector('img')));
  const wallsIoEmbedItems = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture') && !row.querySelector('img'));

  const section = document.createElement('section');
  section.classList.add('component-title-body', 'html-only', 'pad-top-lg');

  const container = document.createElement('div');
  container.classList.add('container');
  container.style.backgroundColor = '#ffffff';

  const row = document.createElement('div');
  row.classList.add('row');

  const col = document.createElement('div');
  col.classList.add('col-sm-12', 'col-md-10', 'offset-md-1');

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('social-grid');

  const blockWrapper = document.createElement('div');
  blockWrapper.classList.add('block-wrapper');

  const heading = document.createElement('h3');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  blockWrapper.append(heading);

  const separator = document.createElement('div');
  separator.classList.add('separator');
  blockWrapper.append(separator);

  const bodyText = document.createElement('p');
  moveInstrumentation(bodyRow, bodyText);
  // FIX: bodyRow is a richtext field, so we should use innerHTML directly from the row, not its first child.
  bodyText.innerHTML = bodyRow.innerHTML;
  blockWrapper.append(bodyText);

  contentWrapper.append(blockWrapper);

  if (socialIconItems.length > 0) {
    const socialIconsRow = document.createElement('div');
    socialIconsRow.classList.add('row', 'd-flex', 'justify-content-left');
    // moveInstrumentation for the conceptual socialIconsContainer should be applied to the first item row
    // if the container itself doesn't exist as a distinct row.
    // If the original HTML had a wrapper div for social icons, we'd move instrumentation from that.
    // Since it doesn't, we apply it to the first social item's original row.
    moveInstrumentation(socialIconItems[0], socialIconsRow);

    socialIconItems.forEach((item) => {
      const [iconCell, linkCell, labelCell] = [...item.children];

      const iconCol = document.createElement('div');
      iconCol.classList.add('col-sm-4', 'col-md-2', 'col-lg-1', 'text-align-center');
      iconCol.style.paddingTop = '25px';

      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.rel = 'noopener';
        link.target = '_blank';
        link.setAttribute('aria-label', `${labelCell.textContent.trim()} - open in a new tab`);
      }
      moveInstrumentation(item, link); // Instrumentation for the item row moves to the link

      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '60%' }]);
          const optimizedImg = optimizedPic.querySelector('img');
          optimizedImg.align = 'center';
          optimizedImg.style.width = '60%';
          // moveInstrumentation for the img should be applied to the optimizedImg
          moveInstrumentation(img, optimizedImg);
          link.append(optimizedPic);
        }
      }

      const label = document.createElement('h6');
      label.style.lineHeight = '18px';
      label.style.marginTop = '10px';
      label.textContent = labelCell.textContent.trim();

      iconCol.append(link, label);
      socialIconsRow.append(iconCol);
    });
    contentWrapper.append(socialIconsRow);
  }

  if (wallsIoEmbedItems.length > 0) {
    // moveInstrumentation for the conceptual wallsIoEmbedsContainer should be applied to the first item row
    // if the container itself doesn't exist as a distinct row.
    moveInstrumentation(wallsIoEmbedItems[0], contentWrapper); // Apply to contentWrapper as it's the parent of embeds
    wallsIoEmbedItems.forEach(async (item) => { // Made forEach async to await loadScript
      const [embedUrlCell, embedKindCell, embedConfigCell] = [...item.children];
      const embedKind = embedKindCell.textContent.trim();
      const embedUrl = embedUrlCell.textContent.trim();
      const embedConfig = embedConfigCell.textContent.trim();

      const embedDiv = document.createElement('div');
      embedDiv.dataset.embedKind = embedKind;
      embedDiv.dataset.embedUrl = embedUrl;
      embedDiv.dataset.embedConfig = embedConfig;
      moveInstrumentation(item, embedDiv);

      switch (embedKind) {
        case 'elfsight-widget': {
          const config = JSON.parse(embedConfig);
          embedDiv.classList.add(`elfsight-app-${config.app_id}`);
          // FIX: Elfsight widget needs its CSS loaded too.
          await loadCSS('https://static.elfsight.com/platform/platform.css');
          await loadScript('https://static.elfsight.com/platform/platform.js');
          break;
        }
        case 'walls-io': {
          const wallScript = document.createElement('script');
          wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
          wallScript.dataset.wallurl = embedUrl;
          wallScript.dataset.width = '100%';
          wallScript.dataset.autoheight = '1';
          wallScript.async = true;
          embedDiv.append(wallScript);
          break;
        }
        case 'twitter-embed':
        case 'instagram-embed':
        case 'tiktok-embed': {
          const platforms = {
            'twitter-embed': 'https://platform.twitter.com/widgets.js',
            'instagram-embed': 'https://www.instagram.com/embed.js',
            'tiktok-embed': 'https://www.tiktok.com/embed.js',
          };
          await loadScript(platforms[embedKind]);
          const link = document.createElement('a');
          link.href = embedUrl;
          link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
          embedDiv.append(link);
          break;
        }
        default:
          break;
      }
      contentWrapper.append(embedDiv);
    });
  }

  col.append(contentWrapper);
  row.append(col);
  container.append(row);
  section.append(container);

  block.replaceChildren(section);
}
