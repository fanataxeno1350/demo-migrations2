import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadScript, loadCSS } from '../../scripts/aem.js'; // Added loadCSS

export default async function decorate(block) {
  const externalEmbedsRows = [...block.children];

  const section = document.createElement('section');
  section.classList.add('video-cmp'); // Removed 'video-player' as it's the block name

  const container = document.createElement('div');
  container.classList.add('container');

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container', 'mx-auto', 'w-100');

  externalEmbedsRows.forEach((row) => {
    const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];

    const embedUrl = embedUrlCell?.textContent.trim();
    const embedKind = embedKindCell?.textContent.trim();
    const embedConfig = embedConfigCell?.textContent.trim();

    const embedWrapper = document.createElement('div');
    embedWrapper.classList.add('position-relative', 'youtube-video'); // Use original classes

    moveInstrumentation(row, embedWrapper);

    switch (embedKind) {
      case 'youtube-embed':
      case 'vimeo-embed':
        {
          const iframe = document.createElement('iframe');
          iframe.src = embedUrl;
          iframe.width = '100%';
          iframe.height = '100%';
          iframe.allowFullscreen = true;
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;';
          iframe.referrerPolicy = 'strict-origin-when-cross-origin';
          embedWrapper.append(iframe);
        }
        break;
      case 'elfsight-widget':
        {
          const config = JSON.parse(embedConfig || '{}');
          embedWrapper.classList.add(`elfsight-app-${config.app_id}`);
          loadScript('https://static.elfsight.com/platform/platform.js');
        }
        break;
      case 'walls-io':
        {
          const wallScript = document.createElement('script');
          wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
          wallScript.dataset.wallurl = embedUrl;
          wallScript.dataset.width = '100%';
          wallScript.dataset.autoheight = '1';
          wallScript.async = true;
          embedWrapper.append(wallScript);
        }
        break;
      case 'twitter-embed':
      case 'instagram-embed':
      case 'tiktok-embed':
        {
          const platforms = {
            'twitter-embed': 'https://platform.twitter.com/widgets.js',
            'instagram-embed': 'https://www.instagram.com/embed.js',
            'tiktok-embed': 'https://www.tiktok.com/embed.js',
          };
          loadScript(platforms[embedKind]);
          const link = document.createElement('a');
          link.href = embedUrl;
          link.textContent = `View post on ${embedKind.split('-')[0].charAt(0).toUpperCase()}${embedKind.split('-')[0].slice(1)}`;
          embedWrapper.append(link);
        }
        break;
      default:
        // Fallback for unknown embed kinds, or if no kind is specified
        if (embedUrl) {
          const defaultIframe = document.createElement('iframe');
          defaultIframe.src = embedUrl;
          defaultIframe.width = '100%';
          defaultIframe.height = '100%';
          defaultIframe.allowFullscreen = true;
          defaultIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;';
          defaultIframe.referrerPolicy = 'strict-origin-when-cross-origin';
          embedWrapper.append(defaultIframe);
        } else {
          // If no URL and no specific kind, append the raw content for debugging or as a placeholder
          embedWrapper.textContent = `Embed content for kind "${embedKind}" not rendered. URL: ${embedUrl}`;
        }
        break;
    }
    videoContainer.append(embedWrapper);
  });

  container.append(videoContainer);
  section.append(container);

  // Add block-level classes from original HTML
  block.classList.add('video', 'aashirvaad-video-teaser');
  block.replaceChildren(section);
}
