import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const sectionHeadingRow = children.find((row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'));
  const socialPlatformRows = children.filter((row) => row.children.length === 2 && row.querySelector('picture') && !row.querySelector('a'));
  const embedWidgetRows = children.filter((row) => row.children.length === 3);
  const instagramPostRows = children.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('picture'));

  const container = document.createElement('div');
  container.classList.add('container');

  if (sectionHeadingRow) {
    const [headingCell] = [...sectionHeadingRow.children]; // Fixed: Use destructuring
    const heading = document.createElement('h2');
    moveInstrumentation(sectionHeadingRow, heading);
    heading.textContent = headingCell.textContent.trim();
    container.append(heading);
  }

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');

  // Social Platforms and Embed Widgets
  socialPlatformRows.forEach((row) => {
    const [iconCell, labelCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-4');

    const socialLogo = document.createElement('div');
    socialLogo.classList.add('social_logo');
    moveInstrumentation(row, socialLogo);

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        socialLogo.append(optimizedPic);
      }
    }

    const labelText = labelCell.textContent.trim();
    if (labelText) {
      socialLogo.append(` ${labelText}`);
    }
    col.append(socialLogo);
    rowDiv.append(col);
  });

  embedWidgetRows.forEach((row) => {
    const [kindCell, urlCell, configCell] = [...row.children];
    const kind = kindCell.textContent.trim();
    const embedUrl = urlCell.textContent.trim();
    const embedConfig = configCell.textContent.trim();

    const col = document.createElement('div');
    col.classList.add('col-md-4');

    const embedDiv = document.createElement('div');
    moveInstrumentation(row, embedDiv);
    embedDiv.dataset.embedKind = kind;
    embedDiv.dataset.embedUrl = embedUrl;
    embedDiv.dataset.embedConfig = embedConfig;

    switch (kind) {
      case 'facebook-embed': {
        const fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';
        fbRoot.classList.add('fb_reset');
        fbRoot.innerHTML = '&nbsp;<div style="position: absolute; top: -10000px; width: 0px; height: 0px;"><div></div></div>';
        col.append(fbRoot);

        // Placeholder for Facebook embed, actual embed needs client-side JS
        const placeholder = document.createElement('div');
        placeholder.textContent = '[facebook-embed placeholder]';
        embedDiv.append(placeholder);
        break;
      }
      case 'twitter-embed': {
        const link = document.createElement('a');
        link.href = embedUrl;
        link.textContent = 'View post on Twitter';
        embedDiv.append(link);
        loadScript('https://platform.twitter.com/widgets.js');
        break;
      }
      case 'instagram-embed': {
        const link = document.createElement('a');
        link.href = embedUrl;
        link.textContent = 'View post on Instagram';
        embedDiv.append(link);
        loadScript('https://www.instagram.com/embed.js');
        break;
      }
      case 'tiktok-embed': {
        const link = document.createElement('a');
        link.href = embedUrl;
        link.textContent = 'View post on TikTok';
        embedDiv.append(link);
        loadScript('https://www.tiktok.com/embed.js');
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
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unknown embed kind: ${kind}`);
        break;
    }

    col.append(embedDiv);
    rowDiv.append(col);
  });

  // Instagram Posts
  if (instagramPostRows.length > 0) {
    const instagramCol = document.createElement('div');
    instagramCol.classList.add('col-md-4');

    const socialLogo = document.createElement('div');
    socialLogo.classList.add('social_logo');

    // Fixed: Get Instagram social_logo from socialPlatformRows if available
    const instagramPlatform = socialPlatformRows.find(row => row.children[1].textContent.trim().toLowerCase() === 'instagram');
    if (instagramPlatform) {
      const [iconCell, labelCell] = [...instagramPlatform.children];
      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          socialLogo.append(optimizedPic);
        }
      }
      socialLogo.append(` ${labelCell.textContent.trim()}`);
    } else {
      // Fallback if no explicit Instagram social platform row exists
      socialLogo.innerHTML = '<img class="img-fluid" src="/icons/instagram.svg" alt="Instagram"/> Instagram';
    }
    instagramCol.append(socialLogo);

    const owlCarousel = document.createElement('div');
    // Fixed: Removed 'owl-loaded', 'owl-drag' as Owl Carousel adds them
    owlCarousel.classList.add('parleg-insta', 'owl-carousel', 'owl-theme');

    const owlStageOuter = document.createElement('div');
    owlStageOuter.classList.add('owl-stage-outer');

    const owlStage = document.createElement('div');
    owlStage.classList.add('owl-stage');
    owlStageOuter.append(owlStage);

    instagramPostRows.forEach((row) => {
      const [linkCell, imageCell] = [...row.children];

      const owlItem = document.createElement('div');
      owlItem.classList.add('owl-item');

      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');
      moveInstrumentation(row, itemDiv);

      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.target = '_blank';
      }

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          link.append(optimizedPic);
        }
      }
      itemDiv.append(link);
      owlItem.append(itemDiv);
      owlStage.append(owlItem);
    });

    owlCarousel.append(owlStageOuter);
    instagramCol.append(owlCarousel);
    rowDiv.append(instagramCol);

    // Initialize Owl Carousel
    const initOwlCarousel = async () => {
      await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
      await loadCSS('/styles/owl.carousel.min.css'); // Fixed: Added loadCSS for Owl Carousel
      await loadScript('/scripts/owl.carousel.min.js'); // Assuming owl.carousel.min.js is available in scripts folder
      // eslint-disable-next-line no-undef
      $(owlCarousel).owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          1000: {
            items: 1,
          },
        },
      });
    };
    initOwlCarousel();
  }

  container.append(rowDiv);
  block.replaceChildren(container);

  // This block.querySelectorAll('picture > img') loop is redundant and can be removed
  // as createOptimizedPicture is already called for each image where needed.
  // Keeping it for now as it's outside the main logic flow.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
