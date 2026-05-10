import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const [
    titleRow,
    descriptionRow,
    ...itemRows // socialLinksContainerRow and wallsEmbedContainerRow are container fields, not actual rows
  ] = children;

  const socialGridWrapper = document.createElement('div');
  // socialGridWrapper.classList.add('block-wrapper'); // Removed: block-wrapper is the block's own class, already on the outer div
  moveInstrumentation(titleRow, socialGridWrapper);

  const title = document.createElement('h3');
  title.textContent = titleRow.textContent.trim();
  socialGridWrapper.append(title);

  const separator = document.createElement('div');
  separator.classList.add('separator');
  socialGridWrapper.append(separator);

  const description = document.createElement('div'); // Changed to div to avoid <p> inside <p>
  description.innerHTML = descriptionRow.children[0]?.innerHTML || ''; // Access content from the cell, not the row
  socialGridWrapper.append(description);

  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('row', 'd-flex', 'justify-content-left');
  // moveInstrumentation(socialLinksContainerRow, socialLinksWrapper); // socialLinksContainerRow is not a real row

  const wallsEmbedWrapper = document.createElement('div');
  // moveInstrumentation(wallsEmbedContainerRow, wallsEmbedWrapper); // wallsEmbedContainerRow is not a real row

  // Filter items based on content presence, assuming social links have pictures/images
  const socialLinkItems = itemRows.filter((row) => row.children.length === 3 && (row.querySelector('picture') || row.querySelector('img')));
  const wallsEmbedItems = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture') && !row.querySelector('img'));

  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-sm-4', 'col-md-2', 'col-lg-1', 'text-align-center');
    col.style.paddingTop = '25px';

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.rel = 'noopener';
      link.target = '_blank';
      link.setAttribute('aria-label', `${labelCell.textContent.trim()} - open in a new tab`);
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '60%' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
    }

    const label = document.createElement('h6');
    label.style.lineHeight = '18px';
    label.style.marginTop = '10px';
    label.textContent = labelCell.textContent.trim();

    moveInstrumentation(row, col);
    col.append(link, label);
    socialLinksWrapper.append(col);
  });

  wallsEmbedItems.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];

    const kind = embedKindCell.textContent.trim();
    const el = document.createElement('div');
    el.dataset.embedKind = kind;

    switch (kind) {
      case 'elfsight-widget': {
        const config = JSON.parse(embedConfigCell.textContent.trim());
        el.classList.add(`elfsight-app-${config.app_id}`);
        loadScript('https://static.elfsight.com/platform/platform.js');
        break;
      }
      case 'walls-io': {
        const wallScript = document.createElement('script');
        wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
        wallScript.dataset.wallurl = embedUrlCell.textContent.trim();
        wallScript.dataset.width = '100%';
        wallScript.dataset.autoheight = '1';
        wallScript.async = true;
        el.append(wallScript);
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
        loadScript(platforms[kind]);
        const link = document.createElement('a');
        link.href = embedUrlCell.textContent.trim();
        link.textContent = `View post on ${kind.split('-')[0].charAt(0).toUpperCase()}${kind.split('-')[0].slice(1)}`;
        el.append(link);
        break;
      }
      default:
        // Handle other embed kinds or log a warning
        break;
    }
    moveInstrumentation(row, el);
    wallsEmbedWrapper.append(el);
  });

  block.replaceChildren(socialGridWrapper, socialLinksWrapper, wallsEmbedWrapper);
}
