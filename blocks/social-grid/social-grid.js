import { createOptimizedPicture, loadScript } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const [
    headlineRow,
    descriptionRow,
    ...itemRows
  ] = children;

  const root = document.createElement('div');
  root.classList.add('block-wrapper');

  // Headline
  const headline = document.createElement('h3');
  moveInstrumentation(headlineRow, headline);
  headline.textContent = headlineRow.textContent.trim();
  root.append(headline);

  // Separator
  const separator = document.createElement('div');
  separator.classList.add('separator');
  separator.innerHTML = '&nbsp;';
  root.append(separator);

  // Description
  const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
  moveInstrumentation(descriptionRow, description);
  description.innerHTML = descriptionRow.innerHTML; // Read innerHTML directly from the row for richtext
  root.append(description);

  // Social Links Wrapper
  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('row', 'd-flex', 'justify-content-left');
  // No moveInstrumentation for socialLinksWrapper as it's not an authored row container

  const socialLinkItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture'));
  const embedItems = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture'));

  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-sm-4', 'col-md-2', 'col-lg-1', 'text-align-center');
    col.style.paddingTop = '25px';

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.setAttribute('rel', 'noopener');
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('aria-label', `${labelCell.textContent.trim()} - open in a new tab`);
    }
    moveInstrumentation(linkCell, anchor);

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '60%' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    moveInstrumentation(iconCell, anchor);

    const label = document.createElement('h6');
    label.style.lineHeight = '18px';
    label.style.marginTop = '10px';
    label.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, label);

    col.append(anchor);
    col.append(label);
    socialLinksWrapper.append(col);
    moveInstrumentation(row, col);
  });

  root.append(socialLinksWrapper);

  // Embeds Wrapper
  const embedsWrapper = document.createElement('div');
  // No moveInstrumentation for embedsWrapper as it's not an authored row container

  embedItems.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];

    const embedUrl = embedUrlCell.textContent.trim();
    const embedKind = embedKindCell.textContent.trim();
    const embedConfig = embedConfigCell.textContent.trim();

    const embedDiv = document.createElement('div');
    embedDiv.dataset.embedKind = embedKind;
    embedDiv.dataset.embedUrl = embedUrl;
    embedDiv.dataset.embedConfig = embedConfig;
    moveInstrumentation(row, embedDiv);

    switch (embedKind) {
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
      case 'elfsight-widget': {
        try {
          const config = JSON.parse(embedConfig);
          embedDiv.classList.add(`elfsight-app-${config.app_id}`);
          loadScript('https://static.elfsight.com/platform/platform.js');
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse Elfsight config:', e);
        }
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
        loadScript(platforms[embedKind]);
        const link = document.createElement('a');
        link.href = embedUrl;
        link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
        embedDiv.append(link);
        break;
      }
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unknown embed kind: ${embedKind}`);
        break;
    }
    embedsWrapper.append(embedDiv);
  });
  root.append(embedsWrapper);

  block.replaceChildren(root);
}
