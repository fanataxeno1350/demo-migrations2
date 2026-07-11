import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    headlineRow,
    descriptionRow,
    ctaLinkRow, // Reordered to match BlockJson
    ctaLabelRow, // Reordered to match BlockJson
    ...itemRows
  ] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('cmp-adda--container');
  // externalEmbedsContainerRow is a container field in BlockJson, not a direct row.
  // Instrumentation is moved from individual itemRows.
  // No moveInstrumentation(externalEmbedsContainerRow, container) needed.

  const wrap = document.createElement('div');
  wrap.classList.add('cmp-adda__wrap');
  container.append(wrap);

  // Background Images
  const wrapImg = document.createElement('div');
  wrapImg.classList.add('cmp-add__wrap-img');
  wrap.append(wrapImg);

  const pictureDesktop = backgroundDesktopRow?.querySelector('picture');
  const pictureMobile = backgroundMobileRow?.querySelector('picture');

  if (pictureDesktop || pictureMobile) {
    const picture = document.createElement('picture');
    if (pictureMobile) {
      const mobileImg = pictureMobile.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width:767px)';
        sourceMobile.srcset = mobileImg.src;
        picture.append(sourceMobile);
        moveInstrumentation(backgroundMobileRow, sourceMobile);
      }
    }

    if (pictureDesktop) {
      const desktopImg = pictureDesktop.querySelector('img');
      if (desktopImg) {
        // createOptimizedPicture returns a <picture> element, append it directly
        const optimizedPicture = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '5120' }]);
        picture.append(...optimizedPicture.children); // Append children of the optimized picture
        moveInstrumentation(backgroundDesktopRow, optimizedPicture.querySelector('img')); // Instrumentation on the img
      }
    }
    wrapImg.append(picture);
  }

  const wrapInner = document.createElement('div');
  wrapInner.classList.add('cmp-adda__wrap-inner');
  wrap.append(wrapInner);

  // Content
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-adda__content');
  wrapInner.append(contentDiv);

  if (headlineRow) {
    const headline = document.createElement('h2');
    moveInstrumentation(headlineRow, headline);
    headline.textContent = headlineRow.textContent.trim();
    contentDiv.append(headline);
  }

  if (descriptionRow) {
    const description = document.createElement('p');
    moveInstrumentation(descriptionRow, description);
    description.textContent = descriptionRow.textContent.trim();
    contentDiv.append(description);
  }

  // External Embeds
  itemRows
    .filter((row) => row.children.length === 3)
    .forEach((row) => {
      const [embedUrlCell, embedKindCell, embedConfigCell] = [...row.children];

      const embedWrapper = document.createElement('div');
      embedWrapper.classList.add('cmp-adda__yt-iframe', 'youtube-url-wrapper');
      moveInstrumentation(row, embedWrapper);
      wrapInner.append(embedWrapper);

      const kind = embedKindCell?.textContent.trim();
      const url = embedUrlCell?.textContent.trim();

      if (kind === 'youtube-embed' && url) {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('title', 'YouTube video player');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
        iframe.classList.add('cmp-analytics-video');
        iframe.src = url;
        embedWrapper.append(iframe);
      } else if (kind === 'elfsight-widget' && url && embedConfigCell) {
        const config = JSON.parse(embedConfigCell.textContent.trim());
        embedWrapper.classList.add(`elfsight-app-${config.app_id}`);
        loadScript('https://static.elfsight.com/platform/platform.js');
      } else if (kind === 'walls-io' && url) {
        const wallScript = document.createElement('script');
        wallScript.src = 'https://walls.io/js/wallsio-widget-1.2.js';
        wallScript.dataset.wallurl = url;
        wallScript.dataset.width = '100%';
        wallScript.dataset.autoheight = '1';
        wallScript.async = true;
        embedWrapper.append(wallScript);
      } else if (['twitter-embed', 'instagram-embed', 'tiktok-embed'].includes(kind) && url) {
        const platforms = {
          'twitter-embed': 'https://platform.twitter.com/widgets.js',
          'instagram-embed': 'https://www.instagram.com/embed.js',
          'tiktok-embed': 'https://www.tiktok.com/embed.js',
        };
        loadScript(platforms[kind]);
        const link = document.createElement('a');
        link.href = url;
        link.textContent = `View post on ${kind.split('-')[0].charAt(0).toUpperCase() + kind.split('-')[0].slice(1)}`;
        embedWrapper.append(link);
      }
    });

  // CTA Button
  const ctaLink = ctaLinkRow?.querySelector('a');
  const ctaLabel = ctaLabelRow?.textContent.trim();

  if (ctaLink && ctaLabel) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('exploremore', 'button', 'cmp-button--secondary');
    moveInstrumentation(ctaLinkRow, buttonWrapper);

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-button');
    anchor.href = ctaLink.href;
    // The span is already created, so replaceChildren is correct, but textContent should be ctaLabel
    const span = document.createElement('span');
    span.classList.add('cmp-button__text');
    span.textContent = ctaLabel; // Use ctaLabel for the text
    anchor.replaceChildren(span);

    buttonWrapper.append(anchor);
    wrapInner.append(buttonWrapper);
  }

  block.replaceChildren(container);
}
