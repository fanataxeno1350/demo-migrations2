import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headlineRow, ...embedRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('tv-sec', 'd-none'); // Apply classes from ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const row = document.createElement('div');
  row.classList.add('row');
  container.append(row);

  const col = document.createElement('div');
  col.classList.add('col-md-12');
  row.append(col);

  // Headline
  if (headlineRow) {
    const headline = document.createElement('h2');
    moveInstrumentation(headlineRow, headline);
    // headlineRow is a ROW, its innerHTML includes the cell wrapper <div>.
    // The model says 'headline' is richtext, so we read the cell's innerHTML.
    // The cell is the first child of the headlineRow.
    headline.innerHTML = headlineRow.children[0]?.innerHTML || '';
    col.append(headline);
  }

  // Embeds
  embedRows.forEach((embedRow) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...embedRow.children];

    const embedUrl = embedUrlCell?.textContent.trim();
    const embedKind = embedKindCell?.textContent.trim();
    const embedConfig = embedConfigCell?.textContent.trim();

    if (embedUrl && embedKind) {
      let embedElement;
      switch (embedKind) {
        case 'youtube-embed':
        case 'vimeo-embed':
          embedElement = document.createElement('iframe');
          embedElement.setAttribute('allowfullscreen', '');
          embedElement.setAttribute('frameborder', '0');
          embedElement.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          embedElement.src = embedUrl;
          embedElement.width = '100%';
          embedElement.height = '500'; // Hardcoded height from original HTML
          break;
        case 'elfsight-widget':
          embedElement = document.createElement('div');
          try {
            const config = JSON.parse(embedConfig);
            embedElement.classList.add(`elfsight-app-${config.app_id}`);
            // Elfsight widget requires its CSS
            loadCSS('https://static.elfsight.com/platform/platform.css');
            loadScript('https://static.elfsight.com/platform/platform.js');
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Invalid Elfsight config JSON:', e);
          }
          break;
        case 'walls-io':
          embedElement = document.createElement('div');
          const wallScript = document.createElement('script');
          wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
          wallScript.dataset.wallurl = embedUrl;
          wallScript.dataset.width = '100%';
          wallScript.dataset.autoheight = '1';
          wallScript.async = true;
          embedElement.append(wallScript);
          break;
        case 'twitter-embed':
        case 'instagram-embed':
        case 'tiktok-embed':
          const platforms = {
            'twitter-embed': 'https://platform.twitter.com/widgets.js',
            'instagram-embed': 'https://www.instagram.com/embed.js',
            'tiktok-embed': 'https://www.tiktok.com/embed.js',
          };
          loadScript(platforms[embedKind]);
          embedElement = document.createElement('blockquote');
          // These classes are added by the respective embed scripts, not manually.
          // embedElement.classList.add('twitter-tweet', 'instagram-media', 'tiktok-embed');
          const link = document.createElement('a');
          link.href = embedUrl;
          link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
          embedElement.append(link);
          break;
        default:
          // Fallback for unknown embed kinds, or just append the URL as a link
          embedElement = document.createElement('a');
          embedElement.href = embedUrl;
          embedElement.textContent = embedUrl;
          break;
      }
      if (embedElement) {
        moveInstrumentation(embedRow, embedElement);
        col.append(embedElement);
      }
    }
  });

  block.replaceChildren(section);

  // Image optimization (if any pictures were added, though not explicitly in this block's model)
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
